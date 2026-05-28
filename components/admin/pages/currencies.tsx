"use client";

import { useState } from "react";
import { useAdmin } from "@/components/admin/admin-context";
import { ADMIN_CURRENCIES } from "@/lib/data/admin";
import type { AdminCurrency } from "@/lib/types/admin";

const DEFAULT_BASE = "KES";

function EditIcon({ size = 14 }: { size?: number }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" width={size} height={size}>
      <path d="M11 4H4a2 2 0 00-2 2v14a2 2 0 002 2h14a2 2 0 002-2v-7" />
      <path d="M18.5 2.5a2.121 2.121 0 013 3L12 15l-4 1 1-4 9.5-9.5z" />
    </svg>
  );
}

function TrashIcon({ size = 14 }: { size?: number }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" width={size} height={size}>
      <polyline points="3 6 5 6 21 6" />
      <path d="M19 6v14a2 2 0 01-2 2H7a2 2 0 01-2-2V6m3 0V4a2 2 0 012-2h4a2 2 0 012 2v2" />
    </svg>
  );
}

function ActivateIcon({ size = 14 }: { size?: number }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" width={size} height={size}>
      <polyline points="23 4 23 10 17 10" />
      <path d="M20.49 15a9 9 0 11-2.12-9.36L23 10" />
    </svg>
  );
}

function StarIcon({ size = 14 }: { size?: number }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" width={size} height={size}>
      <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
    </svg>
  );
}

function PlusIcon({ size = 14 }: { size?: number }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" width={size} height={size}>
      <line x1="12" y1="5" x2="12" y2="19" />
      <line x1="5" y1="12" x2="19" y2="12" />
    </svg>
  );
}

function MoneyIcon({ size = 20 }: { size?: number }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" width={size} height={size}>
      <line x1="12" y1="1" x2="12" y2="23" />
      <path d="M17 5H9.5a3.5 3.5 0 000 7h5a3.5 3.5 0 010 7H6" />
    </svg>
  );
}

function CheckCircleIcon({ size = 20 }: { size?: number }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" width={size} height={size}>
      <path d="M22 11.08V12a10 10 0 11-5.93-9.14" />
      <polyline points="22 4 12 14.01 9 11.01" />
    </svg>
  );
}

function InactiveIcon({ size = 20 }: { size?: number }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" width={size} height={size}>
      <circle cx="12" cy="12" r="10" />
      <line x1="8" y1="12" x2="16" y2="12" />
    </svg>
  );
}

function BaseIcon({ size = 20 }: { size?: number }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" width={size} height={size}>
      <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
    </svg>
  );
}

