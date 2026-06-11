"use client";

import { useEffect, useState } from "react";
import { useUser } from "@clerk/nextjs";
import { useSeller } from "@/components/seller/seller-context";

interface Review {
  id: string;
  customer: string;
  product: string;
  rating: number;
  text: string;
  date: string;
  replied: boolean;
  replyText?: string;
}

export function ReviewsPage() {
  const { showToast } = useSeller();
  const { isSignedIn } = useUser();
  const [reviews, setReviews] = useState<Review[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [replyInputs, setReplyInputs] = useState<Record<string, string>>({});

  useEffect(() => {
    if (!isSignedIn) return;
    fetch("/api/seller/reviews")
      .then((r) => r.json())
      .then((d) => {
        if (d && d.success === false) {
          setError(d.error || "Failed to load reviews");
        } else if (Array.isArray(d)) {
          setReviews(d);
        } else {
          setError("Invalid response from server");
        }
        setLoading(false);
      })
      .catch((err) => {
        setError(err.message || "Failed to load reviews");
        setLoading(false);
      });
  }, [isSignedIn]);

  async function handleReply(id: string) {
    const text = replyInputs[id]?.trim();
    if (!text) {
      showToast("Write a reply first", "error");
      return;
    }
    const res = await fetch("/api/seller/reviews", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ reviewId: id, replyText: text }),
    });
    if (res.ok) {
      setReviews((prev) =>
        prev.map((r) => (r.id === id ? { ...r, replied: true, replyText: text } : r))
      );
      showToast("Reply posted to review", "success");
      setReplyInputs((prev) => ({ ...prev, [id]: "" }));
    } else {
      showToast("Failed to post reply", "error");
    }
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
        .s-loading { text-align:center; padding:48px 0; color:var(--muted-text); font-size:14px; }
      `}</style>

      <div className="s-page-h">Reviews</div>
      <div className="s-page-sub">Customer feedback on your products</div>

      {loading ? (
        <div className="s-loading">Loading reviews...</div>
      ) : error ? (
        <div className="s-loading" style={{ color: "var(--danger)" }}>
          {error}
          <br />
          <button onClick={() => window.location.reload()} style={{ marginTop: 12, padding: "8px 16px", borderRadius: "var(--radius-sm)", border: "1px solid var(--hairline)", background: "var(--surface-card)", cursor: "pointer", fontSize: 13 }}>Reload</button>
        </div>
      ) : reviews.length === 0 ? (
        <div className="s-loading">No reviews yet</div>
      ) : (
        <div className="s-review-list">
          {reviews.map((r) => (
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
                  <div className="author">Deni · Seller</div>
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
      )}
    </div>
  );
}
