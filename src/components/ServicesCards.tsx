import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Truck, Warehouse, Globe, ArrowUpFromLine, ArrowRight } from 'lucide-react';
import type { HomepageContent } from '../lib/types';

const HERO_CARD = {
  title: 'Déménagement',
  subtitle: 'Particuliers & Entreprises',
  description: 'De la visite technique au dernier carton posé, nos équipes prennent en charge l\'intégralité de votre déménagement. Emballage professionnel, transport sécurisé, démontage et remontage de meubles.',
  image: 'https://images.unsplash.com/photo-1600518464441-9154a4dea21b?w=1400&q=80&auto=format&fit=crop',
  link: '/demenagement',
  icon: Truck,
};

const SECONDARY_CARDS = [
  {
    title: 'Garde-Meubles',
    description: 'Stockage sécurisé et flexible à Herstal. Box individuels fermés à clé, surveillance 24/7, assurance incluse.',
    image: 'https://images.unsplash.com/photo-1586528116311-ad8dd3c8310d?w=600&q=75&auto=format&fit=crop',
    link: '/garde-meubles',
    icon: Warehouse,
  },
  {
    title: 'International',
    description: 'France, Suisse, Espagne, Italie et toute l\'Europe. Formalités douanières gérées, assurance voyage incluse.',
    image: 'https://images.unsplash.com/photo-1436491865332-7a61a109cc05?w=600&q=75&auto=format&fit=crop',
    link: '/demenagement/demenagement-international',
    icon: Globe,
  },
  {
    title: 'Monte-Meubles',
    description: 'Service de monte-meubles pour les étages élevés et les accès difficiles. Jusqu\'au 10e étage.',
    image: 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=600&q=75&auto=format&fit=crop',
    link: '/monte-meubles',
    icon: ArrowUpFromLine,
  },
];

interface Props {
  data?: HomepageContent['services'] | null;
}

export default function ServicesCards({ data }: Props) {
  const sectionTitle = data?.sectionTitle || 'Des solutions pour chaque besoin';
  const sectionSubtitle = data?.sectionSubtitle || 'Déménagement, garde-meubles, international ou monte-meubles : Gramme s\'occupe de tout.';

  return (
    <section id="services" className="bg-offwhite py-16 md:py-24">
      <div className="max-w-7xl mx-auto px-4 md:px-8">

        {/* En-tête section */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-80px' }}
          transition={{ duration: 0.6 }}
          className="text-center mb-12"
        >
          <span className="inline-block bg-navy text-yellow text-[11px] uppercase tracking-[0.2em] font-bold rounded-full px-4 py-1.5 mb-4">
            NOS SERVICES
          </span>
          <h2 className="text-3xl md:text-4xl font-black uppercase text-navy">
            {sectionTitle}
          </h2>
          <p className="text-muted text-lg mt-3 max-w-xl mx-auto">
            {sectionSubtitle}
          </p>
        </motion.div>

        {/* Card hero — Déménagement */}
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-80px' }}
          transition={{ duration: 0.6 }}
          className="relative rounded-2xl overflow-hidden shadow-xl mb-6 group"
        >
          <div
            className="absolute inset-0 bg-cover bg-center transition-transform duration-700 group-hover:scale-105"
            style={{ backgroundImage: `url(${HERO_CARD.image})` }}
          />
          <div className="absolute inset-0 bg-gradient-to-r from-navy/90 via-navy/70 to-navy/30" />
          <div className="relative z-10 p-8 md:p-12 flex flex-col md:flex-row items-start md:items-end justify-between gap-6 min-h-[260px]">
            <div className="max-w-xl">
              <div className="inline-flex items-center gap-2 bg-yellow/20 text-yellow text-[11px] uppercase tracking-[0.2em] font-bold rounded-full px-3 py-1 mb-4">
                <HERO_CARD.icon className="w-3.5 h-3.5" />
                {HERO_CARD.subtitle}
              </div>
              <h3 className="text-3xl md:text-4xl font-black uppercase text-white mb-3">
                {HERO_CARD.title}
              </h3>
              <p className="text-white/80 text-base md:text-lg leading-relaxed">
                {HERO_CARD.description}
              </p>
            </div>
            <Link
              to={HERO_CARD.link}
              className="flex-shrink-0 inline-flex items-center gap-2 bg-yellow text-navy font-bold uppercase py-4 px-8 rounded-xl hover:bg-white transition-colors duration-200 shadow-lg text-sm"
            >
              En savoir plus
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </motion.div>

        {/* 4 cards secondaires */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
          {SECONDARY_CARDS.map((card, i) => {
            const Icon = card.icon;
            return (
              <motion.div
                key={card.title}
                initial={{ opacity: 0, y: 40 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: '-80px' }}
                transition={{ delay: i * 0.08, duration: 0.5 }}
                className="bg-white rounded-2xl shadow-md hover:shadow-xl transition-all duration-300 overflow-hidden group hover:-translate-y-1"
              >
                {/* Image */}
                <div className="relative h-44 overflow-hidden">
                  <img
                    src={card.image}
                    alt={card.title}
                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                    loading="lazy"
                  />
                  <div className="absolute inset-0 bg-navy/20 group-hover:bg-navy/10 transition-colors duration-300" />
                  {/* Icône flottante */}
                  <div className="absolute -bottom-5 left-6 w-12 h-12 rounded-full bg-yellow shadow-lg flex items-center justify-center">
                    <Icon className="w-5 h-5 text-navy" />
                  </div>
                </div>

                {/* Contenu */}
                <div className="pt-8 pb-6 px-6">
                  <h3 className="text-lg font-black uppercase text-navy mb-2">
                    {card.title}
                  </h3>
                  <p className="text-muted text-sm leading-relaxed mb-5">
                    {card.description}
                  </p>
                  <Link
                    to={card.link}
                    className="inline-flex items-center gap-1.5 text-navy font-bold text-sm hover:text-yellow transition-colors group/link"
                  >
                    En savoir plus
                    <ArrowRight className="w-4 h-4 transition-transform group-hover/link:translate-x-1" />
                  </Link>
                </div>
              </motion.div>
            );
          })}
        </div>

      </div>
    </section>
  );
}
