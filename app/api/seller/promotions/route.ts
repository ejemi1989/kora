import { NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";
import { prisma } from "@/lib/prisma";
import { serverError } from "@/lib/validation";

function formatDate(date: Date | null | undefined) {
  if (!date) return "Unlimited";
  return date.toLocaleDateString("en-GB", { day: "numeric", month: "short" });
}

export async function GET() {
  try {
    const { userId } = await auth();
    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const promos = await prisma.promotion.findMany({
      where: { sellerId: userId },
      orderBy: { createdAt: "desc" },
    });

    const mapped = promos.map((p) => {
      const discountLabel =
        p.discountType === "percentage"
          ? `${p.discountValue}% off`
          : `₦${p.discountValue.toLocaleString()} off`;

      return {
        id: p.id,
        code: p.code,
        discount: discountLabel,
        discountType: p.discountType,
        discountValue: p.discountValue,
        details: p.applicableTo === "all" ? "All Products" : p.applicableTo,
        applicableTo: p.applicableTo,
        minOrder: p.minOrder,
        usageCount: p.usageCount,
        status: p.status,
        startDate: p.startDate.toISOString().slice(0, 10),
        endDate: p.endDate ? p.endDate.toISOString().slice(0, 10) : "",
        ends: formatDate(p.endDate),
      };
    });

    return NextResponse.json(mapped);
  } catch (error) {
    console.error("Promotions GET error:", error);
    return NextResponse.json(
      { success: false, error: error instanceof Error ? error.message : "Failed to fetch promotions" },
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

    const body = await request.json();
    const { code, discountType, discountValue, startDate, endDate, applicableTo, minOrder } = body;

    if (!code?.trim() || discountValue == null || !startDate) {
      return NextResponse.json({ error: "Code, discount value, and start date are required" }, { status: 400 });
    }

    const existing = await prisma.promotion.findUnique({ where: { code: code.trim() } });
    if (existing) {
      return NextResponse.json({ error: "A promotion with this code already exists" }, { status: 409 });
    }

    const promo = await prisma.promotion.create({
      data: {
        sellerId: userId,
        code: code.trim().toUpperCase(),
        discountType: discountType === "Fixed Amount (₦)" ? "fixed" : "percentage",
        discountValue: parseFloat(discountValue),
        applicableTo: applicableTo === "All Products" ? "all" : applicableTo,
        minOrder: parseFloat(minOrder || "0"),
        status: "draft",
        startDate: new Date(startDate),
        endDate: endDate ? new Date(endDate) : null,
      },
    });

    const discountLabel =
      promo.discountType === "percentage"
        ? `${promo.discountValue}% off`
        : `₦${promo.discountValue.toLocaleString()} off`;

    return NextResponse.json({
      id: promo.id,
      code: promo.code,
      discount: discountLabel,
      discountType: promo.discountType,
      discountValue: promo.discountValue,
      details: promo.applicableTo === "all" ? "All Products" : promo.applicableTo,
      applicableTo: promo.applicableTo,
      minOrder: promo.minOrder,
      usageCount: promo.usageCount,
      status: promo.status,
      startDate: promo.startDate.toISOString().slice(0, 10),
      endDate: promo.endDate ? promo.endDate.toISOString().slice(0, 10) : "",
      ends: formatDate(promo.endDate),
    });
  } catch (error) {
    console.error("Promotions POST error:", error);
    return NextResponse.json(
      { success: false, error: error instanceof Error ? error.message : "Failed to create promotion" },
      { status: 500 }
    );
  }
}

export async function PATCH(request: Request) {
  try {
    const { userId } = await auth();
    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await request.json();
    const { id, ...fields } = body;

    if (!id) {
      return NextResponse.json({ error: "Promotion ID is required" }, { status: 400 });
    }

    const promo = await prisma.promotion.findFirst({
      where: { id, sellerId: userId },
    });

    if (!promo) {
      return NextResponse.json({ error: "Promotion not found" }, { status: 404 });
    }

    const updateData: Record<string, unknown> = {};

    if (fields.code !== undefined) updateData.code = fields.code.trim().toUpperCase();
    if (fields.discountType !== undefined) {
      updateData.discountType = fields.discountType === "Fixed Amount (₦)" ? "fixed" : "percentage";
    }
    if (fields.discountValue !== undefined) updateData.discountValue = parseFloat(fields.discountValue);
    if (fields.applicableTo !== undefined) {
      updateData.applicableTo = fields.applicableTo === "All Products" ? "all" : fields.applicableTo;
    }
    if (fields.minOrder !== undefined) updateData.minOrder = parseFloat(fields.minOrder);
    if (fields.startDate !== undefined) updateData.startDate = new Date(fields.startDate);
    if (fields.endDate !== undefined) updateData.endDate = fields.endDate ? new Date(fields.endDate) : null;
    if (fields.status !== undefined) updateData.status = fields.status;
    if (fields.usageCount !== undefined) updateData.usageCount = fields.usageCount;

    const updated = await prisma.promotion.update({
      where: { id },
      data: updateData,
    });

    const discountLabel =
      updated.discountType === "percentage"
        ? `${updated.discountValue}% off`
        : `₦${updated.discountValue.toLocaleString()} off`;

    return NextResponse.json({
      id: updated.id,
      code: updated.code,
      discount: discountLabel,
      discountType: updated.discountType,
      discountValue: updated.discountValue,
      details: updated.applicableTo === "all" ? "All Products" : updated.applicableTo,
      applicableTo: updated.applicableTo,
      minOrder: updated.minOrder,
      usageCount: updated.usageCount,
      status: updated.status,
      startDate: updated.startDate.toISOString().slice(0, 10),
      endDate: updated.endDate ? updated.endDate.toISOString().slice(0, 10) : "",
      ends: formatDate(updated.endDate),
    });
  } catch (error) {
    console.error("Promotions PATCH error:", error);
    return NextResponse.json(
      { success: false, error: error instanceof Error ? error.message : "Failed to update promotion" },
      { status: 500 }
    );
  }
}

export async function DELETE(request: Request) {
  try {
    const { userId } = await auth();
    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { id } = await request.json();

    if (!id) {
      return NextResponse.json({ error: "Promotion ID is required" }, { status: 400 });
    }

    const promo = await prisma.promotion.findFirst({
      where: { id, sellerId: userId },
    });

    if (!promo) {
      return NextResponse.json({ error: "Promotion not found" }, { status: 404 });
    }

    await prisma.promotion.delete({ where: { id } });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Promotions DELETE error:", error);
    return NextResponse.json(
      { success: false, error: error instanceof Error ? error.message : "Failed to delete promotion" },
      { status: 500 }
    );
  }
}
