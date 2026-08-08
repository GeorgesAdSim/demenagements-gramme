import { useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  ArrowRight, Phone, Truck, Users, ShieldCheck, Award, Route as RouteIcon,
  Building2, TriangleAlert, GraduationCap, Package,
} from 'lucide-react';
import TopBar from '../../components/TopBar';
import ServiceNavbar from '../../components/ServiceNavbar';
import ContactForm from '../../components/ContactForm';
import MobileCTA from '../../components/MobileCTA';
import Footer from '../../components/Footer';
import SeoHead from '../../components/SeoHead';
import SchemaOrg from '../../components/SchemaOrg';
import { SITE_IMAGES } from '../../data/images';
import { anneesExperience } from '../../lib/anciennete';
import { getCommuneBySlug, communeUrl, getPublishedCommunes } from '../../data/communes';

const BASE_URL = 'https://www.demenagements-gramme.be';
const URL = '/demenagement/demenagement-liege';

const fadeUp = {
  hidden: { opacity: 0, y: 24 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.5 } },
};

// Quartiers déjà listés sur l'accueil. Repris ici parce qu'ils sont l'actif
// géographique le plus fin du site et qu'une page « déménagement Liège » sans
// eux serait incomplète — mais aucun paragraphe n'est recopié d'une page à
// l'autre, seule la liste de noms est commune.
const QUARTIERS = [
  'Centre-ville', 'Outremeuse', 'Amercœur', 'Longdoz', 'Guillemins', 'Laveu',
  'Cointe', 'Sainte-Walburge', 'Rocourt', 'Grivegnée', 'Chênée', 'Jupille',
  'Wandre', 'Bressoux', 'Droixhe', 'Angleur', 'Sclessin', 'Fétinne',
];

const MOYENS = [
  { icon: Truck, chiffre: '6', libelle: 'camions', detail: "de 4 à 100 m³, équipés d'élévateurs" },
  { icon: Users, chiffre: '20', libelle: 'personnes', detail: 'déménageurs, chauffeurs et magasiniers' },
  { icon: Award, chiffre: 'ISO 9001', libelle: '', detail: 'système qualité certifié' },
  // ⚠️ Ce chiffre est écrit en dur ici ET stocké pour la commune `liege` dans
  // communes.json. Les deux doivent rester d'accord : au prochain relevé,
  // pense à celui-ci — rien ne le vérifie automatiquement.
  { icon: RouteIcon, chiffre: '12 km', libelle: 'du centre', detail: 'depuis notre dépôt' },
];

const CONTRAINTES = [
  {
    icon: TriangleAlert,
    titre: 'Pentes et rues étroites du centre historique',
    texte: "Le Laveu, Cointe et les abords de la Citadelle imposent des accès resserrés et de fortes déclivités. Nous choisissons le gabarit du véhicule en fonction du quartier, et non l'inverse.",
  },
  {
    icon: Building2,
    titre: 'Immeubles anciens sans ascenseur',
    texte: "En Outremeuse comme au Longdoz, trois à quatre étages sans ascenseur sont la norme. Notre monte-meubles évite le portage en cage d'escalier et réduit fortement le risque de dégâts.",
  },
  {
    icon: GraduationCap,
    titre: 'Saisonnalité universitaire',
    texte: "Liège est une ville universitaire : les mouvements de kots se concentrent sur juin et septembre, et les créneaux partent vite. Sur ces semaines, mieux vaut réserver plusieurs semaines à l'avance.",
  },
  {
    icon: Package,
    titre: 'Zones piétonnes et fenêtres horaires',
    texte: "Carré, rue Saint-Paul, place du Marché : certaines adresses ne sont accessibles qu'à des créneaux précis. Nous planifions l'intervention en fonction de ces horaires.",
  },
];

