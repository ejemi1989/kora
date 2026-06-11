import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { serverError } from "@/lib/validation";

export async function GET() {
  try {
    const notifs = await prisma.notification.findMany({
      orderBy: { createdAt: "desc" },
      take: 50,
    });

    const data = notifs.map((n) => ({
      id: n.id,
      title: n.type.charAt(0).toUpperCase() + n.type.slice(1),
      type: (n.type === "urgent" || n.type === "new" || n.type === "action" || n.type === "info" || n.type === "milestone" || n.type === "warning" ? n.type : "info") as "urgent" | "new" | "action" | "info" | "milestone" | "warning",
      iconBg: n.type === "urgent" ? "danger-bg" : n.type === "warning" ? "warning-bg" : "primary-bg",
      badge: n.read ? "read" : "new",
      description: n.message,
      time: getRelativeTime(n.createdAt),
      actionLabel: n.read ? "View" : "Review",
      actionTarget: "notifications" as const,
      dismissable: !n.read,
      urgent: n.type === "urgent",
    }));

    return NextResponse.json(data);
  } catch {
    return serverError("Failed to fetch notifications");
  }
}

export async function PATCH(req: Request) {
  try {
    const { id } = await req.json();
    if (id) {
      await prisma.notification.update({ where: { id }, data: { read: true } });
    } else {
      await prisma.notification.updateMany({ data: { read: true } });
    }
    return NextResponse.json({ success: true });
  } catch {
    return serverError("Failed to update notification");
  }
}

function getRelativeTime(date: Date): string {
  const diff = Date.now() - date.getTime();
  const mins = Math.floor(diff / 60000);
  if (mins < 1) return "Just now";
  if (mins < 60) return `${mins}m ago`;
  const hours = Math.floor(mins / 60);
  if (hours < 24) return `${hours}h ago`;
  const days = Math.floor(hours / 24);
  if (days < 7) return `${days}d ago`;
  return date.toISOString().split("T")[0];
}
