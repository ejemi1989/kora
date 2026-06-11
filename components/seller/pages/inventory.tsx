"use client";

import { useEffect, useState } from "react";
import { useUser } from "@clerk/nextjs";
import { useSeller } from "@/components/seller/seller-context";
import { SearchIcon } from "@/components/user/icons";

interface InventoryItem {
  id: string;
  name: string;
  emoji: string;
  category: string;
  stock: number;
  available: number;
  threshold: number;
  status: "ok" | "low" | "critical";
}

const statusStyles: Record<string, string> = {
  ok: "s-badge-ok",
  low: "s-badge-low",
  critical: "s-badge-critical",
};

export function InventoryPage() {
  const { showToast } = useSeller();
  const { isSignedIn } = useUser();
  const [items, setItems] = useState<InventoryItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState<"all" | "ok" | "low" | "critical">("all");

  useEffect(() => {
    if (!isSignedIn) return;
    fetch("/api/seller/inventory")
      .then((r) => r.json())
      .then((d) => {
        if (d && d.success === false) {
          setError(d.error || "Failed to load inventory");
        } else if (Array.isArray(d)) {
          setItems(d);
        } else {
          setError("Invalid response from server");
        }
        setLoading(false);
      })
      .catch((err) => {
        setError(err.message || "Failed to load inventory");
        setLoading(false);
      });
  }, [isSignedIn]);

  const filtered = items.filter((i) => {
    const matchSearch = i.name.toLowerCase().includes(search.toLowerCase());
    const matchFilter = filter === "all" || i.status === filter;
    return matchSearch && matchFilter;
  });

  async function handleRestock(id: string) {
    const val = prompt("Restock quantity:", "10");
    if (val && !isNaN(Number(val)) && parseInt(val) > 0) {
      const qty = parseInt(val);
      const res = await fetch("/api/seller/inventory", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ productId: id, quantity: qty }),
      });
      if (res.ok) {
        const updated = await res.json();
        setItems((prev) =>
          prev.map((i) =>
            i.id === id
              ? {
                  ...i,
                  stock: updated.stock,
                  available: updated.stock,
                  status: updated.stock >= i.threshold ? "ok" : updated.stock <= 0 ? "critical" : "low",
                }
              : i
          )
        );
        showToast(`Restocked ${qty} units`, "success");
      }
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
            {loading ? (
              <tr><td colSpan={7} style={{ textAlign: "center", padding: 24, color: "var(--muted-text)" }}>Loading inventory...</td></tr>
            ) : error ? (
              <tr><td colSpan={7} style={{ textAlign: "center", padding: 24 }}>
                <div style={{ color: "var(--danger)", marginBottom: 12 }}>{error}</div>
                <button onClick={() => window.location.reload()} style={{ padding: "8px 16px", borderRadius: "var(--radius-sm)", border: "1px solid var(--hairline)", background: "var(--surface-card)", cursor: "pointer", fontSize: 13 }}>Reload</button>
              </td></tr>
            ) : filtered.length === 0 ? (
              <tr><td colSpan={7} style={{ textAlign: "center", padding: 24, color: "var(--muted-text)" }}>No inventory items found</td></tr>
            ) : filtered.map((i) => (
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
