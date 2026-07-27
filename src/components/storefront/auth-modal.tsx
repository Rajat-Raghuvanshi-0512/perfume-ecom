"use client";

import { useState } from "react";
import { Icon } from "@/components/ui/icon";

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function AuthModal({ isOpen, onClose }: AuthModalProps) {
  const [activeTab, setActiveTab] = useState<"signin" | "register">("signin");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-in fade-in duration-200">
      <div className="relative w-full max-w-lg overflow-hidden bg-[#121215] border border-[#D4AF37]/30 shadow-2xl rounded-sm">
        
        {/* Decorative Top Accent Bar */}
        <div className="h-1 w-full bg-gradient-to-r from-transparent via-[#D4AF37] to-transparent" />

        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-5 right-5 text-[#888880] hover:text-[#D4AF37] transition-colors p-1"
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

          {/* Mode Tabs */}
          <div className="flex border-b border-white/10 mb-8 text-xs uppercase tracking-widest">
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
          <form onSubmit={(e) => { e.preventDefault(); onClose(); }} className="space-y-4">
            
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

            {/* Action Submit */}
            <button
              type="submit"
              className="w-full mt-6 py-3.5 bg-gradient-to-r from-[#D4AF37] to-[#E6C687] text-[#0A0A0B] font-bold text-xs uppercase tracking-[0.2em] hover:opacity-95 transition-all shadow-lg flex items-center justify-center gap-2 group"
            >
              <span>{activeTab === "signin" ? "Enter Private Salon" : "Create VIP Account"}</span>
              <Icon name="ArrowRight01Icon" className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </button>
          </form>

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
              onClick={onClose}
              className="py-2.5 border border-white/15 bg-white/5 text-xs text-[#C5C5C0] hover:border-[#D4AF37] transition-colors flex items-center justify-center gap-2"
            >
              <span>Google</span>
            </button>
            <button
              type="button"
              onClick={onClose}
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

        </div>
      </div>
    </div>
  );
}
