"use client";

import { Button } from "@/components/ui/button";
import { ShoppingCart } from "lucide-react";
import { LocalizedProduct } from "@/types/product";
import { useCartStore } from "@/lib/store/useCartStore";

interface AddToCartButtonProps {
  product: LocalizedProduct;
  text?: string;
  outOfStockText?: string;
}

export default function AddToCartButton({
  product,
  text = "เพิ่มลงตะกร้า",
  outOfStockText = "สินค้าหมด",
}: AddToCartButtonProps) {
  const addItem = useCartStore((state) => state.addItem);

  return (
    <Button
      size="lg"
      className="flex-1 bg-indigo-600 hover:bg-indigo-700 text-white cursor-pointer"
      disabled={product.stock <= 0}
      onClick={() => addItem(product)}
    >
      <ShoppingCart className="w-5 h-5 mr-2" />
      {product.stock > 0 ? text : outOfStockText}
    </Button>
  );
}
