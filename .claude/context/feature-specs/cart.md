# Cart Feature

## Goal
Allow customers to manage items before checkout.

## Design

- Minimal UI
- Clear pricing summary
- Persistent cart (session or DB)

---

## Roles

- CUSTOMER only

---

## Implementation

- Cart tied to userId
- Stored in database

---

## APIs

GET /api/cart  
POST /api/cart/add  
PATCH /api/cart/update  
DELETE /api/cart/remove  

---

## Flow

Customer adds item →  
Cart updates →  
Customer edits quantity →  
Customer proceeds to checkout

---

## Status

- ACTIVE
- ABANDONED

---

## Edge Cases

- Product out of stock → block checkout
- Price changed → revalidate before checkout
- Duplicate items → merge quantities

---

## Dependencies

- Prisma
- Products module

---

## Check When Done

- Cart persists correctly
- Quantity updates work
- Checkout validation enforced