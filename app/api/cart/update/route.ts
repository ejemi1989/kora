import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { validationError, serverError, notFound } from "@/lib/validation";

export async function PATCH(request: Request) {
  try {
    const userId = request.headers.get("x-user-id");
    if (!userId) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const { cartItemId, quantity } = await request.json();
    if (!cartItemId || quantity === undefined) {
      return NextResponse.json({ error: "cartItemId and quantity are required" }, { status: 400 });
    }

    const qty = Number(quantity);
    if (qty < 1) return validationError("Quantity must be at least 1");

    const existing = await prisma.cartItem.findUnique({
      where: { id: cartItemId },
      include: { product: true },
    });

    if (!existing) return notFound("Cart item not found");
    if (qty > existing.product.stock) return validationError("Insufficient stock");

    const updated = await prisma.cartItem.update({
      where: { id: cartItemId },
      data: { quantity: qty },
    });

    return NextResponse.json(updated);
  } catch {
    return serverError("Failed to update cart item");
  }
}
