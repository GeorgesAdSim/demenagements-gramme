import { Link } from 'react-router-dom';
import type { Service } from '../lib/supabase';
import { ArrowRight } from 'lucide-react';

interface ServiceCardProps {
  service: Service;
}

export function ServiceCard({ service }: ServiceCardProps) {
  return (
    <div className="bg-white rounded-lg shadow-md p-6 hover:shadow-xl transition-shadow">
      <h3 className="text-2xl font-bold text-gramme-dark-blue mb-3">{service.name}</h3>
      {service.description && (
        <p className="text-gray-600 mb-4">{service.description}</p>
      )}
      {service.slug && (
        <Link
          to={`/${service.slug}`}
          className="inline-flex items-center text-gramme-blue hover:text-gramme-dark-blue font-semibold transition-colors"
        >
          En savoir plus
          <ArrowRight className="w-5 h-5 ml-2" />
        </Link>
      )}
    </div>
  );
}
