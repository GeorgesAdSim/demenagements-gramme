// Lot « arrondissement de Huy » — 16 communes.
//
// Ce fichier ne contient QUE des données relevées. Aucune logique : c'est
// scripts/generer-lot-communes.mjs qui décide du statut, en rejouant les
// contraintes CHECK de la table. Ne jamais écrire `statut` ici.
//
// Sources, et rien d'autre :
//   · distances  — PAS ici. Elles vivent dans scripts/distances.mjs, source
//     unique pour les 84 communes : elles dépendent de l'adresse du dépôt, pas
//     du lot, et se refont toutes ensemble quand cette adresse change.
//
//     ⚠️ Aucune introduction ne doit énoncer une distance ni une durée. Quatre
//     l'ont fait dans le lot de Waremme et sont devenues fausses le jour où
//     l'origine du relevé a été corrigée.
//   · limitrophes, codes postaux, sections — articles Wikipédia en français.
//
// Les limitrophes sont filtrées à la province de Liège — cet arrondissement
// borde Namur à l'ouest et au sud, et le Luxembourg au sud-est — puis ramenées
// à cinq au maximum, en gardant d'abord les communes déjà publiées, puis celles
// publiables dans ce lot, puis l'ordre de l'article.
//
// Les 16 sont publiables : aucune ne descend sous trois limitrophes liégeoises,
// contrairement à l'arrondissement de Waremme où trois communes sont restées en
// brouillon. Le Condroz est un intérieur, pas une frontière.

export const DATE_VERIFICATION = '2026-07-31';

