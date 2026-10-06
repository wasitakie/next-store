"use server";
import { auth } from "@/lib/auth";
import { getCart, clearCart, removePurchasedItems } from "@/lib/cart";
import { reserveOrder, checkoutSchema, cancelReservedOrder } from "@/lib/orders";
import { createStripeCheckoutSession, retrieveStripeCheckoutSession } from "@/lib/stripe";
import { prisma } from "@/lib/prisma";
import { redirect } from "next/navigation";

export async function submitCheckout(_state: { error: string }, formData: FormData) {
  const input = checkoutSchema.safeParse(Object.fromEntries(formData));
  if (!input.success) return { error: "invalidForm" };
  const session = await auth();
  const userId = Number(session?.user?.id);
  const { locale } = input.data;
  if (!userId) redirect(`/${locale}/login?callbackUrl=${encodeURIComponent(`/${locale}/checkout`)}`);
  let destination: string;
  try {
    if (input.data.paymentMethod === "stripe" && !process.env.STRIPE_SECRET_KEY) return { error: "checkoutError" };
    const cart = await getCart();
    const existing = await prisma.order.findUnique({ where: { checkoutKey: input.data.checkoutKey }, include: { items: true } });
    const order = await reserveOrder(userId, existing?.userId === userId ? existing.items.map(i => ({ id: i.productId, quantity: i.quantity })) : cart.items, input.data);
    if (order.paymentMethod === "stripe" && order.status === "pending") {
      const products = await prisma.product.findMany({ where: { id: { in: order.items.map(i => i.productId) } } });
      const stripeCart = {
        total: order.total,
        items: order.items.map(item => {
          const product = products.find(p => p.id === item.productId)!;
          return { id: item.productId, quantity: item.quantity, price: item.price, name: locale === "en" ? product.name_en : product.name_th, image: product.image || undefined };
        }),
      };
      try {
        const stripeSession = order.stripeSessionId
          ? await retrieveStripeCheckoutSession(order.stripeSessionId)
          : await createStripeCheckoutSession({ cart: stripeCart, locale, orderId: order.id, userId, customerEmail: input.data.email, checkoutKey: order.checkoutKey! });
        if (!stripeSession.url || stripeSession.status === "expired") throw new Error("STRIPE_UNAVAILABLE");
        await prisma.order.update({ where: { id: order.id }, data: { stripeSessionId: stripeSession.id } });
        destination = stripeSession.url;
      } catch (error) {
        // Only a definitive rejection can safely release stock; network failures
        // must retry the same idempotency key because Stripe may have accepted it.
        if (error instanceof Error && error.message === "STRIPE_REJECTED" && !order.stripeSessionId) {
          await cancelReservedOrder(order.id, userId);
        }
        throw error;
      }
    } else {
      if (order.paymentMethod !== "stripe") await clearCart();
      destination = `/${locale}/order-success/${order.id}`;
    }
  } catch (error) {
    console.error("Checkout failed:", error instanceof Error ? error.message : "unknown");
    return { error: error instanceof Error && error.message === "INSUFFICIENT_STOCK" ? "stockError" : "checkoutError" };
  }
  redirect(destination);
}
export async function syncOrderCart(orderId: number) {
  const session = await auth();
  const userId = Number(session?.user?.id);
  if (userId) await removePurchasedItems(orderId, userId);
}
