import { prisma } from "@/lib/prisma";
import { stripe } from "@/lib/stripe";
import { emit } from "@/lib/events";

export async function createPaymentIntent(orderId: string) {
  const order = await prisma.order.findUnique({
    where: { id: orderId },
    include: { items: { include: { product: true } } },
  });

  if (!order) throw new Error("Order not found");

  const existingPayment = await prisma.payment.findUnique({ where: { orderId } });

  if (existingPayment && existingPayment.stripeId && existingPayment.status !== "FAILED") {
    const paymentIntent = await stripe.paymentIntents.retrieve(existingPayment.stripeId);
    return { payment: existingPayment, clientSecret: paymentIntent.client_secret };
  }

  const paymentIntent = await stripe.paymentIntents.create({
    amount: Math.round(order.total * 100),
    currency: "usd",
    metadata: { orderId: order.id, userId: order.userId },
  });

  const payment = await prisma.payment.upsert({
    where: { orderId },
    create: {
      orderId: order.id,
      amount: order.total,
      status: "PENDING",
      stripeId: paymentIntent.id,
    },
    update: {
      stripeId: paymentIntent.id,
      status: "PENDING",
      amount: order.total,
    },
  });

  return { payment, clientSecret: paymentIntent.client_secret };
}

export async function handlePaymentSucceeded(paymentIntent: { id: string; metadata: Record<string, string> }) {
  const orderId = paymentIntent.metadata.orderId;
  if (!orderId) throw new Error("Missing orderId in payment intent metadata");

  const payment = await prisma.payment.findFirst({
    where: { stripeId: paymentIntent.id },
  });

  if (!payment) throw new Error(`Payment not found for stripeId: ${paymentIntent.id}`);

  if (payment.status === "SUCCESS") {
    return { payment, order: await prisma.order.findUnique({ where: { id: orderId } }) };
  }

  const [updatedPayment, updatedOrder] = await prisma.$transaction([
    prisma.payment.update({
      where: { id: payment.id },
      data: { status: "SUCCESS" },
    }),
    prisma.order.update({
      where: { id: orderId },
      data: { status: "PAID" },
    }),
  ]);

  await emit("PAYMENT_SUCCEEDED", {
    orderId,
    paymentId: updatedPayment.id,
    stripeId: paymentIntent.id,
  });

  return { payment: updatedPayment, order: updatedOrder };
}

export async function handlePaymentFailed(paymentIntent: { id: string }) {
  const payment = await prisma.payment.findFirst({
    where: { stripeId: paymentIntent.id },
  });

  if (!payment) throw new Error(`Payment not found for stripeId: ${paymentIntent.id}`);

  if (payment.status !== "PENDING") return { payment };

  const updatedPayment = await prisma.payment.update({
    where: { id: payment.id },
    data: { status: "FAILED" },
  });

  return { payment: updatedPayment };
}
