"use client";
import { useActionState } from "react";
import { useFormStatus } from "react-dom";
import { useTranslations } from "next-intl";
import { Button } from "@/components/ui/button";
import { submitCheckout } from "@/lib/actions/checkout";

export default function CheckoutForm({ children }: { children: React.ReactNode }) {
  const [state, action] = useActionState(submitCheckout, { error: "" });
  const t = useTranslations("CheckoutPage");
  return <form id="checkout" action={action}>
    {state.error && <p role="alert" className="mb-6 rounded-md border border-red-200 bg-red-50 p-4 text-red-700">{t(state.error)}</p>}
    {children}
  </form>;
}
export function CheckoutSubmit() {
  const { pending } = useFormStatus();
  const t = useTranslations("CheckoutPage");
  return <Button type="submit" disabled={pending} className="w-full" size="lg">{t(pending ? "processing" : "confirmOrder")}</Button>;
}
