"use client";

import { useLocale } from "next-intl";
import { useRouter, usePathname } from "@/i18n/routing";
import { useParams } from "next/navigation";
import { useTransition } from "react";
import { Label } from "./ui/label";
import { useTranslations } from "next-intl";
import { locales } from "@/i18n/routing";

export default function LanguageSwitcher() {
  const t = useTranslations("LanguageSwitcher");
  const locale = useLocale();
  return (
    <LocaleSwitcherSelect defaultValue={locale} label={t("label")}>
      {locales.map((curLocale) => (
        <option key={curLocale} value={curLocale}>
          {t("locale", { locale: curLocale })}
        </option>
      ))}
    </LocaleSwitcherSelect>
  );
}

type LanguageSwitcherProps = {
  defaultValue?: string;
  children: React.ReactNode;
  label: string;
};

function LocaleSwitcherSelect({
  children,
  label,
  defaultValue,
}: LanguageSwitcherProps) {
  const router = useRouter();
  const pathname = usePathname();
  const params = useParams();
  const [isPending, startTransition] = useTransition();

  function onSelectChange(event: React.ChangeEvent<HTMLSelectElement>) {
    const nextLocale = event.target.value;
    startTransition(() => {
      router.replace(
        // @ts-expect-error -- bypass dynamic params typing
        { pathname, params },
        { locale: nextLocale },
      );
    });
  }
  return (
    <Label className="text-sm font-medium">
      <span className="sr-only">{label}</span>
      <select
        defaultValue={defaultValue}
        onChange={onSelectChange}
        className="w-full"
        disabled={isPending}
      >
        {children}
      </select>
    </Label>
  );
}
