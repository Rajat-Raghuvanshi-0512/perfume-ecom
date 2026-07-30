"use client";

import { useEffect, useState, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";
import { Icon } from "@/components/ui/icon";
import { getOrderBySessionId } from "@/actions/orders";

interface OrderItem {
  id: string;
  productName: string;
  volumeMl: number;
  unitPrice: number;
  quantity: number;
  addSampleVial: boolean;
  image: string;
  productSlug?: string;
}

interface OrderData {
  id: string;
  orderNumber: string;
  status: string;
  paymentStatus: string;
  createdAt: string;
  totalAmount: number;
  shippingAddress: any;
  items: OrderItem[];
}

function SuccessContent() {
  const searchParams = useSearchParams();
  const sessionId = searchParams.get("session_id");

  const [order, setOrder] = useState<OrderData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (sessionId) {
      getOrderBySessionId(sessionId).then((res) => {
        if (res.success && res.order) {
          setOrder(res.order as OrderData);
        }
        setLoading(false);
      });
    } else {
      setLoading(false);
    }
  }, [sessionId]);

  return (
    <div className="min-h-screen bg-[#0A0A0B] text-[#F5F5F0] py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-3xl mx-auto space-y-8">
        
        {/* Success Header Card */}
        <div className="bg-[#121215] border border-[#D4AF37]/30 shadow-2xl p-8 sm:p-10 text-center relative overflow-hidden">
          {/* Top Decorative Gold Accent Line */}
          <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-transparent via-[#D4AF37] to-transparent" />

          <div className="w-20 h-20 rounded-full bg-[#D4AF37]/10 border border-[#D4AF37]/40 flex items-center justify-center text-[#D4AF37] mx-auto mb-6 shadow-2xl animate-in zoom-in-50 duration-300">
            <Icon name="Tick02Icon" className="w-10 h-10" />
          </div>

          <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-[#D4AF37]/10 border border-[#D4AF37]/30 text-[#D4AF37] text-[10px] uppercase tracking-[0.25em] font-medium mb-3">
            <Icon name="SparklesIcon" className="w-3.5 h-3.5" />
            <span>Order Confirmed</span>
          </div>

          <h1 className="text-3xl sm:text-4xl font-serif text-[#F5F5F0] tracking-wide mb-3">
            Thank You For Your Acquisition
          </h1>
          <p className="text-xs sm:text-sm text-[#A0A098] max-w-lg mx-auto leading-relaxed">
            Your payment has been successfully authorized. Our master perfumers are carefully preparing your artisanal fragrance formulation for priority dispatch.
          </p>

          {order && (
            <div className="mt-6 inline-flex flex-wrap items-center justify-center gap-4 p-3 bg-[#1A1A1E] border border-white/10 font-mono text-xs text-[#E6C687]">
              <span>Order Ref: <strong>#{order.orderNumber}</strong></span>
              <span>•</span>
              <span className="text-emerald-400 font-bold uppercase tracking-wider">Status: {order.paymentStatus === "PAID" ? "Payment Confirmed" : "Processing"}</span>
            </div>
          )}
        </div>

        {/* Order Details & Summary */}
        {loading ? (
          <div className="p-8 bg-[#121215] border border-white/10 text-center space-y-3">
            <Icon name="Loading01Icon" className="w-6 h-6 animate-spin text-[#D4AF37] mx-auto" />
            <p className="text-xs text-[#A0A098] uppercase tracking-widest">Retrieving order details...</p>
          </div>
        ) : order ? (
          <div className="bg-[#121215] border border-white/10 p-6 sm:p-8 space-y-6">
            <h2 className="text-lg font-serif text-[#F5F5F0] uppercase tracking-wider border-b border-white/10 pb-4 flex items-center justify-between">
              <span>Order Summary</span>
              <span className="text-sm font-mono text-[#D4AF37]">₹{order.totalAmount.toLocaleString()}</span>
            </h2>

            {/* Items Purchased */}
            <div className="divide-y divide-white/5">
              {order.items.map((item) => (
                <div key={item.id} className="py-4 first:pt-0 last:pb-0 flex items-center justify-between gap-4">
                  <div className="flex items-center gap-4">
                    <div className="w-14 h-14 bg-[#1A1A1E] border border-white/10 flex-shrink-0 flex items-center justify-center p-1 relative overflow-hidden">
                      {item.image && item.image !== "/images/perfume-placeholder.png" ? (
                        <img src={item.image} alt={item.productName} className="w-full h-full object-cover" />
                      ) : (
                        <Icon name="SparklesIcon" className="w-5 h-5 text-[#D4AF37]/40" />
                      )}
                    </div>
                    <div className="space-y-1">
                      <h4 className="text-sm font-serif font-semibold text-[#F5F5F0]">{item.productName}</h4>
                      <p className="text-xs text-[#A0A098] font-mono">{item.volumeMl}ml Eau de Parfum • Qty: {item.quantity}</p>
                      {item.addSampleVial && (
                        <span className="inline-flex items-center gap-1 text-[9px] uppercase tracking-widest text-[#D4AF37] bg-[#D4AF37]/10 px-2 py-0.5 border border-[#D4AF37]/30">
                          + Complimentary 2ml Sample Vial
                        </span>
                      )}
                    </div>
                  </div>
                  <span className="text-sm font-serif text-[#D4AF37] font-medium">
                    ₹{(item.unitPrice * item.quantity).toLocaleString()}
                  </span>
                </div>
              ))}
            </div>

            {/* Delivery Destination */}
            {order.shippingAddress && (
              <div className="pt-4 border-t border-white/10 space-y-2">
                <h3 className="text-xs uppercase tracking-wider text-[#D4AF37] font-bold flex items-center gap-1.5">
                  <Icon name="Location01Icon" className="w-4 h-4" />
                  Delivery Destination
                </h3>
                <div className="text-xs text-[#C5C5C0] font-mono leading-relaxed bg-[#1A1A1E] p-3 border border-white/5">
                  <p className="font-semibold text-white">{order.shippingAddress.fullName || order.shippingAddress.name}</p>
                  <p>{order.shippingAddress.streetAddress || order.shippingAddress.line1}</p>
                  <p>{order.shippingAddress.city}, {order.shippingAddress.state} - {order.shippingAddress.postalCode}</p>
                  <p className="text-[#D4AF37] uppercase">{order.shippingAddress.country || "India"}</p>
                </div>
              </div>
            )}
          </div>
        ) : (
          <div className="bg-[#121215] border border-white/10 p-6 text-center text-xs text-[#A0A098]">
            Order receipt generated. Detailed summary has been dispatched to your email.
          </div>
        )}

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-4">
          <Link
            href="/orders"
            className="w-full sm:w-auto px-8 py-3.5 bg-gradient-to-r from-[#D4AF37] to-[#E6C687] text-[#0A0A0B] font-bold text-xs uppercase tracking-[0.2em] hover:opacity-95 transition-all shadow-lg flex items-center justify-center gap-2 group"
          >
            <span>View All Orders & Tracking</span>
            <Icon name="ArrowRight01Icon" className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
          </Link>

          <Link
            href="/products"
            className="w-full sm:w-auto px-8 py-3.5 bg-white/5 hover:bg-white/10 border border-white/15 text-[#F5F5F0] font-semibold text-xs uppercase tracking-[0.2em] transition-all text-center"
          >
            Continue Shopping
          </Link>
        </div>

      </div>
    </div>
  );
}

export default function CheckoutSuccessPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen bg-[#0A0A0B] flex items-center justify-center text-[#D4AF37]">
          <Icon name="Loading01Icon" className="w-8 h-8 animate-spin" />
        </div>
      }
    >
      <SuccessContent />
    </Suspense>
  );
}
