import { useEffect } from 'react';

const BASE_URL = 'https://www.demenagements-gramme.be';

const LOCAL_BUSINESS = {
  '@context': 'https://schema.org',
  '@type': 'MovingCompany',
  name: 'Déménagements Gramme',
  image: `${BASE_URL}/logo-gramme.webp`,
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

const FAQ_SCHEMA = {
  '@context': 'https://schema.org',
  '@type': 'FAQPage',
  mainEntity: [
    {
      '@type': 'Question',
      name: 'Comment choisir un bon déménageur à Liège ?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: "Travailler avec une société spécialisée fait toute la différence. Nos équipes professionnelles garantissent un déménagement sécurisé, couvert par une assurance, réalisé avec soin.",
      },
    },
    {
      '@type': 'Question',
      name: 'Comment faire ses cartons de déménagement ?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: "Commencez par les pièces rarement utilisées. Placez les objets lourds en dessous, légers au-dessus. Protégez les fragiles avec du papier bulle. Inscrivez le contenu sur chaque carton.",
      },
    },
    {
      '@type': 'Question',
      name: 'Quels volumes pouvez-vous déménager ?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: "Nos camions déplacent des volumes allant de 4 à 100m³. Nous déménageons également pianos et coffres-forts.",
      },
    },
    {
      '@type': 'Question',
      name: 'Intervenez-vous en dehors de Liège ?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: "Absolument ! Nous intervenons dans toute la Belgique et l'Europe entière : France, Suisse, Espagne, Italie et plus.",
      },
    },
  ],
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

interface SchemaOrgProps {
  includeFaq?: boolean;
  articleData?: ArticleData;
  breadcrumbs?: BreadcrumbItem[];
}

function injectScript(id: string, data: object): HTMLScriptElement {
  const el = document.createElement('script');
  el.type = 'application/ld+json';
  el.textContent = JSON.stringify(data);
  el.id = id;
  document.head.appendChild(el);
  return el;
}

export default function SchemaOrg({ includeFaq = false, articleData, breadcrumbs }: SchemaOrgProps) {
  useEffect(() => {
    const scripts: HTMLScriptElement[] = [];

    scripts.push(injectScript('schema-local-business', LOCAL_BUSINESS));

    if (includeFaq) {
      scripts.push(injectScript('schema-faq', FAQ_SCHEMA));
    }

    if (articleData) {
      scripts.push(injectScript('schema-article', {
        '@context': 'https://schema.org',
        '@type': 'Article',
        headline: articleData.title,
        image: articleData.image || `${BASE_URL}/logo-gramme.webp`,
        author: {
          '@type': 'Organization',
          name: 'Déménagements Gramme',
          url: BASE_URL,
        },
        publisher: {
          '@type': 'Organization',
          name: 'Déménagements Gramme',
          logo: { '@type': 'ImageObject', url: `${BASE_URL}/logo-gramme.webp` },
        },
        datePublished: articleData.publishDate,
        dateModified: articleData.publishDate,
        url: articleData.url,
        mainEntityOfPage: { '@type': 'WebPage', '@id': articleData.url },
      }));
    }

    if (breadcrumbs && breadcrumbs.length > 0) {
      scripts.push(injectScript('schema-breadcrumb', {
        '@context': 'https://schema.org',
        '@type': 'BreadcrumbList',
        itemListElement: breadcrumbs.map((crumb, i) => ({
          '@type': 'ListItem',
          position: i + 1,
          name: crumb.name,
          item: crumb.url,
        })),
      }));
    }

    return () => scripts.forEach((s) => s.remove());
  }, [includeFaq, articleData, breadcrumbs]);

  return null;
}
