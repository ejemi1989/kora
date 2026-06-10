# Deni — Seller Dashboard Spec

> Design system: see `ui-context.md` for all tokens, components, layout shell, and shared CSS.  
> This file covers only the seller-facing dashboard: pages, state, data, interactions, modals, and flows.

---

## Role Overview

| Property | Value |
|---|---|
| Role | Marketplace Seller |
| Product name | Deni |
| Entry point | Default page `overview` |
| Default page | `overview` |
| Currency | Nigerian Naira (₦) |
| Sample seller | Deni · hello@akaramarket.com · initials AK |
| Page routing | In-memory JS (`nav()` function) with panel show/hide |

---

## Key Differences from User & Admin Dashboards

| Property | Seller (Akara) | Admin (Kongo) | User (Deni) |
|---|---|---|---|
| Brand name | Deni | Kongo | Deni |
| Primary color | `#E8552A` (orange) | `#ea2804` (red) | `#ea2804` (red) |
| Color scale | Full orange scale (`--orange-50` → `--orange-900`) | None | None |
| Stat change colors | Green/red (material) | Blue/red | Blue/red |
| Badge colors | Material Design palette | Custom semantic | Custom semantic |
| Card style | Border + shadow (not shadow-only) | Shadow only | Shadow only |
| Card border-radius | `--radius-lg` (12px) | `--radius-md` (8px) | `--radius-md` (8px) |
| Modal animation | Scale + translateY | None | Slide up |
| Toast position | Bottom-right | Bottom-right | Bottom-center |
| Toast style | Typed (success=blue, error=red, default=dark) | Typed | Always dark |
| Routing | In-memory JS nav() | Hash-based | React state |
| Panel animation | `fadeIn` (opacity + translateY 3px) | None | None |
| Scrollbar | 5px, `rgba(0,0,0,0.08)` | 6px, ash | 4px, stone |
| Order status update | Inline `<select>` in table row | Modal | React state |

---

## Brand Color Scale (Seller-only)

| Token | Value |
|---|---|
| `--orange-50` | `#FFF0ED` |
| `--orange-100` | `#FFD6CC` |
| `--orange-200` | `#FFB099` |
| `--orange-300` | `#FF8A66` |
| `--orange-400` | `#FF6633` |
| `--orange-500` | `#E8552A` (primary) |
| `--orange-600` | `#CC4422` (primary-deep) |
| `--orange-700` | `#AA331A` |
| `--orange-800` | `#882211` |
| `--orange-900` | `#661108` |

Chart bars use gradient: `linear-gradient(to top, var(--primary), var(--orange-200))`  
Rating bars use `var(--orange-100)` as track background.

---

## Seller-specific Badge Colors

Seller badges use Material Design palette — different from admin/user.

| Class | Background | Color | Usage |
|---|---|---|---|
| `.badge-pending` | `#FFF8E1` | `#F57F17` | Pending orders |
| `.badge-processing` | `#E3F2FD` | `#1565C0` | Processing / Scheduled |
| `.badge-shipped` | `#F3E5F5` | `#7B1FA2` | Shipped |
| `.badge-delivered` | `#E8F5E9` | `#2E7D32` | Delivered / Completed |
| `.badge-cancelled` | `#FBE9E7` | `#C62828` | Cancelled |
| `.badge-active` | `#E8F5E9` | `#2E7D32` | Active / Regular |
| `.badge-draft` | `#F0F0F0` | `#888` | Draft / Out of Stock |
| `.badge-low` | `#FBE9E7` | `#C62828` | Low Stock |
| `.badge-ok` | `#E8F5E9` | `#2E7D32` | OK stock |
| `.badge-new` | `var(--primary-bg)` | `var(--primary)` | New customer |

---

## Stat Change Colors (Seller-only)

| Class | Background | Color |
|---|---|---|
| `.stat-change.up` | `#E8F5E9` | `#2E7D32` |
| `.stat-change.down` | `#FBE9E7` | `#C62828` |

---

## Navigation

10 pages across 4 groups. Active item: orange background tint + orange text.  
Nav badges: orange (`nav-badge`) or danger red (`nav-badge danger`).

