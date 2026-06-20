"use client";

import { useState, useEffect } from "react";
import { useAdmin } from "@/components/admin/admin-context";

interface SentEmail {
  id: string;
  from?: string;
  to?: string[];
  subject?: string;
  created_at?: string;
  last_event?: string;
}

interface ReceivedEmail {
  id: string;
  from: string;
  to: string;
  subject: string;
  text?: string | null;
  html?: string | null;
  createdAt: string;
  read: boolean;
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
  const [sentEmails, setSentEmails] = useState<SentEmail[]>([]);
  const [receivedEmails, setReceivedEmails] = useState<ReceivedEmail[]>([]);
  const [stats, setStats] = useState<EmailStats>({ totalSent: 0, sender: "" });
  const [errorMsg, setErrorMsg] = useState("");
  const [tab, setTab] = useState<"sent" | "received" | "broadcast">("sent");
  const [selectedEmail, setSelectedEmail] = useState<ReceivedEmail | null>(null);
  const [broadcasting, setBroadcasting] = useState(false);
  const [form, setForm] = useState({ subject: "", html: "" });
  const [confirmed, setConfirmed] = useState(false);

  useEffect(() => {
    Promise.all([
      fetch("/api/admin/emails").then((r) => r.json()),
      fetch("/api/webhooks/resend").then((r) => r.json()).catch(() => []),
    ]).then(([emailData, receivedData]) => {
      setConfigured(emailData.configured);
      setSender(emailData.sender || "");
      setSentEmails(emailData.emails || []);
      setStats(emailData.stats || { totalSent: 0, sender: "" });
      setReceivedEmails(Array.isArray(receivedData) ? receivedData : []);
      if (emailData.error) setErrorMsg(emailData.error);
    })
    .catch(() => setErrorMsg("Failed to connect"))
    .finally(() => setLoading(false));
  }, []);

