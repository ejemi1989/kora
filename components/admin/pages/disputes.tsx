"use client";

import { useState } from "react";
import { useAdmin } from "@/components/admin/admin-context";
import { ADMIN_DISPUTES, ADMIN_DISPUTE_STATS } from "@/lib/data/admin";
import type { AdminDispute } from "@/lib/types/admin";
import { SearchIcon } from "@/components/user/icons";

const pillStatus: Record<string, string> = {
  open: "pill-pending",
  resolved: "pill-success",
};

const pillPriority: Record<string, string> = {
  high: "pill-danger",
  medium: "pill-warning",
  low: "pill-active",
};

export function DisputesPage() {
  const { showToast, openModal, closeModal } = useAdmin();
  const [disputes, setDisputes] = useState(ADMIN_DISPUTES);
  const [search, setSearch] = useState("");

  const filtered = disputes.filter((d) => {
    if (search && !d.id.toLowerCase().includes(search.toLowerCase()) && !d.buyer.toLowerCase().includes(search.toLowerCase())) return false;
    return true;
  });

  function handleResolve(dispute: AdminDispute) {
    openModal(`Resolve ${dispute.id}`, (
      <div>
        <p style={{ fontSize: 13, color: "var(--body)", margin: "0 0 12px" }}>
          Issue: <strong>{dispute.issue}</strong> — {dispute.amount}
        </p>
        <div className="fg">
          <label className="label">Resolution</label>
          <select className="fi">
            <option>Refund buyer (full)</option>
            <option>Refund buyer (partial)</option>
            <option>Reject claim</option>
            <option>Split 50-50</option>
          </select>
        </div>
        <div className="fg">
          <label className="label">Admin notes</label>
          <textarea className="fi" rows={3} placeholder="Resolution notes..." />
        </div>
        <div className="admin-modal-actions">
          <button className="btn btn-s" onClick={() => { showToast(`${dispute.id} escalated`, "warning"); closeModal(); }}>Escalate</button>
          <button className="btn btn-p" onClick={() => { setDisputes(disputes.map((d) => d.id === dispute.id ? { ...d, status: "resolved" as const } : d)); showToast(`${dispute.id} resolved`, "success"); closeModal(); }}>Resolve dispute</button>
        </div>
      </div>
    ));
  }

  function handleView(dispute: AdminDispute) {
    openModal(dispute.id, (
      <div>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "8px 20px" }}>
          {[
            ["Buyer", dispute.buyer],
            ["Seller", dispute.seller],
            ["Issue", dispute.issue],
            ["Amount", dispute.amount],
            ["Status", <span key="s" className={`pill ${pillStatus[dispute.status]}`}>{dispute.status}</span>],
          ].map(([l, v]) => (
            <div key={l as string}>
              <div className="di-label">{l}</div>
              <div style={{ fontSize: 13, color: "var(--body)", marginTop: 2 }}>{v}</div>
            </div>
          ))}
        </div>
        <div className="admin-modal-actions">
          <button className="btn btn-s" onClick={closeModal}>Close</button>
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
        .action-bar { display:flex; align-items:center; gap:10px; margin-bottom:16px; flex-wrap:wrap; }
        .search-wrap { position:relative; max-width:240px; flex:1; min-width:160px; }
        .search-wrap input { width:100%; height:34px; padding:0 8px 0 28px; border:1px solid var(--hairline); border-radius:var(--radius-sm); font-size:12px; outline:none; background:#fff; }
        .search-wrap input:focus { border-color:var(--primary); box-shadow:0 0 0 3px var(--primary-bg); }
        .search-wrap svg { position:absolute; left:8px; top:50%; transform:translateY(-50%); color:var(--stone); pointer-events:none; }
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
        .pill-success { background:rgba(0,112,243,0.1); color:var(--success); }
        .pill-success::before { background:var(--success); }
        .pill-danger { background:rgba(238,0,0,0.08); color:var(--danger); }
        .pill-danger::before { background:var(--danger); }
        .pill-warning { background:rgba(245,166,35,0.1); color:var(--warning); }
        .pill-warning::before { background:var(--warning); }
        .action-link { font-size:12px; color:var(--primary); cursor:pointer; border:none; background:none; padding:0; }
        .action-link:hover { text-decoration:underline; }
        .di-label { font-family:var(--font-mono); font-size:10px; text-transform:uppercase; letter-spacing:0.04em; color:var(--ash); }
        .fi { width:100%; padding:8px 10px; border:1px solid var(--hairline); border-radius:var(--radius-sm); font-size:13px; outline:none; resize:vertical; font-family:inherit; }
        .fi:focus { border-color:var(--primary); box-shadow:0 0 0 3px var(--primary-bg); }
        .fg { margin-bottom:12px; }
        .fg:last-child { margin-bottom:0; }
        .label { font-size:12px; font-weight:450; color:var(--body); display:block; margin-bottom:4px; }
        .admin-modal-actions { display:flex; justify-content:flex-end; gap:8px; margin-top:16px; }
        @media (max-width:768px) { .stats-3 { grid-template-columns:1fr; } }
      `}</style>

      <div className="page-h">Disputes</div>
      <div className="page-sub">Resolve buyer-seller disputes and issue resolutions</div>

      <div className="stats-3">
        {ADMIN_DISPUTE_STATS.map((s) => (
          <div key={s.label} className="stat-card">
            <div className="stat-label">{s.label}</div>
            <div className="stat-value" style={s.color ? { color: s.color } : undefined}>{s.value}</div>
          </div>
        ))}
      </div>

      <div className="action-bar">
        <div className="search-wrap">
          <SearchIcon size={14} />
          <input placeholder="Search disputes..." value={search} onChange={(e) => setSearch(e.target.value)} />
        </div>
      </div>

      <div className="table-wrap">
        <table>
          <thead>
            <tr>
              <th>ID</th>
              <th>Buyer</th>
              <th>Seller</th>
              <th>Issue</th>
              <th>Amount</th>
              <th>Opened</th>
              <th>Priority</th>
              <th>Status</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            {filtered.map((d) => (
              <tr key={d.id}>
                <td><span className="mono">{d.id}</span></td>
                <td>{d.buyer}</td>
                <td>{d.seller}</td>
                <td>{d.issue}</td>
                <td style={{ fontWeight: 500 }}>{d.amount}</td>
                <td>{d.opened}</td>
                <td><span className={`pill ${pillPriority[d.priority]}`}>{d.priority}</span></td>
                <td><span className={`pill ${pillStatus[d.status]}`}>{d.status}</span></td>
                <td>
                  {d.status === "open" && <button className="action-link" onClick={() => handleResolve(d)}>Resolve</button>}
                  {d.status === "resolved" && <button className="action-link" onClick={() => handleView(d)}>View</button>}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
