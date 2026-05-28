"use client";

import { useState } from "react";
import { useAdmin } from "@/components/admin/admin-context";
import { ADMIN_SELLERS } from "@/lib/data/admin";
import type { AdminSeller } from "@/lib/types/admin";
import { SearchIcon, CheckIcon, XIcon } from "@/components/user/icons";

const filters = ["All", "Approved", "Pending", "Rejected"];

const docPill: Record<string, string> = {
  Verified: "pill-active",
  Pending: "pill-pending",
};

export function SellersPage() {
  const { showToast, openModal, closeModal } = useAdmin();
  const [sellers, setSellers] = useState(ADMIN_SELLERS);
  const [activeFilter, setActiveFilter] = useState("All");
  const [search, setSearch] = useState("");

  const filtered = sellers.filter((s) => {
    const f = activeFilter.toLowerCase();
    if (activeFilter !== "All" && s.status !== f && !(f === "approved" && s.status === "active") && !(f === "pending" && s.docs === "Pending")) return false;
    if (activeFilter === "Approved" && s.status !== "active") return false;
    if (activeFilter === "Pending" && s.status !== "pending") return false;
    if (search && !s.business.toLowerCase().includes(search.toLowerCase()) && !s.owner.toLowerCase().includes(search.toLowerCase())) return false;
    return true;
  });

  function handleVerify(seller: AdminSeller) {
    openModal("Verify documents", (
      <div>
        <p style={{ fontSize: 13, color: "var(--body)", margin: "0 0 16px" }}>
          Review documents for <strong>{seller.business}</strong>
        </p>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12, marginBottom: 16 }}>
          <div style={{ height: 120, background: "var(--surface-soft)", borderRadius: 8, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", color: "var(--stone)", fontSize: 11 }}>
            <FileIcon size={20} />
            Business registration
          </div>
          <div style={{ height: 120, background: "var(--surface-soft)", borderRadius: 8, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", color: "var(--stone)", fontSize: 11 }}>
            <FileIcon size={20} />
            Government ID
          </div>
        </div>
        <div className="admin-modal-actions">
          <button className="btn btn-s" onClick={closeModal}>Reject</button>
          <button className="btn btn-p" onClick={() => { setSellers(sellers.map((s) => s.id === seller.id ? { ...s, docs: "Verified" as const } : s)); showToast(`${seller.business} verified`, "success"); closeModal(); }}>Approve & verify</button>
        </div>
      </div>
    ));
  }

  function handleView(seller: AdminSeller) {
    openModal(seller.business, (
      <div>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "12px 20px" }}>
          {[
            ["Owner", seller.owner],
            ["Category", seller.category],
            ["Location", seller.location],
            ["Products", `${seller.products}`],
            ["Revenue", seller.revenue],
            ["Documents", <span key="docs" className={`pill ${docPill[seller.docs]}`}>{seller.docs}</span>],
          ].map(([label, value]) => (
            <div key={label as string}>
              <div className="di-label">{label}</div>
              <div style={{ fontSize: 13, color: "var(--body)", marginTop: 2 }}>{value}</div>
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
        .pill-danger { background:rgba(238,0,0,0.08); color:var(--danger); }
        .pill-danger::before { background:var(--danger); }
        .action-link { font-size:12px; color:var(--primary); cursor:pointer; border:none; background:none; padding:0; }
        .action-link:hover { text-decoration:underline; }
        .di-label { font-family:var(--font-mono); font-size:10px; text-transform:uppercase; letter-spacing:0.04em; color:var(--ash); }
        .admin-modal-actions { display:flex; justify-content:flex-end; gap:8px; margin-top:16px; }
      `}</style>

      <div className="page-h">Sellers</div>
      <div className="page-sub">Approve seller applications and verify business documents</div>

      <div className="action-bar">
        <div className="search-wrap">
          <SearchIcon size={14} />
          <input placeholder="Search sellers..." value={search} onChange={(e) => setSearch(e.target.value)} />
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
              <th>Business</th>
              <th>Owner</th>
              <th>Category</th>
              <th>Location</th>
              <th>Products</th>
              <th>Revenue</th>
              <th>Documents</th>
              <th>Status</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            {filtered.map((s) => (
              <tr key={s.id}>
                <td style={{ fontWeight: 500 }}>{s.business}</td>
                <td>{s.owner}</td>
                <td>{s.category}</td>
                <td>{s.location}</td>
                <td>{s.products}</td>
                <td style={{ fontWeight: 500 }}>{s.revenue}</td>
                <td><span className={`pill ${docPill[s.docs]}`}>{s.docs}</span></td>
                <td><span className={`pill ${docPill[s.status === "active" ? "Verified" : "Pending"]}`}>{s.status}</span></td>
                <td>
                  {s.docs === "Pending" && s.status === "active" && <button className="action-link" onClick={() => handleVerify(s)}>Verify docs</button>}
                  {s.docs === "Pending" && s.status === "pending" && <button className="action-link" onClick={() => handleVerify(s)}>Verify docs</button>}
                  {s.docs === "Verified" && <button className="action-link" onClick={() => handleView(s)}>View</button>}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

function FileIcon({ size = 16 }: { size?: number }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5} strokeLinecap="round" strokeLinejoin="round" width={size} height={size}>
      <path d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8z" /><polyline points="14 2 14 8 20 8" />
    </svg>
  );
}
