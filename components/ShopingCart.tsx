"use client";

import React, { useEffect, useState } from "react";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetDescription,
  SheetTrigger,
} from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { useCartStore } from "@/lib/store/useCartStore";
import { Link } from "@/i18n/routing";
import {
  ShoppingBag,
  Minus,
  Plus,
  Trash2,
  ArrowRight,
  ShoppingCart as CartIcon,
} from "lucide-react";
import Image from "next/image";
import { useFormatter, useTranslations } from "next-intl";
import type { LocalizedProduct } from "@/types/product";
import CartPopularItems from "@/components/storefront/CartPopularItems";
import { CartDrawerSkeleton } from "@/components/ui/state";

export default function ShopingCart({ popularProducts }: { popularProducts: LocalizedProduct[] }) {
  const [mounted, setMounted] = useState(false);
  const format = useFormatter();
  const t = useTranslations("CartPage");
  const syncError = useCartStore(state => state.error);

  const {
    items,
    total,
    isOpen,
    setIsOpen,
    fetchCart,
    updateQuantity,
    removeItem,
    isLoading,
  } = useCartStore();

  useEffect(() => {
    setMounted(true);
    fetchCart();
  }, [fetchCart]);

  // Calculate total quantity of items
  const totalItems = items.reduce((acc, item) => acc + item.quantity, 0);

  if (!mounted) {
    return (
      <Button
        variant="ghost"
        aria-label={t("title")}
        size="icon"
        className="relative size-9 shrink-0 rounded-full p-0 text-inherit hover:bg-transparent hover:text-inherit hover:opacity-70 [&_svg]:size-[24px]"
      >
        <CartIcon strokeWidth={1.25} />
      </Button>
    );
  }

  return (
    <Sheet open={isOpen} onOpenChange={setIsOpen}>
      <SheetTrigger asChild>
        <Button
          variant="ghost"
          aria-label={t("title")}
          size="icon"
          className="relative size-9 shrink-0 cursor-pointer rounded-full p-0 text-inherit hover:bg-transparent hover:text-inherit hover:opacity-70 [&_svg]:size-[24px]"
        >
          <CartIcon strokeWidth={1.25} />
          {(
            <span className="absolute right-0 top-0 flex size-3.5 items-center justify-center rounded-full bg-white text-[9px] leading-none text-neutral-950">
              {totalItems > 9 ? "9+" : totalItems}
            </span>
          )}
        </Button>
      </SheetTrigger>
      <SheetContent overlayClassName="bg-black/40" className="flex h-dvh w-full flex-col gap-0 border-l border-neutral-200 bg-white px-0 pb-0 pt-5 text-neutral-950 sm:max-w-[400px]">
        <SheetHeader className="border-b border-neutral-100 px-6 pb-4">
          <SheetTitle className="flex items-center gap-2 text-base font-normal text-neutral-950">
            <CartIcon className="h-5 w-5 text-neutral-500" />
            {t("title")}
          </SheetTitle>
          <SheetDescription className="sr-only">{t("orderSummary")}</SheetDescription>
        </SheetHeader>

        {syncError && <p role="alert" className="mx-4 rounded-md bg-red-50 p-3 text-sm text-red-700">{t("syncError")}</p>}
        {isLoading ? (
          <CartDrawerSkeleton />
        ) : items.length === 0 ? (
          <div className="min-h-0 flex-1 overflow-y-auto overscroll-contain px-4 pb-6">
            <div className="flex flex-col items-center justify-center py-12 text-center">
              <CartIcon className="mb-4 size-12 stroke-[1.25]" />
              <p className="max-w-48 text-xl leading-snug">{t("emptyCart")}</p>
            </div>
            <CartPopularItems products={popularProducts} />
            <Button asChild variant="outline" className="mt-6 h-11 w-full rounded-full" onClick={() => setIsOpen(false)}><Link href="/products">{t("continueShopping")}</Link></Button>
          </div>
        ) : (
          <>
            {/* Scrollable list of items */}
            <div className="min-h-0 flex-1 overflow-y-auto overscroll-contain px-4 py-4 space-y-4">
              {items.map((item) => (
                <div
                  key={item.id}
                  className="flex gap-4 rounded-md border border-neutral-200 bg-white p-3 transition-colors hover:border-neutral-300"
                >
                  {/* Image */}
                  <div className="relative h-20 w-20 shrink-0 overflow-hidden rounded-md border border-neutral-200 bg-neutral-50">
                    {item.image ? (
                      <Image
                        src={item.image}
                        alt={item.name || ""}
                        fill
                        sizes="80px"
                        className="object-cover"
                      />
                    ) : (
                      <div className="flex h-full w-full items-center justify-center bg-zinc-100 text-zinc-400">
                        <ShoppingBag className="w-6 h-6" />
                      </div>
                    )}
                  </div>

                  {/* Details */}
                  <div className="flex flex-1 flex-col justify-between">
                    <div>
                      <h4 className="text-sm font-semibold text-gray-900 line-clamp-2 leading-tight">
                        {item.name}
                      </h4>
                      <p className="mt-1 text-sm font-bold text-neutral-950">
                        {format.number(item.price, "currency")}
                      </p>
                    </div>

                    {/* Quantity & Actions */}
                    <div className="flex items-center justify-between mt-2">
                      <div className="flex items-center rounded-md border border-neutral-200 bg-white">
                        <button
                          type="button"
                          className="cursor-pointer p-1 text-neutral-500 transition-colors hover:bg-neutral-100 hover:text-neutral-950"
                          aria-label={t("decreaseQuantity")}
                          onClick={() =>
                            updateQuantity(item.id, item.quantity - 1)
                          }
                        >
                          <Minus className="h-3.5 w-3.5" />
                        </button>
                        <span className="w-8 text-center text-xs font-semibold text-zinc-800">
                          {item.quantity}
                        </span>
                        <button
                          type="button"
                          className="cursor-pointer p-1 text-neutral-500 transition-colors hover:bg-neutral-100 hover:text-neutral-950 disabled:cursor-not-allowed"
                          aria-label={t("increaseQuantity")}
                          disabled={item.quantity >= item.stock}
                          onClick={() =>
                            updateQuantity(item.id, item.quantity + 1)
                          }
                        >
                          <Plus className="w-3.5 h-3.5" />
                        </button>
                      </div>

                      <button
                        type="button"
                        className="text-zinc-400 hover:text-red-500 p-1 transition-colors cursor-pointer"
                        aria-label={t("deleteItem")}
                        onClick={() => removeItem(item.id)}
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
              <CartPopularItems products={popularProducts} />
            </div>

            {/* Sticky summary & actions footer */}
            <div className="shrink-0 space-y-3 border-t border-neutral-100 bg-white px-4 py-4">
              <div className="space-y-1.5">
                <div className="flex items-center justify-between text-sm text-gray-500">
                  <span>{t("totalPriceCount", { count: totalItems })}</span>
                  <span>{format.number(total, "currency")}</span>
                </div>
                <div className="flex items-center justify-between text-sm text-gray-500">
                  <span>{t("shipping")}</span>
                  <span className="font-medium text-emerald-600">
                    {t("free")}
                  </span>
                </div>
                <div className="flex items-center justify-between border-t border-zinc-200/60 pt-3 text-base font-bold text-gray-900">
                  <span>{t("netTotal")}</span>
                  <span className="text-lg text-neutral-600">
                    {format.number(total, "currency")}
                  </span>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3 pt-2">
                <Button
                  variant="outline"
                  className="w-full cursor-pointer border-neutral-200 hover:bg-neutral-100"
                  asChild
                  onClick={() => setIsOpen(false)}
                >
                  <Link href="/cart">{t("viewCart")}</Link>
                </Button>
                <Button
                  className="w-full cursor-pointer bg-neutral-950 text-white hover:bg-neutral-800"
                  asChild
                  onClick={() => setIsOpen(false)}
                >
                  <Link href="/checkout">
                    {t("checkoutShort")}
                    <ArrowRight className="ml-1.5 h-4 w-4" />
                  </Link>
                </Button>
              </div>
            </div>
          </>
        )}
      </SheetContent>
    </Sheet>
  );
}
