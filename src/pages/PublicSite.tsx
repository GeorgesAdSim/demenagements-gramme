import { useNavigate } from 'react-router-dom';
import { Settings } from 'lucide-react';
import TopBar from '../components/TopBar';
import Navbar from '../components/Navbar';
import HeroSection from '../components/HeroSection';
import StatsStrip from '../components/StatsStrip';
import ServicesCards from '../components/ServicesCards';
import WhyUs from '../components/WhyUs';
import ServiceArea from '../components/ServiceArea';
import LiegeSection from '../components/LiegeSection';
import PricingSection from '../components/PricingSection';
import GoogleReviews from '../components/GoogleReviews';
import FAQAccordion from '../components/FAQAccordion';
import ContactForm from '../components/ContactForm';
import Footer from '../components/Footer';
import MobileCTA from '../components/MobileCTA';
import SeoHead from '../components/SeoHead';
import SchemaOrg from '../components/SchemaOrg';
import { useSitePageContent } from '../lib/useSitePageContent';
import type { HomepageContent } from '../lib/types';

export default function PublicSite() {
  const navigate = useNavigate();
  const { content, meta } = useSitePageContent<HomepageContent>('accueil');

  return (
    <div className="font-sans">
      <SeoHead
        title={meta?.metaTitle || `Déménagement à Liège : devis gratuit 24h | Gramme 1948`}
        description={
          meta?.metaDescription ||
          "Déménagement à Liège depuis 1948 : particuliers et entreprises, tous les quartiers, garde-meubles dès 30 €/mois. Devis gratuit sous 24h, sans engagement."
        }
        canonical={meta?.canonicalUrl || '/'}
      />
      <SchemaOrg includeFaq />
      <TopBar />
      <Navbar />
      <main id="main-content" className="pb-[60px] md:pb-0">
        <HeroSection data={content?.hero} />
        <StatsStrip data={content?.stats} />
        <ServicesCards data={content?.services} />
        <WhyUs data={content?.whyus} />
        <ServiceArea data={content?.service_area} />
        {/* Contenu local : le déficit principal face au premier résultat sur
            « déménagement Liège » était le volume de contenu (556 mots contre
            1800-2000) et l'absence de toute commune citée. */}
        <LiegeSection />
        <PricingSection />
        {/* Les 11 avis existaient déjà dans le code sans être affichés nulle part. */}
        <GoogleReviews />
        <FAQAccordion data={content?.faq} />
        <ContactForm data={content?.contact} />
      </main>
      <MobileCTA />
      <Footer />

      <button
        onClick={() => navigate('/admin/login')}
        className="fixed bottom-5 right-5 z-50 w-9 h-9 rounded-full bg-gray-200/50 hover:bg-navy text-gray-300 hover:text-white flex items-center justify-center transition-all duration-300 hover:shadow-lg"
        aria-label="Administration"
        title="Espace administration"
      >
        <Settings className="w-4 h-4" />
      </button>
    </div>
  );
}
