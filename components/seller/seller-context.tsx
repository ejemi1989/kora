"use client";

import { createContext, useContext, useState, useCallback, type ReactNode } from "react";
import type { SellerPageId } from "@/lib/types/seller";
import { SELLER_REVIEWS } from "@/lib/data/seller";

interface ToastMsg {
  message: string;
  type?: "success" | "error" | "default";
  id: number;
}

interface SellerContextValue {
  page: SellerPageId;
  setPage: (p: SellerPageId) => void;
  sidebar: boolean;
  setSidebar: (v: boolean) => void;
  toasts: ToastMsg[];
  showToast: (message: string, type?: "success" | "error" | "default") => void;
  reviews: typeof SELLER_REVIEWS;
  setReviews: React.Dispatch<React.SetStateAction<typeof SELLER_REVIEWS>>;
  modal: { open: boolean; title: string; content: ReactNode };
  openModal: (title: string, content: ReactNode) => void;
  closeModal: () => void;
}

const SellerContext = createContext<SellerContextValue | null>(null);

let toastId = 0;

export function SellerProvider({ children }: { children: ReactNode }) {
  const [page, setPage] = useState<SellerPageId>("overview");
  const [sidebar, setSidebar] = useState(false);
  const [toasts, setToasts] = useState<ToastMsg[]>([]);
  const [reviews, setReviews] = useState<typeof SELLER_REVIEWS>(SELLER_REVIEWS);
  const [modal, setModal] = useState<{ open: boolean; title: string; content: ReactNode }>({ open: false, title: "", content: null });

  const showToast = useCallback((message: string, type: "success" | "error" | "default" = "default") => {
    const id = ++toastId;
    setToasts((prev) => [...prev, { message, type, id }]);
    setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id));
    }, 2500);
  }, []);

  const openModal = useCallback((title: string, content: ReactNode) => {
    setModal({ open: true, title, content });
  }, []);

  const closeModal = useCallback(() => {
    setModal({ open: false, title: "", content: null });
  }, []);

  return (
    <SellerContext.Provider value={{ page, setPage, sidebar, setSidebar, toasts, showToast, reviews, setReviews, modal, openModal, closeModal }}>
      {children}
    </SellerContext.Provider>
  );
}

export function useSeller() {
  const ctx = useContext(SellerContext);
  if (!ctx) throw new Error("useSeller must be used within SellerProvider");
  return ctx;
}
