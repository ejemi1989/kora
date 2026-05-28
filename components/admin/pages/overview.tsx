"use client";

import { useAdmin } from "@/components/admin/admin-context";
import { useRouter } from "next/navigation";
import {
  ADMIN_BAR_CHART, ADMIN_OVERVIEW_ORDERS, ADMIN_TOP_SELLERS, ADMIN_PLATFORM_HEALTH,
  ADMIN_PANEL_LABELS,
} from "@/lib/data/admin";
import { ChevronIcon } from "@/components/user/icons";

const pillClass: Record<string, string> = {
  shipped: "pill-active",
  pending: "pill-pending",
  confirmed: "pill-info",
  delivered: "pill-success",
  cancelled: "pill-danger",
};

export function OverviewPage() {
  const { setPage } = useAdmin();
  const router = useRouter();

  function navTo(id: string) {
    setPage(id as any);
    router.push(`/admin/${id}`);
  }

  return (
    <div>
      <style>{`
        .page-h { font-size:20px; font-weight:600; color:var(--ink); letter-spacing:-0.03em; margin:0 0 4px; }
        .page-sub { font-size:13px; color:var(--muted-text); margin:0 0 20px; }
        .stats-grid { display:grid; grid-template-columns:repeat(auto-fit, minmax(180px,1fr)); gap:12px; margin-bottom:20px; }
        .stat-card { background:#fff; border-radius:8px; padding:16px; box-shadow:var(--shadow-card); }
        .stat-label { font-size:12px; color:var(--muted-text); margin:0 0 4px; }
        .stat-value { font-size:22px; font-weight:600; color:var(--ink); letter-spacing:-0.03em; margin:0; }
        .stat-delta { font-size:11px; margin-top:4px; }
        .stat-delta.up { color:var(--success); }
        .stat-delta.down { color:var(--danger); }
        .section-row { display:grid; grid-template-columns:1fr 1fr; gap:12px; margin-bottom:20px; }
        .card { background:#fff; border-radius:8px; box-shadow:var(--shadow-card); }
        .card-h { display:flex; align-items:center; justify-content:space-between; padding:12px 16px; border-bottom:1px solid var(--hairline); }
        .card-h h3 { font-size:12px; font-weight:600; text-transform:uppercase; letter-spacing:0.04em; color:var(--ink); margin:0; }
        .card-link { font-size:12px; color:var(--primary); cursor:pointer; border:none; background:none; padding:0; }
        .card-link:hover { text-decoration:underline; }
        .card-b { padding:16px 20px; }
        .card-b.p0 { padding:0; }
        .bar-chart { display:flex; align-items:flex-end; gap:8px; height:120px; padding:8px 0; }
        .bar-col { flex:1; display:flex; flex-direction:column; align-items:center; gap:4px; height:100%; justify-content:flex-end; }
        .bar { width:100%; max-width:32px; border-radius:4px 4px 0 0; min-height:4px; background:var(--primary-bg); }
        .bar.fill { background:var(--primary); }
        .bar-label { font-size:9px; color:var(--ash); }
        .mini-table { width:100%; border-collapse:collapse; }
        .mini-table td { padding:8px 16px; font-size:13px; color:var(--body); border-bottom:1px solid var(--hairline); }
        .mini-table tr:last-child td { border-bottom:none; }
        .mini-table .mono { font-family:var(--font-mono); font-size:12px; color:var(--ash); }
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
        .widget-grid { display:grid; grid-template-columns:1fr 1fr; gap:12px; }
        .health-item { display:flex; align-items:center; gap:10px; margin-bottom:12px; }
        .health-item:last-child { margin-bottom:0; }
        .health-label { flex:1; font-size:12px; color:var(--body); }
        .health-value { font-size:12px; font-weight:500; min-width:48px; text-align:right; }
        .progress-bar { height:4px; background:var(--surface-soft); border-radius:4px; overflow:hidden; }
        .progress-fill { height:100%; border-radius:4px; transition:width 800ms ease; }
        @media (max-width:768px) { .section-row { grid-template-columns:1fr; } .widget-grid { grid-template-columns:1fr; } }
      `}</style>

      <div className="page-h">Overview</div>
      <div className="page-sub">Platform dashboard — monitor activity, revenue, and growth</div>

      <div className="stats-grid">
        <div className="stat-card">
          <div className="stat-label">Total Users</div>
          <div className="stat-value">14,283</div>
          <div className="stat-delta up">↑ +12.4% this month</div>
        </div>
        <div className="stat-card">
          <div className="stat-label">Revenue (30d)</div>
          <div className="stat-value">KES 4.8M</div>
          <div className="stat-delta up">↑ +8.2% this month</div>
        </div>
        <div className="stat-card">
          <div className="stat-label">Orders (30d)</div>
          <div className="stat-value">2,847</div>
          <div className="stat-delta up">↑ +15.6% this month</div>
        </div>
        <div className="stat-card">
          <div className="stat-label">Active Sellers</div>
          <div className="stat-value">312</div>
          <div className="stat-delta down">↓ -2.1% this month</div>
        </div>
      </div>

      <div className="section-row">
        <div className="card">
          <div className="card-h"><h3>Revenue Trend</h3></div>
          <div className="card-b">
            <div className="bar-chart">
              {ADMIN_BAR_CHART.map((b) => (
                <div key={b.month} className="bar-col">
                  <div className={`bar ${b.fill ? "fill" : ""}`} style={{ height: `${b.height}%` }} />
                  <div className="bar-label">{b.month}</div>
                </div>
              ))}
            </div>
            <button className="card-link" onClick={() => navTo("analytics")}>View details<ChevronIcon size={12} style={{ marginLeft: 2 }} /></button>
          </div>
        </div>

        <div className="card">
          <div className="card-h"><h3>Recent Orders</h3></div>
          <div className="card-b p0">
            <table className="mini-table">
              <tbody>
                {ADMIN_OVERVIEW_ORDERS.map((o) => (
                  <tr key={o.id}>
                    <td><span className="mono">{o.id}</span></td>
                    <td>{o.customer}</td>
                    <td><span className={`pill ${pillClass[o.status]}`}>{o.status}</span></td>
                    <td style={{ textAlign: "right", fontWeight: 500 }}>{o.amount}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <div style={{ padding: "8px 16px", borderTop: "1px solid var(--hairline)" }}>
            <button className="card-link" onClick={() => navTo("orders")}>View all<ChevronIcon size={12} style={{ marginLeft: 2 }} /></button>
          </div>
        </div>
      </div>

      <div className="widget-grid">
        <div className="card">
          <div className="card-h"><h3>Top Sellers</h3></div>
          <div className="card-b p0">
            <table className="mini-table">
              <thead style={{ visibility: "hidden" }}>
                <tr><td></td><td></td><td></td></tr>
              </thead>
              <tbody>
                {ADMIN_TOP_SELLERS.map((s) => (
                  <tr key={s.seller}>
                    <td>{s.seller}</td>
                    <td style={{ fontWeight: 500 }}>{s.revenue}</td>
                    <td style={{ textAlign: "right", color: "var(--muted-text)" }}>{s.orders} orders</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        <div className="card">
          <div className="card-h"><h3>Platform Health</h3></div>
          <div className="card-b">
            {ADMIN_PLATFORM_HEALTH.map((h) => (
              <div key={h.metric} className="health-item">
                <span className="health-label">{h.metric}</span>
                <div className="progress-bar" style={{ flex: 1 }}>
                  <div className="progress-fill" style={{ width: `${Math.max(h.bar, 4)}%`, background: h.color }} />
                </div>
                <span className="health-value">{h.value}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
