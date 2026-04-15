import { Link } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';
import type { LucideIcon } from 'lucide-react';

interface ServiceCardProps {
  icon: LucideIcon;
  title: string;
  description: string;
  link: string;
  linkText?: string;
}

export function ServiceCard({
  icon: Icon,
  title,
  description,
  link,
  linkText = 'En savoir plus',
}: ServiceCardProps) {
  return (
    <div className="bg-white rounded-xl shadow-md p-8 card-hover group">
      <div className="mb-6 inline-flex items-center justify-center w-16 h-16 rounded-full bg-gramme-blue/10 text-gramme-blue group-hover:bg-gramme-blue group-hover:text-white transition-colors">
        <Icon className="w-8 h-8" />
      </div>

      <h3 className="text-2xl font-bold text-gramme-dark-blue mb-4 group-hover:text-gramme-blue transition-colors">
        {title}
      </h3>

      <p className="text-gray-600 mb-6 leading-relaxed">
        {description}
      </p>

      <Link
        to={link}
        className="inline-flex items-center text-gramme-blue hover:text-gramme-dark-blue font-semibold transition-all group-hover:gap-3 gap-2"
      >
        {linkText}
        <ArrowRight className="w-5 h-5 transition-transform group-hover:translate-x-1" />
      </Link>
    </div>
  );
}
