import ServiceSatellitePage from '../../components/ServiceSatellitePage';

export default function TransportBelgiqueItalie() {
  return (
    <ServiceSatellitePage
      title="Déménagement Belgique - Italie"
      subtitle="Déménagez de la Belgique vers l'Italie ou de l'Italie vers la Belgique. Rome, Milan, Turin, Florence et toutes les villes italiennes."
      heroImage="https://images.pexels.com/photos/4246196/pexels-photo-4246196.jpeg?auto=compress&cs=tinysrgb&w=1920"
      sections={[
        {
          title: "Déménager entre la Belgique et l'Italie",
          content: "L'Italie est une destination régulière pour nos déménagements internationaux. Que vous rejoigniez Rome, Milan, Turin, Florence, Naples, Bologne ou la Sardaigne, Déménagements Gramme organise votre transfert depuis Liège.\n\nLe trajet passe généralement par le Luxembourg, l'Allemagne du Sud et l'Autriche ou directement via la France et le tunnel du Mont-Blanc, selon votre destination finale en Italie.",
        },
        {
          title: 'Organisation et sécurité du transport',
          content: "Les déménagements vers l'Italie nécessitent une logistique soignée en raison de la distance (1 000 à 1 800 km selon la destination). Nous utilisons nos véhicules longue distance, équipés de systèmes de fixation et de protection renforcés.\n\nL'emballage est réalisé selon les normes de transport international. Nous accordons une attention particulière à la protection contre les vibrations et les changements de température pendant le trajet.",
        },
      ]}
      faq={[
        {
          question: "Combien de temps pour un déménagement vers l'Italie ?",
          answer: "Le transport prend 2 à 3 jours pour le nord de l'Italie (Milan, Turin) et 3 à 4 jours pour le sud (Rome, Naples). L'ensemble du processus est planifié sur 5 à 8 jours.",
        },
        {
          question: 'Desservez-vous les îles italiennes ?',
          answer: "Oui, nous pouvons organiser des déménagements vers la Sicile et la Sardaigne. Le transport implique un passage en ferry, que nous intégrons dans la planification et le devis.",
        },
        {
          question: "Quelles assurances pour le transport vers l'Italie ?",
          answer: "Notre assurance de base est incluse dans chaque déménagement. Pour les trajets longue distance, nous recommandons l'option tous risques qui couvre la totalité de vos biens.",
        },
      ]}
      relatedPages={[
        { label: 'Belgique - France', to: '/transport/demenagement-belgique-france' },
        { label: 'Belgique - Espagne', to: '/transport/demenagement-belgique-espagne' },
        { label: 'Déménagement international', to: '/demenagement/demenagement-international' },
      ]}
      meta={{
        title: 'Déménagement Belgique - Italie | Déménagements Gramme',
        description: "Déménagement de la Belgique vers l'Italie. Rome, Milan, Turin. Transport sécurisé longue distance. Devis gratuit. Gramme depuis 1948.",
        canonical: '/transport/demenagement-belgique-italie',
      }}
    />
  );
}
