import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { buildSeoMetadata } from "@/lib/seo";
import {
  Clock,
  Headphones,
  Mail,
  MapPin,
  MessageCircle,
  Phone,
  Send,
} from "lucide-react";
import type { Metadata } from "next";
import { getTranslations } from "next-intl/server";

const contactIcons = [Phone, Mail, MapPin] as const;

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

  return (
    <main className="min-h-screen bg-slate-50">
      <section className="border-b border-slate-200 bg-white">
        <div className="mx-auto max-w-7xl px-4 py-14 sm:px-6 lg:px-8">
          <div className="max-w-3xl">
            <p className="mb-3 text-sm font-semibold uppercase tracking-normal text-orange-600">
              {t("eyebrow")}
            </p>
            <h1 className="text-4xl font-bold leading-tight text-slate-950 sm:text-5xl">
              {t("title")}
            </h1>
            <p className="mt-5 text-lg leading-8 text-slate-600">
              {t("description")}
            </p>
          </div>
        </div>
      </section>

      <section className="mx-auto grid max-w-7xl gap-6 px-4 py-12 sm:px-6 lg:grid-cols-[1fr_420px] lg:px-8">
        <Card className="rounded-md border-slate-200 bg-white shadow-sm">
          <CardContent className="p-6 sm:p-8">
            <div className="mb-6 flex items-center gap-3">
              <div className="flex h-11 w-11 items-center justify-center rounded-md bg-orange-50 text-orange-600">
                <MessageCircle className="h-5 w-5" />
              </div>
              <div>
                <h2 className="text-2xl font-bold text-slate-950">
                  {t("formTitle")}
                </h2>
                <p className="text-sm text-slate-500">{t("formDescription")}</p>
              </div>
            </div>

            <form className="grid gap-4">
              <div className="grid gap-4 sm:grid-cols-2">
                <label className="grid gap-2 text-sm font-medium text-slate-700">
                  {t("name")}
                  <Input placeholder={t("namePlaceholder")} />
                </label>
                <label className="grid gap-2 text-sm font-medium text-slate-700">
                  {t("email")}
                  <Input type="email" placeholder={t("emailPlaceholder")} />
                </label>
              </div>
              <label className="grid gap-2 text-sm font-medium text-slate-700">
                {t("subject")}
                <Input placeholder={t("subjectPlaceholder")} />
              </label>
              <label className="grid gap-2 text-sm font-medium text-slate-700">
                {t("message")}
                <textarea
                  rows={6}
                  placeholder={t("messagePlaceholder")}
                  className="min-h-36 rounded-md border border-input bg-background px-3 py-2 text-sm text-slate-900 shadow-sm outline-none ring-offset-background placeholder:text-muted-foreground focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
                />
              </label>
              <Button className="mt-2 w-full bg-orange-500 text-white hover:bg-orange-600 sm:w-fit">
                <Send className="h-4 w-4" />
                {t("sendMessage")}
              </Button>
            </form>
          </CardContent>
        </Card>

        <div className="grid gap-4">
          {[0, 1, 2].map((index) => {
            const Icon = contactIcons[index];

            return (
              <Card
                key={index}
                className="rounded-md border-slate-200 bg-white shadow-sm"
              >
                <CardContent className="flex gap-4 p-5">
                  <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-md bg-slate-950 text-white">
                    <Icon className="h-5 w-5 text-orange-300" />
                  </div>
                  <div>
                    <h2 className="font-bold text-slate-950">
                      {t(`channels.${index}.title`)}
                    </h2>
                    <p className="mt-1 text-slate-700">
                      {t(`channels.${index}.value`)}
                    </p>
                    <p className="mt-1 text-sm text-slate-500">
                      {t(`channels.${index}.description`)}
                    </p>
                  </div>
                </CardContent>
              </Card>
            );
          })}

          <div className="rounded-md border border-slate-200 bg-slate-950 p-6 text-white">
            <div className="mb-4 flex items-center gap-3">
              <Clock className="h-5 w-5 text-orange-300" />
              <h2 className="text-lg font-bold">{t("hoursTitle")}</h2>
            </div>
            <div className="grid gap-3 text-sm text-slate-200">
              <div className="flex justify-between gap-4">
                <span>{t("weekday")}</span>
                <span className="font-semibold text-white">
                  {t("weekdayHours")}
                </span>
              </div>
              <div className="flex justify-between gap-4">
                <span>{t("weekend")}</span>
                <span className="font-semibold text-white">
                  {t("weekendHours")}
                </span>
              </div>
            </div>
          </div>

          <div className="rounded-md border border-orange-200 bg-orange-50 p-5">
            <div className="flex gap-3">
              <Headphones className="mt-0.5 h-5 w-5 shrink-0 text-orange-600" />
              <p className="text-sm leading-6 text-slate-700">
                {t("supportNote")}
              </p>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
