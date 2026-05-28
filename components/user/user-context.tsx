"use client";

import { createContext, useContext, useState, useCallback, type ReactNode } from "react";
import type { CartItem, UserNotification, PageId, UserAddress, PaymentMethod } from "@/lib/types/user";
import { INITIAL_CART, NOTIFICATIONS, ADDRESSES, PAYMENT_METHODS, TRANSACTIONS, WISHLIST_INITIAL, calcTotal } from "@/lib/data/user";

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
  wishlist: WishlistItem[];
  setWishlist: React.Dispatch<React.SetStateAction<WishlistItem[]>>;
  cartCount: number;
  cartTotal: number;
  addToCart: (product: { id: number; name: string; price: number; description?: string; emoji?: string }) => void;
}

const UserContext = createContext<UserContextValue | null>(null);

let toastId = 0;

export function UserProvider({ children }: { children: ReactNode }) {
  const [page, setPage] = useState<PageId>("overview");
  const [sidebar, setSidebar] = useState(false);
  const [cartItems, setCartItems] = useState<CartItem[]>(INITIAL_CART);
  const [notifs, setNotifs] = useState<UserNotification[]>(NOTIFICATIONS);
  const [notifOpen, setNotifOpen] = useState(false);
  const [toasts, setToasts] = useState<ToastMsg[]>([]);
  const [addresses, setAddresses] = useState<UserAddress[]>(ADDRESSES);
  const [paymentMethods] = useState<PaymentMethod[]>(PAYMENT_METHODS);
  const [wishlist, setWishlist] = useState<WishlistItem[]>(WISHLIST_INITIAL);

  const showToast = useCallback((message: string, type: "success" | "danger" | "warning" | "default" = "default") => {
    const id = ++toastId;
    setToasts((prev) => [...prev, { message, type, id }]);
    setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id));
    }, 2600);
  }, []);

  const cartCount = cartItems.reduce((sum, i) => sum + i.qty, 0);
  const cartTotal = calcTotal(cartItems);

  const addToCart = useCallback((product: { id: number; name: string; price: number; description?: string; emoji?: string }) => {
    setCartItems((prev) => {
      const existing = prev.find((i) => i.id === product.id);
      if (existing) {
        return prev.map((i) => (i.id === product.id ? { ...i, qty: i.qty + 1 } : i));
      }
      return [...prev, { id: product.id, name: product.name, description: product.description || "", qty: 1, unitPrice: product.price, emoji: product.emoji || "\uD83D\uDCE6" }];
    });
  }, []);

  return (
    <UserContext.Provider
      value={{
        page, setPage, sidebar, setSidebar,
        cartItems, setCartItems, notifs, setNotifs,
        notifOpen, setNotifOpen, toasts, showToast,
        addresses, setAddresses, paymentMethods, wishlist, setWishlist,
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
