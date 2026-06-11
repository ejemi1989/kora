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
      select: { id: true, price: true, stock: true, status: true, rating: true },
    });

    const productIds = products.map((p) => p.id);
    const activeProducts = products.filter((p) => p.status === "ACTIVE");

    const orderItems = await prisma.orderItem.findMany({
      where: { productId: { in: productIds } },
      include: {
        order: { select: { id: true, status: true, createdAt: true, userId: true } },
        product: { select: { name: true } },
      },
    });

    const confirmedItems = orderItems.filter(
      (oi) => oi.order.status !== "CANCELLED"
    );

    const totalRevenue = confirmedItems.reduce(
      (sum, oi) => sum + oi.price * oi.quantity,
      0
    );

    const orderIds = new Set(confirmedItems.map((oi) => oi.order.id));
    const totalOrders = orderIds.size;

    const avgRating =
      activeProducts.length > 0
        ? activeProducts.reduce((sum, p) => sum + p.rating, 0) /
          activeProducts.length
        : 0;

    const recentOrderIds = [...orderIds].slice(0, 5);
    const recentOrders = await prisma.order.findMany({
      where: { id: { in: recentOrderIds } },
      include: {
        user: { select: { name: true } },
        items: {
          where: { productId: { in: productIds } },
          include: { product: { select: { name: true } } },
        },
      },
      orderBy: { createdAt: "desc" },
      take: 5,
    });

    const recentOrdersFormatted = recentOrders.map((o) => {
      const firstItem = o.items[0];
      return {
        id: o.id,
        customer: o.user.name,
        items: o.items.length,
        product: firstItem?.product.name ?? "",
        total: o.items.reduce((sum, i) => sum + i.price * i.quantity, 0),
        date: o.createdAt.toISOString().slice(0, 10),
        status: o.status.toLowerCase(),
      };
    });

    const now = new Date();
    const monthlyRevenue: { month: string; revenue: number; orders: number; fill: boolean; height: number }[] = [];

    for (let i = 11; i >= 0; i--) {
      const d = new Date(now.getFullYear(), now.getMonth() - i, 1);
      const monthLabel = d.toLocaleString("en-US", { month: "short" });

      const monthItems = confirmedItems.filter((oi) => {
        const oiDate = new Date(oi.order.createdAt);
        return (
          oiDate.getFullYear() === d.getFullYear() &&
          oiDate.getMonth() === d.getMonth()
        );
      });

      const revenue = monthItems.reduce(
        (sum, oi) => sum + oi.price * oi.quantity,
        0
      );
      const orderCount = new Set(monthItems.map((oi) => oi.order.id)).size;

      const maxRevenue = 380000;
      const height = maxRevenue > 0 ? Math.round((revenue / maxRevenue) * 100) : 0;

      monthlyRevenue.push({
        month: monthLabel,
        revenue,
        orders: orderCount,
        fill: i >= 6 ? false : true,
        height: Math.max(height, 4),
      });
    }

    const productSales = new Map<
      string,
      { name: string; totalSold: number; productId: string }
    >();

    for (const oi of confirmedItems) {
      if (!productSales.has(oi.productId)) {
        productSales.set(oi.productId, {
          name: oi.product.name,
          totalSold: 0,
          productId: oi.productId,
        });
      }
      productSales.get(oi.productId)!.totalSold += oi.quantity;
    }

    const topProducts = [...productSales.values()]
      .sort((a, b) => b.totalSold - a.totalSold)
      .slice(0, 4)
      .map((p) => ({
        name: p.name,
        sales: `${p.totalSold} sold`,
      }));

    return NextResponse.json({
      stats: [
        {
          label: "Total Revenue",
          value: `₦${totalRevenue.toLocaleString()}`,
          delta: "↑ Real-time",
          deltaUp: true,
        },
        {
          label: "Orders (30d)",
          value: `${totalOrders}`,
          delta: "↑ Lifetime",
          deltaUp: true,
        },
        {
          label: "Active Products",
          value: `${activeProducts.length}`,
          delta: `↑ ${activeProducts.length} total`,
          deltaUp: true,
        },
        {
          label: "Avg. Rating",
          value: `${avgRating.toFixed(1)} ★`,
          delta: "↑ From orders",
          deltaUp: true,
        },
      ],
      recentOrders: recentOrdersFormatted,
      barChart: monthlyRevenue,
      topProducts,
    });
  } catch {
    return serverError("Failed to fetch seller overview");
  }
}
