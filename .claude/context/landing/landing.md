# BIUK — Landing Page Spec

> This file documents the public-facing marketing landing page for BIUK.
> For shared design tokens see `ui-context.md`.
> For dashboard pages see `admin.md`, `seller.md`, `user.md`.

---

## Overview

| Property | Value |
|---|---|
| Product | BIUK |
| Tagline | Authentic African Food, Delivered Anywhere |
| Audience | Africans in the diaspora ordering authentic African products |
| Font | Inter (Google Fonts — weights 400, 500, 600, 700, 800) |
| Max content width | 1440px |
| Side padding | 80px desktop · 40px tablet · 20px mobile |
| Background | White (`#fff`) with full-page swirl pattern overlay |

---

## Design Tokens (Landing-specific)

### Colors

| Token | Value | Usage |
|---|---|---|
| `--pr` | `rgba(193,45,7,1)` | Primary red — nav links, buttons, headings |
| `--ink` | `rgba(24,24,27,1)` | Body text, dark headings |
| `--body` | `rgba(113,113,122,1)` | Secondary body text |
| `--muted` | `rgba(161,161,170,1)` | Footer labels, captions |
| `--sub` | `rgba(102,102,107,1)` | Hero subtext |
| `--navy` | `rgba(0,34,83,1)` | "Watch video" button text |
| `--line` | `rgba(228,228,231,1)` | Borders, dividers |

### Layout

| Token | Value |
|---|---|
| `--max` | `1440px` |
| `--pad` | `80px` (desktop) / `40px` (≤1200px) / `20px` (≤768px) |

### Background Images (Assets)

| File | Usage |
|---|---|
| `node-79.png` | Full-page swirl pattern — `opacity: 0.4`, covers entire page |
| `node-91.png` | Left decorative swirl — `position:absolute; left:-60px; width:340px; opacity:0.4` |
| `node-92.png` | Right decorative swirl — `position:absolute; right:-60px; width:340px; opacity:0.4` |
| `node-80.png` | Hero illustration — African woman + marketplace laptop, `border-radius:19px` |
| `node-120.png` | Community image — Africa map + community silhouettes |
| `node-90.png` | Footer logo — Africa continent map illustration, 68×68px |
| `background-89.png` | Dark section — full baked image, card and side image included |
| `step-1.png` | How it works step 1 — African woman at sunset |
| `step-2.png` | How it works step 2 — Hands with card on laptop |
| `step-3.png` | How it works step 3 — Man browsing marketplace on laptop |
| `step-4.png` | How it works step 4 — Shipping containers |
| `gfinal_1–7.png` | Gallery food photos — person, palm fruit, dried fish, person, grain bowl, groundnuts, person |

### SVG Icons

| File | Usage |
|---|---|
| `vector-74.svg` | Globe icon — navbar language selector, `fill: rgba(193,45,7,1)` |
| `vector-88.svg` | Play icon — "Watch video" button |
| `vector-33.svg` | Twitter/X icon — footer social, `fill: rgba(161,161,170,1)` |
| `vector-37.svg` | Instagram icon — footer social, `fill: rgba(161,161,170,1)` |
| `vector-41.svg` | LinkedIn icon — footer social, `fill: rgba(161,161,170,1)` |

---

## Page Structure

```
1. Navbar
2. Hero
3. How It Works
4. Dark Section — "Before you go" (baked image)
5. Social Proof + Gallery
6. Community
7. Footer
```

---

## Section 1 — Navbar

**Height**: `52px`
**Background**: `rgba(255,255,255,0.8)` + `backdrop-filter: blur(10px)`
**Border bottom**: `1px solid var(--line)`
**Position**: `sticky; top:0; z-index:100`
**Layout**: `max-width:1440px` centered, flex between — links left, actions right

### Nav Links (left)

| Label | Style |
|---|---|
| Shops | `font-size:16px; font-weight:500; color:var(--pr)` |
| Sellers | same |
| How it works | same |
| Pricing | same |

