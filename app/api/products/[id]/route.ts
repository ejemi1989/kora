import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { productUpdateSchema, validate, validationError, serverError, notFound, success } from "@/lib/validation";

export async function GET(_request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;
    const product = await prisma.product.findUnique({ where: { id } });
    if (!product) return notFound("Product not found");
    return success(product);
  } catch {
    return serverError("Failed to fetch product");
  }
}

export async function PATCH(request: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const userId = request.headers.get("x-user-id");
    if (!userId) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const { id } = await params;
    const body = await request.json();
    const result = validate(productUpdateSchema, body);
    if (!result.success) return validationError(result.error);

    const existing = await prisma.product.findUnique({ where: { id } });
    if (!existing) return notFound("Product not found");

    const data = result.data;
    const product = await prisma.product.update({
      where: { id },
      data: {
        ...(data.name !== undefined && { name: data.name }),
        ...(data.description !== undefined && { description: data.description }),
        ...(data.price !== undefined && { price: Number(data.price) }),
        ...(data.stock !== undefined && { stock: Number(data.stock) }),
        ...(data.images !== undefined && { images: data.images }),
        ...(data.category !== undefined && { category: data.category }),
        ...(data.status !== undefined && { status: data.status }),
        ...(data.rating !== undefined && { rating: Number(data.rating) }),
      },
    });

    return success(product);
  } catch {
    return serverError("Failed to update product");
  }
}

export async function DELETE(_request: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;
    const existing = await prisma.product.findUnique({ where: { id } });
    if (!existing) return notFound("Product not found");

    const product = await prisma.product.update({
      where: { id },
      data: { status: "ARCHIVED" },
    });

    return success(product);
  } catch {
    return serverError("Failed to delete product");
  }
}
