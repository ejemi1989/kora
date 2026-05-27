# 🧑‍💻 Code Standards

## General

- Keep modules small, composable, and single-purpose.
- Fix root causes — do not layer hacks or temporary patches.
- Do not mix unrelated concerns (UI, business logic, DB access).
- Respect system boundaries defined in `architecture-context.md`.
- Prefer server-side logic over client-side work where possible.
- All critical flows (orders, payments, tracking) must be deterministic and idempotent.

---

## TypeScript

- Strict mode is required across the entire codebase.
- Avoid `any` — use explicit types or constrained generics.
- Use `interface` for domain models (User, Order, Product).
- Use `type` for unions, helpers, and derived types.

### Domain Modeling

Always define core entities explicitly:
- User
- Product
- Order
- OrderItem
- Payment
- Tracking

### Validation at Boundaries

- Validate all external input using `zod`:
  - Server Actions
  - API routes
  - Stripe webhooks

- Never trust:
  - Request body
  - Query params
  - Webhook payloads

---

## Next.js

- Default to React Server Components.
- Add `"use client"` only when necessary (forms, interactivity).

### Server Actions

- All mutations must go through Server Actions:
  - Create order
  - Update tracking
  - Manage products

Server Actions must:
- Validate input
- Enforce auth + role
- Be idempotent where needed

---

### Route Handlers (`/app/api`)

Use only for:
- Stripe webhooks
- External integrations

Rules:
- Keep handlers thin
- Delegate logic to `/lib` or `/services`
- No business logic inside handlers

---

### Responsibility Layers

| Layer            | Responsibility |
|------------------|--------------|
| Component        | UI only |
| Server Action    | Business logic |
| Route Handler    | External input handling |
| DB Layer         | Data access |

---

## Styling

- Use TailwindCSS with design tokens only.
- Do NOT use raw colors (`zinc-*`, hex values).

### Tokens

Use semantic classes:
- `bg-base`
- `bg-surface`
- `text-primary`
- `text-muted`
- `text-brand`
- `border-default`

### Layout Rules

- `rounded-xl` → small elements  
- `rounded-2xl` → cards  
- `rounded-3xl` → modals  

---

## API Routes

- Validate input before logic runs
- Enforce authentication and role checks
- Verify Stripe signatures before processing

### Response Shape

```ts
{
  success: boolean;
  data?: T;
  error?: string;
}