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

let mutationQueue: Promise<unknown> = Promise.resolve();
function serialize<T>(operation: () => Promise<T>): Promise<T> {
  const next = mutationQueue.then(operation, operation);
  mutationQueue = next.catch(() => undefined);
  return next;
}

interface CartState {
  error: boolean;
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
  error: false,
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
          stock: item.stock ?? 0,
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
    const items = get().items.map(item => ({ ...item }));
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
    set({ error: false, items, total: newTotal, isOpen: true }); // Open the drawer immediately on addition

    try {
      await serialize(() => addToCart(product.id, quantity));
      await get().fetchCart();
    } catch (error) {
      set({ error: true });
      console.error("Failed to sync add to cart:", error);
      await get().fetchCart(); // Fallback to server state
    }
  },

  updateQuantity: async (productId, quantity) => {
    if (quantity <= 0) {
      get().removeItem(productId);
      return;
    }

    const items = get().items.map(item => ({ ...item }));
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
    set({ error: false, items, total: newTotal });

    try {
      await serialize(() => updateCartItem(productId, quantity));
      await get().fetchCart();
    } catch (error) {
      set({ error: true });
      console.error("Failed to sync update quantity:", error);
      await get().fetchCart();
    }
  },

  removeItem: async (productId) => {
    const items = get().items.filter((item) => item.id !== productId);
    const newTotal = items.reduce(
      (sum, item) => sum + item.price * item.quantity,
      0,
    );
    set({ error: false, items, total: newTotal });

    try {
      await serialize(() => removeFromCart(productId));
    } catch (error) {
      set({ error: true });
      console.error("Failed to sync remove item:", error);
      await get().fetchCart();
    }
  },

  clearCart: async () => {
    set({ error: false, items: [], total: 0 });

    try {
      await serialize(() => clearCart());
    } catch (error) {
      set({ error: true });
      console.error("Failed to sync clear cart:", error);
      await get().fetchCart();
    }
  },
}));