const ETAPES = [
  {
    titre: 'Visite technique gratuite',
    texte: "Un responsable se déplace chez vous, à Liège. Il mesure le volume réel et repère les accès : largeur de la rue, étage, présence d'un ascenseur, possibilité de poser un monte-meubles. C'est cette visite qui évite les mauvaises surprises le jour du chargement.",
  },
  {
    titre: 'Devis détaillé sous 24 heures ouvrables',
    texte: "Vous recevez un devis écrit, poste par poste, sans engagement. Il précise le volume retenu, l'équipe affectée, le matériel prévu et les prestations optionnelles comme l'emballage ou le démontage des meubles.",
  },
  {
    titre: "Demande d'autorisation de voirie",
    texte: "Nous introduisons la demande d'occupation de la voirie auprès de la Ville de Liège. Les panneaux sont posés quelques jours avant. Sans emplacement réservé, un camion se gare parfois à cinquante mètres de la porte, et le portage allonge le chantier.",
  },
  {
    titre: 'Le jour du déménagement',
    texte: "L'équipe protège les sols et les cages d'escalier, puis emballe ce qui doit l'être. Elle démonte les meubles volumineux, charge, transporte et remonte à l'arrivée. Un chef d'équipe reste votre interlocuteur unique du début à la fin.",
  },
];

const FAQ = [
  {
    q: 'Combien coûte un déménagement à Liège ?',
    a: "Le prix dépend de quatre facteurs : le volume, la distance, l'accessibilité des deux adresses et les prestations choisies. Un troisième étage sans ascenseur en Outremeuse ne coûte pas le même prix qu'un rez-de-chaussée avec parking à Rocourt, à volume identique. Nous ne publions pas de tarif au mètre cube : nous procédons par visite technique gratuite, puis devis détaillé sous 24 heures ouvrables.",
  },
  {
    q: 'Êtes-vous assurés en cas de casse pendant le déménagement ?',
    a: "Oui. Déménagements Gramme dispose d'une assurance transport et d'une assurance casse, incluses dans nos prestations. Elles couvrent vos biens pendant la manutention et le transport. Le détail des garanties et des plafonds figure sur le devis, avant toute signature.",
  },
  {
    q: 'Que signifie la certification ISO 9001 pour mon déménagement ?',
    a: "ISO 9001 est une norme internationale de management de la qualité. Concrètement, elle impose des procédures écrites et vérifiées à chaque étape : prise de commande, préparation du matériel, exécution du chantier, traitement des réclamations. Pour vous, c'est la garantie que le déroulement ne dépend pas de l'équipe qui se présente ce matin-là.",
  },
  {
    q: 'Déménagez-vous les kots et les logements étudiants à Liège ?',
    a: "Oui. Liège est une ville universitaire, et les mouvements de kots se concentrent sur quelques semaines en juin et en septembre. Ce sont de petits volumes, souvent dans des immeubles anciens du centre ou du Laveu, sans ascenseur. Nous adaptons le véhicule et l'équipe à ces chantiers courts, et il vaut mieux réserver tôt sur ces périodes.",
  },
  {
    q: 'Intervenez-vous aussi pour les entreprises et les bureaux à Liège ?',
    a: "Oui. Le déménagement d'entreprise se prépare différemment. Inventaire du mobilier et du matériel informatique, étiquetage par poste de travail. L'intervention se fait en soirée ou le week-end, pour ne pas interrompre l'activité. Nos six camions permettent de traiter un plateau de bureaux en une seule rotation.",
  },
  {
    q: 'Faut-il une autorisation pour stationner le camion à Liège ?',
    a: "Oui. Elle est délivrée par la Zone de Police de Liège, dont le service Occupation de la voie publique traite les demandes par secteur. La démarche est exclusivement numérique depuis l'application « occuper la voie publique ». La police ne publie plus de délai fixe : le temps de traitement dépend de l'ampleur du chantier. Nous introduisons la demande dès que votre date est arrêtée, et nous posons la signalisation.",
  },
  {
    q: 'À quelle distance de Liège se trouve votre dépôt ?',
    a: "Notre dépôt se trouve à environ 12 km du centre de Liège, soit une vingtaine de minutes de route. Cette proximité limite les frais d'approche facturés sur le devis. Elle nous permet aussi d'intervenir vite, y compris pour un complément de matériel en cours de chantier.",
  },
];

// Communes de la couronne liégeoise. Filtrées sur celles réellement publiées :
// le maillage se construit sur des pages qui existent, jamais sur une liste de
// noms écrite à la main qui se périmerait au premier changement de statut.
const COURONNE = [
  'ans', 'herstal', 'seraing', 'saint-nicolas', 'oupeye',
  'flemalle', 'chaudfontaine', 'beyne-heusay',
];

