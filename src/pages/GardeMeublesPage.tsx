import { Phone, ClipboardList, KeyRound, DoorOpen, Lock, ShieldCheck, CalendarRange, Container, Warehouse } from 'lucide-react';
import ServicePageLayout from '../components/ServicePageLayout';
import type { ServicePageContent } from '../lib/types';

const defaults: ServicePageContent = {
  hero: {
    badge: 'NOS SERVICES',
    title: 'Garde-Meubles',
    subtitle: 'Stockage sécurisé et flexible pour protéger vos biens en toute sérénité. Loges, containers et racks palette adaptés à chaque besoin.',
    guarantees: ['Accès sécurisé', 'Surveillance 24/7', 'Sans engagement', 'Multiples formats'],
  },
  prestations: {
    sectionTitle: 'Nos solutions de stockage',
    items: [
      { title: 'Loges individuelles', desc: 'Espaces privatifs de différentes tailles pour stocker vos meubles et effets personnels.' },
      { title: 'Containers', desc: 'Containers sécurisés pour un stockage plus important ou du matériel professionnel.' },
      { title: 'Racks palette', desc: 'Stockage sur racks pour marchandises palettisées, idéal pour les professionnels.' },
      { title: 'Sécurité 24/7', desc: 'Site surveillé en permanence, accès contrôlé et alarme pour la protection de vos biens.' },
      { title: 'Durée flexible', desc: 'Stockage de quelques semaines à plusieurs années, sans engagement de durée minimum.' },
      { title: 'Accès illimité', desc: 'Accédez à votre espace de stockage quand vous le souhaitez, sur simple demande.' },
    ],
  },
  steps: {
    sectionTitle: 'Comment ça marche',
    items: [
      { title: 'Contact', desc: 'Décrivez-nous vos besoins de stockage : type de biens, volume estimé, durée.' },
      { title: 'Choix du box', desc: 'Nous vous proposons la solution adaptée : loge, container ou rack palette.' },
      { title: 'Accès à votre espace', desc: 'Vos biens sont stockés en toute sécurité. Vous gardez un accès libre.' },
      { title: 'Récupération', desc: 'Quand vous êtes prêt, récupérez vos affaires ou nous les livrons chez vous.' },
    ],
  },
  info: {
    sectionTitle: 'Bon à savoir',
    items: [
      { title: 'Tarifs', desc: "Le tarif dépend de la taille de l'espace choisi et de la durée de stockage. Pas de frais cachés." },
      { title: 'Durée', desc: 'Stockage flexible : de quelques semaines à plusieurs années. Pas de durée minimum imposée.' },
      { title: 'Sécurité', desc: "Entrepôt surveillé 24h/24 et 7j/7. Accès contrôlé par code, système d'alarme." },
      { title: 'Localisation', desc: 'Nos entrepôts sont situés dans la région de Liège, facilement accessibles.' },
    ],
  },
  pricing: {
    sectionTitle: 'Boxes individuels securises',
    subtitle: 'Duree : 1 mois minimum',
    tiers: [
      { volume: '1 m\u00B3', price: '30', unit: 'par mois' },
      { volume: '2 m\u00B3', price: '40', unit: 'par mois' },
      { volume: '8 m\u00B3', price: '76', unit: 'par mois' },
      { volume: '12 m\u00B3', price: '95', unit: 'par mois' },
      { volume: '15 m\u00B3', price: '105', unit: 'par mois' },
      { volume: '20 m\u00B3', price: '130', unit: 'par mois' },
      { volume: '24 m\u00B3', price: '150', unit: 'par mois' },
      { volume: '+30 m\u00B3', price: '6', unit: 'par mois par m\u00B3' },
    ],
    extraNote: 'Possibilite d\'amener vos meubles par vos propres moyens !',
    notes: [
      'L\'estimation du volume mentionnee dans le devis est indicative et non contractuelle. La facturation du garde-meuble sera basee sur le volume reel constate lors de l\'entree des biens dans nos halls de stockage.',
      'Nous garantissons une transparence totale et le client est libre d\'assister a la mise en garde-meuble de ses biens.',
      'Compris dans ces tarifs : la presence d\'un manutentionnaire en cas de besoin !',
      'Reservation sans engagement. Les prix sont garantis pendant 15 jours !',
    ],
    insurance: {
      title: 'Assurances & Assistance',
      items: [
        'Assurances (vol, incendie, degradation) - Forfait obligatoire inclus par m\u00B3',
        'Nos tarifs comprennent l\'assistance de notre magasinier pour les entrees et sorties du lundi au vendredi',
        'Nous consulter pour les week-ends et en dehors des heures d\'ouverture',
      ],
    },
  },
  cta: {
    title: "Besoin d'un espace de stockage ?",
    subtitle: 'Demandez votre devis gratuit et sans engagement. Reponse garantie sous 24h.',
    buttonText: 'Demander un devis gratuit',
    phone: '04 264 50 16',
  },
};

export default function GardeMeublesPage() {
  return (
    <ServicePageLayout
      slug="garde-meubles"
      ctaIcon={Warehouse}
      stepIcons={[Phone, ClipboardList, KeyRound, DoorOpen]}
      guaranteeIcons={[Lock, ShieldCheck, CalendarRange, Container]}
      defaults={defaults}
      defaultMeta={{
        title: 'Garde-Meubles à Liège | Déménagements Gramme',
        description: 'Garde-meubles sécurisé à Liège. Surveillance 24/7, durée flexible. Devis gratuit.',
        canonical: '/garde-meubles',
      }}
    />
  );
}
