// Distances routières depuis le dépôt, pour les 84 communes.
//
// Source UNIQUE. Elles vivaient auparavant dans chaque fichier de lot, ce qui
// était une erreur : une distance ne dépend pas du lot éditorial, elle dépend
// d'une seule chose — l'adresse d'où partent les camions. Le jour où cette
// adresse change, tout se refait en bloc. Réparties dans trois fichiers de lot,
// certaines auraient été oubliées.
//
// ─────────────────────────────────────────────────────────────────────────────
// ORIGINE : Rue de la Digue, 4683 Oupeye
//
// C'est le dépôt d'où partent les camions, et NON le siège social, situé rue
// des Naiveux 64 à Herstal. Les 37 premiers relevés étaient partis du siège :
// ils annonçaient Herstal à 0 km, et surtout ils décrivaient mal les frais
// d'approche, que les pages communes présentent comme la raison d'être de
// cette proximité.
//
// Relevé du 2026-07-31, Google Maps, itinéraire en voiture, premier itinéraire
// proposé, destination « <Commune>, province de Liège, Belgique ».
// ─────────────────────────────────────────────────────────────────────────────
//
// Format : [km, min] ou [km, min, 'raison de retenir une valeur hors plage'].
//
// Deux contrôles ont servi à valider ce relevé, et le second mérite d'être
// réutilisé lors du prochain changement d'origine :
//
//  · vitesse implicite, km ÷ (min/60), attendue entre 35 et 87 km/h AU-DESSUS
//    de 15 km. En dessous, la part d'accès urbain domine et une moyenne de
//    24 km/h sur 4 km est normale : le contrôle ne s'y applique pas.
//
//  · inégalité triangulaire. Les deux origines successives sont distantes
//    d'environ 4 à 6 km par la route ; pour toute destination, l'écart entre
//    l'ancienne et la nouvelle mesure ne peut donc pas dépasser cette valeur.
//    L'écart médian observé est de +1 km. Deux lignes le violaient — huy à
//    +11 km et oreye à +6 — et un second relevé a confirmé les nouvelles
//    valeurs : ce sont les anciennes qui étaient fausses. Ce contrôle ne
//    dépend d'aucune hypothèse sur le trafic, contrairement à la vitesse, et
//    c'est lui qui a détecté ce que la vitesse avait laissé passer.

export const ORIGINE = 'Rue de la Digue, 4683 Oupeye';
export const DATE_RELEVE = '2026-07-31';

