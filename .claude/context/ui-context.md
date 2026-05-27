# NaijaPlate — UI Context

> This file is the single source of truth for all visual and structural design decisions across the Admin, Seller, and User dashboards. Every role-specific spec references this file. Do not redefine tokens or components here that are already declared here.

---

## Brand

| Property | Value |
|---|---|
| Product name | NaijaPlate |
| Tagline | Authentic African food, delivered |
| Logo mark | "NP" initials in white on red `#ea2804` rounded square |
| Primary audience | Nigerian food shoppers (diaspora + local) |
| Tone | Warm, direct, trustworthy |

---

## Color Tokens

### Brand

| Token | Value | Usage |
|---|---|---|
| `--primary` | `#ea2804` | Buttons, active nav, links, focus rings |
| `--primary-deep` | `#c01f00` | Hover state on primary elements |
| `--primary-bg` | `rgba(234,40,4,0.08)` | Active nav background, input focus ring fill |
| `--on-primary` | `#ffffff` | Text/icons on red backgrounds |

### Neutral

| Token | Value | Usage |
|---|---|---|
| `--ink` | `#171717` | Headings, primary text |
| `--body` | `#4d4d4d` | Body copy, nav labels |
| `--muted` | `#888888` | Secondary text, subtitles |
| `--ash` | `#a1a1a1` | Timestamps, tertiary labels |
| `--stone` | `#bbbbbb` | Disabled text, placeholders |
| `--hairline` | `#ebebeb` | Borders, dividers, separators |

### Surfaces

| Token | Value | Usage |
|---|---|---|
| `--canvas` | `#fafafa` | App background |
| `--surface-card` | `#ffffff` | Cards, panels, sidebar, topbar |
| `--surface-soft` | `#f5f5f5` | Inner backgrounds, empty states, image placeholders |
| `--surface-dark` | `#171717` | Toast, dark overlays |

### Semantic

| Token | Value | Usage |
|---|---|---|
| `--success` | `#0070f3` | Delivered, credits, default badges (blue) |
| `--success-bg` | `#e8f3ff` | Success badge background |
| `--warning` | `#f5a623` | Shipped, in-transit, pending |
| `--warning-bg` | `#ffefcf` | Warning badge background |
| `--danger` | `#ee0000` | Errors, cancellations, destructive actions |
| `--danger-bg` | `#f7d4d6` | Danger badge background |
| `--info` | `#7928ca` | Confirmed, informational states |
| `--info-bg` | `#f0edf8` | Info badge background |

> ⚠️ Note: `--success` is blue (`#0070f3`), not green. This is intentional brand choice.

---

## Typography

| Token | Value |
|---|---|
| `--font-sans` | `'Inter', system-ui, -apple-system, sans-serif` |
| `--font-mono` | `'JetBrains Mono', ui-monospace, Menlo, monospace` |

### Type Scale

| Role | Size | Weight | Notes |
|---|---|---|---|
| Page title | `20px` | `600` | Letter spacing `-0.03em` |
| Page subtitle | `13px` | `400` | Color `--muted` |
| Panel heading | `12px` | `600` | Uppercase, letter spacing `0.04em` |
| Section group label | `10px` | `500` | Uppercase, letter spacing `0.06em`, mono font |
| Body | `13px` | `400` | Color `--body` |
| Secondary | `12px` | `450` | Color `--muted` |
| Small / meta | `11px` | `400` | Color `--ash` |
| Micro / timestamp | `10px` | `400` | Color `--ash` |
| Stat value | `22px` | `600` | Letter spacing `-0.03em` |
| Mono label | `9–11px` | `400–500` | Use `--font-mono` for refs, codes, IDs |

---

## Spacing & Shape

### Border Radius

| Token | Value | Usage |
|---|---|---|
| `--radius-xs` | `4px` | Payment icons, tiny elements |
| `--radius-sm` | `6px` | Buttons, inputs, nav links, badges |
| `--radius-md` | `8px` | Cards, panels, dropdowns |
| `--radius-lg` | `12px` | Modals |
| `--radius-xl` | `16px` | Large cards |
| `--radius-full` | `9999px` | Pills, avatars, dots |

### Layout

| Token | Value |
|---|---|
| `--sidebar-w` | `240px` |
| `--header-h` | `52px` |
| Content padding (desktop) | `24px 28px` |
| Content padding (tablet) | `16px` |
| Content padding (mobile) | `12px` |
| Card gap | `12px` |
| Panel inner padding | `16px` |

### Shadows

