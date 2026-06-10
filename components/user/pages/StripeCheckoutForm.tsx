"use client";

import { useState } from "react";
import { PaymentElement, useStripe, useElements } from "@stripe/react-stripe-js";
import { useRouter } from "next/navigation";

interface Props {
  orderId: string;
}

export function StripeCheckoutForm({ orderId }: Props) {
  const stripe = useStripe();
  const elements = useElements();
  const router = useRouter();
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!stripe || !elements) return;

    setLoading(true);
    setError(null);

    const { error: submitError } = await stripe.confirmPayment({
      elements,
      confirmParams: {
        return_url: `${window.location.origin}/user/orders?payment=success&orderId=${orderId}`,
      },
      redirect: "if_required",
    });

    if (submitError) {
      setError(submitError.message ?? "Payment failed");
      setLoading(false);
    } else {
      router.push(`/user/orders?payment=success&orderId=${orderId}`);
    }
  }

  return (
    <form onSubmit={handleSubmit}>
      <PaymentElement />
      {error && (
        <div style={{ marginTop: 12, padding: "8px 12px", borderRadius: 6, background: "var(--danger-bg)", color: "var(--danger)", fontSize: 12 }}>
          {error}
        </div>
      )}
      <button
        type="submit"
        disabled={!stripe || loading}
        style={{
          width: "100%",
          marginTop: 20,
          padding: "10px 0",
          fontSize: 13,
          fontWeight: 600,
          borderRadius: 6,
          border: "none",
          background: loading ? "var(--surface-soft)" : "var(--primary)",
          color: "#fff",
          cursor: loading ? "default" : "pointer",
          opacity: loading ? 0.7 : 1,
        }}
      >
        {loading ? "Processing..." : "Pay Now"}
      </button>
    </form>
  );
}
