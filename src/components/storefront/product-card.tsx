"use client";

import { Perfume } from "@/types/perfume";
import { Icon } from "@/components/ui/icon";

interface ProductCardProps {
  perfume: Perfume;
  onQuickView: (perfume: Perfume) => void;
  onAddToCart: (perfume: Perfume) => void;
}

export function ProductCard({ perfume, onQuickView, onAddToCart }: ProductCardProps) {
  return (
    <div className="group relative bg-[#121215] border border-white/10 hover:border-[#D4AF37]/50 transition-all duration-500 flex flex-col justify-between overflow-hidden">
      
      {/* Top Image Container */}
      <div className="relative aspect-[3/4] overflow-hidden bg-[#0A0A0B] cursor-pointer" onClick={() => onQuickView(perfume)}>
        
        <img
          src={perfume.images[0]}
          alt={perfume.name}
          className="w-full h-full object-cover group-hover:scale-108 transition-transform duration-700 ease-out"
        />

        {/* Dark Vignette Overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-[#121215] via-transparent to-black/30" />

        {/* Badges */}
        <div className="absolute top-3 left-3 flex flex-col gap-1.5 z-10">
          {perfume.isLimitedEdition && (
            <span className="px-2.5 py-1 bg-[#D4AF37] text-[#0A0A0B] text-[9px] font-bold uppercase tracking-[0.2em] shadow-lg">
              Limited Harvest
            </span>
          )}
          {perfume.isBestseller && (
            <span className="px-2.5 py-1 bg-[#1A1A1E]/90 text-[#E6C687] border border-[#D4AF37]/40 text-[9px] font-bold uppercase tracking-[0.2em] backdrop-blur-md">
              Bestseller
            </span>
          )}
        </div>

        {/* Wishlist Button */}
        <button
          type="button"
          onClick={(e) => { e.stopPropagation(); }}
          className="absolute top-3 right-3 p-2 rounded-full bg-black/40 text-white/80 hover:text-[#D4AF37] hover:bg-black/80 transition-colors z-10 backdrop-blur-sm"
          aria-label="Add to Wishlist"
        >
          <Icon name="FavouriteIcon" className="w-4 h-4" />
        </button>

        {/* Quick View Hover Button */}
        <div className="absolute inset-x-4 bottom-4 z-20 opacity-0 group-hover:opacity-100 transition-all duration-300 transform translate-y-2 group-hover:translate-y-0">
          <button
            onClick={(e) => {
              e.stopPropagation();
              onQuickView(perfume);
            }}
            className="w-full py-2.5 bg-[#0A0A0B]/90 border border-[#D4AF37] text-[#D4AF37] text-xs font-semibold uppercase tracking-[0.2em] backdrop-blur-md hover:bg-[#D4AF37] hover:text-[#0A0A0B] transition-colors flex items-center justify-center gap-2"
          >
            <Icon name="ViewIcon" className="w-4 h-4" />
            <span>Quick Olfactory View</span>
          </button>
        </div>
      </div>

      {/* Card Details */}
      <div className="p-5 space-y-3 flex-1 flex flex-col justify-between">
        
        <div>
          {/* Family & Concentration */}
          <div className="flex items-center justify-between text-[10px] uppercase tracking-[0.2em] text-[#D4AF37] font-medium mb-1">
            <span>{perfume.family}</span>
            <span>{perfume.volumes[1]?.ml || 50}ml</span>
          </div>

          {/* Title & Subtitle */}
          <h3 
            onClick={() => onQuickView(perfume)}
            className="text-base font-serif tracking-wider text-[#F5F5F0] group-hover:text-[#D4AF37] transition-colors cursor-pointer line-clamp-1"
          >
            {perfume.name}
          </h3>

          <p className="text-xs text-[#888880] line-clamp-1 mt-0.5 font-light">
            {perfume.subtitle}
          </p>

          {/* Key Notes preview */}
          <div className="mt-2.5 flex flex-wrap gap-1">
            {perfume.pyramid.top.slice(0, 2).concat(perfume.pyramid.base.slice(0, 1)).map((note, idx) => (
              <span key={idx} className="text-[10px] px-1.5 py-0.5 bg-white/5 text-[#B5B5A8] border border-white/5">
                {note}
              </span>
            ))}
          </div>
        </div>

        {/* Price & Add to Cart Footer */}
        <div className="pt-3 border-t border-white/10 flex items-center justify-between mt-auto">
          <div>
            <span className="text-xs text-[#888880] block text-[9px] uppercase tracking-wider">Starting at</span>
            <span className="text-base font-serif font-medium text-[#F5F5F0]">
              Rs. {perfume.price.toLocaleString("en-IN")}
            </span>
          </div>

          <button
            onClick={() => onAddToCart(perfume)}
            className="px-3.5 py-2 bg-[#D4AF37]/10 border border-[#D4AF37]/40 text-[#D4AF37] hover:bg-[#D4AF37] hover:text-[#0A0A0B] transition-colors text-xs uppercase tracking-wider font-semibold flex items-center gap-1.5"
          >
            <Icon name="ShoppingBag01Icon" className="w-3.5 h-3.5" />
            <span>Add</span>
          </button>
        </div>

      </div>

    </div>
  );
}
