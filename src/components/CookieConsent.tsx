import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Link } from 'react-router-dom';
import { lireConsentement, enregistrerConsentement } from '../lib/consentement';

/**
 * Bandeau de consentement.
 *
 * La version précédente était décorative : elle écrivait un choix dans le
 * localStorage que rien ne lisait. Avec Tag Manager en place, « Refuser » doit
 * réellement refuser — c'est `src/lib/consentement.ts` qui s'en charge, en
 * mettant à jour Consent Mode.
 *
 * Trois exigences du RGPD tenues ici :
 *  · refuser est aussi accessible qu'accepter — deux boutons de même poids
 *    visuel, côte à côte, aucun pré-cochage ;
 *  · les finalités sont nommées, pas résumées en « nous utilisons des cookies » ;
 *  · le choix se retire à tout moment, par le lien « Gérer mes cookies » du pied
 *    de page, qui émet l'événement écouté ci-dessous.
 *
 * La croix de fermeture a disparu : fermer sans choisir revenait à un refus
 * silencieux, et un bandeau qu'on peut esquiver ne recueille pas un
 * consentement valide.
 */
export default function CookieConsent() {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    if (lireConsentement() === null) {
      const timer = setTimeout(() => setVisible(true), 1200);
      return () => clearTimeout(timer);
    }
  }, []);

  // Rouvre le bandeau quand l'utilisateur retire son consentement depuis le
  // pied de page.
  useEffect(() => {
    const rouvrir = () => setVisible(true);
    window.addEventListener('gramme:rouvrir-consentement', rouvrir);
    return () => window.removeEventListener('gramme:rouvrir-consentement', rouvrir);
  }, []);

  const decider = (decision: 'accepted' | 'refused') => {
    enregistrerConsentement(decision);
    setVisible(false);
  };

  return (
    <AnimatePresence>
      {visible && (
        <motion.div
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: 20, opacity: 0 }}
          transition={{ duration: 0.35, ease: [0.25, 0.1, 0.25, 1] }}
          className="fixed bottom-4 left-4 right-4 z-50 md:right-auto md:w-[26rem]"
          role="dialog"
          aria-modal="false"
          aria-labelledby="titre-consentement"
        >
          <div className="bg-white rounded-2xl shadow-2xl border border-gray-200 p-5">
            <p id="titre-consentement" className="text-navy font-bold text-sm leading-snug mb-2">
              Votre choix sur les cookies
            </p>
            <p className="text-muted text-xs leading-relaxed mb-3">
              Les cookies techniques, nécessaires au fonctionnement du site et de
              nos formulaires, sont toujours actifs. Nous souhaitons y ajouter la{' '}
              <strong className="text-navy">mesure d'audience</strong>, qui nous
              indique quelles pages sont consultées afin de les améliorer. Elle ne
              se déclenche qu'avec votre accord, et vous pouvez revenir sur ce
              choix à tout moment.
            </p>
            <p className="text-muted text-xs leading-relaxed mb-4">
              <Link to="/politique-confidentialite" className="text-navy underline hover:no-underline">
                Politique de confidentialité
              </Link>
            </p>
            <div className="flex gap-2">
              <button
                onClick={() => decider('refused')}
                className="flex-1 py-2.5 rounded-lg border-2 border-navy/20 text-navy text-xs font-bold hover:border-navy/50 transition-colors"
              >
                Refuser
              </button>
              <button
                onClick={() => decider('accepted')}
                className="flex-1 py-2.5 rounded-lg bg-yellow text-navy text-xs font-bold hover:bg-navy hover:text-yellow transition-colors"
              >
                Accepter
              </button>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

/**
 * Bouton de retrait, à poser dans le pied de page.
 *
 * Séparé du bandeau pour rester monté en permanence : le bandeau, lui,
 * disparaît dès qu'un choix est fait.
 */
export function GererCookies({ className }: { className?: string }) {
  return (
    <button
      type="button"
      onClick={() => import('../lib/consentement').then((m) => m.reinitialiserConsentement())}
      className={className}
    >
      Gérer mes cookies
    </button>
  );
}
