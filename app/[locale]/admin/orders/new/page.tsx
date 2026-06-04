import { requireAdmin } from "@/lib/session";
import { prisma } from "@/lib/prisma";
import { Button } from "@/components/ui/button";
import { createOrder } from "@/lib/actions/order";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";

export default async function NewOrderPage() {
  await requireAdmin();

  const users = await prisma.user.findMany({
    select: { id: true, name: true, email: true },
    orderBy: { createdAt: "desc" },
  });

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
            Create Manual Order
          </h2>
        </div>
      </div>

      <form
        action={createOrder}
        className="bg-white shadow-sm border rounded-lg p-6 space-y-6"
      >
        <div className="space-y-4">
          <div>
            <label htmlFor="userId" className="block text-sm font-medium mb-1">
              Customer *
            </label>
            <select
              id="userId"
              name="userId"
              required
              className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
            >
              <option value="">Select a customer...</option>
              {users.map((user) => (
                <option key={user.id} value={user.id}>
                  {user.name || "No Name"} ({user.email})
                </option>
              ))}
            </select>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label htmlFor="total" className="block text-sm font-medium mb-1">
                Total Amount (฿) *
              </label>
              <input
                type="number"
                id="total"
                name="total"
                step="0.01"
                required
                className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
              />
            </div>
            <div>
              <label
                htmlFor="status"
                className="block text-sm font-medium mb-1"
              >
                Status *
              </label>
              <select
                id="status"
                name="status"
                required
                defaultValue="pending"
                className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
              >
                <option value="pending">Pending</option>
                <option value="paid">Paid</option>
                <option value="shipped">Shipped</option>
                <option value="delivered">Delivered</option>
                <option value="cancelled">Cancelled</option>
              </select>
            </div>
          </div>
        </div>

        <div className="flex justify-end gap-4 pt-4 border-t">
          <Button type="button" variant="outline" asChild>
            <Link href="/admin/orders">Cancel</Link>
          </Button>
          <Button type="submit">Create Order</Button>
        </div>
      </form>
    </div>
  );
}
