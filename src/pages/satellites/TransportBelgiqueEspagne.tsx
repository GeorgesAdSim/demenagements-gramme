import ServiceSatellitePage from '../../components/ServiceSatellitePage';

export default function TransportBelgiqueEspagne() {
  return (
    <ServiceSatellitePage
      title="Déménagement Belgique - Espagne"
      subtitle="Déménagez de la Belgique vers l'Espagne ou de l'Espagne vers la Belgique. Madrid, Barcelone, Valence, Malaga et toute la péninsule ibérique."
      heroImage="https://images.pexels.com/photos/4246120/pexels-photo-4246120.jpeg?auto=compress&cs=tinysrgb&w=1920"
      sections={[
        {
          title: "Votre déménagement vers l'Espagne",
          content: "L'Espagne attire de nombreux Belges, que ce soit pour le travail, la retraite ou un changement de vie. Déménagements Gramme organise votre transfert vers toutes les grandes villes espagnoles : Madrid, Barcelone, Valence, Séville, Malaga, Alicante, et la Costa del Sol.\n\nLe trajet Liège-Madrid représente environ 1 600 km. Nous planifions l'itinéraire optimal via la France, avec des relais si nécessaire, pour que vos biens arrivent en parfait état.",
        },
        {
          title: 'Logistique et transport longue distance',
          content: "Pour les déménagements vers l'Espagne, nous utilisons nos véhicules longue distance équipés de systèmes de fixation renforcés. L'emballage est réalisé selon les normes de transport international pour résister aux vibrations du trajet.\n\nNous proposons le transport en exclusivité ou en groupage selon votre volume et votre budget. Le groupage est une option économique intéressante pour les petits volumes : votre mobilier partage le camion avec d'autres clients sur la même destination.",
        },
      ]}
      faq={[
        {
          question: "Combien de temps prend un déménagement vers l'Espagne ?",
          answer: "Le transport prend généralement 2 à 4 jours selon la destination en Espagne. L'ensemble du processus (emballage, transport, déchargement) se planifie sur 5 à 8 jours.",
        },
        {
          question: "Y a-t-il des formalités douanières pour l'Espagne ?",
          answer: "Non, l'Espagne fait partie de l'Union européenne. Il n'y a pas de formalités douanières. Un inventaire détaillé est néanmoins recommandé pour l'assurance transport.",
        },
        {
          question: "Proposez-vous le stockage temporaire en Espagne ?",
          answer: "Nous pouvons organiser un stockage temporaire en Belgique avant votre départ. Pour un stockage en Espagne, nous travaillons avec des partenaires locaux de confiance.",
        },
      ]}
      relatedPages={[
        { label: 'Belgique - France', to: '/transport/demenagement-belgique-france' },
        { label: 'Belgique - Italie', to: '/transport/demenagement-belgique-italie' },
        { label: 'Déménagement international', to: '/demenagement/demenagement-international' },
      ]}
      meta={{
        title: 'Déménagement Belgique - Espagne | Déménagements Gramme',
        description: "Déménagement de la Belgique vers l'Espagne. Madrid, Barcelone, Costa del Sol. Transport sécurisé, devis gratuit. Gramme depuis 1948.",
        canonical: '/transport/demenagement-belgique-espagne',
      }}
    />
  );
}