// `infos` — les particularités de terrain — reste absent partout : bâti, accès,
// stationnement et dénivelé ne se déduisent d'aucune source publique. Ils sont
// à faire valider par Gramme, puis à saisir dans le back-office.
export const DONNEES = {
  amay: {
    cp: ['4540'],
    villages: ['Amay', 'Ampsin', 'Flône', 'Jehay', 'Ombret-Rawsa'],
    // 8 limitrophes liégeoises ; engis, modave et nandrin écartées au tri à cinq.
    voisines: ['verlaine', 'saint-georges-sur-meuse', 'wanze', 'villers-le-bouillet', 'huy'],
    intro: "Amay réunit cinq villages sous le code postal 4540 : Amay, Ampsin, Flône, Jehay et Ombret-Rawsa. L'entité s'étire entre Engis et Huy, deux communes que nous desservons déjà.",
  },
  anthisnes: {
    cp: ['4160', '4161', '4162', '4163'],
    villages: ['Anthisnes', 'Hody', 'Tavier', 'Villers-aux-Tours'],
    voisines: ['nandrin', 'neupre', 'esneux', 'tinlot', 'comblain-au-pont'], // ouffet, hamoir écartées
    intro: "Anthisnes porte quatre codes postaux pour quatre villages — Anthisnes, Hody, Tavier et Villers-aux-Tours — soit un par ancienne commune. Nous intervenons dans les quatre.",
  },
  burdinne: {
    cp: ['4210'],
    villages: ['Burdinne', 'Hannêche', 'Lamontzée', 'Marneffe', 'Oteppe'],
    voisines: ['wasseiges', 'hannut', 'braives', 'heron', 'wanze'],
    intro: "Burdinne regroupe cinq villages sous le code postal 4210 : Burdinne, Hannêche, Lamontzée, Marneffe et Oteppe. L'entité borde Hannut et Wanze, et nous desservons l'ensemble de ses villages.",
  },
  clavier: {
    cp: ['4560'],
    villages: ['Clavier', 'Bois-et-Borsu', 'Les Avins', 'Ocquier', 'Pailhe', 'Terwagne'],
    voisines: ['marchin', 'modave', 'tinlot', 'ouffet'],
    intro: "Clavier réunit six villages sous le code postal 4560 : Clavier, Bois-et-Borsu, Les Avins, Ocquier, Pailhe et Terwagne. Ses quatre limitrophes liégeoises — Marchin, Modave, Tinlot et Ouffet — sont toutes des communes du Condroz, comme elle.",
  },
  engis: {
    cp: ['4480'],
    villages: ['Engis', 'Éhein-Bas', 'Clermont-sous-Huy', 'Hermalle-sous-Huy'],
    voisines: ['saint-georges-sur-meuse', 'flemalle', 'amay', 'neupre', 'nandrin'],
    intro: "Engis réunit quatre villages sous le code postal 4480 : Engis, Éhein-Bas, Clermont-sous-Huy et Hermalle-sous-Huy. L'entité borde Flémalle et Saint-Georges-sur-Meuse, où nous intervenons déjà.",
  },
  ferrieres: {
    cp: ['4190'],
    villages: ['Ferrières', 'My', 'Vieuxville', 'Werbomont', 'Xhoris'],
    // Stoumont appartient à l'arrondissement de Verviers : c'est le seul point
    // de contact entre ce lot et le suivant.
    voisines: ['comblain-au-pont', 'aywaille', 'hamoir', 'stoumont'],
    intro: "Ferrières réunit cinq villages sous le code postal 4190 : Ferrières, My, Vieuxville, Werbomont et Xhoris. C'est la seule commune de l'arrondissement de Huy à toucher celui de Verviers, par Stoumont.",
  },
  hamoir: {
    cp: ['4180', '4181'],
    villages: ['Hamoir', 'Comblain-Fairon', 'Filot'],
    voisines: ['anthisnes', 'comblain-au-pont', 'ouffet', 'ferrieres'],
    intro: "Hamoir réunit trois villages — Hamoir, Comblain-Fairon et Filot — répartis sur deux codes postaux, 4180 et 4181. L'entité borde Comblain-au-Pont, où nous intervenons déjà.",
  },
  heron: {
    cp: ['4217', '4218'],
    villages: ['Héron', 'Lavoir', 'Couthuin', "Waret-l'Évêque"],
    voisines: ['burdinne', 'wanze', 'huy'],
    intro: "Héron réunit quatre villages — Héron, Lavoir, Couthuin et Waret-l'Évêque — sur deux codes postaux, 4217 et 4218. L'entité borde la province de Namur : Burdinne, Wanze et Huy sont ses seules limitrophes liégeoises.",
  },
  marchin: {
    cp: ['4570'],
    villages: ['Marchin', 'Vyle-et-Tharoul'],
    voisines: ['huy', 'modave', 'clavier'],
    intro: "Marchin ne compte que deux villages, Marchin et Vyle-et-Tharoul, sous le code postal 4570. L'entité jouxte Huy, où nous intervenons déjà.",
  },
  modave: {
    cp: ['4577'],
    villages: ['Modave', 'Outrelouxhe', 'Strée', 'Vierset-Barse'],
    voisines: ['huy', 'nandrin', 'marchin', 'tinlot', 'clavier'],
    intro: "Modave réunit quatre villages sous le code postal 4577 : Modave, Outrelouxhe, Strée et Vierset-Barse. Ses cinq limitrophes appartiennent toutes à l'arrondissement de Huy.",
  },
  nandrin: {
    cp: ['4550'],
    villages: ['Nandrin', 'Saint-Séverin-en-Condroz', 'Villers-le-Temple', 'Yernée-Fraineux'],
    voisines: ['amay', 'engis', 'neupre', 'modave', 'tinlot'], // anthisnes écartée
    intro: "Nandrin réunit quatre villages sous le code postal 4550 : Nandrin, Saint-Séverin-en-Condroz, Villers-le-Temple et Yernée-Fraineux. L'entité touche Neupré et Esneux, à la limite de l'arrondissement de Liège.",
  },
  ouffet: {
    cp: ['4590'],
    villages: ['Ouffet', 'Warzée', 'Ellemelle'],
    voisines: ['tinlot', 'anthisnes', 'hamoir', 'clavier'],
    intro: "Ouffet ne compte que trois villages — Ouffet, Warzée et Ellemelle — sous le code postal 4590. Nous les desservons tous les trois, au même titre que Tinlot et Clavier.",
  },
  tinlot: {
    cp: ['4557'],
    // Aucune section ne porte le nom nu de l'entité : il vient de Soheit-Tinlot.
    villages: ['Abée', 'Fraiture', 'Ramelot', 'Seny', 'Scry', 'Soheit-Tinlot'],
    voisines: ['nandrin', 'anthisnes', 'modave', 'clavier', 'ouffet'],
    intro: "Tinlot regroupe six villages sous le code postal 4557 : Abée, Fraiture, Ramelot, Seny, Scry et Soheit-Tinlot. Aucun ne s'appelle simplement Tinlot — le nom de l'entité vient de Soheit-Tinlot.",
  },
  verlaine: {
    cp: ['4537'],
    villages: ['Verlaine', 'Bodegnée', 'Chapon-Seraing', 'Seraing-le-Château'],
    voisines: ['faimes', 'donceel', 'villers-le-bouillet', 'saint-georges-sur-meuse', 'amay'],
    intro: "Verlaine réunit quatre villages sous le code postal 4537 : Verlaine, Bodegnée, Chapon-Seraing et Seraing-le-Château. Ces deux derniers n'ont rien à voir avec la ville de Seraing, à laquelle nous consacrons une page distincte.",
  },
  'villers-le-bouillet': {
    cp: ['4530'],
    villages: ['Villers-le-Bouillet', 'Fize-Fontaine', 'Vaux-et-Borset', 'Vieux-Waleffe', 'Warnant-Dreye'],
    voisines: ['faimes', 'braives', 'verlaine', 'wanze', 'amay'],
    intro: "Villers-le-Bouillet réunit cinq villages sous le code postal 4530 : Villers-le-Bouillet, Fize-Fontaine, Vaux-et-Borset, Vieux-Waleffe et Warnant-Dreye. L'entité fait le lien entre les arrondissements de Huy et de Waremme, où nous desservons déjà Faimes et Braives.",
  },
  wanze: {
    cp: ['4520'],
    villages: ['Wanze', 'Bas-Oha', 'Moha', 'Huccorgne', 'Vinalmont', 'Antheit'],
    // ⚠️ Seule commune du lot dont l'encadré Wikipédia des limitrophes est vide.
    // Ces cinq voisines ne sont pas déduites d'une carte : elles proviennent des
    // articles d'Amay, Burdinne, Héron et Villers-le-Bouillet, qui citent chacun
    // Wanze, et de Huy qui la cite déjà en base. L'adjacence étant symétrique,
    // c'est la même source lue depuis l'autre côté.
    voisines: ['amay', 'burdinne', 'heron', 'villers-le-bouillet', 'huy'],
    intro: "Wanze réunit six villages sous le code postal 4520 : Wanze, Bas-Oha, Moha, Huccorgne, Vinalmont et Antheit. L'entité jouxte Huy et Villers-le-Bouillet, et nous desservons chacun de ses villages.",
  },
};
