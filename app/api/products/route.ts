import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { productCreateSchema, validate, validationError, serverError, success } from "@/lib/validation";

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const category = searchParams.get("category");
    const search = searchParams.get("search");

    const where: Record<string, unknown> = { status: "ACTIVE" };

    if (category) where.category = category;
    if (search) {
      where.OR = [
        { name: { contains: search, mode: "insensitive" } },
        { description: { contains: search, mode: "insensitive" } },
      ];
    }

    const products = await prisma.product.findMany({ where, orderBy: { createdAt: "desc" } });
    return NextResponse.json(products);
  } catch {
    return serverError("Failed to fetch products");
  }
}

export async function POST(request: Request) {
  try {
    const userId = request.headers.get("x-user-id");
    if (!userId) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const body = await request.json();
    const result = validate(productCreateSchema, body);
    if (!result.success) return validationError(result.error);

    const data = result.data;
    const product = await prisma.product.create({
      data: {
        name: data.name,
        description: data.description,
        price: Number(data.price),
        stock: Number(data.stock),
        images: data.images || [],
        category: data.category,
        sellerId: data.sellerId,
      },
    });

    return success(product, 201);
  } catch {
    return serverError("Failed to create product");
  }
}
