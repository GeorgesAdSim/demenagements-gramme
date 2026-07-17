import { Link } from 'react-router-dom';
import { Phone, ArrowRight } from 'lucide-react';

export default function MobileCTA() {
  return (
    <div className="fixed bottom-0 inset-x-0 h-[60px] z-50 flex md:hidden">
      <a
        href="tel:+3242645016"
        className="flex-1 flex items-center justify-center gap-2 bg-[#0C2094] text-white font-bold text-sm uppercase border-r border-white/20"
      >
        <Phone className="w-4 h-4" />
        Appeler
      </a>
      <Link
        to="/contact-devis"
        className="flex-1 flex items-center justify-center gap-2 bg-yellow text-navy font-bold text-sm uppercase"
      >
        Devis gratuit
        <ArrowRight className="w-4 h-4" />
      </Link>
    </div>
  );
}
