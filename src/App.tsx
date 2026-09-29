import React, { useState, useEffect } from 'react';
import { Navbar } from './components/Navbar';
import { Hero } from './components/Hero';
import { DateAvailabilityChecker } from './components/DateAvailabilityChecker';
import { PortfolioGallery } from './components/PortfolioGallery';
import { VideoReels } from './components/VideoReels';
import { ServicesSection } from './components/ServicesSection';
import { PackagesSection } from './components/PackagesSection';
import { TrustSection } from './components/TrustSection';
import { Testimonials } from './components/Testimonials';
import { AboutArtist } from './components/AboutArtist';
import { FAQSection } from './components/FAQSection';
import { Footer } from './components/Footer';
import { StickyMobileBar } from './components/StickyMobileBar';
import { BookingModal } from './components/BookingModal';
import { AdminDashboard } from './components/AdminDashboard';
import { getAttribution } from './utils/attribution';
import { trackEvent } from './utils/analytics';
import { ServiceItem, PackageItem } from './types';

export function App() {
  const [isAdminOpen, setIsAdminOpen] = useState(false);
  const [isBookingOpen, setIsBookingOpen] = useState(false);
  const [selectedServiceId, setSelectedServiceId] = useState<string | undefined>(undefined);
  const [selectedWeddingDate, setSelectedWeddingDate] = useState<string | undefined>(undefined);
  const [attribution, setAttribution] = useState(getAttribution());

  useEffect(() => {
    const attr = getAttribution();
    setAttribution(attr);
    // Track initial page view with attribution
    trackEvent('page_view', {
      landing_page: window.location.pathname,
      source: attr.source_platform,
      campaign: attr.utm_campaign,
    });
  }, []);

  const handleOpenBooking = (serviceId?: string, dateStr?: string) => {
    if (serviceId) setSelectedServiceId(serviceId);
    if (dateStr) setSelectedWeddingDate(dateStr);
    setIsBookingOpen(true);
  };

  const handleDateSelectedFromChecker = (dateStr: string) => {
    setSelectedWeddingDate(dateStr);
    setIsBookingOpen(true);
  };

  const handleSelectService = (srv: ServiceItem) => {
    setSelectedServiceId(srv.id);
    setIsBookingOpen(true);
  };

  const handleSelectPackage = (pkg: PackageItem) => {
    setSelectedServiceId('srv-bridal-hd'); // defaults to signature bridal
    setIsBookingOpen(true);
  };

  const handleScrollToAvailability = () => {
    const el = document.getElementById('availability');
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
    } else {
      setIsBookingOpen(true);
    }
  };

  const handleScrollToPortfolio = () => {
    const el = document.getElementById('portfolio');
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
    }
  };

  // If in Admin Dashboard mode
  if (isAdminOpen) {
    return <AdminDashboard onClose={() => setIsAdminOpen(false)} />;
  }

  return (
    <div className="min-h-screen bg-[#FAF8F5] text-[#1C1A18] flex flex-col font-sans selection:bg-[#E8DCC4] selection:text-[#1F1C18]">
      
      {/* Top Bar Contract (Wordmark, Clean Text Links, Action CTA) */}
      <Navbar
        onOpenBooking={() => handleOpenBooking()}
        onOpenAdmin={() => setIsAdminOpen(true)}
        isAdminActive={isAdminOpen}
      />

      <main className="flex-1">
        
        {/* 1. Hero Section with Ad continuity & Value Proposition */}
        <Hero
          onCheckDateClick={handleScrollToAvailability}
          onExploreWorkClick={handleScrollToPortfolio}
          attribution={attribution}
        />

        {/* 2. Interactive "Check My Wedding Date" Checker */}
        <DateAvailabilityChecker
          onDateSelectedForBooking={handleDateSelectedFromChecker}
        />

        {/* 3. Featured Bridal Portfolio & Fullscreen Lightbox */}
        <PortfolioGallery
          onBookLook={(lookTitle) => handleOpenBooking('srv-bridal-hd')}
        />

        {/* 4. "Real Brides. Real Transformations." 9:16 Video Reels */}
        <VideoReels />

        {/* 5. Trust Section & Quantitative Metrics (Anti-slop) */}
        <TrustSection />

        {/* 6. Custom Artistry Services */}
        <ServicesSection onSelectService={handleSelectService} />

        {/* 7. Signature Bridal Packages */}
        <PackagesSection onSelectPackage={handleSelectPackage} />

        {/* 8. Verified Bride Testimonials & Venue References */}
        <Testimonials />

        {/* 9. About Sanjana Roy & Lead Artist Philosophy */}
        <AboutArtist onCheckDateClick={handleScrollToAvailability} />

        {/* 10. Objection Handling FAQ & Direct WhatsApp Consultation Help */}
        <FAQSection />

      </main>

      {/* 11. Final High-Conversion CTA & Editorial Footer */}
      <Footer
        onCheckDateClick={handleScrollToAvailability}
        onOpenAdmin={() => setIsAdminOpen(true)}
      />

      {/* 12. Mobile Sticky Bottom Action Bar (WhatsApp + Check Availability) */}
      <StickyMobileBar
        onCheckAvailability={handleScrollToAvailability}
        isBookingOpen={isBookingOpen}
      />

      {/* 13. 5-Step Calendly-Style Mobile Booking Flow Modal */}
      <BookingModal
        isOpen={isBookingOpen}
        onClose={() => setIsBookingOpen(false)}
        initialServiceId={selectedServiceId}
        initialWeddingDate={selectedWeddingDate}
      />

    </div>
  );
}

export default App;
