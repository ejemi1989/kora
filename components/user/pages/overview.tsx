"use client";

import { useState, useEffect } from "react";
import { useUser } from "@/components/user/user-context";
import { useRouter } from "next/navigation";

interface ApiOrderItem {
  product: { name: string; images: string[] };
  quantity: number;
  price: number;
}

interface ApiOrder {
  id: string;
  status: string;
  total: number;
  createdAt: string;
  items: ApiOrderItem[];
  tracking: { step: number; label: string; description: string; time: string }[];
}

const statusSteps = ["PAID", "PROCESSING", "SHIPPED", "IN_TRANSIT", "DELIVERED"];

const stepLabels: Record<string, string> = {
  PAID: "Confirmed",
  PROCESSING: "Processing",
  SHIPPED: "Shipped",
  IN_TRANSIT: "In Transit",
  DELIVERED: "Delivered",
};

export function OverviewPage() {
  const { setPage, cartItems, addToCart, showToast, wishlist } = useUser();
  const router = useRouter();
  const [mounted, setMounted] = useState(false);
  useEffect(() => { setMounted(true); }, []);
  const [orders, setOrders] = useState<ApiOrder[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/orders")
      .then((r) => r.json())
      .then((data) => {
        if (data.orders) setOrders(data.orders);
      })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  const paidOrders = orders.filter((o) => o.status !== "PENDING");
  const recentOrders = paidOrders.slice(0, 4);
  const activeOrders = paidOrders.filter((o) => !["DELIVERED", "CANCELLED"].includes(o.status));
  const outForDelivery = paidOrders.filter((o) => ["SHIPPED", "IN_TRANSIT"].includes(o.status));
  const activeOrder = activeOrders[0] || null;

  const totalSpentThisMonth = paidOrders
    .filter((o) => {
      const d = new Date(o.createdAt);
      const now = new Date();
      return d.getMonth() === now.getMonth() && d.getFullYear() === now.getFullYear();
    })
    .reduce((sum, o) => sum + o.total, 0);

  const currentStatusIdx = activeOrder ? statusSteps.indexOf(activeOrder.status) : -1;

  function getItemEmoji(name: string): string {
    const emojiMap: Record<string, string> = {
      rice: "\uD83C\uDF5A", jollof: "\uD83C\uDF5A", fufu: "\uD83E\uDD63",
      egusi: "\uD83E\uDD63", ogbono: "\uD83C\uDF30", catfish: "\uD83D\uDC1F",
      suya: "\uD83C\uDF36\uFE0F", plantain: "\uD83C\uDF4C", chips: "\uD83C\uDF4C",
      garri: "\uD83C\uDF3E", palm: "\uD83D\uDFE0", oil: "\uD83D\uDFE0",
      zobo: "\uD83E\uDED0", coconut: "\uD83E\uDD65", groundnut: "\uD83E\uDD5C",
      cake: "\uD83C\uDF6A", bread: "\uD83C\uDF5E",
    };
    const lower = name.toLowerCase();
    for (const [key, emoji] of Object.entries(emojiMap)) {
      if (lower.includes(key)) return emoji;
    }
    return "\uD83D\uDCE6";
  }

  return (
    <div>
      <h1 style={{ fontSize: 20, fontWeight: 600, letterSpacing: "-0.03em", color: "var(--ink)", marginBottom: 4 }}>Overview</h1>
      <p style={{ fontSize: 13, color: "var(--muted)", marginBottom: 20 }}>Welcome back{loading ? "" : orders.length > 0 ? "" : ""}</p>

      <div className="stats" style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(180px, 1fr))", gap: 12, marginBottom: 20 }}>
        {[
          { icon: "\uD83D\uDCE6", label: "Active Orders", value: String(activeOrders.length), delta: activeOrders.length > 0 ? `${activeOrders.length} order${activeOrders.length > 1 ? "s" : ""} in progress` : "No active orders" },
          { icon: "\uD83D\uDE9A", label: "Out for Delivery", value: String(outForDelivery.length), delta: outForDelivery.length > 0 ? "On the way \u2191" : "None" },
          { icon: "\uD83D\uDCCB", label: "Total Orders", value: String(paidOrders.length), delta: paidOrders.length > 0 ? `${paidOrders.length} placed` : "" },
          { icon: "\uD83D\uDCB0", label: "Total Spent", value: `$${totalSpentThisMonth.toFixed(2)}`, delta: totalSpentThisMonth > 0 ? "This month" : "" },
        ].map((s) => (
          <div key={s.label} style={{ background: "#fff", borderRadius: 8, padding: "14px 16px", boxShadow: "0 0 0 1px rgba(0,0,0,0.04), 0 1px 2px rgba(0,0,0,0.04)" }}>
            <div style={{ fontSize: 20, marginBottom: 4 }}>{s.icon}</div>
            <div style={{ fontSize: 11, color: "var(--muted)", marginBottom: 2 }}>{s.label}</div>
            <div style={{ fontSize: 22, fontWeight: 600, letterSpacing: "-0.03em", color: "var(--ink)", marginBottom: 2 }}>
              {s.value}{loading ? "" : ""}
            </div>
            <div style={{ fontSize: 10, color: s.delta === "None" || s.delta === "No active orders" || s.delta === "" ? "var(--ash)" : "var(--success)" }}>{s.delta}</div>
          </div>
        ))}
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12, marginBottom: 20 }}>
        <div style={{ background: "#fff", borderRadius: 8, boxShadow: "0 0 0 1px rgba(0,0,0,0.04), 0 1px 2px rgba(0,0,0,0.04)" }}>
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "12px 16px", borderBottom: "1px solid var(--hairline)" }}>
            <h3 style={{ fontSize: 12, fontWeight: 600, textTransform: "uppercase", letterSpacing: "0.04em", color: "var(--ink)", margin: 0 }}>Recent Orders</h3>
            <button onClick={() => { setPage("orders"); router.push("/user/orders"); }} style={{ fontSize: 12, color: "var(--primary)", background: "none", border: "none", cursor: "pointer", padding: 0 }}>
              {paidOrders.length > 0 ? "View all \u2192" : ""}
            </button>
          </div>
          <div>
            {loading ? (
              <div style={{ padding: "24px 16px", textAlign: "center", fontSize: 12, color: "var(--ash)" }}>Loading...</div>
            ) : recentOrders.length === 0 ? (
              <div style={{ padding: "24px 16px", textAlign: "center" }}>
                <div style={{ fontSize: 28, marginBottom: 8 }}>\uD83D\uDED2</div>
                <div style={{ fontSize: 13, fontWeight: 500, color: "var(--muted)", marginBottom: 4 }}>No orders yet</div>
                <p style={{ fontSize: 11, color: "var(--ash)", margin: 0 }}>Your orders will appear here after checkout.</p>
              </div>
            ) : (
              recentOrders.map((order) => {
                const productNames = order.items.map((i) => i.product.name).join(", ");
                return (
                  <div key={order.id} onClick={() => { setPage("orders"); router.push("/user/orders"); }} style={{ display: "flex", alignItems: "center", gap: 10, padding: "10px 16px", borderBottom: "1px solid var(--hairline)", cursor: "pointer", fontSize: 13, color: "var(--body)", transition: "opacity 150ms" }}
                    onMouseEnter={(e) => { e.currentTarget.style.opacity = "0.7"; }}
                    onMouseLeave={(e) => { e.currentTarget.style.opacity = "1"; }}
                  >
                    <div style={{ width: 32, height: 32, borderRadius: 6, background: "var(--surface-soft)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 16, flexShrink: 0 }}>{getItemEmoji(order.items[0]?.product.name || "")}</div>
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <div style={{ fontWeight: 500, fontFamily: "var(--font-mono)" }}>{order.id}</div>
                      <div style={{ fontSize: 11, color: "var(--muted)", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>{productNames}</div>
                    </div>
                    <div style={{ textAlign: "right", flexShrink: 0 }}>
                      <div style={{ fontWeight: 600 }}>${order.total.toFixed(2)}</div>
                      <div style={{ fontSize: 10, color: "var(--ash)" }}>{new Date(order.createdAt).toLocaleDateString()}</div>
                    </div>
                  </div>
                );
              })
            )}
          </div>
        </div>

        <div style={{ background: "#fff", borderRadius: 8, boxShadow: "0 0 0 1px rgba(0,0,0,0.04), 0 1px 2px rgba(0,0,0,0.04)" }}>
          <div style={{ padding: "12px 16px", borderBottom: "1px solid var(--hairline)" }}>
            <h3 style={{ fontSize: 12, fontWeight: 600, textTransform: "uppercase", letterSpacing: "0.04em", color: "var(--ink)", margin: 0 }}>Active Delivery</h3>
          </div>
          <div style={{ padding: "16px" }}>
            {!activeOrder ? (
              <div style={{ textAlign: "center", padding: "16px 0" }}>
                <div style={{ fontSize: 28, marginBottom: 8 }}>\uD83D\uDE9A</div>
                <div style={{ fontSize: 13, fontWeight: 500, color: "var(--muted)", marginBottom: 4 }}>No active deliveries</div>
                <p style={{ fontSize: 11, color: "var(--ash)", margin: 0 }}>Your delivery status will show here once an order is placed.</p>
              </div>
            ) : (
              <>
                <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 16 }}>
                  <span style={{ fontSize: 24 }}>{getItemEmoji(activeOrder.items[0]?.product.name || "")}</span>
                  <div>
                    <div style={{ fontSize: 13, fontWeight: 500, color: "var(--ink)", fontFamily: "var(--font-mono)" }}>{activeOrder.id}</div>
                    <div style={{ fontSize: 11, color: "var(--muted)" }}>{activeOrder.items.map((i) => i.product.name).slice(0, 2).join(" \u00B7 ")}</div>
                  </div>
                </div>

                {currentStatusIdx >= 0 && (
                  <div style={{ display: "flex", alignItems: "center", gap: 0, marginBottom: 12, position: "relative" }}>
                    {statusSteps.map((s, i) => {
                      const isDone = i < currentStatusIdx;
                      const isActive = i === currentStatusIdx;
                      return (
                        <div key={s} style={{ flex: 1, display: "flex", flexDirection: "column", alignItems: "center", position: "relative" }}>
                          {i > 0 && <div style={{ position: "absolute", top: 10, left: "-50%", width: "100%", height: 2, background: isDone ? "var(--primary)" : "var(--hairline)", zIndex: 0 }} />}
                          <div style={{ width: 20, height: 20, borderRadius: "50%", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 10, fontWeight: 600, zIndex: 1, background: isDone ? "var(--primary)" : isActive ? "#fff" : "var(--hairline)", color: isDone ? "#fff" : isActive ? "var(--primary)" : "var(--stone)", border: isActive ? "2px solid var(--primary)" : "none" }}>
                            {isDone ? "\u2713" : i + 1}
                          </div>
                          <span style={{ fontSize: 9, color: isDone || isActive ? "var(--primary)" : "var(--muted)", marginTop: 4, textAlign: "center" }}>{stepLabels[s]}</span>
                        </div>
                      );
                    })}
                  </div>
                )}

                <span style={{ display: "inline-block", padding: "2px 8px", borderRadius: 999, fontSize: 10, fontWeight: 500, background: "var(--warning-bg)", color: "var(--warning)" }}>
                  {stepLabels[activeOrder.status] || activeOrder.status}
                </span>
              </>
            )}
          </div>
        </div>
      </div>

      {!mounted ? null : paidOrders.length > 0 || cartItems.length > 0 || wishlist.length > 0 ? (
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 12 }}>
          {paidOrders.length > 0 && (
            <div style={{ background: "#fff", borderRadius: 8, boxShadow: "0 0 0 1px rgba(0,0,0,0.04), 0 1px 2px rgba(0,0,0,0.04)" }}>
              <div style={{ padding: "12px 16px", borderBottom: "1px solid var(--hairline)" }}>
                <h3 style={{ fontSize: 12, fontWeight: 600, textTransform: "uppercase", letterSpacing: "0.04em", color: "var(--ink)", margin: 0 }}>Recently Ordered</h3>
              </div>
              <div style={{ padding: "0 16px" }}>
                {(() => {
                  const seen = new Set<string>();
                  const items: { name: string; price: number }[] = [];
                  for (const order of paidOrders) {
                    for (const item of order.items) {
                      if (!seen.has(item.product.name)) {
                        seen.add(item.product.name);
                        items.push({ name: item.product.name, price: item.price });
                      }
                    }
                    if (items.length >= 3) break;
                  }
                  return items.map((item) => (
                    <div key={item.name} style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "10px 0", borderBottom: "1px solid var(--hairline)", fontSize: 13, color: "var(--body)" }}>
                      <span>{item.name}</span>
                      <button
                        onClick={() => { setPage("shop"); router.push("/user/shop"); }}
                        style={{ padding: "4px 10px", fontSize: 11, borderRadius: 6, border: "none", background: "var(--primary)", color: "#fff", cursor: "pointer" }}
                      >
                        Shop
                      </button>
                    </div>
                  ));
                })()}
              </div>
            </div>
          )}
          {cartItems.length > 0 && (
            <div style={{ background: "#fff", borderRadius: 8, boxShadow: "0 0 0 1px rgba(0,0,0,0.04), 0 1px 2px rgba(0,0,0,0.04)" }}>
              <div style={{ padding: "12px 16px", borderBottom: "1px solid var(--hairline)" }}>
                <h3 style={{ fontSize: 12, fontWeight: 600, textTransform: "uppercase", letterSpacing: "0.04em", color: "var(--ink)", margin: 0 }}>In Your Cart</h3>
              </div>
              <div style={{ padding: "0 16px" }}>
                {cartItems.slice(0, 3).map((item) => (
                  <div key={item.id} style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "10px 0", borderBottom: "1px solid var(--hairline)", fontSize: 13, color: "var(--body)" }}>
                    <span>{item.emoji} {item.name} &times;{item.qty}</span>
                    <span style={{ fontWeight: 500 }}>${(item.unitPrice * item.qty).toFixed(2)}</span>
                  </div>
                ))}
                <div style={{ padding: "10px 0" }}>
                  <button
                    onClick={() => { setPage("cart"); router.push("/user/cart"); }}
                    style={{ width: "100%", padding: "6px 0", fontSize: 11, borderRadius: 6, border: "1px solid var(--hairline)", background: "#fff", color: "var(--body)", cursor: "pointer" }}
                  >
                    View Cart \u2192
                  </button>
                </div>
              </div>
            </div>
          )}
          {wishlist.length > 0 && (
            <div style={{ background: "#fff", borderRadius: 8, boxShadow: "0 0 0 1px rgba(0,0,0,0.04), 0 1px 2px rgba(0,0,0,0.04)" }}>
              <div style={{ padding: "12px 16px", borderBottom: "1px solid var(--hairline)" }}>
                <h3 style={{ fontSize: 12, fontWeight: 600, textTransform: "uppercase", letterSpacing: "0.04em", color: "var(--ink)", margin: 0 }}>Saved for Later</h3>
              </div>
              <div style={{ padding: "0 16px" }}>
                {wishlist.slice(0, 3).map((item) => (
                  <div key={item.id} style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "10px 0", borderBottom: "1px solid var(--hairline)", fontSize: 13, color: "var(--body)" }}>
                    <span>{item.emoji} {item.name}</span>
                    <button
                      onClick={() => { addToCart(item); showToast("Added to cart"); }}
                      style={{ padding: "4px 10px", fontSize: 11, borderRadius: 6, border: "1px solid var(--hairline)", background: "#fff", color: "var(--body)", cursor: "pointer" }}
                    >
                      Add
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      ) : !loading && (
        <div style={{ background: "#fff", borderRadius: 8, boxShadow: "0 0 0 1px rgba(0,0,0,0.04), 0 1px 2px rgba(0,0,0,0.04)", padding: 32, textAlign: "center" }}>
          <div style={{ fontSize: 32, marginBottom: 12 }}>\uD83D\uDED2</div>
          <div style={{ fontSize: 14, fontWeight: 500, color: "var(--muted)", marginBottom: 8 }}>Your overview is empty</div>
          <p style={{ fontSize: 12, color: "var(--ash)", margin: "0 0 16px" }}>Start shopping to see your orders, cart, and saved items.</p>
          <button
            onClick={() => { setPage("shop"); router.push("/user/shop"); }}
            style={{ padding: "8px 20px", fontSize: 13, fontWeight: 600, borderRadius: 6, border: "none", background: "var(--primary)", color: "#fff", cursor: "pointer" }}
          >
            Browse Products \u2192
          </button>
        </div>
      )}
    </div>
  );
}
