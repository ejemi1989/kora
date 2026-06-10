# Progress Tracker

Update this file whenever the current phase, active feature, or implementation state changes.

## Current Phase

- Payment System: Stripe integration — Backend Implementation Complete

## Current Goal

- Implement Stripe Checkout integration, PaymentIntent creation, webhook handling, and checkout UI with Stripe Elements.

## Current Build

- `npm run build` — zero errors
- `npx tsc --noEmit` — zero errors
- Dev server at localhost:3001 — all pages render

## Completed

### Clerk Auth Implementation (from auth.md spec)
- `app/layout.tsx` — ClerkProvider updated with appearance overrides mapped to app CSS variables
- `app/api/me/route.ts` — GET endpoint returning Clerk user + role
- All three shells — `<UserButton />` in topbar, custom logout removed
- `proxy.ts` — Configured with `clerkMiddleware`; later extended with role-based authorization to restrict users to their own dashboard
- TypeScript fixed: `afterSignInUrl` → `fallbackRedirectUrl`, `afterSignOutUrl` removed from UserButton

### Custom Forms (replacing Clerk pre-built components)
- **`app/sign-up/[[...sign-up]]/page.tsx`** — Custom sign-up form using `useSignUp()` hook with:
  - Role tabs: Buyer (`CUSTOMER`), Seller (`SELLER`), Admin (`ADMIN`)
  - Per-role heading, subtitle, left-panel feature list, accent color
  - Email + password fields, email verification step
  - Google OAuth button (routes to `/sso-callback`)
  - Role stored via `signUp.password({ ..., unsafeMetadata: { role } })`
- **`app/sign-in/[[...sign-in]]/page.tsx`** — Custom sign-in form using `useSignIn()` hook with:
  - Role tabs with per-role branding/copy
  - Email + password form, Google OAuth
  - MFA step (TOTP, email code, phone code, backup code)
- **`app/sso-callback/[[...sso-callback]]/page.tsx`** — OAuth callback handler using `AuthenticateWithRedirectCallback` with `signInFallbackRedirectUrl` / `signUpFallbackRedirectUrl`
- Role accent colors: Buyer = `var(--primary)`, Seller = `#2563eb` (blue), Admin = `#7c3aed` (purple)
- Two-panel layout (feature list left, form right) on desktop, form-only on mobile

### Auth Callback & Role Routing
- **`app/auth/callback/page.tsx`** — Role-based routing: checks `dbUser.role` first, falls back to `unsafeMetadata.role`, then `/auth/choose-role`
- **`app/auth/choose-role/page.tsx`** — Role selection for users without `unsafeMetadata.role` (existing users / Google SSO without role)
- Role-to-dashboard map: `CUSTOMER → /user/overview`, `SELLER → /seller/overview`, `ADMIN → /admin/overview`
- `unsafeMetadata` set directly in `signUp.password()` call via `SignUpFutureAdditionalParams`

### Proxy URL Removed
- Removed `NEXT_PUBLIC_CLERK_PROXY_URL=/__clerk` from `.env` — auto-proxy broke clerk-js loading locally
- Custom forms don't need Clerk UI CDN, only clerk-js which loads from CDN directly (`https://boss-foal-21.clerk.accounts.dev/npm/@clerk/clerk-js@6/dist/clerk.browser.js`)

### JWT auth layer cleanup
- Removed `app/(auth)/` (old login + signup pages), `app/api/auth/` (old login + logout routes), `lib/auth.ts` (JWT sign/verify utilities), `lib/data/auth.ts` (hardcoded seed users)
- Removed `loginSchema` and `signupSchema` from `lib/validation.ts` (only used by old login route)
- Uninstalled `jose` dependency (only used by `lib/auth.ts`)
- All old `/login`, `/signup`, `/api/auth/*` routes removed from build — Clerk handles everything now

### Prisma client generation fix
- `prisma/schema.prisma` had `output = "../lib/generated/prisma"` but client was never generated
- Ran `npx prisma generate` — generated client in `lib/generated/prisma/`
- Prisma v6 `prisma-client` provider produces no `index.ts` — entry point is `client.ts`
- Fixed imports in `lib/prisma.ts` and `prisma/seed.ts` to import from `./client`

