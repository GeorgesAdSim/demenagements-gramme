import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { MapPin, Building2, TriangleAlert, Truck } from 'lucide-react';
import { anneesExperience } from '../lib/anciennete';

// Quartiers de Liège où l'entreprise intervient. Aucun concurrent de la première
// page ne descend à ce niveau de granularité : le premier cite des communes de
// la province, jamais des quartiers.
const QUARTIERS = [
  'Centre-ville', 'Outremeuse', 'Amercœur', 'Longdoz', 'Guillemins', 'Laveu',
  'Cointe', 'Sainte-Walburge', 'Rocourt', 'Grivegnée', 'Chênée', 'Jupille',
  'Wandre', 'Bressoux', 'Droixhe', 'Angleur', 'Sclessin', 'Fétinne',
];

// Communes de l'arrondissement de Liège et des environs immédiats.
const COMMUNES = [
  'Herstal', 'Seraing', 'Ans', 'Saint-Nicolas', 'Grâce-Hollogne', 'Flémalle',
  'Beyne-Heusay', 'Fléron', 'Chaudfontaine', 'Esneux', 'Oupeye', 'Visé',
  'Blegny', 'Soumagne', 'Awans', 'Juprelle', 'Bassenge', 'Trooz',
  'Sprimont', 'Neupré', 'Comblain-au-Pont', 'Aywaille',
];

const CONTRAINTES = [
  {
    icon: TriangleAlert,
    titre: 'Rues étroites et pentes du centre historique',
    texte: "Le Laveu, Cointe ou les abords de la Citadelle imposent des rues en forte pente et des accès resserrés. Nos chauffeurs connaissent les gabarits praticables et nous adaptons le véhicule au quartier plutôt que l'inverse.",
  },
  {
    icon: Building2,
    titre: 'Immeubles anciens sans ascenseur',
    texte: "Une grande partie du bâti liégeois, en Outremeuse comme au Longdoz, compte trois à quatre étages sans ascenseur. Notre monte-meubles évite le portage dans les cages d'escalier et réduit fortement les risques de dégâts.",
  },
  {
    icon: MapPin,
    titre: 'Stationnement réglementé',
    texte: "La Ville de Liège exige une autorisation d'occupation de la voirie pour réserver un emplacement le jour du déménagement. Nous nous chargeons de la demande et de la pose des panneaux.",
  },
  {
    icon: Truck,
    titre: 'Accès contraints et zones piétonnes',
    texte: "Carré, rue Saint-Paul, place du Marché : certaines adresses ne sont accessibles qu'à des créneaux précis. Nous planifions l'intervention en fonction de ces fenêtres horaires.",
  },
];

