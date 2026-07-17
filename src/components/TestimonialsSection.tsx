import { motion } from 'framer-motion';
import { Star } from 'lucide-react';
import { SITE_IMAGES } from '../data/images';

// TODO: Remplacer par de vrais avis Google une fois récoltés.
// Possibilité d'utiliser l'API Google Places Reviews.
const TESTIMONIALS = [
  {
    quote: "Équipe au top, déménagement réalisé en une journée. Tout était emballé avec soin et rien n'a été cassé. Je recommande à 100 % !",
    name: 'Marie L.',
    city: 'Liège',
    avatar: SITE_IMAGES.testimonialAvatars[0],
  },
  {
    quote: "75 ans d'expérience, ça se voit. Service professionnel, devis honnête, équipe sympathique. Parfait pour notre déménagement vers la France.",
    name: 'Jean D.',
    city: 'Herstal',
    avatar: SITE_IMAGES.testimonialAvatars[1],
  },
  {
    quote: "J'ai utilisé leur garde-meubles pendant 6 mois entre deux logements. Local propre et sécurisé, accès facile. Très satisfaite.",
    name: 'Sophie M.',
    city: 'Seraing',
    avatar: SITE_IMAGES.testimonialAvatars[2],
  },
];

function Stars() {
  return (
    <div className="flex gap-0.5 mb-4">
      {[...Array(5)].map((_, i) => (
        <Star key={i} className="w-4 h-4 text-yellow fill-yellow" />
      ))}
    </div>
  );
}

export default function TestimonialsSection() {
  return (
    <section className="bg-offwhite py-16 md:py-24">
      <div className="max-w-7xl mx-auto px-4 md:px-8">

        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-80px' }}
          transition={{ duration: 0.6 }}
          className="text-center mb-12"
        >
          <span className="inline-block bg-navy text-yellow text-[11px] uppercase tracking-[0.2em] font-bold rounded-full px-4 py-1.5 mb-4">
            TÉMOIGNAGES
          </span>
          <h2 className="text-3xl md:text-4xl font-black uppercase text-navy">
            Ils nous ont fait confiance
          </h2>
          <p className="text-muted text-lg mt-3">
            +1 000 clients satisfaits depuis 1948
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
          {TESTIMONIALS.map((t, i) => (
            <motion.div
              key={t.name}
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.12, duration: 0.5 }}
              className="bg-white rounded-2xl p-8 border border-gray-100 shadow-sm hover:shadow-md transition-shadow duration-300"
            >
              <Stars />
              <p className="text-navy/80 text-[15px] leading-relaxed italic mb-6">
                "{t.quote}"
              </p>
              <div className="flex items-center gap-3">
                <img
                  src={t.avatar.src}
                  alt={t.avatar.alt}
                  className="w-11 h-11 rounded-full object-cover border-2 border-yellow/40"
                  loading="lazy"
                />
                <div>
                  <p className="font-bold text-navy text-sm">{t.name}</p>
                  <p className="text-muted text-xs">{t.city}</p>
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Banner Google */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.3 }}
          className="flex justify-center"
        >
          <a
            href="#"
            className="inline-flex items-center gap-3 bg-yellow text-navy font-bold rounded-full px-6 py-3 shadow-md hover:bg-white hover:shadow-lg transition-all duration-200 text-sm"
          >
            <div className="flex gap-0.5">
              {[...Array(5)].map((_, i) => (
                <Star key={i} className="w-3.5 h-3.5 fill-navy text-navy" />
              ))}
            </div>
            5/5 sur Google · 200+ avis vérifiés
          </a>
        </motion.div>

      </div>
    </section>
  );
}
