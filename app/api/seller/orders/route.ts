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

    const productIds = await prisma.product.findMany({
      where: { sellerId: userId },
      select: { id: true },
    }).then((ps) => ps.map((p) => p.id));

    if (productIds.length === 0) {
      return NextResponse.json([]);
    }

    const orderItems = await prisma.orderItem.findMany({
      where: { productId: { in: productIds } },
      include: {
        order: {
          include: {
            user: { select: { name: true } },
          },
        },
        product: { select: { name: true } },
      },
      orderBy: { order: { createdAt: "desc" } },
    });

    const orderMap = new Map<
      string,
      {
        id: string;
        customer: string;
        items: number;
        product: string;
        total: number;
        date: string;
        status: string;
        trackingNumber: string | null;
        createdAt: Date;
      }
    >();

    for (const oi of orderItems) {
      const orderId = oi.order.id;
      if (!orderMap.has(orderId)) {
        orderMap.set(orderId, {
          id: orderId,
          customer: oi.order.user.name,
          items: 0,
          product: oi.product.name,
          total: 0,
          date: oi.order.createdAt.toISOString().slice(0, 10),
          status: oi.order.status.toLowerCase(),
          trackingNumber: oi.order.trackingNumber,
          createdAt: oi.order.createdAt,
        });
      }
      const entry = orderMap.get(orderId)!;
      entry.items += oi.quantity;
      entry.total += oi.price * oi.quantity;
    }

    const sorted = [...orderMap.values()].sort(
      (a, b) => b.createdAt.getTime() - a.createdAt.getTime()
    );
    const orders = sorted.map(({ id, customer, items, product, total, date, status, trackingNumber }) => ({
      id, customer, items, product, total, date, status, trackingNumber,
    }));

    return NextResponse.json(orders);
  } catch {
    return serverError("Failed to fetch seller orders");
  }
}

export async function PATCH(request: Request) {
  try {
    const { userId } = await auth();
    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { orderId, status, trackingNumber } = await request.json();

    const productIds = await prisma.product.findMany({
      where: { sellerId: userId },
      select: { id: true },
    }).then((ps) => ps.map((p) => p.id));

    const orderItem = await prisma.orderItem.findFirst({
      where: { orderId, productId: { in: productIds } },
    });

    if (!orderItem) {
      return NextResponse.json({ error: "Order not found" }, { status: 404 });
    }

    const updateData: Record<string, string> = {};
    if (status) updateData.status = status.toUpperCase();
    if (trackingNumber !== undefined) updateData.trackingNumber = trackingNumber;

    if (Object.keys(updateData).length > 0) {
      await prisma.order.update({
        where: { id: orderId },
        data: updateData,
      });
    }

    return NextResponse.json({ success: true });
  } catch {
    return serverError("Failed to update order");
  }
}