### Integration tests + dashboard verification (pre-custom-forms)
- 11 Playwright tests covering route protection, public page rendering, dashboard redirects
- All 11 tests passed (using old pre-built components at the time)

### Design System
- All `ui-context.md` design tokens implemented as CSS custom properties + `@theme inline` in globals.css
- All shadcn/ui v4 components configured (Button, Card, Dialog, Input, Tabs, Textarea, ScrollArea)
- Inter + JetBrains Mono fonts via next/font
- Layout components: Sidebar, Topbar, Shell
- Shared components: Badge, Button, Toast, Modal, StatCard, Panel, FormFields, NotificationBell, Avatar, DeliveryStepper, Timeline, ProgressBar, EmptyState, Icon

### Landing Page
- `app/globals.css` — includes all CSS custom properties from ui-context.md + landing-specific tokens + responsive breakpoints
- All landing sections implemented (Navbar, Hero, HowItWorks, DarkSection, SocialProof, Community, Footer)
- 18 PNG images + 5 SVG icons in `public/`
- Swirl aspect ratio fix using `fill` prop + `sizes="340px"`
- Preload verification for LCP images
- Zero build errors, zero warnings, all images visible in browser

### User Dashboard (Kora)
- `/lib/types/user.ts` — TypeScript interfaces: UserProduct, CartItem, UserOrder, TrackingEvent, etc.
- `/lib/data/user.ts` — seed data: 12 products, 8 categories, 4 cart items, 6 orders, etc.
- `/components/user/user-context.tsx` — React Context with global state + actions
- `/components/user/icons.tsx` — 13 inline SVG icon components
- `/app/user/layout.tsx` — wraps children in UserProvider + UserShell
- `/components/user/user-shell.tsx` — sidebar, topbar, toast container, mobile hamburger/overlay
- `/app/user/[page]/page.tsx` — dynamic route dispatching to 10 page components
- 10 page components: overview, shop, orders, tracking, cart, wishlist, addresses, payments, notifications, settings
- All interactions verified via browser testing

### Admin Dashboard (Kora)
- `/lib/types/admin.ts`, `/lib/data/admin.ts` — TypeScript interfaces + seed data
- `/components/admin/admin-context.tsx` — React Context with global state + actions
- `/components/admin/admin-shell.tsx` — sidebar with 13 nav items in 4 groups
- `/app/admin/layout.tsx` — wraps children in AdminProvider + AdminShell
- `/app/admin/[page]/page.tsx` — dynamic route dispatching to 12 page components
- 12 admin page components including currencies with inline rate editing, set-as-base, etc.

### Seller Dashboard (Kora)
- `/lib/types/seller.ts`, `/lib/data/seller.ts` — TypeScript interfaces + seed data
- `/components/seller/seller-context.tsx` — React Context with global state + actions
- `/components/seller/seller-shell.tsx` — orange-themed sidebar with 10 nav items
- `/app/seller/layout.tsx` — wraps children in SellerProvider + SellerShell
- `/app/seller/[page]/page.tsx` — dynamic route dispatching to 10 page components
- 10 seller page components: overview, products, orders, inventory, analytics, payouts, customers, reviews, promotions, settings
- Seller card style: border + shadow instead of admin's shadow-only cards
- Seller toast: bottom-right with slide-in-from-right animation

### Security Layer (from security.md spec)
- `lib/auth.ts` — JWT auth utilities (later cleaned up in JWT cleanup)
- `lib/validation.ts` — Zod schemas for all routes + shared response helpers
- `lib/rate-limit.ts` — In-memory sliding window rate limiter
- `middleware.ts` — Route protection with matcher (later renamed to `proxy.ts`)

### Role-Based Access Control (post-auth)
- `proxy.ts` — Extended `clerkMiddleware` handler with role-scoped authorization:
  - After `auth.protect()`, fetches the user's role from Clerk `unsafeMetadata` via `clerkClient().users.getUser()`
  - Maps URL prefix (`/admin`, `/seller`, `/user`) to expected role (`ADMIN`, `SELLER`, `CUSTOMER`)
  - Redirects role mismatches to the user's correct dashboard (e.g., CUSTOMER → `/user/overview`)
  - Defaults to `CUSTOMER` role if no `unsafeMetadata.role` is set

