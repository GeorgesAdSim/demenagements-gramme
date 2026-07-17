import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Link } from 'react-router-dom';
import { X } from 'lucide-react';

const COOKIE_KEY = 'gramme_cookie_consent';

export default function CookieConsent() {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const consent = localStorage.getItem(COOKIE_KEY);
    if (!consent) {
      const timer = setTimeout(() => setVisible(true), 1500);
      return () => clearTimeout(timer);
    }
  }, []);

  const accept = () => { localStorage.setItem(COOKIE_KEY, 'accepted'); setVisible(false); };
  const refuse = () => { localStorage.setItem(COOKIE_KEY, 'refused'); setVisible(false); };

  return (
    <AnimatePresence>
      {visible && (
        <motion.div
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: 20, opacity: 0 }}
          transition={{ duration: 0.35, ease: [0.25, 0.1, 0.25, 1] }}
          className="fixed bottom-4 left-4 z-50 w-[calc(100vw-2rem)] max-w-sm"
        >
          <div className="bg-white rounded-2xl shadow-2xl border border-gray-200 p-5">
            <div className="flex items-start justify-between gap-3 mb-3">
              <p className="text-navy font-bold text-sm leading-snug">
                Nous utilisons des cookies
              </p>
              <button
                onClick={refuse}
                className="text-gray-400 hover:text-navy transition-colors flex-shrink-0"
                aria-label="Fermer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
            <p className="text-muted text-xs leading-relaxed mb-4">
              Ce site utilise des cookies essentiels pour assurer son bon fonctionnement.{' '}
              <Link to="/politique-confidentialite" className="text-navy underline hover:no-underline">
                En savoir plus
              </Link>
            </p>
            <div className="flex gap-2">
              <button
                onClick={refuse}
                className="flex-1 py-2 rounded-lg border border-gray-200 text-navy text-xs font-bold hover:bg-gray-50 transition-colors"
              >
                Refuser
              </button>
              <button
                onClick={accept}
                className="flex-1 py-2 rounded-lg bg-yellow text-navy text-xs font-bold hover:bg-navy hover:text-yellow transition-colors"
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