Gap between links: `36px`

### Nav Right

- **Globe + English**: `vector-74.svg` + "English" — `font-size:15.5px; font-weight:500; color:var(--pr); gap:5px`
- **Login**: `font-size:15.9px; font-weight:500; color:var(--pr)`
- **Start for free**: `background:var(--pr); color:#fff; padding:10px 20px; border-radius:24px; font-size:15.9px; font-weight:500; border:1px solid transparent`

---

## Section 2 — Hero

**Padding**: `80px var(--pad) 100px`
**Layout**: flex row, `gap:60px; align-items:center`
**Background**: white + `node-79.png` swirl at `opacity:0.4` + `node-91/92` side decorators

### Left Column (`flex:0 0 42%; max-width:42%`)

**H1**:
> Authentic African Food, Delivered Anywhere

`font-size:54.8px; font-weight:400; letter-spacing:-1.2px; line-height:60px; color:var(--pr); margin-bottom:20px`

**Body**:
> Shop your favorite African groceries, pay securely, and track your delivery in real time. We deliver the best in real time

`font-size:17.3px; font-weight:500; line-height:27px; color:var(--sub); max-width:340px; margin-bottom:36px`

**CTAs** (flex, `gap:16px`):

**"Start for free"**:
`background:var(--pr); color:#fff; padding:12px 24px; border-radius:24px; font-size:18px; font-weight:700; line-height:21.6px; border:1px solid transparent`

**"Watch video"**:
`background:#fff; border:1px solid rgba(208,230,254,1); border-radius:24px; padding:10px 18px; box-shadow:0 2px 4px rgba(0,0,0,0.5)`
Text: `font-size:17.7px; font-weight:700; line-height:21.6px; color:var(--navy)`
Icon: `vector-88.svg` at `12×14px`

### Right Column (`flex:1`)

`node-80.png` — `width:100%; border-radius:19px`

---

## Section 3 — How It Works

**Padding**: `80px var(--pad)`
**Text align**: center
**Background**: white + side swirls

**Label**:
> How it works

`font-size:32px; font-weight:700; color:var(--pr); line-height:1.2; margin-bottom:6px`

**Subtitle**:
> We offer the best experience for authentic African products

`font-size:13px; color:var(--body); line-height:1.5; margin-bottom:40px`

### Steps Grid

`grid-template-columns:repeat(4,1fr); gap:20px; text-align:left`

Each step structure:
```
img     width:100%; border-radius:10px; aspect-ratio:4/3; object-fit:cover; margin-bottom:12px
title   font-size:14px; font-weight:600; color:var(--ink); margin-bottom:3px
body    font-size:12.5px; color:var(--body); line-height:1.5
```

| # | Image | Title | Body |
|---|---|---|---|
| 1 | `step-1.png` | Discover | Browse authentic African products |
| 2 | `step-2.png` | Order & Pay | Fast checkout with secure payments |
| 3 | `step-3.png` | Track Live | See your order in real-time. |
| 4 | `step-4.png` | Receive | Delivered fresh to your doorstep |

---

## Section 4 — Dark Section ("Before you go")

**Implementation**: Single `<img>` tag — `width:100%; height:auto; display:block`
**Wrapper**: `background:#000; line-height:0`
**Asset**: `background-89.png` (2035×752px)
**No HTML overlay** — the white card, three feature rows, and woman image are all baked into the asset.

### Baked content (for reference/rebuild only)

**White card** (centered overlay):
- Title: "Before you go!" — `font-size:20px; font-weight:700`
- Sub: "We don't want to leave you with questions hanging — here's a few that people often ask..."

| Icon | Title | Subtitle |
|---|---|---|
| Shopping bag | Find products you love | Choose from a wide varieties |
| Document | Book at your convenience | Seamless experience for your need |
| Box | Get products delivered | Track your products anywhere |

**Side image**: Woman smiling, opening delivery box with Africa map branding (warm orange illustration)

---

## Section 5 — Social Proof + Gallery

### Text Block

