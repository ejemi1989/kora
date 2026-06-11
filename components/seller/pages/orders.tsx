"use client";

import { useEffect, useState } from "react";
import { useUser } from "@clerk/nextjs";
import { useSeller } from "@/components/seller/seller-context";
import { SearchIcon } from "@/components/user/icons";

interface Order {
  id: string;
  customer: string;
  items: number;
  product: string;
  total: number;
  date: string;
  status: string;
  trackingNumber: string | null;
}

const filterLabels = ["all", "pending", "processing", "shipped", "delivered", "cancelled"] as const;

const badgeClass: Record<string, string> = {
  pending: "s-badge-pending",
  processing: "s-badge-info",
  shipped: "s-badge-warning",
  delivered: "s-badge-success",
  cancelled: "s-badge-danger",
};

export function OrdersPage() {
  const { showToast } = useSeller();
  const { isSignedIn } = useUser();
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<typeof filterLabels[number]>("all");
  const [search, setSearch] = useState("");

  useEffect(() => {
    if (!isSignedIn) return;
    fetch("/api/seller/orders")
      .then((r) => r.json())
      .then((d) => { if (Array.isArray(d)) setOrders(d); setLoading(false); })
      .catch(() => setLoading(false));
  }, [isSignedIn]);

  const filtered = orders.filter((o) => {
    const matchFilter = filter === "all" || o.status === filter;
    const matchSearch = o.id.includes(search) || o.customer.toLowerCase().includes(search.toLowerCase());
    return matchFilter && matchSearch;
  });

  async function updateStatus(id: string, status: string) {
    await fetch("/api/seller/orders", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ orderId: id, status }),
    });
    setOrders((prev) => prev.map((o) => (o.id === id ? { ...o, status } : o)));
    showToast(`Order ${id} updated to ${status}`, "success");
  }

  async function updateTracking(id: string, tracking: string) {
    await fetch("/api/seller/orders", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ orderId: id, trackingNumber: tracking }),
    });
    setOrders((prev) => prev.map((o) => (o.id === id ? { ...o, trackingNumber: tracking || null } : o)));
    showToast(`Tracking number added to ${id}`, "success");
  }

  function TrackingCell({ order, onUpdate }: { order: Order; onUpdate: (id: string, v: string) => void }) {
    const [editing, setEditing] = useState(false);
    const [val, setVal] = useState(order.trackingNumber || "");

    if (order.trackingNumber && !editing) {
      return (
        <div style={{ display: "flex", alignItems: "center", gap: 4 }}>
          <span className="mono" style={{ fontSize: 10 }}>{order.trackingNumber}</span>
          <button className="s-track-set" onClick={() => { setEditing(true); setVal(order.trackingNumber || ""); }}>Edit</button>
        </div>
      );
    }

    return (
      <div style={{ display: "flex", alignItems: "center", gap: 4 }}>
        <input
          className="s-track-input"
          placeholder="Add..."
          value={val}
          onChange={(e) => setVal(e.target.value)}
          onKeyDown={(e) => { if (e.key === "Enter") { onUpdate(order.id, val); setEditing(false); } }}
        />
        <button className="s-track-set" onClick={() => { onUpdate(order.id, val); setEditing(false); }}>Set</button>
      </div>
    );
  }

  if (loading) {
    return (
      <div>
        <style>{` .s-page-h { font-size:20px; font-weight:600; color:var(--ink); letter-spacing:-0.03em; margin:0 0 4px; } .s-page-sub { font-size:13px; color:var(--muted-text); margin:0 0 20px; }`}</style>
        <div style={{ padding: 40, textAlign: "center", color: "var(--muted-text)" }}>Loading...</div>
      </div>
    );
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
        .s-badge-pending { background:var(--surface-soft); color:var(--muted-text); }
        .s-badge-info { background:rgba(121,40,202,0.1); color:var(--info); }
        .s-badge-warning { background:rgba(245,166,35,0.1); color:var(--warning); }
        .s-badge-success { background:rgba(0,112,243,0.1); color:var(--success); }
        .s-badge-danger { background:rgba(238,0,0,0.08); color:var(--danger); }
        .s-table-wrap { overflow-x:auto; background:#fff; border-radius:8px; border:1px solid var(--hairline); box-shadow:0 1px 3px rgba(0,0,0,0.04); }
        .s-table { width:100%; border-collapse:collapse; font-size:13px; }
        .s-table th { text-align:left; padding:10px 14px; font-size:11px; font-weight:600; color:var(--ash); text-transform:uppercase; letter-spacing:0.04em; border-bottom:1px solid var(--hairline); background:var(--canvas); }
        .s-table td { padding:10px 14px; border-bottom:1px solid var(--hairline); color:var(--body); }
        .s-table tr:last-child td { border-bottom:none; }
        .s-table .mono { font-family:var(--font-mono); font-size:12px; color:var(--ash); }
        .s-status-select { padding:3px 6px; border:1px solid var(--hairline); border-radius:4px; font-size:11px; background:#fff; cursor:pointer; outline:none; }
        .s-status-select:focus { border-color:var(--primary); }
        .s-track-input { width:90px; padding:3px 6px; border:1px solid var(--hairline); border-radius:4px; font-size:10px; font-family:var(--font-mono); background:#fff; outline:none; }
        .s-track-input:focus { border-color:var(--primary); box-shadow:0 0 0 2px var(--primary-bg); }
        .s-track-set { font-size:10px; color:var(--primary); cursor:pointer; border:none; background:none; padding:2px 4px; font-weight:500; }
        .s-track-set:hover { text-decoration:underline; }
        @media (max-width:768px) { .s-search-wrap { width:100%; } }
      `}</style>

      <div className="s-page-h">Orders</div>
      <div className="s-page-sub">View and manage incoming orders</div>

      <div className="s-action-bar">
        <div className="s-search-wrap">
          <SearchIcon size={14} />
          <input placeholder="Search by ID or customer..." value={search} onChange={(e) => setSearch(e.target.value)} />
        </div>
        <div className="s-filter-chips">
          {filterLabels.map((f) => (
            <button key={f} className={`s-chip ${filter === f ? "active" : ""}`} onClick={() => setFilter(f)}>
              {f === "all" ? "All" : f.charAt(0).toUpperCase() + f.slice(1)}
            </button>
          ))}
        </div>
      </div>

      <div className="s-table-wrap">
        <table className="s-table">
          <thead>
            <tr>
              <th>Order</th>
              <th>Customer</th>
              <th>Items</th>
              <th>Product</th>
              <th>Total</th>
              <th>Date</th>
              <th>Tracking</th>
              <th>Status</th>
              <th></th>
            </tr>
          </thead>
          <tbody>
            {filtered.map((o) => (
              <tr key={o.id}>
                <td><span className="mono">{o.id}</span></td>
                <td>{o.customer}</td>
                <td>{o.items}</td>
                <td style={{ color: "var(--muted-text)" }}>{o.product}</td>
                <td style={{ fontWeight: 500 }}>₦{o.total.toLocaleString()}</td>
                <td style={{ color: "var(--muted-text)" }}>{o.date}</td>
                <td>
                  <TrackingCell order={o} onUpdate={updateTracking} />
                </td>
                <td><span className={`s-badge ${badgeClass[o.status]}`}>{o.status}</span></td>
                <td>
                  <select
                    className="s-status-select"
                    value={o.status}
                    onChange={(e) => updateStatus(o.id, e.target.value)}
                  >
                    {["pending", "processing", "shipped", "delivered", "cancelled"].map((s) => (
                      <option key={s} value={s}>{s.charAt(0).toUpperCase() + s.slice(1)}</option>
                    ))}
                  </select>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
