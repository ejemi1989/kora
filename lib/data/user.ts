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
  { id: 101, name: "Jollof Rice Party Pack", category: "Grains & Rice", price: 14.99, tag: "popular", rating: 4.8, description: "2.5kg · Feeds 8-10", emoji: "\uD83C\uDF5A" },
  { id: 102, name: "Suya Spice Set", category: "Spices & Seasoning", price: 8.50, origPrice: 10.00, tag: "sale", rating: 4.9, description: "180g · Signature blend", emoji: "\uD83C\uDF36\uFE0F" },
  { id: 103, name: "Plantain Chips (3 pk)", category: "Snacks", price: 4.99, tag: "popular", rating: 4.5, description: "Spicy · Sweet · Garlic", emoji: "\uD83C\uDF4C" },
  { id: 104, name: "Egusi Soup Mix", category: "Soups & Stews", price: 6.75, rating: 4.6, description: "500g · Pre-ground", emoji: "\uD83E\uDD63" },
  { id: 105, name: "Ogbono Powder", category: "Soups & Stews", price: 7.20, rating: 4.7, emoji: "\uD83C\uDF30" },
  { id: 106, name: "Smoked Catfish", category: "Fish & Seafood", price: 12.50, tag: "popular", rating: 4.9, emoji: "\uD83D\uDC1F" },
  { id: 107, name: "Fufu Flour", category: "Grains & Rice", price: 5.50, rating: 4.4, emoji: "\uD83E\uDD63" },
  { id: 108, name: "Zobo Drink Mix", category: "Beverages", price: 4.50, tag: "new", rating: 4.3, emoji: "\uD83E\uDED0" },
  { id: 109, name: "Coconut Rice", category: "Grains & Rice", price: 6.80, rating: 4.5, emoji: "\uD83E\uDD65" },
  { id: 110, name: "Groundnut Cake", category: "Snacks", price: 3.50, rating: 4.2, emoji: "\uD83E\uDD5C" },
  { id: 111, name: "Palm Oil (1L)", category: "Oils & Condiments", price: 5.90, rating: 4.6, emoji: "\uD83D\uDFE0" },
  { id: 112, name: "Garri (Ijebu)", category: "Grains & Rice", price: 4.20, tag: "popular", rating: 4.7, emoji: "\uD83C\uDF3E" },
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
];

export const INITIAL_CART: CartItem[] = [
  { id: 101, name: "Jollof Rice Party Pack", description: "2.5kg · Feeds 8-10", qty: 2, unitPrice: 14.99, emoji: "\uD83C\uDF5A" },
  { id: 102, name: "Suya Spice Set", description: "180g · Signature blend", qty: 1, unitPrice: 8.50, emoji: "\uD83C\uDF36\uFE0F" },
  { id: 103, name: "Plantain Chips (3 pk)", description: "Spicy · Sweet · Garlic", qty: 3, unitPrice: 4.99, emoji: "\uD83C\uDF4C" },
  { id: 104, name: "Egusi Soup Mix", description: "500g · Pre-ground", qty: 1, unitPrice: 6.75, emoji: "\uD83E\uDD63" },
];

export const ORDERS: UserOrder[] = [
  { id: "NP-3842", items: "Jollof Rice Party Pack · Garri · Egusi Soup Mix", date: "May 24", amount: 47.20, status: "delivered", thumb: "\uD83C\uDF5A", trackingNumber: "TRK-3842" },
  { id: "NP-3841", items: "Suya Spice Set · Plantain Chips · Palm Oil", date: "May 23", amount: 32.50, status: "shipped", thumb: "\uD83C\uDF36\uFE0F", trackingNumber: "TRK-3841" },
  { id: "NP-3840", items: "Fufu Flour · Ogbono · Stockfish", date: "May 22", amount: 28.80, status: "packed", thumb: "\uD83E\uDD63", trackingNumber: "TRK-3840" },
  { id: "NP-3839", items: "Groundnut Cake · Zobo Drink Mix · Coconut Rice", date: "May 21", amount: 19.95, status: "confirmed", thumb: "\uD83E\uDD5C" },
  { id: "NP-3838", items: "Smoked Catfish · Cassava Flour · Uziza Leaves", date: "May 20", amount: 38.40, status: "delivered", thumb: "\uD83D\uDC1F", trackingNumber: "TRK-3838" },
  { id: "NP-3837", items: "Agege Bread · Ewa Agoyin Kit · Pepper Sauce", date: "May 19", amount: 15.60, status: "delivered", thumb: "\uD83C\uDF5E", trackingNumber: "TRK-3837" },
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
  { name: "Jollof Rice Party Pack", ref: "NP-3842", amount: 47.20, type: "debit", date: "May 24", method: "Visa ···· 4829" },
  { name: "Wallet Top-up", ref: "WAL-8891", amount: 100.00, type: "credit", date: "May 23", method: "Bank Transfer" },
  { name: "Suya Spice Set", ref: "NP-3841", amount: 32.50, type: "debit", date: "May 23", method: "Visa ···· 4829" },
  { name: "Fufu Flour + Ogbono", ref: "NP-3840", amount: 28.80, type: "debit", date: "May 22", method: "OPay" },
  { name: "Cashback Reward", ref: "CB-APR", amount: 5.00, type: "credit", date: "May 20", method: "Wallet Credit" },
  { name: "Groundnut Cake Bundle", ref: "NP-3839", amount: 19.95, type: "debit", date: "May 21", method: "Visa ···· 4829" },
];

export const NOTIFICATIONS: UserNotification[] = [
  { id: 1, title: "Order NP-3842 Delivered", description: "Jollof Rice Party Pack has arrived at your door", time: "2 hours ago", read: false },
  { id: 2, title: "NP-3841 on the way", description: "Your Suya Spice Set is out for delivery", time: "5 hours ago", read: false },
  { id: 3, title: "Flash Sale: 20% off Grains", description: "Rice, beans, yam flour — stock up and save", time: "1 day ago", read: false },
  { id: 4, title: "Order NP-3840 Packed", description: "Your order is being prepared at the warehouse", time: "1 day ago", read: false },
  { id: 5, title: "New: Chef's Special Box", description: "Curated ingredients for Egusi + Fufu", time: "3 days ago", read: true },
  { id: 6, title: "Referral Bonus Earned", description: "You earned ₦1,500 — Tunde signed up with your link", time: "5 days ago", read: true },
];

export const WISHLIST_INITIAL = [
  { id: 105, name: "Ogbono Powder", price: 7.20, emoji: "\uD83C\uDF30" },
  { id: 106, name: "Smoked Catfish", price: 12.50, emoji: "\uD83D\uDC1F" },
  { id: 108, name: "Zobo Drink Mix", price: 4.50, emoji: "\uD83E\uDED0" },
  { id: 109, name: "Coconut Rice", price: 6.80, emoji: "\uD83E\uDD65" },
  { id: 110, name: "Groundnut Cake", price: 3.50, emoji: "\uD83E\uDD5C" },
  { id: 111, name: "Palm Oil (1L)", price: 5.90, emoji: "\uD83D\uDFE0" },
];

export const DELIVERY_FEE_THRESHOLD = 50;

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
