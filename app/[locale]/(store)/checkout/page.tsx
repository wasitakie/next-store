import { getCart, createOrder, clearCart } from "@/lib/cart";
import { createStripeCheckoutSession } from "@/lib/stripe";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { Truck, CreditCard, MapPin, User, ShieldCheck } from "lucide-react";
import Link from "next/link";
import Image from "next/image";
import { redirect } from "next/navigation";
import { auth } from "@/lib/auth";
import { getTranslations } from "next-intl/server";
import { buildSeoMetadata } from "@/lib/seo";
import type { Metadata } from "next";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const isEnglish = locale === "en";

  return buildSeoMetadata({
    locale,
    path: "/checkout",
    title: isEnglish ? "Checkout | NextStore" : "ชำระเงิน | NextStore",
    description: isEnglish
      ? "Review your cart, choose payment, and complete your NextStore order securely."
      : "ตรวจสอบตะกร้า เลือกวิธีชำระเงิน และสั่งซื้อกับ NextStore อย่างปลอดภัย",
  });
}

async function createOrderAction(formData: FormData) {
  "use server";

  const session = await auth();
  const userId = session?.user?.id ? Number(session.user.id) : null;

  if (!userId) {
    redirect("/login");
  }

  const cart = await getCart();
  const paymentMethod = formData.get("paymentMethod")?.toString() || "stripe";

  if (cart.items.length === 0) {
    throw new Error("Cart is empty");
  }

  const order = await createOrder(userId, cart, {
    clearCartAfterCreate: paymentMethod !== "stripe",
  });

  if (paymentMethod === "stripe") {
    const locale = formData.get("locale")?.toString() || "th";
    const stripeSession = await createStripeCheckoutSession({
      cart,
      locale,
      orderId: order.id,
      userId,
      customerEmail: session?.user?.email,
    });

    await clearCart();
    redirect(stripeSession.url);
  }

  redirect(`/order-success/${order.id}`);
}

