import type {
  AdminUser, AdminSeller, AdminProduct, AdminOrder,
  AdminTransaction, AdminDispute, AdminBanner, AdminCurrency, AdminNotification,
} from "@/lib/types/admin";

export const ADMIN_USERS: AdminUser[] = [
  { id: 1, name: "Amara Osei", email: "amara.o@email.com", location: "Lagos, NG", joined: "Mar 2024", orders: 24, status: "active" },
  { id: 2, name: "Kwame Mensah", email: "kwame.m@email.com", location: "Accra, GH", joined: "Jan 2024", orders: 56, status: "active" },
  { id: 3, name: "Folake Nwachukwu", email: "folake.n@email.com", location: "Lagos, NG", joined: "Nov 2023", orders: 89, status: "active" },
  { id: 4, name: "Chidi Kamara", email: "chidi.k@email.com", location: "Nairobi, KE", joined: "Feb 2024", orders: 12, status: "suspended" },
  { id: 5, name: "Zola Mbeki", email: "zola.m@email.com", location: "Johannesburg, ZA", joined: "Jun 2023", orders: 143, status: "active" },
  { id: 6, name: "Esi Adjei", email: "esi.a@email.com", location: "Accra, GH", joined: "Sep 2023", orders: 67, status: "active" },
  { id: 7, name: "Jabari Okonjo", email: "jabari.o@email.com", location: "Dar es Salaam, TZ", joined: "Apr 2024", orders: 3, status: "pending" },
];

export const ADMIN_SELLERS: AdminSeller[] = [
  { id: 1, business: "Nakato Textiles", owner: "Nakato Abimbola", category: "Fashion", location: "Lagos, NG", products: 47, revenue: "KES 342K", docs: "Verified", status: "active" },
  { id: 2, business: "Makena Crafts", owner: "Makena Wanjiku", category: "Handicrafts", location: "Nairobi, KE", products: 124, revenue: "KES 298K", docs: "Verified", status: "active" },
  { id: 3, business: "Omondi Electronics", owner: "Omondi Nyongo", category: "Electronics", location: "Nairobi, KE", products: 89, revenue: "KES 211K", docs: "Pending", status: "active" },
  { id: 4, business: "Chioma Foods", owner: "Chioma Eze", category: "Food & Grocery", location: "Lagos, NG", products: 203, revenue: "KES 187K", docs: "Verified", status: "active" },
  { id: 5, business: "Tendai Furniture", owner: "Tendai Banda", category: "Home & Living", location: "Lusaka, ZM", products: 31, revenue: "KES 95K", docs: "Pending", status: "pending" },
  { id: 6, business: "Fatima Beauty", owner: "Fatima Hassan", category: "Beauty", location: "Dar es Salaam, TZ", products: 76, revenue: "KES 156K", docs: "Verified", status: "active" },
];

export const ADMIN_PRODUCTS: AdminProduct[] = [
  { id: 1, name: "Kente Dashiki Pro", seller: "Nakato Textiles", category: "Fashion", price: "KES 8,500", stock: 43, sales: 128, status: "active" },
  { id: 2, name: "Handwoven Basket Set", seller: "Makena Crafts", category: "Handicrafts", price: "KES 2,200", stock: 200, sales: 347, status: "active" },
  { id: 3, name: "Refurbished Laptop", seller: "Omondi Electronics", category: "Electronics", price: "KES 45,000", stock: 12, sales: 34, status: "pending" },
  { id: 4, name: "Organic Egusi Soup Mix", seller: "Chioma Foods", category: "Food & Grocery", price: "KES 1,800", stock: 500, sales: 892, status: "active" },
  { id: 5, name: "Mango Wood Shelf", seller: "Tendai Furniture", category: "Home & Living", price: "KES 6,700", stock: 28, sales: 56, status: "flagged" },
  { id: 6, name: "Shea Butter Cream", seller: "Fatima Beauty", category: "Beauty", price: "KES 1,200", stock: 340, sales: 567, status: "active" },
];

