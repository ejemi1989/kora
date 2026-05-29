# Kora — User Dashboard Spec

> Design system: see `ui-context.md` for all tokens, components, layout shell, and shared CSS.  
> This file covers only the customer-facing dashboard: pages, state, data, interactions, and flows.

---

## Role Overview

| Property | Value |
|---|---|
| Role | Customer / Shopper |
| Entry point | `/dashboard` |
| Default page | `overview` |
| Currency | Nigerian Naira (₦) |
| Sample user | Amara Okafor · amara.o@naijaplate.com · initials AO |

---

## Navigation

10 pages. Rendered as sidebar links with icon + label.  
Cart link shows a quantity badge when cart is non-empty.

| Order | ID | Label | Icon | Badge |
|---|---|---|---|---|
| 1 | `shop` | Shop | grid | — |
| 2 | `overview` | Overview | home | — |
| 3 | `orders` | Orders | list | — |
| 4 | `tracking` | Tracking | truck | — |
| 5 | `cart` | Cart | cart | Total item qty |
| 6 | `wishlist` | Wishlist | heart | — |
| 7 | `addresses` | Addresses | map | — |
| 8 | `payments` | Payments | card | — |
| 9 | `notifications` | Notifications | bell | — |
| 10 | `settings` | Settings | settings | — |

---

## Global State

All state lives in the root `App` component and is passed as props.

| State | Type | Default | Notes |
|---|---|---|---|
| `page` | string | `'overview'` | Active page ID |
| `sidebar` | boolean | `false` | Mobile sidebar open/closed |
| `cartItems` | array | 4 pre-loaded items | Source of truth for cart count + checkout |
| `notifs` | array | 6 items (3 unread) | Shared between bell dropdown + notifications page |
| `notifOpen` | boolean | `false` | Controls bell dropdown visibility |
| `toastMsg` | string \| null | `null` | Auto-clears after 2.6s |

---

## Seed Data

### Cart (initial load)

| Name | Description | Qty | Unit Price |
|---|---|---|---|
| Jollof Rice Party Pack | 2.5kg · Feeds 8-10 | 2 | ₦14.99 |
| Suya Spice Set | 180g · Signature blend | 1 | ₦8.50 |
| Plantain Chips (3 pk) | Spicy · Sweet · Garlic | 3 | ₦4.99 |
| Egusi Soup Mix | 500g · Pre-ground | 1 | ₦6.75 |

### Orders (6 total)

| ID | Items | Date | Amount | Status |
|---|---|---|---|---|
| NP-3842 | Jollof Rice Party Pack · Garri · Egusi Soup Mix | May 24 | ₦47.20 | delivered |
| NP-3841 | Suya Spice Set · Plantain Chips · Palm Oil | May 23 | ₦32.50 | shipped |
| NP-3840 | Fufu Flour · Ogbono · Stockfish | May 22 | ₦28.80 | packed |
| NP-3839 | Groundnut Cake · Zobo Drink Mix · Coconut Rice | May 21 | ₦19.95 | confirmed |
| NP-3838 | Smoked Catfish · Cassava Flour · Uziza Leaves | May 20 | ₦38.40 | delivered |
| NP-3837 | Agege Bread · Ewa Agoyin Kit · Pepper Sauce | May 19 | ₦15.60 | delivered |

**Status progression**: `confirmed` → `packed` → `shipped` → `delivered`

### Products (12 total)

| ID | Name | Category | Price | Orig Price | Tag | Rating |
|---|---|---|---|---|---|---|
| 101 | Jollof Rice Party Pack | Grains & Rice | ₦14.99 | — | popular | 4.8 |
| 102 | Suya Spice Set | Spices & Seasoning | ₦8.50 | ₦10.00 | sale | 4.9 |
| 103 | Plantain Chips (3 pk) | Snacks | ₦4.99 | — | popular | 4.5 |
| 104 | Egusi Soup Mix | Soups & Stews | ₦6.75 | — | — | 4.6 |
| 105 | Ogbono Powder | Soups & Stews | ₦7.20 | — | — | 4.7 |
| 106 | Smoked Catfish | Fish & Seafood | ₦12.50 | — | popular | 4.9 |
| 107 | Fufu Flour | Grains & Rice | ₦5.50 | — | — | 4.4 |
| 108 | Zobo Drink Mix | Beverages | ₦4.50 | — | new | 4.3 |
| 109 | Coconut Rice | Grains & Rice | ₦6.80 | — | — | 4.5 |
| 110 | Groundnut Cake | Snacks | ₦3.50 | — | — | 4.2 |
| 111 | Palm Oil (1L) | Oils & Condiments | ₦5.90 | — | — | 4.6 |
| 112 | Garri (Ijebu) | Grains & Rice | ₦4.20 | — | popular | 4.7 |

