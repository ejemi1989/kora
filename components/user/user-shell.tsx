"use client";

import type { ReactNode } from "react";
import { useRouter } from "next/navigation";
import { UserButton } from "@clerk/nextjs";
import { useUser } from "@/components/user/user-context";
import {
  GridIcon, HomeIcon, ListIcon, TruckIcon, CartIcon, HeartIcon,
  MapIcon, CardIcon, BellIcon, SettingsIcon, MenuIcon, XIcon,
} from "@/components/user/icons";

const navItems: { id: string; label: string; icon: ReactNode }[] = [
  { id: "shop", label: "Shop", icon: <GridIcon /> },
  { id: "overview", label: "Overview", icon: <HomeIcon /> },
  { id: "orders", label: "Orders", icon: <ListIcon /> },
  { id: "tracking", label: "Tracking", icon: <TruckIcon /> },
  { id: "cart", label: "Cart", icon: <CartIcon /> },
  { id: "wishlist", label: "Wishlist", icon: <HeartIcon /> },
  { id: "addresses", label: "Addresses", icon: <MapIcon /> },
  { id: "payments", label: "Payments", icon: <CardIcon /> },
  { id: "notifications", label: "Notifications", icon: <BellIcon /> },
  { id: "settings", label: "Settings", icon: <SettingsIcon /> },
];

