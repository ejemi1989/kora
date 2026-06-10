"use client";

import { useState, Fragment, useEffect } from "react";

interface TrackingEvent {
  step: number;
  label: string;
  description: string;
  time: string;
}

interface ApiOrder {
  id: string;
  status: string;
  total: number;
  createdAt: string;
  items: { product: { name: string }; quantity: number; price: number }[];
  tracking: TrackingEvent[];
}

export function TrackingPage() {
  const [orders, setOrders] = useState<ApiOrder[]>([]);
  const [orderId, setOrderId] = useState("");
  const [events, setEvents] = useState<TrackingEvent[]>([]);

  useEffect(() => {
    fetch("/api/orders")
      .then((r) => r.json())
      .then((data) => {
        if (data.orders) {
          const paid = data.orders.filter((o: ApiOrder) => o.status !== "PENDING");
          setOrders(paid);
          if (paid.length > 0) {
            setOrderId(paid[0].id);
            setEvents(paid[0].tracking || []);
          }
        }
      })
      .catch(() => {});
  }, []);

  function handleSelect(id: string) {
    setOrderId(id);
    const o = orders.find((x) => x.id === id);
    setEvents(o?.tracking || []);
  }

  const currentOrder = orders.find((o) => o.id === orderId);

  if (orders.length === 0) {
    return (
      <div>
        <h1 style={{ fontSize: 20, fontWeight: 600, letterSpacing: "-0.03em", color: "var(--ink)", marginBottom: 16 }}>Tracking</h1>
        <div style={{ background: "#fff", borderRadius: 8, boxShadow: "0 0 0 1px rgba(0,0,0,0.04), 0 1px 2px rgba(0,0,0,0.04)", padding: 32, textAlign: "center" }}>
          <div style={{ fontSize: 36, color: "var(--stone)", marginBottom: 8 }}>\uD83D\uDCE6</div>
          <div style={{ fontSize: 14, fontWeight: 500, color: "var(--muted)" }}>No trackable orders</div>
          <p style={{ fontSize: 12, color: "var(--ash)", margin: "4px 0 0" }}>Orders with tracking will appear here after payment.</p>
        </div>
      </div>
    );
  }

  return (
    <div>
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 4 }}>
        <h1 style={{ fontSize: 20, fontWeight: 600, letterSpacing: "-0.03em", color: "var(--ink)", margin: 0 }}>Tracking</h1>
        <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
          <select
            value={orderId}
            onChange={(e) => handleSelect(e.target.value)}
            style={{ fontSize: 11, padding: "4px 8px", borderRadius: 6, border: "1px solid var(--hairline)", background: "#fff", outline: "none" }}
          >
            {orders.map((o) => (
              <option key={o.id} value={o.id} style={{ fontFamily: "var(--font-mono)" }}>{o.id}</option>
            ))}
          </select>
          <div style={{ display: "flex", alignItems: "center", gap: 4, fontSize: 10, fontFamily: "var(--font-mono)", color: "var(--success)" }}>
            <span style={{ width: 6, height: 6, borderRadius: "50%", background: "var(--success)", display: "inline-block" }} />
            Live
          </div>
        </div>
      </div>
      <p style={{ fontSize: 13, color: "var(--muted)", marginBottom: 16 }}>
        <span style={{ fontFamily: "var(--font-mono)" }}>{currentOrder?.id}</span> &middot; {currentOrder?.items.map((i) => i.product.name).join(", ")}
      </p>

      <div style={{ background: "var(--surface-soft)", borderRadius: 8, height: 180, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", marginBottom: 12 }}>
        <div style={{ fontSize: 32, marginBottom: 8, color: "var(--stone)" }}>\uD83D\uDDFA\uFE0F</div>
        <div style={{ fontSize: 12, color: "var(--muted)", marginBottom: 12 }}>Map view &mdash; OpenStreetMap integration</div>
        {currentOrder?.status === "DELIVERED" ? (
          <div style={{ fontSize: 13, fontWeight: 600, color: "var(--success)" }}>\u2713 Delivered</div>
        ) : (
          <div style={{ fontSize: 13, fontWeight: 600, color: "var(--primary)" }}>
            {currentOrder?.status === "PAID" ? "Payment confirmed" : "In transit"}
          </div>
        )}
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
        <div style={{ background: "#fff", borderRadius: 8, boxShadow: "0 0 0 1px rgba(0,0,0,0.04), 0 1px 2px rgba(0,0,0,0.04)", padding: 16 }}>
          <h3 style={{ fontSize: 12, fontWeight: 600, textTransform: "uppercase", letterSpacing: "0.04em", color: "var(--ink)", margin: "0 0 12px" }}>Timeline</h3>
          <p style={{ fontSize: 10, color: "var(--ash)", fontFamily: "var(--font-mono)", margin: "0 0 12px" }}>Auto-updates</p>
          {events.length === 0 ? (
            <div style={{ fontSize: 12, color: "var(--muted)" }}>No tracking events yet.</div>
          ) : (
            events.map((ev, i) => (
              <div key={ev.step} style={{ display: "flex", gap: 12, position: "relative", paddingBottom: i < events.length - 1 ? 16 : 0 }}>
                {i < events.length - 1 && <div style={{ position: "absolute", left: 9, top: 20, width: 1, height: "calc(100% - 4px)", background: "var(--hairline)" }} />}
                <div style={{ width: 20, height: 20, borderRadius: "50%", flexShrink: 0, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 10, fontWeight: 600, background: "var(--primary)", color: "#fff", border: "none" }}>
                  {"\u2713"}
                </div>
                <div style={{ flex: 1 }}>
                  <div style={{ fontSize: 13, fontWeight: 500, color: "var(--ink)" }}>{ev.label}</div>
                  <div style={{ fontSize: 11, color: "var(--muted)" }}>{ev.description}</div>
                  <div style={{ fontSize: 10, color: "var(--ash)" }}>{ev.time}</div>
                </div>
              </div>
            ))
          )}
        </div>

        <div style={{ background: "#fff", borderRadius: 8, boxShadow: "0 0 0 1px rgba(0,0,0,0.04), 0 1px 2px rgba(0,0,0,0.04)", padding: 16 }}>
          <h3 style={{ fontSize: 12, fontWeight: 600, textTransform: "uppercase", letterSpacing: "0.04em", color: "var(--ink)", margin: "0 0 12px" }}>Delivery Info</h3>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "8px 12px", fontSize: 13 }}>
            {[
              ["Rider", "Tunde Akinwale"],
              ["Rider rating", "\u2B50 4.9 \u00B7 200+ deliveries"],
              ["ETA", "2:30 PM"],
              ["Status", currentOrder?.status === "DELIVERED" ? "Delivered" : "In transit"],
            ].map(([label, value], idx) => (
              <Fragment key={idx}>
                <div style={{ color: "var(--muted)" }}>{label}</div>
                <div style={{ color: "var(--body)", fontWeight: "normal", fontSize: 13 }}>{value}</div>
              </Fragment>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
