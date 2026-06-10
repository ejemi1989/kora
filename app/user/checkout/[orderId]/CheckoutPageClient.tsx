"use client";

import { useEffect, useState } from "react";
import { loadStripe } from "@stripe/stripe-js";
import { Elements } from "@stripe/react-stripe-js";
import { StripeCheckoutForm } from "@/components/user/pages/StripeCheckoutForm";
import { useUser } from "@/components/user/user-context";
import { useAuth } from "@clerk/nextjs";

interface Props {
  orderId: string;
}

export function CheckoutPageClient({ orderId }: Props) {
  const { showToast } = useUser();
  const { userId } = useAuth();
  const [clientSecret, setClientSecret] = useState<string | null>(null);
  const [publishableKey, setPublishableKey] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!userId) return;
    async function init() {
      try {
        const res = await fetch("/api/payments/create-intent", {
          method: "POST",
          headers: { "Content-Type": "application/json", "x-user-id": userId! },
          body: JSON.stringify({ orderId }),
        });
        if (!res.ok) {
          const data = await res.json();
          throw new Error(data.error || "Failed to initialize payment");
        }
        const data = await res.json();
        setClientSecret(data.clientSecret);
        setPublishableKey(data.publishableKey);
      } catch (err) {
        const message = err instanceof Error ? err.message : "Something went wrong";
        setError(message);
        showToast(message, "danger");
      }
    }
    if (userId) init();
  }, [orderId, showToast, userId]);

  if (error) {
    return (
      <div>
        <h1 style={{ fontSize: 20, fontWeight: 600, letterSpacing: "-0.03em", color: "var(--ink)", marginBottom: 8 }}>
          Checkout
        </h1>
        <div style={{ padding: "12px 16px", borderRadius: 6, background: "var(--danger-bg)", color: "var(--danger)", fontSize: 13 }}>
          {error}
        </div>
      </div>
    );
  }

  if (!clientSecret || !publishableKey) {
    return (
      <div>
        <h1 style={{ fontSize: 20, fontWeight: 600, letterSpacing: "-0.03em", color: "var(--ink)", marginBottom: 8 }}>
          Checkout
        </h1>
        <div style={{ fontSize: 13, color: "var(--muted)", padding: "24px 0" }}>
          Preparing payment...
        </div>
      </div>
    );
  }

  const stripePromise = loadStripe(publishableKey);

  return (
    <div>
      <h1 style={{ fontSize: 20, fontWeight: 600, letterSpacing: "-0.03em", color: "var(--ink)", marginBottom: 4 }}>
        Complete Payment
      </h1>
      <p style={{ fontSize: 13, color: "var(--muted)", margin: "0 0 20px" }}>
        Order #{orderId.slice(0, 8)}
      </p>

      <div style={{ maxWidth: 480, background: "#fff", borderRadius: 8, boxShadow: "0 0 0 1px rgba(0,0,0,0.04), 0 1px 2px rgba(0,0,0,0.04)", padding: 20 }}>
        <Elements stripe={stripePromise} options={{ clientSecret, appearance: { theme: "stripe" } }}>
          <StripeCheckoutForm orderId={orderId} />
        </Elements>
      </div>
    </div>
  );
}
