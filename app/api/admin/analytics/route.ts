import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { serverError } from "@/lib/validation";

export async function GET() {
  try {
    const now = new Date();
    const prevMonthStart = new Date(now.getFullYear(), now.getMonth() - 1, 1);
    const prevMonthEnd = new Date(now.getFullYear(), now.getMonth(), 1);

    const [totalRevenue, totalUsers, prevRevenue, prevUsers] = await Promise.all([
      prisma.payment.aggregate({ where: { status: "SUCCESS" }, _sum: { amount: true } }),
      prisma.user.count(),
      prisma.payment.aggregate({
        where: { status: "SUCCESS", createdAt: { gte: prevMonthStart, lt: prevMonthEnd } },
        _sum: { amount: true },
      }),
      prisma.user.count({ where: { createdAt: { lt: prevMonthEnd } } }),
    ]);

    const prevRevVal = prevRevenue._sum.amount || 0;
    const gmvDelta = prevRevVal > 0 ? ((totalRevenue._sum.amount || 0) - prevRevVal) / prevRevVal * 100 : 0;

    const successfulCount = await prisma.payment.count({ where: { status: "SUCCESS" } });
    const aov = successfulCount > 0 ? (totalRevenue._sum.amount || 0) / successfulCount : 0;

    const prevAovPayments = await prisma.payment.findMany({
      where: { status: "SUCCESS", createdAt: { gte: prevMonthStart, lt: prevMonthEnd } },
    });
    const prevAovTotal = prevAovPayments.reduce((s, p) => s + p.amount, 0);
    const prevAov = prevAovPayments.length > 0 ? prevAovTotal / prevAovPayments.length : 0;
    const aovDelta = prevAov > 0 ? ((aov - prevAov) / prevAov) * 100 : 0;

    const withOrders = await prisma.user.count({ where: { orders: { some: {} } } });
    const conversion = totalUsers > 0 ? withOrders / totalUsers * 100 : 0;

    const prevWithOrders = await prisma.user.count({ where: { createdAt: { lt: prevMonthEnd }, orders: { some: {} } } });
    const prevConversion = prevUsers > 0 ? prevWithOrders / prevUsers * 100 : 0;
    const convDelta = prevConversion > 0 ? conversion - prevConversion : 0;

    const repeatBuyers = await prisma.user.count({
      where: { orders: { some: {} } },
    });
    const prevRepeatBuyers = await prisma.user.count({
      where: { createdAt: { lt: prevMonthEnd }, orders: { some: {} } },
    });
    const prevRepeatRate = prevUsers > 0 ? prevRepeatBuyers / prevUsers * 100 : 0;
    const repeatRate = totalUsers > 0 ? repeatBuyers / totalUsers * 100 : 0;
    const repeatDelta = prevRepeatRate > 0 ? repeatRate - prevRepeatRate : 0;

    const mini = [
      { label: "GMV", value: `₦${(totalRevenue._sum.amount || 0).toLocaleString()}`, delta: `${gmvDelta >= 0 ? "↑" : "↓"} ${Math.abs(gmvDelta).toFixed(1)}%`, color: gmvDelta >= 0 ? "var(--success)" : "var(--danger)", deltaUp: gmvDelta >= 0 },
      { label: "AOV", value: `₦${aov.toFixed(0)}`, delta: `${aovDelta >= 0 ? "↑" : "↓"} ${Math.abs(aovDelta).toFixed(1)}%`, color: "var(--success)", deltaUp: aovDelta >= 0 },
      { label: "Conversion", value: `${conversion.toFixed(1)}%`, delta: `${convDelta >= 0 ? "↑" : "↓"} ${Math.abs(convDelta).toFixed(1)}%`, color: "var(--body)", deltaUp: convDelta >= 0 },
      { label: "Repeat Rate", value: `${repeatRate.toFixed(1)}%`, delta: `${repeatDelta >= 0 ? "↑" : "↓"} ${Math.abs(repeatDelta).toFixed(1)}%`, color: "var(--success)", deltaUp: repeatDelta >= 0 },
    ];

    const categoryAgg = await prisma.product.groupBy({
      by: ["category"],
      _count: { id: true },
    });
    const categories = await Promise.all(
      categoryAgg.map(async (c) => {
        const productIds = (await prisma.product.findMany({ where: { category: c.category }, select: { id: true } })).map((p) => p.id);
        const items = await prisma.orderItem.findMany({ where: { productId: { in: productIds } } });
        const revenue = items.reduce((sum, i) => sum + i.price * i.quantity, 0);
        const orderCount = [...new Set(items.map((i) => i.orderId))].length;
        return { category: c.category, orders: orderCount, revenue: `₦${revenue.toLocaleString()}` };
      })
    );

    return NextResponse.json({ mini, categories });
  } catch {
    return serverError("Failed to fetch analytics");
  }
}
