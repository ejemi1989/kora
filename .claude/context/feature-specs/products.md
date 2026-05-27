# Products Feature

## Goal
Enable sellers to create, manage, and publish African food products while allowing customers to browse and view listings.

## Design

- Clean grid layout for marketplace
- No heavy UI — focus on product clarity
- Use existing design tokens (no hardcoded colors)
- Image-first layout with clear pricing and availability

---

## Roles

- SELLER → create/manage products
- CUSTOMER → browse/view products
- ADMIN → delete or moderate products

---

## Implementation

### Data Ownership

- Product belongs to a SELLER
- Managed via Prisma

---

### Product Fields

- name
- description
- price
- stock
- images
- category
- sellerId

---

## APIs

GET /api/products  
GET /api/products/:id  
POST /api/products  
PATCH /api/products/:id  
DELETE /api/products/:id  

---

## Flow

Seller creates product →  
Product stored in DB →  
Visible in marketplace →  
Customer browses →  
Customer views product detail

---

## Status

- ACTIVE
- OUT_OF_STOCK
- ARCHIVED

---

## Edge Cases

- Seller edits another seller’s product → reject
- Invalid price or stock → validation error
- Missing images → reject
- Product deleted while in cart → handled at checkout

---

## Dependencies

- Prisma
- PostgreSQL

---

## Check When Done

- Only sellers can create/edit products
- Products visible in marketplace
- Validation enforced
- Unauthorized access blocked