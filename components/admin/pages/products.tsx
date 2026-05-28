"use client";

import { useState } from "react";
import { useAdmin } from "@/components/admin/admin-context";
import { ADMIN_PRODUCTS } from "@/lib/data/admin";
import type { AdminProduct } from "@/lib/types/admin";
import { SearchIcon } from "@/components/user/icons";

const filters = ["All", "Approved", "Pending", "Flagged"];

const pStatus: Record<string, string> = {
  active: "pill-active",
  pending: "pill-pending",
  flagged: "pill-info",
};

export function ProductsPage() {
  const { showToast, openModal, closeModal } = useAdmin();
  const [products, setProducts] = useState(ADMIN_PRODUCTS);
  const [activeFilter, setActiveFilter] = useState("All");
  const [search, setSearch] = useState("");

  const statusMap: Record<string, string> = { All: "", Approved: "active", Pending: "pending", Flagged: "flagged" };

  const filtered = products.filter((p) => {
    const f = statusMap[activeFilter];
    if (f && p.status !== f) return false;
    if (search && !p.name.toLowerCase().includes(search.toLowerCase()) && !p.seller.toLowerCase().includes(search.toLowerCase())) return false;
    return true;
  });

  function handleModerate(product: AdminProduct) {
    openModal("Moderate listing", (
      <div>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "8px 20px", marginBottom: 16 }}>
          {[["Listed by", product.seller], ["Price", product.price], ["Category", product.category], ["Date listed", "May 2026"]].map(([l, v]) => (
            <div key={l as string}>
              <div className="di-label">{l}</div>
              <div style={{ fontSize: 13, color: "var(--body)", marginTop: 2 }}>{v}</div>
            </div>
          ))}
        </div>
        <div className="fg">
          <label className="label">Admin notes</label>
          <textarea className="fi" rows={3} placeholder="Add notes about this listing..." />
        </div>
        <div className="admin-modal-actions">
          <button className="btn btn-s" onClick={() => { showToast(`${product.name} flagged`, "warning"); closeModal(); }}>Flag for review</button>
          <button className="btn btn-p" onClick={() => { showToast(`${product.name} approved`, "success"); closeModal(); }}>Approve listing</button>
        </div>
      </div>
    ));
  }

  function handleApprove(product: AdminProduct) {
    openModal("Approve listing", (
      <div>
        <p style={{ fontSize: 13, color: "var(--body)", margin: "0 0 16px" }}>Approve <strong>{product.name}</strong>? This will make it visible to buyers.</p>
        <div className="admin-modal-actions">
          <button className="btn btn-s" onClick={closeModal}>Cancel</button>
          <button className="btn btn-p" onClick={() => { setProducts(products.map((p) => p.id === product.id ? { ...p, status: "active" as const } : p)); showToast(`${product.name} approved`, "success"); closeModal(); }}>Approve</button>
        </div>
      </div>
    ));
  }

  function handleReview(product: AdminProduct) {
    openModal("Review flagged listing", (
      <div>
        <div className="alert alert-warn" style={{ marginBottom: 12 }}>
          <span style={{ fontSize: 13, color: "var(--body)" }}>Flag reason: <strong>Potential counterfeit — price significantly below market average</strong></span>
        </div>
        <div className="admin-modal-actions">
          <button className="btn btn-d" onClick={() => { showToast(`${product.name} rejected`, "danger"); closeModal(); }}>Reject listing</button>
          <button className="btn btn-p" onClick={() => { setProducts(products.map((p) => p.id === product.id ? { ...p, status: "active" as const } : p)); showToast(`${product.name} approved`, "success"); closeModal(); }}>Clear flag & approve</button>
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
        .btn-d { background:var(--danger); color:#fff; }
        .table-wrap { background:#fff; border-radius:8px; box-shadow:var(--shadow-card); overflow-x:auto; }
        .table-wrap table { width:100%; border-collapse:collapse; }
        .table-wrap th { font-size:12px; font-weight:500; color:var(--muted-text); padding:10px 14px; text-align:left; border-bottom:1px solid var(--hairline); white-space:nowrap; }
        .table-wrap td { font-size:13px; color:var(--body); padding:10px 14px; border-bottom:1px solid var(--hairline); vertical-align:middle; }
        .table-wrap tr:last-child td { border-bottom:none; }
        .table-wrap tr:hover td { background:var(--canvas); }
        .pill { display:inline-flex; align-items:center; gap:4px; font-size:11px; padding:2px 8px; border-radius:999px; font-weight:500; }
        .pill::before { content:""; width:5px; height:5px; border-radius:50%; }
        .pill-active { background:rgba(0,112,243,0.1); color:var(--success); }
        .pill-active::before { background:var(--success); }
        .pill-pending { background:rgba(245,166,35,0.1); color:var(--warning); }
        .pill-pending::before { background:var(--warning); }
        .pill-info { background:rgba(121,40,202,0.1); color:var(--info); }
        .pill-info::before { background:var(--info); }
        .action-link { font-size:12px; color:var(--primary); cursor:pointer; border:none; background:none; padding:0; }
        .action-link:hover { text-decoration:underline; }
        .di-label { font-family:var(--font-mono); font-size:10px; text-transform:uppercase; letter-spacing:0.04em; color:var(--ash); }
        .fi { width:100%; padding:8px 10px; border:1px solid var(--hairline); border-radius:var(--radius-sm); font-size:13px; outline:none; resize:vertical; font-family:inherit; }
        .fi:focus { border-color:var(--primary); box-shadow:0 0 0 3px var(--primary-bg); }
        .fg { margin-bottom:12px; }
        .label { font-size:12px; font-weight:450; color:var(--body); display:block; margin-bottom:4px; }
        .admin-modal-actions { display:flex; justify-content:flex-end; gap:8px; margin-top:16px; }
        .alert { display:flex; align-items:flex-start; gap:8px; padding:10px 14px; border-radius:var(--radius-sm); font-size:13px; }
        .alert-warn { background:rgba(245,166,35,0.1); border:1px solid rgba(245,166,35,0.2); }
      `}</style>

      <div className="page-h">Products</div>
      <div className="page-sub">Moderate marketplace listings — approve, reject, or flag for review</div>

      <div className="action-bar">
        <div className="search-wrap">
          <SearchIcon size={14} />
          <input placeholder="Search products..." value={search} onChange={(e) => setSearch(e.target.value)} />
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
              <th>Product</th>
              <th>Seller</th>
              <th>Category</th>
              <th>Price</th>
              <th>Stock</th>
              <th>Sales</th>
              <th>Status</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            {filtered.map((p) => (
              <tr key={p.id}>
                <td style={{ fontWeight: 500 }}>{p.name}</td>
                <td>{p.seller}</td>
                <td>{p.category}</td>
                <td style={{ fontWeight: 500 }}>{p.price}</td>
                <td>{p.stock}</td>
                <td>{p.sales}</td>
                <td><span className={`pill ${pStatus[p.status]}`}>{p.status}</span></td>
                <td>
                  {p.status === "active" && <button className="action-link" onClick={() => handleModerate(p)}>Moderate</button>}
                  {p.status === "pending" && <button className="action-link" onClick={() => handleApprove(p)}>Approve</button>}
                  {p.status === "flagged" && <button className="action-link" onClick={() => handleReview(p)}>Review</button>}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
