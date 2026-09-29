import React from 'react';
import { MapPin, Navigation, Plane, Car, Clock, ShieldCheck } from 'lucide-react';
import { trackEvent } from '../utils/analytics';

export const LocationSection: React.FC = () => {
  const openDirections = () => {
    trackEvent('service_view', { action: 'open_maps_directions' });
    window.open('https://maps.google.com/?q=San+Francisco+Heritage+Arcade', '_blank');
  };

  return (
    <section className="py-16 md:py-24 bg-[#F5EFEB] border-t border-[#E8DFD5]">
      <div className="max-w-6xl mx-auto px-4 sm:px-6">
        
        {/* Header */}
        <div className="text-center space-y-3 mb-12 max-w-2xl mx-auto">
          <span className="text-xs uppercase tracking-[0.25em] text-[#8C6D45] font-semibold block">
            Atelier & Travel Radius
          </span>
          <h2 className="font-serif text-3xl sm:text-4xl md:text-5xl text-[#1C1A18] font-normal">
            Studio Sanctuary & On-Location Travel
          </h2>
          <p className="text-sm text-[#5A554E] leading-relaxed">
            Whether in our peaceful private studio or at your luxury hotel bridal suite anywhere in the world, we bring the full atelier experience to you.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-stretch">
          
          {/* Left: Studio Card (6 cols) */}
          <div className="lg:col-span-6 bg-white p-6 sm:p-8 border border-[#DFD3C4] shadow-sm flex flex-col justify-between space-y-6">
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-xs uppercase tracking-widest font-semibold text-[#8C6D45]">
                  Private Atelier Studio
                </span>
                <span className="text-[10px] bg-[#FAF5EE] text-[#1C1A18] px-2 py-0.5 border border-[#DFD3C4]">
                  By Appointment Only
                </span>
              </div>

              <h3 className="font-serif text-2xl text-[#1C1A18] font-medium">
                142 Grand Heritage Arcade, Suite 4B
              </h3>

              <p className="text-xs sm:text-sm text-[#5A554E] leading-relaxed">
                Our tranquil, light-filled studio is purpose-designed for comprehensive bridal trials, skin diagnostics, and bridal party consultations. Equipped with daylight-balanced CRI 98+ portrait illumination and ergonomic seating.
              </p>

              <div className="space-y-2 pt-2 border-t border-[#E8DFD5] text-xs text-[#4A453F]">
                <div className="flex items-center gap-2">
                  <Clock className="w-3.5 h-3.5 text-[#B89668]" />
                  <span>Monday – Saturday: 10:00 AM – 7:30 PM (Sunday by special request)</span>
                </div>
                <div className="flex items-center gap-2">
                  <Car className="w-3.5 h-3.5 text-[#B89668]" />
                  <span>Complimentary valet & private bridal entrance</span>
                </div>
              </div>
            </div>

            <button
              type="button"
              onClick={openDirections}
              className="w-full py-3 bg-[#FAF8F5] hover:bg-[#1C1A18] hover:text-white text-[#1C1A18] text-xs font-semibold uppercase tracking-wider border border-[#D8CEBF] transition-all flex items-center justify-center gap-2 cursor-pointer"
            >
              <Navigation className="w-4 h-4 text-[#8C6D45]" />
              <span>Get Studio Directions on Google Maps</span>
            </button>
          </div>

          {/* Right: On-Location Worldwide Coverage (6 cols) */}
          <div className="lg:col-span-6 bg-[#1C1A18] text-white p-6 sm:p-8 border border-black/20 shadow-md flex flex-col justify-between space-y-6">
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-xs uppercase tracking-widest font-semibold text-[#E6DCB8]">
                  On-Location Bridal Team
                </span>
                <span className="text-[10px] bg-white/10 text-white/90 px-2 py-0.5">
                  Worldwide Travel Ready
                </span>
              </div>

              <h3 className="font-serif text-2xl text-white font-medium">
                We Travel To Your Wedding Suite
              </h3>

              <p className="text-xs sm:text-sm text-white/70 leading-relaxed font-light">
                Over 90% of our brides choose on-location artistry. Sanjana and her senior team travel with complete flight-ready flight cases containing professional Hollywood vanity lights, custom director chairs, extension lines, and sanitation protocols.
              </p>

              {/* Destination list */}
              <div className="grid grid-cols-2 gap-3 pt-3 border-t border-white/10 text-xs">
                <div className="space-y-1">
                  <span className="font-semibold text-[#E6DCB8] block">Northern California</span>
                  <p className="text-white/60 text-[11px]">San Francisco, Napa Valley, Sonoma, Carmel-by-the-Sea, Silicon Valley, Lake Tahoe</p>
                </div>
                <div className="space-y-1">
                  <span className="font-semibold text-[#E6DCB8] block">Destination Marquees</span>
                  <p className="text-white/60 text-[11px]">Southern California, Hawaii, Mexico, Italy, France & Worldwide</p>
                </div>
              </div>
            </div>

            <div className="p-3 bg-white/5 border border-white/10 flex items-center gap-2 text-xs text-[#E6DCB8]">
              <Plane className="w-4 h-4 shrink-0 text-[#B89668]" />
              <span>Flat-rate domestic & transparent destination travel fee quotes</span>
            </div>
          </div>

        </div>

      </div>
    </section>
  );
};