### Group: Main
| ID | Label | Badge | Badge type |
|---|---|---|---|
| `overview` | Overview | — | — |
| `products` | Products | 24 | orange |
| `orders` | Orders | — | — |
| `inventory` | Inventory | 3 | danger |

### Group: Insights
| ID | Label | Badge |
|---|---|---|
| `analytics` | Analytics | — |
| `payouts` | Payouts | — |

### Group: Community
| ID | Label | Badge | Badge type |
|---|---|---|---|
| `customers` | Customers | — | — |
| `reviews` | Reviews | 8 | orange |

### Group: Growth
| ID | Label | Badge |
|---|---|---|
| `promotions` | Promotions | — |
| `settings` | Settings | — |

---

## Layout Shell (Seller-specific)

```
body (flex row, min-height 100vh)
├── .sidebar (fixed, 240px, z-index 100)
│   ├── .sidebar-head (logo "A" mark + "Deni" + "Seller Dashboard" small)
│   └── .sidebar-nav (grouped nav items)
├── .sidebar-overlay (mobile only, z-index 90)
└── .main (margin-left 240px, flex column)
    ├── .header (sticky top 0, z-index 50, 52px)
    │   ├── .header-left (hamburger + page title h2)
    │   └── .header-right (search box + avatar)
    └── .content (padding 20px 24px 40px)
        └── .section-panel (only .active shown, fadeIn animation)
```

**Logo**: "A" white on orange square (`border-radius: 6px`) + "Deni" bold + "Seller Dashboard" uppercase small.  
**Header title**: `#headerTitle` — updates on navigation via `titles` object.  
**Search input**: Expands from 200px → 240px on focus. Hidden on mobile (`≤768px`).  
**Avatar**: "AK" initials, 30px circle, orange background.

---

## Routing

In-memory JS. No URL hash changes.

```javascript
function nav(section) {
  // hide all .section-panel, remove .active from .nav-item
  // show #panel-{section}, mark [data-section="{section}"] active
  // update headerTitle text
  // close mobile sidebar
}
```

Panel entrance: `fadeIn` animation — `opacity: 0, translateY(3px)` → `opacity: 1, translateY(0)` over 200ms.

---

## Global UI Patterns

### Card (Seller variant)
```
.card (background white, border 1px solid --hairline, border-radius 12px, shadow-card)
     (hover: shadow-elevated)
├── .card-head (flex-between, margin-bottom 16px)
│   ├── .card-title (13px, 600 weight)
│   └── .card-action (12px, orange, hover: underline)
└── [content]
```

### Alert (Seller variant)
Bordered box with `border-radius: --radius-lg`.

| Class | Background | Border | Color |
|---|---|---|---|
| `.alert-warning` | `#FEF9E7` | `#FDE68A` | `#92400E` |
| `.alert-danger` | `#FBE9E7` | `#FECACA` | `#C62828` |
| `.alert-info` | `#EFF6FF` | `#BFDBFE` | `#1E40AF` |

### Modal (Seller variant)
Each modal is a **named standalone overlay** (not a singleton). Three modals: `productModal`, `promoModal`, `customerModal`.

```
.modal-overlay#[id] (fixed inset, rgba(0,0,0,0.25), z-index 200)
└── .modal (480px, border-radius --radius-xl, padding 24px, border 1px hairline)
    ├── .modal-head (h2 + ✕ close button)
    ├── [form content]
    └── .modal-actions (flex end, gap 8px, border-top hairline, margin-top 20px)
```

Modal entrance: `modalIn` animation — `opacity 0, translateY(8px), scale(0.98)` → full over 180ms.  
Close on overlay background click: `onclick="if(event.target===this)closeModal('id')"`

```javascript
function openModal(id) { document.getElementById(id).classList.add('open'); }
function closeModal(id) { document.getElementById(id).classList.remove('open'); }
```

