"use client";

import { useState } from "react";
import Link from "next/link";
import { Icon } from "@/components/ui/icon";

interface NavbarProps {
  onOpenCart: () => void;
  onOpenAuth: () => void;
  cartCount?: number;
}

export function Navbar({ onOpenCart, onOpenAuth, cartCount = 2 }: NavbarProps) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);

  return (
    <>
      {/* Top Banner */}
      <div className="bg-[#0D0D0F] text-[#D4AF37] text-xs py-2 px-4 text-center tracking-[0.2em] font-medium border-b border-[#D4AF37]/15 flex justify-center items-center gap-3">
        <Icon name="SparklesIcon" className="w-3.5 h-3.5 animate-pulse text-[#E6C687]" />
        <span>COMPLIMENTARY DISCOVERY SAMPLE VIAL WITH EVERY ORDER OVER Rs. 15,000</span>
        <Icon name="SparklesIcon" className="w-3.5 h-3.5 animate-pulse text-[#E6C687]" />
      </div>

      {/* Main Glass Header */}
      <header className="sticky top-0 z-40 w-full backdrop-blur-md bg-[#0A0A0B]/85 border-b border-white/10 transition-all duration-300">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between">
          
          {/* Mobile Menu Toggle */}
          <div className="flex lg:hidden">
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="text-[#F5F5F0] hover:text-[#D4AF37] p-2 transition-colors"
              aria-label="Toggle Menu"
            >
              {mobileMenuOpen ? <Icon name="Cancel01Icon" className="w-6 h-6" /> : <Icon name="Menu01Icon" className="w-6 h-6" />}
            </button>
          </div>

          {/* Brand Logo */}
          <div className="flex items-center gap-3">
            <Link href="/" className="group flex flex-col items-center sm:items-start">
              <span className="text-xl sm:text-2xl font-serif tracking-[0.35em] text-[#F5F5F0] group-hover:text-[#D4AF37] transition-colors duration-300 font-extralight uppercase">
                Maison de Aura
              </span>
              <span className="text-[10px] tracking-[0.4em] text-[#D4AF37]/70 uppercase font-light -mt-1">
                Haute Parfumerie • Paris
              </span>
            </Link>
          </div>

          {/* Navigation Links - Desktop */}
          <nav className="hidden lg:flex items-center space-x-8 text-xs font-medium tracking-[0.2em] uppercase text-[#C5C5C0]">
            <Link href="/" className="hover:text-[#D4AF37] transition-colors duration-200 py-1 border-b border-transparent hover:border-[#D4AF37]">
              Home
            </Link>
            <Link href="#catalog" className="hover:text-[#D4AF37] transition-colors duration-200 py-1 border-b border-transparent hover:border-[#D4AF37]">
              Catalog
            </Link>
            <Link href="#scent-quiz" className="flex items-center gap-1.5 text-[#E6C687] hover:text-white transition-colors duration-200 py-1 px-2.5 rounded-full bg-[#D4AF37]/10 border border-[#D4AF37]/30">
              <Icon name="SparklesIcon" className="w-3.5 h-3.5 text-[#D4AF37]" />
              Scent Quiz
            </Link>
            <Link href="#storytelling" className="hover:text-[#D4AF37] transition-colors duration-200 py-1 border-b border-transparent hover:border-[#D4AF37]">
              Heritage
            </Link>
            <Link href="/admin" className="hover:text-[#D4AF37] transition-colors duration-200 py-1 border-b border-transparent hover:border-[#D4AF37] flex items-center gap-1">
              <Icon name="CrownIcon" className="w-3.5 h-3.5 text-[#D4AF37]" />
              Admin Panel
            </Link>
          </nav>

          {/* Action Icons */}
          <div className="flex items-center space-x-4">
            {/* Search Trigger */}
            <button
              onClick={() => setSearchOpen(!searchOpen)}
              className="p-2 text-[#C5C5C0] hover:text-[#D4AF37] transition-colors"
              aria-label="Search"
            >
              <Icon name="Search01Icon" className="w-5 h-5" />
            </button>

            {/* Account / Login */}
            <button
              onClick={onOpenAuth}
              className="hidden sm:flex items-center gap-2 text-xs uppercase tracking-wider text-[#C5C5C0] hover:text-[#D4AF37] transition-colors p-2"
            >
              <Icon name="UserIcon" className="w-5 h-5" />
              <span className="hidden md:inline">VIP Sign In</span>
            </button>

            {/* Cart Drawer Toggle */}
            <button
              onClick={onOpenCart}
              className="relative p-2.5 bg-[#D4AF37]/10 border border-[#D4AF37]/30 rounded-full text-[#D4AF37] hover:bg-[#D4AF37] hover:text-[#0A0A0B] transition-all duration-300 group"
              aria-label="Open Cart"
            >
              <Icon name="ShoppingBag01Icon" className="w-5 h-5" />
              {cartCount > 0 && (
                <span className="absolute -top-1 -right-1 w-5 h-5 rounded-full bg-[#D4AF37] text-[#0A0A0B] group-hover:bg-white font-bold text-[10px] flex items-center justify-center shadow-lg">
                  {cartCount}
                </span>
              )}
            </button>
          </div>
        </div>

        {/* Search Bar Overlay */}
        {searchOpen && (
          <div className="border-t border-white/10 bg-[#121215] py-4 px-6 animate-in slide-in-from-top-2 duration-200">
            <div className="max-w-3xl mx-auto flex items-center gap-3">
              <Icon name="Search01Icon" className="w-5 h-5 text-[#D4AF37]" />
              <input
                type="text"
                placeholder="Search notes (Oud, Amber, Bergamot, Vanilla)..."
                className="w-full bg-transparent text-[#F5F5F0] placeholder-[#888880] focus:outline-none text-sm tracking-wide"
                autoFocus
              />
              <button onClick={() => setSearchOpen(false)} className="text-[#888880] hover:text-white">
                <Icon name="Cancel01Icon" className="w-5 h-5" />
              </button>
            </div>
          </div>
        )}

        {/* Mobile Navigation Drawer */}
        {mobileMenuOpen && (
          <div className="lg:hidden border-t border-white/10 bg-[#0E0E10] px-6 py-6 space-y-4 animate-in fade-in duration-200">
            <nav className="flex flex-col space-y-4 text-sm tracking-widest uppercase text-[#C5C5C0]">
              <Link href="/" onClick={() => setMobileMenuOpen(false)} className="hover:text-[#D4AF37]">
                Home
              </Link>
              <Link href="#catalog" onClick={() => setMobileMenuOpen(false)} className="hover:text-[#D4AF37]">
                Fragrance Catalog
              </Link>
              <Link href="#scent-quiz" onClick={() => setMobileMenuOpen(false)} className="text-[#E6C687] flex items-center gap-2">
                <Icon name="SparklesIcon" className="w-4 h-4 text-[#D4AF37]" />
                Interactive Scent Quiz
              </Link>
              <Link href="#storytelling" onClick={() => setMobileMenuOpen(false)} className="hover:text-[#D4AF37]">
                Brand Heritage
              </Link>
              <Link href="/admin" onClick={() => setMobileMenuOpen(false)} className="text-[#D4AF37] flex items-center gap-2">
                <Icon name="CrownIcon" className="w-4 h-4" />
                Admin Panel UI
              </Link>
            </nav>
            <div className="pt-4 border-t border-white/10">
              <button
                onClick={() => {
                  setMobileMenuOpen(false);
                  onOpenAuth();
                }}
                className="w-full py-2.5 border border-[#D4AF37] text-[#D4AF37] text-xs uppercase tracking-widest rounded-none hover:bg-[#D4AF37] hover:text-[#0A0A0B] transition-colors"
              >
                Sign In / VIP Membership
              </button>
            </div>
          </div>
        )}
      </header>
    </>
  );
}
