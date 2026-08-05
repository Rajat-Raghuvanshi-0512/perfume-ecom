"use client";

import { useState } from "react";
import Link from "next/link";
import { Perfume } from "@/types/perfume";
import { Icon } from "@/components/ui/icon";

interface ProductCardProps {
  perfume: Perfume;
  onQuickView: (perfume: Perfume) => void;
  onAddToCart: (perfume: Perfume, volumeMl: number, price: number) => void;
  onBuyNow?: (perfume: Perfume, volumeMl: number, price: number) => void;
}

export function ProductCard({ perfume, onQuickView, onAddToCart, onBuyNow }: ProductCardProps) {
  // Volume selection state (default 50ml or first volume)
  const defaultVolumeIndex = perfume.volumes.length > 1 ? 1 : 0;
  const [selectedMl, setSelectedMl] = useState<number>(perfume.volumes[defaultVolumeIndex]?.ml || 50);
  const [isBuyLoading, setIsBuyLoading] = useState(false);

  const selectedVolumeObj = perfume.volumes.find((v) => v.ml === selectedMl) || perfume.volumes[0];
  const activePrice = selectedVolumeObj ? selectedVolumeObj.price : perfume.price;

  const handleBuyNowClick = async (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsBuyLoading(true);
    try {
      if (onBuyNow) {
        onBuyNow(perfume, selectedMl, activePrice);
      } else {
        // Fallback: Add to cart and open
        onAddToCart(perfume, selectedMl, activePrice);
      }
    } finally {
      setTimeout(() => setIsBuyLoading(false), 800);
    }
  };

  return (
    <div className="group relative bg-[#121215] border border-white/10 hover:border-[#D4AF37]/60 transition-all duration-300 flex flex-col justify-between overflow-hidden shadow-xl">
      
      {/* Top Image Container (Compact on mobile) */}
      <div className="relative aspect-square sm:aspect-[3/4] overflow-hidden bg-[#0A0A0B] block group">
        <Link href={`/products/${perfume.id}`} className="block w-full h-full">
          <img
            src={perfume.images[0]}
            alt={perfume.name}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500 ease-out"
          />
          {/* Subtle Overlay */}
          <div className="absolute inset-0 bg-gradient-to-t from-[#121215] via-transparent to-black/30" />
        </Link>

        {/* Badges */}
        <div className="absolute top-2.5 left-2.5 flex flex-col gap-1 z-10 pointer-events-none">
          {perfume.isLimitedEdition && (
            <span className="px-2 py-0.5 bg-[#D4AF37] text-[#0A0A0B] text-[8px] sm:text-[9px] font-bold uppercase tracking-[0.15em] shadow-md">
              Limited Edition
            </span>
          )}
          {perfume.isBestseller && (
            <span className="px-2 py-0.5 bg-[#1A1A1E]/90 text-[#E6C687] border border-[#D4AF37]/40 text-[8px] sm:text-[9px] font-bold uppercase tracking-[0.15em] backdrop-blur-md">
              Bestseller
            </span>
          )}
        </div>

        {/* Quick View Icon Button (Always visible on mobile, hover on desktop) */}
        <div className="absolute top-2.5 right-2.5 z-20 flex items-center gap-1">
          <button
            type="button"
            onClick={(e) => {
              e.preventDefault();
              e.stopPropagation();
              onQuickView(perfume);
            }}
            className="p-2 rounded-full bg-black/60 text-[#D4AF37] hover:bg-[#D4AF37] hover:text-[#0A0A0B] transition-all backdrop-blur-md border border-white/10"
            title="Quick View"
            aria-label="Quick View"
          >
            <Icon name="ViewIcon" className="w-3.5 h-3.5" />
          </button>
        </div>

        {/* Floating Olfactory Notes Preview */}
        <div className="absolute bottom-2 left-2 right-2 z-10 flex flex-wrap gap-1 pointer-events-none">
          {perfume.pyramid.top.slice(0, 2).map((note, idx) => (
            <span key={idx} className="text-[9px] px-1.5 py-0.5 bg-black/70 text-[#D4AF37] border border-[#D4AF37]/20 backdrop-blur-md">
              {note}
            </span>
          ))}
        </div>
      </div>

      {/* Card Details & Actions */}
      <div className="p-2.5 sm:p-4 space-y-2 sm:space-y-3 flex-1 flex flex-col justify-between">
        
        <div>
          {/* Family & Concentration */}
          <div className="flex items-center justify-between text-[9px] uppercase tracking-[0.15em] sm:tracking-[0.18em] text-[#D4AF37] font-semibold mb-1">
            <span className="truncate max-w-[90px] sm:max-w-none">{perfume.family}</span>
            <span className="text-[#888880] font-mono text-[8px] sm:text-[9px]">{perfume.concentration.split(" ")[0]}</span>
          </div>

          {/* Title & Subtitle */}
          <Link href={`/products/${perfume.id}`} className="block group-hover:text-[#D4AF37] transition-colors">
            <h3 className="text-xs sm:text-base font-serif tracking-wider text-[#F5F5F0] font-medium line-clamp-1">
              {perfume.name}
            </h3>
            <p className="text-[10px] sm:text-[11px] text-[#A0A098] line-clamp-1 font-light italic mt-0.5">
              "{perfume.subtitle}"
            </p>
          </Link>

          {/* Volume Selector Pills (Instant size picking) */}
          <div className="mt-2 flex flex-wrap items-center gap-1">
            <span className="text-[8px] sm:text-[9px] uppercase tracking-widest text-[#777770]">Size:</span>
            <div className="flex flex-wrap items-center gap-1">
              {perfume.volumes.map((vol) => (
                <button
                  key={vol.ml}
                  type="button"
                  onClick={() => setSelectedMl(vol.ml)}
                  className={`px-1.5 py-0.5 text-[9px] sm:text-[10px] font-mono transition-all rounded-none border ${
                    selectedMl === vol.ml
                      ? "bg-[#D4AF37] text-[#0A0A0B] border-[#D4AF37] font-bold shadow-sm"
                      : "bg-white/5 text-[#B5B5A8] border-white/10 hover:border-[#D4AF37]/40"
                  }`}
                >
                  {vol.ml}ml
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Price & Dual Instant Action Buttons */}
        <div className="pt-2 border-t border-white/10 space-y-1.5 mt-auto">
          
          {/* Price & Rating Display */}
          <div className="flex items-baseline justify-between">
            <div>
              <span className="text-[8px] sm:text-[9px] text-[#888880] uppercase tracking-wider block">Price</span>
              <span className="text-xs sm:text-base font-serif font-bold text-[#D4AF37]">
                Rs. {activePrice.toLocaleString("en-IN")}
              </span>
            </div>

            <div className="flex items-center gap-0.5 text-[9px] sm:text-[10px] text-[#E6C687]">
              <Icon name="StarIcon" className="w-3 h-3 text-[#D4AF37]" />
              <span className="font-semibold">{perfume.rating}</span>
            </div>
          </div>

          {/* Action Buttons: Instant Buy Now & Add to Cart */}
          <div className="grid grid-cols-2 gap-1 pt-0.5">
            
            {/* ADD TO CART */}
            <button
              type="button"
              onClick={() => onAddToCart(perfume, selectedMl, activePrice)}
              className="w-full h-8 sm:h-10 px-1 bg-white/5 hover:bg-[#D4AF37]/20 border border-[#D4AF37]/50 text-[#D4AF37] transition-all text-[9px] sm:text-xs uppercase tracking-wider font-semibold flex items-center justify-center gap-0.5 sm:gap-1 active:scale-95 touch-manipulation"
              aria-label="Add to cart"
            >
              <Icon name="ShoppingBag01Icon" className="w-3 h-3 sm:w-3.5 sm:h-3.5 shrink-0" />
              <span>Add</span>
            </button>

            {/* DIRECT BUY NOW */}
            <button
              type="button"
              onClick={handleBuyNowClick}
              disabled={isBuyLoading}
              className="w-full h-8 sm:h-10 px-1 bg-[#D4AF37] hover:bg-[#E6C687] text-[#0A0A0B] transition-all text-[9px] sm:text-xs uppercase tracking-wider font-bold flex items-center justify-center gap-0.5 sm:gap-1 shadow-md active:scale-95 disabled:opacity-50 touch-manipulation"
              aria-label="Buy Now"
            >
              <Icon name="FlashIcon" className="w-3 h-3 sm:w-3.5 sm:h-3.5 shrink-0 fill-current" />
              <span>{isBuyLoading ? "Express..." : "Buy Now"}</span>
            </button>

          </div>

        </div>

      </div>

    </div>
  );
}
