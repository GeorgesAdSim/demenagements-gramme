import { useState } from 'react';
import { ChevronLeft, ChevronRight, Star, Quote } from 'lucide-react';

interface Testimonial {
  id: number;
  name: string;
  text: string;
  rating: number;
  location?: string;
}

const testimonials: Testimonial[] = [
  {
    id: 1,
    name: 'Sophie Dubois',
    text: 'Service impeccable ! L\'équipe de Déménagements Gramme a été très professionnelle et soigneuse avec nos affaires. Je recommande vivement !',
    rating: 5,
    location: 'Liège',
  },
  {
    id: 2,
    name: 'Marc Lejeune',
    text: 'Plus de 60 ans d\'expérience, ça se sent ! Déménagement international vers la France réalisé sans accroc. Merci pour votre efficacité.',
    rating: 5,
    location: 'Bruxelles',
  },
  {
    id: 3,
    name: 'Isabelle Martin',
    text: 'Excellent rapport qualité-prix. L\'équipe est ponctuelle, rapide et respectueuse. Notre déménagement s\'est déroulé dans les meilleures conditions.',
    rating: 5,
    location: 'Verviers',
  },
];

export function TestimonialSection() {
  const [currentIndex, setCurrentIndex] = useState(0);

  const nextTestimonial = () => {
    setCurrentIndex((prev) => (prev + 1) % testimonials.length);
  };

  const prevTestimonial = () => {
    setCurrentIndex((prev) => (prev - 1 + testimonials.length) % testimonials.length);
  };

  const current = testimonials[currentIndex];

  return (
    <section className="bg-gradient-to-br from-gramme-blue to-gramme-dark-blue py-16 md:py-24">
      <div className="container mx-auto px-4">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
            Ils nous font confiance
          </h2>
          <p className="text-white/80 mb-12 text-lg">
            Découvrez les témoignages de nos clients satisfaits
          </p>

          <div className="relative bg-white rounded-2xl p-8 md:p-12 shadow-2xl">
            <Quote className="absolute top-4 left-4 w-12 h-12 text-gramme-yellow/20" />

            <div className="mb-6">
              {[...Array(current.rating)].map((_, i) => (
                <Star
                  key={i}
                  className="inline-block w-6 h-6 text-gramme-yellow fill-gramme-yellow"
                />
              ))}
            </div>

            <p className="text-xl md:text-2xl text-gray-700 italic mb-8 leading-relaxed">
              "{current.text}"
            </p>

            <div className="font-semibold text-gramme-dark-blue text-lg">
              {current.name}
              {current.location && (
                <span className="text-gray-500 font-normal"> - {current.location}</span>
              )}
            </div>

            {/* Navigation */}
            <div className="flex items-center justify-center gap-4 mt-8">
              <button
                onClick={prevTestimonial}
                className="p-2 rounded-full bg-gramme-blue text-white hover:bg-gramme-dark-blue transition-colors"
                aria-label="Témoignage précédent"
              >
                <ChevronLeft className="w-6 h-6" />
              </button>

              <div className="flex gap-2">
                {testimonials.map((_, index) => (
                  <button
                    key={index}
                    onClick={() => setCurrentIndex(index)}
                    className={`w-3 h-3 rounded-full transition-all ${
                      index === currentIndex
                        ? 'bg-gramme-blue w-8'
                        : 'bg-gray-300 hover:bg-gray-400'
                    }`}
                    aria-label={`Aller au témoignage ${index + 1}`}
                  />
                ))}
              </div>

              <button
                onClick={nextTestimonial}
                className="p-2 rounded-full bg-gramme-blue text-white hover:bg-gramme-dark-blue transition-colors"
                aria-label="Témoignage suivant"
              >
                <ChevronRight className="w-6 h-6" />
              </button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
