"use client";

import { useEffect, useState } from "react";
import type { AdminSeller } from "@/lib/types/admin";
import { SearchIcon } from "@/components/user/icons";

export function SellersPage() {
  const [sellers, setSellers] = useState<AdminSeller[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");

  useEffect(() => {
    fetch("/api/admin/sellers")
      .then((r) => r.json())
      .then((d) => { if (Array.isArray(d)) setSellers(d); setLoading(false); })
      .catch(() => setLoading(false));
  }, []);

  const filtered = sellers.filter((s) => {
    if (search && !s.business.toLowerCase().includes(search.toLowerCase())) return false;
    return true;
  });

  if (loading) return <div style={{ textAlign: "center", padding: 48, color: "var(--muted-text)" }}>Loading sellers...</div>;

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
        .di-label { font-family:var(--font-mono); font-size:10px; text-transform:uppercase; letter-spacing:0.04em; color:var(--ash); }
      `}</style>

      <div className="page-h">Sellers</div>
      <div className="page-sub">Sellers active on the platform</div>

      <div className="action-bar">
        <div className="search-wrap">
          <SearchIcon size={14} />
          <input placeholder="Search sellers..." value={search} onChange={(e) => setSearch(e.target.value)} />
        </div>
      </div>

      {filtered.length === 0 ? (
        <div style={{ textAlign: "center", padding: 48, color: "var(--muted-text)" }}>No sellers found</div>
      ) : (
        <div className="table-wrap">
          <table>
            <thead>
              <tr>
                <th>Seller</th>
                <th>Category</th>
                <th>Products</th>
                <th>Revenue</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((s) => (
                <tr key={s.id}>
                  <td style={{ fontWeight: 500 }}>{s.business}</td>
                  <td>{s.category}</td>
                  <td>{s.products}</td>
                  <td style={{ fontWeight: 500 }}>{s.revenue}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
