# 🧠 Unified System Flow — Orders + Payments + Notifications

## 🧱 Overview

This document defines the **end-to-end transaction flow** for a marketplace system integrating:

* Orders
* Stripe Payments
* Notifications

The architecture is:

* Event-driven
* Role-based (buyer, seller, admin)
* Service-oriented
* Scalable and production-ready

---

## 🔒 Core Invariants

* An order MUST exist before payment is initiated
* Each order MUST map to one payment intent
* Payment success MUST be confirmed via webhook (not frontend)
* Notifications MUST be triggered from backend events only
* Order state MUST reflect payment state at all times
* No UI component directly calls Stripe or database

---

## ⚡ High-Level Flow

```id="flow_main"
Buyer selects products
        ↓
Creates Order (status: PENDING)
        ↓
Creates Payment Intent (Stripe)
        ↓
Buyer completes payment (Stripe UI)
        ↓
Stripe Webhook triggers
        ↓
Payment confirmed
        ↓
Order updated (PAID)
        ↓
Notifications sent
        ↓
UI updates
```

---

## 🧩 Step-by-Step Flow

---

### 🛒 1. Order Creation

```id="flow_order"
Buyer clicks "Place Order"
        ↓
Backend:
- Create Order (PENDING)
- Store items, amount, buyerId, sellerId
```

---

### 💳 2. Payment Intent Creation

```id="flow_payment_intent"
Frontend → POST /api/payments/create-intent
        ↓
Backend:
- Fetch order
- Create Stripe PaymentIntent
- Attach metadata (orderId)
        ↓
Return client_secret
```

---

### 🖥️ 3. Payment UI (Frontend)

```id="flow_ui"
Stripe Elements renders payment form
        ↓
User enters card details
        ↓
Stripe confirms payment
```

---

### 🔔 4. Webhook (CRITICAL SOURCE OF TRUTH)

```id="flow_webhook"
Stripe → webhook event (payment_intent.succeeded)
        ↓
Backend verifies signature
        ↓
Extract orderId from metadata
```

---

### 🔄 5. System Update

```id="flow_update"
Update Payment:
- status = SUCCEEDED

Update Order:
- paymentStatus = PAID
- orderStatus = PROCESSING
```

---

### 🔔 6. Notification Triggers

```id="flow_notifications"
Trigger notifications:

Buyer:
- "Payment successful"
- "Order confirmed"

Seller:
- "New order received"

Admin:
- Optional transaction log
```

---

### 🚚 7. Fulfillment Flow

```id="flow_fulfillment"
Seller processes order
        ↓
Marks as shipped
        ↓
Buyer receives:
- "Order shipped"
- "Tracking update"
```

---

## 🗂️ Data Relationships

```id="flow_data"
User → Order → Payment → Notification
```

---

## 🧩 Data Models

---

### Order

```id="model_order"
Order {
  id: string
  buyerId: string
  sellerId: string

  totalAmount: number

  orderStatus: "PENDING" | "PROCESSING" | "SHIPPED" | "DELIVERED"
  paymentStatus: "PENDING" | "PAID" | "FAILED"

  createdAt: Date
}
```

---

### Payment

```id="model_payment"
Payment {
  id: string
  orderId: string

  stripePaymentIntentId: string

  amount: number
  status: "INITIATED" | "SUCCEEDED" | "FAILED"

  createdAt: Date
}
```

---

### Notification

```id="model_notification"
Notification {
  id: string
  userId: string
  role: "buyer" | "seller" | "admin"

  title: string
  message: string
  link: string

  isRead: boolean
  createdAt: Date
}
```

---

## 🔁 Services Layer

---

### Order Service

```id="svc_order"
/lib/services/order.ts
```

* createOrder()
* updateOrderStatus()

---

### Payment Service

```id="svc_payment"
/lib/services/payment.ts
```

* createPaymentIntent()
* handleWebhook()

---

### Notification Service

```id="svc_notification"
/lib/services/notification.ts
```

* createNotification()
* getUserNotifications()

---

## 🔗 Event System

---

### Events

* ORDER_CREATED
* PAYMENT_SUCCEEDED
* ORDER_SHIPPED

---

### Example Flow

```id="flow_event"
ORDER_CREATED
        ↓
create payment intent

PAYMENT_SUCCEEDED
        ↓
update order
        ↓
trigger notifications
```

---

## 📁 File Structure

```id="files_structure"
/app/api/
  payments/
    create-intent/route.ts
  webhooks/
    stripe/route.ts

/lib/services/
  order.ts
  payment.ts
  notification.ts

/lib/events/
  order.ts
  payment.ts

/components/
  features/payment/
  ui/notification/
```

---

## 🔐 Security Rules

* Validate Stripe webhook signature
* Never trust frontend payment result
* Prevent duplicate webhook processing
* Use idempotency keys

---

## ⚠️ Failure Handling

---

### Payment Failed

```id="flow_failure"
Payment fails
        ↓
Update order (FAILED)
        ↓
Notify buyer
        ↓
Allow retry
```

---

### Webhook Retry

* Stripe retries automatically
* System must handle duplicates safely

---

## 🔄 Refund Flow

```id="flow_refund"
Admin triggers refund
        ↓
Stripe refund API
        ↓
Update payment (REFUNDED)
        ↓
Notify buyer
```

---

## 🎨 UI Responsibilities

---

### Buyer

* Checkout page
* Payment success page
* Order tracking

---

### Seller

* Orders dashboard
* Fulfillment actions

---

### Admin

* Transaction monitoring
* Refund management

---

## 🚀 End-to-End Example

```id="flow_full"
Buyer places order
        ↓
Order created (PENDING)
        ↓
Payment intent created
        ↓
Buyer pays
        ↓
Webhook confirms payment
        ↓
Order marked PAID
        ↓
Notifications sent
        ↓
Seller fulfills order
        ↓
Order delivered
```

---

## 🔥 Future Enhancements

* Escrow system
* Split payments per item
* Multi-vendor checkout
* Fraud detection
* Real-time tracking

---

## ✅ Summary

This system ensures:

* Secure payments via Stripe
* Reliable order lifecycle
* Real-time user feedback via notifications
* Clean, scalable architecture

It mirrors production-grade systems used by modern marketplaces.
