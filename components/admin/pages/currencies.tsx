"use client";

import { useEffect, useState } from "react";
import { useAdmin } from "@/components/admin/admin-context";

interface Currency {
  id: string;
  code: string;
  name: string;
  symbol: string;
  rate: number;
  status: string;
}

const PRESETS: Record<string, { code: string; name: string; symbol: string }> = {
  usd: { code: "USD", name: "US Dollar", symbol: "$" },
  eur: { code: "EUR", name: "Euro", symbol: "€" },
  gbp: { code: "GBP", name: "British Pound", symbol: "£" },
  cad: { code: "CAD", name: "Canadian Dollar", symbol: "C$" },
  ngn: { code: "NGN", name: "Nigerian Naira", symbol: "₦" },
  ghc: { code: "GHS", name: "Ghanaian Cedi", symbol: "₵" },
  kes: { code: "KES", name: "Kenyan Shilling", symbol: "KSh" },
  zar: { code: "ZAR", name: "South African Rand", symbol: "R" },
  jpy: { code: "JPY", name: "Japanese Yen", symbol: "¥" },
  aud: { code: "AUD", name: "Australian Dollar", symbol: "A$" },
  chf: { code: "CHF", name: "Swiss Franc", symbol: "Fr" },
  cny: { code: "CNY", name: "Chinese Yuan", symbol: "¥" },
};

const SYMBOLS = Array.from(
  new Map(
    Object.values(PRESETS).map((c) => [c.symbol, { label: `${c.symbol} — ${c.name}`, value: c.symbol }]),
  ).values(),
);

