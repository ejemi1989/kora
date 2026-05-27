# Feature: Reviews

## Prisma Mapping

model Review {
  id        String @id @default(uuid())
  userId    String
  productId String
  rating    Int
  comment   String
}

---

## API Routes

### POST /api/reviews

### GET /api/products/:id/reviews

---

## Notes
- Only verified buyers can review