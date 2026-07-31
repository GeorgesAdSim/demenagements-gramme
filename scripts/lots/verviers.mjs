// Lot « arrondissement de Verviers » — 29 communes.
//
// Ce fichier ne contient QUE des données relevées. Aucune logique : c'est
// scripts/generer-lot-communes.mjs qui décide du statut, en rejouant les
// contraintes CHECK de la table. Ne jamais écrire `statut` ici.
//
// Sources, et rien d'autre :
//   · distances  — PAS ici. Elles vivent dans scripts/distances.mjs, source
//     unique pour les 84 communes. Aucune introduction ne doit énoncer une
//     distance ni une durée.
//   · limitrophes, codes postaux, sections — articles Wikipédia en français.
//
// ─────────────────────────────────────────────────────────────────────────────
// Deux particularités de cet arrondissement
//
// 1. Il est frontalier sur presque tout son pourtour. Le filtrage à la province
//    de Liège y retire beaucoup : Vielsalm, citée par lierneux, trois-ponts,
//    burg-reuland et saint-vith, est en province de Luxembourg. C'est ce
//    retrait qui fait tomber lierneux à deux limitrophes liégeoises, sous le
//    minimum de trois.
//
// 2. Neuf communes relèvent de la Communauté germanophone. Leurs données sont
//    relevées et enregistrées, mais elles portent `enAttente` : une part de
//    leur population cherche en allemand, et le gabarit n'a aucune notion de
//    langue. Publier une page française seule y capterait mal la demande.
//    Sans ce champ elles se publieraient d'elles-mêmes, leurs données étant
//    complètes — le statut est déduit, et une donnée complète vaut publication.
//    Leurs introductions ne sont pas rédigées : les écrire en français
//    présumerait la réponse.
// ─────────────────────────────────────────────────────────────────────────────

export const DATE_VERIFICATION = '2026-07-31';

const ATTENTE_DE = 'commune de la Communauté germanophone — arbitrage en cours sur une version allemande des pages';

