import { SEO } from '../components/SEO';
import { BlogCard } from '../components/BlogCard';
import { useBlogPosts } from '../hooks/useBlogPosts';

export function BlogListPage() {
  const { posts, loading } = useBlogPosts();

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-16 text-center">
        <div className="animate-pulse">Chargement...</div>
      </div>
    );
  }

  return (
    <>
      <SEO
        title="Actualités - Déménagements Gramme"
        description="Retrouvez nos derniers articles et conseils pour réussir votre déménagement à Liège."
      />

      <div className="container mx-auto px-4 py-16">
        <h1 className="text-5xl font-bold text-gramme-dark-blue mb-4">Actualités</h1>
        <p className="text-xl text-gray-600 mb-12">
          Retrouvez nos derniers articles et conseils pour réussir votre déménagement à Liège.
        </p>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {posts.map((post) => (
            <BlogCard key={post.id} post={post} />
          ))}
        </div>

        {posts.length === 0 && (
          <p className="text-center text-gray-500 mt-12">Aucun article publié pour le moment.</p>
        )}
      </div>
    </>
  );
}
