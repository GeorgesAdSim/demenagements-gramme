// TODO: remplacer les photos restantes (équipe, dépôt, emballage) par de
// vraies photos de Déménagements Gramme. Le hero, lui, est fait.

/** Construit une URL Unsplash à la largeur et à la qualité voulues. */
const unsplash = (id: string, w: number, q = 70) =>
  `https://images.unsplash.com/${id}?w=${w}&q=${q}&auto=format&fit=crop`;

/** Génère un srcset à partir d'une liste de largeurs. */
const srcSet = (id: string, widths: number[], q = 70) =>
  widths.map((w) => `${unsplash(id, w, q)} ${w}w`).join(', ');

const HERO_WIDTHS = [640, 828, 1200, 1600];
/** Srcset local pour la photo du hero, déclinée en public/hero/. */
const heroSet = (ext: string) =>
  HERO_WIDTHS.map((w) => `/hero/demenagement-liege-${w}.${ext} ${w}w`).join(', ');

export const SITE_IMAGES = {
  // Vraie photo d'un camion Gramme, hébergée sur le domaine — plus de
  // dépendance à Unsplash pour l'image la plus visible du site, et le
  // marquage de l'entreprise est enfin authentique.
  //
  // Déclinée en 4 largeurs et 3 formats (AVIF, WebP, JPEG) : le navigateur
  // n'en télécharge qu'une. En AVIF, un mobile prend 19 à 31 Kio.
  hero: {
    src: '/hero/demenagement-liege-1200.jpg',
    srcSetAvif: heroSet('avif'),
    srcSetWebp: heroSet('webp'),
    srcSetJpeg: heroSet('jpg'),
    alt: 'Camion de déménagement Déménagements Gramme',
  },
  // Photo affichée en ~343 px de large sur mobile et ~600 px sur desktop,
  // mais servie en 900 px fixes et sans srcset. Elle apparaît deux fois
  // (section « Pourquoi nous » et bloc contact), ce qui en faisait la plus
  // lourde des images restantes après l'optimisation du hero.
  team: {
    src: unsplash('photo-1566576721346-d4a3b4eaeb55', 600, 65),
    srcSet: srcSet('photo-1566576721346-d4a3b4eaeb55', [400, 600, 900], 65),
    alt: 'Camion de déménagement professionnel Déménagements Gramme',
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
