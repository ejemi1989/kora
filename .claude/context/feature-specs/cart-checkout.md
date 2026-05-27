# Feature: Cart & Checkout

## Prisma Mapping

model Cart {
  id     String   @id @default(uuid())
  userId String   @unique
  items  CartItem[]
}

model CartItem {
  id        String  @id @default(uuid())
  cartId    String
  productId String
  quantity  Int
}

---

## API Routes

### GET /api/cart
- Fetch user cart

---

### POST /api/cart/add
Request:
{
  productId,
  quantity
}

Logic:
1. Validate product
2. Add/update item

---

### POST /api/cart/remove

---

### POST /api/checkout

Flow:
1. Validate cart
2. Create Order
3. Lock inventory
4. Call payment API

---

## Notes
- Cart tied to user (1:1)

# Feature: Cart & Checkout

## Prisma Mapping

model Cart {
  id     String   @id @default(uuid())
  userId String   @unique
  items  CartItem[]
}

model CartItem {
  id        String  @id @default(uuid())
  cartId    String
  productId String
  quantity  Int
}

---

## API Routes

### GET /api/cart
- Fetch user cart

---

### POST /api/cart/add
Request:
{
  productId,
  quantity
}

Logic:
1. Validate product
2. Add/update item

---

### POST /api/cart/remove

---

### POST /api/checkout

Flow:
1. Validate cart
2. Create Order
3. Lock inventory
4. Call payment API

---

## Notes
- Cart tied to user (1:1)