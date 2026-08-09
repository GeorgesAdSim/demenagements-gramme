-- ============================================================================
-- Le modèle d'accès : qui est administrateur, et ce que la clé publique peut
--
-- La contrainte de départ : la clé anonyme est publique par construction. Elle
-- est embarquée dans un bundle JavaScript servi à tout visiteur, et rien ne
-- peut l'y cacher. RLS est donc la seule barrière réelle, et elle doit tenir
-- seule.
--
-- Il suit qu'une politique adossée au seul fait d'être authentifié ne convient
-- pas ici : elle fait reposer l'accès aux données personnelles sur un réglage
-- du tableau de bord — qui peut ouvrir l'inscription — plutôt que sur une règle
-- inscrite dans la base. La barrière doit être une donnée, versionnée et
-- révocable, pas une case à cocher.
--
-- Le principe retenu : deny par défaut, et trois ouvertures explicites pour la
-- clé anonyme — pas une de plus. Chacune correspond à un flux vérifié en
-- production, jamais à une commodité.
--
--   1. SELECT sur `communes`     → sync-communes.mjs, au build
--   2. SELECT sur `pages`        → le site public, restreint aux pages `site`
--                                  publiées, les seules qu'il demande
--   3. INSERT sur `devis_requests` → le formulaire de devis
--
-- Tout le reste passe par `is_admin()`. « Être connecté » ne donne plus rien.
-- ============================================================================

-- ---------------------------------------------------------------------------
-- Qui est administrateur
--
-- Une table plutôt qu'un claim dans le jeton : la révocation est immédiate.
-- Avec un claim, un jeton déjà émis reste valable jusqu'à son expiration —
-- retirer quelqu'un ne prendrait effet qu'une heure plus tard.
--
-- Aucune politique n'est posée sur cette table : elle est donc invisible à
-- l'API REST, pour anon comme pour authenticated. On y écrit depuis l'éditeur
-- SQL du tableau de bord, qui passe en service_role. C'est délibéré — la table
-- qui désigne les administrateurs ne doit pas être modifiable par ceux
-- qu'elle désigne.
-- ---------------------------------------------------------------------------
create table if not exists public.admin_users (
  user_id   uuid        primary key references auth.users (id) on delete cascade,
  -- Doublon de auth.users.email, assumé : il rend la table lisible à l'œil nu
  -- dans l'éditeur SQL, sans jointure sur un schéma protégé.
  email     text        not null,
  ajoute_le timestamptz not null default now()
);

alter table public.admin_users enable row level security;

revoke all on table public.admin_users from anon, authenticated;

comment on table public.admin_users is
  'Comptes autorisés sur le back-office. Aucune policy : invisible à l''API, administrée en service_role.';

-- ---------------------------------------------------------------------------
-- is_admin()
--
-- SECURITY DEFINER parce que la fonction doit lire `admin_users`, que RLS
-- ferme à tout le monde. Elle s'exécute donc avec les droits de son
-- propriétaire.
--
-- `set search_path = ''` va avec : sans cela, quelqu'un capable de créer un
-- schéma en tête de search_path pourrait y placer une fausse table
-- `admin_users` et se faire élire administrateur par sa propre fonction. Le
-- corps qualifie donc tout — `public.admin_users`, `auth.uid()`.
--
-- `(select auth.uid())` et non `auth.uid()` : ainsi encapsulé, l'appel est
-- évalué une fois par requête et non une fois par ligne. Sur une table de 84
-- lignes c'est indifférent ; l'habitude, elle, se prend maintenant.
--
-- STABLE, pas IMMUTABLE : le résultat dépend de la session.
-- ---------------------------------------------------------------------------
create or replace function public.is_admin()
returns boolean
language sql
stable
security definer
set search_path = ''
as $$
  select exists (
    select 1 from public.admin_users a
    where a.user_id = (select auth.uid())
  );
$$;

revoke execute on function public.is_admin() from public, anon;
grant execute on function public.is_admin() to authenticated;

-- ============================================================================
-- Les politiques, table par table
-- ============================================================================