### Toast (Seller variant)
- Container: `.toast-container` — fixed, bottom-right (`bottom: 20px, right: 20px`), z-index 9999, stacks with gap 8px
- Default toast: dark background (`--surface-dark`)
- `.toast-success`: `#0070f3` (blue)
- `.toast-error`: `#ee0000` (red)
- Entrance: slides in from right (`translateX(100%)` → `translateX(0)`) over 250ms
- Auto-dismiss: 2.5 seconds (fade + slide out over 300ms)

```javascript
toast(message, type) // type: 'success' | 'error' | undefined (dark)
```

### Order Status Inline Select
Orders table uses `<select class="status-select">` directly in each row.

Options: Pending / Processing / Shipped / Delivered  
`onchange` calls `updateStatus(this, orderId)`:
1. Updates badge in same row: `badge-{value.toLowerCase()}`
2. Toast: "Order {id} updated to {value}"

### Product Cell
```
.product-cell (flex, gap 10px)
├── .product-thumb (32px square, border-radius 6px, orange-bg, emoji)
└── div
    ├── .product-name (12.5px, 500 weight)
    └── .product-sku (10.5px, muted, mono)
```

### Customer Cell
```
.customer-cell (flex, gap 8px)
├── .customer-avatar (28px circle, custom bg/color per customer)
└── div
    ├── .customer-name (12.5px, 500 weight)
    └── .customer-email (10.5px, muted)
```

### Progress Bar (Seller variant)
```
.progress (height 4px, background --orange-100, border-radius 2px)
└── .progress-bar (height 100%, background --primary, border-radius 2px)
```

### Chart Bars
```
.chart (flex, align-items flex-end, gap 5px)
└── .chart-bar (flex:1, border-radius 3px 3px 0 0, gradient primary→orange-200, opacity 0.65)
              (hover: opacity 1)
.chart-labels (flex, justify-between, font-size 10px, muted, padding-top 6px)
```

---

## Pages

---

### `overview` — Store Overview

**Subtitle**: "Your Deni performance at a glance"

**Layout**: Stat grid (4) → 2fr+1fr column grid (recent orders + top products)

#### Stats (4 cards)

| Value | Label | Delta |
|---|---|---|
| ₦847,320 | Total Revenue | ↑ 12.5% |
| 186 | Orders This Month | ↑ 8.3% |
| 24 | Active Products | ↑ 2 this week |
| 89 | Total Customers | ↑ 5 this month |

#### Left — Recent Orders (2fr)
- 5 most recent orders (no thead)
- Columns: Order / Customer / Items / Total / Status
- "View All" card-action button → `nav('orders')`

| Order | Customer | Items | Total | Status |
|---|---|---|---|---|
| #1042 | Chisom Okafor | 3 | ₦12,500 | Processing |
| #1041 | Amara Eze | 1 | ₦4,800 | Shipped |
| #1040 | Kofi Mensah | 5 | ₦23,200 | Delivered |
| #1039 | Ngozi Adebayo | 2 | ₦8,900 | Pending |
| #1038 | Yvonne Kamau | 4 | ₦16,700 | Delivered |

#### Right — Top Products (1fr)
- Columns: Product (with thumb emoji) / Sold / Revenue

| Product | Emoji | Sold | Revenue |
|---|---|---|---|
| Jollof Spice Mix | 🌶️ | 42 | ₦210,000 |
| Groundnut Paste | 🥜 | 38 | ₦152,000 |
| Dried Ugwu Leaves | 🌿 | 31 | ₦124,000 |

---

### `products` — Product Catalogue

**Subtitle**: "Manage your catalogue — 24 active listings"

**Header**: Title + subtitle left, "+ Add Product" primary button right → opens `productModal`

**Table columns**: Product (thumb + name + SKU) · SKU (mono) · Price · Stock · Status · Edit button

**Product data (6 rows)**:

| Name | Emoji | SKU | Price | Stock | Status |
|---|---|---|---|---|---|
| Jollof Spice Mix | 🌶️ | JSM-001 | ₦5,000 | 48 | Active |
| Groundnut Paste | 🥜 | GNP-002 | ₦4,000 | 36 | Active |
| Dried Ugwu Leaves | 🌿 | DUL-003 | ₦4,000 | 22 | Active |
| Smoked Catfish | 🐟 | SCF-004 | ₦8,500 | 15 | Active |
| Ofada Rice (5kg) | 🍚 | OFR-005 | ₦12,000 | 8 | Low Stock |
| Palm Oil (1L) | 🥥 | POI-006 | ₦3,500 | 0 | Out of Stock |

