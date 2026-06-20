"use client";

import { useState, useEffect } from "react";
import { useAdmin } from "@/components/admin/admin-context";

interface EmailRecord {
  id: string;
  from: string;
  to: string[];
  subject: string;
  created_at: string;
}

export function EmailsPage() {
  const { showToast } = useAdmin();
  const [loading, setLoading] = useState(true);
  const [syncing, setSyncing] = useState(false);
  const [emails, setEmails] = useState<EmailRecord[]>([]);
  const [configured, setConfigured] = useState(false);
  const [sendOpen, setSendOpen] = useState(false);
  const [sending, setSending] = useState(false);

  const [form, setForm] = useState({ to: "", subject: "", html: "" });

  useEffect(() => {
    fetch("/api/admin/emails")
      .then((r) => r.json())
      .then((data) => {
        setConfigured(data.configured);
        setEmails(data.emails || []);
      })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  async function handleSend(e: React.FormEvent) {
    e.preventDefault();
    setSending(true);
    try {
      const res = await fetch("/api/admin/emails", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          from: "noreply@denimarketplace.com",
          to: [form.to],
          subject: form.subject,
          html: form.html,
        }),
      });
      const data = await res.json();
      if (res.ok) {
        showToast(`Email sent — ID: ${data.id}`);
        setSendOpen(false);
        setForm({ to: "", subject: "", html: "" });
        setEmails((prev) => [{
          id: data.id,
          from: "noreply@denimarketplace.com",
          to: [form.to],
          subject: form.subject,
          created_at: new Date().toISOString(),
        }, ...prev]);
      } else {
        showToast(data.error || "Failed to send", "danger");
      }
    } catch {
      showToast("Failed to send email", "danger");
    } finally {
      setSending(false);
    }
  }

  async function handleSync() {
    setSyncing(true);
    try {
      const res = await fetch("/api/admin/emails/sync-contacts", { method: "POST" });
      const data = await res.json();
      if (res.ok) {
        showToast(`Synced ${data.synced} contacts (${data.skipped} skipped, ${data.failed} failed)`);
      } else {
        showToast(data.error || "Sync failed", "danger");
      }
    } catch {
      showToast("Sync failed", "danger");
    } finally {
      setSyncing(false);
    }
  }

  return (
    <div>
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 16 }}>
        <h1 style={{ fontSize: 20, fontWeight: 600, letterSpacing: "-0.03em", color: "var(--ink)", margin: 0 }}>Emails</h1>
        {configured && (
          <div style={{ display: "flex", gap: 8 }}>
            <button
              onClick={handleSync}
              disabled={syncing}
              style={{ padding: "6px 14px", fontSize: 12, fontWeight: 500, borderRadius: 6, border: "1px solid var(--hairline)", background: "#fff", color: "var(--body)", cursor: syncing ? "default" : "pointer", opacity: syncing ? 0.6 : 1 }}
            >
              {syncing ? "Syncing..." : "Sync Contacts"}
            </button>
            <button
              onClick={() => setSendOpen(true)}
              style={{ padding: "6px 14px", fontSize: 12, fontWeight: 500, borderRadius: 6, border: "none", background: "var(--primary)", color: "#fff", cursor: "pointer" }}
            >
              Send Email
            </button>
          </div>
        )}
      </div>

      {!configured ? (
        <div style={{ background: "#fff", borderRadius: 8, boxShadow: "0 0 0 1px rgba(0,0,0,0.04), 0 1px 2px rgba(0,0,0,0.04)", padding: 32, textAlign: "center" }}>
          <div style={{ fontSize: 32, marginBottom: 12 }}>&#9993;</div>
          <div style={{ fontSize: 14, fontWeight: 500, color: "var(--muted)", marginBottom: 4 }}>Email not configured</div>
          <p style={{ fontSize: 12, color: "var(--ash)", margin: 0 }}>Set MATON_API_KEY in your environment variables to enable email sending.</p>
        </div>
      ) : sendOpen ? (
        <div style={{ background: "#fff", borderRadius: 8, boxShadow: "0 0 0 1px rgba(0,0,0,0.04), 0 1px 2px rgba(0,0,0,0.04)", padding: 20, maxWidth: 600 }}>
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 16 }}>
            <h2 style={{ fontSize: 16, fontWeight: 600, color: "var(--ink)", margin: 0 }}>Send Email</h2>
            <button onClick={() => setSendOpen(false)} style={{ background: "none", border: "none", cursor: "pointer", fontSize: 18, color: "var(--stone)" }}>&times;</button>
          </div>
          <form onSubmit={handleSend} style={{ display: "flex", flexDirection: "column", gap: 12 }}>
            <div>
              <label style={{ display: "block", fontSize: 12, fontWeight: 500, color: "var(--body)", marginBottom: 4 }}>To</label>
              <input
                type="email"
                required
                value={form.to}
                onChange={(e) => setForm((f) => ({ ...f, to: e.target.value }))}
                placeholder="recipient@example.com"
                style={{ width: "100%", height: 38, padding: "0 12px", borderRadius: 6, border: "1px solid var(--hairline)", fontSize: 13, outline: "none", boxSizing: "border-box" }}
              />
            </div>
            <div>
              <label style={{ display: "block", fontSize: 12, fontWeight: 500, color: "var(--body)", marginBottom: 4 }}>Subject</label>
              <input
                type="text"
                required
                value={form.subject}
                onChange={(e) => setForm((f) => ({ ...f, subject: e.target.value }))}
                placeholder="Email subject"
                style={{ width: "100%", height: 38, padding: "0 12px", borderRadius: 6, border: "1px solid var(--hairline)", fontSize: 13, outline: "none", boxSizing: "border-box" }}
              />
            </div>
            <div>
              <label style={{ display: "block", fontSize: 12, fontWeight: 500, color: "var(--body)", marginBottom: 4 }}>HTML Content</label>
              <textarea
                required
                value={form.html}
                onChange={(e) => setForm((f) => ({ ...f, html: e.target.value }))}
                placeholder="<p>Your email content here</p>"
                rows={6}
                style={{ width: "100%", padding: "8px 12px", borderRadius: 6, border: "1px solid var(--hairline)", fontSize: 13, outline: "none", boxSizing: "border-box", resize: "vertical", fontFamily: "var(--font-mono)" }}
              />
            </div>
            <button
              type="submit"
              disabled={sending}
              style={{ padding: "8px 0", fontSize: 13, fontWeight: 600, borderRadius: 6, border: "none", background: sending ? "var(--surface-soft)" : "var(--primary)", color: "#fff", cursor: sending ? "default" : "pointer", opacity: sending ? 0.7 : 1 }}
            >
              {sending ? "Sending..." : "Send Email"}
            </button>
          </form>
        </div>
      ) : (
        <div style={{ background: "#fff", borderRadius: 8, boxShadow: "0 0 0 1px rgba(0,0,0,0.04), 0 1px 2px rgba(0,0,0,0.04)" }}>
          <div style={{ padding: "12px 16px", borderBottom: "1px solid var(--hairline)", fontSize: 12, fontWeight: 600, textTransform: "uppercase", letterSpacing: "0.04em", color: "var(--ink)" }}>
            Sent Emails
          </div>
          {loading ? (
            <div style={{ padding: "24px 16px", textAlign: "center", fontSize: 12, color: "var(--ash)" }}>Loading...</div>
          ) : emails.length === 0 ? (
            <div style={{ padding: "32px 16px", textAlign: "center" }}>
              <div style={{ fontSize: 28, marginBottom: 8 }}>&#9993;</div>
              <div style={{ fontSize: 13, fontWeight: 500, color: "var(--muted)", marginBottom: 4 }}>No emails sent yet</div>
              <p style={{ fontSize: 11, color: "var(--ash)", margin: 0 }}>Sent transactional emails will appear here.</p>
            </div>
          ) : (
            emails.map((e, i) => (
              <div key={e.id} style={{ display: "flex", alignItems: "center", gap: 12, padding: "12px 16px", borderBottom: i < emails.length - 1 ? "1px solid var(--hairline)" : "none" }}>
                <span style={{ fontSize: 18 }}>&#9993;</span>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ fontSize: 13, fontWeight: 500, color: "var(--ink)" }}>{e.subject}</div>
                  <div style={{ fontSize: 11, color: "var(--ash)", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
                    To: {Array.isArray(e.to) ? e.to.join(", ") : String(e.to)} &middot; {new Date(e.created_at).toLocaleDateString()}
                  </div>
                </div>
                <span style={{ fontFamily: "var(--font-mono)", fontSize: 10, color: "var(--stone)" }}>{e.id.substring(0, 8)}</span>
              </div>
            ))
          )}
        </div>
      )}
    </div>
  );
}