### Landing Page CTA Fixes
- `components/landing/Community.tsx` — "Get started" button changed from `href="#"` to `href="/sign-up"`
- Verified all other CTAs: Hero "Start for free" → `/sign-up`, Navbar "Login" → `/sign-in`, Navbar "Start for free" → `/sign-up`

### Pricing Page Added & Removed
- Created `/pricing` with 3 tiers (Starter Free, Business $29/mo, Enterprise $99/mo), billing toggle via URL search params, FAQ via native `<details>`/`<summary>`
- Navbar pricing link pointed to `/pricing`
- **Removed**: Pricing link from Navbar, pricing page deleted

### Contact Page
- Created `app/contact/page.tsx` — contact cards (email, phone, address), message form
- Updated "Contact us" links on `/pricing` and `/how-it-works` from `/sign-up` to `/contact`

### Next.js 16: searchParams is a Promise
- `searchParams` page prop is a `Promise` that must be `await`ed (breaking change from Next.js 15+)
- Fixed `/pricing` billing toggle and other pages that read `searchParams` synchronously

### Stripe Checkout Flow Fix
- **Bug**: `CheckoutPageClient` didn't send `x-user-id` header to `/api/payments/create-intent`, so the endpoint returned 401
- **Fix**: Added `useAuth().userId` + `x-user-id` header to the fetch call in `CheckoutPageClient`
- Full flow now works: Cart → Checkout API (create Order) → Redirect to `/user/checkout/[orderId]` → Create PaymentIntent (Stripe API) → Stripe Elements card form → `confirmPayment()` → Redirect to `/user/orders`
- Prices in USD cents (Stripe compatible), test card `4242 4242 4242 4242`

### Sign-In Role Enforcement Fixes
- **Fix 1 — `useEffect` race condition:** The effect redirecting signed-in users to `/auth/callback` was missing `intended_role` param and fired before `signIn.finalize()`'s navigate callback. Fixed by:
  - Added `intended_role` query param to useEffect redirect URL
  - Added `navigatingRef` guard so effect skips when handleSubmit/handleMFAVerify is already handling finalize navigation
  - Added `role` to effect dependency array so it captures the current tab selection
- **Fix 2 — `signIn.finalize()` navigate callback:** Changed to use `window.location.href` consistently (instead of `router.push` for relative URLs) so navigation is atomic and won't be preempted by re-renders
- **Fix 3 — Google SSO `redirectUrl`:** Changed from `"/auth/callback"` to `"/auth/callback?intended_role=" + encodeURIComponent(role)` so the selected tab's role is preserved through the OAuth redirect chain

### Seller Dashboard Functional Fixes
- **Products image upload:** Added file input with preview to Add Product modal; `SellerProduct` type extended with optional `image` field
- **Products Add Product:** Extracted `ProductForm` component with self-contained controlled state; form now collects name, price, stock, category, unit + image and creates a real `SellerProduct` in state
- **Products Edit button:** Changed from placeholder toast to pre-filled edit modal using same `ProductForm` component; saves changes back to state
- **Promotions New/Edit:** Extracted `PromotionForm` component; New Promotion now computes discount label and creates real `SellerPromotion` in state; Edit pre-fills and updates state on save
- **Settings bank form:** Converted bank name, account number, account name, auto-withdraw threshold, and payout schedule from `defaultValue` to controlled `value` + `onChange` pattern

### QA Skill Definition
- `quality/QA.md` — enriched YAML frontmatter with full metadata: `version`, `status`, `tags` (qa, testing, bug-fixing, quality-assurance, e2e-testing, regression), `execution` config (tier 1, interactive mode, url/description inputs, required tools), and `discovery` section (goal, tasks, audience, triggers, not_for boundaries)
- Frontmatter follows the same metadata schema as `quality/distributed.md` (BookForge community skill format)
- Existing 247-line QA workflow (10-phase test-fix-verify process, health score rubric) preserved untouched
- Skill is discoverable by pattern-matching triggers: "qa", "test this site", "find bugs", "does this work", "quality check"

