"use client";

import { ReactNode } from "react";

interface SidebarProps {
  brand?: ReactNode;
  nav: ReactNode;
  foot?: ReactNode;
  open: boolean;
  onClose: () => void;
}

export function Sidebar({ brand, nav, foot, open, onClose }: SidebarProps) {
  return (
    <>
      <aside className={`sidebar${open ? " open" : ""}`}>
        {brand && <div className="sidebar-brand">{brand}</div>}
        <nav className="sidebar-nav">{nav}</nav>
        {foot && <div className="sidebar-foot">{foot}</div>}
      </aside>
      {open && (
        <div
          className="fixed inset-0 z-40 bg-black/20 md:hidden"
          onClick={onClose}
        />
      )}
    </>
  );
}
