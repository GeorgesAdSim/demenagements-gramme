import { useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowLeft, ArrowRight, Calendar, Clock } from 'lucide-react';
import TopBar from '../components/TopBar';
import ServiceNavbar from '../components/ServiceNavbar';
import Footer from '../components/Footer';
import SeoHead from '../components/SeoHead';
import SchemaOrg from '../components/SchemaOrg';

interface Article {
  slug: string;
  title: string;
  excerpt: string;
  date: string;
  readTime: string;
  category: string;
  image: string;
}

const ARTICLES: Article[] = [
  {
    slug: '6-conseils-reussir-demenagement-liege',
    title: '6 conseils pour réussir votre déménagement à Liège',
    excerpt: "Préparer son déménagement peut être stressant. Voici nos conseils d'experts pour que tout se passe sans accroc : de la planification à l'emballage en passant par le choix du bon moment.",
    date: '2026-03-15',
    readTime: '5 min',
    category: 'Conseils',
    image: 'https://images.pexels.com/photos/4246120/pexels-photo-4246120.jpeg?auto=compress&cs=tinysrgb&w=800',
  },
  {
    slug: 'preparer-enfants-demenagement-liege',
    title: 'Comment préparer vos enfants à un déménagement',
    excerpt: "Un déménagement est un bouleversement pour les enfants. Découvrez nos conseils pour les accompagner dans cette transition en douceur et les aider à s'adapter à leur nouvel environnement.",
    date: '2026-02-20',
    readTime: '4 min',
    category: 'Famille',
    image: 'https://images.pexels.com/photos/7464491/pexels-photo-7464491.jpeg?auto=compress&cs=tinysrgb&w=800',
  },
  {
    slug: '6-erreurs-eviter-demenagement-liege',
    title: "6 erreurs à éviter lors d'un déménagement",
    excerpt: "Sous-estimer le volume, s'y prendre trop tard, négliger l'emballage... Découvrez les erreurs les plus courantes et nos conseils pour les éviter.",
    date: '2026-01-10',
    readTime: '4 min',
    category: 'Conseils',
    image: 'https://images.pexels.com/photos/4506270/pexels-photo-4506270.jpeg?auto=compress&cs=tinysrgb&w=800',
  },
];

function formatDate(dateStr: string): string {
  const d = new Date(dateStr);
  return d.toLocaleDateString('fr-BE', { day: 'numeric', month: 'long', year: 'numeric' });
}

const fadeUp = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.5, ease: [0.25, 0.1, 0.25, 1] } },
};

export default function ActualitesPage() {
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <div className="font-sans">
      <SeoHead
        title="Blog — Déménagements Gramme Liège"
        description="Conseils déménagement, astuces et actualités de Déménagements Gramme, votre déménageur à Liège depuis 1948."
        canonical="/blog"
      />
      <SchemaOrg />
      <TopBar />
      <ServiceNavbar />

      <main id="main-content">
        <section
          className="relative py-20 md:py-28 overflow-hidden"
          style={{ background: 'linear-gradient(135deg, #132073 0%, #0D1B5E 60%, #1A2A8A 100%)' }}
        >
          <div className="max-w-7xl mx-auto px-4 md:px-8 relative z-10">
            <motion.div initial="hidden" animate="visible" variants={{ visible: { transition: { staggerChildren: 0.08 } } }}>
              <motion.div variants={fadeUp}>
                <Link to="/" className="inline-flex items-center gap-2 text-white/60 hover:text-white transition-colors text-sm mb-6">
                  <ArrowLeft className="w-4 h-4" />
                  Retour à l'accueil
                </Link>
              </motion.div>
              <motion.div variants={fadeUp}>
                <span className="inline-block bg-yellow text-navy text-[13px] font-bold rounded-full px-4 py-1.5 mb-4">
                  BLOG
                </span>
              </motion.div>
              <motion.h1 variants={fadeUp} className="text-3xl md:text-5xl font-black uppercase text-white leading-tight">
                Actualités &amp; Conseils
              </motion.h1>
              <motion.p variants={fadeUp} className="text-white/80 text-lg mt-4 max-w-2xl">
                Retrouvez nos articles, conseils pratiques et dernières nouvelles autour du déménagement et du stockage.
              </motion.p>
            </motion.div>
          </div>
        </section>

        <section className="bg-offwhite py-16 md:py-20">
          <div className="max-w-7xl mx-auto px-4 md:px-8">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {ARTICLES.map((article, i) => (
                <motion.article
                  key={article.slug}
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, margin: '-60px' }}
                  transition={{ delay: i * 0.1, duration: 0.5 }}
                  className="bg-white rounded-2xl overflow-hidden border border-gray-100 hover:-translate-y-1 hover:shadow-lg transition-all duration-300 group"
                >
                  <Link to={`/blog/${article.slug}`}>
                    <div className="aspect-[16/10] overflow-hidden">
                      <img
                        src={article.image}
                        alt={article.title}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                        loading="lazy"
                      />
                    </div>
                    <div className="p-6">
                      <div className="flex items-center gap-3 mb-3">
                        <span className="inline-block bg-navy text-yellow text-[11px] uppercase tracking-wider font-bold rounded-full px-3 py-1">
                          {article.category}
                        </span>
                        <span className="flex items-center gap-1 text-muted text-xs">
                          <Clock className="w-3 h-3" />
                          {article.readTime}
                        </span>
                      </div>
                      <h2 className="text-navy font-bold text-lg mb-2 group-hover:text-navy/80 transition-colors">
                        {article.title}
                      </h2>
                      <p className="text-muted text-[15px] leading-relaxed mb-4">
                        {article.excerpt}
                      </p>
                      <div className="flex items-center justify-between">
                        <span className="flex items-center gap-1.5 text-muted text-xs">
                          <Calendar className="w-3.5 h-3.5" />
                          {formatDate(article.date)}
                        </span>
                        <span className="text-navy font-bold text-sm flex items-center gap-1 group-hover:gap-2 transition-all">
                          Lire
                          <ArrowRight className="w-4 h-4" />
                        </span>
                      </div>
                    </div>
                  </Link>
                </motion.article>
              ))}
            </div>
          </div>
        </section>

        <section className="bg-navy py-16 md:py-20">
          <div className="max-w-3xl mx-auto px-4 md:px-8 text-center">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
            >
              <h2 className="text-2xl md:text-3xl font-black uppercase text-white mb-4">
                Un projet de déménagement ?
              </h2>
              <p className="text-white/80 text-lg mb-8">
                Contactez notre équipe pour un devis gratuit et sans engagement. Plus de 75 ans d'expérience à votre service.
              </p>
              <Link
                to="/contact-devis"
                className="inline-flex items-center gap-2 bg-yellow text-navy font-bold uppercase py-4 px-8 rounded hover:bg-white transition-colors duration-200"
              >
                Demander un devis gratuit
                <ArrowRight className="w-5 h-5" />
              </Link>
            </motion.div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
