"use client";

import React, { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Separator } from "@/components/ui/separator";
import { Minus, Plus, Trash2, ShoppingBag, ArrowRight } from "lucide-react";
import { Link } from "@/i18n/routing";
import Image from "next/image";
import { useCartStore } from "@/lib/store/useCartStore";
import { useTranslations } from "next-intl";
import { CartPageSkeleton, EmptyState } from "@/components/ui/state";

export default function CartPage() {
  const t = useTranslations("CartPage");
  const [mounted, setMounted] = useState(false);
  const { items, total, updateQuantity, removeItem, clearCart, fetchCart } =
    useCartStore();

  useEffect(() => {
    setMounted(true);
    fetchCart();
  }, [fetchCart]);

  if (!mounted) {
    return <CartPageSkeleton />;
  }

  if (items.length === 0) {
    return (
      <div className="min-h-screen bg-background">
        <div className="mx-auto max-w-4xl px-4 py-16 sm:px-6 lg:px-8">
          <EmptyState
            icon={ShoppingBag}
            title={t("emptyCart")}
            description={t("emptyCartDescLong")}
            action={
              <Button
                asChild
                size="lg"
                className="cursor-pointer bg-orange-500 text-white hover:bg-orange-600"
              >
                <Link href="/products">{t("continueShopping")}</Link>
              </Button>
            }
          />
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            {t("title")}
          </h1>
          <p className="text-gray-600">
            {t("itemsCount", { count: items.length })}
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Cart Items */}
          <div className="lg:col-span-2 space-y-4">
            {items.map((item) => (
              <Card
                key={item.id}
                className="border border-zinc-200/80 shadow-sm bg-white"
              >
                <CardContent className="p-6">
                  <div className="flex gap-4">
                    {/* Product Image */}
                    <div className="w-24 h-24 bg-gray-100 rounded-lg flex items-center justify-center overflow-hidden shrink-0 border border-zinc-200">
                      {item.image ? (
                        <Image
                          src={item.image}
                          alt={item.name}
                          width={96}
                          height={96}
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <div className="w-12 h-12 text-gray-400">
                          <svg
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                            className="w-full h-full"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
                            />
                          </svg>
                        </div>
                      )}
                    </div>

                    {/* Product Details */}
                    <div className="flex-1 flex flex-col justify-between">
                      <div className="flex justify-between items-start mb-2">
                        <div>
                          <h3 className="font-semibold text-lg text-zinc-900 leading-tight">
                            {item.name}
                          </h3>
                          <p className="text-zinc-500 font-medium mt-1">
                            ฿{item.price.toLocaleString()}
                          </p>
                        </div>
                        <div className="text-right">
                          <p className="font-semibold text-lg text-orange-600">
                            ฿{(item.price * item.quantity).toLocaleString()}
                          </p>
                        </div>
                      </div>

                      {/* Quantity Controls */}
                      <div className="flex items-center justify-between mt-4">
                        <div className="flex items-center gap-2">
                          <div className="flex items-center border border-zinc-200 rounded-lg bg-white">
                            <button
                              type="button"
                              onClick={() =>
                                updateQuantity(item.id, item.quantity - 1)
                              }
                              className="p-2 hover:bg-zinc-100 rounded-l-lg cursor-pointer text-zinc-600"
                            >
                              <Minus className="w-4 h-4" />
                            </button>
                            <Input
                              type="number"
                              value={item.quantity}
                              min="1"
                              className="w-16 border-0 text-center focus-visible:ring-0 focus-visible:ring-offset-0 text-zinc-800 font-semibold"
                              readOnly
                            />
                            <button
                              type="button"
                              onClick={() =>
                                updateQuantity(item.id, item.quantity + 1)
                              }
                              disabled={item.quantity >= item.stock}
                              className="p-2 hover:bg-zinc-100 rounded-r-lg cursor-pointer text-zinc-600 disabled:opacity-50"
                            >
                              <Plus className="w-4 h-4" />
                            </button>
                          </div>
                        </div>

                        <Button
                          type="button"
                          variant="ghost"
                          size="sm"
                          onClick={() => removeItem(item.id)}
                          className="text-zinc-400 hover:text-red-500 transition-colors cursor-pointer hover:bg-transparent"
                        >
                          <Trash2 className="w-4 h-4 mr-1.5" />
                          {t("deleteItem")}
                        </Button>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          {/* Order Summary */}
          <div className="lg:col-span-1">
            <Card className="sticky top-8 border border-zinc-200 shadow-sm bg-white">
              <CardHeader>
                <CardTitle>{t("orderSummary")}</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex justify-between">
                  <span>{t("itemsPrice", { count: items.length })}</span>
                  <span>฿{total.toLocaleString()}</span>
                </div>
                <div className="flex justify-between">
                  <span>{t("shipping")}</span>
                  <span className="text-green-600 font-medium">{t("free")}</span>
                </div>
                <Separator />
                <div className="flex justify-between font-semibold text-lg">
                  <span>{t("total")}</span>
                  <span className="text-orange-600">
                    ฿{total.toLocaleString()}
                  </span>
                </div>
              </CardContent>
              <CardFooter className="flex flex-col space-y-3 w-full">
                <Button
                  asChild
                  className="w-full cursor-pointer bg-orange-500 text-white hover:bg-orange-600"
                  size="lg"
                >
                  <Link href="/checkout">
                    <ArrowRight className="w-4 h-4 mr-2" />
                    {t("checkout")}
                  </Link>
                </Button>
                <Button
                  type="button"
                  variant="outline"
                  onClick={clearCart}
                  className="w-full border-zinc-200 hover:bg-zinc-50 cursor-pointer"
                >
                  {t("clearCart")}
                </Button>
                <div className="text-center w-full">
                  <Button
                    variant="ghost"
                    asChild
                    className="cursor-pointer text-zinc-500 hover:bg-transparent hover:text-orange-600"
                  >
                    <Link href="/products">
                      <ShoppingBag className="w-4 h-4 mr-2" />
                      {t("continueShopping")}
                    </Link>
                  </Button>
                </div>
              </CardFooter>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
