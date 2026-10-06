"use client";

import { useLocale, useTranslations } from "next-intl";
import { useRouter, usePathname, locales } from "@/i18n/routing";
import { useSearchParams } from "next/navigation";
import { useState, useTransition } from "react";
import * as Dialog from "@radix-ui/react-dialog";
import { ArrowRight, ChevronDown, LoaderCircle, X } from "lucide-react";

function Flag({locale}: {locale: string}) {
  return <span aria-hidden="true" className="relative block size-6 shrink-0 overflow-hidden rounded-full ring-1 ring-black/10" style={{background:locale === "th" ? "linear-gradient(#a51931 0% 16.7%, #fff 16.7% 33.3%, #2d2a4a 33.3% 66.7%, #fff 66.7% 83.3%, #a51931 83.3%)" : "repeating-linear-gradient(#b22234 0px 2px, #fff 2px 4px)"}}>{locale === "en" && <span className="absolute left-0 top-0 h-3 w-3 bg-[#3c3b6e] text-center text-[8px] leading-3 text-white">✦</span>}</span>;
}

export default function LanguageSwitcher({compact = false}: {compact?: boolean}) {
  const t = useTranslations("LanguageSwitcher");
  const locale = useLocale();
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const [open,setOpen] = useState(false);
  const [isPending,startTransition] = useTransition();
  function changeLocale(nextLocale: string) {
    if (nextLocale === locale) return;
    startTransition(() => {
      // Keep repeated filters, the current product path, and the section anchor.
      const query = searchParams.toString();
      router.replace(`${pathname}${query ? `?${query}` : ""}${window.location.hash}`, {locale:nextLocale,scroll:false});
    });
  }
  return <Dialog.Root open={open} onOpenChange={setOpen}>
    <Dialog.Trigger asChild><button type="button" aria-label={t("label")} className={compact ? "flex size-9 items-center justify-center rounded-full transition-opacity hover:opacity-70 focus-visible:outline-2 focus-visible:outline-offset-4" : "flex items-center gap-3 rounded-full border border-neutral-200 px-4 py-2 text-sm"}><Flag locale={locale} />{!compact && <><span>{t("locale",{locale})}</span><ChevronDown className="size-4" /></>}</button></Dialog.Trigger>
    <Dialog.Portal><Dialog.Overlay className="store-locale-overlay fixed inset-0 z-[70] bg-black/45" /><Dialog.Content aria-busy={isPending} className="store-locale-dialog fixed left-1/2 top-1/2 z-[71] w-[calc(100%-32px)] max-w-[496px] -translate-x-1/2 -translate-y-1/2 rounded-[22px] bg-white p-6 text-neutral-950 shadow-xl focus:outline-none">
      <Flag locale={locale} />
      <Dialog.Title className="mt-6 pr-8 text-xl font-medium">{t("title")}</Dialog.Title>
      <Dialog.Description className="mt-3 text-sm leading-6 text-neutral-500">{t("description")}</Dialog.Description>
      <ul className="my-6 space-y-2 text-sm">{["shipping","currency","keepPage"].map(key => <li key={key} className="flex items-start gap-2"><ArrowRight className="mt-0.5 size-4 shrink-0" />{t(key)}</li>)}</ul>
      <label htmlFor={`store-language-${compact ? "desktop" : "mobile"}`} className="sr-only">{t("label")}</label>
      <div className="relative"><select id={`store-language-${compact ? "desktop" : "mobile"}`} value={locale} onChange={event => changeLocale(event.target.value)} disabled={isPending} className="h-12 w-full appearance-none rounded-full border border-neutral-200 bg-white pl-5 pr-12 text-sm outline-none focus-visible:ring-2 focus-visible:ring-neutral-700 disabled:opacity-50">{locales.map(value => <option key={value} value={value}>{value === "th" ? "ไทย — ภาษาไทย (THB)" : "English (THB)"}</option>)}</select>{isPending ? <LoaderCircle className="pointer-events-none absolute right-5 top-4 size-4 motion-safe:animate-spin" /> : <ChevronDown className="pointer-events-none absolute right-5 top-4 size-4" />}</div>
      <Dialog.Close aria-label={t("close")} className="absolute right-5 top-5 flex size-8 items-center justify-center rounded-full hover:bg-neutral-100 focus-visible:outline-2"><X className="size-6 stroke-[1.5]" /></Dialog.Close>
    </Dialog.Content></Dialog.Portal>
  </Dialog.Root>;
}
