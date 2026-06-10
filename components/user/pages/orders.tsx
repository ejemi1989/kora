"use client";

import { useState, useEffect, useCallback } from "react";
import { useUser } from "@/components/user/user-context";
import { PRODUCTS, TRACKING_EVENTS } from "@/lib/data/user";
import { ChevronIcon } from "@/components/user/icons";
import { useSearchParams } from "next/navigation";

interface ApiOrder {
  id: string;
  total: number;
  status: string;
  createdAt: string;
  items: { product: { name: string; emoji?: string }; quantity: number; price: number }[];
  tracking: { step: number; label: string; description: string; time: string }[];
}

const statusBadge: Record<string, { bg: string; color: string; label: string }> = {
  pending: { bg: "var(--surface-soft)", color: "var(--muted)", label: "Pending" },
  paid: { bg: "var(--primary-bg)", color: "var(--primary)", label: "Paid" },
  processing: { bg: "var(--warning-bg)", color: "var(--warning)", label: "Processing" },
  shipped: { bg: "var(--info-bg)", color: "var(--info)", label: "Shipped" },
  in_transit: { bg: "var(--info-bg)", color: "var(--info)", label: "In Transit" },
  delivered: { bg: "var(--success-bg)", color: "var(--success)", label: "Delivered" },
  cancelled: { bg: "var(--danger-bg)", color: "var(--danger)", label: "Cancelled" },
};

