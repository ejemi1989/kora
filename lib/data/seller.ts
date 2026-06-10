import type {
  SellerProduct, SellerOrder, SellerInventoryItem, SellerAnalytic,
  SellerPayout, SellerCustomer, SellerReview, SellerPromotion,
} from "@/lib/types/seller";

export const SELLER_STATS = [
  { label: "Total Revenue", value: "₦2,486,500", delta: "↑ +12.3% this month", deltaUp: true },
  { label: "Orders (30d)", value: "347", delta: "↑ +8.1% this month", deltaUp: true },
  { label: "Active Products", value: "24", delta: "↑ +3 new this month", deltaUp: true },
  { label: "Avg. Rating", value: "4.8 ★", delta: "↑ from 4.6", deltaUp: true },
];

export const SELLER_RECENT_ORDERS: SellerOrder[] = [
  { id: "#AK-1024", customer: "Chisom Okafor", items: 3, product: "Processed Egusi", total: 12500, date: "25 May", status: "delivered", trackingNumber: "TRK-AK-1024" },
  { id: "#AK-1022", customer: "Amara Eze", items: 1, product: "Red Palm Oil", total: 18500, date: "24 May", status: "delivered", trackingNumber: "TRK-AK-1022" },
  { id: "#AK-1020", customer: "Kofi Mensah", items: 2, product: "Dried Fish (Pala, Sawa, Agbodo)", total: 15800, date: "23 May", status: "shipped", trackingNumber: "TRK-AK-1020" },
  { id: "#AK-1018", customer: "Ngozi Adebayo", items: 1, product: "Fresh Plantain", total: 6800, date: "22 May", status: "processing" },
  { id: "#AK-1015", customer: "Yvonne Kamau", items: 2, product: "Cassava Flour", total: 11200, date: "21 May", status: "delivered", trackingNumber: "TRK-AK-1015" },
];

export const SELLER_PRODUCTS: SellerProduct[] = [
  { id: 1, name: "Gari Ijebu", emoji: "🌾", category: "Grains & Rice", price: 10000, stock: 150, available: 120, sales: 340, status: "active" },
  { id: 2, name: "Ofada Rice", emoji: "🍚", category: "Grains & Rice", price: 15000, stock: 100, available: 85, sales: 210, status: "active" },
  { id: 3, name: "Yam", emoji: "🍠", category: "Vegetables", price: 8000, stock: 80, available: 65, sales: 180, status: "active" },
  { id: 4, name: "Cocoa Yam", emoji: "🍠", category: "Vegetables", price: 8000, stock: 90, available: 75, sales: 120, status: "active" },
  { id: 5, name: "Water Yam", emoji: "🍠", category: "Vegetables", price: 6000, stock: 60, available: 50, sales: 95, status: "active" },
  { id: 6, name: "Yam Flour", emoji: "🫓", category: "Grains & Rice", price: 10000, stock: 120, available: 100, sales: 310, status: "active" },
  { id: 7, name: "Cassava Flour", emoji: "🫓", category: "Grains & Rice", price: 6000, stock: 140, available: 115, sales: 145, status: "active" },
  { id: 8, name: "Dried Cray Fish", emoji: "🦐", category: "Fish & Meat", price: 20000, stock: 70, available: 55, sales: 420, status: "active" },
  { id: 9, name: "Snails", emoji: "🐌", category: "Fish & Meat", price: 24000, stock: 50, available: 35, sales: 190, status: "active" },
  { id: 10, name: "Fresh Plantain", emoji: "🍌", category: "Vegetables", price: 10000, stock: 110, available: 90, sales: 280, status: "active" },
  { id: 11, name: "Processed Egusi", emoji: "🥣", category: "Spices & Seasonings", price: 10000, stock: 130, available: 110, sales: 315, status: "active" },
  { id: 12, name: "Processed Ogbono", emoji: "🥣", category: "Spices & Seasonings", price: 15000, stock: 85, available: 70, sales: 225, status: "active" },
  { id: 13, name: "Processed Groundnuts", emoji: "🥜", category: "Snacks", price: 15000, stock: 160, available: 140, sales: 180, status: "active" },
  { id: 14, name: "Red Palm Oil", emoji: "🫒", category: "Oils & Fats", price: 8000, stock: 95, available: 80, sales: 245, status: "active" },
  { id: 15, name: "Dried Fish (Pala, Sawa, Agbodo)", emoji: "🐟", category: "Fish & Meat", price: 10000, stock: 75, available: 60, sales: 340, status: "active" },
];

