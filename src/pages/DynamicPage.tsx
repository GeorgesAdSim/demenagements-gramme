import { useParams } from 'react-router-dom';
import { SEO } from '../components/SEO';
import { FAQ } from '../components/FAQ';
import { InternalLinks } from '../components/InternalLinks';
import { ScrollReveal } from '../components/ScrollReveal';
import { usePageBySlug } from '../hooks/usePageBySlug';
import { useFAQ } from '../hooks/useFAQ';

export function DynamicPage() {
  const { slug } = useParams<{ slug: string }>();
  const { page, loading } = usePageBySlug(slug || '');
  const { faqs } = useFAQ(slug || '');

  // Définir les breadcrumbs dynamiquement
  const breadcrumbs = [
    { name: 'Accueil', url: '/' },
    { name: page?.title || '', url: `/${slug}` }
  ];

  // Schema.org Service pour les pages internationales
  const internationalPages: { [key: string]: { country: string; serviceType: string } } = {
    'demenagement-belgique-suisse': { country: 'Suisse', serviceType: 'Déménagement Belgique-Suisse' },
    'demenagement-belgique-france': { country: 'France', serviceType: 'Déménagement Belgique-France' },
    'demenagement-belgique-espagne': { country: 'Espagne', serviceType: 'Déménagement Belgique-Espagne' },
    'demenagement-belgique-italie': { country: 'Italie', serviceType: 'Déménagement Belgique-Italie' }
  };

  const isInternationalPage = slug ? internationalPages[slug] : null;

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="inline-block w-16 h-16 border-4 border-gramme-blue border-t-transparent rounded-full animate-spin mb-4" />
          <p className="text-gramme-dark-blue font-semibold">Chargement...</p>
        </div>
      </div>
    );
  }

  if (!page) {
    return (
      <div className="container mx-auto px-4 py-16 text-center">
        <h1 className="text-4xl font-bold text-gramme-dark-blue">Page non trouvée</h1>
      </div>
    );
  }

  return (
    <>
      <SEO
        title={page.meta_title || page.title}
        description={page.meta_description || undefined}
        ogImage={page.og_image || undefined}
        faqs={faqs.map(faq => ({
          question: faq.question,
          answer: faq.answer
        }))}
        breadcrumbs={breadcrumbs}
      />

      {/* Schema.org Service pour pages internationales */}
      {isInternationalPage && (
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              '@context': 'https://schema.org',
              '@type': 'Service',
              'serviceType': isInternationalPage.serviceType,
              'provider': {
                '@type': 'LocalBusiness',
                'name': 'Déménagements Gramme',
                'address': {
                  '@type': 'PostalAddress',
                  'streetAddress': 'Rue des Naiveux 64',
                  'addressLocality': 'Herstal',
                  'postalCode': '4040',
                  'addressCountry': 'BE'
                },
                'telephone': '+3242645016',
                'url': 'https://www.demenagements-gramme.be'
              },
              'areaServed': {
                '@type': 'Country',
                'name': isInternationalPage.country
              },
              'description': page.meta_description || page.title
            })
          }}
        />
      )}

      <div className="container mx-auto px-4 py-16">
        <ScrollReveal>
          <h1 className="text-4xl md:text-5xl font-bold text-gramme-dark-blue mb-8">
            {page.h1 || page.title}
          </h1>
        </ScrollReveal>

        {page.content && (
          <ScrollReveal delay={100}>
            <div
              className="prose prose-lg max-w-none mb-12"
              dangerouslySetInnerHTML={{ __html: page.content }}
            />
          </ScrollReveal>
        )}

        {/* FAQ spécifiques à la page */}
        {faqs.length > 0 && (
          <ScrollReveal delay={200}>
            <section className="mt-16 mb-12">
              <h2 className="text-3xl font-bold text-gramme-dark-blue mb-8 text-center">
                Questions fréquentes
              </h2>
              <div className="max-w-4xl mx-auto">
                <FAQ faqs={faqs} />
              </div>
            </section>
          </ScrollReveal>
        )}

        {/* Liens de maillage interne */}
        {slug && (
          <ScrollReveal delay={300}>
            <InternalLinks slug={slug} />
          </ScrollReveal>
        )}
      </div>
    </>
  );
}
