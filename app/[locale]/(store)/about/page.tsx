import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Link } from "@/i18n/routing";
import { buildSeoMetadata } from "@/lib/seo";
import {
  BadgeCheck,
  Headphones,
  PackageCheck,
  ShieldCheck,
  Sparkles,
  Truck,
} from "lucide-react";
import type { Metadata } from "next";
import { getTranslations } from "next-intl/server";
import Image from "next/image";

const valueIcons = [BadgeCheck, Truck, ShieldCheck] as const;
const processIcons = [Sparkles, PackageCheck, Headphones] as const;

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

  return (
    <main className="min-h-screen bg-slate-50">
      <section className="bg-white">
        <div className="mx-auto grid max-w-7xl gap-10 px-4 py-14 sm:px-6 lg:grid-cols-[1fr_440px] lg:px-8 lg:py-18">
          <div className="flex flex-col justify-center">
            <p className="mb-3 text-sm font-semibold uppercase tracking-normal text-orange-600">
              {t("eyebrow")}
            </p>
            <h1 className="max-w-3xl text-4xl font-bold leading-tight text-slate-950 sm:text-5xl">
              {t("title")}
            </h1>
            <p className="mt-5 max-w-2xl text-lg leading-8 text-slate-600">
              {t("description")}
            </p>
            <div className="mt-8 flex flex-col gap-3 sm:flex-row">
              <Button
                asChild
                size="lg"
                className="bg-orange-500 text-white hover:bg-orange-600"
              >
                <Link href="/products">{t("shopProducts")}</Link>
              </Button>
              <Button asChild size="lg" variant="outline">
                <Link href="/contact">{t("contactUs")}</Link>
              </Button>
            </div>
          </div>

          <div className="relative min-h-[320px] overflow-hidden rounded-md border border-slate-200 bg-slate-200">
            <Image
              src="/images/logo-store.png"
              alt="NextStore"
              width={640}
              height={640}
              priority
              className="absolute left-1/2 top-1/2 h-40 w-40 -translate-x-1/2 -translate-y-1/2 object-contain opacity-95"
            />
            <div className="absolute inset-x-0 bottom-0 bg-linear-to-t from-slate-950 via-slate-950/80 to-transparent p-6">
              <p className="text-sm font-semibold text-orange-300">
                {t("heroCardTitle")}
              </p>
              <p className="mt-2 text-sm leading-6 text-slate-200">
                {t("heroCardDescription")}
              </p>
            </div>
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
        <div className="grid gap-4 md:grid-cols-3">
          {[0, 1, 2].map((index) => {
            const Icon = valueIcons[index];

            return (
              <Card
                key={index}
                className="rounded-md border-slate-200 bg-white shadow-sm"
              >
                <CardContent className="p-6">
                  <div className="mb-5 flex h-11 w-11 items-center justify-center rounded-md bg-orange-50 text-orange-600">
                    <Icon className="h-5 w-5" />
                  </div>
                  <h2 className="text-lg font-bold text-slate-950">
                    {t(`values.${index}.title`)}
                  </h2>
                  <p className="mt-3 leading-7 text-slate-600">
                    {t(`values.${index}.description`)}
                  </p>
                </CardContent>
              </Card>
            );
          })}
        </div>
      </section>

      <section className="bg-white">
        <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
          <div className="mb-8 max-w-2xl">
            <p className="mb-2 text-sm font-semibold uppercase tracking-normal text-orange-600">
              {t("processEyebrow")}
            </p>
            <h2 className="text-3xl font-bold text-slate-950">
              {t("processTitle")}
            </h2>
          </div>

          <div className="grid gap-4 lg:grid-cols-3">
            {[0, 1, 2].map((index) => {
              const Icon = processIcons[index];

              return (
                <div
                  key={index}
                  className="rounded-md border border-slate-200 bg-slate-50 p-6"
                >
                  <div className="mb-4 flex items-center gap-3">
                    <span className="flex h-10 w-10 items-center justify-center rounded-md bg-slate-950 text-white">
                      <Icon className="h-5 w-5 text-orange-300" />
                    </span>
                    <span className="text-sm font-semibold text-slate-500">
                      {t("step", { count: index + 1 })}
                    </span>
                  </div>
                  <h3 className="text-lg font-bold text-slate-950">
                    {t(`process.${index}.title`)}
                  </h3>
                  <p className="mt-3 leading-7 text-slate-600">
                    {t(`process.${index}.description`)}
                  </p>
                </div>
              );
            })}
          </div>
        </div>
      </section>
    </main>
  );
}
