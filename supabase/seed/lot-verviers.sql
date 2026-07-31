-- ============================================================================
-- Lot « verviers » — 19 commune(s) publiée(s), 10 maintenue(s) en brouillon
--
-- ⚠️ FICHIER GÉNÉRÉ par scripts/generer-lot-communes.mjs — ne pas modifier à la
-- main. Corrige scripts/lots/verviers.mjs et relance le script.
--
-- Distances relevées depuis Rue de la Digue, 4683 Oupeye.
--
-- Généré en même temps que src/data/communes.json, depuis la même source. Les
-- deux doivent rester identiques : au prochain build, sync-communes.mjs doit
-- afficher « identique au dépôt ». S'il annonce une mise à jour, ils ont
-- divergé — regarde avant de déployer.
--
-- ⚠️ À exécuter AVANT de merger la branche. Si Netlify build alors que la table
-- porte encore l'ancien état, sync-communes écrasera le JSON et les pages
-- disparaîtront du pré-rendu, sans erreur puisque c'est son comportement normal.
--
-- ⚠️ Une seule transaction : le trigger communes_valider_voisines est différé à
-- la validation, et ces communes se citent mutuellement. Ligne par ligne, il
-- échouerait.
--
-- Maintenues en brouillon, volontairement :
--   · lierneux — 2 limitrophe(s) en province de Liège — il en faut 3 à 5
--   · ambleve — en attente — commune de la Communauté germanophone — arbitrage en cours sur une version allemande des pages
--   · bullange — en attente — commune de la Communauté germanophone — arbitrage en cours sur une version allemande des pages
--   · burg-reuland — en attente — commune de la Communauté germanophone — arbitrage en cours sur une version allemande des pages ; 1 limitrophe(s) en province de Liège — il en faut 3 à 5
--   · butgenbach — en attente — commune de la Communauté germanophone — arbitrage en cours sur une version allemande des pages
--   · eupen — en attente — commune de la Communauté germanophone — arbitrage en cours sur une version allemande des pages
--   · la-calamine — en attente — commune de la Communauté germanophone — arbitrage en cours sur une version allemande des pages
--   · lontzen — en attente — commune de la Communauté germanophone — arbitrage en cours sur une version allemande des pages
--   · raeren — en attente — commune de la Communauté germanophone — arbitrage en cours sur une version allemande des pages
--   · saint-vith — en attente — commune de la Communauté germanophone — arbitrage en cours sur une version allemande des pages
-- ============================================================================

begin;

update public.communes set
  codes_postaux           = array['4880']::text[],
  villages                = '{}',
  communes_voisines       = array['dalhem', 'plombieres', 'herve', 'thimister-clermont', 'welkenraedt']::text[],
  distance_depot_km       = 27,
  temps_trajet_estime_min = 27,
  date_verification       = '2026-07-31',
  statut                  = 'published',
  introduction_locale     = 'Aubel porte le code postal 4880 et borde Dalhem, où nous intervenons déjà. L''entité se situe au cœur du pays de Herve, entre Plombières et Thimister-Clermont.'
where id = 'aubel';

update public.communes set
  codes_postaux           = array['4837']::text[],
  villages                = array['Baelen', 'Membach']::text[],
  communes_voisines       = array['limbourg', 'welkenraedt', 'lontzen', 'jalhay', 'waimes']::text[],
  distance_depot_km       = 33,
  temps_trajet_estime_min = 29,
  date_verification       = '2026-07-31',
  statut                  = 'published',
  introduction_locale     = 'Baelen ne compte que deux villages, Baelen et Membach, sous le code postal 4837. L''entité borde Limbourg et Welkenraedt, et touche la Communauté germanophone par Lontzen.'
where id = 'baelen';

update public.communes set
  codes_postaux           = array['4820', '4821']::text[],
  villages                = array['Dison', 'Andrimont']::text[],
  communes_voisines       = array['herve', 'thimister-clermont', 'welkenraedt', 'verviers', 'limbourg']::text[],
  distance_depot_km       = 21,
  temps_trajet_estime_min = 20,
  date_verification       = '2026-07-31',
  statut                  = 'published',
  introduction_locale     = 'Dison réunit deux villages, Dison et Andrimont, sur deux codes postaux, 4820 et 4821. L''entité jouxte Verviers et Herve, deux communes que nous desservons.'
