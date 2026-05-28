"use client";

import { SELLER_BAR_CHART } from "@/lib/data/seller";
import { ChevronIcon } from "@/components/user/icons";

const barMonths = SELLER_BAR_CHART;

export function AnalyticsPage() {
  return (
    <div>
      <style>{`
        .s-page-h { font-size:20px; font-weight:600; color:var(--ink); letter-spacing:-0.03em; margin:0 0 4px; }
        .s-page-sub { font-size:13px; color:var(--muted-text); margin:0 0 20px; }
        .s-mini-stats { display:grid; grid-template-columns:repeat(auto-fit, minmax(150px,1fr)); gap:12px; margin-bottom:20px; }
        .s-mini-stat { background:#fff; border-radius:8px; padding:14px 16px; border:1px solid var(--hairline); box-shadow:0 1px 3px rgba(0,0,0,0.04); text-align:center; }
        .s-mini-stat .val { font-size:20px; font-weight:600; color:var(--ink); }
        .s-mini-stat .lbl { font-size:11px; color:var(--muted-text); margin-top:2px; }
        .s-section-row { display:grid; grid-template-columns:1fr 1fr; gap:12px; margin-bottom:20px; }
        .s-card { background:#fff; border-radius:8px; border:1px solid var(--hairline); box-shadow:0 1px 3px rgba(0,0,0,0.04); }
        .s-card-h { display:flex; align-items:center; justify-content:space-between; padding:12px 16px; border-bottom:1px solid var(--hairline); }
        .s-card-h h3 { font-size:12px; font-weight:600; text-transform:uppercase; letter-spacing:0.04em; color:var(--ink); margin:0; }
        .s-card-b { padding:16px 20px; }
        .s-card-b.p0 { padding:0; }
        .s-bar-chart { display:flex; align-items:flex-end; gap:6px; height:160px; padding:8px 0; }
        .s-bar-col { flex:1; display:flex; flex-direction:column; align-items:center; gap:4px; height:100%; justify-content:flex-end; }
        .s-bar { width:100%; max-width:32px; border-radius:4px 4px 0 0; min-height:4px; background:var(--primary-bg); }
        .s-bar.fill { background:var(--primary); }
        .s-bar-label { font-size:9px; color:var(--ash); }
        .s-mini-table { width:100%; border-collapse:collapse; }
        .s-mini-table td { padding:8px 16px; font-size:13px; color:var(--body); border-bottom:1px solid var(--hairline); }
        .s-mini-table tr:last-child td { border-bottom:none; }
        .s-mini-table .mono { font-family:var(--font-mono); font-size:12px; color:var(--ash); }
        .s-pill { display:inline-flex; align-items:center; gap:4px; font-size:11px; padding:2px 8px; border-radius:999px; font-weight:500; }
        .s-pill::before { content:""; width:5px; height:5px; border-radius:50%; }
        .s-pill-up { background:rgba(0,112,243,0.1); color:var(--success); }
        .s-pill-up::before { background:var(--success); }
        .s-pill-down { background:rgba(238,0,0,0.08); color:var(--danger); }
        .s-pill-down::before { background:var(--danger); }
        .s-growth-item { display:flex; justify-content:space-between; align-items:center; padding:8px 0; border-bottom:1px solid var(--hairline); }
        .s-growth-item:last-child { border-bottom:none; }
        .s-growth-label { font-size:13px; color:var(--body); }
        .s-growth-value { font-size:13px; font-weight:500; }
        .s-growth-change { font-size:11px; margin-left:8px; }
        .s-growth-change.up { color:var(--success); }
        .s-growth-change.down { color:var(--danger); }
        @media (max-width:768px) { .s-section-row { grid-template-columns:1fr; } }
      `}</style>

      <div className="s-page-h">Analytics</div>
      <div className="s-page-sub">Detailed store performance metrics</div>

      <div className="s-mini-stats">
        <div className="s-mini-stat">
          <div className="val">₦3.8M</div>
          <div className="lbl">Annual Revenue</div>
        </div>
        <div className="s-mini-stat">
          <div className="val">2,847</div>
          <div className="lbl">Total Orders</div>
        </div>
        <div className="s-mini-stat">
          <div className="val">₦1,335</div>
          <div className="lbl">Avg Order Value</div>
        </div>
        <div className="s-mini-stat">
          <div className="val">4.8★</div>
          <div className="lbl">Avg Rating</div>
        </div>
      </div>

      <div className="s-section-row">
        <div className="s-card">
          <div className="s-card-h"><h3>Monthly Revenue</h3></div>
          <div className="s-card-b">
            <div className="s-bar-chart">
              {barMonths.map((b) => (
                <div key={b.month} className="s-bar-col">
                  <div className={`s-bar ${b.fill ? "fill" : ""}`} style={{ height: `${b.height}%` }} />
                  <div className="s-bar-label">{b.month}</div>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="s-card">
          <div className="s-card-h"><h3>Growth Trends</h3></div>
          <div className="s-card-b">
            {[
              { label: "Revenue Growth", value: "+12.3%", up: true },
              { label: "Order Volume", value: "+8.1%", up: true },
              { label: "Customer Retention", value: "+5.6%", up: true },
              { label: "Product Returns", value: "-2.1%", up: false },
              { label: "Avg Order Value", value: "+3.8%", up: true },
            ].map((g) => (
              <div key={g.label} className="s-growth-item">
                <span className="s-growth-label">{g.label}</span>
                <div>
                  <span className="s-growth-value">{g.value}</span>
                  <span className={`s-growth-change ${g.up ? "up" : "down"}`}>
                    <ChevronIcon size={10} style={{ transform: g.up ? "rotate(180deg)" : "rotate(0deg)", verticalAlign: "middle" }} />
                    {g.up ? "up" : "down"}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="s-card">
        <div className="s-card-h"><h3>Category Performance</h3></div>
        <div className="s-card-b p0">
          <table className="s-mini-table">
            <thead style={{ visibility: "hidden" }}>
              <tr><td></td><td></td><td></td><td></td></tr>
            </thead>
            <tbody>
              {[
                { cat: "Spices & Seasonings", revenue: "₦1,245,000", orders: 892, growth: "+15.2%" },
                { cat: "Oils & Fats", revenue: "₦876,500", orders: 534, growth: "+8.7%" },
                { cat: "Fish & Meat", revenue: "₦543,200", orders: 312, growth: "+11.3%" },
                { cat: "Vegetables", revenue: "₦421,800", orders: 567, growth: "+6.1%" },
                { cat: "Grains & Rice", revenue: "₦298,000", orders: 234, growth: "+4.5%" },
              ].map((c) => (
                <tr key={c.cat}>
                  <td>{c.cat}</td>
                  <td style={{ fontWeight: 500 }}>{c.revenue}</td>
                  <td style={{ color: "var(--muted-text)" }}>{c.orders} orders</td>
                  <td style={{ textAlign: "right" }}><span className="s-pill s-pill-up">{c.growth}</span></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
