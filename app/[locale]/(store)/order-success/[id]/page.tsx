import { prisma } from "@/lib/prisma";
import { markOrderPaid } from "@/lib/cart";
import { retrieveStripeCheckoutSession } from "@/lib/stripe";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import {
  CheckCircle,
  Package,
  Truck,
  CreditCard,
  ArrowRight,
} from "lucide-react";
import Link from "next/link";
import Image from "next/image";
import { notFound } from "next/navigation";
import { localizeProduct } from "@/lib/utils";
import { routing } from "@/i18n/routing";
import { getFormatter, getTranslations } from "next-intl/server";
import { auth } from "@/lib/auth";
import { buildSeoMetadata } from "@/lib/seo";
import type { Metadata } from "next";

async function getOrder(id: number) {
  const order = await prisma.order.findUnique({
    where: { id },
    include: {
      items: {
        include: {
          product: true,
        },
      },
      user: {
        select: {
          id: true,
          name: true,
          email: true,
        },
      },
    },
  });

  if (!order) {
    notFound();
  }

  return order;
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string; id: string }>;
}): Promise<Metadata> {
  const { locale, id } = await params;
  const isEnglish = locale === "en";

  return buildSeoMetadata({
    locale,
    path: `/order-success/${id}`,
    title: isEnglish
      ? `Order #${id} | NextStore`
      : `คำสั่งซื้อ #${id} | NextStore`,
    description: isEnglish
      ? "View your NextStore order confirmation and payment status."
      : "ดูการยืนยันคำสั่งซื้อและสถานะการชำระเงินจาก NextStore",
    noIndex: true,
  });
}