where id = 'dison';

update public.communes set
  codes_postaux           = array['4650', '4651', '4652', '4653', '4654']::text[],
  villages                = array['Herve', 'Charneux', 'Battice', 'Chaineux', 'Grand-Rechain', 'Xhendelesse', 'Bolland', 'Julémont']::text[],
  communes_voisines       = array['dalhem', 'aubel', 'blegny', 'soumagne', 'thimister-clermont']::text[],
  distance_depot_km       = 15,
  temps_trajet_estime_min = 19,
  date_verification       = '2026-07-31',
  statut                  = 'published',
  introduction_locale     = 'Herve réunit huit villages sur cinq codes postaux, de 4650 à 4654 : Herve, Charneux, Battice, Chaineux, Grand-Rechain, Xhendelesse, Bolland et Julémont. Avec neuf communes limitrophes en province de Liège, c''est l''entité la plus entourée de l''arrondissement.'
where id = 'herve';

update public.communes set
  codes_postaux           = array['4845']::text[],
  villages                = array['Jalhay', 'Sart-lez-Spa']::text[],
  communes_voisines       = array['verviers', 'limbourg', 'baelen', 'theux', 'spa']::text[],
  distance_depot_km       = 34,
  temps_trajet_estime_min = 39,
  date_verification       = '2026-07-31',
  statut                  = 'published',
  introduction_locale     = 'Jalhay ne compte que deux villages, Jalhay et Sart-lez-Spa, sous le code postal 4845. Avec sept limitrophes liégeoises, l''entité touche aussi bien l''agglomération verviétoise que Malmedy et Stavelot.'
where id = 'jalhay';

update public.communes set
  codes_postaux           = array['4990']::text[],
  villages                = array['Lierneux', 'Bra', 'Arbrefontaine']::text[],
  communes_voisines       = array['stoumont', 'trois-ponts']::text[],
  distance_depot_km       = 75,
  temps_trajet_estime_min = 56,
  date_verification       = null,
  statut                  = 'draft',
  introduction_locale     = 'Lierneux réunit trois villages sous le code postal 4990 : Lierneux, Bra et Arbrefontaine. L''entité est au contact de la province de Luxembourg — Stoumont et Trois-Ponts sont ses seules limitrophes liégeoises.'
where id = 'lierneux';

update public.communes set
  codes_postaux           = array['4830', '4831', '4834']::text[],
  villages                = array['Limbourg', 'Bilstain', 'Goé']::text[],
  communes_voisines       = array['welkenraedt', 'dison', 'verviers', 'baelen', 'jalhay']::text[],
  distance_depot_km       = 27,
  temps_trajet_estime_min = 29,
  date_verification       = '2026-07-31',
  statut                  = 'published',
  introduction_locale     = 'Limbourg réunit trois villages — Limbourg, Bilstain et Goé — répartis sur trois codes postaux, 4830, 4831 et 4834. L''entité ne doit pas être confondue avec la province du même nom, qui est flamande et située plus au nord.'
where id = 'limbourg';

update public.communes set
  codes_postaux           = array['4960']::text[],
  villages                = array['Malmedy', 'Bellevaux-Ligneuville', 'Bévercé']::text[],
  communes_voisines       = array['jalhay', 'stavelot', 'waimes', 'saint-vith', 'ambleve']::text[],
  distance_depot_km       = 52,
  temps_trajet_estime_min = 45,
  date_verification       = '2026-07-31',
  statut                  = 'published',
  introduction_locale     = 'Malmedy réunit trois villages sous le code postal 4960 : Malmedy, Bellevaux-Ligneuville et Bévercé. L''entité borde la Communauté germanophone par Amblève et Saint-Vith.'
where id = 'malmedy';

