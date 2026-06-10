"use client";

import { useState } from "react";
import { useUser } from "@/components/user/user-context";
import { ChevronIcon } from "@/components/user/icons";
import { useRouter } from "next/navigation";

export function NotificationsPage() {
  const { notifs, setNotifs, setPage, showToast } = useUser();
  const router = useRouter();
  const [detail, setDetail] = useState<number | string | null>(null);

  function markRead(id: number | string) {
    setNotifs((prev) => prev.map((n) => (n.id === id ? { ...n, read: true } : n)));
    fetch("/api/notifications/read", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id: String(id) }),
    }).catch(() => {});
  }

  if (detail !== null) {
    const notif = notifs.find((n) => n.id === detail);
    if (!notif) return null;

    const icon = notif.title.includes("Order") || notif.title.includes("NP-") ? "\uD83D\uDCE6" : notif.title.includes("Sale") || notif.title.includes("Chef") ? "\uD83C\uDF89" : "\uD83C\uDF89";

    return (
      <div>
        <button onClick={() => setDetail(null)} style={{ background: "none", border: "none", cursor: "pointer", padding: 0, display: "flex", alignItems: "center", gap: 4, fontSize: 13, color: "var(--body)", marginBottom: 16 }}>
          <ChevronIcon /> Back
        </button>

        <div style={{ background: "#fff", borderRadius: 8, boxShadow: "0 0 0 1px rgba(0,0,0,0.04), 0 1px 2px rgba(0,0,0,0.04)", padding: 20, maxWidth: 480 }}>
          <div style={{ fontSize: 28, marginBottom: 8 }}>{icon}</div>
          <h2 style={{ fontSize: 15, fontWeight: 500, color: "var(--ink)", margin: "0 0 4px" }}>{notif.title}</h2>
          <div style={{ fontSize: 11, color: "var(--muted-text)", marginBottom: 12 }}>{notif.time}</div>
          <p style={{ fontSize: 13, color: "var(--body)", lineHeight: 1.5, margin: "0 0 16px" }}>{notif.description}</p>

          {notif.title.toLowerCase().includes("order") || notif.title.toLowerCase().includes("paid") ? (
            <button onClick={() => { setPage("orders"); setDetail(null); router.push("/user/orders"); }} style={{ padding: "6px 14px", fontSize: 12, borderRadius: 6, border: "none", background: "var(--primary)", color: "#fff", cursor: "pointer" }}>
              View Order \u2192
            </button>
          ) : (
            <div style={{ background: "var(--surface-soft)", borderRadius: 6, padding: 12 }}>
              <div style={{ fontSize: 12, color: "var(--muted)", marginBottom: 4 }}>Promotion</div>
              <div style={{ fontSize: 13, fontWeight: 600, color: "var(--ink)", fontFamily: "var(--font-mono)" }}>
                Check the shop for current deals
              </div>
            </div>
          )}
        </div>
      </div>
    );
  }

  const unreadCount = notifs.filter((n) => !n.read).length;

  return (
    <div>
      <h1 style={{ fontSize: 20, fontWeight: 600, letterSpacing: "-0.03em", color: "var(--ink)", marginBottom: 4 }}>Notifications</h1>
      <p style={{ fontSize: 13, color: "var(--muted-text)", marginBottom: 16 }}>{unreadCount} unread</p>

      {notifs.map((n) => (
        <div key={n.id} onClick={() => { markRead(n.id); setDetail(n.id); }} style={{ display: "flex", gap: 12, padding: "12px 16px", background: n.read ? "#fff" : "var(--primary-bg)", borderRadius: 8, cursor: "pointer", marginBottom: 6, transition: "all 150ms", boxShadow: "0 0 0 1px rgba(0,0,0,0.04), 0 1px 2px rgba(0,0,0,0.04)" }}
          onMouseEnter={(e) => { e.currentTarget.style.paddingLeft = "20px"; e.currentTarget.style.paddingRight = "20px"; }}
          onMouseLeave={(e) => { e.currentTarget.style.paddingLeft = "16px"; e.currentTarget.style.paddingRight = "16px"; }}
        >
          <div style={{ width: 8, height: 8, borderRadius: "50%", marginTop: 4, flexShrink: 0, background: n.read ? "var(--hairline)" : "var(--danger)" }} />
          <div style={{ flex: 1 }}>
            <div style={{ fontSize: 13, fontWeight: 500, color: "var(--ink)", marginBottom: 2 }}>{n.title}</div>
            <div style={{ fontSize: 12, color: "var(--muted-text)", marginBottom: 2 }}>{n.description}</div>
            <div style={{ fontSize: 10, color: "var(--ash)" }}>{n.time}</div>
          </div>
        </div>
      ))}
    </div>
  );
}
