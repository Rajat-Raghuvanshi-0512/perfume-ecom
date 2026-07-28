"use client";

import { useState } from "react";
import { Perfume } from "@/types/perfume";
import { FragrancePyramid } from "./fragrance-pyramid";
import { Icon } from "@/components/ui/icon";

interface QuickViewModalProps {
  perfume: Perfume | null;
  onClose: () => void;
  onAddToCart: (perfume: Perfume, selectedMl: number, price: number) => void;
  onBuyNow?: (perfume: Perfume, selectedMl: number, price: number) => void;
}

export function QuickViewModal({ perfume, onClose, onAddToCart, onBuyNow }: QuickViewModalProps) {
  if (!perfume) return null;

  const [selectedMl, setSelectedMl] = useState<number>(perfume.volumes[1]?.ml || 50);
  const selectedVolumeObj = perfume.volumes.find((v) => v.ml === selectedMl) || perfume.volumes[0];
  const activePrice = selectedVolumeObj.price;
  const [activeImgIndex, setActiveImgIndex] = useState<number>(0);
  const [isBuyLoading, setIsBuyLoading] = useState<boolean>(false);

  const handleBuyNow = async () => {
    setIsBuyLoading(true);
    try {
      if (onBuyNow) {
        onBuyNow(perfume, selectedMl, activePrice);
      } else {
        onAddToCart(perfume, selectedMl, activePrice);
      }
    } finally {
      setTimeout(() => setIsBuyLoading(false), 800);
      onClose();
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/85 backdrop-blur-md animate-in fade-in duration-200">
      <div className="relative w-full max-w-4xl max-h-[92vh] overflow-y-auto bg-[#121215] border border-[#D4AF37]/40 shadow-2xl rounded-none text-[#F5F5F0]">
        
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 z-20 p-2 text-[#888] hover:text-[#D4AF37] bg-black/60 rounded-full transition-colors border border-white/10"
        >
          <Icon name="Cancel01Icon" className="w-5 h-5" />
        </button>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 sm:gap-8 p-4 sm:p-8">
          
          {/* Left Column: Image Gallery */}
          <div className="space-y-4">
            <div className="relative aspect-[3/4] max-h-80 sm:max-h-none overflow-hidden bg-[#0A0A0B] border border-white/10">
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
              <div className="flex gap-2">
                {perfume.images.map((img, idx) => (
                  <button
                    key={idx}
                    onClick={() => setActiveImgIndex(idx)}
                    className={`w-14 h-16 border ${
                      activeImgIndex === idx ? "border-[#D4AF37]" : "border-white/10 opacity-60"
                    } overflow-hidden`}
                  >
                    <img src={img} alt="Thumbnail" className="w-full h-full object-cover" />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Right Column: Perfume Spec & Dual CTA */}
          <div className="space-y-5">
            
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
            <p className="text-xs text-[#C5C5C0] leading-relaxed font-light line-clamp-3">
              {perfume.description}
            </p>

            {/* Volume Selector */}
            <div>
              <label className="block text-[11px] uppercase tracking-wider text-[#A0A098] font-semibold mb-2">
                Select Bottle Volume
              </label>
              <div className="grid grid-cols-3 gap-2.5">
                {perfume.volumes.map((v) => (
                  <button
                    key={v.ml}
                    onClick={() => setSelectedMl(v.ml)}
                    className={`py-2.5 px-2 border text-center transition-all ${
                      selectedMl === v.ml
                        ? "border-[#D4AF37] bg-[#D4AF37]/15 text-[#D4AF37] font-bold"
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
            <div className="grid grid-cols-2 gap-3 bg-[#18181D] p-3 border border-white/5 text-xs">
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

            {/* Dual CTAs: Add to Cart & Instant Buy Now */}
            <div className="grid grid-cols-2 gap-3 pt-2">
              <button
                onClick={() => {
                  onAddToCart(perfume, selectedMl, activePrice);
                  onClose();
                }}
                className="py-3.5 px-3 bg-white/5 border border-[#D4AF37]/50 text-[#D4AF37] font-semibold text-xs uppercase tracking-wider hover:bg-[#D4AF37]/20 transition-all flex items-center justify-center gap-2"
              >
                <Icon name="ShoppingBag01Icon" className="w-4 h-4" />
                <span>Add to Cart</span>
              </button>

              <button
                onClick={handleBuyNow}
                disabled={isBuyLoading}
                className="py-3.5 px-3 bg-[#D4AF37] hover:bg-[#E6C687] text-[#0A0A0B] font-bold text-xs uppercase tracking-wider transition-all shadow-xl flex items-center justify-center gap-2 disabled:opacity-50"
              >
                <Icon name="FlashIcon" className="w-4 h-4 fill-current" />
                <span>{isBuyLoading ? "Express Checkout..." : "Buy Now"}</span>
              </button>
            </div>

            {/* Olfactory Pyramid Accordion Preview */}
            <FragrancePyramid pyramid={perfume.pyramid} />

          </div>

        </div>

      </div>
    </div>
  );
}
