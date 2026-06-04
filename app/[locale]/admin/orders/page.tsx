import { Link } from "@/i18n/routing";
import { prisma } from "@/lib/prisma";
import { requireAdmin } from "@/lib/session";
import { Button } from "@/components/ui/button";
import { Plus, Edit, Trash2, ShoppingCart } from "lucide-react";
import { deleteOrder } from "@/lib/actions/order";
import { getTranslations } from "next-intl/server";

const statusColors: Record<string, string> = {
  pending: "bg-yellow-100 text-yellow-800",
  paid: "bg-blue-100 text-blue-800",
  shipped: "bg-indigo-100 text-indigo-800",
  delivered: "bg-green-100 text-green-800",
  cancelled: "bg-red-100 text-red-800",
};

export default async function AdminOrdersPage() {
  await requireAdmin();
  const t = await getTranslations("Admin");

  const orders = await prisma.order.findMany({
    orderBy: { createdAt: "desc" },
    include: {
      user: true,
      _count: {
        select: { items: true },
      },
    },
  });

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">{t("orders")}</h2>
          <p className="text-muted-foreground mt-1">Manage customer orders.</p>
        </div>
        <Button asChild>
          <Link href="/admin/orders/new">
            <Plus className="mr-2 h-4 w-4" /> Add Order
          </Link>
        </Button>
      </div>

      <div className="bg-white rounded-md border shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm text-left">
            <thead className="text-xs text-gray-500 uppercase bg-gray-50 border-b">
              <tr>
                <th scope="col" className="px-6 py-4 font-medium">
                  {t("orderId")}
                </th>
                <th scope="col" className="px-6 py-4 font-medium">
                  {t("customer")}
                </th>
                <th scope="col" className="px-6 py-4 font-medium text-center">
                  {t("status")}
                </th>
                <th scope="col" className="px-6 py-4 font-medium text-right">
                  {t("items")}
                </th>
                <th scope="col" className="px-6 py-4 font-medium text-right">
                  {t("total")}
                </th>
                <th scope="col" className="px-6 py-4 font-medium text-right">
                  {t("actions")}
                </th>
              </tr>
            </thead>
            <tbody>
              {orders.length === 0 ? (
                <tr>
                  <td
                    colSpan={6}
                    className="px-6 py-8 text-center text-muted-foreground"
                  >
                    <div className="flex flex-col items-center justify-center">
                      <ShoppingCart className="h-10 w-10 text-gray-300 mb-2" />
                      <p>No orders found.</p>
                    </div>
                  </td>
                </tr>
              ) : (
                orders.map((order) => (
                  <tr
                    key={order.id}
                    className="bg-white border-b hover:bg-gray-50/50 transition-colors"
                  >
                    <td className="px-6 py-4 font-medium text-gray-900">
                      #{order.id}
                    </td>
                    <td className="px-6 py-4 text-gray-500">
                      <div className="font-medium text-gray-900">
                        {order.user.name || "Unknown"}
                      </div>
                      <div className="text-xs">{order.user.email}</div>
                    </td>
                    <td className="px-6 py-4 text-center">
                      <span
                        className={`px-2.5 py-1 rounded-full text-xs font-medium uppercase ${statusColors[order.status] || "bg-gray-100 text-gray-800"}`}
                      >
                        {order.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-right text-gray-500">
                      {order._count.items}
                    </td>
                    <td className="px-6 py-4 text-right font-medium text-gray-900">
                      ฿
                      {order.total.toLocaleString(undefined, {
                        minimumFractionDigits: 2,
                      })}
                    </td>
                    <td className="px-6 py-4 text-right space-x-2">
                      <div className="flex items-center justify-end gap-2">
                        <Button
                          asChild
                          variant="ghost"
                          size="icon"
                          className="h-8 w-8 text-blue-600 hover:text-blue-700 hover:bg-blue-50"
                        >
                          <Link href={`/admin/orders/${order.id}/edit`}>
                            <Edit className="h-4 w-4" />
                            <span className="sr-only">Edit</span>
                          </Link>
                        </Button>
                        <form action={deleteOrder.bind(null, order.id)}>
                          <Button
                            type="submit"
                            variant="ghost"
                            size="icon"
                            className="h-8 w-8 text-red-600 hover:text-red-700 hover:bg-red-50"
                            onClick={(e) => {
                              if (
                                !confirm(
                                  "Are you sure you want to delete this order?",
                                )
                              )
                                e.preventDefault();
                            }}
                          >
                            <Trash2 className="h-4 w-4" />
                            <span className="sr-only">Delete</span>
                          </Button>
                        </form>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