export default async function CheckoutPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  const t = await getTranslations("CheckoutPage");
  const session = await auth();
  const cart = await getCart();

  if (cart.items.length === 0) {
    redirect("/cart");
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="max-w-6xl mx-auto px-4 py-8 sm:px-6 lg:px-8">
        <div className="mb-8">
          <h1 className="mb-2 text-3xl font-bold text-gray-900">
            {t("title")}
          </h1>
          <p className="text-gray-600">{t("description")}</p>
        </div>

        <div className="grid grid-cols-1 gap-8 lg:grid-cols-3">
          <div className="space-y-6 lg:col-span-2">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <User className="h-5 w-5" />
                  {t("customerInfo")}
                </CardTitle>
                <CardDescription>{t("customerInfoDesc")}</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                  <div className="space-y-2">
                    <Label htmlFor="firstName">{t("firstName")}</Label>
                    <Input id="firstName" name="firstName" required />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="lastName">{t("lastName")}</Label>
                    <Input id="lastName" name="lastName" required />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="email">{t("email")}</Label>
                  <Input
                    id="email"
                    name="email"
                    type="email"
                    placeholder="example@email.com"
                    defaultValue={session?.user?.email || ""}
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="phone">{t("phone")}</Label>
                  <Input
                    id="phone"
                    name="phone"
                    type="tel"
                    placeholder="08xxxxxxxx"
                    required
                  />
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <MapPin className="h-5 w-5" />
                  {t("shippingAddress")}
                </CardTitle>
                <CardDescription>{t("shippingAddressDesc")}</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="address">{t("address")}</Label>
                  <Input
                    id="address"
                    name="address"
                    placeholder={t("addressPlaceholder")}
                    required
                  />
                </div>
                <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                  <div className="space-y-2">
                    <Label htmlFor="city">{t("city")}</Label>
                    <Input
                      id="city"
                      name="city"
                      placeholder={t("cityPlaceholder")}
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="postalCode">{t("postalCode")}</Label>
                    <Input
                      id="postalCode"
                      name="postalCode"
                      placeholder={t("postalCodePlaceholder")}
                      required
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="notes">{t("notes")}</Label>
                  <Input
                    id="notes"
                    name="notes"
                    placeholder={t("notesPlaceholder")}
                  />
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <CreditCard className="h-5 w-5" />
                  {t("paymentMethod")}
                </CardTitle>
                <CardDescription>{t("paymentMethodDesc")}</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <label className="flex cursor-pointer items-start gap-3 rounded-lg border border-primary/30 bg-primary/5 p-4 hover:bg-primary/10">
                    <input
                      type="radio"
                      name="paymentMethod"
                      value="stripe"
                      className="mt-1 text-primary"
                      defaultChecked
                    />
                    <div className="flex-1 space-y-1">
                      <div className="flex flex-wrap items-center gap-2">
                        <p className="font-medium">{t("stripeCard")}</p>
                        <Badge className="bg-green-100 text-green-800 hover:bg-green-100">
                          <ShieldCheck className="mr-1 h-3 w-3" />
                          {t("securePayment")}
                        </Badge>
                      </div>
                      <p className="text-sm text-gray-600">
                        {t("stripeCardDesc")}
                      </p>
                    </div>
                  </label>
                  <label className="flex cursor-pointer items-center gap-3 rounded-lg border border-border p-4 hover:bg-accent">
                    <input
                      type="radio"
                      name="paymentMethod"
                      value="cod"
                      className="text-primary"
                    />
                    <div className="flex-1">
                      <p className="font-medium">{t("cod")}</p>
                      <p className="text-sm text-gray-600">{t("codDesc")}</p>
                    </div>
                  </label>
                  <label className="flex cursor-pointer items-center gap-3 rounded-lg border border-border p-4 hover:bg-accent">
                    <input
                      type="radio"
                      name="paymentMethod"
                      value="transfer"
                      className="text-primary"
                    />
                    <div className="flex-1">
                      <p className="font-medium">{t("bankTransfer")}</p>
                      <p className="text-sm text-gray-600">
                        {t("bankTransferDesc")}
                      </p>
                    </div>
                  </label>
                </div>
              </CardContent>
            </Card>
          </div>

          <div className="lg:col-span-1">
            <Card className="sticky top-8">
              <CardHeader>
                <CardTitle>{t("orderSummary")}</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-3">
                  {cart.items.map((item) => (
                    <div key={item.id} className="flex gap-3">
                      <div className="flex h-16 w-16 shrink-0 items-center justify-center overflow-hidden rounded-lg bg-gray-100">
                        {item.image ? (
                          <Image
                            src={item.image}
                            alt={item.name}
                            width={64}
                            height={64}
                            className="h-full w-full object-cover"
                          />
                        ) : (
                          <CreditCard className="h-8 w-8 text-gray-400" />
                        )}
                      </div>
                      <div className="flex-1">
                        <h4 className="line-clamp-1 text-sm font-medium">
                          {item.name}
                        </h4>
                        <p className="text-sm text-gray-600">
                          {t("quantity", { count: item.quantity })}
                        </p>
                        <p className="text-sm font-semibold">
                          ฿{(item.price * item.quantity).toLocaleString()}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>

                <Separator />

                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span>{t("priceTitle")}</span>
                    <span>฿{cart.total.toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span>{t("shippingTitle")}</span>
                    <span>฿0</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span>{t("discountTitle")}</span>
                    <span className="text-green-600">-฿0</span>
                  </div>
                  <Separator />
                  <div className="flex justify-between text-lg font-semibold">
                    <span>{t("totalTitle")}</span>
                    <span className="text-primary">
                      ฿{cart.total.toLocaleString()}
                    </span>
                  </div>
                </div>

                <div className="space-y-2">
                  <div className="flex items-center gap-2 text-sm text-gray-600">
                    <Truck className="h-4 w-4" />
                    <span>{t("freeShippingGuarantee")}</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm text-gray-600">
                    <ShieldCheck className="h-4 w-4" />
                    <span>{t("warrantyGuarantee")}</span>
                  </div>
                </div>
              </CardContent>
              <CardFooter className="flex-col gap-3">
                {session?.user ? (
                  <form action={createOrderAction} className="w-full">
                    <input type="hidden" name="locale" value={locale} />
                    <Button type="submit" className="w-full" size="lg">
                      {t("confirmOrder")}
                    </Button>
                  </form>
                ) : (
                  <Button size="lg" className="w-full" asChild>
                    <Link href="/login">{t("confirmOrder")}</Link>
                  </Button>
                )}
                <Button variant="ghost" asChild>
                  <Link href="/cart">{t("backToCart")}</Link>
                </Button>
              </CardFooter>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
