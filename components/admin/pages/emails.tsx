"use client";

import { useState, useEffect } from "react";
import { useAdmin } from "@/components/admin/admin-context";

export function EmailsPage() {
  const { showToast } = useAdmin();
  const [configured, setConfigured] = useState(false);
  const [sender, setSender] = useState("");
  const [errorMsg, setErrorMsg] = useState("");
  const [broadcasting, setBroadcasting] = useState(false);
  const [form, setForm] = useState({ subject: "", html: "" });
  const [confirmed, setConfirmed] = useState(false);

  useEffect(() => {
    fetch("/api/admin/emails")
      .then((r) => r.json())
      .then((data) => {
        setConfigured(data.configured);
        setSender(data.sender || "");
        if (data.error) setErrorMsg(data.error);
      })
      .catch(() => setErrorMsg("Failed to connect"))
      .finally(() => setConfirmed(false));
  }, []);

  async function handleBroadcast(e: React.FormEvent) {
    e.preventDefault();
    if (!confirmed) {
      showToast("Check the confirmation box to proceed", "warning");
      return;
    }
    setBroadcasting(true);
    try {
      const res = await fetch("/api/admin/emails", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      const data = await res.json();
      if (res.ok) {
        showToast(`Broadcast complete: ${data.sent} sent, ${data.failed} failed`);
        setForm({ subject: "", html: "" });
        setConfirmed(false);
      } else {
        showToast(data.error || "Failed to broadcast", "danger");
      }
    } catch {
      showToast("Failed to send broadcast", "danger");
    } finally {
      setBroadcasting(false);
    }
  }

  return (
    <div>
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 16 }}>
        <h1 style={{ fontSize: 20, fontWeight: 600, letterSpacing: "-0.03em", color: "var(--ink)", margin: 0 }}>Email</h1>
        {configured && sender && (
          <span style={{ fontSize: 12, color: "var(--muted)", fontFamily: "var(--font-mono)" }}>
            Sending as: {sender}
          </span>
        )}
      </div>

      {!configured ? (
        <div style={{ background: "#fff", borderRadius: 8, boxShadow: "0 0 0 1px rgba(0,0,0,0.04), 0 1px 2px rgba(0,0,0,0.04)", padding: 40, textAlign: "center" }}>
          <div style={{ fontSize: 36, marginBottom: 12 }}>&#9993;</div>
          <div style={{ fontSize: 14, fontWeight: 500, color: "var(--muted)", marginBottom: 4 }}>{errorMsg || "Email not configured"}</div>
          <p style={{ fontSize: 12, color: "var(--ash)", margin: 0 }}>
            Add RESEND_API_KEY to your Vercel environment variables.
          </p>
        </div>
      ) : (
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16 }}>
          <div style={{ background: "#fff", borderRadius: 8, boxShadow: "0 0 0 1px rgba(0,0,0,0.04), 0 1px 2px rgba(0,0,0,0.04)", padding: 20 }}>
            <h2 style={{ fontSize: 14, fontWeight: 600, color: "var(--ink)", margin: "0 0 16px" }}>Send Broadcast</h2>
            <p style={{ fontSize: 12, color: "var(--muted)", marginBottom: 16 }}>
              This will send an email to all registered users from <strong>{sender}</strong>.
            </p>
            <form onSubmit={handleBroadcast} style={{ display: "flex", flexDirection: "column", gap: 12 }}>
              <div>
                <label style={{ display: "block", fontSize: 12, fontWeight: 500, color: "var(--body)", marginBottom: 4 }}>Subject</label>
                <input
                  type="text"
                  required
                  value={form.subject}
                  onChange={(e) => setForm((f) => ({ ...f, subject: e.target.value }))}
                  placeholder="Announcement subject line"
                  style={{ width: "100%", height: 38, padding: "0 12px", borderRadius: 6, border: "1px solid var(--hairline)", fontSize: 13, outline: "none", boxSizing: "border-box" }}
                />
              </div>
              <div>
                <label style={{ display: "block", fontSize: 12, fontWeight: 500, color: "var(--body)", marginBottom: 4 }}>HTML Content</label>
                <textarea
                  required
                  value={form.html}
                  onChange={(e) => setForm((f) => ({ ...f, html: e.target.value }))}
                  placeholder="<h1>Hello!</h1><p>Your message here...</p>"
                  rows={8}
                  style={{ width: "100%", padding: "8px 12px", borderRadius: 6, border: "1px solid var(--hairline)", fontSize: 13, outline: "none", boxSizing: "border-box", resize: "vertical", fontFamily: "var(--font-mono)" }}
                />
              </div>
              <label style={{ display: "flex", alignItems: "center", gap: 8, fontSize: 12, color: "var(--body)", cursor: "pointer" }}>
                <input
                  type="checkbox"
                  checked={confirmed}
                  onChange={(e) => setConfirmed(e.target.checked)}
                  style={{ accentColor: "var(--primary)" }}
                />
                I confirm this will be sent to all registered users
              </label>
              <button
                type="submit"
                disabled={broadcasting || !confirmed}
                style={{ padding: "10px 0", fontSize: 13, fontWeight: 600, borderRadius: 6, border: "none", background: broadcasting || !confirmed ? "var(--surface-soft)" : "var(--primary)", color: "#fff", cursor: broadcasting || !confirmed ? "default" : "pointer", opacity: broadcasting || !confirmed ? 0.7 : 1 }}
              >
                {broadcasting ? "Sending..." : "Send to All Users"}
              </button>
            </form>
          </div>

          <div style={{ background: "#fff", borderRadius: 8, boxShadow: "0 0 0 1px rgba(0,0,0,0.04), 0 1px 2px rgba(0,0,0,0.04)", padding: 20 }}>
            <h2 style={{ fontSize: 14, fontWeight: 600, color: "var(--ink)", margin: "0 0 16px" }}>Automatic Emails</h2>
            <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
              {[
                { label: "Welcome email", desc: "Sent when a new user signs up" },
                { label: "Order confirmed", desc: "Sent when Stripe payment succeeds" },
              ].map((item) => (
                <div key={item.label} style={{ display: "flex", alignItems: "center", gap: 10, padding: "10px 0", borderBottom: "1px solid var(--hairline)" }}>
                  <span style={{ width: 8, height: 8, borderRadius: "50%", background: "var(--success)", flexShrink: 0 }} />
                  <div>
                    <div style={{ fontSize: 13, fontWeight: 500, color: "var(--ink)" }}>{item.label}</div>
                    <div style={{ fontSize: 11, color: "var(--ash)" }}>{item.desc}</div>
                  </div>
                  <span style={{ marginLeft: "auto", fontSize: 10, fontWeight: 600, color: "var(--success)", textTransform: "uppercase" }}>Active</span>
                </div>
              ))}
            </div>
            <p style={{ fontSize: 11, color: "var(--ash)", marginTop: 16, textAlign: "center" }}>
              All emails sent from <strong style={{ color: "var(--body)" }}>{sender || "info@denimarketplace.com"}</strong>
            </p>
          </div>
        </div>
      )}
    </div>
  );
}