| Token | Value | Usage |
|---|---|---|
| `--shadow-card` | `0 0 0 1px rgba(0,0,0,0.04), 0 1px 2px rgba(0,0,0,0.04)` | Default card |
| `--shadow-elevated` | `0 0 0 1px rgba(0,0,0,0.04), 0 2px 4px rgba(0,0,0,0.04), 0 4px 12px rgba(0,0,0,0.04)` | Hover state |
| `--shadow-modal` | `0 0 0 1px rgba(0,0,0,0.04), 0 8px 16px rgba(0,0,0,0.06), 0 24px 48px rgba(0,0,0,0.08)` | Modals, dropdowns |

---

## Animation

| Token | Value | Usage |
|---|---|---|
| `--transition` | `150ms cubic-bezier(0.4,0,0.2,1)` | All hover/focus state transitions |
| Toast entrance | `200ms cubic-bezier(0.16,1,0.3,1)` | Slide up + fade |
| Spinner | `500ms linear infinite` | Button loading state |
| Active nav pulse | `ringPulse 2s infinite` | Pulsing ring on active delivery steps |
| Notification dot | `blip 2s infinite` | Opacity pulse on unread bell dot |

---

## Layout Structure

All dashboards share the same shell:

```
.app (display:flex, height:100vh, overflow:hidden)
├── .sidebar (width:240px, fixed on desktop, off-canvas on mobile)
│   ├── .sidebar-brand (height:52px, logo + name)
│   ├── .sidebar-nav (flex:1, scrollable, nav links)
│   └── .sidebar-foot (user avatar + name + email)
└── .main (flex:1, flex-direction:column)
    ├── .topbar (height:52px, search + actions)
    └── .content (flex:1, overflow-y:auto, padding:24px 28px)
```

---

## Responsive Breakpoints

| Breakpoint | Behavior |
|---|---|
| `≤1024px` | 2-column grids → 1 column; address grid → 1 column |
| `≤768px` | Sidebar becomes fixed off-canvas (left:-260px); hamburger button appears; content padding → 16px; 3-col grids → 1 col; stats → 2 col; delivery steps → vertical |
| `≤480px` | Stats → 1 col; search input → max 140px; content padding → 12px; wishlist/product grids → 1 col |

---

## Grid System

| Class | Columns | Gap |
|---|---|---|
| `.g2` | `1fr 1fr` | `12px` |
| `.g3` | `1fr 1fr 1fr` | `12px` |
| `.stats` | `repeat(auto-fit, minmax(180px, 1fr))` | `12px` |
| `.prod-grid` | `repeat(auto-fill, minmax(160px, 1fr))` | `10px` |
| `.wish-grid` | `repeat(auto-fill, minmax(160px, 1fr))` | `10px` |
| `.addr-grid` | `1fr 1fr` | `10px` |

---

## Shared Components

### Button (`.btn`)

Base class `.btn` + modifier:

| Modifier | Style | Usage |
|---|---|---|
| `.btn-p` | Red fill, white text | Primary action |
| `.btn-s` | White fill, hairline border | Secondary action |
| `.btn-g` | Transparent, muted text | Ghost / subtle |
| `.btn-d` | Danger bg fill → danger red on hover | Destructive |
| `.btn-dark` | Dark fill, white text | Dark variant |
| `.btn-sm` | `padding: 5px 10px`, `font-size: 11px` | Small size |
| `.btn-ico` | `30×30px`, no padding | Icon-only |
| `.btn-block` | `width: 100%` | Full width |
| `.btn-loading` | Pointer-events none, 0.7 opacity, spinning `::after` | Loading state |

**Active press**: `transform: scale(0.98)` on `.btn-p:active`

---

### Badge (`.badge`)

Pill shape (`border-radius: 9999px`), uppercase, `10px`, `font-weight: 500`.

| Class | Background | Color | Usage |
|---|---|---|---|
| `.badge-conf` | `--info-bg` | `--info` | Confirmed |
| `.badge-pack` | `--primary-bg` | `--primary` | Packed |
| `.badge-ship` | `--warning-bg` | warning deep | Shipped |
| `.badge-del` | `--success-bg` | `--success` | Delivered |
| `.badge-can` | `--danger-bg` | `--danger` | Cancelled |

---

### Panel (`.panel`)

White card with `border-radius: 8px` and `--shadow-card`.

```
.panel
├── .panel-h        ← header row (title left, action right), padding 12px 16px, hairline border-bottom
│   ├── h3          ← 12px, 600 weight, uppercase, letter-spacing 0.04em
│   └── .panel-action ← 12px, primary color, hover shows primary-bg tint
└── .panel-b        ← body, padding 0 16px (inner elements add their own vertical padding)
```

---

### Form Fields

| Element | Class | Height | Notes |
|---|---|---|---|
| Text input | `.fi` | `38px` | Border hairline → primary on focus, 3px primary-bg shadow ring |
| Inline input | `.di-input` | `38px` | Same focus style, used in detail views |
| Textarea | `textarea.di-input` | `auto` | Min-height 70px, resize vertical |
| Label (settings) | `label` in `.fg` | — | 12px, weight 450, `--body` color |
| Label (detail) | `.di-label` | — | 10px mono, uppercase, `--ash`, letter-spacing 0.04em |
| Error message | `.fe` | — | 11px, `--danger` |

