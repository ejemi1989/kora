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

## INVARIANTS

Use this as a non-negotiable rules layer for your system.

🔒 1. CORE SYSTEM INVARIANTS
## Core Invariants

- The system MUST be role-based: buyer, seller, admin are isolated domains.
- No UI, logic, or data access is shared implicitly across roles.
- All data flows must be explicit (props, API, or service layer).
- No direct database access from UI components.
- Every feature must map to a clear domain (product, order, user, etc).

🧱 2. UI ARCHITECTURE INVARIANTS
## UI Architecture Invariants

- Raw HTML files MUST NOT be used in production.
- All UI must be broken into reusable components.
- Components must be:
  - Stateless (preferred)
  - Controlled via props
  - Independent of page context

- Pages must only compose components — never contain complex UI logic.

- Shared UI goes in `/components/ui`
- Feature UI goes in `/components/features/{domain}`

- Layouts must be separated:
  - MarketingLayout
  - DashboardLayout

- No duplication of UI patterns (cards, tables, modals).

🔁 3. STATE & DATA FLOW INVARIANTS
## Data Flow Invariants

- Data flows in ONE direction: backend → page → component
- No component fetches data directly (unless explicitly defined as a data component)

- All async logic must live in:
  - services/
  - server actions
  - API routes

- No hardcoded data in production UI

🧩 4. COMPONENT DESIGN INVARIANTS
## Component Invariants

Each component must:

- Have a single responsibility
- Be reusable across at least 2 contexts OR clearly scoped to a feature
- Accept data via props only
- Not depend on global state unless explicitly designed

Naming:

- ProductCard
- OrderRow
- UserTable
- NOT: random/div-based naming

No component should exceed ~150 lines
🗂️ 5. FILE STRUCTURE INVARIANTS
## File Structure Invariants

/app
  /(marketing)
  /(buyer)
  /(seller)
  /(admin)

/components
  /ui
  /layout
  /features

/lib
  /services
  /utils

- Role routes MUST be isolated using route groups
- Feature folders MUST reflect domain logic
- No mixing of admin/seller/buyer components
🔐 6. ROLE ISOLATION INVARIANTS
## Role Isolation

- Buyer cannot access seller UI
- Seller cannot access admin UI
- Admin has full visibility but uses separate components

- Each role has:
  - Separate layout
  - Separate navigation
  - Separate feature set

- Shared logic must go through services, not UI reuse
⚡ 7. INTERACTION INVARIANTS
## Interaction Rules

Every user action must map to:

Action → Event → State Change → UI Feedback

Example:
Click "Add to Cart"
→ event: add_to_cart
→ service call
→ state update
→ UI re-render

- No silent actions
- Every action must have feedback (loading, success, error)
🧠 8. AI CODING INVARIANTS (CRITICAL)
## AI Coding Invariants

When generating code:

- AI must NEVER:
  - Create monolithic files
  - Mix roles
  - Hardcode data
  - Skip componentization

- AI must ALWAYS:
  - Follow folder structure
  - Use existing components when possible
  - Respect design tokens
  - Keep logic separated (UI vs data)

- Every AI-generated file must:
  - Declare its purpose
  - Fit into existing architecture
🎨 9. DESIGN SYSTEM INVARIANTS
## Design System Rules

- No raw colors (e.g. #fff, #000)
- Use design tokens only:
  - bg-base
  - text-primary
  - border-default
  - accent-price

- Spacing must follow scale (4, 8, 12, 16, 24...)
- Radius and shadows must be consistent

- UI must feel:
  clean, minimal, consistent
🚫 10. ANTI-PATTERNS (STRICTLY FORBIDDEN)
## Anti-Patterns

- Copy-paste HTML reuse ❌
- Mixing admin + seller UI ❌
- Fetching inside UI components ❌
- Inline styles everywhere ❌
- Giant pages with all logic ❌
- Unnamed or generic components ❌