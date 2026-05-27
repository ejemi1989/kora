# Admin Feature

## Goal
Provide centralized control over users, products, and orders.

## Design

- Clean dashboard
- Table-based UI
- Minimal controls

---

## Roles

- ADMIN only

---

## Implementation

- Role-based access enforced via backend

---

## APIs

GET /api/admin/users  
PATCH /api/admin/users/:id  
GET /api/admin/orders  
PATCH /api/admin/orders/:id  
DELETE /api/admin/products/:id  

---

## Flow

Admin logs in →  
Views dashboard →  
Manages users/products/orders →  
Updates tracking

---

## Status

- ACTIVE
- SUSPENDED

---

## Edge Cases

- Unauthorized access → block
- Invalid updates → reject
- Deleting active product → handle safely

---

## Dependencies

- All modules

---

## Check When Done

- Admin-only routes enforced
- Data updates correctly