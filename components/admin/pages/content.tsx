"use client";

export function ContentPage() {
  return (
    <div>
      <style>{`
        .page-h { font-size:20px; font-weight:600; color:var(--ink); letter-spacing:-0.03em; margin:0 0 4px; }
        .page-sub { font-size:13px; color:var(--muted-text); margin:0 0 20px; }
        .empty-state { text-align:center; padding:64px 24px; background:#fff; border-radius:8px; box-shadow:var(--shadow-card); }
        .empty-state svg { color:var(--stone); margin-bottom:12px; }
        .empty-state h3 { font-size:15px; font-weight:500; color:var(--ink); margin:0 0 4px; }
        .empty-state p { font-size:13px; color:var(--muted-text); margin:0; }
      `}</style>

      <div className="page-h">Content</div>
      <div className="page-sub">Manage homepage banners, promotions, and featured content</div>

      <div className="empty-state">
        <FileIcon size={40} />
        <h3>No content yet</h3>
        <p>Banners and promotions will appear here when created</p>
      </div>
    </div>
  );
}

function FileIcon({ size = 24 }: { size?: number }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5} strokeLinecap="round" strokeLinejoin="round" width={size} height={size}>
      <path d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8z" /><polyline points="14 2 14 8 20 8" />
    </svg>
  );
}