export function OrdersPage() {
  const [selected, setSelected] = useState<string | null>(null);
  const [filter, setFilter] = useState("All");
  const [apiOrders, setApiOrders] = useState<ApiOrder[]>([]);
  const { addToCart, showToast } = useUser();
  const searchParams = useSearchParams();

  const fetchOrders = useCallback(() => {
    fetch("/api/orders")
      .then((r) => r.json())
      .then((data) => {
        if (data.orders) setApiOrders(data.orders);
      })
      .catch(() => {});
  }, []);

  useEffect(() => {
    const fromStripe = searchParams.get("session_id");
    if (fromStripe) {
      showToast("Payment successful! \uD83C\uDF89 Your order is being processed.", "success");
    }
    fetchOrders();
    if (fromStripe) {
      const retry = setInterval(fetchOrders, 1500);
      setTimeout(() => clearInterval(retry), 15000);
      return () => clearInterval(retry);
    }
  }, [fetchOrders, searchParams]);

  const filteredOrders = apiOrders.filter((o) => {
    if (filter === "Active") return o.status !== "DELIVERED" && o.status !== "CANCELLED";
    if (filter === "Delivered") return o.status === "DELIVERED";
    return true;
  });

  if (selected) {
    const order = apiOrders.find((o) => o.id === selected);
    if (!order) return null;
    const statusKey = order.status.toLowerCase();
    const bad = statusBadge[statusKey] || statusBadge.pending;
    const itemNames = order.items.map((i) => i.product.name);
    const firstItem = order.items[0];
    const emoji = firstItem?.product.emoji || "\uD83D\uDCE6";

    function handleReorderAll() {
      itemNames.forEach((name) => {
        const product = PRODUCTS.find((p) => p.name.startsWith(name.trim()));
        if (product) {
          addToCart({ id: product.id, name: product.name, price: product.price, description: product.description, emoji: product.emoji });
        }
      });
      showToast("All items added to cart!");
    }

    const orderEvents = order.tracking.length > 0
      ? order.tracking
      : TRACKING_EVENTS;

    const stepMap: Record<string, number> = {
      pending: -1, paid: 0, processing: 1, shipped: 2, in_transit: 2, delivered: 3,
    };
    const currentStep = stepMap[order.status.toLowerCase()] ?? 0;
    const steps = ["Paid", "Processing", "Shipped", "Delivered"];

    return (
      <div>
        <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 16 }}>
          <button onClick={() => setSelected(null)} style={{ background: "none", border: "none", cursor: "pointer", padding: 0, display: "flex", color: "var(--body)" }}>
            <ChevronIcon />
          </button>
          <div>
            <h1 style={{ fontSize: 20, fontWeight: 600, letterSpacing: "-0.03em", color: "var(--ink)", margin: 0, fontFamily: "var(--font-mono)" }}>Order {order.id}</h1>
            <p style={{ fontSize: 12, color: "var(--muted)", margin: "2px 0 0" }}>Placed {new Date(order.createdAt).toLocaleDateString()}</p>
          </div>
          <div style={{ flex: 1 }} />
          <button onClick={handleReorderAll} style={{ padding: "5px 10px", fontSize: 11, borderRadius: 6, border: "none", background: "var(--primary)", color: "#fff", cursor: "pointer" }}>\uD83D\uDD04 Reorder All</button>
          <span style={{ display: "inline-block", padding: "2px 8px", borderRadius: 999, fontSize: 10, fontWeight: 500, background: bad.bg, color: bad.color }}>{bad.label}</span>
        </div>

        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12, marginBottom: 12 }}>
          <div style={{ background: "#fff", borderRadius: 8, boxShadow: "0 0 0 1px rgba(0,0,0,0.04), 0 1px 2px rgba(0,0,0,0.04)", padding: 16 }}>
            <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 12 }}>
              <span style={{ fontSize: 44 }}>{emoji}</span>
              <div>
                <div style={{ fontSize: 15, fontWeight: 500, color: "var(--ink)" }}>{firstItem?.product.name || "Items"}</div>
                <div style={{ fontSize: 12, color: "var(--muted)" }}>{itemNames.join(", ")}</div>
              </div>
            </div>
            <div style={{ fontSize: 18, fontWeight: 600, color: "var(--primary)" }}>${order.total.toFixed(2)}</div>
            <div style={{ fontSize: 11, color: "var(--ash)", marginTop: 2 }}>{order.items.length} item{order.items.length > 1 ? "s" : ""}</div>
          </div>

          <div style={{ background: "#fff", borderRadius: 8, boxShadow: "0 0 0 1px rgba(0,0,0,0.04), 0 1px 2px rgba(0,0,0,0.04)", padding: 16 }}>
            <div style={{ fontSize: 12, fontWeight: 600, textTransform: "uppercase", letterSpacing: "0.04em", color: "var(--ink)", marginBottom: 12 }}>Delivery Status</div>
            <div style={{ display: "flex", alignItems: "center", gap: 0, marginBottom: 12 }}>
              {steps.map((s, i) => {
                const isDone = i < currentStep;
                const isActive = i === currentStep;
                return (
                  <div key={s} style={{ flex: 1, display: "flex", flexDirection: "column", alignItems: "center", position: "relative" }}>
                    {i > 0 && <div style={{ position: "absolute", top: 10, left: "-50%", width: "100%", height: 2, background: isDone ? "var(--primary)" : "var(--hairline)", zIndex: 0 }} />}
                    <div style={{ width: 20, height: 20, borderRadius: "50%", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 10, fontWeight: 600, zIndex: 1, background: isDone ? "var(--primary)" : isActive ? "#fff" : "var(--hairline)", color: isDone ? "#fff" : isActive ? "var(--primary)" : "var(--stone)", border: isActive ? "2px solid var(--primary)" : "none" }}>
                      {isDone ? "\u2713" : i + 1}
                    </div>
                    <span style={{ fontSize: 9, color: isDone || isActive ? "var(--primary)" : "var(--muted)", marginTop: 4, textAlign: "center", textTransform: "capitalize" }}>{s}</span>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        <div style={{ background: "#fff", borderRadius: 8, boxShadow: "0 0 0 1px rgba(0,0,0,0.04), 0 1px 2px rgba(0,0,0,0.04)", padding: 16 }}>
          <h3 style={{ fontSize: 12, fontWeight: 600, textTransform: "uppercase", letterSpacing: "0.04em", color: "var(--ink)", margin: "0 0 12px" }}>Tracking Timeline</h3>
          {orderEvents.map((ev, i) => (
            <div key={ev.step} style={{ display: "flex", gap: 12, position: "relative", paddingBottom: i < orderEvents.length - 1 ? 16 : 0 }}>
              {i < orderEvents.length - 1 && <div style={{ position: "absolute", left: 9, top: 20, width: 1, height: "calc(100% - 4px)", background: "var(--hairline)" }} />}
              <div style={{ width: 20, height: 20, borderRadius: "50%", flexShrink: 0, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 10, fontWeight: 600, background: "var(--primary)", color: "#fff", border: "none" }}>
                {"\u2713"}
              </div>
              <div style={{ flex: 1 }}>
                <div style={{ fontSize: 13, fontWeight: 500, color: "var(--ink)" }}>{ev.label}</div>
                <div style={{ fontSize: 11, color: "var(--muted)" }}>{ev.description}</div>
                <div style={{ fontSize: 10, color: "var(--ash)" }}>{ev.time}</div>
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div>
      <h1 style={{ fontSize: 20, fontWeight: 600, letterSpacing: "-0.03em", color: "var(--ink)", marginBottom: 4 }}>Orders</h1>
      <p style={{ fontSize: 13, color: "var(--muted)", marginBottom: 16 }}>All your past and current orders.</p>

      <div style={{ display: "flex", gap: 6, marginBottom: 12 }}>
        {["All", "Active", "Delivered"].map((f) => (
          <button key={f} onClick={() => setFilter(f)} style={{ padding: "5px 12px", fontSize: 12, borderRadius: 999, border: "none", background: filter === f ? "var(--primary)" : "var(--surface-soft)", color: filter === f ? "#fff" : "var(--body)", cursor: "pointer", fontWeight: 500 }}>
            {f}
          </button>
        ))}
      </div>

      {filteredOrders.length === 0 ? (
        <div style={{ background: "#fff", borderRadius: 8, boxShadow: "0 0 0 1px rgba(0,0,0,0.04), 0 1px 2px rgba(0,0,0,0.04)", padding: 32, textAlign: "center" }}>
          <div style={{ fontSize: 36, color: "var(--stone)", marginBottom: 8 }}>\uD83D\uDED2</div>
          <div style={{ fontSize: 14, fontWeight: 500, color: "var(--muted)" }}>No orders yet</div>
          <p style={{ fontSize: 12, color: "var(--ash)", margin: "4px 0 0" }}>Your paid orders will appear here.</p>
        </div>
      ) : (
      <div style={{ background: "#fff", borderRadius: 8, boxShadow: "0 0 0 1px rgba(0,0,0,0.04), 0 1px 2px rgba(0,0,0,0.04)" }}>
        <div style={{ padding: "12px 16px", borderBottom: "1px solid var(--hairline)", fontSize: 12, fontWeight: 600, textTransform: "uppercase", letterSpacing: "0.04em", color: "var(--ink)" }}>
          {filteredOrders.length} order{filteredOrders.length !== 1 ? "s" : ""}
        </div>
        {filteredOrders.map((order) => {
          const statusKey = order.status.toLowerCase();
          const bad = statusBadge[statusKey] || statusBadge.pending;
          return (
            <div key={order.id} onClick={() => setSelected(order.id)} style={{ display: "flex", alignItems: "center", gap: 12, padding: "12px 16px", borderBottom: "1px solid var(--hairline)", cursor: "pointer", transition: "background 150ms" }}
              onMouseEnter={(e) => { e.currentTarget.style.background = "var(--canvas)"; }}
              onMouseLeave={(e) => { e.currentTarget.style.background = "none"; }}
            >
              <div style={{ width: 36, height: 36, borderRadius: 6, background: "var(--surface-soft)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 18, flexShrink: 0 }}>\uD83D\uDCE6</div>
              <div style={{ flex: 1 }}>
                <div style={{ fontSize: 13, fontWeight: 500, color: "var(--ink)", fontFamily: "var(--font-mono)" }}>{order.id}</div>
                <div style={{ fontSize: 11, color: "var(--muted)" }}>{order.items.map((i) => i.product.name).join(", ")}</div>
              </div>
              <span style={{ display: "inline-block", padding: "2px 8px", borderRadius: 999, fontSize: 10, fontWeight: 500, background: bad.bg, color: bad.color }}>{bad.label}</span>
              <div style={{ textAlign: "right" }}>
                <div style={{ fontSize: 13, fontWeight: 600, color: "var(--ink)" }}>${order.total.toFixed(2)}</div>
                <div style={{ fontSize: 10, color: "var(--ash)" }}>{new Date(order.createdAt).toLocaleDateString()}</div>
              </div>
            </div>
          );
        })}
      </div>
      )}
    </div>
  );
}
