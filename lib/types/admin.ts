export type AdminPageId =
  | "overview"
  | "notifications"
  | "users"
  | "sellers"
  | "products"
  | "orders"
  | "payments"
  | "disputes"
  | "analytics"
  | "content"
  | "currencies"
  | "settings";

export interface AdminStat {
  label: string;
  value: string;
  delta?: string;
  deltaUp?: boolean;
}

export interface AdminUser {
  id: string;
  name: string;
  email: string;
  location: string;
  joined: string;
  orders: number;
  status: "active" | "suspended" | "banned" | "pending";
}

export interface AdminSeller {
  id: string;
  business: string;
  category: string;
  products: number;
  revenue: string;
}

export interface AdminProduct {
  id: string;
  name: string;
  seller: string;
  category: string;
  price: string;
  stock: number;
  sales: number;
  createdAt: string;
  status: "active" | "pending" | "flagged";
}

export interface AdminOrder {
  id: string;
  customer: string;
  items: number;
  total: string;
  payment: string;
  date: string;
  status: "pending" | "confirmed" | "shipped" | "delivered" | "cancelled";
  trackingNumber?: string;
}

export interface AdminTransaction {
  id: string;
  customer: string;
  method: string;
  amount: string;
  date: string;
  status: "completed" | "pending" | "refunded";
}

export interface AdminDispute {
  id: string;
  buyer: string;
  seller: string;
  issue: string;
  amount: string;
  opened: string;
  priority: "high" | "medium" | "low";
  status: "open" | "resolved";
}

export interface AdminBanner {
  title: string;
  position: string;
  start: string;
  end: string;
  status: "active" | "scheduled";
}

export interface AdminCurrency {
  id: number;
  code: string;
  name: string;
  symbol: string;
  rate: number;
  status: "active" | "inactive";
}

export interface AdminNotification {
  id: number;
  title: string;
  type: "urgent" | "new" | "action" | "info" | "milestone" | "warning";
  iconBg: string;
  badge: string;
  description: string;
  time: string;
  actionLabel: string;
  actionTarget: AdminPageId;
  dismissable: boolean;
  urgent: boolean;
}
