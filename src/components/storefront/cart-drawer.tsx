"use client";

import { useState, useEffect } from "react";
import { useSession, signIn } from "next-auth/react";
import { CartItem } from "@/types/perfume";
import { Icon } from "@/components/ui/icon";
import { createCheckoutSession } from "@/actions/checkout";
import { getUserAddresses, createAddress, AddressInput } from "@/actions/address";
import { requestMobileOtp, verifyMobileOtp } from "@/actions/auth";
import { AddressFormModal } from "./address-form-modal";
import { toast } from "@/components/ui/toast";

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
  const { data: session } = useSession();
  const [selectedSample, setSelectedSample] = useState<string>("Oud Impérial (2ml Vial)");
  const [isGiftWrapped, setIsGiftWrapped] = useState<boolean>(true);
  const [isCheckingOut, setIsCheckingOut] = useState<boolean>(false);
  
  // Navigation Steps inside Cart Drawer: CART -> AUTH (if unauthenticated) -> ADDRESS
  const [checkoutStep, setCheckoutStep] = useState<"CART" | "AUTH" | "ADDRESS">("CART");

  // Address State
  const [addresses, setAddresses] = useState<AddressItem[]>([]);
  const [selectedAddressId, setSelectedAddressId] = useState<string | null>(null);
  const [loadingAddresses, setLoadingAddresses] = useState(false);
  const [showAddAddressModal, setShowAddAddressModal] = useState(false);

  // Inline address for zero saved addresses
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

  // Auth Inline State (Mobile OTP)
  const [authStep, setAuthStep] = useState<"phone" | "otp">("phone");
  const [phone, setPhone] = useState("");
  const [otp, setOtp] = useState("");
  const [sentCode, setSentCode] = useState<string | null>(null);
  const [authLoading, setAuthLoading] = useState(false);

  // Reset steps & state when drawer closes
  useEffect(() => {
    if (!isOpen) {
      setCheckoutStep("CART");
      setAuthStep("phone");
      setPhone("");
      setOtp("");
      setSentCode(null);
    }
  }, [isOpen]);

  // If user becomes logged in while on AUTH step, transition automatically to ADDRESS
  useEffect(() => {
    if (session?.user && checkoutStep === "AUTH") {
      fetchAddresses();
      setCheckoutStep("ADDRESS");
    }
  }, [session, checkoutStep]);

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

  if (!isOpen) return null;

  const subtotal = items.reduce((acc, item) => acc + item.price * item.quantity, 0);
  const freeShippingThreshold = 20000;
  const progressPercent = Math.min(100, (subtotal / freeShippingThreshold) * 100);
  const amountLeft = Math.max(0, freeShippingThreshold - subtotal);
  const shippingFee = amountLeft === 0 ? 0 : 500;

  const handleProceedFromCart = () => {
    if (!session?.user) {
      setCheckoutStep("AUTH");
      return;
    }
    fetchAddresses();
    setCheckoutStep("ADDRESS");
  };

  // Auth Step Handlers
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
        title: "OTP Request Failed",
        description: res.error || "Unable to send SMS verification code.",
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
          description: "Could not create session for this mobile number.",
          type: "error",
        });
      } else {
        fetchAddresses();
        setCheckoutStep("ADDRESS");
      }
    } else {
      toast.add({
        title: "Invalid OTP",
        description: res.error || "Verification code failed.",
        type: "error",
      });
    }
    setAuthLoading(false);
  };

  // Inline Address Submission for single step creation + payment
  const handleInlineAddressAndCheckout = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsCheckingOut(true);

    try {
      const addRes = await createAddress(inlineAddress);
      if (!addRes.success || !addRes.address) {
        toast.add({
          title: "Address Error",
          description: addRes.error || "Failed to save shipping address.",
          type: "error",
        });
        setIsCheckingOut(false);
        return;
      }

      const savedAddr = addRes.address;
      const checkoutItems = items.map((item) => ({
        productId: item.perfume.id,
        volumeMl: item.selectedMl,
        productName: item.perfume.name,
        unitPrice: item.price,
        quantity: item.quantity,
        addSampleVial: true,
      }));

      const res = await createCheckoutSession(checkoutItems, undefined, {
        fullName: savedAddr.fullName,
        phone: savedAddr.phone,
        streetAddress: savedAddr.streetAddress,
        apartment: savedAddr.apartment,
        city: savedAddr.city,
        state: savedAddr.state,
        postalCode: savedAddr.postalCode,
        country: savedAddr.country,
      });

      if (res.success && res.url) {
        window.location.href = res.url;
      } else {
        toast.add({
          title: "Payment Error",
          description: res.error || "Unable to initiate checkout",
          type: "error",
        });
        setIsCheckingOut(false);
      }
    } catch (err: any) {
      setIsCheckingOut(false);
    }
  };

  // Selected Address Checkout
  const handleCheckoutWithSelectedAddress = async () => {
    const chosenAddress = addresses.find((a) => a.id === selectedAddressId);
    if (!chosenAddress) {
      toast.add({
        title: "Select Address",
        description: "Please select a delivery address.",
        type: "error",
      });
      return;
    }

    setIsCheckingOut(true);
    try {
      const checkoutItems = items.map((item) => ({
        productId: item.perfume.id,
        volumeMl: item.selectedMl,
        productName: item.perfume.name,
        unitPrice: item.price,
        quantity: item.quantity,
        addSampleVial: true,
      }));

      const res = await createCheckoutSession(checkoutItems, undefined, {
        fullName: chosenAddress.fullName,
        phone: chosenAddress.phone,
        streetAddress: chosenAddress.streetAddress,
        apartment: chosenAddress.apartment,
        city: chosenAddress.city,
        state: chosenAddress.state,
        postalCode: chosenAddress.postalCode,
        country: chosenAddress.country,
      });

      if (res.success && res.url) {
        window.location.href = res.url;
      } else {
        toast.add({
          title: "Payment Error",
          description: res.error || "Unable to initiate checkout",
          type: "error",
        });
      }
    } catch (err: any) {
      console.error("Checkout Error:", err);
    } finally {
      setIsCheckingOut(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 overflow-hidden animate-in fade-in duration-300">
      <div 
        onClick={onClose} 
        className="absolute inset-0 bg-black/80 backdrop-blur-sm transition-opacity" 
      />

      <div className="fixed inset-y-0 right-0 max-w-full flex pl-2 sm:pl-10">
        <div className="w-screen max-w-md bg-[#0F0F12] border-l border-white/10 text-[#F5F5F0] flex flex-col justify-between shadow-2xl">
          
          {/* Top Header */}
          <div className="p-4 sm:p-6 border-b border-white/10 flex items-center justify-between bg-[#141418]">
            <div className="flex items-center gap-3">
              {checkoutStep !== "CART" && (
                <button
                  onClick={() => setCheckoutStep(checkoutStep === "ADDRESS" ? "CART" : "CART")}
                  className="p-2 text-[#888880] hover:text-[#D4AF37] border border-white/10 rounded-full transition-colors flex items-center justify-center"
                  aria-label="Back"
                >
                  <span className="text-sm font-bold leading-none">←</span>
                </button>
              )}
              <div className="p-2 rounded-full bg-[#D4AF37]/10 border border-[#D4AF37]/30 text-[#D4AF37]">
                <Icon name="ShoppingBag01Icon" className="w-5 h-5" />
              </div>
              <div>
                <h2 className="text-sm sm:text-base font-serif tracking-[0.2em] uppercase font-light text-[#F5F5F0]">
                  {checkoutStep === "CART" && "Your Velvet Coffer"}
                  {checkoutStep === "AUTH" && "Sign In to Continue"}
                  {checkoutStep === "ADDRESS" && "Delivery Destination"}
                </h2>
                <p className="text-[10px] text-[#A0A098] uppercase tracking-wider">
                  {checkoutStep === "CART" && `${items.length} Fragrance${items.length !== 1 ? "s" : ""} Selected`}
                  {checkoutStep === "AUTH" && "Quick 1-step verification"}
                  {checkoutStep === "ADDRESS" && "Confirm address & payment"}
                </p>
              </div>
            </div>

            <button
              onClick={onClose}
              className="text-[#888880] hover:text-[#D4AF37] p-2 transition-colors border border-white/10 rounded-full"
              aria-label="Close cart"
            >
              <Icon name="Cancel01Icon" className="w-4 h-4" />
            </button>
          </div>

          {/* STEP 1: CART VIEW */}
          {checkoutStep === "CART" && (
            <>
              {/* Free Shipping & Discovery Vial Progress Bar */}
              <div className="bg-[#18181D] px-4 sm:px-6 py-3 border-b border-white/5 space-y-1.5">
                <div className="flex items-center justify-between text-[10px] sm:text-[11px] tracking-wider uppercase">
                  <span className="text-[#C5C5C0] flex items-center gap-1.5 truncate">
                    <Icon name="SparklesIcon" className="w-3.5 h-3.5 text-[#D4AF37] shrink-0" />
                    {amountLeft === 0
                      ? "Eligible for Free Worldwide Express Shipping!"
                      : `Add Rs. ${amountLeft.toLocaleString("en-IN")} for Free Delivery`}
                  </span>
                  <span className="text-[#D4AF37] font-semibold ml-2">{Math.round(progressPercent)}%</span>
                </div>
                <div className="w-full h-1.5 bg-white/10 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-gradient-to-r from-[#D4AF37] to-[#E6C687] transition-all duration-500"
                    style={{ width: `${progressPercent}%` }}
                  />
                </div>
              </div>

              {/* Items List */}
              <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-4 divide-y divide-white/5">
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
                    <div key={`${item.perfume.id}-${item.selectedMl}`} className="pt-4 first:pt-0 flex gap-3 sm:gap-4">
                      <img
                        src={item.perfume.images[0]}
                        alt={item.perfume.name}
                        className="w-16 h-20 sm:w-20 sm:h-24 object-cover bg-[#0A0A0B] border border-white/10 shrink-0"
                      />

                      <div className="flex-1 space-y-1">
                        <div className="flex items-start justify-between">
                          <h4 className="text-xs sm:text-sm font-serif tracking-wider text-[#F5F5F0]">
                            {item.perfume.name}
                          </h4>
                          <button
                            onClick={() => onRemoveItem(item.perfume.id, item.selectedMl)}
                            className="text-[#666] hover:text-red-400 p-1"
                            aria-label="Remove item"
                          >
                            <Icon name="Delete01Icon" className="w-3.5 h-3.5" />
                          </button>
                        </div>

                        <p className="text-[10px] uppercase tracking-widest text-[#D4AF37]">
                          {item.selectedMl}ml Bottle • {item.perfume.concentration.split(" ")[0]}
                        </p>

                        <div className="flex items-center justify-between pt-2">
                          <div className="flex items-center border border-white/15 bg-[#18181D]">
                            <button
                              onClick={() => onUpdateQuantity(item.perfume.id, item.selectedMl, -1)}
                              className="px-2 py-1 text-[#888] hover:text-white"
                            >
                              <Icon name="MinusSignIcon" className="w-3 h-3" />
                            </button>
                            <span className="px-2.5 text-xs font-mono text-white">{item.quantity}</span>
                            <button
                              onClick={() => onUpdateQuantity(item.perfume.id, item.selectedMl, 1)}
                              className="px-2 py-1 text-[#888] hover:text-white"
                            >
                              <Icon name="PlusSignIcon" className="w-3 h-3" />
                            </button>
                          </div>

                          <span className="text-xs sm:text-sm font-serif font-semibold text-[#E6C687]">
                            Rs. {(item.price * item.quantity).toLocaleString("en-IN")}
                          </span>
                        </div>
                      </div>
                    </div>
                  ))
                )}

                {/* Complimentary Discovery Sample Picker */}
                {items.length > 0 && (
                  <div className="pt-4 space-y-2.5">
                    <div className="flex items-center justify-between text-xs uppercase tracking-wider text-[#E6C687]">
                      <span className="flex items-center gap-1.5 font-semibold">
                        <Icon name="SparklesIcon" className="w-3.5 h-3.5 text-[#D4AF37]" />
                        Complimentary Sample Vial
                      </span>
                      <span className="text-[9px] px-2 py-0.5 bg-[#D4AF37]/10 text-[#D4AF37]">FREE</span>
                    </div>

                    <select
                      value={selectedSample}
                      onChange={(e) => setSelectedSample(e.target.value)}
                      className="w-full bg-[#18181D] border border-white/15 text-xs text-[#C5C5C0] p-2 outline-none focus:border-[#D4AF37]"
                    >
                      <option value="Oud Impérial (2ml Vial)">Oud Impérial Extrait (2ml Vial)</option>
                      <option value="Soleil de Santal (2ml Vial)">Soleil de Santal EDP (2ml Vial)</option>
                      <option value="Fleur de Cythère (2ml Vial)">Fleur de Cythère Neroli (2ml Vial)</option>
                    </select>

                    <div className="flex items-center gap-2 pt-1">
                      <input
                        type="checkbox"
                        id="giftWrap"
                        checked={isGiftWrapped}
                        onChange={(e) => setIsGiftWrapped(e.target.checked)}
                        className="accent-[#D4AF37] w-4 h-4 cursor-pointer"
                      />
                      <label htmlFor="giftWrap" className="text-[11px] text-[#B5B5A8] cursor-pointer flex items-center gap-1.5">
                        <Icon name="GiftIcon" className="w-3.5 h-3.5 text-[#D4AF37]" />
                        <span>Complimentary Signature Gift Packaging</span>
                      </label>
                    </div>
                  </div>
                )}
              </div>

              {/* Bottom Checkout Action */}
              {items.length > 0 && (
                <div className="p-4 sm:p-6 bg-[#141418] border-t border-white/10 space-y-3">
                  <div className="space-y-1 text-xs uppercase tracking-wider text-[#A0A098]">
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
                    onClick={handleProceedFromCart}
                    className="w-full py-3.5 bg-gradient-to-r from-[#D4AF37] to-[#E6C687] text-[#0A0A0B] font-bold text-xs uppercase tracking-[0.2em] hover:brightness-110 transition-all shadow-xl flex items-center justify-center gap-2 group touch-manipulation"
                  >
                    <Icon name="FlashIcon" className="w-4 h-4 fill-current" />
                    <span>Proceed to Delivery & Payment</span>
                  </button>
                </div>
              )}
            </>
          )}

          {/* STEP 2: INLINE AUTH (MOBILE OTP) */}
          {checkoutStep === "AUTH" && (
            <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-6 flex flex-col justify-between">
              <div className="space-y-4">
                <div className="p-4 bg-[#D4AF37]/10 border border-[#D4AF37]/30 text-xs text-[#E6C687] flex items-center gap-2.5">
                  <Icon name="CrownIcon" className="w-5 h-5 text-[#D4AF37] shrink-0" />
                  <div>
                    <span className="font-semibold block uppercase tracking-wider text-[11px]">VIP Patron Authentication</span>
                    <span className="text-[11px] text-[#C5C5C0]">Please sign in with your mobile phone to continue order verification.</span>
                  </div>
                </div>

                {authStep === "phone" ? (
                  <form onSubmit={handleSendOtp} className="space-y-4 pt-2">
                    <div>
                      <label className="block text-[10px] uppercase tracking-widest text-[#D4AF37] mb-1.5 font-semibold">
                        Mobile Phone Number *
                      </label>
                      <div className="relative flex items-center">
                        <div className="absolute left-3 flex items-center gap-1.5 text-xs text-[#D4AF37] font-medium border-r border-white/10 pr-2.5">
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
                          className="w-full bg-[#0A0A0B] border border-white/15 focus:border-[#D4AF37] text-white text-sm pl-24 pr-4 py-3 outline-none"
                        />
                      </div>
                      <p className="text-[10px] text-[#888880] mt-1.5">
                        We will dispatch a 6-digit verification code via instant SMS.
                      </p>
                    </div>

                    <button
                      type="submit"
                      disabled={authLoading || phone.length < 10}
                      className="w-full py-3.5 bg-[#D4AF37] hover:bg-[#E6C687] text-[#0A0A0B] font-bold text-xs uppercase tracking-[0.2em] transition-all shadow-lg flex items-center justify-center gap-2 disabled:opacity-50 touch-manipulation"
                    >
                      <span>{authLoading ? "Sending SMS Code..." : "Send Verification Code"}</span>
                    </button>
                  </form>
                ) : (
                  <form onSubmit={handleVerifyOtp} className="space-y-4 pt-2">
                    <div>
                      <div className="flex justify-between items-center mb-1.5">
                        <label className="text-[10px] uppercase tracking-widest text-[#D4AF37] font-semibold">
                          Verification Code (OTP) *
                        </label>
                        <button
                          type="button"
                          onClick={() => setAuthStep("phone")}
                          className="text-[10px] uppercase tracking-wider text-[#D4AF37] hover:underline"
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
                        placeholder="Enter 6-digit code (Demo: 123456)"
                        className="w-full bg-[#0A0A0B] border border-white/15 focus:border-[#D4AF37] text-white text-center font-mono text-base py-3 outline-none tracking-[0.3em]"
                      />

                      {sentCode && (
                        <div className="mt-2 p-2.5 bg-[#18181D] border border-white/10 text-xs text-[#E6C687] flex items-center justify-between">
                          <span>Demo OTP Code: <strong>{sentCode}</strong></span>
                          <button
                            type="button"
                            onClick={() => setOtp(sentCode)}
                            className="text-[10px] uppercase underline text-[#D4AF37] font-semibold"
                          >
                            Auto-fill Code
                          </button>
                        </div>
                      )}
                    </div>

                    <button
                      type="submit"
                      disabled={authLoading || otp.length < 4}
                      className="w-full py-3.5 bg-[#D4AF37] hover:bg-[#E6C687] text-[#0A0A0B] font-bold text-xs uppercase tracking-[0.2em] transition-all shadow-lg flex items-center justify-center gap-2 disabled:opacity-50 touch-manipulation"
                    >
                      <span>{authLoading ? "Verifying..." : "Verify & Continue Order"}</span>
                    </button>
                  </form>
                )}
              </div>

              <div className="pt-4 text-center border-t border-white/10">
                <button
                  onClick={() => setCheckoutStep("CART")}
                  className="text-xs text-[#A0A098] hover:text-[#D4AF37] uppercase tracking-wider transition-colors"
                >
                  ← Return to Velvet Coffer
                </button>
              </div>
            </div>
          )}

          {/* STEP 3: ADDRESS SELECTION & CONFIRMATION */}
          {checkoutStep === "ADDRESS" && (
            <>
              <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-4">
                {loadingAddresses ? (
                  <div className="py-12 text-center text-xs text-[#A0A098] flex items-center justify-center gap-2">
                    <span className="animate-spin text-[#D4AF37] text-base">↻</span>
                    <span>Retrieving your saved addresses...</span>
                  </div>
                ) : addresses.length === 0 ? (
                  /* ZERO ADDRESSES -> INLINE ADDRESS CREATION FORM */
                  <form onSubmit={handleInlineAddressAndCheckout} className="space-y-3">
                    <div className="bg-[#D4AF37]/10 border border-[#D4AF37]/30 p-3 text-xs text-[#E6C687] flex items-center gap-2">
                      <Icon name="SparklesIcon" className="w-4 h-4 text-[#D4AF37] shrink-0" />
                      <span>Please enter your delivery destination to initiate payment.</span>
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
                          placeholder="Patron Name"
                          className="w-full bg-[#0A0A0B] border border-white/10 focus:border-[#D4AF37] text-xs text-[#F5F5F0] p-2.5 outline-none"
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
                          className="w-full bg-[#0A0A0B] border border-white/10 focus:border-[#D4AF37] text-xs text-[#F5F5F0] p-2.5 outline-none"
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
                        placeholder="123 Luxury Boulevard"
                        className="w-full bg-[#0A0A0B] border border-white/10 focus:border-[#D4AF37] text-xs text-[#F5F5F0] p-2.5 outline-none"
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
                          className="w-full bg-[#0A0A0B] border border-white/10 focus:border-[#D4AF37] text-xs text-[#F5F5F0] p-2.5 outline-none"
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
                          className="w-full bg-[#0A0A0B] border border-white/10 focus:border-[#D4AF37] text-xs text-[#F5F5F0] p-2.5 outline-none"
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
                          className="w-full bg-[#0A0A0B] border border-white/10 focus:border-[#D4AF37] text-xs text-[#F5F5F0] p-2.5 outline-none"
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
                          className="w-full bg-[#0A0A0B] border border-white/10 focus:border-[#D4AF37] text-xs text-[#F5F5F0] p-2.5 outline-none"
                        />
                      </div>
                    </div>

                    <div className="pt-3">
                      <button
                        type="submit"
                        disabled={isCheckingOut}
                        className="w-full py-3.5 bg-[#D4AF37] hover:bg-[#E6C687] text-[#0A0A0B] font-bold text-xs uppercase tracking-widest transition-all flex items-center justify-center gap-2 shadow-lg disabled:opacity-50 touch-manipulation"
                      >
                        <Icon name="FlashIcon" className="w-4 h-4 fill-current" />
                        <span>{isCheckingOut ? "Connecting Gateway..." : `Save Address & Pay (Rs. ${(subtotal + shippingFee).toLocaleString("en-IN")})`}</span>
                      </button>
                    </div>
                  </form>
                ) : (
                  /* SAVED ADDRESSES LIST */
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="text-[10px] uppercase tracking-widest text-[#D4AF37] font-semibold">
                        Select Delivery Address:
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

                    <div className="space-y-2">
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
                  </div>
                )}
              </div>

              {/* Bottom Payment Action for Saved Addresses */}
              {addresses.length > 0 && (
                <div className="p-4 sm:p-6 bg-[#141418] border-t border-white/10 space-y-3">
                  <div className="flex justify-between text-sm text-[#F5F5F0] font-serif font-bold pb-1">
                    <span>Total Amount Due</span>
                    <span className="text-[#D4AF37]">Rs. {(subtotal + shippingFee).toLocaleString("en-IN")}</span>
                  </div>
                  <button
                    onClick={handleCheckoutWithSelectedAddress}
                    disabled={isCheckingOut || !selectedAddressId}
                    className="w-full py-3.5 bg-[#D4AF37] hover:bg-[#E6C687] text-[#0A0A0B] font-bold text-xs uppercase tracking-widest transition-all shadow-xl flex items-center justify-center gap-2 disabled:opacity-50 touch-manipulation"
                  >
                    <Icon name="FlashIcon" className="w-4 h-4 fill-current" />
                    <span>{isCheckingOut ? "Connecting Gateway..." : "Confirm & Proceed to Payment"}</span>
                  </button>
                </div>
              )}
            </>
          )}

        </div>
      </div>

      <AddressFormModal
        isOpen={showAddAddressModal}
        onClose={() => setShowAddAddressModal(false)}
        onSuccess={() => {
          fetchAddresses();
        }}
      />
    </div>
  );
}
