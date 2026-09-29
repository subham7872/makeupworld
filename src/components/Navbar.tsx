import React, { useState } from 'react';
import { Sparkles, Calendar, Menu, X, Shield, Phone } from 'lucide-react';
import { trackEvent } from '../utils/analytics';

interface NavbarProps {
  onOpenBooking: (serviceId?: string) => void;
  onOpenAdmin: () => void;
  isAdminActive: boolean;
}

export const Navbar: React.FC<NavbarProps> = ({
  onOpenBooking,
  onOpenAdmin,
  isAdminActive,
}) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const handleNavClick = (href: string) => {
    setMobileMenuOpen(false);
    const element = document.querySelector(href);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const handleBookClick = () => {
    setMobileMenuOpen(false);
    trackEvent('availability_started', { trigger: 'navbar_cta' });
    onOpenBooking();
  };

  return (
    <header className="sticky top-0 z-40 bg-[#FAF8F5]/90 backdrop-blur-md border-b border-[#E8DFD5] transition-all">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 h-14 md:h-16 flex items-center justify-between">
        {/* Zone 1: Single text element brand wordmark */}
        <a
          href="/"
          className="text-lg md:text-xl font-serif tracking-wide text-[#1C1A18] font-semibold hover:opacity-90 transition-opacity flex items-center gap-1.5"
        >
          <span>Aura Bridal Atelier</span>
        </a>

        {/* Zone 2: 4-6 clean text navigation links (desktop) */}
        <nav className="hidden md:flex items-center gap-7 text-xs tracking-wider uppercase font-medium text-[#615C56]">
          <button
            onClick={() => handleNavClick('#portfolio')}
            className="hover:text-[#1C1A18] transition-colors cursor-pointer"
          >
            Portfolio
          </button>
          <button
            onClick={() => handleNavClick('#reels')}
            className="hover:text-[#1C1A18] transition-colors cursor-pointer"
          >
            Real Brides
          </button>
          <button
            onClick={() => handleNavClick('#services')}
            className="hover:text-[#1C1A18] transition-colors cursor-pointer"
          >
            Services
          </button>
          <button
            onClick={() => handleNavClick('#packages')}
            className="hover:text-[#1C1A18] transition-colors cursor-pointer"
          >
            Packages
          </button>
          <button
            onClick={() => handleNavClick('#testimonials')}
            className="hover:text-[#1C1A18] transition-colors cursor-pointer"
          >
            Testimonials
          </button>
          <button
            onClick={() => handleNavClick('#faq')}
            className="hover:text-[#1C1A18] transition-colors cursor-pointer"
          >
            FAQ
          </button>
        </nav>

        {/* Zone 3: 1-2 primary actions */}
        <div className="flex items-center gap-2.5">
          <button
            onClick={onOpenAdmin}
            title={isAdminActive ? 'Switch to Bride View' : 'Artist CRM & Schedule Dashboard'}
            className={`px-2.5 py-1.5 rounded text-xs font-medium border flex items-center gap-1 transition-colors ${
              isAdminActive
                ? 'bg-[#1C1A18] text-[#FAF8F5] border-[#1C1A18]'
                : 'bg-transparent text-[#615C56] border-[#D8CEBF] hover:border-[#1C1A18] hover:text-[#1C1A18]'
            }`}
          >
            <Shield className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">{isAdminActive ? 'Atelier View' : 'Artist CRM'}</span>
          </button>

          <button
            onClick={handleBookClick}
            className="min-h-[38px] px-3.5 md:px-4 py-1.5 text-xs font-semibold uppercase tracking-wider text-white bg-[#1C1A18] hover:bg-[#332F2A] active:scale-[0.98] transition-all flex items-center gap-1.5 shadow-sm"
          >
            <Calendar className="w-3.5 h-3.5 text-[#E6DCB8]" />
            <span>Check Date</span>
          </button>

          {/* Mobile menu trigger */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="md:hidden p-2 text-[#1C1A18] min-w-[44px] min-h-[44px] flex items-center justify-center -mr-2"
            aria-label="Toggle navigation menu"
          >
            {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </div>

      {/* Mobile Navigation Drawer */}
      {mobileMenuOpen && (
        <div className="md:hidden bg-[#FAF8F5] border-b border-[#E8DFD5] px-6 py-5 shadow-lg animate-in fade-in slide-in-from-top-2 duration-200">
          <div className="flex flex-col space-y-4 text-sm font-medium tracking-wide uppercase text-[#47423C]">
            <button
              onClick={() => handleNavClick('#availability')}
              className="text-left py-2 hover:text-[#1C1A18] flex items-center justify-between"
            >
              <span>Check Wedding Date</span>
              <Sparkles className="w-4 h-4 text-[#B89668]" />
            </button>
            <button
              onClick={() => handleNavClick('#portfolio')}
              className="text-left py-2 hover:text-[#1C1A18]"
            >
              Bridal Portfolio
            </button>
            <button
              onClick={() => handleNavClick('#reels')}
              className="text-left py-2 hover:text-[#1C1A18]"
            >
              Transformation Reels
            </button>
            <button
              onClick={() => handleNavClick('#services')}
              className="text-left py-2 hover:text-[#1C1A18]"
            >
              Artistry Services
            </button>
            <button
              onClick={() => handleNavClick('#packages')}
              className="text-left py-2 hover:text-[#1C1A18]"
            >
              Bridal Packages
            </button>
            <button
              onClick={() => handleNavClick('#testimonials')}
              className="text-left py-2 hover:text-[#1C1A18]"
            >
              Real Bride Stories
            </button>
            <button
              onClick={() => handleNavClick('#faq')}
              className="text-left py-2 hover:text-[#1C1A18]"
            >
              FAQ & Policies
            </button>
            
            <div className="pt-3 border-t border-[#E8DFD5] flex items-center justify-between">
              <a
                href="tel:+18002872687"
                onClick={() => trackEvent('phone_clicked', { source: 'mobile_menu' })}
                className="text-xs text-[#615C56] flex items-center gap-1.5 py-1"
              >
                <Phone className="w-3.5 h-3.5" />
                <span>+1 (800) 287-2687</span>
              </a>
              <button
                onClick={() => {
                  setMobileMenuOpen(false);
                  onOpenAdmin();
                }}
                className="text-xs font-semibold text-[#8C6D45]"
              >
                Artist Portal
              </button>
            </div>
          </div>
        </div>
      )}
    </header>
  );
};
