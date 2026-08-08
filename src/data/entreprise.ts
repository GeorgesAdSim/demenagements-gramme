/**
 * Identité de l'entreprise — source unique.
 *
 * Pourquoi ce fichier existe : l'adresse du siège était recopiée à la main dans
 * vingt-deux endroits — pied de page, barre du haut, formulaires, deux blocs
 * JSON-LD distincts, quatre pages légales, llms.txt, le gabarit de l'éditeur
 * d'administration. Au déménagement du siège de Herstal vers Seraing, le site a
 * servi pendant un temps deux adresses différentes sur la même page : le corps
 * de texte annonçait Seraing, le pied de page et le balisage structuré
 * disaient encore Herstal.
 *
 * Une adresse qui figure sur des mentions légales et dans un `PostalAddress`
 * n'a pas le droit d'exister en vingt-deux exemplaires. Elle est ici, et
 * nulle part ailleurs.
 *
 * ⚠️ Le SIÈGE SOCIAL et le DÉPÔT sont deux lieux distincts. Les camions partent
 * du dépôt (rue de la Digue, à Oupeye), et c'est depuis lui que sont mesurées
 * toutes les distances de `src/data/communes.json`. Confondre les deux avait
 * déjà faussé trente-sept relevés. Ne jamais substituer l'un à l'autre.
 */

export const ENTREPRISE = {
  raisonSociale: 'Déménagements Gramme',
  formeJuridique: 'Société à responsabilité limitée (SRL)',
  tva: 'BE 0775.264.382',

  /**
   * Siège social, voie du Belvédère 1 à Seraing depuis août 2026.
   *
   * Le code postal et la position ont été confirmés par géocodage
   * indépendant : 4100, 50.60303 / 5.52728, à une quinzaine de mètres des
   * coordonnées communiquées par Gramme. Les fonds de carte tiers portaient
   * encore le nom de l'occupant précédent lors de la vérification — l'adresse
   * et le point, eux, sont exacts.
   */
  adresse: {
    rue: 'Voie du Belvédère 1',
    codePostal: '4100',
    localite: 'Seraing',
    province: 'Liège',
    pays: 'Belgique',
    codePays: 'BE',
  },

  geo: {
    latitude: 50.6031529,
    longitude: 5.5273906,
  },

  telephone: {
    affichage: '04 264 50 16',
    international: '+32(0)4 264 50 16',
    lien: '+3242645016',
  },
  fax: '+32(0)4 264 37 73',
  email: 'contact@demenagements-gramme.be',
} as const;

/** « Voie du Belvédère 1, 4100 Seraing » — pied de page, barre du haut, formulaires. */
export const ADRESSE_COURTE =
  `${ENTREPRISE.adresse.rue}, ${ENTREPRISE.adresse.codePostal} ${ENTREPRISE.adresse.localite}`;

/** « Voie du Belvédère 1, 4100 Seraing (Liège), Belgique » — pages légales. */
export const ADRESSE_LEGALE =
  `${ADRESSE_COURTE} (${ENTREPRISE.adresse.province}), ${ENTREPRISE.adresse.pays}`;

/** « Voie du Belvédère 1, 4100 Seraing, Belgique » — courrier, llms.txt, WebMCP. */
export const ADRESSE_POSTALE =
  `${ADRESSE_COURTE}, ${ENTREPRISE.adresse.pays}`;

/** Nœud `PostalAddress` de schema.org, identique dans tous les blocs JSON-LD. */
export const POSTAL_ADDRESS = {
  '@type': 'PostalAddress',
  streetAddress: ENTREPRISE.adresse.rue,
  addressLocality: ENTREPRISE.adresse.localite,
  postalCode: ENTREPRISE.adresse.codePostal,
  addressCountry: ENTREPRISE.adresse.codePays,
} as const;

/** Nœud `GeoCoordinates` de schema.org. */
export const GEO_COORDINATES = {
  '@type': 'GeoCoordinates',
  latitude: ENTREPRISE.geo.latitude,
  longitude: ENTREPRISE.geo.longitude,
} as const;

/**
 * Carte intégrée, construite à partir des coordonnées plutôt que d'un
 * identifiant de lieu.
 *
 * L'ancienne iframe portait un jeton `pb=` opaque, impossible à relire et
 * pointant l'adresse précédente. Une requête sur les coordonnées affiche le
 * bon point sans dépendre d'une fiche d'établissement tierce, dont le libellé
 * peut être périmé.
 */
export const CARTE_EMBED_URL =
  `https://maps.google.com/maps?q=${ENTREPRISE.geo.latitude},${ENTREPRISE.geo.longitude}&z=16&output=embed`;
