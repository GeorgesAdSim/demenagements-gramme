import { useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowRight, Phone } from 'lucide-react';
import TopBar from '../components/TopBar';
import ServiceNavbar from '../components/ServiceNavbar';
import ContactForm from '../components/ContactForm';
import MobileCTA from '../components/MobileCTA';
import Footer from '../components/Footer';
import SeoHead from '../components/SeoHead';
import SchemaOrg from '../components/SchemaOrg';
import NotFoundPage from './NotFoundPage';
import { pageServiceParSlug } from '../data/pages-service';
import { RACINE_ZONES } from '../data/communes';

const BASE_URL = 'https://www.demenagements-gramme.be';

const fadeUp = {
  hidden: { opacity: 0, y: 24 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.5 } },
};

/**
 * Gabarit unique des pages de service rédigées — /vide-maison,
 * /prix-demenagement.
 *
 * Un seul composant pour toutes : le contenu vit dans src/data/pages-service.ts.
 * Deux composants React auraient recréé, sur des pages de service, la
 * duplication de gabarit que le chantier des communes a mis quatre lots à
 * retirer.
 *
 * Boilerplate volontairement absent : ni cartes services, ni bloc d'ancienneté
 * long. Le formulaire est rendu en variante `locale`, la même que les pages
 * communes — titre, une ligne, formulaire, lien vers le formulaire complet.
 */
export default function ServiceContentPage() {
  const { pathname } = useLocation();
  const page = pageServiceParSlug(pathname.replace(/\/$/, ''));

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);

  if (!page) return <NotFoundPage />;

  // Brouillon : la page n'est ni pré-rendue, ni au sitemap, ni dans la
  // navigation, donc inatteignable en production. Le noindex est la ceinture
  // en plus des bretelles, pour le cas où une URL fuiterait.
  const brouillon = page.verifiePar !== 'human';
  const sections = page.sections.filter((s) => s.contenu.trim());

  return (
    <div className="font-sans">
      <SeoHead
        title={page.meta.title || page.nomService}
        description={page.meta.description || page.nomService}
        canonical={page.slug}
        noindex={brouillon}
      />
      <SchemaOrg
        servicePage={
          brouillon
            ? undefined
            : {
                serviceType: page.serviceType,
                name: page.nomService,
                url: `${BASE_URL}${page.slug}`,
                description: page.answerCapsule || undefined,
                offre: page.offre,
              }
        }
        customFaq={brouillon || page.faq.length === 0 ? undefined : page.faq.map((q) => ({ q: q.question, a: q.reponse }))}
        breadcrumbs={
          brouillon
            ? undefined
            : [
                { name: 'Accueil', url: `${BASE_URL}/` },
                { name: page.nomService, url: `${BASE_URL}${page.slug}` },
              ]
        }
      />
      <TopBar />
      <ServiceNavbar />

      <main id="main-content" className="pb-[60px] md:pb-0">
        <section className="bg-white pt-12 pb-16 md:pt-16 md:pb-24">
          <div className="max-w-5xl mx-auto px-4 md:px-8">
            <nav aria-label="Fil d'Ariane" className="text-sm text-muted mb-8">
              <Link to="/" className="hover:text-navy underline">Accueil</Link>
              <span className="mx-2">/</span>
              <span className="text-navy font-medium">{page.nomService}</span>
            </nav>

            {brouillon && (
              <p className="mb-8 rounded-xl border-2 border-dashed border-yellow bg-yellow/10 px-5 py-4 text-navy text-sm">
                <strong>Brouillon.</strong> Cette page n'est pas publiée : ni pré-rendue, ni au
                sitemap, ni dans la navigation. Elle attend {page.donneesManquantes.length} donnée(s)
                métier — voir <code>reports/donnees-metier-a-valider.md</code>.
              </p>
            )}

            <h1 className="text-3xl md:text-5xl font-black uppercase text-navy leading-tight mb-6">
              {page.nomService}
            </h1>

            {/* Bloc de tête destiné à l'extraction : entités nommées, chiffres. */}
            {page.answerCapsule && (
              <p className="text-navy text-lg md:text-xl leading-relaxed border-l-4 border-yellow pl-5 mb-10 font-medium">
                {page.answerCapsule}
              </p>
            )}

            {sections.map((section) => (
              <motion.div
                key={section.titre}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true, margin: '-60px' }}
                variants={fadeUp}
                className="mt-12"
              >
                <h2 className="text-2xl md:text-3xl font-black uppercase text-navy mb-5">
                  {section.titre}
                </h2>
                <div className="space-y-4">
                  {section.contenu.split('\n\n').map((paragraphe) => (
                    <p key={paragraphe.slice(0, 40)} className="text-muted text-[17px] leading-relaxed">
                      {paragraphe}
                    </p>
                  ))}
                </div>
              </motion.div>
            ))}

            {/* FAQ visible — le balisage FAQPage reprend exactement ces textes */}
            {page.faq.length > 0 && (
              <motion.div
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true, margin: '-60px' }}
                variants={fadeUp}
                className="mt-12 bg-navy/5 rounded-2xl p-6 md:p-8 border border-navy/10"
              >
                <h2 className="text-2xl md:text-3xl font-black uppercase text-navy mb-6">
                  Questions fréquentes
                </h2>
                {page.faq.map((f, i) => (
                  <div key={f.question} className={i > 0 ? 'mt-6' : ''}>
                    <p className="text-navy font-bold text-lg mb-2">{f.question}</p>
                    <p className="text-muted text-[16px] leading-relaxed">{f.reponse}</p>
                  </div>
                ))}
              </motion.div>
            )}

            {page.maillageSortant.length > 0 && (
              <p className="mt-10 text-muted text-[15px] leading-relaxed">
                À voir aussi :{' '}
                {page.maillageSortant.map((l, i) => (
                  <span key={l.to}>
                    {i > 0 && ' · '}
                    <Link to={l.to} className="text-navy font-bold underline hover:text-navy/70">
                      {l.libelle}
                    </Link>
                  </span>
                ))}
                {' · '}
                <Link to={RACINE_ZONES} className="text-navy font-bold underline hover:text-navy/70">
                  zones d'intervention
                </Link>
              </p>
            )}

            <div className="mt-12 bg-navy rounded-2xl p-8 text-center">
              <p className="text-white text-xl md:text-2xl font-black uppercase mb-2">
                Une question sur votre projet&nbsp;?
              </p>
              <p className="text-white/80 mb-6">
                Visite technique et devis gratuits, réponse sous 24 heures ouvrables.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Link
                  to="/contact-devis"
                  className="bg-yellow text-navy font-bold uppercase rounded-lg py-4 px-8 inline-flex items-center justify-center gap-2 hover:bg-white transition-colors"
                >
                  Demander un devis gratuit
                  <ArrowRight className="w-5 h-5" />
                </Link>
                <a
                  href="tel:+3242645016"
                  className="border-2 border-white/70 text-white font-bold uppercase rounded-lg py-4 px-8 inline-flex items-center justify-center gap-2 hover:bg-white hover:text-navy transition-colors"
                >
                  <Phone className="w-5 h-5" />
                  04 264 50 16
                </a>
              </div>
            </div>
          </div>
        </section>

        <ContactForm variant="locale" />
      </main>

      <MobileCTA />
      <Footer />
    </div>
  );
}
