import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';

interface FAQItem {
  question: string;
  answer: string;
}

interface BreadcrumbItem {
  name: string;
  url: string;
}

interface SEOProps {
  title?: string;
  description?: string;
  ogImage?: string;
  isHomePage?: boolean;
  faqs?: FAQItem[];
  breadcrumbs?: BreadcrumbItem[];
}

const SITE_URL = 'https://www.demenagements-gramme.be';

export function SEO({
  title,
  description,
  ogImage,
  isHomePage = false,
  faqs,
  breadcrumbs
}: SEOProps) {
  const location = useLocation();
  const canonicalUrl = `${SITE_URL}${location.pathname}`;

  useEffect(() => {
    // Title
    if (title) {
      document.title = title;
    }

    // Meta Description
    let metaDescription = document.querySelector('meta[name="description"]');
    if (!metaDescription) {
      metaDescription = document.createElement('meta');
      metaDescription.setAttribute('name', 'description');
      document.head.appendChild(metaDescription);
    }
    if (description) {
      metaDescription.setAttribute('content', description);
    }

    // Canonical URL
    let linkCanonical = document.querySelector('link[rel="canonical"]');
    if (!linkCanonical) {
      linkCanonical = document.createElement('link');
      linkCanonical.setAttribute('rel', 'canonical');
      document.head.appendChild(linkCanonical);
    }
    linkCanonical.setAttribute('href', canonicalUrl);

    // OG Image
    let metaOgImage = document.querySelector('meta[property="og:image"]');
    if (ogImage) {
      if (!metaOgImage) {
        metaOgImage = document.createElement('meta');
        metaOgImage.setAttribute('property', 'og:image');
        document.head.appendChild(metaOgImage);
      }
      metaOgImage.setAttribute('content', ogImage);
    }

    // OG Title
    let metaOgTitle = document.querySelector('meta[property="og:title"]');
    if (title) {
      if (!metaOgTitle) {
        metaOgTitle = document.createElement('meta');
        metaOgTitle.setAttribute('property', 'og:title');
        document.head.appendChild(metaOgTitle);
      }
      metaOgTitle.setAttribute('content', title);
    }

    // OG Description
    let metaOgDescription = document.querySelector('meta[property="og:description"]');
    if (description) {
      if (!metaOgDescription) {
        metaOgDescription = document.createElement('meta');
        metaOgDescription.setAttribute('property', 'og:description');
        document.head.appendChild(metaOgDescription);
      }
      metaOgDescription.setAttribute('content', description);
    }

    // OG URL
    let metaOgUrl = document.querySelector('meta[property="og:url"]');
    if (!metaOgUrl) {
      metaOgUrl = document.createElement('meta');
      metaOgUrl.setAttribute('property', 'og:url');
      document.head.appendChild(metaOgUrl);
    }
    metaOgUrl.setAttribute('content', canonicalUrl);

    // Schema.org LocalBusiness (homepage uniquement)
    const existingLocalBusiness = document.querySelector('script[data-schema="LocalBusiness"]');
    if (existingLocalBusiness) {
      existingLocalBusiness.remove();
    }

    if (isHomePage) {
      const localBusinessSchema = {
        '@context': 'https://schema.org',
        '@type': 'LocalBusiness',
        'name': 'Déménagements Gramme',
        'image': `${SITE_URL}/logo.png`,
        'url': SITE_URL,
        'telephone': '+3242645016',
        'priceRange': '€€',
        'address': {
          '@type': 'PostalAddress',
          'streetAddress': 'Rue des Naiveux 64',
          'addressLocality': 'Herstal',
          'postalCode': '4040',
          'addressCountry': 'BE'
        },
        'geo': {
          '@type': 'GeoCoordinates',
          'latitude': '50.6879',
          'longitude': '5.6286'
        },
        'openingHoursSpecification': [
          {
            '@type': 'OpeningHoursSpecification',
            'dayOfWeek': ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'],
            'opens': '08:00',
            'closes': '18:00'
          }
        ],
        'sameAs': [
          'https://www.facebook.com/demenagements-gramme',
          'https://www.linkedin.com/company/demenagements-gramme'
        ]
      };

      const scriptLocalBusiness = document.createElement('script');
      scriptLocalBusiness.setAttribute('type', 'application/ld+json');
      scriptLocalBusiness.setAttribute('data-schema', 'LocalBusiness');
      scriptLocalBusiness.textContent = JSON.stringify(localBusinessSchema);
      document.head.appendChild(scriptLocalBusiness);
    }

    // Schema.org FAQPage
    const existingFAQ = document.querySelector('script[data-schema="FAQPage"]');
    if (existingFAQ) {
      existingFAQ.remove();
    }

    if (faqs && faqs.length > 0) {
      const faqSchema = {
        '@context': 'https://schema.org',
        '@type': 'FAQPage',
        'mainEntity': faqs.map(faq => ({
          '@type': 'Question',
          'name': faq.question,
          'acceptedAnswer': {
            '@type': 'Answer',
            'text': faq.answer
          }
        }))
      };

      const scriptFAQ = document.createElement('script');
      scriptFAQ.setAttribute('type', 'application/ld+json');
      scriptFAQ.setAttribute('data-schema', 'FAQPage');
      scriptFAQ.textContent = JSON.stringify(faqSchema);
      document.head.appendChild(scriptFAQ);
    }

    // Schema.org BreadcrumbList
    const existingBreadcrumb = document.querySelector('script[data-schema="BreadcrumbList"]');
    if (existingBreadcrumb) {
      existingBreadcrumb.remove();
    }

    if (breadcrumbs && breadcrumbs.length > 0) {
      const breadcrumbSchema = {
        '@context': 'https://schema.org',
        '@type': 'BreadcrumbList',
        'itemListElement': breadcrumbs.map((breadcrumb, index) => ({
          '@type': 'ListItem',
          'position': index + 1,
          'name': breadcrumb.name,
          'item': `${SITE_URL}${breadcrumb.url}`
        }))
      };

      const scriptBreadcrumb = document.createElement('script');
      scriptBreadcrumb.setAttribute('type', 'application/ld+json');
      scriptBreadcrumb.setAttribute('data-schema', 'BreadcrumbList');
      scriptBreadcrumb.textContent = JSON.stringify(breadcrumbSchema);
      document.head.appendChild(scriptBreadcrumb);
    }

    // Cleanup on unmount
    return () => {
      const schemas = document.querySelectorAll('script[data-schema]');
      schemas.forEach(schema => schema.remove());
    };
  }, [title, description, ogImage, canonicalUrl, isHomePage, faqs, breadcrumbs]);

  return null;
}
