import type {
  UserProduct,
  CartItem,
  UserOrder,
  TrackingEvent,
  UserAddress,
  PaymentMethod,
  Transaction,
  UserNotification,
} from "@/lib/types/user";

export const PRODUCTS: UserProduct[] = [
  { id: 1, name: "Gari Ijebu", category: "Grains & Rice", price: 10000, weight: 1.0, tag: "popular", rating: 4.7, description: "1kg · Premium fine Ijebu Garri", emoji: "🌾" },
  { id: 2, name: "Ofada Rice", category: "Grains & Rice", price: 15000, weight: 1.0, tag: "popular", rating: 4.8, description: "1kg · Authentic local Ofada rice", emoji: "🍚" },
  { id: 3, name: "Yam", category: "Vegetables", price: 8000, weight: 1.0, rating: 4.5, description: "1kg · Large organic white yam tuber", emoji: "🍠" },
  { id: 4, name: "Cocoa Yam", category: "Vegetables", price: 8000, weight: 1.0, rating: 4.4, description: "1kg · Fresh cocoyam tubers", emoji: "🍠" },
  { id: 5, name: "Water Yam", category: "Vegetables", price: 6000, weight: 1.0, rating: 4.3, description: "1kg · Premium water yam tubers", emoji: "🍠" },
  { id: 6, name: "Yam Flour", category: "Grains & Rice", price: 10000, weight: 1.0, rating: 4.6, description: "1kg · Premium elubo for Amala", emoji: "🫓" },
  { id: 7, name: "Cassava Flour", category: "Grains & Rice", price: 6000, weight: 1.0, rating: 4.4, description: "1kg · High quality cassava flour", emoji: "🫓" },
  { id: 8, name: "Dried Cray Fish", category: "Fish & Seafood", price: 20000, weight: 1.0, tag: "popular", rating: 4.9, description: "1kg · Properly sun-dried whole crayfish", emoji: "🦐" },
  { id: 9, name: "Snails", category: "Fish & Seafood", price: 24000, weight: 1.0, tag: "popular", rating: 4.8, description: "1kg · Large, clean land snails", emoji: "🐌" },
  { id: 10, name: "Fresh Plantain", category: "Vegetables", price: 10000, weight: 1.0, rating: 4.6, description: "1kg · Sweet, fresh plantains", emoji: "🍌" },
  { id: 11, name: "Processed Egusi", category: "Spices & Seasoning", price: 10000, weight: 1.0, rating: 4.7, description: "1kg · Pre-ground peeled melon seeds", emoji: "🥣" },
  { id: 12, name: "Processed Ogbono", category: "Spices & Seasoning", price: 15000, weight: 1.0, rating: 4.7, description: "1kg · Pure ground Ogbono seeds", emoji: "🥣" },
  { id: 13, name: "Processed Groundnuts", category: "Snacks", price: 15000, weight: 1.0, rating: 4.5, description: "1kg · Roasted crunchy peanuts", emoji: "🥜" },
  { id: 14, name: "Red Palm Oil", category: "Oils & Condiments", price: 8000, weight: 1.0, rating: 4.8, description: "1kg · Pure traditional red palm oil", emoji: "🫒" },
  { id: 15, name: "Dried Fish (Pala, Sawa, Agbodo)", category: "Fish & Seafood", price: 10000, weight: 1.0, rating: 4.7, description: "1kg · Dry fish assortment for native soups", emoji: "🐟" },
];

export const CATEGORIES = [
  "All",
  "Grains & Rice",
  "Snacks",
  "Soups & Stews",
  "Spices & Seasoning",
  "Fish & Seafood",
  "Beverages",
  "Oils & Condiments",
  "Vegetables",
];

export const INITIAL_CART: CartItem[] = [
  { id: 11, name: "Processed Egusi", description: "1kg · Pre-ground peeled melon seeds", qty: 2, unitPrice: 10000, weight: 1.0, emoji: "🥣" },
  { id: 14, name: "Red Palm Oil", description: "1kg · Pure traditional red palm oil", qty: 1, unitPrice: 8000, weight: 1.0, emoji: "🫒" },
  { id: 13, name: "Processed Groundnuts", description: "1kg · Roasted crunchy peanuts", qty: 3, unitPrice: 15000, weight: 1.0, emoji: "🥜" },
  { id: 8, name: "Dried Cray Fish", description: "1kg · Properly sun-dried whole crayfish", qty: 1, unitPrice: 20000, weight: 1.0, emoji: "🦐" },
];

export const ORDERS: UserOrder[] = [
  { id: "NP-3842", items: "Processed Egusi · Gari Ijebu · Processed Ogbono", date: "May 24", amount: 47000, status: "delivered", thumb: "🥣", trackingNumber: "TRK-3842" },
  { id: "NP-3841", items: "Red Palm Oil · Processed Groundnuts · Snails", date: "May 23", amount: 32500, status: "shipped", thumb: "🫒", trackingNumber: "TRK-3841" },
  { id: "NP-3840", items: "Cassava Flour · Processed Ogbono · Dried Fish (Pala, Sawa, Agbodo)", date: "May 22", amount: 28800, status: "packed", thumb: "🫓", trackingNumber: "TRK-3840" },
  { id: "NP-3839", items: "Processed Groundnuts · Yam Flour", date: "May 21", amount: 19950, status: "confirmed", thumb: "🥜" },
  { id: "NP-3838", items: "Dried Fish (Pala, Sawa, Agbodo) · Cassava Flour", date: "May 20", amount: 38400, status: "delivered", thumb: "🐟", trackingNumber: "TRK-3838" },
  { id: "NP-3837", items: "Gari Ijebu · Red Palm Oil", date: "May 19", amount: 15600, status: "delivered", thumb: "🌾", trackingNumber: "TRK-3837" },
];

