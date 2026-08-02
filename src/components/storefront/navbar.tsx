"use client";

import { useState } from "react";
import Link from "next/link";
import { useSession, signOut } from "next-auth/react";
import { Icon } from "@/components/ui/icon";

interface NavbarProps {
  onOpenCart: () => void;
  onOpenAuth: () => void;
  cartCount?: number;
}

export function Navbar({ onOpenCart, onOpenAuth, cartCount = 2 }: NavbarProps) {
  const { data: session } = useSession();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [userDropdownOpen, setUserDropdownOpen] = useState(false);

  return (
    <>
      {/* Top Banner */}
      <div className="bg-[#0D0D0F] text-[#D4AF37] text-[9px] sm:text-xs py-1.5 px-3 text-center tracking-[0.12em] sm:tracking-[0.2em] font-medium border-b border-[#D4AF37]/15 flex justify-center items-center gap-2 sm:gap-3">
        <Icon
          name="SparklesIcon"
          className="w-3 h-3 sm:w-3.5 sm:h-3.5 animate-pulse text-[#E6C687] shrink-0"
        />
        <span className="truncate">
          COMPLIMENTARY DISCOVERY SAMPLE VIAL WITH EVERY ORDER OVER Rs. 15,000
        </span>
        <Icon
          name="SparklesIcon"
          className="w-3 h-3 sm:w-3.5 sm:h-3.5 animate-pulse text-[#E6C687] shrink-0"
        />
      </div>

      {/* Main Glass Header */}
      <header className="sticky top-0 z-40 w-full backdrop-blur-md bg-[#0A0A0B]/90 border-b border-white/10 transition-all duration-300">
        <div className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8 h-16 sm:h-20 flex items-center justify-between gap-2">
          {/* Mobile Menu Toggle */}
          <div className="flex lg:hidden">
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="text-[#F5F5F0] hover:text-[#D4AF37] p-1.5 sm:p-2 transition-colors"
              aria-label="Toggle Menu"
            >
              {mobileMenuOpen ? (
                <Icon name="Cancel01Icon" className="w-5 h-5 sm:w-6 sm:h-6" />
              ) : (
                <Icon name="Menu01Icon" className="w-5 h-5 sm:w-6 sm:h-6" />
              )}
            </button>
          </div>

          {/* Generic Luxury Brand Logo */}
          <div className="flex items-center gap-2 sm:gap-3 shrink-0">
            <Link href="/" className="group flex items-center gap-2 sm:gap-3">
              <div className="w-7 h-7 sm:w-9 sm:h-9 border border-[#D4AF37]/40 rounded-full flex items-center justify-center text-[#D4AF37] group-hover:border-[#D4AF37] group-hover:bg-[#D4AF37]/10 transition-all shrink-0">
                <span className="font-serif text-xs sm:text-sm font-bold tracking-tighter">
                  RK
                </span>
              </div>
              <div className="flex flex-col">
                <span className="text-sm sm:text-xl font-serif tracking-[0.15em] sm:tracking-[0.3em] text-[#F5F5F0] group-hover:text-[#D4AF37] transition-colors duration-300 font-light uppercase whitespace-nowrap">
                  PARFUM ATELIER
                </span>
                <span className="text-[8px] sm:text-[9px] tracking-[0.2em] sm:tracking-[0.35em] text-[#D4AF37]/70 uppercase font-light -mt-0.5 whitespace-nowrap">
                  Haute Parfumerie
                </span>
              </div>
            </Link>
          </div>

          {/* Navigation Links - Desktop */}
          <nav className="hidden lg:flex items-center space-x-8 text-xs font-medium tracking-[0.2em] uppercase text-[#C5C5C0]">
            <Link
              href="/"
              className="hover:text-[#D4AF37] transition-colors duration-200 py-1 border-b border-transparent hover:border-[#D4AF37]"
            >
              Home
            </Link>
            <Link
              href="/products"
              className="hover:text-[#D4AF37] transition-colors duration-200 py-1 border-b border-transparent hover:border-[#D4AF37]"
            >
              All Fragrances
            </Link>
            <Link
              href="/scent-finder"
              className="flex items-center gap-1.5 text-[#E6C687] hover:text-white transition-colors duration-200 py-1 px-3 rounded-full bg-[#D4AF37]/10 border border-[#D4AF37]/30"
            >
              <Icon
                name="SparklesIcon"
                className="w-3.5 h-3.5 text-[#D4AF37]"
              />
              Scent Finder
            </Link>
            <Link
              href="/#storytelling"
              className="hover:text-[#D4AF37] transition-colors duration-200 py-1 border-b border-transparent hover:border-[#D4AF37]"
            >
              Heritage
            </Link>
          </nav>

          {/* Action Icons */}
          <div className="flex items-center space-x-1 sm:space-x-4">
            {/* Account / Login */}
            {session?.user ? (
              <div className="relative">
                <button
                  onClick={() => setUserDropdownOpen(!userDropdownOpen)}
                  className="flex items-center gap-1.5 sm:gap-2 text-xs uppercase tracking-wider text-[#D4AF37] bg-[#D4AF37]/10 border border-[#D4AF37]/30 p-1.5 sm:px-3 sm:py-1.5 rounded-full sm:rounded-none transition-colors"
                  aria-label="User Account"
                >
                  <Icon name="CrownIcon" className="w-4 h-4 text-[#D4AF37] shrink-0" />
                  <span className="hidden sm:inline max-w-[100px] md:max-w-[120px] truncate font-semibold">
                    {session.user.name || session.user.email}
                  </span>
                </button>

                {userDropdownOpen && (
                  <div className="absolute right-0 mt-2 w-52 bg-[#121215] border border-[#D4AF37]/30 shadow-2xl py-2 z-50 text-xs uppercase tracking-wider animate-in fade-in duration-150">
                    <div className="px-4 py-2 border-b border-white/10 text-[10px] text-[#A0A098]">
                      {session.user.name && (
                        <div className="font-sans text-[#F5F5F0] font-semibold text-xs mb-0.5 truncate">
                          {session.user.name}
                        </div>
                      )}
                      <div className="font-mono truncate">{session.user.email}</div>
                    </div>
                    <Link
                      href="/profile"
                      onClick={() => setUserDropdownOpen(false)}
                      className="block px-4 py-2.5 text-[#C5C5C0] hover:bg-[#D4AF37]/10 hover:text-[#D4AF37] transition-colors"
                    >
                      My Profile & Addresses
                    </Link>
                    <Link
                      href="/orders"
                      onClick={() => setUserDropdownOpen(false)}
                      className="block px-4 py-2.5 text-[#C5C5C0] hover:bg-[#D4AF37]/10 hover:text-[#D4AF37] transition-colors"
                    >
                      My Orders & History
                    </Link>
                    {((session.user as any)?.role === "ADMIN" ||
                      (session.user as any)?.role === "SUPERADMIN") && (
                      <Link
                        href="/admin"
                        onClick={() => setUserDropdownOpen(false)}
                        className="block px-4 py-2.5 text-[#C5C5C0] hover:bg-[#D4AF37]/10 hover:text-[#D4AF37] transition-colors"
                      >
                        Admin Portal
                      </Link>
                    )}
                    <button
                      onClick={() => {
                        setUserDropdownOpen(false);
                        signOut();
                      }}
                      className="w-full text-left px-4 py-2.5 text-red-400 hover:bg-red-500/10 transition-colors"
                    >
                      Sign Out
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <button
                onClick={onOpenAuth}
                className="flex items-center gap-1.5 text-xs uppercase tracking-wider text-[#C5C5C0] hover:text-[#D4AF37] transition-colors p-1.5 sm:p-2"
                aria-label="Sign In"
              >
                <Icon name="UserIcon" className="w-4 h-4 sm:w-5 sm:h-5" />
                <span className="hidden md:inline">VIP Sign In</span>
              </button>
            )}

            {/* Cart Drawer Toggle */}
            <button
              onClick={onOpenCart}
              className="relative p-1.5 sm:p-2.5 bg-[#D4AF37]/10 border border-[#D4AF37]/30 rounded-full text-[#D4AF37] hover:bg-[#D4AF37] hover:text-[#0A0A0B] transition-all duration-300 group"
              aria-label="Open Cart"
            >
              <Icon name="ShoppingBag01Icon" className="w-4 h-4 sm:w-5 sm:h-5" />
              {cartCount > 0 && (
                <span className="absolute -top-1 -right-1 w-4 h-4 sm:w-5 sm:h-5 rounded-full bg-[#D4AF37] text-[#0A0A0B] group-hover:bg-white font-bold text-[9px] sm:text-[10px] flex items-center justify-center shadow-lg">
                  {cartCount}
                </span>
              )}
            </button>
          </div>
        </div>

        {/* Mobile Navigation Drawer (No public admin link) */}
        {mobileMenuOpen && (
          <div className="lg:hidden border-t border-white/10 bg-[#0E0E10] px-6 py-6 space-y-4 animate-in fade-in duration-200">
            <nav className="flex flex-col space-y-4 text-sm tracking-widest uppercase text-[#C5C5C0]">
              <Link
                href="/"
                onClick={() => setMobileMenuOpen(false)}
                className="hover:text-[#D4AF37]"
              >
                Home
              </Link>
              <Link
                href="/products"
                onClick={() => setMobileMenuOpen(false)}
                className="hover:text-[#D4AF37]"
              >
                All Fragrances
              </Link>
              <Link
                href="/scent-finder"
                onClick={() => setMobileMenuOpen(false)}
                className="text-[#E6C687] flex items-center gap-2"
              >
                <Icon name="SparklesIcon" className="w-4 h-4 text-[#D4AF37]" />
                Scent Finder Quiz
              </Link>
              <Link
                href="/#storytelling"
                onClick={() => setMobileMenuOpen(false)}
                className="hover:text-[#D4AF37]"
              >
                Brand Heritage
              </Link>
              {session?.user && (
                <>
                  <Link
                    href="/orders"
                    onClick={() => setMobileMenuOpen(false)}
                    className="hover:text-[#D4AF37] text-[#D4AF37]"
                  >
                    My Orders
                  </Link>
                  <Link
                    href="/profile"
                    onClick={() => setMobileMenuOpen(false)}
                    className="hover:text-[#D4AF37]"
                  >
                    My Profile & Addresses
                  </Link>
                </>
              )}
            </nav>
          </div>
        )}
      </header>
    </>
  );
}
