// Source UNIQUE des questions fréquentes de l'accueil.
//
// Utilisée à la fois par FAQAccordion (affichage) et SchemaOrg (balisage
// FAQPage). Google exige que le balisage corresponde au contenu visible : deux
// listes séparées finiraient par divergence, et le balisage deviendrait fautif.
export interface FaqItem {
  q: string;
  a: string;
  list?: string[];
}

export const FAQ_ACCUEIL: FaqItem[] = [
  {
    q: 'Comment choisir un bon déménageur à Liège ?',
    a: "Vérifiez deux choses avant tout : l'assurance responsabilité civile professionnelle et le numéro d'entreprise. L'une couvre vos biens, l'autre atteste que la société est en règle. Demandez ensuite une visite technique sur place. Un déménageur qui chiffre par téléphone, sans voir les lieux, prend votre estimation pour la sienne. Gramme est actif depuis 1948, assuré, et remet un devis gratuit sous 24 heures ouvrables.",
  },
  {
    q: 'Comment faire ses cartons de déménagement ?',
    a: "Un emballage bien organisé vous fera gagner un temps précieux le jour J et protégera efficacement vos affaires.",
    list: [
      "Commencez 2 à 3 semaines avant par les pièces les moins utilisées",
      "Objets lourds en dessous, légers au-dessus — ne dépassez pas 20 kg par carton",
      "Protégez la vaisselle et les objets fragiles avec du papier journal ou du papier bulle",
      "Inscrivez le nom de la pièce de destination et le contenu sur chaque carton",
      "Préparez un carton essentiel premier jour",
      "Notre équipe peut se charger de l'emballage complet de votre domicile",
    ],
  },
  {
    q: 'Quels volumes pouvez-vous déménager ?',
    a: "Nos véhicules couvrent des volumes allant de 4 m³ (idéal pour un studio) jusqu'à 100 m³ (maison complète). Pour les projets de grande envergure, nous pouvons mobiliser plusieurs véhicules et équipes le même jour.",
  },
  {
    q: 'Intervenez-vous en dehors de Liège ?',
    a: "Oui. Notre siège est à Herstal, aux portes de Liège, mais notre zone va bien au-delà. Nous couvrons l'ensemble de la Belgique, ainsi que la France, les Pays-Bas, l'Allemagne, le Luxembourg, la Suisse, l'Espagne, l'Italie et le Portugal.",
  },
  // Questions ajoutées à partir des intentions de recherche que les trois
  // premiers concurrents ne traitent pas : autorisation de stationnement,
  // délai de réservation, étage sans ascenseur, gratuité du devis, prix.
  {
    q: 'Faut-il une autorisation pour stationner un camion de déménagement à Liège ?',
    a: "Oui. Elle permet de réserver un emplacement devant votre adresse. C'est indispensable en hypercentre et dans les rues étroites. À Liège, la demande passe par l'application en ligne de la Zone de Police. Elle doit être introduite plusieurs jours ouvrables à l'avance. Nous nous en chargeons pour vous, pose des panneaux comprise.",
  },
  {
    q: "Combien de temps à l'avance faut-il réserver son déménagement ?",
    a: "Comptez quatre à six semaines pour un déménagement entre mai et septembre, la période la plus demandée. D'octobre à avril, deux à trois semaines suffisent généralement, avec des disponibilités plus larges. En semaine, les lundis et mardis sont moins sollicités que les vendredis et samedis.",
  },
  {
    q: 'Comment déménagez-vous un appartement à un étage élevé sans ascenseur ?',
    a: "Avec un monte-meubles. Une bonne partie du bâti liégeois compte trois à quatre étages sans ascenseur, notamment en Outremeuse et au Longdoz. L'appareil hisse le mobilier par la façade. Cela évite le portage dans les cages d'escalier, réduit nettement le risque de dégâts et raccourcit l'intervention.",
  },
  {
    q: 'Le devis est-il vraiment gratuit et sans engagement ?',
    a: "Oui. La visite technique et le devis sont gratuits et ne vous engagent à rien. Nous répondons sous 24 heures ouvrables. Le devis détaille le volume estimé, les prestations retenues et le prix : aucun frais n'apparaît le jour du déménagement s'il n'y figurait pas.",
  },
  {
    q: 'Combien coûte un garde-meubles à Liège ?',
    a: "Comptez 30 € par mois pour un box de 1 m³. Un box de 24 m³ revient à 150 € par mois. Au-delà de 30 m³, le tarif est de 6 € par m³. Nos box sont individuels et sécurisés, à Herstal. La durée minimum est d'un mois. L'assurance vol, incendie et dégradation est comprise dans le tarif.",
  },
];
