-- ============================================================================
-- Lot « huy » — 16 commune(s) publiée(s), 0 maintenue(s) en brouillon
--
-- ⚠️ FICHIER GÉNÉRÉ par scripts/generer-lot-communes.mjs — ne pas modifier à la
-- main. Corrige scripts/lots/huy.mjs et relance le script.
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

-- ============================================================================

begin;

update public.communes set
  codes_postaux           = array['4540']::text[],
  villages                = array['Amay', 'Ampsin', 'Flône', 'Jehay', 'Ombret-Rawsa']::text[],
  communes_voisines       = array['verlaine', 'saint-georges-sur-meuse', 'wanze', 'villers-le-bouillet', 'huy']::text[],
  distance_depot_km       = 35,
  temps_trajet_estime_min = 31,
  date_verification       = '2026-07-31',
  statut                  = 'published',
  introduction_locale     = 'Amay réunit cinq villages sous le code postal 4540 : Amay, Ampsin, Flône, Jehay et Ombret-Rawsa. L''entité s''étire entre Engis et Huy, deux communes que nous desservons déjà.'
where id = 'amay';

update public.communes set
  codes_postaux           = array['4160', '4161', '4162', '4163']::text[],
  villages                = array['Anthisnes', 'Hody', 'Tavier', 'Villers-aux-Tours']::text[],
  communes_voisines       = array['nandrin', 'neupre', 'esneux', 'tinlot', 'comblain-au-pont']::text[],
  distance_depot_km       = 46,
  temps_trajet_estime_min = 44,
  date_verification       = '2026-07-31',
  statut                  = 'published',
  introduction_locale     = 'Anthisnes porte quatre codes postaux pour quatre villages — Anthisnes, Hody, Tavier et Villers-aux-Tours — soit un par ancienne commune. Nous intervenons dans les quatre.'
where id = 'anthisnes';

update public.communes set
  codes_postaux           = array['4210']::text[],
  villages                = array['Burdinne', 'Hannêche', 'Lamontzée', 'Marneffe', 'Oteppe']::text[],
  communes_voisines       = array['wasseiges', 'hannut', 'braives', 'heron', 'wanze']::text[],
  distance_depot_km       = 51,
  temps_trajet_estime_min = 38,
  date_verification       = '2026-07-31',
  statut                  = 'published',
  introduction_locale     = 'Burdinne regroupe cinq villages sous le code postal 4210 : Burdinne, Hannêche, Lamontzée, Marneffe et Oteppe. L''entité borde Hannut et Wanze, et nous desservons l''ensemble de ses villages.'
where id = 'burdinne';

update public.communes set
  codes_postaux           = array['4560']::text[],
  villages                = array['Clavier', 'Bois-et-Borsu', 'Les Avins', 'Ocquier', 'Pailhe', 'Terwagne']::text[],
  communes_voisines       = array['marchin', 'modave', 'tinlot', 'ouffet']::text[],
  distance_depot_km       = 52,
  temps_trajet_estime_min = 49,
  date_verification       = '2026-07-31',
  statut                  = 'published',
  introduction_locale     = 'Clavier réunit six villages sous le code postal 4560 : Clavier, Bois-et-Borsu, Les Avins, Ocquier, Pailhe et Terwagne. Ses quatre limitrophes liégeoises — Marchin, Modave, Tinlot et Ouffet — sont toutes des communes du Condroz, comme elle.'
where id = 'clavier';

update public.communes set
  codes_postaux           = array['4480']::text[],
  villages                = array['Engis', 'Éhein-Bas', 'Clermont-sous-Huy', 'Hermalle-sous-Huy']::text[],
  communes_voisines       = array['saint-georges-sur-meuse', 'flemalle', 'amay', 'neupre', 'nandrin']::text[],
  distance_depot_km       = 31,
  temps_trajet_estime_min = 28,
  date_verification       = '2026-07-31',
  statut                  = 'published',
  introduction_locale     = 'Engis réunit quatre villages sous le code postal 4480 : Engis, Éhein-Bas, Clermont-sous-Huy et Hermalle-sous-Huy. L''entité borde Flémalle et Saint-Georges-sur-Meuse, où nous intervenons déjà.'
