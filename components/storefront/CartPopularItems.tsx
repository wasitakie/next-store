"use client";

import Image from "next/image";
import { useState } from "react";
import { useFormatter, useTranslations } from "next-intl";
import { Plus, ShoppingBag, LoaderCircle } from "lucide-react";
import { Link } from "@/i18n/routing";
import { Button } from "@/components/ui/button";
import { useCartStore } from "@/lib/store/useCartStore";
import type { LocalizedProduct } from "@/types/product";

export default function CartPopularItems({products}: {products: LocalizedProduct[]}) {
  const t = useTranslations("CartPage");
  const format = useFormatter();
  const items = useCartStore(state => state.items);
  const addItem = useCartStore(state => state.addItem);
  const setIsOpen = useCartStore(state => state.setIsOpen);
  const [pending,setPending] = useState<number | null>(null);
  const recommendations = products.filter(product => product.stock > 0 && !items.some(item => item.id === product.id)).slice(0,4);
  if (!recommendations.length) return null;
  async function add(product: LocalizedProduct) {
    if (pending !== null) return;
    setPending(product.id);
    try { await addItem(product); } finally { setPending(null); }
  }
  return <section aria-label={t("popularItems")} className="pt-5">
    <h3 className="mb-6 text-lg font-normal tracking-tight">{t("popularItems")}</h3>
    <div className="space-y-5">{recommendations.map(product => <article key={product.id} className="flex items-start gap-4">
      <Link href={`/products/${product.slug}`} onClick={() => setIsOpen(false)} className="relative block size-[104px] shrink-0 overflow-hidden rounded-lg bg-neutral-100">
        {product.image ? <Image src={product.image} alt={product.name} fill sizes="104px" className="object-cover" /> : <ShoppingBag aria-label={product.name} className="m-auto h-full w-8 text-neutral-400" />}
      </Link>
      <div className="min-w-0 flex-1 pt-1"><Link href={`/products/${product.slug}`} onClick={() => setIsOpen(false)} className="line-clamp-2 text-sm leading-5 hover:underline">{product.name}</Link><p className="mt-2 text-xs">{format.number(product.price,"currency")}</p><p className="mt-3 text-xs text-neutral-500">{product.category}</p></div>
      <Button type="button" size="icon" disabled={pending !== null} onClick={() => add(product)} aria-label={t("addPopularItem",{name:product.name})} className="mt-1 size-7 shrink-0 rounded-full bg-neutral-800 text-white hover:bg-black [&_svg]:size-4">{pending === product.id ? <LoaderCircle className="motion-safe:animate-spin" /> : <Plus className="stroke-[1.5]" />}</Button>
    </article>)}</div>
  </section>;
}
