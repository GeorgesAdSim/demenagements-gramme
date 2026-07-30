-- ============================================================================
-- Table des communes desservies — source d'édition du back-office
--
-- Le fichier src/data/communes.json reste ce que le build consomme : un script
-- de synchronisation le régénère depuis cette table au début de chaque build.
-- Cela garde le pré-rendu, le contrôle de build et le client sur une source
-- unique, et évite que le build dépende du réseau au mauvais moment.
--
-- Les contraintes CHECK ci-dessous reproduisent volontairement les règles de
-- validerCommunes(). Un contrôle au build refuse un déploiement, mais après
-- coup ; ici la base refuse l'enregistrement, et l'utilisateur du back-office
-- voit tout de suite pourquoi. C'est la même règle appliquée deux fois, à deux
-- endroits où elle protège de deux choses différentes.
-- ============================================================================

create table if not exists public.communes (
  -- Slug stable, sans accent. Sert de segment d'URL : le modifier casserait
  -- l'URL d'une page déjà indexée.
  id                       text primary key,
  nom                      text        not null,
  arrondissement           text,
  codes_postaux            text[]      not null default '{}',
  -- Distance routière depuis le dépôt de Herstal. NULL tant qu'elle n'a pas
  -- été mesurée : jamais estimée, jamais déduite d'une moyenne.
  distance_depot_km        integer,
  temps_trajet_estime_min  integer,
  villages                 text[]      not null default '{}',
  -- Slugs, pas des noms : un nom dupliqué finirait par diverger.
  communes_voisines        text[]      not null default '{}',
  introduction_locale      text,
  informations_locales     text[]      not null default '{}',
  date_verification        date,
  -- URL d'une page satellite antérieure. Renseignée, aucune page n'est
  -- générée pour cette commune : sa satellite porte déjà la requête.
  page_existante           text,
  statut                   text        not null default 'draft',
  created_at               timestamptz not null default now(),
  updated_at               timestamptz not null default now(),

  constraint communes_statut_valide
    check (statut in ('draft', 'published')),

  constraint communes_pas_auto_voisine
    check (not (id = any (communes_voisines))),

  constraint communes_distances_positives
    check (
      (distance_depot_km       is null or distance_depot_km       >= 0) and
      (temps_trajet_estime_min is null or temps_trajet_estime_min >= 0)
    ),

  -- Une commune publiée doit être mesurée. C'est cette règle qui a rattrapé
  -- les 8 km erronés de Seraing.
  constraint communes_publiee_mesuree
    check (
      statut <> 'published'
      or (distance_depot_km is not null and temps_trajet_estime_min is not null)
    ),

  -- coalesce obligatoire : array_length d'un tableau vide vaut NULL, et un
  -- CHECK qui vaut NULL est considéré comme satisfait. Sans lui, la contrainte
  -- laisserait passer exactement les cas qu'elle doit refuser.
  constraint communes_publiee_maillee
    check (
      statut <> 'published'
      or coalesce(array_length(communes_voisines, 1), 0) between 3 and 5
    ),

  constraint communes_publiee_avec_contenu
    check (
      statut <> 'published'
      or coalesce(btrim(introduction_locale), '') <> ''
      or coalesce(array_length(informations_locales, 1), 0) > 0
      or coalesce(array_length(villages, 1), 0) > 0
    )
);

comment on table public.communes is
  'Communes de la province de Liège. Éditée par le back-office, synchronisée vers src/data/communes.json au build.';
comment on column public.communes.id is
  'Slug servant de segment d''URL — /demenagement/demenagement-<id>. Ne pas modifier après publication.';
comment on column public.communes.page_existante is
  'URL d''une page satellite antérieure. Si renseignée, aucune page n''est générée pour cette commune.';

create index if not exists communes_statut_idx on public.communes (statut);
create index if not exists communes_arrondissement_idx on public.communes (arrondissement);

-- ---------------------------------------------------------------------------
-- updated_at
-- ---------------------------------------------------------------------------
create or replace function public.communes_touch_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at := now();
  return new;
end;
$$;

drop trigger if exists communes_touch_updated_at on public.communes;
create trigger communes_touch_updated_at
  before update on public.communes
  for each row execute function public.communes_touch_updated_at();

-- ---------------------------------------------------------------------------
-- Intégrité des voisines
--
-- Une clé étrangère ne peut pas porter sur les éléments d'un tableau, d'où ce
-- trigger. Il est DEFERRABLE INITIALLY DEFERRED et vérifié à la validation de
-- la transaction : sans cela, insérer Ans qui cite Juprelle échouerait tant que
-- Juprelle n'existe pas, et aucun ordre d'insertion ne satisferait un graphe
-- d'adjacence mutuelle.
-- ---------------------------------------------------------------------------
create or replace function public.communes_valider_voisines()
returns trigger
language plpgsql
as $$
declare
  inconnue text;
begin
  select v into inconnue
  from unnest(new.communes_voisines) as v
  where not exists (select 1 from public.communes c where c.id = v)
  limit 1;

  if inconnue is not null then
    raise exception
      'commune « % » : voisine inexistante « % »', new.id, inconnue
      using errcode = 'foreign_key_violation';
  end if;

  return new;
end;
$$;

drop trigger if exists communes_valider_voisines on public.communes;
create constraint trigger communes_valider_voisines
  after insert or update on public.communes
  deferrable initially deferred
  for each row execute function public.communes_valider_voisines();

-- ---------------------------------------------------------------------------
-- RLS
--
-- Lecture ouverte à anon : le script de synchronisation tourne au build avec la
-- clé anonyme, et il a besoin des 84 lignes — y compris les brouillons, pour
-- savoir lesquelles NE PAS déployer. Ces données sont de toute façon destinées
-- à des pages publiques. Si un jour le contenu en brouillon devait rester
-- confidentiel, il faudrait restreindre le select aux lignes published et
-- donner au build une clé de service.
--
-- Écriture réservée aux comptes authentifiés, c'est-à-dire au back-office.
-- ---------------------------------------------------------------------------
alter table public.communes enable row level security;

drop policy if exists communes_lecture_publique on public.communes;
create policy communes_lecture_publique
  on public.communes for select
  to anon, authenticated
  using (true);

drop policy if exists communes_ecriture_authentifiee on public.communes;
create policy communes_ecriture_authentifiee
  on public.communes for all
  to authenticated
  using (true)
  with check (true);
