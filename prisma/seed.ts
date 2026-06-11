import { PrismaClient } from "../lib/generated/prisma/client";

const prisma = new PrismaClient();

async function main() {
  await prisma.user.upsert({
    where: { email: "buyer@deni.com" },
    update: {},
    create: { id: "user-1", name: "Amara Okafor", email: "buyer@deni.com", role: "CUSTOMER" },
  });

  await prisma.user.upsert({
    where: { email: "seller@deni.com" },
    update: {},
    create: { id: "seller-1", name: "Chidi Okonkwo", email: "seller@deni.com", role: "SELLER" },
  });

  await prisma.user.upsert({
    where: { email: "admin@deni.com" },
    update: {},
    create: { id: "admin-1", name: "Admin User", email: "admin@deni.com", role: "ADMIN" },
  });

  await prisma.address.upsert({
    where: { id: "addr-1" },
    update: {},
    create: { id: "addr-1", userId: "user-1", tag: "Home", name: "Amara Okafor", address: "14 Bode Thomas Street, Surulere, Lagos 101241", phone: "+234 803 456 7890", isDefault: true },
  });

  console.log("Seed complete: 3 users, 1 address");
}

main().catch((e) => { console.error(e); process.exit(1); }).finally(() => prisma.$disconnect());
