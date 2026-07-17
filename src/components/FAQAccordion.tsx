import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronDown } from 'lucide-react';
import type { HomepageContent } from '../lib/types';

const defaultFaqs: HomepageContent['faq'] = [
  {
    q: 'Comment choisir un bon déménageur à Liège ?',
    a: "Travailler avec une société spécialisée fait toute la différence. Vérifiez que l'entreprise dispose d'une assurance responsabilité civile professionnelle et d'un numéro d'entreprise valide. Chez Gramme, nous sommes actifs depuis 1948, assurés tous risques, et nous fournissons un devis gratuit sous 24h.",
  },
  {
    q: 'Comment faire ses cartons de déménagement ?',
    a: "Un emballage bien organisé vous fera gagner un temps précieux le jour J et protégera efficacement vos affaires.",
    list: [
      "Commencez 2 à 3 semaines avant par les pièces les moins utilisées",
      "Objets lourds en dessous, légers au-dessus — ne dépassez pas 20 kg par carton",
      "Protégez la vaisselle et les objets fragiles avec du papier journal ou du papier bulle",
      "Inscrivez le nom de la pièce de destination et le contenu sur chaque carton",
      "Préparez un carton essentiel premier jour",
      "Notre équipe peut se charger de l'emballage complet de votre domicile",
    ],
  },
  {
    q: 'Quels volumes pouvez-vous déménager ?',
    a: "Nos véhicules couvrent des volumes allant de 4 m³ (idéal pour un studio) jusqu'à 100 m³ (maison complète). Pour les projets de grande envergure, nous pouvons mobiliser plusieurs véhicules et équipes le même jour.",
  },
  {
    q: 'Intervenez-vous en dehors de Liège ?',
    a: "Absolument ! Bien que notre siège soit à Liège, nous couvrons l'ensemble de la Belgique ainsi que toute l'Europe.",
  },
];

interface Props {
  data?: HomepageContent['faq'] | null;
}

export default function FAQAccordion({ data }: Props) {
  const [openIndex, setOpenIndex] = useState<number | null>(null);
  const faqs = data || defaultFaqs;

  const toggle = (i: number) => setOpenIndex(openIndex === i ? null : i);

  return (
    <section id="garde-meubles" className="bg-offwhite py-16 md:py-24">
      <div className="max-w-[800px] mx-auto px-4">
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
          <h2 className="text-3xl md:text-4xl font-black uppercase text-navy">
            Questions fréquentes
          </h2>
        </motion.div>

        <div className="space-y-4">
          {faqs.map((faq, i) => {
            const isOpen = openIndex === i;
            const answerId = `faq-answer-${i}`;
            return (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.08, duration: 0.4 }}
                className={`bg-white rounded-xl border transition-all duration-200 ${
                  isOpen ? 'border-l-4 border-l-navy border-gray-200' : 'border-gray-200'
                }`}
              >
                <button
                  onClick={() => toggle(i)}
                  aria-expanded={isOpen}
                  aria-controls={answerId}
                  className={`w-full flex items-center justify-between p-5 text-left transition-colors ${
                    isOpen ? 'bg-yellow/15' : ''
                  }`}
                >
                  <span className="text-navy font-bold text-base pr-4">{faq.q}</span>
                  <motion.div animate={{ rotate: isOpen ? 180 : 0 }} transition={{ duration: 0.2 }}>
                    <ChevronDown className="w-5 h-5 text-navy flex-shrink-0" />
                  </motion.div>
                </button>

                <AnimatePresence>
                  {isOpen && (
                    <motion.div
                      id={answerId}
                      role="region"
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: 'auto', opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.3 }}
                      className="overflow-hidden"
                    >
                      <div className="px-5 pb-5 text-muted leading-relaxed">
                        {faq.a && <p>{faq.a}</p>}
                        {faq.list && (
                          <ul className="space-y-2 mt-2">
                            {faq.list.map((item, j) => (
                              <li key={j} className="flex items-start gap-2">
                                <span className="w-1.5 h-1.5 rounded-full bg-navy mt-2 flex-shrink-0" />
                                {item}
                              </li>
                            ))}
                          </ul>
                        )}
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
  );
}
