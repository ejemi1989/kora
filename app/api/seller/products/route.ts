import { NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";
import { prisma } from "@/lib/prisma";
import { serverError } from "@/lib/validation";

export async function GET() {
  try {
    const { userId } = await auth();
    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const products = await prisma.product.findMany({
      where: { sellerId: userId },
      orderBy: { createdAt: "desc" },
    });

    const mapped = products.map((p) => ({
      id: p.id,
      name: p.name,
      price: p.price,
      stock: p.stock,
      unit: p.unit,
      category: p.category,
      status: p.status === "ACTIVE" ? "active" : p.status === "DRAFT" ? "draft" : "out_of_stock",
      images: p.images,
      image: p.images[0] || null,
      sales: 0,
      rating: p.rating,
    }));

    return NextResponse.json(mapped);
  } catch (error) {
    console.error("Products GET error:", error);
    return NextResponse.json(
      { success: false, error: error instanceof Error ? error.message : "Failed to fetch products" },
      { status: 500 }
    );
  }
}

export async function POST(request: Request) {
  try {
    const { userId } = await auth();
    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await request.json();
    const { name, price, stock, unit, category, imageUrl } = body;

    if (!name?.trim() || price == null) {
      return NextResponse.json({ error: "Name and price are required" }, { status: 400 });
    }

    const product = await prisma.product.create({
      data: {
        sellerId: userId,
        name: name.trim(),
        description: name.trim(),
        price: parseFloat(price),
        stock: parseInt(stock || "0", 10),
        category: category || "Spices & Seasonings",
        unit: unit || "1kg",
        images: imageUrl ? [imageUrl] : [],
        status: "DRAFT",
      },
    });

    return NextResponse.json({
      id: product.id,
      name: product.name,
      price: product.price,
      stock: product.stock,
      unit: product.unit,
      category: product.category,
      status: "draft",
      images: product.images,
      image: product.images[0] || null,
      sales: 0,
      rating: product.rating,
    });
  } catch (error) {
    console.error("Products POST error:", error);
    return NextResponse.json(
      { success: false, error: error instanceof Error ? error.message : "Failed to create product" },
      { status: 500 }
    );
  }
}

export async function PATCH(request: Request) {
  try {
    const { userId } = await auth();
    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await request.json();
    const { id, name, price, stock, unit, category, imageUrl, status } = body;

    if (!id) {
      return NextResponse.json({ error: "Product ID is required" }, { status: 400 });
    }

    const existing = await prisma.product.findFirst({
      where: { id, sellerId: userId },
    });

    if (!existing) {
      return NextResponse.json({ error: "Product not found" }, { status: 404 });
    }

    const updateData: Record<string, unknown> = {};
    if (name !== undefined) updateData.name = name.trim();
    if (price !== undefined) updateData.price = parseFloat(price);
    if (stock !== undefined) updateData.stock = parseInt(stock, 10);
    if (category !== undefined) updateData.category = category;
    if (unit !== undefined) updateData.unit = unit;
    if (status !== undefined) {
      updateData.status = status === "active" ? "ACTIVE" : status === "draft" ? "DRAFT" : "OUT_OF_STOCK";
    }
    if (imageUrl !== undefined) {
      updateData.images = imageUrl ? [imageUrl] : [];
    }

    const updated = await prisma.product.update({
      where: { id },
      data: updateData,
    });

    return NextResponse.json({
      id: updated.id,
      name: updated.name,
      price: updated.price,
      stock: updated.stock,
      unit: updated.unit,
      category: updated.category,
      status: updated.status === "ACTIVE" ? "active" : updated.status === "DRAFT" ? "draft" : "out_of_stock",
      images: updated.images,
      image: updated.images[0] || null,
      sales: 0,
      rating: updated.rating,
    });
  } catch (error) {
    console.error("Products PATCH error:", error);
    return NextResponse.json(
      { success: false, error: error instanceof Error ? error.message : "Failed to update product" },
      { status: 500 }
    );
  }
}

export async function DELETE(request: Request) {
  try {
    const { userId } = await auth();
    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { id } = await request.json();

    if (!id) {
      return NextResponse.json({ error: "Product ID is required" }, { status: 400 });
    }

    const existing = await prisma.product.findFirst({
      where: { id, sellerId: userId },
    });

    if (!existing) {
      return NextResponse.json({ error: "Product not found" }, { status: 404 });
    }

    await prisma.product.delete({ where: { id } });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Products DELETE error:", error);
    return NextResponse.json(
      { success: false, error: error instanceof Error ? error.message : "Failed to delete product" },
      { status: 500 }
    );
  }
}
