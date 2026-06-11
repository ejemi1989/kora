import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { serverError } from "@/lib/validation";

export async function GET() {
  try {
    const users = await prisma.user.findMany({
      orderBy: { createdAt: "desc" },
      include: { _count: { select: { orders: true } } },
    });
    const data = users.map((u) => ({
      id: u.id,
      name: u.name,
      email: u.email,
      location: "",
      joined: u.createdAt.toISOString().split("T")[0],
      orders: u._count.orders,
      status: (u.role === "BANNED" ? "banned" : u.role === "SUSPENDED" ? "suspended" : u.role === "PENDING" ? "pending" : "active") as "active" | "suspended" | "banned" | "pending",
    }));
    return NextResponse.json(data);
  } catch {
    return serverError("Failed to fetch users");
  }
}

export async function PATCH(req: Request) {
  try {
    const { id, status, emailVerified } = await req.json();
    const data: Record<string, unknown> = {};
    if (status) data.status = status;
    if (emailVerified !== undefined) data.emailVerified = emailVerified;
    await prisma.user.update({ where: { id }, data });
    return NextResponse.json({ success: true });
  } catch {
    return serverError("Failed to update user");
  }
}
