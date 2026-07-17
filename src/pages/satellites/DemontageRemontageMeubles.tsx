import ServiceSatellitePage from '../../components/ServiceSatellitePage';

export default function DemontageRemontageMeubles() {
  return (
    <ServiceSatellitePage
      title="Démontage et remontage de meubles"
      subtitle="Service professionnel de démontage et remontage de meubles lors de votre déménagement. Armoires, lits, cuisines équipées : nous gérons tout."
      heroImage="https://images.pexels.com/photos/4246091/pexels-photo-4246091.jpeg?auto=compress&cs=tinysrgb&w=1920"
      sections={[
        {
          title: 'Un service indispensable pour votre déménagement',
          content: "De nombreux meubles ne passent pas par les portes ou les escaliers sans être démontés au préalable. Armoires, lits, étagères murales, cuisines équipées : notre équipe se charge du démontage dans votre ancien logement et du remontage complet dans le nouveau.\n\nNos déménageurs sont équipés de tout l'outillage nécessaire et ont l'habitude de manipuler tous types de meubles, y compris les meubles en kit (IKEA, etc.) qui nécessitent un soin particulier lors du démontage.",
        },
        {
          title: 'Notre méthode de travail',
          content: "Lors de la visite technique, nous identifions les meubles qui devront être démontés. Le jour du déménagement, nos équipes procèdent méthodiquement : chaque pièce est numérotée et étiquetée, la visserie est conservée dans des sachets identifiés.\n\nÀ l'arrivée dans votre nouveau logement, nous remontons chaque meuble exactement comme il était. Nous vérifions la stabilité et le bon fonctionnement de chaque élément avant de valider l'installation.",
        },
      ]}
      faq={[
        {
          question: 'Le démontage/remontage est-il inclus dans le prix du déménagement ?',
          answer: "Le démontage et remontage de base sont généralement inclus dans nos prestations de déménagement. Pour des installations complexes (cuisines équipées, dressings sur mesure), un supplément peut s'appliquer. Tout est détaillé dans votre devis.",
        },
        {
          question: 'Quels types de meubles démontez-vous ?',
          answer: "Nous démontons et remontons tous types de meubles : armoires, lits, bureaux, étagères, commodes, cuisines équipées, meubles en kit, dressings. Contactez-nous pour toute question spécifique.",
        },
        {
          question: 'Que se passe-t-il si un meuble est endommagé lors du remontage ?',
          answer: "Notre équipe est couverte par une assurance responsabilité civile professionnelle. En cas de dommage, nous prenons en charge la réparation ou le remplacement selon les termes de notre assurance.",
        },
      ]}
      relatedPages={[
        { label: 'Déménagement à Liège', to: '/demenagement/demenagement-liege' },
        { label: 'Déménageur à Liège', to: '/demenagement/demenageur-liege' },
        { label: "Déménagement d'entreprise", to: '/demenagement/demenagement-entreprise' },
      ]}
      meta={{
        title: 'Démontage et Remontage de Meubles | Déménagements Gramme Liège',
        description: 'Service de démontage et remontage de meubles à Liège. Armoires, lits, cuisines. Équipe qualifiée, devis gratuit. Gramme depuis 1948.',
        canonical: '/demenagement/demontage-remontage-meubles',
      }}
    />
  );
}
