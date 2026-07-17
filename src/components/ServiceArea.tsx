import { motion } from 'framer-motion';
import type { HomepageContent } from '../lib/types';

const defaultDestinations = [
  { flag: '\uD83C\uDDE7\uD83C\uDDEA', country: 'Belgique', desc: 'Toutes villes', featured: true },
  { flag: '\uD83C\uDDEB\uD83C\uDDF7', country: 'France', desc: 'Déménagement Belgique\u2013France', featured: false },
  { flag: '\uD83C\uDDE8\uD83C\uDDED', country: 'Suisse', desc: 'Déménagement Belgique\u2013Suisse', featured: false },
  { flag: '\uD83C\uDDEA\uD83C\uDDF8', country: 'Espagne', desc: 'Déménagement Belgique\u2013Espagne', featured: false },
  { flag: '\uD83C\uDDEE\uD83C\uDDF9', country: 'Italie', desc: 'Déménagement Belgique\u2013Italie', featured: false },
  { flag: '\uD83C\uDF0D', country: 'Europe', desc: "Et bien d'autres destinations", featured: false },
];

const scrollTo = (href: string) => {
  const el = document.querySelector(href);
  if (el) el.scrollIntoView({ behavior: 'smooth' });
};

interface Props {
  data?: HomepageContent['service_area'] | null;
}

export default function ServiceArea({ data }: Props) {
  const title = data?.title || 'Nous intervenons partout';
  const subtitle = data?.subtitle || 'Local, national ou international, vos biens sont entre de bonnes mains';
  const destinations = data?.destinations || defaultDestinations;
  const bannerText = data?.banner_text || "Besoin d'un déménagement rapide ? GRAMME intervient dans des délais ultra serrés.";

  return (
    <section
      id="zones"
      className="relative py-16 md:py-24 overflow-hidden"
      style={{
        background: `
          linear-gradient(rgba(19,32,115,0.97), rgba(19,32,115,0.97)),
          repeating-linear-gradient(90deg, transparent, transparent 40px, rgba(255,255,255,0.03) 40px, rgba(255,255,255,0.03) 41px)
        `,
      }}
    >
      <div className="max-w-7xl mx-auto px-4 md:px-8">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-80px' }}
          transition={{ duration: 0.6 }}
          className="text-center mb-12"
        >
          <span className="inline-block bg-yellow text-navy text-[11px] uppercase tracking-[0.2em] font-bold rounded-full px-4 py-1.5 mb-4">
            ZONES D'INTERVENTION
          </span>
          <h2 className="text-3xl md:text-4xl font-black uppercase text-white mb-3">
            {title}
          </h2>
          <p className="text-white/70 text-lg max-w-xl mx-auto">
            {subtitle}
          </p>
        </motion.div>

        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4 mb-12">
          {destinations.map((dest, i) => (
            <motion.div
              key={dest.country}
              initial={{ opacity: 0, scale: 0.9 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1, duration: 0.5 }}
              className={`rounded-xl p-6 border transition-all duration-200 hover:bg-white/20 hover:scale-[1.02] cursor-default ${
                dest.featured
                  ? 'bg-white/15 border-white/20 border-l-4 border-l-yellow'
                  : 'bg-white/10 border-white/20'
              }`}
            >
              <span className="text-2xl leading-none block mb-2">{dest.flag}</span>
              <h3 className="text-white font-bold text-base">{dest.country}</h3>
              <p className="text-white/70 text-sm mt-1">{dest.desc}</p>
            </motion.div>
          ))}
        </div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.3 }}
          className="bg-white/10 rounded-xl p-6 flex flex-col md:flex-row items-center justify-between gap-4"
        >
          <p className="text-white text-sm md:text-base" dangerouslySetInnerHTML={{ __html: bannerText.replace('GRAMME', '<strong>GRAMME</strong>') }} />
          <button
            onClick={() => scrollTo('#contact')}
            className="bg-yellow text-navy font-bold uppercase py-3 px-6 rounded-xl hover:bg-white transition-colors duration-200 whitespace-nowrap"
          >
            Contactez-nous
          </button>
        </motion.div>
      </div>
    </section>
  );
}
