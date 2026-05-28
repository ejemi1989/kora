export type SellerPageId =
  | "overview"
  | "products"
  | "orders"
  | "inventory"
  | "analytics"
  | "payouts"
  | "customers"
  | "reviews"
  | "promotions"
  | "settings";

export interface SellerStat {
  label: string;
  value: string;
  delta?: string;
  deltaUp?: boolean;
}

export interface SellerProduct {
  id: number;
  name: string;
  emoji: string;
  category: string;
  price: number;
  stock: number;
  available: number;
  sales: number;
  status: "active" | "draft" | "out_of_stock";
}

export interface SellerOrder {
  id: string;
  customer: string;
  items: number;
  product: string;
  total: number;
  date: string;
  status: "delivered" | "shipped" | "processing" | "pending" | "cancelled";
}

export interface SellerInventoryItem {
  id: number;
  name: string;
  emoji: string;
  category: string;
  stock: number;
  available: number;
  threshold: number;
  status: "ok" | "low" | "critical";
}

export interface SellerAnalytic {
  month: string;
  revenue: number;
  orders: number;
  fill: boolean;
  height: number;
}

export interface SellerPayout {
  id: string;
  date: string;
  amount: number;
  status: "completed" | "pending" | "processing";
}

export interface SellerCustomer {
  id: string;
  name: string;
  email: string;
  initials: string;
  orders: number;
  spent: number;
  last: string;
  status: "Regular" | "New";
  phone: string;
  location: string;
  joined: string;
  bg: string;
  fg: string;
  history: { order: string; product: string; amount: string; status: string; statusClass: string; date: string }[];
}

export interface SellerReview {
  id: number;
  customer: string;
  product: string;
  rating: number;
  text: string;
  date: string;
  replied: boolean;
  replyText?: string;
}

export interface SellerPromotion {
  code: string;
  discount: string;
  details: string;
  ends: string;
  status: "active" | "scheduled" | "draft";
}