**Focus style**: `border-color: var(--primary)` + `box-shadow: 0 0 0 3px var(--primary-bg)`

---

### Toast

- Position: `fixed`, `bottom: 20px`, horizontally centered
- Background: `--surface-dark`, white text
- Padding: `10px 20px`, `border-radius: 6px`
- Auto-dismisses after **2.6 seconds**
- Entrance: slide up 12px + fade in over 200ms
- z-index: `200`

---

### Modal

```
.modal-overlay   ← fixed inset, rgba(23,23,23,0.3), flex center, z-index 100
└── .modal       ← white, border-radius 12px, max-width 440px, max-height 80vh, scrollable
    ├── .modal-h ← padding 16px 20px, title (16px/600) + close button
    ├── .modal-b ← padding 20px
    └── .modal-actions ← flex row, justify end, gap 8px
```

---

### Notification Bell

- Button: `30×30px`, `border-radius: 6px`
- Unread dot: `5×5px` red circle, top-right corner, blip animation, `border: 1.5px solid --surface-card`
- Dropdown: `320px` wide, `border-radius: 8px`, `--shadow-modal`, max-height `360px` scrollable
- Unread items: `--primary-bg` background tint, filled red dot
- Read items: `--hairline` dot

---

### Avatar

| Context | Size | Shape | Style |
|---|---|---|---|
| Topbar | `28×28px` | `border-radius: 6px` | Red gradient, white initials 10px/600 |
| Sidebar foot | `30×30px` | `border-radius: 9999px` | Red gradient, white initials 11px/600 |

Gradient: `linear-gradient(135deg, var(--primary), var(--primary-deep))`

---

### Delivery Status Stepper

Horizontal step row. Each step:
- `done`: filled red circle with ✓, red label, red connector line
- `active`: white circle with red border, pulsing ring animation (`ringPulse 2s infinite`)
- `pending`: grey circle with number, muted label

Connector line: `::after` pseudo-element, `1.5px` height, spans between step centers. Red when done.

Mobile (`≤768px`): steps stack vertically, connector lines hidden.

---

### Timeline

Vertical event list. Each item:
- Left dot: `20×20px`, same done/active/pending styles as stepper
- Vertical connector: `::before` pseudo on non-last items, `1px` wide, red when done
- Right body: title (13px/500), subtitle (11px/muted), timestamp (10px/ash)

---

### Progress Bar

```html
<div class="progress-bar">       ← 3px height, soft bg, border-radius 4px
  <div class="progress-fill">   ← red fill, transitions width 800ms ease
```

---

### Scrollbar

```css
::-webkit-scrollbar        { width: 4px }
::-webkit-scrollbar-track  { background: transparent }
::-webkit-scrollbar-thumb  { background: --stone; border-radius: 4px }
```

---

## Icon System

All icons are inline SVG. Consistent props:
- `viewBox="0 0 24 24"`
- `fill="none"`
- `stroke="currentColor"`
- `strokeWidth="1.8"` (topbar actions use `2`)
- `strokeLinecap="round"`, `strokeLinejoin="round"`

Available icons: `grid`, `home`, `list`, `truck`, `cart`, `heart`, `map`, `card`, `bell`, `settings`, `search`, `chevron`, `x`, `plus`, `clock`, `info`

---

## Empty States

```
.empty (padding 48px 20px, text-center)
├── icon (36×36px, --stone color)
├── h3   (14px/500, --muted)
├── p    (12px, --ash, max-width 240px, centered)
└── optional CTA button
```

---

## Status → Badge Mapping

| Order status | Badge class | Label |
|---|---|---|
| `confirmed` | `.badge-conf` | Confirmed |
| `packed` | `.badge-pack` | Packed |
| `shipped` | `.badge-ship` | Shipped |
| `delivered` | `.badge-del` | Delivered |
| `cancelled` | `.badge-can` | Cancelled |

---

## CSS Selection & Scrollbar

```css
::selection { background: var(--ink); color: #f2f2f2; }
```

Font rendering: `-webkit-font-smoothing: antialiased; -moz-osx-font-smoothing: grayscale`

---

## What This File Does NOT Cover

The following are defined in role-specific spec files:

- Page list and navigation structure per role
- Data schemas and seed data
- Page-level state and business logic
- Role-specific interactions and flows
- Permissions and access control

| Role file | Covers |
|---|---|
| `admin.md` | Admin pages, user management, analytics, platform controls |
| `seller.md` | Seller pages, product management, order fulfillment, payouts |
| `user.md` | Customer pages, shopping, checkout, delivery tracking |
