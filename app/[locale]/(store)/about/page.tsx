import StoreMotion from "@/components/storefront/StoreMotion";
import { Button } from "@/components/ui/button";
import { Link } from "@/i18n/routing";
import { buildSeoMetadata } from "@/lib/seo";
import type { Metadata } from "next";
import { getTranslations } from "next-intl/server";
import Image from "next/image";
import EditorialHero, { editorialImages } from "@/components/storefront/EditorialHero";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const isEnglish = locale === "en";

  return buildSeoMetadata({
    locale,
    path: "/about",
    title: isEnglish ? "About NextStore" : "เกี่ยวกับ NextStore",
    description: isEnglish
      ? "Learn how NextStore curates reliable IT products, gadgets, and accessories with fast delivery and helpful support."
      : "รู้จัก NextStore ร้านสินค้าไอที แกดเจ็ต และอุปกรณ์เสริมที่คัดของใช้งานจริง จัดส่งรวดเร็ว และดูแลหลังการขาย",
    image: "/images/logo.png",
  });
}

export default async function AboutPage() {
  const t = await getTranslations("AboutPage");
  const e = await getTranslations("EcomPages");
  return <StoreMotion className="bg-white text-neutral-950">
    <EditorialHero title={t("eyebrow")} description={e("aboutIntro")} image={editorialImages.workspace} />
    <section className="mx-auto max-w-[1600px] px-5 py-20 sm:px-8 lg:px-12 lg:py-32">
      <p className="max-w-5xl text-3xl leading-snug tracking-tight md:ml-auto md:text-5xl">{t("description")}</p>
      <div className="mt-16 grid gap-10 border-t border-neutral-200 pt-10 md:mt-24 md:grid-cols-3">{[0,1,2].map(i => <div key={i}><p className="text-5xl tracking-tight text-neutral-300">0{i+1}</p><h2 className="mt-5 text-xl">{t(`values.${i}.title`)}</h2><p className="mt-3 max-w-sm leading-7 text-neutral-500">{t(`values.${i}.description`)}</p></div>)}</div>
    </section>
    <section className="mx-auto grid max-w-[1600px] gap-10 px-5 pb-20 sm:px-8 md:grid-cols-2 md:items-center lg:gap-20 lg:px-12 lg:pb-32">
      <div className="relative aspect-[4/5] overflow-hidden rounded-xl"><Image src={editorialImages.desk} alt="" fill sizes="(max-width:768px) 100vw,50vw" className="object-cover" /></div>
      <div><p className="mb-5 text-sm text-neutral-500">{t("processEyebrow")}</p><h2 className="text-3xl leading-tight tracking-tight md:text-5xl">{t("processTitle")}</h2><div className="mt-10 divide-y divide-neutral-200">{[0,1,2].map(i => <div key={i} className="py-6"><h3 className="text-xl">{t(`process.${i}.title`)}</h3><p className="mt-3 leading-7 text-neutral-500">{t(`process.${i}.description`)}</p></div>)}</div><Button asChild className="mt-6 h-12 rounded-full bg-neutral-950 px-8 text-white"><Link href="/products">{t("shopProducts")}</Link></Button></div>
    </section>
  </StoreMotion>;
}
