"use client";

import type { ReactNode } from "react";
import { useRouter } from "next/navigation";
import { UserButton } from "@clerk/nextjs";
import { useAdmin } from "@/components/admin/admin-context";
import type { AdminPageId } from "@/lib/types/admin";
import {
  HomeIcon, BellIcon, UsersIcon, StoreIcon, PackageIcon, ListIcon,
  CardIcon, ShieldIcon, BarChartIcon, FileIcon, SettingsIcon, DollarIcon,
  MenuIcon, XIcon, SearchIcon,
} from "@/components/user/icons";

const navGroups: { label?: string; items: { id: string; label: string; icon: ReactNode }[] }[] = [
  {
    items: [
      { id: "overview", label: "Overview", icon: <HomeIcon size={16} /> },
      { id: "notifications", label: "Notifications", icon: <BellIcon size={16} /> },
    ],
  },
  {
    label: "Management",
    items: [
      { id: "users", label: "Users", icon: <UsersIcon size={16} /> },
      { id: "sellers", label: "Sellers", icon: <StoreIcon size={16} /> },
      { id: "products", label: "Products", icon: <PackageIcon size={16} /> },
    ],
  },
  {
    label: "Commerce",
    items: [
      { id: "orders", label: "Orders", icon: <ListIcon size={16} /> },
      { id: "payments", label: "Payments", icon: <CardIcon size={16} /> },
      { id: "disputes", label: "Disputes", icon: <ShieldIcon size={16} /> },
    ],
  },
  {
    label: "Platform",
    items: [
      { id: "analytics", label: "Analytics", icon: <BarChartIcon size={16} /> },
      { id: "content", label: "Content", icon: <FileIcon size={16} /> },
      { id: "currencies", label: "Currencies", icon: <DollarIcon size={16} /> },
      { id: "settings", label: "Settings", icon: <SettingsIcon size={16} /> },
    ],
  },
];

const navBadges: Record<string, string> = {
  notifications: "6",
  users: "2,847",
  sellers: "143",
  products: "12.4K",
  orders: "486",
  disputes: "12",
  currencies: "7",
};