**Padding**: `72px var(--pad) 32px`

**Headline**:
> Used by Africans in diaspora just like you to order products in Africa.

`font-size:44px; font-weight:400; color:var(--ink); line-height:1.15; max-width:480px`

### Gallery Strip

**Grid**: `grid-template-columns:repeat(7,1fr); gap:0; width:100%`
**Full bleed** — no side padding, no margin, no border-radius on cells
**Cell**: `aspect-ratio:1; overflow:hidden`
**Image**: `width:100%; height:100%; object-fit:cover; display:block`
**Hover**: `transform:scale(1.03)` (transition 0.3s)

| Cell | Asset | Content |
|---|---|---|
| 1 | `gfinal_1.png` | Person (partial left) |
| 2 | `gfinal_2.png` | Palm fruit / tomatoes |
| 3 | `gfinal_3.png` | Dried fish hanging |
| 4 | `gfinal_4.png` | Person / video still |
| 5 | `gfinal_5.png` | White grain in clay bowl |
| 6 | `gfinal_6.png` | Groundnuts / beans |
| 7 | `gfinal_7.png` | Person (partial right) |

---

## Section 6 — Community

**Padding**: `80px var(--pad)`
**Grid**: `grid-template-columns:42% 1fr; gap:72px; align-items:center`
**Background**: white + side swirls

### Left Column — Image + Dots

**Image box**: `background:rgba(250,250,250,1); border-radius:12px; overflow:hidden`
**Image**: `node-120.png` — `width:100%; border-radius:19px`

**Carousel dots** (below image, flex center, `gap:6px`):
- 5 dots total, dot 3 active
- Inactive: `width:8px; height:8px; border-radius:99px; background:rgba(24,24,27,0.2)`
- Active: `width:20px; background:rgba(24,24,27,1)`
- On click: update active state via JS

**Counter**: "3 / 4" — `font-size:13.3px; line-height:21px; color:var(--ink); text-align:center; margin-top:8px`

### Right Column — Text

**Label**:
> Our Community

`font-size:46.1px; font-weight:400; letter-spacing:-1.08px; line-height:57.6px; color:var(--pr); margin-bottom:12px`

**Subheading**:
> We love to connect you to the source

`font-size:17.4px; font-weight:400; letter-spacing:-0.15px; line-height:27px; color:var(--ink); margin-bottom:18px`

**Bullet list** (no list-style, `margin-bottom:32px`):
Each item: `font-size:17.3px; font-weight:400; letter-spacing:-0.15px; line-height:27px; color:var(--body)` with `•` prefix

- Browse thousands of authentic products
- Shop with confidence
- Feel connected
- Every seller is identity-verified
- Secure checkout with full buyer protection
- Track your order from the artisan's hands to your front door.

**CTA — "Get started"**:
`background:rgba(17,17,17,1); color:#fff; padding:14px 56px; border-radius:999px; font-size:15.3px; font-weight:400; line-height:22.4px; border:1px solid transparent`

---

## Section 7 — Footer

**Top border**: `1px solid var(--line)`
**Padding top**: `52px`

### Footer Grid

`grid-template-columns:220px 1fr 1fr 1fr 1fr; gap:48px; align-items:start`
`max-width:1440px; margin:0 auto; padding:0 var(--pad) 48px`

### Column 1 — Newsletter + Logo

**Text**:
> **Not sure where to start?** Sign up to receive our newsletter. a free guide to getting cheaper African products delivered to your doorstep.

`font-size:13.2px; line-height:19.6px; color:var(--body); margin-bottom:14px`

**Email form** (flex, `gap:8px; width:100%`):
- Input: `flex:1; min-width:0; height:38px; border:1px solid rgba(204,204,204,1); border-radius:99px; padding:0 14px; font-size:13.5px` — placeholder: "Your email"
- Button: "Sign up" — `flex-shrink:0; height:38px; padding:0 16px; background:var(--pr); color:#fff; border-radius:99px; font-size:14px`

