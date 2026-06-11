"use client";

import { useEffect, useState } from "react";
import { useUser } from "@clerk/nextjs";
import { useSeller } from "@/components/seller/seller-context";
import { SearchIcon } from "@/components/user/icons";

interface CustomerHistoryEntry {
  order: string;
  product: string;
  amount: string;
  status: string;
  statusClass: string;
  date: string;
}

interface Customer {
  id: string;
  name: string;
  email: string;
  phone: string;
  location: string;
  status: string;
  initials: string;
  bg: string;
  fg: string;
  orders: number;
  spent: number;
  last: string;
  history: CustomerHistoryEntry[];
}

const statusBadge: Record<string, string> = {
  Regular: "s-badge-reg",
  New: "s-badge-new",
};

export function CustomersPage() {
  const { openModal, closeModal } = useSeller();
  const { isSignedIn } = useUser();
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");

  useEffect(() => {
    if (!isSignedIn) return;
    fetch("/api/seller/customers")
      .then((r) => r.json())
      .then((d) => { if (Array.isArray(d)) setCustomers(d); setLoading(false); })
      .catch(() => setLoading(false));
  }, [isSignedIn]);

  const filtered = customers.filter(
    (c) => c.name.toLowerCase().includes(search.toLowerCase()) || c.email.toLowerCase().includes(search.toLowerCase())
  );

  function viewCustomer(c: Customer) {
    openModal(c.name, (
      <div>
        <div style={{ display: "flex", alignItems: "center", gap: 14, marginBottom: 20 }}>
          <div style={{ width: 44, height: 44, borderRadius: "50%", background: c.bg, color: c.fg, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 16, fontWeight: 600 }}>{c.initials}</div>
          <div>
            <div style={{ fontWeight: 600, fontSize: 15 }}>{c.name}</div>
            <div style={{ fontSize: 12.5, color: "var(--muted-text)", marginTop: 2 }}>{c.email}{c.phone ? ` · ${c.phone}` : ""}{c.location ? ` · ${c.location}` : ""}</div>
          </div>
          <span style={{ marginLeft: "auto" }}><span className={`s-badge ${statusBadge[c.status]}`}>{c.status}</span></span>
        </div>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 12, marginBottom: 20 }}>
          <div className="s-mini-stat">
            <div className="val">{c.orders}</div>
            <div className="lbl">Orders</div>
          </div>
          <div className="s-mini-stat">
            <div className="val">₦{c.spent.toLocaleString()}</div>
            <div className="lbl">Total Spent</div>
          </div>
          <div className="s-mini-stat">
            <div className="val">{c.last}</div>
            <div className="lbl">Last Order</div>
          </div>
        </div>
        <div style={{ fontWeight: 600, fontSize: 13, marginBottom: 10 }}>Order History</div>
        <div className="s-table-wrap">
          <table className="s-table" style={{ fontSize: 12 }}>
            <thead>
              <tr>
                <th>Order</th>
                <th>Product</th>
                <th>Amount</th>
                <th>Status</th>
                <th>Date</th>
              </tr>
            </thead>
            <tbody>
              {c.history.map((h) => (
                <tr key={h.order}>
                  <td><span className="mono">{h.order}</span></td>
                  <td>{h.product}</td>
                  <td>{h.amount}</td>
                  <td><span className={`s-badge ${h.statusClass.replace("badge-", "s-")}`}>{h.status}</span></td>
                  <td>{h.date}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <div className="s-modal-actions">
          <button className="s-btn s-btn-s" onClick={closeModal}>Close</button>
        </div>
      </div>
    ));
  }

  return (
    <div>
      <style>{`
        .s-page-h { font-size:20px; font-weight:600; color:var(--ink); letter-spacing:-0.03em; margin:0 0 4px; }
        .s-page-sub { font-size:13px; color:var(--muted-text); margin:0 0 20px; }
        .s-action-bar { display:flex; align-items:center; gap:10px; margin-bottom:16px; flex-wrap:wrap; }
        .s-search-wrap { position:relative; width:220px; }
        .s-search-wrap input { width:100%; height:34px; padding:0 8px 0 30px; border:1px solid var(--hairline); border-radius:var(--radius-sm); font-size:12px; outline:none; background:#fff; }
        .s-search-wrap input:focus { border-color:var(--primary); box-shadow:0 0 0 3px var(--primary-bg); }
        .s-search-wrap svg { position:absolute; left:8px; top:50%; transform:translateY(-50%); color:var(--stone); pointer-events:none; }
        .s-badge { display:inline-block; padding:2px 8px; border-radius:999px; font-size:10px; font-weight:500; text-transform:uppercase; }
        .s-badge-reg { background:rgba(0,112,243,0.1); color:var(--success); }
        .s-badge-new { background:rgba(245,166,35,0.1); color:var(--warning); }
        .s-badge-delivered { background:rgba(0,112,243,0.1); color:var(--success); }
        .s-badge-shipped { background:rgba(245,166,35,0.1); color:var(--warning); }
        .s-badge-processing { background:rgba(121,40,202,0.1); color:var(--info); }
        .s-table-wrap { overflow-x:auto; }
        .s-table { width:100%; border-collapse:collapse; font-size:13px; }
        .s-table th { text-align:left; padding:10px 14px; font-size:11px; font-weight:600; color:var(--ash); text-transform:uppercase; letter-spacing:0.04em; border-bottom:1px solid var(--hairline); background:var(--canvas); }
        .s-table td { padding:10px 14px; border-bottom:1px solid var(--hairline); color:var(--body); }
        .s-table tr:last-child td { border-bottom:none; }
        .s-table .mono { font-family:var(--font-mono); font-size:12px; color:var(--ash); }
        .s-table-wrap { overflow-x:auto; background:#fff; border-radius:8px; border:1px solid var(--hairline); box-shadow:0 1px 3px rgba(0,0,0,0.04); }
        .s-mini-stat { background:var(--canvas); border-radius:8px; padding:12px; text-align:center; }
        .s-mini-stat .val { font-size:20px; font-weight:600; color:var(--ink); }
        .s-mini-stat .lbl { font-size:11px; color:var(--muted-text); margin-top:2px; }
        .s-btn { display:inline-flex; align-items:center; gap:6px; padding:5px 10px; border-radius:var(--radius-sm); font-size:11px; font-weight:500; cursor:pointer; border:none; transition:all 150ms; }
        .s-btn-s { background:#fff; color:var(--body); border:1px solid var(--hairline); }
        .s-btn-s:hover { background:var(--surface-soft); }
        .s-modal-actions { display:flex; justify-content:flex-end; gap:8px; margin-top:16px; }
        .s-customer-list { display:grid; gap:8px; }
        .s-customer-card { display:flex; align-items:center; gap:12px; padding:12px 14px; background:#fff; border-radius:8px; border:1px solid var(--hairline); box-shadow:0 1px 3px rgba(0,0,0,0.04); cursor:pointer; transition:all 150ms; }
        .s-customer-card:hover { border-color:var(--primary); box-shadow:0 2px 8px rgba(232,85,42,0.1); }
        .s-cust-avatar { width:36px; height:36px; border-radius:50%; display:flex; align-items:center; justify-content:center; font-size:13px; font-weight:600; flex-shrink:0; }
        .s-cust-info { flex:1; min-width:0; }
        .s-cust-name { font-size:13px; font-weight:500; color:var(--ink); }
        .s-cust-meta { font-size:11px; color:var(--muted-text); margin-top:1px; }
        .s-cust-stats { text-align:right; }
        .s-cust-stats .val { font-size:13px; font-weight:500; }
        .s-cust-stats .lbl { font-size:10px; color:var(--ash); }
        .s-loading { text-align:center; padding:48px 0; color:var(--muted-text); font-size:14px; }
        @media (max-width:768px) { .s-search-wrap { width:100%; } }
      `}</style>

      <div className="s-page-h">Customers</div>
      <div className="s-page-sub">Your customer community</div>

      <div className="s-action-bar">
        <div className="s-search-wrap">
          <SearchIcon size={14} />
          <input placeholder="Search customers..." value={search} onChange={(e) => setSearch(e.target.value)} />
        </div>
      </div>

      {loading ? (
        <div className="s-loading">Loading customers...</div>
      ) : filtered.length === 0 ? (
        <div className="s-loading">No customers found</div>
      ) : (
        <div className="s-customer-list">
          {filtered.map((c) => (
            <div key={c.id} className="s-customer-card" onClick={() => viewCustomer(c)}>
              <div className="s-cust-avatar" style={{ background: c.bg, color: c.fg }}>{c.initials}</div>
              <div className="s-cust-info">
                <div className="s-cust-name">{c.name}</div>
                <div className="s-cust-meta">{c.email}{c.location ? ` · ${c.location}` : ""} · {c.last}</div>
              </div>
              <div className="s-cust-stats">
                <div className="val">{c.orders} orders</div>
                <div className="lbl">₦{c.spent.toLocaleString()}</div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
