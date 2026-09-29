import React, { useState, useRef, useEffect } from 'react';
import { Play, Pause, Volume2, VolumeX, Heart, Sparkles } from 'lucide-react';
import { ReelVideo } from '../types';
import { trackEvent } from '../utils/analytics';
import { ImageWithFallback } from './ImageWithFallback';

export const VideoReels: React.FC = () => {
  const [reels, setReels] = useState<ReelVideo[]>([]);
  const [playingId, setPlayingId] = useState<string | null>(null);
  const [isMuted, setIsMuted] = useState(true);
  const videoRefs = useRef<{ [key: string]: HTMLVideoElement | null }>({});

  useEffect(() => {
    fetch('/api/reels')
      .then((res) => res.json())
      .then((data) => setReels(data))
      .catch(() => {});
  }, []);

  const togglePlay = (id: string) => {
    const video = videoRefs.current[id];
    if (!video) return;

    if (playingId === id) {
      video.pause();
      setPlayingId(null);
    } else {
      // Pause all other videos
      Object.entries(videoRefs.current).forEach(([k, v]) => {
        if (k !== id && v) {
          v.pause();
        }
      });
      video.play().then(() => {
        setPlayingId(id);
        trackEvent('portfolio_view', { reel_id: id });
      }).catch(() => {
        // Autoplay policy fallback
      });
    }
  };

  const toggleSound = (e: React.MouseEvent) => {
    e.stopPropagation();
    const newMuted = !isMuted;
    setIsMuted(newMuted);
    Object.values(videoRefs.current).forEach((v) => {
      if (v) v.muted = newMuted;
    });
  };

  return (
    <section id="reels" className="py-16 md:py-20 bg-[#F4EFE6] border-y border-[#E8DFD5] overflow-hidden">
      <div className="max-w-6xl mx-auto px-4 sm:px-6">
        
        {/* Section Heading */}
        <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-8 sm:mb-10 gap-4">
          <div className="space-y-2">
            <span className="text-xs uppercase tracking-[0.25em] text-[#8C6D45] font-semibold flex items-center gap-1.5">
              <Sparkles className="w-3.5 h-3.5 text-[#B89668]" />
              <span>Behind The Veil</span>
            </span>
            <h2 className="font-serif text-3xl sm:text-4xl text-[#1C1A18] font-normal">
              Real Brides. Real Transformations.
            </h2>
          </div>
          <p className="text-xs text-[#736B62] max-w-xs">
            Unfiltered motion captures. Watch how our signature makeup endures emotion, daylight, and midnight dance celebrations.
          </p>
        </div>

        {/* Horizontal Reels Scroller for Mobile & Grid for Desktop */}
        <div className="flex sm:grid sm:grid-cols-3 gap-5 sm:gap-6 overflow-x-auto no-scrollbar pb-4 -mx-4 px-4 sm:mx-0 sm:px-0 snap-x snap-mandatory">
          {reels.map((reel) => {
            const isPlaying = playingId === reel.id;

            return (
              <div
                key={reel.id}
                onClick={() => togglePlay(reel.id)}
                className="relative min-w-[280px] sm:min-w-0 w-[280px] sm:w-auto aspect-[9/16] bg-[#1C1A18] rounded-xl overflow-hidden shadow-md cursor-pointer select-none group border border-[#D8CEBF] snap-center shrink-0"
              >
                {/* HTML5 Video element */}
                <video
                  ref={(el) => {
                    videoRefs.current[reel.id] = el;
                  }}
                  src={reel.video_url}
                  poster={reel.poster_url}
                  loop
                  playsInline
                  muted={isMuted}
                  className={`w-full h-full object-cover transition-opacity duration-300 ${
                    isPlaying ? 'opacity-100 z-10 relative' : 'opacity-0 absolute inset-0'
                  }`}
                />

                {/* Instant High-Resolution Bridal Reel Poster */}
                {!isPlaying && (
                  <ImageWithFallback
                    src={reel.poster_url}
                    alt={reel.title}
                    aspectRatioClass="aspect-[9/16]"
                    className="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                )}

                {/* Scrim Overlay */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/20 to-black/30 pointer-events-none z-10" />

                {/* Top Status & Audio Control */}
                <div className="absolute top-4 left-4 right-4 flex items-center justify-between z-20">
                  <span className="text-[10px] tracking-wider uppercase font-semibold text-white/90 bg-black/40 px-2 py-0.5 rounded backdrop-blur-sm">
                    {reel.occasion}
                  </span>

                  <button
                    type="button"
                    onClick={toggleSound}
                    className="w-8 h-8 rounded-full bg-black/50 text-white flex items-center justify-center backdrop-blur-sm hover:bg-black/70 transition-colors pointer-events-auto"
                    aria-label={isMuted ? 'Unmute video' : 'Mute video'}
                  >
                    {isMuted ? <VolumeX className="w-4 h-4" /> : <Volume2 className="w-4 h-4" />}
                  </button>
                </div>

                {/* Center Play/Pause Indicator */}
                <div className="absolute inset-0 flex items-center justify-center z-10 pointer-events-none">
                  {!isPlaying && (
                    <div className="w-14 h-14 rounded-full bg-white/20 backdrop-blur-md border border-white/40 flex items-center justify-center text-white shadow-lg group-hover:scale-110 transition-transform">
                      <Play className="w-6 h-6 ml-0.5 fill-white" />
                    </div>
                  )}
                  {isPlaying && (
                    <div className="w-10 h-10 rounded-full bg-black/40 text-white flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                      <Pause className="w-5 h-5 fill-white" />
                    </div>
                  )}
                </div>

                {/* Bottom Story Content */}
                <div className="absolute bottom-4 left-4 right-4 z-20 space-y-1.5 text-white">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-semibold font-serif text-[#E6DCB8]">
                      {reel.bride_name}
                    </span>
                    <span className="text-[11px] text-white/80 flex items-center gap-1 font-medium">
                      <Heart className="w-3 h-3 fill-rose-500 text-rose-500" />
                      <span>{reel.likes}</span>
                    </span>
                  </div>

                  <p className="text-xs text-white/90 line-clamp-2 leading-relaxed">
                    {reel.caption}
                  </p>

                  <div className="pt-1 flex items-center justify-between text-[10px] text-white/60">
                    <span>Aura Bridal Reel</span>
                    <span>{reel.duration}</span>
                  </div>
                </div>

              </div>
            );
          })}
        </div>

        {/* Mobile Swipe Hint */}
        <div className="sm:hidden text-center mt-3">
          <span className="text-[11px] text-[#736B62] tracking-wide">
            ← Swipe to view more transformation reels →
          </span>
        </div>

      </div>
    </section>
  );
};
