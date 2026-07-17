import ServiceSatellitePage from '../../components/ServiceSatellitePage';

export default function PrixGardeMeublesLiege() {
  return (
    <ServiceSatellitePage
      title="Prix garde-meubles à Liège"
      subtitle="Découvrez nos tarifs de garde-meubles à Liège. Des prix transparents, sans frais cachés, avec assurance incluse. À partir de 30 euros par mois."
      heroImage="https://images.pexels.com/photos/4506270/pexels-photo-4506270.jpeg?auto=compress&cs=tinysrgb&w=1920"
      sections={[
        {
          title: 'Tarifs garde-meubles à Liège',
          content: "Nos tarifs de garde-meubles commencent à 30 euros par mois pour un box de 1 m³. Le prix varie en fonction du volume de stockage dont vous avez besoin. Voici notre grille indicative : 1 m³ à 30 €, 2 m³ à 40 €, 8 m³ à 76 €, 12 m³ à 95 €, 15 m³ à 105 €, 20 m³ à 130 €, 24 m³ à 150 €. Au-delà de 30 m³, le tarif est de 6 euros par m³ et par mois.\n\nCes tarifs incluent la présence d'un manutentionnaire pour les entrées et sorties de vos biens, du lundi au vendredi. L'assurance (vol, incendie, dégradation) est également comprise dans un forfait obligatoire par m³.",
        },
        {
          title: 'Ce qui est inclus dans le prix',
          content: "Nos tarifs de garde-meubles sont tout compris : stockage sécurisé dans des boxes individuels fermés à clé, surveillance 24/7, assurance de base (vol, incendie, dégradation), et assistance d'un manutentionnaire pour les entrées et sorties.\n\nIl n'y a pas de frais cachés. L'estimation du volume est vérifiée lors de la mise en garde-meubles et la facturation est basée sur le volume réel constaté. Vous êtes libre d'assister à la mise en garde-meubles de vos biens pour une transparence totale.",
        },
        {
          title: 'Comment réduire le coût de votre garde-meubles',
          content: "Quelques conseils pour optimiser le coût de votre garde-meubles : triez vos affaires avant le stockage pour ne garder que l'essentiel, démontez les meubles volumineux pour gagner de la place, et empilez les cartons de manière méthodique.\n\nSi vous avez besoin de transporter vos biens jusqu'à notre entrepôt, nous proposons un service de transport à tarif préférentiel combiné avec le garde-meubles. Vous pouvez aussi amener vos meubles par vos propres moyens pour économiser sur le transport.",
        },
      ]}
      faq={[
        {
          question: 'À partir de quel prix peut-on louer un garde-meubles ?',
          answer: "Notre plus petit box de 1 m³ est proposé à 30 euros par mois. C'est suffisant pour quelques cartons et petits objets. Pour un mobilier complet d'appartement, comptez un box de 12 à 20 m³.",
        },
        {
          question: "L'assurance est-elle incluse dans le prix ?",
          answer: "Oui, un forfait d'assurance obligatoire couvrant le vol, l'incendie et la dégradation est inclus dans nos tarifs. Pour une couverture supplémentaire, nous consulter.",
        },
        {
          question: 'Les prix sont-ils garantis ?',
          answer: "Oui, les prix annoncés sont garantis pendant 15 jours après l'établissement du devis. La réservation se fait sans engagement.",
        },
      ]}
      relatedPages={[
        { label: 'Garde-meubles à Liège', to: '/garde-meubles/garde-meubles-liege' },
        { label: 'Garde-meubles', to: '/garde-meubles' },
        { label: 'Déménagement à Liège', to: '/demenagement/demenagement-liege' },
      ]}
      meta={{
        title: 'Prix Garde-Meubles à Liège | Déménagements Gramme',
        description: 'Tarifs garde-meubles à Liège à partir de 30 euros/mois. Assurance incluse, sans engagement. Devis gratuit. Gramme depuis 1948.',
        canonical: '/garde-meubles/prix-garde-meubles-liege',
      }}
    />
  );
}
