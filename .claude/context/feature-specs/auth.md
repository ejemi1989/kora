# Auth Feature

## Goal
Enable secure authentication using Clerk for customers, sellers, and admins with protected routes and seamless session handling.

## Design
Clerk is the source of truth for authentication.

Use Clerk’s `dark` theme from `@clerk/ui/themes` as the base.

Override Clerk appearance variables using the app’s existing CSS variables. Do not hardcode colors.

### Auth Pages Layout

- Large screens:
  - Two-panel layout
  - Left:
    - Compact logo
    - Tagline
    - Short text-only feature list
  - Right:
    - Centered Clerk form

- Small screens:
  - Form only

### Constraints

- No gradients
- No oversized hero sections
- No feature cards
- No scroll-heavy layouts
- Keep UI minimal and professional

---

## Roles

- CUSTOMER
- SELLER
- ADMIN

Role is stored in the database and linked to Clerk `userId`.

---

## Implementation

### Provider

Wrap root layout with `ClerkProvider`:

- Use Clerk `dark` theme
- Inject appearance overrides via CSS variables

---

### Routes

Create:

- `/sign-in`
- `/sign-up`

Use Clerk components:

- `<SignIn />`
- `<SignUp />`

---

### Route Protection

Use `proxy.ts` at project root:

- Public routes:
  - `/sign-in`
  - `/sign-up`

- All other routes:
  - Protected by default

---

### Redirect Logic

`/` route behavior:

- Authenticated → `/marketplace`
- Unauthenticated → `/sign-in`

---

### User Session

- Clerk manages session
- Use Clerk hooks/helpers:
  - `auth()`
  - `currentUser()`

---

### User Menu

Add to navbar (right side):

- `<UserButton />`

Includes:
- Profile settings
- Logout
- Session management

Do NOT customize heavily — use Clerk defaults.

---

## APIs

Clerk handles authentication.

Internal API usage:

GET /api/me  
Returns:
- Clerk user data
- App role (CUSTOMER / SELLER / ADMIN)

---

## Flow

User visits app →  
Redirected to `/sign-in` if unauthenticated →  
User signs in via Clerk →  
Session created →  
Redirect to `/marketplace` →  
Protected routes accessible →  
User interacts with app →  
User logs out via `UserButton`

---

## Status

- AUTHENTICATED
- UNAUTHENTICATED

---

## Edge Cases

- Clerk session expires → redirect to `/sign-in`
- User exists in Clerk but not DB → create user record on first login
- Role missing → default to CUSTOMER
- Unauthorized route access → forced redirect
- Environment variables missing → auth fails silently (must validate on boot)

---

## Dependencies

- @clerk/nextjs
- @clerk/ui

---

## Check When Done

- `ClerkProvider` wraps root layout
- `proxy.ts` exists at project root
- All routes protected except `/sign-in` and `/sign-up`
- `/` redirects correctly based on auth state
- Auth pages follow layout rules (no hardcoded colors)
- `UserButton` visible in navbar
- Clerk default flows intact
- `npm run build` passes



Feature: Authentication & Authorization

## Prisma Mapping

model User {
  id        String   @id @default(uuid())
  email     String   @unique
  password  String
  role      Role     @default(CUSTOMER)
  createdAt DateTime @default(now())
}

enum Role {
  ADMIN
  SELLER
  CUSTOMER
}

---

## API Routes

### POST /api/auth/signup
Creates a new user.

Request:
{
  email: string
  password: string
}

Logic:
1. Validate input
2. Check if email exists
3. Hash password (bcrypt)
4. Create user
5. Return JWT

---

### POST /api/auth/login
1. Find user
2. Compare password
3. Return token

---

### POST /api/auth/logout
- Invalidate session (if using cookies)

---

## Middleware

- requireAuth
- requireRole(role)

---

## Notes
- Never expose password
- Always hash with bcrypt