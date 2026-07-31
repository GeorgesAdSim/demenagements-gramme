-- ============================================================================
-- Lot « arrondissement de Waremme » — 8 commune(s) publiée(s), 5 maintenue(s) en brouillon
--
-- Généré depuis un jeu de données unique, qui a produit en même temps
-- src/data/communes.json. Le JSON et cette table doivent rester identiques :
-- au prochain build, scripts/sync-communes.mjs doit afficher
-- « identique au dépôt ». S'il annonce une mise à jour, les deux ont divergé.
--
-- Distances : relevé Google Maps du 2026-07-31 depuis Rue des Naiveux 64, 4040
-- Herstal, vitesse implicite contrôlée dans la plage 35-79 km/h.
-- Limitrophes, codes postaux et sections : articles Wikipédia français,
-- filtrés à la province de Liège.
--
-- ⚠️ Une seule transaction : le trigger communes_valider_voisines est différé à
-- la validation, et ces communes se citent mutuellement. Ligne par ligne, il
-- échouerait.
--
-- Maintenues en brouillon, volontairement :
--   · berloz — 2 limitrophe(s) — il en faut 3 à 5 ; distance non relevée ; temps de trajet non relevé
--   · geer — distance non relevée ; temps de trajet non relevé
--   · hannut — distance non relevée ; temps de trajet non relevé
--   · lincent — 1 limitrophe(s) — il en faut 3 à 5 ; distance non relevée ; temps de trajet non relevé
--   · wasseiges — 2 limitrophe(s) — il en faut 3 à 5
-- ============================================================================

begin;

update public.communes set
  codes_postaux           = array['4257']::text[],
  villages                = array['Berloz', 'Rosoux-Crenwick', 'Corswarem']::text[],
  communes_voisines       = array['waremme', 'geer']::text[],
  introduction_locale     = 'Berloz ne compte que trois villages — Berloz, Rosoux-Crenwick et Corswarem — réunis sous le seul code postal 4257. Nous y déménageons particuliers et entreprises, dans les trois villages comme au centre de l''entité.',
  distance_depot_km       = null,
  temps_trajet_estime_min = null,
  date_verification       = null,
  statut                  = 'draft'
where id = 'berloz';

update public.communes set
  codes_postaux           = array['4260', '4261', '4263']::text[],
  villages                = array['Braives', 'Tourinne', 'Latinne', 'Fallais', 'Fumal', 'Ville-en-Hesbaye', 'Ciplet', 'Avennes']::text[],
  communes_voisines       = array['hannut', 'geer', 'faimes', 'villers-le-bouillet', 'burdinne']::text[],
  introduction_locale     = 'Braives rassemble huit villages, de Fallais à Avennes en passant par Latinne et Ville-en-Hesbaye, répartis sur trois codes postaux : 4260, 4261 et 4263. Nous traitons l''entité comme un seul territoire, d''un village à l''autre.',
  distance_depot_km       = 44,
  temps_trajet_estime_min = 32,
  date_verification       = '2026-07-31',
  statut                  = 'published'
where id = 'braives';

update public.communes set
  codes_postaux           = array['4367']::text[],
  villages                = array['Crisnée', 'Odeur', 'Kemexhe', 'Fize-le-Marsal', 'Thys']::text[],
  communes_voisines       = array['oreye', 'awans', 'remicourt']::text[],
  introduction_locale     = 'Crisnée est, de tout l''arrondissement de Waremme, l''entité la plus proche de notre dépôt de Herstal. Elle réunit cinq villages — Crisnée, Odeur, Kemexhe, Fize-le-Marsal et Thys — sous le code postal 4367.',
  distance_depot_km       = 21,
  temps_trajet_estime_min = 16,
  date_verification       = '2026-07-31',
  statut                  = 'published'
where id = 'crisnee';

