import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowRight, Menu, X } from 'lucide-react';

const NAV_LINKS = [
  { label: 'Accueil', to: '/' },
  { label: 'Déménagement', to: '/demenagement' },
  { label: 'Garde-Meubles', to: '/garde-meubles' },
  { label: 'Blog', to: '/blog' },
  { label: 'Contact', to: '/contact' },
];

export default function ServiceNavbar() {
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 50);
    window.addEventListener('scroll', onScroll);
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  return (
    <header
      className={`sticky top-0 z-50 transition-colors duration-300 ${
        scrolled ? 'bg-navy shadow-lg' : 'bg-white shadow-sm'
      }`}
    >
      <div className="max-w-7xl mx-auto px-6 md:px-8 flex items-center justify-between h-16 md:h-[72px]">
        <Link to="/" className="flex items-center" aria-label="Déménagements Gramme — Accueil">
          {scrolled ? (
            <span className="flex items-center gap-1.5">
              <span className="font-black text-[15px] uppercase tracking-tight leading-none text-white">Déménagements</span>
              <span className="font-black text-[15px] uppercase tracking-tight leading-none text-yellow">Gramme</span>
            </span>
          ) : (
            <picture>
              <source srcSet="/logo-gramme.webp" type="image/webp" />
              <img
                src="/logo-gramme.jpeg"
                alt="Déménagements Gramme"
                className="h-[56px] md:h-[70px] w-auto"
                loading="eager"
                width="2400"
                height="1792"
              />
            </picture>
          )}
        </Link>

        <nav className="hidden lg:flex items-center gap-8">
          {NAV_LINKS.map((link) => (
            <Link
              key={link.to + link.label}
              to={link.to}
              className={`relative text-[15px] font-medium transition-colors group ${
                scrolled ? 'text-white hover:text-yellow' : 'text-navy'
              }`}
            >
              {link.label}
              <span
                className={`absolute -bottom-1 left-0 h-0.5 w-0 bg-yellow group-hover:w-full transition-all duration-200`}
              />
            </Link>
          ))}
        </nav>

        <div className="flex items-center gap-4">
          <Link
            to="/contact"
            className="hidden md:flex items-center gap-1.5 px-4 py-2 rounded font-bold text-sm uppercase tracking-wide transition-all duration-200 bg-[#F0B800] text-[#0D1020] border border-[#C89A00] hover:bg-[#EAB000]"
          >
            Devis Gratuit
            <ArrowRight className="w-4 h-4" />
          </Link>

          <button
            className={`lg:hidden transition-colors ${scrolled ? 'text-white' : 'text-navy'}`}
            onClick={() => setMobileOpen(!mobileOpen)}
            aria-label="Menu"
          >
            {mobileOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>
      </div>

      {mobileOpen && (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -10 }}
          className="lg:hidden bg-navy px-8 py-6 flex flex-col gap-4"
        >
          {NAV_LINKS.map((link) => (
            <Link
              key={link.to + link.label}
              to={link.to}
              onClick={() => setMobileOpen(false)}
              className="text-yellow text-lg font-bold uppercase text-left px-4 py-2 rounded transition-colors duration-200 hover:bg-[#F0B800] hover:text-[#0D1020]"
            >
              {link.label}
            </Link>
          ))}
          <Link
            to="/contact"
            onClick={() => setMobileOpen(false)}
            className="mt-2 bg-[#F0B800] text-[#0D1020] font-bold uppercase py-3 px-6 rounded flex items-center gap-2 justify-center border border-[#C89A00]"
          >
            Devis Gratuit
            <ArrowRight className="w-4 h-4" />
          </Link>
        </motion.div>
      )}
    </header>
  );
}
