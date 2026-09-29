import React, { useState } from 'react';
import { ChevronDown, HelpCircle, MessageSquare } from 'lucide-react';
import { trackEvent } from '../utils/analytics';
import { buildWhatsAppLink } from '../utils/attribution';

const FAQS = [
  {
    q: 'Do you travel to our wedding venue or hotel bridal suite?',
    a: 'Yes, absolutely. Over 90% of our brides are styled on-location. We arrive with our full professional mobile studio: daylight-balanced LED lighting, custom ergonomic director chairs, sanitization stations, and high-velocity hair tools. We service the greater Bay Area, Napa Valley, Carmel, and travel destination worldwide.',
  },
  {
    q: 'Do you offer bridal makeup & hair trials?',
    a: 'Yes! A comprehensive 90-minute trial is included in our Signature and Luxury packages, or available à la carte. During the trial, we analyze your skin, test multiple lash styles, drape a sample veil/dupatta, and capture photos in both daylight and camera flash to ensure complete peace of mind before your wedding morning.',
  },
  {
    q: 'How early should I reserve my wedding date?',
    a: 'Because we operate under a strict single-bride policy per date, our weekend dates during peak bridal season (April through November) routinely book 6 to 12 months in advance. We recommend checking your date as soon as your venue is finalized.',
  },
  {
    q: 'What is the difference between Traditional HD and Airbrush makeup?',
    a: 'Airbrush makeup utilizes compressed micro-fine silicone droplets that float over pores and fine lines rather than sinking into them. It provides superior 16+ hour water and sweat resistance while feeling virtually weightless. Traditional HD uses high-pigment creams blended with brushes. During our consultation, we recommend the optimal medium for your exact skin type.',
  },
  {
    q: 'Are hair styling, hair padding, and draping included?',
    a: 'Yes. Our bridal packages include complete architectural hair design, hair padding for structural volume, fresh floral or jewel pinning, and full ceremonial draping (sari pleating, heavy lehenga dupatta rigging, and veil pinning with zero scalp strain).',
  },
  {
    q: 'What happens immediately after I submit an enquiry or book a slot?',
    a: 'Once you select an available time on this website, you will receive an immediate WhatsApp confirmation and calendar invite. Sanjana will review your event date and reach out to discuss your moodboard and bridal timeline.',
  },
];

export const FAQSection: React.FC = () => {
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  const toggle = (idx: number) => {
    setOpenIndex(openIndex === idx ? null : idx);
  };

  const handleWhatsAppHelp = () => {
    trackEvent('whatsapp_clicked', { source: 'faq_help' });
    const link = buildWhatsAppLink('+18002872687', 'Hi Sanjana, I have a quick question about bridal bookings!');
    window.open(link, '_blank');
  };

  return (
    <section id="faq" className="py-16 md:py-24 bg-[#FAF8F5] border-t border-[#E8DFD5]">
      <div className="max-w-4xl mx-auto px-4 sm:px-6">
        
        {/* Header */}
        <div className="text-center space-y-3 mb-12">
          <span className="text-xs uppercase tracking-[0.25em] text-[#8C6D45] font-semibold block">
            Clarity & Peace of Mind
          </span>
          <h2 className="font-serif text-3xl sm:text-4xl text-[#1C1A18] font-normal">
            Frequently Asked Questions
          </h2>
          <p className="text-sm text-[#5A554E] max-w-lg mx-auto">
            Everything you need to know about reserving your wedding date with Aura Bridal Atelier.
          </p>
        </div>

        {/* Accordion */}
        <div className="space-y-3">
          {FAQS.map((faq, idx) => {
            const isOpen = openIndex === idx;
            return (
              <div
                key={idx}
                className="bg-white border border-[#DFD3C4] transition-colors overflow-hidden"
              >
                <button
                  type="button"
                  onClick={() => toggle(idx)}
                  className="w-full p-4 sm:p-5 text-left flex items-center justify-between gap-4 cursor-pointer"
                  aria-expanded={isOpen}
                >
                  <span className="font-serif text-base sm:text-lg text-[#1C1A18] font-medium leading-snug">
                    {faq.q}
                  </span>
                  <div
                    className={`p-1 text-[#8C6D45] transition-transform duration-200 shrink-0 ${
                      isOpen ? 'rotate-180' : ''
                    }`}
                  >
                    <ChevronDown className="w-5 h-5" />
                  </div>
                </button>

                {isOpen && (
                  <div className="px-4 pb-5 sm:px-5 text-xs sm:text-sm text-[#5A554E] leading-relaxed border-t border-[#F0EAE1] pt-3 animate-in fade-in duration-200">
                    <p>{faq.a}</p>
                  </div>
                )}
              </div>
            );
          })}
        </div>

        {/* WhatsApp Help Banner */}
        <div className="mt-10 p-6 bg-[#F5EFEB] border border-[#DFD3C4] text-center space-y-3">
          <h4 className="font-serif text-xl text-[#1C1A18]">
            Have a custom timeline or destination question?
          </h4>
          <p className="text-xs text-[#5A554E] max-w-md mx-auto">
            We are always happy to answer specific queries regarding bridal parties, timing, or travel logistics directly on WhatsApp.
          </p>
          <button
            type="button"
            onClick={handleWhatsAppHelp}
            className="inline-flex items-center gap-2 px-5 py-2.5 bg-[#25D366] hover:bg-[#20BD5A] text-white font-semibold text-xs uppercase tracking-wider transition-all shadow-sm cursor-pointer"
          >
            <MessageSquare className="w-4 h-4 fill-white" />
            <span>Chat Directly on WhatsApp</span>
          </button>
        </div>

      </div>
    </section>
  );
};
