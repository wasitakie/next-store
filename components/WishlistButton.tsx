"use client";

import { Button } from "@/components/ui/button";
import { useWishlistStore } from "@/lib/store/useWishlistStore";
import { cn } from "@/lib/utils";
import { LocalizedProduct } from "@/types/product";
import { Heart } from "lucide-react";
import { useEffect, useState } from "react";

type WishlistButtonProps = {
  product: LocalizedProduct;
  label?: string;
  activeLabel?: string;
  showLabel?: boolean;
  size?: "default" | "sm" | "lg" | "icon";
  className?: string;
};

export default function WishlistButton({
  product,
  label = "บันทึก",
  activeLabel = "บันทึกแล้ว",
  showLabel = false,
  size = "icon",
  className,
}: WishlistButtonProps) {
  const [mounted, setMounted] = useState(false);
  const isSaved = useWishlistStore((state) => state.hasItem(product.id));
  const toggleItem = useWishlistStore((state) => state.toggleItem);

  useEffect(() => {
    setMounted(true);
  }, []);

  const active = mounted && isSaved;
  const buttonLabel = active ? activeLabel : label;

  return (
    <Button
      type="button"
      variant={active ? "default" : "outline"}
      size={size}
      aria-label={buttonLabel}
      aria-pressed={active}
      onClick={(event) => {
        event.preventDefault();
        event.stopPropagation();
        toggleItem(product);
      }}
      className={cn(
        active
          ? "border-orange-500 bg-orange-500 text-white hover:bg-orange-600"
          : "border-slate-200 bg-white text-slate-700 hover:border-orange-200 hover:bg-orange-50 hover:text-orange-600",
        className,
      )}
    >
      <Heart className={cn("h-5 w-5", active && "fill-current")} />
      {showLabel && <span>{buttonLabel}</span>}
    </Button>
  );
}
