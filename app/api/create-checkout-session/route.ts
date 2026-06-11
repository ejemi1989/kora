import { auth } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { serverError } from "@/lib/validation";
import Stripe from "stripe";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!);

function generateOrderId(): string {
  const num = Math.floor(1000 + Math.random() * 9000);
  return `NP-${num}`;
}

export async function POST(request: Request) {
  try {
    const { userId } = await auth();
    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { items } = await request.json();
    if (!items?.length) {
      return NextResponse.json({ error: "No items provided" }, { status: 400 });
    }

    const totalWeight = items.reduce(
      (sum: number, item: { weight?: number; qty: number }) =>
        sum + (item.weight ?? 0) * item.qty,
      0,
    );

    if (totalWeight > 0 && totalWeight < 40) {
      return NextResponse.json(
        { error: `Minimum order is 40kg (${(40 - totalWeight).toFixed(2)}kg more needed)` },
        { status: 400 },
      );
    }

    const total = items.reduce(
      (sum: number, item: { unitPrice: number; qty: number }) =>
        sum + item.unitPrice * item.qty,
      0,
    );

    const delivery = total > 0 ? (total < 50 ? 4.99 : 0) : 0;
    const grandTotal = total + delivery;

    const orderId = generateOrderId();

    const order = await prisma.order.create({
      data: {
        id: orderId,
        userId,
        total: grandTotal,
        status: "PENDING",
      },
    });

    const lineItems = items.map((item: { name: string; unitPrice: number; qty: number; description?: string }) => ({
      price_data: {
        currency: "usd",
        product_data: {
          name: item.name,
          description: item.description || "",
        },
        unit_amount: Math.round(item.unitPrice * 100),
      },
      quantity: item.qty,
    }));

    if (delivery > 0) {
      lineItems.push({
        price_data: {
          currency: "usd",
          product_data: { name: "Delivery fee" },
          unit_amount: Math.round(delivery * 100),
        },
        quantity: 1,
      });
    }

    const session = await stripe.checkout.sessions.create({
      payment_method_types: ["card"],
      mode: "payment",
      line_items: lineItems,
      metadata: {
        orderId: order.id,
        userId,
      },
      success_url: `${request.headers.get("origin") || "http://localhost:3000"}/user/orders?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${request.headers.get("origin") || "http://localhost:3000"}/user/cart`,
    });

    return NextResponse.json({ url: session.url });
  } catch (error) {
    console.error("Checkout session error:", error);
    return serverError("Failed to create checkout session");
  }
}