export function CurrenciesPage() {
  const { showToast, openModal, closeModal } = useAdmin();
  const [currencies, setCurrencies] = useState(ADMIN_CURRENCIES);
  const [search, setSearch] = useState("");
  const [baseCurrency, setBaseCurrency] = useState(() => {
    const base = currencies.find((c) => c.rate === 1);
    return base ? base.code : DEFAULT_BASE;
  });

  function handleAdd() {
    openModal("Add currency", (
      <CurrencyForm
        baseCurrency={baseCurrency}
        onSave={(c) => {
          setCurrencies((prev) => [...prev, { ...c, id: Math.max(...prev.map((x) => x.id), 0) + 1 }]);
          showToast(`${c.code} added`, "success");
          closeModal();
        }}
        onCancel={closeModal}
      />
    ));
  }

  function handleEdit(c: AdminCurrency) {
    openModal(`Edit ${c.code}`, (
      <CurrencyForm
        baseCurrency={baseCurrency}
        initial={c}
        onSave={(updated, setAsBase) => {
          setCurrencies((prev) => prev.map((x) => (x.id === c.id ? { ...x, ...updated, id: c.id } : x)));
          if (setAsBase) {
            handleSetBase({ ...c, ...updated });
          }
          if (!setAsBase) {
            showToast(`${c.code} updated`, "success");
          }
          closeModal();
        }}
        onCancel={closeModal}
      />
    ));
  }

  function handleDelete(c: AdminCurrency) {
    openModal("Delete currency", (
      <div>
        <p style={{ fontSize: 13, color: "var(--body)", margin: "0 0 16px", lineHeight: 1.5 }}>
          Are you sure you want to permanently delete <strong>{c.code}</strong> ({c.name})?
          <br />This action cannot be undone.
        </p>
        <div className="admin-modal-actions">
          <button className="btn btn-s" onClick={closeModal}>Cancel</button>
          <button className="btn btn-d" onClick={() => {
            setCurrencies((prev) => prev.filter((x) => x.id !== c.id));
            showToast(`${c.code} deleted`, "danger");
            closeModal();
          }}>Delete</button>
        </div>
      </div>
    ));
  }

  function handleActivate(c: AdminCurrency) {
    setCurrencies((prev) => prev.map((x) => x.id === c.id ? { ...x, status: "active" as const } : x));
    showToast(`${c.code} reactivated`, "success");
  }

  function handleSetBase(c: AdminCurrency) {
    const oldRate = c.rate;
    setCurrencies((prev) =>
      prev.map((x) => ({
        ...x,
        rate: x.id === c.id ? 1 : parseFloat((x.rate / oldRate).toFixed(4)),
      }))
    );
    setBaseCurrency(c.code);
    showToast(`${c.code} set as base currency`, "success");
  }

  const filtered = currencies.filter(
    (c) =>
      c.code.toLowerCase().includes(search.toLowerCase()) ||
      c.name.toLowerCase().includes(search.toLowerCase())
  );
  const active = filtered.filter((c) => c.status === "active");
  const inactive = filtered.filter((c) => c.status === "inactive");

  return (
    <div>
      <style>{`
        .page-h { font-size:20px; font-weight:600; color:var(--ink); letter-spacing:-0.03em; margin:0 0 4px; }
        .page-sub { font-size:13px; color:var(--muted-text); margin:0 0 20px; }
        .action-bar { display:flex; align-items:center; gap:12px; margin-bottom:16px; flex-wrap:wrap; }
        .search-wrap { position:relative; flex:1; min-width:180px; max-width:280px; }
        .search-wrap input { width:100%; height:34px; padding:0 10px 0 28px; border:1px solid var(--hairline); border-radius:var(--radius-sm); font-size:12px; outline:none; background:var(--canvas); }
        .search-wrap input:focus { border-color:var(--primary); box-shadow:0 0 0 3px var(--primary-bg); }
        .search-wrap svg { position:absolute; left:8px; top:50%; transform:translateY(-50%); color:var(--stone); pointer-events:none; }
        .btn { display:inline-flex; align-items:center; gap:6px; height:34px; padding:0 14px; border-radius:var(--radius-sm); font-size:12px; font-weight:500; cursor:pointer; transition:all 150ms; border:none; white-space:nowrap; }
        .btn-p { background:var(--primary); color:#fff; }
        .btn-p:hover { background:var(--primary-deep); }
        .btn-p:active { transform:scale(0.98); }
        .btn-s { background:var(--surface-soft); color:var(--body); }
        .btn-s:hover { background:var(--hairline); }
        .btn-d { background:var(--danger); color:#fff; }
        .btn-d:hover { opacity:0.9; }
        .stat-row { display:grid; grid-template-columns:repeat(auto-fit, minmax(150px,1fr)); gap:12px; margin-bottom:16px; }
        .stat-card { background:#fff; border-radius:8px; padding:14px 16px; box-shadow:var(--shadow-card); display:flex; align-items:center; gap:12px; }
        .stat-icon { width:36px; height:36px; border-radius:8px; display:flex; align-items:center; justify-content:center; flex-shrink:0; }
        .stat-icon.blue { background:var(--primary-bg); color:var(--primary); }
        .stat-icon.green { background:rgba(0,200,83,0.1); color:var(--success); }
        .stat-icon.gray { background:var(--surface-soft); color:var(--muted-text); }
        .stat-icon.purple { background:rgba(121,40,202,0.1); color:var(--info); }
        .stat-body { min-width:0; }
        .stat-label { font-size:11px; color:var(--muted-text); margin:0; }
        .stat-value { font-size:20px; font-weight:600; color:var(--ink); letter-spacing:-0.03em; line-height:1.2; }
        .card { background:#fff; border-radius:8px; box-shadow:var(--shadow-card); overflow:hidden; margin-bottom:16px; }
        .card-h { display:flex; align-items:center; justify-content:space-between; padding:12px 16px; border-bottom:1px solid var(--hairline); }
        .card-h h3 { font-size:12px; font-weight:600; text-transform:uppercase; letter-spacing:0.04em; color:var(--ink); margin:0; display:flex; align-items:center; gap:6px; }
        .card-h span { font-size:11px; color:var(--muted-text); }
        .table { width:100%; border-collapse:collapse; }
        .table th { padding:8px 16px; font-size:11px; font-weight:500; text-transform:uppercase; letter-spacing:0.04em; color:var(--ash); text-align:left; border-bottom:1px solid var(--hairline); background:var(--canvas); }
        .table td { padding:10px 16px; font-size:13px; color:var(--body); border-bottom:1px solid var(--hairline); }
        .table tr:last-child td { border-bottom:none; }
        .table tr:hover td { background:var(--canvas); }
        .mono { font-family:var(--font-mono); font-size:12px; }
        .code-cell { display:flex; align-items:center; gap:8px; }
        .code-flag { width:28px; height:20px; border-radius:4px; font-size:9px; font-weight:600; display:flex; align-items:center; justify-content:center; background:var(--surface-soft); flex-shrink:0; letter-spacing:0.04em; }
        .pill { display:inline-flex; align-items:center; gap:4px; font-size:11px; padding:2px 8px; border-radius:999px; font-weight:500; }
        .pill::before { content:""; width:5px; height:5px; border-radius:50%; }
        .pill-active { background:rgba(0,112,243,0.1); color:var(--success); }
        .pill-active::before { background:var(--success); }
        .pill-inactive { background:rgba(245,166,35,0.1); color:var(--warning); }
        .pill-inactive::before { background:var(--warning); }
        .pill-base { background:rgba(121,40,202,0.1); color:var(--info); }
        .pill-base::before { background:var(--info); }
        .action-cell { display:flex; gap:4px; justify-content:flex-end; }
        .icon-btn { width:30px; height:30px; border-radius:6px; border:none; background:none; cursor:pointer; display:inline-flex; align-items:center; justify-content:center; color:var(--ash); }
        .icon-btn:hover { background:var(--surface-soft); color:var(--body); }
        .icon-btn.edit:hover { color:var(--primary); }
        .icon-btn.delete:hover { color:var(--danger); }
        .icon-btn.activate:hover { color:var(--success); }
        .rate-cell { font-weight:500; font-variant-numeric:tabular-nums; cursor:pointer; }
        .rate-cell:hover { color:var(--primary); }
        .rate-input { width:80px; padding:2px 6px; border:1px solid var(--primary); border-radius:4px; font-size:12px; font-family:var(--font-mono); text-align:right; outline:none; font-variant-numeric:tabular-nums; }
        .rate-input:focus { box-shadow:0 0 0 3px var(--primary-bg); }
        .empty { text-align:center; padding:32px; color:var(--muted-text); font-size:13px; }
        .index-num { color:var(--ash); font-size:11px; width:16px; display:inline-block; text-align:right; }
        .fg { margin-bottom:14px; }
        .fg:last-child { margin-bottom:0; }
        .label { font-size:12px; font-weight:450; color:var(--body); display:block; margin-bottom:4px; }
        .fi { width:100%; height:38px; padding:0 10px; border:1px solid var(--hairline); border-radius:var(--radius-sm); font-size:13px; outline:none; }
        .fi:focus { border-color:var(--primary); box-shadow:0 0 0 3px var(--primary-bg); }
        .fi-error { border-color:var(--danger); }
        .field-hint { font-size:11px; color:var(--muted-text); margin-top:2px; }
        .field-error { font-size:11px; color:var(--danger); margin-top:2px; }
        @media (max-width:768px) { .table th, .table td { padding:6px 8px; font-size:12px; } .action-bar { flex-direction:column; align-items:stretch; } .search-wrap { max-width:none; } }
      `}</style>

      <div className="page-h">Currencies</div>
      <div className="page-sub">Manage supported currencies and exchange rates across the marketplace</div>

      <div className="stat-row">
        <div className="stat-card">
          <div className="stat-icon blue"><MoneyIcon size={18} /></div>
          <div className="stat-body">
            <div className="stat-label">Total currencies</div>
            <div className="stat-value">{currencies.length}</div>
          </div>
        </div>
        <div className="stat-card">
          <div className="stat-icon green"><CheckCircleIcon size={18} /></div>
          <div className="stat-body">
            <div className="stat-label">Active</div>
            <div className="stat-value">{currencies.filter((c) => c.status === "active").length}</div>
          </div>
        </div>
        <div className="stat-card">
          <div className="stat-icon gray"><InactiveIcon size={18} /></div>
          <div className="stat-body">
            <div className="stat-label">Inactive</div>
            <div className="stat-value">{currencies.filter((c) => c.status === "inactive").length}</div>
          </div>
        </div>
        <div className="stat-card">
          <div className="stat-icon purple"><BaseIcon size={18} /></div>
          <div className="stat-body">
            <div className="stat-label">Base currency</div>
            <div className="stat-value">{baseCurrency}</div>
          </div>
        </div>
      </div>

      <div className="action-bar">
        <div className="search-wrap">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} width={14} height={14}><circle cx="11" cy="11" r="8" /><line x1="21" y1="21" x2="16.65" y2="16.65" /></svg>
          <input placeholder="Search currencies..." value={search} onChange={(e) => setSearch(e.target.value)} />
        </div>
        <button className="btn btn-p" onClick={handleAdd}><PlusIcon size={14} />Add currency</button>
      </div>

      <div className="card">
        <div className="card-h">
          <h3><CheckCircleIcon size={14} />Active Currencies</h3>
          <span>{active.length} of {filtered.length}</span>
        </div>
        {active.length === 0 ? (
          <div className="empty">{search ? "No currencies match your search" : "No active currencies"}</div>
        ) : (
          <table className="table">
            <thead>
              <tr>
                <th style={{ width: 24 }}></th>
                <th>Code</th>
                <th>Name</th>
                <th>Symbol</th>
                <th>Rate vs {baseCurrency}</th>
                <th>Status</th>
                <th style={{ width: 120 }}></th>
              </tr>
            </thead>
            <tbody>
              {active.map((c, i) => (
                <CurrencyRow
                  key={c.id}
                  currency={c}
                  index={i}
                  isBase={baseCurrency}
                  onEdit={() => handleEdit(c)}
                  onDelete={() => handleDelete(c)}
                  onSetBase={() => handleSetBase(c)}
                  onRateChange={(rate) => {
                    setCurrencies((prev) => prev.map((x) => (x.id === c.id ? { ...x, rate } : x)));
                  }}
                />
              ))}
            </tbody>
          </table>
        )}
      </div>

      {inactive.length > 0 && (
        <div className="card">
          <div className="card-h">
            <h3><InactiveIcon size={14} />Inactive Currencies</h3>
            <span>{inactive.length} of {filtered.length}</span>
          </div>
          <table className="table">
            <thead>
              <tr>
                <th style={{ width: 24 }}></th>
                <th>Code</th>
                <th>Name</th>
                <th>Symbol</th>
                <th>Rate vs {baseCurrency}</th>
                <th>Status</th>
                <th style={{ width: 120 }}></th>
              </tr>
            </thead>
            <tbody>
              {inactive.map((c, i) => (
                <tr key={c.id}>
                  <td><span className="index-num">{i + 1}</span></td>
                  <td><span className="mono" style={{ fontWeight: 600 }}>{c.code}</span></td>
                  <td>{c.name}</td>
                  <td style={{ fontSize: 16 }}>{c.symbol}</td>
                  <td className="rate-cell">{c.rate.toFixed(4)}</td>
                  <td><span className="pill pill-inactive">inactive</span></td>
                  <td>
                    <div className="action-cell">
                      <button className="icon-btn edit" onClick={() => handleEdit(c)} title="Edit"><EditIcon /></button>
                      <button className="icon-btn activate" onClick={() => handleActivate(c)} title="Reactivate"><ActivateIcon /></button>
                      <button className="icon-btn delete" onClick={() => handleDelete(c)} title="Delete"><TrashIcon /></button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}

function CurrencyRow({ currency, index, isBase, onEdit, onDelete, onSetBase, onRateChange }: {
  currency: AdminCurrency;
  index: number;
  isBase: string;
  onEdit: () => void;
  onDelete: () => void;
  onSetBase: () => void;
  onRateChange: (rate: number) => void;
}) {
  const [editing, setEditing] = useState(false);
  const [rateVal, setRateVal] = useState(String(currency.rate));

  function commitRate() {
    const v = parseFloat(rateVal);
    if (isNaN(v) || v <= 0) {
      setRateVal(String(currency.rate));
    } else {
      onRateChange(parseFloat(v.toFixed(4)));
    }
    setEditing(false);
  }

  return (
    <tr>
      <td><span className="index-num">{index + 1}</span></td>
      <td>
        <div className="code-cell">
          <span className="code-flag">{currency.code.slice(0, 2)}</span>
          <span className="mono" style={{ fontWeight: 600 }}>{currency.code}</span>
        </div>
      </td>
      <td>{currency.name}</td>
      <td style={{ fontSize: 16 }}>{currency.symbol}</td>
      <td>
        {editing ? (
          <input
            className="rate-input"
            type="number"
            step="0.0001"
            value={rateVal}
            onChange={(e) => setRateVal(e.target.value)}
            onBlur={commitRate}
            onKeyDown={(e) => { if (e.key === "Enter") commitRate(); if (e.key === "Escape") { setRateVal(String(currency.rate)); setEditing(false); } }}
            autoFocus
          />
        ) : (
          <span className="rate-cell" onClick={() => { setRateVal(String(currency.rate)); setEditing(true); }} title="Click to edit">
            {currency.rate.toFixed(4)}
          </span>
        )}
      </td>
      <td>
        {currency.code === isBase ? (
          <span className="pill pill-base">base</span>
        ) : (
          <span className="pill pill-active">active</span>
        )}
      </td>
      <td>
        <div className="action-cell">
          {currency.code !== isBase && (
            <button className="icon-btn edit" onClick={onEdit} title="Edit"><EditIcon /></button>
          )}
          {currency.code !== isBase && (
            <button className="icon-btn delete" onClick={onDelete} title="Delete"><TrashIcon /></button>
          )}
          {currency.code !== isBase && (
            <button className="icon-btn activate" onClick={onSetBase} title="Set as base"><StarIcon /></button>
          )}
        </div>
      </td>
    </tr>
  );
}

function CurrencyForm({ initial, baseCurrency, onSave, onCancel }: {
  initial?: AdminCurrency;
  baseCurrency: string;
  onSave: (c: Omit<AdminCurrency, "id">, setAsBase?: boolean) => void;
  onCancel: () => void;
}) {
  const [code, setCode] = useState(initial?.code || "");
  const [name, setName] = useState(initial?.name || "");
  const [symbol, setSymbol] = useState(initial?.symbol || "");
  const [rate, setRate] = useState(initial ? String(initial.rate) : "");
  const [status, setStatus] = useState<"active" | "inactive">(initial?.status || "active");
  const [setAsBase, setSetAsBase] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});

  function validate() {
    const errs: Record<string, string> = {};
    if (!code.trim()) errs.code = "Code is required";
    else if (code.trim().length > 3) errs.code = "Max 3 characters";
    if (!name.trim()) errs.name = "Name is required";
    if (!symbol.trim()) errs.symbol = "Symbol is required";
    if (!rate.trim()) errs.rate = "Rate is required";
    else if (isNaN(parseFloat(rate)) || parseFloat(rate) <= 0) errs.rate = "Must be a positive number";
    setErrors(errs);
    return Object.keys(errs).length === 0;
  }

  function handleSave() {
    if (!validate()) return;
    onSave({
      code: code.toUpperCase().trim(),
      name: name.trim(),
      symbol: symbol.trim(),
      rate: parseFloat(parseFloat(rate).toFixed(4)),
      status,
    }, setAsBase);
  }

  return (
    <div>
      <div className="fg">
        <label className="label">Currency code</label>
        <input
          className={`fi ${errors.code ? "fi-error" : ""}`}
          value={code} onChange={(e) => setCode(e.target.value.toUpperCase())}
          placeholder="e.g. USD" maxLength={3}
        />
        {errors.code ? <div className="field-error">{errors.code}</div> : <div className="field-hint">ISO 4217 3-letter code</div>}
      </div>
      <div className="fg">
        <label className="label">Name</label>
        <input className={`fi ${errors.name ? "fi-error" : ""}`} value={name} onChange={(e) => setName(e.target.value)} placeholder="e.g. US Dollar" />
        {errors.name && <div className="field-error">{errors.name}</div>}
      </div>
      <div className="fg">
        <label className="label">Symbol</label>
        <input className={`fi ${errors.symbol ? "fi-error" : ""}`} value={symbol} onChange={(e) => setSymbol(e.target.value)} placeholder="e.g. $" />
        {errors.symbol && <div className="field-error">{errors.symbol}</div>}
      </div>
      <div className="fg">
        <label className="label">Rate vs {baseCurrency} (base)</label>
        <input
          className={`fi ${errors.rate ? "fi-error" : ""}`}
          type="number" step="0.0001"
          value={rate} onChange={(e) => setRate(e.target.value)}
          placeholder="e.g. 1.0000"
        />
        {errors.rate ? <div className="field-error">{errors.rate}</div> : <div className="field-hint">1 {code || "CURRENCY"} = this many {baseCurrency}</div>}
      </div>
      <div className="fg">
        <label className="label">Status</label>
        <select className="fi" value={status} onChange={(e) => setStatus(e.target.value as "active" | "inactive")}>
          <option value="active">Active</option>
          <option value="inactive">Inactive</option>
        </select>
      </div>
      {initial && initial.code !== baseCurrency && (
        <div className="fg">
          <label style={{ display: "flex", alignItems: "center", gap: 8, cursor: "pointer", fontSize: 13, color: "var(--body)" }}>
            <input type="checkbox" checked={setAsBase} onChange={(e) => setSetAsBase(e.target.checked)} style={{ width: 16, height: 16, accentColor: "var(--primary)" }} />
            Set as base currency
          </label>
          {setAsBase && <div className="field-hint" style={{ marginLeft: 24 }}>This will recalculate all exchange rates</div>}
        </div>
      )}
      <div className="admin-modal-actions">
        <button className="btn btn-s" onClick={onCancel}>Cancel</button>
        <button className="btn btn-p" onClick={handleSave}>{initial ? "Save changes" : "Add currency"}</button>
      </div>
    </div>
  );
}
