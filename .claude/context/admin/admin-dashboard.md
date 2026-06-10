# Kongo — Admin Dashboard Spec

> Design system: see `ui-context.md` for all tokens, components, layout shell, and shared CSS.  
> This file covers only the admin dashboard: pages, state, data, interactions, modals, and flows.

---

## Role Overview

| Property | Value |
|---|---|
| Role | Platform Administrator |
| Product name | Kongo |
| Entry point | `/#overview` |
| Default page | `overview` |
| Currency | Kenyan Shilling (KES) |
| Admin user | Initials: AO |
| Page routing | Hash-based (`#overview`, `#users`, etc.) |

---

## Key Differences from User Dashboard

| Property | Admin | User (Deni) |
|---|---|---|
| Brand name | Kongo | Deni |
| Currency | KES | ₦ |
| Sidebar position | Fixed (not off-canvas on desktop) | Fixed width |
| Toast position | Bottom-right | Bottom-center |
| Toast colors | Typed (success=blue, danger=red, warning=amber, default=dark) | Always dark |
| Routing | Hash-based URL | In-memory state |
| Scrollbar | 6px, ash thumb | 4px, stone thumb |
| Page shown/hidden | CSS `display:none` / `display:block` via `.active` class | React state swap |
| Modal | Global singleton, dynamically injected HTML | Per-page React state |

---

## Navigation

13 items across 4 groups. Active item: red background tint + red text (same as user dashboard).  
Badge counts shown on nav items where applicable.

### Group: Overview
| ID | Label | Badge |
|---|---|---|
| `overview` | Overview | — |
| `notifications` | Notifications | 6 |

### Group: Management
| ID | Label | Badge |
|---|---|---|
| `users` | Users | 2,847 |
| `sellers` | Sellers | 143 |
| `products` | Products | 12.4K |

### Group: Commerce
| ID | Label | Badge |
|---|---|---|
| `orders` | Orders | 486 |
| `payments` | Payments | — |
| `disputes` | Disputes | 12 |

### Group: Platform
| ID | Label | Badge |
|---|---|---|
| `analytics` | Analytics | — |
| `content` | Content | — |
| `settings` | Settings | — |

### Sidebar Footer
- Log out link (shows toast "Logged out" on click)

---

## Layout Shell (Admin-specific)

```
.app (flex row, 100vw × 100vh, overflow hidden)
├── .sidebar-overlay (mobile only, z-index 99)
├── .sidebar (fixed, 240px wide, z-index 100)
│   ├── .sidebar-logo (52px, K mark + "kongo" wordmark)
│   ├── .sidebar-nav (scrollable, grouped nav items)
│   └── .sidebar-footer (log out link)
└── .main (margin-left: 240px, flex column, 100vh)
    ├── .header (52px, breadcrumb + search + actions)
    └── .content (flex 1, overflow-y auto, padding 24px)
        └── .panel (only .active panel is display:block)
```

**Logo**: "K" white on red square (`--radius-sm`) + wordmark "kong**o**" where "o" is red.  
**Header breadcrumb**: "Kongo / {ActivePageLabel}" — label updates on navigation.  
**Notification bell**: Red badge showing count "6". Clicking navigates to `notifications` panel.  
**Header avatar**: "AO" initials, 28px circle, soft background.

---

## Routing

Hash-based. All navigation updates `window.location.hash`.

```javascript
// Switch panel
panels.forEach(p => p.classList.remove('active'));
document.getElementById('panel-' + id).classList.add('active');
navItems → remove/add .active class
breadLabel.textContent = panelLabels[id]
```

**On load**: reads `window.location.hash` to restore active panel.  
**hashchange** event listener keeps URL and active panel in sync.  
**Mobile**: hamburger toggles `.open` on `.sidebar` and `.sidebar-overlay`. Overlay click closes sidebar.

---

## Global UI Patterns

### Action Bar
Used on Users, Sellers, Products, Orders panels. Always contains:
- Inline search input (max 240px)
- Filter chips group (one active at a time)
- Optional right-side buttons (Export, etc.)

