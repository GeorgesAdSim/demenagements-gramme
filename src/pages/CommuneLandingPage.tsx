import { useEffect } from 'react';
import { Link, useParams } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowRight, MapPin, Clock, Route as RouteIcon, Phone } from 'lucide-react';
import TopBar from '../components/TopBar';
import ServiceNavbar from '../components/ServiceNavbar';
import HeroSection from '../components/HeroSection';
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
  pageSatellite,
  deCommune,
  RACINE_ZONES,
  RACINE_COMMUNES,
  type CommuneSEO,
} from '../data/communes';

const BASE_URL = 'https://www.demenagements-gramme.be';

/**
 * Commune du siège social. Sa page décrit un établissement réel : elle porte
 * donc la déclaration complète, là où les autres se contentent d'une référence
 * à l'entité par son @id.
 */
const COMMUNE_SIEGE = 'herstal';

const fadeUp = {
  hidden: { opacity: 0, y: 24 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.5 } },
};

/** Énumération française : « a, b et c ». */
function enumerer(elements: string[]): string {
  if (elements.length <= 1) return elements[0] ?? '';
  return `${elements.slice(0, -1).join(', ')} et ${elements[elements.length - 1]}`;
}

/**
 * Ligne d'accroche du hero, composée à partir des mesures de la commune.
 *
 * La forme de la phrase dépend de la distance réelle, pas d'un tirage : sous
 * quinze kilomètres l'argument est la réactivité, au-delà de trente-cinq c'est
 * le groupage qui tient le prix. Servir « cette proximité limite les frais
 * d'approche » à soixante kilomètres décrédibilise la page entière — c'est
 * exactement ce que les gabarits à variables finissent par produire.
 */
function accrocheHero(c: CommuneSEO): string | undefined {
  const bouts: string[] = [];

  if (c.distanceDepotKm !== null && c.tempsTrajetEstimeMin !== null) {
    if (c.distanceDepotKm <= 15) {
      bouts.push(`${c.distanceDepotKm} km de notre dépôt, ${c.tempsTrajetEstimeMin} minutes de route : nous intervenons à ${c.nom} au plus court.`);
    } else if (c.distanceDepotKm <= 35) {
      bouts.push(`${c.distanceDepotKm} km et ${c.tempsTrajetEstimeMin} minutes depuis notre dépôt.`);
    } else {
      bouts.push(`${c.distanceDepotKm} km depuis notre dépôt : nous groupons les interventions du secteur pour contenir les frais d'approche.`);
    }
  }

  if (c.villages.length > 1) {
    bouts.push(`${enumerer(c.villages.slice(0, 3))} compris.`);
  } else if (c.codesPostaux.length > 0) {
    bouts.push(`Toute l'entité, ${c.codesPostaux.join(' et ')}.`);
  }

  bouts.push('Devis gratuit sous 24 heures ouvrables.');
  return bouts.join(' ');
}

/**
 * La phrase qui remplace, sur les pages communes, le bloc « 78 ans de
 * savoir-faire familial liégeois » et le paragraphe de présentation générique.
 *
 * Les deux totalisaient environ cent cinquante mots strictement identiques
 * d'une commune à l'autre. Le même argument d'ancienneté tient en une phrase,
 * dès lors qu'elle est accrochée à une donnée de la commune. Le bloc complet
 * reste servi tel quel sur l'accueil, où il est à sa place.
 *
 * Le dépôt n'est pas localisé, volontairement : les camions partent d'un site
 * distinct du siège social, et le nommer a déjà induit en erreur — les
 * trente-sept premières distances avaient été mesurées depuis le siège.
 */
function phraseAnciennete(c: CommuneSEO, ans: number): string {
  const trajet =
    c.distanceDepotKm !== null
      ? `à ${c.distanceDepotKm} km de notre dépôt`
      : 'dans toute la province de Liège';
  return (
    `Entreprise familiale liégeoise fondée en 1948, trois générations et ${ans} ans de métier : ` +
    `nous déménageons particuliers et entreprises à ${c.nom}, ${trajet}, avec des véhicules de 4 à 100 m³ équipés d'élévateurs.`
  );
}