update public.communes set
  codes_postaux           = array['4877']::text[],
  villages                = '{}',
  communes_voisines       = array['soumagne', 'fleron', 'trooz', 'herve', 'pepinster']::text[],
  distance_depot_km       = 17,
  temps_trajet_estime_min = 24,
  date_verification       = '2026-07-31',
  statut                  = 'published',
  introduction_locale     = 'Olne porte le code postal 4877 et borde trois communes de l''arrondissement de Liège — Soumagne, Fléron et Trooz — que nous desservons déjà, ainsi que Herve et Pepinster.'
where id = 'olne';

update public.communes set
  codes_postaux           = array['4860', '4861']::text[],
  villages                = array['Pepinster', 'Cornesse', 'Soiron', 'Wegnez']::text[],
  communes_voisines       = array['herve', 'olne', 'trooz', 'sprimont', 'verviers']::text[],
  distance_depot_km       = 28,
  temps_trajet_estime_min = 31,
  date_verification       = '2026-07-31',
  statut                  = 'published',
  introduction_locale     = 'Pepinster réunit quatre villages — Pepinster, Cornesse, Soiron et Wegnez — sur deux codes postaux, 4860 et 4861. L''entité borde Verviers et Theux, et touche l''arrondissement de Liège par Trooz et Sprimont.'
where id = 'pepinster';

update public.communes set
  codes_postaux           = array['4850', '4851', '4852']::text[],
  villages                = array['Gemmenich', 'Hombourg', 'Montzen', 'Moresnet', 'Sippenaeken']::text[],
  communes_voisines       = array['la-calamine', 'aubel', 'welkenraedt', 'lontzen']::text[],
  distance_depot_km       = 36,
  temps_trajet_estime_min = 35,
  date_verification       = '2026-07-31',
  statut                  = 'published',
  introduction_locale     = 'Plombières est une entité sans village homonyme : son nom désigne le regroupement de Gemmenich, Hombourg, Montzen, Moresnet et Sippenaeken, répartis sur les codes postaux 4850, 4851 et 4852. Elle borde la Communauté germanophone par La Calamine et Lontzen.'
where id = 'plombieres';

update public.communes set
  codes_postaux           = array['4900']::text[],
  villages                = '{}',
  communes_voisines       = array['theux', 'jalhay', 'stoumont', 'stavelot']::text[],
  distance_depot_km       = 41,
  temps_trajet_estime_min = 38,
  date_verification       = '2026-07-31',
  statut                  = 'published',
  introduction_locale     = 'Spa porte le code postal 4900 et borde Theux, Jalhay, Stoumont et Stavelot. Nous y intervenons comme dans les quatre communes qui l''entourent.'
where id = 'spa';

update public.communes set
  codes_postaux           = array['4970']::text[],
  villages                = array['Stavelot', 'Francorchamps']::text[],
  communes_voisines       = array['spa', 'jalhay', 'stoumont', 'malmedy', 'trois-ponts']::text[],
  distance_depot_km       = 51,
  temps_trajet_estime_min = 46,
  date_verification       = '2026-07-31',
  statut                  = 'published',
  introduction_locale     = 'Stavelot ne compte que deux villages, Stavelot et Francorchamps, sous le code postal 4970. L''entité borde Spa et Malmedy, et touche la Communauté germanophone par Saint-Vith.'
where id = 'stavelot';

update public.communes set
  codes_postaux           = array['4987']::text[],
  villages                = array['Stoumont', 'Chevron', 'La Gleize', 'Lorcé', 'Rahier']::text[],
  communes_voisines       = array['aywaille', 'theux', 'spa', 'ferrieres', 'stavelot']::text[],
  distance_depot_km       = 62,
  temps_trajet_estime_min = 51,
  date_verification       = '2026-07-31',
  statut                  = 'published',
  introduction_locale     = 'Stoumont réunit cinq villages sous le code postal 4987 : Stoumont, Chevron, La Gleize, Lorcé et Rahier. C''est la seule commune de l''arrondissement de Verviers à toucher celui de Huy, par Ferrières.'
where id = 'stoumont';

