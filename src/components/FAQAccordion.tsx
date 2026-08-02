import { useState } from 'react';
import { motion } from 'framer-motion';
import { ChevronDown } from 'lucide-react';
import type { HomepageContent } from '../lib/types';
import { FAQ_ACCUEIL } from '../data/faq';



interface Props {
  data?: HomepageContent['faq'] | null;
}

export default function FAQAccordion({ data }: Props) {
  const [openIndex, setOpenIndex] = useState<number | null>(null);
  const faqs = data || FAQ_ACCUEIL;

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

                {/* Réponse toujours montée, repliée par sa hauteur. Montée au
                    clic, elle était absente du HTML servi : le balisage
                    FAQPage décrivait alors neuf réponses introuvables dans la
                    page. `aria-hidden` évite en contrepartie qu'un lecteur
                    d'écran annonce une réponse repliée. */}
                <motion.div
                  id={answerId}
                  role="region"
                  aria-hidden={!isOpen}
                  initial={false}
                  animate={{ height: isOpen ? 'auto' : 0, opacity: isOpen ? 1 : 0 }}
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
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