export const SELLER_ORDERS: SellerOrder[] = [
  { id: "#AK-1024", customer: "Chisom Okafor", items: 3, product: "Processed Egusi", total: 12500, date: "25 May", status: "delivered", trackingNumber: "TRK-AK-1024" },
  { id: "#AK-1023", customer: "Tunde Bakare", items: 2, product: "Processed Ogbono", total: 19000, date: "25 May", status: "cancelled" },
  { id: "#AK-1022", customer: "Amara Eze", items: 1, product: "Red Palm Oil", total: 18500, date: "24 May", status: "delivered", trackingNumber: "TRK-AK-1022" },
  { id: "#AK-1021", customer: "Fatima Bello", items: 4, product: "Processed Egusi", total: 50000, date: "24 May", status: "processing" },
  { id: "#AK-1020", customer: "Kofi Mensah", items: 2, product: "Dried Fish (Pala, Sawa, Agbodo)", total: 15800, date: "23 May", status: "shipped", trackingNumber: "TRK-AK-1020" },
  { id: "#AK-1019", customer: "Zainab Abdullah", items: 1, product: "Processed Groundnuts", total: 8200, date: "23 May", status: "pending" },
  { id: "#AK-1018", customer: "Ngozi Adebayo", items: 1, product: "Fresh Plantain", total: 6800, date: "22 May", status: "processing" },
  { id: "#AK-1017", customer: "Chidi Okonkwo", items: 3, product: "Yam Flour", total: 21600, date: "22 May", status: "shipped", trackingNumber: "TRK-AK-1017" },
  { id: "#AK-1016", customer: "Moses Otieno", items: 2, product: "Red Palm Oil", total: 37000, date: "21 May", status: "pending" },
  { id: "#AK-1015", customer: "Yvonne Kamau", items: 2, product: "Cassava Flour", total: 11200, date: "21 May", status: "delivered", trackingNumber: "TRK-AK-1015" },
];

export const SELLER_INVENTORY: SellerInventoryItem[] = [
  { id: 1, name: "Gari Ijebu", emoji: "🌾", category: "Grains & Rice", stock: 150, available: 120, threshold: 20, status: "ok" },
  { id: 2, name: "Ofada Rice", emoji: "🍚", category: "Grains & Rice", stock: 100, available: 85, threshold: 15, status: "ok" },
  { id: 3, name: "Yam", emoji: "🍠", category: "Vegetables", stock: 80, available: 65, threshold: 10, status: "ok" },
  { id: 4, name: "Cocoa Yam", emoji: "🍠", category: "Vegetables", stock: 90, available: 75, threshold: 15, status: "ok" },
  { id: 5, name: "Water Yam", emoji: "🍠", category: "Vegetables", stock: 60, available: 50, threshold: 10, status: "ok" },
  { id: 6, name: "Yam Flour", emoji: "🫓", category: "Grains & Rice", stock: 120, available: 100, threshold: 15, status: "ok" },
  { id: 7, name: "Cassava Flour", emoji: "🫓", category: "Grains & Rice", stock: 140, available: 115, threshold: 15, status: "ok" },
  { id: 8, name: "Dried Cray Fish", emoji: "🦐", category: "Fish & Meat", stock: 70, available: 55, threshold: 10, status: "ok" },
  { id: 9, name: "Snails", emoji: "🐌", category: "Fish & Meat", stock: 50, available: 35, threshold: 10, status: "ok" },
  { id: 10, name: "Fresh Plantain", emoji: "🍌", category: "Vegetables", stock: 110, available: 90, threshold: 15, status: "ok" },
  { id: 11, name: "Processed Egusi", emoji: "🥣", category: "Spices & Seasonings", stock: 130, available: 110, threshold: 15, status: "ok" },
  { id: 12, name: "Processed Ogbono", emoji: "🥣", category: "Spices & Seasonings", stock: 85, available: 70, threshold: 10, status: "ok" },
  { id: 13, name: "Processed Groundnuts", emoji: "🥜", category: "Snacks", stock: 160, available: 140, threshold: 20, status: "ok" },
  { id: 14, name: "Red Palm Oil", emoji: "🫒", category: "Oils & Fats", stock: 95, available: 80, threshold: 15, status: "ok" },
  { id: 15, name: "Dried Fish (Pala, Sawa, Agbodo)", emoji: "🐟", category: "Fish & Meat", stock: 75, available: 60, threshold: 15, status: "ok" },
];

