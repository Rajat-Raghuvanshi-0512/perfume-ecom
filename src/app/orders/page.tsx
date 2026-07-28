"use client";

import { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { Icon } from "@/components/ui/icon";
import { getUserOrders } from "@/actions/orders";
import { toast } from "@/components/ui/toast";
import { useCartStore } from "@/lib/store/cart-store";

interface OrderItem {
  id: string;
  variantId: string;
  productId?: string;
  productSlug?: string;
  productName: string;
  subtitle?: string;
  volumeMl: number;
  unitPrice: number;
  quantity: number;
  addSampleVial: boolean;
  image: string;
}

interface OrderData {
  id: string;
  orderNumber: string;
  status: "PENDING" | "PROCESSING" | "SHIPPED" | "DELIVERED" | "CANCELLED";
  paymentStatus: "UNPAID" | "PAID" | "REFUNDED" | "FAILED";
  createdAt: string;
  updatedAt: string;
  totalAmount: number;
  shippingAddress: any;
  items: OrderItem[];
}

export default function OrdersPage() {
  const router = useRouter();
  const { data: session, status: authStatus } = useSession();
  const [orders, setOrders] = useState<OrderData[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<string>("ALL");
  const [expandedOrderId, setExpandedOrderId] = useState<string | null>(null);

  const openCart = useCartStore((state) => state.openCart);

  const fetchOrders = async () => {
    setLoading(true);
    const res = await getUserOrders();
    if (res.success && res.orders) {
      setOrders(res.orders as OrderData[]);
    } else if (res.error) {
      toast.add({
        title: "Unable to load orders",
        description: res.error,
        type: "error",
      });
    }
    setLoading(false);
  };

  useEffect(() => {
    if (authStatus === "authenticated") {
      fetchOrders();
    } else if (authStatus === "unauthenticated") {
      setLoading(false);
    }
  }, [authStatus]);

  if (authStatus === "loading" || loading) {
    return (
      <div className="min-h-screen bg-[#0A0A0B] flex items-center justify-center text-[#D4AF37]">
        <div className="flex flex-col items-center gap-3">
          <Icon name="Loading01Icon" className="w-8 h-8 animate-spin" />
          <span className="text-xs uppercase tracking-widest text-[#A0A098]">
            Retrieving Patron Orders...
          </span>
        </div>
      </div>
    );
  }

  if (authStatus === "unauthenticated" || !session?.user) {
    return (
      <div className="min-h-[75vh] bg-[#0A0A0B] flex flex-col items-center justify-center p-6 text-center">
        <div className="w-20 h-20 rounded-full bg-[#D4AF37]/10 border border-[#D4AF37]/30 flex items-center justify-center text-[#D4AF37] mb-6 shadow-2xl">
          <Icon name="ShoppingBag01Icon" className="w-10 h-10" />
        </div>
        <h1 className="text-3xl font-serif text-[#F5F5F0] mb-3 uppercase tracking-wider">
          Patron Orders Access
        </h1>
        <p className="text-sm text-[#A0A098] max-w-md mb-8 leading-relaxed">
          Please sign in to access your luxury order history, delivery tracking,
          and bespoke reorder privileges.
        </p>
        <Link
          href="/"
          className="px-8 py-3 bg-[#D4AF37] hover:bg-[#E6C687] text-[#0A0A0B] font-bold text-xs uppercase tracking-widest transition-all shadow-lg shadow-[#D4AF37]/10"
        >
          Return to Atelier
        </Link>
      </div>
    );
  }

  const filteredOrders = orders.filter((ord) => {
    if (activeTab === "ALL") return true;
    return ord.status === activeTab;
  });

  const getStatusBadge = (status: OrderData["status"]) => {
    switch (status) {
      case "DELIVERED":
        return {
          label: "Delivered",
          className: "bg-emerald-500/10 border-emerald-500/30 text-emerald-400",
          icon: "Tick02Icon",
        };
      case "SHIPPED":
        return {
          label: "Shipped",
          className: "bg-cyan-500/10 border-cyan-500/30 text-cyan-400",
          icon: "DeliveryTruck01Icon",
        };
      case "PROCESSING":
        return {
          label: "Processing",
          className: "bg-amber-500/10 border-amber-500/30 text-amber-400",
          icon: "HourglassIcon",
        };
      case "CANCELLED":
        return {
          label: "Cancelled",
          className: "bg-rose-500/10 border-rose-500/30 text-rose-400",
          icon: "Cancel01Icon",
        };
      default:
        return {
          label: "Pending",
          className: "bg-zinc-500/10 border-zinc-500/30 text-zinc-400",
          icon: "Clock01Icon",
        };
    }
  };

  const getPaymentStatusBadge = (status: OrderData["paymentStatus"]) => {
    switch (status) {
      case "PAID":
        return (
          <span className="inline-flex items-center gap-1 text-[10px] uppercase font-bold tracking-widest text-emerald-400 bg-emerald-500/10 px-2 py-0.5 border border-emerald-500/20">
            Payment Paid
          </span>
        );
      case "REFUNDED":
        return (
          <span className="inline-flex items-center gap-1 text-[10px] uppercase font-bold tracking-widest text-rose-400 bg-rose-500/10 px-2 py-0.5 border border-rose-500/20">
            Refunded
          </span>
        );
      case "FAILED":
        return (
          <span className="inline-flex items-center gap-1 text-[10px] uppercase font-bold tracking-widest text-red-400 bg-red-500/10 px-2 py-0.5 border border-red-500/20">
            Payment Failed
          </span>
        );
      default:
        return (
          <span className="inline-flex items-center gap-1 text-[10px] uppercase font-bold tracking-widest text-amber-400 bg-amber-500/10 px-2 py-0.5 border border-amber-500/20">
            Payment Unpaid
          </span>
        );
    }
  };

  const getProgressStep = (status: OrderData["status"]) => {
    switch (status) {
      case "DELIVERED":
        return 4;
      case "SHIPPED":
        return 3;
      case "PROCESSING":
        return 2;
      case "CANCELLED":
        return 0;
      default:
        return 1;
    }
  };

  return (
    <div className="min-h-screen bg-[#0A0A0B] text-[#F5F5F0] pb-24">
      {/* Header Banner */}
      <div className="bg-gradient-to-r from-[#121215] via-[#1A1A1E] to-[#121215] border-b border-white/10 py-10 px-4 sm:px-6 lg:px-8">
        <div className="max-w-6xl mx-auto space-y-6">
          {/* Top Quick Navigation Buttons */}
          <div className="flex flex-wrap items-center justify-between gap-3 border-b border-white/5 pb-4">
            <div className="flex items-center gap-2">
              <button
                onClick={() => router.back()}
                className="inline-flex items-center gap-2 px-3.5 py-1.5 bg-white/5 hover:bg-[#D4AF37] hover:text-[#0A0A0B] border border-white/10 text-xs font-semibold uppercase tracking-wider text-[#F5F5F0] transition-all group"
              >
                <Icon name="ArrowLeft01Icon" className="w-4 h-4 text-[#D4AF37] group-hover:text-[#0A0A0B]" />
                <span>Back</span>
              </button>
              <Link
                href="/profile"
                className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-white/5 hover:bg-white/10 border border-white/10 text-xs text-[#C5C5C0] hover:text-white uppercase tracking-wider transition-all"
              >
                <Icon name="UserIcon" className="w-3.5 h-3.5 text-[#D4AF37]" />
                <span>Profile</span>
              </Link>
            </div>

            <Link
              href="/products"
              className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-[#D4AF37]/10 hover:bg-[#D4AF37]/20 border border-[#D4AF37]/30 text-xs text-[#E6C687] hover:text-[#D4AF37] uppercase tracking-wider transition-all"
            >
              <Icon name="ShoppingBag01Icon" className="w-3.5 h-3.5 text-[#D4AF37]" />
              <span>Browse All Fragrances</span>
            </Link>
          </div>

          <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
            <div className="space-y-2">
              <div className="flex items-center gap-2 text-xs uppercase tracking-widest text-[#D4AF37]">
                <Link href="/" className="hover:underline">
                  Home
                </Link>
                <span>/</span>
                <Link href="/profile" className="hover:underline">
                  Patron Profile
                </Link>
                <span>/</span>
                <span className="text-[#F5F5F0]">My Orders</span>
              </div>
              <h1 className="text-3xl sm:text-4xl font-serif text-[#F5F5F0] tracking-wide">
                My Orders & Acquisitions
              </h1>
              <p className="text-xs text-[#A0A098] max-w-xl">
                Track delivery progress, review order items, access invoices, and reorder signature fragrances.
              </p>
            </div>

            <div className="flex items-center gap-4 border-l border-white/10 pl-6 py-1">
              <div>
                <p className="text-[10px] uppercase tracking-widest text-[#A0A098]">
                  Total Orders
                </p>
                <p className="text-2xl font-serif text-[#D4AF37] font-bold">
                  {orders.length}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <main className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 pt-10 space-y-8">
        {/* Status Filter Tabs */}
        <div className="flex items-center gap-2 border-b border-white/10 pb-4 overflow-x-auto scrollbar-none">
          {[
            { id: "ALL", label: "All Orders", count: orders.length },
            {
              id: "PROCESSING",
              label: "Processing",
              count: orders.filter((o) => o.status === "PROCESSING").length,
            },
            {
              id: "SHIPPED",
              label: "Shipped",
              count: orders.filter((o) => o.status === "SHIPPED").length,
            },
            {
              id: "DELIVERED",
              label: "Delivered",
              count: orders.filter((o) => o.status === "DELIVERED").length,
            },
            {
              id: "CANCELLED",
              label: "Cancelled",
              count: orders.filter((o) => o.status === "CANCELLED").length,
            },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`px-4 py-2 text-xs font-semibold uppercase tracking-wider transition-all whitespace-nowrap flex items-center gap-2 border-b-2 -mb-[18px] ${
                activeTab === tab.id
                  ? "border-[#D4AF37] text-[#D4AF37] bg-[#D4AF37]/5"
                  : "border-transparent text-[#A0A098] hover:text-white"
              }`}
            >
              <span>{tab.label}</span>
              <span
                className={`px-1.5 py-0.5 text-[9px] rounded-full font-mono ${
                  activeTab === tab.id
                    ? "bg-[#D4AF37] text-[#0A0A0B] font-bold"
                    : "bg-white/10 text-[#A0A098]"
                }`}
              >
                {tab.count}
              </span>
            </button>
          ))}
        </div>

        {/* Orders List */}
        {filteredOrders.length === 0 ? (
          <div className="p-10 bg-[#121215] border border-white/10 text-center space-y-5 rounded-none">
            <div className="w-16 h-16 rounded-full bg-[#D4AF37]/10 border border-[#D4AF37]/20 flex items-center justify-center text-[#D4AF37] mx-auto">
              <Icon name="ShoppingBag01Icon" className="w-8 h-8 opacity-60" />
            </div>
            <div className="space-y-1">
              <h3 className="text-xl font-serif text-[#F5F5F0]">
                No Orders Found
              </h3>
              <p className="text-xs text-[#A0A098] max-w-sm mx-auto">
                {activeTab === "ALL"
                  ? "You have not placed any orders yet. Discover our olfactory collection to begin your fragrance journey."
                  : `No orders currently matching status "${activeTab}".`}
              </p>
            </div>
            <div className="flex flex-wrap items-center justify-center gap-3 pt-2">
              <Link
                href="/products"
                className="px-6 py-2.5 bg-[#D4AF37] hover:bg-[#E6C687] text-[#0A0A0B] font-bold text-xs uppercase tracking-wider inline-flex items-center gap-2 shadow-lg"
              >
                <Icon name="SparklesIcon" className="w-4 h-4" />
                <span>Explore All Fragrances</span>
              </Link>
              <Link
                href="/profile"
                className="px-6 py-2.5 bg-white/5 hover:bg-white/10 border border-white/10 text-[#F5F5F0] font-semibold text-xs uppercase tracking-wider inline-flex items-center gap-2"
              >
                <Icon name="UserIcon" className="w-4 h-4 text-[#D4AF37]" />
                <span>Back to Profile</span>
              </Link>
            </div>
          </div>
        ) : (
          <div className="space-y-6">
            {filteredOrders.map((ord) => {
              const statusBadge = getStatusBadge(ord.status);
              const isExpanded = expandedOrderId === ord.id;
              const step = getProgressStep(ord.status);

              return (
                <div
                  key={ord.id}
                  className="bg-[#121215] border border-white/10 hover:border-white/20 transition-all shadow-xl overflow-hidden"
                >
                  {/* Order Card Header */}
                  <div className="p-6 border-b border-white/10 bg-[#16161A] flex flex-wrap items-center justify-between gap-4">
                    <div className="space-y-1">
                      <div className="flex items-center gap-3">
                        <span className="text-base sm:text-lg font-serif font-bold text-[#F5F5F0] tracking-wider">
                          Order #{ord.orderNumber}
                        </span>
                        <span
                          className={`px-3 py-0.5 border text-[10px] font-bold uppercase tracking-widest flex items-center gap-1.5 ${statusBadge.className}`}
                        >
                          <Icon
                            name={statusBadge.icon as any}
                            className="w-3 h-3"
                          />
                          <span>{statusBadge.label}</span>
                        </span>
                      </div>
                      <div className="flex items-center gap-4 text-xs font-mono text-[#A0A098]">
                        <span>
                          Placed on{" "}
                          {new Date(ord.createdAt).toLocaleDateString("en-US", {
                            year: "numeric",
                            month: "short",
                            day: "numeric",
                          })}
                        </span>
                        <span>•</span>
                        {getPaymentStatusBadge(ord.paymentStatus)}
                      </div>
                    </div>

                    <div className="flex items-center gap-6">
                      <div className="text-right">
                        <span className="block text-[10px] uppercase tracking-widest text-[#A0A098]">
                          Grand Total
                        </span>
                        <span className="text-lg font-serif font-bold text-[#D4AF37]">
                          ₹{ord.totalAmount.toLocaleString()}
                        </span>
                      </div>

                      <button
                        onClick={() =>
                          setExpandedOrderId(isExpanded ? null : ord.id)
                        }
                        className="px-3 py-1.5 bg-white/5 hover:bg-white/10 border border-white/10 text-xs uppercase tracking-wider text-[#C5C5C0] hover:text-white transition-all flex items-center gap-1.5"
                      >
                        <span>
                          {isExpanded ? "Hide Details" : "View Details"}
                        </span>
                        <Icon
                          name={
                            isExpanded ? "ArrowUp01Icon" : "ArrowDown01Icon"
                          }
                          className="w-4 h-4 text-[#D4AF37]"
                        />
                      </button>
                    </div>
                  </div>

                  {/* Visual Order Progress Tracker */}
                  {ord.status !== "CANCELLED" && (
                    <div className="px-6 py-5 bg-[#0F0F12] border-b border-white/5">
                      <div className="max-w-3xl mx-auto">
                        <div className="relative flex items-center justify-between">
                          {/* Progress Line */}
                          <div className="absolute left-0 top-1/2 -translate-y-1/2 w-full h-0.5 bg-white/10 z-0" />
                          <div
                            className="absolute left-0 top-1/2 -translate-y-1/2 h-0.5 bg-[#D4AF37] z-0 transition-all duration-500"
                            style={{
                              width: `${((step - 1) / 3) * 100}%`,
                            }}
                          />

                          {[
                            { level: 1, label: "Placed" },
                            { level: 2, label: "Processing" },
                            { level: 3, label: "Shipped" },
                            { level: 4, label: "Delivered" },
                          ].map((s) => {
                            const isCompleted = step >= s.level;
                            return (
                              <div
                                key={s.level}
                                className="relative z-10 flex flex-col items-center gap-1.5"
                              >
                                <div
                                  className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold transition-all ${
                                    isCompleted
                                      ? "bg-[#D4AF37] text-[#0A0A0B] shadow-lg shadow-[#D4AF37]/20"
                                      : "bg-[#18181C] text-[#888880] border border-white/10"
                                  }`}
                                >
                                  {isCompleted ? (
                                    <Icon
                                      name="Tick02Icon"
                                      className="w-3.5 h-3.5"
                                    />
                                  ) : (
                                    s.level
                                  )}
                                </div>
                                <span
                                  className={`text-[10px] uppercase tracking-wider font-mono ${
                                    isCompleted
                                      ? "text-[#E6C687] font-semibold"
                                      : "text-[#888880]"
                                  }`}
                                >
                                  {s.label}
                                </span>
                              </div>
                            );
                          })}
                        </div>
                      </div>
                    </div>
                  )}

                  {/* Order Items Preview */}
                  <div className="p-6 space-y-4">
                    <div className="divide-y divide-white/5">
                      {ord.items.map((item) => (
                        <div
                          key={item.id}
                          className="py-4 first:pt-0 last:pb-0 flex flex-col sm:flex-row sm:items-center justify-between gap-4"
                        >
                          <div className="flex items-center gap-4">
                            <div className="w-16 h-16 bg-[#18181C] border border-white/10 flex-shrink-0 flex items-center justify-center p-1 relative overflow-hidden">
                              {item.image &&
                              item.image !==
                                "/images/perfume-placeholder.png" ? (
                                <img
                                  src={item.image}
                                  alt={item.productName}
                                  className="w-full h-full object-cover"
                                />
                              ) : (
                                <Icon
                                  name="SparklesIcon"
                                  className="w-6 h-6 text-[#D4AF37]/40"
                                />
                              )}
                            </div>

                            <div className="space-y-1">
                              <h4 className="text-sm font-serif font-semibold text-[#F5F5F0]">
                                {item.productName}
                              </h4>
                              <div className="flex items-center gap-3 text-xs text-[#A0A098] font-mono">
                                <span>{item.volumeMl}ml Eau de Parfum</span>
                                <span>Qty: {item.quantity}</span>
                              </div>
                              {item.addSampleVial && (
                                <span className="inline-flex items-center gap-1 text-[9px] uppercase tracking-widest text-[#D4AF37] bg-[#D4AF37]/10 px-2 py-0.5 border border-[#D4AF37]/30">
                                  <Icon
                                    name="SparklesIcon"
                                    className="w-2.5 h-2.5"
                                  />
                                  + Complimentary 2ml Discovery Vial
                                </span>
                              )}
                            </div>
                          </div>

                          <div className="flex items-center justify-between sm:justify-end gap-4">
                            <span className="text-sm font-serif text-[#D4AF37] font-medium">
                              ₹
                              {(
                                item.unitPrice * item.quantity
                              ).toLocaleString()}
                            </span>

                            {item.productSlug && (
                              <Link
                                href={`/products/${item.productSlug}`}
                                className="px-3 py-1.5 bg-white/5 hover:bg-[#D4AF37] hover:text-[#0A0A0B] text-xs uppercase tracking-wider text-[#E6C687] border border-[#D4AF37]/30 transition-colors"
                              >
                                View Product
                              </Link>
                            )}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Expanded Order Details Section */}
                  {isExpanded && (
                    <div className="p-6 bg-[#0E0E10] border-t border-white/10 space-y-6 animate-in fade-in duration-150">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        {/* Shipping Address Details */}
                        <div className="space-y-2 bg-[#141418] p-4 border border-white/5">
                          <h5 className="text-xs uppercase tracking-wider text-[#D4AF37] font-bold flex items-center gap-1.5">
                            <Icon name="Location01Icon" className="w-4 h-4" />
                            Delivery Destination
                          </h5>
                          {ord.shippingAddress ? (
                            <div className="text-xs text-[#C5C5C0] space-y-1 font-mono pt-1">
                              <p className="font-semibold text-white">
                                {ord.shippingAddress.fullName ||
                                  ord.shippingAddress.name ||
                                  "Patron Customer"}
                              </p>
                              <p>
                                {ord.shippingAddress.streetAddress ||
                                  ord.shippingAddress.line1}
                              </p>
                              {ord.shippingAddress.apartment && (
                                <p>{ord.shippingAddress.apartment}</p>
                              )}
                              <p>
                                {ord.shippingAddress.city},{" "}
                                {ord.shippingAddress.state} -{" "}
                                {ord.shippingAddress.postalCode ||
                                  ord.shippingAddress.postal_code}
                              </p>
                              <p className="text-[#D4AF37] uppercase">
                                {ord.shippingAddress.country || "India"}
                              </p>
                              {ord.shippingAddress.phone && (
                                <p className="text-[#A0A098]">
                                  Phone: {ord.shippingAddress.phone}
                                </p>
                              )}
                            </div>
                          ) : (
                            <p className="text-xs text-[#A0A098]">
                              Standard Atelier Priority Shipping
                            </p>
                          )}
                        </div>

                        {/* Summary Payment Breakdown */}
                        <div className="space-y-2 bg-[#141418] p-4 border border-white/5">
                          <h5 className="text-xs uppercase tracking-wider text-[#D4AF37] font-bold flex items-center gap-1.5">
                            <Icon name="Invoice01Icon" className="w-4 h-4" />
                            Payment Breakdown
                          </h5>
                          <div className="text-xs text-[#C5C5C0] space-y-2 pt-1 font-mono">
                            <div className="flex justify-between">
                              <span className="text-[#A0A098]">
                                Items Subtotal
                              </span>
                              <span>₹{ord.totalAmount.toLocaleString()}</span>
                            </div>
                            <div className="flex justify-between">
                              <span className="text-[#A0A098]">
                                Complimentary Express Shipping
                              </span>
                              <span className="text-emerald-400">FREE</span>
                            </div>
                            <div className="flex justify-between border-t border-white/10 pt-2 font-semibold text-white">
                              <span>Total Amount Paid</span>
                              <span className="text-[#D4AF37]">
                                ₹{ord.totalAmount.toLocaleString()}
                              </span>
                            </div>
                          </div>
                        </div>
                      </div>

                      <div className="flex items-center justify-between pt-2">
                        <div className="text-[11px] text-[#A0A098] flex items-center gap-1.5">
                          <Icon
                            name="InformationCircleIcon"
                            className="w-4 h-4 text-[#D4AF37]"
                          />
                          <span>
                            Need modifications or concierge assistance for Order
                            #{ord.orderNumber}?
                          </span>
                        </div>
                        <a
                          href="mailto:concierge@maison-de-aura.com"
                          className="text-xs uppercase tracking-wider text-[#D4AF37] hover:underline flex items-center gap-1"
                        >
                          Contact Concierge
                        </a>
                      </div>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        )}
      </main>
    </div>
  );
}
