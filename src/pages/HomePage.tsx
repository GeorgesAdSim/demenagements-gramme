import { SEO } from '../components/SEO';
import { FAQ } from '../components/FAQ';
import { usePageBySlug } from '../hooks/usePageBySlug';
import { useFAQ } from '../hooks/useFAQ';

export function HomePage() {
  const { page, loading } = usePageBySlug('accueil');
  const { faqs } = useFAQ('accueil');

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-16 text-center">
        <div className="animate-pulse">Chargement...</div>
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
      />

      <div className="container mx-auto px-4 py-16">
        <h1 className="text-5xl font-bold text-gramme-dark-blue mb-8">{page.h1 || page.title}</h1>

        {page.content && (
          <div
            className="prose prose-lg max-w-none mb-12"
            dangerouslySetInnerHTML={{ __html: page.content }}
          />
        )}

        {faqs.length > 0 && (
          <section className="mt-16">
            <h2 className="text-3xl font-bold text-gramme-dark-blue mb-8">Questions fréquentes</h2>
            <FAQ faqs={faqs} />
          </section>
        )}
      </div>
    </>
  );
}
