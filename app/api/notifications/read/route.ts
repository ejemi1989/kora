import { auth } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { serverError } from "@/lib/validation";

export async function POST(request: Request) {
  try {
    const { userId } = await auth();
    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { id } = await request.json();

    if (id) {
      await prisma.notification.updateMany({
        where: { id, userId },
        data: { read: true },
      });
    } else {
      await prisma.notification.updateMany({
        where: { userId },
        data: { read: true },
      });
    }

    return NextResponse.json({ success: true });
  } catch {
    return serverError("Failed to mark notification as read");
  }
}
