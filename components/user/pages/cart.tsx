"use client";

import { useState, useEffect } from "react";
import { useUser } from "@/components/user/user-context";
import { useCurrency } from "@/lib/hooks/use-currency";
import { calcSubtotal, calcDelivery, calcTotalWeight, MIN_ORDER_KG } from "@/lib/data/user";
import { ChevronIcon, MinusIcon, PlusIcon, XIcon } from "@/components/user/icons";
import type { UserAddress, PaymentMethod } from "@/lib/types/user";
import { useRouter } from "next/navigation";

type CheckoutStep = "review" | "address" | "payment" | "confirm";

export function CartPage() {
  const { cartItems, setCartItems, addresses, paymentMethods, showToast } = useUser();
  const { format } = useCurrency();
  const router = useRouter();
  const [mounted, setMounted] = useState(false);
  useEffect(() => { setMounted(true); }, []);
  const [checkout, setCheckout] = useState(false);
  const [step, setStep] = useState(0);
  const [selectedAddr, setSelectedAddr] = useState<UserAddress | null>(null);
  const [selectedPay, setSelectedPay] = useState<PaymentMethod | null>(null);
  const [confirming, setConfirming] = useState(false);
  const [recentOrders, setRecentOrders] = useState<{ id: string; status: string; createdAt: string }[]>([]);

  useEffect(() => {
    fetch("/api/orders")
      .then((r) => r.json())
      .then((data) => {
        if (data.orders)
          setRecentOrders(data.orders.filter((o: { status: string }) => o.status !== "PENDING").slice(0, 3));
      })
      .catch(() => {});
  }, []);

  const sub = calcSubtotal(cartItems);
  const delivery = calcDelivery(sub, cartItems.length);
  const total = sub + delivery;
  const totalKg = calcTotalWeight(cartItems);
  const meetsMinWeight = totalKg >= MIN_ORDER_KG;

  function updateQty(name: string, delta: number) {
    setCartItems((prev) =>
      prev.map((i) => (i.name === name ? { ...i, qty: Math.max(0, i.qty + delta) } : i)).filter((i) => i.qty > 0)
    );
  }

  function handleProceedCheckout() {
    if (cartItems.length === 0) {
      showToast("Cart is empty");
      return;
    }
    if (!meetsMinWeight) {
      showToast(`Minimum order is ${MIN_ORDER_KG}kg (${(MIN_ORDER_KG - totalKg).toFixed(2)}kg more needed)`, "warning");
      return;
    }
    setCheckout(true);
  }

  const steps = ["Cart", "Address", "Payment", "Confirm"];

  return (
    <div>
      <h1 style={{ fontSize: 20, fontWeight: 600, letterSpacing: "-0.03em", color: "var(--ink)", marginBottom: 16 }}>
        {checkout && <button onClick={() => { setCheckout(false); setStep(0); }} style={{ background: "none", border: "none", cursor: "pointer", padding: 0, display: "inline-flex", verticalAlign: "middle", marginRight: 8, color: "var(--body)" }}><ChevronIcon /></button>}
        {checkout ? "Checkout" : "Cart"}
      </h1>

      {checkout && (
        <div style={{ display: "flex", alignItems: "center", gap: 0, marginBottom: 20 }}>
          {steps.map((s, i) => (
            <div key={s} style={{ flex: 1, display: "flex", flexDirection: "column", alignItems: "center", position: "relative" }}>
              {i > 0 && <div style={{ position: "absolute", top: 10, left: "-50%", width: "100%", height: 2, background: i <= step ? "var(--primary)" : "var(--hairline)", zIndex: 0 }} />}
              <div style={{ width: 20, height: 20, borderRadius: "50%", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 10, fontWeight: 600, zIndex: 1, background: i < step ? "var(--primary)" : i === step ? "#fff" : "var(--hairline)", color: i < step ? "#fff" : i === step ? "var(--primary)" : "var(--stone)", border: i === step ? "2px solid var(--primary)" : "none" }}>
                {i < step ? "\u2713" : i + 1}
              </div>
              <span style={{ fontSize: 9, color: i <= step ? "var(--primary)" : "var(--muted)", marginTop: 4 }}>{s}</span>
            </div>
          ))}
        </div>
      )}

      {!checkout ? (
        <div style={{ display: "grid", gridTemplateColumns: "1fr 280px", gap: 12 }}>
          <div style={{ background: "#fff", borderRadius: 8, boxShadow: "0 0 0 1px rgba(0,0,0,0.04), 0 1px 2px rgba(0,0,0,0.04)", padding: 16 }}>
            {!mounted ? null : cartItems.length === 0 ? (
              <div style={{ textAlign: "center", padding: "32px 0" }}>
                <div style={{ fontSize: 36, color: "var(--stone)", marginBottom: 8 }}>{'\uD83D\uDED2'}</div>
                <div style={{ fontSize: 14, fontWeight: 500, color: "var(--muted)", marginBottom: 4 }}>Your cart is empty</div>
                <p style={{ fontSize: 12, color: "var(--ash)", margin: "0 0 12px" }}>Browse our shop to find something delicious</p>
                <button onClick={() => { router.push("/user/shop"); }} style={{ padding: "6px 14px", fontSize: 12, borderRadius: 6, border: "none", background: "var(--primary)", color: "#fff", cursor: "pointer" }}>Browse Shop</button>
              </div>
            ) : (
              cartItems.map((item) => (
                <div key={item.name} style={{ display: "flex", alignItems: "center", gap: 12, padding: "12px 0", borderBottom: "1px solid var(--hairline)" }}>
                  <div style={{ width: 48, height: 48, borderRadius: 6, background: "var(--surface-soft)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 22, flexShrink: 0 }}>{item.emoji}</div>
                  <div style={{ flex: 1 }}>
                    <div style={{ fontSize: 13, fontWeight: 500, color: "var(--ink)" }}>{item.name}</div>
                    <div style={{ fontSize: 11, color: "var(--muted)" }}>{item.description}</div>
                  </div>
                  <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
                    <button onClick={() => updateQty(item.name, -1)} style={{ width: 24, height: 24, borderRadius: 4, border: "1px solid var(--hairline)", background: "#fff", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", color: "var(--body)" }}><MinusIcon size={12} /></button>
                    <span style={{ fontSize: 13, fontWeight: 500, color: "var(--ink)", minWidth: 20, textAlign: "center" }}>{item.qty}</span>
                    <button onClick={() => updateQty(item.name, 1)} style={{ width: 24, height: 24, borderRadius: 4, border: "1px solid var(--hairline)", background: "#fff", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", color: "var(--body)" }}><PlusIcon size={12} /></button>
                  </div>
                  <div style={{ fontSize: 13, fontWeight: 600, color: "var(--ink)", minWidth: 60, textAlign: "right" }}>{format(item.unitPrice * item.qty)}</div>
                  <button onClick={() => setCartItems((prev) => prev.filter((i) => i.name !== item.name))} style={{ background: "none", border: "none", cursor: "pointer", color: "var(--stone)", padding: 4 }}>
                    <XIcon size={14} />
                  </button>
                </div>
              ))
            )}
          </div>

          <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
            <div style={{ background: "#fff", borderRadius: 8, boxShadow: "0 0 0 1px rgba(0,0,0,0.04), 0 1px 2px rgba(0,0,0,0.04)", padding: 16 }}>
              <div style={{ fontSize: 12, fontWeight: 600, textTransform: "uppercase", letterSpacing: "0.04em", color: "var(--ink)", marginBottom: 12 }}>Summary</div>
                  <div style={{ display: "flex", justifyContent: "space-between", fontSize: 13, color: "var(--body)", marginBottom: 6 }}>
                    <span>Subtotal</span><span>{format(sub)}</span>
                  </div>
                  <div style={{ display: "flex", justifyContent: "space-between", fontSize: 13, color: "var(--body)", marginBottom: 6 }}>
                    <span>Weight</span><span>{totalKg.toFixed(2)} kg</span>
                  </div>
                  <div style={{ display: "flex", justifyContent: "space-between", fontSize: 13, color: "var(--body)", marginBottom: 6 }}>
                    <span>Delivery</span><span>{delivery === 0 ? "Free" : format(delivery)}</span>
                  </div>
                  <div style={{ borderTop: "1px solid var(--hairline)", margin: "8px 0", paddingTop: 8, display: "flex", justifyContent: "space-between", fontSize: 15, fontWeight: 600, color: "var(--ink)" }}>
                    <span>Total</span><span>{format(total)}</span>
                  </div>
                  {!meetsMinWeight && (
                    <div style={{ fontSize: 11, color: "var(--danger)", marginTop: 8, textAlign: "center" }}>
                      Minimum order is {MIN_ORDER_KG}kg ({(MIN_ORDER_KG - totalKg).toFixed(2)}kg more needed)
                    </div>
                  )}
                  <button onClick={handleProceedCheckout} disabled={cartItems.length === 0 || !meetsMinWeight} style={{ width: "100%", padding: "8px 0", marginTop: 8, fontSize: 13, fontWeight: 600, borderRadius: 6, border: "none", background: cartItems.length === 0 || !meetsMinWeight ? "var(--surface-soft)" : "var(--primary)", color: "#fff", cursor: cartItems.length === 0 || !meetsMinWeight ? "default" : "pointer", opacity: cartItems.length === 0 || !meetsMinWeight ? 0.5 : 1 }}>
                    {!meetsMinWeight ? `Add ${(MIN_ORDER_KG - totalKg).toFixed(2)}kg more to proceed` : "Proceed to Checkout \u2192"}
                  </button>
            </div>
            <div style={{ background: "#fff", borderRadius: 8, boxShadow: "0 0 0 1px rgba(0,0,0,0.04), 0 1px 2px rgba(0,0,0,0.04)", padding: 16 }}>
              <div style={{ fontSize: 12, fontWeight: 600, textTransform: "uppercase", letterSpacing: "0.04em", color: "var(--ink)", marginBottom: 8 }}>Recent Orders</div>
              {recentOrders.length === 0 ? (
                <div style={{ fontSize: 12, color: "var(--ash)" }}>No recent orders</div>
              ) : (
                recentOrders.map((o) => (
                  <div key={o.id} style={{ fontSize: 12, color: "var(--muted)", marginBottom: 4, fontFamily: "var(--font-mono)" }}>
                    {o.id} &middot; {o.status === "DELIVERED" ? "delivered" : o.status === "SHIPPED" ? "shipped" : o.status.toLowerCase()}
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
      ) : (
        <div style={{ display: "grid", gridTemplateColumns: "1fr 280px", gap: 12 }}>
          <div style={{ background: "#fff", borderRadius: 8, boxShadow: "0 0 0 1px rgba(0,0,0,0.04), 0 1px 2px rgba(0,0,0,0.04)", padding: 16, minHeight: 200 }}>
            {step === 0 && (
              <div>
                <h3 style={{ fontSize: 12, fontWeight: 600, textTransform: "uppercase", letterSpacing: "0.04em", color: "var(--ink)", margin: "0 0 12px" }}>Cart Review</h3>
                {cartItems.map((item) => (
                  <div key={item.name} style={{ display: "flex", alignItems: "center", gap: 12, padding: "8px 0", borderBottom: "1px solid var(--hairline)" }}>
                    <div style={{ flex: 1, fontSize: 13, color: "var(--body)" }}>{item.name}</div>
                    <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
                      <button onClick={() => updateQty(item.name, -1)} style={{ width: 22, height: 22, borderRadius: 4, border: "1px solid var(--hairline)", background: "#fff", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", color: "var(--body)", fontSize: 10 }}>-</button>
                      <span style={{ fontSize: 13, fontWeight: 500, color: "var(--ink)", minWidth: 20, textAlign: "center" }}>{item.qty}</span>
                      <button onClick={() => updateQty(item.name, 1)} style={{ width: 22, height: 22, borderRadius: 4, border: "1px solid var(--hairline)", background: "#fff", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", color: "var(--body)", fontSize: 10 }}>+</button>
                    </div>
                    <div style={{ fontSize: 13, fontWeight: 600, color: "var(--ink)" }}>{format(item.unitPrice * item.qty)}</div>
                  </div>
                ))}
              </div>
            )}
            {step === 1 && (
              <div>
                <h3 style={{ fontSize: 12, fontWeight: 600, textTransform: "uppercase", letterSpacing: "0.04em", color: "var(--ink)", margin: "0 0 12px" }}>Select Address</h3>
                {addresses.map((addr) => (
                  <div key={addr.id} onClick={() => setSelectedAddr(addr)} style={{ padding: "12px", borderRadius: 6, border: selectedAddr?.id === addr.id ? "1px solid var(--primary)" : "1px solid var(--hairline)", cursor: "pointer", marginBottom: 8, background: selectedAddr?.id === addr.id ? "var(--primary-bg)" : "#fff" }}>
                    <div style={{ display: "flex", alignItems: "center", gap: 6, marginBottom: 4 }}>
                      <span style={{ fontSize: 12, fontWeight: 500, color: "var(--ink)" }}>{addr.name}</span>
                      <span style={{ padding: "1px 6px", borderRadius: 4, fontSize: 9, fontWeight: 500, background: "var(--surface-soft)", color: "var(--muted)" }}>{addr.tag}</span>
                      {addr.isDefault && <span style={{ padding: "1px 6px", borderRadius: 4, fontSize: 9, fontWeight: 500, background: "var(--primary-bg)", color: "var(--primary)" }}>Default</span>}
                    </div>
                    <div style={{ fontSize: 12, color: "var(--muted)" }}>{addr.address}</div>
                  </div>
                ))}
              </div>
            )}
            {step === 2 && (
              <div>
                <h3 style={{ fontSize: 12, fontWeight: 600, textTransform: "uppercase", letterSpacing: "0.04em", color: "var(--ink)", margin: "0 0 12px" }}>Select Payment</h3>
                {paymentMethods.map((pm) => (
                  <div key={pm.name} onClick={() => setSelectedPay(pm)} style={{ padding: "12px", borderRadius: 6, border: selectedPay?.name === pm.name ? "1px solid var(--primary)" : "1px solid var(--hairline)", cursor: "pointer", marginBottom: 8, background: selectedPay?.name === pm.name ? "var(--primary-bg)" : "#fff" }}>
                    <div style={{ fontSize: 13, fontWeight: 500, color: "var(--ink)", marginBottom: 2 }}>
                      {pm.type === "Card" ? "\uD83D\uDCB3" : pm.type === "Mobile" ? "\uD83D\uDCF1" : "\uD83C\uDFE6"} {pm.name}
                    </div>
                    <div style={{ fontSize: 12, color: "var(--muted)" }}>{pm.details}</div>
                  </div>
                ))}
              </div>
            )}
            {step === 3 && (
              <div>
                <h3 style={{ fontSize: 12, fontWeight: 600, textTransform: "uppercase", letterSpacing: "0.04em", color: "var(--ink)", margin: "0 0 12px" }}>Confirm Order</h3>
                <div style={{ fontSize: 13, color: "var(--body)", marginBottom: 6 }}>{cartItems.reduce((s, i) => s + i.qty, 0)} items</div>
                <div style={{ display: "flex", justifyContent: "space-between", fontSize: 13, color: "var(--body)", marginBottom: 4 }}><span>Subtotal</span><span>{format(sub)}</span></div>
                <div style={{ display: "flex", justifyContent: "space-between", fontSize: 13, color: "var(--body)", marginBottom: 4 }}><span>Weight</span><span>{totalKg.toFixed(2)} kg</span></div>
                <div style={{ display: "flex", justifyContent: "space-between", fontSize: 13, color: "var(--body)", marginBottom: 4 }}><span>Delivery</span><span>{delivery === 0 ? "Free" : format(delivery)}</span></div>
                <div style={{ borderTop: "1px solid var(--hairline)", margin: "8px 0", paddingTop: 8, display: "flex", justifyContent: "space-between", fontSize: 16, fontWeight: 600, color: "var(--ink)" }}>
                  <span>Total</span><span>{format(total)}</span>
                </div>
                {selectedAddr && (
                  <div style={{ fontSize: 12, color: "var(--muted)", marginTop: 8 }}>
                    Delivering to: {selectedAddr.address.substring(0, 40)}...
                  </div>
                )}
              </div>
            )}
          </div>

          <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
            <div style={{ background: "#fff", borderRadius: 8, boxShadow: "0 0 0 1px rgba(0,0,0,0.04), 0 1px 2px rgba(0,0,0,0.04)", padding: 16 }}>
              <div style={{ fontSize: 12, fontWeight: 600, textTransform: "uppercase", letterSpacing: "0.04em", color: "var(--ink)", marginBottom: 12 }}>Summary</div>
              <div style={{ display: "flex", justifyContent: "space-between", fontSize: 13, color: "var(--body)", marginBottom: 6 }}><span>Subtotal</span><span>{format(sub)}</span></div>
              <div style={{ display: "flex", justifyContent: "space-between", fontSize: 13, color: "var(--body)", marginBottom: 6 }}><span>Weight</span><span>{totalKg.toFixed(2)} kg</span></div>
              <div style={{ display: "flex", justifyContent: "space-between", fontSize: 13, color: "var(--body)", marginBottom: 6 }}><span>Delivery</span><span>{delivery === 0 ? "Free" : format(delivery)}</span></div>
              <div style={{ borderTop: "1px solid var(--hairline)", margin: "8px 0", paddingTop: 8, display: "flex", justifyContent: "space-between", fontSize: 15, fontWeight: 600, color: "var(--ink)" }}><span>Total</span><span>{format(total)}</span></div>
            </div>

            {step < 3 && (
              <button onClick={() => {
                if (step === 1 && !selectedAddr) { showToast("Please select an address"); return; }
                if (step === 2 && !selectedPay) { showToast("Please select a payment method"); return; }
                setStep((s) => s + 1);
              }} style={{ width: "100%", padding: "8px 0", fontSize: 13, fontWeight: 600, borderRadius: 6, border: "none", background: "var(--primary)", color: "#fff", cursor: "pointer" }}>
                Continue
              </button>
            )}
            {step > 0 && step < 3 && (
              <button onClick={() => setStep((s) => s - 1)} style={{ width: "100%", padding: "8px 0", fontSize: 12, borderRadius: 6, border: "1px solid var(--hairline)", background: "#fff", color: "var(--body)", cursor: "pointer" }}>
                Back
              </button>
            )}
            {step === 3 && (
              <button onClick={async () => {
                setConfirming(true);
                try {
                  const res = await fetch("/api/create-checkout-session", {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({
                      items: cartItems,
                      addressId: selectedAddr?.id,
                    }),
                  });
                  const data = await res.json();
                  if (data.url) {
                    setCartItems([]);
                    window.location.href = data.url;
                  } else {
                    showToast("Failed to create checkout session", "danger");
                    setConfirming(false);
                  }
                } catch {
                  showToast("Something went wrong", "danger");
                  setConfirming(false);
                }
              }} disabled={confirming} style={{ width: "100%", padding: "8px 0", fontSize: 13, fontWeight: 600, borderRadius: 6, border: "none", background: confirming ? "var(--surface-soft)" : "var(--primary)", color: "#fff", cursor: confirming ? "default" : "pointer", opacity: confirming ? 0.7 : 1 }}>
                {confirming ? "Redirecting to payment..." : `Pay with Card \u2014 ${format(total)}`}
              </button>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
