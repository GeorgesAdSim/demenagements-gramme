import { useEffect } from 'react';
import { Link, useParams } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowRight, MapPin, Clock, Route as RouteIcon, Phone } from 'lucide-react';
import TopBar from '../components/TopBar';
import ServiceNavbar from '../components/ServiceNavbar';
import HeroSection from '../components/HeroSection';
import ServicesCards from '../components/ServicesCards';
import WhyUs from '../components/WhyUs';
import ContactForm from '../components/ContactForm';
import MobileCTA from '../components/MobileCTA';
import Footer from '../components/Footer';
import SeoHead from '../components/SeoHead';
import SchemaOrg from '../components/SchemaOrg';
import NotFoundPage from './NotFoundPage';
import { anneesExperience } from '../lib/anciennete';
import {
  getCommuneBySlug,
  getNeighborCommunes,
  communeUrl,
  cheminCommune,
  slugDepuisSegment,
  RACINE_ZONES,
  RACINE_COMMUNES,
  type CommuneSEO,
} from '../data/communes';

const BASE_URL = 'https://www.demenagements-gramme.be';

const fadeUp = {
  hidden: { opacity: 0, y: 24 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.5 } },
};

/**
 * FAQ construite à partir des seules données vérifiées de la commune.
 *
 * Aucune question n'est générée si l'information correspondante manque : une
 * réponse inventée sur une distance ou un village serait un mensonge servi au
 * visiteur autant qu'au moteur, et le balisage FAQPage l'amplifierait.
 */
function construireFaq(c: CommuneSEO): Array<{ q: string; a: string }> {
  const faq: Array<{ q: string; a: string }> = [];

  if (c.distanceDepotKm !== null && c.tempsTrajetEstimeMin !== null) {
    faq.push({
      q: `À quelle distance de ${c.nom} se trouve votre dépôt ?`,
      a: `Notre dépôt est situé rue des Naiveux 64 à Herstal, à environ ${c.distanceDepotKm} km de ${c.nom}, soit à peu près ${c.tempsTrajetEstimeMin} minutes de route. Cette proximité limite les frais d'approche facturés sur le devis.`,
    });
  }

  if (c.villages.length > 0) {
    faq.push({
      q: `Intervenez-vous dans tous les villages de ${c.nom} ?`,
      a: `Oui. Nous desservons l'ensemble de l'entité, ${c.villages.join(', ')} compris, au même titre que le centre de ${c.nom}.`,
    });
  }

  faq.push({
    q: `Comment obtenir un devis pour un déménagement à ${c.nom} ?`,
    a: `Appelez le 04 264 50 16 ou remplissez le formulaire en ligne. Nous organisons une visite technique gratuite sur place pour mesurer le volume réel, puis nous remettons un devis détaillé sous 24 heures ouvrables, sans engagement.`,
  });

  return faq;
}

