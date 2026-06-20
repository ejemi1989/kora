import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { serverError } from "@/lib/validation";
import { clerkClient } from "@clerk/nextjs/server";

export async function GET() {
  try {
    const [dbUsers, client] = await Promise.all([
      prisma.user.findMany({
        orderBy: { createdAt: "desc" },
        include: { _count: { select: { orders: true } } },
      }),
      clerkClient(),
    ]);

    const dbUserMap = new Map(dbUsers.map((u) => [u.id, u]));

    const clerkUsersResponse = await client.users.getUserList({ limit: 500, orderBy: "-created_at" });
    const clerkUsers = clerkUsersResponse.data;

    const merged = clerkUsers.map((cu) => {
      const db = dbUserMap.get(cu.id);
      const dbRole = db?.role;
      const email = cu.emailAddresses[0]?.emailAddress || cu.username || "";
      return {
        id: cu.id,
        name: `${cu.firstName || ""} ${cu.lastName || ""}`.trim() || cu.username || email.split("@")[0],
        email,
        location: "",
        joined: new Date(cu.createdAt).toISOString().split("T")[0],
        orders: db?._count?.orders || 0,
        status: ((role: string | undefined | null) => {
          if (role === "BANNED") return "banned";
          if (role === "SUSPENDED") return "suspended";
          if (role === "PENDING") return "pending";
          return "active";
        })(dbRole || cu.unsafeMetadata?.role as string),
      };
    });

    return NextResponse.json(merged);
  } catch {
    return serverError("Failed to fetch users");
  }
}

export async function PATCH(req: Request) {
  try {
    const { id, status } = await req.json();
    const roleMap: Record<string, string> = {
      banned: "BANNED",
      suspended: "SUSPENDED",
      active: "CUSTOMER",
    };
    const role = roleMap[status];

    await prisma.user.upsert({
      where: { id },
      update: { role: role || undefined },
      create: { id, email: `user-${id.substring(0, 8)}@unknown.com`, name: "Unknown User", role: role || "CUSTOMER" },
    });

    if (role) {
      const client = await clerkClient();
      await client.users.updateUser(id, {
        unsafeMetadata: { role },
      });
    }

    return NextResponse.json({ success: true });
  } catch {
    return serverError("Failed to update user");
  }
}
