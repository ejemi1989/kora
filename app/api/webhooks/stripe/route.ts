import { NextResponse } from "next/server";
import { getStripe } from "@/lib/stripe";
import { handlePaymentSucceeded, handlePaymentFailed } from "@/lib/services/payment";
import { registerNotificationHandlers } from "@/lib/services/notification";

registerNotificationHandlers();

export async function POST(request: Request) {
  try {
    const body = await request.text();
    const signature = request.headers.get("stripe-signature");
    if (!signature) {
      return NextResponse.json({ error: "Missing stripe-signature header" }, { status: 400 });
    }

    const stripe = getStripe();
    const event = stripe.webhooks.constructEvent(body, signature, process.env.STRIPE_WEBHOOK_SECRET!);

    switch (event.type) {
      case "payment_intent.succeeded": {
        await handlePaymentSucceeded(event.data.object as any);
        break;
      }
      case "payment_intent.payment_failed": {
        await handlePaymentFailed(event.data.object as any);
        break;
      }
    }

    return NextResponse.json({ received: true });
  } catch (err) {
    const message = err instanceof Error ? err.message : "Webhook error";
    return NextResponse.json({ error: message }, { status: 400 });
  }
}
