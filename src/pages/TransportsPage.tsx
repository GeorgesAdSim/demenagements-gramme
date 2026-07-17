import { Phone, ClipboardList, Route, PackageCheck, Truck } from 'lucide-react';
import ServicePageLayout from '../components/ServicePageLayout';
import type { ServicePageContent } from '../lib/types';

const defaults: ServicePageContent = {
  hero: {
    badge: 'NOS SERVICES',
    title: 'Transports',
    subtitle: 'Solutions de transport flexibles pour tous vos besoins logistiques. National et international, du petit colis au chargement complet.',
    stats: [
      { value: 'Europe', label: 'Couverture internationale' },
      { value: '26T', label: 'Charge maximale' },
      { value: '100m\u00B3', label: 'Volume maximum' },
      { value: 'Liège', label: 'Base opérationnelle' },
    ],
  },
  prestations: {
    sectionTitle: 'Nos solutions de transport',
    items: [
      { title: 'National & International', desc: "Transport de marchandises partout en Belgique et vers toute l'Europe." },
      { title: '4m\u00B3 à 100m\u00B3', desc: 'Véhicules adaptés à chaque volume, du petit transport au chargement complet.' },
      { title: "Charge jusqu'à 26 tonnes", desc: 'Capacité de transport importante pour vos biens les plus lourds.' },
      { title: 'Élévateur intégré', desc: "Nos véhicules disposent d'un élévateur pour faciliter le chargement." },
      { title: 'Transport express', desc: 'Service rapide disponible pour les livraisons urgentes.' },
      { title: 'Transport spécialisé', desc: 'Machines, matériel industriel, objets fragiles ou volumineux.' },
    ],
  },
  steps: {
    sectionTitle: 'Comment ça marche',
    items: [
      { title: 'Demande de devis', desc: 'Décrivez-nous votre besoin : nature des marchandises, volume, destination.' },
      { title: 'Planification', desc: 'Nous organisons le transport optimal : véhicule adapté, itinéraire, timing.' },
      { title: 'Transport', desc: 'Chargement sécurisé, transport professionnel avec suivi.' },
      { title: 'Livraison', desc: 'Déchargement soigné à destination et vérification avec le client.' },
    ],
  },
  info: {
    sectionTitle: 'Bon à savoir',
    items: [
      { title: 'Tarifs', desc: 'Le prix dépend du volume, du poids, de la distance et du type de marchandises.' },
      { title: 'Destinations', desc: "Toute la Belgique et l'Europe." },
      { title: 'Véhicules', desc: "Flotte variée de 4m3 à 100m3. Tous équipés d'un élévateur intégré." },
      { title: 'Transport express', desc: 'Besoin urgent ? Notre service express est disponible.' },
    ],
  },
  cta: {
    title: 'Un transport à organiser ?',
    subtitle: 'Demandez votre devis gratuit et sans engagement. Réponse garantie sous 24h.',
    buttonText: 'Demander un devis gratuit',
    phone: '04 264 50 16',
  },
};

export default function TransportsPage() {
  return (
    <ServicePageLayout
      slug="transports"
      ctaIcon={Truck}
      stepIcons={[Phone, ClipboardList, Route, PackageCheck]}
      heroStats
      defaults={defaults}
      defaultMeta={{
        title: 'Transport de marchandises | Déménagements Gramme Liège',
        description: 'Transport national et international depuis Liège. Devis gratuit sous 24h.',
        canonical: '/transport',
      }}
    />
  );
}
