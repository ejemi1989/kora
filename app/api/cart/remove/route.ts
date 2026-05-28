import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { serverError, notFound } from "@/lib/validation";

export async function DELETE(request: Request) {
  try {
    const userId = request.headers.get("x-user-id");
    if (!userId) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const { cartItemId } = await request.json();
    if (!cartItemId) return NextResponse.json({ error: "cartItemId is required" }, { status: 400 });

    const existing = await prisma.cartItem.findUnique({ where: { id: cartItemId } });
    if (!existing) return notFound("Cart item not found");

    await prisma.cartItem.delete({ where: { id: cartItemId } });
    return NextResponse.json({ message: "Item removed from cart" });
  } catch {
    return serverError("Failed to remove cart item");
  }
}
