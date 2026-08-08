export interface ServicePageContent {
  hero: {
    badge: string;
    title: string;
    subtitle: string;
    guarantees?: string[];
    stats?: Array<{ value: string; label: string }>;
  };
  prestations: {
    sectionTitle: string;
    items: Array<{ title: string; desc: string }>;
  };
  steps: {
    sectionTitle: string;
    items: Array<{ title: string; desc: string }>;
  };
  info: {
    sectionTitle: string;
    items: Array<{ title: string; desc: string }>;
  };
  cta: {
    title: string;
    subtitle: string;
    buttonText: string;
    phone: string;
  };
  pricing?: {
    sectionTitle: string;
    subtitle: string;
    tiers: Array<{ volume: string; price: string; unit: string }>;
    extraNote: string;
    notes: string[];
    insurance: {
      title: string;
      items: string[];
    };
  };
  /**
   * Questions fréquentes de la page. Rendues en accordéon et reprises telles
   * quelles dans le balisage FAQPage : les deux lisent la même liste, elles ne
   * peuvent donc pas diverger.
   *
   * Optionnel : seule la page pilière /demenagement en porte une aujourd'hui.
   */
  faq?: {
    sectionTitle: string;
    items: Array<{ q: string; a: string }>;
  };
  /**
   * Renvois vers les pages communes. Réservé aux pages piliers dont les pages
   * locales dépendent : c'est le lien descendant du silo, l'ascendant existant
   * déjà par le fil d'Ariane de chaque commune.
   */
  communes?: {
    sectionTitle: string;
    intro: string;
    /** Slugs, résolus contre la liste des communes publiées au rendu. */
    slugs: string[];
  };
  /**
   * Renvois contextuels vers les pages internes que celle-ci commande.
   *
   * Le site n'avait aucun mécanisme de lien interne PRÉ-RENDU entre pages de
   * service : `InternalLinks` existe mais s'alimente en client depuis Supabase,
   * donc reste invisible pour un crawler. Résultat, six pages ne recevaient
   * qu'un à trois liens entrants, tous depuis des pages elles-mêmes faibles —
   * /demenagement/demenageur-liege n'en avait qu'un seul.
   *
   * L'ancre porte le sujet de la page cible, jamais « en savoir plus » : c'est
   * elle qui transmet le sens, et une ancre générique n'en transmet aucun.
   */
  liensAssocies?: {
    sectionTitle: string;
    intro?: string;
    items: Array<{ to: string; label: string; desc: string }>;
  };
}

export interface HomepageContent {
  hero: {
    badge: string;
    title_line1: string;
    title_highlight: string;
    title_line3: string;
    subtitle: string;
    cta_primary: string;
    cta_secondary: string;
    badges: string[];
    background_image: string;
  };
  stats: Array<{ value: number; suffix: string; label: string }>;
  services: {
    sectionTitle: string;
    sectionSubtitle: string;
    cards: Array<{
      title: string;
      description: string;
      items: string[];
    }>;
  };
  whyus: {
    badge: string;
    sectionTitle: string;
    sectionSubtitle: string;
    advantages: Array<{ num: string; title: string; text: string }>;
    metrics: Array<{ value: string; label: string; featured: boolean }>;
  };
  service_area: {
    title: string;
    subtitle: string;
    destinations: Array<{ flag: string; country: string; desc: string; featured: boolean }>;
    banner_text: string;
  };
  faq: Array<{ q: string; a: string; list?: string[] }>;
  contact: {
    title: string;
    subtitle: string;
  };
}

export interface ContactPageContent {
  hero: {
    badge: string;
    title: string;
    subtitle: string;
  };
  sidebar: {
    whyChooseUs: string[];
    urgentTitle: string;
    urgentSubtitle: string;
  };
  process: {
    sectionTitle: string;
    steps: Array<{ step: string; title: string; desc: string }>;
  };
  visit: {
    title: string;
    subtitle: string;
  };
}
