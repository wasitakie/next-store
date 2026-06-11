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
        className="relative text-gray-700 hover:text-indigo-600 transition-colors"
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
          className="relative text-gray-700 hover:text-indigo-600 transition-colors cursor-pointer"
        >
          <ShoppingBag className="w-5 h-5" />
          {totalItems > 0 && (
            <span className="absolute -top-1 -right-1 flex h-4 w-4 items-center justify-center rounded-full bg-indigo-600 text-[10px] font-bold text-white ring-2 ring-white animate-pulse">
              {totalItems}
            </span>
          )}
        </Button>
      </SheetTrigger>
      <SheetContent className="flex w-full flex-col sm:max-w-md pr-0 pl-0 border-l border-zinc-100 bg-white">
        <SheetHeader className="px-6 pb-4 border-b border-zinc-100">
          <SheetTitle className="flex items-center gap-2 text-xl font-bold text-gray-900">
            <CartIcon className="w-5 h-5 text-indigo-600" />
            {t("title")}
          </SheetTitle>
        </SheetHeader>

        {isLoading ? (
          <div className="flex flex-1 flex-col items-center justify-center gap-2 p-6">
            <div className="h-8 w-8 animate-spin rounded-full border-4 border-indigo-600 border-t-transparent" />
            <p className="text-sm text-gray-500">กำลังโหลดสินค้า...</p>
          </div>
        ) : items.length === 0 ? (
          <div className="flex flex-1 flex-col items-center justify-center gap-4 px-6 text-center">
            <div className="flex h-20 w-20 items-center justify-center rounded-full bg-indigo-50 text-indigo-600">
              <ShoppingBag className="w-10 h-10" />
            </div>
            <div>
              <h3 className="text-lg font-semibold text-gray-900">
                ตะกร้าสินค้าว่าง
              </h3>
              <p className="mt-1 text-sm text-gray-500">
                ยังไม่มีสินค้าในตะกร้าของคุณ
                เพิ่มสินค้าเพื่อเริ่มต้นช้อปปิ้งกันเลย!
              </p>
            </div>
            <Button
              className="mt-2 bg-indigo-600 hover:bg-indigo-700 text-white cursor-pointer"
              onClick={() => setIsOpen(false)}
            >
              {t("continueShopping")}
            </Button>
          </div>
        ) : (
          <>
            {/* Scrollable list of items */}
            <div className="flex-1 overflow-y-auto px-6 py-4 space-y-4">
              {items.map((item) => (
                <div
                  key={item.id}
                  className="flex gap-4 p-3 border border-zinc-100 rounded-xl hover:shadow-sm transition-shadow bg-zinc-50/50"
                >
                  {/* Image */}
                  <div className="relative h-20 w-20 shrink-0 overflow-hidden rounded-lg border border-zinc-200 bg-white">
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
                      <p className="mt-1 text-sm font-bold text-indigo-600">
                        {format.number(item.price, "currency")}
                      </p>
                    </div>

                    {/* Quantity & Actions */}
                    <div className="flex items-center justify-between mt-2">
                      <div className="flex items-center border border-zinc-200 rounded-md bg-white">
                        <button
                          type="button"
                          className="p-1 hover:bg-zinc-100 text-zinc-500 hover:text-zinc-900 transition-colors cursor-pointer"
                          onClick={() =>
                            updateQuantity(item.id, item.quantity - 1)
                          }
                        >
                          <Minus className="w-3..5 h-3.5" />
                        </button>
                        <span className="w-8 text-center text-xs font-semibold text-zinc-800">
                          {item.quantity}
                        </span>
                        <button
                          type="button"
                          className="p-1 hover:bg-zinc-100 text-zinc-500 hover:text-zinc-900 transition-colors cursor-pointer"
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
            <div className="border-t border-zinc-100 px-6 py-6 bg-zinc-50/50 space-y-4">
              <div className="space-y-1.5">
                <div className="flex items-center justify-between text-sm text-gray-500">
                  <span>ราคาสินค้ารวม ({totalItems} ชิ้น)</span>
                  <span>{format.number(total, "currency")}</span>
                </div>
                <div className="flex items-center justify-between text-sm text-gray-500">
                  <span>ค่าจัดส่ง</span>
                  <span className="text-green-600 font-medium">ฟรี</span>
                </div>
                <div className="flex items-center justify-between border-t border-zinc-200/60 pt-3 text-base font-bold text-gray-900">
                  <span>ยอดรวมสุทธิ</span>
                  <span className="text-indigo-600 text-lg">
                    {format.number(total, "currency")}
                  </span>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3 pt-2">
                <Button
                  variant="outline"
                  className="w-full border-zinc-200 hover:bg-zinc-100 cursor-pointer"
                  asChild
                  onClick={() => setIsOpen(false)}
                >
                  <Link href="/cart">ดูตะกร้าสินค้า</Link>
                </Button>
                <Button
                  className="w-full bg-indigo-600 hover:bg-indigo-700 text-white cursor-pointer"
                  asChild
                  onClick={() => setIsOpen(false)}
                >
                  <Link href="/checkout">
                    ชำระเงิน <ArrowRight className="w-4 h-4 ml-1.5" />
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
