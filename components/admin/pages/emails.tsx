"use client";

import { useState, useEffect } from "react";
import { useAdmin } from "@/components/admin/admin-context";

interface EmailRecord {
  id: string;
  from?: string;
  to?: string[];
  subject?: string;
  created_at?: string;
  last_event?: string;
}

interface EmailStats {
  totalSent: number;
  sender: string;
}

export function EmailsPage() {
  const { showToast } = useAdmin();
  const [loading, setLoading] = useState(true);
  const [configured, setConfigured] = useState(false);
  const [sender, setSender] = useState("");
  const [emails, setEmails] = useState<EmailRecord[]>([]);
  const [stats, setStats] = useState<EmailStats>({ totalSent: 0, sender: "" });
  const [errorMsg, setErrorMsg] = useState("");
  const [tab, setTab] = useState<"inbox" | "broadcast">("inbox");
  const [broadcasting, setBroadcasting] = useState(false);
  const [form, setForm] = useState({ subject: "", html: "" });
  const [confirmed, setConfirmed] = useState(false);

  useEffect(() => {
    fetch("/api/admin/emails")
      .then((r) => r.json())
      .then((data) => {
        setConfigured(data.configured);
        setSender(data.sender || "");
        setEmails(data.emails || []);
        setStats(data.stats || { totalSent: 0, sender: "" });
        if (data.error) setErrorMsg(data.error);
      })
      .catch(() => setErrorMsg("Failed to connect"))
      .finally(() => setLoading(false));
  }, []);

  async function handleBroadcast(e: React.FormEvent) {
    e.preventDefault();
    if (!confirmed) { showToast("Check the confirmation box", "warning"); return; }
    setBroadcasting(true);
    try {
      const res = await fetch("/api/admin/emails", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      const data = await res.json();
      if (res.ok) {
        showToast(`${data.sent} sent, ${data.failed} failed`);
        setForm({ subject: "", html: "" });
        setConfirmed(false);
        setTab("inbox");
      } else {
        showToast(data.error || "Failed", "danger");
      }
    } catch {
      showToast("Failed to broadcast", "danger");
    } finally {
      setBroadcasting(false);
    }
  }

  return (
    <div>
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 16 }}>
        <div>
          <h1 style={{ fontSize: 20, fontWeight: 600, letterSpacing: "-0.03em", color: "var(--ink)", margin: 0 }}>Email</h1>
          {configured && sender && (
            <p style={{ fontSize: 11, color: "var(--muted)", margin: "2px 0 0", fontFamily: "var(--font-mono)" }}>Sending as {sender}</p>
          )}
        </div>
        {configured && stats.totalSent > 0 && (
          <span style={{ fontSize: 12, fontWeight: 500, color: "var(--muted)", background: "var(--surface-soft)", padding: "4px 10px", borderRadius: 6 }}>
            {stats.totalSent} emails sent
          </span>
        )}
      </div>

      {!configured ? (
        <div style={{ background: "#fff", borderRadius: 8, boxShadow: "0 0 0 1px rgba(0,0,0,0.04), 0 1px 2px rgba(0,0,0,0.04)", padding: 40, textAlign: "center" }}>
          <div style={{ fontSize: 36, marginBottom: 12 }}>&#9993;</div>
          <div style={{ fontSize: 14, fontWeight: 500, color: "var(--muted)", marginBottom: 4 }}>{errorMsg || "Email not configured"}</div>
          <p style={{ fontSize: 12, color: "var(--ash)", margin: 0 }}>Add RESEND_API_KEY to your Vercel environment variables.</p>
        </div>
      ) : (
        <>
          <div style={{ display: "flex", gap: 6, marginBottom: 16 }}>
            {(["inbox", "broadcast"] as const).map((t) => (
              <button
                key={t}
                onClick={() => setTab(t)}
                style={{
                  padding: "5px 14px", fontSize: 12, fontWeight: 500, borderRadius: 999, border: "none",
                  background: tab === t ? "var(--primary)" : "var(--surface-soft)",
                  color: tab === t ? "#fff" : "var(--body)", cursor: "pointer",
                }}
              >
                {t === "inbox" ? "Sent Emails" : "Send Broadcast"}
              </button>
            ))}
          </div>

          {tab === "inbox" ? (
            <div style={{ background: "#fff", borderRadius: 8, boxShadow: "0 0 0 1px rgba(0,0,0,0.04), 0 1px 2px rgba(0,0,0,0.04)" }}>
              <div style={{ padding: "12px 16px", borderBottom: "1px solid var(--hairline)", display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                <span style={{ fontSize: 12, fontWeight: 600, textTransform: "uppercase", letterSpacing: "0.04em", color: "var(--ink)" }}>Sent Emails</span>
                <span style={{ fontSize: 11, color: "var(--ash)" }}>Last 50</span>
              </div>
              {loading ? (
                <div style={{ padding: "32px 16px", textAlign: "center", fontSize: 12, color: "var(--ash)" }}>Loading...</div>
              ) : emails.length === 0 ? (
                <div style={{ padding: "40px 16px", textAlign: "center" }}>
                  <div style={{ fontSize: 28, marginBottom: 8 }}>&#9993;</div>
                  <div style={{ fontSize: 13, fontWeight: 500, color: "var(--muted)", marginBottom: 4 }}>No emails sent yet</div>
                  <p style={{ fontSize: 11, color: "var(--ash)", margin: "0 0 12px" }}>Sent emails will appear here with delivery status.</p>
                  <button onClick={() => setTab("broadcast")} style={{ padding: "6px 14px", fontSize: 12, borderRadius: 6, border: "none", background: "var(--primary)", color: "#fff", cursor: "pointer" }}>
                    Send Your First Email
                  </button>
                </div>
              ) : (
                emails.map((email, i) => {
                  const date = email.created_at ? new Date(email.created_at).toLocaleString() : "";
                  const event = email.last_event || "sent";
                  const eventColor = event === "delivered" ? "var(--success)" : event === "bounced" ? "var(--danger)" : event === "opened" ? "var(--info)" : "var(--warning)";
                  const eventBg = event === "delivered" ? "var(--success-bg)" : event === "bounced" ? "var(--danger-bg)" : event === "opened" ? "var(--info-bg)" : "var(--warning-bg)";
                  return (
                    <div
                      key={email.id || i}
                      style={{
                        display: "flex", alignItems: "center", gap: 12, padding: "12px 16px",
                        borderBottom: i < emails.length - 1 ? "1px solid var(--hairline)" : "none",
                        cursor: "default",
                      }}
                    >
                      <div style={{ width: 36, height: 36, borderRadius: 8, background: "var(--surface-soft)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 16, flexShrink: 0 }}>
                        &#9993;
                      </div>
                      <div style={{ flex: 1, minWidth: 0 }}>
                        <div style={{ fontSize: 13, fontWeight: 500, color: "var(--ink)", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
                          {email.subject || "(No subject)"}
                        </div>
                        <div style={{ fontSize: 11, color: "var(--ash)", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
                          To: {Array.isArray(email.to) ? email.to.join(", ") : "—"} &middot; {date}
                        </div>
                      </div>
                      <span style={{
                        display: "inline-block", padding: "2px 8px", borderRadius: 999, fontSize: 10, fontWeight: 500,
                        background: eventBg, color: eventColor, textTransform: "capitalize", flexShrink: 0,
                      }}>
                        {event}
                      </span>
                    </div>
                  );
                })
              )}
            </div>
          ) : (
            <div style={{ background: "#fff", borderRadius: 8, boxShadow: "0 0 0 1px rgba(0,0,0,0.04), 0 1px 2px rgba(0,0,0,0.04)", padding: 20 }}>
              <h2 style={{ fontSize: 14, fontWeight: 600, color: "var(--ink)", margin: "0 0 4px" }}>Send Broadcast</h2>
              <p style={{ fontSize: 12, color: "var(--muted)", marginBottom: 16 }}>This will send an email to every registered user from <strong>{sender}</strong>.</p>
              <form onSubmit={handleBroadcast} style={{ display: "flex", flexDirection: "column", gap: 12 }}>
                <div>
                  <label style={{ display: "block", fontSize: 12, fontWeight: 500, color: "var(--body)", marginBottom: 4 }}>Subject</label>
                  <input type="text" required value={form.subject} onChange={(e) => setForm((f) => ({ ...f, subject: e.target.value }))} placeholder="Announcement subject line"
                    style={{ width: "100%", height: 38, padding: "0 12px", borderRadius: 6, border: "1px solid var(--hairline)", fontSize: 13, outline: "none", boxSizing: "border-box" }} />
                </div>
                <div>
                  <label style={{ display: "block", fontSize: 12, fontWeight: 500, color: "var(--body)", marginBottom: 4 }}>HTML Content</label>
                  <textarea required value={form.html} onChange={(e) => setForm((f) => ({ ...f, html: e.target.value }))}
                    placeholder="&lt;h1&gt;Hello!&lt;/h1&gt;&lt;p&gt;Your message here...&lt;/p&gt;"
                    rows={8}
                    style={{ width: "100%", padding: "8px 12px", borderRadius: 6, border: "1px solid var(--hairline)", fontSize: 13, outline: "none", boxSizing: "border-box", resize: "vertical", fontFamily: "var(--font-mono)" }} />
                </div>
                <label style={{ display: "flex", alignItems: "center", gap: 8, fontSize: 12, color: "var(--body)", cursor: "pointer" }}>
                  <input type="checkbox" checked={confirmed} onChange={(e) => setConfirmed(e.target.checked)} style={{ accentColor: "var(--primary)" }} />
                  I confirm this will be sent to all registered users
                </label>
                <button type="submit" disabled={broadcasting || !confirmed}
                  style={{ padding: "10px 0", fontSize: 13, fontWeight: 600, borderRadius: 6, border: "none", background: broadcasting || !confirmed ? "var(--surface-soft)" : "var(--primary)", color: "#fff", cursor: broadcasting || !confirmed ? "default" : "pointer", opacity: broadcasting || !confirmed ? 0.7 : 1 }}>
                  {broadcasting ? "Sending..." : `Send to All Users`}
                </button>
              </form>
            </div>
          )}

          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12, marginTop: 16 }}>
            <div style={{ background: "#fff", borderRadius: 8, boxShadow: "0 0 0 1px rgba(0,0,0,0.04), 0 1px 2px rgba(0,0,0,0.04)", padding: 16 }}>
              <h3 style={{ fontSize: 12, fontWeight: 600, textTransform: "uppercase", letterSpacing: "0.04em", color: "var(--ink)", margin: "0 0 12px" }}>Automatic Emails</h3>
              <div style={{ display: "flex", flexDirection: "column", gap: 4 }}>
                {[
                  { label: "Welcome email", desc: "Sent when a new user signs up" },
                  { label: "Order confirmed", desc: "Sent when Stripe payment succeeds" },
                ].map((item) => (
                  <div key={item.label} style={{ display: "flex", alignItems: "center", gap: 8, padding: "8px 0", borderBottom: "1px solid var(--hairline)" }}>
                    <span style={{ width: 6, height: 6, borderRadius: "50%", background: "var(--success)", flexShrink: 0 }} />
                    <span style={{ fontSize: 12, color: "var(--body)" }}>{item.label}</span>
                    <span style={{ marginLeft: "auto", fontSize: 10, color: "var(--ash)" }}>{item.desc}</span>
                  </div>
                ))}
              </div>
            </div>
            <div style={{ background: "#fff", borderRadius: 8, boxShadow: "0 0 0 1px rgba(0,0,0,0.04), 0 1px 2px rgba(0,0,0,0.04)", padding: 16 }}>
              <h3 style={{ fontSize: 12, fontWeight: 600, textTransform: "uppercase", letterSpacing: "0.04em", color: "var(--ink)", margin: "0 0 12px" }}>Resend Platform</h3>
              <p style={{ fontSize: 12, color: "var(--muted)", margin: "0 0 12px", lineHeight: 1.5 }}>Manage domains, API keys, and view full analytics on the Resend dashboard.</p>
              <a href="https://resend.com" target="_blank" rel="noopener noreferrer"
                style={{ display: "inline-block", padding: "6px 14px", fontSize: 12, fontWeight: 500, borderRadius: 6, border: "1px solid var(--hairline)", color: "var(--body)", textDecoration: "none" }}>
                Open Resend Dashboard &rarr;
              </a>
            </div>
          </div>
        </>
      )}
    </div>
  );
}
