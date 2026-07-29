import { Helmet } from 'react-helmet-async';

interface SeoHeadProps {
  title: string;
  description: string;
  canonical: string;
  ogImage?: string;
  ogType?: string;
}

const BASE_URL = 'https://www.demenagements-gramme.be';

export default function SeoHead({ title, description, canonical, ogImage, ogType = 'website' }: SeoHeadProps) {
  const fullCanonical = canonical.startsWith('http') ? canonical : `${BASE_URL}${canonical}`;
  // og:image en JPEG 1200x630 : format et ratio attendus par Facebook,
  // LinkedIn, WhatsApp et X (le WebP y est mal ou pas supporté).
  const fullImage = ogImage || `${BASE_URL}/og-image.jpg`;

  // Rendu via react-helmet-async : fonctionne à l'identique en CSR (hydratation)
  // et en SSR (le script de pré-rendu récupère le contexte Helmet et l'injecte
  // dans le <head> du HTML statique livré par Netlify — voir scripts/prerender.mjs).
  return (
    <Helmet>
      <title>{title}</title>
      <meta name="description" content={description} />
      <link rel="canonical" href={fullCanonical} />

      <meta property="og:title" content={title} />
      <meta property="og:description" content={description} />
      <meta property="og:image" content={fullImage} />
      <meta property="og:url" content={fullCanonical} />
      <meta property="og:type" content={ogType} />

      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:title" content={title} />
      <meta name="twitter:description" content={description} />
      <meta name="twitter:image" content={fullImage} />
    </Helmet>
  );
}
