"use client";

import { useState } from "react";
import { useUser } from "@/components/user/user-context";
import { calcSubtotal, calcDelivery } from "@/lib/data/user";
import { ChevronIcon, MinusIcon, PlusIcon, XIcon } from "@/components/user/icons";
import type { UserAddress, PaymentMethod } from "@/lib/types/user";
import { useRouter } from "next/navigation";

type CheckoutStep = "review" | "address" | "payment" | "confirm";

export function CartPage() {
  const { cartItems, setCartItems, addresses, paymentMethods, showToast } = useUser();
  const router = useRouter();
  const [checkout, setCheckout] = useState(false);
  const [step, setStep] = useState(0);
  const [selectedAddr, setSelectedAddr] = useState<UserAddress | null>(null);
  const [selectedPay, setSelectedPay] = useState<PaymentMethod | null>(null);
  const [confirming, setConfirming] = useState(false);

  const sub = calcSubtotal(cartItems);
  const delivery = calcDelivery(sub, cartItems.length);
  const total = sub + delivery;

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
            {cartItems.length === 0 ? (
              <div style={{ textAlign: "center", padding: "32px 0" }}>
                <div style={{ fontSize: 36, color: "var(--stone)", marginBottom: 8 }}>\uD83D\uDED2</div>
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
                  <div style={{ fontSize: 13, fontWeight: 600, color: "var(--ink)", minWidth: 60, textAlign: "right" }}>\u20A6{(item.unitPrice * item.qty).toFixed(2)}</div>
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
                <span>Subtotal</span><span>\u20A6{sub.toFixed(2)}</span>
              </div>
              <div style={{ display: "flex", justifyContent: "space-between", fontSize: 13, color: "var(--body)", marginBottom: 6 }}>
                <span>Delivery</span><span>{delivery === 0 ? "Free" : `\u20A6${delivery.toFixed(2)}`}</span>
              </div>
              <div style={{ borderTop: "1px solid var(--hairline)", margin: "8px 0", paddingTop: 8, display: "flex", justifyContent: "space-between", fontSize: 15, fontWeight: 600, color: "var(--ink)" }}>
                <span>Total</span><span>\u20A6{total.toFixed(2)}</span>
              </div>
              <button onClick={handleProceedCheckout} disabled={cartItems.length === 0} style={{ width: "100%", padding: "8px 0", marginTop: 8, fontSize: 13, fontWeight: 600, borderRadius: 6, border: "none", background: cartItems.length === 0 ? "var(--surface-soft)" : "var(--primary)", color: "#fff", cursor: cartItems.length === 0 ? "default" : "pointer", opacity: cartItems.length === 0 ? 0.5 : 1 }}>
                Proceed to Checkout \u2192
              </button>
            </div>
            <div style={{ background: "#fff", borderRadius: 8, boxShadow: "0 0 0 1px rgba(0,0,0,0.04), 0 1px 2px rgba(0,0,0,0.04)", padding: 16 }}>
              <div style={{ fontSize: 12, fontWeight: 600, textTransform: "uppercase", letterSpacing: "0.04em", color: "var(--ink)", marginBottom: 8 }}>Recent Activity</div>
              <div style={{ fontSize: 12, color: "var(--muted)", marginBottom: 4 }}>NP-3842 delivered &middot; Yesterday</div>
              <div style={{ fontSize: 12, color: "var(--muted)" }}>NP-3841 en route &middot; Arriving today</div>
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
                    <div style={{ fontSize: 13, fontWeight: 600, color: "var(--ink)" }}>\u20A6{(item.unitPrice * item.qty).toFixed(2)}</div>
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
                <div style={{ display: "flex", justifyContent: "space-between", fontSize: 13, color: "var(--body)", marginBottom: 4 }}><span>Subtotal</span><span>\u20A6{sub.toFixed(2)}</span></div>
                <div style={{ display: "flex", justifyContent: "space-between", fontSize: 13, color: "var(--body)", marginBottom: 4 }}><span>Delivery</span><span>{delivery === 0 ? "Free" : `\u20A6${delivery.toFixed(2)}`}</span></div>
                <div style={{ borderTop: "1px solid var(--hairline)", margin: "8px 0", paddingTop: 8, display: "flex", justifyContent: "space-between", fontSize: 16, fontWeight: 600, color: "var(--ink)" }}>
                  <span>Total</span><span>\u20A6{total.toFixed(2)}</span>
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
              <div style={{ display: "flex", justifyContent: "space-between", fontSize: 13, color: "var(--body)", marginBottom: 6 }}><span>Subtotal</span><span>\u20A6{sub.toFixed(2)}</span></div>
              <div style={{ display: "flex", justifyContent: "space-between", fontSize: 13, color: "var(--body)", marginBottom: 6 }}><span>Delivery</span><span>{delivery === 0 ? "Free" : `\u20A6${delivery.toFixed(2)}`}</span></div>
              <div style={{ borderTop: "1px solid var(--hairline)", margin: "8px 0", paddingTop: 8, display: "flex", justifyContent: "space-between", fontSize: 15, fontWeight: 600, color: "var(--ink)" }}><span>Total</span><span>\u20A6{total.toFixed(2)}</span></div>
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
              <button onClick={() => {
                setConfirming(true);
                setTimeout(() => {
                  setCartItems([]);
                  setCheckout(false);
                  setStep(0);
                  setConfirming(false);
                  showToast("Order placed! \uD83C\uDF89");
                }, 1200);
              }} disabled={confirming} style={{ width: "100%", padding: "8px 0", fontSize: 13, fontWeight: 600, borderRadius: 6, border: "none", background: confirming ? "var(--surface-soft)" : "var(--primary)", color: "#fff", cursor: confirming ? "default" : "pointer", opacity: confirming ? 0.7 : 1 }}>
                {confirming ? "Processing..." : `Place Order \u2014 \u20A6${total.toFixed(2)}`}
              </button>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