export const ADMIN_ORDERS: AdminOrder[] = [
  { id: "#ORD-3842", customer: "Amara Osei", items: 3, total: "KES 12,400", payment: "M-Pesa", date: "26 May", status: "shipped" },
  { id: "#ORD-3841", customer: "Kwame Mensah", items: 1, total: "KES 3,800", payment: "Card", date: "26 May", status: "pending" },
  { id: "#ORD-3840", customer: "Folake Nwachukwu", items: 5, total: "KES 28,500", payment: "M-Pesa", date: "25 May", status: "confirmed" },
  { id: "#ORD-3839", customer: "Chidi Kamara", items: 2, total: "KES 6,200", payment: "M-Pesa", date: "25 May", status: "shipped" },
  { id: "#ORD-3838", customer: "Zola Mbeki", items: 4, total: "KES 19,800", payment: "Bank", date: "24 May", status: "delivered" },
  { id: "#ORD-3837", customer: "Esi Adjei", items: 1, total: "KES 1,200", payment: "M-Pesa", date: "24 May", status: "cancelled" },
  { id: "#ORD-3836", customer: "Jabari Okonjo", items: 2, total: "KES 4,600", payment: "M-Pesa", date: "23 May", status: "shipped" },
];

export const ADMIN_TRANSACTIONS: AdminTransaction[] = [
  { id: "TXN-89432", customer: "Amara Osei", method: "M-Pesa", amount: "KES 12,400", date: "26 May", status: "completed" },
  { id: "TXN-89431", customer: "Kwame Mensah", method: "Card", amount: "KES 3,800", date: "26 May", status: "pending" },
  { id: "TXN-89430", customer: "Folake Nwachukwu", method: "M-Pesa", amount: "KES 28,500", date: "25 May", status: "completed" },
  { id: "TXN-89429", customer: "Chidi Kamara", method: "M-Pesa", amount: "KES 6,200", date: "25 May", status: "completed" },
  { id: "TXN-89428", customer: "Zola Mbeki", method: "Bank", amount: "KES 19,800", date: "24 May", status: "completed" },
  { id: "TXN-89427", customer: "Esi Adjei", method: "M-Pesa", amount: "KES 1,200", date: "24 May", status: "refunded" },
];

export const ADMIN_DISPUTES: AdminDispute[] = [
  { id: "DSP-023", buyer: "Amara Osei", seller: "Nakato Textiles", issue: "Item not received", amount: "KES 8,500", opened: "25 May", priority: "high", status: "open" },
  { id: "DSP-022", buyer: "Kwame Mensah", seller: "Makena Crafts", issue: "Wrong item shipped", amount: "KES 2,200", opened: "24 May", priority: "medium", status: "open" },
  { id: "DSP-021", buyer: "Folake Nwachukwu", seller: "Chioma Foods", issue: "Damaged goods", amount: "KES 1,800", opened: "23 May", priority: "low", status: "resolved" },
];

export const ADMIN_BANNERS: AdminBanner[] = [
  { title: "Summer Fashion Sale", position: "Hero", start: "15 May 2026", end: "15 Jun 2026", status: "active" },
  { title: "New Seller Promotion", position: "Secondary", start: "1 May 2026", end: "1 Jul 2026", status: "active" },
  { title: "Free Delivery Weekend", position: "Hero", start: "Pending", end: "—", status: "scheduled" },
];

