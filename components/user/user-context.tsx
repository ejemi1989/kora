"use client";

import { createContext, useContext, useState, useCallback, useEffect, type ReactNode } from "react";
import type { CartItem, UserNotification, PageId, UserAddress, PaymentMethod } from "@/lib/types/user";
import { calcTotal } from "@/lib/data/user";

export interface WishlistItem {
  id: number;
  name: string;
  price: number;
  emoji?: string;
}

interface ToastMsg {
  message: string;
  type?: "success" | "danger" | "warning" | "default";
  id: number;
}

interface UserContextValue {
  page: PageId;
  setPage: (p: PageId) => void;
  sidebar: boolean;
  setSidebar: (v: boolean) => void;
  cartItems: CartItem[];
  setCartItems: React.Dispatch<React.SetStateAction<CartItem[]>>;
  notifs: UserNotification[];
  setNotifs: React.Dispatch<React.SetStateAction<UserNotification[]>>;
  notifOpen: boolean;
  setNotifOpen: (v: boolean) => void;
  toasts: ToastMsg[];
  showToast: (message: string, type?: "success" | "danger" | "warning" | "default") => void;
  addresses: UserAddress[];
  setAddresses: React.Dispatch<React.SetStateAction<UserAddress[]>>;
  paymentMethods: PaymentMethod[];
  setPaymentMethods: React.Dispatch<React.SetStateAction<PaymentMethod[]>>;
  wishlist: WishlistItem[];
  setWishlist: React.Dispatch<React.SetStateAction<WishlistItem[]>>;
  cartCount: number;
  cartTotal: number;
  addToCart: (product: { id: number; name: string; price: number; description?: string; emoji?: string; weight?: number }) => void;
}

const UserContext = createContext<UserContextValue | null>(null);

let toastId = 0;

function loadFromStorage<T>(key: string, fallback: T): T {
  if (typeof window === "undefined") return fallback;
  try {
    const saved = localStorage.getItem(key);
    if (saved) return JSON.parse(saved);
  } catch {}
  return fallback;
}

function saveToStorage(key: string, value: unknown) {
  if (typeof window !== "undefined") {
    localStorage.setItem(key, JSON.stringify(value));
  }
}

export function UserProvider({ children }: { children: ReactNode }) {
  const [page, setPage] = useState<PageId>("overview");
  const [sidebar, setSidebar] = useState(false);
  const [cartItems, setCartItems] = useState<CartItem[]>(() => {
    const saved = loadFromStorage<CartItem[]>("deni-cart", []);
    return saved.length > 0 ? saved : [];
  });

  useEffect(() => {
    saveToStorage("deni-cart", cartItems);
  }, [cartItems]);

  const [notifs, setNotifs] = useState<UserNotification[]>([]);
  const [notifOpen, setNotifOpen] = useState(false);

  const fetchNotifs = useCallback(() => {
    fetch("/api/notifications")
      .then((r) => r.json())
      .then((data) => {
        if (data.notifications) {
          setNotifs(
            data.notifications.map((n: { id: string; message: string; createdAt: string; read: boolean }) => ({
              id: n.id,
              title: n.message,
              description: "",
              time: new Date(n.createdAt).toLocaleDateString(),
              read: n.read,
            }))
          );
        }
      })
      .catch(() => {});
  }, []);

  useEffect(() => {
    fetchNotifs();
    const onFocus = () => setTimeout(fetchNotifs, 500);
    window.addEventListener("focus", onFocus);
    return () => window.removeEventListener("focus", onFocus);
  }, [fetchNotifs]);

  const [toasts, setToasts] = useState<ToastMsg[]>([]);
  const [addresses, setAddresses] = useState<UserAddress[]>(() => loadFromStorage<UserAddress[]>("deni-addresses", []));
  const [paymentMethods, setPaymentMethods] = useState<PaymentMethod[]>(() => loadFromStorage<PaymentMethod[]>("deni-payment-methods", []));
  const [wishlist, setWishlist] = useState<WishlistItem[]>(() => loadFromStorage<WishlistItem[]>("deni-wishlist", []));

  useEffect(() => { saveToStorage("deni-addresses", addresses); }, [addresses]);
  useEffect(() => { saveToStorage("deni-payment-methods", paymentMethods); }, [paymentMethods]);
  useEffect(() => { saveToStorage("deni-wishlist", wishlist); }, [wishlist]);

  const showToast = useCallback((message: string, type: "success" | "danger" | "warning" | "default" = "default") => {
    const id = ++toastId;
    setToasts((prev) => [...prev, { message, type, id }]);
    setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id));
    }, 2600);
  }, []);

  const cartCount = cartItems.reduce((sum, i) => sum + i.qty, 0);
  const cartTotal = calcTotal(cartItems);

  const addToCart = useCallback((product: { id: number; name: string; price: number; description?: string; emoji?: string; weight?: number }) => {
    setCartItems((prev) => {
      const existing = prev.find((i) => i.id === product.id);
      if (existing) {
        return prev.map((i) => (i.id === product.id ? { ...i, qty: i.qty + 1 } : i));
      }
      return [...prev, { id: product.id, name: product.name, description: product.description || "", qty: 1, unitPrice: product.price, weight: product.weight ?? 0, emoji: product.emoji || "\uD83D\uDCE6" }];
    });
  }, []);

  return (
    <UserContext.Provider
      value={{
        page, setPage, sidebar, setSidebar,
        cartItems, setCartItems, notifs, setNotifs,
        notifOpen, setNotifOpen, toasts, showToast,
        addresses, setAddresses, paymentMethods, setPaymentMethods, wishlist, setWishlist,
        cartCount, cartTotal, addToCart,
      }}
    >
      {children}
    </UserContext.Provider>
  );
}

export function useUser() {
  const ctx = useContext(UserContext);
  if (!ctx) throw new Error("useUser must be used within UserProvider");
  return ctx;
}
