import { Link } from 'react-router-dom';
import { House, ArrowRight, Phone } from 'lucide-react';
import TopBar from '../components/TopBar';
import ServiceNavbar from '../components/ServiceNavbar';
import Footer from '../components/Footer';
import SeoHead from '../components/SeoHead';

// Liens de rattrapage : on renvoie vers les pages les plus demandées plutôt
// que de laisser le visiteur dans une impasse.
const SUGGESTIONS = [
  { label: 'Déménagement', to: '/demenagement' },
  { label: 'Garde-meubles', to: '/garde-meubles' },
  { label: 'Déménagement international', to: '/demenagement/demenagement-international' },
  { label: 'Monte-meubles', to: '/monte-meubles' },
  { label: 'Blog & conseils', to: '/blog' },
  { label: 'Contact & devis', to: '/contact-devis' },
];

export default function NotFoundPage() {
  return (
    <div className="font-sans">
      <SeoHead
        title="Page introuvable (404) — Déménagements Gramme"
        description="La page demandée n'existe pas ou a été déplacée. Retrouvez nos services de déménagement, garde-meubles et transport à Liège."
        canonical="/404"
        noindex
      />
      <TopBar />
      <ServiceNavbar />

      <main id="main-content">
        <section className="bg-offwhite py-20 md:py-28">
          <div className="max-w-3xl mx-auto px-4 md:px-8 text-center">
            <p className="text-yellow font-black text-6xl md:text-8xl leading-none mb-4">404</p>
            <h1 className="text-2xl md:text-4xl font-black uppercase text-navy mb-4">
              Cette page n'existe pas
            </h1>
            <p className="text-muted text-lg leading-relaxed mb-10">
              La page que vous cherchez a été déplacée ou n'existe plus.
              Voici les pages les plus consultées&nbsp;:
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mb-12">
              {SUGGESTIONS.map((s) => (
                <Link
                  key={s.to}
                  to={s.to}
                  className="block bg-white rounded-xl p-5 border border-gray-100 hover:border-navy/20 hover:-translate-y-1 hover:shadow-md transition-all duration-300 group"
                >
                  <span className="text-navy font-bold flex items-center justify-center gap-2">
                    {s.label}
                    <ArrowRight className="w-4 h-4 opacity-0 group-hover:opacity-100 transition-opacity" />
                  </span>
                </Link>
              ))}
            </div>

            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <Link
                to="/"
                className="bg-navy text-yellow font-bold uppercase py-4 px-8 rounded flex items-center gap-2 hover:bg-[#0C2094] transition-colors duration-200"
              >
                <House className="w-5 h-5" />
                Retour à l'accueil
              </Link>
              <a
                href="tel:+3242645016"
                className="border-2 border-navy text-navy font-bold uppercase py-4 px-8 rounded flex items-center gap-2 hover:bg-navy hover:text-white transition-all duration-200"
              >
                <Phone className="w-5 h-5" />
                04 264 50 16
              </a>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
