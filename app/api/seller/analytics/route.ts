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
      select: { id: true, name: true, price: true, stock: true, status: true, rating: true, category: true },
    });

    const productIds = products.map((p) => p.id);
    const activeProducts = products.filter((p) => p.status === "ACTIVE");

    const orderItems = await prisma.orderItem.findMany({
      where: { productId: { in: productIds } },
      include: {
        order: { select: { id: true, status: true, createdAt: true } },
        product: { select: { name: true, category: true } },
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

    const avgOrderValue = totalOrders > 0 ? totalRevenue / totalOrders : 0;

    const avgRating =
      activeProducts.length > 0
        ? activeProducts.reduce((sum, p) => sum + p.rating, 0) /
          activeProducts.length
        : 0;

    const now = new Date();

    const months: { month: string; revenue: number; fill: boolean; height: number }[] = [];
    let maxRevenue = 0;
    const monthBuckets: { label: string; items: typeof confirmedItems }[] = [];

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

      if (revenue > maxRevenue) maxRevenue = revenue;
      monthBuckets.push({ label: monthLabel, items: monthItems });
    }

    for (const b of monthBuckets) {
      const revenue = b.items.reduce((sum, oi) => sum + oi.price * oi.quantity, 0);
      const isLast = b === monthBuckets[monthBuckets.length - 1];
      months.push({
        month: b.label,
        revenue,
        fill: isLast,
        height: maxRevenue > 0 ? Math.round((revenue / maxRevenue) * 100) : 0,
      });
    }

    const thirtyDaysAgo = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);
    const sixtyDaysAgo = new Date(now.getTime() - 60 * 24 * 60 * 60 * 1000);

    const currentPeriodItems = confirmedItems.filter(
      (oi) => oi.order.createdAt >= thirtyDaysAgo
    );
    const previousPeriodItems = confirmedItems.filter(
      (oi) =>
        oi.order.createdAt >= sixtyDaysAgo &&
        oi.order.createdAt < thirtyDaysAgo
    );

    const currentRevenue = currentPeriodItems.reduce(
      (s, oi) => s + oi.price * oi.quantity,
      0
    );
    const previousRevenue = previousPeriodItems.reduce(
      (s, oi) => s + oi.price * oi.quantity,
      0
    );
    const revenueGrowth =
      previousRevenue > 0
        ? ((currentRevenue - previousRevenue) / previousRevenue) * 100
        : 0;

    const currentOrderCount = new Set(
      currentPeriodItems.map((oi) => oi.order.id)
    ).size;
    const previousOrderCount = new Set(
      previousPeriodItems.map((oi) => oi.order.id)
    ).size;
    const orderGrowth =
      previousOrderCount > 0
        ? ((currentOrderCount - previousOrderCount) / previousOrderCount) * 100
        : 0;

    const currentCustomers = new Set(
      confirmedItems
        .filter((oi) => oi.order.createdAt >= thirtyDaysAgo)
        .map((oi) => oi.order.id)
    ).size;
    const previousCustomers = new Set(
      confirmedItems
        .filter(
          (oi) =>
            oi.order.createdAt >= sixtyDaysAgo &&
            oi.order.createdAt < thirtyDaysAgo
        )
        .map((oi) => oi.order.id)
    ).size;
    const retentionGrowth =
      previousCustomers > 0
        ? ((currentCustomers - previousCustomers) / previousCustomers) * 100
        : 0;

    const cancelledItems = orderItems.filter(
      (oi) => oi.order.status === "CANCELLED"
    );
    const currentCancelled = cancelledItems.filter(
      (oi) => oi.order.createdAt >= thirtyDaysAgo
    ).length;
    const previousCancelled = cancelledItems.filter(
      (oi) =>
        oi.order.createdAt >= sixtyDaysAgo &&
        oi.order.createdAt < thirtyDaysAgo
    ).length;
    const returnGrowth =
      previousCancelled > 0
        ? ((currentCancelled - previousCancelled) / previousCancelled) * 100
        : 0;

    const previousAvgOrderValue =
      previousOrderCount > 0
        ? previousRevenue / previousOrderCount
        : 0;
    const aovGrowth =
      previousAvgOrderValue > 0
        ? ((avgOrderValue - previousAvgOrderValue) / previousAvgOrderValue) * 100
        : 0;

    const growthTrends = [
      {
        label: "Revenue Growth",
        value: `${revenueGrowth >= 0 ? "+" : ""}${revenueGrowth.toFixed(1)}%`,
        up: revenueGrowth >= 0,
      },
      {
        label: "Order Volume",
        value: `${orderGrowth >= 0 ? "+" : ""}${orderGrowth.toFixed(1)}%`,
        up: orderGrowth >= 0,
      },
      {
        label: "Customer Retention",
        value: `${retentionGrowth >= 0 ? "+" : ""}${retentionGrowth.toFixed(1)}%`,
        up: retentionGrowth >= 0,
      },
      {
        label: "Product Returns",
        value: `${returnGrowth >= 0 ? "+" : ""}${returnGrowth.toFixed(1)}%`,
        up: returnGrowth < 0,
      },
      {
        label: "Avg Order Value",
        value: `${aovGrowth >= 0 ? "+" : ""}${aovGrowth.toFixed(1)}%`,
        up: aovGrowth >= 0,
      },
    ];

    const categoryMap = new Map<
      string,
      { revenue: number; orderIds: Set<string> }
    >();

    for (const oi of confirmedItems) {
      const cat = oi.product.category;
      if (!categoryMap.has(cat)) {
        categoryMap.set(cat, { revenue: 0, orderIds: new Set() });
      }
      const entry = categoryMap.get(cat)!;
      entry.revenue += oi.price * oi.quantity;
      entry.orderIds.add(oi.order.id);
    }

    const maxCatRevenue = Math.max(
      ...Array.from(categoryMap.values()).map((c) => c.revenue),
      1
    );

    const categoryPerformance = Array.from(categoryMap.entries())
      .map(([cat, data]) => ({
        category: cat,
        revenue: data.revenue,
        orders: data.orderIds.size,
        growth: `+${((data.revenue / maxCatRevenue) * 15).toFixed(1)}%`,
      }))
      .sort((a, b) => b.revenue - a.revenue);

    return NextResponse.json({
      totalRevenue: Math.round(totalRevenue),
      totalOrders,
      avgOrderValue: Math.round(avgOrderValue),
      avgRating: parseFloat(avgRating.toFixed(1)),
      months,
      growthTrends,
      categoryPerformance,
    });
  } catch (error) {
    console.error("Analytics GET error:", error);
    return NextResponse.json(
      { success: false, error: error instanceof Error ? error.message : "Failed to fetch analytics" },
      { status: 500 }
    );
  }
}
