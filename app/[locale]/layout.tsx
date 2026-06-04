import type { Metadata } from "next";
import { Prompt } from "next/font/google";
import "../globals.css";
import { NextIntlClientProvider } from "next-intl";
import { getMessages } from "next-intl/server";
import { notFound } from "next/navigation";
import { routing } from "@/i18n/routing";

const prompt = Prompt({
  variable: "--font-geist-sans",
  subsets: ["latin", "thai"],
  weight: ["100", "200", "300", "400", "500", "600", "700"],
});

export const metadata: Metadata = {
  title: "Next-store",
  description: "Next-store is a e-commerce platform for selling products",
};

export default async function RootLayout({
  children,
  params,
}: Readonly<{
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
}>) {
  const { locale } = await params;

  if (!routing.locales.includes(locale as (typeof routing.locales)[number])) {
    notFound();
  }

  const messages = await getMessages();

  return (
    <html lang={locale}>
      <body className={`${prompt.className}`}>
        <NextIntlClientProvider messages={messages}>
          {children}
        </NextIntlClientProvider>
      </body>
    </html>
  );
}