export default function DemenagementLiege() {
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  const ans = anneesExperience();
  const voisines = getPublishedCommunes().filter((c) => COURONNE.includes(c.id));
  const liege = getCommuneBySlug('liege');

  return (
    <div className="font-sans">
      <SeoHead
        title="Déménagement à Liège : devis gratuit sous 24h | Gramme"
        description="Déménagement à Liège depuis 1948 : entreprise familiale certifiée ISO 9001, 6 camions, 20 personnes, assurance transport et casse. Devis gratuit sous 24h."
        canonical={URL}
      />
      <SchemaOrg
        customFaq={FAQ}
        localService={{ ville: 'Liège', codesPostaux: liege?.codesPostaux ?? [], url: `${BASE_URL}${URL}` }}
        breadcrumbs={[
          { name: 'Accueil', url: `${BASE_URL}/` },
          { name: 'Déménagement', url: `${BASE_URL}/demenagement` },
          { name: 'Déménagement à Liège', url: `${BASE_URL}${URL}` },
        ]}
      />
      <TopBar />
      <ServiceNavbar />

      <main id="main-content" className="pb-[60px] md:pb-0">

        {/* — HERO — vraie photo Gramme, et non plus une banque d'images */}
        <section className="relative py-20 md:py-28 overflow-hidden">
          <picture>
            <source type="image/avif" srcSet={SITE_IMAGES.hero.srcSetAvif} sizes="100vw" />
            <source type="image/webp" srcSet={SITE_IMAGES.hero.srcSetWebp} sizes="100vw" />
            <img
              src={SITE_IMAGES.hero.src}
              srcSet={SITE_IMAGES.hero.srcSetJpeg}
              sizes="100vw"
              alt=""
              aria-hidden="true"
              fetchPriority="high"
              decoding="async"
              className="absolute inset-0 w-full h-full object-cover"
            />
          </picture>
          <div className="absolute inset-0 bg-[#0C2094]/75" />

          <div className="relative z-10 max-w-5xl mx-auto px-4 md:px-8">
            <span className="inline-block bg-yellow text-navy text-[13px] font-bold rounded-full px-4 py-1.5 mb-4">
              Entreprise familiale liégeoise depuis 1948
            </span>
            <h1 className="text-[2.2rem] md:text-5xl font-black uppercase text-white leading-[1.1] mb-6">
              Déménagement à Liège
            </h1>

            {/* Answer Capsule — bloc de tête destiné à l'extraction par les
                moteurs de réponse. Entités nommées : entreprise, ville,
                adresse, date de fondation, moyens chiffrés, certification. */}
            <p className="text-white text-lg md:text-xl leading-relaxed border-l-4 border-yellow pl-5 max-w-3xl font-medium">
              Déménagements Gramme organise votre déménagement à Liège depuis
              1948. C'est une entreprise familiale établie voie du Belvédère 1 à
              Seraing, aux portes de Liège, et certifiée ISO 9001. Six camions de
              4 à 100 m³, vingt personnes, assurance transport et casse incluse.
              Devis gratuit sous 24 heures ouvrables.
            </p>

            <div className="flex flex-col sm:flex-row gap-4 mt-8">
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
        </section>

        <section className="bg-white py-16 md:py-24">
          <div className="max-w-5xl mx-auto px-4 md:px-8">

            <nav aria-label="Fil d'Ariane" className="text-sm text-muted mb-10">
              <Link to="/" className="hover:text-navy underline">Accueil</Link>
              <span className="mx-2">/</span>
              <Link to="/demenagement" className="hover:text-navy underline">Déménagement</Link>
              <span className="mx-2">/</span>
              <span className="text-navy font-medium">Liège</span>
            </nav>

            {/* — MOYENS — le différenciateur qu'aucun concurrent ne peut recopier */}
            <motion.div initial="hidden" whileInView="visible" viewport={{ once: true, margin: '-80px' }} variants={fadeUp}>
              <h2 className="text-3xl md:text-4xl font-black uppercase text-navy leading-tight mb-6">
                Nos moyens pour un déménagement à Liège
              </h2>
              <p className="text-muted text-[17px] leading-relaxed mb-8">
                La plupart des annonces de déménageurs promettent le sérieux et
                l'expérience. Voici plutôt ce dont nous disposons réellement pour
                tenir une date à Liège, y compris en pleine saison quand les
                créneaux se raréfient.
              </p>
              <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                {MOYENS.map((m) => {
                  const Icon = m.icon;
                  return (
                    <div key={m.detail} className="bg-offwhite rounded-2xl p-6 border border-gray-100">
                      <Icon className="w-5 h-5 text-navy mb-3" />
                      <p className="text-navy font-black text-2xl leading-tight">
                        {m.chiffre}
                        {m.libelle && <span className="text-lg font-bold"> {m.libelle}</span>}
                      </p>
                      <p className="text-muted text-sm mt-1 leading-snug">{m.detail}</p>
                    </div>
                  );
                })}
              </div>
              <p className="text-muted text-[17px] leading-relaxed mt-8">
                Vingt personnes, cela signifie qu'une équipe de quatre à six
                déménageurs se monte sans démonter les autres chantiers du jour.
                Six camions, cela signifie qu'un imprévu de volume ne repousse pas
                votre déménagement d'une semaine&nbsp;: un second véhicule part de
                notre dépôt, à vingt minutes. C'est la différence concrète entre une
                structure de {ans} ans et un indépendant avec une camionnette.
              </p>
            </motion.div>

            {/* — CONTRAINTES LOCALES — */}
            <motion.div
              initial="hidden" whileInView="visible" viewport={{ once: true, margin: '-60px' }} variants={fadeUp}
              className="mt-14"
            >
              <h2 className="text-2xl md:text-3xl font-black uppercase text-navy mb-6">
                Pourquoi déménager à Liège demande un déménageur liégeois
              </h2>
              <p className="text-muted text-[17px] leading-relaxed mb-4">
                Liège n'est pas une ville de plaine au bâti récent. Elle cumule
                trois contraintes que l'on rencontre rarement ensemble en
                Wallonie. Une topographie de vallée, avec des rues en forte pente.
                Un bâti ancien souvent dépourvu d'ascenseur. Et un hypercentre où
                le stationnement se réserve à l'avance.
              </p>
              <p className="text-muted text-[17px] leading-relaxed">
                Un déménageur qui découvre ces contraintes le matin du chargement
                les découvre au moment où elles coûtent le plus cher. Le camion de
                60 m³ ne passe pas rue Hors-Château. Le troisième étage du Longdoz
                sans ascenseur transforme une demi-journée en journée complète. Et
                l'emplacement non réservé oblige à porter sur cinquante mètres,
                dans une rue en pente.
              </p>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-10">
                {CONTRAINTES.map((c) => {
                  const Icon = c.icon;
                  return (
                    <div key={c.titre} className="bg-offwhite rounded-2xl p-6 border border-gray-100">
                      <div className="w-10 h-10 rounded-full bg-navy flex items-center justify-center mb-4">
                        <Icon className="w-5 h-5 text-yellow" />
                      </div>
                      <h3 className="text-navy font-bold text-lg mb-2">{c.titre}</h3>
                      <p className="text-muted text-[15px] leading-relaxed">{c.texte}</p>
                    </div>
                  );
                })}
              </div>
            </motion.div>

            {/* — DÉROULEMENT — */}
            <motion.div
              initial="hidden" whileInView="visible" viewport={{ once: true, margin: '-60px' }} variants={fadeUp}
              className="mt-14"
            >
              <h2 className="text-2xl md:text-3xl font-black uppercase text-navy mb-6">
                Comment se déroule un déménagement à Liège avec Gramme
              </h2>
              <ol className="space-y-5">
                {ETAPES.map((e, i) => (
                  <li key={e.titre} className="flex gap-4">
                    <span className="shrink-0 w-9 h-9 rounded-full bg-navy text-yellow font-black flex items-center justify-center text-sm">
                      {i + 1}
                    </span>
                    <div>
                      <h3 className="text-navy font-bold text-lg mb-1">{e.titre}</h3>
                      <p className="text-muted text-[16px] leading-relaxed">{e.texte}</p>
                    </div>
                  </li>
                ))}
              </ol>
            </motion.div>

            {/* — AUTORISATION DE STATIONNEMENT —
                Les 70 pages communes portent ce bloc depuis les données
                relevées en source officielle. Liège a son propre gabarit et
                y échappait, alors que c'est la commune où la question se pose
                le plus souvent. */}
            <motion.div
              initial="hidden" whileInView="visible" viewport={{ once: true, margin: '-60px' }} variants={fadeUp}
              className="mt-14"
            >
              <h2 className="text-2xl md:text-3xl font-black uppercase text-navy mb-5">
                Autorisation de stationnement à Liège
              </h2>
              <div className="space-y-4 text-muted text-[17px] leading-relaxed">
                <p>
                  L'autorisation est délivrée par la Zone de Police de Liège, dont
                  le service Occupation de la voie publique traite les demandes par
                  secteur. La ville en compte cinq, du Centre et d'Outremeuse à
                  Sainte-Walburge et Rocourt.
                </p>
                <p>
                  La demande est aujourd'hui exclusivement numérique. Elle passe par
                  l'application « occuper la voie publique » de la zone de police, et
                  non plus par un formulaire papier.
                </p>
                <p>
                  La police ne publie plus de délai fixe. Le temps de traitement dépend
                  de l'importance du chantier et des avis extérieurs à
                  solliciter. Nous introduisons donc la demande dès que
                  votre date est arrêtée, sans attendre.
                </p>
                <p>
                  Nous prenons cette démarche en charge, pose de la signalisation
                  comprise. En hypercentre et dans les rues étroites du Carré, du
                  Laveu ou d'Outremeuse, c'est elle qui rend le déménagement possible.
                </p>
              </div>
              <p className="text-muted text-[14px] leading-relaxed mt-4 italic">
                Source :{' '}
                <a
                  href="https://www.policeliege.be/page/occuper-la-voie-publique"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-navy underline hover:text-navy/70"
                >
                  information officielle publiée par la Zone de Police de Liège
                </a>
                , relevée le 2 août 2026. Les règles communales évoluent&nbsp;: nous
                les revérifions à chaque dossier.
              </p>
            </motion.div>

            {/* — GARANTIES — */}
            <motion.div
              initial="hidden" whileInView="visible" viewport={{ once: true, margin: '-60px' }} variants={fadeUp}
              className="mt-14 bg-navy/5 rounded-2xl p-6 md:p-8 border border-navy/10"
            >
              <h2 className="text-2xl md:text-3xl font-black uppercase text-navy mb-5">
                Certification et assurances&nbsp;: ce qui vous protège
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="flex items-start gap-3">
                  <Award className="w-5 h-5 text-navy mt-0.5 shrink-0" />
                  <p className="text-muted text-[16px] leading-relaxed">
                    <strong className="text-navy">Certification ISO 9001.</strong>{' '}
                    Notre système de management de la qualité est certifié selon la
                    norme internationale ISO 9001. Elle impose des procédures
                    écrites et auditées à chaque étape, de la prise de commande au
                    traitement d'une réclamation. Le déroulement de votre chantier
                    ne dépend donc pas de l'équipe qui se présente ce matin-là.
                  </p>
                </div>
                <div className="flex items-start gap-3">
                  <ShieldCheck className="w-5 h-5 text-navy mt-0.5 shrink-0" />
                  <p className="text-muted text-[16px] leading-relaxed">
                    <strong className="text-navy">Assurance transport et casse.</strong>{' '}
                    Vos biens sont couverts pendant la manutention et le transport.
                    Les garanties et les plafonds sont écrits sur le devis, avant
                    signature — demandez-les systématiquement à n'importe quel
                    déménageur, y compris à nous.
                  </p>
                </div>
              </div>
            </motion.div>

            {/* — QUARTIERS — */}
            <motion.div
              initial="hidden" whileInView="visible" viewport={{ once: true, margin: '-60px' }} variants={fadeUp}
              className="mt-14"
            >
              <h2 className="text-2xl md:text-3xl font-black uppercase text-navy mb-3">
                Les quartiers de Liège où nous intervenons
              </h2>
              <p className="text-muted text-[16px] leading-relaxed mb-5">
                Nous couvrons l'ensemble du territoire communal, de la rive gauche
                aux hauteurs de Cointe, en passant par les quartiers de la rive
                droite&nbsp;:
              </p>
              <div className="flex flex-wrap gap-2">
                {QUARTIERS.map((q) => (
                  <span key={q} className="bg-offwhite border border-gray-200 text-navy text-sm rounded-full px-3.5 py-1.5">
                    {q}
                  </span>
                ))}
              </div>
              <p className="text-muted text-[16px] leading-relaxed mt-6">
                Besoin de stocker entre deux dates&nbsp;? Nos box fermés du
                garde-meubles de Seraing démarrent à 30 € par mois pour 1 m³ — voir le{' '}
                <Link to="/garde-meubles/prix-garde-meubles-liege" className="text-navy font-bold underline hover:text-navy/70">
                  détail des prix du garde-meubles à Liège
                </Link>. Pour les étages élevés, notre{' '}
                <Link to="/monte-meubles" className="text-navy font-bold underline hover:text-navy/70">
                  service de monte-meubles
                </Link>{' '}
                se réserve en même temps que le déménagement.
              </p>
            </motion.div>

            {/* — MAILLAGE VERS LES COMMUNES — */}
            {voisines.length > 0 && (
              <motion.div
                initial="hidden" whileInView="visible" viewport={{ once: true, margin: '-60px' }} variants={fadeUp}
                className="mt-14"
              >
                <h2 className="text-2xl md:text-3xl font-black uppercase text-navy mb-3">
                  Déménager depuis ou vers les communes autour de Liège
                </h2>
                <p className="text-muted text-[16px] leading-relaxed mb-5">
                  Beaucoup de déménagements liégeois partent vers la périphérie ou
                  en viennent. Chaque commune a sa page, avec sa distance réelle
                  depuis notre dépôt et les villages qu'elle couvre&nbsp;:
                </p>
                <div className="flex flex-wrap gap-2">
                  {voisines.map((c) => (
                    <Link
                      key={c.id}
                      to={communeUrl(c)}
                      className="bg-navy text-white text-sm rounded-full px-3.5 py-1.5 hover:bg-navy/80 transition-colors"
                    >
                      Déménagement à {c.nom}
                    </Link>
                  ))}
                </div>
                <p className="text-muted text-[15px] leading-relaxed mt-5">
                  Voir aussi la{' '}
                  <Link to="/zones-intervention" className="text-navy font-bold underline hover:text-navy/70">
                    liste complète de nos zones d'intervention en province de Liège
                  </Link>, ou nos pages{' '}
                  <Link to="/demenagement/demenagement-entreprise" className="text-navy font-bold underline hover:text-navy/70">
                    déménagement d'entreprise
                  </Link>{' '}et{' '}
                  <Link to="/demenagement/demenagement-international" className="text-navy font-bold underline hover:text-navy/70">
                    déménagement international depuis Liège
                  </Link>.
                </p>
                {/* Cette page reçoit un lien de chacune des 70 pages communes :
                    c'est la mieux dotée du silo. Elle alimente donc les deux
                    satellites liégeoises qui n'en recevaient qu'un ou deux. */}
                <p className="text-muted text-[15px] leading-relaxed mt-3">
                  Selon votre chantier, voyez aussi{' '}
                  <Link to="/demenagement/demenageur-liege" className="text-navy font-bold underline hover:text-navy/70">
                    ce que couvre notre métier de déménageur à Liège
                  </Link>{' '}ou, pour un instrument,{' '}
                  <Link to="/demenagement/demenagement-piano" className="text-navy font-bold underline hover:text-navy/70">
                    le transport d'un piano
                  </Link>, qui demande un matériel à part.
                </p>
              </motion.div>
            )}

            {/* — FAQ — le balisage FAQPage reprend exactement ces textes */}
            <motion.div
              initial="hidden" whileInView="visible" viewport={{ once: true, margin: '-60px' }} variants={fadeUp}
              className="mt-14"
            >
              <h2 className="text-2xl md:text-3xl font-black uppercase text-navy mb-6">
                Questions fréquentes sur le déménagement à Liège
              </h2>
              <div className="space-y-6">
                {FAQ.map((f) => (
                  <div key={f.q}>
                    <p className="text-navy font-bold text-lg mb-2">{f.q}</p>
                    <p className="text-muted text-[16px] leading-relaxed">{f.a}</p>
                  </div>
                ))}
              </div>
            </motion.div>

            <div className="mt-14 bg-navy rounded-2xl p-8 text-center">
              <p className="text-white text-xl md:text-2xl font-black uppercase mb-2">
                Un déménagement à Liège en préparation&nbsp;?
              </p>
              <p className="text-white/80 mb-6">
                Visite technique et devis gratuits, réponse sous 24 heures
                ouvrables. Sans engagement.
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