where id = 'engis';

update public.communes set
  codes_postaux           = array['4190']::text[],
  villages                = array['Ferrières', 'My', 'Vieuxville', 'Werbomont', 'Xhoris']::text[],
  communes_voisines       = array['comblain-au-pont', 'aywaille', 'hamoir', 'stoumont']::text[],
  distance_depot_km       = 64,
  temps_trajet_estime_min = 46,
  date_verification       = '2026-07-31',
  statut                  = 'published',
  introduction_locale     = 'Ferrières réunit cinq villages sous le code postal 4190 : Ferrières, My, Vieuxville, Werbomont et Xhoris. C''est la seule commune de l''arrondissement de Huy à toucher celui de Verviers, par Stoumont.'
where id = 'ferrieres';

update public.communes set
  codes_postaux           = array['4180', '4181']::text[],
  villages                = array['Hamoir', 'Comblain-Fairon', 'Filot']::text[],
  communes_voisines       = array['anthisnes', 'comblain-au-pont', 'ouffet', 'ferrieres']::text[],
  distance_depot_km       = 60,
  temps_trajet_estime_min = 53,
  date_verification       = '2026-07-31',
  statut                  = 'published',
  introduction_locale     = 'Hamoir réunit trois villages — Hamoir, Comblain-Fairon et Filot — répartis sur deux codes postaux, 4180 et 4181. L''entité borde Comblain-au-Pont, où nous intervenons déjà.'
where id = 'hamoir';

update public.communes set
  codes_postaux           = array['4217', '4218']::text[],
  villages                = array['Héron', 'Lavoir', 'Couthuin', 'Waret-l''Évêque']::text[],
  communes_voisines       = array['burdinne', 'wanze', 'huy']::text[],
  distance_depot_km       = 48,
  temps_trajet_estime_min = 34,
  date_verification       = '2026-07-31',
  statut                  = 'published',
  introduction_locale     = 'Héron réunit quatre villages — Héron, Lavoir, Couthuin et Waret-l''Évêque — sur deux codes postaux, 4217 et 4218. L''entité borde la province de Namur : Burdinne, Wanze et Huy sont ses seules limitrophes liégeoises.'
where id = 'heron';

update public.communes set
  codes_postaux           = array['4570']::text[],
  villages                = array['Marchin', 'Vyle-et-Tharoul']::text[],
  communes_voisines       = array['huy', 'modave', 'clavier']::text[],
  distance_depot_km       = 58,
  temps_trajet_estime_min = 46,
  date_verification       = '2026-07-31',
  statut                  = 'published',
  introduction_locale     = 'Marchin ne compte que deux villages, Marchin et Vyle-et-Tharoul, sous le code postal 4570. L''entité jouxte Huy, où nous intervenons déjà.'
where id = 'marchin';

update public.communes set
  codes_postaux           = array['4577']::text[],
  villages                = array['Modave', 'Outrelouxhe', 'Strée', 'Vierset-Barse']::text[],
  communes_voisines       = array['huy', 'nandrin', 'marchin', 'tinlot', 'clavier']::text[],
  distance_depot_km       = 48,
  temps_trajet_estime_min = 48,
  date_verification       = '2026-07-31',
  statut                  = 'published',
  introduction_locale     = 'Modave réunit quatre villages sous le code postal 4577 : Modave, Outrelouxhe, Strée et Vierset-Barse. Ses cinq limitrophes appartiennent toutes à l''arrondissement de Huy.'
where id = 'modave';

update public.communes set
  codes_postaux           = array['4550']::text[],
  villages                = array['Nandrin', 'Saint-Séverin-en-Condroz', 'Villers-le-Temple', 'Yernée-Fraineux']::text[],
  communes_voisines       = array['amay', 'engis', 'neupre', 'modave', 'tinlot']::text[],
  distance_depot_km       = 37,
  temps_trajet_estime_min = 38,
  date_verification       = '2026-07-31',
  statut                  = 'published',
  introduction_locale     = 'Nandrin réunit quatre villages sous le code postal 4550 : Nandrin, Saint-Séverin-en-Condroz, Villers-le-Temple et Yernée-Fraineux. L''entité touche Neupré et Esneux, à la limite de l''arrondissement de Liège.'
