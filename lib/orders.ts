import { prisma } from "@/lib/prisma";
import { z } from "zod";

export const checkoutSchema = z.object({
  checkoutKey: z.string().uuid(),
  firstName: z.string().trim().min(1).max(100),
  lastName: z.string().trim().min(1).max(100),
  email: z.email().max(254),
  phone: z.string().trim().regex(/^[+\d\s()-]{8,25}$/),
  address: z.string().trim().min(5).max(500),
  city: z.string().trim().min(1).max(100),
  postalCode: z.string().regex(/^\d{5}$/),
  notes: z.string().trim().max(1000).default(""),
  paymentMethod: z.enum(["stripe", "cod", "transfer"]),
  locale: z.enum(["th", "en"]),
});
export type CheckoutInput = z.infer<typeof checkoutSchema>;
export const cartItemsSchema = z.array(z.object({
  id: z.number().int().positive(),
  quantity: z.number().int().min(1).max(999),
})).max(50);

export async function reserveOrder(userId: number, items: unknown, input: CheckoutInput) {
  const parsed = checkoutSchema.parse(input);
  const lines = cartItemsSchema.min(1).parse(items);
  if (new Set(lines.map(i => i.id)).size !== lines.length) throw new Error("INVALID_CART");
  const { checkoutKey, paymentMethod, ...details } = parsed;
  const shipping = { firstName: details.firstName, lastName: details.lastName, email: details.email, phone: details.phone, address: details.address, city: details.city, postalCode: details.postalCode, notes: details.notes };
  const existing = await prisma.order.findUnique({ where: { checkoutKey }, include: { items: true } });
  if (existing) {
    if (existing.userId !== userId || existing.status === "cancelled") throw new Error("INVALID_ORDER");
    return existing;
  }
  try {
    return await prisma.$transaction(async tx => {
      const snapshots: { productId: number; quantity: number; price: number }[] = [];
      // Stable lock order avoids deadlocks for carts containing the same products.
      for (const item of [...lines].sort((a, b) => a.id - b.id)) {
        const reserved = await tx.product.updateMany({
          where: { id: item.id, stock: { gte: item.quantity } },
          data: { stock: { decrement: item.quantity } },
        });
        if (reserved.count !== 1) throw new Error("INSUFFICIENT_STOCK");
        const product = await tx.product.findUniqueOrThrow({ where: { id: item.id } });
        snapshots.push({ productId: item.id, quantity: item.quantity, price: product.price });
      }
      return tx.order.create({
        data: {
          userId, checkoutKey, paymentMethod, shipping,
          total: snapshots.reduce((sum, item) => sum + Math.round(item.price * 100) * item.quantity, 0) / 100,
          items: { create: snapshots },
        },
        include: { items: true },
      });
    });
  } catch (error) {
    // A concurrent submission with the same key rolls its reservation back.
    const order = await prisma.order.findUnique({ where: { checkoutKey }, include: { items: true } });
    if (order && order.userId === userId && order.status !== "cancelled") return order;
    throw error;
  }
}

export async function cancelReservedOrder(orderId: number, userId: number) {
  return prisma.$transaction(async tx => {
    const changed = await tx.order.updateMany({
      where: { id: orderId, userId, status: "pending" }, data: { status: "cancelled" },
    });
    if (!changed.count) return;
    const items = await tx.orderItem.findMany({ where: { orderId }, orderBy: { productId: "asc" } });
    for (const item of items) {
      await tx.product.update({ where: { id: item.productId }, data: { stock: { increment: item.quantity } } });
    }
  });
}

export type PaymentSession = {
  id: string;
  payment_status?: string;
  amount_total?: number | null;
  currency?: string | null;
  metadata?: { orderId?: string; userId?: string } | null;
};
export async function fulfillStripeOrder(session: PaymentSession) {
  if (session.payment_status !== "paid") return false;
  const orderId = Number(session.metadata?.orderId);
  const userId = Number(session.metadata?.userId);
  if (!Number.isSafeInteger(orderId) || !Number.isSafeInteger(userId)) return false;
  const order = await prisma.order.findUnique({ where: { id: orderId } });
  if (!order || order.userId !== userId || order.paymentMethod !== "stripe" ||
      (order.stripeSessionId && order.stripeSessionId !== session.id) ||
      Math.round(order.total * 100) !== session.amount_total || session.currency !== "thb") return false;
  await prisma.order.updateMany({
    where: { id: orderId, userId, status: "pending" },
    data: { status: "paid", stripeSessionId: session.id },
  });
  return true;
}
