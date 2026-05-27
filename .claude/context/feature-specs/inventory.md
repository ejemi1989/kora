# Feature: Inventory

## Prisma Mapping

model Product {
  id     String @id @default(uuid())
  name   String
  stock  Int
}

---

## API Routes

### PATCH /api/products/:id/stock

Logic:
1. Validate seller owns product
2. Update stock

---

## Critical Logic

During checkout:
- Decrement stock
- Use transaction

---

## Notes
- Prevent negative stock