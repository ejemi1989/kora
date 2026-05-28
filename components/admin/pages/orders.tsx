"use client";

import { useState } from "react";
import { useAdmin } from "@/components/admin/admin-context";
import { ADMIN_ORDERS } from "@/lib/data/admin";
import type { AdminOrder } from "@/lib/types/admin";
import { SearchIcon } from "@/components/user/icons";

const filters = ["All", "Pending", "Confirmed", "Shipped", "Delivered", "Cancelled"];

const pillClass: Record<string, string> = {
  pending: "pill-pending",
  confirmed: "pill-info",
  shipped: "pill-active",
  delivered: "pill-success",
  cancelled: "pill-danger",
};

export function OrdersPage() {
  const { showToast, openModal, closeModal } = useAdmin();
  const [activeFilter, setActiveFilter] = useState("All");
  const [search, setSearch] = useState("");

  const filtered = ADMIN_ORDERS.filter((o) => {
    if (activeFilter !== "All" && o.status !== activeFilter.toLowerCase()) return false;
    if (search && !o.id.toLowerCase().includes(search.toLowerCase()) && !o.customer.toLowerCase().includes(search.toLowerCase())) return false;
    return true;
  });

  function handleView(order: AdminOrder) {
    openModal(`Order ${order.id}`, (
      <div>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "8px 20px", marginBottom: 16 }}>
          {[
            ["Customer", order.customer],
            ["Total", order.total],
            ["Payment", order.payment],
            ["Date", order.date],
            ["Status", <span key="s" className={`pill ${pillClass[order.status]}`}>{order.status}</span>],
            ["Items", `${order.items} items`],
          ].map(([l, v]) => (
            <div key={l as string}>
              <div className="di-label">{l}</div>
              <div style={{ fontSize: 13, color: "var(--body)", marginTop: 2 }}>{v}</div>
            </div>
          ))}
        </div>
        <div style={{ padding: 12, background: "var(--canvas)", borderRadius: 6 }}>
          <div className="di-label" style={{ marginBottom: 4 }}>Tracking</div>
          <div style={{ fontSize: 12, color: "var(--muted-text)" }}>No tracking info available yet.</div>
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
        .action-bar { display:flex; align-items:center; gap:10px; margin-bottom:16px; flex-wrap:wrap; }
        .search-wrap { position:relative; max-width:240px; flex:1; min-width:160px; }
        .search-wrap input { width:100%; height:34px; padding:0 8px 0 28px; border:1px solid var(--hairline); border-radius:var(--radius-sm); font-size:12px; outline:none; background:#fff; }
        .search-wrap input:focus { border-color:var(--primary); box-shadow:0 0 0 3px var(--primary-bg); }
        .search-wrap svg { position:absolute; left:8px; top:50%; transform:translateY(-50%); color:var(--stone); pointer-events:none; }
        .filter-chips { display:flex; gap:4px; flex-wrap:wrap; }
        .chip { padding:4px 12px; border-radius:999px; border:1px solid var(--hairline); background:#fff; font-size:12px; color:var(--body); cursor:pointer; }
        .chip.active { background:var(--primary-bg); border-color:var(--primary); color:var(--primary); font-weight:500; }
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
        .pill-info { background:rgba(121,40,202,0.1); color:var(--info); }
        .pill-info::before { background:var(--info); }
        .pill-success { background:rgba(0,112,243,0.1); color:var(--success); }
        .pill-success::before { background:var(--success); }
        .pill-danger { background:rgba(238,0,0,0.08); color:var(--danger); }
        .pill-danger::before { background:var(--danger); }
        .action-link { font-size:12px; color:var(--primary); cursor:pointer; border:none; background:none; padding:0; }
        .action-link:hover { text-decoration:underline; }
        .di-label { font-family:var(--font-mono); font-size:10px; text-transform:uppercase; letter-spacing:0.04em; color:var(--ash); }
        .admin-modal-actions { display:flex; justify-content:flex-end; gap:8px; margin-top:16px; }
      `}</style>

      <div className="page-h">Orders</div>
      <div className="page-sub">Monitor all marketplace orders — track, cancel, or manage returns</div>

      <div className="action-bar">
        <div className="search-wrap">
          <SearchIcon size={14} />
          <input placeholder="Search orders..." value={search} onChange={(e) => setSearch(e.target.value)} />
        </div>
        <div className="filter-chips">
          {filters.map((f) => (
            <button key={f} className={`chip ${activeFilter === f ? "active" : ""}`} onClick={() => setActiveFilter(f)}>{f}</button>
          ))}
        </div>
      </div>

      <div className="table-wrap">
        <table>
          <thead>
            <tr>
              <th>Order ID</th>
              <th>Customer</th>
              <th>Items</th>
              <th>Total</th>
              <th>Payment</th>
              <th>Date</th>
              <th>Status</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            {filtered.map((o) => (
              <tr key={o.id}>
                <td><span className="mono">{o.id}</span></td>
                <td>{o.customer}</td>
                <td>{o.items} items</td>
                <td style={{ fontWeight: 500 }}>{o.total}</td>
                <td>{o.payment}</td>
                <td>{o.date}</td>
                <td><span className={`pill ${pillClass[o.status]}`}>{o.status}</span></td>
                <td><button className="action-link" onClick={() => handleView(o)}>View</button></td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
