"use client";

import { useState } from "react";
import { useAdmin } from "@/components/admin/admin-context";
import { ADMIN_TRANSACTIONS, ADMIN_PAYMENT_STATS } from "@/lib/data/admin";
import { SearchIcon } from "@/components/user/icons";

const pillClass: Record<string, string> = {
  completed: "pill-active",
  pending: "pill-pending",
  refunded: "pill-danger",
};

export function PaymentsPage() {
  const { showToast, openModal, closeModal } = useAdmin();
  const [search, setSearch] = useState("");

  const filtered = ADMIN_TRANSACTIONS.filter((t) => {
    if (search && !t.id.toLowerCase().includes(search.toLowerCase()) && !t.customer.toLowerCase().includes(search.toLowerCase())) return false;
    return true;
  });

  function handleRefund() {
    openModal("Process refund", (
      <div>
        <div className="fg">
          <label className="label">Transaction ID</label>
          <input className="fi" placeholder="e.g. TXN-89432" />
        </div>
        <div className="fg">
          <label className="label">Refund amount</label>
          <input className="fi" type="number" placeholder="0.00" />
        </div>
        <div className="fg">
          <label className="label">Reason</label>
          <select className="fi">
            <option>Customer request</option>
            <option>Item not received</option>
            <option>Damaged goods</option>
            <option>Wrong item shipped</option>
            <option>Duplicate payment</option>
          </select>
        </div>
        <div className="admin-modal-actions">
          <button className="btn btn-s" onClick={closeModal}>Cancel</button>
          <button className="btn btn-p" onClick={() => { showToast("Refund processed", "success"); closeModal(); }}>Process refund</button>
        </div>
      </div>
    ));
  }

  return (
    <div>
      <style>{`
        .page-h { font-size:20px; font-weight:600; color:var(--ink); letter-spacing:-0.03em; margin:0 0 4px; }
        .page-sub { font-size:13px; color:var(--muted-text); margin:0 0 20px; }
        .stats-3 { display:grid; grid-template-columns:repeat(3,1fr); gap:12px; margin-bottom:20px; }
        .stat-card { background:#fff; border-radius:8px; padding:16px; box-shadow:var(--shadow-card); }
        .stat-label { font-size:12px; color:var(--muted-text); margin:0 0 4px; }
        .stat-value { font-size:22px; font-weight:600; color:var(--ink); letter-spacing:-0.03em; margin:0; }
        .card-h-flex { display:flex; align-items:center; justify-content:space-between; margin-bottom:16px; }
        .card-h-flex h3 { font-size:15px; font-weight:500; color:var(--ink); margin:0; }
        .btn { display:inline-flex; align-items:center; gap:4px; height:34px; padding:0 14px; border-radius:var(--radius-sm); font-size:12px; font-weight:500; cursor:pointer; transition:all 150ms; border:none; }
        .btn-p { background:var(--primary); color:#fff; }
        .btn-p:hover { background:var(--primary-deep); }
        .btn-s { background:#fff; border:1px solid var(--hairline); color:var(--body); }
        .btn-s:hover { background:var(--surface-soft); }
        .table-wrap { background:#fff; border-radius:8px; box-shadow:var(--shadow-card); overflow-x:auto; }
        .table-wrap table { width:100%; border-collapse:collapse; }
        .table-wrap th { font-size:12px; font-weight:500; color:var(--muted-text); padding:10px 14px; text-align:left; border-bottom:1px solid var(--hairline); white-space:nowrap; }
        .table-wrap td { font-size:13px; color:var(--body); padding:10px 14px; border-bottom:1px solid var(--hairline); vertical-align:middle; }
        .table-wrap tr:last-child td { border-bottom:none; }
        .table-wrap tr:hover td { background:var(--canvas); }
        .mono { font-family:var(--font-mono); font-size:12px; color:var(--ash); }
        .pill { display:inline-flex; align-items:center; gap:4px; font-size:11px; padding:2px 8px; border-radius:999px; font-weight:500; }
        .pill::before { content:""; width:5px; height:5px; border-radius:50%; }
        .pill-active { background:rgba(0,112,243,0.1); color:var(--success); }
        .pill-active::before { background:var(--success); }
        .pill-pending { background:rgba(245,166,35,0.1); color:var(--warning); }
        .pill-pending::before { background:var(--warning); }
        .pill-danger { background:rgba(238,0,0,0.08); color:var(--danger); }
        .pill-danger::before { background:var(--danger); }
        .fi { width:100%; padding:8px 10px; border:1px solid var(--hairline); border-radius:var(--radius-sm); font-size:13px; outline:none; font-family:inherit; }
        .fi:focus { border-color:var(--primary); box-shadow:0 0 0 3px var(--primary-bg); }
        .fg { margin-bottom:12px; }
        .fg:last-child { margin-bottom:0; }
        .label { font-size:12px; font-weight:450; color:var(--body); display:block; margin-bottom:4px; }
        .admin-modal-actions { display:flex; justify-content:flex-end; gap:8px; margin-top:16px; }
        @media (max-width:768px) { .stats-3 { grid-template-columns:1fr; } }
      `}</style>

      <div className="page-h">Payments</div>
      <div className="page-sub">View transactions, process refunds, and manage payouts</div>

      <div className="stats-3">
        {ADMIN_PAYMENT_STATS.map((s) => (
          <div key={s.label} className="stat-card">
            <div className="stat-label">{s.label}</div>
            <div className="stat-value">{s.value}</div>
          </div>
        ))}
      </div>

      <div className="card-h-flex">
        <h3>Transactions</h3>
        <button className="btn btn-p" onClick={handleRefund}>Process refund</button>
      </div>

      <div className="table-wrap">
        <table>
          <thead>
            <tr>
              <th>Transaction ID</th>
              <th>Customer</th>
              <th>Method</th>
              <th>Amount</th>
              <th>Date</th>
              <th>Status</th>
            </tr>
          </thead>
          <tbody>
            {filtered.map((t) => (
              <tr key={t.id}>
                <td><span className="mono">{t.id}</span></td>
                <td>{t.customer}</td>
                <td>{t.method}</td>
                <td style={{ fontWeight: 500 }}>{t.amount}</td>
                <td>{t.date}</td>
                <td><span className={`pill ${pillClass[t.status]}`}>{t.status}</span></td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
