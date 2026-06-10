"use client";

import type { ReactNode } from "react";
import { useRouter } from "next/navigation";
import { UserButton } from "@clerk/nextjs";
import { useSeller } from "@/components/seller/seller-context";
import {
  HomeIcon, BellIcon, StoreIcon, ListIcon, PackageIcon,
  BarChartIcon, CardIcon, HeartIcon, StarIcon, TagIcon,
  SettingsIcon, MenuIcon, XIcon, SearchIcon,
} from "@/components/user/icons";

const navGroups: { label?: string; items: { id: string; label: string; icon: ReactNode }[] }[] = [
  {
    label: "Main",
    items: [
      { id: "overview", label: "Overview", icon: <HomeIcon size={16} /> },
      { id: "products", label: "Products", icon: <PackageIcon size={16} /> },
      { id: "orders", label: "Orders", icon: <ListIcon size={16} /> },
      { id: "inventory", label: "Inventory", icon: <StoreIcon size={16} /> },
    ],
  },
  {
    label: "Insights",
    items: [
      { id: "analytics", label: "Analytics", icon: <BarChartIcon size={16} /> },
      { id: "payouts", label: "Payouts", icon: <CardIcon size={16} /> },
    ],
  },
  {
    label: "Community",
    items: [
      { id: "customers", label: "Customers", icon: <HeartIcon size={16} /> },
      { id: "reviews", label: "Reviews", icon: <StarIcon size={16} /> },
    ],
  },
  {
    label: "Growth",
    items: [
      { id: "promotions", label: "Promotions", icon: <TagIcon size={16} /> },
      { id: "settings", label: "Settings", icon: <SettingsIcon size={16} /> },
    ],
  },
];

