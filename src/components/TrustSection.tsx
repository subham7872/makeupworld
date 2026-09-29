import React from 'react';
import { ShieldCheck, Heart, Award, Sparkles, CheckCircle2 } from 'lucide-react';

export const TrustSection: React.FC = () => {
  return (
    <section className="py-14 md:py-20 bg-white border-y border-[#E8DFD5]">
      <div className="max-w-6xl mx-auto px-4 sm:px-6">
        
        {/* Top metrics row (Anti-slop, clean unboxed figures with tabular nums) */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 sm:gap-8 pb-12 border-b border-[#E8DFD5] text-center">
          <div className="space-y-1">
            <span className="font-serif text-3xl sm:text-4xl text-[#1C1A18] font-semibold tabular-nums block">
              420+
            </span>
            <span className="text-xs uppercase tracking-wider text-[#736B62] font-medium">
              Brides Styled
            </span>
          </div>

          <div className="space-y-1">
            <span className="font-serif text-3xl sm:text-4xl text-[#1C1A18] font-semibold tabular-nums block">
              9 Years
            </span>
            <span className="text-xs uppercase tracking-wider text-[#736B62] font-medium">
              Atelier Artistry
            </span>
          </div>

          <div className="space-y-1">
            <span className="font-serif text-3xl sm:text-4xl text-[#1C1A18] font-semibold tabular-nums block">
              100%
            </span>
            <span className="text-xs uppercase tracking-wider text-[#736B62] font-medium">
              5-Star Bride Rating
            </span>
          </div>

          <div className="space-y-1">
            <span className="font-serif text-3xl sm:text-4xl text-[#1C1A18] font-semibold tabular-nums block">
              16 Hours
            </span>
            <span className="text-xs uppercase tracking-wider text-[#736B62] font-medium">
              Waterproof Longevity
            </span>
          </div>
        </div>

        {/* Studio Hygiene & Quality Standard */}
        <div className="pt-12 grid grid-cols-1 md:grid-cols-3 gap-8">
          
          <div className="space-y-3 p-6 bg-[#FAF8F5] border border-[#DFD3C4]">
            <div className="w-10 h-10 rounded-full bg-[#1C1A18] text-[#E6DCB8] flex items-center justify-center">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <h4 className="font-serif text-xl font-medium text-[#1C1A18]">
              Hospital-Grade Hygiene Kit
            </h4>
            <p className="text-xs text-[#5A554E] leading-relaxed">
              Every brush is sanitized with high-potency medical grade cleansers. Disposables for mascare and lip application ensure zero cross-contamination.
            </p>
          </div>

          <div className="space-y-3 p-6 bg-[#FAF8F5] border border-[#DFD3C4]">
            <div className="w-10 h-10 rounded-full bg-[#1C1A18] text-[#E6DCB8] flex items-center justify-center">
              <Award className="w-5 h-5" />
            </div>
            <h4 className="font-serif text-xl font-medium text-[#1C1A18]">
              Couture Product Formulations
            </h4>
            <p className="text-xs text-[#5A554E] leading-relaxed">
              Exclusively utilizing Temptu Pro silicone airbrush, Charlotte Tilbury, Dior Backstage, Tom Ford, and Natasha Denona to ensure flash photography perfection without white cast.
            </p>
          </div>

          <div className="space-y-3 p-6 bg-[#FAF8F5] border border-[#DFD3C4]">
            <div className="w-10 h-10 rounded-full bg-[#1C1A18] text-[#E6DCB8] flex items-center justify-center">
              <Heart className="w-5 h-5" />
            </div>
            <h4 className="font-serif text-xl font-medium text-[#1C1A18]">
              Unrushed Bridal Morning Energy
            </h4>
            <p className="text-xs text-[#5A554E] leading-relaxed">
              We never double-book dates. When you reserve Aura Bridal Atelier, our entire focus and travel team are dedicated solely to you and your wedding party.
            </p>
          </div>

        </div>

      </div>
    </section>
  );
};
