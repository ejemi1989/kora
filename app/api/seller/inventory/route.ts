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
      orderBy: { name: "asc" },
    });

    const items = products.map((p) => {
      const threshold = 10;
      let status: "ok" | "low" | "critical" = "ok";
      if (p.stock <= 0) status = "critical";
      else if (p.stock <= threshold) status = "low";

      return {
        id: p.id,
        name: p.name,
        emoji: "",
        category: p.category,
        stock: p.stock,
        available: p.stock,
        threshold,
        status,
      };
    });

    return NextResponse.json(items);
  } catch {
    return serverError("Failed to fetch inventory");
  }
}

export async function PATCH(request: Request) {
  try {
    const { userId } = await auth();
    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { productId, quantity } = await request.json();

    const product = await prisma.product.findFirst({
      where: { id: productId, sellerId: userId },
    });

    if (!product) {
      return NextResponse.json({ error: "Product not found" }, { status: 404 });
    }

    const updated = await prisma.product.update({
      where: { id: productId },
      data: { stock: product.stock + quantity },
    });

    return NextResponse.json({ stock: updated.stock });
  } catch {
    return serverError("Failed to update inventory");
  }
}
