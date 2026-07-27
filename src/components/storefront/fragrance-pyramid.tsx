"use client";

import { FragrancePyramid as FragrancePyramidType } from "@/types/perfume";
import { Icon } from "@/components/ui/icon";

interface FragrancePyramidProps {
  pyramid: FragrancePyramidType;
  perfumeName?: string;
}

export function FragrancePyramid({ pyramid, perfumeName }: FragrancePyramidProps) {
  return (
    <div className="bg-[#121215] border border-[#D4AF37]/30 p-6 sm:p-8 space-y-6">
      
      {/* Header */}
      <div className="flex items-center justify-between border-b border-white/10 pb-4">
        <div>
          <h3 className="text-xs uppercase tracking-[0.25em] text-[#D4AF37] font-semibold flex items-center gap-2">
            <Icon name="SparklesIcon" className="w-4 h-4" />
            Fragrance Olfactory Pyramid
          </h3>
          {perfumeName && (
            <p className="text-sm font-serif text-[#F5F5F0] tracking-wider mt-1">{perfumeName}</p>
          )}
        </div>
        <span className="text-[10px] uppercase tracking-widest px-2.5 py-1 bg-[#D4AF37]/10 border border-[#D4AF37]/30 text-[#E6C687]">
          Extrait Structure
        </span>
      </div>

      {/* Pyramid Layers */}
      <div className="space-y-4">
        
        {/* Top Notes */}
        <div className="relative p-4 bg-[#18181C] border-l-2 border-[#E6C687] hover:bg-[#1E1E23] transition-colors">
          <div className="flex items-center justify-between mb-2">
            <span className="text-[11px] font-bold uppercase tracking-[0.2em] text-[#E6C687]">
              Top Notes • First Impression (0 - 30 Mins)
            </span>
            <span className="text-[10px] text-[#999990] uppercase tracking-wider">Sparkling & Volatile</span>
          </div>
          <div className="flex flex-wrap gap-2 pt-1">
            {pyramid.top.map((note, idx) => (
              <span
                key={idx}
                className="px-3 py-1 bg-[#0A0A0B] border border-white/10 text-xs text-[#F5F5F0] tracking-wide"
              >
                ✨ {note}
              </span>
            ))}
          </div>
        </div>

        {/* Heart / Middle Notes */}
        <div className="relative p-4 bg-[#18181C] border-l-2 border-[#D4AF37] hover:bg-[#1E1E23] transition-colors">
          <div className="flex items-center justify-between mb-2">
            <span className="text-[11px] font-bold uppercase tracking-[0.2em] text-[#D4AF37]">
              Heart Notes • The Soul (1 - 5 Hours)
            </span>
            <span className="text-[10px] text-[#999990] uppercase tracking-wider">Rich Floral & Spice</span>
          </div>
          <div className="flex flex-wrap gap-2 pt-1">
            {pyramid.heart.map((note, idx) => (
              <span
                key={idx}
                className="px-3 py-1 bg-[#0A0A0B] border border-[#D4AF37]/30 text-xs text-[#F5F5F0] tracking-wide"
              >
                🌹 {note}
              </span>
            ))}
          </div>
        </div>

        {/* Base Notes */}
        <div className="relative p-4 bg-[#18181C] border-l-2 border-[#9A7B20] hover:bg-[#1E1E23] transition-colors">
          <div className="flex items-center justify-between mb-2">
            <span className="text-[11px] font-bold uppercase tracking-[0.2em] text-[#C5A030]">
              Base Notes • Deep Sillage (6 - 18+ Hours)
            </span>
            <span className="text-[10px] text-[#999990] uppercase tracking-wider">Resins, Oud & Amber</span>
          </div>
          <div className="flex flex-wrap gap-2 pt-1">
            {pyramid.base.map((note, idx) => (
              <span
                key={idx}
                className="px-3 py-1 bg-[#0A0A0B] border border-[#C5A030]/40 text-xs text-[#E6C687] font-medium tracking-wide"
              >
                🪵 {note}
              </span>
            ))}
          </div>
        </div>

      </div>

    </div>
  );
}
