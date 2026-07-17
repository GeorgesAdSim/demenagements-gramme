import ServiceSatellitePage from '../../components/ServiceSatellitePage';

export default function GardeMeublesLiege() {
  return (
    <ServiceSatellitePage
      title="Garde-meubles à Liège"
      subtitle="Stockage sécurisé à Liège pour vos meubles et effets personnels. Surveillance 24/7, accès flexible, durée sans engagement."
      heroImage="https://images.pexels.com/photos/4506270/pexels-photo-4506270.jpeg?auto=compress&cs=tinysrgb&w=1920"
      sections={[
        {
          title: 'Votre garde-meubles sécurisé à Liège',
          content: "Vous cherchez un espace de stockage fiable à Liège ? Déménagements Gramme met à votre disposition des entrepôts sécurisés dans la région liégeoise pour stocker vos meubles, cartons et effets personnels en toute sérénité.\n\nNos installations sont surveillées 24h/24 et 7j/7, équipées de systèmes d'alarme et d'un contrôle d'accès. Vos biens sont protégés contre le vol, l'incendie et les intempéries.",
        },
        {
          title: 'Solutions de stockage adaptées',
          content: "Nous proposons plusieurs formats de stockage pour répondre à chaque besoin : loges individuelles de 1 à 30 m³, containers sécurisés et racks palette pour les professionnels.\n\nQue ce soit entre deux logements, pendant des travaux, pour désencombrer votre intérieur ou pour stocker du matériel professionnel, nous avons la solution adaptée. La durée est flexible : de quelques semaines à plusieurs années, sans engagement.",
        },
        {
          title: 'Services complémentaires',
          content: "En complément du stockage, nous pouvons assurer le transport de vos biens depuis votre domicile jusqu'à notre entrepôt, et inversement. Notre équipe se charge du chargement, du transport et de la mise en garde-meubles.\n\nUn manutentionnaire est présent pour vous assister lors des entrées et sorties de vos biens, du lundi au vendredi. Les interventions le week-end sont possibles sur demande.",
        },
      ]}
      faq={[
        {
          question: 'Vos entrepôts sont-ils sécurisés ?',
          answer: "Oui, nos entrepôts sont surveillés 24h/24 et 7j/7 par un système de vidéosurveillance et d'alarme. L'accès est contrôlé et seuls les clients autorisés peuvent y accéder.",
        },
        {
          question: 'Quelle est la durée minimum de stockage ?',
          answer: "La durée minimum est d'un mois. Au-delà, vous pouvez prolonger votre stockage sans limite de temps et sans engagement. La facturation est mensuelle.",
        },
        {
          question: 'Puis-je accéder à mes biens quand je veux ?',
          answer: "Oui, vous pouvez accéder à votre espace de stockage sur simple demande, du lundi au vendredi pendant les heures d'ouverture. Les accès en dehors de ces heures sont possibles sur demande.",
        },
      ]}
      relatedPages={[
        { label: 'Prix garde-meubles Liège', to: '/garde-meubles/prix-garde-meubles-liege' },
        { label: 'Garde-meubles', to: '/garde-meubles' },
        { label: 'Déménagement à Liège', to: '/demenagement/demenagement-liege' },
      ]}
      meta={{
        title: 'Garde-Meubles à Liège | Déménagements Gramme',
        description: 'Garde-meubles sécurisé à Liège. Surveillance 24/7, durée flexible, accès libre. Devis gratuit. Déménagements Gramme depuis 1948.',
        canonical: '/garde-meubles/garde-meubles-liege',
      }}
    />
  );
}
