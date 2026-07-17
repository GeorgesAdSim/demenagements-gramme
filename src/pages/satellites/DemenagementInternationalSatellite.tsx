import ServiceSatellitePage from '../../components/ServiceSatellitePage';

export default function DemenagementInternationalSatellite() {
  return (
    <ServiceSatellitePage
      title="Déménagement international"
      subtitle="Déménagez depuis Liège vers toute l'Europe et au-delà. Formalités douanières, emballage export et transport longue distance par des professionnels expérimentés."
      heroImage="https://images.pexels.com/photos/4246196/pexels-photo-4246196.jpeg?auto=compress&cs=tinysrgb&w=1920"
      sections={[
        {
          title: 'Déménagement international depuis Liège',
          content: "Depuis 1948, Déménagements Gramme accompagne les familles et entreprises dans leurs projets de déménagement international. Notre position stratégique à Liège, au cœur de l'Europe, nous permet de desservir facilement la France, les Pays-Bas, l'Allemagne, le Luxembourg, la Suisse, l'Espagne, l'Italie et le Portugal.\n\nNous gérons l'intégralité de votre déménagement international : visite technique, emballage aux normes export, formalités administratives et douanières, transport sécurisé et installation dans votre nouveau logement à l'étranger.",
        },
        {
          title: 'Nos destinations européennes',
          content: "Nous réalisons régulièrement des déménagements vers toutes les grandes villes européennes : Paris, Lyon, Marseille, Amsterdam, Rotterdam, Cologne, Berlin, Munich, Genève, Zurich, Madrid, Barcelone, Rome, Milan, Lisbonne.\n\nPour les pays limitrophes (France, Pays-Bas, Allemagne, Luxembourg), les délais sont de 1 à 5 jours ouvrables. Pour le sud de l'Europe (Espagne, Italie, Portugal), comptez 5 à 10 jours. Un planning détaillé est fourni avec votre devis.",
        },
        {
          title: 'Emballage et formalités internationales',
          content: "Le déménagement international nécessite un emballage renforcé aux normes de transport longue distance : caisses en bois pour les objets fragiles, housses spéciales, protection anti-choc. Notre équipe est formée à ces techniques spécifiques.\n\nNous nous occupons également de toutes les formalités administratives : documents douaniers, inventaire détaillé, certificats d'assurance. Vous n'avez qu'à vous concentrer sur votre nouvelle vie à l'étranger.",
        },
      ]}
      faq={[
        {
          question: 'Quels pays desservez-vous pour le déménagement international ?',
          answer: "Nous desservons toute l'Europe : France, Pays-Bas, Allemagne, Luxembourg, Suisse, Espagne, Italie, Portugal, Royaume-Uni, et d'autres destinations sur demande.",
        },
        {
          question: 'Gérez-vous les formalités douanières ?',
          answer: "Oui, nous prenons en charge l'ensemble des formalités douanières et administratives liées à votre déménagement international.",
        },
        {
          question: 'Proposez-vous le groupage pour les petits volumes ?',
          answer: "Oui, pour les volumes réduits, nous proposons le transport en groupage qui permet de partager les coûts avec d'autres clients sur la même destination.",
        },
      ]}
      relatedPages={[
        { label: 'Belgique - France', to: '/transport/demenagement-belgique-france' },
        { label: 'Belgique - Suisse', to: '/transport/demenagement-belgique-suisse' },
        { label: 'Belgique - Espagne', to: '/transport/demenagement-belgique-espagne' },
      ]}
      meta={{
        title: "Déménagement International depuis Liège | Déménagements Gramme",
        description: "Déménagement international depuis Liège vers toute l'Europe. Formalités douanières, emballage export. Devis gratuit. Gramme depuis 1948.",
        canonical: '/demenagement/demenagement-international',
      }}
    />
  );
}
