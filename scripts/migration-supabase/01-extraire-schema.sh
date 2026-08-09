#!/bin/bash
# ============================================================================
# Étape 1 de la migration Gramme → projet Supabase dédié : EXTRACTION.
#
# Lecture seule. Ce script n'écrit rien dans la base, ne crée rien, ne
# supprime rien. Il sort le schéma des 7 tables Gramme, plus l'inventaire de
# tout ce que `pg_dump -t` laisse derrière lui.
#
#   bash scripts/migration-supabase/01-extraire-schema.sh
#
# Il ne rapatrie AUCUNE donnée de `devis_requests` : le schéma seulement. La
# copie des données se fait à l'étape 3, juste avant la bascule, pour qu'elle
# soit fraîche.
#
# ---------------------------------------------------------------------------
# Préalable — la chaîne de connexion
#
# Le script la demande au lancement ; rien à préparer. Elle se récupère dans le
# tableau de bord Supabase → Project Settings → Database → Connection string →
# onglet **URI**, en **port 5432** (« Session pooler » ou « Direct
# connection »). Pas l'onglet psql, qui préfixe la ligne par la commande. Pas
# le port 6543 : le pooler en mode transaction ne supporte pas les requêtes que
# pg_dump émet.
#
# Le collage ne s'affiche pas et ne passe pas par l'historique du shell. Pour
# un usage automatisé, la variable GRAMME_DB_URL court-circuite la question.
#
# ---------------------------------------------------------------------------
# Préalable — pg_dump
#
# Ni pg_dump ni psql ne sont installés sur ce Mac. Le client seul suffit,
# inutile d'installer un serveur :
#
#   brew install libpq
#
# Le script trouve tout seul le binaire posé par Homebrew.
# ============================================================================
set -uo pipefail

# --- Localisation du client Postgres ----------------------------------------
# libpq n'est pas lié dans le PATH par défaut (Homebrew le garde « keg-only »
# pour ne pas entrer en conflit avec un vrai serveur Postgres).
for prefixe in /opt/homebrew/opt/libpq /usr/local/opt/libpq /Applications/Postgres.app/Contents/Versions/latest; do
  if [ -x "$prefixe/bin/pg_dump" ]; then
    export PATH="$prefixe/bin:$PATH"
    break
  fi
done

if ! command -v pg_dump >/dev/null 2>&1; then
  echo "pg_dump introuvable. Installe le client Postgres :" >&2
  echo "  brew install libpq" >&2
  exit 1
fi

# --- La chaîne de connexion --------------------------------------------------
# Demandée ici plutôt que passée par une variable d'environnement. La première
# version reposait sur `read -rs GRAMME_DB_URL && export GRAMME_DB_URL` lancé à
# part : un collage qui ne prend pas, ou un script lancé dans un autre onglet,
# et la variable arrive vide sans que rien ne le signale. En la lisant sur le
# terminal au moment où on en a besoin, ce mode de panne disparaît.
#
# Lecture sur /dev/tty et non sur stdin : le script reste utilisable si un jour
# on lui donne quelque chose en entrée.
if [ -z "${GRAMME_DB_URL:-}" ]; then
  echo "Chaîne de connexion Supabase — Project Settings → Database →"
  echo "Connection string → onglet URI, port 5432."
  echo "Le collage ne s'affiche pas, c'est voulu. Entrée pour valider."
  printf 'URI : '
  IFS= read -rs GRAMME_DB_URL < /dev/tty
  echo
else
  # Sans ce mot, une variable héritée d'un essai précédent fait sauter la
  # question en silence : le script paraît refuser une chaîne qu'on vient de
  # taper alors qu'il en juge une autre, invisible.
  echo "GRAMME_DB_URL est déjà définie dans ce terminal : je l'utilise."
  echo "Pour saisir une autre chaîne : unset GRAMME_DB_URL, puis relancer."
fi

if [ -z "$GRAMME_DB_URL" ]; then
  echo "Rien n'a été saisi." >&2
  exit 1
fi

# --- Contrôle de la chaîne de connexion --------------------------------------
# La première version se contentait de vérifier que la variable n'était pas
# vide. Insuffisant : une chaîne sans le préfixe « postgresql:// » est traitée
# par pg_dump comme un simple NOM DE BASE, il se rabat sur la socket locale, et
# les sept fichiers de sortie se remplissent du même message d'erreur sans que
# rien ne s'arrête. On valide la forme, puis on teste la connexion pour de bon,
# avant d'écrire quoi que ce soit.
GRAMME_DB_URL="$(printf '%s' "$GRAMME_DB_URL" | tr -d '[:space:]')"

case "$GRAMME_DB_URL" in
  postgresql://*|postgres://*) ;;
  *)
    echo "La chaîne ne commence pas par postgresql:// ni postgres://." >&2
    echo "pg_dump la prendrait pour un nom de base et chercherait un serveur local." >&2
    echo "Reprends l'onglet URI du tableau de bord, pas l'onglet psql ni PSQL." >&2
    exit 1 ;;
