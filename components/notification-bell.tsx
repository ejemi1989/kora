"use client";

import { useState, ReactNode } from "react";

interface NotificationItem {
  id: string;
  unread: boolean;
  content: ReactNode;
}

interface NotificationBellProps {
  items: NotificationItem[];
}

export function NotificationBell({ items }: NotificationBellProps) {
  const [open, setOpen] = useState(false);
  const unreadCount = items.filter((i) => i.unread).length;

  return (
    <div className="relative">
      <button
        className="notif-btn"
        onClick={() => setOpen(!open)}
        aria-label={`Notifications${unreadCount > 0 ? ` (${unreadCount} unread)` : ""}`}
      >
        <svg
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
          className="size-4"
        >
          <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9" />
          <path d="M13.73 21a2 2 0 0 1-3.46 0" />
        </svg>
        {unreadCount > 0 && <span className="notif-dot" />}
      </button>
      {open && (
        <>
          <div
            className="fixed inset-0 z-50"
            onClick={() => setOpen(false)}
          />
          <div
            className="notif-dropdown"
            style={{ position: "absolute" }}
          >
            {items.length === 0 && (
              <div className="p-4 text-center text-xs text-[var(--ash)]">
                No notifications
              </div>
            )}
            {items.map((item) => (
              <div
                key={item.id}
                className={`notif-item${item.unread ? " unread" : ""}`}
              >
                <span
                  className={`notif-item-dot${item.unread ? " unread" : " read"}`}
                />
                <div className="flex-1 min-w-0">{item.content}</div>
              </div>
            ))}
          </div>
        </>
      )}
    </div>
  );
}
