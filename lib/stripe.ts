import { Cart } from "@/lib/cart";

const STRIPE_API_BASE = "https://api.stripe.com/v1";

type StripeCheckoutSession = {
  id: string;
  url?: string | null;
  payment_status?: "paid" | "unpaid" | "no_payment_required";
  metadata?: {
    orderId?: string;
    userId?: string;
  } | null;
};

function getStripeSecretKey() {
  const secretKey = process.env.STRIPE_SECRET_KEY;

  if (!secretKey) {
    throw new Error("STRIPE_SECRET_KEY is not configured");
  }

  return secretKey;
}

function getAppUrl() {
  return process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000";
}

function toStripeAmount(price: number) {
  return Math.round(price * 100);
}

async function stripeRequest<T>(path: string, init: RequestInit = {}) {
  const response = await fetch(`${STRIPE_API_BASE}${path}`, {
    ...init,
    headers: {
      Authorization: `Bearer ${getStripeSecretKey()}`,
      ...init.headers,
    },
    cache: "no-store",
  });

  if (!response.ok) {
    const detail = await response.text();
    throw new Error(`Stripe request failed: ${detail}`);
  }

  return response.json() as Promise<T>;
}

export async function createStripeCheckoutSession({
  cart,
  locale,
  orderId,
  userId,
  customerEmail,
}: {
  cart: Cart;
  locale: string;
  orderId: number;
  userId: number;
  customerEmail?: string | null;
}): Promise<StripeCheckoutSession & { url: string }> {
  const params = new URLSearchParams();
  const appUrl = getAppUrl();

  params.set("mode", "payment");
  params.set("client_reference_id", String(orderId));
  params.set(
    "success_url",
    `${appUrl}/${locale}/order-success/${orderId}?session_id={CHECKOUT_SESSION_ID}`,
  );
  params.set(
    "cancel_url",
    `${appUrl}/${locale}/order-success/${orderId}?payment_cancelled=1`,
  );
  params.set("metadata[orderId]", String(orderId));
  params.set("metadata[userId]", String(userId));
  params.set("payment_intent_data[metadata][orderId]", String(orderId));
  params.set("payment_intent_data[metadata][userId]", String(userId));

  if (customerEmail) {
    params.set("customer_email", customerEmail);
  }

  cart.items.forEach((item, index) => {
    params.set(`line_items[${index}][quantity]`, String(item.quantity));
    params.set(`line_items[${index}][price_data][currency]`, "thb");
    params.set(
      `line_items[${index}][price_data][unit_amount]`,
      String(toStripeAmount(item.price)),
    );
    params.set(
      `line_items[${index}][price_data][product_data][name]`,
      item.name,
    );

    if (item.image?.startsWith("http")) {
      params.set(
        `line_items[${index}][price_data][product_data][images][0]`,
        item.image,
      );
    }
  });

  const session = await stripeRequest<StripeCheckoutSession>(
    "/checkout/sessions",
    {
      method: "POST",
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
      },
      body: params,
    },
  );

  if (!session.url) {
    throw new Error("Stripe did not return a checkout URL");
  }

  return { ...session, url: session.url };
}

export async function retrieveStripeCheckoutSession(sessionId: string) {
  return stripeRequest<StripeCheckoutSession>(
    `/checkout/sessions/${encodeURIComponent(sessionId)}`,
  );
}
