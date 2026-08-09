-- ============================================================================
-- Les six tables du site, enfin décrites dans le dépôt
--
-- `supabase/migrations/` ne contenait que `communes`. Les six autres tables du
-- site vivaient uniquement dans le projet Supabase, créées à la main : leur
-- schéma n'était vérifiable nulle part. C'est ce qui a bloqué le mini-formulaire
-- à trois champs du chantier SEO — impossible de savoir quels champs de
-- `devis_requests` étaient nullables sans interroger la base.
--
-- Le schéma ci-dessous est relevé sur le projet d'origine via la description OpenAPI
-- de PostgREST (types, nullabilité, valeurs par défaut, clés primaires).
--
-- Deux choses n'étaient PAS lisibles par ce biais et sont donc des décisions,
-- pas des copies — elles sont signalées à chaque fois :
--   · les contraintes CHECK, écrites d'après les valeurs réellement présentes
--     en base et celles que le back-office sait produire ;
--   · les index, choisis d'après les requêtes que le code émet.
-- ============================================================================

-- ---------------------------------------------------------------------------
-- Fonction d'horodatage, partagée
--
-- `communes` a la sienne depuis sa migration initiale. Plutôt que de la
-- réutiliser — son nom la rattache à une table — on en pose une neutre, que
-- les tables suivantes partagent.
-- ---------------------------------------------------------------------------
create or replace function public.touch_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at := now();
  return new;
end;
$$;

