import { Phone, ClipboardList, Truck, PackageCheck, ShieldCheck, Building2, Ruler, ArrowUpFromLine } from 'lucide-react';
import ServicePageLayout from '../components/ServicePageLayout';
import type { ServicePageContent } from '../lib/types';

const defaults: ServicePageContent = {
  hero: {
    badge: 'MONTE-MEUBLES',
    title: 'Location de Monte-Meubles',
    subtitle: "Accédez aux étages élevés et aux endroits difficiles d'accès grâce à notre service de monte-meubles professionnel. Idéal pour les rues étroites, les escaliers impossibles ou les fenêtres en hauteur.",
    guarantees: ['Jusqu\'à 30 mètres', 'Opérateur qualifié', 'Assurance incluse', 'Liège et environs'],
  },
  prestations: {
    sectionTitle: 'Nos solutions monte-meubles',
    items: [
      { title: 'Élévateur extérieur', desc: "Monte-meubles professionnel pouvant atteindre les étages élevés via les fenêtres ou balcons, même dans les rues les plus étroites." },
      { title: 'Déménagement en hauteur', desc: "Montée et descente de meubles volumineux (canapés, armoires, matelas) impossibles à passer dans les escaliers." },
      { title: 'Livraison de meubles neufs', desc: "Vous avez acheté un meuble trop grand pour l'escalier ? Notre monte-meubles le fait passer par la fenêtre." },
      { title: 'Accès difficiles', desc: "Rues piétonnes, immeubles sans ascenseur, escaliers en colimaçon : notre élévateur s'adapte à toutes les situations." },
      { title: 'Opérateur inclus', desc: "Un opérateur qualifié installe et manoeuvre le monte-meubles en toute sécurité. Vous n'avez rien à faire." },
      { title: 'Location seule ou avec équipe', desc: "Monte-meubles seul ou accompagné de notre équipe de déménageurs pour un service complet clé en main." },
    ],
  },
  steps: {
    sectionTitle: 'Comment réserver un monte-meubles',
    items: [
      { title: 'Contactez-nous', desc: "Décrivez votre situation : adresse, étage, type d'objets à monter ou descendre." },
      { title: 'Évaluation technique', desc: "Nous vérifions la faisabilité : largeur de rue, hauteur, obstacles éventuels." },
      { title: 'Intervention', desc: "Notre opérateur arrive avec le monte-meubles, l'installe et effectue les manoeuvres." },
      { title: 'Mission accomplie', desc: "Vos meubles sont en place. Démontage de l'équipement et nettoyage." },
    ],
  },
  info: {
    sectionTitle: 'Informations pratiques',
    items: [
      { title: 'Capacité', desc: "Notre monte-meubles peut atteindre jusqu'à 30 mètres de hauteur et supporter des charges de plusieurs centaines de kilos." },
      { title: 'Zone d\'intervention', desc: 'Liège, Herstal, Seraing, Ans, Grâce-Hollogne, Visé et toute la province de Liège. Déplacement possible en Belgique.' },
      { title: 'Tarifs', desc: "Le prix dépend de la durée d'utilisation, de la hauteur et du nombre d'objets. Devis gratuit et sans engagement." },
      { title: 'Autorisations', desc: "Si nécessaire, nous nous occupons des demandes d'autorisation de stationnement auprès de la commune." },
    ],
  },
  cta: {
    title: 'Besoin d\'un monte-meubles ?',
    subtitle: "Demandez votre devis gratuit. Nous intervenons rapidement à Liège et dans toute la province.",
    buttonText: 'Demander un devis gratuit',
    phone: '04 264 50 16',
  },
};

export default function MonteMeublesPage() {
  return (
    <ServicePageLayout
      slug="monte-meubles"
      ctaIcon={ArrowUpFromLine}
      stepIcons={[Phone, ClipboardList, Truck, PackageCheck]}
      guaranteeIcons={[Ruler, Building2, ShieldCheck, ArrowUpFromLine]}
      defaults={defaults}
      defaultMeta={{
        title: 'Monte-Meubles à Liège — Déménagements Gramme',
        description: "Location de monte-meubles à Liège avec opérateur. Accès étages élevés et rues étroites. Devis gratuit sous 24h.",
        canonical: '/monte-meubles',
      }}
    />
  );
}