  async function markAsRead(id: string) {
    await fetch(`/api/webhooks/resend`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id }),
    });
    setReceivedEmails((prev) => prev.map((e) => (e.id === id ? { ...e, read: true } : e)));
  }

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
        setTab("sent");
      } else {
        showToast(data.error || "Failed", "danger");
      }
    } catch {
      showToast("Failed to broadcast", "danger");
    } finally {
      setBroadcasting(false);
    }
  }

  if (selectedEmail) {
    return (
      <div>
        <button onClick={() => setSelectedEmail(null)} style={{ background: "none", border: "none", cursor: "pointer", padding: 0, fontSize: 13, color: "var(--body)", marginBottom: 12, display: "flex", alignItems: "center", gap: 4 }}>
          &larr; Back to inbox
        </button>
        <div style={{ background: "#fff", borderRadius: 8, boxShadow: "0 0 0 1px rgba(0,0,0,0.04), 0 1px 2px rgba(0,0,0,0.04)", padding: 20 }}>
          <div style={{ marginBottom: 16 }}>
            <div style={{ fontSize: 18, fontWeight: 600, color: "var(--ink)" }}>{selectedEmail.subject}</div>
            <div style={{ fontSize: 13, color: "var(--muted)", marginTop: 4 }}>
              From: <strong>{selectedEmail.from}</strong> &middot; To: {selectedEmail.to}
            </div>
            <div style={{ fontSize: 11, color: "var(--ash)", marginTop: 2 }}>
              {new Date(selectedEmail.createdAt).toLocaleString()}
            </div>
          </div>
          <div style={{ borderTop: "1px solid var(--hairline)", paddingTop: 16, fontSize: 14, color: "var(--body)", lineHeight: 1.7 }}
            dangerouslySetInnerHTML={{ __html: selectedEmail.html || selectedEmail.text || "(No content)" }}
          />
        </div>
      </div>
    );
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
            {stats.totalSent} sent &middot; {receivedEmails.length} received
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
            {([
              { id: "sent", label: "Sent" },
              { id: "received", label: `Received${receivedEmails.filter((e) => !e.read).length > 0 ? ` (${receivedEmails.filter((e) => !e.read).length})` : ""}` },
              { id: "broadcast", label: "Broadcast" },
            ] as const).map((t) => (
              <button
                key={t.id}
                onClick={() => setTab(t.id)}
                style={{
                  padding: "5px 14px", fontSize: 12, fontWeight: 500, borderRadius: 999, border: "none",
                  background: tab === t.id ? "var(--primary)" : "var(--surface-soft)",
                  color: tab === t.id ? "#fff" : "var(--body)", cursor: "pointer",
                }}
              >
                {t.label}
              </button>
            ))}
          </div>

          {tab === "sent" && (
            <div style={{ background: "#fff", borderRadius: 8, boxShadow: "0 0 0 1px rgba(0,0,0,0.04), 0 1px 2px rgba(0,0,0,0.04)" }}>
              <div style={{ padding: "12px 16px", borderBottom: "1px solid var(--hairline)", display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                <span style={{ fontSize: 12, fontWeight: 600, textTransform: "uppercase", letterSpacing: "0.04em", color: "var(--ink)" }}>Sent Emails</span>
                <span style={{ fontSize: 11, color: "var(--ash)" }}>Last 50 &middot; resend.com/emails</span>
              </div>
              {loading ? (
                <div style={{ padding: "32px 16px", textAlign: "center", fontSize: 12, color: "var(--ash)" }}>Loading...</div>
              ) : sentEmails.length === 0 ? (
                <div style={{ padding: "40px 16px", textAlign: "center" }}>
                  <div style={{ fontSize: 28, marginBottom: 8 }}>&#9993;</div>
                  <div style={{ fontSize: 13, fontWeight: 500, color: "var(--muted)", marginBottom: 4 }}>No emails sent yet</div>
                  <p style={{ fontSize: 11, color: "var(--ash)", margin: "0 0 12px" }}>Sent emails will appear here with delivery status.</p>
                  <button onClick={() => setTab("broadcast")} style={{ padding: "6px 14px", fontSize: 12, borderRadius: 6, border: "none", background: "var(--primary)", color: "#fff", cursor: "pointer" }}>Send Your First Email</button>
                </div>
              ) : (
                sentEmails.map((email, i) => {
                  const date = email.created_at ? new Date(email.created_at).toLocaleString() : "";
                  const event = email.last_event || "sent";
                  const eventColor = event === "delivered" ? "var(--success)" : event === "bounced" ? "var(--danger)" : event === "opened" ? "var(--info)" : "var(--warning)";
                  const eventBg = event === "delivered" ? "var(--success-bg)" : event === "bounced" ? "var(--danger-bg)" : event === "opened" ? "var(--info-bg)" : "var(--warning-bg)";
                  return (
                    <div key={email.id || i} style={{ display: "flex", alignItems: "center", gap: 12, padding: "12px 16px", borderBottom: i < sentEmails.length - 1 ? "1px solid var(--hairline)" : "none" }}>
                      <div style={{ width: 36, height: 36, borderRadius: 8, background: "var(--surface-soft)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 16, flexShrink: 0 }}>&#9993;</div>
                      <div style={{ flex: 1, minWidth: 0 }}>
                        <div style={{ fontSize: 13, fontWeight: 500, color: "var(--ink)", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{email.subject || "(No subject)"}</div>
                        <div style={{ fontSize: 11, color: "var(--ash)", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>To: {Array.isArray(email.to) ? email.to.join(", ") : "—"} &middot; {date}</div>
                      </div>
                      <span style={{ display: "inline-block", padding: "2px 8px", borderRadius: 999, fontSize: 10, fontWeight: 500, background: eventBg, color: eventColor, textTransform: "capitalize", flexShrink: 0 }}>{event}</span>
                    </div>
                  );
                })
              )}
            </div>
          )}

          {tab === "received" && (
            <div style={{ background: "#fff", borderRadius: 8, boxShadow: "0 0 0 1px rgba(0,0,0,0.04), 0 1px 2px rgba(0,0,0,0.04)" }}>
              <div style={{ padding: "12px 16px", borderBottom: "1px solid var(--hairline)", display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                <span style={{ fontSize: 12, fontWeight: 600, textTransform: "uppercase", letterSpacing: "0.04em", color: "var(--ink)" }}>Received Emails</span>
                <span style={{ fontSize: 11, color: "var(--ash)" }}>
                  {receivedEmails.length} emails &middot; Set up at resend.com/emails/receiving
                </span>
              </div>
              {loading ? (
                <div style={{ padding: "32px 16px", textAlign: "center", fontSize: 12, color: "var(--ash)" }}>Loading...</div>
              ) : receivedEmails.length === 0 ? (
                <div style={{ padding: "40px 16px", textAlign: "center" }}>
                  <div style={{ fontSize: 28, marginBottom: 8 }}>&#128231;</div>
                  <div style={{ fontSize: 13, fontWeight: 500, color: "var(--muted)", marginBottom: 4 }}>No received emails</div>
                  <p style={{ fontSize: 12, color: "var(--ash)", margin: 0, lineHeight: 1.5 }}>
                    To receive emails at info@denimarketplace.com:<br />
                    1. Go to <strong>resend.com/emails/receiving</strong><br />
                    2. Add denimarketplace.com as a receiving domain<br />
                    3. Set webhook URL to <strong>denimarketplace.com/api/webhooks/resend</strong>
                  </p>
                </div>
              ) : (
                receivedEmails.map((email, i) => (
                  <div
                    key={email.id}
                    onClick={() => { markAsRead(email.id); setSelectedEmail(email); }}
                    style={{
                      display: "flex", alignItems: "center", gap: 12, padding: "12px 16px",
                      borderBottom: i < receivedEmails.length - 1 ? "1px solid var(--hairline)" : "none",
                      cursor: "pointer", background: email.read ? "transparent" : "var(--primary-bg)",
                      transition: "background 100ms",
                    }}
                    onMouseEnter={(e) => { e.currentTarget.style.background = "var(--canvas)"; }}
                    onMouseLeave={(e) => { e.currentTarget.style.background = email.read ? "transparent" : "var(--primary-bg)"; }}
                  >
                    <div style={{ width: 36, height: 36, borderRadius: 8, background: "var(--surface-soft)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 14, flexShrink: 0, fontWeight: 600, color: email.read ? "var(--ash)" : "var(--primary)" }}>
                      {email.from.charAt(0).toUpperCase()}
                    </div>
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <div style={{ fontSize: 13, fontWeight: email.read ? 400 : 600, color: "var(--ink)", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
                        {email.subject}
                      </div>
                      <div style={{ fontSize: 11, color: "var(--ash)", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
                        From: {email.from} &middot; {new Date(email.createdAt).toLocaleString()}
                      </div>
                    </div>
                    {!email.read && (
                      <span style={{ width: 8, height: 8, borderRadius: "50%", background: "var(--primary)", flexShrink: 0 }} />
                    )}
                  </div>
                ))
              )}
            </div>
          )}

          {tab === "broadcast" && (
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
                  {broadcasting ? "Sending..." : "Send to All Users"}
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
              <p style={{ fontSize: 12, color: "var(--muted)", margin: "0 0 12px", lineHeight: 1.5 }}>
                All emails sent from here appear at <strong>resend.com/emails</strong>. Replies go to <strong>info@denimarketplace.com</strong>.
              </p>
              <a href="https://resend.com/emails" target="_blank" rel="noopener noreferrer"
                style={{ display: "inline-block", padding: "6px 14px", fontSize: 12, fontWeight: 500, borderRadius: 6, border: "1px solid var(--hairline)", color: "var(--body)", textDecoration: "none", marginRight: 8 }}>
                View Sent Emails &rarr;
              </a>
              <a href="https://resend.com/domains" target="_blank" rel="noopener noreferrer"
                style={{ display: "inline-block", padding: "6px 14px", fontSize: 12, fontWeight: 500, borderRadius: 6, border: "1px solid var(--hairline)", color: "var(--body)", textDecoration: "none" }}>
                Manage Domain &rarr;
              </a>
            </div>
          </div>
        </>
      )}
    </div>
  );
}