### Filter Chips
Clicking a chip removes `.active` from siblings and adds to itself. Visual only — no actual data filtering in this version.

### Toast (Admin variant)
- Position: `fixed`, bottom-right (`bottom: 24px, right: 24px`)
- Stacks vertically with `gap: 8px`
- Typed colors:
  - `success` → `#0070f3` (blue)
  - `danger` → `#ee0000` (red)
  - `warning` → `#f5a623` (amber)
  - default → `#171717` (dark)
- Fade-in animation: `translateY(8px)` → `translateY(0)`, 200ms
- Auto-dismiss: 3 seconds (fade out 300ms)

```javascript
showToast(message, type) // type: 'success' | 'danger' | 'warning' | default
```

### Modal (Global Singleton)
Single `#modalOverlay` + `#modalContent` reused for all modals.

```
.modal-overlay (fixed inset, rgba(0,0,0,0.3), backdrop-filter blur 2px, z-index 200)
└── .modal (480px wide, max 100vw-32px, max-height 100vh-64px, scrollable)
    ├── .modal-h (title + close button)
    └── .modal-b (dynamically injected HTML)
```

**Open**: `openModal(title, bodyHTML)` injects HTML + shows overlay.  
**Close**: `closeModal()` hides overlay. Also closes on overlay background click.  
**Pattern**: Every modal injects `.modal-confirm-btn` and `.modal-close-btn` inside `.form-actions`. Event listeners attached after injection.

### Status Pills (`.pill`)
Dot + label. Used throughout all tables.

| Class | Background | Color | Usage |
|---|---|---|---|
| `.pill-active` | blue 10% | `--success` | Active, Shipped, New |
| `.pill-pending` | amber 10% | `--warning` | Pending, Scheduled, Open |
| `.pill-suspended` | red 8% | `--danger` | Suspended, Warning |
| `.pill-info` | purple 10% | `--info` | Confirmed, Flagged |
| `.pill-success` | blue 10% | `--success` | Verified, Delivered, Completed |
| `.pill-danger` (inline) | `rgba(238,0,0,0.08)` | `--danger` | Cancelled, Refunded, High priority |

### Tables
Standard `<table>` pattern used across all panels.

| Element | Style |
|---|---|
| `thead th` | 13px, `--muted`, `font-weight: 500`, hairline bottom border |
| `tbody td` | 13px, `--body`, hairline bottom border, `vertical-align: middle` |
| `tbody tr:hover td` | background `--canvas` |
| `.mono-id` | 12px, `--ash`, tabular nums |
| `.font-mono` | tabular nums, letter-spacing -0.01em |

### Cards (`.card`)
White, `border-radius: 8px`, `--shadow-card`.

```
.card
├── .card-h  → flex row: h3 (15px/500) left, link/button right. Hairline bottom.
└── .card-b  → padding 16px 20px (overridden to 0 for table cards)
```

### Toggle Switch (`.toggle`)
36×20px. Unchecked: `--stone`. Checked: `--success` (blue). Thumb: 16×16px white circle.

### Inline Alert (`.alert`)
Flex row with icon. Variants: `alert-info`, `alert-warn`, `alert-danger`, `alert-success`.

---

## Pages

---

### `overview` — Platform Dashboard

**Layout**: Page heading → 4-stat row → 2-column section row → 2-column widget grid

#### Stats (4 cards)

| Label | Value | Delta |
|---|---|---|
| Total Users | 14,283 | +12.4% this month ↑ |
| Revenue (30d) | KES 4.8M | +8.2% this month ↑ |
| Orders (30d) | 2,847 | +15.6% this month ↑ |
| Active Sellers | 312 | -2.1% this month ↓ |

#### Section Row (2 columns)

**Left — Revenue trend card**:
- CSS-only bar chart, 6 bars (Jan–Jun)
- Heights: Jan 65%, Feb 45%, Mar 75%, Apr 60%, May 85%, Jun 100%
- Jan–May filled (`.bar.fill` = red), Jun unfilled (`.bar` = primary-bg)
- "View details" link → navigates to `analytics` panel

**Right — Recent orders card** (table, no thead):

