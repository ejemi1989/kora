import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { serverError } from "@/lib/validation";

export async function GET() {
  try {
    const payments = await prisma.payment.findMany({
      orderBy: { createdAt: "desc" },
      include: { order: { select: { user: { select: { name: true } } } } },
    });

    const successfulCount = payments.filter((p) => p.status === "SUCCESS").length;
    const totalVolume = payments.filter((p) => p.status === "SUCCESS").reduce((sum, p) => sum + p.amount, 0);
    const avgTicket = successfulCount > 0 ? totalVolume / successfulCount : 0;

    const stats = [
      { label: "Total Volume", value: `₦${totalVolume.toLocaleString()}` },
      { label: "Transactions", value: payments.length.toLocaleString() },
      { label: "Avg Ticket", value: `₦${avgTicket.toLocaleString()}` },
    ];

    const transactions = payments.map((p) => ({
      id: p.id.slice(0, 8),
      customer: p.order.user.name,
      method: p.method || "N/A",
      amount: `₦${p.amount.toLocaleString()}`,
      date: p.createdAt.toISOString().split("T")[0],
      status: (p.status === "SUCCESS" ? "completed" : p.status === "FAILED" ? "pending" : "refunded") as "completed" | "pending" | "refunded",
    }));

    return NextResponse.json({ stats, transactions });
  } catch {
    return serverError("Failed to fetch payments");
  }
}
