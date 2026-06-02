"use client";

import { useState } from "react";
import { useUser } from "@/components/user/user-context";
import { TRANSACTIONS } from "@/lib/data/user";
import { ChevronIcon, PlusIcon } from "@/components/user/icons";

export function PaymentsPage() {
  const { paymentMethods, showToast } = useUser();
  const [txnView, setTxnView] = useState<number | null>(null);
  const [addPay, setAddPay] = useState(false);
  const [payStep, setPayStep] = useState(0);
  const [savePay, setSavePay] = useState(false);

  if (txnView !== null) {
    const txn = TRANSACTIONS[txnView];
    if (!txn) return null;
    return (
      <div>
        <button onClick={() => setTxnView(null)} style={{ background: "none", border: "none", cursor: "pointer", padding: 0, display: "flex", alignItems: "center", gap: 4, fontSize: 13, color: "var(--body)", marginBottom: 16 }}>
          <ChevronIcon /> Back
        </button>
        <div style={{ background: "#fff", borderRadius: 8, boxShadow: "0 0 0 1px rgba(0,0,0,0.04), 0 1px 2px rgba(0,0,0,0.04)", padding: 20, maxWidth: 480 }}>
          <div style={{ fontSize: 40, marginBottom: 8 }}>{txn.type === "credit" ? "\u2B07\uFE0F" : "\u2B06\uFE0F"}</div>
          <div style={{ fontSize: 16, fontWeight: 600, color: "var(--ink)", marginBottom: 4 }}>{'\u20A6'}{txn.amount.toFixed(2)}</div>
          <div style={{ fontSize: 13, color: "var(--body)", marginBottom: 8 }}>{txn.name}</div>
          <span style={{ display: "inline-block", padding: "2px 8px", borderRadius: 999, fontSize: 10, fontWeight: 500, background: "var(--success-bg)", color: "var(--success)", marginBottom: 16, textTransform: "capitalize" }}>{txn.type}</span>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "8px 12px", fontSize: 13 }}>
            <div style={{ color: "var(--muted)" }}>Reference</div>
            <div style={{ color: "var(--body)", fontFamily: "var(--font-mono)", fontSize: 12 }}>{txn.ref}</div>
            <div style={{ color: "var(--muted)" }}>Date</div>
            <div style={{ color: "var(--body)" }}>{txn.date}</div>
            <div style={{ color: "var(--muted)" }}>Payment Method</div>
            <div style={{ color: "var(--body)" }}>{txn.method}</div>
            <div style={{ color: "var(--muted)" }}>Status</div>
            <div style={{ color: "var(--success)" }}>Completed</div>
          </div>
        </div>
      </div>
    );
  }

  if (addPay) {
    return (
      <div>
        <button onClick={() => { setAddPay(false); setPayStep(0); }} style={{ background: "none", border: "none", cursor: "pointer", padding: 0, display: "flex", alignItems: "center", gap: 4, fontSize: 13, color: "var(--body)", marginBottom: 16 }}>
          <ChevronIcon /> Back
        </button>
        <h1 style={{ fontSize: 20, fontWeight: 600, letterSpacing: "-0.03em", color: "var(--ink)", marginBottom: 16 }}>Add Payment Method</h1>

        <div style={{ display: "flex", gap: 6, marginBottom: 16 }}>
          {["Card", "Bank Transfer", "Mobile Money"].map((tab, i) => (
            <button key={tab} onClick={() => setPayStep(i)} style={{ padding: "5px 14px", fontSize: 12, borderRadius: 999, border: "none", background: payStep === i ? "var(--primary)" : "var(--surface-soft)", color: payStep === i ? "#fff" : "var(--body)", cursor: "pointer", fontWeight: 500 }}>
              {tab}
            </button>
          ))}
        </div>

        <div style={{ background: "#fff", borderRadius: 8, boxShadow: "0 0 0 1px rgba(0,0,0,0.04), 0 1px 2px rgba(0,0,0,0.04)", padding: 16, maxWidth: 480 }}>
          {payStep === 0 && (
            <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
              <div>
                <label style={{ display: "block", fontSize: 12, fontWeight: 450, color: "var(--body)", marginBottom: 4 }}>Card Number</label>
                <input type="text" placeholder="4242 4242 4242 4242" style={{ width: "100%", height: 38, padding: "0 12px", borderRadius: 6, border: "1px solid var(--hairline)", fontSize: 13, outline: "none", boxSizing: "border-box" }} />
              </div>
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
                <div>
                  <label style={{ display: "block", fontSize: 12, fontWeight: 450, color: "var(--body)", marginBottom: 4 }}>Expiry</label>
                  <input type="text" placeholder="MM/YY" style={{ width: "100%", height: 38, padding: "0 12px", borderRadius: 6, border: "1px solid var(--hairline)", fontSize: 13, outline: "none", boxSizing: "border-box" }} />
                </div>
                <div>
                  <label style={{ display: "block", fontSize: 12, fontWeight: 450, color: "var(--body)", marginBottom: 4 }}>CVC</label>
                  <input type="text" placeholder="CVC" style={{ width: "100%", height: 38, padding: "0 12px", borderRadius: 6, border: "1px solid var(--hairline)", fontSize: 13, outline: "none", boxSizing: "border-box" }} />
                </div>
              </div>
              <div>
                <label style={{ display: "block", fontSize: 12, fontWeight: 450, color: "var(--body)", marginBottom: 4 }}>Cardholder Name</label>
                <input type="text" placeholder="Full name on card" style={{ width: "100%", height: 38, padding: "0 12px", borderRadius: 6, border: "1px solid var(--hairline)", fontSize: 13, outline: "none", boxSizing: "border-box" }} />
              </div>
            </div>
          )}
          {payStep === 1 && (
            <div>
              <p style={{ fontSize: 13, color: "var(--muted)", margin: "0 0 12px" }}>Transfer to the account below:</p>
              <div style={{ fontSize: 13, color: "var(--body)", marginBottom: 6 }}>Bank: GTBank</div>
              <div style={{ fontSize: 13, color: "var(--body)", marginBottom: 6 }}>Account Name: Kora Payments Ltd</div>
              <div style={{ fontSize: 13, color: "var(--body)", fontFamily: "var(--font-mono)" }}>Account Number: 012 345 6789</div>
            </div>
          )}
          {payStep === 2 && (
            <div>
              {[["OPay", "Quick & secure"], ["Paga", "Available nationwide"]].map(([name, desc], i) => (
                <div key={name} style={{ display: "flex", alignItems: "center", gap: 10, padding: "10px 0", borderBottom: i < 1 ? "1px solid var(--hairline)" : "none" }}>
                  <input type="radio" name="mobileMoney" defaultChecked={i === 0} style={{ accentColor: "var(--primary)" }} />
                  <div>
                    <div style={{ fontSize: 13, fontWeight: 500, color: "var(--ink)" }}>{name}</div>
                    <div style={{ fontSize: 11, color: "var(--muted)" }}>{desc}</div>
                  </div>
                </div>
              ))}
            </div>
          )}
          <button onClick={() => {
            setSavePay(true);
            setTimeout(() => {
              setSavePay(false);
              setAddPay(false);
              showToast("Payment method saved");
            }, 1200);
          }} disabled={savePay} style={{ width: "100%", padding: "8px 0", marginTop: 16, fontSize: 13, fontWeight: 500, borderRadius: 6, border: "none", background: savePay ? "var(--surface-soft)" : "var(--primary)", color: "#fff", cursor: savePay ? "default" : "pointer", opacity: savePay ? 0.7 : 1 }}>
            {savePay ? "Saving..." : "Save Payment Method"}
          </button>
        </div>
      </div>
    );
  }

  return (
    <div>
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 16 }}>
        <h1 style={{ fontSize: 20, fontWeight: 600, letterSpacing: "-0.03em", color: "var(--ink)", margin: 0 }}>Payments</h1>
        <button onClick={() => setAddPay(true)} style={{ padding: "5px 12px", fontSize: 12, borderRadius: 6, border: "none", background: "var(--primary)", color: "#fff", cursor: "pointer", display: "flex", alignItems: "center", gap: 4 }}>
          <PlusIcon size={12} /> Add Method
        </button>
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
        <div style={{ background: "#fff", borderRadius: 8, boxShadow: "0 0 0 1px rgba(0,0,0,0.04), 0 1px 2px rgba(0,0,0,0.04)" }}>
          <div style={{ padding: "12px 16px", borderBottom: "1px solid var(--hairline)", fontSize: 12, fontWeight: 600, textTransform: "uppercase", letterSpacing: "0.04em", color: "var(--ink)" }}>Saved Methods</div>
          {paymentMethods.map((pm, i) => (
            <div key={pm.name} style={{ display: "flex", alignItems: "center", gap: 10, padding: "12px 16px", borderBottom: i < paymentMethods.length - 1 ? "1px solid var(--hairline)" : "none" }}>
              <span style={{ fontSize: 20 }}>{pm.type === "Card" ? "\uD83D\uDCB3" : pm.type === "Mobile" ? "\uD83D\uDCF1" : "\uD83C\uDFE6"}</span>
              <div style={{ flex: 1 }}>
                <div style={{ fontSize: 13, fontWeight: 500, color: "var(--ink)" }}>{pm.name}</div>
                <div style={{ fontSize: 12, fontFamily: "var(--font-mono)", color: "var(--muted)" }}>{pm.details}</div>
              </div>
              {pm.isDefault && <span style={{ padding: "1px 6px", borderRadius: 4, fontSize: 9, fontWeight: 500, background: "var(--primary-bg)", color: "var(--primary)" }}>Default</span>}
            </div>
          ))}
        </div>

        <div style={{ background: "#fff", borderRadius: 8, boxShadow: "0 0 0 1px rgba(0,0,0,0.04), 0 1px 2px rgba(0,0,0,0.04)" }}>
          <div style={{ padding: "12px 16px", borderBottom: "1px solid var(--hairline)", fontSize: 12, fontWeight: 600, textTransform: "uppercase", letterSpacing: "0.04em", color: "var(--ink)" }}>Recent Transactions</div>
          {TRANSACTIONS.map((txn, i) => (
            <div key={txn.ref} onClick={() => setTxnView(i)} style={{ display: "flex", alignItems: "center", gap: 10, padding: "12px 16px", borderBottom: i < TRANSACTIONS.length - 1 ? "1px solid var(--hairline)" : "none", cursor: "pointer", transition: "background 150ms" }}
              onMouseEnter={(e) => { e.currentTarget.style.background = "var(--canvas)"; }}
              onMouseLeave={(e) => { e.currentTarget.style.background = "none"; }}
            >
              <span style={{ fontSize: 14, color: txn.type === "credit" ? "var(--success)" : "var(--danger)" }}>{txn.type === "credit" ? "\u2193" : "\u2191"}</span>
              <div style={{ flex: 1 }}>
                <div style={{ fontSize: 13, color: "var(--body)" }}>{txn.name}</div>
                <div style={{ fontSize: 11, fontFamily: "var(--font-mono)", color: "var(--ash)" }}>{txn.ref}</div>
              </div>
              <div style={{ textAlign: "right" }}>
                <div style={{ fontSize: 13, fontWeight: 500, color: txn.type === "credit" ? "var(--success)" : "var(--ink)" }}>{'\u20A6'}{txn.amount.toFixed(2)}</div>
                <div style={{ fontSize: 10, color: "var(--ash)" }}>{txn.date}</div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
