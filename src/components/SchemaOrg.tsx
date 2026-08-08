import { Helmet } from 'react-helmet-async';
import { FAQ_ACCUEIL } from '../data/faq';
import { ENTREPRISE, POSTAL_ADDRESS, GEO_COORDINATES } from '../data/entreprise';

const BASE_URL = 'https://www.demenagements-gramme.be';

/**
 * Identifiant stable de l'entreprise, partagé par toutes les pages.
 *
 * C'est lui qui permet de ne décrire l'établissement qu'une fois et de s'y
 * référer ailleurs, au lieu de redéclarer la même adresse, les mêmes horaires
 * et la même géolocalisation sur chaque page.
 */
export const ORG_ID = `${BASE_URL}/#organization`;

const LOCAL_BUSINESS = {
  '@context': 'https://schema.org',
  '@type': 'MovingCompany',
  '@id': ORG_ID,
  name: 'Déménagements Gramme',
  image: `${BASE_URL}/og-image.jpg`,
  url: BASE_URL,
  telephone: `+${ENTREPRISE.telephone.lien.replace('+', '')}`,
  email: ENTREPRISE.email,
  // Profil officiel de l'entreprise. `sameAs` rattache l'entité du site au
  // profil social, ce qui aide Google à ne pas la confondre avec une homonyme.
  sameAs: ['https://www.facebook.com/GrammeDemenagements'],
  logo: `${BASE_URL}/logo-gramme-300.png`,
  address: POSTAL_ADDRESS,
  geo: GEO_COORDINATES,
  openingHoursSpecification: [
    {
      '@type': 'OpeningHoursSpecification',
      dayOfWeek: 'Monday',
      opens: '08:00',
      closes: '18:00',
    },
    {
      '@type': 'OpeningHoursSpecification',
      dayOfWeek: ['Tuesday', 'Wednesday', 'Thursday', 'Friday'],
      opens: '08:00',
      closes: '17:00',
    },
    // Fermeture déclarée explicitement : les deux sources du site s'accordent
    // dessus, et une fermeture non déclarée laisse Google supposer une
    // ouverture. Le samedi, lui, reste absent — voir le commentaire ci-dessus.
    {
      '@type': 'OpeningHoursSpecification',
      dayOfWeek: 'Sunday',
      opens: '00:00',
      closes: '00:00',
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

/**
 * Référence compacte à l'entreprise, servie sur toutes les pages sauf celles
 * qui décrivent réellement l'établissement.
 *
 * Elle porte le même `@id` que la déclaration complète : les moteurs rattachent
 * donc la page à l'entité déjà connue, sans qu'une soixantaine de pages répètent
 * la géolocalisation, les horaires, la liste de pays desservis et le numéro de
 * TVA. C'est cette répétition-là qui faisait ressembler chaque page commune à
 * une déclaration d'établissement distincte.
 *
 * ⚠️ `name` et `address` ne sont PAS optionnels ici, malgré le mot « référence ».
 *
 * MovingCompany est une sous-classe de LocalBusiness, et Google exige les deux
 * champs sur tout nœud de ce type. Une première version omettait l'adresse — le
 * nœud se voulait un simple renvoi par `@id` — et les validateurs ont lu une
 * déclaration LocalBusiness incomplète sur 89 pages. Le type détermine ce qui
 * est exigé, pas l'intention.
 *
 * Retirer l'adresse d'ici casse donc à nouveau la validation. Pour alléger le
 * nœud, retirer d'autres propriétés, jamais celles-là.
 */
const ORG_REFERENCE = {
  '@context': 'https://schema.org',
  '@type': 'MovingCompany',
  '@id': ORG_ID,
  name: 'Déménagements Gramme',
  url: BASE_URL,
  telephone: '+3242645016',
  address: LOCAL_BUSINESS.address,
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
  /**
   * `'full'` déclare l'établissement (adresse, horaires, géolocalisation) :
   * réservé aux pages qui parlent réellement du siège, c'est-à-dire l'accueil
   * et la page Seraing. Partout ailleurs, la valeur par défaut `'reference'`
   * se contente de rattacher la page à l'entité par son `@id`.
   */
  organization?: 'full' | 'reference';
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
  /**
   * Liste ordonnée d'éléments réellement affichés sur la page — les communes
   * desservies, sur la page des zones d'intervention. Un `url` n'est fourni
   * que pour les entrées qui pointent vers une page existante : référencer une
   * URL absente reviendrait à décrire une page qui n'existe pas.
   */
  itemList?: {
    name: string;
    items: Array<{ name: string; url?: string }>;
  };
}

export default function SchemaOrg({
  organization = 'reference',
  includeFaq = false,
  customFaq,
  articleData,
  breadcrumbs,
  localService,
  itemList,
}: SchemaOrgProps) {
  const scripts: Array<{ type: string; innerHTML: string }> = [
    {
      type: 'application/ld+json',
      innerHTML: JSON.stringify(organization === 'full' ? LOCAL_BUSINESS : ORG_REFERENCE),
    },
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
    // située à Seraing. Déclarer un établissement par commune serait une
    // fausse déclaration d'implantation locale.
    scripts.push({
      type: 'application/ld+json',
      innerHTML: JSON.stringify({
        '@context': 'https://schema.org',
        '@type': 'Service',
        serviceType: 'Déménagement',
        name: `Déménagement à ${localService.ville}`,
        url: localService.url,
        // Renvoi par `@id` : le prestataire est l'entité unique du site. La
        // version précédente recopiait ici l'adresse du siège, ce qui
        // revenait à répéter le même bloc d'établissement sur chaque commune.
        provider: { '@id': ORG_ID },
        areaServed: {
          '@type': 'City',
          name: localService.ville,
          // `postalCode` appartient à PostalAddress, pas à Place : posé
          // directement sur la City, il était rejeté à la validation. Il
          // rejoint donc l'adresse, qui est le bon porteur.
          address: {
            '@type': 'PostalAddress',
            addressLocality: localService.ville,
            ...(localService.codesPostaux.length > 0 && {
              postalCode: localService.codesPostaux.join(', '),
            }),
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

  if (itemList && itemList.items.length > 0) {
    scripts.push({
      type: 'application/ld+json',
      innerHTML: JSON.stringify({
        '@context': 'https://schema.org',
        '@type': 'ItemList',
        name: itemList.name,
        numberOfItems: itemList.items.length,
        itemListElement: itemList.items.map((item, i) => ({
          '@type': 'ListItem',
          position: i + 1,
          name: item.name,
          ...(item.url && { url: item.url }),
        })),
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
