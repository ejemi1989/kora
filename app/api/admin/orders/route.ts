import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { serverError, notFound } from "@/lib/validation";

export async function GET() {
  try {
    const orders = await prisma.order.findMany({
      orderBy: { createdAt: "desc" },
      include: {
        user: { select: { name: true } },
        items: { select: { quantity: true } },
        payments: { select: { status: true, method: true } },
      },
    });
    const data = orders.map((o) => {
      const statusLabels: Record<string, string> = {
        PENDING: "pending",
        PAID: "confirmed",
        PROCESSING: "confirmed",
        SHIPPED: "shipped",
        IN_TRANSIT: "shipped",
        DELIVERED: "delivered",
        CANCELLED: "cancelled",
      };
      const payment = o.payments[0];
      return {
        id: o.id.slice(0, 8),
        customer: o.user.name,
        items: o.items.reduce((sum, i) => sum + i.quantity, 0),
        total: `₦${o.total.toLocaleString()}`,
        payment: payment?.method || "N/A",
        date: o.createdAt.toISOString().split("T")[0],
        status: statusLabels[o.status] || "pending",
        trackingNumber: o.trackingNumber || undefined,
      };
    });
    return NextResponse.json(data);
  } catch {
    return serverError("Failed to fetch orders");
  }
}

export async function PATCH(req: Request) {
  try {
    const { id, trackingNumber } = await req.json();
    const order = await prisma.order.findFirst({
      where: { id: { startsWith: id } },
    });
    if (!order) return notFound("Order not found");
    await prisma.order.update({
      where: { id: order.id },
      data: { trackingNumber },
    });
    return NextResponse.json({ success: true });
  } catch {
    return serverError("Failed to update order");
  }
}
