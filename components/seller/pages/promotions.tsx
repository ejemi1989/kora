"use client";

import { useEffect, useState } from "react";
import { useUser } from "@clerk/nextjs";
import { useSeller } from "@/components/seller/seller-context";
import { PlusIcon } from "@/components/user/icons";

interface Promotion {
  id: string;
  code: string;
  discount: string;
  discountType: string;
  discountValue: number;
  details: string;
  applicableTo: string;
  minOrder: number;
  usageCount: number;
  status: string;
  startDate: string;
  endDate: string;
  ends: string;
}

const promoStatusBadges: Record<string, string> = {
  active: "s-badge-active",
  scheduled: "s-badge-sched",
  draft: "s-badge-draft",
};

function formatDate(dateStr: string) {
  if (!dateStr) return "Unlimited";
  const d = new Date(dateStr);
  return d.toLocaleDateString("en-GB", { day: "numeric", month: "short" });
}

function PromotionForm({
  editing,
  onSave,
  onCancel,
}: {
  editing?: Promotion;
  onSave: (data: { code: string; discountType: string; discountValue: string; startDate: string; endDate: string; applicableTo: string; minOrder: string }) => void;
  onCancel: () => void;
}) {
  const [code, setCode] = useState(editing?.code || "");
  const [discountType, setDiscountType] = useState(editing?.discountType === "fixed" ? "Fixed Amount (₦)" : "Percentage (%)");
  const [discountValue, setDiscountValue] = useState(editing?.discountValue?.toString() || "");
  const [startDate, setStartDate] = useState(editing?.startDate || "");
  const [endDate, setEndDate] = useState(editing?.endDate || "");
  const [applicableTo, setApplicableTo] = useState(editing?.applicableTo === "all" ? "All Products" : editing?.applicableTo || "All Products");
  const [minOrder, setMinOrder] = useState(editing?.minOrder?.toString() || "");

  return (
    <div>
      <div className="s-fg"><label>Promo Code</label><input className="s-fi" value={code} onChange={(e) => setCode(e.target.value)} placeholder="e.g. SUMMER20" /></div>
      <div className="s-fr">
        <div className="s-fg"><label>Discount Type</label>
          <select className="s-fi" value={discountType} onChange={(e) => setDiscountType(e.target.value)}>
            <option>Percentage (%)</option>
            <option>Fixed Amount (₦)</option>
          </select>
        </div>
        <div className="s-fg"><label>Value</label><input className="s-fi" type="number" value={discountValue} onChange={(e) => setDiscountValue(e.target.value)} placeholder="0" /></div>
      </div>
      <div className="s-fr">
        <div className="s-fg"><label>Start Date</label><input className="s-fi" type="date" value={startDate} onChange={(e) => setStartDate(e.target.value)} /></div>
        <div className="s-fg"><label>End Date</label><input className="s-fi" type="date" value={endDate} onChange={(e) => setEndDate(e.target.value)} /></div>
      </div>
      <div className="s-fg"><label>Applicable Products</label>
        <select className="s-fi" value={applicableTo} onChange={(e) => setApplicableTo(e.target.value)}>
          <option>All Products</option>
          <option>Spices & Seasonings</option>
          <option>Select individually…</option>
        </select>
      </div>
      <div className="s-fg"><label>Minimum Order (₦)</label><input className="s-fi" type="number" value={minOrder} onChange={(e) => setMinOrder(e.target.value)} placeholder="0 (no minimum)" /></div>
      <div className="s-modal-actions">
        <button className="s-btn s-btn-s" onClick={onCancel}>Cancel</button>
        <button className="s-btn s-btn-p" onClick={() => onSave({ code, discountType, discountValue, startDate, endDate, applicableTo, minOrder })}>
          {editing ? "Save" : "Create Promotion"}
        </button>
      </div>
    </div>
  );
}