update public.communes set
  codes_postaux           = array['4910']::text[],
  villages                = array['Theux', 'Polleur', 'La Reid']::text[],
  communes_voisines       = array['jalhay', 'pepinster', 'spa', 'aywaille', 'sprimont']::text[],
  distance_depot_km       = 33,
  temps_trajet_estime_min = 35,
  date_verification       = '2026-07-31',
  statut                  = 'published',
  introduction_locale     = 'Theux réunit trois villages sous le code postal 4910 : Theux, Polleur et La Reid. L''entité se situe entre Verviers et Spa, et touche l''arrondissement de Liège par Aywaille et Sprimont.'
where id = 'theux';

update public.communes set
  codes_postaux           = array['4890']::text[],
  villages                = array['Clermont', 'Thimister']::text[],
  communes_voisines       = array['aubel', 'dison', 'herve', 'welkenraedt']::text[],
  distance_depot_km       = 22,
  temps_trajet_estime_min = 23,
  date_verification       = '2026-07-31',
  statut                  = 'published',
  introduction_locale     = 'Thimister-Clermont tient son nom de ses deux villages, Thimister et Clermont, réunis sous le code postal 4890. Elle borde Herve, Aubel, Dison et Welkenraedt, où nous intervenons également.'
where id = 'thimister-clermont';

update public.communes set
  codes_postaux           = array['4980', '4983']::text[],
  villages                = array['Basse-Bodeux', 'Fosse', 'Wanne']::text[],
  communes_voisines       = array['stoumont', 'stavelot', 'saint-vith', 'lierneux']::text[],
  distance_depot_km       = 57,
  temps_trajet_estime_min = 52,
  date_verification       = '2026-07-31',
  statut                  = 'published',
  introduction_locale     = 'Trois-Ponts réunit Basse-Bodeux, Fosse et Wanne sous les codes postaux 4980 et 4983 — aucune de ses trois anciennes communes ne porte le nom de l''entité. Elle borde Stoumont et Stavelot, que nous desservons déjà.'
where id = 'trois-ponts';

update public.communes set
  codes_postaux           = array['4800', '4801', '4802']::text[],
  villages                = array['Verviers', 'Ensival', 'Heusy', 'Lambermont', 'Petit-Rechain', 'Stembert']::text[],
  communes_voisines       = array['herve', 'dison', 'pepinster', 'limbourg', 'theux']::text[],
  distance_depot_km       = 26,
  temps_trajet_estime_min = 30,
  date_verification       = '2026-07-31',
  statut                  = 'published',
  introduction_locale     = 'Verviers réunit six villages sur trois codes postaux, de 4800 à 4802 : Verviers, Ensival, Heusy, Lambermont, Petit-Rechain et Stembert. C''est le chef-lieu de l''arrondissement, et six communes le bordent en province de Liège.'
where id = 'verviers';

update public.communes set
  codes_postaux           = array['4950']::text[],
  villages                = array['Waimes', 'Faymonville', 'Robertville']::text[],
  communes_voisines       = array['jalhay', 'baelen', 'eupen', 'malmedy', 'butgenbach']::text[],
  distance_depot_km       = 60,
  temps_trajet_estime_min = 56,
  date_verification       = '2026-07-31',
  statut                  = 'published',
  introduction_locale     = 'Waimes réunit trois villages sous le code postal 4950 : Waimes, Faymonville et Robertville. L''entité est entourée de communes germanophones — Eupen, Butgenbach et Amblève — et borde Malmedy et Jalhay.'
where id = 'waimes';

update public.communes set
  codes_postaux           = array['4840', '4841']::text[],
  villages                = array['Welkenraedt', 'Henri-Chapelle']::text[],
  communes_voisines       = array['thimister-clermont', 'aubel', 'plombieres', 'dison', 'limbourg']::text[],
  distance_depot_km       = 31,
  temps_trajet_estime_min = 28,
  date_verification       = '2026-07-31',
  statut                  = 'published',
  introduction_locale     = 'Welkenraedt ne compte que deux villages, Welkenraedt et Henri-Chapelle, sur deux codes postaux, 4840 et 4841. Avec sept limitrophes liégeoises, l''entité fait la jonction entre le pays de Herve et la Communauté germanophone.'
