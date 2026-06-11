"use client";

import { useEffect, useState } from "react";
import { useUser } from "@clerk/nextjs";
import { useSeller } from "@/components/seller/seller-context";
import { useRouter } from "next/navigation";
import { ChevronIcon } from "@/components/user/icons";

interface Stat {
  label: string; value: string; delta: string; deltaUp: boolean;
}

interface RecentOrder {
  id: string; customer: string; items: number; product: string;
  total: number; date: string; status: string;
}

interface BarItem {
  month: string; revenue: number; orders: number; fill: boolean; height: number;
}

interface TopProduct {
  name: string; sales: string;
}

interface OverviewData {
  stats: Stat[];
  recentOrders: RecentOrder[];
  barChart: BarItem[];
  topProducts: TopProduct[];
}

const orderPills: Record<string, string> = {
  delivered: "pill-success",
  shipped: "pill-warning",
  processing: "pill-info",
  pending: "pill-pending",
  cancelled: "pill-danger",
};

export function OverviewPage() {
  const { setPage } = useSeller();
  const { isSignedIn } = useUser();
  const router = useRouter();
  const [data, setData] = useState<OverviewData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!isSignedIn) return;
    fetch("/api/seller/overview")
      .then((r) => r.json())
      .then((d) => {
        if (d && d.success === false) {
          setError(d.error || "Failed to load overview");
        } else if (d && typeof d === 'object' && d.stats) {
          setData(d);
        } else {
          setError("Invalid response from server");
        }
        setLoading(false);
      })
      .catch((err) => {
        setError(err.message || "Failed to load overview");
        setLoading(false);
      });
  }, [isSignedIn]);

  function navTo(id: string) {
    setPage(id as any);
    router.push(`/seller/${id}`);
  }

  if (loading) {
    return <div style={{ padding: 40, textAlign: "center", color: "var(--muted-text)" }}>Loading...</div>;
  }

  if (error) {
    return (
      <div style={{ padding: 40, textAlign: "center" }}>
        <div style={{ color: "var(--danger)", marginBottom: 12 }}>{error}</div>
        <button
          onClick={() => window.location.reload()}
          style={{
            padding: "8px 16px",
            borderRadius: "var(--radius-sm)",
            border: "1px solid var(--hairline)",
            background: "var(--surface-card)",
            cursor: "pointer",
            fontSize: 13,
          }}
        >
          Reload
        </button>
      </div>
    );
  }

  const stats = data?.stats ?? [];
  const recentOrders = data?.recentOrders ?? [];
  const barChart = data?.barChart ?? [];
  const topProducts = data?.topProducts ?? [];

  return (
    <div>
      <style>{`
        .s-page-h { font-size:20px; font-weight:600; color:var(--ink); letter-spacing:-0.03em; margin:0 0 4px; }
        .s-page-sub { font-size:13px; color:var(--muted-text); margin:0 0 20px; }
        .s-stats-grid { display:grid; grid-template-columns:repeat(auto-fit, minmax(180px,1fr)); gap:12px; margin-bottom:20px; }
        .s-stat-card { background:#fff; border-radius:8px; padding:16px; border:1px solid var(--hairline); box-shadow:0 1px 3px rgba(0,0,0,0.04); }
        .s-stat-label { font-size:12px; color:var(--muted-text); margin:0 0 4px; }
        .s-stat-value { font-size:22px; font-weight:600; color:var(--ink); letter-spacing:-0.03em; margin:0; }
        .s-stat-delta { font-size:11px; margin-top:4px; }
        .s-stat-delta.up { color:var(--success); }
        .s-stat-delta.down { color:var(--danger); }
        .s-section-row { display:grid; grid-template-columns:1fr 1fr; gap:12px; margin-bottom:20px; }
        .s-card { background:#fff; border-radius:8px; border:1px solid var(--hairline); box-shadow:0 1px 3px rgba(0,0,0,0.04); }
        .s-card-h { display:flex; align-items:center; justify-content:space-between; padding:12px 16px; border-bottom:1px solid var(--hairline); }
        .s-card-h h3 { font-size:12px; font-weight:600; text-transform:uppercase; letter-spacing:0.04em; color:var(--ink); margin:0; }
        .s-card-link { font-size:12px; color:var(--primary); cursor:pointer; border:none; background:none; padding:0; }
        .s-card-link:hover { text-decoration:underline; }
        .s-card-b { padding:16px 20px; }
        .s-card-b.p0 { padding:0; }
        .s-bar-chart { display:flex; align-items:flex-end; gap:6px; height:100px; padding:4px 0; }
        .s-bar-col { flex:1; display:flex; flex-direction:column; align-items:center; gap:2px; height:100%; justify-content:flex-end; }
        .s-bar { width:100%; max-width:28px; border-radius:4px 4px 0 0; min-height:4px; background:var(--primary-bg); }
        .s-bar.fill { background:var(--primary); }
        .s-bar-label { font-size:8px; color:var(--ash); }
        .s-mini-table { width:100%; border-collapse:collapse; }
        .s-mini-table td { padding:8px 16px; font-size:13px; color:var(--body); border-bottom:1px solid var(--hairline); }
        .s-mini-table tr:last-child td { border-bottom:none; }
        .s-mini-table .mono { font-family:var(--font-mono); font-size:12px; color:var(--ash); }
        .s-pill { display:inline-flex; align-items:center; gap:4px; font-size:11px; padding:2px 8px; border-radius:999px; font-weight:500; }
        .s-pill::before { content:""; width:5px; height:5px; border-radius:50%; }
        .s-pill-success { background:rgba(0,112,243,0.1); color:var(--success); }
        .s-pill-success::before { background:var(--success); }
        .s-pill-warning { background:rgba(245,166,35,0.1); color:var(--warning); }
        .s-pill-warning::before { background:var(--warning); }
        .s-pill-info { background:rgba(121,40,202,0.1); color:var(--info); }
        .s-pill-info::before { background:var(--info); }
        .s-pill-pending { background:var(--surface-soft); color:var(--muted-text); }
        .s-pill-pending::before { background:var(--muted-text); }
        .s-pill-danger { background:rgba(238,0,0,0.08); color:var(--danger); }
        .s-pill-danger::before { background:var(--danger); }
        .s-widget-grid { display:grid; grid-template-columns:1fr 1fr; gap:12px; }
        .s-quick-action { display:flex; align-items:center; gap:10px; padding:10px 0; }
        .s-quick-action:not(:last-child) { border-bottom:1px solid var(--hairline); }
        .s-qa-icon { width:32px; height:32px; border-radius:6px; background:var(--primary-bg); color:var(--primary); display:flex; align-items:center; justify-content:center; font-size:14px; }
        .s-qa-text { flex:1; }
        .s-qa-title { font-size:13px; font-weight:500; color:var(--ink); }
        .s-qa-sub { font-size:11px; color:var(--muted-text); }
        .s-qa-action { font-size:12px; color:var(--primary); cursor:pointer; border:none; background:none; }
        .s-qa-action:hover { text-decoration:underline; }
        @media (max-width:768px) { .s-section-row { grid-template-columns:1fr; } .s-widget-grid { grid-template-columns:1fr; } }
      `}</style>

      <div className="s-page-h">Overview</div>
      <div className="s-page-sub">Welcome back! Here&apos;s what&apos;s happening with your store.</div>

      <div className="s-stats-grid">
        {stats.map((stat) => (
          <div key={stat.label} className="s-stat-card">
            <div className="s-stat-label">{stat.label}</div>
            <div className="s-stat-value">{stat.value}</div>
            <div className={`s-stat-delta ${stat.deltaUp ? "up" : "down"}`}>{stat.delta}</div>
          </div>
        ))}
      </div>

      <div className="s-section-row">
        <div className="s-card">
          <div className="s-card-h"><h3>Revenue (12 months)</h3></div>
          <div className="s-card-b">
            <div className="s-bar-chart">
              {barChart.map((b) => (
                <div key={b.month} className="s-bar-col">
                  <div className={`s-bar ${b.fill ? "fill" : ""}`} style={{ height: `${b.height}%` }} />
                  <div className="s-bar-label">{b.month}</div>
                </div>
              ))}
            </div>
            <button className="s-card-link" onClick={() => navTo("analytics")}>View details<ChevronIcon size={12} style={{ marginLeft: 2 }} /></button>
          </div>
        </div>

        <div className="s-card">
          <div className="s-card-h"><h3>Recent Orders</h3></div>
          <div className="s-card-b p0">
            <table className="s-mini-table">
              <tbody>
                {recentOrders.map((o) => (
                  <tr key={o.id}>
                    <td><span className="mono">{o.id}</span></td>
                    <td>{o.customer}</td>
                    <td><span className={`s-pill ${orderPills[o.status]}`}>{o.status}</span></td>
                    <td style={{ textAlign: "right", fontWeight: 500 }}>₦{o.total.toLocaleString()}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <div style={{ padding: "8px 16px", borderTop: "1px solid var(--hairline)" }}>
            <button className="s-card-link" onClick={() => navTo("orders")}>View all<ChevronIcon size={12} style={{ marginLeft: 2 }} /></button>
          </div>
        </div>
      </div>

      <div className="s-widget-grid">
        <div className="s-card">
          <div className="s-card-h"><h3>Quick Actions</h3></div>
          <div className="s-card-b">
            <div className="s-quick-action">
              <div className="s-qa-icon">+</div>
              <div className="s-qa-text">
                <div className="s-qa-title">Add New Product</div>
                <div className="s-qa-sub">List a new item in your catalogue</div>
              </div>
              <button className="s-qa-action" onClick={() => navTo("products")}>Go</button>
            </div>
            <div className="s-quick-action">
              <div className="s-qa-icon">📦</div>
              <div className="s-qa-text">
                <div className="s-qa-title">Process Orders</div>
                <div className="s-qa-sub">3 orders need attention</div>
              </div>
              <button className="s-qa-action" onClick={() => navTo("orders")}>Go</button>
            </div>
            <div className="s-quick-action">
              <div className="s-qa-icon">📊</div>
              <div className="s-qa-text">
                <div className="s-qa-title">View Analytics</div>
                <div className="s-qa-sub">Check your store performance</div>
              </div>
              <button className="s-qa-action" onClick={() => navTo("analytics")}>Go</button>
            </div>
          </div>
        </div>

        <div className="s-card">
          <div className="s-card-h"><h3>Top Products</h3></div>
          <div className="s-card-b p0">
            <table className="s-mini-table">
              <thead style={{ visibility: "hidden" }}>
                <tr><td></td><td></td><td></td></tr>
              </thead>
              <tbody>
                {topProducts.map((p) => (
                  <tr key={p.name}>
                    <td>{p.name}</td>
                    <td style={{ color: "var(--muted-text)" }}>{p.sales}</td>
                    <td style={{ textAlign: "right" }}>
                      <span className="s-pill s-pill-success">Best seller</span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}
