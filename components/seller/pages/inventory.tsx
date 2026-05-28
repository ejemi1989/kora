"use client";

import { useState } from "react";
import { useSeller } from "@/components/seller/seller-context";
import { SELLER_INVENTORY } from "@/lib/data/seller";
import { SearchIcon } from "@/components/user/icons";

const statusStyles: Record<string, string> = {
  ok: "s-badge-ok",
  low: "s-badge-low",
  critical: "s-badge-critical",
};

export function InventoryPage() {
  const { showToast } = useSeller();
  const [items, setItems] = useState(SELLER_INVENTORY);
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState<"all" | "ok" | "low" | "critical">("all");

  const filtered = items.filter((i) => {
    const matchSearch = i.name.toLowerCase().includes(search.toLowerCase());
    const matchFilter = filter === "all" || i.status === filter;
    return matchSearch && matchFilter;
  });

  function handleRestock(id: number) {
    const val = prompt("Restock quantity:", "10");
    if (val && !isNaN(Number(val)) && parseInt(val) > 0) {
      const qty = parseInt(val);
      setItems((prev) =>
        prev.map((i) =>
          i.id === id
            ? {
                ...i,
                stock: i.stock + qty,
                available: i.available + qty,
                status: i.stock + qty >= i.threshold ? "ok" : i.status,
              }
            : i
        )
      );
      showToast(`Restocked ${qty} units`, "success");
    }
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
        .s-filter-chips { display:flex; gap:6px; flex-wrap:wrap; }
        .s-chip { padding:4px 12px; border-radius:999px; font-size:11px; font-weight:500; border:1px solid var(--hairline); background:#fff; color:var(--body); cursor:pointer; transition:all 150ms; }
        .s-chip:hover { border-color:var(--primary); color:var(--primary); }
        .s-chip.active { background:var(--primary); border-color:var(--primary); color:#fff; }
        .s-badge { display:inline-block; padding:2px 8px; border-radius:999px; font-size:10px; font-weight:500; text-transform:uppercase; }
        .s-badge-ok { background:rgba(0,112,243,0.1); color:var(--success); }
        .s-badge-low { background:rgba(245,166,35,0.1); color:var(--warning); }
        .s-badge-critical { background:rgba(238,0,0,0.08); color:var(--danger); }
        .s-table-wrap { overflow-x:auto; background:#fff; border-radius:8px; border:1px solid var(--hairline); box-shadow:0 1px 3px rgba(0,0,0,0.04); }
        .s-table { width:100%; border-collapse:collapse; font-size:13px; }
        .s-table th { text-align:left; padding:10px 14px; font-size:11px; font-weight:600; color:var(--ash); text-transform:uppercase; letter-spacing:0.04em; border-bottom:1px solid var(--hairline); background:var(--canvas); }
        .s-table td { padding:10px 14px; border-bottom:1px solid var(--hairline); color:var(--body); }
        .s-table tr:last-child td { border-bottom:none; }
        .s-btn { display:inline-flex; align-items:center; gap:6px; padding:5px 10px; border-radius:var(--radius-sm); font-size:11px; font-weight:500; cursor:pointer; border:none; transition:all 150ms; }
        .s-btn-s { background:#fff; color:var(--body); border:1px solid var(--hairline); }
        .s-btn-s:hover { background:var(--surface-soft); }
        .s-btn-p { background:var(--primary); color:#fff; }
        .s-btn-p:hover { background:var(--primary-deep); }
        @media (max-width:768px) { .s-search-wrap { width:100%; } }
      `}</style>

      <div className="s-page-h">Inventory</div>
      <div className="s-page-sub">Track stock levels and manage inventory</div>

      <div className="s-action-bar">
        <div className="s-search-wrap">
          <SearchIcon size={14} />
          <input placeholder="Search inventory..." value={search} onChange={(e) => setSearch(e.target.value)} />
        </div>
        <div className="s-filter-chips">
          {(["all", "ok", "low", "critical"] as const).map((f) => (
            <button key={f} className={`s-chip ${filter === f ? "active" : ""}`} onClick={() => setFilter(f)}>
              {f.charAt(0).toUpperCase() + f.slice(1)}
            </button>
          ))}
        </div>
      </div>

      <div className="s-table-wrap">
        <table className="s-table">
          <thead>
            <tr>
              <th>Product</th>
              <th>Category</th>
              <th>In Stock</th>
              <th>Available</th>
              <th>Threshold</th>
              <th>Status</th>
              <th></th>
            </tr>
          </thead>
          <tbody>
            {filtered.map((i) => (
              <tr key={i.id}>
                <td><span style={{ marginRight: 6 }}>{i.emoji}</span>{i.name}</td>
                <td style={{ color: "var(--muted-text)" }}>{i.category}</td>
                <td style={{ fontWeight: 500 }}>{i.stock}</td>
                <td>{i.available}</td>
                <td>{i.threshold}</td>
                <td><span className={`s-badge ${statusStyles[i.status]}`}>{i.status}</span></td>
                <td>
                  <button className="s-btn s-btn-s" onClick={() => handleRestock(i.id)}>Restock</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
