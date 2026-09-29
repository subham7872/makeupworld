import React from 'react';
import { Tag, Instagram, Facebook, Sparkles, ChevronRight } from 'lucide-react';
import { AttributionData } from '../types';

interface CampaignBannerProps {
  attribution: AttributionData;
  onSimulateCampaign: (source: string, campaign: string) => void;
}

export const CampaignBanner: React.FC<CampaignBannerProps> = ({
  attribution,
  onSimulateCampaign,
}) => {
  return (
    <div className="bg-[#1C1A18] text-white text-[11px] py-1.5 px-4 border-b border-white/10 hidden sm:block">
      <div className="max-w-6xl mx-auto flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Tag className="w-3.5 h-3.5 text-[#B89668]" />
          <span className="text-[#E6DCB8] font-medium">Meta Ad Continuity Simulator:</span>
          <span className="text-white/60">
            Source: <strong className="text-white">{attribution.source_platform || 'Direct'}</strong> · Campaign: <strong className="text-white">{attribution.utm_campaign || 'Default'}</strong>
          </span>
        </div>

        <div className="flex items-center gap-1.5">
          <span className="text-white/40 mr-1">Preview Ad Journeys:</span>
          <button
            onClick={() => onSimulateCampaign('instagram', 'bridal_festive_2026')}
            className={`px-2 py-0.5 rounded text-[10px] transition-colors flex items-center gap-1 ${
              attribution.utm_campaign === 'bridal_festive_2026'
                ? 'bg-rose-900/60 text-rose-200 border border-rose-500'
                : 'bg-white/10 hover:bg-white/20 text-white/80'
            }`}
          >
            <Instagram className="w-3 h-3 text-rose-400" />
            <span>Bridal Reel Ad</span>
          </button>

          <button
            onClick={() => onSimulateCampaign('facebook', 'reception_couture_glam')}
            className={`px-2 py-0.5 rounded text-[10px] transition-colors flex items-center gap-1 ${
              attribution.utm_campaign === 'reception_couture_glam'
                ? 'bg-blue-900/60 text-blue-200 border border-blue-500'
                : 'bg-white/10 hover:bg-white/20 text-white/80'
            }`}
          >
            <Facebook className="w-3 h-3 text-blue-400" />
            <span>Reception Glam Ad</span>
          </button>

          <button
            onClick={() => onSimulateCampaign('instagram', 'haldi_dewy_sunlight')}
            className={`px-2 py-0.5 rounded text-[10px] transition-colors flex items-center gap-1 ${
              attribution.utm_campaign === 'haldi_dewy_sunlight'
                ? 'bg-amber-900/60 text-amber-200 border border-amber-500'
                : 'bg-white/10 hover:bg-white/20 text-white/80'
            }`}
          >
            <Sparkles className="w-3 h-3 text-amber-400" />
            <span>Haldi / Day Ad</span>
          </button>
        </div>
      </div>
    </div>
  );
};
