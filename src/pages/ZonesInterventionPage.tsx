import { useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowRight, Phone } from 'lucide-react';
import TopBar from '../components/TopBar';
import ServiceNavbar from '../components/ServiceNavbar';
import ContactForm from '../components/ContactForm';
import MobileCTA from '../components/MobileCTA';
import Footer from '../components/Footer';
import SeoHead from '../components/SeoHead';
import SchemaOrg from '../components/SchemaOrg';
import { anneesExperience } from '../lib/anciennete';
import { COMMUNES, communeUrl, RACINE_ZONES } from '../data/communes';

const BASE_URL = 'https://www.demenagements-gramme.be';

const fadeUp = {
  hidden: { opacity: 0, y: 24 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.5 } },
};

export default function ZonesInterventionPage() {
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  const ans = anneesExperience();

  // Une commune est liable dès qu'une page existe pour elle : soit sa page
  // locale publiée, soit une page satellite antérieure. Liège et Herstal sont
  // en brouillon côté données mais disposent depuis longtemps d'une page
  // satellite indexée — les citer sans lien priverait ces pages du maillage
  // que cette page est censée distribuer.
  const avecPage = COMMUNES.filter((c) => c.statut === 'published' || c.pageExistante)
    .slice()
    .sort((a, b) => a.nom.localeCompare(b.nom, 'fr'));

  // Les autres sont citées, jamais liées : aucune page n'existe pour elles.
  const sansPage = COMMUNES.filter((c) => !avecPage.includes(c))
    .slice()
    .sort((a, b) => a.nom.localeCompare(b.nom, 'fr'));

  // Regroupement par arrondissement : 84 noms en une seule liste sont
  // illisibles, et l'arrondissement est la seule clé géographique fiable du
  // fichier source.
  const parArrondissement = new Map<string, typeof sansPage>();
  for (const c of sansPage) {
    const cle = c.arrondissement ?? 'Autres';
    const liste = parArrondissement.get(cle) ?? [];
    liste.push(c);
    parArrondissement.set(cle, liste);
  }
  const arrondissements = [...parArrondissement.keys()].sort((a, b) => a.localeCompare(b, 'fr'));

  return (
    <div className="font-sans">
      <SeoHead
        title="Zones d'intervention en province de Liège | Gramme"
        description={`Déménagements Gramme intervient dans les ${COMMUNES.length} communes de la province de Liège depuis son dépôt de Herstal. Devis gratuit sous 24h.`}
        canonical={RACINE_ZONES}
      />
      <SchemaOrg
        breadcrumbs={[
          { name: 'Accueil', url: `${BASE_URL}/` },
          { name: "Zones d'intervention", url: `${BASE_URL}${RACINE_ZONES}` },
        ]}
      />
      <TopBar />
      <ServiceNavbar />

      <main id="main-content" className="pb-[60px] md:pb-0">
        <section
          className="relative py-20 md:py-28"
          style={{ background: 'linear-gradient(135deg, #132073 0%, #0D1B5E 60%, #1A2A8A 100%)' }}
        >
          <div className="max-w-5xl mx-auto px-4 md:px-8">
            <span className="inline-block bg-yellow text-navy text-[13px] font-bold rounded-full px-4 py-1.5 mb-4">
              Province de Liège
            </span>
            <h1 className="text-[2.2rem] md:text-5xl font-black uppercase text-white leading-[1.1] mb-5">
              Nos zones d'intervention
            </h1>
            <p className="text-white/85 text-lg md:text-xl leading-relaxed max-w-3xl">
              Depuis notre dépôt de Herstal, nous déménageons particuliers et
              entreprises dans les {COMMUNES.length} communes de la province de
              Liège, et partout en Belgique. {ans} ans de terrain, trois
              générations, un devis gratuit sous 24 heures ouvrables.
            </p>
          </div>
        </section>

        <section className="bg-white py-16 md:py-24">
          <div className="max-w-5xl mx-auto px-4 md:px-8">
            <nav aria-label="Fil d'Ariane" className="text-sm text-muted mb-8">
              <Link to="/" className="hover:text-navy underline">Accueil</Link>
              <span className="mx-2">/</span>
              <span className="text-navy font-medium">Zones d'intervention</span>
            </nav>

            {avecPage.length > 0 && (
              <motion.div initial="hidden" whileInView="visible" viewport={{ once: true, margin: '-80px' }} variants={fadeUp}>
                <h2 className="text-2xl md:text-3xl font-black uppercase text-navy mb-3">
                  Communes avec une page dédiée
                </h2>
                <p className="text-muted text-[16px] leading-relaxed mb-6">
                  Distance depuis notre dépôt, villages desservis et contraintes
                  locales, commune par commune :
                </p>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {avecPage.map((c) => (
                    <Link
                      key={c.id}
                      to={communeUrl(c)}
                      className="group bg-offwhite rounded-2xl p-5 border border-gray-100 hover:border-navy/30 transition-colors"
                    >
                      <p className="text-navy font-black text-lg uppercase group-hover:underline">
                        Déménagement à {c.nom}
                      </p>
                      <p className="text-muted text-sm mt-1">
                        {[
                          c.codesPostaux.join(' · '),
                          c.distanceDepotKm !== null ? `${c.distanceDepotKm} km du dépôt` : null,
                          c.tempsTrajetEstimeMin !== null ? `${c.tempsTrajetEstimeMin} min` : null,
                        ]
                          .filter(Boolean)
                          .join(' — ')}
                      </p>
                    </Link>
                  ))}
                </div>
              </motion.div>
            )}

            <motion.div
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, margin: '-60px' }}
              variants={fadeUp}
              className="mt-14"
            >
              <h2 className="text-2xl md:text-3xl font-black uppercase text-navy mb-3">
                Toutes les communes que nous desservons
              </h2>
              <p className="text-muted text-[16px] leading-relaxed mb-8">
                Nous intervenons dans l'ensemble de la province, y compris les
                communes ci-dessous qui n'ont pas encore de page détaillée.
                Appelez-nous, nous vous dirons en deux minutes si nous pouvons
                intervenir à votre adresse.
              </p>

              {arrondissements.map((arr) => (
                <div key={arr} className="mb-8">
                  <h3 className="text-navy font-bold text-lg mb-3">
                    Arrondissement de {arr}
                  </h3>
                  <div className="flex flex-wrap gap-2">
                    {(parArrondissement.get(arr) ?? []).map((c) => (
                      <span
                        key={c.id}
                        className="bg-offwhite border border-gray-200 text-navy text-sm rounded-full px-3.5 py-1.5"
                      >
                        {c.nom}
                      </span>
                    ))}
                  </div>
                </div>
              ))}
            </motion.div>

            <div className="mt-12 bg-navy rounded-2xl p-8 text-center">
              <p className="text-white text-xl md:text-2xl font-black uppercase mb-2">
                Votre commune est dans la liste&nbsp;?
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

        <ContactForm />
      </main>

      <MobileCTA />
      <Footer />
    </div>
  );
}