-- ---------------------------------------------------------------------------
-- communes — lecture publique assumée
--
-- Le build lit les 84 lignes avec la clé anonyme, brouillons compris : il lui
-- faut savoir lesquelles NE PAS déployer. Ces données sont de toute façon
-- destinées à des pages publiques.
-- ---------------------------------------------------------------------------
alter table public.communes enable row level security;

drop policy if exists communes_lecture_publique     on public.communes;
drop policy if exists communes_ecriture_authentifiee on public.communes;
drop policy if exists communes_lecture              on public.communes;
drop policy if exists communes_admin                on public.communes;

create policy communes_lecture on public.communes
  for select to anon, authenticated
  using (true);

create policy communes_admin on public.communes
  for all to authenticated
  using (public.is_admin())
  with check (public.is_admin());

-- ---------------------------------------------------------------------------
-- pages — la seule requête du site public, et rien d'autre
--
-- Mesuré au navigateur sur la production : le site n'émet qu'un appel, filtré
-- `page_type=site` et `status=published`. La politique reprend ce filtre à
-- l'identique. Les 14 brouillons et les 19 satellites cessent d'être lisibles
-- par la clé publique.
-- ---------------------------------------------------------------------------
alter table public.pages enable row level security;

drop policy if exists pages_lecture_publique on public.pages;
drop policy if exists pages_lecture_publiee  on public.pages;
drop policy if exists pages_admin            on public.pages;

create policy pages_lecture_publiee on public.pages
  for select to anon, authenticated
  using (page_type = 'site' and status = 'published');

create policy pages_admin on public.pages
  for all to authenticated
  using (public.is_admin())
  with check (public.is_admin());

-- ---------------------------------------------------------------------------
-- devis_requests — déposer, jamais lire
--
-- Le formulaire insère, point. Aucune politique SELECT pour anon : même en
-- connaissant l'identifiant d'une demande, la clé publique ne peut pas la
-- relire.
--
-- Le WITH CHECK sur `status = 'new'` empêche de déposer une demande déjà
-- marquée « répondu », qui n'apparaîtrait jamais dans le filtre par défaut du
-- back-office. Le privilège d'insertion est en outre restreint aux colonnes du
-- formulaire (plus bas) : deux barrières indépendantes pour la même règle.
-- ---------------------------------------------------------------------------
alter table public.devis_requests enable row level security;

drop policy if exists devis_requests_insert_public on public.devis_requests;
drop policy if exists devis_depot_public           on public.devis_requests;
drop policy if exists devis_admin                  on public.devis_requests;

create policy devis_depot_public on public.devis_requests
  for insert to anon, authenticated
  with check (status = 'new');

create policy devis_admin on public.devis_requests
  for all to authenticated
  using (public.is_admin())
  with check (public.is_admin());

-- ---------------------------------------------------------------------------
-- Les quatre tables sans aucun accès public
--
-- `volume_estimations` est écrite par l'Edge Function en service_role, qui
-- traverse RLS : elle n'a besoin d'aucune politique pour être alimentée.
-- ---------------------------------------------------------------------------
do $$
declare t text;
begin
  foreach t in array array['media', 'gramme_media', 'site_settings', 'volume_estimations']
  loop
    execute format('alter table public.%I enable row level security', t);
    execute format('drop policy if exists %I on public.%I', t || '_admin', t);
    execute format(
      'create policy %I on public.%I for all to authenticated using (public.is_admin()) with check (public.is_admin())',
      t || '_admin', t);
  end loop;
end $$;

-- ---------------------------------------------------------------------------
-- Les tables sm_* — fermées sans être touchées
--
-- Quatre tables d'un CMS commencé puis laissé, qu'aucune ligne du dépôt ne
-- mentionne. On ne supprime rien pendant une migration : leur contenu reste
-- intact. Mais « laisser en place » ne veut pas dire « laisser ouvert » —
-- elles répondaient à la clé anonyme, et anon y détenait les droits
-- d'écriture. RLS activée, aucune politique : plus personne n'y accède par
-- l'API tant qu'on n'aura pas décidé de leur sort.
--
-- Le `if exists` est nécessaire : ces tables n'existent que sur le projet
-- Gramme, et cette migration doit pouvoir tourner sur une base neuve.
-- ---------------------------------------------------------------------------
do $$
declare t text;
begin
  foreach t in array array['sm_content_pages', 'sm_globals', 'sm_schema_org', 'sm_seo_meta']
  loop
    if to_regclass('public.' || t) is not null then
      execute format('alter table public.%I enable row level security', t);
      execute format('revoke all on table public.%I from anon, authenticated', t);
    end if;
  end loop;