export const SELLER_BAR_CHART: SellerAnalytic[] = [
  { month: "Jan", revenue: 145000, orders: 120, fill: false, height: 40 },
  { month: "Feb", revenue: 182000, orders: 145, fill: false, height: 50 },
  { month: "Mar", revenue: 210000, orders: 168, fill: false, height: 58 },
  { month: "Apr", revenue: 195000, orders: 155, fill: false, height: 54 },
  { month: "May", revenue: 248000, orders: 198, fill: true, height: 68 },
  { month: "Jun", revenue: 265000, orders: 210, fill: true, height: 73 },
  { month: "Jul", revenue: 290000, orders: 225, fill: true, height: 80 },
  { month: "Aug", revenue: 310000, orders: 240, fill: true, height: 85 },
  { month: "Sep", revenue: 280000, orders: 218, fill: true, height: 77 },
  { month: "Oct", revenue: 320000, orders: 250, fill: true, height: 88 },
  { month: "Nov", revenue: 350000, orders: 275, fill: true, height: 96 },
  { month: "Dec", revenue: 380000, orders: 300, fill: true, height: 100 },
];

export const SELLER_PAYOUTS: SellerPayout[] = [
  { id: "PYT-8921", date: "26 May 2026", amount: 245000, status: "completed" },
  { id: "PYT-8764", date: "19 May 2026", amount: 189500, status: "completed" },
  { id: "PYT-8603", date: "12 May 2026", amount: 312000, status: "completed" },
  { id: "PYT-8442", date: "5 May 2026", amount: 156800, status: "completed" },
  { id: "PYT-8281", date: "28 Apr 2026", amount: 223400, status: "pending" },
  { id: "PYT-8120", date: "21 Apr 2026", amount: 178900, status: "processing" },
  { id: "PYT-7959", date: "14 Apr 2026", amount: 267300, status: "completed" },
  { id: "PYT-7798", date: "7 Apr 2026", amount: 145600, status: "completed" },
];

export const SELLER_CUSTOMERS: SellerCustomer[] = [
  { id: "CO", name: "Chisom Okafor", email: "chisom.o@email.com", initials: "CO", orders: 12, spent: 156000, last: "25 May", status: "Regular", phone: "+234 802 345 6789", location: "Lagos, Nigeria", joined: "12 Jan 2025", bg: "#E8F5E9", fg: "#2E7D32", history: [{ order: "#AK-1024", product: "Jollof Spice Mix", amount: "₦12,500", status: "Delivered", statusClass: "badge-delivered", date: "25 May" }, { order: "#AK-1012", product: "Groundnut Paste", amount: "₦8,200", status: "Delivered", statusClass: "badge-delivered", date: "18 May" }, { order: "#AK-0987", product: "Dried Ugwu Leaves", amount: "₦6,800", status: "Delivered", statusClass: "badge-delivered", date: "10 May" }] },
  { id: "AE", name: "Amara Eze", email: "amara.eze@email.com", initials: "AE", orders: 8, spent: 84500, last: "24 May", status: "Regular", phone: "+234 808 234 5678", location: "Abuja, Nigeria", joined: "3 Mar 2025", bg: "#E3F2FD", fg: "#1565C0", history: [{ order: "#AK-1022", product: "Palm Oil (5L)", amount: "₦18,500", status: "Delivered", statusClass: "badge-delivered", date: "24 May" }, { order: "#AK-1005", product: "Yam Flour", amount: "₦7,200", status: "Delivered", statusClass: "badge-delivered", date: "15 May" }] },
  { id: "KM", name: "Kofi Mensah", email: "kofi.m@email.com", initials: "KM", orders: 5, spent: 67200, last: "23 May", status: "New", phone: "+233 50 123 4567", location: "Accra, Ghana", joined: "15 Apr 2025", bg: "#FFF8E1", fg: "#F57F17", history: [{ order: "#AK-1020", product: "Smoked Catfish", amount: "₦15,800", status: "Shipped", statusClass: "badge-shipped", date: "23 May" }, { order: "#AK-1009", product: "Fufu Flour", amount: "₦6,500", status: "Delivered", statusClass: "badge-delivered", date: "12 May" }] },
  { id: "NA", name: "Ngozi Adebayo", email: "ngozi.a@email.com", initials: "NA", orders: 18, spent: 234000, last: "22 May", status: "Regular", phone: "+234 805 678 9012", location: "Port Harcourt, Nigeria", joined: "28 Oct 2024", bg: "#F3E5F5", fg: "#7B1FA2", history: [{ order: "#AK-1018", product: "Dried Ugwu Leaves", amount: "₦6,800", status: "Delivered", statusClass: "badge-delivered", date: "22 May" }, { order: "#AK-1003", product: "Egusi Soup Mix", amount: "₦9,500", status: "Delivered", statusClass: "badge-delivered", date: "8 May" }, { order: "#AK-0976", product: "Jollof Spice Mix", amount: "₦12,500", status: "Delivered", statusClass: "badge-delivered", date: "28 Apr" }] },
  { id: "YK", name: "Yvonne Kamau", email: "yvonne.k@email.com", initials: "YK", orders: 6, spent: 92100, last: "21 May", status: "New", phone: "+254 712 345 678", location: "Nairobi, Kenya", joined: "2 May 2025", bg: "#FBE9E7", fg: "#C62828", history: [{ order: "#AK-1015", product: "Arrowroot Flour", amount: "₦11,200", status: "Delivered", statusClass: "badge-delivered", date: "21 May" }, { order: "#AK-1001", product: "Coconut Oil", amount: "₦9,800", status: "Processing", statusClass: "badge-processing", date: "19 May" }] },
  { id: "EO", name: "Emeka Obi", email: "emeka.o@email.com", initials: "EO", orders: 3, spent: 33600, last: "20 May", status: "New", phone: "+234 809 876 5432", location: "Onitsha, Nigeria", joined: "10 May 2025", bg: "#E0F7FA", fg: "#00695C", history: [{ order: "#AK-1013", product: "Tiger Nuts", amount: "₦5,400", status: "Delivered", statusClass: "badge-delivered", date: "20 May" }, { order: "#AK-1006", product: "Honey (500ml)", amount: "₦8,500", status: "Shipped", statusClass: "badge-shipped", date: "16 May" }] },
];

