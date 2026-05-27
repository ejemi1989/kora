# Orders Feature

## Goal
Handle complete order lifecycle including tracking and fulfillment across sellers and admin.

## Design

- Simple status timeline UI
- Clear tracking visibility
- No complex animations

---

## Roles

- CUSTOMER → view orders
- SELLER → fulfill orders
- ADMIN → manage and update tracking

---

## Implementation

### Core Fields

- userId
- items
- totalAmount
- status
- trackingNumber
- sellerId

---

## APIs

POST /api/orders  
GET /api/orders  
GET /api/orders/:id  
PATCH /api/orders/:id/status  
POST /api/orders/:id/tracking  

---

## Flow

Checkout →  
Order created →  
Payment confirmed →  
Seller processes order →  
Admin/seller adds tracking →  
Customer tracks →  
Order delivered

---

## Status

- PENDING
- PAID
- PROCESSING
- SHIPPED
- IN_TRANSIT
- DELIVERED
- CANCELLED

---

## Edge Cases

- Payment success but order not saved → retry safely
- Invalid tracking number → reject
- Seller delays → admin override
- Duplicate orders → idempotent logic

---

## Dependencies

- Payments module
- Users module

---
# Feature: Orders

## Prisma Mapping

model Order {
  id        String   @id @default(uuid())
  userId    String
  status    OrderStatus
  total     Float
  items     OrderItem[]
}

model OrderItem {
  id        String @id @default(uuid())
  orderId   String
  productId String
  quantity  Int
  price     Float
}

enum OrderStatus {
  PENDING
  PAID
  SHIPPED
  DELIVERED
  CANCELLED
}

---

## API Routes

### POST /api/orders
- Create order from cart

---

### GET /api/orders
- List user orders

---

### GET /api/orders/:id

---

### PATCH /api/orders/:id/status
(Admin/Seller)

---

## Notes
- Price stored at purchase time
## Check When Done

- Orders created only after payment
- Status updates correctly
- Tracking visible to customer