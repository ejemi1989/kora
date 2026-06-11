import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { serverError } from "@/lib/validation";

export async function GET() {
  try {
    const products = await prisma.product.findMany({
      orderBy: { createdAt: "desc" },
      include: {
        orderItems: true,
      },
    });
    const data = products.map((p) => ({
      id: p.id,
      name: p.name,
      seller: p.sellerId.slice(0, 8),
      category: p.category,
      price: `₦${p.price.toLocaleString()}`,
      stock: p.stock,
      sales: p.orderItems.reduce((sum, oi) => sum + oi.quantity, 0),
      createdAt: p.createdAt.toISOString().split("T")[0],
      status: (p.status === "ACTIVE" ? "active" : p.status === "FLAGGED" ? "flagged" : "pending") as "active" | "pending" | "flagged",
    }));
    return NextResponse.json(data);
  } catch {
    return serverError("Failed to fetch products");
  }
}

export async function PATCH(req: Request) {
  try {
    const { id, status } = await req.json();
    const product = await prisma.product.findUnique({ where: { id } });
    if (!product) return NextResponse.json({ error: "Product not found" }, { status: 404 });

    const statusMap: Record<string, string> = {
      active: "ACTIVE",
      pending: "PENDING",
      flagged: "FLAGGED",
      approved: "ACTIVE",
      rejected: "REJECTED",
    };
    const newStatus = statusMap[status];
    if (!newStatus) return NextResponse.json({ error: "Invalid status" }, { status: 400 });

    await prisma.product.update({ where: { id }, data: { status: newStatus } });
    return NextResponse.json({ success: true });
  } catch {
    return serverError("Failed to update product");
  }
}
