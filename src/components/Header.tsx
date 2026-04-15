import { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Phone, Menu, X } from 'lucide-react';

export function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const location = useLocation();

  // Fermer le menu quand on change de page
  useEffect(() => {
    setIsMenuOpen(false);
  }, [location]);

  // Gérer le scroll pour ajouter l'ombre au header
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Empêcher le scroll du body quand le menu mobile est ouvert
  useEffect(() => {
    if (isMenuOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
  }, [isMenuOpen]);

  const mainLinks = [
    { label: 'Accueil', href: '/' },
    { label: 'Déménagements', href: '/demenagements' },
    { label: 'Transport', href: '/transports' },
    { label: 'Garde-meubles', href: '/garde-meubles' },
    { label: 'Actualités', href: '/actualites' },
    { label: 'Contact & Devis', href: '/contact-devis' },
  ];

  return (
    <header
      className={`bg-white sticky top-0 z-50 transition-shadow duration-300 ${
        isScrolled ? 'shadow-md' : 'shadow-sm'
      }`}
    >
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-20">
          {/* Logo */}
          <Link to="/" className="flex items-center z-50">
            <img
              src="https://www.demenagements-gramme.be/wp-content/uploads/2018/10/demenagements-gramme-logo-320.png"
              alt="Déménagements Gramme"
              className="h-12 md:h-16"
            />
          </Link>

          {/* Navigation Desktop */}
          <nav className="hidden lg:flex items-center space-x-6">
            {mainLinks.map((item) => (
              <Link
                key={item.href}
                to={item.href}
                className="text-gramme-dark-blue hover:text-gramme-blue font-medium transition-colors"
              >
                {item.label}
              </Link>
            ))}
          </nav>

          {/* CTA et Téléphone Desktop */}
          <div className="hidden md:flex items-center space-x-4">
            <a
              href="tel:+3242645016"
              className="flex items-center text-gramme-blue hover:text-gramme-dark-blue transition-colors"
            >
              <Phone className="w-5 h-5 mr-2" />
              <span className="hidden lg:inline font-semibold">+32(0)4 264 50 16</span>
            </a>
            <Link to="/contact-devis" className="btn-secondary">
              Demander un devis
            </Link>
          </div>

          {/* Bouton Menu Hamburger Mobile */}
          <button
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            className="md:hidden z-50 p-2 text-gramme-dark-blue hover:text-gramme-blue transition-colors"
            aria-label="Menu"
          >
            {isMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>
      </div>

      {/* Menu Mobile Slide-in */}
      <div
        className={`fixed inset-0 bg-white z-40 md:hidden transition-transform duration-300 ease-in-out ${
          isMenuOpen ? 'translate-x-0' : 'translate-x-full'
        }`}
      >
        <nav className="flex flex-col items-center justify-center h-full space-y-6 px-8">
          {mainLinks.map((item) => (
            <Link
              key={item.href}
              to={item.href}
              className="text-2xl font-semibold text-gramme-dark-blue hover:text-gramme-blue transition-colors"
            >
              {item.label}
            </Link>
          ))}

          <a
            href="tel:+3242645016"
            className="flex items-center text-xl font-semibold text-gramme-blue hover:text-gramme-dark-blue transition-colors mt-8"
          >
            <Phone className="w-6 h-6 mr-3" />
            +32(0)4 264 50 16
          </a>

          <Link
            to="/contact-devis"
            className="btn-secondary text-lg px-8 py-4 mt-4"
          >
            Demander un devis
          </Link>
        </nav>
      </div>
    </header>
  );
}