**Edit button**: Toast "Opening {name} for editing…" → opens `productModal`

#### Add Product Modal (`productModal`)

Fields:
- Product Name (text, placeholder "e.g. Fresh Palm Oil")
- Description (textarea 3 rows)
- Price (₦) + Stock Quantity (2-column)
- Category select + Unit select (2-column)
- Product Images (file input, multiple)

**Category options**: Spices & Seasonings / Oils & Fats / Grains & Rice / Fish & Meat / Vegetables  
**Unit options**: Piece / Kilogram / Litre / Pack

**Submit validation**: Name required → toast "Please enter a product name" (error)  
**On success**: Toast `"${name}" has been added to your catalogue!` (success) → close modal → clear all fields

---

### `orders` — Order Management

**Subtitle**: "Track and manage incoming orders"

**Mini stats row** (4 values, inline in card):

| Label | Value |
|---|---|
| Pending | 12 |
| Processing | 8 |
| Shipped | 15 |
| Delivered | 151 |

**Table columns**: Order ID · Customer · Date · Items · Total · Status (badge) · Action (inline select)

**Order data (6 rows)**:

| Order ID | Customer | Date | Items | Total | Status |
|---|---|---|---|---|---|
| #1042 | Chisom Okafor | 25 May | 3 | ₦12,500 | Processing |
| #1041 | Amara Eze | 24 May | 1 | ₦4,800 | Shipped |
| #1040 | Kofi Mensah | 23 May | 5 | ₦23,200 | Delivered |
| #1039 | Ngozi Adebayo | 22 May | 2 | ₦8,900 | Pending |
| #1038 | Yvonne Kamau | 21 May | 4 | ₦16,700 | Delivered |
| #1037 | Emeka Obi | 20 May | 2 | ₦11,200 | Shipped |

**Status update**: Each row has `<select class="status-select">` with options Pending / Processing / Shipped / Delivered. On change → updates badge class + text in same row → toast.

---

### `inventory` — Stock Management

**Subtitle**: "Monitor stock levels across your catalogue"

**Alert at top** (`.alert-danger`): "Low Stock Alert — 3 products are running low — reorder soon" + badge "3 Alerts"

**Table columns**: Product (thumb + name) · SKU · In Stock · Reserved · Available · Status · Restock button

**Inventory data (5 rows)**:

| Product | Emoji | SKU | In Stock | Reserved | Available | Status |
|---|---|---|---|---|---|---|
| Jollof Spice Mix | 🌶️ | JSM-001 | 60 | 12 | 48 | OK |
| Ofada Rice (5kg) | 🍚 | OFR-005 | 10 | 2 | 8 | Low |
| Palm Oil (1L) | 🥥 | POI-006 | 0 | 0 | 0 | Out |
| Smoked Catfish | 🐟 | SCF-004 | 20 | 5 | 15 | Low |
| Groundnut Paste | 🥜 | GNP-002 | 40 | 4 | 36 | OK |

**Restock button interaction**:
1. `prompt()` — "Restock quantity for {name}:" (default: "10")
2. Validate: non-empty, numeric, > 0
3. Add qty to In Stock cell (col 3) and Available cell (col 5)
4. Update badge: `.badge-ok` + text "OK"
5. Toast: "Restocked {qty} units of {name}" (success)

---

### `analytics` — Sales Analytics

**Subtitle**: "Revenue trends and sales performance"

**Layout**: 2-column grid → full-width card

#### Left — Revenue chart (Last 30 Days)
6-bar chart, height 200px.  
Bar heights: 40%, 65%, 55%, 85%, 72%, 90%  
Labels: May 1 / May 8 / May 15 / May 22 / May 25 (5 labels for 6 bars)

#### Right — Revenue Breakdown
Progress bars with label + value:

