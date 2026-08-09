-- ============================================================================
-- Storage : qui dépose, qui supprime, qui lit
--
-- Deux buckets, deux régimes opposés, parce qu'ils portent deux choses qui
-- n'ont rien à voir :
--
--   media          PUBLIC. Le back-office y dépose les images du site, puis
--                  stocke l'URL publique renvoyée par getPublicUrl() dans
--                  gramme_media. Ces images sont destinées à être servies à
--                  tout visiteur : un bucket privé rendrait ces URL mortes.
--                  Ce qui doit être restreint ici, ce n'est pas la lecture,
--                  c'est le dépôt et la suppression.
--
--   volume-photos  PRIVÉ. Photos d'intérieurs de clients, envoyées à
--                  l'estimateur de volume. Aucune politique n'est posée
--                  dessus : seul service_role y accède, et c'est exactement ce
--                  dont l'Edge Function a besoin — elle traverse RLS. Une
--                  politique de lecture, même restreinte aux administrateurs,
--                  serait une porte qu'aucun code n'emprunte.
--
-- Rappel utile : sur un bucket public, Supabase sert /object/public/... sans
-- consulter storage.objects. La lecture y échappe donc à RLS par construction.
-- Les politiques ci-dessous ne portent que sur ce qui passe par l'API
-- authentifiée.
-- ============================================================================

-- Le dépôt et la suppression sont réservés aux administrateurs — la même
-- fonction que pour les tables, pour qu'il n'y ait qu'un seul endroit où l'on
-- décide qui l'est.
drop policy if exists media_admin_depot       on storage.objects;
drop policy if exists media_admin_lecture     on storage.objects;
drop policy if exists media_admin_maj         on storage.objects;
drop policy if exists media_admin_suppression on storage.objects;

create policy media_admin_depot on storage.objects
  for insert to authenticated
  with check (bucket_id = 'media' and public.is_admin());

-- Nécessaire à `supabase.storage.from('media').remove([...])` du back-office.
create policy media_admin_suppression on storage.objects
  for delete to authenticated
  using (bucket_id = 'media' and public.is_admin());

-- Le remplacement d'un fichier existant (upsert) passe par UPDATE.
create policy media_admin_maj on storage.objects
  for update to authenticated
  using (bucket_id = 'media' and public.is_admin())
  with check (bucket_id = 'media' and public.is_admin());

-- Lister le contenu du bucket depuis l'API authentifiée. Aucun composant ne le
-- fait aujourd'hui — la bibliothèque se lit dans la table gramme_media, pas
-- dans le Storage — mais sans cette politique, l'ajout d'un explorateur de
-- fichiers dans le back-office échouerait sans message clair.
create policy media_admin_lecture on storage.objects
  for select to authenticated
  using (bucket_id = 'media' and public.is_admin());

-- ---------------------------------------------------------------------------
-- Contrôle. Attendu : quatre politiques, toutes sur bucket_id = 'media',
-- toutes conditionnées à is_admin(). Aucune ligne pour volume-photos.
-- ---------------------------------------------------------------------------
select policyname, cmd, roles::text
from pg_policies
where schemaname = 'storage' and tablename = 'objects'
order by policyname;
