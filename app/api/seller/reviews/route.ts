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
      select: { id: true },
    });

    const productIds = products.map((p) => p.id);

    const reviews = await prisma.review.findMany({
      where: { productId: { in: productIds } },
      include: {
        user: { select: { name: true } },
        product: { select: { name: true } },
      },
      orderBy: { createdAt: "desc" },
    });

    const mapped = reviews.map((r) => ({
      id: r.id,
      customer: r.user.name,
      product: r.product.name,
      rating: r.rating,
      text: r.comment,
      date: r.createdAt.toISOString().slice(0, 10),
      replied: r.replied,
      replyText: r.replyText ?? undefined,
    }));

    return NextResponse.json(mapped);
  } catch (error) {
    console.error("Reviews GET error:", error);
    return NextResponse.json(
      { success: false, error: error instanceof Error ? error.message : "Failed to fetch reviews" },
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

    const { reviewId, replyText } = await request.json();

    if (!reviewId || !replyText?.trim()) {
      return NextResponse.json({ error: "Review ID and reply text are required" }, { status: 400 });
    }

    const review = await prisma.review.findFirst({
      where: { id: reviewId },
      include: { product: { select: { sellerId: true } } },
    });

    if (!review || review.product.sellerId !== userId) {
      return NextResponse.json({ error: "Review not found" }, { status: 404 });
    }

    const updated = await prisma.review.update({
      where: { id: reviewId },
      data: { replied: true, replyText: replyText.trim() },
    });

    return NextResponse.json({
      id: updated.id,
      replied: updated.replied,
      replyText: updated.replyText,
    });
  } catch (error) {
    console.error("Reviews POST error:", error);
    return NextResponse.json(
      { success: false, error: error instanceof Error ? error.message : "Failed to reply to review" },
      { status: 500 }
    );
  }
}
