import { prisma } from "@/lib/prisma";
import { cookies } from "next/headers";
import { getLocale } from "next-intl/server";
import { cartItemsSchema } from "@/lib/orders";
import { z } from "zod";

export type CartItem = {
  id: number;
  name: string;
  price: number;
  quantity: number;
  image?: string;
  stock?: number;
};

export type Cart = {
  items: CartItem[];
  total: number;
};

export async function getCart(): Promise<Cart> {
  const cookieStore = await cookies();
  const cartCookie = cookieStore.get("cart");

  if (!cartCookie?.value) {
    return { items: [], total: 0 };
  }

  let lines;
  try {
    lines = cartItemsSchema.parse(JSON.parse(cartCookie.value).items);
  } catch {
    return { items: [], total: 0 };
  }
  const locale = await getLocale();
  const products = await prisma.product.findMany({ where: { id: { in: lines.map(i => i.id) } } });
  const quantities = new Map<number, number>();
  for (const line of lines) quantities.set(line.id, Math.min(999, (quantities.get(line.id) || 0) + line.quantity));
  const items = products.map(product => ({
    id: product.id, name: locale === "en" ? product.name_en : product.name_th,
    price: product.price, stock: product.stock, quantity: quantities.get(product.id)!,
    image: product.image || undefined,
  }));
  return { items, total: items.reduce((sum, i) => sum + Math.round(i.price * 100) * i.quantity, 0) / 100 };
}

export async function addToCart(
  productId: number,
  quantity: number = 1,
): Promise<Cart> {
  z.number().int().positive().parse(productId);
  z.number().int().min(1).max(999).parse(quantity);
  const product = await prisma.product.findUnique({
    where: { id: productId },
  });

  if (!product) {
    throw new Error("Product not found");
  }

  if (product.stock < quantity) {
    throw new Error("Insufficient stock");
  }

  const cart = await getCart();
  const existingItemIndex = cart.items.findIndex(
    (item) => item.id === productId,
  );

  if (existingItemIndex >= 0) {
    const newQuantity = cart.items[existingItemIndex].quantity + quantity;
    if (product.stock < newQuantity) {
      throw new Error("Insufficient stock");
    }
    cart.items[existingItemIndex].quantity = newQuantity;
  } else {
    cart.items.push({
      id: product.id,
      name: product.name_th || product.name_en,
      price: product.price,
      quantity,
      image: product.image || undefined,
    });
  }

  // Recalculate total
  cart.total = cart.items.reduce(
    (sum, item) => sum + item.price * item.quantity,
    0,
  );

  // Save to cookie
  const cookieStore = await cookies();
  cookieStore.set("cart", JSON.stringify({ items: cart.items.map(({ id, quantity }) => ({ id, quantity })) }), {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    maxAge: 60 * 60 * 24 * 7, // 7 days
  });

  return cart;
}

export async function updateCartItem(
  productId: number,
  quantity: number,
): Promise<Cart> {
  z.number().int().positive().parse(productId);
  z.number().int().min(0).max(999).parse(quantity);
  if (quantity === 0) {
    return removeFromCart(productId);
  }

  const cart = await getCart();
  const itemIndex = cart.items.findIndex((item) => item.id === productId);

  if (itemIndex === -1) {
    throw new Error("Item not found in cart");
  }

  // Check stock
  const product = await prisma.product.findUnique({
    where: { id: productId },
  });

  if (!product || product.stock < quantity) {
    throw new Error("Insufficient stock");
  }

  cart.items[itemIndex].quantity = quantity;
  cart.total = cart.items.reduce(
    (sum, item) => sum + item.price * item.quantity,
    0,
  );

  // Save to cookie
  const cookieStore = await cookies();
  cookieStore.set("cart", JSON.stringify({ items: cart.items.map(({ id, quantity }) => ({ id, quantity })) }), {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    maxAge: 60 * 60 * 24 * 7,
  });

  return cart;
}

export async function removeFromCart(productId: number): Promise<Cart> {
  const cart = await getCart();
  cart.items = cart.items.filter((item) => item.id !== productId);
  cart.total = cart.items.reduce(
    (sum, item) => sum + item.price * item.quantity,
    0,
  );

  // Save to cookie
  const cookieStore = await cookies();
  if (cart.items.length === 0) {
    cookieStore.delete("cart");
  } else {
    cookieStore.set("cart", JSON.stringify({ items: cart.items.map(({ id, quantity }) => ({ id, quantity })) }), {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
    path: "/",
      maxAge: 60 * 60 * 24 * 7,
    });
  }

  return cart;
}

export async function clearCart(): Promise<void> {
  const cookieStore = await cookies();
  cookieStore.delete("cart");
}

// Remove only the purchased quantities, preserving products added while paying.
export async function removePurchasedItems(orderId: number, userId: number) {
  const order = await prisma.order.findFirst({ where: { id: orderId, userId, paymentMethod: "stripe", status: { in: ["paid", "shipped", "delivered"] } }, include: { items: true } });
  const store = await cookies();
  if (!order || store.get(`cart-cleared-${orderId}`)) return;
  const cart = await getCart();
  for (const line of order.items) {
    const item = cart.items.find(i => i.id === line.productId);
    if (item) item.quantity = Math.max(0, item.quantity - line.quantity);
  }
  cart.items = cart.items.filter(i => i.quantity > 0);
  cart.total = cart.items.reduce((sum, i) => sum + i.price * i.quantity, 0);
  const options = { httpOnly: true, secure: process.env.NODE_ENV === "production", sameSite: "lax" as const, path: "/", maxAge: 604800 };
  store.set("cart", JSON.stringify({ items: cart.items.map(({ id, quantity }) => ({ id, quantity })) }), options);
  store.set(`cart-cleared-${orderId}`, "1", options);
}
