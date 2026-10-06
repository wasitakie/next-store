"use client";

import { Button } from "@/components/ui/button";
import { useTranslations } from "next-intl";
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
  text,
  outOfStockText,
}: AddToCartButtonProps) {
  const t = useTranslations("AddToCartButton");
  const addItem = useCartStore((state) => state.addItem);

  return (
    <Button
      size="lg"
      className="flex-1 cursor-pointer h-12 rounded-full bg-neutral-950 text-white hover:bg-neutral-800"
      disabled={product.stock <= 0}
      onClick={() => addItem(product)}
    >
      <ShoppingCart className="w-5 h-5 mr-2" />
      {product.stock > 0 ? (text ?? t("buttonText")) : (outOfStockText ?? t("outOfStock"))}
    </Button>
  );
}
