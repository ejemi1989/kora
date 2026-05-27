# Tracking Feature

## Goal
Enable real-time visibility of order delivery progress.

## Design

- Simple timeline UI
- Status-based updates

---

## Roles

- CUSTOMER → view tracking
- SELLER → upload tracking
- ADMIN → update tracking

---

## Implementation

- Tracking tied to orderId
- Stored in DB

---

## APIs

GET /api/orders/:id/tracking  
POST /api/orders/:id/tracking  

---

## Flow

Order shipped →  
Tracking added →  
Status updates →  
Customer views progress

---

## Status

- PROCESSING
- SHIPPED
- IN_TRANSIT
- DELIVERED

---

## Edge Cases

- Missing tracking → fallback status
- Invalid tracking number → reject
- Status mismatch → correct via admin

---

## Dependencies

- Orders module

---

## Check When Done

- Tracking visible to customer
- Updates reflect in real-time