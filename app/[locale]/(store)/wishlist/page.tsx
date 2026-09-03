"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Link } from "@/i18n/routing";
import { useCartStore } from "@/lib/store/useCartStore";
import {
  useWishlistStore,
  type WishlistItem,
} from "@/lib/store/useWishlistStore";
import { Heart, ShoppingBag, ShoppingCart, Trash2 } from "lucide-react";
import { useFormatter, useTranslations } from "next-intl";
import Image from "next/image";
import { useEffect, useState } from "react";
import { WishlistSkeleton } from "@/components/ui/state";

export default function WishlistPage() {
  const t = useTranslations("WishlistPage");
  const format = useFormatter();
  const [mounted, setMounted] = useState(false);
  const items = useWishlistStore((state) => state.items);
  const removeItem = useWishlistStore((state) => state.removeItem);
  const clearWishlist = useWishlistStore((state) => state.clearWishlist);
  const addItem = useCartStore((state) => state.addItem);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return <WishlistSkeleton />;
  }

  if (items.length === 0) {
    return (
      <div className="min-h-screen bg-slate-50">
        <div className="mx-auto max-w-4xl px-4 py-16 text-center sm:px-6 lg:px-8">
          <div className="mx-auto mb-6 flex h-20 w-20 items-center justify-center rounded-md bg-white text-rose-500 shadow-sm">
            <Heart className="h-10 w-10" />
          </div>
          <h1 className="mb-3 text-3xl font-bold text-slate-950">
            {t("emptyTitle")}
          </h1>
          <p className="mx-auto mb-8 max-w-xl text-slate-600">
            {t("emptyDescription")}
          </p>
          <Button
            asChild
            size="lg"
            className="bg-orange-500 text-white hover:bg-orange-600"
          >
            <Link href="/products">
              <ShoppingBag className="h-5 w-5" />
              {t("continueShopping")}
            </Link>
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50">
      <div className="mx-auto max-w-6xl px-4 py-8 sm:px-6 lg:px-8">
        <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <p className="mb-2 text-sm font-semibold uppercase tracking-normal text-orange-600">
              {t("eyebrow")}
            </p>
            <h1 className="text-3xl font-bold text-slate-950">{t("title")}</h1>
            <p className="mt-2 text-slate-600">
              {t("itemsCount", { count: items.length })}
            </p>
          </div>
          <Button
            type="button"
            variant="outline"
            className="border-slate-200 bg-white text-slate-700"
            onClick={clearWishlist}
          >
            <Trash2 className="h-4 w-4" />
            {t("clearAll")}
          </Button>
        </div>

        <div className="grid gap-4">
          {items.map((item) => (
            <WishlistRow
              key={item.id}
              item={item}
              price={format.number(item.price, "currency")}
              addToCart={() =>
                addItem({
                  ...item,
                  image: item.image ?? null,
                  description: "",
                  category: item.category ?? "",
                  createdAt: new Date(),
                  updatedAt: new Date(),
                })
              }
              removeItem={() => removeItem(item.id)}
              labels={{
                addToCart: t("addToCart"),
                remove: t("remove"),
                viewProduct: t("viewProduct"),
                outOfStock: t("outOfStock"),
              }}
            />
          ))}
        </div>
      </div>
    </div>
  );
}

function WishlistRow({
  item,
  price,
  addToCart,
  removeItem,
  labels,
}: {
  item: WishlistItem;
  price: string;
  addToCart: () => void;
  removeItem: () => void;
  labels: {
    addToCart: string;
    remove: string;
    viewProduct: string;
    outOfStock: string;
  };
}) {
  return (
    <Card className="border border-slate-200 bg-white shadow-sm">
      <CardContent className="p-4 sm:p-5">
        <div className="grid gap-4 sm:grid-cols-[112px_1fr_auto] sm:items-center">
          <Link
            href={`/products/${item.slug}`}
            className="relative h-28 overflow-hidden rounded-md border border-slate-200 bg-slate-100"
          >
            {item.image ? (
              <Image
                src={item.image}
                alt={item.name}
                fill
                sizes="112px"
                className="object-cover"
              />
            ) : (
              <div className="flex h-full items-center justify-center text-slate-400">
                <ShoppingBag className="h-8 w-8" />
              </div>
            )}
          </Link>

          <div className="min-w-0">
            {item.category && (
              <p className="mb-1 text-xs font-semibold uppercase tracking-normal text-slate-500">
                {item.category}
              </p>
            )}
            <Link
              href={`/products/${item.slug}`}
              className="line-clamp-2 text-lg font-semibold text-slate-950 hover:text-orange-600"
            >
              {item.name}
            </Link>
            <div className="mt-2 flex flex-wrap items-center gap-3">
              <span className="text-xl font-bold text-slate-950">{price}</span>
              {item.stock <= 0 && (
                <span className="rounded-md bg-red-50 px-2 py-1 text-xs font-semibold text-red-600">
                  {labels.outOfStock}
                </span>
              )}
            </div>
          </div>

          <div className="flex flex-wrap gap-2 sm:justify-end">
            <Button
              type="button"
              className="bg-slate-950 text-white hover:bg-slate-800"
              disabled={item.stock <= 0}
              onClick={addToCart}
            >
              <ShoppingCart className="h-4 w-4" />
              {labels.addToCart}
            </Button>
            <Button variant="outline" asChild>
              <Link href={`/products/${item.slug}`}>{labels.viewProduct}</Link>
            </Button>
            <Button
              type="button"
              variant="ghost"
              size="icon"
              className="text-slate-500 hover:bg-red-50 hover:text-red-600"
              aria-label={labels.remove}
              onClick={removeItem}
            >
              <Trash2 className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
