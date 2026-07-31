// Lot « arrondissement de Waremme » — 13 communes.
//
// Ce fichier ne contient QUE des données relevées. Aucune logique : c'est
// scripts/generer-lot-communes.mjs qui décide du statut, en rejouant les
// contraintes CHECK de la table. Ne jamais écrire `statut` ici.
//
// Sources, et rien d'autre :
//   · distances  — Google Maps, itinéraire en voiture depuis Rue des Naiveux 64,
//     4040 Herstal, destination « <Commune>, province de Liège, Belgique ».
//     Le suffixe de province n'est pas décoratif : Geer, Braives et Lincent ont
//     des homonymes ailleurs en Belgique et en France.
//   · limitrophes, codes postaux, sections — articles Wikipédia en français.
//
// Les limitrophes sont filtrées à la province de Liège : une commune du
// Limbourg, de Namur ou du Brabant wallon n'aura jamais de page, et un lien
// vers rien ne vaut pas mieux qu'un lien absent. Elles sont ensuite ramenées à
// cinq au maximum — la contrainte communes_publiee_maillee — en gardant d'abord
// les communes déjà publiées, puis celles publiables dans ce lot, puis l'ordre
// de l'article. Trancher autrement gaspillerait un lien entrant déjà acquis :
// awans, grace-hollogne et flemalle citaient déjà quatre de ces communes avant
// que le lot ne commence.

export const DATE_VERIFICATION = '2026-07-31';

// [km, min] ou [km, min, 'raison de retenir une valeur hors plage'].
//
// Le générateur refuse une ligne dont la vitesse implicite sort de 35-79 km/h
// tant qu'elle ne porte pas de troisième valeur. Trois lignes en portent une :
// leur second relevé a rendu les mêmes chiffres et nommé un itinéraire
// autoroutier. L'E40 traverse la Hesbaye en ligne droite depuis l'échangeur de
// Herstal, là où les valeurs hautes de l'échantillon initial — sprimont,
// aywaille — montaient vers l'Ardenne par l'E25.
//
// berloz et lincent n'ont pas de relevé : bloquées par ailleurs, leur distance
// ne retient rien.
export const DISTANCES = {
  braives:                   [44, 32, 'second relevé identique, via E40'],
  crisnee:                   [21, 16],
  donceel:                   [28, 23],
  faimes:                    [32, 27],
  'fexhe-le-haut-clocher':   [23, 19],
  geer:                      [39, 27, 'second relevé identique (38,7 km), via E40/E42 puis E40'],
  hannut:                    [47, 34, 'second relevé identique (46,8 km), via E40'],
  oreye:                     [26, 22],
  remicourt:                 [27, 23],
  'saint-georges-sur-meuse': [27, 21],
  wasseiges:                 [55, 43],
};

