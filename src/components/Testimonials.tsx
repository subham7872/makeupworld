import React, { useState, useEffect } from 'react';
import { Star, CheckCircle, MapPin, Quote } from 'lucide-react';
import { TestimonialItem } from '../types';
import { ImageWithFallback } from './ImageWithFallback';

export const Testimonials: React.FC = () => {
  const [testimonials, setTestimonials] = useState<TestimonialItem[]>([]);

  useEffect(() => {
    fetch('/api/testimonials')
      .then((res) => res.json())
      .then((data) => setTestimonials(data))
      .catch(() => {});
  }, []);

  return (
    <section id="testimonials" className="py-16 md:py-24 bg-[#FAF8F5]">
      <div className="max-w-6xl mx-auto px-4 sm:px-6">
        
        {/* Header */}
        <div className="text-center space-y-3 mb-12 max-w-2xl mx-auto">
          <span className="text-xs uppercase tracking-[0.25em] text-[#8C6D45] font-semibold block">
            Love Notes From Our Brides
          </span>
          <h2 className="font-serif text-3xl sm:text-4xl md:text-5xl text-[#1C1A18] font-normal">
            Trusted For Their Most Important Day
          </h2>
          <p className="text-sm text-[#5A554E] leading-relaxed">
            Real brides, genuine celebrations, and enduring impressions.
          </p>
        </div>

        {/* Testimonials Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 sm:gap-8">
          {testimonials.map((t) => (
            <div
              key={t.id}
              className="bg-white border border-[#DFD3C4] p-6 sm:p-7 flex flex-col justify-between shadow-sm relative group hover:border-[#1C1A18] transition-colors"
            >
              {/* Subtle quote motif */}
              <div className="text-[#E8DFD5] absolute top-4 right-4">
                <Quote className="w-8 h-8 opacity-40" />
              </div>

              <div className="space-y-4 relative z-10">
                {/* 5 Stars */}
                <div className="flex items-center gap-1 text-[#B89668]">
                  {[...Array(t.rating)].map((_, i) => (
                    <Star key={i} className="w-3.5 h-3.5 fill-[#B89668]" />
                  ))}
                </div>

                {/* Quote */}
                <p className="text-xs sm:text-sm text-[#4A453F] leading-relaxed italic">
                  "{t.quote}"
                </p>
              </div>

              {/* Bride Info with Portrait Photo */}
              <div className="pt-5 mt-6 border-t border-[#E8DFD5] flex items-center gap-3">
                <div className="w-12 h-12 rounded-full overflow-hidden shrink-0 border border-[#B89668]/40 bg-[#FAF5EE]">
                  <ImageWithFallback
                    src={t.image_url}
                    alt={t.bride_name}
                    aspectRatioClass="aspect-square"
                    className="w-full h-full object-cover"
                  />
                </div>

                <div className="space-y-0.5 flex-1 min-w-0">
                  <div className="flex items-center gap-1.5">
                    <h4 className="font-serif text-base font-semibold text-[#1C1A18] truncate">
                      {t.bride_name}
                    </h4>
                    {t.verified_bride && (
                      <span title="Verified Atelier Bride">
                        <CheckCircle className="w-3.5 h-3.5 text-[#2E7D32] shrink-0" />
                      </span>
                    )}
                  </div>

                  <p className="text-[11px] text-[#736B62] flex items-center gap-1 truncate">
                    <MapPin className="w-3 h-3 text-[#B89668] shrink-0" />
                    <span className="truncate">{t.venue}</span>
                  </p>

                  <div className="text-[10px] text-[#8C6D45] uppercase tracking-wider font-medium truncate">
                    {t.service_rendered}
                  </div>
                </div>
              </div>

            </div>
          ))}
        </div>

      </div>
    </section>
  );
};
