import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";
import { Perfume } from "@/types/perfume";

export interface CartStoreItem {
  id: string; // composite key: variantId + sampleVial
  perfume: Perfume;
  variantId: string;
  volumeMl: number;
  price: number;
  quantity: number;
  addSampleVial: boolean;
}

interface CartState {
  items: CartStoreItem[];
  isOpen: boolean;
  
  // Drawer controls
  openCart: () => void;
  closeCart: () => void;
  toggleCart: () => void;
  
  // Cart Actions
  addItem: (perfume: Perfume, volumeMl: number, quantity?: number, addSampleVial?: boolean) => void;
  removeItem: (itemId: string) => void;
  updateQuantity: (itemId: string, quantity: number) => void;
  updateVolume: (itemId: string, newVolumeMl: number) => void;
  toggleSampleVial: (itemId: string) => void;
  clearCart: () => void;
  
  // Computed helpers
  getTotalAmount: () => number;
  getTotalItems: () => number;
}

export const useCartStore = create<CartState>()(
  persist(
    (set, get) => ({
      items: [],
      isOpen: false,

      openCart: () => set({ isOpen: true }),
      closeCart: () => set({ isOpen: false }),
      toggleCart: () => set((state) => ({ isOpen: !state.isOpen })),

      addItem: (perfume, volumeMl, quantity = 1, addSampleVial = false) => {
        const volumeObj = perfume.volumes.find((v) => v.ml === volumeMl) || perfume.volumes[0];
        const price = volumeObj ? volumeObj.price : perfume.price;
        const variantId = `${perfume.id}-${volumeMl}ml`;
        const itemId = `${variantId}-${addSampleVial ? "sample" : "nosample"}`;

        set((state) => {
          const existingIndex = state.items.findIndex((item) => item.id === itemId);

          if (existingIndex > -1) {
            const updated = [...state.items];
            updated[existingIndex].quantity += quantity;
            return { items: updated, isOpen: true };
          }

          const newItem: CartStoreItem = {
            id: itemId,
            perfume,
            variantId,
            volumeMl: volumeObj ? volumeObj.ml : volumeMl,
            price,
            quantity,
            addSampleVial,
          };

          return { items: [...state.items, newItem], isOpen: true };
        });
      },

      removeItem: (itemId) => {
        set((state) => ({
          items: state.items.filter((item) => item.id !== itemId),
        }));
      },

      updateQuantity: (itemId, quantity) => {
        if (quantity <= 0) {
          get().removeItem(itemId);
          return;
        }

        set((state) => ({
          items: state.items.map((item) =>
            item.id === itemId ? { ...item, quantity } : item
          ),
        }));
      },

      updateVolume: (itemId, newVolumeMl) => {
        set((state) => {
          const targetItem = state.items.find((item) => item.id === itemId);
          if (!targetItem) return state;

          const volumeObj = targetItem.perfume.volumes.find((v) => v.ml === newVolumeMl);
          if (!volumeObj) return state;

          const newVariantId = `${targetItem.perfume.id}-${newVolumeMl}ml`;
          const newId = `${newVariantId}-${targetItem.addSampleVial ? "sample" : "nosample"}`;

          return {
            items: state.items.map((item) =>
              item.id === itemId
                ? {
                    ...item,
                    id: newId,
                    variantId: newVariantId,
                    volumeMl: newVolumeMl,
                    price: volumeObj.price,
                  }
                : item
            ),
          };
        });
      },

      toggleSampleVial: (itemId) => {
        set((state) => {
          const targetItem = state.items.find((item) => item.id === itemId);
          if (!targetItem) return state;

          const newAddSampleVial = !targetItem.addSampleVial;
          const newId = `${targetItem.variantId}-${newAddSampleVial ? "sample" : "nosample"}`;

          return {
            items: state.items.map((item) =>
              item.id === itemId
                ? { ...item, id: newId, addSampleVial: newAddSampleVial }
                : item
            ),
          };
        });
      },

      clearCart: () => set({ items: [] }),

      getTotalAmount: () => {
        return get().items.reduce((sum, item) => sum + item.price * item.quantity, 0);
      },

      getTotalItems: () => {
        return get().items.reduce((sum, item) => sum + item.quantity, 0);
      },
    }),
    {
      name: "perfume-cart-storage",
      storage: createJSONStorage(() => localStorage),
      partialize: (state) => ({ items: state.items }),
    }
  )
);
