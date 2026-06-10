import { PrismaClient } from "../lib/generated/prisma/client";

const prisma = new PrismaClient();

async function main() {
  const user = await prisma.user.upsert({
    where: { email: "buyer@deni.com" },
    update: {},
    create: { id: "user-1", name: "Amara Okafor", email: "buyer@deni.com", role: "CUSTOMER" },
  });

  const seller = await prisma.user.upsert({
    where: { email: "seller@deni.com" },
    update: {},
    create: { id: "seller-1", name: "Chidi Okonkwo", email: "seller@deni.com", role: "SELLER" },
  });

  const admin = await prisma.user.upsert({
    where: { email: "admin@deni.com" },
    update: {},
    create: { id: "admin-1", name: "Admin User", email: "admin@deni.com", role: "ADMIN" },
  });

  const products = [
    { id: "prod-1", name: "Gari Ijebu", description: "1kg · Premium fine Ijebu Garri", price: 10000, stock: 150, images: ["/images/prod-garri.png"], category: "Grains & Rice", sellerId: "seller-1", rating: 4.7 },
    { id: "prod-2", name: "Ofada Rice", description: "1kg · Authentic local Ofada rice", price: 15000, stock: 100, images: ["/images/prod-ofada.png"], category: "Grains & Rice", sellerId: "seller-1", rating: 4.8 },
    { id: "prod-3", name: "Yam", description: "1kg · Large organic white yam tuber", price: 8000, stock: 80, images: ["/images/prod-yam.png"], category: "Vegetables", sellerId: "seller-1", rating: 4.5 },
    { id: "prod-4", name: "Cocoa Yam", description: "1kg · Fresh cocoyam tubers", price: 8000, stock: 90, images: ["/images/prod-cocoyam.png"], category: "Vegetables", sellerId: "seller-1", rating: 4.4 },
    { id: "prod-5", name: "Water Yam", description: "1kg · Premium water yam tubers", price: 6000, stock: 60, images: ["/images/prod-wateryam.png"], category: "Vegetables", sellerId: "seller-1", rating: 4.3 },
    { id: "prod-6", name: "Yam Flour", description: "1kg · Premium elubo for Amala", price: 10000, stock: 120, images: ["/images/prod-yamflour.png"], category: "Grains & Rice", sellerId: "seller-1", rating: 4.6 },
    { id: "prod-7", name: "Cassava Flour", description: "1kg · High quality cassava flour", price: 6000, stock: 140, images: ["/images/prod-cassavaflour.png"], category: "Grains & Rice", sellerId: "seller-1", rating: 4.4 },
    { id: "prod-8", name: "Dried Cray Fish", description: "1kg · Properly sun-dried whole crayfish", price: 20000, stock: 70, images: ["/images/prod-crayfish.png"], category: "Fish & Seafood", sellerId: "seller-1", rating: 4.9 },
    { id: "prod-9", name: "Snails", description: "1kg · Large, clean land snails", price: 24000, stock: 50, images: ["/images/prod-snails.png"], category: "Fish & Seafood", sellerId: "seller-1", rating: 4.8 },
    { id: "prod-10", name: "Fresh Plantain", description: "1kg · Sweet, fresh plantains", price: 10000, stock: 110, images: ["/images/prod-plantain.png"], category: "Vegetables", sellerId: "seller-1", rating: 4.6 },
    { id: "prod-11", name: "Processed Egusi", description: "1kg · Pre-ground peeled melon seeds", price: 10000, stock: 130, images: ["/images/prod-egusi.png"], category: "Spices & Seasoning", sellerId: "seller-1", rating: 4.7 },
    { id: "prod-12", name: "Processed Ogbono", description: "1kg · Pure ground Ogbono seeds", price: 15000, stock: 85, images: ["/images/prod-ogbono.png"], category: "Spices & Seasoning", sellerId: "seller-1", rating: 4.7 },
    { id: "prod-13", name: "Processed Groundnuts", description: "1kg · Roasted crunchy peanuts", price: 15000, stock: 160, images: ["/images/prod-groundnuts.png"], category: "Snacks", sellerId: "seller-1", rating: 4.5 },
    { id: "prod-14", name: "Red Palm Oil", description: "1kg · Pure traditional red palm oil", price: 8000, stock: 95, images: ["/images/prod-palmoil.png"], category: "Oils & Condiments", sellerId: "seller-1", rating: 4.8 },
    { id: "prod-15", name: "Dried Fish (Pala, Sawa, Agbodo)", description: "1kg · Dry fish assortment for native soups", price: 10000, stock: 75, images: ["/images/prod-driedfish.png"], category: "Fish & Seafood", sellerId: "seller-1", rating: 4.7 },
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
    { productId: "prod-11", quantity: 2 },
    { productId: "prod-14", quantity: 1 },
    { productId: "prod-13", quantity: 3 },
    { productId: "prod-8", quantity: 1 },
  ];
  for (const ci of cartItems) {
    const existing = await prisma.cartItem.findFirst({ where: { cartId: "cart-1", productId: ci.productId } });
    if (!existing) {
      await prisma.cartItem.create({ data: { cartId: "cart-1", ...ci } });
    }
  }

  const orders = [
    { id: "NP-0001", userId: "user-1", status: "DELIVERED" as const, total: 35000, trackingNumber: "NP-0001" },
    { id: "NP-0002", userId: "user-1", status: "SHIPPED" as const, total: 47000, trackingNumber: "NP-0002" },
    { id: "NP-0003", userId: "user-1", status: "PROCESSING" as const, total: 18000, trackingNumber: "NP-0003" },
    { id: "NP-0004", userId: "user-1", status: "PAID" as const, total: 30000, trackingNumber: "NP-0004" },
    { id: "NP-0005", userId: "user-1", status: "DELIVERED" as const, total: 20000, trackingNumber: "NP-0005" },
    { id: "NP-0006", userId: "user-1", status: "DELIVERED" as const, total: 20000, trackingNumber: "NP-0006" },
  ];
  for (const o of orders) {
    await prisma.order.upsert({ where: { id: o.id }, update: {}, create: o });
  }

  const orderItems = [
    { orderId: "NP-0001", productId: "prod-1", quantity: 2, price: 10000 },
    { orderId: "NP-0001", productId: "prod-2", quantity: 1, price: 15000 },
    { orderId: "NP-0002", productId: "prod-2", quantity: 1, price: 15000 },
    { orderId: "NP-0002", productId: "prod-3", quantity: 3, price: 8000 },
    { orderId: "NP-0002", productId: "prod-14", quantity: 1, price: 8000 },
    { orderId: "NP-0003", productId: "prod-7", quantity: 2, price: 6000 },
    { orderId: "NP-0003", productId: "prod-5", quantity: 1, price: 6000 },
    { orderId: "NP-0004", productId: "prod-10", quantity: 3, price: 10000 },
    { orderId: "NP-0005", productId: "prod-6", quantity: 2, price: 10000 },
    { orderId: "NP-0006", productId: "prod-10", quantity: 2, price: 10000 },
  ];
  for (const oi of orderItems) {
    const existing = await prisma.orderItem.findFirst({ where: { orderId: oi.orderId, productId: oi.productId } });
    if (!existing) {
      await prisma.orderItem.create({ data: oi });
    }
  }

  const trackingEvents = [
    { orderId: "NP-0001", step: 1, label: "Order Confirmed", description: "Payment verified successfully", time: "May 23, 09:14 AM" },
    { orderId: "NP-0001", step: 2, label: "Processing", description: "Order being prepared at warehouse", time: "May 23, 02:30 PM" },
    { orderId: "NP-0001", step: 3, label: "Shipped", description: "Package dispatched for delivery", time: "May 24, 10:00 AM" },
    { orderId: "NP-0001", step: 4, label: "Delivered", description: "Package delivered to your address", time: "May 25, 02:15 PM" },
    { orderId: "NP-0002", step: 1, label: "Order Confirmed", description: "Payment verified successfully", time: "May 24, 11:20 AM" },
    { orderId: "NP-0002", step: 2, label: "Processing", description: "Order being prepared at warehouse", time: "May 24, 04:45 PM" },
    { orderId: "NP-0002", step: 3, label: "Shipped", description: "Package dispatched for delivery", time: "May 25, 09:30 AM" },
    { orderId: "NP-0003", step: 1, label: "Order Confirmed", description: "Payment verified successfully", time: "May 25, 10:00 AM" },
    { orderId: "NP-0003", step: 2, label: "Processing", description: "Order being prepared at warehouse", time: "May 25, 01:15 PM" },
    { orderId: "NP-0004", step: 1, label: "Order Confirmed", description: "Payment verified successfully", time: "May 26, 03:30 PM" },
    { orderId: "NP-0005", step: 1, label: "Order Confirmed", description: "Payment verified successfully", time: "May 27, 09:00 AM" },
    { orderId: "NP-0005", step: 2, label: "Processing", description: "Order being prepared at warehouse", time: "May 27, 12:00 PM" },
    { orderId: "NP-0005", step: 3, label: "Shipped", description: "Package dispatched for delivery", time: "May 28, 08:00 AM" },
    { orderId: "NP-0005", step: 4, label: "Delivered", description: "Package delivered to your address", time: "May 29, 11:30 AM" },
    { orderId: "NP-0006", step: 1, label: "Order Confirmed", description: "Payment verified successfully", time: "May 28, 02:00 PM" },
    { orderId: "NP-0006", step: 2, label: "Processing", description: "Order being prepared at warehouse", time: "May 28, 05:30 PM" },
    { orderId: "NP-0006", step: 3, label: "Shipped", description: "Package dispatched for delivery", time: "May 29, 10:00 AM" },
    { orderId: "NP-0006", step: 4, label: "Delivered", description: "Package delivered to your address", time: "May 30, 01:45 PM" },
  ];
  for (const te of trackingEvents) {
    const existing = await prisma.trackingEvent.findFirst({ where: { orderId: te.orderId, step: te.step } });
    if (!existing) {
      await prisma.trackingEvent.create({ data: te });
    }
  }

  const payments = [
    { orderId: "NP-0001", amount: 47.20, status: "SUCCESS" as const, stripeId: "seed-pi-1", method: "card" },
    { orderId: "NP-0002", amount: 32.50, status: "SUCCESS" as const, stripeId: "seed-pi-2", method: "card" },
    { orderId: "NP-0003", amount: 28.80, status: "SUCCESS" as const, stripeId: "seed-pi-3", method: "card" },
    { orderId: "NP-0004", amount: 19.95, status: "SUCCESS" as const, stripeId: "seed-pi-4", method: "card" },
    { orderId: "NP-0005", amount: 38.40, status: "SUCCESS" as const, stripeId: "seed-pi-5", method: "card" },
    { orderId: "NP-0006", amount: 15.60, status: "SUCCESS" as const, stripeId: "seed-pi-6", method: "card" },
  ];
  for (const p of payments) {
    const existing = await prisma.payment.findUnique({ where: { orderId: p.orderId } });
    if (!existing) {
      await prisma.payment.create({ data: p });
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

  console.log("Seed complete: 3 users, 12 products, cart, 6 orders, 3 addresses, 6 wishlist, 18 tracking events, 6 payments");
}

main().catch((e) => { console.error(e); process.exit(1); }).finally(() => prisma.$disconnect());
