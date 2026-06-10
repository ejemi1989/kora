import { prisma } from "@/lib/prisma";
import { on } from "@/lib/events";

export async function createNotification(userId: string, type: string, message: string) {
  return prisma.notification.create({
    data: { userId, type, message },
  });
}

export async function getUserNotifications(userId: string) {
  return prisma.notification.findMany({
    where: { userId },
    orderBy: { createdAt: "desc" },
    take: 50,
  });
}

export function registerNotificationHandlers() {
  on("PAYMENT_SUCCEEDED", async (payload) => {
    const order = await prisma.order.findUnique({
      where: { id: payload.orderId },
      select: { userId: true },
    });
    if (!order) return;

    await createNotification(
      order.userId,
      "payment_success",
      `Payment succeeded for order ${payload.orderId.slice(0, 8)}`
    );

    const payment = await prisma.payment.findUnique({
      where: { id: payload.paymentId },
      include: { order: { select: { userId: true } } },
    });
    if (payment?.order?.userId) {
      const sellerIds = await prisma.orderItem.findMany({
        where: { orderId: payload.orderId },
        include: { product: { select: { sellerId: true } } },
      });
      const uniqueSellerIds = [...new Set(sellerIds.map((i) => i.product.sellerId))];
      for (const sellerId of uniqueSellerIds) {
        await createNotification(sellerId, "new_order", `New order received: ${payload.orderId.slice(0, 8)}`);
      }
    }
  });
}