export const SELLER_REVIEWS: SellerReview[] = [
  { id: 1, customer: "Chisom O.", product: "Jollof Spice Mix", rating: 5, text: "Best jollof spice I've bought abroad! Tastes just like home. Shipping was fast too.", date: "3 days ago", replied: true, replyText: "Thank you, Chisom! We're proud of our spice blend. Happy cooking!" },
  { id: 2, customer: "Amara E.", product: "Palm Oil (5L)", rating: 4, text: "Good quality oil, authentic deep red color. Slightly more expensive than local markets but worth it for the quality.", date: "5 days ago", replied: false },
  { id: 3, customer: "Kofi M.", product: "Smoked Catfish", rating: 5, text: "Fresh and properly smoked. Used it in my kontomire stew and it was perfect!", date: "1 week ago", replied: true, replyText: "Kofi, that sounds delicious! Thanks for sharing. 🐟" },
  { id: 4, customer: "Ngozi A.", product: "Dried Ugwu Leaves", rating: 4, text: "Good dried vegetables. Rehydrate well. Color could be greener.", date: "1 week ago", replied: false },
  { id: 5, customer: "Yvonne K.", product: "Arrowroot Flour", rating: 5, text: "Gluten-free and perfect for baking. My kids love the pancakes I make with this!", date: "2 weeks ago", replied: true, replyText: "So glad your family enjoys them! We love versatile products." },
  { id: 6, customer: "Emeka O.", product: "Tiger Nuts", rating: 3, text: "Good taste but some were a bit soft. Maybe a freshness issue?", date: "2 weeks ago", replied: false },
  { id: 7, customer: "Fatima B.", product: "Groundnut Paste", rating: 5, text: "Smooth, rich, no additives. My go-to for groundnut soup. Ordering again!", date: "3 weeks ago", replied: true, replyText: "Thank you Fatima! We source directly from farmers for the best quality." },
];

export const SELLER_PROMOTIONS: SellerPromotion[] = [
  { code: "AKARA15", discount: "15% off", details: "All Jollof Spice products", ends: "30 Jun", status: "active" },
  { code: "FREESHIP", discount: "Free delivery", details: "Orders over ₦10,000", ends: "31 Jul", status: "active" },
  { code: "WELCOME20", discount: "20% off", details: "First-time buyers", ends: "15 Jun", status: "scheduled" },
  { code: "BULKORDER", discount: "10% off", details: "Orders of 5+ items", ends: "Unlimited", status: "draft" },
];
