import React from 'react';
import { Calendar, Sparkles, MapPin, Check } from 'lucide-react';
import { trackEvent } from '../utils/analytics';
import { ImageWithFallback } from './ImageWithFallback';

interface AboutArtistProps {
  onCheckDateClick: () => void;
}

export const AboutArtist: React.FC<AboutArtistProps> = ({ onCheckDateClick }) => {
  return (
    <section className="py-16 md:py-24 bg-[#F5EFEB] border-t border-[#E8DFD5]">
      <div className="max-w-6xl mx-auto px-4 sm:px-6">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-14 items-center">
          
          {/* Portrait Visual Canvas */}
          <div className="lg:col-span-5">
            <div className="relative p-3 bg-white border border-[#DFD3C4] shadow-lg max-w-sm sm:max-w-md mx-auto group">
              <div className="relative aspect-[3/4] bg-[#24201C] overflow-hidden flex flex-col justify-end">
                <ImageWithFallback
                  src="/images/bridal/artist_sanjana.jpg"
                  alt="Sanjana Roy - Founder & Master Bridal Artist"
                  aspectRatioClass="aspect-[3/4]"
                  className="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                />

                {/* Scrim overlay */}
                <div className="absolute inset-0 bg-gradient-to-t from-[#141210]/90 via-[#141210]/30 to-transparent z-10 pointer-events-none" />

                <div className="relative z-20 p-5 text-white space-y-1">
                  <span className="text-[10px] uppercase tracking-[0.25em] text-[#E6DCB8] font-semibold block">
                    Lead Artist & Founder
                  </span>
                  <h4 className="font-serif text-2xl text-white font-medium">
                    Sanjana Roy
                  </h4>
                  <p className="text-[11px] text-white/70 font-light">
                    Certified in Haute Couture Silicone Airbrush & Architectural Draping
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Bio & Philosophy Narrative */}
          <div className="lg:col-span-7 space-y-6 text-left">
            <div className="space-y-2">
              <span className="text-xs uppercase tracking-[0.25em] text-[#8C6D45] font-semibold block">
                Meet Your Lead Bridal Artist
              </span>
              <h2 className="font-serif text-3xl sm:text-4xl text-[#1C1A18] font-normal leading-tight">
                "Your wedding look should feel like you—just elevated to your highest light."
              </h2>
            </div>

            <div className="space-y-4 text-xs sm:text-sm text-[#5A554E] leading-relaxed">
              <p>
                With over nine years dedicated exclusively to bridal artistry, I have had the profound honor of styling more than 420 brides across traditional Indian ceremonies, destination vows in Napa Valley, and modern city celebrations.
              </p>
              <p>
                My philosophy stands apart from heavy, mask-like cosmetic trends. I believe in micro-layering weightless, silicone-infused airbrush formulations that let your genuine skin texture shine through while remaining impervious to tears, humidity, and thousands of flash photographs.
              </p>
              <p>
                From structural dupatta anchoring that never pulls your scalp to customized lash clusters designed for your eye shape, every detail is engineered so you can immerse yourself completely in the emotion of your wedding day.
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
              <div className="flex items-center gap-2 text-xs text-[#1C1A18]">
                <Check className="w-4 h-4 text-[#8C6D45] shrink-0" />
                <span>Single bride exclusivity per wedding date</span>
              </div>
              <div className="flex items-center gap-2 text-xs text-[#1C1A18]">
                <Check className="w-4 h-4 text-[#8C6D45] shrink-0" />
                <span>Pre-wedding skincare ritual consultation</span>
              </div>
              <div className="flex items-center gap-2 text-xs text-[#1C1A18]">
                <Check className="w-4 h-4 text-[#8C6D45] shrink-0" />
                <span>On-location lighting kit & director chair</span>
              </div>
              <div className="flex items-center gap-2 text-xs text-[#1C1A18]">
                <Check className="w-4 h-4 text-[#8C6D45] shrink-0" />
                <span>Worldwide travel ready with full team</span>
              </div>
            </div>

            <div className="pt-4">
              <button
                type="button"
                onClick={() => {
                  trackEvent('availability_started', { source: 'about_artist' });
                  onCheckDateClick();
                }}
                className="px-6 py-3.5 bg-[#1C1A18] hover:bg-[#332F2A] active:scale-[0.98] text-white text-xs font-semibold uppercase tracking-wider transition-all flex items-center gap-2 cursor-pointer shadow-sm"
              >
                <Calendar className="w-4 h-4 text-[#E6DCB8]" />
                <span>Check Sanjana's Calendar</span>
              </button>
            </div>

          </div>

        </div>
      </div>
    </section>
  );
};
