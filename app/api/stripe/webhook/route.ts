import { createHmac, timingSafeEqual } from "node:crypto";
import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export const runtime = "nodejs";

type StripeWebhookEvent = {
  type: string;
  data: {
    object: {
      payment_status?: string;
      metadata?: {
        orderId?: string;
        userId?: string;
      } | null;
    };
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

  const event = JSON.parse(payload) as StripeWebhookEvent;

  if (event.type === "checkout.session.completed") {
    const checkoutSession = event.data.object;
    const orderId = Number(checkoutSession.metadata?.orderId);
    const userId = Number(checkoutSession.metadata?.userId);

    if (checkoutSession.payment_status === "paid" && orderId && userId) {
      await prisma.order.updateMany({
        where: {
          id: orderId,
          userId,
          status: "pending",
        },
        data: {
          status: "paid",
        },
      });
    }
  }

  return NextResponse.json({ received: true });
}
