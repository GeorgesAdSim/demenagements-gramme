-- ============================================================================
-- Champs éditoriaux des communes, et correction de page_existante
--
-- POURQUOI CETTE MIGRATION EXISTE
--
-- src/data/communes.json porte depuis peu trois champs que la table n'a jamais
-- eus : les sections rédigées, les règles d'autorisation de stationnement
-- relevées en source officielle, et les points restant à vérifier.
--
-- scripts/sync-communes.mjs régénère ce JSON depuis la table au début de chaque
-- build Netlify. Son mappeur ignorait ces trois champs : à chaque déploiement,
-- 70 communes perdaient leur rédaction et 51 leurs données d'autorisation, sans
-- qu'aucune alerte ne se déclenche. Le script a été corrigé pour se replier sur
-- le dépôt tant que les colonnes n'existent pas ; cette migration les crée pour
-- que la base redevienne la source unique.
--
-- CE QUE LA MIGRATION CORRIGE AUSSI
--
-- `page_existante` vaut encore une URL de page satellite pour Herstal et
-- Seraing. Ces deux satellites ont été supprimées : leurs communes sont
-- désormais servies par le template commune, à la même URL. Tant que la colonne
-- porte l'ancienne valeur, le pré-rendu saute ces deux pages et le contrôle de
-- build interrompt le déploiement — 404 sur deux URL présentes au sitemap.
-- C'est précisément ce qu'il doit faire : la donnée est fausse, pas le contrôle.
-- ============================================================================

-- ── 1. Colonnes éditoriales ────────────────────────────────────────────────

-- Sections rédigées propres à la commune : [{ "titre": …, "contenu": … }].
-- jsonb plutôt que deux colonnes text[] parallèles : le couple titre/contenu
-- doit rester solidaire, et deux tableaux finiraient par se désaligner.
alter table public.communes
  add column if not exists sections_locales jsonb not null default '[]'::jsonb;

-- Règles d'autorisation de stationnement relevées sur la source officielle :
-- { autorite, procedure, delai, cout, signalisation, sourceUrl, dateVerification }.
-- NULL quand rien n'a été relevé — jamais un objet vide, qui laisserait croire
-- à une vérification faite.
alter table public.communes
  add column if not exists autorisation_stationnement jsonb;

-- Ce qu'il reste à vérifier auprès de la commune, en clair. Coexiste avec
-- autorisation_stationnement : l'autorité peut être connue et le délai non.
alter table public.communes
  add column if not exists todo_donnees_locales text;

comment on column public.communes.sections_locales is
  'Sections rédigées propres à la commune, [{titre, contenu}]. Vide sur la plupart.';
comment on column public.communes.autorisation_stationnement is
  'Règles de stationnement relevées en source officielle. NULL si rien n''est publié.';
comment on column public.communes.todo_donnees_locales is
  'Donnée locale restant à vérifier, et auprès de qui.';

-- Le tableau de sections doit rester un tableau : un objet ou une chaîne
-- passeraient sans bruit et casseraient le rendu.
alter table public.communes
  drop constraint if exists communes_sections_locales_tableau;
alter table public.communes
  add constraint communes_sections_locales_tableau
  check (jsonb_typeof(sections_locales) = 'array');

-- ── 2. Correction de page_existante ────────────────────────────────────────

-- Herstal et Seraing ont rejoint le template commune ; leurs pages satellites
-- n'existent plus. Laisser l'ancienne URL ici fait sauter leur pré-rendu.
update public.communes
   set page_existante = null,
       updated_at     = now()
 where id in ('herstal', 'seraing')
   and page_existante is not null;
