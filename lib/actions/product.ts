"use server";

import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";
import { requireAdmin } from "@/lib/session";

export async function createProduct(formData: FormData) {
  await requireAdmin();

  const name = formData.get("name") as string;
  const description = formData.get("description") as string;
  const price = parseFloat(formData.get("price") as string);
  const stock = parseInt(formData.get("stock") as string, 10);
  const category = formData.get("category") as string;
  const image = formData.get("image") as string;

 

  await prisma.product.create({
    data: {
      name,
      description: description || null,
      price,
      stock,
      category: category || null,
      image: image || null,
    },
  });

  revalidatePath("/admin/products");
  revalidatePath("/products");
}

export async function updateProduct(id: number, formData: FormData) {
  await requireAdmin();

  const name = formData.get("name") as string;
  const description = formData.get("description") as string;
  const price = parseFloat(formData.get("price") as string);
  const stock = parseInt(formData.get("stock") as string, 10);
  const category = formData.get("category") as string;
  const image = formData.get("image") as string;

  await prisma.product.update({
    where: { id },
    data: {
      name,
      description: description || null,
      price,
      stock,
      category: category || null,
      image: image || null,
    },
  });

  revalidatePath("/admin/products");
  revalidatePath("/products");
}

export async function deleteProduct(id: number) {
  await requireAdmin();

  await prisma.product.delete({
    where: { id },
  });

  revalidatePath("/admin/products");
  revalidatePath("/products");
}