export default function CommuneLandingPage() {
  // Le segment d'URL porte le préfixe « demenagement- » : React Router 6 ne
  // sait pas le retirer lui-même, un segment ne peut pas être partiellement
  // dynamique. On le découpe ici.
  const { slug: segment } = useParams<{ slug: string }>();
  const slug = slugDepuisSegment(segment);
  const commune = slug ? getCommuneBySlug(slug) : undefined;

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [segment]);

  // Slug inconnu : véritable 404, et non une page vide en statut 200. Le script
  // de contrôle du build refuse les soft 404.
  if (!commune) return <NotFoundPage />;

  // Une commune qui dispose déjà d'une page satellite publiée n'a pas de page
  // ici : c'est la satellite qui porte la requête. On y renvoie plutôt que de
  // servir deux URL concurrentes.
  if (commune.pageExistante) {
    return (
      <div className="font-sans">
        <SeoHead
          title={`Déménagement à ${commune.nom} | Déménagements Gramme`}
          description={`Déménagement à ${commune.nom} par Déménagements Gramme.`}
          canonical={commune.pageExistante}
          noindex
        />
        <TopBar />
        <ServiceNavbar />
        <main id="main-content" className="max-w-3xl mx-auto px-4 py-24 text-center">
          <h1 className="text-3xl font-black uppercase text-navy mb-4">
            Déménagement à {commune.nom}
          </h1>
          <p className="text-muted text-lg mb-8">
            Cette commune dispose de sa propre page détaillée.
          </p>
          <Link
            to={commune.pageExistante}
            className="inline-flex items-center gap-2 bg-navy text-yellow font-bold uppercase rounded-lg py-4 px-8"
          >
            Voir la page déménagement à {commune.nom}
            <ArrowRight className="w-5 h-5" />
          </Link>
        </main>
        <Footer />
      </div>
    );
  }

  const brouillon = commune.statut === 'draft';
  const url = cheminCommune(commune.id);
  const faq = construireFaq(commune);
  const voisinesLiables = getNeighborCommunes(commune);
  // Voisines encore en brouillon : citées en texte, sans lien. Un lien vers une
  // page noindex dépense du maillage sans rien en retirer ; le nom seul garde
  // la valeur sémantique de proximité géographique.
  const voisinesTexte = commune.communesVoisines
    .filter((s) => !voisinesLiables.some((v) => v.id === s))
    .map((s) => getCommuneBySlug(s))
    .filter((c): c is CommuneSEO => c !== undefined);

  const ans = anneesExperience();

  return (
    <div className="font-sans">
      <SeoHead
        title={`Déménagement à ${commune.nom} : devis gratuit 24h | Gramme`}
        description={
          `Déménagement à ${commune.nom} par une entreprise familiale liégeoise active depuis 1948. ` +
          `Dépôt à ${commune.distanceDepotKm ?? '—'} km. Devis gratuit sous 24h, sans engagement.`
        }
        canonical={url}
        noindex={brouillon}
      />
      <SchemaOrg
        customFaq={brouillon ? undefined : faq}
        localService={
          brouillon
            ? undefined
            : { ville: commune.nom, codesPostaux: commune.codesPostaux, url: `${BASE_URL}${url}` }
        }
        breadcrumbs={
          brouillon
            ? undefined
            : [
                { name: 'Accueil', url: `${BASE_URL}/` },
                { name: 'Déménagement', url: `${BASE_URL}${RACINE_COMMUNES}` },
                { name: `Déménagement à ${commune.nom}`, url: `${BASE_URL}${url}` },
              ]
        }
      />
      <TopBar />
      <ServiceNavbar />

      <main id="main-content" className="pb-[60px] md:pb-0">
        {/* Hero mutualisé avec l'accueil, paramétré par cityName. Un seul H1. */}
        <HeroSection cityName={commune.nom} />

        <section className="bg-white py-16 md:py-24">
          <div className="max-w-5xl mx-auto px-4 md:px-8">
            <nav aria-label="Fil d'Ariane" className="text-sm text-muted mb-8">
              <Link to="/" className="hover:text-navy underline">Accueil</Link>
              <span className="mx-2">/</span>
              <Link to={RACINE_COMMUNES} className="hover:text-navy underline">Déménagement</Link>
              <span className="mx-2">/</span>
              <span className="text-navy font-medium">{commune.nom}</span>
            </nav>

            <motion.div initial="hidden" whileInView="visible" viewport={{ once: true, margin: '-80px' }} variants={fadeUp}>
              <h2 className="text-3xl md:text-4xl font-black uppercase text-navy leading-tight mb-6">
                Déménageur à {commune.nom} depuis 1948
              </h2>

              {/* Bloc de tête destiné à l'extraction : entités nommées,
                  distance réelle, périmètre. */}
              {commune.introductionLocale && (
                <p className="text-navy text-lg md:text-xl leading-relaxed border-l-4 border-yellow pl-5 mb-8 font-medium">
                  {commune.introductionLocale}
                </p>
              )}

              <p className="text-muted text-[17px] leading-relaxed">
                Déménagements Gramme est une entreprise familiale établie rue des
                Naiveux 64 à Herstal, active depuis 1948 — soit {ans} ans et trois
                générations. Nous déménageons particuliers et entreprises à{' '}
                {commune.nom} avec des véhicules de 4 à 100 m³ équipés
                d'élévateurs, et nous remettons un devis gratuit sous 24 heures
                ouvrables.
              </p>
            </motion.div>

            {/* Repères logistiques — uniquement des valeurs mesurées */}
            {(commune.distanceDepotKm !== null || commune.tempsTrajetEstimeMin !== null || commune.codesPostaux.length > 0) && (
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mt-10">
                {commune.distanceDepotKm !== null && (
                  <div className="bg-offwhite rounded-2xl p-6 border border-gray-100">
                    <RouteIcon className="w-5 h-5 text-navy mb-3" />
                    <p className="text-navy font-black text-2xl">{commune.distanceDepotKm} km</p>
                    <p className="text-muted text-sm">depuis notre dépôt de Herstal</p>
                  </div>
                )}
                {commune.tempsTrajetEstimeMin !== null && (
                  <div className="bg-offwhite rounded-2xl p-6 border border-gray-100">
                    <Clock className="w-5 h-5 text-navy mb-3" />
                    <p className="text-navy font-black text-2xl">{commune.tempsTrajetEstimeMin} min</p>
                    <p className="text-muted text-sm">de trajet indicatif</p>
                  </div>
                )}
                {commune.codesPostaux.length > 0 && (
                  <div className="bg-offwhite rounded-2xl p-6 border border-gray-100">
                    <MapPin className="w-5 h-5 text-navy mb-3" />
                    <p className="text-navy font-black text-2xl">{commune.codesPostaux.join(' · ')}</p>
                    <p className="text-muted text-sm">
                      {commune.codesPostaux.length > 1 ? 'codes postaux couverts' : 'code postal'}
                    </p>
                  </div>
                )}
              </div>
            )}

            {/* Spécificités locales validées par Gramme */}
            {commune.informationsLocales && commune.informationsLocales.length > 0 && (
              <motion.div
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true, margin: '-60px' }}
                variants={fadeUp}
                className="mt-12"
              >
                <h2 className="text-2xl md:text-3xl font-black uppercase text-navy mb-5">
                  Ce qui change à {commune.nom}
                </h2>
                <ul className="space-y-3">
                  {commune.informationsLocales.map((info) => (
                    <li key={info} className="flex items-start gap-3">
                      <span className="w-2 h-2 rounded-full bg-yellow mt-2 shrink-0" aria-hidden="true" />
                      <span className="text-muted text-[17px] leading-relaxed">{info}</span>
                    </li>
                  ))}
                </ul>
              </motion.div>
            )}

            {/* Villages de l'entité — granularité géographique fine */}
            {commune.villages.length > 0 && (
              <motion.div
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true, margin: '-60px' }}
                variants={fadeUp}
                className="mt-12"
              >
                <h2 className="text-2xl md:text-3xl font-black uppercase text-navy mb-3">
                  Les villages de {commune.nom} que nous desservons
                </h2>
                <p className="text-muted text-[16px] leading-relaxed mb-5">
                  L'entité ne se limite pas à son centre. Nous intervenons dans
                  toutes ses sections :
                </p>
                <div className="flex flex-wrap gap-2">
                  {commune.villages.map((v) => (
                    <span key={v} className="bg-offwhite border border-gray-200 text-navy text-sm rounded-full px-3.5 py-1.5">
                      {v}
                    </span>
                  ))}
                </div>
              </motion.div>
            )}

            {/* FAQ visible — le balisage FAQPage reprend exactement ces textes */}
            {faq.length > 0 && (
              <motion.div
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true, margin: '-60px' }}
                variants={fadeUp}
                className="mt-12 bg-navy/5 rounded-2xl p-6 md:p-8 border border-navy/10"
              >
                <h2 className="text-2xl md:text-3xl font-black uppercase text-navy mb-6">
                  Questions fréquentes sur le déménagement à {commune.nom}
                </h2>
                {faq.map((f, i) => (
                  <div key={f.q} className={i > 0 ? 'mt-6' : ''}>
                    <p className="text-navy font-bold text-lg mb-2">{f.q}</p>
                    <p className="text-muted text-[16px] leading-relaxed">{f.a}</p>
                  </div>
                ))}
              </motion.div>
            )}

            {/* Maillage local */}
            {(voisinesLiables.length > 0 || voisinesTexte.length > 0) && (
              <motion.div
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true, margin: '-60px' }}
                variants={fadeUp}
                className="mt-12"
              >
                <h2 className="text-2xl md:text-3xl font-black uppercase text-navy mb-3">
                  Nous déménageons aussi autour de {commune.nom}
                </h2>
                <p className="text-muted text-[16px] leading-relaxed mb-5">
                  Notre zone couvre l'ensemble de la province de Liège. Les
                  communes limitrophes de {commune.nom} font partie de nos
                  interventions courantes :
                </p>
                <div className="flex flex-wrap gap-2">
                  {voisinesLiables.map((v) => (
                    <Link
                      key={v.id}
                      to={communeUrl(v)}
                      className="bg-navy text-white text-sm rounded-full px-3.5 py-1.5 hover:bg-navy/80 transition-colors"
                    >
                      Déménagement à {v.nom}
                    </Link>
                  ))}
                  {voisinesTexte.map((v) => (
                    <span
                      key={v.id}
                      className="bg-offwhite border border-gray-200 text-navy text-sm rounded-full px-3.5 py-1.5"
                    >
                      {v.nom}
                    </span>
                  ))}
                </div>
                <p className="text-muted text-[15px] leading-relaxed mt-5">
                  Voir aussi notre{' '}
                  <Link to={RACINE_ZONES} className="text-navy font-bold underline hover:text-navy/70">
                    liste complète des zones d'intervention
                  </Link>{' '}
                  et notre page{' '}
                  <Link to="/demenagement/demenagement-liege" className="text-navy font-bold underline hover:text-navy/70">
                    déménagement à Liège
                  </Link>
                  .
                </p>
              </motion.div>
            )}

            {/* CTA de fin de contenu */}
            <div className="mt-12 bg-navy rounded-2xl p-8 text-center">
              <p className="text-white text-xl md:text-2xl font-black uppercase mb-2">
                Un déménagement à {commune.nom} en vue&nbsp;?
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

        <ServicesCards />
        <WhyUs />
        <ContactForm />
      </main>

      <MobileCTA />
      <Footer />
    </div>
  );
}
