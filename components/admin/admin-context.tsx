"use client";

import { createContext, useContext, useState, useCallback, type ReactNode } from "react";
import type { AdminPageId, AdminNotification } from "@/lib/types/admin";
import { ADMIN_NOTIFICATIONS } from "@/lib/data/admin";

interface ToastMsg {
  message: string;
  type?: "success" | "danger" | "warning" | "default";
  id: number;
}

interface AdminContextValue {
  page: AdminPageId;
  setPage: (p: AdminPageId) => void;
  sidebar: boolean;
  setSidebar: (v: boolean) => void;
  toasts: ToastMsg[];
  showToast: (message: string, type?: "success" | "danger" | "warning" | "default") => void;
  notifs: AdminNotification[];
  setNotifs: React.Dispatch<React.SetStateAction<AdminNotification[]>>;
  modal: { open: boolean; title: string; content: ReactNode };
  openModal: (title: string, content: ReactNode) => void;
  closeModal: () => void;
}

const AdminContext = createContext<AdminContextValue | null>(null);

let toastId = 0;

export function AdminProvider({ children }: { children: ReactNode }) {
  const [page, setPage] = useState<AdminPageId>("overview");
  const [sidebar, setSidebar] = useState(false);
  const [toasts, setToasts] = useState<ToastMsg[]>([]);
  const [notifs, setNotifs] = useState<AdminNotification[]>(ADMIN_NOTIFICATIONS);
  const [modal, setModal] = useState<{ open: boolean; title: string; content: ReactNode }>({ open: false, title: "", content: null });

  const showToast = useCallback((message: string, type: "success" | "danger" | "warning" | "default" = "default") => {
    const id = ++toastId;
    setToasts((prev) => [...prev, { message, type, id }]);
    setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id));
    }, 3000);
  }, []);

  const openModal = useCallback((title: string, content: ReactNode) => {
    setModal({ open: true, title, content });
  }, []);

  const closeModal = useCallback(() => {
    setModal({ open: false, title: "", content: null });
  }, []);

  return (
    <AdminContext.Provider value={{ page, setPage, sidebar, setSidebar, toasts, showToast, notifs, setNotifs, modal, openModal, closeModal }}>
      {children}
    </AdminContext.Provider>
  );
}

export function useAdmin() {
  const ctx = useContext(AdminContext);
  if (!ctx) throw new Error("useAdmin must be used within AdminProvider");
  return ctx;
}