**Product categories**: All, Grains & Rice, Snacks, Soups & Stews, Spices & Seasoning, Fish & Seafood, Beverages, Oils & Condiments

**Product tags**: `popular` (red), `new` (blue/success), `sale` (amber)

### Wishlist (6 items)

Ogbono Powder (₦7.20 · 🌰), Smoked Catfish (₦12.50 · 🐟), Zobo Drink Mix (₦4.50 · 🫐), Coconut Rice (₦6.80 · 🥥), Groundnut Cake (₦3.50 · 🥜), Palm Oil 1L (₦5.90 · 🟠)

### Addresses (3 saved)

| Tag | Name | Address | Default |
|---|---|---|---|
| Home | Amara Okafor | 14 Bode Thomas Street, Surulere, Lagos 101241 | ✓ |
| Office | Amara Okafor | Plot 1682, Sanusi Fafunwa Street, Victoria Island, Lagos | — |
| Parents | Mrs. Chioma Okafor | 22 Awolowo Road, Ikeja, Lagos 100271 | — |

### Saved Payment Methods (3)

| Name | Details | Type | Default |
|---|---|---|---|
| Visa Platinum | ···· 4829 · exp 08/27 | Card | ✓ |
| OPay Wallet | 234 803 456 7890 | Mobile | — |
| GTBank | 012 345 6789 | Bank | — |

### Notifications (6 items)

| ID | Title | Description | Time | Read |
|---|---|---|---|---|
| 1 | Order NP-3842 Delivered | Jollof Rice Party Pack has arrived at your door | 2 hours ago | ✗ |
| 2 | NP-3841 on the way | Your Suya Spice Set is out for delivery | 5 hours ago | ✗ |
| 3 | Flash Sale: 20% off Grains | Rice, beans, yam flour — stock up and save | 1 day ago | ✗ |
| 4 | Order NP-3840 Packed | Your order is being prepared at the warehouse | 1 day ago | ✗ |
| 5 | New: Chef's Special Box | Curated ingredients for Egusi + Fufu | 3 days ago | ✓ |
| 6 | Referral Bonus Earned | You earned ₦1,500 — Tunde signed up with your link | 5 days ago | ✓ |

### Transactions (6 items)

| Name | Ref | Amount | Type | Date | Method |
|---|---|---|---|---|---|
| Jollof Rice Party Pack | NP-3842 | ₦47.20 | debit | May 24 | Visa ···· 4829 |
| Wallet Top-up | WAL-8891 | ₦100.00 | credit | May 23 | Bank Transfer |
| Suya Spice Set | NP-3841 | ₦32.50 | debit | May 23 | Visa ···· 4829 |
| Fufu Flour + Ogbono | NP-3840 | ₦28.80 | debit | May 22 | OPay |
| Cashback Reward | CB-APR | ₦5.00 | credit | May 20 | Wallet Credit |
| Groundnut Cake Bundle | NP-3839 | ₦19.95 | debit | May 21 | Visa ···· 4829 |

### Tracking Events (order NP-3841)

| Step | Label | Description | Time | Status |
|---|---|---|---|---|
| 1 | Order Confirmed | Payment was verified | May 23, 09:14 AM | done |
| 2 | Preparing at Warehouse | Items being picked and packed | May 23, 02:30 PM | done |
| 3 | Packed & Labelled | Package ready for dispatch | May 24, 10:00 AM | done |
| 4 | Out for Delivery | Rider has picked up your package | May 25, 08:15 AM | **active** |
| 5 | Delivered | Package delivered to your address | Expected today | pending |

---

## Pages

---

### `overview` — Home Dashboard

**Layout**: Page heading → stats row → 2-column grid → 3-column grid

#### Stats Row (4 cards)

| Icon | Label | Value | Delta |
|---|---|---|---|
| 📦 | Active Orders | 4 | +2 this week ↑ |
| 🚚 | Out for Delivery | 1 | Arriving today ↑ |
| ⭐ | Loyalty Points | 2,450 | 150 → Gold ↑ |
| 💰 | Total Spent (May) | ₦182.55 | +12% vs Apr ↑ |

