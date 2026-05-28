import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { serverError } from "@/lib/validation";

export async function GET(request: NextRequest) {
  try {
    const userId = request.headers.get("x-user-id") || request.nextUrl.searchParams.get("userId");
    if (!userId) {
      return NextResponse.json({ error: "Authentication required" }, { status: 401 });
    }

    const cart = await prisma.cart.findUnique({
      where: { userId },
      include: { items: { include: { product: true } } },
    });

    if (!cart) return NextResponse.json({ items: [], total: 0 });

    const total = cart.items.reduce(
      (sum: number, item: { product: { price: number }; quantity: number }) =>
        sum + item.product.price * item.quantity,
      0,
    );
    return NextResponse.json({ ...cart, total });
  } catch {
    return serverError("Failed to fetch cart");
  }
}
