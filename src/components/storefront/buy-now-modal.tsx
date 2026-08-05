"use client";

import { useState, useEffect } from "react";
import { useSession, signIn } from "next-auth/react";
import { Perfume } from "@/types/perfume";
import { Icon } from "@/components/ui/icon";
import { getUserAddresses, createAddress, AddressInput } from "@/actions/address";
import { createExpressBuyNowSession } from "@/actions/checkout";
import { requestMobileOtp, verifyMobileOtp } from "@/actions/auth";
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
  const { data: session } = useSession();
  const [addresses, setAddresses] = useState<AddressItem[]>([]);
  const [selectedAddressId, setSelectedAddressId] = useState<string | null>(null);
  const [loadingAddresses, setLoadingAddresses] = useState(false);
  const [isCheckoutLoading, setIsCheckoutLoading] = useState(false);

  // Auth Mobile OTP States
  const [authStep, setAuthStep] = useState<"phone" | "otp">("phone");
  const [phone, setPhone] = useState("");
  const [otp, setOtp] = useState("");
  const [sentCode, setSentCode] = useState<string | null>(null);
  const [authLoading, setAuthLoading] = useState(false);

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
      if (session?.user) {
        fetchAddresses();
      }
    } else {
      setAuthStep("phone");
      setPhone("");
      setOtp("");
      setSentCode(null);
    }
  }, [isOpen, session]);

  if (!isOpen || !perfume) return null;

  // Auth Handlers
  const handleSendOtp = async (e: React.FormEvent) => {
    e.preventDefault();
    setAuthLoading(true);

    const cleanPhone = phone.replace(/\D/g, "");
    if (cleanPhone.length < 10) {
      setAuthLoading(false);
      return;
    }

    const res = await requestMobileOtp(cleanPhone);
    if (res.success) {
      setSentCode(res.otp || "123456");
      setAuthStep("otp");
    } else {
      toast.add({
        title: "OTP Error",
        description: res.error || "Unable to send verification code.",
        type: "error",
      });
    }
    setAuthLoading(false);
  };

  const handleVerifyOtp = async (e: React.FormEvent) => {
    e.preventDefault();
    setAuthLoading(true);

    const cleanPhone = phone.replace(/\D/g, "");
    const res = await verifyMobileOtp(cleanPhone, otp);

    if (res.success) {
      const authRes = await signIn("credentials", {
        phone: cleanPhone,
        isOtpVerified: "true",
        redirect: false,
      });

      if (authRes?.error) {
        toast.add({
          title: "Sign In Error",
          description: "Could not create session for this number.",
          type: "error",
        });
      } else {
        fetchAddresses();
      }
    } else {
      toast.add({
        title: "Verification Failed",
        description: res.error || "Invalid OTP entered.",
        type: "error",
      });
    }
    setAuthLoading(false);
  };

  const handleInlineAddressSubmitAndPay = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsCheckoutLoading(true);

    try {
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
      <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/85 backdrop-blur-md animate-in fade-in duration-200">
        <div className="relative w-full max-w-xl bg-[#121215] border border-[#D4AF37]/30 shadow-2xl overflow-hidden rounded-sm flex flex-col max-h-[90vh]">
          
          <div className="h-1 w-full bg-gradient-to-r from-transparent via-[#D4AF37] to-transparent" />
          
          <div className="p-4 sm:p-5 border-b border-white/10 flex items-center justify-between bg-[#0D0D0F]">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-full bg-[#D4AF37]/10 border border-[#D4AF37]/40 flex items-center justify-center text-[#D4AF37]">
                <Icon name="FlashIcon" className="w-4 h-4 fill-current" />
              </div>
              <div>
                <h2 className="text-sm sm:text-base font-serif text-[#F5F5F0] tracking-wider uppercase">
                  Direct Buy Now
                </h2>
                <p className="text-[10px] sm:text-[11px] text-[#A0A098]">
                  {session?.user ? "Confirm delivery address & proceed to payment." : "Quick 1-step sign in & checkout."}
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
          <div className="p-3.5 sm:p-4 bg-[#18181C] border-b border-white/10 flex items-center justify-between">
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
                <h4 className="text-xs sm:text-sm font-serif font-medium text-[#F5F5F0] line-clamp-1">
                  {perfume.name}
                </h4>
                <p className="text-[11px] text-[#A0A098] font-mono mt-0.5">
                  Size: <span className="text-[#E6C687]">{selectedMl}ml</span> | Incl. Luxury Sample
                </p>
              </div>
            </div>

            <div className="text-right">
              <span className="text-[9px] uppercase tracking-widest text-[#888880] block">
                Total Price
              </span>
              <span className="text-sm sm:text-base font-serif font-bold text-[#D4AF37]">
                Rs. {price.toLocaleString("en-IN")}
              </span>
            </div>
          </div>

          {/* Content Body */}
          <div className="p-4 sm:p-5 overflow-y-auto flex-1 space-y-4">
            {!session?.user ? (
              /* UNAUTHENTICATED USER INLINE MOBILE OTP STEP */
              <div className="space-y-4">
                <div className="p-3.5 bg-[#D4AF37]/10 border border-[#D4AF37]/30 text-xs text-[#E6C687] flex items-center gap-2">
                  <Icon name="CrownIcon" className="w-4 h-4 text-[#D4AF37] shrink-0" />
                  <span>Please sign in with your mobile phone to complete order.</span>
                </div>

                {authStep === "phone" ? (
                  <form onSubmit={handleSendOtp} className="space-y-3.5">
                    <div>
                      <label className="block text-[10px] uppercase tracking-widest text-[#D4AF37] mb-1 font-semibold">
                        Mobile Phone Number *
                      </label>
                      <div className="relative flex items-center">
                        <div className="absolute left-3 flex items-center gap-1 text-xs text-[#D4AF37] font-medium border-r border-white/10 pr-2">
                          <span>🇮🇳</span>
                          <span>+91</span>
                        </div>
                        <input
                          type="tel"
                          required
                          maxLength={10}
                          value={phone}
                          onChange={(e) => setPhone(e.target.value.replace(/\D/g, ""))}
                          placeholder="98765 43210"
                          className="w-full bg-[#0A0A0B] border border-white/15 focus:border-[#D4AF37] text-white text-xs pl-20 pr-3 py-2.5 outline-none"
                        />
                      </div>
                    </div>

                    <button
                      type="submit"
                      disabled={authLoading || phone.length < 10}
                      className="w-full py-3 bg-[#D4AF37] hover:bg-[#E6C687] text-[#0A0A0B] font-bold text-xs uppercase tracking-widest transition-all shadow-lg flex items-center justify-center gap-2 disabled:opacity-50 touch-manipulation"
                    >
                      <span>{authLoading ? "Sending Code..." : "Send Verification Code"}</span>
                    </button>
                  </form>
                ) : (
                  <form onSubmit={handleVerifyOtp} className="space-y-3.5">
                    <div>
                      <div className="flex justify-between items-center mb-1">
                        <label className="text-[10px] uppercase tracking-widest text-[#D4AF37] font-semibold">
                          OTP Code *
                        </label>
                        <button
                          type="button"
                          onClick={() => setAuthStep("phone")}
                          className="text-[10px] uppercase text-[#D4AF37] hover:underline"
                        >
                          Change (+91 {phone})
                        </button>
                      </div>

                      <input
                        type="text"
                        required
                        maxLength={6}
                        value={otp}
                        onChange={(e) => setOtp(e.target.value)}
                        placeholder="Enter 6-digit OTP (Demo: 123456)"
                        className="w-full bg-[#0A0A0B] border border-white/15 focus:border-[#D4AF37] text-white text-center font-mono text-sm py-2.5 outline-none tracking-[0.25em]"
                      />

                      {sentCode && (
                        <div className="mt-2 p-2 bg-[#18181D] border border-white/10 text-xs text-[#E6C687] flex items-center justify-between">
                          <span>Demo OTP: <strong>{sentCode}</strong></span>
                          <button
                            type="button"
                            onClick={() => setOtp(sentCode)}
                            className="text-[10px] uppercase underline text-[#D4AF37] font-semibold"
                          >
                            Auto-fill
                          </button>
                        </div>
                      )}
                    </div>

                    <button
                      type="submit"
                      disabled={authLoading || otp.length < 4}
                      className="w-full py-3 bg-[#D4AF37] hover:bg-[#E6C687] text-[#0A0A0B] font-bold text-xs uppercase tracking-widest transition-all shadow-lg flex items-center justify-center gap-2 disabled:opacity-50 touch-manipulation"
                    >
                      <span>{authLoading ? "Verifying..." : "Verify & Proceed"}</span>
                    </button>
                  </form>
                )}
              </div>
            ) : loadingAddresses ? (
              <div className="py-10 text-center text-xs text-[#A0A098] flex items-center justify-center gap-2">
                <span className="animate-spin text-[#D4AF37]">↻</span>
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
                    className="w-full py-3 bg-[#D4AF37] hover:bg-[#E6C687] text-[#0A0A0B] font-bold text-xs uppercase tracking-widest transition-all flex items-center justify-center gap-2 shadow-lg disabled:opacity-50 touch-manipulation"
                  >
                    <Icon name="FlashIcon" className="w-4 h-4 fill-current" />
                    <span>{isCheckoutLoading ? "Saving & Connecting..." : "Save Address & Proceed to Payment"}</span>
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
                    <span className="text-lg leading-none">+</span>
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
                    className="w-full py-3 bg-[#D4AF37] hover:bg-[#E6C687] text-[#0A0A0B] font-bold text-xs uppercase tracking-widest transition-all flex items-center justify-center gap-2 shadow-lg disabled:opacity-50 touch-manipulation"
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
