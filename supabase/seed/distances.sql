-- ============================================================================
-- Distances depuis le dépôt — 84 communes
--
-- ⚠️ FICHIER GÉNÉRÉ par scripts/appliquer-distances.mjs — ne pas modifier à la
-- main. Corrige scripts/distances.mjs et relance le script.
--
-- Origine : Rue de la Digue, 4683 Oupeye
-- Relevé  : 2026-07-31, Google Maps, premier itinéraire proposé.
--
-- C'est le dépôt d'où partent les camions, et non le siège social rue des
-- Naiveux à Herstal, d'où venaient les 37 premiers relevés. Ceux-là annonçaient
-- Herstal à 0 km et décrivaient mal les frais d'approche.
--
-- ⚠️ À exécuter AVANT de merger la branche. Si Netlify build alors que la table
-- porte encore les anciennes valeurs, sync-communes réécrira le JSON avec
-- celles-ci — sans erreur, puisque c'est son comportement normal.
--
-- 82 commune(s) changent de valeur.
-- ============================================================================

begin;

update public.communes set distance_depot_km = 12, temps_trajet_estime_min = 15 where id = 'ans';
update public.communes set distance_depot_km = 16, temps_trajet_estime_min = 14 where id = 'awans';
update public.communes set distance_depot_km = 47, temps_trajet_estime_min = 39 where id = 'aywaille';
update public.communes set distance_depot_km = 10, temps_trajet_estime_min = 15 where id = 'bassenge';
update public.communes set distance_depot_km = 11, temps_trajet_estime_min = 20 where id = 'beyne-heusay';
update public.communes set distance_depot_km = 10, temps_trajet_estime_min = 15 where id = 'blegny';
update public.communes set distance_depot_km = 28, temps_trajet_estime_min = 26 where id = 'chaudfontaine';
update public.communes set distance_depot_km = 52, temps_trajet_estime_min = 44 where id = 'comblain-au-pont';
update public.communes set distance_depot_km = 11, temps_trajet_estime_min = 17 where id = 'dalhem';
update public.communes set distance_depot_km = 38, temps_trajet_estime_min = 36 where id = 'esneux';
update public.communes set distance_depot_km = 27, temps_trajet_estime_min = 24 where id = 'flemalle';
update public.communes set distance_depot_km = 15, temps_trajet_estime_min = 24 where id = 'fleron';
update public.communes set distance_depot_km = 18, temps_trajet_estime_min = 18 where id = 'grace-hollogne';
update public.communes set distance_depot_km = 4, temps_trajet_estime_min = 10 where id = 'herstal';
update public.communes set distance_depot_km = 15, temps_trajet_estime_min = 18 where id = 'juprelle';
update public.communes set distance_depot_km = 12, temps_trajet_estime_min = 21 where id = 'liege';
update public.communes set distance_depot_km = 31, temps_trajet_estime_min = 31 where id = 'neupre';
update public.communes set distance_depot_km = 3, temps_trajet_estime_min = 5 where id = 'oupeye';
update public.communes set distance_depot_km = 18, temps_trajet_estime_min = 18 where id = 'saint-nicolas';
update public.communes set distance_depot_km = 23, temps_trajet_estime_min = 22 where id = 'seraing';
update public.communes set distance_depot_km = 13, temps_trajet_estime_min = 17 where id = 'soumagne';
update public.communes set distance_depot_km = 43, temps_trajet_estime_min = 33 where id = 'sprimont';
update public.communes set distance_depot_km = 20, temps_trajet_estime_min = 29 where id = 'trooz';
update public.communes set distance_depot_km = 7, temps_trajet_estime_min = 14 where id = 'vise';
update public.communes set distance_depot_km = 38, temps_trajet_estime_min = 27 where id = 'berloz';
update public.communes set distance_depot_km = 45, temps_trajet_estime_min = 34 where id = 'braives';
update public.communes set distance_depot_km = 22, temps_trajet_estime_min = 18 where id = 'crisnee';
update public.communes set distance_depot_km = 29, temps_trajet_estime_min = 24 where id = 'donceel';
update public.communes set distance_depot_km = 33, temps_trajet_estime_min = 28 where id = 'faimes';
update public.communes set distance_depot_km = 23, temps_trajet_estime_min = 20 where id = 'fexhe-le-haut-clocher';
update public.communes set distance_depot_km = 39, temps_trajet_estime_min = 28 where id = 'geer';
update public.communes set distance_depot_km = 48, temps_trajet_estime_min = 35 where id = 'hannut';
update public.communes set distance_depot_km = 47, temps_trajet_estime_min = 31 where id = 'lincent';
update public.communes set distance_depot_km = 32, temps_trajet_estime_min = 24 where id = 'oreye';
update public.communes set distance_depot_km = 27, temps_trajet_estime_min = 24 where id = 'remicourt';
update public.communes set distance_depot_km = 27, temps_trajet_estime_min = 22 where id = 'saint-georges-sur-meuse';
update public.communes set distance_depot_km = 30, temps_trajet_estime_min = 24 where id = 'waremme';
update public.communes set distance_depot_km = 56, temps_trajet_estime_min = 45 where id = 'wasseiges';
update public.communes set distance_depot_km = 35, temps_trajet_estime_min = 31 where id = 'amay';
update public.communes set distance_depot_km = 46, temps_trajet_estime_min = 44 where id = 'anthisnes';
update public.communes set distance_depot_km = 51, temps_trajet_estime_min = 38 where id = 'burdinne';
update public.communes set distance_depot_km = 52, temps_trajet_estime_min = 49 where id = 'clavier';
update public.communes set distance_depot_km = 31, temps_trajet_estime_min = 28 where id = 'engis';
update public.communes set distance_depot_km = 64, temps_trajet_estime_min = 46 where id = 'ferrieres';
update public.communes set distance_depot_km = 60, temps_trajet_estime_min = 53 where id = 'hamoir';
update public.communes set distance_depot_km = 48, temps_trajet_estime_min = 34 where id = 'heron';
update public.communes set distance_depot_km = 46, temps_trajet_estime_min = 37 where id = 'huy';
update public.communes set distance_depot_km = 58, temps_trajet_estime_min = 46 where id = 'marchin';
update public.communes set distance_depot_km = 48, temps_trajet_estime_min = 48 where id = 'modave';
update public.communes set distance_depot_km = 37, temps_trajet_estime_min = 38 where id = 'nandrin';
update public.communes set distance_depot_km = 50, temps_trajet_estime_min = 47 where id = 'ouffet';
update public.communes set distance_depot_km = 41, temps_trajet_estime_min = 42 where id = 'tinlot';
update public.communes set distance_depot_km = 29, temps_trajet_estime_min = 25 where id = 'verlaine';
update public.communes set distance_depot_km = 35, temps_trajet_estime_min = 25 where id = 'villers-le-bouillet';
update public.communes set distance_depot_km = 41, temps_trajet_estime_min = 29 where id = 'wanze';
update public.communes set distance_depot_km = 70, temps_trajet_estime_min = 55 where id = 'ambleve';
update public.communes set distance_depot_km = 27, temps_trajet_estime_min = 27 where id = 'aubel';
update public.communes set distance_depot_km = 33, temps_trajet_estime_min = 29 where id = 'baelen';
update public.communes set distance_depot_km = 79, temps_trajet_estime_min = 65 where id = 'bullange';
update public.communes set distance_depot_km = 83, temps_trajet_estime_min = 63 where id = 'burg-reuland';
update public.communes set distance_depot_km = 68, temps_trajet_estime_min = 63 where id = 'butgenbach';
update public.communes set distance_depot_km = 21, temps_trajet_estime_min = 20 where id = 'dison';
update public.communes set distance_depot_km = 33, temps_trajet_estime_min = 34 where id = 'eupen';
update public.communes set distance_depot_km = 15, temps_trajet_estime_min = 19 where id = 'herve';
update public.communes set distance_depot_km = 34, temps_trajet_estime_min = 39 where id = 'jalhay';
update public.communes set distance_depot_km = 35, temps_trajet_estime_min = 35 where id = 'la-calamine';
update public.communes set distance_depot_km = 75, temps_trajet_estime_min = 56 where id = 'lierneux';
update public.communes set distance_depot_km = 27, temps_trajet_estime_min = 29 where id = 'limbourg';
update public.communes set distance_depot_km = 34, temps_trajet_estime_min = 30 where id = 'lontzen';
update public.communes set distance_depot_km = 52, temps_trajet_estime_min = 45 where id = 'malmedy';
update public.communes set distance_depot_km = 17, temps_trajet_estime_min = 24 where id = 'olne';
update public.communes set distance_depot_km = 28, temps_trajet_estime_min = 31 where id = 'pepinster';
update public.communes set distance_depot_km = 36, temps_trajet_estime_min = 35 where id = 'plombieres';
update public.communes set distance_depot_km = 42, temps_trajet_estime_min = 34 where id = 'raeren';
update public.communes set distance_depot_km = 71, temps_trajet_estime_min = 54 where id = 'saint-vith';
update public.communes set distance_depot_km = 41, temps_trajet_estime_min = 38 where id = 'spa';
update public.communes set distance_depot_km = 51, temps_trajet_estime_min = 46 where id = 'stavelot';
update public.communes set distance_depot_km = 62, temps_trajet_estime_min = 51 where id = 'stoumont';
update public.communes set distance_depot_km = 33, temps_trajet_estime_min = 35 where id = 'theux';
update public.communes set distance_depot_km = 22, temps_trajet_estime_min = 23 where id = 'thimister-clermont';
update public.communes set distance_depot_km = 57, temps_trajet_estime_min = 52 where id = 'trois-ponts';
update public.communes set distance_depot_km = 26, temps_trajet_estime_min = 30 where id = 'verviers';
update public.communes set distance_depot_km = 60, temps_trajet_estime_min = 56 where id = 'waimes';
update public.communes set distance_depot_km = 31, temps_trajet_estime_min = 28 where id = 'welkenraedt';

commit;

-- Contrôle : aucune commune publiée ne doit avoir de distance nulle.
select count(*) as publiees_sans_distance
from public.communes
where statut = 'published' and (distance_depot_km is null or temps_trajet_estime_min is null);
