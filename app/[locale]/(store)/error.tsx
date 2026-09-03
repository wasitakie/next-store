"use client";

import { Button } from "@/components/ui/button";
import { ErrorState } from "@/components/ui/state";
import { Link } from "@/i18n/routing";
import { RefreshCcw } from "lucide-react";
import { useParams } from "next/navigation";

const copy = {
  th: {
    title: "โหลดหน้านี้ไม่สำเร็จ",
    description:
      "เกิดปัญหาระหว่างดึงข้อมูลสินค้า กรุณาลองใหม่อีกครั้ง หรือกลับไปเลือกดูสินค้าทั้งหมด",
    retry: "ลองใหม่",
    products: "ดูสินค้าทั้งหมด",
  },
  en: {
    title: "This page could not load",
    description:
      "Something went wrong while loading product data. Try again or browse all products.",
    retry: "Try again",
    products: "View products",
  },
};

export default function StoreError({
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  const params = useParams<{ locale?: string }>();
  const locale = params.locale === "en" ? "en" : "th";
  const t = copy[locale];

  return (
    <main className="min-h-screen bg-background px-4 py-16 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-3xl">
        <ErrorState
          title={t.title}
          description={t.description}
          className="bg-white"
          action={
            <div className="flex flex-col gap-3 sm:flex-row">
              <Button
                type="button"
                className="bg-orange-500 text-white hover:bg-orange-600"
                onClick={reset}
              >
                <RefreshCcw className="h-4 w-4" />
                {t.retry}
              </Button>
              <Button variant="outline" asChild>
                <Link href="/products">{t.products}</Link>
              </Button>
            </div>
          }
        />
      </div>
    </main>
  );
}
