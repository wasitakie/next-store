import { createHmac, timingSafeEqual } from "node:crypto";
import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { fulfillStripeOrder, cancelReservedOrder, type PaymentSession } from "@/lib/orders";

export const runtime = "nodejs";

type StripeWebhookEvent = {
  type: string;
  data: {
    object: PaymentSession;
  };
};

function verifyStripeSignature({
  payload,
  signatureHeader,
  secret,
}: {
  payload: string;
  signatureHeader: string;
  secret: string;
}) {
  const parts = Object.fromEntries(
    signatureHeader.split(",").map((part) => {
      const [key, value] = part.split("=");
      return [key, value];
    }),
  );
  const timestamp = parts.t;
  const signature = parts.v1;

  if (!timestamp || !signature) {
    return false;
  }

  const ageInSeconds = Math.abs(Date.now() / 1000 - Number(timestamp));
  if (!Number.isFinite(ageInSeconds) || ageInSeconds > 300) {
    return false;
  }

  const expected = createHmac("sha256", secret)
    .update(`${timestamp}.${payload}`)
    .digest("hex");
  const expectedBuffer = Buffer.from(expected, "hex");
  const signatureBuffer = Buffer.from(signature, "hex");

  return (
    expectedBuffer.length === signatureBuffer.length &&
    timingSafeEqual(expectedBuffer, signatureBuffer)
  );
}

export async function POST(request: NextRequest) {
  const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET;

  if (!webhookSecret) {
    return NextResponse.json(
      { error: "STRIPE_WEBHOOK_SECRET is not configured" },
      { status: 500 },
    );
  }

  const signatureHeader = request.headers.get("stripe-signature");
  const payload = await request.text();

  if (
    !signatureHeader ||
    !verifyStripeSignature({ payload, signatureHeader, secret: webhookSecret })
  ) {
    return NextResponse.json({ error: "Invalid signature" }, { status: 400 });
  }

  let event: StripeWebhookEvent;
  try { event = JSON.parse(payload); } catch { return NextResponse.json({ error: "Invalid JSON" }, { status: 400 }); }
  if (!event.data?.object) return NextResponse.json({ error: "Invalid event" }, { status: 400 });
  const session = event.data.object;
  if (event.type === "checkout.session.completed" || event.type === "checkout.session.async_payment_succeeded") {
    await fulfillStripeOrder(session);
  }
  if (event.type === "checkout.session.expired") {
    const orderId = Number(session.metadata?.orderId);
    const userId = Number(session.metadata?.userId);
    if (Number.isSafeInteger(orderId) && Number.isSafeInteger(userId)) {
      const order = await prisma.order.findFirst({ where: { id: orderId, userId, paymentMethod: "stripe", OR: [{ stripeSessionId: session.id }, { stripeSessionId: null }] } });
      if (order) await cancelReservedOrder(order.id, userId);
    }
  }
  return NextResponse.json({ received: true });
}
