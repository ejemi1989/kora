# Payments Feature

## Goal
Handle secure payments using Stripe and confirm orders reliably.

## Design

- No custom payment UI
- Use Stripe hosted checkout

---

## Roles

- CUSTOMER → pay
- ADMIN → monitor payments

---

## Implementation

- Stripe Checkout Session
- Webhook-based confirmation

---

## APIs

POST /api/checkout  
POST /api/webhooks/stripe  

---

## Flow

Customer clicks checkout →  
Stripe session created →  
User pays →  
Stripe webhook fires →  
Order marked PAID

---

## Status

- INITIATED
- SUCCESS
- FAILED
- REFUNDED

---

## Edge Cases

- Webhook delay → retry
- Duplicate webhook → idempotent handling
- Payment succeeds but DB fails → reconcile

---

## Dependencies

- Stripe

---

## Check When Done

- Payment triggers order creation
- Webhooks handled correctly
- No duplicate orders

# Feature: Payments

## Prisma Mapping

model Payment {
  id        String   @id @default(uuid())
  orderId   String   @unique
  amount    Float
  status    PaymentStatus
  stripeId  String?
}

enum PaymentStatus {
  PENDING
  SUCCESS
  FAILED
}

---

## API Routes

### POST /api/payments/create-intent
- Calls Stripe API
- Returns client secret

---

### POST /api/webhooks/stripe

Logic:
1. Verify signature
2. Update Payment
3. Update Order

---

## Notes
- Webhooks are source of truth
