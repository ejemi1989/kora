# Feature: Payouts

## Prisma Mapping

model Payout {
  id       String @id @default(uuid())
  sellerId String
  amount   Float
  status   String
}

---

## API Routes

### POST /api/payouts

Logic:
1. Calculate seller balance
2. Trigger Stripe payout

---

## Notes
- Use Stripe Connect