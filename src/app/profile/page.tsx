"use client";

import { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import Link from "next/link";
import { Icon } from "@/components/ui/icon";
import {
  getUserAddresses,
  deleteAddress,
  setDefaultAddress,
  AddressInput,
} from "@/actions/address";
import { AddressFormModal, AddressItem } from "@/components/storefront/address-form-modal";
import { toast } from "@/components/ui/toast";

export default function ProfilePage() {
  const { data: session, status } = useSession();
  const [addresses, setAddresses] = useState<AddressItem[]>([]);
  const [loadingAddresses, setLoadingAddresses] = useState(true);

  // Address Modal State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingAddress, setEditingAddress] = useState<AddressItem | null>(null);

  const fetchAddresses = async () => {
    setLoadingAddresses(true);
    const res = await getUserAddresses();
    if (res.success && res.addresses) {
      setAddresses(res.addresses as AddressItem[]);
    }
    setLoadingAddresses(false);
  };

  useEffect(() => {
    if (status === "authenticated") {
      fetchAddresses();
    }
  }, [status]);

  if (status === "loading") {
    return (
      <div className="min-h-screen bg-[#0A0A0B] flex items-center justify-center text-[#D4AF37]">
        <Icon name="Loading01Icon" className="w-8 h-8 animate-spin" />
      </div>
    );
  }

  if (status === "unauthenticated" || !session?.user) {
    return (
      <div className="min-h-[70vh] bg-[#0A0A0B] flex flex-col items-center justify-center p-4 text-center">
        <div className="w-16 h-16 rounded-full bg-[#D4AF37]/10 border border-[#D4AF37]/30 flex items-center justify-center text-[#D4AF37] mb-4">
          <Icon name="UserIcon" className="w-8 h-8" />
        </div>
        <h1 className="text-2xl font-serif text-[#F5F5F0] mb-2 uppercase tracking-wider">
          Access Restricted
        </h1>
        <p className="text-sm text-[#A0A098] max-w-md mb-6">
          Please sign in to access your private Atelier profile and saved delivery addresses.
        </p>
        <Link
          href="/"
          className="px-6 py-2.5 bg-[#D4AF37] text-[#0A0A0B] font-bold text-xs uppercase tracking-widest hover:bg-[#E6C687] transition-colors"
        >
          Return to Atelier Home
        </Link>
      </div>
    );
  }

  const handleOpenAddModal = () => {
    setEditingAddress(null);
    setIsModalOpen(true);
  };

  const handleOpenEditModal = (addr: AddressItem) => {
    setEditingAddress(addr);
    setIsModalOpen(true);
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to remove this shipping address?")) return;
    const res = await deleteAddress(id);
    if (res.success) {
      toast.add({
        title: "Address Removed",
        description: "Address has been removed from your profile.",
        type: "info",
      });
      fetchAddresses();
    } else {
      toast.add({
        title: "Error",
        description: res.error || "Failed to remove address.",
        type: "error",
      });
    }
  };

  const handleSetDefault = async (id: string) => {
    const res = await setDefaultAddress(id);
    if (res.success) {
      toast.add({
        title: "Default Address Updated",
        description: "Primary delivery destination updated successfully.",
        type: "success",
      });
      fetchAddresses();
    } else {
      toast.add({
        title: "Error",
        description: res.error || "Failed to set default address.",
        type: "error",
      });
    }
  };

  return (
    <div className="min-h-screen bg-[#0A0A0B] text-[#F5F5F0] pb-24">
      {/* Top Banner */}
      <div className="bg-gradient-to-r from-[#121215] via-[#1A1A1E] to-[#121215] border-b border-white/10 py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-6xl mx-auto flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="flex items-center gap-5">
            <div className="w-20 h-20 rounded-full bg-[#D4AF37]/10 border-2 border-[#D4AF37] flex items-center justify-center text-[#D4AF37] text-2xl font-serif font-bold shadow-xl">
              {session.user.name?.charAt(0).toUpperCase() || session.user.email?.charAt(0).toUpperCase() || "U"}
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-2xl sm:text-3xl font-serif text-[#F5F5F0]">
                  {session.user.name || "Valued Patron"}
                </h1>
                <span className="px-2.5 py-0.5 bg-[#D4AF37]/20 border border-[#D4AF37]/40 text-[#D4AF37] text-[10px] uppercase tracking-widest font-bold">
                  {(session.user as any).role || "VIP Patron"}
                </span>
              </div>
              <p className="text-xs text-[#A0A098] font-mono mt-1">
                {session.user.email}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <Link
              href="/scent-finder"
              className="px-4 py-2 bg-white/5 border border-white/10 hover:border-[#D4AF37]/40 text-xs text-[#E6C687] uppercase tracking-wider transition-all flex items-center gap-2"
            >
              <Icon name="SparklesIcon" className="w-4 h-4 text-[#D4AF37]" />
              <span>Scent Profile</span>
            </Link>
          </div>
        </div>
      </div>

      {/* Main Profile Content */}
      <main className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 pt-10 space-y-10">
        
        {/* Address Book Section */}
        <section className="space-y-6">
          <div className="flex items-center justify-between border-b border-white/10 pb-4">
            <div>
              <h2 className="text-xl font-serif text-[#F5F5F0] tracking-wider uppercase flex items-center gap-2">
                <Icon name="Location01Icon" className="w-5 h-5 text-[#D4AF37]" />
                Saved Shipping Addresses
              </h2>
              <p className="text-xs text-[#A0A098] mt-0.5">
                Manage your delivery destinations for express direct ordering.
              </p>
            </div>

            <button
              onClick={handleOpenAddModal}
              className="px-4 py-2 bg-[#D4AF37] hover:bg-[#E6C687] text-[#0A0A0B] font-bold text-xs uppercase tracking-wider transition-all flex items-center gap-1.5 shadow-md"
            >
              <Icon name="Add01Icon" className="w-4 h-4" />
              <span>Add New Address</span>
            </button>
          </div>

          {loadingAddresses ? (
            <div className="py-12 text-center text-xs text-[#A0A098] flex items-center justify-center gap-2">
              <Icon name="Loading01Icon" className="w-5 h-5 animate-spin text-[#D4AF37]" />
              <span>Loading address book...</span>
            </div>
          ) : addresses.length === 0 ? (
            <div className="p-8 bg-[#121215] border border-white/10 text-center space-y-4">
              <Icon name="Location01Icon" className="w-10 h-10 text-[#888880] mx-auto opacity-50" />
              <div className="space-y-1">
                <h3 className="text-base font-serif text-[#F5F5F0]">No Saved Addresses</h3>
                <p className="text-xs text-[#A0A098] max-w-sm mx-auto">
                  You have not added any delivery addresses yet. Add an address now to enable instant express checkout.
                </p>
              </div>
              <button
                onClick={handleOpenAddModal}
                className="px-5 py-2.5 bg-[#D4AF37] hover:bg-[#E6C687] text-[#0A0A0B] font-bold text-xs uppercase tracking-wider inline-flex items-center gap-1.5"
              >
                <Icon name="Add01Icon" className="w-4 h-4" />
                <span>Add Your First Address</span>
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {addresses.map((addr) => (
                <div
                  key={addr.id}
                  className={`relative bg-[#121215] border p-6 flex flex-col justify-between transition-all ${
                    addr.isDefault
                      ? "border-[#D4AF37] shadow-lg shadow-[#D4AF37]/5"
                      : "border-white/10 hover:border-white/20"
                  }`}
                >
                  <div className="space-y-3">
                    <div className="flex items-start justify-between">
                      <div>
                        <h3 className="text-base font-serif font-medium text-[#F5F5F0]">
                          {addr.fullName}
                        </h3>
                        <p className="text-xs text-[#A0A098] font-mono">{addr.phone}</p>
                      </div>

                      {addr.isDefault && (
                        <span className="px-2.5 py-0.5 bg-[#D4AF37]/20 border border-[#D4AF37]/50 text-[#D4AF37] text-[9px] uppercase tracking-widest font-bold">
                          Default Address
                        </span>
                      )}
                    </div>

                    <div className="text-xs text-[#C5C5C0] space-y-1 border-t border-white/5 pt-3">
                      <p className="font-light">{addr.streetAddress}</p>
                      {addr.apartment && <p className="text-[#A0A098]">{addr.apartment}</p>}
                      <p className="font-mono text-[11px] text-[#A0A098]">
                        {addr.city}, {addr.state} - {addr.postalCode}
                      </p>
                      <p className="text-[10px] uppercase tracking-wider text-[#D4AF37]">
                        {addr.country}
                      </p>
                    </div>
                  </div>

                  <div className="pt-5 mt-4 border-t border-white/10 flex items-center justify-between gap-2 text-xs">
                    <div className="flex items-center gap-3">
                      <button
                        onClick={() => handleOpenEditModal(addr)}
                        className="text-[#E6C687] hover:text-white transition-colors flex items-center gap-1 text-[11px] uppercase tracking-wider"
                      >
                        <Icon name="PencilIcon" className="w-3.5 h-3.5" />
                        <span>Edit</span>
                      </button>
                      <button
                        onClick={() => handleDelete(addr.id)}
                        className="text-red-400 hover:text-red-300 transition-colors flex items-center gap-1 text-[11px] uppercase tracking-wider"
                      >
                        <Icon name="DeleteIcon" className="w-3.5 h-3.5" />
                        <span>Delete</span>
                      </button>
                    </div>

                    {!addr.isDefault && (
                      <button
                        onClick={() => handleSetDefault(addr.id)}
                        className="text-[10px] text-[#A0A098] hover:text-[#D4AF37] transition-colors uppercase tracking-widest"
                      >
                        Set as Default
                      </button>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </section>
      </main>

      {/* Address Form Modal */}
      <AddressFormModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        addressToEdit={editingAddress}
        onSuccess={fetchAddresses}
      />
    </div>
  );
}
