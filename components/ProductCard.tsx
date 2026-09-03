"use client";

import { Plus } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import React from "react";
import { Button } from "./ui/button";
import {
  Card,
  CardContent,
  CardFooter,
} from "./ui/card";
import { LocalizedProduct } from "@/types/product";
import { useFormatter, useTranslations } from "next-intl";
import { useCartStore } from "@/lib/store/useCartStore";
import WishlistButton from "@/components/WishlistButton";

export default function ProductCard({
  products,
}: {
  products: LocalizedProduct[];
}) {
  const t = useTranslations("ProductCard");
  const format = useFormatter();
  const addItem = useCartStore((state) => state.addItem);
  return (
    <div className="container mx-auto">
      <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:gap-5 xl:grid-cols-4">
        {products.map((product, index) => (
          <div key={product.id}>
            <Card className="group relative h-full w-full cursor-pointer overflow-hidden border-slate-200 bg-white transition-colors duration-200 hover:border-slate-300">
              <div className="absolute right-3 top-3 z-10 opacity-100 transition-opacity duration-200 md:opacity-0 md:group-hover:opacity-100">
                <WishlistButton
                  product={product}
                  label={t("addToWishlist")}
                  activeLabel={t("removeFromWishlist")}
                  className="h-9 w-9 rounded-md"
                />
              </div>
              <div className="absolute top-3 left-3 z-10">
                <div className="rounded-md border border-orange-200 bg-orange-50 px-2.5 py-1 text-xs font-semibold text-orange-700">
                  {product.stock === 0
                    ? t("outOfStock")
                    : product.stock <= 5
                      ? t("lowStock")
                      : t("readyToShip")}
                </div>
              </div>
              <Link href={`/products/${product.slug}`} className="block">
                <div className="relative h-52 w-full overflow-hidden bg-slate-100">
                  <Image
                    src={product.image || ""}
                    alt={product.name}
                    fill
                    loading={index < 4 ? "eager" : "lazy"}
                    priority={index < 4}
                    sizes="(max-width: 768px) 100vw, (max-width: 1280px) 50vw, 25vw"
                    className="object-cover object-center transition-transform duration-500 group-hover:scale-[1.03]"
                  />
                  {product.stock === 0 && (
                    <div className="absolute inset-0 flex items-center justify-center bg-white/75 backdrop-blur-[1px]">
                      <p className="rounded-md bg-slate-950 px-3 py-1.5 text-sm font-semibold text-white">
                        {t("outOfStock")}
                      </p>
                    </div>
                  )}
                </div>
              </Link>
              <CardContent className="flex grow flex-col justify-between gap-3 p-4">
                {product.category && (
                  <span className="text-xs font-semibold uppercase text-slate-500">
                    {product.category}
                  </span>
                )}
                <Link href={`/products/${product.slug}`} className="block">
                  <h3 className="line-clamp-2 text-base font-semibold leading-tight text-slate-950 transition-colors duration-200 group-hover:text-orange-600">
                    {product.name}
                  </h3>
                </Link>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="text-xl font-bold text-slate-950">
                      {format.number(product.price, "currency")}
                    </div>
                  </div>
                  <span className="text-xs font-semibold text-emerald-600">
                    {product.stock > 0 ? t("readyToShip") : t("outOfStock")}
                  </span>
                </div>
              </CardContent>
              <CardFooter className="p-4 pt-0">
                <Button
                  disabled={product.stock === 0}
                  className="h-10 w-full cursor-pointer"
                  onClick={() => addItem(product)}
                >
                  <Plus className="h-4 w-4" />
                  {t("AddToCart")}
                </Button>
              </CardFooter>
            </Card>
          </div>
        ))}
      </div>
    </div>
  );
}
