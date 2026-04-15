import { Link } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';

interface HeroProps {
  title: string;
  subtitle?: string;
  ctaText?: string;
  ctaLink?: string;
  backgroundImage?: string;
  isHomePage?: boolean;
}

export function Hero({
  title,
  subtitle,
  ctaText = 'Devis gratuit',
  ctaLink = '/contact-devis',
  backgroundImage,
  isHomePage = false,
}: HeroProps) {
  const heroHeight = isHomePage ? 'min-h-[600px] md:min-h-[700px]' : 'min-h-[400px] md:min-h-[500px]';

  return (
    <section
      className={`relative ${heroHeight} flex items-center justify-center overflow-hidden`}
      style={{
        backgroundImage: backgroundImage
          ? `linear-gradient(135deg, rgba(12, 32, 148, 0.85) 0%, rgba(12, 32, 148, 0.4) 100%), url(${backgroundImage})`
          : 'linear-gradient(135deg, #0c2094 0%, #0d1c78 100%)',
        backgroundSize: 'cover',
        backgroundPosition: 'center',
      }}
    >
      <div className="absolute inset-0 bg-gradient-to-br from-gramme-blue/90 via-gramme-dark-blue/80 to-gramme-blue/90" />

      <div className="container mx-auto px-4 relative z-10">
        <div className="max-w-4xl mx-auto text-center text-white">
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6 text-white animate-fade-in-up text-balance">
            {title}
          </h1>

          {subtitle && (
            <p className="text-lg md:text-xl lg:text-2xl mb-8 text-white/90 animate-fade-in-up animation-delay-100 max-w-2xl mx-auto text-balance">
              {subtitle}
            </p>
          )}

          {ctaText && ctaLink && (
            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center animate-fade-in-up animation-delay-200">
              <Link
                to={ctaLink}
                className="btn-secondary inline-flex items-center gap-2 text-lg px-8 py-4"
              >
                {ctaText}
                <ArrowRight className="w-5 h-5" />
              </Link>
              <a
                href="tel:+3242645016"
                className="text-white font-semibold hover:text-gramme-yellow transition-colors text-lg"
              >
                Ou appelez-nous : +32(0)4 264 50 16
              </a>
            </div>
          )}
        </div>
      </div>

      {/* Formes décoratives */}
      <div className="absolute bottom-0 left-0 right-0 h-24 bg-gradient-to-t from-white to-transparent" />
    </section>
  );
}
