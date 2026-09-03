import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";
import { LocalizedProduct } from "@/types/product";

export interface WishlistItem {
  id: number;
  slug: string;
  price: number;
  name: string;
  image?: string;
  stock: number;
  category?: string;
}

interface WishlistState {
  items: WishlistItem[];
  addItem: (product: LocalizedProduct) => void;
  removeItem: (productId: number) => void;
  toggleItem: (product: LocalizedProduct) => void;
  hasItem: (productId: number) => boolean;
  clearWishlist: () => void;
}

export const useWishlistStore = create<WishlistState>()(
  persist(
    (set, get) => ({
      items: [],

      addItem: (product) => {
        if (get().hasItem(product.id)) return;

        set((state) => ({
          items: [
            ...state.items,
            {
              id: product.id,
              slug: product.slug,
              name: product.name,
              price: product.price,
              image: product.image || undefined,
              stock: product.stock,
              category: product.category || undefined,
            },
          ],
        }));
      },

      removeItem: (productId) => {
        set((state) => ({
          items: state.items.filter((item) => item.id !== productId),
        }));
      },

      toggleItem: (product) => {
        if (get().hasItem(product.id)) {
          get().removeItem(product.id);
          return;
        }

        get().addItem(product);
      },

      hasItem: (productId) =>
        get().items.some((item) => item.id === productId),

      clearWishlist: () => set({ items: [] }),
    }),
    {
      name: "next-store-wishlist",
      storage: createJSONStorage(() => localStorage),
      partialize: (state) => ({ items: state.items }),
    },
  ),
);
