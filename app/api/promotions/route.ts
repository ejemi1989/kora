import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { serverError } from "@/lib/validation";

export async function GET() {
  try {
    const now = new Date();

    const promos = await prisma.promotion.findMany({
      where: {
        status: "active",
        startDate: { lte: now },
        OR: [{ endDate: null }, { endDate: { gte: now } }],
      },
      select: {
        code: true,
        discountType: true,
        discountValue: true,
        applicableTo: true,
        minOrder: true,
        endDate: true,
      },
      orderBy: { createdAt: "desc" },
    });

    const mapped = promos.map((p) => {
      const discountLabel =
        p.discountType === "percentage"
          ? `${p.discountValue}% off`
          : `₦${p.discountValue.toLocaleString()} off`;

      return {
        code: p.code,
        discount: discountLabel,
        applicableTo: p.applicableTo === "all" ? "All Products" : p.applicableTo,
        minOrder: p.minOrder,
        ends: p.endDate
          ? p.endDate.toLocaleDateString("en-GB", { day: "numeric", month: "short" })
          : "Unlimited",
      };
    });

    return NextResponse.json(mapped);
  } catch {
    return serverError("Failed to fetch promotions");
  }
}
