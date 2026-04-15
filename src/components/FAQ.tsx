import { useState } from 'react';
import { ChevronDown, ChevronUp } from 'lucide-react';
import type { FAQ as FAQType } from '../lib/supabase';

interface FAQProps {
  faqs: FAQType[];
}

export function FAQ({ faqs }: FAQProps) {
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  return (
    <div className="space-y-4">
      {faqs.map((faq, index) => (
        <div key={faq.id} className="border border-gray-200 rounded-lg overflow-hidden">
          <button
            onClick={() => setOpenIndex(openIndex === index ? null : index)}
            className="w-full px-6 py-4 flex items-center justify-between bg-white hover:bg-gray-50 transition-colors"
          >
            <span className="text-left font-semibold text-gramme-dark-blue">{faq.question}</span>
            {openIndex === index ? (
              <ChevronUp className="w-5 h-5 text-gramme-blue flex-shrink-0" />
            ) : (
              <ChevronDown className="w-5 h-5 text-gramme-blue flex-shrink-0" />
            )}
          </button>
          {openIndex === index && (
            <div className="px-6 py-4 bg-gramme-gray">
              <p className="text-gray-700">{faq.answer}</p>
            </div>
          )}
        </div>
      ))}
    </div>
  );
}
