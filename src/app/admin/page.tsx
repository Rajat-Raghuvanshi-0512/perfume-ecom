"use client";

import { useState } from "react";
import Link from "next/link";
import { MOCK_PERFUMES } from "@/lib/mock-perfumes";
import { Perfume } from "@/types/perfume";
import { Icon } from "@/components/ui/icon";

interface AdminOrder {
  id: string;
  customerName: string;
  customerEmail: string;
  date: string;
  total: number;
  status: "Pending" | "Processing" | "Shipped" | "Delivered";
  itemsCount: number;
}

const MOCK_ADMIN_ORDERS: AdminOrder[] = [
  { id: "ORD-9841", customerName: "Countess Genevieve", customerEmail: "genevieve@devance.fr", date: "2026-07-27", total: 43000, status: "Processing", itemsCount: 2 },
  { id: "ORD-9840", customerName: "Julian Thorne", customerEmail: "j.thorne@luxury.com", date: "2026-07-26", total: 16500, status: "Shipped", itemsCount: 1 },
  { id: "ORD-9839", customerName: "Claire Sterling", customerEmail: "claire@sterling.co.uk", date: "2026-07-25", total: 33400, status: "Delivered", itemsCount: 2 },
  { id: "ORD-9838", customerName: "Baron von Richter", customerEmail: "richter@vienna.at", date: "2026-07-24", total: 67500, status: "Delivered", itemsCount: 3 },
];

