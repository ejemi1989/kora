"use client";

import { useState } from "react";
import { useSeller } from "@/components/seller/seller-context";
import { SELLER_PROMOTIONS } from "@/lib/data/seller";
import type { SellerPromotion } from "@/lib/types/seller";
import { PlusIcon } from "@/components/user/icons";

const promoStatusBadges: Record<string, string> = {
  active: "s-badge-active",
  scheduled: "s-badge-sched",
  draft: "s-badge-draft",
};

export function PromotionsPage() {
  const { showToast, openModal, closeModal } = useSeller();
  const [promos, setPromos] = useState(SELLER_PROMOTIONS);

  function handleNew() {
    openModal("New Promotion", (
      <div>
        <div className="s-fg"><label>Promo Code</label><input className="s-fi" placeholder="e.g. SUMMER20" id="promoCode" /></div>
        <div className="s-fr">
          <div className="s-fg"><label>Discount Type</label>
            <select className="s-fi">
              <option>Percentage (%)</option>
              <option>Fixed Amount (₦)</option>
            </select>
          </div>
          <div className="s-fg"><label>Value</label><input className="s-fi" type="number" placeholder="0" /></div>
        </div>
        <div className="s-fr">
          <div className="s-fg"><label>Start Date</label><input className="s-fi" type="date" /></div>
          <div className="s-fg"><label>End Date</label><input className="s-fi" type="date" /></div>
        </div>
        <div className="s-fg"><label>Applicable Products</label>
          <select className="s-fi">
            <option>All Products</option>
            <option>Spices & Seasonings</option>
            <option>Select individually…</option>
          </select>
        </div>
        <div className="s-fg"><label>Minimum Order</label><input className="s-fi" type="number" placeholder="0 (no minimum)" /></div>
        <div className="s-modal-actions">
          <button className="s-btn s-btn-s" onClick={closeModal}>Cancel</button>
          <button className="s-btn s-btn-p" onClick={() => { showToast("Promotion created!", "success"); closeModal(); }}>Create Promotion</button>
        </div>
      </div>
    ));
  }

  function handleEdit(p: SellerPromotion) {
    showToast(`Editing ${p.code} promotion…`, "default");
    openModal(`Edit ${p.code}`, (
      <div>
        <div className="s-fg"><label>Promo Code</label><input className="s-fi" defaultValue={p.code} /></div>
        <div className="s-fr">
          <div className="s-fg"><label>Discount Type</label>
            <select className="s-fi"><option>Percentage (%)</option><option>Fixed Amount (₦)</option></select>
          </div>
          <div className="s-fg"><label>Value</label><input className="s-fi" type="number" placeholder="0" /></div>
        </div>
        <div className="s-fr">
          <div className="s-fg"><label>Start Date</label><input className="s-fi" type="date" /></div>
          <div className="s-fg"><label>End Date</label><input className="s-fi" type="date" /></div>
        </div>
        <div className="s-modal-actions">
          <button className="s-btn s-btn-s" onClick={closeModal}>Cancel</button>
          <button className="s-btn s-btn-p" onClick={() => { showToast(`${p.code} updated!`, "success"); closeModal(); }}>Save</button>
        </div>
      </div>
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
        .s-fi { width:100%; height:38px; padding:0 10px; border:1px solid var(--hairline); border-radius:var(--radius-sm); font-size:12px; outline:none; }
        .s-fi:focus { border-color:var(--primary); box-shadow:0 0 0 3px var(--primary-bg); }
        .s-fr { display:grid; grid-template-columns:1fr 1fr; gap:10px; }
        .s-modal-actions { display:flex; justify-content:flex-end; gap:8px; margin-top:16px; }
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

      <div className="s-card">
        {promos.map((p) => (
          <div key={p.code} className="s-promo-card">
            <div>
              <div className="s-promo-code">{p.code}</div>
              <div className="s-promo-details">{p.discount} — {p.details} • Ends {p.ends}</div>
            </div>
            <div style={{ display: "flex", gap: 8, alignItems: "center" }}>
              <span className={`s-badge ${promoStatusBadges[p.status]}`}>{p.status}</span>
              <button className="s-btn s-btn-s s-btn-sm" onClick={() => handleEdit(p)}>Edit</button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