export function PromotionsPage() {
  const { showToast, openModal, closeModal } = useSeller();
  const { isSignedIn } = useUser();
  const [promos, setPromos] = useState<Promotion[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!isSignedIn) return;
    fetch("/api/seller/promotions")
      .then((r) => r.json())
      .then((d) => { if (Array.isArray(d)) setPromos(d); setLoading(false); })
      .catch(() => setLoading(false));
  }, [isSignedIn]);

  async function handleCreate(data: { code: string; discountType: string; discountValue: string; startDate: string; endDate: string; applicableTo: string; minOrder: string }) {
    if (!data.code.trim()) { showToast("Promo code is required", "error"); return; }
    const res = await fetch("/api/seller/promotions", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    });
    if (res.ok) {
      const promo = await res.json();
      setPromos((prev) => [promo, ...prev]);
      showToast("Promotion created!", "success");
      closeModal();
    } else {
      const err = await res.json();
      showToast(err.error || "Failed to create promotion", "error");
    }
  }

  async function handleEdit(p: Promotion) {
    openModal(`Edit ${p.code}`, (
      <PromotionForm
        editing={p}
        onSave={async (data) => {
          if (!data.code.trim()) { showToast("Promo code is required", "error"); return; }
          const res = await fetch("/api/seller/promotions", {
            method: "PATCH",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ id: p.id, ...data }),
          });
          if (res.ok) {
            const updated = await res.json();
            setPromos((prev) => prev.map((x) => (x.id === p.id ? updated : x)));
            showToast(`${data.code} updated!`, "success");
            closeModal();
          } else {
            const err = await res.json();
            showToast(err.error || "Failed to update promotion", "error");
          }
        }}
        onCancel={closeModal}
      />
    ));
  }

  async function handleDelete(p: Promotion) {
    if (!confirm(`Delete promotion "${p.code}"?`)) return;
    const res = await fetch("/api/seller/promotions", {
      method: "DELETE",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id: p.id }),
    });
    if (res.ok) {
      setPromos((prev) => prev.filter((x) => x.id !== p.id));
      showToast("Promotion deleted", "success");
    } else {
      showToast("Failed to delete promotion", "error");
    }
  }

  function handleNew() {
    openModal("New Promotion", (
      <PromotionForm
        onSave={handleCreate}
        onCancel={closeModal}
      />
    ));
  }

  return (
    <div>
      <style>{`
        .s-page-h { font-size:20px; font-weight:600; color:var(--ink); letter-spacing:-0.03em; margin:0 0 4px; }
        .s-page-sub { font-size:13px; color:var(--muted-text); margin:0 0 20px; }
        .s-action-row { display:flex; align-items:center; justify-content:space-between; margin-bottom:16px; }
        .s-btn { display:inline-flex; align-items:center; gap:6px; padding:7px 14px; border-radius:var(--radius-sm); font-size:12px; font-weight:500; cursor:pointer; border:none; transition:all 150ms; }
        .s-btn-p { background:var(--primary); color:#fff; }
        .s-btn-p:hover { background:var(--primary-deep); }
        .s-btn-s { background:#fff; color:var(--body); border:1px solid var(--hairline); }
        .s-btn-s:hover { background:var(--surface-soft); }
        .s-btn-g { background:none; color:var(--muted-text); border:1px solid transparent; }
        .s-btn-sm { padding:4px 10px; font-size:11px; }
        .s-btn-d { background:#fff; color:var(--danger); border:1px solid var(--danger); }
        .s-btn-d:hover { background:rgba(238,0,0,0.06); }
        .s-card { background:#fff; border-radius:8px; border:1px solid var(--hairline); box-shadow:0 1px 3px rgba(0,0,0,0.04); }
        .s-promo-card { display:flex; align-items:center; justify-content:space-between; padding:14px 16px; }
        .s-promo-card:not(:last-child) { border-bottom:1px solid var(--hairline); }
        .s-promo-code { font-family:var(--font-mono); font-size:13px; font-weight:600; color:var(--primary); }
        .s-promo-details { font-size:12px; color:var(--muted-text); margin-top:2px; }
        .s-badge { display:inline-block; padding:2px 8px; border-radius:999px; font-size:10px; font-weight:500; text-transform:uppercase; }
        .s-badge-active { background:rgba(0,112,243,0.1); color:var(--success); }
        .s-badge-sched { background:rgba(245,166,35,0.1); color:var(--warning); }
        .s-badge-draft { background:var(--surface-soft); color:var(--muted-text); }
        .s-fg { margin-bottom:12px; }
        .s-fg label { display:block; font-size:12px; font-weight:450; color:var(--body); margin-bottom:4px; }
        .s-fi { width:100%; height:38px; padding:0 10px; border:1px solid var(--hairline); border-radius:var(--radius-sm); font-size:12px; outline:none; box-sizing:border-box; }
        .s-fi:focus { border-color:var(--primary); box-shadow:0 0 0 3px var(--primary-bg); }
        .s-fr { display:grid; grid-template-columns:1fr 1fr; gap:10px; }
        .s-modal-actions { display:flex; justify-content:flex-end; gap:8px; margin-top:16px; }
        .s-loading { text-align:center; padding:48px 0; color:var(--muted-text); font-size:14px; }
      `}</style>

      <div className="s-page-h">Promotions</div>
      <div className="s-page-sub">Create and manage discount campaigns</div>

      <div className="s-action-row">
        <div></div>
        <button className="s-btn s-btn-p" onClick={handleNew}>
          <PlusIcon size={14} />
          New Promotion
        </button>
      </div>

      {loading ? (
        <div className="s-loading">Loading promotions...</div>
      ) : promos.length === 0 ? (
        <div className="s-loading">No promotions yet</div>
      ) : (
        <div className="s-card">
          {promos.map((p) => (
            <div key={p.id} className="s-promo-card">
              <div>
                <div className="s-promo-code">{p.code}</div>
                <div className="s-promo-details">{p.discount} — {p.details} • Ends {p.ends}</div>
              </div>
              <div style={{ display: "flex", gap: 8, alignItems: "center" }}>
                <span className={`s-badge ${promoStatusBadges[p.status]}`}>{p.status}</span>
                <button className="s-btn s-btn-s s-btn-sm" onClick={() => handleEdit(p)}>Edit</button>
                <button className="s-btn s-btn-d s-btn-sm" onClick={() => handleDelete(p)}>Delete</button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
