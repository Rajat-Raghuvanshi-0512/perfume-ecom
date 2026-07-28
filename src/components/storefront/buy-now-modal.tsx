"use client";

import { useState, useEffect } from "react";
import { Perfume } from "@/types/perfume";
import { Icon } from "@/components/ui/icon";
import { getUserAddresses, createAddress, AddressInput } from "@/actions/address";
import { createExpressBuyNowSession } from "@/actions/checkout";
import { toast } from "@/components/ui/toast";
import { AddressFormModal } from "./address-form-modal";

interface AddressItem {
  id: string;
  fullName: string;
  phone: string;
  streetAddress: string;
  apartment?: string | null;
  city: string;
  state: string;
  postalCode: string;
  country: string;
  isDefault: boolean;
}

interface BuyNowModalProps {
  isOpen: boolean;
  onClose: () => void;
  perfume: Perfume | null;
  selectedMl: number;
  price: number;
}

export function BuyNowModal({
  isOpen,
  onClose,
  perfume,
  selectedMl,
  price,
}: BuyNowModalProps) {
  const [addresses, setAddresses] = useState<AddressItem[]>([]);
  const [selectedAddressId, setSelectedAddressId] = useState<string | null>(null);
  const [loadingAddresses, setLoadingAddresses] = useState(true);
  const [isCheckoutLoading, setIsCheckoutLoading] = useState(false);

  // Quick Inline Address state if user has 0 saved addresses
  const [inlineAddress, setInlineAddress] = useState<AddressInput>({
    fullName: "",
    phone: "",
    streetAddress: "",
    apartment: "",
    city: "",
    state: "",
    postalCode: "",
    country: "India",
    isDefault: true,
  });

  // Modal to add additional address
  const [showAddAddressModal, setShowAddAddressModal] = useState(false);

  const fetchAddresses = async () => {
    setLoadingAddresses(true);
    const res = await getUserAddresses();
    if (res.success && res.addresses) {
      setAddresses(res.addresses as AddressItem[]);
      const defaultAddr = res.addresses.find((a: any) => a.isDefault) || res.addresses[0];
      if (defaultAddr) {
        setSelectedAddressId(defaultAddr.id);
      }
    }
    setLoadingAddresses(false);
  };

  useEffect(() => {
    if (isOpen) {
      fetchAddresses();
    }
  }, [isOpen]);

  if (!isOpen || !perfume) return null;

  const handleInlineAddressSubmitAndPay = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsCheckoutLoading(true);

    try {
      // Create address first
      const addRes = await createAddress(inlineAddress);
      if (!addRes.success || !addRes.address) {
        toast.add({
          title: "Address Error",
          description: addRes.error || "Failed to save shipping address.",
          type: "error",
        });
        setIsCheckoutLoading(false);
        return;
      }

      const savedAddr = addRes.address;
      // Proceed to Stripe checkout with this newly created address
      const checkoutRes = await createExpressBuyNowSession(
        perfume.id,
        perfume.name,
        selectedMl,
        price,
        true,
        {
          fullName: savedAddr.fullName,
          phone: savedAddr.phone,
          streetAddress: savedAddr.streetAddress,
          apartment: savedAddr.apartment,
          city: savedAddr.city,
          state: savedAddr.state,
          postalCode: savedAddr.postalCode,
          country: savedAddr.country,
        }
      );

      if (checkoutRes.success && checkoutRes.url) {
        toast.add({
          title: "Order Initialized",
          description: "Redirecting to payment portal...",
          type: "info",
        });
        window.location.href = checkoutRes.url;
      } else {
        toast.add({
          title: "Payment Error",
          description: checkoutRes.error || "Failed to start payment gateway.",
          type: "error",
        });
        setIsCheckoutLoading(false);
      }
    } catch (err: any) {
      toast.add({
        title: "Error",
        description: err.message || "Checkout failed",
        type: "error",
      });
      setIsCheckoutLoading(false);
    }
  };

  const handleProceedWithSelectedAddress = async () => {
    const chosenAddress = addresses.find((a) => a.id === selectedAddressId);
    if (!chosenAddress) {
      toast.add({
        title: "Select Address",
        description: "Please select or add a shipping address.",
        type: "error",
      });
      return;
    }

    setIsCheckoutLoading(true);
    try {
      const checkoutRes = await createExpressBuyNowSession(
        perfume.id,
        perfume.name,
        selectedMl,
        price,
        true,
        {
          fullName: chosenAddress.fullName,
          phone: chosenAddress.phone,
          streetAddress: chosenAddress.streetAddress,
          apartment: chosenAddress.apartment,
          city: chosenAddress.city,
          state: chosenAddress.state,
          postalCode: chosenAddress.postalCode,
          country: chosenAddress.country,
        }
      );

      if (checkoutRes.success && checkoutRes.url) {
        toast.add({
          title: "Express Checkout",
          description: "Connecting to payment gateway...",
          type: "info",
        });
        window.location.href = checkoutRes.url;
      } else {
        toast.add({
          title: "Payment Error",
          description: checkoutRes.error || "Failed to initialize payment.",
          type: "error",
        });
        setIsCheckoutLoading(false);
      }
    } catch (err: any) {
      toast.add({
        title: "Error",
        description: err.message || "An unexpected error occurred",
        type: "error",
      });
      setIsCheckoutLoading(false);
    }
  };

  return (
    <>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md animate-in fade-in duration-200">
        <div className="relative w-full max-w-xl bg-[#121215] border border-[#D4AF37]/30 shadow-2xl overflow-hidden rounded-sm flex flex-col max-h-[90vh]">
          
          {/* Header Banner */}
          <div className="h-1 w-full bg-gradient-to-r from-transparent via-[#D4AF37] to-transparent" />
          
          <div className="p-5 border-b border-white/10 flex items-center justify-between bg-[#0D0D0F]">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-full bg-[#D4AF37]/10 border border-[#D4AF37]/40 flex items-center justify-center text-[#D4AF37]">
                <Icon name="FlashIcon" className="w-4 h-4 fill-current" />
              </div>
              <div>
                <h2 className="text-base font-serif text-[#F5F5F0] tracking-wider uppercase">
                  Direct Buy Now
                </h2>
                <p className="text-[11px] text-[#A0A098]">
                  Confirm delivery address & proceed straight to payment.
                </p>
              </div>
            </div>
            <button
              onClick={onClose}
              className="p-1.5 text-[#A0A098] hover:text-[#D4AF37] transition-colors"
              aria-label="Close"
            >
              <Icon name="Cancel01Icon" className="w-5 h-5" />
            </button>
          </div>

          {/* Selected Item Brief Summary */}
          <div className="p-4 bg-[#18181C] border-b border-white/10 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-12 h-14 bg-[#0A0A0B] border border-white/10 overflow-hidden shrink-0">
                <img
                  src={perfume.images[0]}
                  alt={perfume.name}
                  className="w-full h-full object-cover"
                />
              </div>
              <div>
                <span className="text-[9px] uppercase tracking-widest text-[#D4AF37] font-semibold block">
                  Single Item Purchase
                </span>
                <h4 className="text-sm font-serif font-medium text-[#F5F5F0] line-clamp-1">
                  {perfume.name}
                </h4>
                <p className="text-xs text-[#A0A098] font-mono mt-0.5">
                  Size: <span className="text-[#E6C687]">{selectedMl}ml</span> | Incl. Luxury Sample Vial
                </p>
              </div>
            </div>

            <div className="text-right">
              <span className="text-[9px] uppercase tracking-widest text-[#888880] block">
                Total Price
              </span>
              <span className="text-base font-serif font-bold text-[#D4AF37]">
                Rs. {price.toLocaleString("en-IN")}
              </span>
            </div>
          </div>

          {/* Content Body */}
          <div className="p-5 overflow-y-auto flex-1 space-y-4">
            
            {loadingAddresses ? (
              <div className="py-10 text-center text-xs text-[#A0A098] flex items-center justify-center gap-2">
                <Icon name="Loading01Icon" className="w-4 h-4 animate-spin text-[#D4AF37]" />
                <span>Loading destination addresses...</span>
              </div>
            ) : addresses.length === 0 ? (
              /* NO SAVED ADDRESSES -> INLINE FORM */
              <form onSubmit={handleInlineAddressSubmitAndPay} className="space-y-3">
                <div className="bg-[#D4AF37]/10 border border-[#D4AF37]/30 p-3 text-xs text-[#E6C687] flex items-center gap-2">
                  <Icon name="SparklesIcon" className="w-4 h-4 text-[#D4AF37] shrink-0" />
                  <span>Please provide your delivery address to initiate payment.</span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-[10px] uppercase tracking-widest text-[#D4AF37] mb-1">
                      Full Name *
                    </label>
                    <input
                      type="text"
                      required
                      value={inlineAddress.fullName}
                      onChange={(e) => setInlineAddress({ ...inlineAddress, fullName: e.target.value })}
                      placeholder="John Doe"
                      className="w-full bg-[#0A0A0B] border border-white/10 focus:border-[#D4AF37] text-xs text-[#F5F5F0] p-2 outline-none"
                    />
                  </div>

                  <div>
                    <label className="block text-[10px] uppercase tracking-widest text-[#D4AF37] mb-1">
                      Phone Number *
                    </label>
                    <input
                      type="tel"
                      required
                      value={inlineAddress.phone}
                      onChange={(e) => setInlineAddress({ ...inlineAddress, phone: e.target.value })}
                      placeholder="+91 98765 43210"
                      className="w-full bg-[#0A0A0B] border border-white/10 focus:border-[#D4AF37] text-xs text-[#F5F5F0] p-2 outline-none"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-[10px] uppercase tracking-widest text-[#D4AF37] mb-1">
                    Street Address *
                  </label>
                  <input
                    type="text"
                    required
                    value={inlineAddress.streetAddress}
                    onChange={(e) => setInlineAddress({ ...inlineAddress, streetAddress: e.target.value })}
                    placeholder="123 Luxury Way"
                    className="w-full bg-[#0A0A0B] border border-white/10 focus:border-[#D4AF37] text-xs text-[#F5F5F0] p-2 outline-none"
                  />
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-[10px] uppercase tracking-widest text-[#D4AF37] mb-1">
                      City *
                    </label>
                    <input
                      type="text"
                      required
                      value={inlineAddress.city}
                      onChange={(e) => setInlineAddress({ ...inlineAddress, city: e.target.value })}
                      placeholder="Mumbai"
                      className="w-full bg-[#0A0A0B] border border-white/10 focus:border-[#D4AF37] text-xs text-[#F5F5F0] p-2 outline-none"
                    />
                  </div>

                  <div>
                    <label className="block text-[10px] uppercase tracking-widest text-[#D4AF37] mb-1">
                      State *
                    </label>
                    <input
                      type="text"
                      required
                      value={inlineAddress.state}
                      onChange={(e) => setInlineAddress({ ...inlineAddress, state: e.target.value })}
                      placeholder="Maharashtra"
                      className="w-full bg-[#0A0A0B] border border-white/10 focus:border-[#D4AF37] text-xs text-[#F5F5F0] p-2 outline-none"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-[10px] uppercase tracking-widest text-[#D4AF37] mb-1">
                      Postal Code *
                    </label>
                    <input
                      type="text"
                      required
                      value={inlineAddress.postalCode}
                      onChange={(e) => setInlineAddress({ ...inlineAddress, postalCode: e.target.value })}
                      placeholder="400001"
                      className="w-full bg-[#0A0A0B] border border-white/10 focus:border-[#D4AF37] text-xs text-[#F5F5F0] p-2 outline-none"
                    />
                  </div>

                  <div>
                    <label className="block text-[10px] uppercase tracking-widest text-[#D4AF37] mb-1">
                      Country *
                    </label>
                    <input
                      type="text"
                      required
                      value={inlineAddress.country}
                      onChange={(e) => setInlineAddress({ ...inlineAddress, country: e.target.value })}
                      placeholder="India"
                      className="w-full bg-[#0A0A0B] border border-white/10 focus:border-[#D4AF37] text-xs text-[#F5F5F0] p-2 outline-none"
                    />
                  </div>
                </div>

                <div className="pt-3">
                  <button
                    type="submit"
                    disabled={isCheckoutLoading}
                    className="w-full py-3 bg-[#D4AF37] hover:bg-[#E6C687] text-[#0A0A0B] font-bold text-xs uppercase tracking-widest transition-all flex items-center justify-center gap-2 shadow-lg disabled:opacity-50"
                  >
                    <Icon name="FlashIcon" className="w-4 h-4 fill-current" />
                    <span>{isCheckoutLoading ? "Saving & Connecting to Gateway..." : "Save & Proceed to Payment"}</span>
                  </button>
                </div>
              </form>
            ) : (
              /* HAS SAVED ADDRESSES */
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-[10px] uppercase tracking-widest text-[#D4AF37] font-semibold">
                    Select Delivery Destination:
                  </span>
                  <button
                    type="button"
                    onClick={() => setShowAddAddressModal(true)}
                    className="text-xs text-[#D4AF37] hover:underline flex items-center gap-1 font-medium"
                  >
                    <Icon name="Add01Icon" className="w-3.5 h-3.5" />
                    <span>Add New Address</span>
                  </button>
                </div>

                <div className="space-y-2 max-h-56 overflow-y-auto pr-1">
                  {addresses.map((addr) => {
                    const isSelected = selectedAddressId === addr.id;
                    return (
                      <div
                        key={addr.id}
                        onClick={() => setSelectedAddressId(addr.id)}
                        className={`p-3 border transition-all cursor-pointer flex items-start gap-3 ${
                          isSelected
                            ? "bg-[#D4AF37]/10 border-[#D4AF37]"
                            : "bg-[#0A0A0B] border-white/10 hover:border-white/20"
                        }`}
                      >
                        <input
                          type="radio"
                          name="selectedAddress"
                          checked={isSelected}
                          onChange={() => setSelectedAddressId(addr.id)}
                          className="mt-1 accent-[#D4AF37]"
                        />
                        <div className="flex-1 text-xs space-y-0.5">
                          <div className="flex items-center justify-between">
                            <span className="font-semibold text-[#F5F5F0]">
                              {addr.fullName} ({addr.phone})
                            </span>
                            {addr.isDefault && (
                              <span className="text-[9px] uppercase tracking-widest px-1.5 py-0.5 bg-[#D4AF37]/20 border border-[#D4AF37]/40 text-[#D4AF37]">
                                Default
                              </span>
                            )}
                          </div>
                          <p className="text-[#A0A098] line-clamp-1">
                            {addr.streetAddress} {addr.apartment ? `, ${addr.apartment}` : ""}
                          </p>
                          <p className="text-[#A0A098] font-mono text-[11px]">
                            {addr.city}, {addr.state} - {addr.postalCode}, {addr.country}
                          </p>
                        </div>
                      </div>
                    );
                  })}
                </div>

                <div className="pt-3 border-t border-white/10">
                  <button
                    type="button"
                    onClick={handleProceedWithSelectedAddress}
                    disabled={isCheckoutLoading || !selectedAddressId}
                    className="w-full py-3 bg-[#D4AF37] hover:bg-[#E6C687] text-[#0A0A0B] font-bold text-xs uppercase tracking-widest transition-all flex items-center justify-center gap-2 shadow-lg disabled:opacity-50"
                  >
                    <Icon name="FlashIcon" className="w-4 h-4 fill-current" />
                    <span>
                      {isCheckoutLoading
                        ? "Initiating Instant Payment..."
                        : `Proceed to Payment (Rs. ${price.toLocaleString("en-IN")})`}
                    </span>
                  </button>
                </div>
              </div>
            )}

          </div>

        </div>
      </div>

      {/* Auxiliary modal for adding a new address when logged in */}
      <AddressFormModal
        isOpen={showAddAddressModal}
        onClose={() => setShowAddAddressModal(false)}
        onSuccess={() => {
          fetchAddresses();
        }}
      />
    </>
  );
}
