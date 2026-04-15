import { useParams } from 'react-router-dom';
import { SEO } from '../components/SEO';
import { usePageBySlug } from '../hooks/usePageBySlug';

export function DynamicPage() {
  const { slug } = useParams<{ slug: string }>();
  const { page, loading } = usePageBySlug(slug || '');

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
            className="prose prose-lg max-w-none"
            dangerouslySetInnerHTML={{ __html: page.content }}
          />
        )}
      </div>
    </>
  );
}