#### 2-Column Grid

**Left — Recent Orders panel**
- Shows first 4 orders as `OrderRow` components
- "View all →" action button navigates to `orders` page

**Right — Active Delivery panel**
- Order NP-3841 header (emoji 🌶️, name, items)
- `DeliveryStatus` stepper at `shipped` step
- Status badge: Shipped (amber)

#### 3-Column Grid

**Col 1 — Quick Reorder**
- Products: Jollof Rice Party Pack, Suya Spice Set, Plantain Chips
- Each row: product name + "Reorder" primary button
- On click: finds product by name in `PRODUCTS` → increments qty if in cart, else adds → toast "Added to cart"

**Col 2 — Saved for Later**
- Products: Ogbono Powder, Smoked Catfish, Coconut Rice
- Each row: product name + "Add" secondary button
- Same add-to-cart logic as Quick Reorder

**Col 3 — Next Delivery**
- Large truck emoji (24px)
- Estimated time: **2:30 PM**
- Location: Today · Ikeja, Lagos
- Progress bar at **65%** width
- Footer: "Rider: Tunde · 3 stops away" (10px, ash)

---

### `shop` — Product Catalog

**State**

| State | Type | Default |
|---|---|---|
| `cat` | string | `'All'` |
| `q` | string | `''` |
| `loadingId` | number \| null | `null` |

**Layout**: Page heading → search input → category pills → product grid

**Search**: Filters `PRODUCTS` by `name` (case-insensitive substring match). Max-width 320px.

**Category pills**: One per category. Active pill: red fill. Clicking sets `cat`. Filters products by `cat` field (All = no filter).

**Product grid**: `repeat(auto-fill, minmax(160px, 1fr))`, gap 10px

**Product card structure**:
```
.prod-card (hover: lift 2px, primary border, elevated shadow)
├── .prod-img (110px height, emoji centered, tag top-left)
└── .prod-body
    ├── name (12px/500)
    ├── desc (10px/ash)
    ├── rating (star + number, 10px)
    ├── price (13px/600, primary) + strikethrough orig if sale
    └── "Add to cart" / "Add again" button (full width)
```

**Add to cart interaction**:
1. Set `loadingId` to product ID → button shows loading state
2. After 500ms: add to `cartItems` (increment qty if exists, else append)
3. Clear `loadingId`
4. Toast "Added to cart"
5. Button label changes to "Add again" if item already in cart

**Empty state**: Shown when no products match current filter + search.

---

### `orders` — Order History

**State**: `selected` (order ID string | null, default null)

#### List View (`selected === null`)

- Page heading: "Orders" + subtitle "All your past and current orders."
- Panel with filter buttons: All / Active / Delivered (visual only, All is active/primary)
- Panel heading shows total count: "6 orders"
- All 6 orders rendered as `OrderRow` components
- Clicking any row sets `selected` to that order's ID

#### Detail View (`selected` is set)

**Header row**:
- Back button (chevron left icon) → clears `selected`
- Page title: "Order {ID}" + subtitle "Placed {date}"
- Right side: "🔄 Reorder All" primary button + status badge

**Reorder All logic**:
1. Split `items` string by `·` to get individual item names
2. For each name: find first matching product in `PRODUCTS` where `product.name.startsWith(name)`
3. Add each found product to cart (increment if exists)
4. Toast "All items added to cart!"

**2-column grid**:

Left — Order Items card:
- Large emoji (44px), item name (first item from items string), full items list, amount, "1 item"

Right — Delivery card:
- `DeliveryStatus` component at the order's status

**Full-width panel below**: Tracking Timeline using `TRACKING_EVENTS` data

---

### `tracking` — Live Delivery Tracking

**State**

| State | Type | Default |
|---|---|---|
| `events` | array | `TRACKING_EVENTS` (5 steps) |
| `trackingStatus` | string | `'shipped'` |

**Header**: Title "Tracking" + subtitle (order ID + items) + "Live" pulse indicator (top right, green dot + text, mono font)

**Map panel** (full width):
- Placeholder area (180px height, soft bg)
- Map icon + text "Map view — OpenStreetMap integration"
- "▶ Simulate Next Status" button
- When status is `delivered`: shows "✓ Delivered" green text