| Order ID | Customer | Status | Amount |
|---|---|---|---|
| #ORD-3842 | Amara Osei | Shipped (active) | KES 12,400 |
| #ORD-3841 | Kwame Mensah | Pending | KES 3,800 |
| #ORD-3840 | Folake Nwachukwu | Confirmed (info) | KES 28,500 |
| #ORD-3839 | Chidi Kamara | Shipped (active) | KES 6,200 |

"View all" link → navigates to `orders` panel

#### Widget Grid (2 columns)

**Left — Top sellers card**:

| Seller | Revenue | Orders |
|---|---|---|
| Nakato Textiles | KES 342K | 184 |
| Makena Crafts | KES 298K | 156 |
| Omondi Electronics | KES 211K | 93 |
| Chioma Foods | KES 187K | 247 |

**Right — Platform health card**:
4 progress bars with label + value:

| Metric | Value | Color | Bar width |
|---|---|---|---|
| Uptime | 99.97% | `--success` | 99.97% |
| Avg response | 124ms | `--primary` | 88% |
| Error rate | 0.03% | `--success` | 0.03% |
| Queue depth | 4 | `--warning` | 4% |

---

### `users` — User Management

**Page subtitle**: "Manage platform users — view, search, suspend, or ban accounts"

**Action bar**: Search input + filter chips (All / Active / Suspended / Banned) + Export button (right)

**Export button**: Toast "Export started — CSV will download shortly"

**Table columns**: Checkbox · Name · Email · Location · Joined · Orders · Status · Action

**User data (7 rows)**:

| Name | Email | Location | Joined | Orders | Status | Action |
|---|---|---|---|---|---|---|
| Amara Osei | amara.o@email.com | Lagos, NG | Mar 2024 | 24 | Active | Ban |
| Kwame Mensah | kwame.m@email.com | Accra, GH | Jan 2024 | 56 | Active | Ban |
| Folake Nwachukwu | folake.n@email.com | Lagos, NG | Nov 2023 | 89 | Active | Ban |
| Chidi Kamara | chidi.k@email.com | Nairobi, KE | Feb 2024 | 12 | Suspended | Reinstate |
| Zola Mbeki | zola.m@email.com | Johannesburg, ZA | Jun 2023 | 143 | Active | Ban |
| Esi Adjei | esi.a@email.com | Accra, GH | Sep 2023 | 67 | Active | Ban |
| Jabari Okonjo | jabari.o@email.com | Dar es Salaam, TZ | Apr 2024 | 3 | Pending | Approve |

**Action buttons** (`data-action` attribute drives modal):

**Ban** (`data-action="ban"`):
- Modal: "Confirm ban"
- Body: Warning text with user name + Reason textarea
- Confirm button: red "Ban user" → toast "{name} banned" (danger)
- Cancel → close modal

**Reinstate** (`data-action="reinstate"`):
- Modal: "Reinstate user"
- Body: Confirmation text only
- Confirm: green "Reinstate" → toast "{name} reinstated" (success)

**Approve** (`data-action="approve"`):
- Modal: "Approve user"
- Body: Confirmation text only
- Confirm: "Approve" → toast "{name} approved" (success)

---

### `sellers` — Seller Management

**Page subtitle**: "Approve seller applications and verify business documents"

**Action bar**: Search + filter chips (All / Approved / Pending / Rejected)

**Table columns**: Business · Owner · Category · Location · Products · Revenue · Documents · Status · Action

**Seller data (6 rows)**:

| Business | Owner | Category | Location | Products | Revenue | Docs | Status | Action |
|---|---|---|---|---|---|---|---|---|
| Nakato Textiles | Nakato Abimbola | Fashion | Lagos, NG | 47 | KES 342K | Verified | Active | View |
| Makena Crafts | Makena Wanjiku | Handicrafts | Nairobi, KE | 124 | KES 298K | Verified | Active | View |
| Omondi Electronics | Omondi Nyongo | Electronics | Nairobi, KE | 89 | KES 211K | Pending | Active | Verify docs |
| Chioma Foods | Chioma Eze | Food & Grocery | Lagos, NG | 203 | KES 187K | Verified | Active | View |
| Tendai Furniture | Tendai Banda | Home & Living | Lusaka, ZM | 31 | KES 95K | Pending | Pending | Verify docs |
| Fatima Beauty | Fatima Hassan | Beauty | Dar es Salaam, TZ | 76 | KES 156K | Verified | Active | View |

