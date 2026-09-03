import { Link } from "@/i18n/routing";
import { prisma } from "@/lib/prisma";
import { requireAdmin } from "@/lib/session";
import { Button } from "@/components/ui/button";
import { Plus, Edit, Trash2, Package } from "lucide-react";
import { deleteProduct } from "@/lib/actions/product";
import Image from "next/image";
import { getTranslations } from "next-intl/server";
import { localizeProduct } from "@/lib/utils";

export default async function AdminProductsPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  await requireAdmin();
  const t = await getTranslations("Admin");

  const products = await prisma.product.findMany({
    orderBy: { createdAt: "desc" },
  });

  const localizedProducts = products.map((product) =>
    localizeProduct(product, locale),
  );

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">{t("products")}</h2>
          <p className="text-muted-foreground mt-1">
            Manage your store products.
          </p>
        </div>
        <Button asChild>
          <Link href="/admin/products/new">
            <Plus className="mr-2 h-4 w-4" /> {t("addProduct")}
          </Link>
        </Button>
      </div>

      <div className="overflow-hidden rounded-md border border-slate-200 bg-white">
        <div className="overflow-x-auto">
          <table className="w-full text-sm text-left">
            <thead className="border-b bg-slate-50 text-xs uppercase text-slate-500">
              <tr>
                <th scope="col" className="px-6 py-4 font-medium">
                  {t("products")}
                </th>
                <th scope="col" className="px-6 py-4 font-medium">
                  {t("category")}
                </th>
                <th scope="col" className="px-6 py-4 font-medium text-right">
                  {t("price")}
                </th>
                <th scope="col" className="px-6 py-4 font-medium text-right">
                  {t("stock")}
                </th>
                <th scope="col" className="px-6 py-4 font-medium text-right">
                  {t("actions")}
                </th>
              </tr>
            </thead>
            <tbody>
              {localizedProducts.length === 0 ? (
                <tr>
                  <td
                    colSpan={5}
                    className="px-6 py-8 text-center text-muted-foreground"
                  >
                    <div className="flex flex-col items-center justify-center">
                      <Package className="h-10 w-10 text-gray-300 mb-2" />
                      <p>No products found.</p>
                      <Button asChild variant="link" className="mt-2">
                        <Link href="/admin/products/new">
                          {t("addNewProduct")}
                        </Link>
                      </Button>
                    </div>
                  </td>
                </tr>
              ) : (
                localizedProducts.map((product) => (
                  <tr
                    key={product.id}
                    className="border-b bg-white transition-colors hover:bg-slate-50/70"
                  >
                    <td className="px-6 py-4 font-medium text-gray-900 whitespace-nowrap">
                      <div className="flex items-center gap-3">
                        {product.image ? (
                          <Image
                            src={product.image}
                            alt={product.name}
                            className="w-10 h-10 rounded-md object-cover border"
                          />
                        ) : (
                          <div className="w-10 h-10 rounded-md bg-gray-100 flex items-center justify-center border text-gray-400">
                            <Package className="w-5 h-5" />
                          </div>
                        )}
                        <span>{product.name}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-gray-500">
                      {product.category || "-"}
                    </td>
                    <td className="px-6 py-4 text-right font-medium text-gray-900">
                      ฿
                      {product.price.toLocaleString(undefined, {
                        minimumFractionDigits: 2,
                      })}
                    </td>
                    <td className="px-6 py-4 text-right">
                      <span
                        className={`rounded-md px-2 py-1 text-xs font-medium ${product.stock > 10 ? "bg-emerald-50 text-emerald-700" : product.stock > 0 ? "bg-amber-50 text-amber-700" : "bg-red-50 text-red-700"}`}
                      >
                        {product.stock}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-right space-x-2">
                      <div className="flex items-center justify-end gap-2">
                        <Button
                          asChild
                          variant="ghost"
                          size="icon"
                          className="h-8 w-8 text-slate-500 hover:bg-slate-100 hover:text-slate-950"
                        >
                          <Link href={`/admin/products/${product.id}/edit`}>
                            <Edit className="h-4 w-4" />
                            <span className="sr-only">Edit</span>
                          </Link>
                        </Button>
                        <form action={deleteProduct.bind(null, product.id)}>
                          <Button
                            type="submit"
                            variant="ghost"
                            size="icon"
                            className="h-8 w-8 text-red-600 hover:text-red-700 hover:bg-red-50"
                            onClick={(e) => {
                              if (
                                !confirm(
                                  "Are you sure you want to delete this product?",
                                )
                              )
                                e.preventDefault();
                            }}
                          >
                            <Trash2 className="h-4 w-4" />
                            <span className="sr-only">Delete</span>
                          </Button>
                        </form>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
