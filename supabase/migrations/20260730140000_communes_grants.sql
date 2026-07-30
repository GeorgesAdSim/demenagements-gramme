-- ============================================================================
-- Correctif : privilèges manquants sur public.communes
--
-- La migration initiale activait RLS et créait les politiques, sans accorder
-- les privilèges SQL. Or les deux mécanismes sont indépendants et se
-- cumulent : une politique RLS décide QUELLES LIGNES un rôle peut voir, un
-- GRANT décide s'il a le droit de regarder la table du tout. Sans GRANT,
-- PostgREST — la couche qui expose l'API REST de Supabase — retire purement et
-- simplement la table de son cache de schéma, et l'API répond :
--
--   Could not find the table 'public.communes' in the schema cache
--
-- Message trompeur : la table existe, elle est seulement invisible au rôle qui
-- interroge. Supabase pose habituellement des privilèges par défaut sur les
-- tables créées depuis son éditeur SQL, mais s'y fier n'était pas correct.
-- ============================================================================

grant usage on schema public to anon, authenticated;

-- Lecture pour tout le monde : le script de synchronisation lit la table au
-- build avec la clé anonyme, et il lui faut les 84 lignes — brouillons
-- compris, pour savoir lesquelles ne pas déployer.
grant select on table public.communes to anon, authenticated;

-- Écriture réservée aux comptes connectés, c'est-à-dire au back-office. La
-- politique RLS communes_ecriture_authentifiee restreint déjà les lignes ; ce
-- GRANT ouvre le droit d'écrire, elle décide sur quoi.
grant insert, update, delete on table public.communes to authenticated;

-- PostgREST garde le schéma en cache et ne le relit pas de lui-même après un
-- changement de privilèges. Sans ce signal, l'erreur persiste plusieurs minutes
-- même une fois les GRANT posés.
notify pgrst, 'reload schema';

-- ---------------------------------------------------------------------------
-- Contrôle. Doit afficher trois lignes au moins :
--   anon          | SELECT
--   authenticated | SELECT
--   authenticated | INSERT / UPDATE / DELETE
-- ---------------------------------------------------------------------------
select grantee, privilege_type
from information_schema.role_table_grants
where table_schema = 'public'
  and table_name   = 'communes'
  and grantee in ('anon', 'authenticated')
order by grantee, privilege_type;