**Verify docs** (`data-action="verify"`):
- Modal: "Verify documents"
- Body: Business name + two document preview boxes (Business registration, Government ID) — each 120px soft placeholder
- Confirm: "Approve & verify" → toast "{name} verified" (success)
- Cancel button: "Reject" → closes modal (no toast)

**View** (seller detail):
- Modal: business name as title
- Body: 2-column grid showing Owner, Category, Location, Products, Revenue, Documents pill
- Confirm: "Close" only

---

### `products` — Product Moderation

**Page subtitle**: "Moderate marketplace listings — approve, reject, or flag for review"

**Action bar**: Search + filter chips (All / Approved / Pending / Flagged)

**Table columns**: Product · Seller · Category · Price · Stock · Sales · Status · Action

**Product data (6 rows)**:

| Product | Seller | Category | Price | Stock | Sales | Status | Action |
|---|---|---|---|---|---|---|---|
| Kente Dashiki Pro | Nakato Textiles | Fashion | KES 8,500 | 43 | 128 | Active | Moderate |
| Handwoven Basket Set | Makena Crafts | Handicrafts | KES 2,200 | 200 | 347 | Active | Moderate |
| Refurbished Laptop | Omondi Electronics | Electronics | KES 45,000 | 12 | 34 | Pending | Approve |
| Organic Egusi Soup Mix | Chioma Foods | Food & Grocery | KES 1,800 | 500 | 892 | Active | Moderate |
| Mango Wood Shelf | Tendai Furniture | Home & Living | KES 6,700 | 28 | 56 | Flagged (info) | Review |
| Shea Butter Cream | Fatima Beauty | Beauty | KES 1,200 | 340 | 567 | Active | Moderate |

**Moderate**:
- Modal: "Moderate listing"
- Body: Product details grid (Listed by, Price, Category, Date listed) + Admin notes textarea
- Confirm: "Approve listing" → toast "{product} approved" (success)
- Cancel: "Flag for review" → toast "{product} flagged" (warning)

**Approve**:
- Modal: "Approve listing"
- Body: Simple confirmation
- Confirm: "Approve" → toast "{product} approved" (success)

**Review** (flagged listing):
- Modal: "Review flagged listing"
- Body: Flag reason — "Potential counterfeit — price significantly below market average"
- Confirm: "Clear flag & approve" → toast "{product} approved" (success)
- Cancel: "Reject listing" → toast "{product} rejected" (danger)

---

### `orders` — Order Management

**Page subtitle**: "Monitor all marketplace orders — track, cancel, or manage returns"

**Action bar**: Search + filter chips (All / Pending / Confirmed / Shipped / Delivered / Cancelled)

**Table columns**: Order ID · Customer · Items · Total · Payment · Date · Status · Action

**Order data (7 rows)**:

| Order ID | Customer | Items | Total | Payment | Date | Status |
|---|---|---|---|---|---|---|
| #ORD-3842 | Amara Osei | 3 items | KES 12,400 | M-Pesa | 26 May | Shipped |
| #ORD-3841 | Kwame Mensah | 1 item | KES 3,800 | Card | 26 May | Pending |
| #ORD-3840 | Folake Nwachukwu | 5 items | KES 28,500 | M-Pesa | 25 May | Confirmed |
| #ORD-3839 | Chidi Kamara | 2 items | KES 6,200 | M-Pesa | 25 May | Shipped |
| #ORD-3838 | Zola Mbeki | 4 items | KES 19,800 | Bank | 24 May | Delivered |
| #ORD-3837 | Esi Adjei | 1 item | KES 1,200 | M-Pesa | 24 May | Cancelled |
| #ORD-3836 | Jabari Okonjo | 2 items | KES 4,600 | M-Pesa | 23 May | Shipped |

**Payment methods**: M-Pesa, Card, Bank