export const DISTANCES = {

  // ── Liège — 24 communes
  ans:                       [12, 15], // 48.0 km/h
  awans:                     [16, 14], // 68.6 km/h
  aywaille:                  [47, 39], // 72.3 km/h
  bassenge:                  [10, 15], // 40.0 km/h
  'beyne-heusay':            [11, 20], // 33.0 km/h
  blegny:                    [10, 15], // 40.0 km/h
  chaudfontaine:             [28, 26], // 64.6 km/h
  'comblain-au-pont':        [52, 44], // 70.9 km/h
  dalhem:                    [11, 17], // 38.8 km/h
  esneux:                    [38, 36], // 63.3 km/h
  flemalle:                  [27, 24], // 67.5 km/h
  fleron:                    [15, 24], // 37.5 km/h
  'grace-hollogne':          [18, 18], // 60.0 km/h
  herstal:                   [ 4, 10], // 24.0 km/h
  juprelle:                  [15, 18], // 50.0 km/h
  liege:                     [12, 21], // 34.3 km/h
  neupre:                    [31, 31], // 60.0 km/h
  oupeye:                    [ 3,  5], // 36.0 km/h
  'saint-nicolas':           [18, 18], // 60.0 km/h
  seraing:                   [23, 22], // 62.7 km/h
  soumagne:                  [13, 17], // 45.9 km/h
  sprimont:                  [43, 33], // 78.2 km/h
  trooz:                     [20, 29], // 41.4 km/h
  vise:                      [ 7, 14], // 30.0 km/h

  // ── Waremme — 14 communes
  berloz:                    [38, 27], // 84.4 km/h
  braives:                   [45, 34], // 79.4 km/h
  crisnee:                   [22, 18], // 73.3 km/h
  donceel:                   [29, 24], // 72.5 km/h
  faimes:                    [33, 28], // 70.7 km/h
  'fexhe-le-haut-clocher':   [23, 20], // 69.0 km/h
  geer:                      [39, 28], // 83.6 km/h
  hannut:                    [48, 35], // 82.3 km/h
  lincent:                   [47, 31, 'confirmé depuis deux origines différentes (92 km/h depuis Herstal), trajet E40 intégral'], // 91.0 km/h
  oreye:                     [32, 24], // 80.0 km/h
  remicourt:                 [27, 24], // 67.5 km/h
  'saint-georges-sur-meuse': [27, 22], // 73.6 km/h
  waremme:                   [30, 24], // 75.0 km/h
  wasseiges:                 [56, 45], // 74.7 km/h

  // ── Huy — 17 communes
  amay:                      [35, 31], // 67.7 km/h
  anthisnes:                 [46, 44], // 62.7 km/h
  burdinne:                  [51, 38], // 80.5 km/h
  clavier:                   [52, 49], // 63.7 km/h
  engis:                     [31, 28], // 66.4 km/h
  ferrieres:                 [64, 46], // 83.5 km/h
  hamoir:                    [60, 53], // 67.9 km/h
  heron:                     [48, 34], // 84.7 km/h
  huy:                       [46, 37], // 74.6 km/h
  marchin:                   [58, 46], // 75.7 km/h
  modave:                    [48, 48], // 60.0 km/h
  nandrin:                   [37, 38], // 58.4 km/h
  ouffet:                    [50, 47], // 63.8 km/h
  tinlot:                    [41, 42], // 58.6 km/h
  verlaine:                  [29, 25], // 69.6 km/h
  'villers-le-bouillet':     [35, 25], // 84.0 km/h
  wanze:                     [41, 29], // 84.8 km/h

  // ── Verviers — 29 communes
  ambleve:                   [70, 55], // 76.4 km/h
  aubel:                     [27, 27], // 60.0 km/h
  baelen:                    [33, 29], // 68.3 km/h
  bullange:                  [79, 65], // 72.9 km/h
  'burg-reuland':            [83, 63], // 79.0 km/h
  butgenbach:                [68, 63], // 64.8 km/h
  dison:                     [21, 20], // 63.0 km/h
  eupen:                     [33, 34], // 58.2 km/h
  herve:                     [15, 19], // 47.4 km/h
  jalhay:                    [34, 39], // 52.3 km/h
  'la-calamine':             [35, 35], // 60.0 km/h
  lierneux:                  [75, 56], // 80.4 km/h
  limbourg:                  [27, 29], // 55.9 km/h
  lontzen:                   [34, 30], // 68.0 km/h
  malmedy:                   [52, 45], // 69.3 km/h
  olne:                      [17, 24], // 42.5 km/h
  pepinster:                 [28, 31], // 54.2 km/h
  plombieres:                [36, 35], // 61.7 km/h
  raeren:                    [42, 34], // 74.1 km/h
  'saint-vith':              [71, 54], // 78.9 km/h
  spa:                       [41, 38], // 64.7 km/h
  stavelot:                  [51, 46], // 66.5 km/h
  stoumont:                  [62, 51], // 72.9 km/h
  theux:                     [33, 35], // 56.6 km/h
  'thimister-clermont':      [22, 23], // 57.4 km/h
  'trois-ponts':             [57, 52], // 65.8 km/h
  verviers:                  [26, 30], // 52.0 km/h
  waimes:                    [60, 56], // 64.3 km/h
  welkenraedt:               [31, 28], // 66.4 km/h
};

// ─────────────────────────────────────────────────────────────────────────────
// Contrôle de cohérence — vit ici, avec les données qu'il valide.
// ─────────────────────────────────────────────────────────────────────────────

// La plage ne s'applique qu'au-dessus de `distanceMin`. En dessous, la part
// d'accès urbain domine le trajet et une moyenne basse est normale : Herstal, à
// 4 km, ressort à 24 km/h et Visé à 30. Leur appliquer le plancher de 35 ne
// signalait pas une erreur de relevé, il signalait que le détecteur n'était pas
// à l'échelle. Sous ce seuil, seul un plancher grossier reste utile.
export const CONTROLE_VITESSE = { min: 35, max: 87, minCourt: 15, distanceMin: 15 };

/**
 * Vérifie une ligne de relevé. Empile un message dans `erreurs` si la vitesse
 * implicite sort de la plage sans justification écrite.
 *
 * Une valeur hors plage n'est pas fausse par nature — braives, geer, hannut et
 * lincent sortent à 82-91 km/h et sont réelles, l'E40 traversant la Hesbaye en
 * ligne droite. Mais elle ne doit jamais être retenue par distraction : il faut
 * un second relevé, puis une raison écrite dans la troisième valeur.
 */
export function controlerVitesse(id, entree, erreurs) {
  const [km, min, confirmation] = entree;
  const v = km / (min / 60);
  const court = km < CONTROLE_VITESSE.distanceMin;
  const plancher = court ? CONTROLE_VITESSE.minCourt : CONTROLE_VITESSE.min;
  const { max: plafond } = CONTROLE_VITESSE;

  if ((v < plancher || v > plafond) && !confirmation) {
    erreurs.push(
      `${id} : ${km} km en ${min} min, soit ${v.toFixed(1)} km/h — hors de la plage ` +
      `${plancher}-${plafond} km/h${court ? ' (trajet court, plancher abaissé)' : ''}. ` +
      `Refais le relevé. S'il rend les mêmes valeurs, ajoute une troisième valeur ` +
      `à la ligne expliquant pourquoi elle est retenue.`
    );
  }
  return { km, min, v, confirmation };
}