### Distributed Failure Analyzer Skill
- `quality/distributed.md` — BookForge community skill (CC-BY-SA-4.0) from Designing Data-Intensive Applications
- Registered at `~/.claude/skills/distributed-failure-analyzer/SKILL.md` → symlink to project file
- Full metadata already present: version 1.0.0, 25 tags, tier 2 hybrid execution, 7 triggers covering timeout/corruption/zombie/stale-read scenarios
- Covers: network fault taxonomy, clock unreliability, process pauses, fencing tokens, Byzantine fault scoping, system model selection

### Brand Alignment: Akara Market → Kora Rename
- `progress-tracker.md` — updated header from "Seller Dashboard (Akara Market)" to "Seller Dashboard (Kora)"
- `.claude/context/seller/seller-dashboard.md` — replaced all 10 occurrences of "Akara Market" with "Kora"
- `.claude/context/seller/seller-dashboard.html` — replaced all 4 occurrences (title, sidebar brand, overview subtitle, settings form values)
- Consistency: seller dashboard now matches existing "Kora" naming used for the user dashboard

### Order Tracking: Seller/Admin Add Tracking Numbers
- **Types** — added `trackingNumber?: string` to `SellerOrder`, `AdminOrder`, `UserOrder`
- **Mock data** — added tracking numbers to shipped/delivered orders in seller, admin, and user data files
- **Seller Orders page** (`components/seller/pages/orders.tsx`):
  - Added "Tracking" column after Date
  - Inline editable `TrackingCell` component: shows existing tracking number with Edit button, or input field with Set button
  - Enter key or Set button saves tracking number to local state with toast confirmation
- **Admin Orders page** (`components/admin/pages/orders.tsx`):
  - Made orders stateful (local useState instead of constant import)
  - Added "Tracking" column in table showing number or dash
  - Replaced "No tracking info available yet" in detail modal with editable `TrackingSection` component
  - Admin enters tracking number and clicks Save — updates local state with toast
- **User Tracking page** (`components/user/pages/tracking.tsx`):
  - Added order selector dropdown to switch between tracked orders
  - Shows tracking number below the header (e.g., "Tracking: TRK-3841")
- **User Orders detail** (`components/user/pages/orders.tsx`):
  - Shows tracking number badge in order detail card when present
- **Bonus fixes** — Fixed 3 pre-existing TS errors: missing `PageId` import in `app/user/[page]/page.tsx`, missing `SellerPageId` duplicate, missing `AdminPageId` import in `admin-shell.tsx`

### Brand Alignment: Kongo → Kora (Admin Dashboard)
- `components/admin/admin-shell.tsx` — sidebar wordmark `kongo` → `Kora`, topbar breadcrumb `Kongo` → `Kora`
- `components/seller/seller-shell.tsx` — sidebar wordmark `akara market` → `Kora`
- `components/seller/pages/settings.tsx` — email `hello@akaramarket.com` → `hello@kora.com`
- All visible "Kongo" and "Akara Market" references removed from admin and seller UI code

### Notification Subtitle Visibility Fix
- `components/user/user-shell.tsx` — dropdown description/time/unread colors changed from `var(--muted)`/`var(--ash)` to `var(--muted-text)`
- `components/user/pages/notifications.tsx` — full page description, time, and "X unread" all changed to `var(--muted-text)`

### Prisma Vercel Production Fix
- `prisma/schema.prisma` — added `binaryTargets = ["native", "rhel-openssl-3.0.x"]` so `prisma generate` produces Linux-compatible engine binary for Vercel's `rhel-openssl-3.0.x` runtime
- `package.json` — added `"postinstall": "prisma generate"` so engine is generated during Vercel build
- `lib/prisma.ts` — replaced lazy dynamic require with standard singleton pattern (`globalThis` cache + `new PrismaClient()`)
- Removed duplicate `generator client` block (old `prisma-client-js` provider) from schema bottom
- Build passes zero errors; both engines (`darwin-arm64` + `rhel-openssl-3.0.x`) generated

### Naira Sign (`₦`) Rendering Fix
- `\u20A6` in JSX text content renders as literal `\u20A6` instead of the Naira sign
- Fixed 16 occurrences across 6 files: wrapped every `\u20A6` in `{'\u20A6'}` JSX expression
- Files: `cart.tsx` (8), `orders.tsx` (2), `overview.tsx` (1), `payments.tsx` (2), `shop.tsx` (2), `wishlist.tsx` (1)
- Template literal usages (`` `\u20A6${...}` ``) were already correct — left untouched

