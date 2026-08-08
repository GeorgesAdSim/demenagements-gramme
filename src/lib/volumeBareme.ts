// Barème volumétrique — standard sectoriel déménagement.
// Source unique côté client (modale d'ajustement) ; l'Edge Function
// supabase/functions/estimate-volume en embarque une copie (Deno ne peut
// pas importer depuis src/). Toute modification doit être reportée aux deux.

// m³ par unité
export const VOLUME_TABLE: Record<string, number> = {
  // Séjour
  canape_2p: 1.0,      canape_3p: 1.5,      canape_angle: 2.5,
  fauteuil: 0.5,       pouf: 0.2,           table_basse: 0.3,
  meuble_tv: 0.5,      bibliotheque: 0.9,   buffet: 1.2,
  vitrine: 1.0,        commode: 0.6,
  // Chambre
  armoire_2p: 1.5,     armoire_3p: 2.2,     dressing_mobile: 1.0,
  lit_1p: 1.0,         lit_2p: 1.8,         lit_superpose: 2.0,
  matelas_simple: 0.4, matelas_double: 0.7, sommier: 0.5,
  table_de_nuit: 0.2,  berceau: 0.5,        table_a_langer: 0.4,
  // Repas / bureau
  table_repas_4p: 0.8, table_repas_8p: 1.3, chaise: 0.2,
  tabouret: 0.15,      bureau: 0.7,         caisson_bureau: 0.3,
  // Électroménager
  frigo: 0.5,          frigo_americain: 0.9, congelateur: 0.5,
  cuisiniere: 0.4,     four: 0.2,           lave_linge: 0.4,
  seche_linge: 0.4,    lave_vaisselle: 0.4, micro_ondes: 0.1,
  hotte_mobile: 0.2,
  // High-tech
  tv_ecran_plat: 0.2,  ordinateur_fixe: 0.2, imprimante: 0.15,
  enceinte_colonne: 0.2,
  // Extérieur / divers
  velo: 0.5,           trottinette: 0.2,    poussette: 0.3,
  tondeuse: 0.3,       barbecue: 0.4,       salon_jardin: 1.2,
  parasol: 0.2,        etabli: 0.8,         escabeau: 0.2,
  outillage_lot: 0.5,  coffre_rangement: 0.4, valise: 0.15,
  carton_visible: 0.1, machine_sport: 0.8,
  // Spéciaux
  piano_droit: 1.5,    piano_queue: 2.8,    coffre_fort: 0.6,
  aquarium: 0.5,       billard: 2.0,
  objet_divers_volumineux: 0.4,
};

// Volume de contenu dérivé : les cartons qui sortiront des rangements
export const HIDDEN_CONTENT: Record<string, number> = {
  armoire_3p: 1.2,   armoire_2p: 0.8,   dressing_mobile: 0.6,
  commode: 0.4,      buffet: 0.5,       bibliotheque: 0.6,
  vitrine: 0.3,      meuble_tv: 0.2,    caisson_bureau: 0.2,
  coffre_rangement: 0.3, bureau: 0.2,
};

// Multiplicateur selon le remplissage apparent
export const FILL_FACTOR: Record<string, number> = {
  vide: 0, partiel: 0.5, plein: 1.0, inconnu: 0.7,
};

// Coefficient de foisonnement (espace perdu au chargement du camion)
export const LOADING_COEFFICIENT = 1.12;

// Fourchette affichée au client selon la confiance
export const RANGE: Record<string, number> = { high: 0.10, medium: 0.18, low: 0.30 };

// Objets nécessitant une manutention spéciale → bascule vers visite
export const SPECIAL_ITEMS = new Set([
  'piano_droit', 'piano_queue', 'coffre_fort', 'aquarium', 'billard',
]);