export const ADMIN_CURRENCIES: AdminCurrency[] = [
  { id: 1, code: "KES", name: "Kenyan Shilling", symbol: "KSh", rate: 1, status: "active" },
  { id: 2, code: "NGN", name: "Nigerian Naira", symbol: "₦", rate: 1.15, status: "active" },
  { id: 3, code: "GHS", name: "Ghanaian Cedi", symbol: "GH₵", rate: 0.92, status: "active" },
  { id: 4, code: "TZS", name: "Tanzanian Shilling", symbol: "TSh", rate: 0.75, status: "active" },
  { id: 5, code: "UGX", name: "Ugandan Shilling", symbol: "USh", rate: 0.83, status: "inactive" },
  { id: 6, code: "ZAR", name: "South African Rand", symbol: "R", rate: 1.42, status: "active" },
  { id: 7, code: "ETB", name: "Ethiopian Birr", symbol: "Br", rate: 0.52, status: "inactive" },
  { id: 8, code: "RWF", name: "Rwandan Franc", symbol: "FRw", rate: 0.94, status: "active" },
  { id: 9, code: "ZMW", name: "Zambian Kwacha", symbol: "ZK", rate: 0.68, status: "active" },
  { id: 10, code: "MZN", name: "Mozambican Metical", symbol: "MT", rate: 0.44, status: "inactive" },
];

export const ADMIN_NOTIFICATIONS: AdminNotification[] = [
  { id: 1, title: "Seller verification flagged", type: "urgent", iconBg: "primary-bg", badge: "Pending / Urgent", description: "Nakato Textiles (ID: SELL-9841) submitted documents that failed automated verification. Manual review required.", time: "5 min ago", actionLabel: "Review seller", actionTarget: "sellers", dismissable: true, urgent: true },
  { id: 2, title: "New order — KES 24,500", type: "new", iconBg: "success-bg", badge: "Active / New", description: "Chidi Kamara ordered 3 items from Zola Electronics (Order #ORD-8923). Payment confirmed via M-Pesa.", time: "18 min ago", actionLabel: "View order", actionTarget: "orders", dismissable: true, urgent: false },
  { id: 3, title: "Refund request — KES 8,500", type: "action", iconBg: "danger-bg", badge: "Pending", description: "Amina Diallo requested a refund for damaged goods from AfriStyle Fashion. Escalate if unresolved within 24h.", time: "1h ago", actionLabel: "View dispute", actionTarget: "disputes", dismissable: true, urgent: false },
  { id: 4, title: "12 new users registered", type: "info", iconBg: "success-bg", badge: "Success / Info", description: "12 new accounts created in the last hour. 4 are sellers, 8 are buyers. 2 pending verification.", time: "2h ago", actionLabel: "View users", actionTarget: "users", dismissable: false, urgent: false },
  { id: 5, title: "Revenue milestone: KES 5M", type: "milestone", iconBg: "warning-bg", badge: "Active", description: "Kongo marketplace crossed KES 5M in monthly revenue for the first time. Top category: Electronics (38%).", time: "3h ago", actionLabel: "View analytics", actionTarget: "analytics", dismissable: false, urgent: false },
  { id: 6, title: "Payment gateway latency", type: "warning", iconBg: "danger-bg", badge: "Suspended", description: "M-Pesa API response time increased to 3.2s (threshold: 2.0s). Monitoring. Check payment processing.", time: "5h ago", actionLabel: "Check payments", actionTarget: "payments", dismissable: false, urgent: false },
];

export const ADMIN_NAV_BADGES: Record<string, string> = {
  notifications: "6",
  users: "2,847",
  sellers: "143",
  products: "12.4K",
  orders: "486",
  disputes: "12",
  currencies: "7",
};

export const ADMIN_PANEL_LABELS: Record<string, string> = {
  overview: "Overview",
  notifications: "Notifications",
  users: "Users",
  sellers: "Sellers",
  products: "Products",
  orders: "Orders",
  payments: "Payments",
  disputes: "Disputes",
  analytics: "Analytics",
  content: "Content",
  currencies: "Currencies",
  settings: "Settings",
};

