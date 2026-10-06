import StoreMotion from "@/components/storefront/StoreMotion";
import { buildSeoMetadata } from "@/lib/seo";
import type { Metadata } from "next";
import { getTranslations } from "next-intl/server";
import Image from "next/image";
import { Plus } from "lucide-react";
import ContactForm from "@/components/storefront/ContactForm";
import { editorialImages } from "@/components/storefront/EditorialHero";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const isEnglish = locale === "en";

  return buildSeoMetadata({
    locale,
    path: "/contact",
    title: isEnglish ? "Contact NextStore" : "ติดต่อ NextStore",
    description: isEnglish
      ? "Contact NextStore for product advice, order support, shipping questions, and after-sales service."
      : "ติดต่อ NextStore เพื่อสอบถามสินค้า คำสั่งซื้อ การจัดส่ง และบริการหลังการขาย",
    image: "/images/logo.png",
  });
}

export default async function ContactPage() {
  const t = await getTranslations("ContactPage");
  const e = await getTranslations("EcomPages");
  return <StoreMotion className="bg-white text-neutral-950">
    <section className="mx-auto max-w-[1600px] px-5 py-16 sm:px-8 lg:px-12 lg:py-24">
      <h1 className="text-5xl font-normal tracking-tight md:text-7xl">{e("contactTitle")}</h1>
      <p className="mt-6 max-w-xl text-lg leading-8 text-neutral-500">{t("description")}</p>
      <div className="mt-12 grid gap-12 lg:grid-cols-2 lg:gap-20">
        <div><div className="relative aspect-[5/4] overflow-hidden rounded-xl"><Image src={editorialImages.desk} alt="" fill priority sizes="(max-width:1024px) 100vw,50vw" className="object-cover" /></div>
          <div className="mt-8 grid gap-6 sm:grid-cols-3">{[1,0,2].map(i => <div key={i}><h2 className="text-sm text-neutral-500">{t(`channels.${i}.title`)}</h2><p className="mt-2 break-words text-sm">{i === 1 ? <a className="hover:underline" href={`mailto:${t("channels.1.value")}`}>{t("channels.1.value")}</a> : i === 0 ? <a className="hover:underline" href={`tel:${t("channels.0.value")}`}>{t("channels.0.value")}</a> : t(`channels.${i}.value`)}</p></div>)}</div>
        </div><ContactForm email={t("channels.1.value")} />
      </div>
    </section>
    <section id="faq" className="scroll-mt-8 mx-auto grid max-w-[1600px] gap-10 border-t border-neutral-200 px-5 py-16 sm:px-8 lg:grid-cols-[1fr_1.5fr] lg:px-12 lg:py-24">
      <div><h2 className="text-4xl tracking-tight md:text-6xl">{e("faqTitle")}</h2><p className="mt-5 max-w-sm leading-7 text-neutral-500">{e("faqIntro")}</p></div>
      <div className="divide-y divide-neutral-200">{[0,1,2,3,4,5].map(i => <details id={`faq-${i}`} key={i} className="group scroll-mt-8 py-6"><summary className="flex cursor-pointer list-none items-center justify-between gap-6 text-lg [&::-webkit-details-marker]:hidden">{e(`faq.${i}.question`)}<Plus className="h-5 w-5 shrink-0 transition-transform group-open:rotate-45" /></summary><p className="mt-4 max-w-2xl leading-7 text-neutral-500">{e(`faq.${i}.answer`)}</p></details>)}</div>
    </section>
  </StoreMotion>;
}
