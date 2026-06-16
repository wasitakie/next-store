"use server";

import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";
import { requireAdmin } from "@/lib/session";

function generateSlug(name: string): string {
  const base = name
    .toLowerCase()
    .trim()
    .replace(/[^\w\s-]/g, "")
    .replace(/[\s_-]+/g, "-")
    .replace(/^-+|-+$/g, "");

  return `${base || "product"}-${Date.now()}`;
}

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
      slug: generateSlug(name),
      name_th: name,
      name_en: name,
      description_th: description || null,
      description_en: description || null,
      category_th: category || null,
      category_en: category || null,
      price,
      stock,
      image: image || null,
    },
  });

  revalidatePath("/admin/products");
  revalidatePath("/products");
}

export async function updateProduct(id: number, formData: FormData) {
  await requireAdmin();

  const locale = (formData.get("locale") as string) || "th";
  const name = formData.get("name") as string;
  const description = formData.get("description") as string;
  const price = parseFloat(formData.get("price") as string);
  const stock = parseInt(formData.get("stock") as string, 10);
  const category = formData.get("category") as string;
  const image = formData.get("image") as string;

  const localizedFields =
    locale === "en"
      ? {
          name_en: name,
          description_en: description || null,
          category_en: category || null,
        }
      : {
          name_th: name,
          description_th: description || null,
          category_th: category || null,
        };

  await prisma.product.update({
    where: { id },
    data: {
      ...localizedFields,
      price,
      stock,
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