export const TRACKING_EVENTS: TrackingEvent[] = [
  { step: 1, label: "Order Confirmed", description: "Payment was verified", time: "May 23, 09:14 AM", status: "done" },
  { step: 2, label: "Preparing at Warehouse", description: "Items being picked and packed", time: "May 23, 02:30 PM", status: "done" },
  { step: 3, label: "Packed & Labelled", description: "Package ready for dispatch", time: "May 24, 10:00 AM", status: "done" },
  { step: 4, label: "Out for Delivery", description: "Rider has picked up your package", time: "May 25, 08:15 AM", status: "active" },
  { step: 5, label: "Delivered", description: "Package delivered to your address", time: "Expected today", status: "pending" },
];

export const ADDRESSES: UserAddress[] = [
  { id: 1, tag: "Home", name: "Amara Okafor", address: "14 Bode Thomas Street, Surulere, Lagos 101241", phone: "+234 803 456 7890", isDefault: true },
  { id: 2, tag: "Office", name: "Amara Okafor", address: "Plot 1682, Sanusi Fafunwa Street, Victoria Island, Lagos", phone: "+234 803 456 7890", isDefault: false },
  { id: 3, tag: "Parents", name: "Mrs. Chioma Okafor", address: "22 Awolowo Road, Ikeja, Lagos 100271", phone: "+234 802 345 6789", isDefault: false },
];

export const PAYMENT_METHODS: PaymentMethod[] = [
  { name: "Visa Platinum", details: "···· 4829 · exp 08/27", type: "Card", isDefault: true },
  { name: "OPay Wallet", details: "234 803 456 7890", type: "Mobile", isDefault: false },
  { name: "GTBank", details: "012 345 6789", type: "Bank", isDefault: false },
];

export const TRANSACTIONS: Transaction[] = [
  { name: "Processed Egusi", ref: "NP-3842", amount: 47000, type: "debit", date: "May 24", method: "Visa ···· 4829" },
  { name: "Wallet Top-up", ref: "WAL-8891", amount: 100000, type: "credit", date: "May 23", method: "Bank Transfer" },
  { name: "Red Palm Oil", ref: "NP-3841", amount: 32500, type: "debit", date: "May 23", method: "Visa ···· 4829" },
  { name: "Cassava Flour + Processed Ogbono", ref: "NP-3840", amount: 28800, type: "debit", date: "May 22", method: "OPay" },
  { name: "Cashback Reward", ref: "CB-APR", amount: 5000, type: "credit", date: "May 20", method: "Wallet Credit" },
  { name: "Processed Groundnuts", ref: "NP-3839", amount: 19950, type: "debit", date: "May 21", method: "Visa ···· 4829" },
];

export const NOTIFICATIONS: UserNotification[] = [
  { id: 1, title: "Order NP-3842 Delivered", description: "Processed Egusi has arrived at your door", time: "2 hours ago", read: false },
  { id: 2, title: "NP-3841 on the way", description: "Your Red Palm Oil is out for delivery", time: "5 hours ago", read: false },
  { id: 3, title: "Flash Sale: 20% off Grains", description: "Rice, beans, yam flour — stock up and save", time: "1 day ago", read: false },
  { id: 4, title: "Order NP-3840 Packed", description: "Your order is being prepared at the warehouse", time: "1 day ago", read: false },
  { id: 5, title: "New: Chef's Special Box", description: "Curated ingredients for Processed Egusi + Cassava Flour", time: "3 days ago", read: true },
  { id: 6, title: "Referral Bonus Earned", description: "You earned £1,500 — Tunde signed up with your link", time: "5 days ago", read: true },
];

export const WISHLIST_INITIAL = [
  { id: 12, name: "Processed Ogbono", price: 15000, emoji: "🥣" },
  { id: 15, name: "Dried Fish (Pala, Sawa, Agbodo)", price: 10000, emoji: "🐟" },
  { id: 11, name: "Processed Egusi", price: 10000, emoji: "🥣" },
  { id: 13, name: "Processed Groundnuts", price: 15000, emoji: "🥜" },
  { id: 14, name: "Red Palm Oil", price: 8000, emoji: "🫒" },
];

export const DELIVERY_FEE_THRESHOLD = 50;
export const MIN_ORDER_KG = 40;

export function calcSubtotal(items: CartItem[]): number {
  return items.reduce((sum, i) => sum + i.unitPrice * i.qty, 0);
}

export function calcDelivery(subtotal: number, itemCount: number): number {
  return subtotal > DELIVERY_FEE_THRESHOLD || itemCount === 0 ? 0 : 4.99;
}

export function calcTotal(items: CartItem[]): number {
  const sub = calcSubtotal(items);
  return sub + calcDelivery(sub, items.length);
}

export function calcTotalWeight(items: CartItem[]): number {
  return items.reduce((sum, i) => sum + i.weight * i.qty, 0);
}
