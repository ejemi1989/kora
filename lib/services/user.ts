import { clerkClient } from "@clerk/nextjs/server";
import { prisma } from "@/lib/prisma";

export async function ensureDbUser(userId: string) {
  // 1. Check if user already exists in DB with this Clerk ID
  let dbUser = await prisma.user.findUnique({ where: { id: userId } });
  if (dbUser) return dbUser;

  // 2. If not, fetch details from Clerk to sync
  try {
    const client = await clerkClient();
    const clerkUser = await client.users.getUser(userId);
    const email = clerkUser.emailAddresses?.[0]?.emailAddress;

    if (email) {
      // Check if a user with this email exists in DB (e.g. from seed data)
      dbUser = await prisma.user.findUnique({ where: { email } });
      if (dbUser) {
        // Update the existing user's ID to match the Clerk ID
        // (Cascading referential actions will update related tables automatically)
        dbUser = await prisma.user.update({
          where: { email },
          data: { id: userId },
        });
      } else {
        // Create new user in DB
        dbUser = await prisma.user.create({
          data: {
            id: userId,
            email,
            name: `${clerkUser.firstName || ""} ${clerkUser.lastName || ""}`.trim() || "User",
            role: (clerkUser.unsafeMetadata?.role as string) || "CUSTOMER",
          },
        });
      }
    }
  } catch (error) {
    console.error("Failed to sync Clerk user with DB:", error);
  }

  return dbUser;
}