export default async function OrderSuccessPage({
  searchParams,
  params,
}: {
  params: Promise<{ locale: string; id: string }>;
  searchParams?: Promise<{ session_id?: string; payment_cancelled?: string }>;
}) {
  const { locale, id } = await params;
  const { session_id: sessionId, payment_cancelled: paymentCancelled } =
    (await searchParams) || {};
  const t = await getTranslations("OrderSuccess");
  const format = await getFormatter();
  if (!routing.locales.includes(locale as (typeof routing.locales)[number])) {
    notFound();
  }
  const session = await auth();
  const userId = session?.user?.id ? Number(session.user.id) : null;
  let productOrders = await getOrder(parseInt(id));

  if (!userId || productOrders.userId !== userId) {
    return notFound(); // ถ้าไม่ใช่เจ้าของ ให้ขึ้น 404 เพื่อความเป็นส่วนตัว
  }

  if (sessionId && productOrders.status === "pending") {
    const stripeSession = await retrieveStripeCheckoutSession(sessionId);
    const stripeOrderId = Number(stripeSession.metadata?.orderId);
    const stripeUserId = Number(stripeSession.metadata?.userId);

    if (
      stripeSession.payment_status === "paid" &&
      stripeOrderId === productOrders.id &&
      stripeUserId === productOrders.userId
    ) {
      await markOrderPaid(productOrders.id);
      productOrders = await getOrder(productOrders.id);
    }
  }

  const localizedItems = productOrders.items.map((item) => ({
    ...item,
    product: localizeProduct(item.product, locale),
  }));
  const getStatusColor = (status: string) => {
    switch (status) {
      case "pending":
        return "bg-amber-50 text-amber-700";
      case "paid":
        return "bg-orange-50 text-orange-700";
      case "shipped":
        return "bg-slate-100 text-slate-700";
      case "delivered":
        return "bg-emerald-50 text-emerald-700";
      case "cancelled":
        return "bg-red-50 text-red-700";
      default:
        return "bg-slate-100 text-slate-700";
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        {/* Success Header */}
        <div className="text-center mb-8">
          <div className="mx-auto mb-4 flex h-20 w-20 items-center justify-center rounded-md border border-emerald-100 bg-emerald-50">
            <CheckCircle className="h-10 w-10 text-emerald-600" />
          </div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            {t("title")}
          </h1>
          <p className="text-gray-600 mb-4">{t("thankYou")}</p>
          <p className="text-sm text-gray-500">
            {t("orderNumber")}: #{productOrders.id.toString().padStart(6, "0")}
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Order Details */}
          <div className="lg:col-span-2 space-y-6">
            {/* Order Status */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Package className="w-5 h-5" />
                  {t("status.title")}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex items-center gap-3">
                  <Badge className={getStatusColor(productOrders.status)}>
                    {t(`status.${productOrders.status}`)}
                  </Badge>
                  {paymentCancelled ? (
                    <Badge variant="outline">{t("paymentCancelled")}</Badge>
                  ) : null}
                  <p className="text-sm text-gray-600">
                    {t("updateAt")}:{" "}
                    {productOrders.updatedAt.toLocaleDateString("th-TH")}
                  </p>
                </div>
              </CardContent>
            </Card>

            {/* Order Items */}
            <Card>
              <CardHeader>
                <CardTitle> {t("products")}</CardTitle>
                <CardDescription>
                  {t("productsCount")} {localizedItems.length} {t("product")}
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                {localizedItems.length === 0 ? (
                  <p className="text-center text-gray-600">{t("noProduct")}</p>
                ) : (
                  localizedItems.map((item) => (
                    <div key={item.id} className="flex gap-4">
                      <div className="w-20 h-20 bg-gray-100 rounded-lg flex items-center justify-center overflow-hidden flex-shrink-0">
                        {item.product.image ? (
                          <Image
                            src={item.product.image}
                            alt={item.product.name || ""}
                            width={80}
                            height={80}
                            className="w-full h-full object-cover"
                          />
                        ) : (
                          <div className="w-10 h-10 text-gray-400">
                            <svg
                              fill="none"
                              stroke="currentColor"
                              viewBox="0 0 24 24"
                              className="w-full h-full"
                            >
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
                              />
                            </svg>
                          </div>
                        )}
                      </div>
                      <div className="flex-1">
                        <h3 className="font-semibold">
                          {format.number(item.price, "currency")}
                          {item.product.name}
                        </h3>
                        <p className="text-sm text-gray-600">
                          {t("quantity")}: {item.quantity}
                        </p>
                        <p className="font-semibold">
                          {t("total")}:{" "}
                          {format.number(
                            item.price * item.quantity,
                            "currency",
                          )}
                        </p>
                      </div>
                    </div>
                  ))
                )}
                <Separator />
                <div className="flex justify-between font-semibold text-lg">
                  <span>{t("total")}</span>
                  <span className="text-primary">{productOrders.total}</span>
                </div>
              </CardContent>
            </Card>

            {/* Shipping Information */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Truck className="w-5 h-5" />
                  {t("shippingInformation")}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  <p className="font-medium">
                    {productOrders.user.name || productOrders.user.email}
                  </p>
                  <p className="text-sm text-gray-600">
                    {productOrders.user.email}
                  </p>
                  <p className="text-sm text-gray-600">
                    {t("orderDate")}:{" "}
                    {productOrders.createdAt.toLocaleDateString("th-TH", {
                      year: "numeric",
                      month: "long",
                      day: "numeric",
                      hour: "2-digit",
                      minute: "2-digit",
                    })}
                  </p>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Sidebar */}
          <div className="lg:col-span-1 space-y-6">
            {/* Next Steps */}
            <Card>
              <CardHeader>
                <CardTitle>{t("nextSteps")}</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-3">
                  <div className="flex items-center gap-3">
                    <div className="flex h-8 w-8 items-center justify-center rounded-md bg-orange-50">
                      <CreditCard className="h-4 w-4 text-orange-600" />
                    </div>
                    <div>
                      <p className="font-medium">{t("payment")}</p>
                      <p className="text-sm text-gray-600">
                        {t("paymentDesc")}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="flex h-8 w-8 items-center justify-center rounded-md bg-slate-100">
                      <Package className="h-4 w-4 text-slate-600" />
                    </div>
                    <div>
                      <p className="font-medium">{t("preparation")}</p>
                      <p className="text-sm text-gray-600">
                        {t("preparationDesc")}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="flex h-8 w-8 items-center justify-center rounded-md bg-emerald-50">
                      <Truck className="h-4 w-4 text-emerald-600" />
                    </div>
                    <div>
                      <p className="font-medium">{t("shippingText")}</p>
                      <p className="text-sm text-gray-600">
                        {t("shippingDesc")}
                      </p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Actions */}
            <Card>
              <CardContent className="p-6 space-y-3">
                <Button asChild className="w-full">
                  <Link href="/products">
                    <ArrowRight className="w-4 h-4 mr-2" />
                    {t("continueShopping")}
                  </Link>
                </Button>
                <Button variant="outline" asChild className="w-full">
                  <Link href="/orders">{t("viewOrderHistory")}</Link>
                </Button>
                <div className="text-center">
                  <Button variant="ghost" asChild>
                    <Link href="/">{t("backToHome")}</Link>
                  </Button>
                </div>
              </CardContent>
            </Card>

            {/* Contact */}
            <Card>
              <CardHeader>
                <CardTitle>{t("helpTitle")}</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-gray-600 mb-4">
                  {t("helpDesc")}
                </p>
                <div className="space-y-2 text-sm">
                  <p>📧 support@nextstore.com</p>
                  <p>📞 02-123-4567</p>
                  <p>💬 Line: @nextstore</p>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
