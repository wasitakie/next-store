import { prisma } from "@/lib/prisma";
import { NextRequest, NextResponse } from "next/server";

export async function GET() {
  const rows = prisma.product.findMany();
  return NextResponse.json(rows);
}

export async function POST(request: NextRequest) {
  const data = request.json();
  const newProduct = await prisma.product.create({
    data: await data,
  });
  return NextResponse.json(newProduct);
}
