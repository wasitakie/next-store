import { Heart, Plus, Star } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import React from "react";
import { Button } from "./ui/button";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "./ui/card";
import { LocalizedProduct } from "@/types/product";
import { useFormatter } from "next-intl";

export default function ProductCard({
  products,
}: {
  products: LocalizedProduct[];
}) {
  const format = useFormatter();
  return (
    <div className="container mx-auto">
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-2 md:gap-4 lg:gap-6">
        {products.map((product) => (
          <div key={product.id}>
            <Card className="group relative w-full h-full hover:shadow-2xl bg-white border border-gray-200 shadow-lg  hover:scale-105 duration-300 transition-all cursor-pointer overflow-hidden">
              {/* Wishlist Button */}
              <div className="absolute top-10 right-3 z-10 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                <Button variant="pink" className="w-8 h-8 rounded-full">
                  <Heart className="w-5 h-5" />
                </Button>
              </div>
              {/* Badge */}
              <div className="absolute top-3 left-3 z-10">
                <div className="bg-linear-to-r from-pink-500 to-orange-500 text-white px-3 py-1 rounded-full text-xs font-semibold">
                  NEW
                </div>
              </div>
              {/* Product Image */}
              <Link href={`/products/${product.slug}`} className="block">
                <div className="relative overflow-hidden w-full h-48">
                  <Image
                    src={product.image || ""}
                    alt={product.name}
                    fill
                    loading="eager"
                    sizes="(max-width: 1200px) 50vw, 33vw"
                    className="object-cover object-center group-hover:scale-110 transition-transform duration-500 "
                  />
                  {/* Gradient Overlay for text contrast */}
                  <div className="absolute inset-0 bg-linear-to-t from-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                    {/* Out of Stock Overlay */}
                    {product.stock === 0 && (
                      <div className="absolute inset-0 bg-linear-to-t from-black/20 to-transparent opacity-1 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
                        <p className="text-white text-2xl font-bold">
                          Out of Stock
                        </p>
                      </div>
                    )}
                    {product.category && (
                      <span className="absolute top-3 right-3 z-10 bg-white/80 backdrop-blur-sm rounded-full px-3 py-1 text-xs font-semibold">
                        {product.category}
                      </span>
                    )}
                  </div>
                </div>
              </Link>
              {/* Product Info */}
              <CardContent className="flex grow flex-col justify-between gap-2 p-4">
                <Link href={`/products/${product.slug}`} className="block">
                  <h3 className="text-base font-semibold line-clamp-2 leading-tight text-zinc-900 group-hover:text-zinc-600 transition-colors duration-300">
                    {product.name}
                  </h3>
                </Link>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="text-2xl font-bold text-zinc-900">
                      {format.number(product.price, "currency")}
                    </div>
                  </div>
                  <div className="flex items-center  text-yellow-500">
                    <Star className="w-5 h-5 fill-current" />
                    <span className="text-sm text-gray-600">(4.8)</span>
                  </div>
                </div>
              </CardContent>
              {/* Add to Cart */}
              <CardFooter>
                <Button
                  disabled={product.stock === 0}
                  className="w-full h-10 bg-zinc-900 hover:bg-zinc-800 text-white shadow-lg"
                >
                  <Plus className="w-5 h-5" />
                  Add to Cart
                </Button>
              </CardFooter>
            </Card>
          </div>
        ))}
      </div>
    </div>
  );
}
