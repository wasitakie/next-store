import { create } from "zustand";
import { LocalizedProduct } from "@/types/product";
import {
  getCart,
  addToCart,
  updateCartItem,
  removeFromCart,
  clearCart,
} from "@/lib/actions/cart";

export interface CartItem {
  id: number;
  price: number;
  name: string;
  quantity: number;
  image?: string;
  stock: number;
}

interface CartState {
  items: CartItem[];
  total: number;
  isOpen: boolean;
  isLoading: boolean;
  isInitialized: boolean;
  setIsOpen: (isOpen: boolean) => void;
  fetchCart: () => Promise<void>;
  addItem: (product: LocalizedProduct, quantity?: number) => Promise<void>;
  updateQuantity: (productId: number, quantity: number) => Promise<void>;
  removeItem: (productId: number) => Promise<void>;
  clearCart: () => Promise<void>;
}

export const useCartStore = create<CartState>((set, get) => ({
  items: [],
  total: 0,
  isOpen: false,
  isLoading: false,
  isInitialized: false,
  setIsOpen: (isOpen) => set({ isOpen }),

  fetchCart: async () => {
    const isInitialized = get().isInitialized;
    if (!isInitialized) {
      set({ isLoading: true });
    }
    try {
      const cart = await getCart();
      set({
        items: cart.items.map((item) => ({
          id: item.id,
          name: item.name,
          price: item.price,
          quantity: item.quantity,
          image: item.image,
          stock: 99, // Fallback, will be constrained by product additions
        })),
        total: cart.total,
        isInitialized: true,
      });
    } catch (error) {
      console.error("Failed to fetch cart:", error);
    } finally {
      set({ isLoading: false });
    }
  },

  addItem: async (product, quantity = 1) => {
    const items = [...get().items];
    const existingIndex = items.findIndex((item) => item.id === product.id);

    if (existingIndex >= 0) {
      const newQty = items[existingIndex].quantity + quantity;
      if (newQty <= product.stock) {
        items[existingIndex].quantity = newQty;
      } else {
        items[existingIndex].quantity = product.stock;
      }
    } else {
      items.push({
        id: product.id,
        name: product.name,
        price: product.price,
        quantity,
        image: product.image || undefined,
        stock: product.stock,
      });
    }

    const newTotal = items.reduce(
      (sum, item) => sum + item.price * item.quantity,
      0,
    );
    set({ items, total: newTotal, isOpen: true }); // Open the drawer immediately on addition

    try {
      await addToCart(product.id, quantity);
    } catch (error) {
      console.error("Failed to sync add to cart:", error);
      get().fetchCart(); // Fallback to server state
    }
  },

  updateQuantity: async (productId, quantity) => {
    if (quantity <= 0) {
      get().removeItem(productId);
      return;
    }

    const items = [...get().items];
    const item = items.find((item) => item.id === productId);
    if (!item) return;

    if (quantity > item.stock) {
      quantity = item.stock;
    }

    item.quantity = quantity;
    const newTotal = items.reduce(
      (sum, item) => sum + item.price * item.quantity,
      0,
    );
    set({ items, total: newTotal });

    try {
      await updateCartItem(productId, quantity);
    } catch (error) {
      console.error("Failed to sync update quantity:", error);
      get().fetchCart();
    }
  },

  removeItem: async (productId) => {
    const items = get().items.filter((item) => item.id !== productId);
    const newTotal = items.reduce(
      (sum, item) => sum + item.price * item.quantity,
      0,
    );
    set({ items, total: newTotal });

    try {
      await removeFromCart(productId);
    } catch (error) {
      console.error("Failed to sync remove item:", error);
      get().fetchCart();
    }
  },

  clearCart: async () => {
    set({ items: [], total: 0 });

    try {
      await clearCart();
    } catch (error) {
      console.error("Failed to sync clear cart:", error);
      get().fetchCart();
    }
  },
}));
