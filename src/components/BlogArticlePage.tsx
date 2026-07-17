import { useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowLeft, ArrowRight, Calendar, User } from 'lucide-react';
import TopBar from './TopBar';
import ServiceNavbar from './ServiceNavbar';
import Footer from './Footer';
import SeoHead from './SeoHead';
import SchemaOrg from './SchemaOrg';

export interface ArticleSection {
  heading: string;
  content: string;
}

export interface RelatedArticle {
  title: string;
  to: string;
}

export interface BlogArticleProps {
  title: string;
  publishDate: string;
  author?: string;
  heroImage: string;
  sections: ArticleSection[];
  relatedArticles: RelatedArticle[];
  meta: {
    title: string;
    description: string;
    canonical: string;
  };
}

function formatDate(dateStr: string): string {
  const d = new Date(dateStr);
  return d.toLocaleDateString('fr-BE', { day: 'numeric', month: 'long', year: 'numeric' });
}

const fadeUp = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.5, ease: [0.25, 0.1, 0.25, 1] } },
};

export default function BlogArticlePage({
  title,
  publishDate,
  author = 'Equipe Gramme',
  heroImage,
  sections,
  relatedArticles,
  meta,
}: BlogArticleProps) {
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <div className="font-sans">
      <SeoHead
        title={meta.title}
        description={meta.description}
        canonical={meta.canonical}
        ogType="article"
      />
      <SchemaOrg
        articleData={{
          title: meta.title,
          publishDate,
          url: `https://www.demenagements-gramme.be${meta.canonical}`,
          image: heroImage,
        }}
      />
      <TopBar />
      <ServiceNavbar />

      <main id="main-content">
        <section className="relative py-20 md:py-28 overflow-hidden">
          <div
            className="absolute inset-0 bg-cover bg-center bg-no-repeat"
            style={{ backgroundImage: `url(${heroImage})` }}
          />
          <div className="absolute inset-0 bg-gradient-to-t from-[#132073]/95 via-[#132073]/70 to-[#132073]/50" />
          <div className="max-w-4xl mx-auto px-4 md:px-8 relative z-10">
            <motion.div initial="hidden" animate="visible" variants={{ visible: { transition: { staggerChildren: 0.08 } } }}>
              <motion.div variants={fadeUp}>
                <Link to="/blog" className="inline-flex items-center gap-2 text-white/60 hover:text-white transition-colors text-sm mb-6">
                  <ArrowLeft className="w-4 h-4" />
                  Retour au blog
                </Link>
              </motion.div>
              <motion.div variants={fadeUp}>
                <span className="inline-block bg-yellow text-navy text-[13px] font-bold rounded-full px-4 py-1.5 mb-4">
                  BLOG
                </span>
              </motion.div>
              <motion.h1 variants={fadeUp} className="text-3xl md:text-5xl font-black text-white leading-tight">
                {title}
              </motion.h1>
              <motion.div variants={fadeUp} className="flex items-center gap-4 mt-6 text-white/60 text-sm">
                <span className="flex items-center gap-1.5">
                  <Calendar className="w-4 h-4" />
                  {formatDate(publishDate)}
                </span>
                <span className="flex items-center gap-1.5">
                  <User className="w-4 h-4" />
                  {author}
                </span>
              </motion.div>
            </motion.div>
          </div>
        </section>

        <article className="bg-white py-16 md:py-20">
          <div className="max-w-[700px] mx-auto px-4 md:px-8">
            {sections.map((section, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: '-60px' }}
                transition={{ duration: 0.5, delay: i * 0.05 }}
                className="mb-10"
              >
                <h2 className="text-xl md:text-2xl font-black text-navy mb-4">
                  {section.heading}
                </h2>
                <div className="text-muted text-[16px] leading-[1.8] space-y-4">
                  {section.content.split('\n\n').map((paragraph, j) => (
                    <p key={j}>{paragraph}</p>
                  ))}
                </div>
              </motion.div>
            ))}
          </div>
        </article>

        {relatedArticles.length > 0 && (
          <section className="bg-offwhite py-16 md:py-20">
            <div className="max-w-4xl mx-auto px-4 md:px-8">
              <h2 className="text-2xl font-black uppercase text-navy mb-8 text-center">
                Articles similaires
              </h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {relatedArticles.map((article, i) => (
                  <Link
                    key={i}
                    to={article.to}
                    className="block bg-white rounded-xl p-5 border border-gray-100 hover:border-navy/20 hover:-translate-y-1 hover:shadow-md transition-all duration-300 group"
                  >
                    <span className="text-navy font-bold group-hover:text-navy/80 transition-colors flex items-center gap-2">
                      {article.title}
                      <ArrowRight className="w-4 h-4 opacity-0 group-hover:opacity-100 transition-opacity flex-shrink-0" />
                    </span>
                  </Link>
                ))}
              </div>
            </div>
          </section>
        )}

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