/**
 * Phrases du bloc « autorisation de stationnement ».
 *
 * Composées à partir des seuls champs relevés sur la source officielle : une
 * commune qui ne publie ni délai ni tarif n'en verra apparaître aucun. Le
 * paragraphe est donc plus court sur ces communes-là, et c'est voulu — un
 * délai plausible inventé pour homogénéiser la mise en page se retrouverait
 * dans l'organisation réelle d'un client.
 */
function phrasesStationnement(c: CommuneSEO): string[] {
  const a = c.autorisationStationnement;

  // Repli générique. Vrai partout, et vérifiable : c'est la prestation que
  // Gramme assure réellement, sans rien affirmer sur la procédure locale.
  if (!a) {
    return [
      `Réserver un emplacement devant la porte évite le portage sur cinquante mètres, et parfois le blocage d'une rue entière. C'est l'administration communale ${deCommune(c.nom)} qui délivre l'autorisation.`,
      `Nous nous chargeons de la démarche pour vous. Elle doit être introduite plusieurs jours ouvrables à l'avance, et la signalisation est posée avant le jour du déménagement.`,
    ];
  }

  const p: string[] = [
    `L'autorisation est délivrée par ${a.autorite}. ${a.procedure}.`,
  ];

  // Plusieurs communes publient un délai ou un tarif à variantes. Rendues
  // d'un bloc, ces variantes produisaient des phrases de trente à quarante
  // mots ; séparées par leur point-virgule, chacune devient lisible seule.
  const enPhrases = (valeur: string) =>
    valeur
      .split(' ; ')
      .map((v) => v.trim())
      .filter(Boolean);

  if (a.delai) {
    const [premier, ...variantes] = enPhrases(a.delai);
    p.push(
      `Délai à respecter : ${premier.toLowerCase()}.` +
        (variantes.length ? ` Comptez ${variantes.map((v) => v.toLowerCase()).join(', et ')}.` : '')
    );
  }
  if (a.cout) p.push(enPhrases(a.cout).map((v, i) => (i === 0 ? `Coût annoncé par la commune : ${v.toLowerCase()}.` : `${v[0].toUpperCase()}${v.slice(1)}.`)).join(' '));
  if (a.signalisation) p.push(enPhrases(a.signalisation).map((v, i) => (i === 0 ? `Signalisation : ${v.toLowerCase()}.` : `${v[0].toUpperCase()}${v.slice(1)}.`)).join(' '));

  p.push(
    `Nous prenons cette démarche en charge dans le cadre de votre déménagement. ${
      a.delai
        ? 'Le délai ci-dessus est celui de la commune : plus tôt nous connaissons votre date, plus la réservation est sûre.'
        : "La commune ne publie pas de délai fixe : nous introduisons la demande dès que votre date est arrêtée."
    }`
  );

  return p;
}

/**
 * FAQ de la page.
 *
 * Priorité à `faqLocale`, rédigée commune par commune : c'est la seule forme
 * qui produise des questions réellement différentes, parce que la question
 * pertinente n'est pas la même à Seraing et à Waimes. Voir le champ dans
 * src/data/communes.ts.
 *
 * À défaut, on retombe sur les questions génériques ci-dessous. Elles sont
 * vraies partout, mais quatre-vingt-seize de leurs mots sont identiques d'une
 * commune à l'autre : c'est un repli, pas une cible. Les communes concernées
 * sont listées dans reports/faq-a-completer.md.
 */
function construireFaq(c: CommuneSEO): Array<{ q: string; a: string }> {
  if (c.faqLocale?.length) {
    return c.faqLocale.map((qr) => ({ q: qr.question, a: qr.reponse }));
  }
  return faqGenerique(c);
}

/**
 * Repli générique, construit à partir des seules données vérifiées.
 *
 * Aucune question n'est générée si l'information correspondante manque : une
 * réponse inventée sur une distance ou un village serait un mensonge servi au
 * visiteur autant qu'au moteur, et le balisage FAQPage l'amplifierait.
 */
