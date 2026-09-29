import React, { useState, useEffect } from 'react';
import { Sparkles, Maximize2, MapPin } from 'lucide-react';
import { PortfolioItem } from '../types';
import { trackEvent } from '../utils/analytics';
import { Lightbox } from './Lightbox';
import { ImageWithFallback } from './ImageWithFallback';

interface PortfolioGalleryProps {
  onBookLook: (lookTitle: string) => void;
}

const CATEGORIES = [
  'All',
  'Bridal',
  'Reception',
  'Engagement',
  'Haldi',
  'Mehendi',
  'Hair Styling',
  'Before / After',
] as const;

export const PortfolioGallery: React.FC<PortfolioGalleryProps> = ({ onBookLook }) => {
  const [activeCategory, setActiveCategory] = useState<string>('All');
  const [items, setItems] = useState<PortfolioItem[]>([]);
  const [selectedItem, setSelectedItem] = useState<PortfolioItem | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch('/api/portfolio')
      .then((res) => res.json())
      .then((data) => {
        setItems(data);
        setLoading(false);
      })
      .catch(() => {
        setLoading(false);
      });
  }, []);

  const filteredItems =
    activeCategory === 'All'
      ? items
      : items.filter((i) => i.category.toLowerCase() === activeCategory.toLowerCase());

  const handleCategoryChange = (cat: string) => {
    setActiveCategory(cat);
    trackEvent('portfolio_view', { category: cat });
  };

  const handleOpenLightbox = (item: PortfolioItem) => {
    setSelectedItem(item);
    trackEvent('portfolio_view', { item_id: item.id, item_title: item.title });
  };

  return (
    <section id="portfolio" className="py-16 md:py-24 bg-[#FAF8F5]">
      <div className="max-w-6xl mx-auto px-4 sm:px-6">
        
        {/* Editorial Section Header */}
        <div className="text-center space-y-3 mb-10 max-w-2xl mx-auto">
          <span className="text-xs uppercase tracking-[0.25em] text-[#8C6D45] font-semibold block">
            Curated Editorial Gallery
          </span>
          <h2 className="font-serif text-3xl sm:text-4xl md:text-5xl text-[#1C1A18] font-normal leading-tight">
            Featured Bridal Looks
          </h2>
          <p className="text-sm text-[#5A554E] leading-relaxed">
            Every bride possesses an unmistakable energy. Our craft is discovering your signature aesthetic and sculpting it with enduring grace.
          </p>
        </div>

        {/* Category Filter Tabs (Compliant with frontend-design rule 1.A) */}
        <div className="flex items-center justify-start sm:justify-center overflow-x-auto no-scrollbar gap-1.5 p-1.5 mb-10 bg-[#F2ECE3] max-w-full sm:max-w-fit mx-auto border border-[#E2D5C5]">
          {CATEGORIES.map((cat) => {
            const isActive = activeCategory === cat;
            return (
              <button
                key={cat}
                type="button"
                onClick={() => handleCategoryChange(cat)}
                className={`min-h-[38px] px-3.5 py-1.5 text-xs font-medium tracking-wider uppercase transition-all whitespace-nowrap cursor-pointer ${
                  isActive
                    ? 'bg-[#1C1A18] text-white shadow-sm font-semibold'
                    : 'text-[#615C56] hover:text-[#1C1A18] hover:bg-white/50'
                }`}
              >
                {cat}
              </button>
            );
          })}
        </div>

        {/* Gallery Grid */}
        {loading ? (
          <div className="py-16 text-center text-xs text-[#736B62]">
            Curating gallery portfolio...
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
            {filteredItems.map((item, idx) => (
              <div
                key={item.id}
                onClick={() => handleOpenLightbox(item)}
                className="group relative cursor-pointer bg-white border border-[#E2D5C5] overflow-hidden shadow-sm hover:shadow-lg transition-all duration-300"
              >
                {/* Visual Area with real bridal photography */}
                <div className="relative aspect-[3/4] bg-[#1E1B18] overflow-hidden flex flex-col justify-end">
                  <ImageWithFallback
                    src={item.image_url}
                    alt={item.title}
                    fallbackTitle={item.title}
                    fallbackCategory={item.category}
                    aspectRatioClass="aspect-[3/4]"
                    className="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />

                  {/* Scrim overlay */}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/25 to-black/10 z-10 pointer-events-none" />

                  {/* Category Stamp */}
                  <div className="absolute top-3.5 left-3.5 z-20">
                    <span className="text-[10px] tracking-[0.2em] uppercase font-semibold text-[#1C1A18] bg-[#FAF8F5]/90 px-2.5 py-1 shadow-sm">
                      {item.category}
                    </span>
                  </div>

                  {/* Expand icon affordance */}
                  <div className="absolute top-3.5 right-3.5 z-20 w-8 h-8 rounded-full bg-black/40 backdrop-blur-sm text-white flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                    <Maximize2 className="w-3.5 h-3.5" />
                  </div>

                  {/* Bottom Text Over Scrim */}
                  <div className="relative z-20 p-4 space-y-1 text-white pointer-events-none">
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-semibold font-serif text-white leading-snug">
                        {item.title}
                      </span>
                      <span className="text-[11px] text-[#E6DCB8] font-medium shrink-0 ml-2">
                        {item.bride_name}
                      </span>
                    </div>
                    <p className="text-[11px] text-white/80 flex items-center gap-1 truncate font-light">
                      <MapPin className="w-3 h-3 text-[#E6DCB8] shrink-0" />
                      <span>{item.venue_city}</span>
                    </p>
                  </div>
                </div>

                {/* Hover reveal overlay button */}
                <div className="p-3 bg-[#FAF8F5] border-t border-[#E8DFD5] flex items-center justify-between text-xs text-[#1C1A18]">
                  <span className="text-[11px] text-[#615C56]">Tap to view look details</span>
                  <span className="font-semibold text-[#8C6D45] group-hover:translate-x-0.5 transition-transform">
                    Inspect Look →
                  </span>
                </div>

              </div>
            ))}
          </div>
        )}

      </div>

      {/* Lightbox Modal */}
      {selectedItem && (
        <Lightbox
          item={selectedItem}
          items={filteredItems}
          onClose={() => setSelectedItem(null)}
          onSelect={(newItem) => setSelectedItem(newItem)}
          onBookLook={onBookLook}
        />
      )}
    </section>
  );
};