**Simulate Next Status behavior**:
- Status progression: `confirmed` → `packed` → `shipped` → `delivered`
- Advances `trackingStatus` by one step
- Updates matching event in `events` array: status → `active`, time → "Just now"
- Previous pending events at or below new index → `done`
- Toast: "Order status: {NewStatus}"
- If already delivered: toast "Already delivered! 🎉"

**2-column grid**:

Left — Timeline panel:
- `Timeline` component with live `events` state
- Subtitle: "Auto-updates" (10px, ash, mono)

Right — Delivery Info panel:

| Label | Value |
|---|---|
| Rider | Tunde Akinwale |
| Rider rating | ⭐ 4.9 · 200+ deliveries |
| ETA | 2:30 PM (16px/600) |
| Address | 14 Bode Thomas St |
| Address line 2 | Surulere, Lagos 101241 |
| Contact | +234 803 456 7890 |

---

### `cart` — Cart & Checkout

**State**

| State | Type | Default |
|---|---|---|
| `checkout` | boolean | `false` |
| `step` | number | `0` |
| `selectedAddr` | object \| null | `null` |
| `selectedPay` | object \| null | `null` |
| `confirming` | boolean | `false` |

#### Cart View (`checkout === false`)

**Layout**: 2-column grid (items left, summary right)

**Left — Items panel**:
- Each item: emoji (48px), name, desc, qty stepper, line total, Remove button
- Qty stepper: − button / qty value / + button. Qty reaching 0 removes the item.
- Empty state: cart icon, "Your cart is empty", "Browse Shop" button → navigates to `shop`

**Right column** (stacked):

Summary panel:
- Subtotal, Delivery fee, Total
- Delivery fee: ₦4.99 if subtotal < ₦50, else **free**
- "Proceed to Checkout →" button (full width, primary)
- If cart empty: toast "Cart is empty", no navigation

Recent activity panel:
- NP-3842 delivered · Yesterday
- NP-3841 en route · Arriving today

#### Checkout View (`checkout === true`)

**Back link**: Returns to cart view, resets step to 0.

**4-step stepper** (see `ui-context.md` for stepper component):

| Step | Index | Label | Required selection |
|---|---|---|---|
| Cart review | 0 | Cart | — |
| Address | 1 | Address | Must select an address |
| Payment | 2 | Payment | Must select a payment method |
| Confirm | 3 | Confirm | — |

**Step 0 — Cart review**: Same items list as cart view with qty controls.

**Step 1 — Address**: Radio-style selection from `ADDRESSES`. Shows name, tag pill, default badge, address line.

**Step 2 — Payment**: 3 options:
- 💳 Visa ···· 4829 · Expires 08/27
- 📱 OPay · Pay with OPay wallet
- 🏦 Bank Transfer · GTBank · 012 345 6789

**Step 3 — Confirm**: Order summary (items count, subtotal, delivery, total) + selected address preview (first 40 chars + ellipsis).

**Navigation**:
- "Continue": validates required selection → advances step. Shows toast if validation fails.
- "Back": decrements step (hidden on step 0)
- "Place Order — ₦{total}": shown on step 3

**Place Order behavior**:
1. Set `confirming = true` (button shows "Processing...", disabled)
2. After 1.2s: clear `cartItems` → toast "Order placed! 🎉" → reset `checkout = false`, `step = 0`

---

### `wishlist` — Saved Items

**State**: `items` (array, initialized from `WISHLIST` seed data)

**Layout**: Page heading (shows count) → item grid

**Grid**: `repeat(auto-fill, minmax(160px, 1fr))`, gap 10px

**Item card**:
```
.wish-item (hover: primary border, elevated shadow)
├── .wish-img (100px, emoji centered)
│   └── ✕ remove button (top-right, 24px circle, hover: danger)
└── .wish-body
    ├── name (12px/500)
    ├── price (13px/600, primary)
    └── "Add to cart" button (full width, primary, small)
```

**Remove**: Filters item out of `items` state → toast "Removed"

**Add to cart**: Increments qty if already in cart, else appends with qty 1, desc empty → toast "Added to cart"

**Empty state**: Heart icon, "Your wishlist is empty", "Discover Products" button → navigates to `shop`

---

### `addresses` — Delivery Addresses

**State**