### Muted Text Visibility Fix
- `app/globals.css` — changed `--muted: #f5f5f5` to `--muted: #000000` (near-white → black)
- Root cause: `var(--muted)` was used as text color in ~37 places across user components, but `--muted` was `#f5f5f5` — nearly invisible on white background
- `--muted` is only used as text color in these components (never as background), so the change is safe

### Shop "Add Again" Qty Display
- `components/user/pages/shop.tsx` — button now shows current cart qty: `Add again (2)` instead of plain `Add again`
- Added `cartQty()` helper to look up current qty from cart state
- Toast message now shows product name + new qty: `✅ Product Name — Qty: 3`

### Cart localStorage Persistence
- `components/user/user-context.tsx` — cart state now persists to `localStorage` under key `kora-cart`
- Lazy initializer reads saved cart on mount; `useEffect` writes on every cart change
- Cart survives page refreshes and tab closures; reverts to `INITIAL_CART` only if no saved state found

### Payment System Context
- `.claude/context/payment.md` — comprehensive payment system architecture document covering:
  - Stripe Checkout flow and webhook handling
  - Prisma Payment model and status transitions
  - API routes (`POST /api/checkout`, `POST /api/payments/create-intent`, `POST /api/webhooks/stripe`)
  - What's implemented (UI only — user/admin payments pages with seed data)
  - What's pending (backend Stripe integration, webhook handler)
  - Edge cases: duplicate webhooks, delayed confirmation, session expiry, refunds
  - Environment variables and testing setup

### Payment System Backend Implementation
- **Packages installed:** `stripe` v22, `@stripe/react-stripe-js`, `@stripe/stripe-js`
- **`lib/stripe.ts`** — Stripe server client singleton with `2026-05-27.dahlia` API version
- **`lib/events/index.ts`** — typed event emitter with `on()`, `off()`, `emit()` for `ORDER_CREATED`, `PAYMENT_SUCCEEDED`, `ORDER_SHIPPED`
- **`lib/services/order.ts`** — `createOrder()` (creates Order + OrderItems in DB transaction, emits `ORDER_CREATED`), `updateOrderStatus()`, `getOrderById()`
- **`lib/services/payment.ts`** — `createPaymentIntent()` (creates Stripe PaymentIntent + DB Payment record), `handlePaymentSucceeded()` (idempotent — skips if already SUCCESS, updates Payment + Order in transaction, emits `PAYMENT_SUCCEEDED`), `handlePaymentFailed()`
- **`lib/services/notification.ts`** — `createNotification()`, `getUserNotifications()`, `registerNotificationHandlers()` (subscribes to `PAYMENT_SUCCEEDED` to notify buyer + sellers)
- **`app/api/checkout/route.ts`** — Updated: creates Order via `createOrder()`, clears DB cart, returns `{ orderId, total }` instead of raw order
- **`app/api/payments/create-intent/route.ts`** — POST: accepts `{ orderId }`, returns `{ clientSecret, publishableKey }`; reuses existing PaymentIntent if one exists (retrieves from Stripe)
- **`app/api/webhooks/stripe/route.ts`** — POST: verifies Stripe signature, handles `payment_intent.succeeded` (updates Payment → SUCCESS, Order → PAID, sends notifications) and `payment_intent.payment_failed` (updates Payment → FAILED)
- **`app/user/checkout/[orderId]/page.tsx`** — Server component rendering checkout page
- **`app/user/checkout/[orderId]/CheckoutPageClient.tsx`** — Client component: fetches clientSecret on mount, renders `<Elements>` wrapper
- **`components/user/pages/StripeCheckoutForm.tsx`** — Stripe Elements `<PaymentElement>` form with `confirmPayment()`; handles both redirect (3D Secure) and non-redirect card payments; shows errors inline; success redirects to `/user/orders`
- **`components/user/pages/cart.tsx`** — "Place Order" button now calls POST `/api/checkout` with `useAuth().userId`, clears cart on success, redirects to `/user/checkout/[orderId]`
- **`.env`** — Added `NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY`, `STRIPE_SECRET_KEY`, `STRIPE_WEBHOOK_SECRET` (placeholder values)

