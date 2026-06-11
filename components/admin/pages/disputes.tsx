"use client";

export function DisputesPage() {
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

      <div className="page-h">Disputes</div>
      <div className="page-sub">Resolve buyer-seller disputes and issue resolutions</div>

      <div className="empty-state">
        <ShieldIcon size={40} />
        <h3>No disputes yet</h3>
        <p>Disputes will appear here when buyers or sellers open them</p>
      </div>
    </div>
  );
}

function ShieldIcon({ size = 24 }: { size?: number }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5} strokeLinecap="round" strokeLinejoin="round" width={size} height={size}>
      <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
    </svg>
  );
}
