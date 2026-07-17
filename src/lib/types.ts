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