**View button** (order detail):
- Modal: "Order {ID}"
- Body: 2-column grid (Customer, Total, Payment, Date, Status, Items) + Tracking section placeholder ("No tracking info available yet.")
- Close button only

---

### `payments` — Payment Management

**Page subtitle**: "View transactions, process refunds, and manage payouts"

**Stats (3 cards, 3-column override)**:

| Label | Value |
|---|---|
| Volume (30d) | KES 4.8M |
| Transactions | 2,847 |
| Avg ticket | KES 1,686 |

**"Process refund" button** (top right of transactions card):

Modal: "Process refund"
- Transaction ID text input (placeholder: "e.g. TXN-89432")
- Refund amount (number input)
- Reason select: Customer request / Item not received / Damaged goods / Wrong item shipped / Duplicate payment
- Confirm: "Process refund" → toast "Refund processed" (success)

**Transactions table (6 rows)**:

| Transaction ID | Customer | Method | Amount | Date | Status |
|---|---|---|---|---|---|
| TXN-89432 | Amara Osei | M-Pesa | KES 12,400 | 26 May | Completed |
| TXN-89431 | Kwame Mensah | Card | KES 3,800 | 26 May | Pending |
| TXN-89430 | Folake Nwachukwu | M-Pesa | KES 28,500 | 25 May | Completed |
| TXN-89429 | Chidi Kamara | M-Pesa | KES 6,200 | 25 May | Completed |
| TXN-89428 | Zola Mbeki | Bank | KES 19,800 | 24 May | Completed |
| TXN-89427 | Esi Adjei | M-Pesa | KES 1,200 | 24 May | Refunded |

---

### `disputes` — Dispute Resolution

**Page subtitle**: "Resolve buyer-seller disputes and issue resolutions"

**Stats (3 cards, 3-column override)**:

| Label | Value | Color |
|---|---|---|
| Open | 12 | `--warning` |
| Avg resolution | 2.4 days | default |
| Resolved this week | 18 | default |

**Table columns**: ID · Buyer · Seller · Issue · Amount · Opened · Priority · Status · Action

**Dispute data (3 rows)**:

| ID | Buyer | Seller | Issue | Amount | Opened | Priority | Status | Action |
|---|---|---|---|---|---|---|---|---|
| DSP-023 | Amara Osei | Nakato Textiles | Item not received | KES 8,500 | 25 May | High (danger) | Open | Resolve |
| DSP-022 | Kwame Mensah | Makena Crafts | Wrong item shipped | KES 2,200 | 24 May | Medium (warning) | Open | Resolve |
| DSP-021 | Folake Nwachukwu | Chioma Foods | Damaged goods | KES 1,800 | 23 May | Low (active) | Resolved | View |

**Resolve button**:
- Modal: "Resolve dispute {ID}"
- Body: Issue label + Resolution select (Refund buyer full / partial / Reject claim / Split 50-50) + Admin notes textarea
- Confirm: "Resolve dispute" → toast "{ID} resolved" (success)
- Cancel: "Escalate" → toast "{ID} escalated" (warning)

**View button** (resolved dispute):
- Modal: "{ID}"
- Body: Buyer vs Seller, Issue, Amount, Status: Resolved
- Close button only

---

### `analytics` — Platform Analytics

**Page subtitle**: "Platform metrics and performance trends"

**Mini cards (4, top row)**:

| Label | Value | Delta |
|---|---|---|
| GMV (30d) | KES 4.8M | +18% vs last period (success) |
| Avg order value | KES 1,686 | +2% vs last period (body) |
| Conversion rate | 3.2% | +0.4pp vs last period (success) |
| Repeat buyers | 42% | +5pp vs last period (success) |

**Section row (2 columns)**:

**Left — Orders by region**:

| Region | Orders | Revenue | % |
|---|---|---|---|
| Lagos, NG | 1,024 | KES 1.9M | 36% |
| Nairobi, KE | 687 | KES 1.2M | 24% |
| Accra, GH | 423 | KES 684K | 15% |
| Johannesburg, ZA | 312 | KES 522K | 11% |
| Dar es Salaam, TZ | 198 | KES 286K | 7% |
| Other | 203 | KES 208K | 7% |

