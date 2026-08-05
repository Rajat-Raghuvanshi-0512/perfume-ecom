"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { MOCK_PERFUMES, MOCK_REVIEWS } from "@/lib/mock-perfumes";
import { Perfume, CartItem } from "@/types/perfume";
import { Navbar } from "@/components/storefront/navbar";
import { Hero } from "@/components/storefront/hero";
import { Storytelling } from "@/components/storefront/storytelling";
import { ProductCard } from "@/components/storefront/product-card";
import { useSession } from "next-auth/react";
import { QuickViewModal } from "@/components/storefront/quick-view-modal";
import { CartDrawer } from "@/components/storefront/cart-drawer";
import { AuthModal } from "@/components/storefront/auth-modal";
import { BuyNowModal } from "@/components/storefront/buy-now-modal";
import { Icon } from "@/components/ui/icon";
import { ProductGridSkeleton } from "@/components/storefront/storefront-skeletons";
import { getProducts } from "@/actions/products";
import { toast } from "@/components/ui/toast";

export default function StorefrontHomePage() {
  const [cartOpen, setCartOpen] = useState(false);
  const [authOpen, setAuthOpen] = useState(false);
  const [quickViewPerfume, setQuickViewPerfume] = useState<Perfume | null>(null);
  const [productsList, setProductsList] = useState<Perfume[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [newsletterEmail, setNewsletterEmail] = useState("");

  const [cartItems, setCartItems] = useState<CartItem[]>([]);

  useEffect(() => {
    async function loadProducts() {
      setIsLoading(true);
      const res = await getProducts();
      if (res.success && res.products) {
        setProductsList(res.products);
      }
      setIsLoading(false);
    }
    loadProducts();
  }, []);

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
    toast.add({
      title: "Item Removed",
      description: "Fragrance bottle removed from cart.",
      type: "info",
    });
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
        title: "Patron Authentication Required",
        description: "Please sign in or create an account to proceed with Direct Express Order.",
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

  const handleNewsletterJoin = (e: React.FormEvent) => {
    e.preventDefault();
    if (newsletterEmail) {
      toast.add({
        title: "Subscribed to Gazette",
        description: `Private micro-harvest invitations will be sent to ${newsletterEmail}`,
        type: "success",
      });
      setNewsletterEmail("");
    }
  };

  const featuredBestsellers = productsList.slice(0, 3);
  const cartTotalCount = cartItems.reduce(
    (sum, item) => sum + item.quantity,
    0,
  );

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

      {/* Featured Bestsellers Showcase */}
      <section className="py-16 sm:py-24 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 border-b border-white/10">
        <div className="flex flex-col sm:flex-row items-start sm:items-end justify-between mb-8 sm:mb-12 gap-4">
          <div>
            <div className="inline-flex items-center gap-2 text-xs uppercase tracking-[0.3em] text-[#D4AF37] font-semibold mb-2">
              <Icon name="SparklesIcon" className="w-4 h-4" />
              <span>Curated Bestsellers</span>
            </div>
            <h2 className="text-2xl sm:text-4xl font-serif tracking-[0.15em] uppercase font-light">
              Signature{" "}
              <span className="italic text-[#E6C687]">Elixirs & Extraits</span>
            </h2>
          </div>

          <Link
            href="/products"
            className="px-5 py-2.5 sm:px-6 sm:py-3 border border-[#D4AF37] text-[#D4AF37] text-xs uppercase tracking-[0.2em] font-semibold hover:bg-[#D4AF37] hover:text-[#0A0A0B] transition-colors flex items-center gap-2"
          >
            <span>Explore All Fragrances</span>
            <Icon name="ArrowRight01Icon" className="w-4 h-4" />
          </Link>
        </div>

        {/* 3 Featured Products */}
        {isLoading ? (
          <ProductGridSkeleton count={3} />
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5 sm:gap-8">
            {featuredBestsellers.map((perfume) => (
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
      </section>

      {/* Brand Heritage Storytelling */}
      <Storytelling />

      {/* Interactive Scent Quiz Banner CTA */}
      <section className="py-20 bg-[#0E0E11] text-[#F5F5F0] border-b border-white/10 relative overflow-hidden">
        <div className="max-w-4xl mx-auto px-4 text-center space-y-6">
          <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-[#D4AF37]/10 border border-[#D4AF37]/30 text-[#E6C687] text-xs font-semibold uppercase tracking-[0.25em]">
            <Icon name="Compass01Icon" className="w-3.5 h-3.5 text-[#D4AF37]" />
            <span>Personalized Olfactory Match</span>
          </div>

          <h2 className="text-3xl sm:text-4xl font-serif tracking-[0.15em] uppercase font-light">
            Uncover Your Signature{" "}
            <span className="italic text-[#E6C687]">Fragrance Aura</span>
          </h2>

          <p className="text-xs text-[#A0A098] max-w-lg mx-auto tracking-wide leading-relaxed">
            Answer 3 quick aesthetic questions about your preferred mood,
            olfactory notes, and sillage intensity to receive an instant custom
            recommendation.
          </p>

          <Link
            href="/scent-finder"
            className="inline-flex items-center gap-3 px-8 py-4 bg-gradient-to-r from-[#D4AF37] to-[#E6C687] text-[#0A0A0B] font-bold text-xs uppercase tracking-[0.25em] hover:brightness-110 transition-all shadow-xl"
          >
            <span>Take Scent Finder Quiz</span>
            <Icon name="ArrowRight01Icon" className="w-4 h-4" />
          </Link>
        </div>
      </section>

      {/* Customer Reviews */}
      <section className="py-24 bg-[#0A0A0B] border-b border-white/10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center space-y-3 mb-14">
          <div className="inline-flex items-center gap-2 text-xs uppercase tracking-[0.3em] text-[#D4AF37]">
            <Icon name="CrownIcon" className="w-4 h-4" />
            <span>Patron Experiences</span>
          </div>
          <h2 className="text-3xl font-serif uppercase tracking-widest font-light">
            Voices of{" "}
            <span className="italic text-[#E6C687]">Connoisseurs</span>
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {MOCK_REVIEWS.map((rev) => (
            <div
              key={rev.id}
              className="bg-[#121215] border border-white/10 p-8 space-y-4 relative"
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
              <div className="pt-4 border-t border-white/5 flex items-center justify-between">
                <span className="text-xs font-serif text-[#F5F5F0]">
                  {rev.author}
                </span>
                <span className="text-[10px] uppercase text-[#D4AF37] font-semibold">
                  Verified Collector
                </span>
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
              PARFUM ATELIER
            </span>
            <p className="text-[11px] text-[#777] leading-relaxed">
              Haute Parfumerie distilled in Grasse, France. Rare botanical
              harvests, cold maceration, and sacred oriental oud wood.
            </p>
          </div>

          <div>
            <h4 className="text-xs uppercase tracking-[0.2em] text-[#F5F5F0] font-semibold mb-4">
              Navigation
            </h4>
            <ul className="space-y-2 text-[#AAA]">
              <li>
                <Link href="/" className="hover:text-[#D4AF37]">
                  Home
                </Link>
              </li>
              <li>
                <Link href="/products" className="hover:text-[#D4AF37]">
                  All Fragrances
                </Link>
              </li>
              <li>
                <Link href="/scent-finder" className="hover:text-[#D4AF37]">
                  Scent Finder Quiz
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h4 className="text-xs uppercase tracking-[0.2em] text-[#F5F5F0] font-semibold mb-4">
              Private Concierge
            </h4>
            <ul className="space-y-2 text-[#AAA]">
              <li className="hover:text-[#D4AF37] cursor-pointer">
                Complimentary Consultations
              </li>
              <li className="hover:text-[#D4AF37] cursor-pointer">
                Track Royal Express Shipment
              </li>
              <li className="hover:text-[#D4AF37] cursor-pointer">
                Custom Bottle Engraving
              </li>
            </ul>
          </div>

          <div className="space-y-3">
            <h4 className="text-xs uppercase tracking-[0.2em] text-[#F5F5F0] font-semibold">
              The Gazette Subscriptions
            </h4>
            <p className="text-[11px] text-[#777]">
              Receive invitations to private annual micro-harvests and limited
              edition releases.
            </p>
            <form onSubmit={handleNewsletterJoin} className="flex">
              <input
                type="email"
                required
                value={newsletterEmail}
                onChange={(e) => setNewsletterEmail(e.target.value)}
                placeholder="patron@domain.com"
                className="bg-[#121215] border border-white/15 text-xs p-2.5 text-white outline-none w-full placeholder-[#555]"
              />
              <button
                type="submit"
                className="bg-[#D4AF37] text-[#0A0A0B] px-4 font-bold text-xs uppercase tracking-widest hover:bg-[#E6C687] transition-colors"
              >
                Join
              </button>
            </form>
          </div>
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-12 mt-12 border-t border-white/5 flex flex-col sm:flex-row justify-between items-center text-[10px] uppercase tracking-widest text-[#666]">
          <p>© 2026 PARFUM ATELIER India. All Rights Reserved.</p>
          <div className="flex gap-6 mt-4 sm:mt-0">
            <Link
              href="/admin"
              className="hover:text-[#444] transition-colors"
              title="Secret Portal Gate"
            >
              • Private Access
            </Link>
          </div>
        </div>
      </footer>

      {/* Modals */}
      <QuickViewModal
        perfume={quickViewPerfume}
        onClose={() => setQuickViewPerfume(null)}
        onAddToCart={(p, ml, price) => handleAddToCart(p, ml, price)}
        onBuyNow={(p, ml, price) => handleBuyNow(p, ml, price)}
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
