import { NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";
import { prisma } from "@/lib/prisma";
import { serverError } from "@/lib/validation";

export async function GET() {
  try {
    const { userId } = await auth();
    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const products = await prisma.product.findMany({
      where: { sellerId: userId },
      select: { id: true, price: true },
    });

    const productIds = products.map((p) => p.id);

    if (productIds.length === 0) {
      return NextResponse.json({
        totalEarnings: 0,
        available: 0,
        pendingClearance: 0,
        thisMonth: 0,
        payoutHistory: [],
      });
    }

    const orderItems = await prisma.orderItem.findMany({
      where: { productId: { in: productIds } },
      include: { order: { select: { id: true, status: true, createdAt: true } } },
    });

    const confirmedItems = orderItems.filter(
      (oi) => oi.order.status !== "CANCELLED"
    );

    const totalEarnings = confirmedItems.reduce(
      (sum, oi) => sum + oi.price * oi.quantity,
      0
    );

    const payouts = await prisma.payout.findMany({
      where: { sellerId: userId },
      orderBy: { createdAt: "desc" },
    });

    const paidOut = payouts
      .filter((p) => p.status === "COMPLETED")
      .reduce((sum, p) => sum + p.amount, 0);

    const pendingClearance = payouts
      .filter((p) => p.status === "PENDING")
      .reduce((sum, p) => sum + p.amount, 0);

    const available = totalEarnings - paidOut - pendingClearance;

    const now = new Date();
    const thisMonthItems = confirmedItems.filter((oi) => {
      const d = new Date(oi.order.createdAt);
      return d.getFullYear() === now.getFullYear() && d.getMonth() === now.getMonth();
    });
    const thisMonthEarnings = thisMonthItems.reduce(
      (sum, oi) => sum + oi.price * oi.quantity,
      0
    );

    const payoutHistory = payouts.map((p) => ({
      id: p.id,
      amount: p.amount,
      status: p.status.toLowerCase(),
      date: p.createdAt.toISOString().slice(0, 10),
    }));

    return NextResponse.json({
      totalEarnings: Math.round(totalEarnings),
      available: Math.round(Math.max(available, 0)),
      pendingClearance: Math.round(pendingClearance),
      thisMonth: Math.round(thisMonthEarnings),
      payoutHistory,
    });
  } catch (error) {
    console.error("Payouts GET error:", error);
    return NextResponse.json(
      { success: false, error: error instanceof Error ? error.message : "Failed to fetch payouts" },
      { status: 500 }
    );
  }
}

export async function POST(request: Request) {
  try {
    const { userId } = await auth();
    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { amount } = await request.json();

    if (!amount || amount <= 0) {
      return NextResponse.json({ error: "Invalid amount" }, { status: 400 });
    }

    const products = await prisma.product.findMany({
      where: { sellerId: userId },
      select: { id: true, price: true },
    });

    const productIds = products.map((p) => p.id);

    const orderItems = await prisma.orderItem.findMany({
      where: { productId: { in: productIds } },
      include: { order: { select: { id: true, status: true } } },
    });

    const confirmedItems = orderItems.filter(
      (oi) => oi.order.status !== "CANCELLED"
    );

    const totalEarnings = confirmedItems.reduce(
      (sum, oi) => sum + oi.price * oi.quantity,
      0
    );

    const payouts = await prisma.payout.findMany({ where: { sellerId: userId } });
    const paidOut = payouts
      .filter((p) => p.status === "COMPLETED")
      .reduce((sum, p) => sum + p.amount, 0);
    const pendingClearance = payouts
      .filter((p) => p.status === "PENDING")
      .reduce((sum, p) => sum + p.amount, 0);

    const available = totalEarnings - paidOut - pendingClearance;

    if (amount > available) {
      return NextResponse.json({ error: "Insufficient available balance" }, { status: 400 });
    }

    const payout = await prisma.payout.create({
      data: {
        sellerId: userId,
        amount,
        status: "PENDING",
      },
    });

    return NextResponse.json({
      id: payout.id,
      amount: payout.amount,
      status: payout.status.toLowerCase(),
      date: payout.createdAt.toISOString().slice(0, 10),
    });
  } catch (error) {
    console.error("Payouts POST error:", error);
    return NextResponse.json(
      { success: false, error: error instanceof Error ? error.message : "Failed to process withdrawal" },
      { status: 500 }
    );
  }
}
