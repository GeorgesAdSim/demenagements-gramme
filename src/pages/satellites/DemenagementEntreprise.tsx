import ServiceSatellitePage from '../../components/ServiceSatellitePage';

export default function DemenagementEntreprise() {
  return (
    <ServiceSatellitePage
      title="Déménagement d'entreprise"
      subtitle="Transférez vos bureaux, ateliers ou locaux commerciaux sans interruption d'activité. Une logistique maîtrisée pour un déménagement professionnel sans stress."
      heroImage="https://images.pexels.com/photos/4246091/pexels-photo-4246091.jpeg?auto=compress&cs=tinysrgb&w=1920"
      sections={[
        {
          title: 'Déménagement professionnel pour entreprises',
          content: "Le déménagement d'une entreprise exige une planification rigoureuse pour minimiser les perturbations. Chez Déménagements Gramme, nous avons l'expérience du déménagement de bureaux, d'ateliers, de commerces et d'entrepôts.\n\nNotre équipe prend en charge la totalité du processus : inventaire, emballage du matériel informatique et du mobilier de bureau, transport sécurisé et réinstallation complète dans vos nouveaux locaux.",
        },
        {
          title: "Minimiser l'impact sur votre activité",
          content: "Nous planifions votre déménagement d'entreprise pour réduire au maximum le temps d'arrêt. Interventions le week-end, en soirée ou par étapes : nous nous adaptons à vos contraintes opérationnelles.\n\nNotre expérience avec des entreprises de toutes tailles nous permet d'anticiper les difficultés et de proposer des solutions logistiques efficaces. Matériel informatique, archives, mobilier lourd : chaque élément est traité avec le soin qu'il mérite.",
        },
      ]}
      faq={[
        {
          question: 'Pouvez-vous déménager un bureau le week-end ?',
          answer: "Oui, nous proposons des interventions le week-end et en dehors des heures de bureau pour minimiser l'impact sur votre activité professionnelle.",
        },
        {
          question: 'Comment protégez-vous le matériel informatique ?',
          answer: "Nous utilisons des emballages spécifiques pour le matériel informatique : mousses de protection, caisses anti-choc, étiquetage précis pour faciliter la réinstallation. Chaque poste est débranché, emballé et réinstallé par notre équipe.",
        },
        {
          question: 'Combien de temps faut-il prévoir pour un déménagement de bureau ?',
          answer: "Cela dépend de la taille de vos locaux. Un petit bureau peut être déménagé en une demi-journée, tandis qu'un open space de 50 postes nécessitera un week-end complet. Nous établissons un planning détaillé après la visite technique.",
        },
      ]}
      relatedPages={[
        { label: 'Déménagement à Liège', to: '/demenagement/demenagement-liege' },
        { label: 'Déménagement international', to: '/demenagement/demenagement-international' },
        { label: 'Garde-meubles à Liège', to: '/garde-meubles/garde-meubles-liege' },
      ]}
      meta={{
        title: "Déménagement d'entreprise à Liège | Déménagements Gramme",
        description: "Déménagement de bureaux et entreprises à Liège. Intervention week-end, matériel informatique protégé. Devis gratuit. Gramme depuis 1948.",
        canonical: '/demenagement/demenagement-entreprise',
      }}
    />
  );
}
