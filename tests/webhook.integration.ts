import "dotenv/config";
import assert from "node:assert/strict";
import { createHmac, randomUUID } from "node:crypto";
import { prisma } from "../lib/prisma";
import { reserveOrder } from "../lib/orders";
assert.ok(["localhost", "127.0.0.1"].includes(new URL(process.env.DATABASE_URL!).hostname));
const run = randomUUID();
const user = await prisma.user.create({ data: { email: `webhook-${run}@example.test` } });
const product = await prisma.product.create({ data: { slug: `webhook-${run}`, name_th: "ทดสอบ", name_en: "Webhook fixture", price: 100, stock: 1 } });
try {
  const order = await reserveOrder(user.id, [{ id: product.id, quantity: 1 }], { checkoutKey: run, firstName: "Test", lastName: "Buyer", email: user.email, phone: "0812345678", address: "123 Test Road", city: "Bangkok", postalCode: "10110", notes: "", paymentMethod: "stripe", locale: "en" });
  // Simulate a successful Stripe request whose response was lost before saving the session id.
  const payload = JSON.stringify({ type: "checkout.session.expired", data: { object: { id: `cs_test_${run}`, metadata: { orderId: String(order.id), userId: String(user.id) } } } });
  const timestamp = Math.floor(Date.now() / 1000);
  const signature = createHmac("sha256", process.env.STRIPE_WEBHOOK_SECRET!).update(`${timestamp}.${payload}`).digest("hex");
  const send = (signature: string) => fetch("http://localhost:3000/api/stripe/webhook", { method: "POST", headers: { "stripe-signature": signature, "content-type": "application/json" }, body: payload });
  assert.equal((await send(`t=${timestamp},v1=00`)).status, 400);
  assert.equal((await prisma.order.findUniqueOrThrow({ where: { id: order.id } })).status, "pending");
  for (let i = 0; i < 2; i++) assert.equal((await send(`t=${timestamp},v1=${signature}`)).status, 200);
  assert.equal((await prisma.order.findUniqueOrThrow({ where: { id: order.id } })).status, "cancelled");
  assert.equal((await prisma.product.findUniqueOrThrow({ where: { id: product.id } })).stock, 1);
  console.log("PASS: invalid webhook rejected; signed expiration cancels and restocks exactly once");
} finally {
  await prisma.orderItem.deleteMany({ where: { order: { userId: user.id } } });
  await prisma.order.deleteMany({ where: { userId: user.id } });
  await prisma.product.delete({ where: { id: product.id } });
  await prisma.user.delete({ where: { id: user.id } });
  await prisma.$disconnect();
}