export default function LiegeSection() {
  const ans = anneesExperience();

  return (
    <section id="demenagement-liege" className="bg-white py-16 md:py-24">
      <div className="max-w-5xl mx-auto px-4 md:px-8">

        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-80px' }}
          transition={{ duration: 0.6 }}
        >
          <span className="inline-block bg-navy text-yellow text-[11px] uppercase tracking-[0.2em] font-bold rounded-full px-4 py-1.5 mb-4">
            NOTRE TERRITOIRE
          </span>
          {/* H2 auto-suffisant : compréhensible hors contexte, condition d'une
              bonne extraction par les moteurs de réponse. */}
          <h2 className="text-3xl md:text-4xl font-black uppercase text-navy leading-tight mb-6">
            Déménagement à Liège : {ans} ans de terrain liégeois
          </h2>

          {/* Answer Capsule — bloc de tête destiné à l'extraction par les IA.
              Contient les entités nommées : entreprise, ville, adresse, date de
              fondation, capacités, périmètre. */}
          <p className="text-navy text-lg md:text-xl leading-relaxed border-l-4 border-yellow pl-5 mb-8 font-medium">
            Déménagements Gramme est une entreprise familiale établie rue des
            Naiveux 64 à Herstal, en périphérie de Liège. Elle est active depuis
            1948, soit {ans} ans et trois générations. Nous déménageons
            particuliers et entreprises dans tous les quartiers liégeois. Nos
            véhicules vont de 4 à 100 m³ et sont équipés d'élévateurs. Le devis
            est gratuit et remis sous 24 heures ouvrables.
          </p>

          <p className="text-muted text-[17px] leading-relaxed mb-4">
            Déménager à Liège ne ressemble pas à déménager ailleurs. La ville
            cumule trois contraintes. Son bâti ancien est souvent dépourvu
            d'ascenseur. Ses rues montent, héritage d'une topographie de vallée.
            Et son hypercentre applique des règles de stationnement strictes. Un
            déménageur qui les ignore découvre le problème le matin du
            chargement, au moment où il coûte le plus cher.
          </p>
          <p className="text-muted text-[17px] leading-relaxed">
            C'est là que joue l'expérience locale accumulée depuis 1948. Nous
            savons quel gabarit de camion passe rue Hors-Château. Nous savons
            combien de temps prend un troisième étage sans ascenseur au Longdoz.
            Et nous savons quand déposer une demande d'autorisation de voirie
            auprès de la Ville pour qu'elle soit accordée à temps.
          </p>
        </motion.div>

        {/* Les 4 contraintes — chaque bloc est un passage extractible autonome */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-12">
          {CONTRAINTES.map((c, i) => {
            const Icon = c.icon;
            return (
              <motion.div
                key={c.titre}
                initial={{ opacity: 0, y: 24 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: '-60px' }}
                transition={{ delay: i * 0.06, duration: 0.4 }}
                className="bg-offwhite rounded-2xl p-6 border border-gray-100"
              >
                <div className="w-10 h-10 rounded-full bg-navy flex items-center justify-center mb-4">
                  <Icon className="w-5 h-5 text-yellow" />
                </div>
                <h3 className="text-navy font-bold text-lg mb-2">{c.titre}</h3>
                <p className="text-muted text-[15px] leading-relaxed">{c.texte}</p>
              </motion.div>
            );
          })}
        </div>

        {/* Q&A inline — question en gras puis réponse directe, format que les
            modèles de langage extraient volontiers. */}
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-60px' }}
          transition={{ duration: 0.5 }}
          className="mt-12 bg-navy/5 rounded-2xl p-6 md:p-8 border border-navy/10"
        >
          <p className="text-navy font-bold text-lg mb-2">
            Combien de temps faut-il prévoir pour un déménagement à Liège ?
          </p>
          <p className="text-muted text-[16px] leading-relaxed mb-6">
            Comptez une demi-journée à une journée pour un appartement de deux à
            trois pièces, et une journée complète pour une maison familiale.
            Trois éléments allongent cette durée : un étage élevé sans ascenseur,
            une rue en pente, un accès en zone piétonne. Ils pèsent souvent plus
            que le volume lui-même.
          </p>

          <p className="text-navy font-bold text-lg mb-2">
            Faut-il une autorisation pour stationner un camion de déménagement à Liège ?
          </p>
          <p className="text-muted text-[16px] leading-relaxed">
            Oui, la Ville de Liège délivre une autorisation d'occupation de la
            voirie qui permet de réserver un emplacement devant l'adresse. La
            demande doit être introduite plusieurs jours à l'avance. Nous nous en
            occupons pour vous, panneaux de signalisation compris.
          </p>
        </motion.div>

        {/* Quartiers — l'actif géographique le plus fin du site */}
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-60px' }}
          transition={{ duration: 0.5 }}
          className="mt-12"
        >
          <h3 className="text-2xl font-black uppercase text-navy mb-3">
            Les quartiers de Liège où nous intervenons
          </h3>
          <p className="text-muted text-[16px] leading-relaxed mb-5">
            Nous couvrons l'ensemble du territoire communal liégeois, de la rive
            gauche aux hauteurs de Cointe, en passant par les quartiers de la
            rive droite :
          </p>
          <div className="flex flex-wrap gap-2">
            {QUARTIERS.map((q) => (
              <span key={q} className="bg-offwhite border border-gray-200 text-navy text-sm rounded-full px-3.5 py-1.5">
                {q}
              </span>
            ))}
          </div>
        </motion.div>

        {/* Communes — zone de chalandise élargie */}
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-60px' }}
          transition={{ duration: 0.5 }}
          className="mt-10"
        >
          <h3 className="text-2xl font-black uppercase text-navy mb-3">
            Les communes de la province que nous desservons
          </h3>
          <p className="text-muted text-[16px] leading-relaxed mb-5">
            Notre dépôt nous place à quelques minutes de la plupart
            des communes de l'arrondissement. Nous intervenons régulièrement à :
          </p>
          <div className="flex flex-wrap gap-2">
            {COMMUNES.map((c) => (
              <span key={c} className="bg-offwhite border border-gray-200 text-navy text-sm rounded-full px-3.5 py-1.5">
                {c}
              </span>
            ))}
          </div>
          <p className="text-muted text-[15px] leading-relaxed mt-5">
            Votre commune n'apparaît pas dans cette liste&nbsp;? Nous couvrons
            l'ensemble de la province de Liège et de la Belgique. La France, la
            Suisse, l'Espagne et l'Italie relèvent de nos{' '}
            <Link to="/demenagement/demenagement-international" className="text-navy font-bold underline hover:text-navy/70 transition-colors">
              déménagements internationaux depuis Liège
            </Link>
            . Appelez-nous, nous vous dirons en deux minutes si nous pouvons
            intervenir.
          </p>
        </motion.div>

      </div>
    </section>
  );
}
