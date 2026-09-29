import React, { useState } from 'react';
import { Sparkles } from 'lucide-react';

interface ImageWithFallbackProps extends React.ImgHTMLAttributes<HTMLImageElement> {
  alt: string;
  fallbackTitle?: string;
  fallbackCategory?: string;
  aspectRatioClass?: string;
}

export const ImageWithFallback: React.FC<ImageWithFallbackProps> = ({
  src,
  alt,
  fallbackTitle,
  fallbackCategory,
  aspectRatioClass = 'aspect-[3/4]',
  className = '',
  ...props
}) => {
  const [error, setError] = useState(false);
  const [loaded, setLoaded] = useState(false);

  // If error or empty src, render luxury editorial styling with subtle warm champagne gradient and typography
  if (error || !src) {
    return (
      <div
        className={`w-full ${aspectRatioClass} bg-gradient-to-b from-[#F2ECE4] via-[#E8DFD3] to-[#DCCFBF] relative overflow-hidden flex flex-col justify-end p-6 border border-[#E4D7C8] select-none ${className}`}
      >
        {/* Subtle decorative motif */}
        <div className="absolute top-4 right-4 text-[#A68860]/40">
          <Sparkles className="w-5 h-5" />
        </div>
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_20%,rgba(255,255,255,0.7),transparent_60%)]" />

        <div className="relative z-10">
          {fallbackCategory && (
            <span className="text-[11px] tracking-[0.2em] uppercase text-[#8C6D45] font-medium block mb-1">
              {fallbackCategory}
            </span>
          )}
          <h4 className="font-serif text-lg md:text-xl text-[#2B2620] leading-snug">
            {fallbackTitle || alt}
          </h4>
          <span className="text-[10px] tracking-widest uppercase text-[#73685C] mt-2 inline-block">
            Aura Bridal Atelier Portfolio
          </span>
        </div>
      </div>
    );
  }

  return (
    <div className={`relative w-full ${aspectRatioClass} overflow-hidden bg-[#F2ECE4] ${className}`}>
      {!loaded && (
        <div className="absolute inset-0 bg-[#F2ECE4] animate-pulse" />
      )}
      <img
        src={src}
        alt={alt}
        referrerPolicy="no-referrer"
        loading="lazy"
        onLoad={() => setLoaded(true)}
        onError={() => setError(true)}
        className={`w-full h-full object-cover transition-opacity duration-500 ${
          loaded ? 'opacity-100' : 'opacity-0'
        }`}
        {...props}
      />
    </div>
  );
};
