import ServiceSatellitePage from '../../components/ServiceSatellitePage';

export default function DemenagementLiege() {
  return (
    <ServiceSatellitePage
      title="Déménagement à Liège"
      subtitle="Organisez votre déménagement à Liège avec des professionnels expérimentés. Devis gratuit, équipe qualifiée et service personnalisé depuis 1948."
      heroImage="https://images.pexels.com/photos/4246091/pexels-photo-4246091.jpeg?auto=compress&cs=tinysrgb&w=1920"
      sections={[
        {
          title: 'Déménager à Liège en toute sérénité',
          content: "Déménager à Liège demande une connaissance approfondie de la ville : ses rues étroites, ses zones de stationnement réglementées et ses quartiers historiques. Chez Déménagements Gramme, nous maîtrisons parfaitement le terrain liégeois.\n\nQue vous déménagiez d'un appartement en Outremeuse vers une maison à Rocourt, ou d'un bureau au centre-ville vers une zone d'activité en périphérie, notre équipe s'adapte à votre projet.",
        },
        {
          title: 'Nos services de déménagement à Liège',
          content: "Nous prenons en charge toutes les étapes de votre déménagement : visite technique gratuite, emballage professionnel, démontage et remontage des meubles, transport sécurisé, et installation dans votre nouveau logement.\n\nNos véhicules sont équipés d'élévateurs intégrés pour faciliter le chargement et le déchargement, même dans les rues les plus étroites de Liège. Notre flotte va de 4 m³ à 100 m³ pour s'adapter à tous les volumes.",
        },
        {
          title: 'Les quartiers de Liège où nous intervenons',
          content: "Nous couvrons l'intégralité du territoire liégeois : centre-ville, Outremeuse, Amercoeur, Longdoz, Guillemins, Laveu, Cointe, Rocourt, Grivegnée, Chênée, Jupille, Wandre, Bressoux, Droixhe, et tous les autres quartiers.\n\nNous gérons également les autorisations de stationnement auprès de la Ville de Liège lorsque cela est nécessaire pour le bon déroulement de votre déménagement.",
        },
      ]}
      faq={[
        {
          question: 'Quel est le meilleur moment pour déménager à Liège ?',
          answer: "La demande est plus forte entre mai et septembre. Pour bénéficier de tarifs plus avantageux et d'une plus grande disponibilité, privilégiez les mois d'octobre à avril. Nous restons disponibles toute l'année.",
        },
        {
          question: 'Gérez-vous les autorisations de stationnement ?',
          answer: "Oui, nous nous occupons des demandes d'autorisation de stationnement auprès de la commune de Liège pour garantir un accès optimal le jour du déménagement.",
        },
        {
          question: 'Combien de temps dure un déménagement à Liège ?',
          answer: "Pour un appartement standard, comptez une demi-journée à une journée complète. Pour une grande maison, prévoyez une journée entière. La durée dépend du volume, de l'accessibilité et des services choisis.",
        },
      ]}
      relatedPages={[
        { label: 'Déménageur à Liège', to: '/demenagement/demenageur-liege' },
        { label: "Déménagement d'entreprise", to: '/demenagement/demenagement-entreprise' },
        { label: 'Démontage et remontage de meubles', to: '/demenagement/demontage-remontage-meubles' },
      ]}
      meta={{
        title: 'Déménagement à Liège | Déménagements Gramme',
        description: 'Service de déménagement professionnel à Liège. Devis gratuit, équipe expérimentée depuis 1948. Particuliers et entreprises.',
        canonical: '/demenagement/demenagement-liege',
      }}
    />
  );
}
