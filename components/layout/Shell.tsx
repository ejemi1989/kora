"use client";

import { ReactNode, useState } from "react";
import { Sidebar } from "./Sidebar";
import { Topbar } from "./Topbar";

interface ShellProps {
  brand?: ReactNode;
  nav: ReactNode;
  foot?: ReactNode;
  topbar?: ReactNode;
  children: ReactNode;
}

export function Shell({ brand, nav, foot, topbar, children }: ShellProps) {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <div className="app">
      <Sidebar
        brand={brand}
        nav={nav}
        foot={foot}
        open={sidebarOpen}
        onClose={() => setSidebarOpen(false)}
      />
      <div className="main">
        {topbar && (
          <Topbar toggle={<SidebarToggle onToggle={() => setSidebarOpen((p) => !p)} />}>
            {topbar}
          </Topbar>
        )}
        <main className="content">{children}</main>
      </div>
    </div>
  );
}

function SidebarToggle({ onToggle }: { onToggle: () => void }) {
  return (
    <button
      className="btn btn-ico btn-g md:hidden"
      onClick={onToggle}
      aria-label="Toggle sidebar"
    >
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="size-4">
        <line x1="3" y1="6" x2="21" y2="6" />
        <line x1="3" y1="12" x2="21" y2="12" />
        <line x1="3" y1="18" x2="21" y2="18" />
      </svg>
    </button>
  );
}