export function SellerShell({ children }: { children: ReactNode }) {
  const { page, setPage, sidebar, setSidebar, toasts, modal, closeModal, showToast } = useSeller();
  const router = useRouter();

  function handleNav(id: string) {
    setPage(id as any);
    router.push(`/seller/${id}`);
    setSidebar(false);
  }

  const panelLabels: Record<string, string> = {
    overview: "Overview", products: "Products", orders: "Orders",
    inventory: "Inventory", analytics: "Analytics", payouts: "Payouts",
    customers: "Customers", reviews: "Reviews", promotions: "Promotions",
    settings: "Settings",
  };

  const toastColors: Record<string, string> = {
    success: "#0070f3", error: "#ee0000", default: "#171717",
  };

  return (
    <div className="seller-app">
      <style>{`
        .seller-app { display:flex; height:100vh; overflow:hidden; font-family:var(--font); }
        .seller-app * { box-sizing:border-box; }
        .seller-sidebar-overlay { display:none; }
        .seller-sidebar { width:240px; min-width:240px; background:#fff; border-right:1px solid var(--hairline); display:flex; flex-direction:column; z-index:100; transition:transform 250ms cubic-bezier(0.4,0,0.2,1); }
        .seller-sidebar-brand { height:52px; display:flex; align-items:center; gap:8px; padding:0 16px; border-bottom:1px solid var(--hairline); font-size:14px; font-weight:600; color:var(--ink); }
        .seller-logo { width:28px; height:28px; border-radius:var(--radius-sm); background:var(--primary); color:#fff; display:flex; align-items:center; justify-content:center; font-size:12px; font-weight:700; }
        .seller-wordmark { color:var(--ink); }
        .seller-wordmark span { color:var(--primary); }
        .seller-sidebar-nav { flex:1; overflow-y:auto; padding:4px 0; }
        .seller-nav-group-label { font-family:var(--font-mono); font-size:10px; font-weight:500; text-transform:uppercase; letter-spacing:0.06em; color:var(--ash); padding:12px 16px 4px; }
        .seller-nav-item { display:flex; align-items:center; gap:8px; padding:7px 16px; font-size:13px; color:var(--body); cursor:pointer; border:none; background:none; width:100%; text-align:left; transition:all 150ms; border-radius:0; }
        .seller-nav-item:hover { background:var(--primary-bg); color:var(--primary); }
        .seller-nav-item.active { background:var(--primary-bg); color:var(--primary); font-weight:500; }
        .seller-nav-item svg { flex-shrink:0; }
        .seller-sidebar-footer { padding:12px 16px; border-top:1px solid var(--hairline); }
        .seller-logout { display:flex; align-items:center; gap:8px; padding:6px 0; font-size:13px; color:var(--muted-text); cursor:pointer; border:none; background:none; width:100%; text-align:left; }
        .seller-logout:hover { color:var(--danger); }
        .seller-main { flex:1; display:flex; flex-direction:column; min-width:0; }
        .seller-topbar { height:52px; display:flex; align-items:center; gap:12px; padding:0 24px; border-bottom:1px solid var(--hairline); background:#fff; }
        .seller-topbar-title { font-size:14px; font-weight:500; color:var(--ink); }
        .seller-topbar-sep { font-size:12px; color:var(--stone); }
        .seller-topbar-current { font-size:13px; color:var(--muted-text); }
        .seller-topbar-spacer { flex:1; }
        .seller-topbar-search { position:relative; width:200px; }
        .seller-topbar-search input { width:100%; height:30px; padding:0 8px 0 28px; border:1px solid var(--hairline); border-radius:var(--radius-sm); font-size:12px; outline:none; background:var(--canvas); }
        .seller-topbar-search input:focus { border-color:var(--primary); box-shadow:0 0 0 3px var(--primary-bg); }
        .seller-topbar-search svg { position:absolute; left:7px; top:50%; transform:translateY(-50%); color:var(--stone); pointer-events:none; }
        .seller-avatar-btn { width:28px; height:28px; border-radius:6px; border:none; background:var(--primary); color:#fff; font-size:10px; font-weight:600; cursor:pointer; display:flex; align-items:center; justify-content:center; }
        .seller-content { flex:1; overflow-y:auto; padding:24px 28px; background:var(--canvas); }
        .seller-content::-webkit-scrollbar { width:6px; }
        .seller-content::-webkit-scrollbar-track { background:transparent; }
        .seller-content::-webkit-scrollbar-thumb { background:var(--primary); border-radius:4px; }
        .seller-toast-container { position:fixed; bottom:20px; right:20px; z-index:200; display:flex; flex-direction:column; align-items:flex-end; gap:8px; pointer-events:none; }
        .seller-toast { padding:10px 18px; border-radius:6px; color:#fff; font-size:12.5px; font-weight:500; animation:sellerToastIn 250ms ease; pointer-events:auto; max-width:360px; box-shadow:var(--shadow-modal); }
        @keyframes sellerToastIn { from { opacity:0; transform:translateX(100%); } to { opacity:1; transform:translateX(0); } }
        .seller-hamburger { display:none; width:30px; height:30px; border-radius:6px; border:none; background:none; cursor:pointer; align-items:center; justify-content:center; color:var(--body); }
        .seller-modal-overlay { position:fixed; inset:0; background:rgba(23,23,23,0.3); z-index:200; display:flex; align-items:center; justify-content:center; padding:16px; }
        .seller-modal { background:#fff; border-radius:12px; max-width:480px; width:100%; max-height:calc(100vh - 64px); overflow-y:auto; box-shadow:var(--shadow-modal); }
        .seller-modal-h { display:flex; align-items:center; justify-content:space-between; padding:16px 20px; border-bottom:1px solid var(--hairline); }
        .seller-modal-h h2 { font-size:15px; font-weight:600; color:var(--ink); margin:0; }
        .seller-modal-close { width:28px; height:28px; border-radius:6px; border:none; background:none; cursor:pointer; display:flex; align-items:center; justify-content:center; color:var(--muted-text); }
        .seller-modal-close:hover { background:var(--surface-soft); }
        .seller-modal-b { padding:20px; }
        .seller-modal-actions { display:flex; justify-content:flex-end; gap:8px; margin-top:16px; }
        @media (max-width:768px) {
          .seller-sidebar-overlay { display:block; position:fixed; inset:0; background:rgba(0,0,0,0.3); z-index:99; }
          .seller-sidebar-overlay.hidden { display:none; }
          .seller-sidebar { position:fixed; top:0; left:0; height:100vh; transform:translateX(-260px); }
          .seller-sidebar.open { transform:translateX(0); }
          .seller-hamburger { display:flex; }
          .seller-content { padding:16px; }
          .seller-topbar-search { width:140px; }
        }
        @media (max-width:480px) {
          .seller-topbar-search { display:none; }
        }
      `}</style>

      <div className={`seller-sidebar-overlay ${sidebar ? "" : "hidden"}`} onClick={() => setSidebar(false)} />

      <aside className={`seller-sidebar ${sidebar ? "open" : ""}`}>
        <div className="seller-sidebar-brand">
          <div className="seller-logo">A</div>
          <span className="seller-wordmark">Deni</span>
        </div>
        <nav className="seller-sidebar-nav">
          {navGroups.map((group) => (
            <div key={group.label || "top"}>
              {group.label && <div className="seller-nav-group-label">{group.label}</div>}
              {group.items.map((item) => (
                <button
                  key={item.id}
                  className={`seller-nav-item ${page === item.id ? "active" : ""}`}
                  onClick={() => handleNav(item.id)}
                >
                  {item.icon}
                  {item.label}
                </button>
              ))}
            </div>
          ))}
        </nav>
      </aside>

      <div className="seller-main">
        <header className="seller-topbar">
          <button className="seller-hamburger" onClick={() => setSidebar(true)}><MenuIcon /></button>
          <span className="seller-topbar-title">Deni</span>
          <span className="seller-topbar-sep">/</span>
          <span className="seller-topbar-current">{panelLabels[page] || page}</span>
          <div className="seller-topbar-spacer" />
          <div className="seller-topbar-search">
            <SearchIcon size={14} />
            <input placeholder="Search products..." />
          </div>
          <UserButton />
        </header>
        <main className="seller-content">
          {children}
        </main>
      </div>

      <div className="seller-toast-container">
        {toasts.map((t) => (
          <div key={t.id} className="seller-toast" style={{ background: toastColors[t.type || "default"] }}>{t.message}</div>
        ))}
      </div>

      {modal.open && (
        <div className="seller-modal-overlay" onClick={closeModal}>
          <div className="seller-modal" onClick={(e) => e.stopPropagation()}>
            <div className="seller-modal-h">
              <h2>{modal.title}</h2>
              <button className="seller-modal-close" onClick={closeModal}><XIcon size={16} /></button>
            </div>
            <div className="seller-modal-b">
              {modal.content}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
