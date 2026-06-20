import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { requireAdmin, serverError } from "@/lib/validation";
import { formatPrice } from "@/lib/format-currency";

export async function GET() {
  const auth = await requireAdmin();
  if (auth instanceof NextResponse) return auth;
  try {
    const sellerGroups = await prisma.product.groupBy({
      by: ["sellerId"],
      _count: { id: true },
    });

    const data = await Promise.all(
      sellerGroups.map(async (s) => {
        const productIds = (await prisma.product.findMany({ where: { sellerId: s.sellerId }, select: { id: true } })).map((p) => p.id);
        const items = await prisma.orderItem.findMany({ where: { productId: { in: productIds } } });
        const revenue = items.reduce((sum, i) => sum + i.price * i.quantity, 0);
        const categories = (await prisma.product.findMany({ where: { sellerId: s.sellerId }, select: { category: true }, distinct: ["category"] })).map((c) => c.category);
        return {
          id: s.sellerId,
          business: `Seller ${s.sellerId.slice(0, 8)}`,
          category: categories[0] || "General",
          products: s._count.id,
          revenue: formatPrice(revenue),
        };
      })
    );

    return NextResponse.json(data);
  } catch {
    return serverError("Failed to fetch sellers");
  }
}
