"use client";

import { useEffect, useState } from "react";
import { useAdmin } from "@/components/admin/admin-context";
import { useRouter } from "next/navigation";
import { BellIcon, AlertIcon, CheckIcon, InfoIcon, BarChartIcon, CardIcon, StoreIcon, ListIcon, UsersIcon } from "@/components/user/icons";

const filters = ["All", "Unread", "Alerts", "Orders", "Users", "System"];

function notifIcon(type: string) {
  switch (type) {
    case "urgent": return <AlertIcon size={16} />;
    case "new": return <BellIcon size={16} />;
    case "action": return <AlertIcon size={16} />;
    case "info": return <InfoIcon size={16} />;
    case "milestone": return <BarChartIcon size={16} />;
    case "warning": return <AlertIcon size={16} />;
    default: return <InfoIcon size={16} />;
  }
}

function actionIcon(target: string) {
  switch (target) {
    case "sellers": return <StoreIcon size={14} />;
    case "orders": return <ListIcon size={14} />;
    case "disputes": return <AlertIcon size={14} />;
    case "users": return <UsersIcon size={14} />;
    case "analytics": return <BarChartIcon size={14} />;
    case "payments": return <CardIcon size={14} />;
    default: return null;
  }
}

interface NotifItem {
  id: string;
  title: string;
  type: "urgent" | "new" | "action" | "info" | "milestone" | "warning";
  iconBg: string;
  badge: string;
  description: string;
  time: string;
  actionLabel: string;
  actionTarget: string;
  dismissable: boolean;
  urgent: boolean;
}

export function NotificationsPage() {
  const { setPage, showToast } = useAdmin();
  const router = useRouter();
  const [activeFilter, setActiveFilter] = useState("All");
  const [notifs, setNotifs] = useState<NotifItem[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/admin/notifications")
      .then((r) => r.json())
      .then((d) => { if (Array.isArray(d)) setNotifs(d); setLoading(false); })
      .catch(() => setLoading(false));
  }, []);

  const filtered = notifs.filter((n) => {
    if (activeFilter === "Unread") return n.badge === "new";
    if (activeFilter === "Alerts") return n.type === "urgent" || n.type === "action" || n.type === "warning";
    if (activeFilter === "Orders") return n.type === "new";
    if (activeFilter === "Users") return n.type === "info";
    if (activeFilter === "System") return n.type === "milestone" || n.type === "warning";
    return true;
  });

  function handleAction(target: string) {
    setPage(target as any);
    router.push(`/admin/${target}`);
  }

  async function handleDismiss(id: string) {
    await fetch("/api/admin/notifications", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id }),
    });
    setNotifs((prev) => prev.filter((n) => n.id !== id));
    showToast("Dismissed", "success");
  }

  async function markAllRead() {
    await fetch("/api/admin/notifications", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({}),
    });
    setNotifs((prev) => prev.map((n) => ({ ...n, badge: "read", dismissable: false })));
    showToast("All marked as read", "success");
  }

  if (loading) return <div style={{ textAlign: "center", padding: 48, color: "var(--muted-text)" }}>Loading notifications...</div>;

  return (
    <div>
      <style>{`
        .page-h { font-size:20px; font-weight:600; color:var(--ink); letter-spacing:-0.03em; margin:0 0 4px; }
        .page-sub { font-size:13px; color:var(--muted-text); margin:0 0 12px; }
        .notif-header { display:flex; align-items:center; justify-content:space-between; margin-bottom:16px; }
        .notif-header h3 { font-size:14px; font-weight:500; color:var(--ink); margin:0; }
        .filter-chips { display:flex; gap:4px; flex-wrap:wrap; margin-bottom:16px; }
        .chip { padding:4px 12px; border-radius:999px; border:1px solid var(--hairline); background:#fff; font-size:12px; color:var(--body); cursor:pointer; }
        .chip.active { background:var(--primary-bg); border-color:var(--primary); color:var(--primary); font-weight:500; }
        .btn { display:inline-flex; align-items:center; gap:4px; height:30px; padding:0 12px; border-radius:var(--radius-sm); font-size:11px; font-weight:500; cursor:pointer; transition:all 150ms; border:none; }
        .btn-s { background:#fff; border:1px solid var(--hairline); color:var(--body); }
        .btn-s:hover { background:var(--surface-soft); }
        .notif-card { background:#fff; border-radius:8px; box-shadow:var(--shadow-card); padding:12px 16px; margin-bottom:8px; display:flex; gap:12px; }
        .notif-card.urgent { box-shadow:var(--shadow-elevated); border-left:3px solid var(--primary); }
        .notif-icon { width:36px; height:36px; border-radius:8px; display:flex; align-items:center; justify-content:center; flex-shrink:0; }
        .notif-icon.primary-bg { background:var(--primary-bg); color:var(--primary); }
        .notif-icon.success-bg { background:#e8f3ff; color:var(--success); }
        .notif-icon.danger-bg { background:rgba(238,0,0,0.08); color:var(--danger); }
        .notif-icon.warning-bg { background:rgba(245,166,35,0.1); color:var(--warning); }
        .notif-body { flex:1; min-width:0; }
        .notif-title { font-size:13px; font-weight:500; color:var(--ink); display:flex; align-items:center; gap:6px; flex-wrap:wrap; }
        .notif-pill { font-size:9px; padding:1px 6px; border-radius:999px; font-weight:500; background:var(--primary-bg); color:var(--primary); }
        .notif-desc { font-size:12px; color:var(--muted-text); margin:3px 0 6px; line-height:1.4; }
        .notif-foot { display:flex; align-items:center; gap:12px; font-size:11px; color:var(--ash); }
        .action-link { font-size:11px; color:var(--primary); cursor:pointer; border:none; background:none; padding:0; display:inline-flex; align-items:center; gap:3px; }
        .action-link:hover { text-decoration:underline; }
        @media (max-width:480px) { .notif-card { flex-direction:column; } }
      `}</style>

      <div className="page-h">Notifications</div>
      <div className="page-sub">Platform alerts, user activity, and system warnings</div>

      <div className="notif-header">
        <h3>All notifications</h3>
        <button className="btn btn-s" onClick={markAllRead}>Mark all read</button>
      </div>

      <div className="filter-chips">
        {filters.map((f) => (
          <button key={f} className={`chip ${activeFilter === f ? "active" : ""}`} onClick={() => setActiveFilter(f)}>{f}</button>
        ))}
      </div>

      {filtered.length === 0 ? (
        <div style={{ textAlign: "center", padding: 48, color: "var(--muted-text)" }}>No notifications</div>
      ) : (
        filtered.map((n) => (
          <div key={n.id} className={`notif-card ${n.urgent ? "urgent" : ""}`}>
            <div className={`notif-icon ${n.iconBg}`}>
              {notifIcon(n.type)}
            </div>
            <div className="notif-body">
              <div className="notif-title">
                {n.title}
                {n.badge === "new" && <span className="notif-pill">new</span>}
              </div>
              <div className="notif-desc">{n.description}</div>
              <div className="notif-foot">
                <span>{n.time}</span>
                <button className="action-link" onClick={() => handleAction(n.actionTarget)}>
                  {actionIcon(n.actionTarget)}
                  {n.actionLabel}
                </button>
                {n.dismissable && (
                  <>
                    <span style={{ color: "var(--hairline)" }}>·</span>
                    <button className="action-link" onClick={() => handleDismiss(n.id)} style={{ color: "var(--muted-text)" }}>Dismiss</button>
                  </>
                )}
              </div>
            </div>
          </div>
        ))
      )}
    </div>
  );
}
