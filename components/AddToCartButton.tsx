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
      className="flex-1 cursor-pointer bg-orange-500 text-white hover:bg-orange-600"
      disabled={product.stock <= 0}
      onClick={() => addItem(product)}
    >
      <ShoppingCart className="w-5 h-5 mr-2" />
      {product.stock > 0 ? text : outOfStockText}
    </Button>
  );
}
