"use client";
import { useEffect } from "react";
import { syncOrderCart } from "@/lib/actions/checkout";
import { useCartStore } from "@/lib/store/useCartStore";
export default function OrderCartSync({ orderId }: { orderId: number }) {
  useEffect(() => {
    void syncOrderCart(orderId).then(() => useCartStore.getState().fetchCart());
  }, [orderId]);
  return null;
}
