import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "./ui/carousel";
import { Card, CardContent } from "./ui/card";
import Link from "next/link";
import Image from "next/image";
import { LocalizedProduct } from "@/types/product";

export default function CategoryTitle({
  categories,
  locale,
}: {
  categories: LocalizedProduct[];
  locale: string;
}) {
  return (
    <div className="relative w-full  group">
      <Carousel className="w-full">
        <CarouselContent className="-ml-1">
          {categories.map((cat, index) => (
            <CarouselItem
              key={index}
              className="basis-1/2 pl-2 sm:basis-1/3 lg:basis-1/4 md:pl-4"
            >
              <div className="">
                <Link
                  href={`/${locale}?category=${cat.category}`}
                  className="relative flex h-48 md:h-60 w-full items-end justify-center rounded-2xl overflow-hidden group/card shadow-sm hover:shadow-xl transition-all duration-300 border border-border/40 bg-muted "
                >
                  {cat.image && (
                    <Image
                      src={cat.image || ""}
                      alt={cat.name}
                      fill
                      sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
                      className="object-cover transition-transform duration-700 group-hover/card:scale-105"
                    />
                  )}

                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-black/5 transition-opacity duration-300 group-hover/card:from-black/90" />

                  {/* 3. ข้อความชื่อหมวดหมู่สินค้า */}
                  <div className="relative z-10 p-4 w-full text-center transform translate-y-1 group-hover/card:translate-y-0 transition-transform duration-300">
                    <span className="text-base md:text-lg text-white font-bold tracking-wide drop-shadow-md line-clamp-1">
                      {cat.category}
                    </span>
                  </div>
                </Link>
              </div>
            </CarouselItem>
          ))}
        </CarouselContent>
        <CarouselPrevious className="absolute left-4 top-1/2 -translate-y-1/2 h-11 w-11 rounded-full bg-white/80 dark:bg-black/80 backdrop-blur-sm border-none shadow-lg opacity-0 group-hover:opacity-100 transition-opacity duration-300 text-neutral-800 dark:text-white hover:bg-white hover:scale-105" />
        <CarouselNext className="absolute right-4 top-1/2 -translate-y-1/2 h-11 w-11 rounded-full bg-white/80 dark:bg-black/80 backdrop-blur-sm border-none shadow-lg opacity-0 group-hover:opacity-100 transition-opacity duration-300 text-neutral-800 dark:text-white hover:bg-white hover:scale-105" />
      </Carousel>
    </div>
  );
}
