"use client";

import { useState, Fragment } from "react";
import { ORDERS, TRACKING_EVENTS } from "@/lib/data/user";
import { useUser } from "@/components/user/user-context";
import type { TrackingEvent } from "@/lib/types/user";

const statusProgression = ["confirmed", "packed", "shipped", "delivered"];

export function TrackingPage() {
  const { showToast } = useUser();
  const [orderId, setOrderId] = useState("NP-3841");
  const [events, setEvents] = useState<TrackingEvent[]>(TRACKING_EVENTS);
  const [trackingStatus, setTrackingStatus] = useState("shipped");

  const order = ORDERS.find((o) => o.id === orderId);

  function handleSimulate() {
    const idx = statusProgression.indexOf(trackingStatus);
    if (idx >= statusProgression.length - 1) {
      showToast("Already delivered! \uD83C\uDF89");
      return;
    }
    const nextStatus = statusProgression[idx + 1];
    setTrackingStatus(nextStatus);
    setEvents((prev) =>
      prev.map((e) => {
        const statusIdx = statusProgression.indexOf(nextStatus);
        if (e.step - 1 < statusIdx) return { ...e, status: "done" as const };
        if (e.step - 1 === statusIdx) return { ...e, status: "active" as const, time: "Just now" };
        return e;
      })
    );
    showToast(`Order status: ${nextStatus.charAt(0).toUpperCase() + nextStatus.slice(1)}`);
  }

  return (
    <div>
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 4 }}>
        <h1 style={{ fontSize: 20, fontWeight: 600, letterSpacing: "-0.03em", color: "var(--ink)", margin: 0 }}>Tracking</h1>
        <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
          <select
            value={orderId}
            onChange={(e) => { setOrderId(e.target.value); setTrackingStatus("shipped"); setEvents(TRACKING_EVENTS); }}
            style={{ fontSize: 11, padding: "4px 8px", borderRadius: 6, border: "1px solid var(--hairline)", background: "#fff", outline: "none" }}
          >
            {ORDERS.filter((o) => o.trackingNumber).map((o) => (
              <option key={o.id} value={o.id}>{o.id}</option>
            ))}
          </select>
          <div style={{ display: "flex", alignItems: "center", gap: 4, fontSize: 10, fontFamily: "var(--font-mono)", color: "var(--success)" }}>
            <span style={{ width: 6, height: 6, borderRadius: "50%", background: "var(--success)", display: "inline-block" }} />
            Live
          </div>
        </div>
      </div>
      <p style={{ fontSize: 13, color: "var(--muted)", marginBottom: 16 }}>
        {order?.id ?? orderId}{order?.trackingNumber ? ` \u00B7 Tracking: ${order.trackingNumber}` : ""} &middot; {order?.items ?? "Suya Spice Set, Plantain Chips, Palm Oil"}
      </p>

      <div style={{ background: "var(--surface-soft)", borderRadius: 8, height: 180, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", marginBottom: 12 }}>
        <div style={{ fontSize: 32, marginBottom: 8, color: "var(--stone)" }}>\uD83D\uDDFA\uFE0F</div>
        <div style={{ fontSize: 12, color: "var(--muted)", marginBottom: 12 }}>Map view &mdash; OpenStreetMap integration</div>
        {trackingStatus === "delivered" ? (
          <div style={{ fontSize: 13, fontWeight: 600, color: "var(--success)" }}>\u2713 Delivered</div>
        ) : (
          <button onClick={handleSimulate} style={{ padding: "5px 12px", fontSize: 11, borderRadius: 6, border: "none", background: "var(--primary)", color: "#fff", cursor: "pointer" }}>
            \u25B6 Simulate Next Status
          </button>
        )}
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
        <div style={{ background: "#fff", borderRadius: 8, boxShadow: "0 0 0 1px rgba(0,0,0,0.04), 0 1px 2px rgba(0,0,0,0.04)", padding: 16 }}>
          <h3 style={{ fontSize: 12, fontWeight: 600, textTransform: "uppercase", letterSpacing: "0.04em", color: "var(--ink)", margin: "0 0 12px" }}>Timeline</h3>
          <p style={{ fontSize: 10, color: "var(--ash)", fontFamily: "var(--font-mono)", margin: "0 0 12px" }}>Auto-updates</p>
          {events.map((ev, i) => (
            <div key={ev.step} style={{ display: "flex", gap: 12, position: "relative", paddingBottom: i < events.length - 1 ? 16 : 0 }}>
              {i < events.length - 1 && <div style={{ position: "absolute", left: 9, top: 20, width: 1, height: "calc(100% - 4px)", background: ev.status === "done" ? "var(--primary)" : "var(--hairline)" }} />}
              <div style={{ width: 20, height: 20, borderRadius: "50%", flexShrink: 0, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 10, fontWeight: 600, background: ev.status === "done" ? "var(--primary)" : ev.status === "active" ? "#fff" : "var(--hairline)", color: ev.status === "done" ? "#fff" : ev.status === "active" ? "var(--primary)" : "var(--stone)", border: ev.status === "active" ? "2px solid var(--primary)" : "none" }}>
                {ev.status === "done" ? "\u2713" : ev.step}
              </div>
              <div style={{ flex: 1 }}>
                <div style={{ fontSize: 13, fontWeight: 500, color: ev.status === "done" || ev.status === "active" ? "var(--ink)" : "var(--muted)" }}>{ev.label}</div>
                <div style={{ fontSize: 11, color: "var(--muted)" }}>{ev.description}</div>
                <div style={{ fontSize: 10, color: "var(--ash)" }}>{ev.time}</div>
              </div>
            </div>
          ))}
        </div>

        <div style={{ background: "#fff", borderRadius: 8, boxShadow: "0 0 0 1px rgba(0,0,0,0.04), 0 1px 2px rgba(0,0,0,0.04)", padding: 16 }}>
          <h3 style={{ fontSize: 12, fontWeight: 600, textTransform: "uppercase", letterSpacing: "0.04em", color: "var(--ink)", margin: "0 0 12px" }}>Delivery Info</h3>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "8px 12px", fontSize: 13 }}>
            {[
              ["Rider", "Tunde Akinwale"],
              ["Rider rating", "\u2B50 4.9 \u00B7 200+ deliveries"],
              ["ETA", "2:30 PM"],
              ["Address", "14 Bode Thomas St"],
              ["", "Surulere, Lagos 101241"],
              ["Contact", "+234 803 456 7890"],
            ].map(([label, value], idx) => (
              <Fragment key={idx}>
                <div style={{ color: "var(--muted)" }}>{label}</div>
                <div style={{ color: "var(--body)", fontWeight: label === "ETA" ? 600 : 400, fontSize: label === "ETA" ? 16 : 13 }}>{value}</div>
              </Fragment>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
