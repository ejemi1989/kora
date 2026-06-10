import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import Stripe from "stripe";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!);
const endpointSecret = process.env.STRIPE_WEBHOOK_SECRET!;

export async function POST(request: Request) {
  const body = await request.text();
  const signature = request.headers.get("stripe-signature");

  if (!signature) {
    return NextResponse.json({ error: "No signature" }, { status: 400 });
  }

  let event: Stripe.Event;
  try {
    event = stripe.webhooks.constructEvent(body, signature, endpointSecret);
  } catch {
    return NextResponse.json({ error: "Invalid signature" }, { status: 400 });
  }

  if (event.type === "checkout.session.completed") {
    const session = event.data.object as Stripe.Checkout.Session;
    const orderId = session.metadata?.orderId;
    const userId = session.metadata?.userId;

    if (!orderId || !userId) {
      return NextResponse.json({ error: "Missing metadata" }, { status: 400 });
    }

    const now = new Date().toLocaleString("en-US", {
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });

    await prisma.$transaction([
      prisma.order.update({
        where: { id: orderId },
        data: { status: "PROCESSING" },
      }),
      prisma.payment.create({
        data: {
          orderId,
          amount: session.amount_total ? session.amount_total / 100 : 0,
          status: "SUCCESS",
          stripeId: session.id,
          method: "card",
        },
      }),
      prisma.trackingEvent.createMany({
        data: [
          {
            orderId,
            step: 1,
            label: "Order Confirmed",
            description: "Payment verified successfully",
            time: now,
          },
          {
            orderId,
            step: 2,
            label: "Processing",
            description: "Your order is being prepared at the warehouse",
            time: now,
          },
        ],
      }),
      prisma.notification.create({
        data: {
          userId,
          type: "order",
          message: `Order ${orderId} confirmed — payment received. Your items are now being processed.`,
        },
      }),
    ]);
  }

  return NextResponse.json({ received: true });
}
