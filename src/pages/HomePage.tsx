import { Link } from 'react-router-dom';
import { Truck, Package, Warehouse, ArrowRight } from 'lucide-react';
import { SEO } from '../components/SEO';
import { Hero } from '../components/Hero';
import { ServiceCard } from '../components/ServiceCard';
import { StatsBanner } from '../components/StatsBanner';
import { FAQ } from '../components/FAQ';
import { TestimonialSection } from '../components/TestimonialSection';
import { ContactForm } from '../components/ContactForm';
import { ScrollReveal } from '../components/ScrollReveal';
import { usePageBySlug } from '../hooks/usePageBySlug';
import { useFAQ } from '../hooks/useFAQ';

export function HomePage() {
  const { page, loading } = usePageBySlug('accueil');
  const { faqs } = useFAQ('accueil');

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="inline-block w-16 h-16 border-4 border-gramme-blue border-t-transparent rounded-full animate-spin mb-4" />
          <p className="text-gramme-dark-blue font-semibold">Chargement...</p>
        </div>
      </div>
    );
  }

  if (!page) {
    return (
      <div className="container mx-auto px-4 py-16 text-center">
        <h1 className="text-4xl font-bold text-gramme-dark-blue">Page non trouvée</h1>
      </div>
    );
  }

  return (
    <>
      <SEO
        title={page.meta_title || page.title}
        description={page.meta_description || undefined}
        ogImage={page.og_image || undefined}
      />

      {/* Hero Section */}
      <Hero
        title="Déménagement à Liège"
        subtitle="Votre déménageur de confiance depuis plus de 60 ans"
        ctaText="Devis gratuit"
        ctaLink="/contact-devis"
        isHomePage={true}
      />

      {/* Nos Services */}
      <section className="py-16 md:py-24 bg-white">
        <div className="container mx-auto px-4">
          <ScrollReveal>
            <div className="text-center mb-12">
              <h2 className="text-3xl md:text-4xl font-bold text-gramme-dark-blue mb-4">
                Nos services de déménagement
              </h2>
              <p className="text-lg text-gray-600 max-w-2xl mx-auto">
                Une solution adaptée à chaque besoin, avec le professionnalisme qui fait notre réputation
              </p>
            </div>
          </ScrollReveal>

          <div className="grid md:grid-cols-3 gap-8 mt-12">
            <ScrollReveal delay={100}>
              <ServiceCard
                icon={Truck}
                title="Déménagement"
                description="Déménagement complet de particuliers et professionnels en Belgique et à l'international. Équipe expérimentée et matériel adapté."
                link="/demenagements"
                linkText="Découvrir nos déménagements"
              />
            </ScrollReveal>

            <ScrollReveal delay={200}>
              <ServiceCard
                icon={Package}
                title="Transport"
                description="Transport de marchandises et d'objets volumineux. Capacité jusqu'à 26 000 kg et 100 m³. Service rapide et sécurisé."
                link="/transports"
                linkText="Nos solutions de transport"
              />
            </ScrollReveal>

            <ScrollReveal delay={300}>
              <ServiceCard
                icon={Warehouse}
                title="Garde-meubles"
                description="Stockage sécurisé de vos biens dans nos entrepôts. Solutions flexibles court et long terme avec accès facilité."
                link="/garde-meubles"
                linkText="En savoir plus"
              />
            </ScrollReveal>
          </div>
        </div>
      </section>

      {/* Stats Banner */}
      <StatsBanner />

      {/* Contenu principal */}
      {page.content && (
        <section className="py-16 md:py-24 bg-gramme-gray">
          <div className="container mx-auto px-4">
            <ScrollReveal>
              <div
                className="prose prose-lg max-w-none"
                dangerouslySetInnerHTML={{ __html: page.content }}
              />
            </ScrollReveal>
          </div>
        </section>
      )}

      {/* Témoignages */}
      <TestimonialSection />

      {/* FAQ */}
      {faqs.length > 0 && (
        <section className="py-16 md:py-24 bg-white">
          <div className="container mx-auto px-4">
            <ScrollReveal>
              <div className="text-center mb-12">
                <h2 className="text-3xl md:text-4xl font-bold text-gramme-dark-blue mb-4">
                  Questions fréquentes
                </h2>
                <p className="text-lg text-gray-600">
                  Trouvez les réponses aux questions les plus courantes
                </p>
              </div>
            </ScrollReveal>

            <div className="max-w-4xl mx-auto">
              <ScrollReveal delay={100}>
                <FAQ faqs={faqs} />
              </ScrollReveal>
            </div>
          </div>
        </section>
      )}

      {/* Formulaire de contact */}
      <section className="py-16 md:py-24 bg-gramme-gray">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto">
            <ScrollReveal>
              <ContactForm />
            </ScrollReveal>
          </div>
        </div>
      </section>

      {/* CTA Final */}
      <section className="py-16 md:py-24 bg-gradient-to-br from-gramme-blue to-gramme-dark-blue text-white">
        <div className="container mx-auto px-4 text-center">
          <ScrollReveal>
            <h2 className="text-3xl md:text-4xl font-bold mb-6">
              Prêt à déménager en toute sérénité ?
            </h2>
            <p className="text-xl mb-8 text-white/90 max-w-2xl mx-auto">
              Contactez-nous dès aujourd'hui pour obtenir votre devis gratuit et personnalisé
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
              <Link
                to="/contact-devis"
                className="btn-secondary inline-flex items-center gap-2 text-lg px-8 py-4"
              >
                Demander un devis gratuit
                <ArrowRight className="w-5 h-5" />
              </Link>
              <a
                href="tel:+3242645016"
                className="text-white font-semibold hover:text-gramme-yellow transition-colors text-lg"
              >
                Ou appelez-nous : +32(0)4 264 50 16
              </a>
            </div>
          </ScrollReveal>
        </div>
      </section>
    </>
  );
}
