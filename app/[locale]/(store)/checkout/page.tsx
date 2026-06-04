import { getCart, createOrder } from "@/lib/cart";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { Truck, CreditCard, MapPin, User } from "lucide-react";
import Link from "next/link";
import Image from "next/image";
import { redirect } from "next/navigation";

async function createOrderAction() {
  "use server";

  try {
    // Get cart
    const cart = await getCart();

    if (cart.items.length === 0) {
      throw new Error("Cart is empty");
    }

    // For now, we'll use a hardcoded user ID (in production, get from session)
    const userId = 1; // This should come from authentication

    // Create order
    const order = await createOrder(userId, cart);

    redirect(`/order-success/${order.id}`);
  } catch {
    console.error("Failed to create order");
    throw new Error("Failed to create order");
  }
}

export default async function CheckoutPage() {
  const cart = await getCart();

  if (cart.items.length === 0) {
    redirect("/cart");
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">ชำระเงิน</h1>
          <p className="text-gray-600">กรุณากรอกข้อมูลเพื่อดำเนินการสั่งซื้อ</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Checkout Form */}
          <div className="lg:col-span-2 space-y-6">
            {/* Customer Information */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <User className="w-5 h-5" />
                  ข้อมูลผู้ซื้อ
                </CardTitle>
                <CardDescription>กรุณากรอกข้อมูลส่วนตัวของคุณ</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="firstName">ชื่อ</Label>
                    <Input id="firstName" name="firstName" required />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="lastName">นามสกุล</Label>
                    <Input id="lastName" name="lastName" required />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="email">อีเมล</Label>
                  <Input
                    id="email"
                    name="email"
                    type="email"
                    placeholder="example@email.com"
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="phone">เบอร์โทรศัพท์</Label>
                  <Input
                    id="phone"
                    name="phone"
                    type="tel"
                    placeholder="08xxxxxxxx"
                    required
                  />
                </div>
              </CardContent>
            </Card>

            {/* Shipping Address */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <MapPin className="w-5 h-5" />
                  ที่อยู่จัดส่ง
                </CardTitle>
                <CardDescription>ที่อยู่สำหรับจัดส่งสินค้า</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="address">ที่อยู่</Label>
                  <Input
                    id="address"
                    name="address"
                    placeholder="123/4 ถนนสุขุมวิท"
                    required
                  />
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="city">จังหวัด</Label>
                    <Input
                      id="city"
                      name="city"
                      placeholder="กรุงเทพมหานคร"
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="postalCode">รหัสไปรษณีย์</Label>
                    <Input
                      id="postalCode"
                      name="postalCode"
                      placeholder="10110"
                      required
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="notes">หมายเหตุ (ถ้ามี)</Label>
                  <Input
                    id="notes"
                    name="notes"
                    placeholder="ข้อมูลเพิ่มเติมสำหรับการจัดส่ง"
                  />
                </div>
              </CardContent>
            </Card>

            {/* Payment Method */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <CreditCard className="w-5 h-5" />
                  วิธีการชำระเงิน
                </CardTitle>
                <CardDescription>เลือกวิธีการชำระเงินที่สะดวก</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-3">
                  <label className="flex items-center space-x-3 p-4 border border-border rounded-lg cursor-pointer hover:bg-accent">
                    <input
                      type="radio"
                      name="paymentMethod"
                      value="cod"
                      className="text-primary"
                      defaultChecked
                    />
                    <div className="flex-1">
                      <p className="font-medium">เก็บเงินปลายทาง (COD)</p>
                      <p className="text-sm text-gray-600">
                        ชำระเงินเมื่อได้รับสินค้า
                      </p>
                    </div>
                  </label>
                  <label className="flex items-center space-x-3 p-4 border border-border rounded-lg cursor-pointer hover:bg-accent">
                    <input
                      type="radio"
                      name="paymentMethod"
                      value="transfer"
                      className="text-primary"
                    />
                    <div className="flex-1">
                      <p className="font-medium">โอนเงินผ่านธนาคาร</p>
                      <p className="text-sm text-gray-600">
                        โอนเงินผ่านบัญชีธนาคาร
                      </p>
                    </div>
                  </label>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Order Summary */}
          <div className="lg:col-span-1">
            <Card className="sticky top-8">
              <CardHeader>
                <CardTitle>สรุปคำสั่งซื้อ</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {/* Order Items */}
                <div className="space-y-3">
                  {cart.items.map((item) => (
                    <div key={item.id} className="flex gap-3">
                      <div className="w-16 h-16 bg-gray-100 rounded-lg flex items-center justify-center overflow-hidden shrink-0">
                        {item.image ? (
                          <Image
                            src={item.image}
                            alt={item.name}
                            width={64}
                            height={64}
                            className="w-full h-full object-cover"
                          />
                        ) : (
                          <div className="w-8 h-8 text-gray-400">
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
                      <div className="flex-1">
                        <h4 className="font-medium text-sm line-clamp-1">
                          {item.name}
                        </h4>
                        <p className="text-sm text-gray-600">
                          จำนวน {item.quantity}
                        </p>
                        <p className="font-semibold text-sm">
                          ฿{(item.price * item.quantity).toLocaleString()}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>

                <Separator />

                {/* Price Summary */}
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span>ราคาสินค้า</span>
                    <span>฿{cart.total.toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span>ค่าจัดส่ง</span>
                    <span>฿0</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span>ส่วนลด</span>
                    <span className="text-green-600">-฿0</span>
                  </div>
                  <Separator />
                  <div className="flex justify-between font-semibold text-lg">
                    <span>รวมทั้งหมด</span>
                    <span className="text-primary">
                      ฿{cart.total.toLocaleString()}
                    </span>
                  </div>
                </div>

                <div className="space-y-2">
                  <div className="flex items-center gap-2 text-sm text-gray-600">
                    <Truck className="w-4 h-4" />
                    <span>จัดส่งฟรีเมื่อซื้อ ฿500 ขึ้นไป</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm text-gray-600">
                    <svg
                      className="w-4 h-4"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M9 12l2 2 4-4m0 0l-2-2m2 2l-2-2m6 0a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V6a2 2 0 00-2-2z"
                      />
                    </svg>
                    <span>รับประกันสินค้า 7 วัน</span>
                  </div>
                </div>
              </CardContent>
              <CardFooter>
                <form action={createOrderAction} className="w-full">
                  <Button type="submit" className="w-full" size="lg">
                    ยืนยันคำสั่งซื้อ
                  </Button>
                </form>
                <div className="mt-4 text-center">
                  <Button variant="ghost" asChild>
                    <Link href="/cart">← กลับไปตะกร้า</Link>
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
