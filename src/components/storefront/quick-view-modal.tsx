"use client";

import { useState } from "react";
import { Perfume } from "@/types/perfume";
import { FragrancePyramid } from "./fragrance-pyramid";
import { Icon } from "@/components/ui/icon";

interface QuickViewModalProps {
  perfume: Perfume | null;
  onClose: () => void;
  onAddToCart: (perfume: Perfume, selectedMl: number, price: number) => void;
}

export function QuickViewModal({ perfume, onClose, onAddToCart }: QuickViewModalProps) {
  if (!perfume) return null;

  const [selectedMl, setSelectedMl] = useState<number>(perfume.volumes[1]?.ml || 50);
  const selectedVolumeObj = perfume.volumes.find((v) => v.ml === selectedMl) || perfume.volumes[0];
  const activePrice = selectedVolumeObj.price;
  const [activeImgIndex, setActiveImgIndex] = useState<number>(0);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md animate-in fade-in duration-200">
      <div className="relative w-full max-w-4xl max-h-[90vh] overflow-y-auto bg-[#121215] border border-[#D4AF37]/40 shadow-2xl rounded-none text-[#F5F5F0]">
        
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 z-20 p-2 text-[#888] hover:text-[#D4AF37] bg-black/50 rounded-full transition-colors"
        >
          <Icon name="Cancel01Icon" className="w-6 h-6" />
        </button>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 p-6 sm:p-10">
          
          {/* Left Column: Image Gallery */}
          <div className="space-y-4">
            <div className="relative aspect-[3/4] overflow-hidden bg-[#0A0A0B] border border-white/10">
              <img
                src={perfume.images[activeImgIndex] || perfume.images[0]}
                alt={perfume.name}
                className="w-full h-full object-cover"
              />
              <div className="absolute top-3 left-3 bg-[#D4AF37] text-[#0A0A0B] text-[9px] font-bold uppercase tracking-[0.2em] px-2.5 py-1">
                {perfume.concentration}
              </div>
            </div>

            {/* Thumbnail Selectors */}
            {perfume.images.length > 1 && (
              <div className="flex gap-3">
                {perfume.images.map((img, idx) => (
                  <button
                    key={idx}
                    onClick={() => setActiveImgIndex(idx)}
                    className={`w-16 h-20 border ${
                      activeImgIndex === idx ? "border-[#D4AF37]" : "border-white/10 opacity-60"
                    } overflow-hidden`}
                  >
                    <img src={img} alt="Thumbnail" className="w-full h-full object-cover" />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Right Column: Perfume Spec & Add to Cart */}
          <div className="space-y-6">
            
            <div>
              <div className="flex items-center gap-2 text-[10px] uppercase tracking-[0.25em] text-[#D4AF37] font-semibold mb-1">
                <Icon name="SparklesIcon" className="w-3.5 h-3.5" />
                <span>{perfume.family}</span>
              </div>

              <h2 className="text-2xl sm:text-3xl font-serif tracking-wider uppercase text-[#F5F5F0]">
                {perfume.name}
              </h2>
              <p className="text-xs text-[#A0A098] italic tracking-wide mt-1">
                "{perfume.subtitle}"
              </p>
            </div>

            {/* Price & Rating */}
            <div className="flex items-center justify-between border-y border-white/10 py-3">
              <div>
                <span className="text-2xl font-serif text-[#D4AF37] font-semibold">
                  Rs. {activePrice.toLocaleString("en-IN")}
                </span>
                <span className="text-xs text-[#888] font-mono ml-2">INR</span>
              </div>

              <div className="flex items-center gap-1.5 text-xs text-[#E6C687]">
                <Icon name="StarIcon" className="w-4 h-4 text-[#D4AF37]" />
                <span className="font-semibold">{perfume.rating}</span>
                <span className="text-[#777]">({perfume.reviewsCount} reviews)</span>
              </div>
            </div>

            {/* Description */}
            <p className="text-xs text-[#C5C5C0] leading-relaxed font-light">
              {perfume.description}
            </p>

            {/* Volume Selector */}
            <div>
              <label className="block text-[11px] uppercase tracking-wider text-[#A0A098] font-semibold mb-2">
                Select Bottle Volume
              </label>
              <div className="grid grid-cols-3 gap-3">
                {perfume.volumes.map((v) => (
                  <button
                    key={v.ml}
                    onClick={() => setSelectedMl(v.ml)}
                    className={`py-3 px-3 border text-center transition-all ${
                      selectedMl === v.ml
                        ? "border-[#D4AF37] bg-[#D4AF37]/10 text-[#D4AF37]"
                        : "border-white/15 bg-white/5 text-[#C5C5C0] hover:border-white/30"
                    }`}
                  >
                    <span className="block text-sm font-serif font-bold">{v.ml} ml</span>
                    <span className="text-[10px] text-[#888] font-mono">Rs. {v.price.toLocaleString("en-IN")}</span>
                  </button>
                ))}
              </div>
            </div>

            {/* Longevity & Sillage Gauges */}
            <div className="grid grid-cols-2 gap-4 bg-[#18181D] p-3 border border-white/5 text-xs">
              <div>
                <span className="text-[10px] text-[#888] uppercase tracking-wider block">Longevity</span>
                <span className="text-[#F5F5F0] font-semibold flex items-center gap-1">
                  <Icon name="Clock01Icon" className="w-3.5 h-3.5 text-[#D4AF37]" />
                  {perfume.longevity}
                </span>
              </div>
              <div>
                <span className="text-[10px] text-[#888] uppercase tracking-wider block">Sillage Aura</span>
                <span className="text-[#F5F5F0] font-semibold flex items-center gap-1">
                  <Icon name="SparklesIcon" className="w-3.5 h-3.5 text-[#D4AF37]" />
                  {perfume.sillage}
                </span>
              </div>
            </div>

            {/* Add to Cart CTA */}
            <button
              onClick={() => {
                onAddToCart(perfume, selectedMl, activePrice);
                onClose();
              }}
              className="w-full py-4 bg-gradient-to-r from-[#D4AF37] to-[#E6C687] text-[#0A0A0B] font-bold text-xs uppercase tracking-[0.25em] hover:brightness-110 transition-all shadow-xl flex items-center justify-center gap-2"
            >
              <Icon name="ShoppingBag01Icon" className="w-4 h-4" />
              <span>Add {selectedMl}ml Bottle to Coffer</span>
            </button>

            {/* Olfactory Pyramid Accordion Preview */}
            <FragrancePyramid pyramid={perfume.pyramid} />

          </div>

        </div>

      </div>
    </div>
  );
}
