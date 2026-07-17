// TODO: Remplacer par les vraies photos de Déménagements Gramme
// (équipe, camions, dépôt) une fois le shooting réalisé.

export const SITE_IMAGES = {
  hero: {
    // 1200px suffit pour un bg-cover desktop ; 1920 était excessif (+40% de bande passante)
    src: 'https://images.unsplash.com/photo-1600518464441-9154a4dea21b?w=1200&q=75&auto=format&fit=crop',
    // Version mobile allégée (~60% plus légère)
    srcMobile: 'https://images.unsplash.com/photo-1600518464441-9154a4dea21b?w=800&q=65&auto=format&fit=crop',
    alt: 'Équipe Déménagements Gramme chargeant un camion à Liège',
  },
  team: {
    src: 'https://images.unsplash.com/photo-1581578731548-c64695cc6952?w=900&q=75&auto=format&fit=crop',
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