export const ADMIN_BAR_CHART: { month: string; height: number; fill: boolean }[] = [
  { month: "Jan", height: 65, fill: true },
  { month: "Feb", height: 45, fill: true },
  { month: "Mar", height: 75, fill: true },
  { month: "Apr", height: 60, fill: true },
  { month: "May", height: 85, fill: true },
  { month: "Jun", height: 100, fill: false },
];

export const ADMIN_OVERVIEW_ORDERS = [
  { id: "#ORD-3842", customer: "Amara Osei", status: "shipped" as const, amount: "KES 12,400" },
  { id: "#ORD-3841", customer: "Kwame Mensah", status: "pending" as const, amount: "KES 3,800" },
  { id: "#ORD-3840", customer: "Folake Nwachukwu", status: "confirmed" as const, amount: "KES 28,500" },
  { id: "#ORD-3839", customer: "Chidi Kamara", status: "shipped" as const, amount: "KES 6,200" },
];

export const ADMIN_TOP_SELLERS = [
  { seller: "Nakato Textiles", revenue: "KES 342K", orders: 184 },
  { seller: "Makena Crafts", revenue: "KES 298K", orders: 156 },
  { seller: "Omondi Electronics", revenue: "KES 211K", orders: 93 },
  { seller: "Chioma Foods", revenue: "KES 187K", orders: 247 },
];

export const ADMIN_PLATFORM_HEALTH = [
  { metric: "Uptime", value: "99.97%", color: "var(--success)", bar: 99.97 },
  { metric: "Avg response", value: "124ms", color: "var(--primary)", bar: 88 },
  { metric: "Error rate", value: "0.03%", color: "var(--success)", bar: 0.03 },
  { metric: "Queue depth", value: "4", color: "var(--warning)", bar: 4 },
];

export const ADMIN_ANALYTICS_REGIONS = [
  { region: "Lagos, NG", orders: 1024, revenue: "KES 1.9M", pct: 36 },
  { region: "Nairobi, KE", orders: 687, revenue: "KES 1.2M", pct: 24 },
  { region: "Accra, GH", orders: 423, revenue: "KES 684K", pct: 15 },
  { region: "Johannesburg, ZA", orders: 312, revenue: "KES 522K", pct: 11 },
  { region: "Dar es Salaam, TZ", orders: 198, revenue: "KES 286K", pct: 7 },
  { region: "Other", orders: 203, revenue: "KES 208K", pct: 7 },
];

export const ADMIN_ANALYTICS_CATEGORIES = [
  { category: "Fashion", orders: 892, revenue: "KES 1.6M" },
  { category: "Food & Grocery", orders: 654, revenue: "KES 892K" },
  { category: "Electronics", orders: 432, revenue: "KES 1.1M" },
  { category: "Handicrafts", orders: 298, revenue: "KES 412K" },
  { category: "Beauty", orders: 267, revenue: "KES 342K" },
  { category: "Home & Living", orders: 198, revenue: "KES 442K" },
];

export const ADMIN_PAYMENT_STATS = [
  { label: "Volume (30d)", value: "KES 4.8M" },
  { label: "Transactions", value: "2,847" },
  { label: "Avg ticket", value: "KES 1,686" },
];

export const ADMIN_DISPUTE_STATS = [
  { label: "Open", value: "12", color: "var(--warning)" },
  { label: "Avg resolution", value: "2.4 days" },
  { label: "Resolved this week", value: "18" },
];

export const ADMIN_ANALYTICS_MINI = [
  { label: "GMV (30d)", value: "KES 4.8M", delta: "+18% vs last period", deltaUp: true, color: "var(--success)" as const },
  { label: "Avg order value", value: "KES 1,686", delta: "+2% vs last period", deltaUp: true, color: "var(--body)" as const },
  { label: "Conversion rate", value: "3.2%", delta: "+0.4pp vs last period", deltaUp: true, color: "var(--success)" as const },
  { label: "Repeat buyers", value: "42%", delta: "+5pp vs last period", deltaUp: true, color: "var(--success)" as const },
];