## Build Verification

- `npm run build` passes with zero errors (18 routes, including 3 new: `/api/payments/create-intent`, `/api/webhooks/stripe`, `/user/checkout/[orderId]`)
- `npx tsc --noEmit` passes with zero errors
- Dev server at localhost:3001 — all pages render correctly
- `.env`: `NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=pk_test_...`, `CLERK_SECRET_KEY=sk_test_...` (test/dev keys, no `NEXT_PUBLIC_CLERK_PROXY_URL`)
- `@clerk/nextjs` ^7.4.2

## Next Steps

- Add `charge.refunded` webhook handler for automated refund processing
- Wire notification UI to display real notifications from DB (currently mock data)
- Add `PAYMENT_FAILED` event to send buyer notification
- Run QA tier on existing dashboards using the QA skill to baseline health scores
- Run Stripe CLI webhook listener: `stripe listen --forward-to localhost:3000/api/webhooks/stripe`

## Open Questions

- None.

## Architecture Decisions

- **Custom forms over Clerk's `<SignUp />` / `<SignIn />` components** — avoids Clerk UI CDN being blocked by browser extensions (the core issue was `boss-foal-21.clerk.accounts.dev` CDN for UI HTML/CSS)
- **Role tabs on unified `/sign-up` and `/sign-in` pages** instead of separate routes per role
- **`NEXT_PUBLIC_CLERK_PROXY_URL` removed** — auto-proxy broke local clerk-js loading; custom forms don't need Clerk UI CDN, only clerk-js which loads from CDN directly
- **`unsafeMetadata` set directly in `signUp.password()` call** (TypeScript types accept it via `SignUpFutureAdditionalParams`)
- **`AuthenticateWithRedirectCallback` uses `signInFallbackRedirectUrl` / `signUpFallbackRedirectUrl`** instead of `redirectUrl` (correct props per `HandleOAuthCallbackParams` type)
- **Internal role keys use `CUSTOMER`** (not `BUYER`) to match existing codebase; display label "Buyer" shown on tabs
- **React Context for global state** instead of prop-drilling — matches spec's "all state lives in root App component"
- **Single dynamic route** `/app/user/[page]/page.tsx` with page components — clean URLs without hash routing
- **Checkout as local step state** inside cart page instead of separate route — matches spec's "checkout view" toggle
- **Inline SVG icons as React components** (no icon library) — matches ui-context.md spec for consistent strokeWidth=1.8, rounded caps/joins
- **Toast container rendered in Shell** (not portal) — positioned per role (user: bottom-center, admin: bottom-right, seller: bottom-right with slide animation)
- **Inline styles for exact spec values** — many values are specific pixel sizes from spec
- **Tailwind CSS v4** with `@theme inline` for token mapping; landing tokens separate from dashboard tokens
- **`priority` prop avoided** — Next.js 16 deprecates it; `preload` used instead on LCP images
- **Dual URL + context navigation** — `useRouter.push()` for actual page navigation, context `setPage` for sidebar active state; `[page]/page.tsx` syncs URL param → context via `useEffect`
- **Stripe Elements over Stripe Checkout** — Embedded `<PaymentElement>` form instead of hosted Checkout page; gives control over the UI while Stripe handles security (PCI compliance)
- **Service layer (`/lib/services/`)** — Business logic extracted from route handlers for testability; each service has a single responsibility (order, payment, notification)
- **Event system (`/lib/events/`)** — In-process pub/sub decouples payment confirmation from notifications; `PAYMENT_SUCCEEDED` event triggers notification creation without the webhook handler needing to know about it
- **Idempotent webhook handling** — `handlePaymentSucceeded()` checks `Payment.status` before updating; prevents duplicate processing if Stripe retries
- **`x-user-id` header auth in API routes** — Consistent with existing pattern used by cart, product, and checkout routes; Clerk `useAuth().userId` on the client passes the user ID via header
- **Checkout at `/user/checkout/[orderId]`** — Separate route from dynamic `[page]` routing so the checkout flow has its own URL; inherits user dashboard layout (sidebar + topbar)
