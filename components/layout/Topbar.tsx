"use client";

import { ReactNode } from "react";

interface TopbarProps {
  children?: ReactNode;
  toggle?: ReactNode;
}

export function Topbar({ children, toggle }: TopbarProps) {
  return (
    <div className="topbar">
      {toggle && <div className="topbar-toggle">{toggle}</div>}
      {children && <div className="topbar-content">{children}</div>}
    </div>
  );
}
