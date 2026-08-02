-- ============================================================================
-- Retrait de page_existante pour Herstal et Seraing
--
-- ⚠️ À EXÉCUTER AU MOMENT DE DÉPLOYER LE CODE QUI SUPPRIME LEURS SATELLITES,
--    ni avant, ni après. Cette migration est solidaire de ce déploiement.
--
-- POURQUOI CE COUPLAGE
--
-- `page_existante` déclare qu'une page satellite antérieure porte déjà la
-- requête de la commune. Quand elle est renseignée, le pré-rendu ne génère pas
-- de page commune : la satellite s'en charge.
--
-- Herstal et Seraing rejoignent le template commune, à URL inchangée, et leurs
-- composants satellites sont supprimés. La valeur devient donc fausse — mais
-- seulement à partir du moment où ce code est en ligne.
--
-- Exécutée trop tôt, sur un site dont les satellites existent encore, la route
-- explicite l'emporte : le HTML servi est celui du satellite, dépourvu du
-- balisage Service qu'attend le contrôle de build sur une page commune. Le
-- déploiement s'interrompt.
--
-- Exécutée trop tard, sur un site dont les satellites ont disparu, le pré-rendu
-- saute ces deux communes : deux URL du sitemap tombent en 404, et le contrôle
-- de build s'interrompt là aussi.
--
-- Les deux échecs ont été observés. Le contrôle fait son travail dans les deux
-- cas : c'est la donnée qui doit suivre le code, à la bonne minute.
-- ============================================================================

update public.communes
   set page_existante = null,
       updated_at     = now()
 where id in ('herstal', 'seraing')
   and page_existante is not null;

-- Retour arrière, si le déploiement correspondant est annulé :
--
--   update public.communes
--      set page_existante = '/demenagement/demenagement-' || id,
--          updated_at     = now()
--    where id in ('herstal', 'seraing');
