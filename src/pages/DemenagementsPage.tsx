import { Phone, ClipboardList, Truck, PackageCheck, ShieldCheck, Users, Clock, MapPin } from 'lucide-react';
import ServicePageLayout from '../components/ServicePageLayout';
import type { ServicePageContent } from '../lib/types';

/**
 * Page pilier du silo déménagement.
 *
 * Elle figure dans le fil d'Ariane des 70 pages communes : c'est la page vers
 * laquelle elles remontent toutes. À 354 mots, elle recevait ce maillage sans
 * rien peser elle-même. Chaque prestation est donc développée pour dire quand
 * elle est nécessaire, comment elle se déroule et ce que le client prépare —
 * pas seulement pour exister dans une liste.
 *
 * Aucun tarif ni délai n'est avancé ici s'il ne figure pas déjà ailleurs sur
 * le site.
 */
const defaults: ServicePageContent = {
  hero: {
    badge: 'NOS SERVICES',
    title: 'Déménagements',
    subtitle:
      "Des déménagements professionnels pour particuliers et entreprises. Une équipe qualifiée, un matériel adapté et plus de 75 ans d'expérience à votre service.",
    guarantees: ['Assurance incluse', 'Équipe qualifiée et expérimentée', 'Ponctualité garantie', 'Liège, Belgique & Europe'],
  },
  prestations: {
    sectionTitle: 'Ce que nous proposons',
    items: [
      {
        title: 'Particuliers & entreprises',
        desc: "Un studio et un plateau de bureaux ne se préparent pas de la même façon. Pour un particulier, tout se joue sur le volume et l'accès : nombre de pièces, étage, largeur de la cage d'escalier. Pour une entreprise, c'est le temps d'arrêt qui commande, et l'intervention se cale en soirée, le week-end ou par services successifs. Nos six camions et nos équipes permettent de traiter les deux, parfois le même jour. Dans les deux cas, la visite technique précède tout : c'est elle qui fixe le matériel, la durée et le nombre d'équipiers.",
      },
      {
        title: 'Monte-meubles et service lift',
        desc: "Le monte-meubles hisse le mobilier par la façade, jusqu'à la fenêtre ou au balcon. Il devient nécessaire dès qu'un meuble ne passe pas dans l'escalier. Troisième étage sans ascenseur, cage en colimaçon, palier trop court pour faire tourner un canapé. C'est aussi la solution sur les accès en terrasse, fréquents sur les coteaux liégeois. Concrètement, il faut un emplacement dégagé au pied de la façade — d'où la réservation de stationnement, dont nous nous chargeons. Vous n'avez rien à préparer de plus qu'un déménagement ordinaire : c'est notre opérateur qui manœuvre.",
      },
      {
        title: 'Déménagement de pianos',
        desc: "Un piano droit pèse entre 200 et 300 kg, un quart-de-queue davantage. Ce n'est pas le poids qui pose problème, c'est la répartition : l'instrument est fragile là où on le saisit. Nous utilisons un chariot à sangles et des protections rigides sur les angles. Pour un quart-de-queue, les pieds et la lyre se démontent avant emballage. De votre côté, il n'y a rien à démonter : signalez-nous simplement le modèle et l'étage à la visite technique. Prévoyez en revanche un accordage après l'installation, quelques semaines plus tard, le temps que l'instrument se stabilise.",
      },
      {
        title: 'Coffres-forts et charges lourdes',
        desc: "Un coffre-fort, une machine d'atelier ou un meuble de métier relèvent de la manutention lourde. La question n'est jamais le transport mais le franchissement : un seuil, une marche, un ascenseur dont la charge utile est dépassée. Nous relevons le poids, les dimensions et le parcours exact avant de venir. Nous engageons ensuite le matériel adapté : chariots à forte charge, plaques de répartition, parfois monte-meubles. Il faut nous communiquer le poids réel du coffre, indiqué par le fabricant. C'est la seule information que nous ne pouvons pas estimer nous-mêmes de façon fiable.",
      },
      {
        title: 'Démontage et remontage',
        desc: "Armoires, lits, dressings, bureaux d'angle : beaucoup de meubles ne sortent pas montés d'un logement ancien. Les couloirs étroits et les portes de faible largeur imposent le démontage, qui protège aussi le meuble pendant le transport. Notre équipe s'en charge, visserie repérée et rangée par meuble, puis remonte tout sur place. Pour les meubles en kit très manipulés, prévenez-nous : après plusieurs remontages, la fixation ne tient plus toujours et il vaut mieux le savoir avant. Vous n'avez à préparer que le vidage des contenus — nous ne déménageons pas une armoire pleine.",
      },
      {
        title: 'Emballage professionnel',
        desc: "L'emballage est le poste que les particuliers sous-estiment le plus. Nous fournissons cartons, papier bulle et couvertures de protection, et nous pouvons prendre en charge l'emballage complet du logement, vaisselle et objets fragiles compris. Si vous emballez vous-même, trois règles suffisent. Les objets lourds en dessous. Vingt kilos maximum par carton. Et le nom de la pièce de destination inscrit sur chaque carton. Commencez deux à trois semaines avant, par les pièces les moins utilisées. Un carton mal fermé ou non identifié coûte du temps le jour J, et c'est le jour où le temps se paie.",
      },
      {
        title: 'Rues piétonnes et accès difficiles',
        desc: "Hypercentre liégeois, ruelles de Huy, vieille ville de Limbourg, coteaux de Chaudfontaine : une partie de notre zone n'admet pas un semi-remorque. Nous adaptons alors le gabarit du véhicule, quitte à prévoir plusieurs rotations depuis un point de regroupement. Dans les zones à trafic limité, comme à Verviers, un droit d'accès temporaire s'ajoute à la réservation de stationnement. Nous introduisons les deux demandes. Ce que nous attendons de vous : l'adresse exacte dès la prise de contact, car c'est elle qui détermine le camion, pas le volume à transporter.",
      },
    ],
  },
  steps: {
    sectionTitle: 'Comment ça marche',
    items: [
      {
        title: 'Contact et premier échange',
        desc: "Appelez le 04 264 50 16 ou remplissez le formulaire. Nous vous demandons l'adresse de départ, celle d'arrivée, la date envisagée et le type de logement. Ces quatre informations suffisent à fixer un rendez-vous de visite technique.",
      },
      {
        title: 'Visite technique gratuite',
        desc: "Un responsable se déplace sur place. Il mesure le volume réel pièce par pièce, relève l'étage, la largeur de la cage d'escalier, la présence d'un ascenseur et les possibilités de stationnement. Il vérifie aussi l'adresse d'arrivée quand c'est possible. Le volume estimé de tête est presque toujours faux : c'est cette visite qui évite la mauvaise surprise le jour J.",
      },
      {
        title: 'Devis détaillé sous 24 heures',
        desc: "Vous recevez un devis sous 24 heures ouvrables. Il détaille le volume retenu, les prestations, le matériel et le prix. Quatre facteurs le font varier : le volume, la distance, l'accessibilité des deux adresses et les options choisies. Aucun frais n'apparaît le jour du déménagement s'il n'y figurait pas.",
      },
      {
        title: 'Le jour J et après',
        desc: "L'équipe arrive à l'heure convenue, protège les sols et les passages, emballe ce qui reste à emballer, démonte, charge. À l'arrivée, le mobilier est remonté et placé dans les pièces que vous désignez. Une vérification finale se fait avec vous avant que l'équipe reparte.",
      },
    ],
  },
  info: {
    sectionTitle: 'Bon à savoir',
    items: [
      {
        title: 'Ce qui fait varier un devis',
        desc: "Le volume d'abord, mais l'accessibilité pèse tout autant. Un troisième étage sans ascenseur ne coûte pas comme un rez-de-chaussée avec parking, à volume identique. La distance et la date jouent également. Mai à septembre est la période la plus demandée. En semaine, les lundis et mardis sont moins sollicités que les vendredis et samedis.",
      },
      {
        title: 'Quand réserver',
        desc: "Comptez quatre à six semaines entre mai et septembre. D'octobre à avril, deux à trois semaines suffisent généralement. Si votre déménagement demande une autorisation de stationnement, le délai communal s'ajoute : certaines communes de la province exigent jusqu'à trois semaines.",
      },
      {
        title: 'Assurance',
        desc: "Une assurance de base est incluse dans nos prestations, et une option tous risques est disponible. Le détail des garanties et des plafonds figure sur le devis, avant signature. Notre système qualité est par ailleurs certifié ISO 9001, ce qui impose des procédures écrites à chaque étape.",
      },
      {
        title: 'Capacité et matériel',
        desc: "Nos véhicules vont de 4 m³, pour un studio, à 100 m³ pour une maison complète, avec élévateurs intégrés. Sur les gros chantiers, plusieurs camions et plusieurs équipes peuvent intervenir le même jour. Un garde-meubles en box sécurisés à Seraing complète le dispositif quand les dates d'entrée et de sortie ne coïncident pas.",
      },
    ],
  },
  faq: {
    sectionTitle: 'Questions fréquentes sur le déménagement',
    items: [
      {
        q: 'Le devis est-il vraiment gratuit et sans engagement ?',
        a: "Oui. La visite technique et le devis sont gratuits et ne vous engagent à rien. Nous répondons sous 24 heures ouvrables. Le devis détaille le volume estimé, les prestations retenues et le prix : aucun frais n'apparaît le jour du déménagement s'il n'y figurait pas.",
      },
      {
        q: 'Pourquoi une visite technique plutôt qu\'un tarif au mètre cube ?',
        a: "Parce que le mètre cube ne dit rien de l'accès. Un même volume peut demander deux équipiers et une demi-journée, ou quatre équipiers, un monte-meubles et une journée complète. La visite relève l'étage, la cage d'escalier, l'ascenseur et le stationnement des deux côtés. C'est ce qui rend le prix fiable au lieu d'indicatif.",
      },
      {
        q: "Faut-il une autorisation pour stationner le camion devant chez moi ?",
        a: "Dans la plupart des cas, oui, dès qu'il s'agit d'occuper la voirie. L'autorité compétente varie : la commune dans certains cas, la zone de police dans d'autres. Les délais aussi, de quelques jours à trois semaines selon les communes. Nous nous chargeons de la demande et de la pose de la signalisation. Chaque page commune de notre site détaille la règle applicable.",
      },
      {
        q: 'Combien de temps à l\'avance faut-il réserver ?',
        a: "Quatre à six semaines entre mai et septembre, la période la plus demandée. D'octobre à avril, deux à trois semaines suffisent généralement. En semaine, les lundis et mardis sont moins sollicités que les vendredis et samedis. Si une autorisation de stationnement est nécessaire, ajoutez le délai communal.",
      },
      {
        q: 'Déménagez-vous un appartement à un étage élevé sans ascenseur ?',
        a: "Oui, et c'est un cas courant dans le bâti liégeois. Nous utilisons un monte-meubles qui hisse le mobilier par la façade. Cela évite le portage dans la cage d'escalier, réduit nettement le risque de dégâts et raccourcit l'intervention. Le monte-meubles demande un emplacement dégagé au pied de l'immeuble, que nous réservons.",
      },
      {
        q: 'Intervenez-vous en dehors de la province de Liège ?',
        a: "Oui. Nous couvrons l'ensemble de la Belgique, ainsi que la France, les Pays-Bas, l'Allemagne, le Luxembourg, la Suisse, l'Espagne, l'Italie et le Portugal. Les déménagements internationaux font l'objet d'une préparation spécifique : inventaire détaillé, emballage aux normes export, et dédouanement pour les destinations hors Union européenne.",
      },
    ],
  },
  communes: {
    sectionTitle: 'Nos pages par commune',
    intro:
      "Chaque commune a ses contraintes : un bâti, un relief, des règles de stationnement qui lui sont propres. Nous avons donc une page par commune desservie. Chacune donne la distance depuis notre dépôt, les sections de l'entité et la procédure d'autorisation de stationnement applicable, relevée sur la source officielle. Voici les principales.",
    slugs: [
      'liege', 'herstal', 'seraing', 'ans', 'verviers', 'huy', 'waremme', 'vise',
      'oupeye', 'herve', 'flemalle', 'chaudfontaine', 'fleron', 'spa', 'soumagne',
    ],
  },
  liensAssocies: {
    sectionTitle: 'Pour aller plus loin',
    intro:
      "Ces pages détaillent un aspect précis du déménagement, là où celle-ci en donne la vue d'ensemble.",
    items: [
      {
        to: '/demenagement/demenageur-liege',
        label: 'Déménageur à Liège : nos équipes et nos moyens',
        desc: 'Effectifs, flotte et organisation d\'un chantier dans l\'agglomération liégeoise.',
      },
      {
        to: '/demenagement/demenagement-piano',
        label: 'Déménagement de piano',
        desc: 'Le transport d\'un piano ne relève pas du déménagement ordinaire : matériel et précautions dédiés.',
      },
      {
        to: '/blog/6-conseils-reussir-demenagement-liege',
        label: '6 conseils pour réussir son déménagement à Liège',
        desc: 'Ce qui se prépare des semaines à l\'avance, et ce qui peut attendre.',
      },
      {
        to: '/blog/6-erreurs-eviter-demenagement-liege',
        label: '6 erreurs à éviter lors d\'un déménagement',
        desc: 'Les oublis qui coûtent le plus cher le jour J.',
      },
      {
        to: '/blog/preparer-enfants-demenagement-liege',
        label: 'Préparer les enfants au déménagement',
        desc: 'Changer de maison et d\'école : ce qui aide à passer le cap.',
      },
    ],
  },
  cta: {
    title: 'Prêt à déménager ?',
    subtitle: 'Demandez votre devis gratuit et sans engagement. Réponse garantie sous 24h.',
    buttonText: 'Demander un devis gratuit',
    phone: '04 264 50 16',
  },
};

export default function DemenagementsPage() {
  return (
    <ServicePageLayout
      slug="demenagements"
      ctaIcon={Truck}
      stepIcons={[Phone, ClipboardList, Truck, PackageCheck]}
      guaranteeIcons={[ShieldCheck, Users, Clock, MapPin]}
      defaults={defaults}
      defaultMeta={{
        title: 'Déménagements à Liège | Déménagements Gramme',
        description:
          "Déménagement à Liège pour particuliers et entreprises : emballage, démontage-remontage, monte-meubles et transport assuré. Devis gratuit sous 24h, depuis 1948.",
        canonical: '/demenagement',
      }}
    />
  );
}
