"use client";

import { ADMIN_ANALYTICS_MINI, ADMIN_ANALYTICS_REGIONS, ADMIN_ANALYTICS_CATEGORIES } from "@/lib/data/admin";

export function AnalyticsPage() {
  return (
    <div>
      <style>{`
        .page-h { font-size:20px; font-weight:600; color:var(--ink); letter-spacing:-0.03em; margin:0 0 4px; }
        .page-sub { font-size:13px; color:var(--muted-text); margin:0 0 20px; }
        .mini-grid { display:grid; grid-template-columns:repeat(4,1fr); gap:12px; margin-bottom:20px; }
        .mini-card { background:#fff; border-radius:8px; padding:16px; box-shadow:var(--shadow-card); }
        .mini-label { font-size:12px; color:var(--muted-text); margin:0 0 4px; }
        .mini-value { font-size:18px; font-weight:600; color:var(--ink); letter-spacing:-0.03em; margin:0 0 2px; }
        .mini-delta { font-size:11px; }
        .mini-delta.success { color:var(--success); }
        .section-row { display:grid; grid-template-columns:1fr 1fr; gap:12px; }
        .card { background:#fff; border-radius:8px; box-shadow:var(--shadow-card); }
        .card-h { padding:12px 16px; border-bottom:1px solid var(--hairline); }
        .card-h h3 { font-size:12px; font-weight:600; text-transform:uppercase; letter-spacing:0.04em; color:var(--ink); margin:0; }
        .card-b.p0 { padding:0; }
        .table-wrap { overflow-x:auto; }
        .table-wrap table { width:100%; border-collapse:collapse; }
        .table-wrap th { font-size:12px; font-weight:500; color:var(--muted-text); padding:10px 14px; text-align:left; border-bottom:1px solid var(--hairline); white-space:nowrap; }
        .table-wrap td { font-size:13px; color:var(--body); padding:10px 14px; border-bottom:1px solid var(--hairline); }
        .table-wrap tr:last-child td { border-bottom:none; }
        .mono { font-family:var(--font-mono); font-size:11px; color:var(--ash); }
        .bar-mini { height:4px; background:var(--surface-soft); border-radius:4px; overflow:hidden; margin-top:4px; }
        .bar-mini-fill { height:100%; border-radius:4px; background:var(--primary); }
        @media (max-width:768px) { .mini-grid { grid-template-columns:1fr 1fr; } .section-row { grid-template-columns:1fr; } }
        @media (max-width:480px) { .mini-grid { grid-template-columns:1fr; } }
      `}</style>

      <div className="page-h">Analytics</div>
      <div className="page-sub">Platform metrics and performance trends</div>

      <div className="mini-grid">
        {ADMIN_ANALYTICS_MINI.map((m) => (
          <div key={m.label} className="mini-card">
            <div className="mini-label">{m.label}</div>
            <div className="mini-value">{m.value}</div>
            <div className={`mini-delta ${m.color === "var(--success)" ? "success" : ""}`} style={m.deltaUp && m.color !== "var(--success)" ? { color: "var(--body)" } : undefined}>{m.delta}</div>
          </div>
        ))}
      </div>

      <div className="section-row">
        <div className="card">
          <div className="card-h"><h3>Orders by Region</h3></div>
          <div className="card-b p0">
            <div className="table-wrap">
              <table>
                <thead>
                  <tr>
                    <th>Region</th>
                    <th>Orders</th>
                    <th>Revenue</th>
                    <th>%</th>
                  </tr>
                </thead>
                <tbody>
                  {ADMIN_ANALYTICS_REGIONS.map((r) => (
                    <tr key={r.region}>
                      <td>{r.region}</td>
                      <td>{r.orders.toLocaleString()}</td>
                      <td style={{ fontWeight: 500 }}>{r.revenue}</td>
                      <td>
                        <span className="mono">{r.pct}%</span>
                        <div className="bar-mini">
                          <div className="bar-mini-fill" style={{ width: `${r.pct}%` }} />
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>

        <div className="card">
          <div className="card-h"><h3>Top Categories</h3></div>
          <div className="card-b p0">
            <div className="table-wrap">
              <table>
                <thead>
                  <tr>
                    <th>Category</th>
                    <th>Orders</th>
                    <th>Revenue</th>
                  </tr>
                </thead>
                <tbody>
                  {ADMIN_ANALYTICS_CATEGORIES.map((c) => (
                    <tr key={c.category}>
                      <td>{c.category}</td>
                      <td>{c.orders.toLocaleString()}</td>
                      <td style={{ fontWeight: 500 }}>{c.revenue}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
