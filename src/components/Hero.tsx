import React from 'react';
import { Calendar, ArrowDown, Check, Sparkles, MapPin } from 'lucide-react';
import { trackEvent } from '../utils/analytics';
import { AttributionData } from '../types';
import { ImageWithFallback } from './ImageWithFallback';

interface HeroProps {
  onCheckDateClick: () => void;
  onExploreWorkClick: () => void;
  attribution: AttributionData;
}

export const Hero: React.FC<HeroProps> = ({
  onCheckDateClick,
  onExploreWorkClick,
  attribution,
}) => {
  // Campaign-specific headline tailoring for Meta Ads continuity
  let headline = 'Your Wedding Day. Your Signature Look.';
  let subheadline =
    'Bespoke HD & Airbrush Bridal Artistry, Architectural Hair Styling & Draping crafted for your most unforgettable moment.';
  let badgeText = '2026 – 2027 Wedding Season Booking Open';

  if (attribution.utm_campaign?.includes('reception') || attribution.utm_content?.includes('reception')) {
    headline = 'Your Reception Evening. Couture High Glamour.';
    subheadline =
      'Dramatic shimmer eyes, luminous glass skin, and effortless modern waves engineered to dazzle under night chandeliers and dance floors.';
    badgeText = 'Reception & Sangeet Styling Suite';
  } else if (attribution.utm_campaign?.includes('haldi') || attribution.utm_content?.includes('haldi')) {
    headline = 'Fresh Sunlight Radiance For Your Haldi & Mehendi.';
    subheadline =
      'Dewy, breathable skin-first makeup and floral-infused styling that shines in golden daylight and outdoor celebrations.';
    badgeText = 'Mehendi & Pre-Wedding Glam';
  }

  const handlePrimaryCTA = () => {
    trackEvent('availability_started', { trigger: 'hero_primary_button' });
    onCheckDateClick();
  };

  const handleSecondaryCTA = () => {
    trackEvent('portfolio_view', { trigger: 'hero_secondary_button' });
    onExploreWorkClick();
  };

  return (
    <section className="relative overflow-hidden pt-6 pb-12 md:py-16 bg-[#FAF8F5]">
      {/* Background ambient glow */}
      <div className="absolute top-0 right-0 w-96 h-96 bg-[#F4EBD9]/60 rounded-full blur-3xl pointer-events-none -mr-20 -mt-20" />
      <div className="absolute bottom-0 left-0 w-80 h-80 bg-[#EFE8DC]/50 rounded-full blur-2xl pointer-events-none -ml-20 -mb-20" />

      <div className="max-w-6xl mx-auto px-4 sm:px-6 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center">
          
          {/* Left Column: Messaging & Conversion Engine */}
          <div className="lg:col-span-7 space-y-6 text-left">
            
            {/* Meta Ad campaign / Season badge */}
            <div className="inline-flex items-center gap-2 text-xs tracking-wider uppercase font-medium text-[#8C6D45] bg-[#F2ECE3] px-3 py-1.5 rounded-full border border-[#E2D5C5]">
              <Sparkles className="w-3.5 h-3.5 text-[#B89668]" />
              <span>{badgeText}</span>
            </div>

            {/* Main Headline */}
            <h1 className="font-serif text-3xl sm:text-4xl md:text-5xl lg:text-[3.25rem] text-[#1C1A18] font-normal leading-[1.15] text-balance">
              {headline}
            </h1>

            {/* Subheadline */}
            <p className="text-base sm:text-lg text-[#5A554E] font-normal leading-relaxed max-w-xl">
              {subheadline}
            </p>

            {/* Location & Trust Anchor */}
            <div className="flex items-center gap-2 text-xs text-[#736B62] font-medium">
              <MapPin className="w-3.5 h-3.5 text-[#B89668]" />
              <span>Luxury Atelier Studio & Worldwide Destination On-Location Travel</span>
            </div>

            {/* Primary Action Zone */}
            <div className="pt-2 flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
              <button
                onClick={handlePrimaryCTA}
                className="min-h-[48px] px-6 py-3 bg-[#1C1A18] hover:bg-[#332F2A] active:scale-[0.98] text-white font-medium text-sm rounded-none tracking-wide flex items-center justify-center gap-2 shadow-md transition-all cursor-pointer"
              >
                <Calendar className="w-4 h-4 text-[#E6DCB8]" />
                <span className="font-semibold">Check My Wedding Date</span>
              </button>

              <button
                onClick={handleSecondaryCTA}
                className="min-h-[48px] px-6 py-3 bg-transparent hover:bg-[#F2ECE3] active:scale-[0.98] text-[#1C1A18] font-medium text-sm border border-[#D8CEBF] tracking-wide flex items-center justify-center gap-2 transition-all cursor-pointer"
              >
                <span>View Real Bridal Work</span>
                <ArrowDown className="w-4 h-4 text-[#8C6D45]" />
              </button>
            </div>

            {/* Trust Indicators (Anti-slop, clean unboxed list) */}
            <div className="pt-4 border-t border-[#E8DFD5] grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs text-[#4A453F]">
              <div className="flex items-center gap-1.5">
                <Check className="w-3.5 h-3.5 text-[#8C6D45] shrink-0" />
                <span>16h Sweatproof HD</span>
              </div>
              <div className="flex items-center gap-1.5">
                <Check className="w-3.5 h-3.5 text-[#8C6D45] shrink-0" />
                <span>Veil & Dupatta Rigging</span>
              </div>
              <div className="flex items-center gap-1.5">
                <Check className="w-3.5 h-3.5 text-[#8C6D45] shrink-0" />
                <span>Bridal Trial Available</span>
              </div>
              <div className="flex items-center gap-1.5">
                <Check className="w-3.5 h-3.5 text-[#8C6D45] shrink-0" />
                <span>Destination Travel</span>
              </div>
            </div>

          </div>

          {/* Right Column: Hero Editorial Showcase Canvas */}
          <div className="lg:col-span-5 relative">
            <div className="relative mx-auto max-w-sm sm:max-w-md lg:max-w-none">
              
              {/* Outer decorative border framing the photograph */}
              <div className="p-2 sm:p-3 bg-white border border-[#E2D5C5] shadow-xl relative">
                
                {/* Hero Editorial Bridal Photography */}
                <div className="relative aspect-[4/5] overflow-hidden bg-[#1E1B18] flex flex-col justify-end group">
                  <ImageWithFallback
                    src="/images/bridal/hero_bride.jpg"
                    alt="Signature Luxury Bridal Makeup & Veil Styling"
                    aspectRatioClass="aspect-[4/5]"
                    className="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                  />

                  {/* Scrim overlay for legibility */}
                  <div className="absolute inset-0 bg-gradient-to-t from-[#141210]/90 via-[#141210]/35 to-transparent z-10 pointer-events-none" />

                  {/* Editorial Caption on image */}
                  <div className="relative z-20 text-white p-5 sm:p-6 space-y-1.5 pointer-events-none">
                    <div className="flex items-center gap-2">
                      <span className="text-[10px] tracking-[0.25em] uppercase text-[#E6DCB8] font-bold">
                        Signature Bridal Look
                      </span>
                      <span className="text-[10px] text-white/50">·</span>
                      <span className="text-[10px] text-white/80 font-light">Real Bride Divya</span>
                    </div>
                    <p className="font-serif text-xl sm:text-2xl text-white font-normal leading-snug drop-shadow-sm">
                      "I looked and felt like royalty the entire day."
                    </p>
                    <p className="text-xs text-[#E6DCB8]/95 font-light tracking-wide">
                      HD Airbrush base · Hand-placed 3D silk lashes · Rosewood stain
                    </p>
                  </div>
                </div>

                {/* Floating Social Proof Chip */}
                <div className="absolute -bottom-4 -left-4 sm:-bottom-5 sm:-left-5 bg-[#FAF8F5] border border-[#D8CEBF] p-3 shadow-lg flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-[#1C1A18] text-[#E6DCB8] flex items-center justify-center font-serif text-sm font-semibold">
                    420+
                  </div>
                  <div>
                    <div className="text-xs font-semibold text-[#1C1A18]">Brides Styled</div>
                    <div className="text-[10px] text-[#736B62]">100% 5-Star Reviews</div>
                  </div>
                </div>

                {/* Floating Quick Action */}
                <button
                  onClick={handlePrimaryCTA}
                  className="absolute -top-3 -right-3 bg-[#B89668] hover:bg-[#A38155] text-white text-[11px] font-semibold tracking-wider uppercase px-3 py-1.5 shadow-md flex items-center gap-1 transition-all"
                >
                  <Sparkles className="w-3 h-3 text-[#FAF8F5]" />
                  <span>Reserve Date</span>
                </button>

              </div>

            </div>
          </div>

        </div>
      </div>
    </section>
  );
};
