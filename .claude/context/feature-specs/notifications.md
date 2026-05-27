# Notifications Feature

## Goal
Notify users about key events such as order updates and payments.

## Design

- Lightweight
- Non-intrusive

---

## Roles

- CUSTOMER
- SELLER
- ADMIN

---

## Implementation

- Stored in DB
- Optional email integration later

---

## APIs

GET /api/notifications  
POST /api/notifications  

---

## Flow

Event occurs →  
Notification created →  
User sees update

---

## Status

- SENT
- READ

---

## Edge Cases

- Duplicate notifications → dedupe
- Failed delivery → retry

---

## Dependencies

- Orders
- Payments


# Feature: Notifications

## Prisma Mapping

model Notification {
  id      String @id @default(uuid())
  userId  String
  type    String
  message String
  read    Boolean @default(false)
}

---

## API Routes

### GET /api/notifications

### POST /api/notifications

---

## Notes
- Use queue for async sending
---

## Check When Done

- Notifications created on events
- User can view/read