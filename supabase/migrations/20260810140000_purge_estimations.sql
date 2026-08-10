-- ============================================================================
-- Purge des estimations : anonymiser, pas supprimer
--
-- `expires_at` existait depuis la création de la table, avec ce commentaire :
-- « Les photos et coordonnées ne sont pas conservées au-delà de 90 jours ».
-- Photos et coordonnées — pas « la ligne ». Rien n'appliquait cette intention :
-- ni pg_cron, ni fonction planifiée, ni script. La colonne et son index
-- existaient, aucune ligne n'a jamais été touchée.
--
-- L'échéance est donc tenue par anonymisation. Supprimer la ligne entière
-- détruirait l'écart entre `volume_m3` et `volume_ajuste`, c'est-à-dire la
-- seule série qui dira si l'estimateur dérive : à 90 jours de purge totale,
-- elle ne dépasserait jamais un trimestre.
--
-- Ce qui part : les photos du Storage, `lead_email`, `lead_phone`, `ip_hash`,
-- `photos_paths`, et `detected_items.raw_model_output` — le log brut du modèle,
-- qui peut contenir des descriptions littérales de l'intérieur.
--
-- Ce qui reste : le chiffré. Type de logement, surface, étage, volumes,
-- confiance, correction de l'opérateur, et le découpage par pièce. Sans photo,
-- sans contact et sans empreinte d'IP, un inventaire de meubles n'identifie
-- personne.
-- ============================================================================

-- ---------------------------------------------------------------------------
-- anonymized_at — la preuve, et le garde-fou contre le retraitement
--
-- On pourrait déduire l'état d'une ligne de `photos_paths is null`, mais une
-- estimation qui n'a jamais eu ni photo ni coordonnées serait indistinguable
-- d'une ligne purgée. Une colonne explicite tranche le cas, et surtout elle
-- date l'opération : c'est ce qu'on montre si l'on doit prouver que la
-- rétention est tenue.
-- ---------------------------------------------------------------------------
alter table public.volume_estimations
  add column if not exists anonymized_at timestamptz;

comment on column public.volume_estimations.anonymized_at is
  'Date d''anonymisation. Nul tant que la ligne porte encore photos et coordonnées.';

-- ---------------------------------------------------------------------------
-- Contrôle. Attendu : anonymized_at présente et nulle partout — aucune ligne
-- n'a encore atteint son échéance.
-- ---------------------------------------------------------------------------
select
  count(*)                                          as total,
  count(*) filter (where expires_at < now())        as echues,
  count(*) filter (where anonymized_at is not null) as deja_anonymisees
from public.volume_estimations;

-- ============================================================================
-- PLANIFICATION — à exécuter UNE FOIS, après le déploiement de la fonction
--
-- Volontairement hors de cette migration : elle suppose deux extensions
-- activées et une fonction déjà déployée. La jouer ici la ferait échouer sur
-- une base neuve, et une migration qui échoue à mi-parcours est pire que pas
-- de migration du tout.
--
--   supabase functions deploy purger-estimations
--
-- puis, dans l'éditeur SQL :
--
--   create extension if not exists pg_cron with schema extensions;
--   create extension if not exists pg_net  with schema extensions;
--
--   select cron.schedule(
--     'purger-estimations',
--     '30 3 * * *',                     -- tous les jours à 03h30 UTC
--     $$
--     select net.http_post(
--       url     := 'https://tcnhcszvfuvvzwjqbujm.supabase.co/functions/v1/purger-estimations',
--       headers := jsonb_build_object(
--         'Content-Type',  'application/json',
--         'Authorization', 'Bearer ' || current_setting('app.service_role_key', true)
--       )
--     );
--     $$
--   );
--
-- La clé service_role ne doit pas être écrite en clair dans la définition du
-- job : `cron.job` est lisible par tout rôle qui atteint la base. La poser une
-- fois en paramètre de base, hors migration versionnée :
--
--   alter database postgres set app.service_role_key = '<clé service_role>';
--
-- Avant la première exécution réelle, la fonction accepte `?dry=1` : elle
-- rapporte ce qu'elle ferait sans rien effacer. C'est le seul mode utile
-- aujourd'hui — la première échéance tombe le 8 novembre 2026.
-- ============================================================================
