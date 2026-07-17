import { useState } from 'react';
import { motion } from 'framer-motion';
import { ArrowRight, Phone, CircleCheck, Star } from 'lucide-react';
import { Link } from 'react-router-dom';
import type { HomepageContent } from '../lib/types';
import { SITE_IMAGES } from '../data/images';

const container = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.1 } },
};

const fadeUp = {
  hidden: { opacity: 0, y: 30 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: [0.25, 0.1, 0.25, 1] } },
};

const TRUST_ITEMS = [
  'Réponse sous 24h',
  'Devis 100% gratuit',
  'Assurance incluse',
  '+75 ans d\'expérience',
];

const VOLUMES = [
  'Studio / 1 pièce (10–20 m³)',
  '2 pièces (20–35 m³)',
  '3 pièces (35–55 m³)',
  '4 pièces (55–75 m³)',
  'Grande maison (75–100 m³)',
  'Volume sur mesure',
];

interface Props {
  data?: HomepageContent['hero'] | null;
}

export default function HeroSection({ data }: Props) {
  // Image responsive : mobile (800px) vs desktop (1200px) — sert la bonne taille dès le premier rendu
  const bgImage = data?.background_image || (
    typeof window !== 'undefined' && window.innerWidth < 768
      ? SITE_IMAGES.hero.srcMobile
      : SITE_IMAGES.hero.src
  );

  const [quickForm, setQuickForm] = useState({ volume: '', date: '', email: '' });

  return (
    <section id="accueil" className="relative min-h-screen flex items-center overflow-hidden">
      <div
        className="absolute inset-0 bg-cover bg-center bg-no-repeat"
        style={{ backgroundImage: `url(${bgImage})` }}
      />
      <div className="absolute inset-0 bg-[#0C2094]/75" />

      <div className="relative z-10 max-w-7xl mx-auto w-full px-6 md:px-8 py-24 grid grid-cols-1 lg:grid-cols-[55%_45%] gap-10 lg:gap-16 items-center">

        {/* — COLONNE GAUCHE — */}
        <motion.div variants={container} initial="hidden" animate="visible" className="flex flex-col gap-6">

          <motion.div variants={fadeUp} className="flex items-center gap-2">
            <div className="flex items-center gap-1">
              {[...Array(5)].map((_, i) => (
                <Star key={i} className="w-4 h-4 text-yellow fill-yellow" />
              ))}
            </div>
            <span className="bg-yellow text-navy text-[13px] font-bold rounded-full px-3 py-1 border border-yellow/60">
              5/5 sur Google · +75 ans d'expérience
            </span>
          </motion.div>

          <motion.h1
            variants={fadeUp}
            className="text-[2.2rem] sm:text-5xl md:text-6xl leading-[1.08] font-black uppercase text-white"
          >
            Votre déménagement<br />
            <span className="bg-yellow text-navy px-2 py-0.5 inline-block mt-1">à Liège</span>{' '}
            <span className="text-white">&amp; partout</span><br />
            <span className="text-white/90">en Belgique</span>
          </motion.h1>

          <motion.p variants={fadeUp} className="text-white/85 text-lg md:text-xl max-w-[520px] leading-relaxed">
            Devis gratuit en 24h. Assurance incluse.<br className="hidden sm:block" />
            Sans engagement. Depuis 1948.
          </motion.p>

          <motion.div variants={fadeUp} className="flex flex-col sm:flex-row gap-4">
            <Link
              to="/contact-devis"
              className="bg-yellow text-navy font-bold uppercase rounded-lg py-4 px-8 flex items-center justify-center gap-2 border border-yellow/60 hover:bg-white hover:border-white hover:scale-[1.02] transition-all duration-200 shadow-lg shadow-yellow/20 text-base animate-[pulse-cta_3s_ease-in-out_infinite]"
            >
              Demander un devis gratuit
              <ArrowRight className="w-5 h-5" />
            </Link>
            <a
              href="tel:+3242645016"
              className="border-2 border-white/70 text-white font-bold uppercase rounded-lg py-4 px-8 flex items-center justify-center gap-2 hover:bg-white hover:text-navy transition-all duration-200 text-base"
            >
              <Phone className="w-5 h-5" />
              04 264 50 16
            </a>
          </motion.div>

          <motion.div variants={fadeUp} className="flex flex-wrap gap-x-5 gap-y-2 pt-2 border-t border-white/15">
            {TRUST_ITEMS.map((item) => (
              <div key={item} className="flex items-center gap-1.5 text-white/80 text-sm">
                <CircleCheck className="w-4 h-4 text-yellow flex-shrink-0" />
                {item}
              </div>
            ))}
          </motion.div>
        </motion.div>

        {/* — COLONNE DROITE : carte lead magnet — */}
        <motion.div
          initial={{ opacity: 0, x: 50 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.8, delay: 0.35, ease: [0.25, 0.1, 0.25, 1] }}
          className="hidden lg:block"
        >
          <div className="bg-white/95 backdrop-blur-md rounded-2xl shadow-2xl p-8 border border-white/60">
            <div className="mb-6">
              <p className="text-yellow text-[11px] font-bold uppercase tracking-[0.2em] mb-1">Estimation rapide</p>
              <h2 className="text-navy font-black text-xl uppercase">
                Combien coûte votre déménagement ?
              </h2>
            </div>

            <div className="space-y-4">
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-navy/70 mb-1.5">
                  Volume estimé
                </label>
                <select
                  value={quickForm.volume}
                  onChange={(e) => setQuickForm({ ...quickForm, volume: e.target.value })}
                  className="w-full border-2 border-gray-200 rounded-lg py-3 px-4 text-navy text-sm focus:border-yellow focus:ring-2 focus:ring-yellow/20 outline-none transition-all"
                >
                  <option value="">Sélectionnez un volume…</option>
                  {VOLUMES.map((v) => <option key={v} value={v}>{v}</option>)}
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-navy/70 mb-1.5">
                  Date souhaitée
                </label>
                <input
                  type="date"
                  value={quickForm.date}
                  onChange={(e) => setQuickForm({ ...quickForm, date: e.target.value })}
                  className="w-full border-2 border-gray-200 rounded-lg py-3 px-4 text-navy text-sm focus:border-yellow focus:ring-2 focus:ring-yellow/20 outline-none transition-all"
                />
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-navy/70 mb-1.5">
                  Votre email
                </label>
                <input
                  type="email"
                  placeholder="vous@exemple.be"
                  value={quickForm.email}
                  onChange={(e) => setQuickForm({ ...quickForm, email: e.target.value })}
                  className="w-full border-2 border-gray-200 rounded-lg py-3 px-4 text-navy text-sm placeholder:text-gray-400 focus:border-yellow focus:ring-2 focus:ring-yellow/20 outline-none transition-all"
                />
              </div>

              <Link
                to={{
                  pathname: '/contact-devis',
                  ...(quickForm.volume && { search: `?volume=${encodeURIComponent(quickForm.volume)}` }),
                }}
                className="block w-full bg-navy text-yellow font-bold uppercase py-4 text-center rounded-lg hover:bg-[#0C2094] transition-colors duration-200 text-sm tracking-wide"
              >
                Obtenir mon estimation →
              </Link>
            </div>

            <p className="mt-4 text-center text-gray-400 text-[12px]">
              🔒 Gratuit · Sans engagement · Réponse sous 24h
            </p>
          </div>
        </motion.div>

      </div>
    </section>
  );
}
