"use client";

import { useState } from "react";
import { signIn } from "next-auth/react";
import { registerUser, requestMobileOtp, verifyMobileOtp } from "@/actions/auth";
import { toast } from "@/components/ui/toast";
import { Icon } from "@/components/ui/icon";

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function AuthModal({ isOpen, onClose }: AuthModalProps) {
  // Mode: "mobile" (default) or "email" (desktop-only option)
  const [authMethod, setAuthMethod] = useState<"mobile" | "email">("mobile");
  
  // Mobile OTP States
  const [mobileStep, setMobileStep] = useState<"phone" | "otp">("phone");
  const [phone, setPhone] = useState("");
  const [otp, setOtp] = useState("");
  const [sentCode, setSentCode] = useState<string | null>(null);

  // Email States
  const [activeTab, setActiveTab] = useState<"signin" | "register">("signin");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");

  const [loading, setLoading] = useState(false);

  if (!isOpen) return null;

  // Handle Mobile OTP Request
  const handleSendOtp = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    const cleanPhone = phone.replace(/\D/g, "");
    if (cleanPhone.length < 10) {
      toast.add({
        title: "Invalid Mobile Number",
        description: "Please enter a valid 10-digit mobile phone number.",
        type: "error",
      });
      setLoading(false);
      return;
    }

    const res = await requestMobileOtp(cleanPhone);

    if (res.success) {
      setSentCode(res.otp || "123456");
      setMobileStep("otp");
      toast.add({
        title: "Verification Code Sent",
        description: `${res.message} (Demo OTP: ${res.otp || "123456"})`,
        type: "success",
      });
    } else {
      toast.add({
        title: "Failed to Send OTP",
        description: res.error || "Could not dispatch SMS code.",
        type: "error",
      });
    }

    setLoading(false);
  };

  // Handle Mobile OTP Verification & Login
  const handleVerifyOtp = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    const cleanPhone = phone.replace(/\D/g, "");
    const res = await verifyMobileOtp(cleanPhone, otp);

    if (res.success) {
      // Authenticate via NextAuth credentials
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
        toast.add({
          title: "Welcome to Maison Salon",
          description: `Successfully authenticated via mobile (+91 ${cleanPhone.slice(-10)})`,
          type: "success",
        });
        resetForm();
        onClose();
      }
    } else {
      toast.add({
        title: "Verification Failed",
        description: res.error || "Invalid OTP code entered.",
        type: "error",
      });
    }

    setLoading(false);
  };

  // Handle Email + Password Sign In / Register
  const handleEmailSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    if (activeTab === "signin") {
      try {
        const res = await signIn("credentials", {
          email,
          password,
          redirect: false,
        });

        if (res?.error) {
          toast.add({
            title: "Authentication Mismatch",
            description: "Invalid email address or password for private salon.",
            type: "error",
          });
        } else {
          toast.add({
            title: "Welcome to Maison Salon",
            description: `Successfully signed in as ${email}`,
            type: "success",
          });
          resetForm();
          onClose();
        }
      } catch (err: any) {
        toast.add({
          title: "Sign In Error",
          description: err.message || "An unexpected error occurred.",
          type: "error",
        });
      }
    } else {
      // Register
      const res = await registerUser({ name, email, password });

      if (res.success) {
        toast.add({
          title: "VIP Account Created",
          description: `Welcome to Atelier, ${name}! Logging you in...`,
          type: "success",
        });

        await signIn("credentials", { email, password, redirect: false });
        resetForm();
        onClose();
      } else {
        toast.add({
          title: "Registration Error",
          description: res.error || "Failed to create patron account.",
          type: "error",
        });
      }
    }

    setLoading(false);
  };

  const handleGoogleSignIn = async () => {
    toast.add({
      title: "Connecting Google Account",
      description: "Redirecting to secure OAuth portal...",
      type: "info",
    });
    await signIn("google");
  };

  const resetForm = () => {
    setAuthMethod("mobile");
    setMobileStep("phone");
    setPhone("");
    setOtp("");
    setSentCode(null);
    setEmail("");
    setPassword("");
    setName("");
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-in fade-in duration-200">
      <div className="relative w-full max-w-lg overflow-hidden bg-[#121215] border border-[#D4AF37]/30 shadow-2xl rounded-sm">
        
        {/* Decorative Top Accent Bar */}
        <div className="h-1 w-full bg-gradient-to-r from-transparent via-[#D4AF37] to-transparent" />

        {/* Close Button */}
        <button
          onClick={() => {
            resetForm();
            onClose();
          }}
          className="absolute top-5 right-5 text-[#888880] hover:text-[#D4AF37] transition-colors p-1"
          aria-label="Close modal"
        >
          <Icon name="Cancel01Icon" className="w-5 h-5" />
        </button>

        <div className="p-8 sm:p-10">
          
          {/* Header Branding */}
          <div className="text-center space-y-2 mb-8">
            <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-[#D4AF37]/10 border border-[#D4AF37]/30 text-[#D4AF37] mb-2">
              <Icon name="CrownIcon" className="w-6 h-6" />
            </div>
            <h2 className="text-2xl font-serif tracking-[0.2em] text-[#F5F5F0] uppercase font-light">
              Maison Club
            </h2>
            <p className="text-xs tracking-widest text-[#A0A098] uppercase">
              Exclusive Access to Haute Parfumerie
            </p>
          </div>

          {/* MODE 1: MOBILE & OTP AUTHENTICATION (DEFAULT) */}
          {authMethod === "mobile" && (
            <div className="space-y-6">
              
              {/* Step Title / Subtitle */}
              <div className="text-center pb-2">
                <span className="inline-block px-3 py-1 bg-[#D4AF37]/10 border border-[#D4AF37]/30 text-[#D4AF37] text-[10px] uppercase tracking-widest rounded-full mb-2">
                  Fast Mobile Sign In
                </span>
                <h3 className="text-sm font-medium tracking-wider text-[#E6C687] uppercase">
                  {mobileStep === "phone" ? "Enter Mobile Phone Number" : "Verify One-Time Password"}
                </h3>
              </div>

              {mobileStep === "phone" ? (
                /* Phone Step */
                <form onSubmit={handleSendOtp} className="space-y-4">
                  <div>
                    <label className="block text-[11px] uppercase tracking-wider text-[#A0A098] mb-1.5 font-medium">
                      Mobile Phone Number
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
                        className="w-full bg-[#1A1A1E] border border-white/10 focus:border-[#D4AF37] text-[#F5F5F0] text-sm pl-24 pr-4 py-3 rounded-none outline-none transition-colors placeholder-[#666] tracking-wider"
                      />
                    </div>
                    <p className="text-[10px] text-[#777770] mt-1.5">
                      We will send a 6-digit verification code via instant SMS.
                    </p>
                  </div>

                  <button
                    type="submit"
                    disabled={loading || phone.length < 10}
                    className="w-full mt-6 py-3.5 bg-gradient-to-r from-[#D4AF37] to-[#E6C687] text-[#0A0A0B] font-bold text-xs uppercase tracking-[0.2em] hover:opacity-95 transition-all shadow-lg flex items-center justify-center gap-2 group disabled:opacity-50"
                  >
                    <span>{loading ? "Sending OTP Code..." : "Get OTP Code"}</span>
                    <Icon name="ArrowRight01Icon" className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                  </button>
                </form>
              ) : (
                /* OTP Step */
                <form onSubmit={handleVerifyOtp} className="space-y-4">
                  <div>
                    <div className="flex justify-between items-center mb-1.5">
                      <label className="text-[11px] uppercase tracking-wider text-[#A0A098] font-medium">
                        Verification Code (OTP)
                      </label>
                      <button
                        type="button"
                        onClick={() => setMobileStep("phone")}
                        className="text-[10px] uppercase tracking-wider text-[#D4AF37] hover:underline"
                      >
                        Change (+91 {phone})
                      </button>
                    </div>

                    <div className="relative">
                      <Icon name="LockKeyIcon" className="w-4 h-4 text-[#D4AF37]/60 absolute left-3.5 top-3.5" />
                      <input
                        type="text"
                        required
                        maxLength={6}
                        value={otp}
                        onChange={(e) => setOtp(e.target.value)}
                        placeholder="Enter 6-digit OTP (Try: 123456)"
                        className="w-full bg-[#1A1A1E] border border-white/10 focus:border-[#D4AF37] text-[#F5F5F0] text-center text-base tracking-[0.4em] font-mono py-3 rounded-none outline-none transition-colors placeholder-[#666] placeholder:tracking-normal placeholder:text-xs placeholder:font-sans"
                      />
                    </div>

                    {sentCode && (
                      <div className="mt-2 p-2 bg-[#D4AF37]/10 border border-[#D4AF37]/20 text-[11px] text-[#E6C687] flex items-center justify-between">
                        <span>Demo OTP Code: <strong>{sentCode}</strong></span>
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
                    disabled={loading || otp.length < 4}
                    className="w-full mt-4 py-3.5 bg-gradient-to-r from-[#D4AF37] to-[#E6C687] text-[#0A0A0B] font-bold text-xs uppercase tracking-[0.2em] hover:opacity-95 transition-all shadow-lg flex items-center justify-center gap-2 group disabled:opacity-50"
                  >
                    <span>{loading ? "Verifying OTP..." : "Verify & Sign In"}</span>
                    <Icon name="ArrowRight01Icon" className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                  </button>
                </form>
              )}
            </div>
          )}

          {/* MODE 2: EMAIL & PASSWORD AUTHENTICATION (DESKTOP TOGGLE) */}
          {authMethod === "email" && (
            <div className="space-y-4">
              {/* Email Mode Tabs */}
              <div className="flex border-b border-white/10 mb-6 text-xs uppercase tracking-widest">
                <button
                  onClick={() => setActiveTab("signin")}
                  className={`flex-1 py-3 text-center transition-colors font-medium border-b-2 ${
                    activeTab === "signin"
                      ? "border-[#D4AF37] text-[#D4AF37]"
                      : "border-transparent text-[#888880] hover:text-[#C5C5C0]"
                  }`}
                >
                  VIP Sign In
                </button>
                <button
                  onClick={() => setActiveTab("register")}
                  className={`flex-1 py-3 text-center transition-colors font-medium border-b-2 ${
                    activeTab === "register"
                      ? "border-[#D4AF37] text-[#D4AF37]"
                      : "border-transparent text-[#888880] hover:text-[#C5C5C0]"
                  }`}
                >
                  Join Atelier
                </button>
              </div>

              {/* Form */}
              <form onSubmit={handleEmailSubmit} className="space-y-4">
                {activeTab === "register" && (
                  <div>
                    <label className="block text-[11px] uppercase tracking-wider text-[#A0A098] mb-1.5 font-medium">
                      Full Name
                    </label>
                    <div className="relative">
                      <Icon name="UserIcon" className="w-4 h-4 text-[#D4AF37]/60 absolute left-3.5 top-3.5" />
                      <input
                        type="text"
                        required
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        placeholder="Countess Genevieve de Vance"
                        className="w-full bg-[#1A1A1E] border border-white/10 focus:border-[#D4AF37] text-[#F5F5F0] text-sm pl-10 pr-4 py-2.5 rounded-none outline-none transition-colors placeholder-[#666]"
                      />
                    </div>
                  </div>
                )}

                <div>
                  <label className="block text-[11px] uppercase tracking-wider text-[#A0A098] mb-1.5 font-medium">
                    Email Address
                  </label>
                  <div className="relative">
                    <Icon name="Mail01Icon" className="w-4 h-4 text-[#D4AF37]/60 absolute left-3.5 top-3.5" />
                    <input
                      type="email"
                      required
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="vip@maison-aura.com"
                      className="w-full bg-[#1A1A1E] border border-white/10 focus:border-[#D4AF37] text-[#F5F5F0] text-sm pl-10 pr-4 py-2.5 rounded-none outline-none transition-colors placeholder-[#666]"
                    />
                  </div>
                </div>

                <div>
                  <div className="flex justify-between items-center mb-1.5">
                    <label className="text-[11px] uppercase tracking-wider text-[#A0A098] font-medium">
                      Password
                    </label>
                    {activeTab === "signin" && (
                      <button type="button" className="text-[10px] uppercase tracking-wider text-[#D4AF37] hover:underline">
                        Forgot Password?
                      </button>
                    )}
                  </div>
                  <div className="relative">
                    <Icon name="LockKeyIcon" className="w-4 h-4 text-[#D4AF37]/60 absolute left-3.5 top-3.5" />
                    <input
                      type="password"
                      required
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      placeholder="••••••••••••"
                      className="w-full bg-[#1A1A1E] border border-white/10 focus:border-[#D4AF37] text-[#F5F5F0] text-sm pl-10 pr-4 py-2.5 rounded-none outline-none transition-colors placeholder-[#666]"
                    />
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={loading}
                  className="w-full mt-6 py-3.5 bg-gradient-to-r from-[#D4AF37] to-[#E6C687] text-[#0A0A0B] font-bold text-xs uppercase tracking-[0.2em] hover:opacity-95 transition-all shadow-lg flex items-center justify-center gap-2 group disabled:opacity-50"
                >
                  <span>{loading ? "Verifying Credentials..." : activeTab === "signin" ? "Enter Private Salon" : "Create VIP Account"}</span>
                  <Icon name="ArrowRight01Icon" className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                </button>
              </form>

              {/* Back to Mobile Option */}
              <div className="text-center pt-2">
                <button
                  type="button"
                  onClick={() => setAuthMethod("mobile")}
                  className="text-[11px] uppercase tracking-wider text-[#D4AF37] hover:underline inline-flex items-center gap-1.5"
                >
                  <span>← Back to Mobile & OTP Sign In</span>
                </button>
              </div>
            </div>
          )}

          {/* Social Divider */}
          <div className="relative my-6 text-center">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-white/10" />
            </div>
            <span className="relative bg-[#121215] px-3 text-[10px] uppercase tracking-widest text-[#777770]">
              Or continue with
            </span>
          </div>

          {/* Social Buttons */}
          <div className="grid grid-cols-2 gap-3">
            <button
              type="button"
              onClick={handleGoogleSignIn}
              className="py-2.5 border border-white/15 bg-white/5 text-xs text-[#C5C5C0] hover:border-[#D4AF37] transition-colors flex items-center justify-center gap-2"
            >
              <span>Google</span>
            </button>
            <button
              type="button"
              onClick={() => {
                toast.add({
                  title: "Apple ID Authentication",
                  description: "Apple OAuth portal integration active.",
                  type: "info",
                });
              }}
              className="py-2.5 border border-white/15 bg-white/5 text-xs text-[#C5C5C0] hover:border-[#D4AF37] transition-colors flex items-center justify-center gap-2"
            >
              <span>Apple ID</span>
            </button>
          </div>

          {/* Member Benefits Box */}
          <div className="mt-6 p-3.5 bg-[#D4AF37]/5 border border-[#D4AF37]/20 rounded-none flex items-start gap-3">
            <Icon name="ShieldIcon" className="w-5 h-5 text-[#D4AF37] shrink-0 mt-0.5" />
            <p className="text-[11px] text-[#B5B5A8] leading-relaxed">
              <strong className="text-[#E6C687] uppercase tracking-wider block mb-0.5">VIP Privileges:</strong>
              Complimentary 10ml travel elixir on your birthday & invitation to private annual harvests.
            </p>
          </div>

          {/* RESPONSIVE DESKTOP-ONLY LINK FOR EMAIL LOGIN */}
          {authMethod === "mobile" && (
            <div className="hidden md:flex justify-center items-center mt-6 pt-4 border-t border-white/10 text-xs text-[#A0A098]">
              <span>Prefer email login?</span>
              <button
                type="button"
                onClick={() => setAuthMethod("email")}
                className="text-[#D4AF37] hover:underline font-medium ml-1.5 uppercase tracking-wider text-[11px]"
              >
                Log in with email as well
              </button>
            </div>
          )}

        </div>
      </div>
    </div>
  );
}