export function UserShell({ children }: { children: ReactNode }) {
  const { page, setPage, sidebar, setSidebar, cartCount, notifs, notifOpen, setNotifOpen, setNotifs, setPage: navigate, toasts } = useUser();
  const router = useRouter();
  const unread = notifs.filter((n) => !n.read).length;

  function handleNav(id: string) {
    setPage(id as any);
    router.push(`/user/${id}`);
    setSidebar(false);
  }

  const pageLabels: Record<string, string> = {
    overview: "Overview", shop: "Shop", orders: "Orders", tracking: "Tracking",
    cart: "Cart", wishlist: "Wishlist", addresses: "Addresses",
    payments: "Payments", notifications: "Notifications", settings: "Settings",
  };

  return (
    <div style={{ display: "flex", height: "100vh", overflow: "hidden" }}>
      <style>{`
        .user-sidebar { width:240px; min-width:240px; background:#fff; border-right:1px solid var(--hairline); display:flex; flex-direction:column; z-index:100; transition:transform 200ms; }
        .user-sidebar-brand { height:52px; display:flex; align-items:center; gap:8px; padding:0 16px; border-bottom:1px solid var(--hairline); font-size:15px; font-weight:600; color:var(--ink); }
        .user-logo { width:28px; height:28px; border-radius:6px; background:var(--primary); color:#fff; display:flex; align-items:center; justify-content:center; font-size:11px; font-weight:700; }
        .user-nav { flex:1; overflow-y:auto; padding:8px 0; }
        .user-nav-item { display:flex; align-items:center; gap:10px; padding:8px 16px; font-size:13px; color:var(--body); cursor:pointer; border:none; background:none; width:100%; text-align:left; transition:all 150ms; }
        .user-nav-item:hover { background:var(--primary-bg); color:var(--primary); }
        .user-nav-item.active { background:var(--primary-bg); color:var(--primary); font-weight:500; }
        .user-nav-item svg { flex-shrink:0; }
        .user-nav-badge { margin-left:auto; background:var(--primary); color:#fff; font-size:10px; padding:1px 6px; border-radius:999px; font-weight:600; }
        .user-nav-badge.cart { background:var(--primary); }
        .user-main { flex:1; display:flex; flex-direction:column; min-width:0; }
        .user-topbar { height:52px; display:flex; align-items:center; gap:12px; padding:0 24px; border-bottom:1px solid var(--hairline); background:#fff; }
        .user-topbar-title { font-size:15px; font-weight:500; color:var(--ink); }
        .user-topbar-sub { font-size:12px; color:var(--muted); margin-left:4px; }
        .user-topbar-spacer { flex:1; }
        .user-notif-btn { position:relative; width:30px; height:30px; border-radius:6px; border:none; background:none; cursor:pointer; display:flex; align-items:center; justify-content:center; color:var(--body); }
        .user-notif-btn:hover { background:var(--surface-soft); }
        .user-notif-dot { position:absolute; top:4px; right:4px; width:5px; height:5px; border-radius:50%; background:var(--danger); border:1.5px solid #fff; }
        .user-avatar-btn { width:28px; height:28px; border-radius:6px; border:none; background:linear-gradient(135deg, var(--primary), var(--primary-deep)); color:#fff; font-size:10px; font-weight:600; cursor:pointer; display:flex; align-items:center; justify-content:center; }
        .user-content { flex:1; overflow-y:auto; padding:24px 28px; background:var(--canvas); }
        .user-toast-container { position:fixed; bottom:20px; left:50%; transform:translateX(-50%); z-index:200; display:flex; flex-direction:column; align-items:center; gap:8px; pointer-events:none; }
        .user-toast { padding:10px 20px; border-radius:6px; background:var(--surface-dark); color:#fff; font-size:13px; animation:slideUp 200ms cubic-bezier(0.16,1,0.3,1); pointer-events:auto; }
        @keyframes slideUp { from { opacity:0; transform:translateY(12px); } to { opacity:1; transform:translateY(0); } }
        .user-hamburger { display:none; width:30px; height:30px; border-radius:6px; border:none; background:none; cursor:pointer; align-items:center; justify-content:center; color:var(--body); }
        .user-overlay { display:none; }
        @media (max-width:768px) {
          .user-sidebar { position:fixed; top:0; left:0; height:100vh; transform:translateX(-260px); }
          .user-sidebar.open { transform:translateX(0); }
          .user-overlay { display:block; position:fixed; inset:0; background:rgba(0,0,0,0.3); z-index:99; }
          .user-overlay.hidden { display:none; }
          .user-hamburger { display:flex; }
          .user-content { padding:16px; }
        }
      `}</style>

      <div className={`user-overlay ${sidebar ? "" : "hidden"}`} onClick={() => setSidebar(false)} />

      <aside className={`user-sidebar ${sidebar ? "open" : ""}`}>
        <div className="user-sidebar-brand">
          <div className="user-logo">NP</div>
          Kora
        </div>
        <nav className="user-nav">
          {navItems.map((item) => (
            <button key={item.id} className={`user-nav-item ${page === item.id ? "active" : ""}`} onClick={() => handleNav(item.id)}>
              {item.icon}
              {item.label}
              {item.id === "cart" && cartCount > 0 && <span className="user-nav-badge cart">{cartCount}</span>}
              {item.id === "notifications" && unread > 0 && <span className="user-nav-badge">{unread}</span>}
            </button>
          ))}
        </nav>
        <div style={{ padding: "12px 16px", borderTop: "1px solid var(--hairline)", display: "flex", alignItems: "center", gap: "8px", cursor: "pointer" }} onClick={() => { setPage("settings" as any); router.push("/user/settings"); }}>
          <div style={{ width: 30, height: 30, borderRadius: "999px", background: "linear-gradient(135deg, var(--primary), var(--primary-deep))", color: "#fff", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 11, fontWeight: 600 }}>AO</div>
          <div style={{ flex: 1, minWidth: 0 }}>
            <div style={{ fontSize: 12, fontWeight: 500, color: "var(--ink)" }}>Amara Okafor</div>
            <div style={{ fontSize: 10, color: "var(--ash)", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>amara.o@naijaplate.com</div>
          </div>
        </div>
      </aside>

      <div className="user-main">
        <header className="user-topbar">
          <button className="user-hamburger" onClick={() => setSidebar(true)}><MenuIcon /></button>
          <span className="user-topbar-title">Kora</span>
          <span className="user-topbar-sub">/ {pageLabels[page] || page}</span>
          <div className="user-topbar-spacer" />
          <button className="user-notif-btn" onClick={() => { setNotifOpen(false); setPage("notifications" as any); router.push("/user/notifications"); }} title="Notifications">
            <BellIcon size={18} />
            {unread > 0 && <span className="user-notif-dot" />}
          </button>
          <UserButton />
        </header>
        <main className="user-content">
          {children}
        </main>
      </div>

      <div className="user-toast-container">
        {toasts.map((t) => (
          <div key={t.id} className="user-toast">{t.message}</div>
        ))}
      </div>
    </div>
  );
}
