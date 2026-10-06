"use client";
import { useEffect, useState } from "react";
import Image from "next/image";
import { useFormatter, useTranslations } from "next-intl";
import { Link } from "@/i18n/routing";
import { Button } from "@/components/ui/button";
import ProductCard from "@/components/ProductCard";
import type { LocalizedProduct } from "@/types/product";
import { ArrowUpRight, Pause, Play } from "lucide-react";

export function HomeHero({products}: {products: LocalizedProduct[]}) {
  const t = useTranslations("EcomPages");
  const format = useFormatter();
  const [active, setActive] = useState(0);
  const slides = products.filter(p => p.image && p.stock > 0).slice(0, 3);
  const product = slides[active];
  const [paused,setPaused] = useState(false);
  const [interacting,setInteracting] = useState(false);
  const [reducedMotion,setReducedMotion] = useState(true);
  useEffect(() => {
    const media = window.matchMedia("(prefers-reduced-motion: reduce)");
    const update = () => setReducedMotion(media.matches);
    update(); media.addEventListener("change",update);
    return () => media.removeEventListener("change",update);
  },[]);
  useEffect(() => {
    if (paused || interacting || reducedMotion || slides.length < 2) return;
    const timer = window.setInterval(() => {
      if (!document.hidden) setActive(value => (value+1)%slides.length);
    },6000);
    return () => window.clearInterval(timer);
  },[paused,interacting,reducedMotion,slides.length]);
  return <section onMouseEnter={() => setInteracting(true)} onMouseLeave={() => setInteracting(false)} onFocusCapture={() => setInteracting(true)} onBlurCapture={event => {if (!event.currentTarget.contains(event.relatedTarget)) setInteracting(false);}} className="relative isolate flex min-h-[680px] items-end overflow-hidden bg-neutral-900 text-white md:min-h-[820px]">
    {slides.map((slide,index) => slide.image && <Image key={slide.id} src={slide.image} alt="" fill priority={index === 0} sizes="100vw" className={`-z-20 object-cover motion-safe:transition-opacity motion-safe:duration-1000 ${index === active ? "opacity-100" : "opacity-0"}`} />)}
    <div className="absolute inset-0 -z-10 bg-gradient-to-r from-black/70 via-black/30 to-black/20" />
    <div className="mx-auto flex w-full max-w-[1600px] items-end justify-between gap-10 px-5 pb-24 pt-44 sm:px-8 lg:px-12">
      <div key={active} className="store-hero-copy max-w-3xl"><h1 className="text-5xl font-normal leading-[1.15] tracking-tight sm:text-7xl lg:text-8xl">{t(`slides.${active}.title`)}</h1><p className="mt-6 max-w-lg text-lg leading-relaxed">{t(`slides.${active}.description`)}</p><Button asChild className="mt-8 h-12 rounded-full bg-white px-8 text-black hover:bg-neutral-200"><Link href="/products">{t("shop")}<ArrowUpRight /></Link></Button></div>
      {product && <Link href={`/products/${product.slug}`} className="hidden w-72 shrink-0 items-center gap-4 rounded-xl bg-white/95 p-3 text-neutral-950 lg:flex">{product.image && <Image src={product.image} alt={product.name} width={80} height={96} className="h-24 w-20 rounded-lg object-cover" />}<div><p className="mb-2 text-xs text-neutral-500">{t("discover")}</p><p className="line-clamp-2 text-sm">{product.name}</p><p className="mt-2 text-sm">{format.number(product.price,"currency")}</p></div></Link>}
    </div>
    <div className="absolute inset-x-0 bottom-8 flex justify-center gap-2">{slides.map((p,i) => <button key={p.id} type="button" aria-label={t("slide",{number:i+1})} aria-pressed={active === i} onClick={() => {setActive(i); setPaused(true);}} className="flex h-8 w-14 items-center"><span className={`h-1 w-full rounded-full ${active === i ? "bg-white" : "bg-white/40"}`} /></button>)}{slides.length > 1 && !reducedMotion && <button type="button" onClick={() => setPaused(value => !value)} aria-label={t(paused ? "playSlides" : "pauseSlides")} className="ml-2 flex size-8 items-center justify-center rounded-full border border-white/40">{paused ? <Play className="size-3" /> : <Pause className="size-3" />}</button>}</div>
  </section>;
}

export function HomeSelection({products}: {products: LocalizedProduct[]}) {
  const t = useTranslations("EcomPages");
  const [category,setCategory] = useState("");
  const categories = [...new Map(products.map(p => [p.categoryKey || p.category,p.category])).entries()];
  return <section className="mx-auto max-w-[1600px] px-5 py-16 sm:px-8 lg:px-12 lg:py-24">
    <h2 className="text-3xl font-normal tracking-tight md:text-5xl">{t("selection")}</h2>
    <div className="my-8 flex flex-wrap gap-2" role="group" aria-label={t("categories")}>
      {[["",t("all")],...categories].map(([key,label]) => <Button key={key} variant="outline" aria-pressed={key === category} onClick={() => setCategory(key)} className={`rounded-full px-5 ${key === category ? "bg-neutral-950 text-white hover:bg-neutral-800 hover:text-white" : "bg-white"}`}>{label}</Button>)}
    </div>
    <ProductCard products={products.filter(p => !category || (p.categoryKey || p.category) === category).slice(0,4)} />
  </section>;
}