export const DONNEES = {
  // ── Les 19 publiables ──────────────────────────────────────────────────────
  aubel: {
    cp: ['4880'],
    // L'article ne rend aucune section : l'introduction est ici indispensable,
    // c'est elle qui satisfait la contrainte de contenu.
    villages: [],
    voisines: ['dalhem', 'plombieres', 'herve', 'thimister-clermont', 'welkenraedt'],
    intro: "Aubel porte le code postal 4880 et borde Dalhem, où nous intervenons déjà. L'entité se situe au cœur du pays de Herve, entre Plombières et Thimister-Clermont.",
  },
  baelen: {
    cp: ['4837'],
    villages: ['Baelen', 'Membach'],
    voisines: ['limbourg', 'welkenraedt', 'lontzen', 'jalhay', 'waimes'], // eupen écartée
    intro: "Baelen ne compte que deux villages, Baelen et Membach, sous le code postal 4837. L'entité borde Limbourg et Welkenraedt, et touche la Communauté germanophone par Lontzen.",
  },
  dison: {
    cp: ['4820', '4821'],
    villages: ['Dison', 'Andrimont'],
    voisines: ['herve', 'thimister-clermont', 'welkenraedt', 'verviers', 'limbourg'],
    intro: "Dison réunit deux villages, Dison et Andrimont, sur deux codes postaux, 4820 et 4821. L'entité jouxte Verviers et Herve, deux communes que nous desservons.",
  },
  herve: {
    cp: ['4650', '4651', '4652', '4653', '4654'],
    villages: ['Herve', 'Charneux', 'Battice', 'Chaineux', 'Grand-Rechain', 'Xhendelesse', 'Bolland', 'Julémont'],
    // 9 limitrophes liégeoises, le maximum de l'arrondissement ; olne,
    // pepinster, dison et verviers écartées au tri à cinq.
    voisines: ['dalhem', 'aubel', 'blegny', 'soumagne', 'thimister-clermont'],
    intro: "Herve réunit huit villages sur cinq codes postaux, de 4650 à 4654 : Herve, Charneux, Battice, Chaineux, Grand-Rechain, Xhendelesse, Bolland et Julémont. Avec neuf communes limitrophes en province de Liège, c'est l'entité la plus entourée de l'arrondissement.",
  },
  jalhay: {
    cp: ['4845'],
    villages: ['Jalhay', 'Sart-lez-Spa'],
    voisines: ['verviers', 'limbourg', 'baelen', 'theux', 'spa'], // stavelot, malmedy écartées
    intro: "Jalhay ne compte que deux villages, Jalhay et Sart-lez-Spa, sous le code postal 4845. Avec sept limitrophes liégeoises, l'entité touche aussi bien l'agglomération verviétoise que Malmedy et Stavelot.",
  },
  lierneux: {
    cp: ['4990'],
    villages: ['Lierneux', 'Bra', 'Arbrefontaine'],
    // Vielsalm, sa troisième limitrophe, est en province de Luxembourg. Il ne
    // reste que deux communes liégeoises : sous le minimum, donc brouillon.
    voisines: ['stoumont', 'trois-ponts'],
    intro: "Lierneux réunit trois villages sous le code postal 4990 : Lierneux, Bra et Arbrefontaine. L'entité est au contact de la province de Luxembourg — Stoumont et Trois-Ponts sont ses seules limitrophes liégeoises.",
  },
  limbourg: {
    cp: ['4830', '4831', '4834'],
    villages: ['Limbourg', 'Bilstain', 'Goé'],
    voisines: ['welkenraedt', 'dison', 'verviers', 'baelen', 'jalhay'],
    intro: "Limbourg réunit trois villages — Limbourg, Bilstain et Goé — répartis sur trois codes postaux, 4830, 4831 et 4834. L'entité ne doit pas être confondue avec la province du même nom, qui est flamande et située plus au nord.",
  },
  malmedy: {
    cp: ['4960'],
    villages: ['Malmedy', 'Bellevaux-Ligneuville', 'Bévercé'],
    voisines: ['jalhay', 'stavelot', 'waimes', 'saint-vith', 'ambleve'],
    intro: "Malmedy réunit trois villages sous le code postal 4960 : Malmedy, Bellevaux-Ligneuville et Bévercé. L'entité borde la Communauté germanophone par Amblève et Saint-Vith.",
  },
  olne: {
    cp: ['4877'],
    villages: [],
    voisines: ['soumagne', 'fleron', 'trooz', 'herve', 'pepinster'],
    intro: "Olne porte le code postal 4877 et borde trois communes de l'arrondissement de Liège — Soumagne, Fléron et Trooz — que nous desservons déjà, ainsi que Herve et Pepinster.",
  },
  pepinster: {
    cp: ['4860', '4861'],
    villages: ['Pepinster', 'Cornesse', 'Soiron', 'Wegnez'],
    voisines: ['herve', 'olne', 'trooz', 'sprimont', 'verviers'], // theux écartée
    intro: "Pepinster réunit quatre villages — Pepinster, Cornesse, Soiron et Wegnez — sur deux codes postaux, 4860 et 4861. L'entité borde Verviers et Theux, et touche l'arrondissement de Liège par Trooz et Sprimont.",
  },
  plombieres: {
    cp: ['4850', '4851', '4852'],
    // Aucune section ne porte le nom de l'entité.
    villages: ['Gemmenich', 'Hombourg', 'Montzen', 'Moresnet', 'Sippenaeken'],
    voisines: ['la-calamine', 'aubel', 'welkenraedt', 'lontzen'],
    intro: "Plombières est une entité sans village homonyme : son nom désigne le regroupement de Gemmenich, Hombourg, Montzen, Moresnet et Sippenaeken, répartis sur les codes postaux 4850, 4851 et 4852. Elle borde la Communauté germanophone par La Calamine et Lontzen.",
  },
  spa: {
    cp: ['4900'],
    villages: [],
    voisines: ['theux', 'jalhay', 'stoumont', 'stavelot'],
    intro: "Spa porte le code postal 4900 et borde Theux, Jalhay, Stoumont et Stavelot. Nous y intervenons comme dans les quatre communes qui l'entourent.",
  },
  stavelot: {
    cp: ['4970'],
    villages: ['Stavelot', 'Francorchamps'],
    voisines: ['spa', 'jalhay', 'stoumont', 'malmedy', 'trois-ponts'], // saint-vith écartée
    intro: "Stavelot ne compte que deux villages, Stavelot et Francorchamps, sous le code postal 4970. L'entité borde Spa et Malmedy, et touche la Communauté germanophone par Saint-Vith.",
  },
  stoumont: {
    cp: ['4987'],
    villages: ['Stoumont', 'Chevron', 'La Gleize', 'Lorcé', 'Rahier'],
    voisines: ['aywaille', 'theux', 'spa', 'ferrieres', 'stavelot'], // lierneux, trois-ponts écartées
    intro: "Stoumont réunit cinq villages sous le code postal 4987 : Stoumont, Chevron, La Gleize, Lorcé et Rahier. C'est la seule commune de l'arrondissement de Verviers à toucher celui de Huy, par Ferrières.",
  },
  theux: {
    cp: ['4910'],
    villages: ['Theux', 'Polleur', 'La Reid'],
    // Encadré des limitrophes absent de l'article. Ces voisines proviennent des
    // articles de jalhay, pepinster, spa, stoumont, verviers, aywaille et
    // sprimont, qui citent chacun Theux : l'adjacence étant symétrique, c'est
    // la même source lue depuis l'autre côté.
    voisines: ['jalhay', 'pepinster', 'spa', 'aywaille', 'sprimont'],
    intro: "Theux réunit trois villages sous le code postal 4910 : Theux, Polleur et La Reid. L'entité se situe entre Verviers et Spa, et touche l'arrondissement de Liège par Aywaille et Sprimont.",
  },
  'thimister-clermont': {
    cp: ['4890'],
    villages: ['Clermont', 'Thimister'],
    // Encadré absent : voisines reconstruites depuis aubel, dison, herve et
    // welkenraedt, qui citent chacun Thimister-Clermont.
    voisines: ['aubel', 'dison', 'herve', 'welkenraedt'],
    intro: "Thimister-Clermont tient son nom de ses deux villages, Thimister et Clermont, réunis sous le code postal 4890. Elle borde Herve, Aubel, Dison et Welkenraedt, où nous intervenons également.",
  },
  'trois-ponts': {
    cp: ['4980', '4983'],
    villages: ['Basse-Bodeux', 'Fosse', 'Wanne'],
    voisines: ['stoumont', 'stavelot', 'saint-vith', 'lierneux'],
    intro: "Trois-Ponts réunit Basse-Bodeux, Fosse et Wanne sous les codes postaux 4980 et 4983 — aucune de ses trois anciennes communes ne porte le nom de l'entité. Elle borde Stoumont et Stavelot, que nous desservons déjà.",
  },
  verviers: {
    cp: ['4800', '4801', '4802'],
    villages: ['Verviers', 'Ensival', 'Heusy', 'Lambermont', 'Petit-Rechain', 'Stembert'],
    voisines: ['herve', 'dison', 'pepinster', 'limbourg', 'theux'], // jalhay écartée
    intro: "Verviers réunit six villages sur trois codes postaux, de 4800 à 4802 : Verviers, Ensival, Heusy, Lambermont, Petit-Rechain et Stembert. C'est le chef-lieu de l'arrondissement, et six communes le bordent en province de Liège.",
  },
  waimes: {
    cp: ['4950'],
    villages: ['Waimes', 'Faymonville', 'Robertville'],
    voisines: ['jalhay', 'baelen', 'eupen', 'malmedy', 'butgenbach'], // ambleve écartée
    intro: "Waimes réunit trois villages sous le code postal 4950 : Waimes, Faymonville et Robertville. L'entité est entourée de communes germanophones — Eupen, Butgenbach et Amblève — et borde Malmedy et Jalhay.",
  },
  welkenraedt: {
    cp: ['4840', '4841'],
    villages: ['Welkenraedt', 'Henri-Chapelle'],
    voisines: ['thimister-clermont', 'aubel', 'plombieres', 'dison', 'limbourg'], // lontzen, baelen écartées
    intro: "Welkenraedt ne compte que deux villages, Welkenraedt et Henri-Chapelle, sur deux codes postaux, 4840 et 4841. Avec sept limitrophes liégeoises, l'entité fait la jonction entre le pays de Herve et la Communauté germanophone.",
  },

  // ── Les 9 germanophones : données enregistrées, publication en attente ──────
  // Pas d'`intro` : la rédiger en français présumerait l'arbitrage.
  ambleve: {
    cp: ['4770', '4771'],
    villages: ['Amblève', 'Heppenbach', 'Meyerode'],
    voisines: ['malmedy', 'waimes', 'butgenbach', 'bullange', 'saint-vith'],
    enAttente: ATTENTE_DE,
  },
  bullange: {
    cp: ['4760', '4761'],
    villages: ['Bullange', 'Rocherath', 'Manderfeld'],
    voisines: ['butgenbach', 'ambleve', 'saint-vith'],
    enAttente: ATTENTE_DE,
  },
  'burg-reuland': {
    cp: ['4790', '4791'],
    villages: ['Thommen', 'Reuland'],
    // Vielsalm, sa seconde limitrophe, est en province de Luxembourg : il ne
    // reste que Saint-Vith. Sous le minimum de trois, indépendamment de
    // l'arbitrage linguistique.
    voisines: ['saint-vith'],
    enAttente: ATTENTE_DE,
  },
  butgenbach: {
    cp: ['4750'],
    villages: ['Bütgenbach', 'Elsenborn'],
    voisines: ['waimes', 'bullange', 'ambleve'],
    enAttente: ATTENTE_DE,
  },
  eupen: {
    cp: ['4700', '4701'],
    villages: ['Eupen', 'Kettenis'],
    voisines: ['lontzen', 'raeren', 'baelen', 'waimes'],
    enAttente: ATTENTE_DE,
  },
  'la-calamine': {
    cp: ['4720', '4721', '4728'],
    villages: ['La Calamine', 'Neu-Moresnet', 'Hergenrath'],
    voisines: ['plombieres', 'raeren', 'lontzen'],
    enAttente: ATTENTE_DE,
  },
  lontzen: {
    cp: ['4710', '4711'],
    villages: ['Lontzen', 'Herbesthal', 'Walhorn'],
    // Encadré absent : voisines reconstruites depuis baelen, plombieres,
    // welkenraedt, eupen, la-calamine et raeren.
    voisines: ['baelen', 'plombieres', 'welkenraedt', 'eupen', 'la-calamine'],
    enAttente: ATTENTE_DE,
  },
  raeren: {
    cp: ['4730', '4731'],
    villages: ['Raeren', 'Hauset', 'Eynatten'],
    voisines: ['la-calamine', 'lontzen', 'eupen'],
    enAttente: ATTENTE_DE,
  },
  'saint-vith': {
    cp: ['4780', '4782', '4783', '4784'],
    villages: ['Saint-Vith', 'Recht', 'Schoenberg', 'Lommersweiler', 'Crombach'],
    voisines: ['trois-ponts', 'stavelot', 'malmedy', 'ambleve', 'bullange'], // burg-reuland écartée
    enAttente: ATTENTE_DE,
  },
};
