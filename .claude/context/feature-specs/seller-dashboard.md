# Feature: Seller Dashboard

## Prisma Mapping

Uses:
- Order
- Product

---

## API Routes

### GET /api/seller/dashboard

Response:
{
  revenue,
  orders,
  topProducts
}

Logic:
- Aggregate orders where sellerId = user.id

# Feature: Seller Dashboard

## Prisma Mapping

Uses:
- Order
- Product

---

## API Routes

### GET /api/seller/dashboard

Response:
{
  revenue,
  orders,
  topProducts
}

Logic:
- Aggregate orders where sellerId = user.id

---

## Notes
- Use GROUP BY queries
- Cache heavy queries
---

## Notes
- Use GROUP BY queries
- Cache heavy queries