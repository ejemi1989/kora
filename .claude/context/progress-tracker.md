# Progress Tracker

Update this file whenever the current phase, active feature, or implementation state changes.

## Current Phase

- Production Deployment: Live keys, role enforcement, error handling — Complete

## Current Goal

- Ensure denimmarketplace.com is fully functional with live Clerk authentication, role-based access control, and robust error handling across all dashboards.

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

### Navbar Login/Start-for-free Visibility Fix
- `components/landing/Navbar.tsx` — Replaced `<Show when="signed-out">` and `<Show when="signed-in">` with conditional render based on `useUser().isLoaded && isSignedIn`
- Root cause: Clerk `<Show>` returns `null` while auth is loading, so when `clerk-js` fails to load (e.g. dev keys in prod, DNS not verified) the marketing CTAs disappear — violating the landing.md spec
- New behavior: Login + Start for free render unconditionally on the public marketing page; `<UserButton>` only renders when Clerk has loaded AND the user is signed in
- Build verified: `npx tsc --noEmit` clean, `npx next build` clean, dev server renders the buttons in HTML

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

### Landing Page & Shops Page Image Updates
- **`components/landing/SocialProof.tsx`** — Replaced `gfinal_1.png` → `yam.png`, `gfinal_2.png` → `pepper.png` in gallery images array
- **`app/shops/page.tsx`** — Updated category card images:
  - Fresh Produce: `gfinal_2.png` → `veggies.png`
  - Grains & Staples: `gfinal_5.png` → `groundnut.png`
  - Spices & Seasonings: `gfinal_6.png` → `pepper.png`
  - Seafood & Proteins: `gfinal_3.png` → `gfinal_4.png`

### Minimum Order Weight (40kg)
- `lib/types/user.ts` — added `weight: number` to `UserProduct` and `CartItem` types
- `lib/data/user.ts` — added per-product weight values (kg), `calcTotalWeight()` helper, `MIN_ORDER_KG = 40` constant
- `components/user/user-context.tsx` — `addToCart` now passes `weight` through to `CartItem`
- `components/user/pages/shop.tsx` — weight displayed per product card; weight passed when adding to cart
- `components/user/pages/cart.tsx` — total weight shown in summary sidebar and checkout flow; "Proceed to Checkout" button disabled with guidance message when below 40kg; `handleProceedCheckout` blocks with toast if underweight
- `app/api/create-checkout-session/route.ts` — server-side 40kg validation returns 400 if underweight

### Clerk Live Keys Migration (denimmarketplace.com)
- `.env` — switched from test keys (`pk_test_...`/`sk_test_...`) to live keys (`pk_live_...`/`sk_live_...`) for denimmarketplace.com
- Vercel environment variables updated via CLI for all environments (production, preview, development)
- Test instance (`boss-foal-21`) cannot add custom domains — requires paid plan
- Live instance (`denimmarketplace.com`) used for production deployment
- Users (admin@denimarketplace.com, seller@denimarketplace.com, buyer@denimarketplace.com) must be created in live Clerk instance

### Email-to-Role Enforcement
- `app/auth/callback/page.tsx` — added `emailRoleMap` that enforces:
  - `admin@denimarketplace.com` → ADMIN role (auto-assigned via `clerkClient().users.updateUser()`)
  - `seller@denimarketplace.com` → SELLER role
  - `buyer@denimarketplace.com` → CUSTOMER role
- Callback now auto-assigns role from `intended_role` param if user has no role set yet
- Redirects to `/auth/choose-role` only if no role can be determined
- `app/sign-in/[[...sign-in]]/page.tsx` — added `emailRoleMap` with:
  - `onBlur` handler on email input auto-switches role tab when recognized email entered
  - Submit validation blocks sign-in if email doesn't match selected tab
- `app/sign-up/[[...sign-up]]/page.tsx` — same `emailRoleMap` with:
  - `onBlur` handler auto-switches role tab
  - Submit validation blocks sign-up if email doesn't match selected tab
  - Role stored in `unsafeMetadata` during sign-up

### Dashboard Layout Role Guards
- `app/user/layout.tsx` — server-side role check:
  - Redirects to `/sign-in` if not authenticated
  - If user has role and it's not CUSTOMER, redirects to their correct dashboard
- `app/seller/layout.tsx` — same pattern:
  - Requires SELLER role, redirects ADMIN/CUSTOMER to their dashboards
- `app/admin/layout.tsx` — same pattern:
  - Requires ADMIN role, redirects SELLER/CUSTOMER to their dashboards
