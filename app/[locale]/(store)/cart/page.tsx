import { getCart, removeFromCart, clearCart } from "@/lib/cart";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Separator } from "@/components/ui/separator";
import { Minus, Plus, Trash2, ShoppingBag, ArrowRight } from "lucide-react";
import Link from "next/link";
import Image from "next/image";
import { redirect } from "next/navigation";

async function removeItem(formData: FormData) {
  const productId = parseInt(formData.get("productId") as string);

  try {
    await removeFromCart(productId);
    redirect("/cart");
  } catch {
    console.error("Failed to remove item");
  }
}

async function clearAllItems() {
  try {
    await clearCart();
  } catch {
    console.error("Failed to clear cart");
  }
  redirect("/cart");
}

export default async function CartPage() {
  const cart = await getCart();

  if (cart.items.length === 0) {
    return (
      <div className="min-h-screen bg-background">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <div className="text-center">
            <div className="w-24 h-24 text-gray-400 mx-auto mb-6">
              <ShoppingBag className="w-full h-full" />
            </div>
            <h1 className="text-3xl font-bold text-gray-900 mb-4">
              ตะกร้าสินค้าว่าง
            </h1>
            <p className="text-gray-600 mb-8">ยังไม่มีสินค้าในตะกร้าของคุณ</p>
            <Button asChild size="lg">
              <Link href="/products">เลือกสินค้าเลย</Link>
            </Button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            ตะกร้าสินค้า
          </h1>
          <p className="text-gray-600">
            มีสินค้า {cart.items.length} รายการในตะกร้า
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Cart Items */}
          <div className="lg:col-span-2 space-y-4">
            {cart.items.map((item) => (
              <Card key={item.id}>
                <CardContent className="p-6">
                  <div className="flex gap-4">
                    {/* Product Image */}
                    <div className="w-24 h-24 bg-gray-100 rounded-lg flex items-center justify-center overflow-hidden shrink-0">
                      {item.image ? (
                        <Image
                          src={item.image}
                          alt={item.name}
                          width={96}
                          height={96}
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <div className="w-12 h-12 text-gray-400">
                          <svg
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                            className="w-full h-full"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
                            />
                          </svg>
                        </div>
                      )}
                    </div>

                    {/* Product Details */}
                    <div className="flex-1">
                      <div className="flex justify-between items-start mb-2">
                        <div>
                          <h3 className="font-semibold text-lg">{item.name}</h3>
                          <p className="text-gray-600">
                            ฿{item.price.toLocaleString()}
                          </p>
                        </div>
                        <div className="text-right">
                          <p className="font-semibold text-lg">
                            ฿{(item.price * item.quantity).toLocaleString()}
                          </p>
                        </div>
                      </div>

                      {/* Quantity Controls */}
                      <div className="flex items-center justify-between mt-4">
                        <form className="flex items-center gap-2">
                          <input
                            type="hidden"
                            name="productId"
                            value={item.id}
                          />
                          <div className="flex items-center border border-border rounded-lg">
                            <button
                              type="submit"
                              name="quantity"
                              value={Math.max(1, item.quantity - 1)}
                              className="p-2 hover:bg-gray-100 rounded-l-lg"
                            >
                              <Minus className="w-4 h-4" />
                            </button>
                            <Input
                              type="number"
                              name="quantity"
                              value={item.quantity}
                              min="1"
                              className="w-16 border-0 text-center"
                              readOnly
                            />
                            <button
                              type="submit"
                              name="quantity"
                              value={item.quantity + 1}
                              className="p-2 hover:bg-gray-100 rounded-r-lg"
                            >
                              <Plus className="w-4 h-4" />
                            </button>
                          </div>
                        </form>

                        <form action={removeItem}>
                          <input
                            type="hidden"
                            name="productId"
                            value={item.id}
                          />
                          <Button type="submit" variant="ghost" size="sm">
                            <Trash2 className="w-4 h-4" />
                          </Button>
                        </form>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          {/* Order Summary */}
          <div className="lg:col-span-1">
            <Card className="sticky top-8">
              <CardHeader>
                <CardTitle>สรุปคำสั่งซื้อ</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex justify-between">
                  <span>ราคาสินค้า ({cart.items.length} รายการ)</span>
                  <span>฿{cart.total.toLocaleString()}</span>
                </div>
                <div className="flex justify-between">
                  <span>ค่าจัดส่ง</span>
                  <span>฿0</span>
                </div>
                <Separator />
                <div className="flex justify-between font-semibold text-lg">
                  <span>รวมทั้งหมด</span>
                  <span className="text-primary">
                    ฿{cart.total.toLocaleString()}
                  </span>
                </div>
              </CardContent>
              <CardFooter className="space-y-3">
                <Button asChild className="w-full" size="lg">
                  <Link href="/checkout">
                    <ArrowRight className="w-4 h-4 mr-2" />
                    ดำเนินการชำระเงิน
                  </Link>
                </Button>
                <form action={clearAllItems}>
                  <Button type="submit" variant="outline" className="w-full">
                    ล้างตะกร้า
                  </Button>
                </form>
                <div className="text-center">
                  <Button variant="ghost" asChild>
                    <Link href="/products">
                      <ShoppingBag className="w-4 h-4 mr-2" />
                      เลือกสินค้าเพิ่ม
                    </Link>
                  </Button>
                </div>
              </CardFooter>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
