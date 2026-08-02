import ServiceSatellitePage from '../../components/ServiceSatellitePage';

/**
 * Page service B2B, et non une page commune : elle reste donc sur le template
 * des pages services. Le déménagement d'entreprise ne se joue pas sur la
 * géographie mais sur la continuité d'activité, ce que le template commune —
 * distance depuis le dépôt, villages, communes limitrophes — ne sait pas dire.
 *
 * Aucun délai, tarif ni volume n'est avancé ici s'il ne figure pas déjà
 * ailleurs sur le site : un chiffre inventé sur une page B2B se retrouve dans
 * un cahier des charges.
 */
export default function DemenagementEntreprise() {
  return (
    <ServiceSatellitePage
      title="Déménagement d'entreprise"
      subtitle="Transférez vos bureaux, ateliers ou locaux commerciaux sans interruption d'activité. Une logistique maîtrisée pour un déménagement professionnel sans stress."
      heroImage="https://images.pexels.com/photos/4246091/pexels-photo-4246091.jpeg?auto=compress&cs=tinysrgb&w=1920"
      sections={[
        {
          title: 'Transférer vos locaux sans arrêter votre activité',
          content:
            "Un déménagement d'entreprise ne se mesure pas en mètres cubes mais en heures d'arrêt. C'est le seul chiffre qui compte pour vous, et c'est autour de lui que nous construisons l'intervention.\n\nNous transférons des bureaux, des ateliers, des commerces et des entrepôts. La prise en charge couvre l'inventaire, l'emballage du mobilier et du matériel informatique, le transport et la réinstallation dans vos nouveaux locaux.\n\nDéménagements Gramme est une entreprise familiale active depuis 1948, certifiée ISO 9001. Cette certification impose des procédures écrites et tracées — sur un transfert professionnel, c'est ce qui rend le déroulement vérifiable plutôt que promis.",
        },
        {
          title: 'Le plan de charge : tout se décide avant le jour J',
          content:
            "La visite technique est le vrai point de départ. Nous parcourons vos locaux actuels et les futurs, nous relevons les accès, les ascenseurs, les gaines et les contraintes de stationnement des deux côtés.\n\nDe cette visite sort un plan de charge. Il fixe l'ordre de démontage, l'ordre de chargement et le plan d'implantation dans les nouveaux locaux. Chaque poste de travail reçoit une étiquette qui désigne sa destination exacte : bureau, étage, emplacement.\n\nLe bénéfice se voit à l'arrivée. Vos équipes ne cherchent pas leurs caisses le lundi matin, elles les trouvent à leur place. Le devis détaillé qui accompagne ce plan vous est remis sous 24 heures ouvrables.",
        },
        {
          title: 'Intervenir en dehors des heures ouvrables',
          content:
            "La plupart des transferts que nous réalisons se déroulent en soirée, le week-end ou pendant une fermeture annuelle. Vos collaborateurs quittent l'ancien site un vendredi et retrouvent le nouveau le lundi.\n\nQuand la fermeture complète n'est pas envisageable, nous procédons par étapes : service par service, ou plateau par plateau. Une partie de l'entreprise continue de tourner pendant que l'autre est transférée.\n\nCes créneaux se réservent tôt. Ils dépendent autant de nos disponibilités que de celles du gestionnaire de votre immeuble, qui n'ouvre pas toujours les parties communes le dimanche.",
        },
        {
          title: 'Postes informatiques, serveurs et téléphonie',
          content:
            "Le matériel informatique voyage dans des emballages dédiés : mousses de protection, caisses anti-choc, housses antistatiques. Chaque poste est débranché, câbles repérés, emballé, puis rebranché à l'identique dans les nouveaux locaux.\n\nL'étiquetage est ce qui fait la différence à la réinstallation. Un écran sans son unité centrale, un dock sans son câble d'alimentation : ce sont ces détails qui transforment une reprise d'activité en demi-journée perdue.\n\nNous travaillons volontiers en coordination avec votre prestataire informatique. Le débranchement et le rebranchement des serveurs et des baies de brassage relèvent de sa compétence, pas de la nôtre. Nous nous calons sur son planning.",
        },
        {
          title: 'Archives, dossiers et mobilier lourd',
          content:
            "Les archives se déménagent en caisses fermées, numérotées et inventoriées, dans l'ordre de leur classement d'origine. Un carton d'archives mal repéré est un carton qu'on rouvrira dix fois.\n\nLes dossiers sensibles restent sous votre contrôle : nous vous remettons l'inventaire, et les caisses correspondantes peuvent être scellées avant enlèvement.\n\nCoffres-forts, machines-outils, mobilier de direction et matériel d'atelier relèvent de la manutention lourde. Nos véhicules vont de 4 à 100 m³ et disposent d'élévateurs intégrés ; le monte-meubles prend le relais quand l'escalier ou l'ascenseur ne passe pas.",
        },
        {
          title: "Coordination avec le syndic et l'accès à l'immeuble",
          content:
            "Un transfert de bureaux met en jeu au moins deux immeubles, et donc au moins deux gestionnaires. Réservation du monte-charge, protection des parties communes, créneaux autorisés, accès au quai de livraison : ces points se règlent en amont, pas le matin même.\n\nNous prenons contact avec les syndics et les gestionnaires des deux sites. Nous nous chargeons aussi de la demande d'autorisation de stationnement auprès de l'administration communale, panneaux compris. Elle doit être introduite plusieurs jours ouvrables à l'avance.\n\nVos deux baux ne se recouvrent pas ? Le mobilier peut attendre dans nos box de garde-meubles à Herstal. Ils sont surveillés en permanence et couverts contre le vol, l'incendie et la dégradation.",
        },
      ]}
      faq={[
        {
          question: 'Pouvez-vous déménager nos bureaux le week-end ?',
          answer:
            "Oui. La majorité de nos transferts professionnels se font le week-end, en soirée ou pendant une fermeture annuelle, précisément pour éviter l'interruption d'activité. Ces créneaux se réservent d'autant plus tôt qu'ils dépendent aussi de l'accès aux parties communes de l'immeuble.",
        },
        {
          question: 'Comment protégez-vous le matériel informatique ?',
          answer:
            "Chaque poste est débranché, les câbles sont repérés, puis l'ensemble part en caisses anti-choc avec mousses de protection et housses antistatiques. Le rebranchement se fait à l'identique dans les nouveaux locaux. Les serveurs et les baies de brassage restent du ressort de votre prestataire informatique, avec lequel nous nous coordonnons.",
        },
        {
          question: 'Combien de temps faut-il prévoir pour un déménagement de bureau ?',
          answer:
            "Cela dépend de la taille de vos locaux. Un petit bureau peut être déménagé en une demi-journée, tandis qu'un open space de 50 postes nécessitera un week-end complet. Le planning détaillé est établi après la visite technique, pas avant.",
        },
        {
          question: "Qui se charge de l'autorisation de stationnement ?",
          answer:
            "Nous. La demande est introduite auprès de l'administration communale de chaque site, plusieurs jours ouvrables à l'avance, et nous posons les panneaux de signalisation. Vous n'avez aucune démarche à faire.",
        },
        {
          question: 'Comment sont traitées nos archives et nos dossiers confidentiels ?',
          answer:
            "Les archives partent en caisses fermées, numérotées et inventoriées, dans l'ordre de leur classement d'origine. L'inventaire vous est remis, et les caisses contenant des dossiers sensibles peuvent être scellées avant l'enlèvement.",
        },
        {
          question: 'Pouvez-vous stocker notre mobilier entre deux baux ?',
          answer:
            "Oui. Nos box de garde-meubles à Herstal sont individuels, surveillés en permanence, et l'assurance vol, incendie et dégradation est comprise dans le tarif. C'est la solution courante quand la date de sortie ne coïncide pas avec celle d'entrée.",
        },
      ]}
      relatedPages={[
        { label: 'Déménagement à Liège', to: '/demenagement/demenagement-liege' },
        { label: 'Déménagement international', to: '/demenagement/demenagement-international' },
        { label: 'Garde-meubles à Liège', to: '/garde-meubles/garde-meubles-liege' },
        { label: 'Démontage et remontage de meubles', to: '/demenagement/demontage-remontage-meubles' },
        { label: 'Monte-meubles', to: '/monte-meubles' },
        { label: 'Toutes nos prestations', to: '/demenagement' },
      ]}
      meta={{
        title: "Déménagement d'entreprise à Liège | Déménagements Gramme",
        description:
          "Transfert de bureaux, ateliers et commerces à Liège. Intervention hors heures ouvrables, plan de charge, matériel informatique protégé. Devis sous 24h.",
        canonical: '/demenagement/demenagement-entreprise',
      }}
    />
  );
}
