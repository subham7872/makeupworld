import React from 'react';
import { Calendar, MessageSquare, Phone, MapPin, Instagram, Shield, Sparkles } from 'lucide-react';
import { trackEvent } from '../utils/analytics';
import { buildWhatsAppLink } from '../utils/attribution';

interface FooterProps {
  onCheckDateClick: () => void;
  onOpenAdmin: () => void;
}

export const Footer: React.FC<FooterProps> = ({ onCheckDateClick, onOpenAdmin }) => {
  const handleWhatsApp = () => {
    trackEvent('whatsapp_clicked', { source: 'final_footer_cta' });
    const link = buildWhatsAppLink('+18002872687', 'Hi Sanjana, I would love to check availability for my wedding!');
    window.open(link, '_blank');
  };

  const handleCall = () => {
    trackEvent('phone_clicked', { source: 'footer' });
  };

  return (
    <footer className="bg-[#1C1A18] text-[#FAF8F5] relative overflow-hidden">
      
      {/* FINAL HIGH-CONVERSION CTA SECTION */}
      <div className="py-16 md:py-24 border-b border-white/10 relative">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(184,150,104,0.12),transparent_70%)] pointer-events-none" />

        <div className="max-w-4xl mx-auto px-4 sm:px-6 text-center space-y-6 relative z-10">
          <div className="inline-flex items-center gap-1.5 text-xs uppercase tracking-[0.25em] text-[#C5A880] font-semibold">
            <Sparkles className="w-3.5 h-3.5 text-[#C5A880]" />
            <span>Exclusively One Bride Per Date</span>
          </div>

          <h2 className="font-serif text-3xl sm:text-4xl md:text-5xl font-normal leading-tight text-white">
            Let's Create Your Bridal Look.
          </h2>

          <p className="text-sm sm:text-base text-white/70 max-w-lg mx-auto font-light leading-relaxed">
            Check your wedding date now and start your personalized bridal consultation with Sanjana Roy.
          </p>

          <div className="pt-4 flex flex-col sm:flex-row items-center justify-center gap-3 max-w-md mx-auto">
            <button
              type="button"
              onClick={() => {
                trackEvent('availability_started', { source: 'final_cta' });
                onCheckDateClick();
              }}
              className="w-full sm:w-auto min-h-[48px] px-8 py-3.5 bg-[#C5A880] hover:bg-[#B39366] text-[#141210] font-semibold text-xs uppercase tracking-wider transition-all shadow-md flex items-center justify-center gap-2 cursor-pointer"
            >
              <Calendar className="w-4 h-4 text-[#141210]" />
              <span>Check My Wedding Date</span>
            </button>

            <button
              type="button"
              onClick={handleWhatsApp}
              className="w-full sm:w-auto min-h-[48px] px-6 py-3.5 bg-white/10 hover:bg-white/20 text-white border border-white/20 font-medium text-xs uppercase tracking-wider transition-all flex items-center justify-center gap-2 cursor-pointer"
            >
              <MessageSquare className="w-4 h-4 fill-white" />
              <span>WhatsApp Us</span>
            </button>
          </div>

          <p className="text-[11px] text-white/50 pt-2">
            No obligation. We reply within 2 hours during atelier hours.
          </p>
        </div>
      </div>

      {/* FOOTER DIRECTORY & ACCESSIBILITY */}
      <div className="py-12 max-w-6xl mx-auto px-4 sm:px-6">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 text-xs text-white/70">
          
          {/* Brand & Summary */}
          <div className="space-y-3 md:col-span-1">
            <h3 className="font-serif text-xl text-white font-medium">
              Aura Bridal Atelier
            </h3>
            <p className="text-white/60 leading-relaxed text-[11px]">
              High-definition airbrush bridal makeup, architectural hairstyling, and ceremonial draping for California and global destinations.
            </p>
            <div className="flex items-center gap-3 pt-1">
              <a
                href="https://instagram.com"
                target="_blank"
                rel="noopener noreferrer"
                className="w-8 h-8 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center text-white transition-colors"
                aria-label="Instagram"
              >
                <Instagram className="w-4 h-4" />
              </a>
              <a
                href="tel:+18002872687"
                onClick={handleCall}
                className="w-8 h-8 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center text-white transition-colors"
                aria-label="Phone"
              >
                <Phone className="w-4 h-4" />
              </a>
            </div>
          </div>

          {/* Location & Studio */}
          <div className="space-y-2">
            <h4 className="text-xs uppercase tracking-wider text-white font-semibold">
              Atelier Studio
            </h4>
            <p className="text-white/60 flex items-start gap-1.5 leading-relaxed text-[11px]">
              <MapPin className="w-3.5 h-3.5 text-[#C5A880] shrink-0 mt-0.5" />
              <span>142 Grand Heritage Arcade, Suite 4B, San Francisco Bay Area</span>
            </p>
            <p className="text-[11px] text-white/60">
              On-Location Travel: Napa, Sonoma, Carmel, Southern CA & Worldwide.
            </p>
          </div>

          {/* Hours & Contact */}
          <div className="space-y-2">
            <h4 className="text-xs uppercase tracking-wider text-white font-semibold">
              Atelier Hours
            </h4>
            <div className="text-[11px] text-white/60 space-y-1">
              <p>Mon – Thu: 10:00 AM – 6:30 PM</p>
              <p>Fri – Sat: 09:00 AM – 7:30 PM</p>
              <p>Sun: 10:00 AM – 5:00 PM</p>
              <p className="text-[#C5A880] pt-1">Phone: +1 (800) 287-2687</p>
            </div>
          </div>

          {/* Admin & Security */}
          <div className="space-y-3">
            <h4 className="text-xs uppercase tracking-wider text-white font-semibold">
              Artist Portal
            </h4>
            <p className="text-white/60 text-[11px] leading-relaxed">
              Manage leads, block unavailable dates, review booking calendar, and configure WhatsApp automations.
            </p>
            <button
              type="button"
              onClick={onOpenAdmin}
              className="px-3 py-2 bg-white/10 hover:bg-white/20 text-[#E6DCB8] text-xs font-medium border border-white/20 flex items-center gap-1.5 transition-colors cursor-pointer"
            >
              <Shield className="w-3.5 h-3.5" />
              <span>Open Artist CRM Dashboard</span>
            </button>
          </div>

        </div>

        {/* Hairline Divider & Copyright */}
        <div className="mt-12 pt-6 border-t border-white/10 flex flex-col sm:flex-row items-center justify-between text-[11px] text-white/40 gap-3">
          <div>
            © {new Date().getFullYear()} Aura Bridal Atelier by Sanjana Roy. All rights reserved.
          </div>
          <div className="flex items-center gap-4">
            <span className="hover:text-white/70 cursor-pointer">Privacy Policy</span>
            <span className="hover:text-white/70 cursor-pointer">Bridal Service Agreement</span>
            <span className="hover:text-white/70 cursor-pointer">Cookie Settings</span>
          </div>
        </div>
      </div>

    </footer>
  );
};
