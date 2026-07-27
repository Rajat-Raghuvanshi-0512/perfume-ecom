"use client";

import { useState } from "react";
import Link from "next/link";
import { MOCK_PERFUMES } from "@/lib/mock-perfumes";
import { Perfume, CartItem } from "@/types/perfume";
import { Navbar } from "@/components/storefront/navbar";
import { ScentQuiz } from "@/components/storefront/scent-quiz";
import { QuickViewModal } from "@/components/storefront/quick-view-modal";
import { CartDrawer } from "@/components/storefront/cart-drawer";
import { AuthModal } from "@/components/storefront/auth-modal";

export default function ScentFinderPage() {
  const [cartOpen, setCartOpen] = useState(false);
  const [authOpen, setAuthOpen] = useState(false);
  const [quickViewPerfume, setQuickViewPerfume] = useState<Perfume | null>(null);

  const [cartItems, setCartItems] = useState<CartItem[]>([
    { perfume: MOCK_PERFUMES[0], selectedMl: 50, price: 24500, quantity: 1 },
  ]);

  const handleAddToCart = (perfume: Perfume, selectedMl: number = 50, price: number = perfume.price) => {
    setCartItems((prev) => {
      const existing = prev.find(
        (item) => item.perfume.id === perfume.id && item.selectedMl === selectedMl
      );
      if (existing) {
        return prev.map((item) =>
          item.perfume.id === perfume.id && item.selectedMl === selectedMl
            ? { ...item, quantity: item.quantity + 1 }
            : item
        );
      }
      return [...prev, { perfume, selectedMl, price, quantity: 1 }];
    });
    setCartOpen(true);
  };

  const handleUpdateQuantity = (id: string, ml: number, delta: number) => {
    setCartItems((prev) =>
      prev
        .map((item) => {
          if (item.perfume.id === id && item.selectedMl === ml) {
            const newQty = item.quantity + delta;
            return newQty > 0 ? { ...item, quantity: newQty } : null;
          }
          return item;
        })
        .filter(Boolean) as CartItem[]
    );
  };

  const handleRemoveItem = (id: string, ml: number) => {
    setCartItems((prev) => prev.filter((item) => !(item.perfume.id === id && item.selectedMl === ml)));
  };

  const cartTotalCount = cartItems.reduce((sum, item) => sum + item.quantity, 0);

  return (
    <div className="min-h-screen bg-[#0A0A0B] text-[#F5F5F0]">
      
      {/* Navbar */}
      <Navbar
        onOpenCart={() => setCartOpen(true)}
        onOpenAuth={() => setAuthOpen(true)}
        cartCount={cartTotalCount}
      />

      {/* Breadcrumb Header */}
      <div className="bg-[#121215] border-b border-white/10 py-8 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto flex items-center gap-2 text-[11px] uppercase tracking-widest text-[#888]">
          <Link href="/" className="hover:text-[#D4AF37]">Home</Link>
          <span>/</span>
          <span className="text-[#D4AF37]">Scent Finder Quiz</span>
        </div>
      </div>

      {/* Quiz */}
      <div className="py-12">
        <ScentQuiz onSelectPerfume={(perfume) => setQuickViewPerfume(perfume)} />
      </div>

      {/* Footer */}
      <footer className="bg-[#070708] border-t border-white/10 py-12 text-[#999990] text-xs">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row justify-between items-center text-[10px] uppercase tracking-widest text-[#666]">
          <p>© 2026 PARFUM ATELIER Paris. All Rights Reserved.</p>
          <div className="flex gap-6 mt-4 sm:mt-0">
            <Link href="/" className="hover:text-white">Home</Link>
            <Link href="/products" className="hover:text-white">Catalog</Link>
            <Link href="/scent-finder" className="hover:text-white">Scent Finder</Link>
          </div>
        </div>
      </footer>

      {/* Modals */}
      <QuickViewModal
        perfume={quickViewPerfume}
        onClose={() => setQuickViewPerfume(null)}
        onAddToCart={(p, ml, price) => handleAddToCart(p, ml, price)}
      />

      <CartDrawer
        isOpen={cartOpen}
        onClose={() => setCartOpen(false)}
        items={cartItems}
        onUpdateQuantity={handleUpdateQuantity}
        onRemoveItem={handleRemoveItem}
      />

      <AuthModal
        isOpen={authOpen}
        onClose={() => setAuthOpen(false)}
      />

    </div>
  );
}
