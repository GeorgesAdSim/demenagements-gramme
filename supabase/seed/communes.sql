-- ============================================================================
-- Peuplement initial des 84 communes, depuis src/data/communes.json
--
-- Idempotent : relançable sans créer de doublon. ON CONFLICT met à jour, ce qui
-- permet aussi de réinitialiser la table depuis le dépôt si une modification
-- faite dans le back-office devait être annulée.
--
-- ⚠️ À exécuter APRÈS la migration, et dans une seule transaction : le trigger
-- de validation des voisines est différé à la validation, or les communes se
-- citent mutuellement. Ligne par ligne, il échouerait.
-- ============================================================================

begin;

insert into public.communes (
  id, nom, arrondissement, codes_postaux, distance_depot_km,
  temps_trajet_estime_min, villages, communes_voisines, introduction_locale,
  informations_locales, date_verification, page_existante, statut
) values
  ('amay', 'Amay', 'Huy', '{}', null, null, '{}', '{}', null, '{}', null, null, 'draft'),
  ('ambleve', 'Amblève (Amel)', 'Verviers', '{}', null, null, '{}', '{}', null, '{}', null, null, 'draft'),
  ('ans', 'Ans', 'Liège', array['4430', '4431', '4432']::text[], 12, 13, array['Loncin', 'Alleur', 'Xhendremael']::text[], array['juprelle', 'awans', 'grace-hollogne', 'saint-nicolas', 'liege']::text[], null, '{}', '2026-07-30', null, 'published'),
  ('anthisnes', 'Anthisnes', 'Huy', '{}', null, null, '{}', '{}', null, '{}', null, null, 'draft'),
  ('aubel', 'Aubel', 'Verviers', '{}', null, null, '{}', '{}', null, '{}', null, null, 'draft'),
  ('awans', 'Awans', 'Liège', array['4340', '4342']::text[], 15, 13, array['Fooz', 'Hognoul', 'Villers-l''Évêque', 'Othée']::text[], array['juprelle', 'crisnee', 'ans', 'fexhe-le-haut-clocher', 'grace-hollogne']::text[], null, '{}', '2026-07-30', null, 'published'),
  ('aywaille', 'Aywaille', 'Liège', array['4920']::text[], 46, 36, array['Sougné-Remouchamps', 'Harzé', 'Ernonheid']::text[], array['sprimont', 'comblain-au-pont', 'ferrieres', 'theux', 'stoumont']::text[], null, '{}', '2026-07-30', null, 'published'),
  ('baelen', 'Baelen', 'Verviers', '{}', null, null, '{}', '{}', null, '{}', null, null, 'draft'),
  ('bassenge', 'Bassenge', 'Liège', array['4690']::text[], 10, 15, array['Roclenge-sur-Geer', 'Boirs', 'Glons', 'Wonck', 'Ében-Émael']::text[], array['vise', 'juprelle', 'oupeye']::text[], null, '{}', '2026-07-30', null, 'published'),
  ('berloz', 'Berloz', 'Waremme', '{}', null, null, '{}', '{}', null, '{}', null, null, 'draft'),
  ('beyne-heusay', 'Beyne-Heusay', 'Liège', array['4610']::text[], 11, 19, array['Queue-du-Bois', 'Bellaire']::text[], array['blegny', 'fleron', 'soumagne']::text[], null, '{}', '2026-07-30', null, 'published'),
  ('blegny', 'Blegny', 'Liège', array['4670', '4671', '4672']::text[], 9, 13, array['Trembleur', 'Mortier', 'Barchon', 'Saive', 'Housse', 'Saint-Remy']::text[], array['vise', 'dalhem', 'liege', 'herve', 'beyne-heusay']::text[], null, '{}', '2026-07-30', null, 'published'),
  ('braives', 'Braives', 'Waremme', '{}', null, null, '{}', '{}', null, '{}', null, null, 'draft'),
  ('bullange', 'Bullange (Büllingen)', 'Verviers', '{}', null, null, '{}', '{}', null, '{}', null, null, 'draft'),
  ('burdinne', 'Burdinne', 'Huy', '{}', null, null, '{}', '{}', null, '{}', null, null, 'draft'),
  ('burg-reuland', 'Burg-Reuland', 'Verviers', '{}', null, null, '{}', '{}', null, '{}', null, null, 'draft'),
  ('butgenbach', 'Butgenbach (Bütgenbach)', 'Verviers', '{}', null, null, '{}', '{}', null, '{}', null, null, 'draft'),
  ('chaudfontaine', 'Chaudfontaine', 'Liège', array['4050', '4051', '4052', '4053']::text[], 27, 24, array['Beaufays', 'Embourg', 'Vaux-sous-Chèvremont']::text[], array['esneux', 'fleron', 'sprimont', 'trooz']::text[], null, '{}', '2026-07-30', null, 'published'),
  ('clavier', 'Clavier', 'Huy', '{}', null, null, '{}', '{}', null, '{}', null, null, 'draft'),
  ('comblain-au-pont', 'Comblain-au-Pont', 'Liège', array['4170', '4171']::text[], 52, 42, array['Poulseur']::text[], array['esneux', 'sprimont', 'aywaille', 'ferrieres', 'hamoir']::text[], null, '{}', '2026-07-30', null, 'published'),
  ('crisnee', 'Crisnée', 'Waremme', '{}', null, null, '{}', '{}', null, '{}', null, null, 'draft'),
  ('dalhem', 'Dalhem', 'Liège', array['4606', '4607', '4608']::text[], 10, 14, array['Feneur', 'Bombaye', 'Berneau', 'Warsage', 'Neufchâteau', 'Mortroux', 'Saint-André']::text[], array['vise', 'aubel', 'blegny', 'herve']::text[], null, '{}', '2026-07-30', null, 'published'),
  ('dison', 'Dison', 'Verviers', '{}', null, null, '{}', '{}', null, '{}', null, null, 'draft'),
  ('donceel', 'Donceel', 'Waremme', '{}', null, null, '{}', '{}', null, '{}', null, null, 'draft'),
  ('engis', 'Engis', 'Huy', '{}', null, null, '{}', '{}', null, '{}', null, null, 'draft'),
  ('esneux', 'Esneux', 'Liège', array['4130']::text[], 38, 34, array['Tilff']::text[], array['seraing', 'liege', 'neupre', 'chaudfontaine', 'sprimont']::text[], null, '{}', '2026-07-30', null, 'published'),
  ('eupen', 'Eupen', 'Verviers', '{}', null, null, '{}', '{}', null, '{}', null, null, 'draft'),
  ('faimes', 'Faimes', 'Waremme', '{}', null, null, '{}', '{}', null, '{}', null, null, 'draft'),
  ('ferrieres', 'Ferrières', 'Huy', '{}', null, null, '{}', '{}', null, '{}', null, null, 'draft'),
  ('fexhe-le-haut-clocher', 'Fexhe-le-Haut-Clocher', 'Waremme', '{}', null, null, '{}', '{}', null, '{}', null, null, 'draft'),
  ('flemalle', 'Flémalle', 'Liège', array['4400']::text[], 26, 22, array['Awirs', 'Chokier', 'Flémalle-Grande', 'Flémalle-Haute', 'Gleixhe', 'Ivoz-Ramet', 'Les Cahottes', 'Mons-lez-Liège']::text[], array['grace-hollogne', 'saint-georges-sur-meuse', 'seraing', 'engis', 'neupre']::text[], null, '{}', '2026-07-30', null, 'published'),
  ('fleron', 'Fléron', 'Liège', array['4620', '4621', '4623', '4624']::text[], 14, 20, array['Retinne', 'Magnée', 'Romsée']::text[], array['beyne-heusay', 'soumagne', 'chaudfontaine', 'trooz', 'olne']::text[], null, '{}', '2026-07-30', null, 'published'),
  ('geer', 'Geer', 'Waremme', '{}', null, null, '{}', '{}', null, '{}', null, null, 'draft'),
  ('grace-hollogne', 'Grâce-Hollogne', 'Liège', array['4460']::text[], 18, 16, array['Grâce-Berleur', 'Hollogne-aux-Pierres', 'Horion-Hozémont', 'Velroux', 'Bierset']::text[], array['donceel', 'fexhe-le-haut-clocher', 'awans', 'ans', 'saint-nicolas']::text[], null, '{}', '2026-07-30', null, 'published'),
  ('hamoir', 'Hamoir', 'Huy', '{}', null, null, '{}', '{}', null, '{}', null, null, 'draft'),
  ('hannut', 'Hannut', 'Waremme', '{}', null, null, '{}', '{}', null, '{}', null, null, 'draft'),
  ('heron', 'Héron', 'Huy', '{}', null, null, '{}', '{}', null, '{}', null, null, 'draft'),
  ('herstal', 'Herstal', 'Liège', array['4040', '4041', '4042']::text[], 0, 0, array['Vottem', 'Liers', 'Milmort']::text[], array['liege', 'juprelle', 'oupeye']::text[], null, '{}', '2026-07-30', '/demenagement/demenagement-herstal', 'published'),
  ('herve', 'Herve', 'Verviers', '{}', null, null, '{}', '{}', null, '{}', null, null, 'draft'),
  ('huy', 'Huy', 'Huy', array['4500']::text[], 35, 35, array['Ben-Ahin', 'Tihange']::text[], array['amay', 'wanze', 'marchin', 'villers-le-bouillet']::text[], 'Spécialistes du déménagement en région hutoise, nous maîtrisons les spécificités de la vallée de la Meuse pour vous garantir un emménagement sans stress.', array['Mise à disposition de lifts extérieurs, indispensables pour les maisons de maître et les ruelles étroites du centre historique.', 'Équipements adaptés pour les déménagements sur les rives de la Meuse et les zones en dénivelé.', 'Service d''emballage professionnel pour protéger vos biens lors des transports sinueux.']::text[], '2026-07-30', null, 'published'),
  ('jalhay', 'Jalhay', 'Verviers', '{}', null, null, '{}', '{}', null, '{}', null, null, 'draft'),
  ('juprelle', 'Juprelle', 'Liège', array['4450', '4451', '4452', '4453', '4458']::text[], 14, 15, array['Slins', 'Fexhe-Slins', 'Villers-Saint-Siméon', 'Voroux-lez-Liers', 'Lantin', 'Wihogne', 'Paifve']::text[], array['bassenge', 'awans', 'ans', 'oupeye', 'liege']::text[], null, '{}', '2026-07-30', null, 'published'),
  ('la-calamine', 'La Calamine (Kelmis)', 'Verviers', '{}', null, null, '{}', '{}', null, '{}', null, null, 'draft'),
  ('liege', 'Liège', 'Liège', array['4000', '4020', '4030', '4031', '4032']::text[], 11, 18, array['Wandre', 'Jupille-sur-Meuse', 'Bressoux', 'Grivegnée', 'Chênée', 'Angleur', 'Glain', 'Rocourt']::text[], array['ans', 'juprelle', 'herstal', 'vise', 'blegny']::text[], null, '{}', '2026-07-30', '/demenagement/demenagement-liege', 'published'),
  ('lierneux', 'Lierneux', 'Verviers', '{}', null, null, '{}', '{}', null, '{}', null, null, 'draft'),
  ('limbourg', 'Limbourg', 'Verviers', '{}', null, null, '{}', '{}', null, '{}', null, null, 'draft'),
  ('lincent', 'Lincent', 'Waremme', '{}', null, null, '{}', '{}', null, '{}', null, null, 'draft'),
  ('lontzen', 'Lontzen', 'Verviers', '{}', null, null, '{}', '{}', null, '{}', null, null, 'draft'),
  ('malmedy', 'Malmedy', 'Verviers', '{}', null, null, '{}', '{}', null, '{}', null, null, 'draft'),
  ('marchin', 'Marchin', 'Huy', '{}', null, null, '{}', '{}', null, '{}', null, null, 'draft'),
  ('modave', 'Modave', 'Huy', '{}', null, null, '{}', '{}', null, '{}', null, null, 'draft'),
  ('nandrin', 'Nandrin', 'Huy', '{}', null, null, '{}', '{}', null, '{}', null, null, 'draft'),
  ('neupre', 'Neupré', 'Liège', array['4120', '4121', '4122']::text[], 31, 29, array['Neuville-en-Condroz', 'Plainevaux', 'Rotheux-Rimière', 'Éhein']::text[], array['flemalle', 'seraing', 'engis', 'esneux', 'nandrin']::text[], null, '{}', '2026-07-30', null, 'published'),
  ('olne', 'Olne', 'Verviers', '{}', null, null, '{}', '{}', null, '{}', null, null, 'draft'),
  ('oreye', 'Oreye', 'Waremme', '{}', null, null, '{}', '{}', null, '{}', null, null, 'draft'),
  ('ouffet', 'Ouffet', 'Huy', '{}', null, null, '{}', '{}', null, '{}', null, null, 'draft'),
  ('oupeye', 'Oupeye', 'Liège', array['4680', '4681', '4682', '4683', '4684']::text[], 3, 5, array['Haccourt', 'Hermalle-sous-Argenteau', 'Vivegnis', 'Hermée', 'Houtain-Saint-Siméon', 'Heure-le-Romain']::text[], array['bassenge', 'vise', 'juprelle', 'herstal']::text[], null, '{}', '2026-07-30', null, 'published'),
  ('pepinster', 'Pepinster', 'Verviers', '{}', null, null, '{}', '{}', null, '{}', null, null, 'draft'),
  ('plombieres', 'Plombières', 'Verviers', '{}', null, null, '{}', '{}', null, '{}', null, null, 'draft'),
  ('raeren', 'Raeren', 'Verviers', '{}', null, null, '{}', '{}', null, '{}', null, null, 'draft'),
  ('remicourt', 'Remicourt', 'Waremme', '{}', null, null, '{}', '{}', null, '{}', null, null, 'draft'),
  ('saint-georges-sur-meuse', 'Saint-Georges-sur-Meuse', 'Waremme', '{}', null, null, '{}', '{}', null, '{}', null, null, 'draft'),
  ('saint-nicolas', 'Saint-Nicolas', 'Liège', array['4420']::text[], 17, 16, array['Tilleur', 'Montegnée']::text[], array['ans', 'grace-hollogne', 'liege', 'seraing']::text[], null, '{}', '2026-07-30', null, 'published'),
  ('saint-vith', 'Saint-Vith (Sankt Vith)', 'Verviers', '{}', null, null, '{}', '{}', null, '{}', null, null, 'draft'),
  ('seraing', 'Seraing', 'Liège', array['4100', '4101', '4102']::text[], 22, 20, array['Jemeppe-sur-Meuse', 'Ougrée', 'Boncelles']::text[], array['liege', 'flemalle', 'neupre', 'esneux']::text[], 'Situés à quelques minutes seulement de Seraing, nos déménageurs interviennent quotidiennement dans toute l''entité sérésienne pour les particuliers et les entreprises.', array['Forte densité urbaine nécessitant souvent la réservation d''un emplacement de stationnement.', 'Interventions fréquentes avec lift (monte-meubles) pour les appartements en centre-ville et à Jemeppe.', 'Accès rapide depuis notre dépôt, réduisant les frais de déplacement.']::text[], '2026-07-30', '/demenagement/demenagement-seraing', 'published'),
  ('soumagne', 'Soumagne', 'Liège', array['4630', '4631', '4632', '4633']::text[], 12, 14, array['Ayeneux', 'Micheroux', 'Melen', 'Cerexhe-Heuseux', 'Évegnée-Tignée']::text[], array['blegny', 'beyne-heusay', 'herve', 'fleron', 'olne']::text[], null, '{}', '2026-07-30', null, 'published'),
  ('spa', 'Spa', 'Verviers', '{}', null, null, '{}', '{}', null, '{}', null, null, 'draft'),
  ('sprimont', 'Sprimont', 'Liège', array['4140', '4141']::text[], 42, 32, array['Louveigné', 'Rouvreux', 'Dolembreux', 'Gomzé-Andoumont']::text[], array['esneux', 'chaudfontaine', 'trooz', 'pepinster', 'theux']::text[], null, '{}', '2026-07-30', null, 'published'),
  ('stavelot', 'Stavelot', 'Verviers', '{}', null, null, '{}', '{}', null, '{}', null, null, 'draft'),
  ('stoumont', 'Stoumont', 'Verviers', '{}', null, null, '{}', '{}', null, '{}', null, null, 'draft'),
  ('theux', 'Theux', 'Verviers', '{}', null, null, '{}', '{}', null, '{}', null, null, 'draft'),
  ('thimister-clermont', 'Thimister-Clermont', 'Verviers', '{}', null, null, '{}', '{}', null, '{}', null, null, 'draft'),
  ('tinlot', 'Tinlot', 'Huy', '{}', null, null, '{}', '{}', null, '{}', null, null, 'draft'),
  ('trois-ponts', 'Trois-Ponts', 'Verviers', '{}', null, null, '{}', '{}', null, '{}', null, null, 'draft'),
  ('trooz', 'Trooz', 'Liège', array['4870']::text[], 20, 26, array['Forêt', 'Fraipont', 'Nessonvaux']::text[], array['fleron', 'olne', 'chaudfontaine', 'pepinster', 'sprimont']::text[], null, '{}', '2026-07-30', null, 'published'),
  ('verlaine', 'Verlaine', 'Huy', '{}', null, null, '{}', '{}', null, '{}', null, null, 'draft'),
  ('verviers', 'Verviers', 'Verviers', '{}', null, null, '{}', '{}', null, '{}', null, null, 'draft'),
  ('villers-le-bouillet', 'Villers-le-Bouillet', 'Huy', '{}', null, null, '{}', '{}', null, '{}', null, null, 'draft'),
  ('vise', 'Visé', 'Liège', array['4600', '4601', '4602']::text[], 10, 12, array['Richelle', 'Argenteau', 'Cheratte', 'Lixhe', 'Lanaye']::text[], array['bassenge', 'oupeye', 'dalhem', 'herstal', 'liege']::text[], null, '{}', '2026-07-30', null, 'published'),
  ('waimes', 'Waimes', 'Verviers', '{}', null, null, '{}', '{}', null, '{}', null, null, 'draft'),
  ('wanze', 'Wanze', 'Huy', '{}', null, null, '{}', '{}', null, '{}', null, null, 'draft'),
  ('waremme', 'Waremme', 'Waremme', array['4300']::text[], 32, 25, array['Bettincourt', 'Bleret', 'Bovenistier', 'Grand-Axhe', 'Lantremange', 'Oleye']::text[], array['faimes', 'geer', 'berloz', 'remicourt']::text[], 'Notre équipe se déplace rapidement en Hesbaye et prend en charge votre déménagement à Waremme, que vous quittiez un appartement au centre ou une maison dans les villages environnants.', array['Accès aisé et rapide pour nos camions via l''autoroute E40.', 'Prise en charge complète pour les maisons unifamiliales et les nouveaux lotissements de la région.', 'Autorisation de stationnement à demander au préalable auprès de la zone de police de Hesbaye pour le centre-ville.']::text[], '2026-07-30', null, 'published'),
  ('wasseiges', 'Wasseiges', 'Waremme', '{}', null, null, '{}', '{}', null, '{}', null, null, 'draft'),
  ('welkenraedt', 'Welkenraedt', 'Verviers', '{}', null, null, '{}', '{}', null, '{}', null, null, 'draft')
on conflict (id) do update set
  nom                     = excluded.nom,
  arrondissement          = excluded.arrondissement,
  codes_postaux           = excluded.codes_postaux,
  distance_depot_km       = excluded.distance_depot_km,
  temps_trajet_estime_min = excluded.temps_trajet_estime_min,
  villages                = excluded.villages,
  communes_voisines       = excluded.communes_voisines,
  introduction_locale     = excluded.introduction_locale,
  informations_locales    = excluded.informations_locales,
  date_verification       = excluded.date_verification,
  page_existante          = excluded.page_existante,
  statut                  = excluded.statut;

commit;

-- Contrôle : doit afficher 84 lignes dont 26 publiées.
select count(*) as total, count(*) filter (where statut = 'published') as publiees
from public.communes;