end $$;

-- ============================================================================
-- Les privilèges
--
-- RLS et GRANT sont deux mécanismes indépendants qui se cumulent : la
-- politique décide QUELLES LIGNES un rôle voit, le GRANT décide s'il a le
-- droit de regarder la table du tout. Les oublier retire la table du cache de
-- schéma de PostgREST, qui répond alors « Could not find the table » — message
-- trompeur, la table existe, elle est seulement invisible.
--
-- Le sens inverse compte tout autant : Supabase accorde par défaut TOUS les
-- droits DML à anon sur les tables du schéma public. Ces droits sont hérités,
-- jamais demandés, et une révocation écrite dans une migration ne vaut rien
-- tant qu'on n'a pas vérifié qu'elle a bien été appliquée — c'est arrivé ici
-- pour `communes`. D'où le contrôle en fin de fichier : il mesure l'état réel
-- plutôt que de faire confiance à l'intention.
-- ============================================================================
grant usage on schema public to anon, authenticated;

-- --- anon : on retire tout, puis on rend les trois ouvertures ---------------
revoke all on table public.communes, public.pages, public.devis_requests,
                    public.media, public.gramme_media, public.site_settings,
                    public.volume_estimations
  from anon;

grant select on table public.communes to anon;
grant select on table public.pages    to anon;

-- Insertion restreinte aux dix colonnes que le formulaire envoie. `status`,
-- `response_notes` et `id` n'en font pas partie : la clé publique ne peut pas
-- les fixer, quoi qu'elle poste.
grant insert (service_type, firstname, lastname, email, phone,
              departure_city, arrival_city, move_date, volume, message)
  on table public.devis_requests to anon;

-- --- authenticated : le droit d'agir, RLS décide sur quoi -------------------
grant select, insert, update, delete
  on table public.communes, public.pages, public.devis_requests,
           public.media, public.gramme_media, public.site_settings,
           public.volume_estimations
  to authenticated;

-- --- Garde-fou pour la suite ------------------------------------------------
-- Sans cela, la prochaine table créée depuis l'éditeur Supabase repartira avec
-- les droits d'écriture pour anon, et on refera ce constat dans six mois.
alter default privileges in schema public
  revoke insert, update, delete, truncate on tables from anon;

notify pgrst, 'reload schema';

-- ---------------------------------------------------------------------------
-- Contrôle. Attendu, et rien d'autre :
--
--   communes       | SELECT | (table entière)
--   pages          | SELECT | (table entière)
--   devis_requests | INSERT | 10 colonnes
--
-- La vue role_table_grants ne suffit pas ici : elle ignore les privilèges
-- accordés colonne par colonne, et l'INSERT sur devis_requests en est un. Il
-- faut interroger column_privileges en plus, sans quoi le contrôle laisse
-- croire que la clé anonyme ne peut pas déposer de demande.
-- ---------------------------------------------------------------------------
select table_name,
       privilege_type,
       case when count(*) filter (where colonne is not null) = 0
            then '(table entière)'
            else string_agg(colonne, ', ' order by colonne)
       end as portee
from (
  select table_name, privilege_type, null::text as colonne
  from information_schema.role_table_grants
  where table_schema = 'public' and grantee = 'anon'
  union all
  select c.table_name, c.privilege_type, c.column_name
  from information_schema.column_privileges c
  where c.table_schema = 'public' and c.grantee = 'anon'
    and not exists (
      select 1 from information_schema.role_table_grants t
      where t.table_schema = 'public' and t.grantee = 'anon'
        and t.table_name = c.table_name and t.privilege_type = c.privilege_type
    )
) x
group by table_name, privilege_type
order by table_name, privilege_type;
