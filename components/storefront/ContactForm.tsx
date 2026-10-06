"use client";
import { useState, type FormEvent } from "react";
import { useTranslations } from "next-intl";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

export default function ContactForm({email}: {email: string}) {
  const t = useTranslations("ContactPage");
  const e = useTranslations("EcomPages");
  const [draft,setDraft] = useState("");
  function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const data = new FormData(event.currentTarget);
    const body = `${t("name")}: ${data.get("name")}\n${t("email")}: ${data.get("email")}\n${e("phone")}: ${data.get("phone")}\n\n${data.get("message")}`;
    setDraft(`mailto:${email}?subject=${encodeURIComponent(e("inquiry"))}&body=${encodeURIComponent(body)}`);
  }
  return <form onSubmit={submit} onChange={() => setDraft("")} className="grid content-start gap-6">
    {([['name','text',t('name'),'name'],['email','email',t('email'),'email'],['phone','tel',e('phone'),'tel']] as const).map(([name,type,label,autoComplete]) => <label key={name} className="grid gap-2 text-sm"><span>{label}</span><Input name={name} type={type} autoComplete={autoComplete} required={name !== 'phone'} maxLength={160} placeholder={label} className="h-14 rounded-full border-neutral-300 bg-white px-6" /></label>)}
    <label className="grid gap-2 text-sm">{t("message")}<textarea name="message" required maxLength={3000} rows={6} placeholder={t("messagePlaceholder")} className="w-full rounded-3xl border border-neutral-300 p-6 outline-none focus-visible:ring-2 focus-visible:ring-neutral-500" /></label>
    <Button type="submit" className="h-14 w-full rounded-full bg-neutral-950 text-white hover:bg-neutral-800">{e("prepareEmail")}</Button>
    <p className="text-sm leading-6 text-neutral-500">{e("emailNote")}</p>
    {draft && <div role="status" className="rounded-2xl bg-neutral-100 p-5"><p className="mb-3 text-sm">{e("draftReady")}</p><a href={draft} className="font-medium underline underline-offset-4">{e("openEmail")}</a></div>}
  </form>;
}
