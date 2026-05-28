"use client";

import { useState } from "react";
import { useSeller } from "@/components/seller/seller-context";
import { SELLER_REVIEWS } from "@/lib/data/seller";
import type { SellerReview } from "@/lib/types/seller";

export function ReviewsPage() {
  const { reviews, setReviews, showToast } = useSeller();
  const [replyInputs, setReplyInputs] = useState<Record<number, string>>({});

  function handleReply(id: number) {
    const text = replyInputs[id]?.trim();
    if (!text) {
      showToast("Write a reply first", "error");
      return;
    }
    setReviews((prev) =>
      prev.map((r) => (r.id === id ? { ...r, replied: true, replyText: text } : r))
    );
    showToast("Reply posted to review", "success");
    setReplyInputs((prev) => ({ ...prev, [id]: "" }));
  }

  function renderStars(count: number) {
    return "★".repeat(count) + "☆".repeat(5 - count);
  }

  return (
    <div>
      <style>{`
        .s-page-h { font-size:20px; font-weight:600; color:var(--ink); letter-spacing:-0.03em; margin:0 0 4px; }
        .s-page-sub { font-size:13px; color:var(--muted-text); margin:0 0 20px; }
        .s-review-list { display:grid; gap:10px; }
        .s-review-card { background:#fff; border-radius:8px; border:1px solid var(--hairline); box-shadow:0 1px 3px rgba(0,0,0,0.04); }
        .s-review-h { display:flex; align-items:flex-start; justify-content:space-between; padding:14px 16px 10px; }
        .s-review-customer { font-weight:500; font-size:13px; color:var(--ink); }
        .s-review-product { font-size:11px; color:var(--muted-text); }
        .s-review-stars { color:#f5a623; font-size:13px; letter-spacing:1px; }
        .s-review-date { font-size:10px; color:var(--ash); margin-top:4px; }
        .s-review-body { padding:0 16px 12px; font-size:13px; color:var(--body); line-height:1.5; }
        .s-reply-box { background:var(--canvas); border-radius:6px; margin:0 16px 12px; padding:10px 12px; }
        .s-reply-box .author { font-size:11px; font-weight:600; color:var(--primary); margin-bottom:4px; }
        .s-reply-box .text { font-size:12px; color:var(--body); }
        .s-reply-input { display:flex; gap:8px; padding:0 16px 14px; }
        .s-reply-input input { flex:1; height:32px; padding:0 10px; border:1px solid var(--hairline); border-radius:var(--radius-sm); font-size:12px; outline:none; }
        .s-reply-input input:focus { border-color:var(--primary); box-shadow:0 0 0 3px var(--primary-bg); }
        .s-btn { display:inline-flex; align-items:center; gap:6px; padding:5px 10px; border-radius:var(--radius-sm); font-size:11px; font-weight:500; cursor:pointer; border:none; transition:all 150ms; }
        .s-btn-p { background:var(--primary); color:#fff; }
        .s-btn-p:hover { background:var(--primary-deep); }
        .s-btn-s { background:#fff; color:var(--body); border:1px solid var(--hairline); }
        .s-btn-s:hover { background:var(--surface-soft); }
      `}</style>

      <div className="s-page-h">Reviews</div>
      <div className="s-page-sub">Customer feedback on your products</div>

      <div className="s-review-list">
        {reviews.map((r: SellerReview) => (
          <div key={r.id} className="s-review-card">
            <div className="s-review-h">
              <div>
                <div className="s-review-customer">{r.customer}</div>
                <div className="s-review-product">on {r.product}</div>
                <div className="s-review-stars">{renderStars(r.rating)}</div>
              </div>
              <div className="s-review-date">{r.date}</div>
            </div>
            <div className="s-review-body">{r.text}</div>
            {r.replied && r.replyText && (
              <div className="s-reply-box">
                <div className="author">Akara Market · Seller</div>
                <div className="text">{r.replyText}</div>
              </div>
            )}
            {!r.replied && (
              <div className="s-reply-input">
                <input
                  placeholder="Write a reply..."
                  value={replyInputs[r.id] || ""}
                  onChange={(e) => setReplyInputs((prev) => ({ ...prev, [r.id]: e.target.value }))}
                />
                <button className="s-btn s-btn-p" onClick={() => handleReply(r.id)}>Reply</button>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
