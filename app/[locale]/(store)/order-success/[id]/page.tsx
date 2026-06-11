import { prisma } from "@/lib/prisma";
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
import { useFormatter, useTranslations } from "next-intl";
import { auth } from "@/lib/auth";

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

export default async function OrderSuccessPage({
  params,
}: {
  params: Promise<{ locale: string; id: string }>;
}) {
  const { locale, id } = await params;
  const t = useTranslations("OrderSuccess");
  const format = useFormatter();
  if (!routing.locales.includes(locale as any)) {
    notFound();
  }
  const productOrders = await getOrder(parseInt(id));
  if (!productOrders || productOrders.userId) {
    return notFound(); // ถ้าไม่ใช่เจ้าของ ให้ขึ้น 404 เพื่อความเป็นส่วนตัว
  }
  const localizedItems = productOrders.items.map((item) => ({
    ...item,
    product: localizeProduct(item.product, locale),
  }));
  const getStatusColor = (status: string) => {
    switch (status) {
      case "pending":
        return "bg-yellow-100 text-yellow-800";
      case "paid":
        return "bg-blue-100 text-blue-800";
      case "shipped":
        return "bg-purple-100 text-purple-800";
      case "delivered":
        return "bg-green-100 text-green-800";
      case "cancelled":
        return "bg-red-100 text-red-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        {/* Success Header */}
        <div className="text-center mb-8">
          <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <CheckCircle className="w-10 h-10 text-green-600" />
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
                    {productOrders.user?.[
                      `name_${locale}` as keyof typeof productOrders.user
                    ] || ""}
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
                <CardTitle>ขั้นตอนถัดไป</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-3">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                      <CreditCard className="w-4 h-4 text-blue-600" />
                    </div>
                    <div>
                      <p className="font-medium">ชำระเงิน</p>
                      <p className="text-sm text-gray-600">
                        ชำระเงินตามวิธีที่เลือก
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 bg-purple-100 rounded-full flex items-center justify-center">
                      <Package className="w-4 h-4 text-purple-600" />
                    </div>
                    <div>
                      <p className="font-medium">จัดเตรียมสินค้า</p>
                      <p className="text-sm text-gray-600">
                        เราจะจัดเตรียมสินค้าของคุณ
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center">
                      <Truck className="w-4 h-4 text-green-600" />
                    </div>
                    <div>
                      <p className="font-medium">จัดส่งสินค้า</p>
                      <p className="text-sm text-gray-600">
                        สินค้าจะถูกจัดส่งใน 2-3 วันทำการ
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
                    ซื้อสินค้าเพิ่ม
                  </Link>
                </Button>
                <Button variant="outline" asChild className="w-full">
                  <Link href="/orders">ดูประวัติคำสั่งซื้อ</Link>
                </Button>
                <div className="text-center">
                  <Button variant="ghost" asChild>
                    <Link href="/">กลับหน้าแรก</Link>
                  </Button>
                </div>
              </CardContent>
            </Card>

            {/* Contact */}
            <Card>
              <CardHeader>
                <CardTitle>ต้องการความช่วยเหลือ?</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-gray-600 mb-4">
                  หากมีคำถามเกี่ยวกับคำสั่งซื้อของคุณ ติดต่อเราได้ที่:
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