update public.communes set
  codes_postaux           = array['4357']::text[],
  villages                = array['Donceel', 'Limont', 'Jeneffe', 'Haneffe']::text[],
  communes_voisines       = array['waremme', 'remicourt', 'faimes', 'fexhe-le-haut-clocher', 'saint-georges-sur-meuse']::text[],
  introduction_locale     = 'Donceel regroupe quatre villages : Donceel, Limont, Jeneffe et Haneffe, tous sous le code postal 4357. L''entité borde Waremme et Remicourt, deux communes où nous intervenons déjà.',
  distance_depot_km       = 28,
  temps_trajet_estime_min = 23,
  date_verification       = '2026-07-31',
  statut                  = 'published'
where id = 'donceel';

update public.communes set
  codes_postaux           = array['4317']::text[],
  villages                = array['Celles', 'Borlez', 'Les Waleffes', 'Viemme', 'Aineffe']::text[],
  communes_voisines       = array['geer', 'waremme', 'braives', 'donceel', 'villers-le-bouillet']::text[],
  introduction_locale     = 'Faimes est une entité sans village homonyme : son nom désigne le regroupement de Celles, Borlez, Les Waleffes, Viemme et Aineffe, sous le code postal 4317. Nous intervenons dans les cinq villages, quelle que soit l''adresse indiquée sur le devis.',
  distance_depot_km       = 32,
  temps_trajet_estime_min = 27,
  date_verification       = '2026-07-31',
  statut                  = 'published'
where id = 'faimes';

update public.communes set
  codes_postaux           = array['4347']::text[],
  villages                = array['Fexhe-le-Haut-Clocher', 'Voroux-Goreux', 'Roloux', 'Noville', 'Freloux']::text[],
  communes_voisines       = array['remicourt', 'crisnee', 'donceel', 'awans', 'grace-hollogne']::text[],
  introduction_locale     = 'Fexhe-le-Haut-Clocher réunit cinq villages sous le code postal 4347 : Fexhe, Voroux-Goreux, Roloux, Noville et Freloux. L''entité touche Awans et Grâce-Hollogne, à moins de vingt-cinq kilomètres de notre dépôt.',
  distance_depot_km       = 23,
  temps_trajet_estime_min = 19,
  date_verification       = '2026-07-31',
  statut                  = 'published'
where id = 'fexhe-le-haut-clocher';

update public.communes set
  codes_postaux           = array['4250', '4252', '4253', '4254']::text[],
  villages                = array['Geer', 'Boëlhe', 'Hollogne-sur-Geer', 'Darion', 'Omal', 'Ligney', 'Lens-Saint-Servais']::text[],
  communes_voisines       = array['berloz', 'hannut', 'waremme', 'braives', 'faimes']::text[],
  introduction_locale     = 'Geer porte quatre codes postaux — 4250, 4252, 4253 et 4254 — pour sept villages, dont Hollogne-sur-Geer, Omal et Lens-Saint-Servais. C''est l''entité la plus fragmentée de l''arrondissement sur le plan postal, et nous couvrons chacun de ses villages.',
  distance_depot_km       = null,
  temps_trajet_estime_min = null,
  date_verification       = null,
  statut                  = 'draft'
where id = 'geer';

update public.communes set
  codes_postaux           = array['4280']::text[],
  villages                = array['Hannut', 'Avernas-le-Bauduin', 'Bertrée', 'Cras-Avernas', 'Poucet', 'Abolens', 'Blehen', 'Lens-Saint-Remy', 'Villers-le-Peuplier', 'Crehen', 'Trognée', 'Avin', 'Moxhe', 'Thisnes', 'Merdorp', 'Grand-Hallet', 'Petit-Hallet', 'Wansin']::text[],
  communes_voisines       = array['lincent', 'geer', 'wasseiges', 'burdinne', 'braives']::text[],
  introduction_locale     = 'Hannut réunit dix-huit villages sous un unique code postal, le 4280 : Avin, Thisnes, Crehen, Merdorp, Wansin ou encore Grand-Hallet. Deux adresses « à Hannut » peuvent donc se trouver à plusieurs kilomètres l''une de l''autre.',
  distance_depot_km       = null,
  temps_trajet_estime_min = null,
  date_verification       = null,
  statut                  = 'draft'