function faqGenerique(c: CommuneSEO): Array<{ q: string; a: string }> {
  const faq: Array<{ q: string; a: string }> = [];

  if (c.distanceDepotKm !== null && c.tempsTrajetEstimeMin !== null) {
    faq.push({
      q: `À quelle distance ${deCommune(c.nom)} se trouve votre dépôt ?`,
      // Le dépôt n'est volontairement pas localisé : les camions partent d'un
      // site distinct du siège social, et nommer une commune ici a déjà induit
      // en erreur — les distances avaient été mesurées depuis le siège.
      // La phrase de conclusion dépend de la distance réelle : parler de
      // « proximité » à quarante-sept kilomètres décrédibilise la page entière.
      a:
        `Notre dépôt se trouve à environ ${c.distanceDepotKm} km ${deCommune(c.nom)}, soit à peu près ${c.tempsTrajetEstimeMin} minutes de route. ` +
        (c.distanceDepotKm <= 20
          ? `Cette proximité limite les frais d'approche facturés sur le devis.`
          : `Le trajet d'approche figure sur le devis, et nous le réduisons en groupant nos interventions du secteur sur une même journée.`),
    });
  }

  if (c.villages.length > 0) {
    faq.push({
      q: `Intervenez-vous dans tous les villages ${deCommune(c.nom)} ?`,
      a: `Oui. Nous desservons l'ensemble de l'entité, ${c.villages.join(', ')} compris, au même titre que le centre ${deCommune(c.nom)}.`,
    });
  }

  // Question stationnement. Quand la donnée existe, la réponse change
  // réellement d'une commune à l'autre — autorité, délai, tarif. Sinon elle
  // reste vraie sans rien affirmer de local.
  const a = c.autorisationStationnement;
  faq.push({
    q: `Faut-il une autorisation pour stationner le camion à ${c.nom} ?`,
    a: a
      // La réponse ouvre par « Oui », avant toute explication : c'est ce qui
      // la rend extractible en snippet et par les moteurs conversationnels.
      // Délai et coût ne reprennent que leur première variante — le détail
      // complet est juste au-dessus, dans le bloc dédié.
      ? `Oui. Elle est délivrée par ${a.autorite}. ${a.procedure}.` +
        (a.delai ? ` La demande doit être introduite ${a.delai.split(' ; ')[0].toLowerCase()}.` : '') +
        (a.cout ? ` Coût annoncé par la commune : ${a.cout.split(' ; ')[0].toLowerCase()}.` : '') +
        ` Nous nous chargeons de la démarche pour vous.`
      : `Oui, dès qu'il s'agit d'occuper la voirie. L'autorisation est délivrée par l'administration communale ${deCommune(c.nom)}, et la demande doit être introduite plusieurs jours ouvrables à l'avance. Nous nous en chargeons pour vous, pose de la signalisation comprise.`,
  });

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
  // `pageSatellite` et non `pageExistante` : la base peut encore déclarer une
  // satellite supprimée du dépôt, auquel cas c'est cette page qui doit servir.
  const satellite = pageSatellite(commune);
  if (satellite) {
    return (
      <div className="font-sans">
        <SeoHead
          title={`Déménagement à ${commune.nom} | Déménagements Gramme`}
          description={`Déménagement à ${commune.nom} par Déménagements Gramme.`}
          canonical={satellite}
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
            to={satellite}
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
        // Gabarit court de repli : sur les noms longs — Saint-Georges-sur-Meuse,
        // Fexhe-le-Haut-Clocher — le title complet dépasse 60 caractères et se
        // fait tronquer par Google, ce qui coupe la mention de la marque.
        title={
          `Déménagement à ${commune.nom} : devis gratuit 24h | Gramme`.length <= 60
            ? `Déménagement à ${commune.nom} : devis gratuit 24h | Gramme`
            : `Déménagement à ${commune.nom} | Gramme`
        }
        description={
          `Déménagement à ${commune.nom} par une entreprise familiale liégeoise active depuis 1948. ` +
          `Dépôt à ${commune.distanceDepotKm ?? '—'} km. Devis gratuit sous 24h, sans engagement.`
        }
        canonical={url}
        noindex={brouillon}
      />
      <SchemaOrg
        organization={commune.id === COMMUNE_SIEGE ? 'full' : 'reference'}
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
        {/* Hero mutualisé avec l'accueil, paramétré par les données de la
            commune. Un seul H1, qui porte toujours le nom de la commune. */}
        <HeroSection
          cityName={commune.nom}
          codesPostaux={commune.codesPostaux}
          accroche={accrocheHero(commune)}
        />

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
                {phraseAnciennete(commune, ans)}
              </p>
            </motion.div>

            {/* Repères logistiques — uniquement des valeurs mesurées */}
            {(commune.distanceDepotKm !== null || commune.tempsTrajetEstimeMin !== null || commune.codesPostaux.length > 0) && (
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mt-10">
                {commune.distanceDepotKm !== null && (
                  <div className="bg-offwhite rounded-2xl p-6 border border-gray-100">
                    <RouteIcon className="w-5 h-5 text-navy mb-3" />
                    <p className="text-navy font-black text-2xl">{commune.distanceDepotKm} km</p>
                    <p className="text-muted text-sm">depuis notre dépôt</p>
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

            {/* Sections rédigées propres à la commune. Vide sur la plupart des
                pages : seules celles qui ont une histoire à raconter en ont. */}
            {commune.sectionsLocales?.map((section) => (
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

            {/* Autorisation de stationnement — le seul bloc de la page qui
                renvoie vers une source officielle. Voir phrasesStationnement :
                rien n'y est affirmé que la commune ne publie. */}
            <motion.div
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, margin: '-60px' }}
              variants={fadeUp}
              className="mt-12"
            >
              <h2 className="text-2xl md:text-3xl font-black uppercase text-navy mb-5">
                Autorisation de stationnement à {commune.nom}
              </h2>
              <div className="space-y-4">
                {phrasesStationnement(commune).map((phrase) => (
                  <p key={phrase.slice(0, 40)} className="text-muted text-[17px] leading-relaxed">
                    {phrase}
                  </p>
                ))}
              </div>
              {commune.autorisationStationnement && (
                <p className="text-muted text-[14px] leading-relaxed mt-4 italic">
                  Source :{' '}
                  <a
                    href={commune.autorisationStationnement.sourceUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-navy underline hover:text-navy/70"
                  >
                    information officielle publiée par {commune.autorisationStationnement.autorite}
                  </a>
                  , relevée le{' '}
                  {new Date(commune.autorisationStationnement.dateVerification).toLocaleDateString('fr-BE', {
                    day: 'numeric',
                    month: 'long',
                    year: 'numeric',
                  })}
                  . Les règles communales évoluent : nous les revérifions à chaque dossier.
                </p>
              )}
            </motion.div>

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
                  Les villages {deCommune(commune.nom)} que nous desservons
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

            {/* Autres prestations — une ligne de liens, à la place des quatre
                cartes services (ServicesCards). Ces cartes pesaient une
                centaine de mots identiques sur soixante-dix pages pour ne
                transmettre que quatre liens ; le composant reste inchangé sur
                l'accueil et les pages de service, où il a un rôle de vitrine. */}
            <p className="mt-10 text-muted text-[15px] leading-relaxed">
              Nos autres prestations :{' '}
              <Link to="/garde-meubles" className="text-navy font-bold underline hover:text-navy/70">Garde-meubles</Link>
              {' · '}
              <Link to="/demenagement/demenagement-international" className="text-navy font-bold underline hover:text-navy/70">Déménagement international</Link>
              {' · '}
              <Link to="/demenagement/demenagement-entreprise" className="text-navy font-bold underline hover:text-navy/70">Déménagement d'entreprise</Link>
              {' · '}
              <Link to="/monte-meubles" className="text-navy font-bold underline hover:text-navy/70">Monte-meubles</Link>
            </p>

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
                  Nous déménageons aussi autour {deCommune(commune.nom)}
                </h2>
                <p className="text-muted text-[16px] leading-relaxed mb-5">
                  Notre zone couvre l'ensemble de la province de Liège. Les
                  communes limitrophes {deCommune(commune.nom)} font partie de nos
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

        {/* ServicesCards et WhyUs ne sont plus rendus ici : voir la ligne
            « Nos autres prestations » ci-dessus et `phraseAnciennete`. Les deux
            composants restent en place, inchangés, pour l'accueil et les pages
            de service. */}
        <ContactForm variant="locale" villeParDefaut={commune.nom} />
      </main>

      <MobileCTA />
      <Footer />
    </div>
  );
}
