import ServiceSatellitePage from '../../components/ServiceSatellitePage';

/**
 * Page service, et non page commune : le sujet est la destination, pas la
 * commune de départ. Elle reste donc sur le template des pages services.
 *
 * Les délais annoncés (1 à 5 jours pour les pays limitrophes, 5 à 10 pour le
 * sud de l'Europe) sont ceux déjà publiés sur le site : ils sont repris tels
 * quels, jamais précisés ni durcis.
 */
export default function DemenagementInternationalSatellite() {
  return (
    <ServiceSatellitePage
      title="Déménagement international"
      subtitle="Déménagez depuis Liège vers toute l'Europe et au-delà. Formalités douanières, emballage export et transport longue distance par des professionnels expérimentés."
      heroImage="https://images.pexels.com/photos/4246196/pexels-photo-4246196.jpeg?auto=compress&cs=tinysrgb&w=1920"
      sections={[
        {
          title: 'Déménagement international depuis Liège',
          content:
            "Depuis 1948, Déménagements Gramme accompagne les familles et les entreprises dans leurs projets de déménagement international. Notre position à Liège, au cœur de l'Europe, met la France, les Pays-Bas, l'Allemagne et le Luxembourg à quelques heures de route.\n\nNous gérons l'intégralité de l'opération : visite technique, emballage aux normes export, formalités administratives, transport et installation dans votre nouveau logement.\n\nL'entreprise est certifiée ISO 9001. Sur un transport longue distance, où votre mobilier reste plusieurs jours hors de votre vue, cette traçabilité écrite des procédures n'est pas un détail administratif.",
        },
        {
          title: 'Nos destinations européennes',
          content:
            "Nous réalisons régulièrement des déménagements vers toutes les grandes villes européennes : Paris, Lyon, Marseille, Amsterdam, Rotterdam, Cologne, Berlin, Munich, Genève, Zurich, Madrid, Barcelone, Rome, Milan, Lisbonne.\n\nPour les pays limitrophes — France, Pays-Bas, Allemagne, Luxembourg — les délais sont de 1 à 5 jours ouvrables. Pour le sud de l'Europe — Espagne, Italie, Portugal — comptez 5 à 10 jours. Un planning détaillé accompagne votre devis.\n\nCes délais courent à partir du chargement, pas de la signature. La date de chargement, elle, se réserve d'autant plus tôt que la destination est lointaine.",
        },
        {
          title: 'Camion dédié ou groupage : ce qui change pour vous',
          content:
            "Un camion dédié part pour vous seul. Le chargement et la livraison sont consécutifs, les délais sont les plus courts possibles, et vous choisissez vos dates. C'est la formule des volumes importants et des déménagements à date imposée.\n\nLe groupage partage le camion entre plusieurs clients allant dans la même direction. Le coût baisse nettement, mais le départ dépend du remplissage et la livraison s'inscrit dans une tournée. C'est la formule des petits volumes — un studio, un appartement partiellement meublé, une expatriation légère.\n\nLa visite technique tranche entre les deux. Elle mesure le volume réel, qui est presque toujours différent du volume estimé de tête.",
        },
        {
          title: 'Emballage aux normes du transport longue distance',
          content:
            "Un trajet international n'a rien d'un déménagement de quartier. Le mobilier subit des vibrations pendant des heures, change plusieurs fois de température et voyage parfois avec d'autres chargements.\n\nL'emballage est donc renforcé : caisses en bois pour les objets fragiles et les œuvres, housses spéciales pour les matelas et les canapés, protection anti-choc aux angles, calage systématique des vides dans le camion. Notre équipe est formée à ces techniques.\n\nLe démontage du mobilier volumineux fait partie de la prestation, tout comme le remontage à l'arrivée. Une armoire démontée occupe trois fois moins de place et voyage bien mieux qu'une armoire sanglée debout.",
        },
        {
          title: 'Inventaire, douane et documents',
          content:
            "Tout déménagement international commence par un inventaire détaillé. Il sert de base au devis, à l'assurance et, le cas échéant, aux formalités douanières. C'est le document le plus important du dossier.\n\nÀ l'intérieur de l'Union européenne, la libre circulation des biens dispense de dédouanement : un déménagement vers la France, l'Allemagne ou l'Espagne n'appelle aucune déclaration en douane. L'inventaire et les certificats d'assurance suffisent.\n\nVers la Suisse et le Royaume-Uni, en revanche, un dédouanement est bien nécessaire. Nous prenons en charge les documents correspondants et le régime d'exonération applicable aux biens personnels en cas de transfert de résidence.",
        },
        {
          title: "Ce qui se passe à l'arrivée",
          content:
            "La livraison ne s'arrête pas au trottoir. L'équipe monte le mobilier, le remonte et le place dans les pièces que vous désignez, exactement comme sur un déménagement local.\n\nLes contraintes d'accès du logement d'arrivée se relèvent avant le départ, pendant la visite technique. Une rue piétonne à Barcelone, un cinquième sans ascenseur à Paris, une autorisation de stationnement à obtenir auprès de la commune : mieux vaut le savoir depuis Liège que le découvrir sur place.\n\nSi votre nouveau logement n'est pas disponible à la date de sortie, le mobilier peut patienter dans nos box de garde-meubles à Herstal avant de repartir.",
        },
      ]}
      faq={[
        {
          question: 'Quels pays desservez-vous pour le déménagement international ?',
          answer:
            "Toute l'Europe : France, Pays-Bas, Allemagne, Luxembourg, Suisse, Espagne, Italie, Portugal, Royaume-Uni, et d'autres destinations sur demande.",
        },
        {
          question: 'Gérez-vous les formalités douanières ?',
          answer:
            "Oui, quand elles s'appliquent. À l'intérieur de l'Union européenne, la libre circulation des biens rend le dédouanement inutile. Vers la Suisse ou le Royaume-Uni, nous prenons en charge les documents douaniers et le régime d'exonération prévu pour les biens personnels lors d'un transfert de résidence.",
        },
        {
          question: 'Proposez-vous le groupage pour les petits volumes ?',
          answer:
            "Oui. Le groupage partage le camion avec d'autres clients allant dans la même direction, ce qui fait nettement baisser le coût. En contrepartie, le départ dépend du remplissage et la livraison s'inscrit dans une tournée.",
        },
        {
          question: 'Quels sont les délais de livraison à l’étranger ?',
          answer:
            "Comptez 1 à 5 jours ouvrables pour les pays limitrophes — France, Pays-Bas, Allemagne, Luxembourg — et 5 à 10 jours pour l'Espagne, l'Italie et le Portugal. Ces délais courent à partir du chargement. Un planning détaillé accompagne le devis.",
        },
        {
          question: 'Démontez-vous et remontez-vous les meubles ?',
          answer:
            "Oui, des deux côtés. Le démontage fait partie de la prestation au départ, le remontage à l'arrivée. Sur un trajet international, c'est aussi ce qui protège le mieux le mobilier volumineux.",
        },
        {
          question: 'Que se passe-t-il si mon logement n’est pas disponible à temps ?',
          answer:
            "Le mobilier peut attendre dans nos box de garde-meubles individuels à Herstal, surveillés en permanence, avec l'assurance vol, incendie et dégradation comprise. Le départ vers l'étranger est ensuite reprogrammé.",
        },
      ]}
      /* Les anciennes pages par pays (/transport/demenagement-belgique-*) ont
         été fusionnées dans celle-ci et redirigent donc vers elle : les
         proposer ici renvoyait le visiteur sur la page qu'il consulte déjà. */
      relatedPages={[
        { label: 'Tous nos déménagements', to: '/demenagement' },
        { label: "Déménagement d'entreprise", to: '/demenagement/demenagement-entreprise' },
        { label: 'Garde-meubles', to: '/garde-meubles' },
        { label: 'Démontage et remontage de meubles', to: '/demenagement/demontage-remontage-meubles' },
        { label: 'Déménagement à Liège', to: '/demenagement/demenagement-liege' },
      ]}
      meta={{
        title: 'Déménagement international depuis Liège | Gramme',
        description:
          "Déménagement international depuis Liège vers toute l'Europe. Groupage ou camion dédié, emballage export, formalités douanières. Devis gratuit sous 24h.",
        canonical: '/demenagement/demenagement-international',
      }}
    />
  );
}
