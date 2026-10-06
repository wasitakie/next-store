import assert from "node:assert/strict";
import { randomUUID } from "node:crypto";
import { prisma } from "../lib/prisma";
import { reserveOrder, cancelReservedOrder, fulfillStripeOrder, checkoutSchema, type CheckoutInput } from "../lib/orders";

const url = new URL(process.env.DATABASE_URL!);
assert.ok(["localhost", "127.0.0.1"].includes(url.hostname), "Integration tests require local PostgreSQL");
const runId = randomUUID();
const user = await prisma.user.create({ data: { email: `stock-test-${runId}@example.test` } });
const product = await prisma.product.create({ data: { slug: `stock-test-${runId}`, name_th: "ทดสอบสต็อก", name_en: "Stock test", price: 125.25, stock: 1 } });
const input = (): CheckoutInput => ({ checkoutKey: randomUUID(), firstName: "Test", lastName: "Buyer", email: user.email, phone: "0812345678", address: "123 Test Road", city: "Bangkok", postalCode: "10110", notes: "Integration test", paymentMethod: "stripe", locale: "en" });
try {
  assert.equal(checkoutSchema.safeParse({ ...input(), postalCode: "abc" }).success, false);
  await assert.rejects(() => reserveOrder(user.id, [{ id: product.id, quantity: -1 }], input()));
  const results = await Promise.allSettled([1, 2].map(() => reserveOrder(user.id, [{ id: product.id, quantity: 1, price: 0.01 }], input())));
  assert.equal(results.filter(r => r.status === "fulfilled").length, 1, "Exactly one buyer can reserve the final item");
  const first = results.find(r => r.status === "fulfilled")!;
  assert.equal(first.status, "fulfilled");
  if (first.status !== "fulfilled") throw new Error("No order");
  assert.equal(first.value.total, 125.25, "Server price overrides forged cart price");
  await Promise.all([cancelReservedOrder(first.value.id, user.id), cancelReservedOrder(first.value.id, user.id)]);
  assert.equal((await prisma.product.findUniqueOrThrow({ where: { id: product.id } })).stock, 1, "Duplicate cancellations restock once");
  await prisma.product.update({ where: { id: product.id }, data: { stock: 1 } });
  const submission = input();
  const duplicate = await Promise.all([1, 2].map(() => reserveOrder(user.id, [{ id: product.id, quantity: 1 }], submission)));
  assert.equal(duplicate[0].id, duplicate[1].id, "Duplicate submissions reuse one order");
  assert.equal((await prisma.product.findUniqueOrThrow({ where: { id: product.id } })).stock, 0);
  const order = duplicate[0];
  await prisma.order.update({ where: { id: order.id }, data: { stripeSessionId: `cs_test_${runId}` } });
  const session = { id: `cs_test_${runId}`, payment_status: "paid", currency: "thb", amount_total: 12525, metadata: { orderId: String(order.id), userId: String(user.id) } };
  assert.equal(await fulfillStripeOrder({ ...session, amount_total: 1 }), false);
  assert.equal(await fulfillStripeOrder({ ...session, id: "wrong-session" }), false);
  await Promise.all([fulfillStripeOrder(session), fulfillStripeOrder(session)]);
  await cancelReservedOrder(order.id, user.id);
  assert.equal((await prisma.order.findUniqueOrThrow({ where: { id: order.id } })).status, "paid");
  assert.equal((await prisma.product.findUniqueOrThrow({ where: { id: product.id } })).stock, 0, "Paid order cannot be cancelled or restocked by expiration");
  const shipping = order.shipping as Record<string, string>;
  assert.equal(shipping.address, "123 Test Road");
  console.log("PASS: validation, authoritative prices, concurrent stock, duplicate orders, shipping persistence, payment verification, idempotent fulfillment and restocking");
} finally {
  await prisma.orderItem.deleteMany({ where: { order: { userId: user.id } } });
  await prisma.order.deleteMany({ where: { userId: user.id } });
  await prisma.product.delete({ where: { id: product.id } });
  await prisma.user.delete({ where: { id: user.id } });
  await prisma.$disconnect();
}