export default function AdminDashboardPage() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [passcode, setPasscode] = useState("");
  const [passcodeError, setPasscodeError] = useState(false);

  const [activeTab, setActiveTab] = useState<"dashboard" | "products" | "orders">("dashboard");
  const [perfumesList, setPerfumesList] = useState<Perfume[]>(MOCK_PERFUMES);
  const [ordersList, setOrdersList] = useState<AdminOrder[]>(MOCK_ADMIN_ORDERS);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");

  // New perfume form state
  const [newPerfumeName, setNewPerfumeName] = useState("");
  const [newSubtitle, setNewSubtitle] = useState("");
  const [newPrice, setNewPrice] = useState("18500");
  const [newFamily, setNewFamily] = useState("Oriental & Amber");
  const [newTopNotes, setNewTopNotes] = useState("Bergamot, Saffron");
  const [newHeartNotes, setNewHeartNotes] = useState("Damask Rose, Jasmine");
  const [newBaseNotes, setNewBaseNotes] = useState("Oud, Amber, Vanilla");

  const handleAuthenticate = (e: React.FormEvent) => {
    e.preventDefault();
    if (passcode === "1234" || passcode === "admin") {
      setIsAuthenticated(true);
      setPasscodeError(false);
    } else {
      setPasscodeError(true);
    }
  };

  const handleDeleteProduct = (id: string) => {
    setPerfumesList((prev) => prev.filter((p) => p.id !== id));
  };

  const handleAddProduct = (e: React.FormEvent) => {
    e.preventDefault();
    const created: Perfume = {
      id: `perfume-${Date.now()}`,
      name: newPerfumeName || "New Artisanal Elixir",
      subtitle: newSubtitle || "Handcrafted Distillation",
      brand: "PARFUM ATELIER",
      price: Number(newPrice) || 18500,
      volumes: [
        { ml: 30, price: Math.round(Number(newPrice) * 0.7) },
        { ml: 50, price: Number(newPrice) },
        { ml: 100, price: Math.round(Number(newPrice) * 1.5) },
      ],
      rating: 5.0,
      reviewsCount: 1,
      family: newFamily as any,
      concentration: "Extrait de Parfum (30%)",
      description: "An exquisite new limited harvest scent added by Atelier Admin.",
      story: "Distilled in small batches for exclusive patrons.",
      images: ["https://images.unsplash.com/photo-1592945403244-b3fbafd7f539?q=80&w=1200&auto=format&fit=crop"],
      pyramid: {
        top: newTopNotes.split(",").map((s) => s.trim()),
        heart: newHeartNotes.split(",").map((s) => s.trim()),
        base: newBaseNotes.split(",").map((s) => s.trim()),
      },
      longevity: "12-16 Hours",
      sillage: "Heavy",
      season: ["Autumn", "Winter"],
      vibe: ["Regal", "Sensual"],
      inStock: true,
      stockCount: 20,
    };

    setPerfumesList([created, ...perfumesList]);
    setIsAddModalOpen(false);
    setNewPerfumeName("");
    setNewSubtitle("");
  };

  const handleUpdateOrderStatus = (orderId: string, newStatus: AdminOrder["status"]) => {
    setOrdersList((prev) =>
      prev.map((o) => (o.id === orderId ? { ...o, status: newStatus } : o))
    );
  };

  // PASSCODE AUTH GATE SCREEN
  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-[#0A0A0B] text-[#F5F5F0] flex items-center justify-center p-4">
        <div className="w-full max-w-md bg-[#121215] border border-[#D4AF37]/30 p-8 shadow-2xl space-y-6 text-center">
          
          <div className="w-14 h-14 rounded-full bg-[#D4AF37]/10 border border-[#D4AF37]/30 text-[#D4AF37] flex items-center justify-center mx-auto">
            <Icon name="LockKeyIcon" className="w-7 h-7" />
          </div>

          <div className="space-y-1">
            <h1 className="text-xl font-serif tracking-[0.2em] uppercase font-light text-[#F5F5F0]">
              Atelier Console Gate
            </h1>
            <p className="text-xs text-[#A0A098]">
              Restricted management console. Enter passkey to proceed.
            </p>
          </div>

          <form onSubmit={handleAuthenticate} className="space-y-4">
            <div>
              <input
                type="password"
                required
                value={passcode}
                onChange={(e) => {
                  setPasscode(e.target.value);
                  setPasscodeError(false);
                }}
                placeholder="Enter PIN (e.g. 1234)"
                className="w-full bg-[#18181D] border border-white/15 focus:border-[#D4AF37] text-center text-sm tracking-[0.4em] p-3 text-white outline-none placeholder-[#666]"
                autoFocus
              />
              {passcodeError && (
                <p className="text-[11px] text-red-400 mt-2 font-mono">Incorrect PIN passcode. Try "1234"</p>
              )}
            </div>

            <button
              type="submit"
              className="w-full py-3 bg-[#D4AF37] text-[#0A0A0B] font-bold text-xs uppercase tracking-[0.25em] hover:bg-[#E6C687] transition-colors"
            >
              Unlock Console
            </button>
          </form>

          <div className="pt-4 border-t border-white/10">
            <Link href="/" className="text-xs text-[#888] hover:text-[#D4AF37] uppercase tracking-wider">
              Return to Public Storefront
            </Link>
          </div>

        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#0A0A0B] text-[#F5F5F0]">
      
      {/* Admin Header Navbar */}
      <header className="bg-[#121215] border-b border-[#D4AF37]/30 px-6 py-4 sticky top-0 z-30">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Link
              href="/"
              className="p-2 bg-white/5 border border-white/10 hover:border-[#D4AF37] text-[#C5C5C0] hover:text-[#D4AF37] transition-colors flex items-center gap-1.5 text-xs uppercase tracking-wider"
            >
              <Icon name="ArrowLeft01Icon" className="w-4 h-4" />
              <span>Back to Storefront</span>
            </Link>
            <div className="h-6 w-px bg-white/10" />
            <div className="flex items-center gap-2">
              <Icon name="CrownIcon" className="w-5 h-5 text-[#D4AF37]" />
              <span className="font-serif text-lg tracking-[0.2em] uppercase font-light text-white">
                Atelier Admin Console
              </span>
            </div>
          </div>

          {/* Navigation Tabs */}
          <div className="flex items-center space-x-4">
            <nav className="flex items-center space-x-2 text-xs uppercase tracking-wider">
              <button
                onClick={() => setActiveTab("dashboard")}
                className={`px-4 py-2 border transition-all ${
                  activeTab === "dashboard"
                    ? "border-[#D4AF37] bg-[#D4AF37] text-[#0A0A0B] font-bold"
                    : "border-transparent text-[#AAA] hover:text-white"
                }`}
              >
                Overview
              </button>
              <button
                onClick={() => setActiveTab("products")}
                className={`px-4 py-2 border transition-all ${
                  activeTab === "products"
                    ? "border-[#D4AF37] bg-[#D4AF37] text-[#0A0A0B] font-bold"
                    : "border-transparent text-[#AAA] hover:text-white"
                }`}
              >
                Products ({perfumesList.length})
              </button>
              <button
                onClick={() => setActiveTab("orders")}
                className={`px-4 py-2 border transition-all ${
                  activeTab === "orders"
                    ? "border-[#D4AF37] bg-[#D4AF37] text-[#0A0A0B] font-bold"
                    : "border-transparent text-[#AAA] hover:text-white"
                }`}
              >
                Orders ({ordersList.length})
              </button>
            </nav>

            <button
              onClick={() => setIsAuthenticated(false)}
              className="p-2 text-[#888] hover:text-red-400 transition-colors border border-white/10"
              title="Lock Session"
            >
              <Icon name="LockKeyIcon" className="w-4 h-4" />
            </button>
          </div>
        </div>
      </header>

      {/* Main Content Area */}
      <main className="max-w-7xl mx-auto px-6 py-10 space-y-10">
        
        {/* DASHBOARD OVERVIEW */}
        {activeTab === "dashboard" && (
          <div className="space-y-8 animate-in fade-in duration-300">
            
            {/* Top Stat Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              
              <div className="bg-[#121215] border border-[#D4AF37]/30 p-6 space-y-2">
                <span className="text-[10px] uppercase tracking-widest text-[#D4AF37] font-semibold">Total Revenue</span>
                <p className="text-3xl font-serif text-[#F5F5F0]">Rs. 4,89,200</p>
                <span className="text-[10px] text-emerald-400 font-mono">+18.4% from last harvest</span>
              </div>

              <div className="bg-[#121215] border border-white/10 p-6 space-y-2">
                <span className="text-[10px] uppercase tracking-widest text-[#888] font-semibold">Total Patron Orders</span>
                <p className="text-3xl font-serif text-[#F5F5F0]">142</p>
                <span className="text-[10px] text-[#A0A098]">4 pending dispatch</span>
              </div>

              <div className="bg-[#121215] border border-white/10 p-6 space-y-2">
                <span className="text-[10px] uppercase tracking-widest text-[#888] font-semibold">Active Fragrance SKUs</span>
                <p className="text-3xl font-serif text-[#F5F5F0]">{perfumesList.length}</p>
                <span className="text-[10px] text-[#A0A098]">6 Extrait, 2 Limited</span>
              </div>

              <div className="bg-[#121215] border border-red-500/30 p-6 space-y-2">
                <span className="text-[10px] uppercase tracking-widest text-red-400 font-semibold">Low Stock Warnings</span>
                <p className="text-3xl font-serif text-[#F5F5F0]">2 Items</p>
                <span className="text-[10px] text-red-400">Vanille Cuir (8 remaining)</span>
              </div>

            </div>

            {/* Quick Actions & Recent Orders */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              
              {/* Recent Orders List */}
              <div className="lg:col-span-2 bg-[#121215] border border-white/10 p-6 space-y-4">
                <div className="flex items-center justify-between border-b border-white/10 pb-4">
                  <h3 className="text-sm font-serif uppercase tracking-widest text-[#F5F5F0]">Recent Dispatch Orders</h3>
                  <button onClick={() => setActiveTab("orders")} className="text-xs text-[#D4AF37] underline uppercase tracking-wider">
                    View All
                  </button>
                </div>

                <div className="divide-y divide-white/5">
                  {ordersList.slice(0, 3).map((ord) => (
                    <div key={ord.id} className="py-3 flex items-center justify-between text-xs">
                      <div>
                        <span className="font-serif text-[#F5F5F0] block font-semibold">{ord.customerName}</span>
                        <span className="text-[10px] text-[#888] font-mono">{ord.id} • {ord.date}</span>
                      </div>
                      <div className="text-right">
                        <span className="font-mono text-[#E6C687] block font-bold">Rs. {ord.total.toLocaleString("en-IN")}</span>
                        <span className="text-[10px] px-2 py-0.5 bg-[#D4AF37]/10 text-[#D4AF37] border border-[#D4AF37]/30 uppercase font-semibold">
                          {ord.status}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Quick Admin Actions */}
              <div className="bg-[#121215] border border-white/10 p-6 space-y-4">
                <h3 className="text-sm font-serif uppercase tracking-widest text-[#F5F5F0] border-b border-white/10 pb-4">
                  Atelier Quick Controls
                </h3>
                
                <button
                  onClick={() => {
                    setActiveTab("products");
                    setIsAddModalOpen(true);
                  }}
                  className="w-full py-3 bg-[#D4AF37] text-[#0A0A0B] font-bold text-xs uppercase tracking-widest hover:bg-[#E6C687] transition-colors flex items-center justify-center gap-2"
                >
                  <Icon name="PlusSignIcon" className="w-4 h-4" />
                  <span>Create New Perfume SKU</span>
                </button>

                <div className="p-4 bg-[#18181D] border border-white/5 space-y-2">
                  <span className="text-xs font-serif text-[#E6C687] block">Harvest Season Status</span>
                  <p className="text-[11px] text-[#888]">
                    Current season set to <strong className="text-white">Autumn / Winter 2026</strong>. Scent pyramid maceration tracking active.
                  </p>
                </div>
              </div>

            </div>

          </div>
        )}

        {/* PRODUCTS MANAGEMENT TAB */}
        {activeTab === "products" && (
          <div className="space-y-6 animate-in fade-in duration-300">
            
            {/* Control Bar */}
            <div className="flex flex-col sm:flex-row items-center justify-between gap-4 bg-[#121215] p-4 border border-white/10">
              <div className="relative w-full sm:w-80">
                <Icon name="Search01Icon" className="w-4 h-4 text-[#888] absolute left-3 top-3" />
                <input
                  type="text"
                  placeholder="Search catalog..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full bg-[#1A1A1F] border border-white/10 focus:border-[#D4AF37] text-xs pl-9 pr-3 py-2 text-white outline-none"
                />
              </div>

              <button
                onClick={() => setIsAddModalOpen(true)}
                className="w-full sm:w-auto px-6 py-2.5 bg-[#D4AF37] text-[#0A0A0B] font-bold text-xs uppercase tracking-widest hover:bg-[#E6C687] transition-colors flex items-center justify-center gap-2"
              >
                <Icon name="PlusSignIcon" className="w-4 h-4" />
                <span>Add Perfume</span>
              </button>
            </div>

            {/* Products Data Table */}
            <div className="bg-[#121215] border border-white/10 overflow-x-auto">
              <table className="w-full text-left text-xs text-[#C5C5C0]">
                <thead className="bg-[#18181D] text-[10px] uppercase tracking-widest text-[#D4AF37] border-b border-white/10">
                  <tr>
                    <th className="p-4">Perfume & Subtitle</th>
                    <th className="p-4">Fragrance Family</th>
                    <th className="p-4">Base Price</th>
                    <th className="p-4">Top Notes</th>
                    <th className="p-4">Stock Status</th>
                    <th className="p-4 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-white/5">
                  {perfumesList.map((p) => (
                    <tr key={p.id} className="hover:bg-white/5 transition-colors">
                      <td className="p-4 flex items-center gap-3">
                        <img src={p.images[0]} alt={p.name} className="w-10 h-12 object-cover border border-white/10" />
                        <div>
                          <span className="font-serif text-sm text-[#F5F5F0] font-medium block">{p.name}</span>
                          <span className="text-[10px] text-[#888] italic">{p.subtitle}</span>
                        </div>
                      </td>
                      <td className="p-4 font-mono">{p.family}</td>
                      <td className="p-4 font-serif text-[#E6C687] font-bold">Rs. {p.price.toLocaleString("en-IN")}</td>
                      <td className="p-4 text-[10px]">{p.pyramid.top.join(", ")}</td>
                      <td className="p-4">
                        <span className={`px-2 py-0.5 text-[9px] uppercase font-bold tracking-wider ${
                          p.stockCount < 15 ? "bg-red-500/10 text-red-400 border border-red-500/30" : "bg-emerald-500/10 text-emerald-400 border border-emerald-500/30"
                        }`}>
                          {p.stockCount} units left
                        </span>
                      </td>
                      <td className="p-4 text-right">
                        <button
                          onClick={() => handleDeleteProduct(p.id)}
                          className="p-1.5 text-[#666] hover:text-red-400 transition-colors"
                          title="Delete Product"
                        >
                          <Icon name="Delete01Icon" className="w-4 h-4" />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

          </div>
        )}

        {/* ORDERS MANAGEMENT TAB */}
        {activeTab === "orders" && (
          <div className="space-y-6 animate-in fade-in duration-300">
            <div className="bg-[#121215] border border-white/10 overflow-x-auto">
              <table className="w-full text-left text-xs text-[#C5C5C0]">
                <thead className="bg-[#18181D] text-[10px] uppercase tracking-widest text-[#D4AF37] border-b border-white/10">
                  <tr>
                    <th className="p-4">Order ID</th>
                    <th className="p-4">Patron Name & Email</th>
                    <th className="p-4">Date</th>
                    <th className="p-4">Total Amount</th>
                    <th className="p-4">Status</th>
                    <th className="p-4 text-right">Update Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-white/5">
                  {ordersList.map((ord) => (
                    <tr key={ord.id} className="hover:bg-white/5 transition-colors">
                      <td className="p-4 font-mono text-[#D4AF37] font-semibold">{ord.id}</td>
                      <td className="p-4">
                        <span className="font-serif text-[#F5F5F0] block">{ord.customerName}</span>
                        <span className="text-[10px] text-[#888]">{ord.customerEmail}</span>
                      </td>
                      <td className="p-4 font-mono text-[#888]">{ord.date}</td>
                      <td className="p-4 font-serif text-[#E6C687] font-bold">Rs. {ord.total.toLocaleString("en-IN")}</td>
                      <td className="p-4">
                        <span className="px-2.5 py-1 text-[9px] uppercase tracking-wider bg-[#D4AF37]/10 text-[#D4AF37] border border-[#D4AF37]/30 font-semibold">
                          {ord.status}
                        </span>
                      </td>
                      <td className="p-4 text-right">
                        <select
                          value={ord.status}
                          onChange={(e) => handleUpdateOrderStatus(ord.id, e.target.value as any)}
                          className="bg-[#18181D] border border-white/15 text-[11px] text-[#C5C5C0] p-1.5 outline-none focus:border-[#D4AF37]"
                        >
                          <option value="Pending">Pending</option>
                          <option value="Processing">Processing</option>
                          <option value="Shipped">Shipped</option>
                          <option value="Delivered">Delivered</option>
                        </select>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

      </main>

      {/* ADD PRODUCT MODAL */}
      {isAddModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-in fade-in duration-200">
          <div className="relative w-full max-w-2xl bg-[#121215] border border-[#D4AF37]/40 p-8 shadow-2xl text-[#F5F5F0]">
            
            <button
              onClick={() => setIsAddModalOpen(false)}
              className="absolute top-4 right-4 text-[#888] hover:text-[#D4AF37]"
            >
              <Icon name="Cancel01Icon" className="w-5 h-5" />
            </button>

            <h3 className="text-xl font-serif uppercase tracking-widest text-[#D4AF37] mb-6 flex items-center gap-2">
              <Icon name="SparklesIcon" className="w-5 h-5" />
              Add New Artisanal Perfume SKU
            </h3>

            <form onSubmit={handleAddProduct} className="space-y-4">
              
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-[10px] uppercase tracking-wider text-[#888] mb-1">Perfume Title</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Amber Nuit Extrait"
                    value={newPerfumeName}
                    onChange={(e) => setNewPerfumeName(e.target.value)}
                    className="w-full bg-[#18181D] border border-white/15 p-2.5 text-xs text-white outline-none focus:border-[#D4AF37]"
                  />
                </div>
                <div>
                  <label className="block text-[10px] uppercase tracking-wider text-[#888] mb-1">Subtitle / Accord</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Midnight Amber & Cedar"
                    value={newSubtitle}
                    onChange={(e) => setNewSubtitle(e.target.value)}
                    className="w-full bg-[#18181D] border border-white/15 p-2.5 text-xs text-white outline-none focus:border-[#D4AF37]"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-[10px] uppercase tracking-wider text-[#888] mb-1">Base Price (Rs. 50ml)</label>
                  <input
                    type="number"
                    required
                    value={newPrice}
                    onChange={(e) => setNewPrice(e.target.value)}
                    className="w-full bg-[#18181D] border border-white/15 p-2.5 text-xs text-white outline-none focus:border-[#D4AF37]"
                  />
                </div>
                <div>
                  <label className="block text-[10px] uppercase tracking-wider text-[#888] mb-1">Fragrance Family</label>
                  <select
                    value={newFamily}
                    onChange={(e) => setNewFamily(e.target.value)}
                    className="w-full bg-[#18181D] border border-white/15 p-2.5 text-xs text-white outline-none focus:border-[#D4AF37]"
                  >
                    <option value="Oriental & Amber">Oriental & Amber</option>
                    <option value="Woody & Warm">Woody & Warm</option>
                    <option value="Floral & Botanical">Floral & Botanical</option>
                    <option value="Fresh & Citrus">Fresh & Citrus</option>
                    <option value="Gourmand & Sweet">Gourmand & Sweet</option>
                    <option value="Leather & Smoked">Leather & Smoked</option>
                  </select>
                </div>
              </div>

              {/* Scent Pyramid Builder Inputs */}
              <div className="border-t border-white/10 pt-4 space-y-3">
                <span className="text-xs uppercase tracking-widest text-[#E6C687] font-semibold block">
                  Olfactory Pyramid Builder
                </span>
                <div>
                  <label className="block text-[10px] uppercase tracking-wider text-[#888] mb-1">Top Notes (Comma Separated)</label>
                  <input
                    type="text"
                    value={newTopNotes}
                    onChange={(e) => setNewTopNotes(e.target.value)}
                    className="w-full bg-[#18181D] border border-white/15 p-2 text-xs text-white outline-none"
                  />
                </div>
                <div>
                  <label className="block text-[10px] uppercase tracking-wider text-[#888] mb-1">Heart Notes (Comma Separated)</label>
                  <input
                    type="text"
                    value={newHeartNotes}
                    onChange={(e) => setNewHeartNotes(e.target.value)}
                    className="w-full bg-[#18181D] border border-white/15 p-2 text-xs text-white outline-none"
                  />
                </div>
                <div>
                  <label className="block text-[10px] uppercase tracking-wider text-[#888] mb-1">Base Notes (Comma Separated)</label>
                  <input
                    type="text"
                    value={newBaseNotes}
                    onChange={(e) => setNewBaseNotes(e.target.value)}
                    className="w-full bg-[#18181D] border border-white/15 p-2 text-xs text-white outline-none"
                  />
                </div>
              </div>

              <button
                type="submit"
                className="w-full py-3.5 bg-[#D4AF37] text-[#0A0A0B] font-bold text-xs uppercase tracking-[0.2em] hover:bg-[#E6C687] transition-colors mt-4"
              >
                Publish Fragrance SKU
              </button>

            </form>

          </div>
        </div>
      )}

    </div>
  );
}