**Right — Top categories**:

| Category | Orders | Revenue |
|---|---|---|
| Fashion | 892 | KES 1.6M |
| Food & Grocery | 654 | KES 892K |
| Electronics | 432 | KES 1.1M |
| Handicrafts | 298 | KES 412K |
| Beauty | 267 | KES 342K |
| Home & Living | 198 | KES 442K |

---

### `content` — Content Management

**Page subtitle**: "Manage homepage banners, promotions, and featured content"

**Action bar**: "Add banner" (primary) + "Schedule promotion" (secondary)

**Active banners table (3 rows)**:

| Title | Position | Start | End | Status | Actions |
|---|---|---|---|---|---|
| Summer Fashion Sale | Hero | 15 May 2026 | 15 Jun 2026 | Active | Edit / Pause |
| New Seller Promotion | Secondary | 1 May 2026 | 1 Jul 2026 | Active | Edit / Pause |
| Free Delivery Weekend | Hero | Pending | — | Scheduled | Edit / Cancel |

**Info alert** below table: "Content changes take effect within 5 minutes. Schedule promotions up to 30 days in advance."

**Add banner modal**:
- Title text input
- Position select (Hero / Secondary / Sidebar) + Link URL (2-column)
- Start date + End date (2-column)
- Confirm: "Create banner" → toast "Banner created" (success)

**Schedule promotion modal**:
- Promotion title text input
- Start + End date (2-column)
- Description textarea
- Confirm: "Schedule" → toast "Promotion scheduled" (success)

**Edit (banner row)**:
- Modal: "Edit {title}"
- Body: Title input (pre-filled) + Start/End dates
- Confirm: "Save changes" → toast "{title} updated" (success)

**Pause (banner row)**:
- No modal. Immediate toast: "{title} paused" (warning)

**Cancel (scheduled promotion)**:
- Modal: "Cancel promotion"
- Body: Confirmation text
- Confirm: red "Cancel promotion" → toast "{title} cancelled" (danger)
- Cancel: "Keep" → close modal

---

### `settings` — Platform Configuration

**Page subtitle**: "Configure platform rules, commissions, and system preferences"

**Layout**: 2-column section row

**Left — Commission card**:

| Field | Default value |
|---|---|
| Default commission rate (%) | 8 |
| Electronics commission (%) | 5 |
| Food commission (%) | 10 |

"Save changes" button → toast "Commission settings saved" (success)

**Right — Platform rules card** (4 toggle rows):

| Setting | Description | Default |
|---|---|---|
| Auto-approve sellers | New sellers approved without manual review | ON |
| Require ID verification | Government ID required for seller registration | ON |
| Allow international sales | Cross-border buyer-seller transactions | OFF |
| Auto-refund under KES 1,000 | Automatic refund for disputes under threshold | ON |

No save button on rules card (toggles are immediate in this version).

---

### `notifications` — Platform Alerts

**Page subtitle**: "Platform alerts, user activity, and system warnings"

**Header row**: Title + subtitle left, "Mark all read" button right → toast "All marked as read" (success)

**Filter chips**: All / Unread / Alerts / Orders / Users / System

**Notification cards (6 items)**:

Each notification is a `.card` with:
- 36px icon square (colored by type)
- Title + pill badge
- Description (13px)
- Timestamp + action links

| # | Title | Type | Pill | Icon bg | Action links |
|---|---|---|---|---|---|
| 1 | Seller verification flagged | Urgent | Pending/Urgent | primary-bg | Review seller → sellers panel; Dismiss |
| 2 | New order — KES 24,500 | New | Active/New | success-bg | View order → orders panel; Dismiss |
| 3 | Refund request — KES 8,500 | Action needed | Pending | danger-bg | View dispute → disputes panel; Dismiss |
| 4 | 12 new users registered | Info | Success/Info | success-bg | View users → users panel |
| 5 | Revenue milestone: KES 5M | Milestone | Active | warning-bg | View analytics → analytics panel |
| 6 | Payment gateway latency | Warning | Suspended | danger-bg | Check payments → payments panel |

