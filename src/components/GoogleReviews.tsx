import { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Star, ChevronLeft, ChevronRight, Quote, ExternalLink } from 'lucide-react';

interface Review {
  author: string;
  rating: number;
  timeAgo: string;
  comment: string | null;
}

const reviews: Review[] = [
  {
    author: 'Guerric Dabée',
    rating: 5,
    timeAgo: 'il y a 2 ans',
    comment: "Simplement pour remercier l'équipe qui nous a déménagé ce jour. 4 gars au top. Efficacité et sourires au rendez vous. Je recommande vivement !",
  },
  {
    author: 'Hugues Lacroix',
    rating: 5,
    timeAgo: 'il y a 6 ans',
    comment: "C'est par hasard que je les ai croisés un jour. Après un premier contact téléphonique très convivial, et une visite du patron, le devis est dans les prix.",
  },
  {
    author: 'J',
    rating: 5,
    timeAgo: 'il y a 5 ans',
    comment: "Entreprise serieuse et efficace, le personnel est à l'écoute et le travail est réalisé minutieusement. À recommander lors d'un déménagement.",
  },
  {
    author: 'Murielle Golewski',
    rating: 5,
    timeAgo: 'il y a 3 ans',
    comment: "Au téléphone super compréhensif, j'ai dû reporter 2 fois la date indépendamment de ma volonté et ils ont accepté. J'attend le déménagement avec impatience.",
  },
  {
    author: 'Maribelle Pipa Redondo',
    rating: 5,
    timeAgo: 'il y a 2 ans',
    comment: 'Très bonne équipe, Pierre et Salim, déménagement sans stress et dans la bonne humeur. Merci.',
  },
  {
    author: 'Christiane Thys',
    rating: 4,
    timeAgo: 'il y a 4 ans',
    comment: 'Déménageurs efficaces et rapides. Je recommande ! Juste un petit problème de timing mais au final réglé assez rapidement.',
  },
  {
    author: 'Léonie Boreux',
    rating: 5,
    timeAgo: 'il y a 7 ans',
    comment: 'Top comme toujours. Rapidité, efficacité, gentillesse,... et humour. A recommander chaleureusement.',
  },
  {
    author: 'Charles Cerny',
    rating: 5,
    timeAgo: 'il y a 3 ans',
    comment: 'Super équipe ! Rapport qualité prix imbattables.',
  },
  {
    author: 'Jean-Luc Saive',
    rating: 5,
    timeAgo: 'il y a 8 ans',
    comment: 'Travail impeccable, rien à redire. Double déménagement réussi !',
  },
  {
    author: 'MIGLIARI Nadia',
    rating: 5,
    timeAgo: 'il y a 3 ans',
    comment: 'Très satisfaite. (efficacité, amabilité, disponibilité).',
  },
];

function StarRating({ rating }: { rating: number }) {
  return (
    <div className="flex gap-0.5">
      {Array.from({ length: 5 }).map((_, i) => (
        <Star
          key={i}
          className={`w-4 h-4 ${
            i < rating ? 'text-yellow fill-yellow' : 'text-gray-300'
          }`}
        />
      ))}
    </div>
  );
}