export function CurrenciesPage() {
  const { showToast } = useAdmin();
  const [currencies, setCurrencies] = useState<Currency[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [code, setCode] = useState("");
  const [name, setName] = useState("");
  const [symbol, setSymbol] = useState("");
  const [rate, setRate] = useState("");
  const [saving, setSaving] = useState(false);

  useEffect(() => { fetchCurrencies(); }, []);

  async function fetchCurrencies() {
    try {
      const r = await fetch("/api/admin/currencies");
      const d = await r.json();
      if (Array.isArray(d)) setCurrencies(d);
    } catch {} finally { setLoading(false); }
  }

  async function addCurrency() {
    if (!code || !name || !symbol || !rate) return;
    setSaving(true);
    try {
      const r = await fetch("/api/admin/currencies", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ code, name, symbol, rate }),
      });
      if (r.ok) {
        showToast(`${code.toUpperCase()} added`, "success");
        setCode(""); setName(""); setSymbol(""); setRate("");
        setShowForm(false);
        await fetchCurrencies();
      } else {
        const err = await r.json();
        showToast(err.error || "Failed to add currency", "danger");
      }
    } catch { showToast("Failed to add currency", "danger"); } finally { setSaving(false); }
  }

  async function removeCurrency(id: string, label: string) {
    const r = await fetch("/api/admin/currencies", {
      method: "DELETE",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id }),
    });
    if (r.ok) {
      setCurrencies((prev) => prev.filter((c) => c.id !== id));
      showToast(`${label} removed`, "success");
    } else showToast("Failed to remove currency", "danger");
  }

  if (loading) return <div style={{ textAlign: "center", padding: 48, color: "var(--muted-text)" }}>Loading currencies...</div>;

  return (
    <div>
      <style>{`
        .page-h { font-size:20px; font-weight:600; color:var(--ink); letter-spacing:-0.03em; margin:0 0 4px; }
        .page-sub { font-size:13px; color:var(--muted-text); margin:0 0 20px; }
        .card { background:#fff; border-radius:8px; box-shadow:var(--shadow-card); }
        .card-h { display:flex; align-items:center; justify-content:space-between; padding:12px 16px; border-bottom:1px solid var(--hairline); }
        .card-h h3 { font-size:12px; font-weight:600; text-transform:uppercase; letter-spacing:0.04em; color:var(--ink); margin:0; }
        .card-b { padding:16px 20px; }
        .btn { display:inline-flex; align-items:center; gap:4px; height:34px; padding:0 14px; border-radius:var(--radius-sm); font-size:12px; font-weight:500; cursor:pointer; transition:all 150ms; border:none; }
        .btn-p { background:var(--primary); color:#fff; }
        .btn-p:hover { background:var(--primary-deep); }
        .btn-p:disabled { opacity:0.5; cursor:not-allowed; }
        .btn-s { background:#fff; border:1px solid var(--hairline); color:var(--body); }
        .btn-s:hover { background:var(--surface-soft); }
        .btn-d { background:transparent; color:var(--danger); padding:0 6px; height:auto; font-size:12px; }
        .btn-d:hover { text-decoration:underline; }
        .fg { margin-bottom:12px; }
        .label { font-size:12px; font-weight:450; color:var(--body); display:block; margin-bottom:4px; }
        .fi { width:100%; height:38px; padding:0 10px; border:1px solid var(--hairline); border-radius:var(--radius-sm); font-size:13px; outline:none; }
        .fi:focus { border-color:var(--primary); box-shadow:0 0 0 3px var(--primary-bg); }
        .form-row { display:grid; grid-template-columns:1fr 1fr; gap:12px; }
        .table-wrap { overflow-x:auto; }
        .table-wrap table { width:100%; border-collapse:collapse; }
        .table-wrap th { font-size:12px; font-weight:500; color:var(--muted-text); padding:10px 14px; text-align:left; border-bottom:1px solid var(--hairline); white-space:nowrap; }
        .table-wrap td { font-size:13px; color:var(--body); padding:10px 14px; border-bottom:1px solid var(--hairline); vertical-align:middle; }
        .table-wrap tr:last-child td { border-bottom:none; }
        .pill { display:inline-flex; align-items:center; gap:4px; font-size:11px; padding:2px 8px; border-radius:999px; font-weight:500; }
        .pill-on { background:rgba(0,112,243,0.1); color:var(--success); }
        .pill-off { background:rgba(238,0,0,0.08); color:var(--danger); }
        .mono { font-family:var(--font-mono); font-size:12px; }
        .empty-state { text-align:center; padding:64px 24px; }
        .empty-state svg { color:var(--stone); margin-bottom:12px; }
        .empty-state h3 { font-size:15px; font-weight:500; color:var(--ink); margin:0 0 4px; }
        .empty-state p { font-size:13px; color:var(--muted-text); margin:0; }
        @media (max-width:480px) { .form-row { grid-template-columns:1fr; } }
      `}</style>

      <div className="page-h">Currencies</div>
      <div className="page-sub">Manage supported currencies and exchange rates across the marketplace</div>

      <div className="card" style={{ marginBottom: 16 }}>
        <div className="card-h">
          <h3>{currencies.length} Currencies</h3>
          <button className="btn btn-p" onClick={() => setShowForm(!showForm)}>{showForm ? "Cancel" : "Add currency"}</button>
        </div>
        {showForm && (
          <div className="card-b" style={{ borderBottom: "1px solid var(--hairline)" }}>
            <div className="form-row">
              <div className="fg" style={{ gridColumn: "1 / -1" }}>
                <label className="label">Quick select</label>
                <select className="fi" onChange={(e) => { const c = PRESETS[e.target.value]; if (c) { setCode(c.code); setName(c.name); setSymbol(c.symbol); } }} defaultValue="">
                  <option value="" disabled>Choose a currency...</option>
                  {Object.entries(PRESETS).map(([k, v]) => (
                    <option key={k} value={k}>{v.code} — {v.name} ({v.symbol})</option>
                  ))}
                </select>
              </div>
              <div className="fg">
                <label className="label">Currency code</label>
                <input className="fi" placeholder="e.g. USD" value={code} onChange={(e) => setCode(e.target.value.toUpperCase())} maxLength={3} />
              </div>
              <div className="fg">
                <label className="label">Currency name</label>
                <input className="fi" placeholder="e.g. US Dollar" value={name} onChange={(e) => setName(e.target.value)} />
              </div>
              <div className="fg">
                <label className="label">Symbol</label>
                <select className="fi" value={symbol} onChange={(e) => setSymbol(e.target.value)}>
                  <option value="">Select symbol...</option>
                  {SYMBOLS.map((s) => (
                    <option key={s.value} value={s.value}>{s.label}</option>
                  ))}
                </select>
              </div>
              <div className="fg">
                <label className="label">Exchange rate (to base currency)</label>
                <input className="fi" type="number" step="0.01" placeholder="e.g. 1.00" value={rate} onChange={(e) => setRate(e.target.value)} />
              </div>
            </div>
            <div style={{ display: "flex", gap: 8, marginTop: 4 }}>
              <button className="btn btn-p" onClick={addCurrency} disabled={saving || !code || !name || !symbol || !rate}>{saving ? "Adding..." : "Add currency"}</button>
            </div>
          </div>
        )}
        <div className="card-b p0">
          {currencies.length === 0 ? (
            <div className="empty-state">
              <DollarIcon size={40} />
              <h3>No currencies configured</h3>
              <p>Add a currency to set exchange rates for the platform</p>
            </div>
          ) : (
            <div className="table-wrap">
              <table>
                <thead>
                  <tr>
                    <th>Code</th>
                    <th>Name</th>
                    <th>Symbol</th>
                    <th>Rate</th>
                    <th>Status</th>
                    <th></th>
                  </tr>
                </thead>
                <tbody>
                  {currencies.map((c) => (
                    <tr key={c.id}>
                      <td><span className="mono" style={{ fontWeight: 600 }}>{c.code}</span></td>
                      <td>{c.name}</td>
                      <td className="mono">{c.symbol}</td>
                      <td className="mono">{c.rate.toFixed(2)}</td>
                      <td><span className={`pill ${c.status === "active" ? "pill-on" : "pill-off"}`}>{c.status}</span></td>
                      <td><button className="btn btn-d" onClick={() => removeCurrency(c.id, c.code)}>Remove</button></td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

function DollarIcon({ size = 24 }: { size?: number }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5} strokeLinecap="round" strokeLinejoin="round" width={size} height={size}>
      <line x1="12" y1="1" x2="12" y2="23" />
      <path d="M17 5H9.5a3.5 3.5 0 000 7h5a3.5 3.5 0 010 7H6" />
    </svg>
  );
}
