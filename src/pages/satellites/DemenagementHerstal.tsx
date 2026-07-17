import ServiceSatellitePage from '../../components/ServiceSatellitePage';

export default function DemenagementHerstal() {
  return (
    <ServiceSatellitePage
      title="Déménagement à Herstal"
      subtitle="Déménageurs installés à Herstal, nous sommes vos voisins. Un service de proximité, rapide et professionnel pour votre déménagement."
      heroImage="https://images.pexels.com/photos/4246120/pexels-photo-4246120.jpeg?auto=compress&cs=tinysrgb&w=1920"
      sections={[
        {
          title: 'Votre déménageur local à Herstal',
          content: "Notre siège social est situé Rue des Naiveux 64 à Herstal. Nous sommes littéralement vos voisins ! Cette proximité nous permet d'être extrêmement réactifs et de vous offrir un service rapide et personnalisé.\n\nNous connaissons chaque rue de Herstal, chaque quartier, chaque particularité. C'est un avantage considérable pour planifier votre déménagement de manière optimale.",
        },
        {
          title: 'Tous les quartiers de Herstal desservis',
          content: "Nous intervenons dans l'ensemble de la commune de Herstal : le centre, Vottem, Liers, Milmort, Pontisse et tous les autres quartiers. Que vous restiez dans la commune ou que vous la quittiez, nous gérons votre déménagement de A à Z.\n\nNos véhicules et notre matériel sont stationnés à Herstal, ce qui nous permet de minimiser les frais de déplacement et de vous proposer des tarifs compétitifs.",
        },
      ]}
      faq={[
        {
          question: "Quels sont vos délais d'intervention à Herstal ?",
          answer: "Étant basés à Herstal, nous pouvons souvent intervenir dans des délais très courts. Pour un déménagement planifié, nous recommandons de nous contacter 2 à 4 semaines à l'avance.",
        },
        {
          question: 'Proposez-vous le garde-meubles à Herstal ?',
          answer: "Oui, nos entrepôts de garde-meubles sont situés dans la région de Liège, à proximité de Herstal. Stockage sécurisé, surveillance 24/7, durée flexible.",
        },
        {
          question: 'Votre équipe est-elle assurée ?',
          answer: "Absolument. Notre équipe est couverte par une assurance responsabilité civile professionnelle. Une assurance tous risques est également disponible en option.",
        },
      ]}
      relatedPages={[
        { label: 'Déménagement à Liège', to: '/demenagement/demenagement-liege' },
        { label: 'Déménagement à Seraing', to: '/demenagement/demenagement-seraing' },
        { label: 'Déménageur à Liège', to: '/demenagement/demenageur-liege' },
      ]}
      meta={{
        title: 'Déménagement à Herstal | Déménagements Gramme',
        description: 'Déménageur basé à Herstal. Service de proximité, équipe locale, devis gratuit. Déménagements Gramme depuis 1948.',
        canonical: '/demenagement/demenagement-herstal',
      }}
    />
  );
}
