"use client";

import { useState, useEffect } from "react";
import { Icon } from "@/components/ui/icon";
import { createAddress, updateAddress, AddressInput } from "@/actions/address";
import { toast } from "@/components/ui/toast";

export interface AddressItem extends AddressInput {
  id: string;
}

interface AddressFormModalProps {
  isOpen: boolean;
  onClose: () => void;
  addressToEdit?: AddressItem | null;
  onSuccess: () => void;
}

export function AddressFormModal({
  isOpen,
  onClose,
  addressToEdit,
  onSuccess,
}: AddressFormModalProps) {
  const [formData, setFormData] = useState<AddressInput>({
    fullName: "",
    phone: "",
    streetAddress: "",
    apartment: "",
    city: "",
    state: "",
    postalCode: "",
    country: "India",
    isDefault: false,
  });

  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (addressToEdit) {
      setFormData({
        fullName: addressToEdit.fullName || "",
        phone: addressToEdit.phone || "",
        streetAddress: addressToEdit.streetAddress || "",
        apartment: addressToEdit.apartment || "",
        city: addressToEdit.city || "",
        state: addressToEdit.state || "",
        postalCode: addressToEdit.postalCode || "",
        country: addressToEdit.country || "India",
        isDefault: addressToEdit.isDefault || false,
      });
    } else {
      setFormData({
        fullName: "",
        phone: "",
        streetAddress: "",
        apartment: "",
        city: "",
        state: "",
        postalCode: "",
        country: "India",
        isDefault: false,
      });
    }
  }, [addressToEdit, isOpen]);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      let res;
      if (addressToEdit) {
        res = await updateAddress(addressToEdit.id, formData);
      } else {
        res = await createAddress(formData);
      }

      if (res.success) {
        toast.add({
          title: addressToEdit ? "Address Updated" : "Address Saved",
          description: "Your shipping destination has been stored securely.",
          type: "success",
        });
        onSuccess();
        onClose();
      } else {
        toast.add({
          title: "Address Error",
          description: res.error || "Failed to save address details.",
          type: "error",
        });
      }
    } catch (err: any) {
      toast.add({
        title: "Error",
        description: err.message || "An unexpected error occurred.",
        type: "error",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-in fade-in duration-200">
      <div className="relative w-full max-w-lg bg-[#121215] border border-[#D4AF37]/30 shadow-2xl overflow-hidden rounded-sm">
        
        {/* Gold Accent Line */}
        <div className="h-1 w-full bg-gradient-to-r from-transparent via-[#D4AF37] to-transparent" />

        {/* Header */}
        <div className="p-6 pb-4 border-b border-white/10 flex items-center justify-between">
          <div>
            <h2 className="text-lg font-serif text-[#F5F5F0] tracking-wider uppercase">
              {addressToEdit ? "Edit Shipping Address" : "Add New Shipping Address"}
            </h2>
            <p className="text-xs text-[#A0A098] mt-0.5">
              Enter your destination details for express delivery.
            </p>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="p-1 text-[#A0A098] hover:text-[#D4AF37] transition-colors"
          >
            <Icon name="Cancel01Icon" className="w-5 h-5" />
          </button>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="p-6 space-y-4 max-h-[75vh] overflow-y-auto">
          
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-[10px] uppercase tracking-widest text-[#D4AF37] font-semibold mb-1">
                Full Name *
              </label>
              <input
                type="text"
                required
                value={formData.fullName}
                onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
                placeholder="Lord / Lady John Doe"
                className="w-full bg-[#0A0A0B] border border-white/10 focus:border-[#D4AF37] text-sm text-[#F5F5F0] p-2.5 outline-none transition-colors"
              />
            </div>

            <div>
              <label className="block text-[10px] uppercase tracking-widest text-[#D4AF37] font-semibold mb-1">
                Phone Number *
              </label>
              <input
                type="tel"
                required
                value={formData.phone}
                onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                placeholder="+91 98765 43210"
                className="w-full bg-[#0A0A0B] border border-white/10 focus:border-[#D4AF37] text-sm text-[#F5F5F0] p-2.5 outline-none transition-colors"
              />
            </div>
          </div>

          <div>
            <label className="block text-[10px] uppercase tracking-widest text-[#D4AF37] font-semibold mb-1">
              Street Address *
            </label>
            <input
              type="text"
              required
              value={formData.streetAddress}
              onChange={(e) => setFormData({ ...formData, streetAddress: e.target.value })}
              placeholder="123 Luxury Avenue, Suite 400"
              className="w-full bg-[#0A0A0B] border border-white/10 focus:border-[#D4AF37] text-sm text-[#F5F5F0] p-2.5 outline-none transition-colors"
            />
          </div>

          <div>
            <label className="block text-[10px] uppercase tracking-widest text-[#D4AF37] font-semibold mb-1">
              Apartment / Landmark (Optional)
            </label>
            <input
              type="text"
              value={formData.apartment || ""}
              onChange={(e) => setFormData({ ...formData, apartment: e.target.value })}
              placeholder="Building A, Near Royal Gardens"
              className="w-full bg-[#0A0A0B] border border-white/10 focus:border-[#D4AF37] text-sm text-[#F5F5F0] p-2.5 outline-none transition-colors"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-[10px] uppercase tracking-widest text-[#D4AF37] font-semibold mb-1">
                City *
              </label>
              <input
                type="text"
                required
                value={formData.city}
                onChange={(e) => setFormData({ ...formData, city: e.target.value })}
                placeholder="Mumbai"
                className="w-full bg-[#0A0A0B] border border-white/10 focus:border-[#D4AF37] text-sm text-[#F5F5F0] p-2.5 outline-none transition-colors"
              />
            </div>

            <div>
              <label className="block text-[10px] uppercase tracking-widest text-[#D4AF37] font-semibold mb-1">
                State *
              </label>
              <input
                type="text"
                required
                value={formData.state}
                onChange={(e) => setFormData({ ...formData, state: e.target.value })}
                placeholder="Maharashtra"
                className="w-full bg-[#0A0A0B] border border-white/10 focus:border-[#D4AF37] text-sm text-[#F5F5F0] p-2.5 outline-none transition-colors"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-[10px] uppercase tracking-widest text-[#D4AF37] font-semibold mb-1">
                Postal Code *
              </label>
              <input
                type="text"
                required
                value={formData.postalCode}
                onChange={(e) => setFormData({ ...formData, postalCode: e.target.value })}
                placeholder="400001"
                className="w-full bg-[#0A0A0B] border border-white/10 focus:border-[#D4AF37] text-sm text-[#F5F5F0] p-2.5 outline-none transition-colors"
              />
            </div>

            <div>
              <label className="block text-[10px] uppercase tracking-widest text-[#D4AF37] font-semibold mb-1">
                Country *
              </label>
              <input
                type="text"
                required
                value={formData.country}
                onChange={(e) => setFormData({ ...formData, country: e.target.value })}
                placeholder="India"
                className="w-full bg-[#0A0A0B] border border-white/10 focus:border-[#D4AF37] text-sm text-[#F5F5F0] p-2.5 outline-none transition-colors"
              />
            </div>
          </div>

          <div className="pt-2 flex items-center gap-2">
            <input
              type="checkbox"
              id="isDefault"
              checked={formData.isDefault}
              onChange={(e) => setFormData({ ...formData, isDefault: e.target.checked })}
              className="w-4 h-4 accent-[#D4AF37] rounded-none border border-white/20 cursor-pointer"
            />
            <label htmlFor="isDefault" className="text-xs text-[#C5C5C0] cursor-pointer">
              Set as primary / default delivery address
            </label>
          </div>

          <div className="pt-4 flex items-center justify-end gap-3 border-t border-white/10">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2.5 border border-white/10 text-xs text-[#A0A098] hover:text-white uppercase tracking-wider transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              className="px-6 py-2.5 bg-[#D4AF37] hover:bg-[#E6C687] text-[#0A0A0B] font-bold text-xs uppercase tracking-wider shadow-md transition-all disabled:opacity-50"
            >
              {loading ? "Saving Address..." : addressToEdit ? "Update Address" : "Save Address"}
            </button>
          </div>

        </form>
      </div>
    </div>
  );
}