| Product | Revenue | Bar width |
|---|---|---|
| Jollof Spice Mix | ₦210,000 | 35% |
| Groundnut Paste | ₦152,000 | 25% |
| Dried Ugwu Leaves | ₦124,000 | 20% |
| Smoked Catfish | ₦297,500 | 48% |
| Other Products | ₦63,820 | 10% |

#### Full-width — Order Trends (This Week)
7-bar chart, height 100px.  
Bar heights: 30%, 45%, 35%, 60%, 55%, 70%, 80%  
Labels: Mon / Tue / Wed / Thu / Fri / Sat / Sun

---

### `payouts` — Earnings & Withdrawals

**Subtitle**: "Track earnings and withdraw funds"

**Layout**: 2fr + 1fr column grid → full-width history card

#### Left — Earnings summary card
- Total Earnings (All Time): **₦847,320** (large stat-value)
- Divider row with 3 line items:

| Label | Value |
|---|---|
| Available Balance | ₦124,500 |
| Pending Clearance | ₦68,200 |
| Withdrawn This Month | ₦50,000 |

#### Right — Withdraw Funds card
- Amount (₦) number input (pre-filled: 124500)
- Transfer To select: GTBank — 0123456789 / Access Bank — 9876543210
- "Withdraw Funds" full-width primary button

**Withdraw validation**:
1. Amount must be > 0 → toast "Enter a valid withdrawal amount" (error)
2. Amount must be ≤ 124,500 → toast "Insufficient available balance" (error)
3. On success: toast "₦{amount} withdrawal request submitted!" (success)

#### Payout History table

| Date | Amount | Account | Status |
|---|---|---|---|
| 15 May 2026 | ₦50,000 | GTBank ••••6789 | Completed |
| 28 Apr 2026 | ₦35,000 | GTBank ••••6789 | Completed |
| 10 Apr 2026 | ₦45,000 | Access Bank ••••3210 | Completed |

---

### `customers` — Customer List

**Subtitle**: "Your buyer community — 89 total"

**Table columns**: Customer (avatar + name + email) · Orders · Total Spent · Last Order · Status · View button

**Customer data (6 rows)**:

| Initials | Name | Email | Orders | Spent | Last Order | Status | Avatar bg/color |
|---|---|---|---|---|---|---|---|
| CO | Chisom Okafor | chisom.o@email.com | 12 | ₦156,000 | 25 May | Regular | `#E8F5E9` / `#2E7D32` |
| AE | Amara Eze | amara.eze@email.com | 8 | ₦84,500 | 24 May | Regular | `#E3F2FD` / `#1565C0` |
| KM | Kofi Mensah | kofi.m@email.com | 5 | ₦67,200 | 23 May | New | `#FFF8E1` / `#F57F17` |
| NA | Ngozi Adebayo | ngozi.a@email.com | 18 | ₦234,000 | 22 May | Regular | `#F3E5F5` / `#7B1FA2` |
| YK | Yvonne Kamau | yvonne.k@email.com | 6 | ₦92,100 | 21 May | New | `#FBE9E7` / `#C62828` |
| EO | Emeka Obi | emeka.o@email.com | 3 | ₦33,600 | 20 May | New | `#E0F7FA` / `#00695C` |

**View button**: `viewCustomer(initials)` → populates and opens `customerModal`

#### Customer Detail Modal (`customerModal`)

Width: 580px. Split layout: no padding on modal root, header has its own border-bottom.

**Header**: Avatar (44px, 16px font, custom bg/color) + Name + Email · Phone · Location + Status badge (right)

**Stats row (3 mini cards)**:
- Orders count
- Total Spent (₦ formatted)
- Last Order date

**Order History table**:
- Columns: Order (mono) · Product · Amount · Status (badge) · Date

**Full customer data (for modal population)**:

| ID | Phone | Location | Joined | History orders |
|---|---|---|---|---|
| CO | +234 802 345 6789 | Lagos, Nigeria | 12 Jan 2025 | #AK-1024, #AK-1012, #AK-0987 |
| AE | +234 808 234 5678 | Abuja, Nigeria | 3 Mar 2025 | #AK-1022, #AK-1005 |
| KM | +233 50 123 4567 | Accra, Ghana | 15 Apr 2025 | #AK-1020, #AK-1009 |
| NA | +234 805 678 9012 | Port Harcourt, Nigeria | 28 Oct 2024 | #AK-1018, #AK-1003, #AK-0976 |
| YK | +254 712 345 678 | Nairobi, Kenya | 2 May 2025 | #AK-1015, #AK-1001 |
| EO | +234 809 876 5432 | Onitsha, Nigeria | 10 May 2025 | #AK-1013, #AK-1006 |

**Customer order histories**:

CO: Jollof Spice Mix ₦12,500 Delivered 25 May · Groundnut Paste ₦8,200 Delivered 18 May · Dried Ugwu Leaves ₦6,800 Delivered 10 May  
AE: Palm Oil (5L) ₦18,500 Delivered 24 May · Yam Flour ₦7,200 Delivered 15 May  
KM: Smoked Catfish ₦15,800 Shipped 23 May · Fufu Flour ₦6,500 Delivered 12 May  
NA: Dried Ugwu Leaves ₦6,800 Delivered 22 May · Egusi Soup Mix ₦9,500 Delivered 8 May · Jollof Spice Mix ₦12,500 Delivered 28 Apr  
YK: Arrowroot Flour ₦11,200 Delivered 21 May · Coconut Oil ₦9,800 Processing 19 May  
EO: Tiger Nuts ₦5,400 Delivered 20 May · Honey (500ml) ₦8,500 Shipped 16 May

---

### `reviews` — Reviews & Ratings

**Subtitle**: "What customers are saying about your products"

**Layout**: 2-column (rating summary) → full-width reviews card

#### Left — Overall rating card
- Big score: **4.8** (orange, 36px/700)
- Stars: ★★★★★ (18px, amber `#F59E0B`)
- Caption: "Average rating across 67 reviews"

#### Right — Rating breakdown card
5 bars (5★ → 1★). Track: `--orange-100`. Fill: `--primary`.

| Stars | Count | Bar width |
|---|---|---|
| 5 ★ | 52 | 78% |
| 4 ★ | 10 | 15% |
| 3 ★ | 3 | 4% |
| 2 ★ | 1 | 2% |
| 1 ★ | 1 | 1% |

#### Reviews list (3 items)

Each `.review-card`:
- Avatar (28px circle, orange-bg) + customer name + stars + timestamp
- Review text (12.5px, 1.5 line height)
- "on {Product}" label (10.5px, muted)
- Reply input + "Reply" ghost button

| Reviewer | Stars | Text | Product | Time |
|---|---|---|---|---|
| Chisom Okafor (CO) | ★★★★★ | "The Jollof Spice Mix is absolutely incredible! Tastes just like my grandmother's recipe. Will definitely order again." | Jollof Spice Mix | 2 days ago |
| Kofi Mensah (KM) | ★★★★☆ | "Good quality groundnut paste, but the packaging could be better. Product itself is fresh and tasty." | Groundnut Paste | 4 days ago |
| Ngozi Adebayo (NA) | ★★★★★ | "The dried ugwu leaves are so fresh. Makes my soups taste like home. Fast delivery too!" | Dried Ugwu Leaves | 1 week ago |

**Reply button validation**: Input must be non-empty → toast "Write a reply first" (error)  
**On success**: Toast "Reply posted to review" (success) → clear input

---

### `promotions` — Discount Management

**Subtitle**: "Create and manage discounts for your products"

**Header**: Title + subtitle left, "+ New Promotion" primary button right → opens `promoModal`

**Promotion list (4 items)** as `.promo-card` rows:

| Code | Details | Status |
|---|---|---|
| AKARA15 | 15% off — All Jollof Spice products · Ends 30 Jun | Active |
| FREESHIP | Free delivery on orders over ₦10,000 · Ends 31 Jul | Active |
| WELCOME20 | 20% off for first-time buyers · Ends 15 Jun | Scheduled (processing badge) |
| BULKORDER | 10% off on orders of 5+ items · Unlimited | Draft |

