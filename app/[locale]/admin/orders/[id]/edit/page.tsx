import { requireAdmin } from "@/lib/session";
import { prisma } from "@/lib/prisma";
import { Button } from "@/components/ui/button";
import { updateOrderStatus } from "@/lib/actions/order";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { notFound } from "next/navigation";
import { localizeProduct } from "@/lib/utils";

export default async function EditOrderPage({
  params,
}: {
  params: Promise<{ locale: string; id: string }>;
}) {
  const { locale } = await params;

  await requireAdmin();

  const id = parseInt((await params).id, 10);
  if (isNaN(id)) return notFound();

  const order = await prisma.order.findUnique({
    where: { id },
    include: { user: true, items: { include: { product: true } } },
  });

  if (!order) return notFound();

  const localizedItems = order.items.map((item) => ({
    ...item,
    product: localizeProduct(item.product, locale),
  }));

  const localizedOrder = {
    ...order,
    items: localizedItems,
  };

  const updateOrderStatusWithId = updateOrderStatus.bind(null, order.id);

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      <div className="flex items-center gap-4">
        <Button asChild variant="outline" size="icon" className="h-8 w-8">
          <Link href="/admin/orders">
            <ArrowLeft className="h-4 w-4" />
          </Link>
        </Button>
        <div>
          <h2 className="text-2xl font-bold tracking-tight">
            Edit Order #{order.id}
          </h2>
        </div>
      </div>

      <div className="bg-white shadow-sm border rounded-lg p-6 space-y-6">
        <div className="grid grid-cols-2 gap-4">
          <div>
            <h3 className="text-sm font-medium text-muted-foreground">
              Customer
            </h3>
            <p className="font-medium mt-1">{order.user.name || "Unknown"}</p>
            <p className="text-sm text-gray-500">{order.user.email}</p>
          </div>
          <div>
            <h3 className="text-sm font-medium text-muted-foreground">Total</h3>
            <p className="font-bold text-xl mt-1 text-indigo-600">
              ฿{order.total.toLocaleString()}
            </p>
          </div>
        </div>

        <div>
          <h3 className="text-sm font-medium text-muted-foreground mb-2">
            Order Items
          </h3>
          <div className="space-y-2">
            {localizedOrder.items.length === 0 ? (
              <p className="text-sm text-gray-500 italic">
                No items in this order.
              </p>
            ) : (
              localizedOrder.items.map((item) => (
                <div
                  key={item.id}
                  className="flex justify-between items-center bg-gray-50 p-2 rounded text-sm"
                >
                  <div className="flex items-center gap-2">
                    <span className="font-medium">{item.product.name}</span>
                    <span className="text-gray-500">x{item.quantity}</span>
                  </div>
                  <span>฿{item.price.toLocaleString()}</span>
                </div>
              ))
            )}
          </div>
        </div>

        <form
          action={updateOrderStatusWithId}
          className="pt-4 border-t space-y-4"
        >
          <div>
            <label htmlFor="status" className="block text-sm font-medium mb-1">
              Update Status
            </label>
            <select
              id="status"
              name="status"
              defaultValue={order.status}
              className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
            >
              <option value="pending">Pending</option>
              <option value="paid">Paid</option>
              <option value="shipped">Shipped</option>
              <option value="delivered">Delivered</option>
              <option value="cancelled">Cancelled</option>
            </select>
          </div>

          <div className="flex justify-end gap-4">
            <Button type="button" variant="outline" asChild>
              <Link href="/admin/orders">Cancel</Link>
            </Button>
            <Button type="submit">Save Status</Button>
          </div>
        </form>
      </div>
    </div>
  );
}
