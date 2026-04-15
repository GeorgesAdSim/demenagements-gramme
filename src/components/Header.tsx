import { Link } from 'react-router-dom';
import { Phone } from 'lucide-react';
import { useNavigation } from '../hooks/useNavigation';

export function Header() {
  const { navigation } = useNavigation();

  return (
    <header className="bg-white shadow-sm sticky top-0 z-50">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-20">
          <Link to="/" className="flex items-center">
            <img
              src="https://www.demenagements-gramme.be/wp-content/uploads/2018/10/demenagements-gramme-logo-320.png"
              alt="Déménagements Gramme"
              className="h-16"
            />
          </Link>

          <nav className="hidden md:flex items-center space-x-6">
            {navigation.map((item) => (
              <Link
                key={item.id}
                to={item.href}
                className="text-gramme-dark-blue hover:text-gramme-blue font-medium transition-colors"
              >
                {item.label}
              </Link>
            ))}
          </nav>

          <div className="flex items-center space-x-4">
            <a href="tel:+3242645016" className="flex items-center text-gramme-blue hover:text-gramme-dark-blue">
              <Phone className="w-5 h-5 mr-2" />
              <span className="hidden lg:inline">+32(0)4 264 50 16</span>
            </a>
            <Link to="/contact-devis" className="btn-secondary">
              Devis gratuit
            </Link>
          </div>
        </div>
      </div>
    </header>
  );
}