where id = 'welkenraedt';

update public.communes set
  codes_postaux           = array['4770', '4771']::text[],
  villages                = array['Amblève', 'Heppenbach', 'Meyerode']::text[],
  communes_voisines       = array['malmedy', 'waimes', 'butgenbach', 'bullange', 'saint-vith']::text[],
  distance_depot_km       = 70,
  temps_trajet_estime_min = 55,
  date_verification       = null,
  statut                  = 'draft'
where id = 'ambleve';

update public.communes set
  codes_postaux           = array['4760', '4761']::text[],
  villages                = array['Bullange', 'Rocherath', 'Manderfeld']::text[],
  communes_voisines       = array['butgenbach', 'ambleve', 'saint-vith']::text[],
  distance_depot_km       = 79,
  temps_trajet_estime_min = 65,
  date_verification       = null,
  statut                  = 'draft'
where id = 'bullange';

update public.communes set
  codes_postaux           = array['4790', '4791']::text[],
  villages                = array['Thommen', 'Reuland']::text[],
  communes_voisines       = array['saint-vith']::text[],
  distance_depot_km       = 83,
  temps_trajet_estime_min = 63,
  date_verification       = null,
  statut                  = 'draft'
where id = 'burg-reuland';

update public.communes set
  codes_postaux           = array['4750']::text[],
  villages                = array['Bütgenbach', 'Elsenborn']::text[],
  communes_voisines       = array['waimes', 'bullange', 'ambleve']::text[],
  distance_depot_km       = 68,
  temps_trajet_estime_min = 63,
  date_verification       = null,
  statut                  = 'draft'
where id = 'butgenbach';

update public.communes set
  codes_postaux           = array['4700', '4701']::text[],
  villages                = array['Eupen', 'Kettenis']::text[],
  communes_voisines       = array['lontzen', 'raeren', 'baelen', 'waimes']::text[],
  distance_depot_km       = 33,
  temps_trajet_estime_min = 34,
  date_verification       = null,
  statut                  = 'draft'
where id = 'eupen';

update public.communes set
  codes_postaux           = array['4720', '4721', '4728']::text[],
  villages                = array['La Calamine', 'Neu-Moresnet', 'Hergenrath']::text[],
  communes_voisines       = array['plombieres', 'raeren', 'lontzen']::text[],
  distance_depot_km       = 35,
  temps_trajet_estime_min = 35,
  date_verification       = null,
  statut                  = 'draft'
where id = 'la-calamine';

update public.communes set
  codes_postaux           = array['4710', '4711']::text[],
  villages                = array['Lontzen', 'Herbesthal', 'Walhorn']::text[],
  communes_voisines       = array['baelen', 'plombieres', 'welkenraedt', 'eupen', 'la-calamine']::text[],
  distance_depot_km       = 34,
  temps_trajet_estime_min = 30,
  date_verification       = null,
  statut                  = 'draft'
where id = 'lontzen';

update public.communes set
  codes_postaux           = array['4730', '4731']::text[],
  villages                = array['Raeren', 'Hauset', 'Eynatten']::text[],
  communes_voisines       = array['la-calamine', 'lontzen', 'eupen']::text[],
  distance_depot_km       = 42,
  temps_trajet_estime_min = 34,
  date_verification       = null,
  statut                  = 'draft'
where id = 'raeren';

update public.communes set
  codes_postaux           = array['4780', '4782', '4783', '4784']::text[],
  villages                = array['Saint-Vith', 'Recht', 'Schoenberg', 'Lommersweiler', 'Crombach']::text[],
  communes_voisines       = array['trois-ponts', 'stavelot', 'malmedy', 'ambleve', 'bullange']::text[],
  distance_depot_km       = 71,
  temps_trajet_estime_min = 54,
  date_verification       = null,
  statut                  = 'draft'
where id = 'saint-vith';

commit;

-- Contrôle : attendu 84 lignes et 71 publiée(s).
select count(*) as total, count(*) filter (where statut = 'published') as publiees
from public.communes;
