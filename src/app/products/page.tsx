"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { MOCK_PERFUMES } from "@/lib/mock-perfumes";
import { Perfume, CartItem } from "@/types/perfume";
import { Navbar } from "@/components/storefront/navbar";
import { useSession } from "next-auth/react";
import { ProductCard } from "@/components/storefront/product-card";
import { QuickViewModal } from "@/components/storefront/quick-view-modal";
import { CartDrawer } from "@/components/storefront/cart-drawer";
import { AuthModal } from "@/components/storefront/auth-modal";
import { BuyNowModal } from "@/components/storefront/buy-now-modal";
import { Icon } from "@/components/ui/icon";
import { ProductGridSkeleton } from "@/components/storefront/storefront-skeletons";
import { getProducts } from "@/actions/products";
import { toast } from "@/components/ui/toast";

export default function ProductsPage() {
  const [cartOpen, setCartOpen] = useState(false);
  const [authOpen, setAuthOpen] = useState(false);
  const [quickViewPerfume, setQuickViewPerfume] = useState<Perfume | null>(null);
  const [productsList, setProductsList] = useState<Perfume[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const [cartItems, setCartItems] = useState<CartItem[]>([]);

  // Filters State
  const [selectedFamily, setSelectedFamily] = useState<string>("ALL");
  const [selectedConcentration, setSelectedConcentration] = useState<string>("ALL");
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [sortBy, setSortBy] = useState<"featured" | "price-asc" | "price-desc" | "rating">("featured");
  const [mobileFilterOpen, setMobileFilterOpen] = useState(false);

  const activeFiltersCount =
    (selectedFamily !== "ALL" ? 1 : 0) +
    (selectedConcentration !== "ALL" ? 1 : 0) +
    (searchQuery ? 1 : 0);

  useEffect(() => {
    async function loadProducts() {
      setIsLoading(true);
      const res = await getProducts({
        family: selectedFamily !== "ALL" ? selectedFamily : undefined,
        concentration: selectedConcentration !== "ALL" ? selectedConcentration : undefined,
        search: searchQuery || undefined,
      });
      if (res.success && res.products) {
        setProductsList(res.products);
      }
      setIsLoading(false);
    }
    loadProducts();
  }, [selectedFamily, selectedConcentration, searchQuery]);

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

  const { data: session } = useSession();
  const [buyNowOpen, setBuyNowOpen] = useState(false);
  const [pendingAuthForBuyNow, setPendingAuthForBuyNow] = useState(false);
  const [buyNowSelection, setBuyNowSelection] = useState<{
    perfume: Perfume;
    selectedMl: number;
    price: number;
  } | null>(null);

  useEffect(() => {
    if (session?.user && buyNowSelection && pendingAuthForBuyNow) {
      setPendingAuthForBuyNow(false);
      setBuyNowOpen(true);
    }
  }, [session, buyNowSelection, pendingAuthForBuyNow]);

  const handleBuyNow = (
    perfume: Perfume,
    selectedMl: number = 50,
    price: number = perfume.price
  ) => {
    setBuyNowSelection({ perfume, selectedMl, price });
    if (!session?.user) {
      setPendingAuthForBuyNow(true);
      toast.add({
        title: "VIP Authentication Required",
        description: "Please sign in or create an account to proceed with Direct Express Purchase.",
        type: "info",
      });
      setAuthOpen(true);
    } else {
      setBuyNowOpen(true);
    }
  };

  const handleCloseBuyNow = () => {
    setBuyNowOpen(false);
    setBuyNowSelection(null);
    setPendingAuthForBuyNow(false);
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
    toast.add({
      title: "Item Removed",
      description: "Fragrance bottle removed from cart.",
      type: "info",
    });
  };

  // Filter & Sort logic
  const filteredPerfumes = productsList.filter((perfume) => {
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

      {/* Page Header (Desktop Only) */}
      <div className="hidden lg:block bg-[#121215] border-b border-white/10 py-12 px-4 sm:px-6 lg:px-8">
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

      {/* Mobile Subheader & Filter Dropdown (Mobile Only) */}
      <div className="lg:hidden sticky top-[56px] sm:top-[72px] z-30 bg-[#0A0A0B]/95 backdrop-blur-md border-b border-white/15 px-3 py-2.5 shadow-2xl">
        <div className="flex items-center gap-2">
          {/* Search Input */}
          <div className="relative flex-1">
            <Icon
              name="Search01Icon"
              className="w-4 h-4 text-[#888] absolute left-3 top-1/2 -translate-y-1/2"
            />
            <input
              type="text"
              placeholder="Search notes or scents..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-[#141418] border border-white/20 focus:border-[#D4AF37] text-xs text-[#F5F5F0] pl-9 pr-7 py-2 outline-none placeholder-[#777]"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery("")}
                className="absolute right-2 top-1/2 -translate-y-1/2 text-[#888] hover:text-white p-0.5"
                aria-label="Clear Search"
              >
                <Icon name="Cancel01Icon" className="w-3.5 h-3.5" />
              </button>
            )}
          </div>

          {/* Mobile Filter Toggle Button */}
          <button
            type="button"
            onClick={() => setMobileFilterOpen(!mobileFilterOpen)}
            className={`px-3 py-2 border text-xs uppercase tracking-wider font-semibold flex items-center gap-1.5 transition-all shrink-0 ${
              mobileFilterOpen || activeFiltersCount > 0
                ? "bg-[#D4AF37] text-[#0A0A0B] border-[#D4AF37]"
                : "bg-[#141418] text-[#F5F5F0] border-white/20 hover:border-[#D4AF37]/50"
            }`}
          >
            <Icon name="FilterIcon" className="w-4 h-4 shrink-0" />
            <span>Filter</span>
            {activeFiltersCount > 0 && (
              <span className="w-4 h-4 rounded-full bg-[#0A0A0B] text-[#D4AF37] text-[10px] font-bold flex items-center justify-center -mr-0.5">
                {activeFiltersCount}
              </span>
            )}
          </button>
        </div>

        {/* Collapsible Mobile Filter Dropdown Drawer */}
        {mobileFilterOpen && (
          <div className="mt-2.5 p-4 bg-[#121215] border border-[#D4AF37]/30 shadow-2xl space-y-4 animate-in fade-in duration-200">
            {/* Fragrance Family */}
            <div>
              <label className="text-[10px] uppercase tracking-widest text-[#D4AF37] font-semibold block mb-2">
                Fragrance Family
              </label>
              <div className="flex flex-wrap gap-1.5">
                {["ALL", "Oriental", "Woody", "Floral", "Fresh", "Gourmand", "Leather"].map((fam) => (
                  <button
                    key={fam}
                    onClick={() => setSelectedFamily(fam)}
                    className={`px-2.5 py-1 text-xs border transition-all ${
                      selectedFamily === fam
                        ? "bg-[#D4AF37] text-[#0A0A0B] border-[#D4AF37] font-bold shadow-sm"
                        : "bg-white/5 text-[#C5C5C0] border-white/10 hover:border-white/30"
                    }`}
                  >
                    {fam === "ALL" ? "All Families" : fam}
                  </button>
                ))}
              </div>
            </div>

            {/* Concentration */}
            <div>
              <label className="text-[10px] uppercase tracking-widest text-[#D4AF37] font-semibold block mb-2">
                Concentration
              </label>
              <div className="flex flex-wrap gap-1.5">
                {["ALL", "Extrait", "Eau de Parfum"].map((conc) => (
                  <button
                    key={conc}
                    onClick={() => setSelectedConcentration(conc)}
                    className={`px-2.5 py-1 text-xs border transition-all ${
                      selectedConcentration === conc
                        ? "bg-[#D4AF37] text-[#0A0A0B] border-[#D4AF37] font-bold shadow-sm"
                        : "bg-white/5 text-[#C5C5C0] border-white/10 hover:border-white/30"
                    }`}
                  >
                    {conc === "ALL" ? "All Concentrations" : conc}
                  </button>
                ))}
              </div>
            </div>

            {/* Sort By */}
            <div>
              <label className="text-[10px] uppercase tracking-widest text-[#D4AF37] font-semibold block mb-2">
                Sort By
              </label>
              <div className="grid grid-cols-2 gap-1.5 text-xs">
                {[
                  { id: "featured", label: "Featured" },
                  { id: "price-asc", label: "Price: Low to High" },
                  { id: "price-desc", label: "Price: High to Low" },
                  { id: "rating", label: "Highest Rating" },
                ].map((opt) => (
                  <button
                    key={opt.id}
                    onClick={() => setSortBy(opt.id as any)}
                    className={`px-2.5 py-1.5 text-left border transition-all text-[11px] ${
                      sortBy === opt.id
                        ? "bg-[#D4AF37]/20 text-[#D4AF37] border-[#D4AF37] font-semibold"
                        : "bg-white/5 text-[#888] border-white/10"
                    }`}
                  >
                    {opt.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Footer Actions */}
            <div className="pt-2 border-t border-white/10 flex items-center justify-between gap-3">
              {activeFiltersCount > 0 ? (
                <button
                  onClick={() => {
                    setSelectedFamily("ALL");
                    setSelectedConcentration("ALL");
                    setSearchQuery("");
                  }}
                  className="text-xs text-[#888] underline uppercase tracking-wider hover:text-white"
                >
                  Reset All
                </button>
              ) : (
                <span className="text-[10px] text-[#666] uppercase tracking-widest">
                  {filteredPerfumes.length} Fragrances
                </span>
              )}

              <button
                onClick={() => setMobileFilterOpen(false)}
                className="px-4 py-2 bg-[#D4AF37] hover:bg-[#E6C687] text-[#0A0A0B] text-xs font-bold uppercase tracking-wider shadow-md ml-auto"
              >
                Apply ({filteredPerfumes.length})
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Main Catalog Section */}
      <div className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8 py-4 sm:py-12">
        <div className="flex flex-col lg:flex-row gap-10">
          {/* Left Sidebar Filter Column (Desktop Only) */}
          <aside className="hidden lg:block w-64 space-y-8 shrink-0">
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
          <main className="flex-1 space-y-4 sm:space-y-6">
            {/* Top Toolbar (Desktop Only) */}
            <div className="hidden lg:flex flex-row items-center justify-between gap-4 bg-[#121215] p-4 border border-white/10 text-xs">
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

            {/* Products Grid (2 columns on mobile, 3 on lg desktop) */}
            {isLoading ? (
              <ProductGridSkeleton count={6} />
            ) : filteredPerfumes.length === 0 ? (
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
              <div className="grid grid-cols-2 lg:grid-cols-3 gap-2.5 sm:gap-6">
                {filteredPerfumes.map((perfume) => (
                  <ProductCard
                    key={perfume.id}
                    perfume={perfume}
                    onQuickView={(p) => setQuickViewPerfume(p)}
                    onAddToCart={handleAddToCart}
                    onBuyNow={handleBuyNow}
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
        onAddToCart={handleAddToCart}
        onBuyNow={handleBuyNow}
      />

      <CartDrawer
        isOpen={cartOpen}
        onClose={() => setCartOpen(false)}
        items={cartItems}
        onUpdateQuantity={handleUpdateQuantity}
        onRemoveItem={handleRemoveItem}
      />

      <AuthModal isOpen={authOpen} onClose={() => setAuthOpen(false)} />

      <BuyNowModal
        isOpen={buyNowOpen}
        onClose={handleCloseBuyNow}
        perfume={buyNowSelection?.perfume || null}
        selectedMl={buyNowSelection?.selectedMl || 50}
        price={buyNowSelection?.price || 0}
      />
    </div>
  );
}