**Logo**: `node-90.png` — `width:68px; height:68px; border-radius:10px; margin-top:24px`

### Column 2 — Shop / Marketplace

Label: `font-size:15.5px; font-weight:400; color:var(--muted); margin-bottom:8px`
Links: Browse Products · Categories · New Arrivals · Best Sellers · Pricing / Commission · Vendor Support · Deals / Discounts

### Column 3 — Company

Links: About Us · Our Story · Careers · Contact Us · Blog · FAQs

### Column 4 — Vendors + Connect

**Vendors**: Become a Vendor · Vendor Dashboard Login · Seller Guidelines

**Connect** (`margin-top:18px`):
- `vector-33.svg` — Twitter / X
- `vector-37.svg` — Instagram
- `vector-41.svg` — LinkedIn

Link style: `font-size:15px; font-weight:400; line-height:22.4px; color:var(--ink); display:flex; align-items:center; gap:7px`

### Column 5 — Support

Links: Delivery Information · Delivery Areas · Track Your Order · Help Center · FAQs · Contact Us · Live Chat · Returns & Refunds · Terms & Conditions

### Footer Bottom

`border-top:1px solid var(--line); padding:12px var(--pad); display:flex; gap:20px`
Links: Terms · Privacy policy — `font-size:13.2px; color:var(--muted)`

---

## Responsive Breakpoints

| Breakpoint | Changes |
|---|---|
| `≤1200px` | `--pad:40px`; steps → 2-col; gallery → 4-col; community → 1-col stacked; footer → 2-col |
| `≤768px` | `--pad:20px`; nav links hidden; hero stacks vertically; headline 34px/40px; gallery → 3-col; side swirls hidden |
| `≤480px` | Hero headline 28px/34px; steps → 1-col; gallery → 2-col; community label 32px/40px |

---

## JavaScript

**Carousel dots** (community section):
```javascript
document.querySelectorAll('.comm-dot').forEach(function(d, i, all) {
  d.addEventListener('click', function() {
    all.forEach(function(x) { x.classList.remove('on'); x.style.width = '8px'; });
    d.classList.add('on');
    d.style.width = '20px';
  });
});
```

---

## Full Copy Inventory

### Navbar
Shops · Sellers · How it works · Pricing · English · Login · Start for free

### Hero
- **H1**: Authentic African Food, Delivered Anywhere
- **Body**: Shop your favorite African groceries, pay securely, and track your delivery in real time. We deliver the best in real time
- **CTA 1**: Start for free
- **CTA 2**: Watch video

### How It Works
- **Label**: How it works
- **Sub**: We offer the best experience for authentic African products
- Discover — Browse authentic African products
- Order & Pay — Fast checkout with secure payments
- Track Live — See your order in real-time.
- Receive — Delivered fresh to your doorstep

### Dark Section
- **Title**: Before you go!
- **Sub**: We don't want to leave you with questions hanging — here's a few that people often ask...
- Find products you love — Choose from a wide varieties
- Book at your convenience — Seamless experience for your need
- Get products delivered — Track your products anywhere

### Social Proof
- Used by Africans in diaspora just like you to order products in Africa.

### Community
- **Label**: Our Community
- **Sub**: We love to connect you to the source
- Browse thousands of authentic products · Shop with confidence · Feel connected
- Every seller is identity-verified · Secure checkout with full buyer protection
- Track your order from the artisan's hands to your front door.
- **CTA**: Get started

### Footer
- Not sure where to start? Sign up to receive our newsletter. a free guide to getting cheaper African products delivered to your doorstep.
- **Button**: Sign up
- *(see column breakdown above for all link text)*

### Footer Bottom
Terms · Privacy policy

---

## What This File Does NOT Cover

The following are in role-specific dashboard files:

| File | Covers |
|---|---|
| `ui-context.md` | Shared design system, tokens, components |
| `user.md` | Customer shopping dashboard |
| `seller.md` | Seller management dashboard |
| `admin.md` | Platform admin dashboard |
