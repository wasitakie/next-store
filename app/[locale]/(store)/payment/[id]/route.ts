import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { retrieveStripeCheckoutSession } from "@/lib/stripe";
import { cancelReservedOrder, fulfillStripeOrder } from "@/lib/orders";
import { NextResponse } from "next/server";
export async function GET(request: Request, { params }: { params: Promise<{ locale: string; id: string }> }) {
  const { locale, id } = await params;
  const user = await auth();
  const userId = Number(user?.user?.id);
  if (!userId || !/^\d+$/.test(id) || !["th", "en"].includes(locale)) return new NextResponse(null, { status: 404 });
  const order = await prisma.order.findFirst({ where: { id: Number(id), userId } });
  if (!order?.stripeSessionId) return new NextResponse(null, { status: 404 });
  const session = await retrieveStripeCheckoutSession(order.stripeSessionId);
  if (order.status === "pending" && session.status === "open" && session.url) return NextResponse.redirect(session.url);
  if (session.status === "expired") await cancelReservedOrder(order.id, userId);
  else await fulfillStripeOrder(session);
  return NextResponse.redirect(new URL(`/${locale}/order-success/${id}`, request.url));
}
