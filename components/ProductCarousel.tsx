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
import { Card, CardContent } from "@/components/ui/card";
import { number } from "zod";
import { cn } from "@/lib/utils";
import { Badge } from "./ui/badge";
import { AlignRight, MoveRightIcon } from "lucide-react";
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
    <div className="relative  w-full bg-linear-to-br from-zinc-900 via-zinc-900 to-zinc-900 text-white">
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
        <CarouselPrevious className="absolute left-4 top-1/2 -translate-y-1/2 h-11 w-11 rounded-full bg-white/80 dark:bg-black/80 backdrop-blur-sm border-none shadow-lg opacity-0 group-hover:opacity-100 transition-opacity duration-300 text-neutral-800 dark:text-white hover:bg-white hover:scale-105" />
        <CarouselNext className="absolute right-4 top-1/2 -translate-y-1/2 h-11 w-11 rounded-full bg-white/80 dark:bg-black/80 backdrop-blur-sm border-none shadow-lg opacity-0 group-hover:opacity-100 transition-opacity duration-300 text-neutral-800 dark:text-white hover:bg-white hover:scale-105" />
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
  return (
    <div className="flex flex-col min-h-100 md:min-h-125 md:flex-row lg:min-h-150">
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
        <div className="absolute inset-0 bg-linear-to-r from-transparent via-transparent to-zinc-900/90 dark:to-zinc-950/90 hidden md:block"></div>
        <div className="absolute inset-0 bg-linear-to-r from-zinc-900/90 via-transparent to-transparent  md:hidden"></div>
      </div>
      <div className="flex flex-col justify-center  w-full md:w-2/5 px-6 py-8 md:px-10 lg:px-16 ">
        {product.category && (
          <Badge
            className="mb-4 w-fit bg-blue-900/75 text-white "
            variant="secondary"
          >
            {product.category}
          </Badge>
        )}
        <h2 className="text-2xl font-bold tracking-tight text-white sm:text-3xl lg:text-4xl">
          {product.name}
        </h2>
        <p className="mt-4 line-clamp-3 text-sm text-zinc-300 sm:text-base lg:txt-lg">
          {product.description}
        </p>
        <p className="mt-6 text-3xl font-bold text-white">
          {format.number(product.price, "currency")}
        </p>
        <div className="mt-8 flex flex-col gap-3 sm:flex-row">
          <Button
            size="lg"
            asChild
            className="bg-orange-500 hover:bg-amber-400 text-white"
          >
            <Link href={`/products/${product.slug}`}>
              {t("shopNow")}
              <MoveRightIcon className="ml-2 h-4 w-4" />
            </Link>
          </Button>
        </div>
      </div>
    </div>
  );
}
