# Progress Tracker

Update this file whenever the current phase, active feature, or implementation state changes.

## Current Phase

- Clerk Auth Custom Forms + Role Tabs — Complete

## Current Goal

- Role-based sign-up/sign-in flows with custom forms (bypassing Clerk UI CDN), all routes protected, zero build errors.

## Completed

### Clerk Auth Implementation (from auth.md spec)
- `app/layout.tsx` — ClerkProvider updated with appearance overrides mapped to app CSS variables
- `app/api/me/route.ts` — GET endpoint returning Clerk user + role
- All three shells — `<UserButton />` in topbar, custom logout removed
- `proxy.ts` — Already configured with `clerkMiddleware` (unchanged)
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

### Admin Dashboard (Kongo)
- `/lib/types/admin.ts`, `/lib/data/admin.ts` — TypeScript interfaces + seed data
- `/components/admin/admin-context.tsx` — React Context with global state + actions
- `/components/admin/admin-shell.tsx` — sidebar with 13 nav items in 4 groups
- `/app/admin/layout.tsx` — wraps children in AdminProvider + AdminShell
- `/app/admin/[page]/page.tsx` — dynamic route dispatching to 12 page components
- 12 admin page components including currencies with inline rate editing, set-as-base, etc.

### Seller Dashboard (Akara Market)
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
- `middleware.ts` — Route protection with matcher

## Build Verification

- `npm run build` passes with zero errors
- `npx tsc --noEmit` passes with zero errors
- Dev server at localhost:3001 — all pages render correctly
- `.env`: `NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=pk_test_...`, `CLERK_SECRET_KEY=sk_test_...` (test/dev keys, no `NEXT_PUBLIC_CLERK_PROXY_URL`)
- `@clerk/nextjs` ^7.4.2

## Next Steps

- Verify custom sign-up and sign-in flows end-to-end in browser (email/password entry → verification code → finalize → redirect to role dashboard)
- Google OAuth testing via `/sso-callback` route
- Existing user role selection flow unchanged (`/auth/choose-role` still works for users without `unsafeMetadata.role`)

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