function ReviewCard({ review }: { review: Review }) {
  const initials = review.author
    .split(' ')
    .map((n) => n[0])
    .join('')
    .slice(0, 2)
    .toUpperCase();

  return (
    <div className="bg-white rounded-2xl p-6 md:p-8 shadow-sm border border-gray-100 h-full flex flex-col">
      <Quote className="w-8 h-8 text-yellow/40 mb-4 flex-shrink-0" />

      {review.comment && (
        <p className="text-text leading-relaxed flex-1 text-[15px] md:text-base">
          "{review.comment}"
        </p>
      )}

      <div className="mt-6 pt-5 border-t border-gray-100 flex items-center gap-3">
        <div className="w-10 h-10 rounded-full bg-navy flex items-center justify-center flex-shrink-0">
          <span className="text-yellow font-bold text-sm">{initials}</span>
        </div>
        <div className="min-w-0">
          <p className="text-navy font-bold text-sm truncate">{review.author}</p>
          <div className="flex items-center gap-2 mt-0.5">
            <StarRating rating={review.rating} />
            <span className="text-muted text-xs">{review.timeAgo}</span>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function GoogleReviews() {
  const [currentPage, setCurrentPage] = useState(0);
  const [itemsPerPage, setItemsPerPage] = useState(3);

  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth < 768) setItemsPerPage(1);
      else if (window.innerWidth < 1024) setItemsPerPage(2);
      else setItemsPerPage(3);
    };
    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const totalPages = Math.ceil(reviews.length / itemsPerPage);

  const prev = useCallback(() => {
    setCurrentPage((p) => (p === 0 ? totalPages - 1 : p - 1));
  }, [totalPages]);

  const next = useCallback(() => {
    setCurrentPage((p) => (p === totalPages - 1 ? 0 : p + 1));
  }, [totalPages]);

  useEffect(() => {
    const timer = setInterval(next, 6000);
    return () => clearInterval(timer);
  }, [next]);

  const visibleReviews = reviews.slice(
    currentPage * itemsPerPage,
    currentPage * itemsPerPage + itemsPerPage
  );

  return (
    <section className="bg-offwhite py-16 md:py-20 overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 md:px-8">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-80px' }}
          transition={{ duration: 0.6 }}
          className="text-center mb-12"
        >
          <span className="inline-block bg-navy text-yellow text-[11px] uppercase tracking-[0.2em] font-bold rounded-full px-4 py-1.5 mb-4">
            AVIS CLIENTS
          </span>
          <h2 className="text-2xl md:text-[2rem] font-black uppercase text-navy">
            Ce que nos clients disent
          </h2>
          <div className="flex items-center justify-center gap-3 mt-4">
            <div className="flex items-center gap-1">
              {Array.from({ length: 5 }).map((_, i) => (
                <Star
                  key={i}
                  className={`w-5 h-5 ${
                    i < 4 ? 'text-yellow fill-yellow' : 'text-yellow fill-yellow/40'
                  }`}
                />
              ))}
            </div>
            <span className="text-navy font-black text-lg">3,9</span>
            <span className="text-muted text-sm">/5 sur Google (21 avis)</span>
          </div>
        </motion.div>

        <div className="relative">
          <AnimatePresence mode="wait">
            <motion.div
              key={currentPage}
              initial={{ opacity: 0, x: 40 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -40 }}
              transition={{ duration: 0.35 }}
              className={`grid gap-6 ${
                itemsPerPage === 1
                  ? 'grid-cols-1 max-w-lg mx-auto'
                  : itemsPerPage === 2
                  ? 'grid-cols-2'
                  : 'grid-cols-3'
              }`}
            >
              {visibleReviews.map((review) => (
                <ReviewCard key={review.author} review={review} />
              ))}
            </motion.div>
          </AnimatePresence>

          <button
            onClick={prev}
            className="absolute left-0 top-1/2 -translate-y-1/2 -translate-x-3 md:-translate-x-5 w-10 h-10 rounded-full bg-white shadow-md border border-gray-200 flex items-center justify-center text-navy hover:bg-navy hover:text-white transition-colors duration-200"
            aria-label="Avis précédents"
          >
            <ChevronLeft className="w-5 h-5" />
          </button>
          <button
            onClick={next}
            className="absolute right-0 top-1/2 -translate-y-1/2 translate-x-3 md:translate-x-5 w-10 h-10 rounded-full bg-white shadow-md border border-gray-200 flex items-center justify-center text-navy hover:bg-navy hover:text-white transition-colors duration-200"
            aria-label="Avis suivants"
          >
            <ChevronRight className="w-5 h-5" />
          </button>
        </div>

        <div className="flex items-center justify-center gap-2 mt-8">
          {Array.from({ length: totalPages }).map((_, i) => (
            <button
              key={i}
              onClick={() => setCurrentPage(i)}
              className={`rounded-full transition-all duration-300 ${
                i === currentPage
                  ? 'w-8 h-2.5 bg-navy'
                  : 'w-2.5 h-2.5 bg-navy/20 hover:bg-navy/40'
              }`}
              aria-label={`Page ${i + 1}`}
            />
          ))}
        </div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.3, duration: 0.5 }}
          className="text-center mt-8"
        >
          <a
            href="https://www.google.com/maps/place/D%C3%A9m%C3%A9nagements+Gramme+s.c.r.l./"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 text-navy font-bold hover:text-yellow transition-colors duration-200"
          >
            Voir tous les avis sur Google
            <ExternalLink className="w-4 h-4" />
          </a>
        </motion.div>
      </div>
    </section>
  );
}
