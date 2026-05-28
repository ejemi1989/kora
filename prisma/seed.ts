import { PrismaClient } from "../lib/generated/prisma";

const prisma = new PrismaClient();

async function main() {
  const user = await prisma.user.upsert({
    where: { email: "amara@naijaplate.com" },
    update: {},
    create: { id: "user-1", name: "Amara Okafor", email: "amara@naijaplate.com", role: "CUSTOMER" },
  });

  const seller = await prisma.user.upsert({
    where: { email: "seller@naijaplate.com" },
    update: {},
    create: { id: "seller-1", name: "Chidi Okonkwo", email: "seller@naijaplate.com", role: "SELLER" },
  });

  const admin = await prisma.user.upsert({
    where: { email: "admin@naijaplate.com" },
    update: {},
    create: { id: "admin-1", name: "Admin User", email: "admin@naijaplate.com", role: "ADMIN" },
  });

  const products = [
    { id: "prod-1", name: "Jollof Rice Party Pack", description: "2.5kg premium parboiled rice with tomato stew base, serves 8-10", price: 14.99, stock: 50, images: ["/images/prod-jollof.png"], category: "Grains & Rice", sellerId: "seller-1", rating: 4.8 },
    { id: "prod-2", name: "Suya Spice Set", description: "180g signature suya pepper blend with peanut powder", price: 8.50, stock: 100, images: ["/images/prod-suya.png"], category: "Spices & Seasoning", sellerId: "seller-1", rating: 4.9 },
    { id: "prod-3", name: "Plantain Chips (3 pk)", description: "Spicy, Sweet & Garlic — 3-pack variety", price: 4.99, stock: 75, images: ["/images/prod-chips.png"], category: "Snacks", sellerId: "seller-1", rating: 4.5 },
    { id: "prod-4", name: "Egusi Soup Mix", description: "500g pre-ground egusi (melon) seeds for traditional soup", price: 6.75, stock: 40, images: ["/images/prod-egusi.png"], category: "Soups & Stews", sellerId: "seller-1", rating: 4.6 },
    { id: "prod-5", name: "Ogbono Powder", description: "400g ground ogbono seeds — thickens any soup", price: 7.20, stock: 30, images: ["/images/prod-ogbono.png"], category: "Soups & Stews", sellerId: "seller-1", rating: 4.7 },
    { id: "prod-6", name: "Smoked Catfish", description: "500g whole smoked catfish, rich flavor", price: 12.50, stock: 20, images: ["/images/prod-catfish.png"], category: "Fish & Seafood", sellerId: "seller-1", rating: 4.9 },
    { id: "prod-7", name: "Fufu Flour", description: "2kg premium cassava flour for smooth fufu", price: 5.50, stock: 60, images: ["/images/prod-fufu.png"], category: "Grains & Rice", sellerId: "seller-1", rating: 4.4 },
    { id: "prod-8", name: "Zobo Drink Mix", description: "200g dried hibiscus petals with ginger & cloves", price: 4.50, stock: 80, images: ["/images/prod-zobo.png"], category: "Beverages", sellerId: "seller-1", rating: 4.3 },
    { id: "prod-9", name: "Coconut Rice", description: "1kg specialty coconut rice blend", price: 6.80, stock: 45, images: ["/images/prod-coconut.png"], category: "Grains & Rice", sellerId: "seller-1", rating: 4.5 },
    { id: "prod-10", name: "Groundnut Cake", description: "300g fresh groundnut cake (kuli-kuli)", price: 3.50, stock: 90, images: ["/images/prod-groundnut.png"], category: "Snacks", sellerId: "seller-1", rating: 4.2 },
    { id: "prod-11", name: "Palm Oil (1L)", description: "1 litre natural red palm oil", price: 5.90, stock: 35, images: ["/images/prod-palm-oil.png"], category: "Oils & Condiments", sellerId: "seller-1", rating: 4.6 },
    { id: "prod-12", name: "Garri (Ijebu)", description: "2kg fine Ijebu garri, premium quality", price: 4.20, stock: 55, images: ["/images/prod-garri.png"], category: "Grains & Rice", sellerId: "seller-1", rating: 4.7 },
  ];

  for (const p of products) {
    await prisma.product.upsert({ where: { id: p.id }, update: {}, create: p });
  }

  const cart = await prisma.cart.upsert({
    where: { userId: "user-1" },
    update: {},
    create: { id: "cart-1", userId: "user-1" },
  });

  const cartItems = [
    { productId: "prod-1", quantity: 2 },
    { productId: "prod-2", quantity: 1 },
    { productId: "prod-3", quantity: 3 },
    { productId: "prod-4", quantity: 1 },
  ];
  for (const ci of cartItems) {
    const existing = await prisma.cartItem.findFirst({ where: { cartId: "cart-1", productId: ci.productId } });
    if (!existing) {
      await prisma.cartItem.create({ data: { cartId: "cart-1", ...ci } });
    }
  }

  const orders = [
    { id: "order-1", userId: "user-1", status: "DELIVERED" as const, total: 47.20, trackingNumber: "NP-3842" },
    { id: "order-2", userId: "user-1", status: "SHIPPED" as const, total: 32.50, trackingNumber: "NP-3841" },
    { id: "order-3", userId: "user-1", status: "PROCESSING" as const, total: 28.80, trackingNumber: "NP-3840" },
    { id: "order-4", userId: "user-1", status: "PAID" as const, total: 19.95, trackingNumber: "NP-3839" },
    { id: "order-5", userId: "user-1", status: "DELIVERED" as const, total: 38.40, trackingNumber: "NP-3838" },
    { id: "order-6", userId: "user-1", status: "DELIVERED" as const, total: 15.60, trackingNumber: "NP-3837" },
  ];
  for (const o of orders) {
    await prisma.order.upsert({ where: { id: o.id }, update: {}, create: o });
  }

  const orderItems = [
    { orderId: "order-1", productId: "prod-1", quantity: 2, price: 14.99 },
    { orderId: "order-1", productId: "prod-2", quantity: 1, price: 8.50 },
    { orderId: "order-2", productId: "prod-2", quantity: 1, price: 8.50 },
    { orderId: "order-2", productId: "prod-3", quantity: 3, price: 4.99 },
    { orderId: "order-2", productId: "prod-11", quantity: 1, price: 5.90 },
    { orderId: "order-3", productId: "prod-7", quantity: 2, price: 5.50 },
    { orderId: "order-3", productId: "prod-5", quantity: 1, price: 7.20 },
    { orderId: "order-4", productId: "prod-10", quantity: 3, price: 3.50 },
    { orderId: "order-5", productId: "prod-6", quantity: 2, price: 12.50 },
    { orderId: "order-6", productId: "prod-10", quantity: 2, price: 3.50 },
  ];
  for (const oi of orderItems) {
    const existing = await prisma.orderItem.findFirst({ where: { orderId: oi.orderId, productId: oi.productId } });
    if (!existing) {
      await prisma.orderItem.create({ data: oi });
    }
  }

  const addresses = [
    { id: "addr-1", userId: "user-1", tag: "Home", name: "Amara Okafor", address: "14 Bode Thomas Street, Surulere, Lagos 101241", phone: "+234 803 456 7890", isDefault: true },
    { id: "addr-2", userId: "user-1", tag: "Office", name: "Amara Okafor", address: "Plot 1682, Sanusi Fafunwa Street, Victoria Island, Lagos", phone: "+234 809 876 5432", isDefault: false },
    { id: "addr-3", userId: "user-1", tag: "Parents", name: "Mrs. Chioma Okafor", address: "22 Awolowo Road, Ikeja, Lagos 100271", phone: "+234 802 345 6789", isDefault: false },
  ];
  for (const a of addresses) {
    await prisma.address.upsert({ where: { id: a.id }, update: {}, create: a });
  }

  const wishlist = [
    { id: "wl-1", userId: "user-1", productId: "prod-5" },
    { id: "wl-2", userId: "user-1", productId: "prod-6" },
    { id: "wl-3", userId: "user-1", productId: "prod-8" },
    { id: "wl-4", userId: "user-1", productId: "prod-9" },
    { id: "wl-5", userId: "user-1", productId: "prod-10" },
    { id: "wl-6", userId: "user-1", productId: "prod-11" },
  ];
  for (const w of wishlist) {
    await prisma.wishlistItem.upsert({ where: { id: w.id }, update: {}, create: w });
  }

  const notifications = [
    { id: "notif-1", userId: "user-1", type: "order_delivered", message: "Order NP-3842 Delivered — Jollof Rice Party Pack has arrived at your door", read: true },
    { id: "notif-2", userId: "user-1", type: "order_shipped", message: "NP-3841 on the way — Your Suya Spice Set is out for delivery", read: false },
    { id: "notif-3", userId: "user-1", type: "promo", message: "Flash Sale: 20% off Grains — Rice, beans, yam flour. Stock up and save!", read: false },
    { id: "notif-4", userId: "user-1", type: "order_processing", message: "Order NP-3840 Packed — Your order is being prepared at the warehouse", read: false },
    { id: "notif-5", userId: "user-1", type: "new_product", message: "New: Chef's Special Box — Curated ingredients for Egusi + Fufu", read: true },
    { id: "notif-6", userId: "user-1", type: "referral", message: "Referral Bonus Earned — You earned ₦1,500. Tunde signed up with your link", read: false },
  ];
  for (const n of notifications) {
    await prisma.notification.upsert({ where: { id: n.id }, update: {}, create: n });
  }

  console.log("Seed complete: 3 users, 12 products, cart, 6 orders, 3 addresses, 6 wishlist, 6 notifications");
}

main().catch((e) => { console.error(e); process.exit(1); }).finally(() => prisma.$disconnect());
