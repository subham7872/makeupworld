import React from 'react';
import { Calendar, Sparkles, HeartHandshake, CheckCircle2, ArrowRight } from 'lucide-react';
import { trackEvent } from '../utils/analytics';

interface HowBookingWorksProps {
  onCheckDateClick: () => void;
}

export const HowBookingWorks: React.FC<HowBookingWorksProps> = ({ onCheckDateClick }) => {
  return (
    <section className="py-16 md:py-24 bg-[#FAF8F5] border-t border-[#E8DFD5]">
      <div className="max-w-6xl mx-auto px-4 sm:px-6">
        
        {/* Header */}
        <div className="text-center space-y-3 mb-14 max-w-2xl mx-auto">
          <span className="text-xs uppercase tracking-[0.25em] text-[#8C6D45] font-semibold block">
            Effortless Journey
          </span>
          <h2 className="font-serif text-3xl sm:text-4xl md:text-5xl text-[#1C1A18] font-normal">
            How Your Bridal Booking Works
          </h2>
          <p className="text-sm text-[#5A554E] leading-relaxed">
            Zero back-and-forth guessing. We have engineered a simple, stress-free path from your first enquiry to your radiant wedding morning.
          </p>
        </div>

        {/* 3 Editorial Steps */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 relative">
          
          {/* Step 1 */}
          <div className="bg-white p-7 sm:p-8 border border-[#DFD3C4] shadow-sm relative flex flex-col justify-between group hover:border-[#1C1A18] transition-colors">
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="font-serif text-3xl sm:text-4xl font-semibold text-[#8C6D45]/40 group-hover:text-[#8C6D45] transition-colors">
                  01
                </span>
                <div className="w-10 h-10 rounded-full bg-[#FAF5EE] text-[#8C6D45] flex items-center justify-center">
                  <Calendar className="w-5 h-5" />
                </div>
              </div>

              <h3 className="font-serif text-2xl text-[#1C1A18] font-medium">
                Check Date Availability
              </h3>

              <p className="text-xs sm:text-sm text-[#5A554E] leading-relaxed">
                Select your wedding date in our real-time calendar. Because we accept only one bridal party per date, you receive immediate confirmation whether Sanjana's team is available.
              </p>
            </div>

            <div className="pt-6 mt-6 border-t border-[#E8DFD5] text-[11px] text-[#8C6D45] font-medium flex items-center gap-1.5">
              <CheckCircle2 className="w-3.5 h-3.5" />
              <span>Takes under 30 seconds</span>
            </div>
          </div>

          {/* Step 2 */}
          <div className="bg-white p-7 sm:p-8 border border-[#B89668] shadow-md relative flex flex-col justify-between ring-1 ring-[#B89668]/30">
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="font-serif text-3xl sm:text-4xl font-semibold text-[#8C6D45]">
                  02
                </span>
                <div className="w-10 h-10 rounded-full bg-[#1C1A18] text-[#E6DCB8] flex items-center justify-center">
                  <Sparkles className="w-5 h-5" />
                </div>
              </div>

              <h3 className="font-serif text-2xl text-[#1C1A18] font-medium">
                Consultation & Trial
              </h3>

              <p className="text-xs sm:text-sm text-[#5A554E] leading-relaxed">
                We meet virtually or in our atelier to diagnose your skin, harmonize your jewelry and outfit embroidery, and test HD airbrush shades and custom hair structures.
              </p>
            </div>

            <div className="pt-6 mt-6 border-t border-[#E8DFD5] text-[11px] text-[#8C6D45] font-medium flex items-center gap-1.5">
              <CheckCircle2 className="w-3.5 h-3.5" />
              <span>Full portrait lighting review</span>
            </div>
          </div>

          {/* Step 3 */}
          <div className="bg-white p-7 sm:p-8 border border-[#DFD3C4] shadow-sm relative flex flex-col justify-between group hover:border-[#1C1A18] transition-colors">
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="font-serif text-3xl sm:text-4xl font-semibold text-[#8C6D45]/40 group-hover:text-[#8C6D45] transition-colors">
                  03
                </span>
                <div className="w-10 h-10 rounded-full bg-[#FAF5EE] text-[#8C6D45] flex items-center justify-center">
                  <HeartHandshake className="w-5 h-5" />
                </div>
              </div>

              <h3 className="font-serif text-2xl text-[#1C1A18] font-medium">
                Locked In & Serene
              </h3>

              <p className="text-xs sm:text-sm text-[#5A554E] leading-relaxed">
                Your date is legally locked with an atelier contract. On your wedding morning, we arrive early on-location with director chairs, daylight ring lights, and total serene calm.
              </p>
            </div>

            <div className="pt-6 mt-6 border-t border-[#E8DFD5] text-[11px] text-[#8C6D45] font-medium flex items-center gap-1.5">
              <CheckCircle2 className="w-3.5 h-3.5" />
              <span>16-Hour guarantee locked</span>
            </div>
          </div>

        </div>

        {/* CTA Bar below steps */}
        <div className="mt-12 text-center">
          <button
            type="button"
            onClick={() => {
              trackEvent('availability_started', { trigger: 'how_it_works' });
              onCheckDateClick();
            }}
            className="inline-flex items-center gap-2 px-8 py-3.5 bg-[#1C1A18] hover:bg-[#332F2A] active:scale-[0.98] text-white text-xs font-semibold uppercase tracking-wider transition-all shadow-md cursor-pointer"
          >
            <span>Start With Step 1: Check My Wedding Date</span>
            <ArrowRight className="w-4 h-4 text-[#E6DCB8]" />
          </button>
        </div>

      </div>
    </section>
  );
};
