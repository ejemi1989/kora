Overview

This document defines the Prisma architecture for the African marketplace system.

It includes:

Core marketplace models (users, products, orders, payments)
Project + collaboration models
Prisma client setup
Migration workflow
Indexing and constraints

Design principles:

Minimal but extensible
Strong relational integrity
Production-safe defaults
Optimized for scaling
Enums
enum Role {
  ADMIN
  SELLER
  CUSTOMER
}

enum OrderStatus {
  PENDING
  PROCESSING
  SHIPPED
  DELIVERED
  CANCELLED
}

enum PaymentStatus {
  PENDING
  SUCCESS
  FAILED
}

enum ProjectStatus {
  DRAFT
  ARCHIVED
}
User

Represents all platform users.

model User {
  id          String   @id @default(uuid())
  email       String   @unique
  password    String
  role        Role     @default(CUSTOMER)
  name        String?

  createdAt   DateTime @default(now())
  updatedAt   DateTime @updatedAt

  products    Product[]
  orders      Order[]
  addresses   Address[]
  cart        Cart?
}

Indexes:

unique email
Address
model Address {
  id        String   @id @default(uuid())
  userId    String
  line1     String
  city      String
  country   String
  postal    String

  user      User     @relation(fields: [userId], references: [id])

  @@index([userId])
}
Product

Seller-owned product listings.

model Product {
  id          String   @id @default(uuid())
  name        String
  description String
  price       Float
  stock       Int

  sellerId    String
  createdAt   DateTime @default(now())

  seller      User     @relation(fields: [sellerId], references: [id])
  orderItems  OrderItem[]

  @@index([sellerId])
}
Cart

1:1 with user.

model Cart {
  id        String   @id @default(uuid())
  userId    String   @unique

  user      User     @relation(fields: [userId], references: [id])
  items     CartItem[]
}
model CartItem {
  id        String   @id @default(uuid())
  cartId    String
  productId String
  quantity  Int

  cart      Cart     @relation(fields: [cartId], references: [id])
  product   Product  @relation(fields: [productId], references: [id])

  @@index([cartId])
}
Order

Tracks full lifecycle and delivery.

model Order {
  id          String        @id @default(uuid())
  userId      String
  status      OrderStatus   @default(PENDING)
  total       Float
  trackingNo  String?

  createdAt   DateTime      @default(now())

  user        User          @relation(fields: [userId], references: [id])
  items       OrderItem[]
  payment     Payment?

  @@index([userId])
}
model OrderItem {
  id        String   @id @default(uuid())
  orderId   String
  productId String
  quantity  Int
  price     Float

  order     Order    @relation(fields: [orderId], references: [id])
  product   Product  @relation(fields: [productId], references: [id])

  @@index([orderId])
}
Payment

Stripe-backed payment record.

model Payment {
  id          String        @id @default(uuid())
  orderId     String        @unique
  amount      Float
  status      PaymentStatus
  stripeId    String?

  createdAt   DateTime      @default(now())

  order       Order         @relation(fields: [orderId], references: [id])
}
Project (Collaboration Layer)
model Project {
  id              String   @id @default(uuid())
  ownerId         String
  name            String
  description     String?
  status          ProjectStatus @default(DRAFT)
  canvasJsonPath  String?

  createdAt       DateTime @default(now())
  updatedAt       DateTime @updatedAt

  collaborators   ProjectCollaborator[]

  @@index([ownerId])
  @@index([createdAt])
}
ProjectCollaborator
model ProjectCollaborator {
  id          String   @id @default(uuid())
  projectId   String
  email       String

  createdAt   DateTime @default(now())

  project     Project  @relation(
    fields: [projectId],
    references: [id],
    onDelete: Cascade
  )

  @@unique([projectId, email])
  @@index([email])
  @@index([projectId, createdAt])
}
Prisma Client
File: lib/prisma.ts
import { PrismaClient } from "@prisma/client"
import { PrismaPg } from "@prisma/adapter-pg"

const globalForPrisma = global as unknown as {
  prisma: PrismaClient | undefined
}

function createPrismaClient() {
  const url = process.env.DATABASE_URL || ""

  // Prisma Accelerate
  if (url.startsWith("prisma+postgres://")) {
    return new PrismaClient()
  }

  // Direct PostgreSQL
  const adapter = new PrismaPg({
    connectionString: url,
  })

  return new PrismaClient({
    adapter,
  })
}

export const prisma =
  globalForPrisma.prisma ?? createPrismaClient()

if (process.env.NODE_ENV !== "production") {
  globalForPrisma.prisma = prisma
}
Migration
npx prisma migrate dev --name init
npx prisma generate
Dependencies
prisma
@prisma/client
@prisma/adapter-pg
pg
Validation Checklist
Schema
Users, Products, Orders, Payments exist
Project + Collaborator exist
Relations correctly defined
Cascade delete applied
Unique constraints enforced
Indexing
User.email unique
sellerId indexed
orderId indexed
projectId + email unique
Prisma Client
Singleton pattern
Environment-based connection
Dev caching enabled
Build
Migration runs successfully
Client generates
npm run build passes
Design Notes
Order stores tracking number for delivery tracking
OrderItem snapshots price at purchase
Cart is 1:1 with user
Payment confirmed via Stripe webhook
Project system is isolated but extendable
Future Extensions
Reviews & ratings
Seller payouts (Stripe Connect)
Multi-currency pricing
Inventory per warehouse
Audit logs & soft deletes
Real-time collaboration (WebSockets)