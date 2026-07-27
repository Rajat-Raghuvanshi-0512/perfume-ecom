"use client";

import { useState } from "react";
import { MOCK_PERFUMES, MOCK_REVIEWS } from "@/lib/mock-perfumes";
import { Perfume, CartItem } from "@/types/perfume";
import { Navbar } from "@/components/storefront/navbar";
import { Hero } from "@/components/storefront/hero";
import { Storytelling } from "@/components/storefront/storytelling";
import { ProductCard } from "@/components/storefront/product-card";
import { QuickViewModal } from "@/components/storefront/quick-view-modal";
import { CartDrawer } from "@/components/storefront/cart-drawer";
import { AuthModal } from "@/components/storefront/auth-modal";
import { ScentQuiz } from "@/components/storefront/scent-quiz";
import { Icon } from "@/components/ui/icon";

export default function StorefrontHomePage() {
  const [cartOpen, setCartOpen] = useState(false);
  const [authOpen, setAuthOpen] = useState(false);
  const [quickViewPerfume, setQuickViewPerfume] = useState<Perfume | null>(null);

  // Cart state
  const [cartItems, setCartItems] = useState<CartItem[]>([
    { perfume: MOCK_PERFUMES[0], selectedMl: 50, price: 24500, quantity: 1 },
    { perfume: MOCK_PERFUMES[2], selectedMl: 50, price: 16500, quantity: 1 },
  ]);

  // Catalog Filter State
  const [selectedFamily, setSelectedFamily] = useState<string>("ALL");
  const [selectedConcentration, setSelectedConcentration] = useState<string>("ALL");
  const [searchQuery, setSearchQuery] = useState<string>("");

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

  // Filter logic
  const filteredPerfumes = MOCK_PERFUMES.filter((perfume) => {
    if (selectedFamily !== "ALL" && !perfume.family.includes(selectedFamily)) return false;
    if (selectedConcentration !== "ALL" && !perfume.concentration.includes(selectedConcentration)) return false;
    if (searchQuery) {
      const q = searchQuery.toLowerCase();
      const matchName = perfume.name.toLowerCase().includes(q);
      const matchNotes = perfume.pyramid.top.concat(perfume.pyramid.heart, perfume.pyramid.base).some((n) => n.toLowerCase().includes(q));
      return matchName || matchNotes;
    }
    return true;
  });

  const cartTotalCount = cartItems.reduce((sum, item) => sum + item.quantity, 0);

  return (
    <div className="min-h-screen bg-[#0A0A0B] text-[#F5F5F0] selection:bg-[#D4AF37] selection:text-[#0A0A0B]">
      
      {/* Navbar */}
      <Navbar
        onOpenCart={() => setCartOpen(true)}
        onOpenAuth={() => setAuthOpen(true)}
        cartCount={cartTotalCount}
      />

      {/* Hero Banner */}
      <Hero />

      {/* Brand Heritage Storytelling */}
      <Storytelling />

      {/* Product Catalog & Scent Discovery Section */}
      <section id="catalog" className="py-24 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 border-b border-white/10">
        
        {/* Catalog Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12">
          <div>
            <div className="inline-flex items-center gap-2 text-xs uppercase tracking-[0.3em] text-[#D4AF37] font-semibold mb-2">
              <Icon name="SparklesIcon" className="w-4 h-4" />
              <span>Haute Parfumerie Catalog</span>
            </div>
            <h2 className="text-3xl sm:text-4xl font-serif tracking-[0.15em] uppercase font-light">
              Signature <span className="italic text-[#E6C687]">Elixirs & Extraits</span>
            </h2>
          </div>

          {/* Quick Search */}
          <div className="w-full md:w-72">
            <input
              type="text"
              placeholder="Search by notes (Oud, Rose, Vanilla)..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-[#141418] border border-white/15 focus:border-[#D4AF37] text-xs text-[#F5F5F0] p-3 outline-none placeholder-[#777]"
            />
          </div>
        </div>

        {/* Filter Pills */}
        <div className="flex flex-wrap gap-2 mb-10 pb-4 border-b border-white/10 text-xs uppercase tracking-wider">
          <span className="py-2 px-3 text-[#888] font-semibold flex items-center gap-1">
            <Icon name="FilterIcon" className="w-3.5 h-3.5" /> Family:
          </span>
          {["ALL", "Oriental", "Woody", "Floral", "Fresh", "Gourmand", "Leather"].map((fam) => (
            <button
              key={fam}
              onClick={() => setSelectedFamily(fam)}
              className={`py-2 px-4 border transition-all ${
                selectedFamily === fam
                  ? "border-[#D4AF37] bg-[#D4AF37] text-[#0A0A0B] font-bold"
                  : "border-white/10 bg-[#121215] text-[#C5C5C0] hover:border-white/30"
              }`}
            >
              {fam}
            </button>
          ))}
        </div>

        {/* Product Cards Grid */}
        {filteredPerfumes.length === 0 ? (
          <div className="py-20 text-center text-[#888] space-y-2">
            <p className="text-sm uppercase tracking-widest">No fragrances match your filter criteria.</p>
            <button onClick={() => { setSelectedFamily("ALL"); setSearchQuery(""); }} className="text-xs text-[#D4AF37] underline">
              Reset Filters
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {filteredPerfumes.map((perfume) => (
              <ProductCard
                key={perfume.id}
                perfume={perfume}
                onQuickView={(p) => setQuickViewPerfume(p)}
                onAddToCart={(p) => handleAddToCart(p, 50, p.price)}
              />
            ))}
          </div>
        )}

      </section>

      {/* Interactive Scent Quiz */}
      <ScentQuiz onSelectPerfume={(perfume) => setQuickViewPerfume(perfume)} />

      {/* Customer Testimonials & Reviews */}
      <section className="py-24 bg-[#0A0A0B] border-b border-white/10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center space-y-3 mb-14">
          <div className="inline-flex items-center gap-2 text-xs uppercase tracking-[0.3em] text-[#D4AF37]">
            <Icon name="CrownIcon" className="w-4 h-4" />
            <span>Patron Experiences</span>
          </div>
          <h2 className="text-3xl font-serif uppercase tracking-widest font-light">
            Voices of <span className="italic text-[#E6C687]">Connoisseurs</span>
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {MOCK_REVIEWS.map((rev) => (
            <div key={rev.id} className="bg-[#121215] border border-white/10 p-8 space-y-4 relative">
              <div className="flex text-[#D4AF37] gap-1">
                {[...Array(rev.rating)].map((_, i) => (
                  <Icon key={i} name="StarIcon" className="w-4 h-4 text-[#D4AF37]" />
                ))}
              </div>
              <p className="text-xs text-[#C5C5C0] italic leading-relaxed">
                "{rev.comment}"
              </p>
              <div className="pt-4 border-t border-white/5 flex items-center justify-between">
                <span className="text-xs font-serif text-[#F5F5F0]">{rev.author}</span>
                <span className="text-[10px] uppercase text-[#D4AF37] font-semibold">Verified Collector</span>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-[#070708] border-t border-white/10 pt-16 pb-12 text-[#999990] text-xs">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 grid grid-cols-1 md:grid-cols-4 gap-10">
          
          <div className="space-y-4 md:col-span-1">
            <span className="text-xl font-serif tracking-[0.35em] text-[#F5F5F0] uppercase font-light block">
              Maison de Aura
            </span>
            <p className="text-[11px] text-[#777] leading-relaxed">
              Haute Parfumerie distilled in Grasse, France. Rare botanical harvests, cold maceration, and sacred oriental oud wood.
            </p>
          </div>

          <div>
            <h4 className="text-xs uppercase tracking-[0.2em] text-[#F5F5F0] font-semibold mb-4">
              Collections
            </h4>
            <ul className="space-y-2 text-[#AAA]">
              <li className="hover:text-[#D4AF37] cursor-pointer">Extraits de Parfum</li>
              <li className="hover:text-[#D4AF37] cursor-pointer">Oriental Amber Oils</li>
              <li className="hover:text-[#D4AF37] cursor-pointer">Discovery Vial Sets</li>
              <li className="hover:text-[#D4AF37] cursor-pointer">Home Atmosphere Diffusers</li>
            </ul>
          </div>

          <div>
            <h4 className="text-xs uppercase tracking-[0.2em] text-[#F5F5F0] font-semibold mb-4">
              Private Concierge
            </h4>
            <ul className="space-y-2 text-[#AAA]">
              <li className="hover:text-[#D4AF37] cursor-pointer">Complimentary Consultations</li>
              <li className="hover:text-[#D4AF37] cursor-pointer">Track Royal Express Shipment</li>
              <li className="hover:text-[#D4AF37] cursor-pointer">Custom Bottle Engraving</li>
              <li className="hover:text-[#D4AF37] cursor-pointer">VIP Salon Membership</li>
            </ul>
          </div>

          <div className="space-y-3">
            <h4 className="text-xs uppercase tracking-[0.2em] text-[#F5F5F0] font-semibold">
              The Gazette Subscriptions
            </h4>
            <p className="text-[11px] text-[#777]">
              Receive invitations to private annual micro-harvests and limited edition releases.
            </p>
            <div className="flex">
              <input
                type="email"
                placeholder="patron@domain.com"
                className="bg-[#121215] border border-white/15 text-xs p-2.5 text-white outline-none w-full placeholder-[#555]"
              />
              <button className="bg-[#D4AF37] text-[#0A0A0B] px-4 font-bold text-xs uppercase tracking-widest hover:bg-[#E6C687]">
                Join
              </button>
            </div>
          </div>

        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-12 mt-12 border-t border-white/5 flex flex-col sm:flex-row justify-between items-center text-[10px] uppercase tracking-widest text-[#666]">
          <p>© 2026 Maison de Aura Paris. All Rights Reserved.</p>
          <div className="flex gap-6 mt-4 sm:mt-0">
            <span>Privacy Policy</span>
            <span>Terms of Service</span>
            <span>Grasse Distillery Gazette</span>
          </div>
        </div>
      </footer>

      {/* Quick View Popup Modal */}
      <QuickViewModal
        perfume={quickViewPerfume}
        onClose={() => setQuickViewPerfume(null)}
        onAddToCart={(perfume, ml, price) => handleAddToCart(perfume, ml, price)}
      />

      {/* Cart Drawer */}
      <CartDrawer
        isOpen={cartOpen}
        onClose={() => setCartOpen(false)}
        items={cartItems}
        onUpdateQuantity={handleUpdateQuantity}
        onRemoveItem={handleRemoveItem}
      />

      {/* VIP Auth Modal */}
      <AuthModal
        isOpen={authOpen}
        onClose={() => setAuthOpen(false)}
      />

    </div>
  );
}