**Promo code style**: `.promo-code` — mono font, orange text, orange-bg tint, padding 2px 8px, border-radius 4px.

**Edit button**: Toast "Editing {code} promotion…" → opens `promoModal`

#### New Promotion Modal (`promoModal`)

Fields:
- Promo Code (text, placeholder "e.g. SUMMER20" — auto-uppercased on submit)
- Discount Type select + Value number (2-column): Percentage (%) / Fixed Amount (₦)
- Start Date + End Date (2-column, date inputs)
- Applicable Products select: All Products / Spices & Seasonings / Select individually…
- Minimum Order (number, placeholder "0 (no minimum)")

**Submit validation**: Code required → toast "Enter a promo code" (error)  
**On success**: Toast `Promotion "${CODE}" created!` (success) → close modal → clear fields

---

### `settings` — Store Settings

**Subtitle**: "Manage your store profile and payment details"

**Layout**: 2-column grid

#### Left — Store Profile card

Fields (pre-filled):
- Store Name: Deni
- Store Description (textarea 3 rows): "Premium African food ingredients — jollof spices, groundnut paste, smoked fish, and more delivered fresh."
- Contact Email: hello@akaramarket.com
- Phone: +234 800 AKARA

"Save Changes" button → toast "Settings saved successfully!" (success)

#### Right — Bank Information + Payout Preferences card (two sections)

**Bank Information section**:
- Bank Name select: GTBank / Access Bank
- Account Number: 0123456789
- Account Name: Deni Ventures

**Payout Preferences section**:
- Auto Withdraw Threshold select: ₦50,000 / **₦100,000** (selected) / ₦200,000
- Payout Schedule select: Manual only / **Weekly (every Monday)** (selected) / Bi-weekly

"Save Changes" button → toast "Settings saved successfully!" (success)

---

## Interaction Summary

| Action | Trigger | Behavior | Toast |
|---|---|---|---|
| Navigate | `nav(section)` / nav-item click | Switch active panel, update header title, close mobile sidebar | — |
| Open mobile sidebar | Hamburger click | Toggle `.open` on sidebar + overlay | — |
| Close mobile sidebar | Overlay click / `closeSidebar()` | Remove `.open` | — |
| Add product (button) | "+ Add Product" | Open `productModal` | — |
| Edit product | "Edit" button | Toast + open `productModal` | "Opening {name} for editing…" |
| Submit new product | Modal "Add Product" | Validate name → close modal → clear fields | "{name} has been added to your catalogue!" |
| Update order status | Inline `<select>` change | Update badge class/text in row | "Order {id} updated to {status}" |
| Restock item | "Restock" button | `prompt()` for qty → update In Stock + Available → update badge to OK | "Restocked {qty} units of {name}" |
| View customer | "View" button | Populate + open `customerModal` | — |
| Post review reply | "Reply" button | Validate non-empty → clear input | "Reply posted to review" / "Write a reply first" |
| Withdraw funds | "Withdraw Funds" button | Validate amount → submit | "₦{amount} withdrawal request submitted!" |
| New promotion (button) | "+ New Promotion" | Open `promoModal` | — |
| Edit promotion | "Edit" button | Toast + open `promoModal` | "Editing {code} promotion…" |
| Submit new promotion | Modal "Create Promotion" | Validate code → close modal → clear fields | `Promotion "${CODE}" created!` |
| Save store settings | "Save Changes" | — | "Settings saved successfully!" |
| Save bank settings | "Save Changes" | — | "Settings saved successfully!" |

---

## Responsive Behavior

| Breakpoint | Behavior |
|---|---|
| `≤1200px` | Stat grid → 2 columns |
| `≤1024px` | `.col-2` and `.col-2-1` → 1 column; search input max 140px (focus 180px) |
| `≤768px` | Hamburger shown; sidebar off-canvas (`translateX(-100%)`); `main` margin-left 0; content padding 14px; header padding 14px; search box hidden; stat grid gap 8px; stat card padding 12px; stat value 18px; form rows 1 column |
| `≤480px` | Stat grid → 1 column; modal padding 16px |
