import type { Metadata } from "next";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import JsonLd from "@/components/JsonLd";
import { absoluteUrl, buildSeoMetadata, siteConfig } from "@/lib/seo";

export const metadata: Metadata = buildSeoMetadata({
  locale: "th",
  path: "/",
  title: "NextStore | สินค้าไอที แกดเจ็ต และอุปกรณ์เสริม",
  description:
    "ช้อปสินค้าเทคโนโลยีคุณภาพ ราคาเข้าถึงง่าย พร้อมจัดส่งรวดเร็วและบริการหลังการขายจาก NextStore",
});

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const organizationJsonLd = {
    "@context": "https://schema.org",
    "@type": "OnlineStore",
    name: siteConfig.name,
    url: absoluteUrl("/th"),
    logo: absoluteUrl(siteConfig.logoPath),
    contactPoint: {
      "@type": "ContactPoint",
      telephone: "+66-2-123-4567",
      contactType: "customer support",
      areaServed: "TH",
      availableLanguage: ["th", "en"],
    },
    sameAs: [],
  };

  return (
    <div>
      <JsonLd data={organizationJsonLd} />
      <Navbar />
      {children}
      <Footer />
    </div>
  );
}
