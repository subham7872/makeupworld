import React from 'react';
import { MessageSquare, Calendar } from 'lucide-react';
import { trackEvent } from '../utils/analytics';
import { buildWhatsAppLink, getAttribution } from '../utils/attribution';

interface StickyMobileBarProps {
  onCheckAvailability: () => void;
  isBookingOpen: boolean;
}

export const StickyMobileBar: React.FC<StickyMobileBarProps> = ({
  onCheckAvailability,
  isBookingOpen,
}) => {
  // If modal is open, don't show the floating bar to avoid visual clutter
  if (isBookingOpen) return null;

  const handleWhatsApp = () => {
    trackEvent('whatsapp_clicked', { source: 'sticky_bar' });
    const attribution = getAttribution();
    const link = buildWhatsAppLink(
      '+18002872687',
      'Hi Sanjana, I found you on Instagram and would like to enquire about bridal makeup availability for my wedding!',
      attribution
    );
    window.open(link, '_blank');
  };

  const handleAvailability = () => {
    trackEvent('availability_started', { trigger: 'sticky_bottom_bar' });
    onCheckAvailability();
  };

  return (
    <div className="md:hidden fixed bottom-0 left-0 right-0 z-40 bg-[#FAF8F5]/95 backdrop-blur-md border-t border-[#E2D5C5] px-3 py-2.5 pb-safe shadow-[0_-4px_16px_rgba(0,0,0,0.06)] animate-in slide-in-from-bottom duration-200">
      <div className="max-w-md mx-auto grid grid-cols-2 gap-2.5">
        
        {/* WhatsApp Button */}
        <button
          type="button"
          onClick={handleWhatsApp}
          className="h-12 px-3 bg-white hover:bg-[#F2ECE3] active:scale-[0.98] text-[#1B5E20] border border-[#A5D6A7] text-xs font-semibold uppercase tracking-wider transition-all flex items-center justify-center gap-1.5 shadow-sm cursor-pointer whitespace-nowrap"
          aria-label="Chat on WhatsApp"
        >
          <MessageSquare className="w-4 h-4 fill-[#2E7D32] text-[#2E7D32]" />
          <span>WhatsApp</span>
        </button>

        {/* Check Availability CTA */}
        <button
          type="button"
          onClick={handleAvailability}
          className="h-12 px-3 bg-[#1C1A18] hover:bg-[#332F2A] active:scale-[0.98] text-white text-xs font-semibold uppercase tracking-wider transition-all flex items-center justify-center gap-1.5 shadow-md cursor-pointer whitespace-nowrap"
          aria-label="Check wedding date availability"
        >
          <Calendar className="w-4 h-4 text-[#E6DCB8]" />
          <span>Check Date</span>
        </button>

      </div>
    </div>
  );
};