export function AdminShell({ children }: { children: ReactNode }) {
  const { page, setPage, sidebar, setSidebar, toasts, modal, closeModal, showToast } = useAdmin();
  const router = useRouter();

  function handleNav(id: string) {
    setPage(id as AdminPageId);
    router.push(`/admin/${id}`);
    setSidebar(false);
  }

  const panelLabels: Record<string, string> = {
    overview: "Overview", notifications: "Notifications", users: "Users",
    sellers: "Sellers", products: "Products", orders: "Orders",
    payments: "Payments", disputes: "Disputes", analytics: "Analytics",
    content: "Content", currencies: "Currencies", settings: "Settings",
  };

  const toastColors: Record<string, string> = {
    success: "#0070f3", danger: "#ee0000", warning: "#f5a623", default: "#171717",
  };

  return (
    <div className="admin-app">
      <style>{`
        .admin-app { display:flex; height:100vh; overflow:hidden; font-family:var(--font-sans); }
        .admin-app * { box-sizing:border-box; }
        .admin-sidebar-overlay { display:none; }
        .admin-sidebar { width:240px; min-width:240px; background:#fff; border-right:1px solid var(--hairline); display:flex; flex-direction:column; z-index:100; transition:transform 200ms; }
        .admin-sidebar-brand { height:52px; display:flex; align-items:center; gap:8px; padding:0 16px; border-bottom:1px solid var(--hairline); font-size:14px; font-weight:600; color:var(--ink); }
        .admin-logo { width:28px; height:28px; border-radius:var(--radius-sm); background:var(--primary); color:#fff; display:flex; align-items:center; justify-content:center; font-size:12px; font-weight:700; }
        .admin-wordmark span { color:var(--primary); }
        .admin-sidebar-nav { flex:1; overflow-y:auto; padding:8px 0; }
        .admin-nav-group-label { font-family:var(--font-mono); font-size:10px; font-weight:500; text-transform:uppercase; letter-spacing:0.06em; color:var(--ash); padding:12px 16px 4px; }
        .admin-nav-item { display:flex; align-items:center; gap:8px; padding:7px 16px; font-size:13px; color:var(--body); cursor:pointer; border:none; background:none; width:100%; text-align:left; transition:all 150ms; }
        .admin-nav-item:hover { background:var(--primary-bg); color:var(--primary); }
        .admin-nav-item.active { background:var(--primary-bg); color:var(--primary); font-weight:500; }
        .admin-nav-item svg { flex-shrink:0; }
        .admin-nav-badge { margin-left:auto; background:var(--primary); color:#fff; font-size:10px; padding:1px 6px; border-radius:999px; font-weight:600; }
        .admin-sidebar-footer { padding:12px 16px; border-top:1px solid var(--hairline); }
        .admin-logout { display:flex; align-items:center; gap:8px; padding:6px 0; font-size:13px; color:var(--muted-text); cursor:pointer; border:none; background:none; width:100%; text-align:left; }
        .admin-logout:hover { color:var(--danger); }
        .admin-main { flex:1; display:flex; flex-direction:column; min-width:0; }
        .admin-topbar { height:52px; display:flex; align-items:center; gap:12px; padding:0 24px; border-bottom:1px solid var(--hairline); background:#fff; }
        .admin-topbar-title { font-size:14px; font-weight:500; color:var(--ink); }
        .admin-topbar-sep { font-size:12px; color:var(--stone); }
        .admin-topbar-current { font-size:13px; color:var(--muted-text); }
        .admin-topbar-spacer { flex:1; }
        .admin-topbar-search { position:relative; width:200px; }
        .admin-topbar-search input { width:100%; height:30px; padding:0 8px 0 28px; border:1px solid var(--hairline); border-radius:var(--radius-sm); font-size:12px; outline:none; background:var(--canvas); }
        .admin-topbar-search input:focus { border-color:var(--primary); box-shadow:0 0 0 3px var(--primary-bg); }
        .admin-topbar-search svg { position:absolute; left:7px; top:50%; transform:translateY(-50%); color:var(--stone); pointer-events:none; }
        .admin-notif-btn { position:relative; width:30px; height:30px; border-radius:6px; border:none; background:none; cursor:pointer; display:flex; align-items:center; justify-content:center; color:var(--body); }
        .admin-notif-btn:hover { background:var(--surface-soft); }
        .admin-notif-badge { position:absolute; top:-2px; right:-2px; background:var(--danger); color:#fff; font-size:9px; padding:1px 5px; border-radius:999px; font-weight:600; line-height:1.2; }
        .admin-avatar-btn { width:28px; height:28px; border-radius:6px; border:none; background:var(--surface-soft); color:var(--body); font-size:10px; font-weight:600; cursor:pointer; display:flex; align-items:center; justify-content:center; }
        .admin-content { flex:1; overflow-y:auto; padding:24px 28px; background:var(--canvas); }
        .admin-content::-webkit-scrollbar { width:6px; }
        .admin-content::-webkit-scrollbar-track { background:transparent; }
        .admin-content::-webkit-scrollbar-thumb { background:var(--ash); border-radius:4px; }
        .admin-toast-container { position:fixed; bottom:24px; right:24px; z-index:200; display:flex; flex-direction:column; align-items:flex-end; gap:8px; pointer-events:none; }
        .admin-toast { padding:10px 20px; border-radius:6px; color:#fff; font-size:13px; animation:adminSlideUp 200ms cubic-bezier(0.16,1,0.3,1); pointer-events:auto; max-width:320px; }
        @keyframes adminSlideUp { from { opacity:0; transform:translateY(8px); } to { opacity:1; transform:translateY(0); } }
        .admin-hamburger { display:none; width:30px; height:30px; border-radius:6px; border:none; background:none; cursor:pointer; align-items:center; justify-content:center; color:var(--body); }
        .admin-modal-overlay { position:fixed; inset:0; background:rgba(23,23,23,0.3); backdrop-filter:blur(2px); z-index:200; display:flex; align-items:center; justify-content:center; padding:16px; }
        .admin-modal { background:#fff; border-radius:12px; max-width:480px; width:100%; max-height:calc(100vh - 64px); overflow-y:auto; box-shadow:var(--shadow-modal); }
        .admin-modal-h { display:flex; align-items:center; justify-content:space-between; padding:16px 20px; border-bottom:1px solid var(--hairline); }
        .admin-modal-h h2 { font-size:15px; font-weight:600; color:var(--ink); margin:0; }
        .admin-modal-close { width:28px; height:28px; border-radius:6px; border:none; background:none; cursor:pointer; display:flex; align-items:center; justify-content:center; color:var(--muted-text); }
        .admin-modal-close:hover { background:var(--surface-soft); }
        .admin-modal-b { padding:20px; }
        .admin-modal-actions { display:flex; justify-content:flex-end; gap:8px; margin-top:16px; }
        @media (max-width:768px) {
          .admin-sidebar-overlay { display:block; position:fixed; inset:0; background:rgba(0,0,0,0.3); z-index:99; }
          .admin-sidebar-overlay.hidden { display:none; }
          .admin-sidebar { position:fixed; top:0; left:0; height:100vh; transform:translateX(-260px); }
          .admin-sidebar.open { transform:translateX(0); }
          .admin-hamburger { display:flex; }
          .admin-content { padding:16px; }
          .admin-topbar-search { width:140px; }
        }
        @media (max-width:480px) {
          .admin-topbar-search { display:none; }
        }
      `}</style>

      <div className={`admin-sidebar-overlay ${sidebar ? "" : "hidden"}`} onClick={() => setSidebar(false)} />

      <aside className={`admin-sidebar ${sidebar ? "open" : ""}`}>
        <div className="admin-sidebar-brand">
          <div className="admin-logo">K</div>
            <span className="admin-wordmark">Deni</span>
        </div>
        <nav className="admin-sidebar-nav">
          {navGroups.map((group) => (
            <div key={group.label || "top"}>
              {group.label && <div className="admin-nav-group-label">{group.label}</div>}
              {group.items.map((item) => (
                <button key={item.id} className={`admin-nav-item ${page === item.id ? "active" : ""}`} onClick={() => handleNav(item.id)}>
                  {item.icon}
                  {item.label}
                  {navBadges[item.id] && <span className="admin-nav-badge">{navBadges[item.id]}</span>}
                </button>
              ))}
            </div>
          ))}
        </nav>
      </aside>

      <div className="admin-main">
        <header className="admin-topbar">
          <button className="admin-hamburger" onClick={() => setSidebar(true)}><MenuIcon /></button>
          <span className="admin-topbar-title">Deni</span>
          <span className="admin-topbar-sep">/</span>
          <span className="admin-topbar-current">{panelLabels[page] || page}</span>
          <div className="admin-topbar-spacer" />
          <div className="admin-topbar-search">
            <SearchIcon size={14} />
            <input placeholder="Search..." />
          </div>
          <button className="admin-notif-btn" onClick={() => { setPage("notifications" as AdminPageId); router.push("/admin/notifications"); }}>
            <BellIcon size={18} />
            <span className="admin-notif-badge">6</span>
          </button>
          <UserButton />
        </header>
        <main className="admin-content">
          {children}
        </main>
      </div>

      <div className="admin-toast-container">
        {toasts.map((t) => (
          <div key={t.id} className="admin-toast" style={{ background: toastColors[t.type || "default"] }}>{t.message}</div>
        ))}
      </div>

      {modal.open && (
        <div className="admin-modal-overlay" onClick={closeModal}>
          <div className="admin-modal" onClick={(e) => e.stopPropagation()}>
            <div className="admin-modal-h">
              <h2>{modal.title}</h2>
              <button className="admin-modal-close" onClick={closeModal}><XIcon size={16} /></button>
            </div>
            <div className="admin-modal-b">
              {modal.content}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