where id = 'hannut';

update public.communes set
  codes_postaux           = array['4287']::text[],
  villages                = array['Lincent', 'Pellaines', 'Racour']::text[],
  communes_voisines       = array['hannut']::text[],
  introduction_locale     = 'Lincent réunit trois villages — Lincent, Pellaines et Racour — sous le code postal 4287. L''entité se situe à la limite occidentale de la province de Liège : Hannut est sa seule commune limitrophe liégeoise.',
  distance_depot_km       = null,
  temps_trajet_estime_min = null,
  date_verification       = null,
  statut                  = 'draft'
where id = 'lincent';

update public.communes set
  codes_postaux           = array['4360']::text[],
  villages                = array['Oreye', 'Otrange', 'Lens-sur-Geer', 'Grandville', 'Bergilers']::text[],
  communes_voisines       = array['waremme', 'crisnee', 'remicourt']::text[],
  introduction_locale     = 'Oreye regroupe cinq villages sous le code postal 4360 : Oreye, Otrange, Lens-sur-Geer, Grandville et Bergilers. L''entité se trouve entre Waremme et Crisnée, à un peu plus de vingt-cinq kilomètres de notre dépôt de Herstal.',
  distance_depot_km       = 26,
  temps_trajet_estime_min = 22,
  date_verification       = '2026-07-31',
  statut                  = 'published'
where id = 'oreye';

update public.communes set
  codes_postaux           = array['4350', '4351']::text[],
  villages                = array['Remicourt', 'Lamine', 'Pousset', 'Hodeige', 'Momalle']::text[],
  communes_voisines       = array['oreye', 'crisnee', 'waremme', 'donceel', 'fexhe-le-haut-clocher']::text[],
  introduction_locale     = 'Remicourt réunit cinq villages — Remicourt, Lamine, Pousset, Hodeige et Momalle — répartis sur deux codes postaux, 4350 et 4351. Nous y intervenons depuis Herstal en une vingtaine de minutes.',
  distance_depot_km       = 27,
  temps_trajet_estime_min = 23,
  date_verification       = '2026-07-31',
  statut                  = 'published'
where id = 'remicourt';

update public.communes set
  codes_postaux           = array['4470']::text[],
  villages                = '{}',
  communes_voisines       = array['donceel', 'grace-hollogne', 'verlaine', 'flemalle', 'amay']::text[],
  introduction_locale     = 'Saint-Georges-sur-Meuse porte le code postal 4470 et fait le lien entre le plateau de Hesbaye et la vallée de la Meuse. Nous y intervenons dans le prolongement de Flémalle, que nous desservons déjà.',
  distance_depot_km       = 27,
  temps_trajet_estime_min = 21,
  date_verification       = '2026-07-31',
  statut                  = 'published'
where id = 'saint-georges-sur-meuse';

update public.communes set
  codes_postaux           = array['4219']::text[],
  villages                = array['Wasseiges', 'Meeffe', 'Ambresin', 'Acosse']::text[],
  communes_voisines       = array['hannut', 'burdinne']::text[],
  introduction_locale     = 'Wasseiges réunit quatre villages sous le code postal 4219 : Wasseiges, Meeffe, Ambresin et Acosse. L''entité borde la province de Namur, et seules Hannut et Burdinne la relient au reste de la province de Liège.',
  distance_depot_km       = 55,
  temps_trajet_estime_min = 43,
  date_verification       = null,
  statut                  = 'draft'
where id = 'wasseiges';

commit;

-- Contrôle : attendu 34 publiée(s) sur 84.
select count(*) as total, count(*) filter (where statut = 'published') as publiees
from public.communes;
