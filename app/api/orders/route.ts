import { auth } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { serverError } from "@/lib/validation";

export async function GET() {
  try {
    const { userId } = await auth();
    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const orders = await prisma.order.findMany({
      where: { userId },
      include: {
        items: { include: { product: true } },
        payments: true,
        tracking: { orderBy: { step: "asc" } },
      },
      orderBy: { createdAt: "desc" },
    });

    return NextResponse.json({ orders });
  } catch {
    return serverError("Failed to fetch orders");
  }
}
