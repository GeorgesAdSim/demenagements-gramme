-- ============================================================================
-- Le back-office lit enfin les estimations de volume
--
-- `volume_estimations` était alimentée par l'Edge Function et consultée par
-- personne : la RLS et les grants existaient, la page pas. Cette migration
-- ajoute ce qu'il manque pour en faire une liste de travail, sur le modèle de
-- `devis_requests`.
-- ============================================================================

-- ---------------------------------------------------------------------------
-- status — le cycle de traitement
--
-- Mêmes trois premiers états que `devis_requests`, pour que les deux listes
-- d'arrivées se comportent pareil : `new` à l'insertion par l'Edge Function,
-- `read` dès l'ouverture de la fiche, puis `traite` ou `archived`.
--
-- ATTENTION, leçon de `devis_statut_valide` : cette contrainte n'autorise que
-- trois valeurs alors que DevisListPage propose aussi « Archiver ». L'update
-- part, la base la rejette, personne ne teste l'erreur, et le bouton ne fait
-- rien. La liste ci-dessous couvre donc TOUT ce que la page peut écrire —
-- `archived` compris. Toute valeur ajoutée à l'interface doit l'être ici
-- d'abord.
-- ---------------------------------------------------------------------------
alter table public.volume_estimations
  add column if not exists status text not null default 'new';

alter table public.volume_estimations
  drop constraint if exists estimations_statut_valide;

alter table public.volume_estimations
  add constraint estimations_statut_valide
  check (status in ('new', 'read', 'traite', 'archived'));

create index if not exists volume_estimations_status_idx
  on public.volume_estimations (status);

-- ---------------------------------------------------------------------------
-- notes — l'équivalent de `response_notes` côté devis
-- ---------------------------------------------------------------------------
alter table public.volume_estimations
  add column if not exists notes text;

-- ---------------------------------------------------------------------------
-- volume_ajuste — la correction de l'opérateur, À CÔTÉ de la valeur du modèle
--
-- `manually_adjusted` existait déjà, mais sans colonne où ranger la valeur
-- corrigée : ajuster aurait voulu dire écraser `volume_m3`, donc perdre ce que
-- le modèle avait répondu. Or c'est exactement l'écart entre les deux qui dira
-- un jour si l'estimateur dérive, et de combien.
--
-- `volume_m3` reste donc en lecture seule pour le back-office : la valeur du
-- modèle, jamais réécrite. `volume_ajuste` est nul tant que personne n'a
-- corrigé. Cette donnée ne se rattrape pas après coup — les corrections faites
-- entre-temps auraient effacé l'original.
-- ---------------------------------------------------------------------------
alter table public.volume_estimations
  add column if not exists volume_ajuste numeric;

comment on column public.volume_estimations.volume_m3 is
  'Volume calculé par le modèle. Jamais réécrit : voir volume_ajuste.';

comment on column public.volume_estimations.volume_ajuste is
  'Correction saisie dans le back-office. Nul tant que personne n''a corrigé.';

-- ---------------------------------------------------------------------------
-- Lecture des photos par les administrateurs — un revirement assumé
--
-- La migration 20260809130000 posait volume-photos sans aucune politique, avec
-- cet argument : « une politique de lecture, même restreinte aux
-- administrateurs, serait une porte qu'aucun code n'emprunte ». L'argument
-- tenait tant qu'aucun code ne l'empruntait. La fiche d'estimation affiche
-- désormais les photos — sans quoi l'opérateur ne peut pas juger une
-- estimation qui lui paraît fausse, ce qui est la raison d'être de la page.
--
-- Ce n'est PAS un oubli de la migration précédente : c'est sa révision, et
-- l'exposition ajoutée est faible. L'administrateur qui voit ces photos lit
-- déjà, sur la même fiche, l'e-mail, le téléphone et le détail de l'intérieur.
-- Le bucket reste privé : sans URL publique, l'affichage passe par des URL
-- signées à durée courte, que cette politique rend générables depuis l'API
-- authentifiée.
--
-- Lecture seule, volontairement. Ni dépôt ni suppression : rien dans le
-- back-office n'écrit dans ce bucket, et la purge des photos expirées relève
-- du service_role, pas de l'interface.
-- ---------------------------------------------------------------------------
drop policy if exists volume_photos_admin_lecture on storage.objects;

create policy volume_photos_admin_lecture on storage.objects
  for select to authenticated
  using (bucket_id = 'volume-photos' and public.is_admin());

-- ---------------------------------------------------------------------------
-- Contrôle. Attendu : les quatre politiques media_*, plus
-- volume_photos_admin_lecture en SELECT seul.
-- ---------------------------------------------------------------------------
select policyname, cmd, roles::text
from pg_policies
where schemaname = 'storage' and tablename = 'objects'
order by policyname;

-- Attendu : status, notes et volume_ajuste présents sur volume_estimations.
select column_name, data_type, is_nullable, column_default
from information_schema.columns
where table_schema = 'public' and table_name = 'volume_estimations'
  and column_name in ('status', 'notes', 'volume_ajuste', 'volume_m3', 'manually_adjusted')
order by column_name;
