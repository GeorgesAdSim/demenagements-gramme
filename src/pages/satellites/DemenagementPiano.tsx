import ServiceSatellitePage from '../../components/ServiceSatellitePage';

export default function DemenagementPiano() {
  return (
    <ServiceSatellitePage
      title="Déménagement de piano"
      subtitle="Transport et déménagement de pianos droits, pianos à queue et pianos de concert. Une expertise spécialisée pour vos instruments les plus précieux."
      heroImage="https://images.pexels.com/photos/4246120/pexels-photo-4246120.jpeg?auto=compress&cs=tinysrgb&w=1920"
      sections={[
        {
          title: 'Spécialistes du déménagement de piano',
          content: "Le déménagement d'un piano est une opération délicate qui nécessite un savoir-faire spécifique. Un piano droit pèse entre 150 et 300 kg, un piano à queue entre 300 et 600 kg. Ces instruments sont aussi fragiles que lourds.\n\nChez Déménagements Gramme, nos équipes sont formées aux techniques de manutention des pianos. Nous disposons du matériel adapté : chariots spéciaux, sangles renforcées, couvertures de protection matelassées et rampes d'accès.",
        },
        {
          title: 'Notre méthode pour déménager un piano',
          content: "Chaque déménagement de piano commence par une évaluation technique : dimensions de l'instrument, accessibilité (escaliers, couloirs, portes), étage et type de sol. Nous déterminons ensuite la meilleure approche : passage par les escaliers, utilisation de notre monte-meubles ou passage par la fenêtre.\n\nL'instrument est protégé avec des couvertures matelassées et des sangles avant d'être déplacé. Pendant le transport, il est immobilisé dans notre véhicule pour éviter tout mouvement. À l'arrivée, nous le repositionnons exactement où vous le souhaitez.",
        },
      ]}
      faq={[
        {
          question: "Combien coûte le déménagement d'un piano ?",
          answer: "Le tarif dépend du type de piano (droit ou à queue), de l'accessibilité (rez-de-chaussée, étage, monte-meubles nécessaire) et de la distance. Nous établissons un devis gratuit après évaluation de la situation.",
        },
        {
          question: 'Faut-il accorder le piano après un déménagement ?',
          answer: "Oui, il est recommandé de faire accorder votre piano environ 2 semaines après le déménagement, le temps que l'instrument s'acclimate à son nouvel environnement (température, hygrométrie).",
        },
        {
          question: 'Pouvez-vous monter un piano dans les étages ?',
          answer: "Absolument. Nous évaluons la faisabilité lors de la visite technique. Selon la configuration, nous utilisons les escaliers (avec matériel adapté) ou notre monte-meubles extérieur pour un passage par la fenêtre.",
        },
      ]}
      relatedPages={[
        { label: 'Déménagement à Liège', to: '/demenagement/demenagement-liege' },
        { label: 'Monte-meubles', to: '/monte-meubles' },
        { label: 'Démontage et remontage de meubles', to: '/demenagement/demontage-remontage-meubles' },
      ]}
      meta={{
        title: 'Déménagement de Piano à Liège | Déménagements Gramme',
        description: 'Transport et déménagement de pianos à Liège. Équipe spécialisée, matériel adapté, assurance incluse. Devis gratuit. Gramme depuis 1948.',
        canonical: '/demenagement/demenagement-piano',
      }}
    />
  );
}
