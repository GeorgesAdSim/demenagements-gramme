// TODO: Remplacer par les vraies photos de Déménagements Gramme
// (équipe, camions, dépôt) une fois le shooting réalisé.

/** Construit une URL Unsplash à la largeur et à la qualité voulues. */
const unsplash = (id: string, w: number, q = 70) =>
  `https://images.unsplash.com/${id}?w=${w}&q=${q}&auto=format&fit=crop`;

/** Génère un srcset à partir d'une liste de largeurs. */
const srcSet = (id: string, widths: number[], q = 70) =>
  widths.map((w) => `${unsplash(id, w, q)} ${w}w`).join(', ');

const HERO_ID = 'photo-1600518464441-9154a4dea21b';

export const SITE_IMAGES = {
  hero: {
    // Le navigateur choisit UNE seule largeur via srcset/sizes. Avant, trois
    // variantes de cette même photo étaient téléchargées : le preload figé à
    // 1200px, le rendu mobile à 800px, et la carte de service à 1400px —
    // ~290 Kio pour une seule image (constaté sur PageSpeed Insights).
    // Qualité 60 : l'image est recouverte d'un aplat bleu à 75 % d'opacité,
    // sa finesse est invisible. Inutile de payer une compression légère.
    id: HERO_ID,
    src: unsplash(HERO_ID, 1200, 60),
    srcSet: srcSet(HERO_ID, [640, 828, 1200, 1600], 60),
    alt: 'Équipe Déménagements Gramme chargeant un camion à Liège',
  },
  // Photo affichée en ~343 px de large sur mobile et ~600 px sur desktop,
  // mais servie en 900 px fixes et sans srcset. Elle apparaît deux fois
  // (section « Pourquoi nous » et bloc contact), ce qui en faisait la plus
  // lourde des images restantes après l'optimisation du hero.
  team: {
    src: unsplash('photo-1581578731548-c64695cc6952', 600, 65),
    srcSet: srcSet('photo-1581578731548-c64695cc6952', [400, 600, 900], 65),
    alt: 'Équipe professionnelle de déménageurs Gramme',
  },
  truck: {
    src: 'https://images.unsplash.com/photo-1566576721346-d4a3b4eaeb55?w=900&q=75&auto=format&fit=crop',
    alt: 'Camion de déménagement Déménagements Gramme',
  },
  warehouse: {
    src: 'https://images.unsplash.com/photo-1586528116311-ad8dd3c8310d?w=900&q=75&auto=format&fit=crop',
    alt: 'Entrepôt garde-meubles sécurisé Déménagements Gramme à Herstal',
  },
  packing: {
    src: 'https://images.unsplash.com/photo-1600880292203-757bb62b4baf?w=900&q=75&auto=format&fit=crop',
    alt: 'Emballage professionnel de biens fragiles par Déménagements Gramme',
  },
  testimonialAvatars: [
    {
      src: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=120&q=80&auto=format&fit=crop&crop=face',
      alt: 'Avatar client Marie L.',
    },
    {
      src: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=120&q=80&auto=format&fit=crop&crop=face',
      alt: 'Avatar client Jean D.',
    },
    {
      src: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=120&q=80&auto=format&fit=crop&crop=face',
      alt: 'Avatar client Sophie M.',
    },
  ],
} as const;
