import Image from "next/image";
import { ArrowUpRight } from "lucide-react";
import { Link } from "@/i18n/routing";
import { Button } from "@/components/ui/button";
import type { LocalizedProduct } from "@/types/product";

export default function StoreHero({ title, description, cta, product, collection = false }: {
  title: string; description?: string; cta: string; product?: LocalizedProduct; collection?: boolean;
}) {
  return (
    <section className={`relative isolate flex overflow-hidden bg-neutral-900 text-white ${collection ? "min-h-[440px] md:min-h-[560px]" : "min-h-[620px] md:min-h-[740px]"}`}>
      {product?.image && <Image src={product.image} alt={product.name} fill priority sizes="100vw" className="-z-20 object-cover object-center" />}
      <div className="absolute inset-0 -z-10 bg-gradient-to-r from-black/75 via-black/35 to-black/10" />
      <div className="mx-auto flex w-full max-w-[1600px] items-end px-5 pb-12 pt-40 sm:px-8 md:pb-20 lg:px-12">
        <div className="max-w-3xl">
          <h1 className="text-5xl font-normal leading-[1.15] tracking-tight sm:text-6xl lg:text-8xl">{title}</h1>
          {description && <p className="mt-5 max-w-xl text-lg leading-relaxed text-white/90 sm:text-xl">{description}</p>}
          {!collection && <Button asChild className="mt-8 h-12 rounded-full bg-white px-7 text-black hover:bg-neutral-200"><Link href="/products">{cta}<ArrowUpRight className="h-4 w-4" /></Link></Button>}
        </div>
      </div>
    </section>
  );
}