- Clerk v7 compatibility: uses `userId` from `auth()` instead of `isAuthenticated` (which doesn't exist in v7)

### Prisma Client Fix for Vercel
- `prisma/schema.prisma` — changed generator from `prisma-client` with custom `output = "../lib/generated/prisma"` to `prisma-client-js` (default location)
- `lib/prisma.ts` — import changed from `./generated/prisma/client` to `@prisma/client`
- `prisma/seed.ts` — import changed from `../lib/generated/prisma/client` to `@prisma/client`
- `next.config.ts` — removed `serverExternalPackages: ["@prisma/client"]` (not needed with default client location)
- Root cause: custom output path caused "Query Engine not found" errors on Vercel's rhel-openssl-3.0.x runtime
- Fix: default `@prisma/client` location is automatically handled by Vercel's build process

### Comprehensive Error Handling (Seller Dashboard)
- All 9 seller page components now have proper error states:
  - `components/seller/pages/overview.tsx` — error state with reload button
  - `components/seller/pages/products.tsx` — error state with reload button
  - `components/seller/pages/orders.tsx` — error state with reload button
  - `components/seller/pages/inventory.tsx` — error state in table row
  - `components/seller/pages/analytics.tsx` — error state with reload button
  - `components/seller/pages/payouts.tsx` — error state with reload button
  - `components/seller/pages/customers.tsx` — error state with reload button
  - `components/seller/pages/reviews.tsx` — error state with reload button
  - `components/seller/pages/promotions.tsx` — error state with reload button
- All 9 seller API routes now return structured error responses:
  - `app/api/seller/overview/route.ts` — `{ success: false, error: "..." }` with console.error logging
  - `app/api/seller/products/route.ts` — all methods (GET/POST/PATCH/DELETE)
  - `app/api/seller/orders/route.ts` — GET and PATCH methods
  - `app/api/seller/inventory/route.ts` — GET and PATCH methods
  - `app/api/seller/analytics/route.ts` — GET method
  - `app/api/seller/payouts/route.ts` — GET and POST methods, early return for empty products
  - `app/api/seller/customers/route.ts` — GET method
  - `app/api/seller/reviews/route.ts` — GET and POST methods
  - `app/api/seller/promotions/route.ts` — all methods (GET/POST/PATCH/DELETE)
- Client-side validation: checks for `d.success === false` before treating response as valid data
- Prevents "This page couldn't load" crashes by showing actual error messages

## Build Verification

- `npm run build` passes with zero errors
- `npx tsc --noEmit` passes with zero errors
- Live at https://denimarketplace.com
- `.env`: `NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=pk_live_...`, `CLERK_SECRET_KEY=sk_live_...` (live keys for denimmarketplace.com)
- Vercel auto-deploys on push to main branch
- `@clerk/nextjs` ^7.4.2
- `@prisma/client` ^6.19.3 with default client location

## Next Steps

- Configure Google OAuth credentials in Clerk Dashboard (Client ID + Client Secret from Google Cloud Console)
- Set up production Clerk instance (currently using dev instance with live domain)
- Create test users (admin@denimarketplace.com, seller@denimarketplace.com, buyer@denimarketplace.com) in live Clerk instance
- Run QA tier on existing dashboards using the QA skill to baseline health scores
- Verify role-mismatch enforcement end-to-end
- Verify Google OAuth with role tabs after credentials are configured
- Add Stripe live keys for production payments
- Set up Stripe webhooks for order status updates

## Open Questions

- None.

## Architecture Decisions

- **Custom forms over Clerk's `<SignUp />` / `<SignIn />` components** — avoids Clerk UI CDN being blocked by browser extensions (the core issue was `boss-foal-21.clerk.accounts.dev` CDN for UI HTML/CSS)
- **Role tabs on unified `/sign-up` and `/sign-in` pages** instead of separate routes per role
- **Email-to-role enforcement** — specific emails (admin@, seller@, buyer@denimarketplace.com) are locked to their roles; auto-detected on blur and validated on submit
- **Server-side role guards in dashboard layouts** — prevents cross-dashboard access even if client-side routing is bypassed
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
- **Default Prisma client location** — `@prisma/client` instead of custom output path; required for Vercel's rhel-openssl-3.0.x runtime compatibility
- **Structured error responses** — all API routes return `{ success: false, error: "..." }` on failure with console.error logging; client components check for this pattern before rendering

### Forgot Password Flow
- `app/forgot-password/page.tsx` — 3-step forgot password using Clerk v7 `SignInFutureResource.resetPasswordEmailCode` API:
  - Step 1: Enter email → `signIn.create({ identifier })` → `signIn.resetPasswordEmailCode.sendCode()`
  - Step 2: Enter 6-digit code → `signIn.resetPasswordEmailCode.verifyCode({ code })` → status becomes `needs_new_password`
  - Step 3: Enter new password + confirm → `signIn.resetPasswordEmailCode.submitPassword({ password })` → auto-signs in and redirects to `/auth/callback`
  - "Resend code", "Back to email", "Back to sign in" links
- `proxy.ts` — added `/forgot-password(.*)` to `isPublicRoute`
- `app/sign-in/[[...sign-in]]/page.tsx` — added "Forgot password?" link next to password label

### Google OAuth Configuration
- **Issue:** Google OAuth shows "access blocked" on denimarketplace.com
- **Root cause:** `connection_oauth_google` has `enabled: true` but `client_id: ""` and `client_secret: ""` — no credentials configured in Clerk Dashboard
- **Fix:** Add custom Google OAuth credentials (Client ID + Client Secret) in Clerk Dashboard → SSO Connections → Google → Use custom credentials

### Build & Deploy
- `vercel --prod` — build passes with zero errors; TypeScript, Turbopack, 46 pages all green
- `git push origin main` — forgot password page, Clerk v7 API fix, Vercel redeploy
