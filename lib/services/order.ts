import { prisma } from "@/lib/prisma";
import { emit } from "@/lib/events";
import type { OrderStatus } from "@/lib/generated/prisma/client";

interface CreateOrderInput {
  userId: string;
  items: { productId: string; quantity: number; price: number }[];
  total: number;
}

export async function createOrder(input: CreateOrderInput) {
  const order = await prisma.order.create({
    data: {
      userId: input.userId,
      total: input.total,
      status: "PENDING",
      items: {
        create: input.items.map((item) => ({
          productId: item.productId,
          quantity: item.quantity,
          price: item.price,
        })),
      },
    },
    include: { items: true },
  });

  await emit("ORDER_CREATED", {
    orderId: order.id,
    userId: order.userId,
    total: order.total,
  });

  return order;
}

export async function updateOrderStatus(orderId: string, status: OrderStatus) {
  const order = await prisma.order.update({
    where: { id: orderId },
    data: { status },
  });

  if (status === "SHIPPED" && order.trackingNumber) {
    await emit("ORDER_SHIPPED", {
      orderId: order.id,
      trackingNumber: order.trackingNumber,
    });
  }

  return order;
}

export async function getOrderById(orderId: string) {
  return prisma.order.findUnique({
    where: { id: orderId },
    include: { items: true, payments: true },
  });
}
