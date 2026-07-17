import { useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowRight, ArrowLeft, CircleCheck as CheckCircle2, Phone, Loader as Loader2, ShieldCheck, Info } from 'lucide-react';
import type { LucideIcon } from 'lucide-react';
import TopBar from './TopBar';
import ServiceNavbar from './ServiceNavbar';
import Footer from './Footer';
import SeoHead from './SeoHead';
import SchemaOrg from './SchemaOrg';
import { useSitePageContent } from '../lib/useSitePageContent';
import type { ServicePageContent } from '../lib/types';

const fadeUp = {
  hidden: { opacity: 0, y: 15 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.4, ease: [0.25, 0.1, 0.25, 1] } },
};

interface ServicePageLayoutProps {
  slug: string;
  ctaIcon: LucideIcon;
  stepIcons: LucideIcon[];
  guaranteeIcons?: LucideIcon[];
  heroStats?: boolean;
  defaults: ServicePageContent;
  defaultMeta: { title: string; description: string; canonical: string };
}

export default function ServicePageLayout({
  slug,
  ctaIcon: CtaIcon,
  stepIcons,
  guaranteeIcons,
  heroStats,
  defaults,
  defaultMeta,
}: ServicePageLayoutProps) {
  const { content, meta, loading } = useSitePageContent<ServicePageContent>(slug);

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  const c = content || defaults;

  if (loading) {
    return (
      <div className="font-sans">
        <TopBar />
        <ServiceNavbar />
        <div className="flex items-center justify-center py-40">
          <Loader2 className="w-8 h-8 animate-spin text-[#132073]" />
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <div className="font-sans">
      <SeoHead
        title={meta?.metaTitle || defaultMeta.title}
        description={meta?.metaDescription || defaultMeta.description}
        canonical={meta?.canonicalUrl || defaultMeta.canonical}
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
                  {c.hero.badge}
                </span>
              </motion.div>
              <motion.h1 variants={fadeUp} className="text-3xl md:text-5xl font-black uppercase text-white leading-tight">
                {c.hero.title}
              </motion.h1>
              <motion.p variants={fadeUp} className="text-white/80 text-lg mt-4 max-w-2xl">
                {c.hero.subtitle}
              </motion.p>

              {heroStats && c.hero.stats && (
                <motion.div variants={fadeUp} className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-10">
                  {c.hero.stats.map((stat) => (
                    <div key={stat.label} className="bg-white/10 backdrop-blur-sm rounded-xl p-4 border border-white/20 text-center">
                      <span className="text-yellow font-black text-2xl block">{stat.value}</span>
                      <span className="text-white/60 text-xs">{stat.label}</span>
                    </div>
                  ))}
                </motion.div>
              )}

              {!heroStats && c.hero.guarantees && guaranteeIcons && (
                <motion.div variants={fadeUp} className="flex flex-wrap gap-4 mt-8">
                  {c.hero.guarantees.map((label, i) => {
                    const Icon = guaranteeIcons[i % guaranteeIcons.length];
                    return (
                      <div key={label} className="flex items-center gap-2 bg-white/10 backdrop-blur-sm rounded-full px-3 py-1.5 border border-white/20 text-white text-[13px]">
                        <Icon className="w-4 h-4 text-yellow" />
                        {label}
                      </div>
                    );
                  })}
                </motion.div>
              )}
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
                PRESTATIONS
              </span>
              <h2 className="text-2xl md:text-[2rem] font-black uppercase text-navy">
                {c.prestations.sectionTitle}
              </h2>
            </motion.div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {c.prestations.items.map((p, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, margin: '-60px' }}
                  transition={{ delay: i * 0.05, duration: 0.4 }}
                  className="bg-white rounded-2xl p-6 border border-gray-100 hover:-translate-y-1 hover:shadow-lg transition-all duration-300"
                >
                  <div className="w-10 h-10 rounded-full bg-navy flex items-center justify-center mb-4">
                    <CheckCircle2 className="w-5 h-5 text-yellow" />
                  </div>
                  <h3 className="text-navy font-bold text-lg mb-2">{p.title}</h3>
                  <p className="text-muted text-[15px] leading-relaxed">{p.desc}</p>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        <section className="bg-white py-16 md:py-20">
          <div className="max-w-7xl mx-auto px-4 md:px-8">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-80px' }}
              transition={{ duration: 0.6 }}
              className="text-center mb-14"
            >
              <span className="inline-block bg-navy text-yellow text-[11px] uppercase tracking-[0.2em] font-bold rounded-full px-4 py-1.5 mb-4">
                PROCESSUS
              </span>
              <h2 className="text-2xl md:text-[2rem] font-black uppercase text-navy">
                {c.steps.sectionTitle}
              </h2>
            </motion.div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
              {c.steps.items.map((step, i) => {
                const StepIcon = stepIcons[i % stepIcons.length];
                return (
                  <motion.div
                    key={i}
                    initial={{ opacity: 0, y: 30 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true, margin: '-60px' }}
                    transition={{ delay: i * 0.06, duration: 0.4 }}
                    className="text-center relative"
                  >
                    <div className="relative inline-flex">
                      <div className="w-16 h-16 rounded-full bg-navy flex items-center justify-center mx-auto">
                        <StepIcon className="w-7 h-7 text-yellow" />
                      </div>
                      <span className="absolute -top-1 -right-1 w-7 h-7 rounded-full bg-yellow text-navy font-black text-sm flex items-center justify-center">
                        {i + 1}
                      </span>
                    </div>
                    {i < c.steps.items.length - 1 && (
                      <div className="hidden lg:block absolute top-8 left-[60%] w-[80%] h-px border-t-2 border-dashed border-navy/20" />
                    )}
                    <h3 className="text-navy font-bold text-lg mt-4 mb-2">{step.title}</h3>
                    <p className="text-muted text-sm leading-relaxed">{step.desc}</p>
                  </motion.div>
                );
              })}
            </div>
          </div>
        </section>

        <section className="bg-offwhite py-16 md:py-20">
          <div className="max-w-5xl mx-auto px-4 md:px-8">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-80px' }}
              transition={{ duration: 0.6 }}
              className="text-center mb-12"
            >
              <span className="inline-block bg-navy text-yellow text-[11px] uppercase tracking-[0.2em] font-bold rounded-full px-4 py-1.5 mb-4">
                INFOS PRATIQUES
              </span>
              <h2 className="text-2xl md:text-[2rem] font-black uppercase text-navy">
                {c.info.sectionTitle}
              </h2>
            </motion.div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {c.info.items.map((item, i) => (
                <div key={i} className="bg-white rounded-2xl p-6 border border-gray-100">
                  <h3 className="text-navy font-bold text-lg mb-3">{item.title}</h3>
                  <p className="text-muted text-[15px] leading-relaxed">{item.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {c.pricing && (
          <section className="bg-white py-16 md:py-20">
            <div className="max-w-5xl mx-auto px-4 md:px-8">
              <motion.div
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: '-80px' }}
                transition={{ duration: 0.6 }}
                className="text-center mb-12"
              >
                <span className="inline-block bg-navy text-yellow text-[11px] uppercase tracking-[0.2em] font-bold rounded-full px-4 py-1.5 mb-4">
                  TARIFS
                </span>
                <h2 className="text-2xl md:text-[2rem] font-black uppercase text-navy">
                  {c.pricing.sectionTitle}
                </h2>
                {c.pricing.subtitle && (
                  <p className="text-muted mt-3 max-w-xl mx-auto">{c.pricing.subtitle}</p>
                )}
              </motion.div>

              <motion.div
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: '-60px' }}
                transition={{ duration: 0.5 }}
                className="bg-gradient-to-br from-[#F8F7F4] to-white rounded-2xl border border-gray-100 overflow-hidden shadow-sm"
              >
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead>
                      <tr className="bg-navy">
                        <th className="text-left text-yellow font-bold text-sm uppercase tracking-wider py-4 px-6">Volume</th>
                        <th className="text-right text-yellow font-bold text-sm uppercase tracking-wider py-4 px-6">Prix</th>
                        <th className="text-left text-white/60 font-medium text-sm py-4 px-6 hidden sm:table-cell">Par</th>
                      </tr>
                    </thead>
                    <tbody>
                      {c.pricing.tiers.map((tier, i) => (
                        <tr
                          key={i}
                          className={`border-b border-gray-100 transition-colors hover:bg-[#F0B800]/5 ${i % 2 === 0 ? 'bg-white' : 'bg-[#FAFAF8]'}`}
                        >
                          <td className="py-4 px-6 font-bold text-navy text-[15px]">{tier.volume}</td>
                          <td className="py-4 px-6 text-right">
                            <span className="text-[#F0B800] font-black text-xl">{tier.price}</span>
                            <span className="text-navy font-medium text-sm ml-1">&euro;</span>
                          </td>
                          <td className="py-4 px-6 text-muted text-sm hidden sm:table-cell">{tier.unit}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>

                {c.pricing.extraNote && (
                  <div className="bg-[#F0B800]/10 border-t border-[#F0B800]/20 px-6 py-3 text-center">
                    <p className="text-navy font-bold text-sm">{c.pricing.extraNote}</p>
                  </div>
                )}
              </motion.div>

              {c.pricing.notes.length > 0 && (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.4, delay: 0.1 }}
                  className="mt-8 bg-[#F8F7F4] rounded-2xl p-6 border border-gray-100"
                >
                  <div className="flex items-start gap-3">
                    <Info className="w-5 h-5 text-navy mt-0.5 shrink-0" />
                    <div className="space-y-2">
                      {c.pricing.notes.map((note, i) => (
                        <p key={i} className="text-muted text-sm leading-relaxed">{note}</p>
                      ))}
                    </div>
                  </div>
                </motion.div>
              )}

              {c.pricing.insurance && (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.4, delay: 0.15 }}
                  className="mt-6 bg-navy/5 rounded-2xl p-6 border border-navy/10"
                >
                  <div className="flex items-start gap-3">
                    <ShieldCheck className="w-6 h-6 text-navy mt-0.5 shrink-0" />
                    <div>
                      <h3 className="text-navy font-bold text-lg mb-2">{c.pricing.insurance.title}</h3>
                      <ul className="space-y-1.5">
                        {c.pricing.insurance.items.map((item, i) => (
                          <li key={i} className="text-muted text-sm leading-relaxed flex items-start gap-2">
                            <CheckCircle2 className="w-4 h-4 text-navy/40 mt-0.5 shrink-0" />
                            {item}
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>
                </motion.div>
              )}
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
              <CtaIcon className="w-12 h-12 text-yellow mx-auto mb-6" />
              <h2 className="text-2xl md:text-3xl font-black uppercase text-white mb-4">
                {c.cta.title}
              </h2>
              <p className="text-white/80 text-lg mb-8">
                {c.cta.subtitle}
              </p>
              <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
                <Link
                  to="/#contact"
                  className="bg-yellow text-navy font-bold uppercase py-4 px-8 rounded flex items-center gap-2 hover:bg-white transition-colors duration-200"
                >
                  {c.cta.buttonText}
                  <ArrowRight className="w-5 h-5" />
                </Link>
                <a
                  href={`tel:+32${c.cta.phone.replace(/\s/g, '').replace(/^0/, '')}`}
                  className="border-2 border-white text-white font-bold uppercase py-4 px-8 rounded flex items-center gap-2 hover:bg-white hover:text-navy transition-all duration-200"
                >
                  <Phone className="w-5 h-5" />
                  {c.cta.phone}
                </a>
              </div>
            </motion.div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
