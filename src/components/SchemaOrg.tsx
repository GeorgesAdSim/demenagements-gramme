import { Helmet } from 'react-helmet-async';
import { FAQ_ACCUEIL } from '../data/faq';

const BASE_URL = 'https://www.demenagements-gramme.be';

const LOCAL_BUSINESS = {
  '@context': 'https://schema.org',
  '@type': 'MovingCompany',
  name: 'Déménagements Gramme',
  image: `${BASE_URL}/og-image.jpg`,
  url: BASE_URL,
  telephone: '+3242645016',
  email: 'contact@demenagements-gramme.be',
  address: {
    '@type': 'PostalAddress',
    streetAddress: 'Rue des Naiveux 64',
    addressLocality: 'Herstal',
    postalCode: '4040',
    addressCountry: 'BE',
  },
  geo: {
    '@type': 'GeoCoordinates',
    latitude: 50.6594,
    longitude: 5.6339,
  },
  openingHoursSpecification: [
    {
      '@type': 'OpeningHoursSpecification',
      dayOfWeek: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'],
      opens: '08:00',
      closes: '18:00',
    },
    {
      '@type': 'OpeningHoursSpecification',
      dayOfWeek: 'Saturday',
      opens: '08:00',
      closes: '12:00',
    },
  ],
  foundingDate: '1948',
  vatID: 'BE0775264382',
  areaServed: [
    { '@type': 'Country', name: 'Belgium' },
    { '@type': 'Country', name: 'France' },
    { '@type': 'Country', name: 'Switzerland' },
    { '@type': 'Country', name: 'Spain' },
    { '@type': 'Country', name: 'Italy' },
  ],
  priceRange: 'Sur devis',
};

// Généré depuis la source partagée des questions, et non écrit en dur : Google
// exige que le balisage FAQPage corresponde au contenu réellement affiché. La
// version précédente listait 4 questions alors que la page en montre 9.
const FAQ_SCHEMA = {
  '@context': 'https://schema.org',
  '@type': 'FAQPage',
  mainEntity: FAQ_ACCUEIL.map((f) => ({
    '@type': 'Question',
    name: f.q,
    acceptedAnswer: {
      '@type': 'Answer',
      // La liste à puces fait partie de la réponse visible : on la reprend.
      text: [f.a, ...(f.list ?? [])].filter(Boolean).join(' '),
    },
  })),
};

export interface ArticleData {
  title: string;
  publishDate: string;
  url: string;
  image?: string;
}

export interface BreadcrumbItem {
  name: string;
  url: string;
}

/** Question réellement affichée sur la page courante. */
export interface FaqItem {
  q: string;
  a: string;
}

/** Ville desservie, pour le balisage Service des pages locales. */
export interface LocalServiceData {
  ville: string;
  codesPostaux: string[];
  url: string;
}

interface SchemaOrgProps {
  includeFaq?: boolean;
  /**
   * FAQ propre à la page, quand ce ne sont pas les questions de l'accueil.
   *
   * Indispensable pour les pages locales : `includeFaq` injecterait les 9
   * questions de l'accueil sur une page qui n'en affiche aucune, ce que Google
   * traite comme du balisage non conforme au contenu visible.
   */
  customFaq?: FaqItem[];
  articleData?: ArticleData;
  breadcrumbs?: BreadcrumbItem[];
  localService?: LocalServiceData;
}

export default function SchemaOrg({
  includeFaq = false,
  customFaq,
  articleData,
  breadcrumbs,
  localService,
}: SchemaOrgProps) {
  const scripts: Array<{ type: string; innerHTML: string }> = [
    { type: 'application/ld+json', innerHTML: JSON.stringify(LOCAL_BUSINESS) },
  ];

  if (includeFaq) {
    scripts.push({ type: 'application/ld+json', innerHTML: JSON.stringify(FAQ_SCHEMA) });
  }

  if (customFaq && customFaq.length > 0) {
    scripts.push({
      type: 'application/ld+json',
      innerHTML: JSON.stringify({
        '@context': 'https://schema.org',
        '@type': 'FAQPage',
        mainEntity: customFaq.map((f) => ({
          '@type': 'Question',
          name: f.q,
          acceptedAnswer: { '@type': 'Answer', text: f.a },
        })),
      }),
    });
  }

  if (localService) {
    // Service plutôt qu'une seconde MovingCompany : l'entreprise est unique et
    // située à Herstal. Déclarer un établissement par commune serait une
    // fausse déclaration d'implantation locale.
    scripts.push({
      type: 'application/ld+json',
      innerHTML: JSON.stringify({
        '@context': 'https://schema.org',
        '@type': 'Service',
        serviceType: 'Déménagement',
        name: `Déménagement à ${localService.ville}`,
        url: localService.url,
        provider: {
          '@type': 'MovingCompany',
          name: 'Déménagements Gramme',
          url: BASE_URL,
          telephone: '+3242645016',
          address: LOCAL_BUSINESS.address,
        },
        areaServed: {
          '@type': 'City',
          name: localService.ville,
          ...(localService.codesPostaux.length > 0 && { postalCode: localService.codesPostaux }),
          address: {
            '@type': 'PostalAddress',
            addressLocality: localService.ville,
            addressRegion: 'Province de Liège',
            addressCountry: 'BE',
          },
        },
      }),
    });
  }

  if (articleData) {
    scripts.push({
      type: 'application/ld+json',
      innerHTML: JSON.stringify({
        '@context': 'https://schema.org',
        '@type': 'Article',
        headline: articleData.title,
        image: articleData.image || `${BASE_URL}/og-image.jpg`,
        author: {
          '@type': 'Organization',
          name: 'Déménagements Gramme',
          url: BASE_URL,
        },
        publisher: {
          '@type': 'Organization',
          name: 'Déménagements Gramme',
          logo: { '@type': 'ImageObject', url: `${BASE_URL}/logo-gramme-300.png` },
        },
        datePublished: articleData.publishDate,
        dateModified: articleData.publishDate,
        url: articleData.url,
        mainEntityOfPage: { '@type': 'WebPage', '@id': articleData.url },
      }),
    });
  }

  if (breadcrumbs && breadcrumbs.length > 0) {
    scripts.push({
      type: 'application/ld+json',
      innerHTML: JSON.stringify({
        '@context': 'https://schema.org',
        '@type': 'BreadcrumbList',
        itemListElement: breadcrumbs.map((crumb, i) => ({
          '@type': 'ListItem',
          position: i + 1,
          name: crumb.name,
          item: crumb.url,
        })),
      }),
    });
  }

  // react-helmet-async fusionne proprement les <script> JSON-LD dans le <head>,
  // aussi bien côté client (hydratation) que côté serveur (pré-rendu).
  return <Helmet script={scripts} />;
}
