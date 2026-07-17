import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { CircleCheck } from 'lucide-react';
import { SITE_IMAGES } from '../data/images';
import type { HomepageContent } from '../lib/types';

const FEATURES = [
  { title: 'Équipe expérimentée', text: 'Plus de 15 ans d\'ancienneté moyenne — vos biens entre des mains expertes.' },
  { title: 'Devis gratuit sous 24h', text: 'Réponse rapide, tarifs transparents, sans surprise ni frais cachés.' },
  { title: 'Assurance tous risques incluse', text: 'Couverture complète vol, incendie et dégradation sur chaque déménagement.' },
  { title: 'Matériel professionnel', text: 'Monte-meubles, camions équipés, sangles et protections adaptées.' },
];

interface Props {
  data?: HomepageContent['whyus'] | null;
}

export default function WhyUs({ data }: Props) {
  const sectionTitle = data?.sectionTitle || '75 ans de savoir-faire familial liégeois';
  const sectionSubtitle = data?.sectionSubtitle || 'Fondée en 1948, Déménagements Gramme est une entreprise familiale ancrée à Liège. Trois générations au service des particuliers et des entreprises, avec la même exigence de qualité.';

  return (
    <section id="demenagements" className="bg-white py-16 md:py-24 overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 md:px-8 grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16 items-center">

        {/* Photo gauche */}
        <motion.div
          initial={{ opacity: 0, x: -50 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true, margin: '-80px' }}
          transition={{ duration: 0.7, ease: [0.25, 0.1, 0.25, 1] }}
          className="relative"
        >
          <div className="rounded-2xl overflow-hidden shadow-2xl aspect-[4/3]">
            <img
              src={SITE_IMAGES.team.src}
              alt={SITE_IMAGES.team.alt}
              className="w-full h-full object-cover"
              loading="lazy"
            />
          </div>
          {/* Badge flottant */}
          <div className="absolute -bottom-5 -right-5 bg-yellow rounded-2xl shadow-xl px-6 py-4 text-center">
            <span className="font-black text-4xl text-navy leading-none block">75</span>
            <span className="text-navy/70 text-xs uppercase tracking-wider font-bold">ans</span>
          </div>
        </motion.div>

        {/* Texte droite */}
        <motion.div
          initial={{ opacity: 0, x: 50 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true, margin: '-80px' }}
          transition={{ duration: 0.7, ease: [0.25, 0.1, 0.25, 1] }}
          className="flex flex-col gap-6"
        >
          <div>
            <span className="inline-block bg-yellow text-navy text-[11px] uppercase tracking-[0.2em] font-bold rounded-full px-4 py-1.5 mb-4">
              POURQUOI GRAMME
            </span>
            <h2 className="text-3xl md:text-4xl font-black uppercase text-navy leading-tight">
              {sectionTitle}
            </h2>
          </div>

          <p className="text-muted text-lg leading-relaxed">
            {sectionSubtitle}
          </p>

          <ul className="space-y-4">
            {FEATURES.map((f, i) => (
              <motion.li
                key={f.title}
                initial={{ opacity: 0, x: 20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1, duration: 0.4 }}
                className="flex items-start gap-3"
              >
                <div className="w-6 h-6 rounded-full bg-yellow/20 flex items-center justify-center flex-shrink-0 mt-0.5">
                  <CircleCheck className="w-4 h-4 text-navy" />
                </div>
                <div>
                  <span className="font-bold text-navy">{f.title}</span>
                  <span className="text-muted text-sm"> — {f.text}</span>
                </div>
              </motion.li>
            ))}
          </ul>

          <div className="flex flex-col sm:flex-row gap-3 pt-2">
            <Link
              to="/contact-devis"
              className="inline-flex items-center justify-center gap-2 bg-navy text-yellow font-bold uppercase py-3.5 px-8 rounded-xl hover:bg-[#0C2094] transition-colors duration-200 text-sm"
            >
              Demander un devis gratuit
            </Link>
            <Link
              to="/demenagement"
              className="inline-flex items-center justify-center gap-2 border-2 border-navy text-navy font-bold uppercase py-3.5 px-8 rounded-xl hover:bg-navy hover:text-white transition-all duration-200 text-sm"
            >
              Découvrir nos services
            </Link>
          </div>
        </motion.div>

      </div>
    </section>
  );
}