// Libellés français pour l'affichage
export const ITEM_LABELS: Record<string, string> = {
  canape_2p: 'Canapé 2 places', canape_3p: 'Canapé 3 places', canape_angle: "Canapé d'angle",
  fauteuil: 'Fauteuil', pouf: 'Pouf', table_basse: 'Table basse',
  meuble_tv: 'Meuble TV', bibliotheque: 'Bibliothèque', buffet: 'Buffet',
  vitrine: 'Vitrine', commode: 'Commode',
  armoire_2p: 'Armoire 2 portes', armoire_3p: 'Armoire 3 portes', dressing_mobile: 'Dressing mobile',
  lit_1p: 'Lit 1 place', lit_2p: 'Lit 2 places', lit_superpose: 'Lit superposé',
  matelas_simple: 'Matelas simple', matelas_double: 'Matelas double', sommier: 'Sommier',
  table_de_nuit: 'Table de nuit', berceau: 'Berceau', table_a_langer: 'Table à langer',
  table_repas_4p: 'Table repas 4 pers.', table_repas_8p: 'Table repas 8 pers.', chaise: 'Chaise',
  tabouret: 'Tabouret', bureau: 'Bureau', caisson_bureau: 'Caisson de bureau',
  frigo: 'Réfrigérateur', frigo_americain: 'Frigo américain', congelateur: 'Congélateur',
  cuisiniere: 'Cuisinière', four: 'Four', lave_linge: 'Lave-linge',
  seche_linge: 'Sèche-linge', lave_vaisselle: 'Lave-vaisselle', micro_ondes: 'Micro-ondes',
  hotte_mobile: 'Hotte mobile',
  tv_ecran_plat: 'TV écran plat', ordinateur_fixe: 'Ordinateur fixe', imprimante: 'Imprimante',
  enceinte_colonne: 'Enceinte colonne',
  velo: 'Vélo', trottinette: 'Trottinette', poussette: 'Poussette',
  tondeuse: 'Tondeuse', barbecue: 'Barbecue', salon_jardin: 'Salon de jardin',
  parasol: 'Parasol', etabli: 'Établi', escabeau: 'Escabeau',
  outillage_lot: "Lot d'outillage", coffre_rangement: 'Coffre de rangement', valise: 'Valise',
  carton_visible: 'Carton', machine_sport: 'Machine de sport',
  piano_droit: 'Piano droit', piano_queue: 'Piano à queue', coffre_fort: 'Coffre-fort',
  aquarium: 'Aquarium', billard: 'Billard',
  objet_divers_volumineux: 'Objet volumineux divers',
};

export interface DetectedItem {
  id: string;
  qty: number;
  fill: string | null;
  note: string | null;
}

export interface RoomComputation {
  volumeMeubles: number;
  volumeCache: number;
}

export function computeRoomVolumes(items: DetectedItem[]): RoomComputation {
  let volumeMeubles = 0;
  let volumeCache = 0;
  for (const item of items) {
    const unit = VOLUME_TABLE[item.id] ?? VOLUME_TABLE.objet_divers_volumineux;
    volumeMeubles += unit * item.qty;
    const hidden = HIDDEN_CONTENT[item.id];
    if (hidden) {
      const factor = FILL_FACTOR[item.fill ?? 'inconnu'] ?? FILL_FACTOR.inconnu;
      volumeCache += hidden * item.qty * factor;
    }
  }
  return { volumeMeubles, volumeCache };
}

export interface EstimationTotals {
  volumeFinal: number;
  volumeMin: number;
  volumeMax: number;
}

export function computeTotals(
  rooms: { items: DetectedItem[] }[],
  confidence: string,
): EstimationTotals {
  let brut = 0;
  for (const room of rooms) {
    const { volumeMeubles, volumeCache } = computeRoomVolumes(room.items);
    brut += volumeMeubles + volumeCache;
  }
  const volumeFinal = brut * LOADING_COEFFICIENT;
  const range = RANGE[confidence] ?? RANGE.low;
  return {
    volumeFinal,
    volumeMin: volumeFinal * (1 - range),
    volumeMax: volumeFinal * (1 + range),
  };
}
