# 🌍 African Diaspora Marketplace – Project Overview

## 🧠 Overview

This project is a cross-border digital marketplace designed to connect African food exporters with diaspora customers in the UK/EU.

The platform enables customers to:
- Browse African food products online
- Place secure orders using Stripe
- Track delivery progress in real time

Sellers (exporters) manage product listings and fulfill orders, while admins oversee operations, payments, and logistics tracking.

This MVP uses a **Next.js full-stack architecture**, eliminating the need for a separate backend service, enabling faster development and deployment.

---

## 🏗️ Tech Stack

### Frontend + Backend (Fullstack)
- Next.js (App Router)
- TypeScript
- Server Actions / Route Handlers

### Styling
- TailwindCSS

### Database
- PostgreSQL

### ORM
- Prisma

### Payments
- Stripe

---

## 🎯 Goals

### Primary Goals
- Enable diaspora users to easily purchase African food products
- Provide simple, reliable order tracking
- Enable exporters to fulfill orders efficiently
- Provide admin full control over operations

### Business Goals
- Launch MVP quickly
- Acquire first paying customers
- Validate cross-border demand

### Technical Goals
- Minimize infrastructure complexity
- Use fullstack Next.js for speed
- Ensure reliable payment and order handling

---

## 🔄 Core User Flow

### Customer Flow
1. User visits homepage
2. Browses products
3. Adds items to cart
4. Proceeds to checkout
5. Pays via Stripe
6. Order is created and marked as PAID
7. Customer tracks order status

---

### Seller Flow
1. Seller logs in
2. Manages products
3. Views assigned orders
4. Uploads tracking number
5. Updates delivery status

---

### Admin Flow
1. Admin logs in
2. Views all orders
3. Assigns sellers to orders
4. Overrides tracking if needed
5. Manages products and users

---

## 🧩 Features (MVP)

### 🔐 Authentication
- Email/password authentication
- JWT or session-based auth (NextAuth or custom)
- Role-based access:
  - CUSTOMER
  - SELLER
  - ADMIN

---

### 🛍️ Product System
- Product listing
- Product detail pages
- Admin & seller product management
- Categories and inventory

---

### 🛒 Cart System
- Add/remove items
- Stored in database or session

---

### 📦 Order System
Order lifecycle:
PENDING → PAID → PROCESSING → SHIPPED → DELIVERED

- Order creation after checkout
- Role-based access to orders

---

### 💳 Payments (Stripe)
- Stripe Checkout integration
- Secure payment handling
- Webhook updates order status

---

### 🚚 Tracking System (Core Feature)
- Seller uploads tracking number
- Admin override capability
- Customer views tracking status

Tracking fields:
- trackingNumber
- carrier
- status
- lastUpdated

---

### 🧑‍💼 Admin Dashboard
- Manage users
- Manage products
- Assign orders
- Update order statuses

---

### 🧑‍🌾 Seller Dashboard
- Manage products
- View assigned orders
- Upload tracking info

---

### 🔔 Notifications (Basic)
- Email notifications for:
  - Order confirmation
  - Payment success
  - Shipping updates

---

## 📦 Scope

### ✅ In Scope (MVP)
- Next.js fullstack app
- Prisma + PostgreSQL database
- Stripe payments
- Manual delivery tracking
- Admin and seller dashboards
- Role-based authentication

---

### ❌ Out of Scope
- Separate backend (NestJS, microservices)
- Mobile apps
- Real-time GPS tracking
- AI features
- Advanced logistics integrations
- Multi-currency

---

## 🏗️ Architecture Approach

- **Monolithic fullstack app (Next.js)**
- Server Actions for mutations
- Route Handlers for APIs (Stripe webhook)
- Prisma for DB access
- Minimal infrastructure for speed

---

## ⚠️ Failure Handling (MVP Level)

### Payment Failures
- Stripe webhook handles final state
- Idempotent updates using event IDs

### Order Integrity
- Use database transactions via Prisma
- Prevent partial writes

### Tracking Issues
- Admin override if seller fails

### Network Issues
- Retry-safe server actions
- Stateless API design

---

## 📊 Success Criteria

### Product Success
- Users can:
  - Browse products
  - Complete checkout
  - Track orders

---

### Business Success
- First successful transactions
- Active sellers fulfilling orders
- Repeat customers

---

### Technical Success
- Reliable Stripe payments
- Correct order updates via webhook
- No inconsistent order/payment states

---

### Operational Success
- Admin can control all flows
- Sellers can fulfill orders easily
- Customers receive accurate tracking updates

---

## 🚀 Future Expansion

- Separate backend (if scaling)
- Mobile apps
- Real-time tracking integrations
- Multi-country support
- Microservices architecture

---

## 🧱 Summary

This MVP prioritizes:
- Speed of development
- Simplicity of architecture
- Real-world usability

By using Next.js as a fullstack framework, the system reduces complexity while delivering a complete, scalable foundation for a global African marketplace.