import { NextResponse } from "next/server";
import { serverError } from "@/lib/validation";
import { createPaymentIntent } from "@/lib/services/payment";

export async function POST(request: Request) {
  try {
    const userId = request.headers.get("x-user-id");
    if (!userId) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const { orderId } = await request.json();
    if (!orderId) {
      return NextResponse.json({ error: "orderId is required" }, { status: 400 });
    }

    const result = await createPaymentIntent(orderId);

    return NextResponse.json({
      clientSecret: result.clientSecret,
      publishableKey: process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY!,
    });
  } catch (error) {
    console.error("Payment intent creation error:", error);
    return serverError("Failed to create payment intent");
  }
}
