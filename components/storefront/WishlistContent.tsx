"use client";
import { useEffect, useState } from "react";
import { useLocale, useTranslations } from "next-intl";
import { Heart } from "lucide-react";
import { useWishlistStore } from "@/lib/store/useWishlistStore";
import { Button } from "@/components/ui/button";
import { Link } from "@/i18n/routing";
import ProductCard from "@/components/ProductCard";
import { WishlistSkeleton } from "@/components/ui/state";
import type { LocalizedProduct } from "@/types/product";

export default function WishlistContent({products}: {products: LocalizedProduct[]}) {
  const t = useTranslations("WishlistPage");
  const e = useTranslations("EcomPages");
  const locale = useLocale();
  const items = useWishlistStore(s => s.items);
  const remove = useWishlistStore(s => s.removeItem);
  const clear = useWishlistStore(s => s.clearWishlist);
  const [mounted,setMounted] = useState(false);
  const [sort,setSort] = useState("saved");
  useEffect(() => setMounted(true),[]);
  if (!mounted) return <WishlistSkeleton />;
  const saved = items.flatMap(item => {const product = products.find(p => p.id === item.id); return product ? [product] : [];});
  const missing = items.filter(item => !products.some(p => p.id === item.id));
  saved.sort((a,b) => sort === "priceLow" ? a.price-b.price : sort === "priceHigh" ? b.price-a.price : sort === "name" ? a.name.localeCompare(b.name,locale) : 0);
  return <section className="mx-auto max-w-[1600px] px-5 py-10 sm:px-8 lg:px-12">
    <div className="flex flex-wrap items-center justify-between gap-5 border-b border-neutral-200 pb-8"><p className="text-sm text-neutral-500" aria-live="polite">{items.length ? t("itemsCount",{count:items.length}) : e("noFavorites")}</p><div className="flex items-center gap-3">{items.length > 0 && <Button variant="ghost" onClick={clear} className="rounded-full">{t("clearAll")}</Button>}<label className="sr-only" htmlFor="wishlist-sort">{e("sort")}</label><select id="wishlist-sort" value={sort} onChange={event => setSort(event.target.value)} className="h-11 max-w-[190px] rounded-full border border-neutral-300 bg-white px-5 text-sm">{["saved","name","priceLow","priceHigh"].map(key => <option key={key} value={key}>{e(`sortOptions.${key}`)}</option>)}</select></div></div>
    {items.length === 0 ? <div className="mx-auto flex max-w-xl flex-col items-center py-24 text-center md:py-32"><Heart className="mb-8 h-20 w-20 stroke-[0.8]" /><h2 className="text-3xl font-normal">{t("emptyTitle")}</h2><p className="mt-5 leading-7 text-neutral-500">{t("emptyDescription")}</p><Button asChild className="mt-8 h-12 rounded-full bg-neutral-950 px-8 text-white"><Link href="/products">{e("shop")}</Link></Button></div> : <div className="py-10"><ProductCard products={saved} />{missing.map(item => <div key={item.id} className="mt-6 flex flex-wrap items-center justify-between gap-3 border-t py-5"><p>{item.name} · {e("unavailable")}</p><Button variant="outline" className="rounded-full" onClick={() => remove(item.id)}>{t("remove")}</Button></div>)}</div>}
  </section>;
}
