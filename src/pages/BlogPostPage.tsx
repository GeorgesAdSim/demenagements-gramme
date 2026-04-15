import { useParams, Link } from 'react-router-dom';
import { ArrowLeft, Calendar } from 'lucide-react';
import { SEO } from '../components/SEO';
import { useBlogPostBySlug } from '../hooks/useBlogPosts';

export function BlogPostPage() {
  const { slug } = useParams<{ slug: string }>();
  const { post, loading } = useBlogPostBySlug(slug || '');

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-16 text-center">
        <div className="animate-pulse">Chargement...</div>
      </div>
    );
  }

  if (!post) {
    return (
      <div className="container mx-auto px-4 py-16 text-center">
        <h1 className="text-4xl font-bold text-gramme-dark-blue">Article non trouvé</h1>
        <Link to="/actualites" className="text-gramme-blue hover:text-gramme-dark-blue mt-4 inline-block">
          ← Retour aux actualités
        </Link>
      </div>
    );
  }

  return (
    <>
      <SEO
        title={post.meta_title || post.title}
        description={post.meta_description || post.excerpt || undefined}
      />

      <article className="container mx-auto px-4 py-16">
        <Link
          to="/actualites"
          className="inline-flex items-center text-gramme-blue hover:text-gramme-dark-blue mb-8 transition-colors"
        >
          <ArrowLeft className="w-5 h-5 mr-2" />
          Retour aux actualités
        </Link>

        <header className="mb-8">
          <h1 className="text-5xl font-bold text-gramme-dark-blue mb-4">{post.title}</h1>

          {post.published_at && (
            <div className="flex items-center text-gray-600">
              <Calendar className="w-5 h-5 mr-2" />
              {new Date(post.published_at).toLocaleDateString('fr-FR', {
                day: 'numeric',
                month: 'long',
                year: 'numeric'
              })}
            </div>
          )}
        </header>

        {post.content && (
          <div
            className="prose prose-lg max-w-none"
            dangerouslySetInnerHTML={{ __html: post.content }}
          />
        )}
      </article>
    </>
  );
}
