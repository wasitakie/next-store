import { requireAdmin } from "@/lib/session";
import { Button } from "@/components/ui/button";
import { createProduct } from "@/lib/actions/product";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";

export default async function NewProductPage() {
  await requireAdmin();

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      <div className="flex items-center gap-4">
        <Button asChild variant="outline" size="icon" className="h-8 w-8">
          <Link href="/admin/products">
            <ArrowLeft className="h-4 w-4" />
          </Link>
        </Button>
        <div>
          <h2 className="text-2xl font-bold tracking-tight">Add New Product</h2>
        </div>
      </div>

      <form
        action={createProduct}
        className="bg-white shadow-sm border rounded-lg p-6 space-y-6"
      >
        <div className="space-y-4">
          <div>
            <label htmlFor="name" className="block text-sm font-medium mb-1">
              Product Name *
            </label>
            <input
              type="text"
              id="name"
              name="name"
              required
              className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
            />
          </div>

          <div>
            <label
              htmlFor="description"
              className="block text-sm font-medium mb-1"
            >
              Description
            </label>
            <textarea
              id="description"
              name="description"
              rows={4}
              className="flex w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
            ></textarea>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label htmlFor="price" className="block text-sm font-medium mb-1">
                Price (฿) *
              </label>
              <input
                type="number"
                id="price"
                name="price"
                step="0.01"
                required
                className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
              />
            </div>
            <div>
              <label htmlFor="stock" className="block text-sm font-medium mb-1">
                Stock *
              </label>
              <input
                type="number"
                id="stock"
                name="stock"
                required
                className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label
                htmlFor="category"
                className="block text-sm font-medium mb-1"
              >
                Category
              </label>
              <input
                type="text"
                id="category"
                name="category"
                className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
              />
            </div>
            <div>
              <label htmlFor="image" className="block text-sm font-medium mb-1">
                Image URL
              </label>
              <input
                type="file"
                id="image"
                name="image"
                multiple
                accept="image/*"
                className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
              />
            </div>
          </div>
        </div>

        <div className="flex justify-end gap-4 pt-4 border-t">
          <Button type="button" variant="outline" asChild>
            <Link href="/admin/products">Cancel</Link>
          </Button>
          <Button type="submit">Create Product</Button>
        </div>
      </form>
    </div>
  );
}
