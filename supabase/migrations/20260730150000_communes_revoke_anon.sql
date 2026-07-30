-- ============================================================================
-- Resserrement des privilèges de anon sur public.communes
--
-- Le diagnostic a montré que le rôle anon dispose de DELETE, INSERT, UPDATE,
-- TRUNCATE, REFERENCES et TRIGGER sur la table. Ces droits viennent des
-- privilèges par défaut que Supabase applique aux tables créées dans le schéma
-- public — ils n'ont pas été demandés, ils sont hérités.
--
-- Aujourd'hui rien n'en abuse : RLS est activée et aucune politique n'autorise
-- anon à écrire, donc toute tentative renvoie zéro ligne affectée. Mais la
-- protection ne tient qu'à ça. Le jour où quelqu'un désactive RLS sur cette
-- table pour déboguer — ce qui arrive — la clé anonyme, présente en clair dans
-- le bundle JavaScript du site public, permettrait à n'importe quel visiteur de
-- vider les 84 communes.
--
-- Défense en profondeur : on retire les droits d'écriture au rôle anonyme. RLS
-- reste la première barrière, le privilège devient la seconde.
-- ============================================================================

revoke insert, update, delete, truncate, references, trigger
  on table public.communes from anon;

-- La lecture reste ouverte : le script de synchronisation lit la table au build
-- avec la clé anonyme, et il lui faut les 84 lignes.
grant select on table public.communes to anon;

notify pgrst, 'reload schema';

-- ---------------------------------------------------------------------------
-- Contrôle. Attendu :
--   anon          | SELECT                          ← et rien d'autre
--   authenticated | DELETE, INSERT, SELECT, UPDATE  (et TRUNCATE/REFERENCES/TRIGGER hérités)
-- ---------------------------------------------------------------------------
select grantee, string_agg(privilege_type, ', ' order by privilege_type) as privileges
from information_schema.role_table_grants
where table_schema = 'public' and table_name = 'communes'
  and grantee in ('anon', 'authenticated')
group by grantee
order by grantee;
