import { useState, useRef, useEffect } from 'react';
import { ChevronDown } from 'lucide-react';
import type { FAQ as FAQType } from '../lib/supabase';

interface FAQProps {
  faqs: FAQType[];
}

export function FAQ({ faqs }: FAQProps) {
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  return (
    <div className="space-y-4">
      {faqs.map((faq, index) => (
        <FAQItem
          key={faq.id}
          faq={faq}
          isOpen={openIndex === index}
          onToggle={() => setOpenIndex(openIndex === index ? null : index)}
        />
      ))}
    </div>
  );
}

interface FAQItemProps {
  faq: FAQType;
  isOpen: boolean;
  onToggle: () => void;
}

function FAQItem({ faq, isOpen, onToggle }: FAQItemProps) {
  const contentRef = useRef<HTMLDivElement>(null);
  const [height, setHeight] = useState(0);

  useEffect(() => {
    if (contentRef.current) {
      setHeight(isOpen ? contentRef.current.scrollHeight : 0);
    }
  }, [isOpen]);

  return (
    <div className="border-2 border-gray-200 rounded-xl overflow-hidden transition-all duration-300 hover:border-gramme-blue/30 hover:shadow-md">
      <button
        onClick={onToggle}
        className="w-full px-6 py-5 flex items-center justify-between bg-white hover:bg-gray-50 transition-colors group"
        aria-expanded={isOpen}
      >
        <span className="text-left font-semibold text-gramme-dark-blue group-hover:text-gramme-blue transition-colors pr-4">
          {faq.question}
        </span>
        <ChevronDown
          className={`w-6 h-6 text-gramme-blue flex-shrink-0 transition-transform duration-300 ${
            isOpen ? 'rotate-180' : ''
          }`}
        />
      </button>

      <div
        style={{ height: `${height}px` }}
        className="transition-all duration-300 ease-in-out overflow-hidden"
      >
        <div ref={contentRef} className="px-6 py-5 bg-gramme-gray/30">
          <p className="text-gray-700 leading-relaxed">{faq.answer}</p>
        </div>
      </div>
    </div>
  );
}
