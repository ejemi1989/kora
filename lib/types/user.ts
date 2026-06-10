export interface UserProduct {
  id: string;
  name: string;
  category: string;
  price: number;
  origPrice?: number;
  tag?: "popular" | "sale" | "new";
  rating: number;
  description?: string;
  emoji: string;
}

export interface CartItem {
  id: string;
  name: string;
  description: string;
  qty: number;
  unitPrice: number;
  emoji: string;
}

export interface UserOrder {
  id: string;
  items: string;
  date: string;
  amount: number;
  status: "confirmed" | "packed" | "shipped" | "delivered" | "cancelled";
  thumb: string;
  trackingNumber?: string;
}

export interface TrackingEvent {
  step: number;
  label: string;
  description: string;
  time: string;
  status: "done" | "active" | "pending";
}

export interface UserAddress {
  id: number;
  tag: string;
  name: string;
  address: string;
  phone?: string;
  isDefault: boolean;
}

export interface PaymentMethod {
  name: string;
  details: string;
  type: "Card" | "Mobile" | "Bank";
  isDefault: boolean;
}

export interface Transaction {
  name: string;
  ref: string;
  amount: number;
  type: "debit" | "credit";
  date: string;
  method: string;
}

export interface UserNotification {
  id: number;
  title: string;
  description: string;
  time: string;
  read: boolean;
}

export type PageId =
  | "overview"
  | "shop"
  | "orders"
  | "tracking"
  | "cart"
  | "wishlist"
  | "addresses"
  | "payments"
  | "notifications"
  | "settings";
