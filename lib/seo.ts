import type { Metadata } from "next";

export const siteConfig = {
  name: "NextStore",
  baseUrl: process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000",
  localeNames: {
    th: "th_TH",
    en: "en_US",
  },
};

type Locale = keyof typeof siteConfig.localeNames;

function absoluteUrl(path: string) {
  return new URL(path, siteConfig.baseUrl).toString();
}

export function buildSeoMetadata({
  locale,
  path,
  title,
  description,
  image,
  type = "website",
}: {
  locale: string;
  path: string;
  title: string;
  description: string;
  image?: string | null;
  type?: "website" | "article";
}): Metadata {
  const normalizedLocale = (locale === "en" ? "en" : "th") satisfies Locale;
  const canonical = absoluteUrl(`/${normalizedLocale}${path}`);
  const imageUrl = image
    ? image.startsWith("http")
      ? image
      : absoluteUrl(image)
    : absoluteUrl("/globe.svg");

  return {
    title,
    description,
    alternates: {
      canonical,
      languages: {
        th: absoluteUrl(`/th${path}`),
        en: absoluteUrl(`/en${path}`),
      },
    },
    openGraph: {
      title,
      description,
      url: canonical,
      siteName: siteConfig.name,
      locale: siteConfig.localeNames[normalizedLocale],
      type,
      images: [{ url: imageUrl, alt: title }],
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: [imageUrl],
    },
  };
}
