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

/**
 * Contexte d'intervention par arrondissement.
 *
 * La page listait 74 liens sans une phrase de prose : lisible pour un humain
 * pressé, muette pour tout le reste. Chaque arrondissement a pourtant des
 * conditions d'accès distinctes, et ce sont elles qui déterminent le matériel.
 */
const CONTEXTE_ARRONDISSEMENT: Record<string, string> = {
  Liège:
    "C'est notre terrain quotidien. L'arrondissement concentre l'agglomération et son bâti mitoyen, où le camion se gare sur la voirie faute d'allée : la réservation d'emplacement y est presque systématique. Les coteaux — Saint-Nicolas, Beyne-Heusay, Chaudfontaine — ajoutent la pente, et les vallées de l'Ourthe et de la Vesdre les rues étroites. Nos délais d'intervention y sont les plus courts, la plupart des communes étant à moins de vingt minutes du dépôt.",
  Verviers:
    "L'arrondissement va de la vallée de la Vesdre aux Hautes Fagnes, et les conditions changent radicalement d'un bout à l'autre. Le bâti ancien à étages de Verviers et Dison appelle le monte-meubles ; le plateau du Pays de Herve, ses fermes en carré aux porches étroits ; l'Ardenne de Malmedy et Stavelot, des trajets longs et des hivers à surveiller. C'est la partie de notre zone où le repérage préalable compte le plus.",
  Huy:
    "Entre la vallée mosane et le plateau condrusien, l'arrondissement combine deux logiques. En bord de Meuse, à Huy, Amay ou Engis, le bâti est resserré entre le fleuve et le coteau, avec des centres historiques que les grands gabarits ne traversent pas. Sur le Condroz, l'habitat se disperse en fermes de calcaire aux cours fermées. Les distances depuis notre dépôt y sont parmi les plus longues de notre zone.",
  Waremme:
    "La Hesbaye agricole est la partie la plus simple d'accès de notre zone : peu de relief, des rues dégagées, du stationnement disponible. La difficulté est ailleurs. Les entités y regroupent souvent cinq à dix-huit villages dispersés — Hannut en compte dix-huit sous un seul code postal — et c'est l'adresse exacte, pas le nom de la commune, qui détermine le trajet. Le bâti de ferme impose par ailleurs de relever la hauteur sous porche avant de choisir le camion.",
};

