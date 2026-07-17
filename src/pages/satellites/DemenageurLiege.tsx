import ServiceSatellitePage from '../../components/ServiceSatellitePage';

export default function DemenageurLiege() {
  return (
    <ServiceSatellitePage
      title="Déménageur à Liège"
      subtitle="Déménagements Gramme, votre déménageur de confiance à Liège depuis 1948. Une équipe professionnelle, un service complet et personnalisé pour tous vos projets de déménagement."
      heroImage="https://images.pexels.com/photos/4246120/pexels-photo-4246120.jpeg?auto=compress&cs=tinysrgb&w=1920"
      sections={[
        {
          title: 'Votre déménageur de confiance à Liège',
          content: "Depuis plus de 75 ans, Déménagements Gramme est le partenaire privilégié des Liégeois pour leurs déménagements. Notre équipe de professionnels qualifiés prend en charge l'intégralité de votre déménagement, de l'emballage au remontage des meubles.\n\nInstallés à Herstal, nous connaissons parfaitement la région liégeoise et ses spécificités : rues étroites du centre historique, immeubles sans ascenseur, zones piétonnes. Notre expérience nous permet de trouver des solutions adaptées à chaque situation.",
        },
        {
          title: 'Un service complet pour votre déménagement',
          content: "Nous proposons une gamme complète de services pour faciliter votre déménagement : emballage professionnel, démontage et remontage de meubles, transport sécurisé, monte-meubles pour les étages élevés, et même un service de garde-meubles si nécessaire.\n\nChaque déménagement est unique, c'est pourquoi nous établissons un devis personnalisé après une visite technique gratuite. Pas de mauvaise surprise : le prix annoncé est le prix final.",
        },
        {
          title: 'Pourquoi choisir Gramme à Liège',
          content: "Notre longévité témoigne de la qualité de nos services. Depuis 1948, nous avons déménagé des milliers de familles et d'entreprises à Liège. Notre équipe est assurée tous risques, formée aux techniques de manutention les plus récentes et équipée de matériel professionnel.\n\nNous intervenons dans tout Liège et ses communes limitrophes : Herstal, Seraing, Ans, Grâce-Hollogne, Visé, Flémalle, et bien d'autres.",
        },
      ]}
      faq={[
        {
          question: 'Combien coûte un déménagement à Liège ?',
          answer: "Le prix dépend du volume à déménager, de la distance, de l'accessibilité des lieux et des services complémentaires souhaités. Nous établissons un devis gratuit et sans engagement après une visite technique.",
        },
        {
          question: 'Intervenez-vous dans tout Liège ?',
          answer: "Oui, nous intervenons dans toute la ville de Liège et ses environs : Herstal, Seraing, Ans, Grâce-Hollogne, Visé, Flémalle, Ougrée, Chênée, Jupille, Wandre, etc.",
        },
        {
          question: "Proposez-vous un service d'emballage ?",
          answer: "Absolument. Notre équipe peut se charger de l'emballage complet de vos affaires avec du matériel professionnel : cartons renforcés, papier bulle, housses de protection, etc.",
        },
      ]}
      relatedPages={[
        { label: 'Déménagement à Liège', to: '/demenagement/demenagement-liege' },
        { label: 'Déménagement à Seraing', to: '/demenagement/demenagement-seraing' },
        { label: 'Déménagement à Herstal', to: '/demenagement/demenagement-herstal' },
      ]}
      meta={{
        title: 'Déménageur à Liège | Déménagements Gramme depuis 1948',
        description: 'Déménageur professionnel à Liège depuis 1948. Équipe qualifiée, assurance incluse, devis gratuit sous 24h. Déménagements Gramme.',
        canonical: '/demenagement/demenageur-liege',
      }}
    />
  );
}
