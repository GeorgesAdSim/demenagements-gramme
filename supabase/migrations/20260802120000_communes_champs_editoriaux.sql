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
-- CE QUE CETTE MIGRATION NE FAIT PAS
--
-- Elle ne touche pas à `page_existante`. Le retrait de cette valeur pour
-- Herstal et Seraing est solidaire du code qui supprime leurs pages satellites,
-- et vit donc dans une migration séparée, à exécuter au moment de déployer ce
-- code — voir 20260802130000_communes_page_existante_herstal_seraing.sql.
--
-- L'ordre compte dans les deux sens. Retirer la valeur trop tôt fait servir la
-- page satellite là où le contrôle de build attend une page commune, et le
-- déploiement s'interrompt. La retirer trop tard fait sauter le pré-rendu de
-- deux URL présentes au sitemap.
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
