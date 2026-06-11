"use client";

import { useState } from "react";
import { useAdmin } from "@/components/admin/admin-context";

export function SettingsPage() {
  const { showToast } = useAdmin();
  const [commission, setCommission] = useState({ default: 8, electronics: 5, food: 10 });
  const [saving, setSaving] = useState(false);
  const [toggles, setToggles] = useState({
    autoApprove: false,
    requireId: false,
    international: false,
    autoRefund: false,
  });

  async function saveCommission() {
    setSaving(true);
    try {
      const res = await fetch("/api/admin/settings", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ section: "commission", values: commission }),
      });
      if (res.ok) showToast("Commission settings saved", "success");
      else showToast("Failed to save commission settings", "danger");
    } catch {
      showToast("Failed to save commission settings", "danger");
    } finally {
      setSaving(false);
    }
  }

  async function toggleSetting(key: string, value: boolean) {
    setToggles((prev) => ({ ...prev, [key]: value }));
    try {
      await fetch("/api/admin/settings", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ section: "rules", values: { [key]: value } }),
      });
    } catch {
      setToggles((prev) => ({ ...prev, [key]: !value }));
    }
  }

  return (
    <div>
      <style>{`
        .page-h { font-size:20px; font-weight:600; color:var(--ink); letter-spacing:-0.03em; margin:0 0 4px; }
        .page-sub { font-size:13px; color:var(--muted-text); margin:0 0 20px; }
        .section-row { display:grid; grid-template-columns:1fr 1fr; gap:12px; }
        .card { background:#fff; border-radius:8px; box-shadow:var(--shadow-card); }
        .card-h { padding:12px 16px; border-bottom:1px solid var(--hairline); }
        .card-h h3 { font-size:12px; font-weight:600; text-transform:uppercase; letter-spacing:0.04em; color:var(--ink); margin:0; }
        .card-b { padding:16px 20px; }
        .btn { display:inline-flex; align-items:center; gap:4px; height:34px; padding:0 14px; border-radius:var(--radius-sm); font-size:12px; font-weight:500; cursor:pointer; transition:all 150ms; border:none; }
        .btn-p { background:var(--primary); color:#fff; }
        .btn-p:hover { background:var(--primary-deep); }
        .btn-p:active { transform:scale(0.98); }
        .btn-p:disabled { opacity:0.5; cursor:not-allowed; }
        .fg { margin-bottom:14px; }
        .fg:last-child { margin-bottom:0; }
        .label { font-size:12px; font-weight:450; color:var(--body); display:block; margin-bottom:4px; }
        .fi { width:100%; height:38px; padding:0 10px; border:1px solid var(--hairline); border-radius:var(--radius-sm); font-size:13px; outline:none; }
        .fi:focus { border-color:var(--primary); box-shadow:0 0 0 3px var(--primary-bg); }
        .toggle-row { display:flex; align-items:center; justify-content:space-between; padding:10px 0; border-bottom:1px solid var(--hairline); }
        .toggle-row:last-child { border-bottom:none; }
        .toggle-info { flex:1; }
        .toggle-title { font-size:13px; font-weight:500; color:var(--ink); }
        .toggle-desc { font-size:11px; color:var(--muted-text); margin-top:1px; }
        .toggle { width:36px; height:20px; border-radius:999px; border:none; cursor:pointer; transition:background 150ms; position:relative; flex-shrink:0; }
        .toggle.on { background:var(--success); }
        .toggle.off { background:var(--stone); }
        .toggle::after { content:""; position:absolute; top:2px; left:2px; width:16px; height:16px; border-radius:50%; background:#fff; transition:transform 150ms; }
        .toggle.on::after { transform:translateX(16px); }
        @media (max-width:768px) { .section-row { grid-template-columns:1fr; } }
      `}</style>

      <div className="page-h">Settings</div>
      <div className="page-sub">Configure platform rules, commissions, and system preferences</div>

      <div className="section-row">
        <div className="card">
          <div className="card-h"><h3>Commission</h3></div>
          <div className="card-b">
            <div className="fg">
              <label className="label">Default commission rate (%)</label>
              <input className="fi" type="number" value={commission.default} onChange={(e) => setCommission((p) => ({ ...p, default: +e.target.value }))} />
            </div>
            <div className="fg">
              <label className="label">Electronics commission (%)</label>
              <input className="fi" type="number" value={commission.electronics} onChange={(e) => setCommission((p) => ({ ...p, electronics: +e.target.value }))} />
            </div>
            <div className="fg">
              <label className="label">Food commission (%)</label>
              <input className="fi" type="number" value={commission.food} onChange={(e) => setCommission((p) => ({ ...p, food: +e.target.value }))} />
            </div>
            <button className="btn btn-p" onClick={saveCommission} disabled={saving} style={{ marginTop: 4 }}>{saving ? "Saving..." : "Save changes"}</button>
          </div>
        </div>

        <div className="card">
          <div className="card-h"><h3>Platform Rules</h3></div>
          <div className="card-b">
            {[
              { key: "autoApprove", title: "Auto-approve sellers", desc: "New sellers approved without manual review" },
              { key: "requireId", title: "Require ID verification", desc: "Government ID required for seller registration" },
              { key: "international", title: "Allow international sales", desc: "Cross-border buyer-seller transactions" },
              { key: "autoRefund", title: "Auto-refund under KES 1,000", desc: "Automatic refund for disputes under threshold" },
            ].map((t) => (
              <div key={t.key} className="toggle-row">
                <div className="toggle-info">
                  <div className="toggle-title">{t.title}</div>
                  <div className="toggle-desc">{t.desc}</div>
                </div>
                <button
                  className={`toggle ${toggles[t.key as keyof typeof toggles] ? "on" : "off"}`}
                  onClick={() => toggleSetting(t.key, !toggles[t.key as keyof typeof toggles])}
                />
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
