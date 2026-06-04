"use server";

import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";
import { requireAdmin } from "@/lib/session";
import { OrderStatus } from "@prisma/client";

export async function createOrder(formData: FormData) {
  await requireAdmin();

  const userId = parseInt(formData.get("userId") as string, 10);
  const total = parseFloat(formData.get("total") as string);
  const status = formData.get("status") as OrderStatus;

  // Ideally, we would parse order items here as well, 
  // but for simplicity in this admin manual creation, we might just create a basic order.
  // In a real scenario, this form would submit a JSON payload of items, not simple FormData.

  await prisma.order.create({
    data: {
      userId,
      total,
      status,
    },
  });

  revalidatePath("/admin/orders");
}

export async function updateOrderStatus(id: number, formData: FormData) {
  await requireAdmin();

  const status = formData.get("status") as OrderStatus;

  await prisma.order.update({
    where: { id },
    data: { status },
  });

  revalidatePath("/admin/orders");
}

export async function deleteOrder(id: number) {
  await requireAdmin();

  // First delete order items
  await prisma.orderItem.deleteMany({
    where: { orderId: id },
  });

  // Then delete the order
  await prisma.order.delete({
    where: { id },
  });

  revalidatePath("/admin/orders");
}
