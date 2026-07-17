import { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowRight, Menu, X, ChevronDown } from 'lucide-react';

interface DropdownItem {
  label: string;
  to: string;
}

interface NavItem {
  label: string;
  href?: string;
  to?: string;
  children?: DropdownItem[];
}

const NAV_ITEMS: NavItem[] = [
  { label: 'Accueil', href: '#accueil' },
  {
    label: 'Services',
    href: '#services',
    children: [
      { label: 'Déménagement', to: '/demenagement' },
      { label: 'Garde-Meubles', to: '/garde-meubles' },
      { label: 'Monte-Meubles', to: '/monte-meubles' },
      { label: 'Déménagement international', to: '/demenagement/demenagement-international' },
    ],
  },
  {
    label: 'Zones',
    href: '#zones',
    children: [
      { label: 'Liège', to: '/demenagement/demenagement-liege' },
      { label: 'Seraing', to: '/demenagement/demenagement-seraing' },
      { label: 'Herstal', to: '/demenagement/demenagement-herstal' },
    ],
  },
  { label: 'Blog', to: '/blog' },
  { label: 'Contact', href: '#contact' },
];

function DesktopDropdown({
  items,
  scrolled,
}: {
  items: DropdownItem[];
  scrolled: boolean;
}) {
  return (
    <div className={`absolute top-full left-1/2 -translate-x-1/2 mt-2 w-56 rounded-xl shadow-xl border py-2 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 z-50 ${scrolled ? 'bg-[#0D1B5E] border-white/10' : 'bg-white border-gray-100'}`}>
      {items.map((item) => (
        <Link
          key={item.to}
          to={item.to}
          className={`block px-4 py-2.5 text-sm font-medium transition-colors ${scrolled ? 'text-white/70 hover:text-yellow hover:bg-white/5' : 'text-navy/70 hover:text-navy hover:bg-offwhite'}`}
        >
          {item.label}
        </Link>
      ))}
    </div>
  );
}

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [openMobileDropdown, setOpenMobileDropdown] = useState<string | null>(null);
  const navRef = useRef<HTMLElement>(null);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 50);
    window.addEventListener('scroll', onScroll);
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  const scrollTo = (href: string) => {
    setMobileOpen(false);
    setOpenMobileDropdown(null);
    const el = document.querySelector(href);
    if (el) el.scrollIntoView({ behavior: 'smooth' });
  };

  const handleNavClick = (item: NavItem) => {
    if (item.to) {
      setMobileOpen(false);
      return;
    }
    if (item.href) {
      scrollTo(item.href);
    }
  };

  const toggleMobileDropdown = (label: string) => {
    setOpenMobileDropdown(openMobileDropdown === label ? null : label);
  };

  return (
    <header
      ref={navRef}
      className={`sticky top-0 z-50 transition-colors duration-300 ${
        scrolled ? 'bg-navy shadow-lg' : 'bg-white shadow-sm'
      }`}
    >
      <div className="max-w-7xl mx-auto px-6 md:px-8 flex items-center justify-between h-16 md:h-[72px]">
        <button onClick={() => scrollTo('#accueil')} className="flex items-center" aria-label="Déménagements Gramme — Accueil">
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
        </button>

        <nav className="hidden lg:flex items-center gap-8">
          {NAV_ITEMS.map((item) => (
            <div key={item.label} className="relative group">
              {item.to ? (
                <Link
                  to={item.to}
                  className={`relative text-[15px] font-medium transition-colors flex items-center gap-1 ${
                    scrolled ? 'text-white hover:text-yellow' : 'text-navy'
                  }`}
                >
                  {item.label}
                </Link>
              ) : (
                <button
                  onClick={() => handleNavClick(item)}
                  className={`relative text-[15px] font-medium transition-colors flex items-center gap-1 ${
                    scrolled ? 'text-white hover:text-yellow' : 'text-navy'
                  }`}
                >
                  {item.label}
                  {item.children && <ChevronDown className="w-3.5 h-3.5" />}
                </button>
              )}
              {item.children && (
                <DesktopDropdown items={item.children} scrolled={scrolled} />
              )}
            </div>
          ))}
        </nav>

        <div className="flex items-center gap-4">
          <Link
            to="/contact-devis"
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
          className="lg:hidden bg-navy px-8 py-6 flex flex-col gap-2"
        >
          {NAV_ITEMS.map((item) => (
            <div key={item.label}>
              {item.to ? (
                <Link
                  to={item.to}
                  onClick={() => setMobileOpen(false)}
                  className="text-yellow text-lg font-bold uppercase text-left px-4 py-2 rounded transition-colors duration-200 hover:bg-[#F0B800] hover:text-[#0D1020] block"
                >
                  {item.label}
                </Link>
              ) : (
                <button
                  onClick={() => item.children ? toggleMobileDropdown(item.label) : handleNavClick(item)}
                  className="text-yellow text-lg font-bold uppercase text-left px-4 py-2 rounded transition-colors duration-200 hover:bg-[#F0B800] hover:text-[#0D1020] w-full flex items-center justify-between"
                >
                  {item.label}
                  {item.children && (
                    <ChevronDown className={`w-5 h-5 transition-transform duration-200 ${openMobileDropdown === item.label ? 'rotate-180' : ''}`} />
                  )}
                </button>
              )}
              {item.children && openMobileDropdown === item.label && (
                <div className="ml-4 mt-1 mb-2 space-y-1">
                  {item.children.map((child) => (
                    <Link
                      key={child.to}
                      to={child.to}
                      onClick={() => setMobileOpen(false)}
                      className="block text-white/70 text-base font-medium px-4 py-2 rounded hover:text-yellow hover:bg-white/5 transition-colors"
                    >
                      {child.label}
                    </Link>
                  ))}
                </div>
              )}
            </div>
          ))}
          <Link
            to="/contact-devis"
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
