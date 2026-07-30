-- ============================================================================
-- Diagnostic — à exécuter dans l'éditeur SQL du projet Supabase que le SITE
-- utilise, et non un autre. Trois questions dans l'ordre.
-- ============================================================================

-- 1. La table existe-t-elle dans CE projet ?
--    Zéro ligne = tu as exécuté la migration sur un autre projet Supabase.
--    C'est la deuxième cause possible du message d'erreur, et le correctif des
--    privilèges n'y changerait rien.
select table_schema, table_name
from information_schema.tables
where table_name = 'communes';

-- 2. Combien de lignes, et combien de publiées ?
--    Attendu : 84 et 26.
select count(*) as total, count(*) filter (where statut = 'published') as publiees
from public.communes;

-- 3. Les rôles de l'API ont-ils le droit de lire ?
--    Zéro ligne = c'est bien le problème de privilèges, applique le correctif
--    20260730140000_communes_grants.sql.
select grantee, privilege_type
from information_schema.role_table_grants
where table_schema = 'public' and table_name = 'communes'
  and grantee in ('anon', 'authenticated')
order by grantee, privilege_type;
