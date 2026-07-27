"use client";

import { useState } from "react";
import { CartItem } from "@/types/perfume";
import { Icon } from "@/components/ui/icon";

interface CartDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  items: CartItem[];
  onUpdateQuantity: (id: string, ml: number, delta: number) => void;
  onRemoveItem: (id: string, ml: number) => void;
}

export function CartDrawer({
  isOpen,
  onClose,
  items,
  onUpdateQuantity,
  onRemoveItem,
}: CartDrawerProps) {
  const [selectedSample, setSelectedSample] = useState<string>("Oud Impérial (2ml Vial)");
  const [isGiftWrapped, setIsGiftWrapped] = useState<boolean>(true);

  if (!isOpen) return null;

  const subtotal = items.reduce((acc, item) => acc + item.price * item.quantity, 0);
  const freeShippingThreshold = 20000;
  const progressPercent = Math.min(100, (subtotal / freeShippingThreshold) * 100);
  const amountLeft = Math.max(0, freeShippingThreshold - subtotal);
  const shippingFee = amountLeft === 0 ? 0 : 500;

  return (
    <div className="fixed inset-0 z-50 overflow-hidden animate-in fade-in duration-300">
      
      {/* Backdrop */}
      <div 
        onClick={onClose} 
        className="absolute inset-0 bg-black/75 backdrop-blur-sm transition-opacity" 
      />

      <div className="fixed inset-y-0 right-0 max-w-full flex pl-10">
        <div className="w-screen max-w-md bg-[#0F0F12] border-l border-white/10 text-[#F5F5F0] flex flex-col justify-between shadow-2xl">
          
          {/* Top Header */}
          <div className="p-6 border-b border-white/10 flex items-center justify-between bg-[#141418]">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-full bg-[#D4AF37]/10 border border-[#D4AF37]/30 text-[#D4AF37]">
                <Icon name="ShoppingBag01Icon" className="w-5 h-5" />
              </div>
              <div>
                <h2 className="text-base font-serif tracking-[0.2em] uppercase font-light text-[#F5F5F0]">
                  Your Velvet Coffer
                </h2>
                <p className="text-[10px] text-[#A0A098] uppercase tracking-wider">
                  {items.length} Fragrance{items.length !== 1 && "s"} Selected
                </p>
              </div>
            </div>

            <button
              onClick={onClose}
              className="text-[#888880] hover:text-[#D4AF37] p-1.5 transition-colors"
            >
              <Icon name="Cancel01Icon" className="w-5 h-5" />
            </button>
          </div>

          {/* Free Shipping & Discovery Vial Progress Bar */}
          <div className="bg-[#18181D] px-6 py-3.5 border-b border-white/5 space-y-2">
            <div className="flex items-center justify-between text-[11px] tracking-wider uppercase">
              <span className="text-[#C5C5C0] flex items-center gap-1.5">
                <Icon name="SparklesIcon" className="w-3.5 h-3.5 text-[#D4AF37]" />
                {amountLeft === 0
                  ? "Eligible for Free Worldwide Express Shipping!"
                  : `Add Rs. ${amountLeft.toLocaleString("en-IN")} more for Free Express Delivery`}
              </span>
              <span className="text-[#D4AF37] font-semibold">{Math.round(progressPercent)}%</span>
            </div>
            <div className="w-full h-1.5 bg-white/10 rounded-full overflow-hidden">
              <div
                className="h-full bg-gradient-to-r from-[#D4AF37] to-[#E6C687] transition-all duration-500"
                style={{ width: `${progressPercent}%` }}
              />
            </div>
          </div>

          {/* Items List */}
          <div className="flex-1 overflow-y-auto p-6 space-y-6 divide-y divide-white/5">
            {items.length === 0 ? (
              <div className="h-64 flex flex-col items-center justify-center text-center space-y-3">
                <Icon name="ShoppingBag01Icon" className="w-12 h-12 text-[#444] stroke-1" />
                <p className="text-xs uppercase tracking-widest text-[#888880]">Your coffer is currently empty</p>
                <button
                  onClick={onClose}
                  className="px-6 py-2.5 border border-[#D4AF37] text-[#D4AF37] text-xs uppercase tracking-widest hover:bg-[#D4AF37] hover:text-[#0A0A0B] transition-colors"
                >
                  Explore Olfactory Collection
                </button>
              </div>
            ) : (
              items.map((item) => (
                <div key={`${item.perfume.id}-${item.selectedMl}`} className="pt-6 first:pt-0 flex gap-4">
                  {/* Thumbnail */}
                  <img
                    src={item.perfume.images[0]}
                    alt={item.perfume.name}
                    className="w-20 h-24 object-cover bg-[#0A0A0B] border border-white/10 shrink-0"
                  />

                  {/* Item info */}
                  <div className="flex-1 space-y-1.5">
                    <div className="flex items-start justify-between">
                      <h4 className="text-sm font-serif tracking-wider text-[#F5F5F0]">
                        {item.perfume.name}
                      </h4>
                      <button
                        onClick={() => onRemoveItem(item.perfume.id, item.selectedMl)}
                        className="text-[#666] hover:text-red-400 p-1"
                      >
                        <Icon name="Delete01Icon" className="w-4 h-4" />
                      </button>
                    </div>

                    <p className="text-[10px] uppercase tracking-widest text-[#D4AF37]">
                      {item.selectedMl}ml Bottle • {item.perfume.concentration.split(" ")[0]}
                    </p>

                    <div className="flex items-center justify-between pt-2">
                      {/* Quantity buttons */}
                      <div className="flex items-center border border-white/15 bg-[#18181D]">
                        <button
                          onClick={() => onUpdateQuantity(item.perfume.id, item.selectedMl, -1)}
                          className="px-2.5 py-1 text-[#888] hover:text-white"
                        >
                          <Icon name="MinusSignIcon" className="w-3 h-3" />
                        </button>
                        <span className="px-3 text-xs font-mono text-white">{item.quantity}</span>
                        <button
                          onClick={() => onUpdateQuantity(item.perfume.id, item.selectedMl, 1)}
                          className="px-2.5 py-1 text-[#888] hover:text-white"
                        >
                          <Icon name="PlusSignIcon" className="w-3 h-3" />
                        </button>
                      </div>

                      <span className="text-sm font-serif font-semibold text-[#E6C687]">
                        Rs. {(item.price * item.quantity).toLocaleString("en-IN")}
                      </span>
                    </div>
                  </div>
                </div>
              ))
            )}

            {/* Complimentary Discovery Sample Picker */}
            {items.length > 0 && (
              <div className="pt-6 space-y-3">
                <div className="flex items-center justify-between text-xs uppercase tracking-wider text-[#E6C687]">
                  <span className="flex items-center gap-1.5 font-semibold">
                    <Icon name="SparklesIcon" className="w-4 h-4 text-[#D4AF37]" />
                    Complimentary Discovery Vial
                  </span>
                  <span className="text-[10px] px-2 py-0.5 bg-[#D4AF37]/10 text-[#D4AF37]">FREE</span>
                </div>

                <select
                  value={selectedSample}
                  onChange={(e) => setSelectedSample(e.target.value)}
                  className="w-full bg-[#18181D] border border-white/15 text-xs text-[#C5C5C0] p-2.5 outline-none focus:border-[#D4AF37]"
                >
                  <option value="Oud Impérial (2ml Vial)">Oud Impérial Extrait (2ml Vial)</option>
                  <option value="Soleil de Santal (2ml Vial)">Soleil de Santal EDP (2ml Vial)</option>
                  <option value="Fleur de Cythère (2ml Vial)">Fleur de Cythère Neroli (2ml Vial)</option>
                </select>

                <div className="flex items-center gap-2 pt-2">
                  <input
                    type="checkbox"
                    id="giftWrap"
                    checked={isGiftWrapped}
                    onChange={(e) => setIsGiftWrapped(e.target.checked)}
                    className="accent-[#D4AF37] w-4 h-4 cursor-pointer"
                  />
                  <label htmlFor="giftWrap" className="text-xs text-[#B5B5A8] cursor-pointer flex items-center gap-1.5">
                    <Icon name="GiftIcon" className="w-4 h-4 text-[#D4AF37]" />
                    <span>Complimentary Signature Black Velvet Gift Packaging</span>
                  </label>
                </div>
              </div>
            )}
          </div>

          {/* Bottom Checkout Section */}
          {items.length > 0 && (
            <div className="p-6 bg-[#141418] border-t border-white/10 space-y-4">
              <div className="space-y-1.5 text-xs uppercase tracking-wider text-[#A0A098]">
                <div className="flex justify-between">
                  <span>Subtotal</span>
                  <span className="text-white font-mono font-medium">Rs. {subtotal.toLocaleString("en-IN")}</span>
                </div>
                <div className="flex justify-between">
                  <span>Estimated Shipping</span>
                  <span className="text-[#D4AF37]">
                    {shippingFee === 0 ? "FREE" : `Rs. ${shippingFee}`}
                  </span>
                </div>
                <div className="flex justify-between text-sm text-[#F5F5F0] font-serif font-bold pt-2 border-t border-white/10">
                  <span>Total Due</span>
                  <span className="text-[#D4AF37]">Rs. {(subtotal + shippingFee).toLocaleString("en-IN")}</span>
                </div>
              </div>

              <button
                onClick={() => alert("Simulating checkout process...")}
                className="w-full py-4 bg-gradient-to-r from-[#D4AF37] to-[#E6C687] text-[#0A0A0B] font-bold text-xs uppercase tracking-[0.25em] hover:brightness-110 transition-all shadow-xl flex items-center justify-center gap-2 group"
              >
                <span>Proceed to Secure Checkout</span>
                <Icon name="ArrowRight01Icon" className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </button>
            </div>
          )}

        </div>
      </div>
    </div>
  );
}
