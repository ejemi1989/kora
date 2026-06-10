import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { serverError } from "@/lib/validation";
import { createOrder } from "@/lib/services/order";
import { ensureDbUser } from "@/lib/services/user";

export async function POST(request: Request) {
  try {
    const userId = request.headers.get("x-user-id");
    if (!userId) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    await ensureDbUser(userId);

    const { addressId, items } = await request.json();
    if (!addressId || !items?.length) {
      return NextResponse.json({ error: "addressId and items are required" }, { status: 400 });
    }

    const total = items.reduce((sum: number, item: { price: number; quantity: number }) => sum + item.price * item.quantity, 0);

    const order = await createOrder({ userId, items, total });

    await prisma.cartItem.deleteMany({ where: { cart: { userId } } });

    return NextResponse.json({ orderId: order.id, total }, { status: 201 });
  } catch (error) {
    console.error("Checkout error:", error);
    return serverError("Checkout failed");
  }
}