**Notification 1** has `border-left: 3px solid var(--primary)` and `--shadow-elevated` (urgent visual emphasis).

**Action links behavior**:
- "Review seller / View order / View dispute / View users / View analytics / Check payments" → calls `switchPanel(target)` + updates hash
- "Dismiss" → removes the card from DOM → toast "Dismissed" (success)

**Notification details**:

| # | Description |
|---|---|
| 1 | Nakato Textiles (ID: SELL-9841) submitted documents that failed automated verification. Manual review required. · 5 min ago |
| 2 | Chidi Kamara ordered 3 items from Zola Electronics (Order #ORD-8923). Payment confirmed via M-Pesa. · 18 min ago |
| 3 | Amina Diallo requested a refund for damaged goods from AfriStyle Fashion. Escalate if unresolved within 24h. · 1h ago |
| 4 | 12 new accounts created in the last hour. 4 are sellers, 8 are buyers. 2 pending verification. · 2h ago |
| 5 | Kongo marketplace crossed KES 5M in monthly revenue for the first time. Top category: Electronics (38%). · 3h ago |
| 6 | M-Pesa API response time increased to 3.2s (threshold: 2.0s). Monitoring. Check payment processing. · 5h ago |

---

## Interaction Summary

| Action | Trigger | Modal / Behavior | Toast |
|---|---|---|---|
| Navigate panel | Sidebar link click | Switch active panel, update hash, update breadcrumb | — |
| Navigate panel | Hash change | Sync panel to hash | — |
| Open mobile sidebar | Hamburger click | Toggle `.open` on sidebar + overlay | — |
| Close mobile sidebar | Overlay click | Remove `.open` | — |
| Notification bell click | Header bell | Navigate to notifications panel | — |
| Filter chips | Click chip | Toggle `.active` within group | — |
| Export users | "Export" button | — | "Export started — CSV will download shortly" |
| Ban user | "Ban" button | Confirm modal + reason textarea | "{name} banned" (danger) |
| Reinstate user | "Reinstate" button | Confirm modal | "{name} reinstated" (success) |
| Approve user | "Approve" button | Confirm modal | "{name} approved" (success) |
| Verify seller docs | "Verify docs" button | Document preview modal | "{name} verified" (success) |
| View seller | "View" button | Seller detail modal | — |
| Moderate product | "Moderate" button | Listing detail modal | "{product} approved" or "{product} flagged" |
| Approve product | "Approve" button | Confirm modal | "{product} approved" |
| Review flagged product | "Review" button | Flag reason modal | Approved or rejected |
| View order | "View" button | Order detail modal | — |
| Process refund | "Process refund" button | Refund form modal | "Refund processed" |
| Resolve dispute | "Resolve" button | Resolution form modal | "{ID} resolved" or "{ID} escalated" |
| View resolved dispute | "View" button | Dispute detail modal | — |
| Add banner | "Add banner" button | Banner form modal | "Banner created" |
| Schedule promotion | "Schedule promotion" | Promotion form modal | "Promotion scheduled" |
| Edit banner | "Edit" button | Edit form modal | "{title} updated" |
| Pause banner | "Pause" button | No modal | "{title} paused" (warning) |
| Cancel promotion | "Cancel" button | Confirm modal | "{title} cancelled" (danger) |
| Save commission | "Save changes" button | No modal | "Commission settings saved" |
| Mark all notifications read | Button in notifications header | No modal | "All marked as read" |
| Dismiss notification | "Dismiss" link | Remove card from DOM | "Dismissed" |
| Log out | Sidebar footer link | No modal | "Logged out" |

---

## Responsive Behavior

| Breakpoint | Behavior |
|---|---|
| `≤768px` | Sidebar off-canvas (transform translateX -100%); hamburger shown; stats 2-col; content padding 16px; section-row 1-col; all card grids 1-col; form rows 1-col; widget-grid 1-col; header search max 180px |
| `≤480px` | Stats 1-col; header search hidden; tab padding reduced |
| `≥1440px` | Content padding 32px; stats remain 4-col; card-grid-4 remains 4-col |
