import React, { useEffect, useCallback } from 'react';
import { X, ChevronLeft, ChevronRight, Sparkles, MapPin } from 'lucide-react';
import { PortfolioItem } from '../types';
import { ImageWithFallback } from './ImageWithFallback';

interface LightboxProps {
  item: PortfolioItem | null;
  items: PortfolioItem[];
  onClose: () => void;
  onSelect: (item: PortfolioItem) => void;
  onBookLook: (lookTitle: string) => void;
}

export const Lightbox: React.FC<LightboxProps> = ({
  item,
  items,
  onClose,
  onSelect,
  onBookLook,
}) => {
  const currentIndex = items.findIndex((i) => i.id === item?.id);

  const handlePrev = useCallback(() => {
    if (currentIndex > 0) {
      onSelect(items[currentIndex - 1]);
    } else {
      onSelect(items[items.length - 1]);
    }
  }, [currentIndex, items, onSelect]);

  const handleNext = useCallback(() => {
    if (currentIndex < items.length - 1) {
      onSelect(items[currentIndex + 1]);
    } else {
      onSelect(items[0]);
    }
  }, [currentIndex, items, onSelect]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
      if (e.key === 'ArrowLeft') handlePrev();
      if (e.key === 'ArrowRight') handleNext();
    };

    window.addEventListener('keydown', handleKeyDown);
    document.body.style.overflow = 'hidden';

    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      document.body.style.overflow = 'unset';
    };
  }, [handleNext, handlePrev, onClose]);

  if (!item) return null;

  return (
    <div
      role="dialog"
      aria-modal="true"
      className="fixed inset-0 z-50 bg-[#141210]/95 backdrop-blur-md flex items-center justify-center p-3 sm:p-6 animate-in fade-in duration-200"
    >
      {/* Top action bar */}
      <div className="absolute top-4 right-4 z-50 flex items-center gap-3">
        <span className="text-white/60 text-xs tracking-widest uppercase">
          {currentIndex + 1} / {items.length}
        </span>
        <button
          onClick={onClose}
          className="p-2 text-white/80 hover:text-white bg-white/10 hover:bg-white/20 transition-colors cursor-pointer min-h-[44px] min-w-[44px] flex items-center justify-center"
          aria-label="Close bridal look preview"
        >
          <X className="w-6 h-6" />
        </button>
      </div>

      {/* Prev button */}
      <button
        onClick={handlePrev}
        className="absolute left-2 sm:left-4 z-40 p-2 text-white/80 hover:text-white bg-white/10 hover:bg-white/20 transition-colors cursor-pointer min-h-[44px] min-w-[44px] flex items-center justify-center"
        aria-label="Previous look"
      >
        <ChevronLeft className="w-6 h-6" />
      </button>

      {/* Next button */}
      <button
        onClick={handleNext}
        className="absolute right-2 sm:right-4 z-40 p-2 text-white/80 hover:text-white bg-white/10 hover:bg-white/20 transition-colors cursor-pointer min-h-[44px] min-w-[44px] flex items-center justify-center"
        aria-label="Next look"
      >
        <ChevronRight className="w-6 h-6" />
      </button>

      {/* Main card */}
      <div className="max-w-4xl w-full max-h-[90vh] bg-[#1E1B18] border border-white/15 overflow-hidden flex flex-col md:flex-row shadow-2xl relative">
        
        {/* Visual Showcase */}
        <div className="md:w-3/5 bg-[#141210] flex items-center justify-center relative min-h-[320px] sm:min-h-[460px] overflow-hidden">
          <ImageWithFallback
            src={item.image_url}
            alt={item.title}
            fallbackTitle={item.title}
            fallbackCategory={item.category}
            aspectRatioClass="aspect-[4/5]"
            className="w-full h-full object-cover"
          />

          {/* Scrim gradient overlay */}
          <div className="absolute inset-0 bg-gradient-to-t from-[#141210]/80 via-transparent to-[#141210]/40 pointer-events-none" />

          {/* Category & Look Badge */}
          <div className="absolute top-4 left-4 z-20 flex items-center gap-2">
            <span className="text-[10px] tracking-[0.25em] uppercase text-[#E6DCB8] font-bold bg-black/60 px-2.5 py-1 backdrop-blur-sm">
              {item.category}
            </span>
            <span className="text-[10px] tracking-wider uppercase bg-white/20 px-2 py-0.5 text-white/90 backdrop-blur-sm">
              {item.look_type}
            </span>
          </div>

          {/* Bottom Photo Caption */}
          <div className="absolute bottom-4 left-4 right-4 z-20 text-white pointer-events-none space-y-0.5">
            <h3 className="font-serif text-xl sm:text-2xl text-white font-normal drop-shadow">
              {item.title}
            </h3>
            <p className="text-xs text-[#E6DCB8] flex items-center gap-1 font-light">
              <MapPin className="w-3.5 h-3.5" />
              <span>{item.venue_city}</span>
            </p>
          </div>
        </div>

        {/* Look Breakdown & Action */}
        <div className="md:w-2/5 p-6 sm:p-8 flex flex-col justify-between space-y-6 text-white bg-[#1A1715]">
          <div className="space-y-4">
            <div className="space-y-1">
              <span className="text-[10px] tracking-[0.2em] uppercase text-[#C5A880]">
                Curated Bridal Transformation
              </span>
              <h4 className="font-serif text-2xl text-white font-medium leading-snug">
                {item.bride_name}
              </h4>
              <p className="text-xs text-white/60">{item.venue_city}</p>
            </div>

            <p className="text-xs sm:text-sm text-white/80 leading-relaxed font-light">
              {item.description}
            </p>

            <div className="pt-3 border-t border-white/10 space-y-2">
              <div className="text-[11px] uppercase tracking-wider text-[#C5A880] font-medium">
                Artistry Inclusions:
              </div>
              <ul className="text-xs text-white/70 space-y-1">
                <li>• Bespoke color & undertone correction</li>
                <li>• Waterproof, high-luminosity skin barrier</li>
                <li>• Secure heavy dupatta & headpiece fastening</li>
              </ul>
            </div>
          </div>

          <div className="space-y-2 pt-4 border-t border-white/10">
            <button
              onClick={() => {
                onClose();
                onBookLook(item.title);
              }}
              className="w-full py-3 bg-[#C5A880] hover:bg-[#B39366] text-[#141210] font-semibold text-xs uppercase tracking-wider transition-all shadow-md cursor-pointer text-center"
            >
              Book This Bridal Look
            </button>
            <p className="text-[10px] text-white/40 text-center">
              Available for California & Destination weddings
            </p>
          </div>
        </div>

      </div>
    </div>
  );
};
