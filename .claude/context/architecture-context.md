# 🏗️ Architecture Context

## 🧱 1. Stack

### Core Stack
- **Framework:** Next.js (App Router, Fullstack)
- **Language:** TypeScript
- **Styling:** TailwindCSS

### Backend (Integrated in Next.js)
- Server Actions (mutations)
- Route Handlers (API endpoints, webhooks)

### Database
- PostgreSQL

### ORM
- Prisma

### Payments
- Stripe (Checkout + Webhooks)

### Auth
- NextAuth (or custom JWT/session-based auth)

---

## 🌐 2. System Boundaries

The system follows a **modular monolith architecture** using Next.js.

### 🔹 Internal System (Single Codebase)

Everything runs inside one Next.js app:

- UI (React components)
- Backend logic (Server Actions)
- API endpoints (Route Handlers)
- Auth system
- Database access (Prisma)

---

### 🔹 External Systems

#### 💳 Stripe
Handles:
- Payment processing
- Payment confirmation via webhooks

Boundary:
- System trusts Stripe webhook as **source of truth for payment status**

---

### 🔹 Users

#### Customers
- Browse products
- Place orders
- Track delivery

#### Sellers (Exporters)
- Manage products
- Fulfill orders
- Upload tracking info

#### Admin
- Full system control
- Manage users, orders, and tracking

---

### 🔹 Boundary Rules

- Only backend (Server Actions / Route Handlers) can access database
- Client never talks directly to database
- Stripe communicates via secure webhook endpoint
- Role-based access enforced at server layer

---

## 🗄️ 3. Storage Model

### Database: PostgreSQL

Structured relational model using Prisma.

---

### 🔑 Core Entities

#### User
- id
- email
- passwordHash
- role (CUSTOMER | SELLER | ADMIN)
- createdAt

---

#### Product
- id
- name
- description
- price
- stock
- sellerId
- createdAt

---

#### Order
- id
- userId
- status (PENDING, PAID, PROCESSING, SHIPPED, DELIVERED)
- totalAmount
- createdAt

---

#### OrderItem
- id
- orderId
- productId
- quantity
- price

---

#### Payment
- id
- orderId
- stripeSessionId
- status
- amount
- createdAt

---

#### Tracking
- id
- orderId
- trackingNumber
- carrier
- status
- updatedAt

---

### 🔄 Data Relationships

- User → Orders (1:N)
- Order → OrderItems (1:N)
- Product → Seller (N:1)
- Order → Payment (1:1)
- Order → Tracking (1:1)

---

### 🧠 Design Decisions

- Use **normalized relational schema**
- Use **foreign keys for integrity**
- Use **transactions for order + payment consistency**
- Store tracking separately for flexibility

---

## 🔐 4. Auth Model

### Approach

- Session-based authentication (NextAuth) OR JWT (custom)
- Role-based access control (RBAC)

---

### Roles

#### CUSTOMER
- Browse products
- Create orders
- View own orders
- Track deliveries

---

#### SELLER
- Manage own products
- View assigned orders
- Upload tracking info

---

#### ADMIN
- Full access
- Manage users, orders, products
- Override tracking and status

---

### 🔑 Auth Flow

1. User logs in
2. Session/JWT created
3. Role attached to session
4. Server validates role on every protected action

---

### 🔒 Security Rules

- Passwords hashed (bcrypt)
- Server-only DB access
- Protected routes via middleware
- Role checks enforced server-side

---

## 🤝 5. Collaboration Model

This system is **not real-time collaborative**, but multi-actor.

---

### Actors Interaction

#### Customer ↔ System
- Places order
- Receives updates

---

#### Seller ↔ System
- Fulfills order
- Adds tracking

---

#### Admin ↔ System
- Oversees entire flow
- Resolves issues

---

### 🔄 Collaboration via Shared Data

All roles interact through:
- Orders
- Tracking updates
- Product listings

---

### 🧠 Consistency Strategy

- **Single source of truth: database**
- No real-time sync (MVP)
- Updates reflected on page reload / fetch

---

### ⚠️ Conflict Handling

#### Example: Seller vs Admin update
- Admin has override priority
- Last-write wins strategy
- Optional audit logs (future)

---

### 🔔 Communication Model

- System-driven updates:
  - Order status changes
  - Tracking updates

- Delivered via:
  - Email (MVP)
  - UI dashboards

---

## 🧱 Architectural Summary

- **Pattern:** Modular Monolith
- **Deployment:** Single Next.js app
- **State Management:** Server-first
- **Data Consistency:** Strong (PostgreSQL + Prisma)
- **Scalability Path:** Can evolve into microservices later

---

## 🚀 Why This Works

- Fast to build (MVP-friendly)
- Low infrastructure complexity
- Easy to scale later
- Clear separation of roles and responsibilities