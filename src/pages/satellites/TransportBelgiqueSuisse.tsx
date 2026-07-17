import ServiceSatellitePage from '../../components/ServiceSatellitePage';

export default function TransportBelgiqueSuisse() {
  return (
    <ServiceSatellitePage
      title="Déménagement Belgique - Suisse"
      subtitle="Déménagez de la Belgique vers la Suisse ou de la Suisse vers la Belgique. Transport professionnel, formalités douanières incluses."
      heroImage="https://images.pexels.com/photos/4246196/pexels-photo-4246196.jpeg?auto=compress&cs=tinysrgb&w=1920"
      sections={[
        {
          title: 'Déménager entre la Belgique et la Suisse',
          content: "La Suisse est une destination fréquente pour les déménagements internationaux au départ de Liège. Que vous rejoigniez Genève, Zurich, Berne, Lausanne ou Bâle, Déménagements Gramme organise votre transfert de A à Z.\n\nLa Suisse n'étant pas membre de l'Union européenne, le passage en douane nécessite des documents spécifiques. Notre équipe se charge de toutes les formalités douanières pour un déménagement sans tracas.",
        },
        {
          title: 'Logistique et transport vers la Suisse',
          content: "Le trajet Liège-Genève représente environ 700 km. Nous planifions l'itinéraire optimal et programmons le transport pour que vos biens arrivent dans les délais convenus.\n\nNos véhicules longue distance sont équipés de systèmes de fixation renforcés et de hayons élévateurs. Nous proposons le transport en exclusivité (camion dédié) ou en groupage pour les plus petits volumes.",
        },
      ]}
      faq={[
        {
          question: 'Quelles formalités pour déménager en Suisse ?',
          answer: "Un inventaire détaillé de vos biens est nécessaire pour les douanes suisses. Nous préparons tous les documents requis : liste d'inventaire, formulaire 18.44 (déclaration en douane), et les attestations nécessaires.",
        },
        {
          question: 'Combien de temps prend un déménagement vers la Suisse ?',
          answer: "Le transport prend généralement 1 à 2 jours selon la destination en Suisse. L'ensemble du processus (emballage, transport, déchargement) se planifie sur 3 à 5 jours.",
        },
        {
          question: "Le déménagement vers la Suisse est-il plus cher qu'en UE ?",
          answer: "Les formalités douanières supplémentaires engendrent un coût additionnel modéré. Nous vous fournissons un devis détaillé et transparent intégrant tous les frais.",
        },
      ]}
      relatedPages={[
        { label: 'Belgique - France', to: '/transport/demenagement-belgique-france' },
        { label: 'Belgique - Italie', to: '/transport/demenagement-belgique-italie' },
        { label: 'Déménagement international', to: '/demenagement/demenagement-international' },
      ]}
      meta={{
        title: 'Déménagement Belgique - Suisse | Déménagements Gramme',
        description: 'Déménagement de la Belgique vers la Suisse. Formalités douanières, transport sécurisé. Devis gratuit. Gramme depuis 1948.',
        canonical: '/transport/demenagement-belgique-suisse',
      }}
    />
  );
}
