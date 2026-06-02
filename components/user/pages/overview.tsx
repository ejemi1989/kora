"use client";

import { useUser } from "@/components/user/user-context";
import { ORDERS, PRODUCTS, calcDelivery, calcSubtotal } from "@/lib/data/user";
import { ChevronIcon, TruckIcon } from "@/components/user/icons";
import { useRouter } from "next/navigation";

export function OverviewPage() {
  const { setPage, cartItems, addToCart, showToast } = useUser();
  const router = useRouter();

  const recentOrders = ORDERS.slice(0, 4);
  const activeOrder = ORDERS.find((o) => o.status === "shipped") || ORDERS[1];

  const statusOrder = ["confirmed", "packed", "shipped", "delivered"];
  const currentStatusIdx = statusOrder.indexOf(activeOrder.status);
  const userOrder = { ...activeOrder, orderIndex: currentStatusIdx >= 0 ? currentStatusIdx : 0 };

  function handleReorder(name: string) {
    const product = PRODUCTS.find((p) => p.name === name);
    if (product) {
      addToCart({ id: product.id, name: product.name, price: product.price, description: product.description, emoji: product.emoji });
      showToast("Added to cart");
    }
  }

  return (
    <div>
      <h1 style={{ fontSize: 20, fontWeight: 600, letterSpacing: "-0.03em", color: "var(--ink)", marginBottom: 4 }}>Overview</h1>
      <p style={{ fontSize: 13, color: "var(--muted)", marginBottom: 20 }}>Welcome back, Amara</p>

      <div className="stats" style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(180px, 1fr))", gap: 12, marginBottom: 20 }}>
        {[
          { icon: "\uD83D\uDCE6", label: "Active Orders", value: "4", delta: "+2 this week \u2191" },
          { icon: "\uD83D\uDE9A", label: "Out for Delivery", value: "1", delta: "Arriving today \u2191" },
          { icon: "\u2B50", label: "Loyalty Points", value: "2,450", delta: "150 \u2192 Gold \u2191" },
          { icon: "\uD83D\uDCB0", label: "Total Spent (May)", value: "\u20A6182.55", delta: "+12% vs Apr \u2191" },
        ].map((s) => (
          <div key={s.label} style={{ background: "#fff", borderRadius: 8, padding: "14px 16px", boxShadow: "0 0 0 1px rgba(0,0,0,0.04), 0 1px 2px rgba(0,0,0,0.04)" }}>
            <div style={{ fontSize: 20, marginBottom: 4 }}>{s.icon}</div>
            <div style={{ fontSize: 11, color: "var(--muted)", marginBottom: 2 }}>{s.label}</div>
            <div style={{ fontSize: 22, fontWeight: 600, letterSpacing: "-0.03em", color: "var(--ink)", marginBottom: 2 }}>{s.value}</div>
            <div style={{ fontSize: 10, color: "var(--success)" }}>{s.delta}</div>
          </div>
        ))}
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12, marginBottom: 20 }}>
        <div style={{ background: "#fff", borderRadius: 8, boxShadow: "0 0 0 1px rgba(0,0,0,0.04), 0 1px 2px rgba(0,0,0,0.04)" }}>
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "12px 16px", borderBottom: "1px solid var(--hairline)" }}>
            <h3 style={{ fontSize: 12, fontWeight: 600, textTransform: "uppercase", letterSpacing: "0.04em", color: "var(--ink)", margin: 0 }}>Recent Orders</h3>
            <button onClick={() => { setPage("orders"); router.push("/user/orders"); }} style={{ fontSize: 12, color: "var(--primary)", background: "none", border: "none", cursor: "pointer", padding: 0 }}>View all \u2192</button>
          </div>
          <div>
            {recentOrders.map((order) => (
              <div key={order.id} onClick={() => { setPage("orders"); router.push("/user/orders"); }} style={{ display: "flex", alignItems: "center", gap: 10, padding: "10px 16px", borderBottom: "1px solid var(--hairline)", cursor: "pointer", fontSize: 13, color: "var(--body)", transition: "opacity 150ms" }}
                onMouseEnter={(e) => { e.currentTarget.style.opacity = "0.7"; }}
                onMouseLeave={(e) => { e.currentTarget.style.opacity = "1"; }}
              >
                <div style={{ width: 32, height: 32, borderRadius: 6, background: "var(--surface-soft)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 16, flexShrink: 0 }}>{order.thumb}</div>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ fontWeight: 500 }}>{order.id}</div>
                  <div style={{ fontSize: 11, color: "var(--muted)", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>{order.items}</div>
                </div>
                <div style={{ textAlign: "right", flexShrink: 0 }}>
                  <div style={{ fontWeight: 600 }}>{'\u20A6'}{order.amount.toFixed(2)}</div>
                  <div style={{ fontSize: 10, color: "var(--ash)" }}>{order.date}</div>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div style={{ background: "#fff", borderRadius: 8, boxShadow: "0 0 0 1px rgba(0,0,0,0.04), 0 1px 2px rgba(0,0,0,0.04)" }}>
          <div style={{ padding: "12px 16px", borderBottom: "1px solid var(--hairline)" }}>
            <h3 style={{ fontSize: 12, fontWeight: 600, textTransform: "uppercase", letterSpacing: "0.04em", color: "var(--ink)", margin: 0 }}>Active Delivery</h3>
          </div>
          <div style={{ padding: "16px" }}>
            <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 16 }}>
              <span style={{ fontSize: 24 }}>\uD83C\uDF5A</span>
              <div>
                <div style={{ fontSize: 13, fontWeight: 500, color: "var(--ink)" }}>{activeOrder.id}</div>
                <div style={{ fontSize: 11, color: "var(--muted)" }}>{activeOrder.items.split(" · ").slice(0, 2).join(" · ")}</div>
              </div>
            </div>

            <div style={{ display: "flex", alignItems: "center", gap: 0, marginBottom: 12, position: "relative" }}>
              {statusOrder.map((s, i) => {
                const isDone = i < currentStatusIdx;
                const isActive = i === currentStatusIdx;
                return (
                  <div key={s} style={{ flex: 1, display: "flex", flexDirection: "column", alignItems: "center", position: "relative" }}>
                    {i > 0 && <div style={{ position: "absolute", top: 10, left: "-50%", width: "100%", height: 2, background: isDone ? "var(--primary)" : "var(--hairline)", zIndex: 0 }} />}
                    <div style={{ width: 20, height: 20, borderRadius: "50%", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 10, fontWeight: 600, zIndex: 1, background: isDone ? "var(--primary)" : isActive ? "#fff" : "var(--hairline)", color: isDone ? "#fff" : isActive ? "var(--primary)" : "var(--stone)", border: isActive ? "2px solid var(--primary)" : "none" }}>
                      {isDone ? "\u2713" : i + 1}
                    </div>
                    <span style={{ fontSize: 9, color: isDone || isActive ? "var(--primary)" : "var(--muted)", marginTop: 4, textAlign: "center" }}>{s}</span>
                  </div>
                );
              })}
            </div>

            <span style={{ display: "inline-block", padding: "2px 8px", borderRadius: 999, fontSize: 10, fontWeight: 500, background: "var(--warning-bg)", color: "var(--warning)" }}>Shipped</span>
          </div>
        </div>
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 12 }}>
        <QuickReorderCard title="Quick Reorder" items={["Jollof Rice Party Pack", "Suya Spice Set", "Plantain Chips (3 pk)"]} onReorder={handleReorder} />
        <QuickReorderCard title="Saved for Later" items={["Ogbono Powder", "Smoked Catfish", "Coconut Rice"]} onReorder={handleReorder} buttonLabel="Add" />
        <NextDeliveryCard />
      </div>
    </div>
  );
}

function QuickReorderCard({ title, items, onReorder, buttonLabel = "Reorder" }: { title: string; items: string[]; onReorder: (name: string) => void; buttonLabel?: string }) {
  return (
    <div style={{ background: "#fff", borderRadius: 8, boxShadow: "0 0 0 1px rgba(0,0,0,0.04), 0 1px 2px rgba(0,0,0,0.04)" }}>
      <div style={{ padding: "12px 16px", borderBottom: "1px solid var(--hairline)" }}>
        <h3 style={{ fontSize: 12, fontWeight: 600, textTransform: "uppercase", letterSpacing: "0.04em", color: "var(--ink)", margin: 0 }}>{title}</h3>
      </div>
      <div style={{ padding: "0 16px" }}>
        {items.map((name) => (
          <div key={name} style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "10px 0", borderBottom: "1px solid var(--hairline)", fontSize: 13, color: "var(--body)" }}>
            <span>{name}</span>
            <button onClick={() => onReorder(name)} style={{ padding: "5px 10px", fontSize: 11, borderRadius: 6, border: buttonLabel === "Add" ? "1px solid var(--hairline)" : "none", background: buttonLabel === "Add" ? "#fff" : "var(--primary)", color: buttonLabel === "Add" ? "var(--body)" : "#fff", cursor: "pointer" }}>
              {buttonLabel === "Reorder" ? "Reorder" : "Add"}
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}

function NextDeliveryCard() {
  return (
    <div style={{ background: "#fff", borderRadius: 8, boxShadow: "0 0 0 1px rgba(0,0,0,0.04), 0 1px 2px rgba(0,0,0,0.04)" }}>
      <div style={{ padding: "12px 16px", borderBottom: "1px solid var(--hairline)" }}>
        <h3 style={{ fontSize: 12, fontWeight: 600, textTransform: "uppercase", letterSpacing: "0.04em", color: "var(--ink)", margin: 0 }}>Next Delivery</h3>
      </div>
      <div style={{ padding: "16px", textAlign: "center" }}>
        <div style={{ fontSize: 24, marginBottom: 8 }}>\uD83D\uDE9A</div>
        <div style={{ fontSize: 16, fontWeight: 600, color: "var(--ink)", marginBottom: 4 }}>2:30 PM</div>
        <div style={{ fontSize: 12, color: "var(--muted)", marginBottom: 12 }}>Today \u00B7 Ikeja, Lagos</div>
        <div style={{ height: 3, background: "var(--surface-soft)", borderRadius: 4, marginBottom: 8 }}>
          <div style={{ width: "65%", height: "100%", background: "var(--primary)", borderRadius: 4 }} />
        </div>
        <div style={{ fontSize: 10, color: "var(--ash)" }}>Rider: Tunde \u00B7 3 stops away</div>
      </div>
    </div>
  );
}
