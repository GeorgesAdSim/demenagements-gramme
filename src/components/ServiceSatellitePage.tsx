import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowRight, ArrowLeft, Phone, ChevronDown, Shield, Clock, Star, Users } from 'lucide-react';
import TopBar from './TopBar';
import ServiceNavbar from './ServiceNavbar';
import Footer from './Footer';
import MobileCTA from './MobileCTA';
import SeoHead from './SeoHead';
import SchemaOrg from './SchemaOrg';

export interface SatelliteSection {
  title: string;
  content: string;
}

export interface SatelliteFaq {
  question: string;
  answer: string;
}

export interface RelatedPage {
  label: string;
  to: string;
}

export interface SatellitePageProps {
  title: string;
  subtitle: string;
  heroImage: string;
  sections: SatelliteSection[];
  faq: SatelliteFaq[];
  relatedPages: RelatedPage[];
  meta: {
    title: string;
    description: string;
    canonical: string;
  };
}

const fadeUp = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.5, ease: [0.25, 0.1, 0.25, 1] } },
};

const ADVANTAGES = [
  { icon: Shield, label: 'Assurance incluse' },
  { icon: Clock, label: 'Depuis 1948' },
  { icon: Star, label: 'Note 5/5' },
  { icon: Users, label: 'Équipe qualifiée' },
];

