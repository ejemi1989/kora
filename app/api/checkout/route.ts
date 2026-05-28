import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { serverError } from "@/lib/validation";

export async function POST(request: Request) {
  try {
    const userId = request.headers.get("x-user-id");
    if (!userId) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const { addressId, items } = await request.json();
    if (!addressId || !items?.length) {
      return NextResponse.json({ error: "addressId and items are required" }, { status: 400 });
    }

    const total = items.reduce((sum: number, item: { price: number; quantity: number }) => sum + item.price * item.quantity, 0);

    const order = await prisma.order.create({
      data: {
        userId,
        total,
        status: "PENDING",
        items: {
          create: items.map((item: { productId: string; quantity: number; price: number }) => ({
            productId: item.productId,
            quantity: item.quantity,
            price: item.price,
          })),
        },
      },
    });

    await prisma.cartItem.deleteMany({ where: { cart: { userId } } });

    return NextResponse.json(order, { status: 201 });
  } catch {
    return serverError("Checkout failed");
  }
}
