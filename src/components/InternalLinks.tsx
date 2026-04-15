import { Link } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';
import { useInternalLinks } from '../hooks/useInternalLinks';

interface InternalLinksProps {
  slug: string;
}

export function InternalLinks({ slug }: InternalLinksProps) {
  const { links, loading } = useInternalLinks(slug);

  if (loading || links.length === 0) {
    return null;
  }

  return (
    <section className="bg-gramme-gray py-12 md:py-16 mt-16 -mx-4 px-4 md:mx-0 md:px-0 rounded-xl">
      <div className="container mx-auto px-4">
        <h2 className="text-2xl md:text-3xl font-bold text-gramme-dark-blue mb-8 text-center">
          Pages associées
        </h2>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4 max-w-5xl mx-auto">
          {links.map((link) => (
            <Link
              key={link.id}
              to={`/${link.target_slug}`}
              className="group bg-white rounded-lg p-4 shadow-sm hover:shadow-md transition-all duration-300 hover:-translate-y-1 flex items-center justify-between"
            >
              <span className="text-gramme-dark-blue font-medium group-hover:text-gramme-blue transition-colors">
                {link.anchor_text}
              </span>
              <ArrowRight className="w-5 h-5 text-gramme-blue flex-shrink-0 ml-2 transition-transform group-hover:translate-x-1" />
            </Link>
          ))}
        </div>

        {links.length > 0 && (
          <div className="text-center mt-8">
            <p className="text-sm text-gray-500">
              Découvrez nos autres services de déménagement à Liège
            </p>
          </div>
        )}
      </div>
    </section>
  );
}
