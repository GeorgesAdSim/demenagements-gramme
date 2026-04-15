import { Link } from 'react-router-dom';
import { Home } from 'lucide-react';

export function NotFoundPage() {
  return (
    <div className="container mx-auto px-4 py-16 text-center">
      <h1 className="text-9xl font-bold text-gramme-blue mb-4">404</h1>
      <h2 className="text-3xl font-bold text-gramme-dark-blue mb-6">Page non trouvée</h2>
      <p className="text-xl text-gray-600 mb-8">
        Désolé, la page que vous recherchez n'existe pas ou a été déplacée.
      </p>

      <Link
        to="/"
        className="inline-flex items-center btn-primary"
      >
        <Home className="w-5 h-5 mr-2" />
        Retour à l'accueil
      </Link>
    </div>
  );
}