-- ---------------------------------------------------------------------------
-- pages — le CMS du back-office
--
-- Trois familles cohabitent dans cette table, distinguées par `page_type` :
--   site       les pages du site public, dont le contenu surcharge les valeurs
--              par défaut codées dans les composants (10 aujourd'hui)
--   satellite  les anciennes pages SEO (19)
--   custom     les brouillons et essais (14)
--
-- Seule la famille `site` en statut `published` est lue par le site public, et
-- c'est la seule que la politique RLS ouvrira à la clé anonyme.
-- ---------------------------------------------------------------------------
create table if not exists public.pages (
  id               uuid        primary key default gen_random_uuid(),
  -- Segment d'URL. Unique : usePageBySlug et useSitePageContent appellent
  -- `.single()` / `.maybeSingle()`, qui échouent si deux lignes répondent.
  -- Les 43 lignes actuelles ont bien 43 slugs distincts.
  slug             text        not null,
  title            text        not null,
  -- JSON sérialisé pour les pages `site`, HTML pour les satellites héritées.
  -- useSitePageContent tente le parsing JSON et retombe sur null s'il échoue :
  -- le type reste `text` pour cette raison, `jsonb` casserait les satellites.
  content          text,
  cocon            text,
  meta_title       text,
  meta_description text,
  og_image         text,
  canonical_url    text,
  h1               text,
  status           text        not null default 'draft',
  page_type        text        not null default 'custom',
  -- Garde-fou du back-office : empêche la suppression des pages structurantes.
  is_deletable     boolean     not null default true,
  ordre            integer,
  created_at       timestamptz not null default now(),
  updated_at       timestamptz not null default now(),

  constraint pages_slug_unique unique (slug),

  -- DÉCISION, pas une copie. Valeurs observées sur les 43 lignes : draft,
  -- published pour le statut ; site, satellite, custom pour le type. Le
  -- back-office ne sait produire que celles-là.
  constraint pages_statut_valide check (status in ('draft', 'published')),
  constraint pages_type_valide  check (page_type in ('site', 'satellite', 'custom'))
);

create index if not exists pages_slug_idx on public.pages (slug);
-- L'index qui sert la seule requête du site public.
create index if not exists pages_site_publiees_idx
  on public.pages (slug) where page_type = 'site' and status = 'published';

drop trigger if exists pages_touch_updated_at on public.pages;
create trigger pages_touch_updated_at
  before update on public.pages
  for each row execute function public.touch_updated_at();

comment on table public.pages is
  'Contenu éditorial du site, surchargeant les valeurs par défaut des composants.';

-- ---------------------------------------------------------------------------
-- devis_requests — les demandes des clients
--
-- La table la plus sensible du projet : noms, téléphones, adresses de départ
-- et d'arrivée, dates de déménagement. Le formulaire public y insère
-- directement avec la clé anonyme ; c'est la seule écriture anonyme du site.
-- ---------------------------------------------------------------------------
create table if not exists public.devis_requests (
  id             uuid        primary key default gen_random_uuid(),
  service_type   text        not null default 'demenagement',
  firstname      text        not null,
  lastname       text        not null,
  email          text        not null,
  phone          text        not null,
  departure_city text        not null,
  arrival_city   text        not null,
  -- Les quatre seuls champs nullables. C'est la réponse à la question restée
  -- ouverte : eux seuls peuvent disparaître d'un formulaire sans casser
  -- l'insertion.
  move_date      date,
  volume         text,
  message        text,
  response_notes text,
  status         text        not null default 'new',
  created_at     timestamptz not null default now(),

  -- DÉCISION. `new` à l'arrivée, `read` dès l'ouverture de la fiche dans le
  -- back-office, `replied` après réponse — les trois valeurs de DevisListPage.
  -- Les 6 lignes actuelles sont toutes en `read`.
  constraint devis_statut_valide
    check (status in ('new', 'read', 'replied')),

  -- Les deux services proposés par le formulaire (SERVICE_DB_MAP).
  constraint devis_service_valide
    check (service_type in ('demenagement', 'garde-meuble')),

  -- Les quatre tranches du sélecteur (VOLUME_DB_MAP), ou rien.
  constraint devis_volume_valide
    check (volume is null or volume in ('<20', '20-50', '50-100', 'unknown'))
);

-- Le back-office trie par date décroissante et filtre par statut.
create index if not exists devis_requests_created_at_idx
  on public.devis_requests (created_at desc);
create index if not exists devis_requests_status_idx
  on public.devis_requests (status);

comment on table public.devis_requests is
  'Demandes de devis du formulaire public. Données personnelles : accès restreint aux administrateurs, insertion seule pour la clé anonyme.';

-- ---------------------------------------------------------------------------
-- site_settings — les coordonnées de l'entreprise
--
-- Une seule ligne. Les valeurs par défaut portent les vraies coordonnées :
-- c'est volontaire, une base fraîche est immédiatement utilisable.
-- ---------------------------------------------------------------------------
create table if not exists public.site_settings (
  id            uuid        primary key default gen_random_uuid(),
  company_name  text        not null default 'Déménagements Gramme',
  vat_number    text        not null default 'BE 0775.264.382',
  phone_1       text        not null default '+32 4 264 50 16',
  phone_2       text        not null default '+32 4 240 43 06',
  email         text        not null default 'contact@demenagements-gramme.be',
  address       text        not null default 'Rue des Naiveux 64, 4040 Herstal',
  facebook_url  text        default 'https://www.facebook.com/GrammeDemenagements',
  google_tag_id text        default '',
  updated_at    timestamptz not null default now()
);

drop trigger if exists site_settings_touch_updated_at on public.site_settings;
create trigger site_settings_touch_updated_at
  before update on public.site_settings
  for each row execute function public.touch_updated_at();

-- ---------------------------------------------------------------------------
-- media et gramme_media — deux bibliothèques d'images
--
-- Deux tables pour le même besoin, héritage de deux générations du back-office.
-- `media` pointe vers les images de l'ancien site WordPress, `gramme_media`
-- vers des URL externes. Ni l'une ni l'autre ne référence aujourd'hui un
-- fichier du Storage. On les reprend telles quelles : les fusionner est un
-- chantier en soi, et une migration n'est pas le moment de le mener.
-- ---------------------------------------------------------------------------
create table if not exists public.media (
  id         uuid        primary key default gen_random_uuid(),
  filename   text        not null,
  url        text        not null,
  alt        text,
  type       text,
  created_at timestamptz not null default now()
);

create table if not exists public.gramme_media (
  id            uuid        primary key default gen_random_uuid(),
  filename      text        not null,
  original_name text        not null,
  storage_path  text        not null,
  public_url    text        not null,
  mime_type     text        not null default '',
  size_bytes    bigint      not null default 0,
  alt_text      text,
  created_at    timestamptz not null default now()
);

-- ---------------------------------------------------------------------------
-- volume_estimations — l'estimateur de volume par photos
--
-- Écrite exclusivement par l'Edge Function `estimate-volume`, qui utilise la
-- clé service_role et traverse donc RLS. Aucun rôle de l'API n'a besoin d'y
-- écrire ; seul le back-office la lit.
--
-- Contient des données personnelles indirectes — e-mail, téléphone, empreinte
-- d'IP, chemins de photos d'intérieurs. D'où `expires_at` : la rétention est
-- inscrite dans le schéma, pas laissée à une intention.
-- ---------------------------------------------------------------------------
create table if not exists public.volume_estimations (
  id                uuid        primary key default gen_random_uuid(),
  housing_type      text,
  rooms_count       integer,
  surface_m2        integer,
  floor             integer,
  has_elevator      boolean     default false,
  detected_items    jsonb,
  volume_m3         numeric,
  volume_min        numeric,
  volume_max        numeric,
  confidence        text,
  manually_adjusted boolean     default false,
  lead_email        text,
  lead_phone        text,
  photos_paths      text[],
  ip_hash           text,
  created_at        timestamptz not null default now(),
  expires_at        timestamptz not null default (now() + interval '90 days')
);

create index if not exists volume_estimations_expires_at_idx
  on public.volume_estimations (expires_at);

comment on column public.volume_estimations.expires_at is
  'Échéance de purge. Les photos et coordonnées ne sont pas conservées au-delà de 90 jours.';

notify pgrst, 'reload schema';
