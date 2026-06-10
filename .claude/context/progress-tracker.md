# Progress Tracker

Update this file whenever the current phase, active feature, or implementation state changes.

## Current Phase

- Order Tracking: Seller/Admin add tracking numbers, Buyer views them — Complete

## Current Goal

- Enable seller and admin to assign tracking numbers to orders, and buyers to view them on their tracking page.

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

### User Dashboard (Deni)
- `/lib/types/user.ts` — TypeScript interfaces: UserProduct, CartItem, UserOrder, TrackingEvent, etc.
- `/lib/data/user.ts` — seed data: 12 products, 8 categories, 4 cart items, 6 orders, etc.
- `/components/user/user-context.tsx` — React Context with global state + actions
- `/components/user/icons.tsx` — 13 inline SVG icon components
- `/app/user/layout.tsx` — wraps children in UserProvider + UserShell
- `/components/user/user-shell.tsx` — sidebar, topbar, toast container, mobile hamburger/overlay
- `/app/user/[page]/page.tsx` — dynamic route dispatching to 10 page components
- 10 page components: overview, shop, orders, tracking, cart, wishlist, addresses, payments, notifications, settings
- All interactions verified via browser testing

### Admin Dashboard (Deni)
- `/lib/types/admin.ts`, `/lib/data/admin.ts` — TypeScript interfaces + seed data
- `/components/admin/admin-context.tsx` — React Context with global state + actions
- `/components/admin/admin-shell.tsx` — sidebar with 13 nav items in 4 groups
- `/app/admin/layout.tsx` — wraps children in AdminProvider + AdminShell
- `/app/admin/[page]/page.tsx` — dynamic route dispatching to 12 page components
- 12 admin page components including currencies with inline rate editing, set-as-base, etc.

### Seller Dashboard (Deni)
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
- `components/landing/DarkSection.tsx` — Changed from Next.js `<Image>` to plain `<img>` with `width:100%`,`height:auto` for full-bleed edge-to-edge rendering; added `background:#000` to wrapper to prevent white page background showing through transparent PNG areas
- `app/page.tsx` — Added `import { DarkSection }` and component between HowItWorks and SocialProof (was never rendered before)

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

### Brand Alignment: Akara Market → Deni Rename
- `progress-tracker.md` — updated header from "Seller Dashboard (Akara Market)" to "Seller Dashboard (Deni)"
- `.claude/context/seller/seller-dashboard.md` — replaced all 10 occurrences of "Akara Market" with "Deni"
- `.claude/context/seller/seller-dashboard.html` — replaced all 4 occurrences (title, sidebar brand, overview subtitle, settings form values)
- Consistency: seller dashboard now matches existing "Deni" naming used for the user dashboard

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

### Brand Alignment: Kongo → Deni (Admin Dashboard)
- `components/admin/admin-shell.tsx` — sidebar wordmark `kongo` → `Deni`, topbar breadcrumb `Kongo` → `Deni`
- `components/seller/seller-shell.tsx` — sidebar wordmark `akara market` → `Deni`
- `components/seller/pages/settings.tsx` — email `hello@akaramarket.com` → `hello@deni.com`
- All visible "Kongo" and "Akara Market" references removed from admin and seller UI code

### Notification Subtitle Visibility Fix
- `components/user/user-shell.tsx` — dropdown description/time/unread colors changed from `var(--muted)`/`var(--ash)` to `var(--muted-text)`
- `components/user/pages/notifications.tsx` — full page description, time, and "X unread" all changed to `var(--muted-text)`

### Seller Product Unit: Tonne Added
- `components/seller/pages/products.tsx` — Added `<option>Tonne</option>` to unit dropdown (options: Piece, Kilogram, Tonne, Litre, Pack)

### Clerk JS CDN Redirect Fix
- `NEXT_PUBLIC_CLERK_JS_VERSION=6.13.0` added to `.env` — pins exact Clerk JS version to bypass 307 redirect
- Root cause: `@clerk/shared@4.14.0` resolves version `6.13.0` to major tag `@6`, producing URL `.../npm/@clerk/clerk-js@6/dist/clerk.browser.js` which the CDN 307-redirects to `@6.12.1`; `crossorigin="anonymous"` script tags can fail to follow the redirect in some browsers
- Fix loads `.../npm/@clerk/clerk-js@6.13.0/dist/clerk.browser.js` directly (200, no redirect)

### Minimum Order Weight (40kg)
- `lib/types/user.ts` — added `weight: number` to `UserProduct` and `CartItem` types
- `lib/data/user.ts` — added per-product weight values (kg), `calcTotalWeight()` helper, `MIN_ORDER_KG = 40` constant
- `components/user/user-context.tsx` — `addToCart` now passes `weight` through to `CartItem`
- `components/user/pages/shop.tsx` — weight displayed per product card; weight passed when adding to cart
- `components/user/pages/cart.tsx` — total weight shown in summary sidebar and checkout flow; "Proceed to Checkout" button disabled with guidance message when below 40kg; `handleProceedCheckout` blocks with toast if underweight
- `app/api/create-checkout-session/route.ts` — server-side 40kg validation returns 400 if underweight

## Build Verification

- `npm run build` passes with zero errors
- `npx tsc --noEmit` passes with zero errors
- Dev server at localhost:3001 — all pages render correctly
- `.env`: `NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=pk_test_...`, `CLERK_SECRET_KEY=sk_test_...` (test/dev keys, no `NEXT_PUBLIC_CLERK_PROXY_URL`)
- `@clerk/nextjs` ^7.4.2

## Next Steps

- Run QA tier on existing dashboards using the QA skill to baseline health scores
- Verify role-mismatch enforcement end-to-end: Seller using Buyer tab → gets error banner pointing to Seller tab
- Verify Google OAuth with role tabs: signing in via Google on Seller tab → redirects to Seller dashboard (or error if alternate role)
- Existing user role selection flow unchanged (`/auth/choose-role` still works for users without `unsafeMetadata.role`)
- Verify role-scoped proxy redirects: CUSTOMER visiting `/seller/overview` or `/admin/overview` → redirected to `/user/overview`

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
