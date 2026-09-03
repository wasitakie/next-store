"use client";

import { LocalizedProduct } from "@/types/product";
import { Button } from "./ui/button";
import Link from "next/link";
import Image from "next/image";
import { useFormatter, useTranslations } from "next-intl";
import { useCallback, useEffect, useState } from "react";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
  type CarouselApi,
} from "@/components/ui/carousel";
import Autoplay from "embla-carousel-autoplay";
import { cn } from "@/lib/utils";
import { Badge } from "./ui/badge";
import { MoveRightIcon, ShoppingCart } from "lucide-react";
import { useCartStore } from "@/lib/store/useCartStore";
interface ProductCarouselProps {
  product: LocalizedProduct[];
}

export default function ProductCarousel({ product }: ProductCarouselProps) {
  const [api, setApi] = useState<CarouselApi>();
  const [current, setCurrent] = useState(0);
  const [count, setCount] = useState(0);

  useEffect(() => {
    if (!api) return;

    setCount(api.scrollSnapList().length);
    setCurrent(api.selectedScrollSnap());

    api.on("select", () => {
      setCurrent(api.selectedScrollSnap());
    });
  }, [api]);

  const scrollTo = useCallback(
    (index: number) => {
      api?.scrollTo(index);
    },
    [api],
  );

  if (product.length === 0) {
    return null;
  }

  return (
    <div className="group relative w-full border-b border-slate-200 bg-slate-950 text-white">
      <Carousel
        setApi={setApi}
        className="w-full"
        opts={{
          loop: false,
          align: "start",
        }}
        plugins={[
          Autoplay({
            delay: 5000,
            stopOnInteraction: false,
            stopOnMouseEnter: true,
          }),
        ]}
      >
        <CarouselContent className="-ml-0 ">
          {product.map((item, index) => (
            <CarouselItem key={index} className="pl-0">
              <FeaturedSlide product={item} />
            </CarouselItem>
          ))}
        </CarouselContent>
        <CarouselPrevious className="absolute left-4 top-1/2 h-10 w-10 -translate-y-1/2 rounded-md border border-white/20 bg-white/90 text-slate-900 opacity-0 transition-opacity duration-200 hover:bg-white group-hover:opacity-100" />
        <CarouselNext className="absolute right-4 top-1/2 h-10 w-10 -translate-y-1/2 rounded-md border border-white/20 bg-white/90 text-slate-900 opacity-0 transition-opacity duration-200 hover:bg-white group-hover:opacity-100" />
      </Carousel>
      {count > 1 && (
        <div className="mt-4 absolute bottom-4 left-1/2 flex -translate-x-1/2 gap-2 sm:bottom-6">
          {Array.from({ length: count }).map((_, index) => (
            <button
              key={`dot-${index}`}
              type="button"
              className={cn(
                "h-2 w-2 rounded-full transition-all duration-300",
                current === index
                  ? "w-6 bg-white"
                  : "bg-white/40 hover:bg-white/60",
              )}
              onClick={() => {
                scrollTo(index);
              }}
              aria-label={`Go to slide ${index + 1}`}
            />
          ))}
        </div>
      )}
    </div>
  );
}

interface FeaturedSlideProps {
  product: LocalizedProduct;
}

function FeaturedSlide({ product }: FeaturedSlideProps) {
  const t = useTranslations("HomePage");
  const format = useFormatter();
  const addItem = useCartStore((state) => state.addItem);
  const inStock = product.stock > 0;

  return (
    <div className="flex min-h-100 flex-col md:min-h-125 md:flex-row lg:min-h-150">
      <div className="relative h-64  w-full md:h-auto md:w-3/5">
        {product.image ? (
          <Image
            src={product.image ?? ""}
            alt={product.name}
            className="object-cover"
            fill
            loading="eager"
            sizes="(max-width: 768px) 100vw,60vw"
          />
        ) : (
          <div className="relative h-full items-center justify-center  bg-zinc-800">
            <span className="text-4xl font-semibold">no image</span>
          </div>
        )}
        <div className="absolute inset-0 hidden bg-linear-to-r from-transparent via-transparent to-slate-950 md:block"></div>
        <div className="absolute inset-0 bg-slate-950/55 md:hidden"></div>
      </div>
      <div className="flex w-full flex-col justify-center px-6 py-8 md:w-2/5 md:px-10 lg:px-16">
        {product.category && (
          <Badge
            className="mb-4 w-fit border border-white/15 bg-white/10 text-white hover:bg-white/10"
            variant="secondary"
          >
            {product.category}
          </Badge>
        )}
        <h2 className="text-2xl font-bold tracking-tight text-white sm:text-3xl lg:text-4xl">
          {product.name}
        </h2>
        <p className="mt-4 line-clamp-3 text-sm text-slate-300 sm:text-base lg:text-lg">
          {product.description}
        </p>
        <div className="mt-6 flex flex-wrap items-center gap-3">
          <p className="text-3xl font-bold text-white">
            {format.number(product.price, "currency")}
          </p>
          <span
            className={cn(
              "rounded-md px-2.5 py-1 text-xs font-semibold",
              inStock
                ? "bg-emerald-400/15 text-emerald-200"
                : "bg-red-400/15 text-red-200",
            )}
          >
            {inStock
              ? `${t("readyToShip")} · ${t("inStockCount", {
                  count: product.stock,
                })}`
              : t("outOfStock")}
          </span>
        </div>
        <div className="mt-8 flex flex-col gap-3 sm:flex-row">
          <Button
            size="lg"
            className="bg-orange-500 text-white hover:bg-orange-600"
            disabled={!inStock}
            onClick={() => addItem(product)}
          >
            <ShoppingCart className="h-4 w-4" />
            {inStock ? t("addToCart") : t("outOfStock")}
          </Button>
          <Button
            size="lg"
            asChild
            variant="outline"
            className="border-white/20 bg-white/10 text-white hover:bg-white hover:text-slate-950"
          >
            <Link href={`/products/${product.slug}`}>
              {t("viewDetails")}
              <MoveRightIcon className="h-4 w-4" />
            </Link>
          </Button>
        </div>
      </div>
    </div>
  );
}