| State | Type | Default |
|---|---|---|
| `view` | `null \| 'add' \| number` | `null` |
| `addresses` | array | `ADDRESSES` seed data |
| `form` | object \| null | `null` |
| `saving` | boolean | `false` |

#### List View (`view === null`)

- Page heading + "+ Add Address" button (top right)
- `addr-grid` (2 columns, collapses to 1 on tablet)
- Each card: tag pill, default indicator, recipient name, address line
- Clicking card sets `view` to address ID

#### Detail View (`view` is a number, `form` is null)

- Back button
- Shows: recipient name, full address, phone (or "—"), default badge if applicable
- "Edit Address" button → sets `form` to copy of address object
- "Delete" button (hidden if default address)
- Delete logic: filter address out of array → navigate back → toast "Address deleted"
- Attempting to delete default: toast "Cannot delete default address"

#### Add / Edit Form (`view === 'add'` or `form` is set)

**Tag selector**: Home / Office / Parents pill buttons (toggle selection)

**Fields**:
| Field | Type | Placeholder | Required |
|---|---|---|---|
| Tag | pill selector | — | ✓ |
| Full Name | text input | Full name | — |
| Phone Number | text input | Phone number | — |
| Delivery Address | textarea (3 rows) | Street, city, state, postal code | ✓ |
| Set as default | checkbox | — | — |

**Validation**: Tag and address line required. Toast "Please fill in required fields" if missing.

**Save behavior**:
1. Validate → set `saving = true`
2. After 800ms: update/append address → clear form + view → toast

- Add: new ID = `Math.max(...existing IDs) + 1`. Auto-sets default if first address.
- Edit: replaces matching address in array by ID.

**Cancel button**: Clears form + view without saving (disabled during save)

---

### `payments` — Payment Methods & Transactions

**State**

| State | Type | Default |
|---|---|---|
| `txnView` | number \| null | `null` |
| `addPay` | boolean | `false` |
| `payStep` | number | `0` |
| `savePay` | boolean | `false` |

#### Main View

**Layout**: Page heading + "+ Add Method" button → 2-column grid

Left column — Saved Methods panel:
- Each method row: icon, name, default badge, digits (mono), expiry if card
- Static display only (no delete/edit in this version)

Right column — Recent Transactions panel:
- Each transaction row: type icon (↓ green for credit, ↑ red for debit), name, ref (mono), amount (colored), date
- Clicking row sets `txnView` to transaction ID

#### Transaction Detail (`txnView` is set)

- Back button
- Header: type icon (40px), amount (16px/600), name, Credit/Debit badge
- Detail grid: Reference (mono), Date, Payment Method, Status ("Completed", success color)

#### Add Payment Method (`addPay === true`)

3 tabs: Card / Bank Transfer / Mobile Money

**Card tab (payStep 0)**:
- Card Number (placeholder: 4242 4242 4242 4242)
- Expiry + CVC (side by side)
- Cardholder Name

**Bank Transfer tab (payStep 1)**:
- Static info display (no form):
  - Bank: GTBank
  - Account Name: Kora Payments Ltd
  - Account Number: 012 345 6789 (mono)

**Mobile Money tab (payStep 2)**:
- Radio-style options: OPay (Quick & secure) / Paga (Available nationwide)

**Save**: 1.2s delay → toast "Payment method saved" → return to main view

---

### `notifications` — Notification Feed

**State**: `detail` (notification ID | null, default null)

**Props received**: `notifs`, `setNotifs`, `setPage`

#### List View (`detail === null`)

- Subtitle shows unread count: "N unread"
- Each notification: unread dot (red filled) or read dot (hairline), title, description, timestamp
- Hover effect: slight background + horizontal padding expansion
- Clicking notification: marks as read → sets `detail` to notification ID

#### Detail View (`detail` is set)

- Back button
- Icon: 📦 for order notifications, 🏷️ for promos, 🎉 for others
- Title, timestamp, description (13px, 1.5 line height)

**Contextual content by notification type**:

| ID | Type | Extra content |
|---|---|---|
| 1, 2, 4 | Order | "View Order →" button → navigates to `orders` |
| 3, 5 | Promo | Promo code grid: Code `GRAIN20`, Valid Until `June 7, 2026` |
| 6 | Reward | Description only |

#### Notification Bell Dropdown (topbar)

