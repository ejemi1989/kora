import { auth } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { serverError, notFound } from "@/lib/validation";

export async function GET(
  _request: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    const { userId } = await auth();
    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { id } = await params;

    const order = await prisma.order.findUnique({
      where: { id },
      select: { userId: true },
    });

    if (!order || order.userId !== userId) {
      return notFound("Order not found");
    }

    const tracking = await prisma.trackingEvent.findMany({
      where: { orderId: id },
      orderBy: { step: "asc" },
    });

    return NextResponse.json({ tracking });
  } catch {
    return serverError("Failed to fetch tracking");
  }
}
