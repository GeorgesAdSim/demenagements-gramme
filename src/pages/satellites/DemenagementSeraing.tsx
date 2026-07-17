import ServiceSatellitePage from '../../components/ServiceSatellitePage';

export default function DemenagementSeraing() {
  return (
    <ServiceSatellitePage
      title="Déménagement à Seraing"
      subtitle="Votre déménagement à Seraing organisé par des professionnels. Déménagements Gramme intervient dans toute la commune de Seraing et ses environs."
      heroImage="https://images.pexels.com/photos/4246196/pexels-photo-4246196.jpeg?auto=compress&cs=tinysrgb&w=1920"
      sections={[
        {
          title: 'Déménager à Seraing avec Gramme',
          content: "Seraing, deuxième ville de la province de Liège, possède ses propres spécificités en matière de déménagement. Des anciennes cités ouvrières aux nouveaux quartiers résidentiels, notre équipe connaît parfaitement le terrain.\n\nNous intervenons dans tous les quartiers de Seraing : centre-ville, Ougrée, Boncelles, Jemeppe, Flémalle-Haute et les environs. Notre proximité géographique depuis Herstal nous permet d'être réactifs et disponibles.",
        },
        {
          title: 'Services adaptés à Seraing',
          content: "Que vous déménagiez un studio, un appartement familial ou les locaux de votre entreprise, nous adaptons nos moyens à votre besoin. Notre flotte de véhicules permet de répondre à tous les volumes, de 4 m³ à 100 m³.\n\nNos services incluent : emballage, démontage/remontage de meubles, monte-meubles pour les étages élevés, transport sécurisé et stockage temporaire en garde-meubles si nécessaire.",
        },
      ]}
      faq={[
        {
          question: 'Intervenez-vous dans tous les quartiers de Seraing ?',
          answer: "Oui, nous couvrons l'ensemble de la commune de Seraing : le centre, Ougrée, Boncelles, Jemeppe, et toutes les sections. Nous connaissons bien la région.",
        },
        {
          question: 'Proposez-vous un service de monte-meubles à Seraing ?',
          answer: "Oui, notre service de monte-meubles est disponible à Seraing pour les étages élevés ou les accès difficiles. Un opérateur qualifié se charge de l'installation et de la manœuvre.",
        },
        {
          question: 'Comment obtenir un devis pour un déménagement à Seraing ?',
          answer: "Contactez-nous par téléphone au 04 264 50 16 ou via notre formulaire en ligne. Nous organisons une visite technique gratuite pour évaluer votre volume et établir un devis précis.",
        },
      ]}
      relatedPages={[
        { label: 'Déménagement à Liège', to: '/demenagement/demenagement-liege' },
        { label: 'Déménagement à Herstal', to: '/demenagement/demenagement-herstal' },
        { label: 'Déménageur à Liège', to: '/demenagement/demenageur-liege' },
      ]}
      meta={{
        title: 'Déménagement à Seraing | Déménagements Gramme',
        description: 'Déménagement professionnel à Seraing. Équipe locale, devis gratuit, service complet. Déménagements Gramme depuis 1948.',
        canonical: '/demenagement/demenagement-seraing',
      }}
    />
  );
}
