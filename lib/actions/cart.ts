"use server";

import {
  getCart as getCartLib,
  addToCart as addToCartLib,
  updateCartItem as updateCartItemLib,
  removeFromCart as removeFromCartLib,
  clearCart as clearCartLib,
} from "@/lib/cart";

export async function getCart() {
  return await getCartLib();
}

export async function addToCart(productId: number, quantity: number = 1) {
  return await addToCartLib(productId, quantity);
}

export async function updateCartItem(productId: number, quantity: number) {
  return await updateCartItemLib(productId, quantity);
}

export async function removeFromCart(productId: number) {
  return await removeFromCartLib(productId);
}

export async function clearCart() {
  return await clearCartLib();
}
