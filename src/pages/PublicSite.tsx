import { useNavigate } from 'react-router-dom';
import { Settings } from 'lucide-react';
import TopBar from '../components/TopBar';
import Navbar from '../components/Navbar';
import HeroSection from '../components/HeroSection';
import StatsStrip from '../components/StatsStrip';
import ServicesCards from '../components/ServicesCards';
import WhyUs from '../components/WhyUs';
import ServiceArea from '../components/ServiceArea';
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
        title={meta?.metaTitle || 'Déménagements Gramme — Votre déménageur à Liège depuis 1948'}
        description={meta?.metaDescription || 'Déménagements Gramme : déménageur professionnel à Liège depuis 1948. Devis gratuit sous 24h.'}
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