export default function ServiceSatellitePage({
  title,
  subtitle,
  heroImage,
  sections,
  faq,
  relatedPages,
  meta,
}: SatellitePageProps) {
  const [openFaq, setOpenFaq] = useState<number | null>(null);

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  const BASE = 'https://www.demenagements-gramme.be';
  const SECTION_LABELS: Record<string, string> = {
    demenagement: 'Déménagement',
    transport: 'Transport',
    'garde-meubles': 'Garde-Meubles',
  };
  const segments = meta.canonical.replace(/^\//, '').split('/');
  const sectionKey = segments[0] ?? '';
  const breadcrumbs = [
    { name: 'Accueil', url: `${BASE}/` },
    ...(sectionKey ? [{ name: SECTION_LABELS[sectionKey] ?? sectionKey, url: `${BASE}/${sectionKey}` }] : []),
    { name: title, url: `${BASE}${meta.canonical}` },
  ];

  return (
    <div className="font-sans">
      <SeoHead
        title={meta.title}
        description={meta.description}
        canonical={meta.canonical}
      />
      <SchemaOrg breadcrumbs={breadcrumbs} />
      <TopBar />
      <ServiceNavbar />

      <main id="main-content" className="pb-[60px] md:pb-0">
        <section className="relative py-20 md:py-28 overflow-hidden">
          <div
            className="absolute inset-0 bg-cover bg-center bg-no-repeat"
            style={{ backgroundImage: `url(${heroImage})` }}
          />
          <div className="absolute inset-0 bg-gradient-to-r from-[#132073]/95 to-[#132073]/70" />
          <div className="max-w-7xl mx-auto px-4 md:px-8 relative z-10">
            <motion.div initial="hidden" animate="visible" variants={{ visible: { transition: { staggerChildren: 0.08 } } }}>
              <motion.div variants={fadeUp}>
                <Link to="/" className="inline-flex items-center gap-2 text-white/60 hover:text-white transition-colors text-sm mb-6">
                  <ArrowLeft className="w-4 h-4" />
                  Retour à l'accueil
                </Link>
              </motion.div>
              <motion.h1 variants={fadeUp} className="text-3xl md:text-5xl font-black uppercase text-white leading-tight max-w-3xl">
                {title}
              </motion.h1>
              <motion.p variants={fadeUp} className="text-white/80 text-lg mt-4 max-w-2xl">
                {subtitle}
              </motion.p>
              <motion.div variants={fadeUp} className="mt-8">
                <Link
                  to="/contact-devis"
                  className="inline-flex items-center gap-2 bg-yellow text-navy font-bold uppercase py-4 px-8 rounded hover:bg-white transition-colors duration-200"
                >
                  Demander un devis
                  <ArrowRight className="w-5 h-5" />
                </Link>
              </motion.div>
            </motion.div>
          </div>
        </section>

        <section className="bg-offwhite py-16 md:py-20">
          <div className="max-w-7xl mx-auto px-4 md:px-8">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-80px' }}
              transition={{ duration: 0.6 }}
              className="text-center mb-12"
            >
              <span className="inline-block bg-navy text-yellow text-[11px] uppercase tracking-[0.2em] font-bold rounded-full px-4 py-1.5 mb-4">
                POURQUOI NOUS CHOISIR
              </span>
              <h2 className="text-2xl md:text-[2rem] font-black uppercase text-navy">
                L'expertise Gramme depuis 1948
              </h2>
            </motion.div>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
              {ADVANTAGES.map((adv, i) => {
                const Icon = adv.icon;
                return (
                  <motion.div
                    key={i}
                    initial={{ opacity: 0, y: 30 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: i * 0.08, duration: 0.4 }}
                    className="bg-white rounded-2xl p-6 border border-gray-100 text-center hover:-translate-y-1 hover:shadow-lg transition-all duration-300"
                  >
                    <div className="w-12 h-12 rounded-full bg-navy flex items-center justify-center mx-auto mb-3">
                      <Icon className="w-6 h-6 text-yellow" />
                    </div>
                    <span className="text-navy font-bold text-sm">{adv.label}</span>
                  </motion.div>
                );
              })}
            </div>
          </div>
        </section>

        {sections.map((section, i) => (
          <section key={i} className={i % 2 === 0 ? 'bg-white py-16 md:py-20' : 'bg-offwhite py-16 md:py-20'}>
            <div className="max-w-4xl mx-auto px-4 md:px-8">
              <motion.div
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: '-80px' }}
                transition={{ duration: 0.6 }}
              >
                <h2 className="text-2xl md:text-[2rem] font-black uppercase text-navy mb-6">
                  {section.title}
                </h2>
                <div className="text-muted text-[15px] leading-relaxed space-y-4">
                  {section.content.split('\n\n').map((paragraph, j) => (
                    <p key={j}>{paragraph}</p>
                  ))}
                </div>
              </motion.div>
            </div>
          </section>
        ))}

        <section className="bg-offwhite py-16 md:py-20">
          <div className="max-w-3xl mx-auto px-4 md:px-8">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-80px' }}
              transition={{ duration: 0.6 }}
              className="text-center mb-10"
            >
              <span className="inline-block bg-navy text-yellow text-[11px] uppercase tracking-[0.2em] font-bold rounded-full px-4 py-1.5 mb-4">
                FAQ
              </span>
              <h2 className="text-2xl md:text-[2rem] font-black uppercase text-navy">
                Questions fréquentes
              </h2>
            </motion.div>
            <div className="space-y-4">
              {faq.map((item, i) => {
                const isOpen = openFaq === i;
                return (
                  <motion.div
                    key={i}
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: i * 0.08, duration: 0.4 }}
                    className={`bg-white rounded-xl border transition-all duration-200 ${isOpen ? 'border-l-4 border-l-navy border-gray-200' : 'border-gray-200'}`}
                  >
                    <button
                      onClick={() => setOpenFaq(isOpen ? null : i)}
                      className={`w-full flex items-center justify-between p-5 text-left transition-colors ${isOpen ? 'bg-yellow/15' : ''}`}
                    >
                      <span className="text-navy font-bold text-base pr-4">{item.question}</span>
                      <motion.div animate={{ rotate: isOpen ? 180 : 0 }} transition={{ duration: 0.2 }}>
                        <ChevronDown className="w-5 h-5 text-navy flex-shrink-0" />
                      </motion.div>
                    </button>
                    <AnimatePresence>
                      {isOpen && (
                        <motion.div
                          initial={{ height: 0, opacity: 0 }}
                          animate={{ height: 'auto', opacity: 1 }}
                          exit={{ height: 0, opacity: 0 }}
                          transition={{ duration: 0.3 }}
                          className="overflow-hidden"
                        >
                          <div className="px-5 pb-5 text-muted leading-relaxed">
                            <p>{item.answer}</p>
                          </div>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </motion.div>
                );
              })}
            </div>
          </div>
        </section>

        {relatedPages.length > 0 && (
          <section className="bg-white py-16 md:py-20">
            <div className="max-w-4xl mx-auto px-4 md:px-8">
              <motion.div
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: '-80px' }}
                transition={{ duration: 0.6 }}
                className="text-center mb-10"
              >
                <h2 className="text-2xl md:text-[2rem] font-black uppercase text-navy">
                  Pages associées
                </h2>
              </motion.div>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {relatedPages.map((page, i) => (
                  <motion.div
                    key={i}
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: i * 0.05, duration: 0.4 }}
                  >
                    <Link
                      to={page.to}
                      className="block bg-offwhite rounded-xl p-5 border border-gray-100 hover:border-navy/20 hover:-translate-y-1 hover:shadow-md transition-all duration-300 group"
                    >
                      <span className="text-navy font-bold group-hover:text-navy/80 transition-colors flex items-center gap-2">
                        {page.label}
                        <ArrowRight className="w-4 h-4 opacity-0 group-hover:opacity-100 transition-opacity" />
                      </span>
                    </Link>
                  </motion.div>
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
              <Phone className="w-12 h-12 text-yellow mx-auto mb-6" />
              <h2 className="text-2xl md:text-3xl font-black uppercase text-white mb-4">
                Demandez votre devis gratuit
              </h2>
              <p className="text-white/80 text-lg mb-8">
                Contactez-nous pour un devis personnalisé, gratuit et sans engagement. Réponse garantie sous 24h.
              </p>
              <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
                <Link
                  to="/contact-devis"
                  className="bg-yellow text-navy font-bold uppercase py-4 px-8 rounded flex items-center gap-2 hover:bg-white transition-colors duration-200"
                >
                  Demander un devis gratuit
                  <ArrowRight className="w-5 h-5" />
                </Link>
                <a
                  href="tel:+3242645016"
                  className="border-2 border-white text-white font-bold uppercase py-4 px-8 rounded flex items-center gap-2 hover:bg-white hover:text-navy transition-all duration-200"
                >
                  <Phone className="w-5 h-5" />
                  04 264 50 16
                </a>
              </div>
            </motion.div>
          </div>
        </section>
      </main>

      <MobileCTA />
      <Footer />
    </div>
  );
}
