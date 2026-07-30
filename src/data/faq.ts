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
    a: "Travailler avec une société spécialisée fait toute la différence. Vérifiez que l'entreprise dispose d'une assurance responsabilité civile professionnelle et d'un numéro d'entreprise valide. Chez Gramme, nous sommes actifs depuis 1948, assurés tous risques, et nous fournissons un devis gratuit sous 24h.",
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
    a: "Absolument ! Bien que notre siège soit à Liège, nous couvrons l'ensemble de la Belgique ainsi que toute l'Europe.",
  },
  // Questions ajoutées à partir des intentions de recherche que les trois
  // premiers concurrents ne traitent pas : autorisation de stationnement,
  // délai de réservation, étage sans ascenseur, gratuité du devis, prix.
  {
    q: 'Faut-il une autorisation pour stationner un camion de déménagement à Liège ?',
    a: "Oui. La Ville de Liège délivre une autorisation d'occupation de la voirie qui permet de réserver un emplacement devant votre adresse, indispensable en hypercentre et dans les rues étroites. La demande doit être introduite plusieurs jours ouvrables à l'avance. Nous nous en chargeons pour vous, pose des panneaux de signalisation comprise.",
  },
  {
    q: "Combien de temps à l'avance faut-il réserver son déménagement ?",
    a: "Comptez quatre à six semaines pour un déménagement entre mai et septembre, la période la plus demandée. D'octobre à avril, deux à trois semaines suffisent généralement, avec des disponibilités plus larges. En semaine, les lundis et mardis sont moins sollicités que les vendredis et samedis.",
  },
  {
    q: 'Comment déménagez-vous un appartement à un étage élevé sans ascenseur ?',
    a: "Une bonne partie du bâti liégeois, notamment en Outremeuse et au Longdoz, compte trois à quatre étages sans ascenseur. Nous utilisons un monte-meubles qui hisse le mobilier par la façade : cela évite le portage dans les cages d'escalier, réduit nettement le risque de dégâts et raccourcit l'intervention.",
  },
  {
    q: 'Le devis est-il vraiment gratuit et sans engagement ?',
    a: "Oui. La visite technique et le devis sont gratuits et ne vous engagent à rien. Nous répondons sous 24 heures ouvrables. Le devis détaille le volume estimé, les prestations retenues et le prix : aucun frais n'apparaît le jour du déménagement s'il n'y figurait pas.",
  },
  {
    q: 'Combien coûte un garde-meubles à Liège ?',
    a: "Nos box individuels sécurisés à Herstal vont de 30 € par mois pour 1 m³ à 150 € par mois pour 24 m³, avec un tarif de 6 € par m³ au-delà de 30 m³. La durée minimum est d'un mois et l'assurance vol, incendie et dégradation est incluse dans le tarif.",
  },
];
