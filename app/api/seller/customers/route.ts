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
      select: { id: true, name: true },
    });

    const productIds = products.map((p) => p.id);

    const orderItems = await prisma.orderItem.findMany({
      where: { productId: { in: productIds } },
      include: {
        order: {
          select: { id: true, status: true, createdAt: true, userId: true },
        },
        product: { select: { name: true } },
      },
      orderBy: { order: { createdAt: "desc" } },
    });

    const confirmedItems = orderItems.filter(
      (oi) => oi.order.status !== "CANCELLED"
    );

    const userIds = [...new Set(confirmedItems.map((oi) => oi.order.userId))];

    const users = await prisma.user.findMany({
      where: { id: { in: userIds } },
      select: { id: true, name: true, email: true },
    });

    const userMap = new Map(users.map((u) => [u.id, u]));

    const customerGroups = new Map<
      string,
      {
        orders: number;
        spent: number;
        last: string;
        history: { order: string; product: string; amount: string; status: string; statusClass: string; date: string }[];
      }
    >();

    for (const oi of confirmedItems) {
      const uid = oi.order.userId;
      if (!customerGroups.has(uid)) {
        customerGroups.set(uid, { orders: 0, spent: 0, last: "", history: [] });
      }
      const entry = customerGroups.get(uid)!;
      entry.orders++;
      entry.spent += oi.price * oi.quantity;
      const dateStr = oi.order.createdAt.toISOString().slice(0, 10);
      if (!entry.last || dateStr > entry.last) entry.last = dateStr;
    }

    const uniqueOrders = new Map<string, typeof confirmedItems[0][]>();
    for (const oi of confirmedItems) {
      const key = `${oi.order.userId}-${oi.order.id}`;
      if (!uniqueOrders.has(key)) uniqueOrders.set(key, []);
      uniqueOrders.get(key)!.push(oi);
    }

    for (const [, items] of uniqueOrders) {
      const uid = items[0].order.userId;
      const entry = customerGroups.get(uid)!;
      const total = items.reduce((s, i) => s + i.price * i.quantity, 0);
      const firstItem = items[0];
      entry.history.push({
        order: firstItem.order.id.slice(0, 8),
        product: items.map((i) => i.product.name).join(", "),
        amount: `₦${total.toLocaleString()}`,
        status: firstItem.order.status.charAt(0) + firstItem.order.status.slice(1).toLowerCase(),
        statusClass: `badge-${firstItem.order.status.toLowerCase()}`,
        date: firstItem.order.createdAt.toISOString().slice(0, 10),
      });
    }

    const backgroundColors = [
      "#EBF5FF", "#FEF3E8", "#F0E6FF", "#E6F7F0", "#FFF0F0",
      "#F0F0FF", "#FFF8E1", "#E8F5E9", "#FCE4EC", "#E0F7FA",
    ];
    const foregroundColors = [
      "#1A73E8", "#E67E22", "#8E44AD", "#27AE60", "#E74C3C",
      "#3F51B5", "#F39C12", "#2E7D32", "#C2185B", "#00838F",
    ];

    const customers = Array.from(customerGroups.entries())
      .map(([uid, data], index) => {
        const user = userMap.get(uid);
        const name = user?.name ?? "Unknown";
        const email = user?.email ?? "";
        const nameParts = name.split(" ");
        const initials = nameParts.map((n) => n[0]).join("").toUpperCase().slice(0, 2);
        const ci = index % backgroundColors.length;
        return {
          id: uid,
          name,
          email,
          phone: "",
          location: "",
          status: data.orders > 1 ? "Regular" : "New",
          initials,
          bg: backgroundColors[ci],
          fg: foregroundColors[ci],
          orders: data.orders,
          spent: Math.round(data.spent),
          last: data.last,
          history: data.history.sort((a, b) => b.date.localeCompare(a.date)),
        };
      })
      .sort((a, b) => b.spent - a.spent);

    return NextResponse.json(customers);
  } catch {
    return serverError("Failed to fetch customers");
  }
}
