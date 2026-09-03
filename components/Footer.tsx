import React from "react";
import { Link } from "@/i18n/routing";
import { getTranslations } from "next-intl/server";

export default async function Footer() {
  const t = await getTranslations("Footer");
  return (
    <>
      {/* Footer */}
      <footer className="border-t border-slate-200 bg-white py-12 text-slate-700">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div>
              <h4 className="text-2xl font-bold mb-4 text-slate-950">NextStore</h4>
              <p className="text-slate-500">{t("storeDesc")}</p>
            </div>
            <div>
              <h5 className="font-semibold mb-4">{t("quickLinks")}</h5>
              <ul className="space-y-2 text-slate-500">
                <li>
                  <Link href="/" className="hover:text-orange-600 transition-colors">
                    {t("home")}
                  </Link>
                </li>
                <li>
                  <Link
                    href="/products"
                    className="hover:text-orange-600 transition-colors"
                  >
                    {t("products")}
                  </Link>
                </li>
                <li>
                  <Link
                    href="/about"
                    className="hover:text-orange-600 transition-colors"
                  >
                    {t("about")}
                  </Link>
                </li>
                <li>
                  <Link
                    href="/contact"
                    className="hover:text-orange-600 transition-colors"
                  >
                    {t("contact")}
                  </Link>
                </li>
              </ul>
            </div>
            <div>
              <h5 className="font-semibold mb-4">{t("customerService")}</h5>
              <ul className="space-y-2 text-slate-500">
                <li>
                  <Link
                    href="/shipping"
                    className="hover:text-orange-600 transition-colors"
                  >
                    {t("shipping")}
                  </Link>
                </li>
                <li>
                  <Link
                    href="/returns"
                    className="hover:text-orange-600 transition-colors"
                  >
                    {t("returns")}
                  </Link>
                </li>
                <li>
                  <Link
                    href="/faq"
                    className="hover:text-orange-600 transition-colors"
                  >
                    {t("faq")}
                  </Link>
                </li>
                <li>
                  <Link
                    href="/support"
                    className="hover:text-orange-600 transition-colors"
                  >
                    {t("support")}
                  </Link>
                </li>
              </ul>
            </div>
            <div>
              <h5 className="font-semibold mb-4">{t("contactUs")}</h5>
              <ul className="space-y-2 text-slate-500">
                <li>{t("phone")}</li>
                <li>{t("email")}</li>
                <li>{t("address")}</li>
              </ul>
            </div>
          </div>
          <div className="border-t border-slate-200 mt-8 pt-8 text-center text-slate-500">
            <p>{t("copyright")}</p>
          </div>
        </div>
      </footer>
    </>
  );
}