where id = 'nandrin';

update public.communes set
  codes_postaux           = array['4590']::text[],
  villages                = array['Ouffet', 'Warzée', 'Ellemelle']::text[],
  communes_voisines       = array['tinlot', 'anthisnes', 'hamoir', 'clavier']::text[],
  distance_depot_km       = 50,
  temps_trajet_estime_min = 47,
  date_verification       = '2026-07-31',
  statut                  = 'published',
  introduction_locale     = 'Ouffet ne compte que trois villages — Ouffet, Warzée et Ellemelle — sous le code postal 4590. Nous les desservons tous les trois, au même titre que Tinlot et Clavier.'
where id = 'ouffet';

update public.communes set
  codes_postaux           = array['4557']::text[],
  villages                = array['Abée', 'Fraiture', 'Ramelot', 'Seny', 'Scry', 'Soheit-Tinlot']::text[],
  communes_voisines       = array['nandrin', 'anthisnes', 'modave', 'clavier', 'ouffet']::text[],
  distance_depot_km       = 41,
  temps_trajet_estime_min = 42,
  date_verification       = '2026-07-31',
  statut                  = 'published',
  introduction_locale     = 'Tinlot regroupe six villages sous le code postal 4557 : Abée, Fraiture, Ramelot, Seny, Scry et Soheit-Tinlot. Aucun ne s''appelle simplement Tinlot — le nom de l''entité vient de Soheit-Tinlot.'
where id = 'tinlot';

update public.communes set
  codes_postaux           = array['4537']::text[],
  villages                = array['Verlaine', 'Bodegnée', 'Chapon-Seraing', 'Seraing-le-Château']::text[],
  communes_voisines       = array['faimes', 'donceel', 'villers-le-bouillet', 'saint-georges-sur-meuse', 'amay']::text[],
  distance_depot_km       = 29,
  temps_trajet_estime_min = 25,
  date_verification       = '2026-07-31',
  statut                  = 'published',
  introduction_locale     = 'Verlaine réunit quatre villages sous le code postal 4537 : Verlaine, Bodegnée, Chapon-Seraing et Seraing-le-Château. Ces deux derniers n''ont rien à voir avec la ville de Seraing, à laquelle nous consacrons une page distincte.'
where id = 'verlaine';

update public.communes set
  codes_postaux           = array['4530']::text[],
  villages                = array['Villers-le-Bouillet', 'Fize-Fontaine', 'Vaux-et-Borset', 'Vieux-Waleffe', 'Warnant-Dreye']::text[],
  communes_voisines       = array['faimes', 'braives', 'verlaine', 'wanze', 'amay']::text[],
  distance_depot_km       = 35,
  temps_trajet_estime_min = 25,
  date_verification       = '2026-07-31',
  statut                  = 'published',
  introduction_locale     = 'Villers-le-Bouillet réunit cinq villages sous le code postal 4530 : Villers-le-Bouillet, Fize-Fontaine, Vaux-et-Borset, Vieux-Waleffe et Warnant-Dreye. L''entité fait le lien entre les arrondissements de Huy et de Waremme, où nous desservons déjà Faimes et Braives.'
where id = 'villers-le-bouillet';

update public.communes set
  codes_postaux           = array['4520']::text[],
  villages                = array['Wanze', 'Bas-Oha', 'Moha', 'Huccorgne', 'Vinalmont', 'Antheit']::text[],
  communes_voisines       = array['amay', 'burdinne', 'heron', 'villers-le-bouillet', 'huy']::text[],
  distance_depot_km       = 41,
  temps_trajet_estime_min = 29,
  date_verification       = '2026-07-31',
  statut                  = 'published',
  introduction_locale     = 'Wanze réunit six villages sous le code postal 4520 : Wanze, Bas-Oha, Moha, Huccorgne, Vinalmont et Antheit. L''entité jouxte Huy et Villers-le-Bouillet, et nous desservons chacun de ses villages.'
where id = 'wanze';

commit;

-- Contrôle : attendu 84 lignes et 52 publiée(s).
select count(*) as total, count(*) filter (where statut = 'published') as publiees
from public.communes;
