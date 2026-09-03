import type { Metadata } from "next";

export const siteConfig = {
  name: "NextStore",
  baseUrl: process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000",
  logoPath: "/images/logo.png",
  localeNames: {
    th: "th_TH",
    en: "en_US",
  },
};

type Locale = keyof typeof siteConfig.localeNames;

export function absoluteUrl(path: string) {
  return new URL(path, siteConfig.baseUrl).toString();
}

export function localizePath(locale: string, path: string) {
  const normalizedLocale = locale === "en" ? "en" : "th";
  return `/${normalizedLocale}${path}`;
}

export function jsonLd(data: unknown) {
  return JSON.stringify(data).replace(/</g, "\\u003c");
}

export function buildSeoMetadata({
  locale,
  path,
  title,
  description,
  image,
  noIndex = false,
  type = "website",
}: {
  locale: string;
  path: string;
  title: string;
  description: string;
  image?: string | null;
  noIndex?: boolean;
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
        "x-default": absoluteUrl(`/th${path}`),
      },
    },
    robots: noIndex
      ? {
          index: false,
          follow: false,
          googleBot: {
            index: false,
            follow: false,
          },
        }
      : {
          index: true,
          follow: true,
          googleBot: {
            index: true,
            follow: true,
            "max-image-preview": "large",
            "max-snippet": -1,
            "max-video-preview": -1,
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
