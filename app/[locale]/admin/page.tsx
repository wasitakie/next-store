import { requireAdmin } from "@/lib/session";
import { prisma } from "@/lib/prisma";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Package, ShoppingCart, DollarSign, Users } from "lucide-react";
import { Link } from "@/i18n/routing";
import { Button } from "@/components/ui/button";
import { getTranslations } from "next-intl/server";

export default async function AdminDashboardPage() {
  const user = await requireAdmin();
  const t = await getTranslations("Admin");

  // Fetch summary statistics
  const [productCount, orderCount, userCount, orders] = await Promise.all([
    prisma.product.count(),
    prisma.order.count(),
    prisma.user.count(),
    prisma.order.findMany({
      take: 5,
      orderBy: { createdAt: "desc" },
      include: { user: true },
    }),
  ]);

  // Calculate total revenue (only from paid/shipped/delivered orders if we want, but let's sum all for now or check status)
  const allOrders = await prisma.order.findMany({
    where: { status: { not: "cancelled" } },
  });
  const totalRevenue = allOrders.reduce((acc, order) => acc + order.total, 0);

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-3xl font-bold tracking-tight">{t("dashboard")}</h2>
        <p className="text-muted-foreground mt-1">
          Welcome back, {user.name ?? user.email}. Here is your store&apos;s
          overview.
        </p>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">{t("totalRevenue")}</CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              ฿
              {totalRevenue.toLocaleString(undefined, {
                minimumFractionDigits: 2,
              })}
            </div>
            <p className="text-xs text-muted-foreground">
              From all active orders
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">{t("products")}</CardTitle>
            <Package className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{productCount}</div>
            <p className="text-xs text-muted-foreground">Items in stock</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">{t("orders")}</CardTitle>
            <ShoppingCart className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{orderCount}</div>
            <p className="text-xs text-muted-foreground">Total orders placed</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">{t("customer")}</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{userCount}</div>
            <p className="text-xs text-muted-foreground">Registered users</p>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
        <Card className="col-span-4">
          <CardHeader>
            <CardTitle>{t("recentOrders")}</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-8">
              {orders.length === 0 ? (
                <p className="text-sm text-muted-foreground">
                  No recent orders.
                </p>
              ) : (
                orders.map((order) => (
                  <div key={order.id} className="flex items-center">
                    <div className="ml-4 space-y-1">
                      <p className="text-sm font-medium leading-none">
                        {order.user.name || order.user.email}
                      </p>
                      <p className="text-sm text-muted-foreground">
                        {order.status.toUpperCase()}
                      </p>
                    </div>
                    <div className="ml-auto font-medium">
                      +฿{order.total.toLocaleString()}
                    </div>
                  </div>
                ))
              )}
            </div>
            <div className="mt-6">
              <Button asChild variant="outline" className="w-full">
                <Link href="/admin/orders">View All Orders</Link>
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
