import { Phone, ClipboardList, Truck, PackageCheck, ShieldCheck, Users, Clock, MapPin } from 'lucide-react';
import ServicePageLayout from '../components/ServicePageLayout';
import type { ServicePageContent } from '../lib/types';

const defaults: ServicePageContent = {
  hero: {
    badge: 'NOS SERVICES',
    title: 'Déménagements',
    subtitle: "Des déménagements professionnels pour particuliers et entreprises. Une équipe qualifiée, un matériel adapté et plus de 75 ans d'expérience à votre service.",
    guarantees: ['Assurance incluse', 'Équipe qualifiée et expérimentée', 'Ponctualité garantie', 'Liège, Belgique & Europe'],
  },
  prestations: {
    sectionTitle: 'Ce que nous proposons',
    items: [
      { title: 'Particuliers & Entreprises', desc: 'Déménagements résidentiels et professionnels, adaptés à chaque besoin.' },
      { title: 'Service lift / monte-meuble', desc: "Accès aux étages élevés ou difficiles d'accès grâce à notre élévateur intégré." },
      { title: 'Déménagement de pianos', desc: 'Manutention spécialisée pour instruments lourds et fragiles.' },
      { title: 'Déménagement de coffres-forts', desc: 'Transport et manutention spécialisée de coffres-forts.' },
      { title: 'Démontage & remontage', desc: 'Vos meubles démontés, transportés et remontés avec soin sur place.' },
      { title: 'Emballage professionnel', desc: 'Protection complète de vos biens : cartons, papier bulle, couvertures de protection.' },
      { title: 'Rues piétonnes & difficiles', desc: 'Équipe spécialisée pour les accès compliqués.' },
    ],
  },
  steps: {
    sectionTitle: 'Comment ça marche',
    items: [
      { title: 'Contact & devis', desc: 'Appelez-nous ou remplissez le formulaire. Nous vous recontactons sous 24h.' },
      { title: 'Visite technique', desc: 'Notre responsable vient évaluer le volume et vos besoins.' },
      { title: 'Jour J : déménagement', desc: "L'équipe arrive à l'heure, protège et charge vos biens avec soin." },
      { title: 'Installation', desc: 'Déchargement, remontage des meubles et vérification finale.' },
    ],
  },
  info: {
    sectionTitle: 'Bon à savoir',
    items: [
      { title: 'Tarifs', desc: 'Chaque déménagement est unique. Devis gratuit et sans engagement sous 24h.' },
      { title: 'Zones desservies', desc: 'Toute la Belgique et déménagements internationaux.' },
      { title: 'Assurance', desc: "Assurance de base incluse. Option tous risques disponible." },
      { title: 'Capacité', desc: 'Véhicules de 4m³ à 100m³ avec élévateurs intégrés.' },
    ],
  },
  cta: {
    title: 'Prêt à déménager ?',
    subtitle: 'Demandez votre devis gratuit et sans engagement. Réponse garantie sous 24h.',
    buttonText: 'Demander un devis gratuit',
    phone: '04 264 50 16',
  },
};

export default function DemenagementsPage() {
  return (
    <ServicePageLayout
      slug="demenagements"
      ctaIcon={Truck}
      stepIcons={[Phone, ClipboardList, Truck, PackageCheck]}
      guaranteeIcons={[ShieldCheck, Users, Clock, MapPin]}
      defaults={defaults}
      defaultMeta={{
        title: 'Déménagements à Liège | Déménagements Gramme',
        description: 'Déménagements professionnels à Liège. Devis gratuit sous 24h.',
        canonical: '/demenagement',
      }}
    />
  );
}
