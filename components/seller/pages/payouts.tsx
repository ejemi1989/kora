"use client";

import { useEffect, useState } from "react";
import { useUser } from "@clerk/nextjs";
import { useSeller } from "@/components/seller/seller-context";

interface PayoutEntry {
  id: string;
  amount: number;
  status: string;
  date: string;
}

interface PayoutData {
  totalEarnings: number;
  available: number;
  pendingClearance: number;
  thisMonth: number;
  payoutHistory: PayoutEntry[];
}

const payoutBadges: Record<string, string> = {
  completed: "s-badge-success",
  pending: "s-badge-pending",
  processing: "s-badge-info",
};

export function PayoutsPage() {
  const { showToast } = useSeller();
  const { isSignedIn } = useUser();
  const [data, setData] = useState<PayoutData | null>(null);
  const [loading, setLoading] = useState(true);
  const [withdrawAmt, setWithdrawAmt] = useState("");

  useEffect(() => {
    if (!isSignedIn) return;
    fetch("/api/seller/payouts")
      .then((r) => r.json())
      .then((d) => { if (d && typeof d === 'object') setData(d); setLoading(false); })
      .catch(() => setLoading(false));
  }, [isSignedIn]);

  async function handleWithdraw() {
    const amt = parseFloat(withdrawAmt);
    if (!amt || amt <= 0) {
      showToast("Enter a valid withdrawal amount", "error");
      return;
    }
    if (!data || amt > data.available) {
      showToast("Insufficient available balance", "error");
      return;
    }
    const res = await fetch("/api/seller/payouts", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ amount: amt }),
    });
    if (res.ok) {
      const entry = await res.json();
      setData((prev) =>
        prev
          ? {
              ...prev,
              available: prev.available - amt,
              pendingClearance: prev.pendingClearance + amt,
              payoutHistory: [entry, ...prev.payoutHistory],
            }
          : prev
      );
      showToast(`₦${amt.toLocaleString()} withdrawal request submitted!`, "success");
      setWithdrawAmt("");
    } else {
      const err = await res.json();
      showToast(err.error || "Withdrawal failed", "error");
    }
  }

  return (
    <div>
      <style>{`
        .s-page-h { font-size:20px; font-weight:600; color:var(--ink); letter-spacing:-0.03em; margin:0 0 4px; }
        .s-page-sub { font-size:13px; color:var(--muted-text); margin:0 0 20px; }
        .s-stats-grid { display:grid; grid-template-columns:repeat(auto-fit, minmax(180px,1fr)); gap:12px; margin-bottom:20px; }
        .s-stat-card { background:#fff; border-radius:8px; padding:16px; border:1px solid var(--hairline); box-shadow:0 1px 3px rgba(0,0,0,0.04); }
        .s-stat-label { font-size:12px; color:var(--muted-text); margin:0 0 4px; }
        .s-stat-value { font-size:22px; font-weight:600; color:var(--ink); letter-spacing:-0.03em; margin:0; }
        .s-section-row { display:grid; grid-template-columns:1fr 1fr; gap:12px; margin-bottom:20px; }
        .s-card { background:#fff; border-radius:8px; border:1px solid var(--hairline); box-shadow:0 1px 3px rgba(0,0,0,0.04); }
        .s-card-h { display:flex; align-items:center; justify-content:space-between; padding:12px 16px; border-bottom:1px solid var(--hairline); }
        .s-card-h h3 { font-size:12px; font-weight:600; text-transform:uppercase; letter-spacing:0.04em; color:var(--ink); margin:0; }
        .s-card-b { padding:16px 20px; }
        .s-card-b.p0 { padding:0; }
        .s-badge { display:inline-block; padding:2px 8px; border-radius:999px; font-size:10px; font-weight:500; text-transform:uppercase; }
        .s-badge-success { background:rgba(0,112,243,0.1); color:var(--success); }
        .s-badge-pending { background:var(--surface-soft); color:var(--muted-text); }
        .s-badge-info { background:rgba(121,40,202,0.1); color:var(--info); }
        .s-table-wrap { overflow-x:auto; }
        .s-table { width:100%; border-collapse:collapse; font-size:13px; }
        .s-table th { text-align:left; padding:10px 14px; font-size:11px; font-weight:600; color:var(--ash); text-transform:uppercase; letter-spacing:0.04em; border-bottom:1px solid var(--hairline); background:var(--canvas); }
        .s-table td { padding:10px 14px; border-bottom:1px solid var(--hairline); color:var(--body); }
        .s-table tr:last-child td { border-bottom:none; }
        .s-table .mono { font-family:var(--font-mono); font-size:12px; color:var(--ash); }
        .s-btn { display:inline-flex; align-items:center; gap:6px; padding:7px 14px; border-radius:var(--radius-sm); font-size:12px; font-weight:500; cursor:pointer; border:none; transition:all 150ms; }
        .s-btn-p { background:var(--primary); color:#fff; }
        .s-btn-p:hover { background:var(--primary-deep); }
        .s-btn-s { background:#fff; color:var(--body); border:1px solid var(--hairline); }
        .s-btn-s:hover { background:var(--surface-soft); }
        .s-fi { width:100%; height:38px; padding:0 10px; border:1px solid var(--hairline); border-radius:var(--radius-sm); font-size:12px; outline:none; }
        .s-fi:focus { border-color:var(--primary); box-shadow:0 0 0 3px var(--primary-bg); }
        .s-fg { margin-bottom:12px; }
        .s-fg label { display:block; font-size:12px; font-weight:450; color:var(--body); margin-bottom:4px; }
        .s-loading { text-align:center; padding:48px 0; color:var(--muted-text); font-size:14px; }
        @media (max-width:768px) { .s-section-row { grid-template-columns:1fr; } }
      `}</style>

      <div className="s-page-h">Payouts</div>
      <div className="s-page-sub">Manage your earnings and withdrawals</div>

      {loading ? (
        <div className="s-loading">Loading payouts...</div>
      ) : data ? (
        <>
          <div className="s-stats-grid">
            <div className="s-stat-card">
              <div className="s-stat-label">Total Earnings</div>
              <div className="s-stat-value">₦{data.totalEarnings.toLocaleString()}</div>
            </div>
            <div className="s-stat-card">
              <div className="s-stat-label">Available for Withdrawal</div>
              <div className="s-stat-value">₦{data.available.toLocaleString()}</div>
            </div>
            <div className="s-stat-card">
              <div className="s-stat-label">Pending Clearance</div>
              <div className="s-stat-value">₦{data.pendingClearance.toLocaleString()}</div>
            </div>
            <div className="s-stat-card">
              <div className="s-stat-label">This Month</div>
              <div className="s-stat-value">₦{data.thisMonth.toLocaleString()}</div>
            </div>
          </div>

          <div className="s-section-row">
            <div className="s-card">
              <div className="s-card-h"><h3>Withdraw Funds</h3></div>
              <div className="s-card-b">
                <div className="s-fg">
                  <label>Amount (₦)</label>
                  <input className="s-fi" type="number" placeholder="Enter amount..." value={withdrawAmt} onChange={(e) => setWithdrawAmt(e.target.value)} />
                </div>
                <div style={{ fontSize: 11, color: "var(--muted-text)", marginBottom: 12 }}>
                  Available balance: ₦{data.available.toLocaleString()} · Min withdrawal: ₦5,000
                </div>
                <button className="s-btn s-btn-p" onClick={handleWithdraw}>Withdraw Funds</button>
              </div>
            </div>

            <div className="s-card">
              <div className="s-card-h"><h3>Payout History</h3></div>
              <div className="s-card-b p0">
                <div className="s-table-wrap">
                  <table className="s-table">
                    <thead>
                      <tr>
                        <th>ID</th>
                        <th>Date</th>
                        <th>Amount</th>
                        <th>Status</th>
                      </tr>
                    </thead>
                    <tbody>
                      {data.payoutHistory.length === 0 ? (
                        <tr><td colSpan={4} style={{ textAlign: "center", padding: 24, color: "var(--muted-text)" }}>No payouts yet</td></tr>
                      ) : data.payoutHistory.map((p) => (
                        <tr key={p.id}>
                          <td><span className="mono">{p.id.slice(0, 8)}</span></td>
                          <td>{p.date}</td>
                          <td style={{ fontWeight: 500 }}>₦{p.amount.toLocaleString()}</td>
                          <td><span className={`s-badge ${payoutBadges[p.status]}`}>{p.status}</span></td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          </div>
        </>
      ) : null}
    </div>
  );
}