- Shows 4 most recent notifications
- Unread items: `--primary-bg` background, filled dot
- "Mark all read" button: sets all `notifs` to `read: true`
- Clicking item: marks as read → navigates to `notifications` page
- "View all notifications →" footer → navigates to `notifications` page
- Closes on click outside (mousedown listener on document)

---

### `settings` — Account Settings

**State**

| State | Type | Default |
|---|---|---|
| `pwErr` | string | `''` |
| `pwOk` | boolean | `false` |
| `profileSaving` | boolean | `false` |
| `pwSaving` | boolean | `false` |

**Layout**: Page heading → 2-column grid (Profile + Password) → full-width Preferences panel

#### Profile Form

Fields (pre-filled):
- Full Name: Amara Okafor
- Email: amara.o@naijaplate.com (type email)
- Phone: +234 803 456 7890

Save: 800ms delay → toast "Profile updated"

#### Password Form

Fields (all type password):
- Current Password (id: `old-pw`)
- New Password (id: `new-pw`)
- Confirm New (id: `conf-pw`)

**Validation rules** (in order):
1. All three fields must be non-empty → "Fill all fields"
2. New password must be 6+ characters → "Password must be 6+ characters"
3. New and confirm must match → "Passwords do not match"

**On success**:
1. 800ms delay → toast "Password updated"
2. Show inline "✓ Password updated" (success color) for 2 seconds
3. Clear all three input fields

#### Preferences Panel

Three checkboxes (all checked by default):
- Order updates via email
- SMS for delivery alerts
- Promotional offers

`accentColor: var(--primary)` on checkboxes. No save button (visual only in this version).

---

## Interaction Summary

| Action | Trigger | Behavior | Toast |
|---|---|---|---|
| Add to cart (shop) | "Add to cart" click | 500ms loading → add/increment in cartItems | "Added to cart" |
| Add again (shop) | "Add again" click | Same as above | "Added to cart" |
| Reorder (overview) | "Reorder" button | Find product → add/increment | "Added to cart" |
| Add saved item (overview) | "Add" button | Find product → add/increment | "Added to cart" |
| Reorder all (order detail) | "🔄 Reorder All" | Bulk add all order items | "All items added to cart!" |
| Qty stepper (cart) | − / + buttons | Decrement/increment qty; 0 removes item | — |
| Remove item (cart) | "Remove" link | Filter item out of cartItems | — |
| Checkout — Continue | Button | Validates step requirement, advances step | Error toast if invalid |
| Place order | "Place Order" button | 1.2s delay → clear cart → reset checkout | "Order placed! 🎉" |
| Simulate delivery | "▶ Simulate Next Status" | Advance tracking status + update timeline | "Order status: {Status}" |
| Remove wishlist item | ✕ button | Filter out of items | "Removed" |
| Add wishlist to cart | "Add to cart" | Add/increment in cartItems | "Added to cart" |
| Save address | "Save Address" | 800ms delay → update addresses array | "Address added/updated" |
| Delete address | "Delete" button | Remove from array (blocked if default) | "Address deleted" / error |
| Save payment method | "Save Payment Method" | 1.2s delay → return to payments | "Payment method saved" |
| Mark notification read | Click notification | Set read:true on that item | — |
| Mark all read | Dropdown button | Set read:true on all notifs | — |
| Save profile | "Save Changes" | 800ms delay | "Profile updated" |
| Update password | "Update Password" | Validate → 800ms delay → clear fields | "Password updated" |

---

## Delivery Fee Logic

```
subtotal = sum(item.price × item.qty) for all cartItems
delivery = subtotal > 50 || cartItems.length === 0 ? 0 : 4.99
total    = subtotal + delivery
```

Free delivery threshold: **₦50.00**

---

## Component Usage Map

| Page | Components used |
|---|---|
| overview | StatCard, OrderRow, DeliveryStatus, Progress Bar |
| shop | Category pills, Product card, Toast |
| orders | OrderRow, Badge, DeliveryStatus, Timeline |
| tracking | Timeline, Delivery Info grid, Progress simulation |
| cart | Cart item row, Qty stepper, Cart summary, Checkout stepper, Address selector, Payment selector |
| wishlist | Wishlist item card |
| addresses | Address card, Address form, Tag selector |
| payments | Payment method row, Transaction row, Add payment tabs |
| notifications | Notification item, Notification detail, Bell dropdown |
| settings | Form fields, Password form, Checkbox preferences |

All component styles are defined in `ui-context.md`.