esac

case "$GRAMME_DB_URL" in
  *'[YOUR-PASSWORD]'*|*'[votre-mot-de-passe]'*)
    echo "Le mot de passe est resté sous forme de gabarit dans la chaîne." >&2
    echo "Supabase affiche [YOUR-PASSWORD] : il faut le remplacer par le vrai." >&2
    exit 1 ;;
  *:6543/*)
    echo "Port 6543 : c'est le pooler en mode transaction, pg_dump ne sait pas" >&2
    echo "y travailler. Prends la chaîne en port 5432." >&2
    exit 1 ;;
esac

# Écho masqué : de quoi vérifier qu'on parle au bon serveur, sans jamais faire
# apparaître le mot de passe à l'écran ni dans un fichier.
sans_scheme="${GRAMME_DB_URL#*://}"
echo "Cible : ${sans_scheme%%:*}@${sans_scheme#*@}"

echo "Test de connexion…"
# Sans borne, un hôte injoignable — le cas IPv6 ci-dessous — laisse psql
# attendre plus d'une minute avant de rendre la main.
export PGCONNECT_TIMEOUT=15
if ! psql "$GRAMME_DB_URL" --quiet --no-psqlrc -c 'select 1' >/dev/null 2>"/tmp/gramme-preflight.err"; then
  echo "Connexion refusée. Message du serveur :" >&2
  sed 's/^/  /' "/tmp/gramme-preflight.err" >&2
  rm -f "/tmp/gramme-preflight.err"
  echo >&2
  echo "Pistes, dans l'ordre de fréquence :" >&2
  echo "  · mot de passe incorrect → Settings → Database → Reset database password" >&2
  echo "  · « Network is unreachable » → db.<ref>.supabase.co est en IPv6 seul ;" >&2
  echo "    prends la chaîne « Session pooler », qui est en IPv4" >&2
  echo "  · « Tenant or user not found » → l'utilisateur du pooler s'écrit" >&2
  echo "    postgres.<ref>, pas postgres" >&2
  exit 1
fi
rm -f "/tmp/gramme-preflight.err"
echo "Connexion établie."
echo

# --- Où atterrissent les fichiers -------------------------------------------
# Hors du dépôt, volontairement. L'inventaire contient les adresses e-mail des
# comptes du back-office ; ça n'a rien à faire dans un dépôt Git, même privé.
SORTIE="${GRAMME_MIGRATION_DIR:-$HOME/Documents/gramme-migration-supabase}"
mkdir -p "$SORTIE"
echo "Sortie : $SORTIE"
echo

# Les 7 tables qui déménagent. faq, navigation, config, blog_posts et
# internal_links n'y sont pas : contenu mort adossé à des hooks qui ne
# compilent plus et qu'aucune route ne monte.
TABLES=(communes pages devis_requests media gramme_media site_settings volume_estimations)

ARGS_T=()
for t in "${TABLES[@]}"; do ARGS_T+=(-t "public.$t"); done

# --- 1. Le schéma tel qu'il est, privilèges compris -------------------------
# Sert de constat : c'est ici qu'on lira les GRANT et les CREATE POLICY réels,
# ceux que la clé anon ne permettait pas de voir.
echo "1/7  Schéma actuel, avec privilèges et policies…"
pg_dump "$GRAMME_DB_URL" --schema-only "${ARGS_T[@]}" \
  > "$SORTIE/schema-actuel.sql" 2> "$SORTIE/schema-actuel.err"
echo "     $(wc -l < "$SORTIE/schema-actuel.sql" | tr -d ' ') lignes"

# --- 2. Le même schéma, nu --------------------------------------------------
# Base de départ du nouveau projet : sans propriétaire ni privilèges, puisque
# les uns et les autres seront réécrits selon le modèle admin_users/is_admin().
echo "2/7  Schéma nu (base du nouveau projet)…"
pg_dump "$GRAMME_DB_URL" --schema-only --no-owner --no-privileges "${ARGS_T[@]}" \
  > "$SORTIE/schema-nu.sql" 2>> "$SORTIE/schema-actuel.err"

# --- 3..7 Ce que pg_dump -t ne prend pas ------------------------------------
# `pg_dump -t` ne suit pas les dépendances : les fonctions de trigger, les
# types énumérés et les séquences hors-table restent au sol. Une restauration
# qui semble complète échoue alors sur la première insertion.
requete() {
  psql "$GRAMME_DB_URL" --quiet --no-psqlrc --pset pager=off -f - > "$SORTIE/$1" 2>&1
}

echo "3/7  Fonctions de trigger et fonctions appelées par les contraintes…"
requete "dependances-fonctions.txt" <<'SQL'
\echo === Fonctions portées par un trigger sur les tables Gramme ===
select distinct p.proname, pg_get_functiondef(p.oid) as definition
from pg_trigger t
join pg_class c on c.oid = t.tgrelid
join pg_namespace n on n.oid = c.relnamespace
join pg_proc p on p.oid = t.tgfoid
where n.nspname = 'public'
  and not t.tgisinternal
  and c.relname in ('communes','pages','devis_requests','media','gramme_media','site_settings','volume_estimations');

\echo === Types énumérés utilisés par une colonne de ces tables ===
select distinct tt.typname,
       (select string_agg(quote_literal(e.enumlabel), ', ' order by e.enumsortorder)
          from pg_enum e where e.enumtypid = tt.oid) as valeurs
from information_schema.columns col
join pg_type tt on tt.typname = col.udt_name
where col.table_schema = 'public'
  and col.table_name in ('communes','pages','devis_requests','media','gramme_media','site_settings','volume_estimations')
  and tt.typtype = 'e';
SQL

echo "4/7  Clés étrangères — vers et depuis les tables Gramme…"
# LE point qui peut faire dérailler la migration : si devis_requests ou pages
# référence une table étrangère au site, les tables ne sont pas séparables
# telles quelles et il faudra trancher le lien avant de déplacer quoi que ce
# soit.
requete "cles-etrangeres.txt" <<'SQL'
\echo === Contraintes FK impliquant une table Gramme, dans un sens ou dans l'autre ===
select conrelid::regclass as table_source,
       confrelid::regclass as table_cible,
       conname,
       pg_get_constraintdef(oid) as definition
from pg_constraint
where contype = 'f'
  and (   conrelid::regclass::text  = any (array['communes','pages','devis_requests','media','gramme_media','site_settings','volume_estimations'])
       or confrelid::regclass::text = any (array['communes','pages','devis_requests','media','gramme_media','site_settings','volume_estimations']))
order by 1, 2;
SQL

echo "5/7  Policies RLS et privilèges, en clair…"
requete "policies-et-privileges.txt" <<'SQL'
\echo === RLS activée ? forcée ? ===
select c.relname, c.relrowsecurity as rls_activee, c.relforcerowsecurity as rls_forcee
from pg_class c join pg_namespace n on n.oid = c.relnamespace
where n.nspname = 'public'
  and c.relname in ('communes','pages','devis_requests','media','gramme_media','site_settings','volume_estimations')
order by 1;

\echo === Policies ===
select tablename, policyname, permissive, roles, cmd, qual, with_check
from pg_policies
where schemaname = 'public'
  and tablename in ('communes','pages','devis_requests','media','gramme_media','site_settings','volume_estimations')
order by tablename, policyname;

\echo === Privilèges de anon et authenticated ===
select table_name, grantee, string_agg(privilege_type, ', ' order by privilege_type) as privileges
from information_schema.role_table_grants
where table_schema = 'public'
  and grantee in ('anon','authenticated')
  and table_name in ('communes','pages','devis_requests','media','gramme_media','site_settings','volume_estimations')
group by table_name, grantee
order by table_name, grantee;

\echo === Policies du Storage ===
select policyname, roles, cmd, qual, with_check
from pg_policies where schemaname = 'storage' order by policyname;
SQL

echo "6/7  Volumétrie : combien de lignes, combien d'octets…"
requete "volumetrie.txt" <<'SQL'
\echo === Version du serveur (pg_dump local doit être au moins aussi récent) ===
select version();

\echo === Lignes par table ===
select 'communes' as t, count(*) from public.communes
union all select 'pages', count(*) from public.pages
union all select 'devis_requests', count(*) from public.devis_requests
union all select 'media', count(*) from public.media
union all select 'gramme_media', count(*) from public.gramme_media
union all select 'site_settings', count(*) from public.site_settings
union all select 'volume_estimations', count(*) from public.volume_estimations
order by 1;

\echo === Buckets et objets ===
select b.id as bucket, b.public, count(o.id) as objets,
       pg_size_pretty(coalesce(sum((o.metadata->>'size')::bigint), 0)) as poids
from storage.buckets b left join storage.objects o on o.bucket_id = b.id
group by b.id, b.public order by 1;

\echo === Devis les plus anciens et les plus récents (dates seules, aucune donnée personnelle) ===
select min(created_at) as premier, max(created_at) as dernier from public.devis_requests;
SQL

echo "7/7  Comptes du back-office…"
requete "comptes-auth.txt" <<'SQL'
\echo === Comptes à recréer sur le nouveau projet ===
select email, created_at, last_sign_in_at, email_confirmed_at is not null as confirme
from auth.users order by created_at;

\echo === Total ===
select count(*) as comptes from auth.users;
SQL

echo
echo "Terminé. Fichiers produits dans $SORTIE :"
ls -la "$SORTIE"
echo
if [ -s "$SORTIE/schema-actuel.err" ]; then
  echo "⚠ pg_dump a écrit sur stderr — à lire avant d'aller plus loin :"
  cat "$SORTIE/schema-actuel.err"
fi
echo
echo "À me rendre en priorité : cles-etrangeres.txt (il décide si les tables"
echo "sont séparables telles quelles), puis schema-nu.sql et volumetrie.txt."
