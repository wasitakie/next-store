import React from "react";
import Image from "next/image";
import { Link } from "@/i18n/routing";
import { getTranslations } from "next-intl/server";

export default async function Footer() {
  const t = await getTranslations("Footer");
  return (
    <>
      {/* Footer */}
      <footer className="bg-gray-900 text-white py-12">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div>
              <h4 className="text-2xl font-bold mb-4">NextStore</h4>
              <p className="text-gray-400">{t("storeDesc")}</p>
            </div>
            <div>
              <h5 className="font-semibold mb-4">{t("quickLinks")}</h5>
              <ul className="space-y-2 text-gray-400">
                <li>
                  <Link href="/" className="hover:text-white transition-colors">
                    {t("home")}
                  </Link>
                </li>
                <li>
                  <Link
                    href="/products"
                    className="hover:text-white transition-colors"
                  >
                    {t("products")}
                  </Link>
                </li>
                <li>
                  <Link
                    href="/about"
                    className="hover:text-white transition-colors"
                  >
                    {t("about")}
                  </Link>
                </li>
                <li>
                  <Link
                    href="/contact"
                    className="hover:text-white transition-colors"
                  >
                    {t("contact")}
                  </Link>
                </li>
              </ul>
            </div>
            <div>
              <h5 className="font-semibold mb-4">{t("customerService")}</h5>
              <ul className="space-y-2 text-gray-400">
                <li>
                  <Link
                    href="/shipping"
                    className="hover:text-white transition-colors"
                  >
                    {t("shipping")}
                  </Link>
                </li>
                <li>
                  <Link
                    href="/returns"
                    className="hover:text-white transition-colors"
                  >
                    {t("returns")}
                  </Link>
                </li>
                <li>
                  <Link
                    href="/faq"
                    className="hover:text-white transition-colors"
                  >
                    {t("faq")}
                  </Link>
                </li>
                <li>
                  <Link
                    href="/support"
                    className="hover:text-white transition-colors"
                  >
                    {t("support")}
                  </Link>
                </li>
              </ul>
            </div>
            <div>
              <h5 className="font-semibold mb-4">{t("contactUs")}</h5>
              <ul className="space-y-2 text-gray-400">
                <li>{t("phone")}</li>
                <li>{t("email")}</li>
                <li>{t("address")}</li>
              </ul>
            </div>
          </div>
          <div className="border-t border-gray-800 mt-8 pt-8 text-center text-gray-400">
            <p>{t("copyright")}</p>
          </div>
        </div>
      </footer>
    </>
  );
}
