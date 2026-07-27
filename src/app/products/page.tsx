"use client";

import { useState } from "react";
import Link from "next/link";
import { MOCK_PERFUMES } from "@/lib/mock-perfumes";
import { Perfume, CartItem } from "@/types/perfume";
import { Navbar } from "@/components/storefront/navbar";
import { ProductCard } from "@/components/storefront/product-card";
import { QuickViewModal } from "@/components/storefront/quick-view-modal";
import { CartDrawer } from "@/components/storefront/cart-drawer";
import { AuthModal } from "@/components/storefront/auth-modal";
import { Icon } from "@/components/ui/icon";

export default function ProductsPage() {
  const [cartOpen, setCartOpen] = useState(false);
  const [authOpen, setAuthOpen] = useState(false);
  const [quickViewPerfume, setQuickViewPerfume] = useState<Perfume | null>(
    null,
  );

  const [cartItems, setCartItems] = useState<CartItem[]>([
    { perfume: MOCK_PERFUMES[0], selectedMl: 50, price: 24500, quantity: 1 },
  ]);

  // Filters State
  const [selectedFamily, setSelectedFamily] = useState<string>("ALL");
  const [selectedConcentration, setSelectedConcentration] =
    useState<string>("ALL");
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [sortBy, setSortBy] = useState<
    "featured" | "price-asc" | "price-desc" | "rating"
  >("featured");

  const handleAddToCart = (
    perfume: Perfume,
    selectedMl: number = 50,
    price: number = perfume.price,
  ) => {
    setCartItems((prev) => {
      const existing = prev.find(
        (item) =>
          item.perfume.id === perfume.id && item.selectedMl === selectedMl,
      );
      if (existing) {
        return prev.map((item) =>
          item.perfume.id === perfume.id && item.selectedMl === selectedMl
            ? { ...item, quantity: item.quantity + 1 }
            : item,
        );
      }
      return [...prev, { perfume, selectedMl, price, quantity: 1 }];
    });
    setCartOpen(true);
  };

  const handleUpdateQuantity = (id: string, ml: number, delta: number) => {
    setCartItems(
      (prev) =>
        prev
          .map((item) => {
            if (item.perfume.id === id && item.selectedMl === ml) {
              const newQty = item.quantity + delta;
              return newQty > 0 ? { ...item, quantity: newQty } : null;
            }
            return item;
          })
          .filter(Boolean) as CartItem[],
    );
  };

  const handleRemoveItem = (id: string, ml: number) => {
    setCartItems((prev) =>
      prev.filter(
        (item) => !(item.perfume.id === id && item.selectedMl === ml),
      ),
    );
  };

  // Filter & Sort logic
  const filteredPerfumes = MOCK_PERFUMES.filter((perfume) => {
    if (selectedFamily !== "ALL" && !perfume.family.includes(selectedFamily))
      return false;
    if (
      selectedConcentration !== "ALL" &&
      !perfume.concentration.includes(selectedConcentration)
    )
      return false;
    if (searchQuery) {
      const q = searchQuery.toLowerCase();
      const matchName = perfume.name.toLowerCase().includes(q);
      const matchNotes = perfume.pyramid.top
        .concat(perfume.pyramid.heart, perfume.pyramid.base)
        .some((n) => n.toLowerCase().includes(q));
      return matchName || matchNotes;
    }
    return true;
  }).sort((a, b) => {
    if (sortBy === "price-asc") return a.price - b.price;
    if (sortBy === "price-desc") return b.price - a.price;
    if (sortBy === "rating") return b.rating - a.rating;
    return 0;
  });

  const cartTotalCount = cartItems.reduce(
    (sum, item) => sum + item.quantity,
    0,
  );

  return (
    <div className="min-h-screen bg-[#0A0A0B] text-[#F5F5F0]">
      {/* Navbar */}
      <Navbar
        onOpenCart={() => setCartOpen(true)}
        onOpenAuth={() => setAuthOpen(true)}
        cartCount={cartTotalCount}
      />

      {/* Page Header */}
      <div className="bg-[#121215] border-b border-white/10 py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto space-y-4">
          {/* Breadcrumb Navigation */}
          <div className="flex items-center gap-2 text-[11px] uppercase tracking-widest text-[#888]">
            <Link href="/" className="hover:text-[#D4AF37] transition-colors">
              Home
            </Link>
            <span>/</span>
            <span className="text-[#D4AF37]">Fragrance Catalog</span>
          </div>

          <h1 className="text-3xl sm:text-5xl font-serif uppercase tracking-[0.15em] font-light text-[#F5F5F0]">
            The Complete{" "}
            <span className="italic text-[#E6C687]">Olfactory Collection</span>
          </h1>
          <p className="text-xs text-[#A0A098] max-w-xl leading-relaxed tracking-wide">
            Explore cold-macerated extraits, rare Cambodian oud wood accords,
            and hand-plucked botanical elixirs distilled in Grasse, France.
          </p>
        </div>
      </div>

      {/* Main Catalog Section */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="flex flex-col lg:flex-row gap-10">
          {/* Left Sidebar Filter Column */}
          <aside className="w-full lg:w-64 space-y-8 shrink-0">
            {/* Search Input */}
            <div className="space-y-2">
              <label className="text-[11px] uppercase tracking-wider text-[#D4AF37] font-semibold block">
                Search Notes
              </label>
              <div className="relative">
                <Icon
                  name="Search01Icon"
                  className="w-4 h-4 text-[#777] absolute left-3 top-3"
                />
                <input
                  type="text"
                  placeholder="Oud, Amber, Vanilla..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full bg-[#141418] border border-white/15 focus:border-[#D4AF37] text-xs text-[#F5F5F0] pl-9 pr-3 py-2.5 outline-none placeholder-[#666]"
                />
              </div>
            </div>

            {/* Fragrance Family Filter */}
            <div className="space-y-3">
              <label className="text-[11px] uppercase tracking-wider text-[#D4AF37] font-semibold block">
                Fragrance Family
              </label>
              <div className="space-y-1.5 text-xs text-[#C5C5C0]">
                {[
                  "ALL",
                  "Oriental",
                  "Woody",
                  "Floral",
                  "Fresh",
                  "Gourmand",
                  "Leather",
                ].map((fam) => (
                  <button
                    key={fam}
                    onClick={() => setSelectedFamily(fam)}
                    className={`w-full text-left py-2 px-3 border transition-colors flex items-center justify-between ${
                      selectedFamily === fam
                        ? "border-[#D4AF37] bg-[#D4AF37]/10 text-[#D4AF37] font-semibold"
                        : "border-transparent hover:bg-white/5"
                    }`}
                  >
                    <span>
                      {fam === "ALL" ? "All Olfactory Families" : fam}
                    </span>
                    {selectedFamily === fam && (
                      <Icon
                        name="CheckmarkBadge01Icon"
                        className="w-3.5 h-3.5 text-[#D4AF37]"
                      />
                    )}
                  </button>
                ))}
              </div>
            </div>

            {/* Concentration Filter */}
            <div className="space-y-3 pt-4 border-t border-white/10">
              <label className="text-[11px] uppercase tracking-wider text-[#D4AF37] font-semibold block">
                Concentration
              </label>
              <div className="space-y-1.5 text-xs text-[#C5C5C0]">
                {["ALL", "Extrait", "Eau de Parfum"].map((conc) => (
                  <button
                    key={conc}
                    onClick={() => setSelectedConcentration(conc)}
                    className={`w-full text-left py-2 px-3 border transition-colors flex items-center justify-between ${
                      selectedConcentration === conc
                        ? "border-[#D4AF37] bg-[#D4AF37]/10 text-[#D4AF37] font-semibold"
                        : "border-transparent hover:bg-white/5"
                    }`}
                  >
                    <span>{conc === "ALL" ? "All Concentrations" : conc}</span>
                    {selectedConcentration === conc && (
                      <Icon
                        name="CheckmarkBadge01Icon"
                        className="w-3.5 h-3.5 text-[#D4AF37]"
                      />
                    )}
                  </button>
                ))}
              </div>
            </div>

            {/* Reset Button */}
            {(selectedFamily !== "ALL" ||
              selectedConcentration !== "ALL" ||
              searchQuery) && (
              <button
                onClick={() => {
                  setSelectedFamily("ALL");
                  setSelectedConcentration("ALL");
                  setSearchQuery("");
                }}
                className="w-full py-2 border border-white/20 text-xs text-[#888] hover:text-white uppercase tracking-wider"
              >
                Reset All Filters
              </button>
            )}
          </aside>

          {/* Right Product Grid Area */}
          <main className="flex-1 space-y-6">
            {/* Top Toolbar */}
            <div className="flex flex-col sm:flex-row items-center justify-between gap-4 bg-[#121215] p-4 border border-white/10 text-xs">
              <span className="text-[#888] uppercase tracking-wider">
                Showing{" "}
                <strong className="text-white">
                  {filteredPerfumes.length}
                </strong>{" "}
                Artisanal Fragrances
              </span>

              {/* Sort By Dropdown */}
              <div className="flex items-center gap-2">
                <span className="text-[#888] uppercase tracking-wider">
                  Sort by:
                </span>
                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value as any)}
                  className="bg-[#1A1A1F] border border-white/15 text-xs text-[#F5F5F0] p-2 outline-none focus:border-[#D4AF37]"
                >
                  <option value="featured">Featured Curations</option>
                  <option value="price-asc">Price: Low to High</option>
                  <option value="price-desc">Price: High to Low</option>
                  <option value="rating">Highest Patron Rating</option>
                </select>
              </div>
            </div>

            {/* Products Grid */}
            {filteredPerfumes.length === 0 ? (
              <div className="py-24 text-center text-[#888] space-y-3 bg-[#121215] border border-white/5">
                <p className="text-xs uppercase tracking-widest">
                  No fragrances match your selected criteria.
                </p>
                <button
                  onClick={() => {
                    setSelectedFamily("ALL");
                    setSelectedConcentration("ALL");
                    setSearchQuery("");
                  }}
                  className="text-xs text-[#D4AF37] underline uppercase tracking-widest"
                >
                  Clear Search Filters
                </button>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-6">
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
          </main>
        </div>
      </div>

      {/* Footer */}
      <footer className="bg-[#070708] border-t border-white/10 py-12 text-[#999990] text-xs">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row justify-between items-center text-[10px] uppercase tracking-widest text-[#666]">
          <p>© 2026 PARFUM ATELIER India. All Rights Reserved.</p>
          <div className="flex gap-6 mt-4 sm:mt-0">
            <Link href="/" className="hover:text-white">
              Home
            </Link>
            <Link href="/products" className="hover:text-white">
              Catalog
            </Link>
            <Link href="/scent-finder" className="hover:text-white">
              Scent Finder
            </Link>
          </div>
        </div>
      </footer>

      {/* Modals */}
      <QuickViewModal
        perfume={quickViewPerfume}
        onClose={() => setQuickViewPerfume(null)}
        onAddToCart={(perfume, ml, price) =>
          handleAddToCart(perfume, ml, price)
        }
      />

      <CartDrawer
        isOpen={cartOpen}
        onClose={() => setCartOpen(false)}
        items={cartItems}
        onUpdateQuantity={handleUpdateQuantity}
        onRemoveItem={handleRemoveItem}
      />

      <AuthModal isOpen={authOpen} onClose={() => setAuthOpen(false)} />
    </div>
  );
}
