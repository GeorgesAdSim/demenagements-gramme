import { Phone, ClipboardList, Globe, PackageCheck, ShieldCheck, MapPin, Clock, Truck } from 'lucide-react';
import ServicePageLayout from '../components/ServicePageLayout';
import type { ServicePageContent } from '../lib/types';

const defaults: ServicePageContent = {
  hero: {
    badge: 'INTERNATIONAL',
    title: 'Déménagement International',
    subtitle: "Déménagez partout en Europe et au-delà avec une entreprise familiale de confiance. Depuis 1948, nous organisons des déménagements internationaux au départ de Liège vers la France, les Pays-Bas, l'Allemagne, la Suisse, l'Espagne, l'Italie et bien d'autres destinations.",
    guarantees: ['Assurance tous risques', 'Formalités douanières', 'Réseau européen', 'Devis gratuit'],
  },
  prestations: {
    sectionTitle: 'Nos prestations internationales',
    items: [
      { title: 'Europe complète', desc: "France, Pays-Bas, Allemagne, Luxembourg, Suisse, Espagne, Italie, Portugal et toute l'Union européenne." },
      { title: 'Formalités administratives', desc: "Nous gérons les documents douaniers, les autorisations de transit et toutes les démarches administratives pour vous." },
      { title: 'Emballage export', desc: "Emballage renforcé aux normes internationales : caisses bois, housses spéciales, protection anti-choc pour les longues distances." },
      { title: 'Groupage & exclusivité', desc: "Transport en exclusivité ou en groupage selon votre budget. Nous optimisons les coûts sans compromettre la qualité." },
      { title: 'Stockage temporaire', desc: "Besoin de stocker vos biens entre deux logements ? Notre garde-meubles sécurisé est à votre disposition." },
      { title: 'Véhicules longue distance', desc: "Flotte adaptée aux longs trajets : camions de 20 à 100m\u00B3 avec hayon élévateur et système de fixation renforcé." },
    ],
  },
  steps: {
    sectionTitle: 'Votre déménagement international en 4 étapes',
    items: [
      { title: 'Demande de devis', desc: "Contactez-nous avec les détails : pays de destination, volume estimé, date souhaitée." },
      { title: 'Visite & planification', desc: "Notre responsable évalue le volume sur place et planifie l'itinéraire, les formalités et la logistique." },
      { title: 'Chargement & transport', desc: "Emballage professionnel, chargement sécurisé et transport assuré jusqu'à destination." },
      { title: 'Livraison & installation', desc: "Déchargement, déballage et installation dans votre nouveau domicile à l'étranger." },
    ],
  },
  info: {
    sectionTitle: 'Informations pratiques',
    items: [
      { title: 'Destinations principales', desc: 'France (Paris, Lyon, Marseille, Lille), Pays-Bas (Amsterdam, Rotterdam), Allemagne (Cologne, Berlin, Munich), Suisse (Genève, Zurich), Espagne, Italie, Portugal.' },
      { title: 'Délais', desc: "Comptez 1 à 5 jours ouvrables pour les pays limitrophes, 5 à 10 jours pour le sud de l'Europe. Planning détaillé fourni avec votre devis." },
      { title: 'Assurance', desc: "Assurance de base incluse pour tout déménagement international. Option tous risques disponible pour une couverture maximale de vos biens." },
      { title: 'Tarification', desc: 'Le prix dépend du volume, de la distance, du pays de destination et des services complémentaires choisis. Devis détaillé et transparent.' },
    ],
  },
  cta: {
    title: 'Un déménagement international à planifier ?',
    subtitle: 'Demandez votre devis gratuit et sans engagement. Notre équipe vous accompagne dans toutes les démarches.',
    buttonText: 'Demander un devis gratuit',
    phone: '04 264 50 16',
  },
};

export default function DemenagementInternationalPage() {
  return (
    <ServicePageLayout
      slug="demenagement-international"
      ctaIcon={Globe}
      stepIcons={[Phone, ClipboardList, Truck, PackageCheck]}
      guaranteeIcons={[ShieldCheck, Globe, MapPin, Clock]}
      defaults={defaults}
      defaultMeta={{
        title: 'Déménagement International — Déménagements Gramme Liège',
        description: "Déménagement international depuis Liège vers toute l'Europe. Entreprise familiale depuis 1948. Devis gratuit sous 24h.",
        canonical: '/demenagement-international',
      }}
    />
  );
}
