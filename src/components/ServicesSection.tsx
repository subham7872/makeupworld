import React, { useState, useEffect } from 'react';
import { Clock, Check, Sparkles, ArrowRight } from 'lucide-react';
import { ServiceItem } from '../types';
import { trackEvent } from '../utils/analytics';
import { ImageWithFallback } from './ImageWithFallback';

interface ServicesSectionProps {
  onSelectService: (service: ServiceItem) => void;
}

export const ServicesSection: React.FC<ServicesSectionProps> = ({ onSelectService }) => {
  const [services, setServices] = useState<ServiceItem[]>([]);

  useEffect(() => {
    fetch('/api/services')
      .then((res) => res.json())
      .then((data) => setServices(data))
      .catch(() => {});
  }, []);

  const handleServiceClick = (srv: ServiceItem) => {
    trackEvent('service_view', { service_id: srv.id, service_title: srv.title });
    onSelectService(srv);
  };

  return (
    <section id="services" className="py-16 md:py-24 bg-[#FAF8F5]">
      <div className="max-w-6xl mx-auto px-4 sm:px-6">
        
        {/* Header */}
        <div className="text-center space-y-3 mb-12 max-w-2xl mx-auto">
          <span className="text-xs uppercase tracking-[0.25em] text-[#8C6D45] font-semibold block">
            Custom Artistry Services
          </span>
          <h2 className="font-serif text-3xl sm:text-4xl md:text-5xl text-[#1C1A18] font-normal">
            Bespoke Bridal Craft
          </h2>
          <p className="text-sm text-[#5A554E] leading-relaxed">
            Every session begins with a diagnostic skin consultation and harmonizes your outfit, jewelry weight, and wedding aesthetic.
          </p>
        </div>

        {/* Services Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 sm:gap-8">
          {services.map((srv) => (
            <div
              key={srv.id}
              className={`bg-white border flex flex-col justify-between transition-all duration-200 overflow-hidden relative ${
                srv.is_popular
                  ? 'border-[#B89668] shadow-md ring-1 ring-[#B89668]/30'
                  : 'border-[#DFD3C4] hover:border-[#1C1A18] shadow-sm'
              }`}
            >
              {/* Service Bridal Image Banner */}
              <div className="relative aspect-[16/9] w-full overflow-hidden bg-[#1E1B18]">
                <ImageWithFallback
                  src={srv.image_url}
                  alt={srv.title}
                  fallbackTitle={srv.title}
                  fallbackCategory={srv.category}
                  aspectRatioClass="aspect-[16/9]"
                  className="w-full h-full object-cover hover:scale-105 transition-transform duration-500"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent pointer-events-none" />
                <div className="absolute top-3 left-3 z-10">
                  <span className="text-[10px] uppercase tracking-widest font-semibold text-[#1C1A18] bg-white/95 px-2.5 py-1 shadow-sm">
                    {srv.category}
                  </span>
                </div>
              </div>

              {srv.is_popular && (
                <div className="absolute top-3 right-3 z-10 bg-[#B89668] text-white text-[10px] uppercase tracking-widest font-semibold px-3 py-1 shadow-sm flex items-center gap-1">
                  <Sparkles className="w-3 h-3 text-[#FAF8F5]" />
                  <span>Signature Offering</span>
                </div>
              )}

              <div className="p-6 sm:p-7 flex flex-col justify-between flex-1 space-y-4">
                <div className="space-y-4">
                  {/* Meta details */}
                  <div className="flex items-center justify-between text-xs text-[#736B62]">
                    <span className="uppercase tracking-widest font-medium text-[#8C6D45]">
                      {srv.category}
                    </span>
                    <div className="flex items-center gap-1 font-mono text-[11px] tabular-nums">
                      <Clock className="w-3.5 h-3.5 text-[#B89668]" />
                      <span>{srv.duration_minutes} Mins</span>
                    </div>
                  </div>

                {/* Title & Tagline */}
                <div>
                  <h3 className="font-serif text-2xl text-[#1C1A18] font-medium leading-snug">
                    {srv.title}
                  </h3>
                  <p className="text-xs text-[#8C6D45] font-medium mt-1">
                    {srv.tagline}
                  </p>
                </div>

                {/* Description */}
                <p className="text-xs sm:text-sm text-[#5A554E] leading-relaxed">
                  {srv.description}
                </p>

                {/* Deliverables / Features */}
                <div className="pt-3 border-t border-[#E8DFD5] space-y-2">
                  <span className="text-[11px] uppercase tracking-wider font-semibold text-[#3D3833] block">
                    What's Included:
                  </span>
                  <ul className="space-y-1.5">
                    {srv.features.map((feat, idx) => (
                      <li key={idx} className="text-xs text-[#4A453F] flex items-start gap-2">
                        <Check className="w-3.5 h-3.5 text-[#8C6D45] shrink-0 mt-0.5" />
                        <span>{feat}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>

                {/* Bottom CTA & Pricing */}
                <div className="pt-6 mt-6 border-t border-[#E8DFD5] flex items-center justify-between">
                  <div>
                    <span className="text-[10px] uppercase tracking-wider text-[#736B62] block">
                      Starting From
                    </span>
                    <span className="font-serif text-xl sm:text-2xl font-semibold text-[#1C1A18] tabular-nums">
                      ${srv.starting_price}
                    </span>
                  </div>

                  <button
                    type="button"
                    onClick={() => handleServiceClick(srv)}
                    className="px-4 py-2.5 bg-[#1C1A18] hover:bg-[#332F2A] active:scale-[0.98] text-white text-xs font-semibold uppercase tracking-wider transition-all flex items-center gap-1.5 cursor-pointer"
                  >
                    <span>Check Availability</span>
                    <ArrowRight className="w-3.5 h-3.5 text-[#E6DCB8]" />
                  </button>
                </div>

              </div>

            </div>
          ))}
        </div>

      </div>
    </section>
  );
};