export default function ZonesInterventionPage() {
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  const ans = anneesExperience();

  // Une commune est liable dès qu'une page existe pour elle : soit sa page
  // locale publiée, soit une page satellite antérieure.
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

  // Les communes liées sont regroupées de la même façon : 71 cartes d'affilée
  // ne disent rien de la géographie, et c'est l'arrondissement qui porte les
  // conditions d'accès communes.
  const liablesParArrondissement = new Map<string, typeof avecPage>();
  for (const c of avecPage) {
    const cle = c.arrondissement ?? 'Autres';
    const liste = liablesParArrondissement.get(cle) ?? [];
    liste.push(c);
    liablesParArrondissement.set(cle, liste);
  }
  const arrondissementsLiables = [...liablesParArrondissement.keys()].sort((a, b) =>
    a.localeCompare(b, 'fr')
  );

  // Communes germanophones : desservies, mais sans page française. Une page FR
  // sur Eupen ou Saint-Vith viserait une requête que ses habitants ne formulent
  // pas dans cette langue.
  const GERMANOPHONES = new Set([
    'eupen', 'raeren', 'la-calamine', 'lontzen', 'butgenbach',
    'bullange', 'burg-reuland', 'ambleve', 'saint-vith',
  ]);
  const sansPageGermanophones = sansPage.filter((c) => GERMANOPHONES.has(c.id));
  const sansPageFrancophones = sansPage.filter((c) => !GERMANOPHONES.has(c.id));

  return (
    <div className="font-sans">
      <SeoHead
        title="Zones d'intervention en province de Liège | Gramme"
        description={`Déménagements Gramme intervient dans les ${COMMUNES.length} communes de la province de Liège depuis son dépôt. Devis gratuit sous 24h.`}
        canonical={RACINE_ZONES}
      />
      <SchemaOrg
        breadcrumbs={[
          { name: 'Accueil', url: `${BASE_URL}/` },
          { name: "Zones d'intervention", url: `${BASE_URL}${RACINE_ZONES}` },
        ]}
        // Construit depuis la même liste que l'affichage. Les communes sans
        // page n'y portent pas d'URL : elles sont desservies, mais aucune page
        // ne leur correspond.
        itemList={{
          name: 'Communes desservies par Déménagements Gramme en province de Liège',
          items: [
            ...avecPage.map((c) => ({ name: c.nom, url: `${BASE_URL}${communeUrl(c)}` })),
            ...sansPage.map((c) => ({ name: c.nom })),
          ],
        }}
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
              Depuis notre dépôt, nous déménageons particuliers et
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

            {/* Introduction en prose. La page fonctionnait comme un tableau
                brut : 74 liens et pas une phrase. Ce bloc répond aux questions
                que le tableau laissait sans réponse — d'où partent les camions,
                comment se calcule le trajet d'approche, ce qui se passe hors
                zone. */}
            <motion.div
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, margin: '-80px' }}
              variants={fadeUp}
              className="mb-14 max-w-3xl"
            >
              <h2 className="text-2xl md:text-3xl font-black uppercase text-navy mb-5">
                D'où nous partons, et jusqu'où nous allons
              </h2>
              <div className="space-y-4 text-muted text-[17px] leading-relaxed">
                <p>
                  Nos camions partent chaque matin de notre dépôt d'Oupeye, en
                  Basse-Meuse. C'est de là que se mesurent toutes les distances
                  affichées sur cette page — et non depuis notre siège social de
                  Herstal, qui est un lieu administratif et non un point de départ.
                </p>
                <p>
                  Le trajet d'approche apparaît sur le devis. Il correspond au temps
                  réel entre le dépôt et votre adresse, aller et retour compris.
                  Concrètement, une commune de la première couronne liégeoise se
                  situe à moins de vingt minutes, tandis que Ferrières, Stoumont ou
                  Waimes dépassent les cinquante. C'est pourquoi nous groupons les
                  interventions d'un même secteur sur une journée : le déplacement
                  se partage, et la ligne correspondante du devis baisse d'autant.
                </p>
                <p>
                  Nous couvrons les {COMMUNES.length} communes de la province de Liège.
                  Chacune de celles qui disposent d'une page ci-dessous y détaille sa
                  distance, ses sections, ses contraintes d'accès et la procédure
                  d'autorisation de stationnement qui lui est propre — relevée sur la
                  source officielle de la commune ou de sa zone de police, car elle
                  varie fortement d'une administration à l'autre.
                </p>
                <p>
                  Hors province, rien ne change sur le principe. Nous déménageons dans
                  toute la Belgique, ainsi que vers la France, les Pays-Bas,
                  l'Allemagne, le Luxembourg, la Suisse, l'Espagne, l'Italie et le
                  Portugal. Si votre adresse de départ ou d'arrivée sort de la province,
                  appelez-nous : nous vous dirons en deux minutes ce que cela change au
                  trajet et au devis, sans détour.
                </p>
              </div>
            </motion.div>

            {avecPage.length > 0 && (
              <motion.div initial="hidden" whileInView="visible" viewport={{ once: true, margin: '-80px' }} variants={fadeUp}>
                <h2 className="text-2xl md:text-3xl font-black uppercase text-navy mb-3">
                  Communes avec une page dédiée
                </h2>
                <p className="text-muted text-[16px] leading-relaxed mb-8">
                  Distance depuis notre dépôt, villages desservis et contraintes
                  locales, commune par commune. Les {avecPage.length} pages sont
                  regroupées par arrondissement, chacun ayant ses propres conditions
                  d'accès.
                </p>

                {arrondissementsLiables.map((arr) => (
                  <div key={arr} className="mb-12">
                    <h3 className="text-navy font-black text-xl uppercase mb-3">
                      Arrondissement de {arr}
                    </h3>
                    {CONTEXTE_ARRONDISSEMENT[arr] && (
                      <p className="text-muted text-[16px] leading-relaxed mb-6 max-w-3xl">
                        {CONTEXTE_ARRONDISSEMENT[arr]}
                      </p>
                    )}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      {(liablesParArrondissement.get(arr) ?? []).map((c) => (
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
                  </div>
                ))}
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
                Les communes sans page dédiée
              </h2>
              <div className="space-y-4 text-muted text-[16px] leading-relaxed mb-8 max-w-3xl">
                <p>
                  Les {sansPage.length} communes ci-dessous sont desservies au même
                  titre que les autres, avec le même matériel et les mêmes équipes.
                  Elles n'ont simplement pas encore de page détaillant leurs
                  contraintes locales.
                </p>
                {sansPageGermanophones.length > 0 && (
                  <p>
                    Pour les {sansPageGermanophones.length} communes de la Communauté
                    germanophone, cette absence est délibérée : une page en français
                    sur Eupen ou Saint-Vith viserait une requête que leurs habitants
                    ne formulent pas dans cette langue. Nous y intervenons néanmoins,
                    et l'accueil téléphonique se fait en français.
                  </p>
                )}
                {sansPageFrancophones.length > 0 && (
                  <p>
                    Les {sansPageFrancophones.length} autres —{' '}
                    {sansPageFrancophones.map((c) => c.nom).join(', ')} — sont
                    francophones et recevront leur page à mesure que nous vérifions
                    leurs données locales auprès de l'administration communale. Nous y
                    déménageons déjà.
                  </p>
                )}
                <p>
                  Dans tous les cas, appelez le{' '}
                  <a href="tel:+3242645016" className="text-navy font-bold underline hover:text-navy/70">
                    04 264 50 16
                  </a>{' '}
                  ou passez par le{' '}
                  <Link to="/contact-devis" className="text-navy font-bold underline hover:text-navy/70">
                    formulaire de devis
                  </Link>
                  . Nous vous dirons en deux minutes ce que représente le trajet
                  jusqu'à votre adresse.
                </p>
              </div>

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