// `infos` — les particularités de terrain — reste absent partout : bâti, accès,
// stationnement et dénivelé ne se déduisent d'aucune source publique. Ils sont
// à faire valider par Gramme, puis à saisir dans le back-office. Une commune se
// publie très bien avec ses seuls villages.
export const DONNEES = {
  berloz: {
    cp: ['4257'],
    villages: ['Berloz', 'Rosoux-Crenwick', 'Corswarem'],
    // Deux limitrophes liégeoises seulement : le reste du pourtour est au
    // Limbourg. Sous le minimum de trois, donc maintenue en brouillon.
    voisines: ['waremme', 'geer'],
    intro: "Berloz ne compte que trois villages — Berloz, Rosoux-Crenwick et Corswarem — réunis sous le seul code postal 4257. Nous y déménageons particuliers et entreprises, dans les trois villages comme au centre de l'entité.",
  },
  braives: {
    cp: ['4260', '4261', '4263'],
    villages: ['Braives', 'Tourinne', 'Latinne', 'Fallais', 'Fumal', 'Ville-en-Hesbaye', 'Ciplet', 'Avennes'],
    voisines: ['hannut', 'geer', 'faimes', 'villers-le-bouillet', 'burdinne'], // wanze écartée au tri à cinq
    intro: "Braives rassemble huit villages, de Fallais à Avennes en passant par Latinne et Ville-en-Hesbaye, répartis sur trois codes postaux : 4260, 4261 et 4263. Nous traitons l'entité comme un seul territoire, d'un village à l'autre.",
  },
  crisnee: {
    cp: ['4367'],
    villages: ['Crisnée', 'Odeur', 'Kemexhe', 'Fize-le-Marsal', 'Thys'],
    voisines: ['oreye', 'awans', 'remicourt'],
    intro: "Crisnée est, de tout l'arrondissement de Waremme, l'entité la plus proche de notre dépôt de Herstal. Elle réunit cinq villages — Crisnée, Odeur, Kemexhe, Fize-le-Marsal et Thys — sous le code postal 4367.",
  },
  donceel: {
    cp: ['4357'],
    villages: ['Donceel', 'Limont', 'Jeneffe', 'Haneffe'],
    voisines: ['waremme', 'remicourt', 'faimes', 'fexhe-le-haut-clocher', 'saint-georges-sur-meuse'], // verlaine écartée
    intro: "Donceel regroupe quatre villages : Donceel, Limont, Jeneffe et Haneffe, tous sous le code postal 4357. L'entité borde Waremme et Remicourt, deux communes où nous intervenons déjà.",
  },
  faimes: {
    cp: ['4317'],
    // L'entité n'a pas de village homonyme : aucune section ne s'appelle Faimes.
    villages: ['Celles', 'Borlez', 'Les Waleffes', 'Viemme', 'Aineffe'],
    voisines: ['geer', 'waremme', 'braives', 'donceel', 'villers-le-bouillet'], // verlaine écartée
    intro: "Faimes est une entité sans village homonyme : son nom désigne le regroupement de Celles, Borlez, Les Waleffes, Viemme et Aineffe, sous le code postal 4317. Nous intervenons dans les cinq villages, quelle que soit l'adresse indiquée sur le devis.",
  },
  'fexhe-le-haut-clocher': {
    cp: ['4347'],
    villages: ['Fexhe-le-Haut-Clocher', 'Voroux-Goreux', 'Roloux', 'Noville', 'Freloux'],
    voisines: ['remicourt', 'crisnee', 'donceel', 'awans', 'grace-hollogne'],
    intro: "Fexhe-le-Haut-Clocher réunit cinq villages sous le code postal 4347 : Fexhe, Voroux-Goreux, Roloux, Noville et Freloux. L'entité touche Awans et Grâce-Hollogne, à moins de vingt-cinq kilomètres de notre dépôt.",
  },
  geer: {
    cp: ['4250', '4252', '4253', '4254'],
    villages: ['Geer', 'Boëlhe', 'Hollogne-sur-Geer', 'Darion', 'Omal', 'Ligney', 'Lens-Saint-Servais'],
    voisines: ['berloz', 'hannut', 'waremme', 'braives', 'faimes'],
    intro: "Geer porte quatre codes postaux — 4250, 4252, 4253 et 4254 — pour sept villages, dont Hollogne-sur-Geer, Omal et Lens-Saint-Servais. C'est l'entité la plus fragmentée de l'arrondissement sur le plan postal, et nous couvrons chacun de ses villages.",
  },
  hannut: {
    cp: ['4280'],
    villages: ['Hannut', 'Avernas-le-Bauduin', 'Bertrée', 'Cras-Avernas', 'Poucet', 'Abolens', 'Blehen', 'Lens-Saint-Remy', 'Villers-le-Peuplier', 'Crehen', 'Trognée', 'Avin', 'Moxhe', 'Thisnes', 'Merdorp', 'Grand-Hallet', 'Petit-Hallet', 'Wansin'],
    voisines: ['lincent', 'geer', 'wasseiges', 'burdinne', 'braives'],
    intro: "Hannut réunit dix-huit villages sous un unique code postal, le 4280 : Avin, Thisnes, Crehen, Merdorp, Wansin ou encore Grand-Hallet. Deux adresses « à Hannut » peuvent donc se trouver à plusieurs kilomètres l'une de l'autre.",
  },
  lincent: {
    cp: ['4287'],
    villages: ['Lincent', 'Pellaines', 'Racour'],
    // Hannut est sa SEULE limitrophe liégeoise : le reste est en Brabant wallon
    // et au Limbourg. Maintenue en brouillon.
    voisines: ['hannut'],
    intro: "Lincent réunit trois villages — Lincent, Pellaines et Racour — sous le code postal 4287. L'entité se situe à la limite occidentale de la province de Liège : Hannut est sa seule commune limitrophe liégeoise.",
  },
  oreye: {
    cp: ['4360'],
    villages: ['Oreye', 'Otrange', 'Lens-sur-Geer', 'Grandville', 'Bergilers'],
    voisines: ['waremme', 'crisnee', 'remicourt'],
    intro: "Oreye regroupe cinq villages sous le code postal 4360 : Oreye, Otrange, Lens-sur-Geer, Grandville et Bergilers. L'entité se trouve entre Waremme et Crisnée, à un peu plus de vingt-cinq kilomètres de notre dépôt de Herstal.",
  },
  remicourt: {
    cp: ['4350', '4351'],
    villages: ['Remicourt', 'Lamine', 'Pousset', 'Hodeige', 'Momalle'],
    voisines: ['oreye', 'crisnee', 'waremme', 'donceel', 'fexhe-le-haut-clocher'],
    intro: "Remicourt réunit cinq villages — Remicourt, Lamine, Pousset, Hodeige et Momalle — répartis sur deux codes postaux, 4350 et 4351. Nous y intervenons depuis Herstal en une vingtaine de minutes.",
  },
  'saint-georges-sur-meuse': {
    cp: ['4470'],
    // L'article ne rend aucune section. C'est la seule commune du lot dont
    // l'introduction est indispensable et non facultative : sans elle, un
    // `villages` vide ferait échouer la contrainte de contenu.
    villages: [],
    voisines: ['donceel', 'grace-hollogne', 'verlaine', 'flemalle', 'amay'], // engis écartée
    intro: "Saint-Georges-sur-Meuse porte le code postal 4470 et fait le lien entre le plateau de Hesbaye et la vallée de la Meuse. Nous y intervenons dans le prolongement de Flémalle, que nous desservons déjà.",
  },
  wasseiges: {
    cp: ['4219'],
    villages: ['Wasseiges', 'Meeffe', 'Ambresin', 'Acosse'],
    // Borde la province de Namur ; seules Hannut et Burdinne la relient au
    // reste de la province de Liège. Maintenue en brouillon.
    voisines: ['hannut', 'burdinne'],
    intro: "Wasseiges réunit quatre villages sous le code postal 4219 : Wasseiges, Meeffe, Ambresin et Acosse. L'entité borde la province de Namur, et seules Hannut et Burdinne la relient au reste de la province de Liège.",
  },
};
