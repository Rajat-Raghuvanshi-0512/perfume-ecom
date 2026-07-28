"use client";

import { use, useState, useEffect } from "react";
import Link from "next/link";
import { notFound } from "next/navigation";
import { MOCK_PERFUMES, MOCK_REVIEWS } from "@/lib/mock-perfumes";
import { Perfume, CartItem } from "@/types/perfume";
import { Navbar } from "@/components/storefront/navbar";
import { FragrancePyramid } from "@/components/storefront/fragrance-pyramid";
import { ProductCard } from "@/components/storefront/product-card";
import { QuickViewModal } from "@/components/storefront/quick-view-modal";
import { CartDrawer } from "@/components/storefront/cart-drawer";
import { AuthModal } from "@/components/storefront/auth-modal";
import { Icon } from "@/components/ui/icon";
import { getProductBySlug, getProducts } from "@/actions/products";
import { toast } from "@/components/ui/toast";

export default function ProductDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = use(params);
  const [perfume, setPerfume] = useState<Perfume>(
    MOCK_PERFUMES.find((p) => p.id === id) || MOCK_PERFUMES[0]
  );

  const [relatedPerfumes, setRelatedPerfumes] = useState<Perfume[]>([]);

  useEffect(() => {
    async function loadData() {
      const res = await getProductBySlug(id);
      if (res.success && res.product) {
        setPerfume(res.product);
      }
      const prodRes = await getProducts({ limit: 4 });
      if (prodRes.success && prodRes.products) {
        setRelatedPerfumes(prodRes.products.filter((p: Perfume) => p.id !== id).slice(0, 3));
      }
    }
    loadData();
  }, [id]);

  const [cartOpen, setCartOpen] = useState(false);
  const [authOpen, setAuthOpen] = useState(false);
  const [quickViewPerfume, setQuickViewPerfume] = useState<Perfume | null>(null);

  const [selectedMl, setSelectedMl] = useState<number>(
    perfume.volumes[1]?.ml || 50,
  );
  const selectedVolumeObj =
    perfume.volumes.find((v) => v.ml === selectedMl) || perfume.volumes[0] || { price: perfume.price, ml: 50 };
  const activePrice = selectedVolumeObj.price;
  const [activeImgIndex, setActiveImgIndex] = useState<number>(0);

  const [cartItems, setCartItems] = useState<CartItem[]>([]);

  const handleAddToCart = (
    p: Perfume = perfume,
    ml: number = selectedMl,
    price: number = activePrice,
  ) => {
    setCartItems((prev) => {
      const existing = prev.find(
        (item) => item.perfume.id === p.id && item.selectedMl === ml,
      );
      if (existing) {
        return prev.map((item) =>
          item.perfume.id === p.id && item.selectedMl === ml
            ? { ...item, quantity: item.quantity + 1 }
            : item,
        );
      }
      return [...prev, { perfume: p, selectedMl: ml, price, quantity: 1 }];
    });
    setCartOpen(true);

    toast.add({
      title: "Added to Cart",
      description: `${p.name} (${ml}ml) added to your selection.`,
      type: "success",
    });
  };

  const handleUpdateQuantity = (
    perfumeId: string,
    ml: number,
    delta: number,
  ) => {
    setCartItems(
      (prev) =>
        prev
          .map((item) => {
            if (item.perfume.id === perfumeId && item.selectedMl === ml) {
              const newQty = item.quantity + delta;
              return newQty > 0 ? { ...item, quantity: newQty } : null;
            }
            return item;
          })
          .filter(Boolean) as CartItem[],
    );
  };

  const handleRemoveItem = (perfumeId: string, ml: number) => {
    setCartItems((prev) =>
      prev.filter(
        (item) => !(item.perfume.id === perfumeId && item.selectedMl === ml),
      ),
    );
    toast.add({
      title: "Item Removed",
      description: "Fragrance bottle removed from cart.",
      type: "info",
    });
  };

  const cartTotalCount = cartItems.reduce(
    (sum, item) => sum + item.quantity,
    0,
  );

  return (
    <div className="min-h-screen bg-[#0A0A0B] text-[#F5F5F0]">
      {/* Header */}
      <Navbar
        onOpenCart={() => setCartOpen(true)}
        onOpenAuth={() => setAuthOpen(true)}
        cartCount={cartTotalCount}
      />

      {/* Main PDP Section */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        {/* Breadcrumb Navigation */}
        <div className="flex items-center gap-2 text-[11px] uppercase tracking-widest text-[#888] mb-8">
          <Link href="/" className="hover:text-[#D4AF37] transition-colors">
            Home
          </Link>
          <span>/</span>
          <Link
            href="/products"
            className="hover:text-[#D4AF37] transition-colors"
          >
            Catalog
          </Link>
          <span>/</span>
          <span className="text-[#D4AF37]">{perfume.name}</span>
        </div>

        {/* Top Split Section: Gallery & Details */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-start mb-20">
          {/* Left: Gallery */}
          <div className="space-y-4 sticky top-28">
            <div className="relative aspect-[3/4] overflow-hidden bg-[#0A0A0B] border border-white/10 shadow-2xl">
              <img
                src={perfume.images[activeImgIndex] || perfume.images[0]}
                alt={perfume.name}
                className="w-full h-full object-cover"
              />
              <div className="absolute top-4 left-4 bg-[#D4AF37] text-[#0A0A0B] text-[10px] font-bold uppercase tracking-[0.2em] px-3 py-1 shadow-lg">
                {perfume.concentration}
              </div>
            </div>

            {/* Thumbnails */}
            {perfume.images.length > 1 && (
              <div className="flex gap-4">
                {perfume.images.map((img, idx) => (
                  <button
                    key={idx}
                    onClick={() => setActiveImgIndex(idx)}
                    className={`w-20 h-24 border ${
                      activeImgIndex === idx
                        ? "border-[#D4AF37]"
                        : "border-white/10 opacity-60 hover:opacity-100"
                    } overflow-hidden transition-all`}
                  >
                    <img
                      src={img}
                      alt="Thumbnail"
                      className="w-full h-full object-cover"
                    />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Right: Product Spec & Buy Actions */}
          <div className="space-y-8">
            <div>
              <div className="flex items-center gap-2 text-xs uppercase tracking-[0.3em] text-[#D4AF37] font-semibold mb-2">
                <Icon name="SparklesIcon" className="w-4 h-4" />
                <span>{perfume.family}</span>
              </div>

              <h1 className="text-3xl sm:text-5xl font-serif tracking-[0.1em] uppercase text-[#F5F5F0]">
                {perfume.name}
              </h1>
              <p className="text-sm text-[#A0A098] italic tracking-wide mt-2">
                "{perfume.subtitle}"
              </p>
            </div>

            {/* Price & Rating Bar */}
            <div className="flex items-center justify-between border-y border-white/10 py-4">
              <div>
                <span className="text-3xl font-serif text-[#D4AF37] font-semibold">
                  Rs. {activePrice.toLocaleString("en-IN")}
                </span>
                <span className="text-xs text-[#888] font-mono ml-2">INR</span>
              </div>

              <div className="flex items-center gap-2 text-xs text-[#E6C687]">
                <div className="flex gap-0.5 text-[#D4AF37]">
                  {[...Array(5)].map((_, i) => (
                    <Icon
                      key={i}
                      name="StarIcon"
                      className="w-4 h-4 fill-[#D4AF37]"
                    />
                  ))}
                </div>
                <span className="font-semibold text-white">
                  {perfume.rating}
                </span>
                <span className="text-[#777]">
                  ({perfume.reviewsCount} reviews)
                </span>
              </div>
            </div>

            {/* Description */}
            <p className="text-sm text-[#C5C5C0] leading-relaxed font-light">
              {perfume.description}
            </p>

            {/* Volume Selector */}
            <div className="space-y-3">
              <label className="block text-xs uppercase tracking-wider text-[#D4AF37] font-semibold">
                Select Bottle Volume
              </label>
              <div className="grid grid-cols-3 gap-4">
                {perfume.volumes.map((v) => (
                  <button
                    key={v.ml}
                    onClick={() => setSelectedMl(v.ml)}
                    className={`py-4 px-3 border text-center transition-all ${
                      selectedMl === v.ml
                        ? "border-[#D4AF37] bg-[#D4AF37]/10 text-[#D4AF37]"
                        : "border-white/15 bg-[#121215] text-[#C5C5C0] hover:border-white/30"
                    }`}
                  >
                    <span className="block text-base font-serif font-bold">
                      {v.ml} ml
                    </span>
                    <span className="text-xs text-[#888] font-mono">
                      Rs. {v.price.toLocaleString("en-IN")}
                    </span>
                  </button>
                ))}
              </div>
            </div>

            {/* Sillage & Longevity Cards */}
            <div className="grid grid-cols-2 gap-4 bg-[#121215] p-4 border border-white/10 text-xs">
              <div className="space-y-1">
                <span className="text-[10px] text-[#888] uppercase tracking-wider block">
                  Longevity
                </span>
                <span className="text-[#F5F5F0] font-semibold flex items-center gap-1.5 text-sm">
                  <Icon name="Clock01Icon" className="w-4 h-4 text-[#D4AF37]" />
                  {perfume.longevity}
                </span>
              </div>
              <div className="space-y-1">
                <span className="text-[10px] text-[#888] uppercase tracking-wider block">
                  Sillage Aura
                </span>
                <span className="text-[#F5F5F0] font-semibold flex items-center gap-1.5 text-sm">
                  <Icon
                    name="SparklesIcon"
                    className="w-4 h-4 text-[#D4AF37]"
                  />
                  {perfume.sillage}
                </span>
              </div>
            </div>

            {/* Dual CTAs: Add to Cart & Express Buy Now */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <button
                onClick={() => handleAddToCart(perfume, selectedMl, activePrice)}
                className="py-4 px-4 bg-white/5 border border-[#D4AF37]/50 text-[#D4AF37] font-semibold text-xs uppercase tracking-[0.2em] hover:bg-[#D4AF37]/20 transition-all flex items-center justify-center gap-2 active:scale-95"
              >
                <Icon name="ShoppingBag01Icon" className="w-4 h-4" />
                <span>Add {selectedMl}ml to Cart</span>
              </button>

              <button
                onClick={async () => {
                  handleAddToCart(perfume, selectedMl, activePrice);
                  toast.add({
                    title: "Initiating Express Checkout",
                    description: `Preparing allocation for ${perfume.name}...`,
                    type: "loading",
                  });
                  try {
                    const { createExpressBuyNowSession } = await import("@/actions/checkout");
                    const res = await createExpressBuyNowSession(
                      perfume.id,
                      perfume.name,
                      selectedMl,
                      activePrice,
                      true
                    );
                    if (res.success && res.url) {
                      window.location.href = res.url;
                    }
                  } catch (e) {
                    console.log("Express checkout error:", e);
                  }
                }}
                className="py-4 px-4 bg-[#D4AF37] hover:bg-[#E6C687] text-[#0A0A0B] font-bold text-xs uppercase tracking-[0.2em] transition-all shadow-xl flex items-center justify-center gap-2 active:scale-95"
              >
                <Icon name="FlashIcon" className="w-4 h-4 fill-current" />
                <span>Buy Now (Express)</span>
              </button>
            </div>

            {/* Olfactory Pyramid Component */}
            <FragrancePyramid
              pyramid={perfume.pyramid}
              perfumeName={perfume.name}
            />

            {/* Story & Artisanship Section */}
            <div className="bg-[#121215] border border-white/10 p-6 space-y-3">
              <h3 className="text-xs font-serif uppercase tracking-[0.2em] text-[#E6C687]">
                Distillation Heritage
              </h3>
              <p className="text-xs text-[#B5B5A8] leading-relaxed italic">
                "{perfume.story}"
              </p>
            </div>
          </div>
        </div>

        {/* Customer Reviews Breakdown */}
        <section className="py-16 border-t border-white/10 space-y-8">
          <div className="flex items-center justify-between">
            <h2 className="text-2xl font-serif uppercase tracking-widest text-[#F5F5F0]">
              Patron Reviews & Experiences
            </h2>
            <span className="text-xs text-[#D4AF37] uppercase tracking-wider">
              {perfume.reviewsCount} Verified Reviews
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {MOCK_REVIEWS.map((rev) => (
              <div
                key={rev.id}
                className="bg-[#121215] border border-white/10 p-6 space-y-3"
              >
                <div className="flex text-[#D4AF37] gap-1">
                  {[...Array(rev.rating)].map((_, i) => (
                    <Icon
                      key={i}
                      name="StarIcon"
                      className="w-4 h-4 fill-[#D4AF37]"
                    />
                  ))}
                </div>
                <p className="text-xs text-[#C5C5C0] italic leading-relaxed">
                  "{rev.comment}"
                </p>
                <div className="pt-3 border-t border-white/5 flex items-center justify-between text-[11px]">
                  <span className="font-serif text-white">{rev.author}</span>
                  <span className="text-[#D4AF37]">Verified Collector</span>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Related Scents Grid */}
        <section className="py-16 border-t border-white/10 space-y-8">
          <h2 className="text-2xl font-serif uppercase tracking-widest text-[#F5F5F0]">
            You May Also <span className="italic text-[#E6C687]">Admire</span>
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-8">
            {relatedPerfumes.map((p) => (
              <ProductCard
                key={p.id}
                perfume={p}
                onQuickView={(item) => setQuickViewPerfume(item)}
                onAddToCart={(item) => handleAddToCart(item, 50, item.price)}
              />
            ))}
          </div>
        </section>
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
        onAddToCart={(p, ml, price) => handleAddToCart(p, ml, price)}
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
