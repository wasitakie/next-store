"use client";

import { ImageIcon, Plus } from "lucide-react";
import Image from "next/image";
import { Link } from "@/i18n/routing";
import { Button } from "./ui/button";
import { LocalizedProduct } from "@/types/product";
import { useFormatter, useTranslations } from "next-intl";
import { useCartStore } from "@/lib/store/useCartStore";
import WishlistButton from "@/components/WishlistButton";

export default function ProductCard({ products }: { products: LocalizedProduct[] }) {
  const t = useTranslations("ProductCard");
  const format = useFormatter();
  const addItem = useCartStore((state) => state.addItem);
  return (
    <div className="grid grid-cols-2 gap-x-4 gap-y-10 lg:grid-cols-3 xl:grid-cols-4">
      {products.map((product) => (
        <article key={product.id} className="group flex min-w-0 flex-col">
          <div className="relative overflow-hidden rounded-xl bg-neutral-100">
            <Link href={`/products/${product.slug}`} className="relative block aspect-[3/4]">
              {product.image ? <Image src={product.image} alt={product.name} fill sizes="(max-width: 640px) 50vw, (max-width: 1280px) 33vw, 25vw" className="object-cover transition-transform duration-500 motion-safe:group-hover:scale-105" /> : <span className="flex h-full items-center justify-center"><ImageIcon className="h-12 w-12 text-neutral-400" aria-label={product.name} /></span>}
            </Link>
            <span className="pointer-events-none absolute left-2 top-3 rounded-full bg-white/95 px-2.5 py-1 text-[10px] font-medium sm:left-3 sm:text-xs">{product.stock <= 0 ? t("outOfStock") : product.stock <= 5 ? t("lowStock") : t("readyToShip")}</span>
            <div className="absolute bottom-3 right-3"><WishlistButton product={product} label={t("addToWishlist")} activeLabel={t("removeFromWishlist")} className="h-9 w-9 rounded-full border-0 bg-white text-neutral-950 hover:bg-neutral-100" /></div>
          </div>
          <div className="flex flex-1 flex-col pt-4">
            <p className="mb-1 text-xs text-neutral-500">{product.category}</p>
            <Link href={`/products/${product.slug}`} className="hover:underline"><h3 className="line-clamp-2 text-sm leading-relaxed sm:text-base">{product.name}</h3></Link>
            <p className="mt-2 text-sm font-medium sm:text-base">{format.number(product.price, "currency")}</p>
            <Button disabled={product.stock <= 0} variant="outline" className="mt-4 h-10 w-full rounded-full border-neutral-300 bg-white text-xs text-neutral-950 hover:bg-neutral-950 hover:text-white sm:text-sm" onClick={() => addItem(product)}><Plus className="h-4 w-4" />{t("AddToCart")}</Button>
          </div>
        </article>
      ))}
    </div>
  );
}
