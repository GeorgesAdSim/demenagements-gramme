import { Link } from 'react-router-dom';
import type { BlogPost } from '../lib/supabase';
import { Calendar } from 'lucide-react';

interface BlogCardProps {
  post: BlogPost;
}

export function BlogCard({ post }: BlogCardProps) {
  return (
    <article className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-xl transition-shadow">
      <div className="p-6">
        <h3 className="text-xl font-bold text-gramme-dark-blue mb-3 line-clamp-2">
          <Link to={`/blog/${post.slug}`} className="hover:text-gramme-blue transition-colors">
            {post.title}
          </Link>
        </h3>

        {post.excerpt && (
          <p className="text-gray-600 mb-4 line-clamp-3">{post.excerpt}</p>
        )}

        <div className="flex items-center justify-between">
          {post.published_at && (
            <div className="flex items-center text-sm text-gray-500">
              <Calendar className="w-4 h-4 mr-2" />
              {new Date(post.published_at).toLocaleDateString('fr-FR')}
            </div>
          )}

          <Link
            to={`/blog/${post.slug}`}
            className="text-gramme-blue hover:text-gramme-dark-blue font-semibold text-sm transition-colors"
          >
            Lire la suite →
          </Link>
        </div>
      </div>
    </article>
  );
}
