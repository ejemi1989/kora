import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { cartAddSchema, validate, validationError, serverError, notFound } from "@/lib/validation";

export async function POST(request: Request) {
  try {
    const userId = request.headers.get("x-user-id");
    if (!userId) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const body = await request.json();
    body.userId = userId;

    const result = validate(cartAddSchema, body);
    if (!result.success) return validationError(result.error);

    const { productId, quantity } = result.data;

    const product = await prisma.product.findUnique({ where: { id: productId } });
    if (!product || product.status !== "ACTIVE") return notFound("Product not found or unavailable");
    if (product.stock < quantity) return validationError("Insufficient stock");

    let cart = await prisma.cart.findUnique({ where: { userId } });
    if (!cart) cart = await prisma.cart.create({ data: { userId } });

    const existingItem = await prisma.cartItem.findFirst({
      where: { cartId: cart.id, productId },
    });

    if (existingItem) {
      const newQty = existingItem.quantity + quantity;
      if (newQty > product.stock) return validationError("Insufficient stock for merged quantity");

      const updated = await prisma.cartItem.update({
        where: { id: existingItem.id },
        data: { quantity: newQty },
      });

      return NextResponse.json(updated);
    }

    const item = await prisma.cartItem.create({
      data: { cartId: cart.id, productId, quantity },
    });

    return NextResponse.json(item, { status: 201 });
  } catch {
    return serverError("Failed to add item to cart");
  }
}
