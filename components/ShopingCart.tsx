"use client";

import React, { useEffect, useState } from "react";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
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
import { CartDrawerSkeleton, EmptyState } from "@/components/ui/state";

export default function ShopingCart() {
  const [mounted, setMounted] = useState(false);
  const format = useFormatter();
  const t = useTranslations("CartPage");

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
        size="sm"
        className="relative rounded-md text-slate-700 transition-colors hover:bg-slate-100 hover:text-orange-600"
      >
        <ShoppingBag className="w-5 h-5" />
      </Button>
    );
  }

  return (
    <Sheet open={isOpen} onOpenChange={setIsOpen}>
      <SheetTrigger asChild>
        <Button
          variant="ghost"
          size="sm"
          className="relative cursor-pointer rounded-md text-slate-700 transition-colors hover:bg-slate-100 hover:text-orange-600"
        >
          <ShoppingBag className="w-5 h-5" />
          {totalItems > 0 && (
            <span className="absolute -right-1 -top-1 flex h-4 w-4 items-center justify-center rounded-full bg-orange-500 text-[10px] font-bold text-white ring-2 ring-white">
              {totalItems}
            </span>
          )}
        </Button>
      </SheetTrigger>
      <SheetContent className="flex w-full flex-col border-l border-slate-200 bg-white pl-0 pr-0 sm:max-w-md">
        <SheetHeader className="border-b border-slate-100 px-6 pb-4">
          <SheetTitle className="flex items-center gap-2 text-xl font-bold text-slate-950">
            <CartIcon className="h-5 w-5 text-orange-500" />
            {t("title")}
          </SheetTitle>
        </SheetHeader>

        {isLoading ? (
          <CartDrawerSkeleton />
        ) : items.length === 0 ? (
          <EmptyState
            icon={ShoppingBag}
            title={t("emptyCart")}
            description={t("emptyCartDescLong")}
            className="m-6 flex-1 border-0 bg-slate-50"
            action={
              <Button
                className="cursor-pointer bg-orange-500 text-white hover:bg-orange-600"
                onClick={() => setIsOpen(false)}
              >
                {t("continueShopping")}
              </Button>
            }
          />
        ) : (
          <>
            {/* Scrollable list of items */}
            <div className="flex-1 overflow-y-auto px-6 py-4 space-y-4">
              {items.map((item) => (
                <div
                  key={item.id}
                  className="flex gap-4 rounded-md border border-slate-200 bg-white p-3 transition-colors hover:border-slate-300"
                >
                  {/* Image */}
                  <div className="relative h-20 w-20 shrink-0 overflow-hidden rounded-md border border-slate-200 bg-slate-50">
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
                      <p className="mt-1 text-sm font-bold text-slate-950">
                        {format.number(item.price, "currency")}
                      </p>
                    </div>

                    {/* Quantity & Actions */}
                    <div className="flex items-center justify-between mt-2">
                      <div className="flex items-center rounded-md border border-slate-200 bg-white">
                        <button
                          type="button"
                          className="cursor-pointer p-1 text-slate-500 transition-colors hover:bg-slate-100 hover:text-slate-950"
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
                          className="cursor-pointer p-1 text-slate-500 transition-colors hover:bg-slate-100 hover:text-slate-950 disabled:cursor-not-allowed"
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
                        onClick={() => removeItem(item.id)}
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Sticky summary & actions footer */}
            <div className="space-y-4 border-t border-slate-100 bg-slate-50/60 px-6 py-6">
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
                  <span className="text-lg text-orange-600">
                    {format.number(total, "currency")}
                  </span>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3 pt-2">
                <Button
                  variant="outline"
                  className="w-full cursor-pointer border-slate-200 hover:bg-slate-100"
                  asChild
                  onClick={() => setIsOpen(false)}
                >
                  <Link href="/cart">{t("viewCart")}</Link>
                </Button>
                <Button
                  className="w-full cursor-pointer bg-orange-500 text-white hover:bg-orange-600"
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
