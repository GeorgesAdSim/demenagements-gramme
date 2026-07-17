import ServiceSatellitePage from '../../components/ServiceSatellitePage';

export default function TransportBelgiqueFrance() {
  return (
    <ServiceSatellitePage
      title="Déménagement Belgique - France"
      subtitle="Déménagement professionnel entre la Belgique et la France. Paris, Lyon, Marseille, Lille et toutes les villes françaises."
      heroImage="https://images.pexels.com/photos/4246091/pexels-photo-4246091.jpeg?auto=compress&cs=tinysrgb&w=1920"
      sections={[
        {
          title: 'Déménager entre la Belgique et la France',
          content: "La France est notre première destination pour les déménagements internationaux. La proximité géographique et l'absence de frontière douanière (espace Schengen) facilitent les transferts entre les deux pays.\n\nNous desservons toutes les villes françaises : Paris et l'Île-de-France, Lyon, Marseille, Lille, Toulouse, Bordeaux, Nantes, Strasbourg, Montpellier, Nice, et bien d'autres. Notre expérience des axes routiers franco-belges nous permet d'optimiser les trajets et les coûts.",
        },
        {
          title: 'Un déménagement fluide et organisé',
          content: "Le déménagement vers la France suit le même processus que nos déménagements nationaux, avec une logistique adaptée à la distance. Visite technique, emballage professionnel, transport sécurisé et installation dans votre nouveau logement.\n\nPour les destinations proches comme Lille ou le nord de la France, un déménagement peut être réalisé en une journée. Pour les destinations plus éloignées comme Marseille ou Nice, nous planifions le transport sur 1 à 2 jours.",
        },
      ]}
      faq={[
        {
          question: 'Y a-t-il des formalités particulières pour déménager en France ?',
          answer: "Non, la Belgique et la France font partie de l'Union européenne et de l'espace Schengen. Il n'y a pas de formalités douanières. Un simple inventaire est recommandé pour l'assurance.",
        },
        {
          question: 'Combien coûte un déménagement vers Paris ?',
          answer: "Le tarif dépend du volume à transporter. Pour un appartement standard, le prix est généralement inférieur à ce que vous imaginez grâce à notre logistique optimisée. Demandez un devis gratuit pour obtenir un prix précis.",
        },
        {
          question: 'Proposez-vous le groupage vers la France ?',
          answer: "Oui, pour les petits volumes, nous proposons le groupage : votre mobilier partage le camion avec d'autres clients vers la même destination, ce qui réduit sensiblement le coût.",
        },
      ]}
      relatedPages={[
        { label: 'Belgique - Espagne', to: '/transport/demenagement-belgique-espagne' },
        { label: 'Belgique - Suisse', to: '/transport/demenagement-belgique-suisse' },
        { label: 'Déménagement international', to: '/demenagement/demenagement-international' },
      ]}
      meta={{
        title: 'Déménagement Belgique - France | Déménagements Gramme',
        description: 'Déménagement de la Belgique vers la France. Paris, Lyon, Marseille. Transport sécurisé, devis gratuit. Gramme depuis 1948.',
        canonical: '/transport/demenagement-belgique-france',
      }}
    />
  );
}
