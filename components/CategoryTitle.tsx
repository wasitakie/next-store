import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "./ui/carousel";
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
                  className="group/card relative flex h-44 w-full items-end justify-center overflow-hidden rounded-md border border-slate-200 bg-slate-100 transition-colors duration-200 hover:border-slate-300 md:h-56"
                >
                  {cat.image && (
                    <Image
                      src={cat.image || ""}
                      alt={cat.name}
                      fill
                      sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
                      className="object-cover transition-transform duration-700 group-hover/card:scale-[1.03]"
                    />
                  )}

                  <div className="absolute inset-0 bg-gradient-to-t from-slate-950/75 via-slate-950/20 to-transparent transition-opacity duration-300" />

                  {/* 3. ข้อความชื่อหมวดหมู่สินค้า */}
                  <div className="relative z-10 w-full p-4 text-center">
                    <span className="line-clamp-1 text-base font-semibold text-white md:text-lg">
                      {cat.category}
                    </span>
                  </div>
                </Link>
              </div>
            </CarouselItem>
          ))}
        </CarouselContent>
        <CarouselPrevious className="absolute left-4 top-1/2 h-10 w-10 -translate-y-1/2 rounded-md border border-slate-200 bg-white/90 text-slate-900 opacity-0 transition-opacity duration-200 hover:bg-white group-hover:opacity-100" />
        <CarouselNext className="absolute right-4 top-1/2 h-10 w-10 -translate-y-1/2 rounded-md border border-slate-200 bg-white/90 text-slate-900 opacity-0 transition-opacity duration-200 hover:bg-white group-hover:opacity-100" />
      </Carousel>
    </div>
  );
}
