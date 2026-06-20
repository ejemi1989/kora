import { NextResponse } from "next/server";
import { isEmailConfigured, sendToAllUsers, listSentEmails, getEmailStats } from "@/lib/email";

export async function GET() {
  try {
    if (!isEmailConfigured()) {
      return NextResponse.json({
        configured: false,
        sender: "info@denimarketplace.com",
        emails: [],
        stats: { totalSent: 0 },
      });
    }

    const [sentEmails, stats] = await Promise.all([
      listSentEmails().catch(() => []),
      getEmailStats().catch(() => ({ totalSent: 0, sender: "info@denimarketplace.com" })),
    ]);

    const emailList = Array.isArray(sentEmails)
      ? sentEmails.slice(0, 50)
      : ((sentEmails as { data?: unknown[] })?.data || []).slice(0, 50);

    return NextResponse.json({
      configured: true,
      sender: "info@denimarketplace.com",
      emails: emailList,
      stats,
    });
  } catch {
    return NextResponse.json({
      configured: isEmailConfigured(),
      sender: "info@denimarketplace.com",
      emails: [],
      stats: { totalSent: 0 },
      error: "Failed to load emails",
    });
  }
}

export async function POST(req: Request) {
  try {
    if (!isEmailConfigured()) {
      return NextResponse.json(
        { error: "RESEND_API_KEY not configured." },
        { status: 400 },
      );
    }

    const body = await req.json();
    const { subject, html } = body;

    if (!subject || !html) {
      return NextResponse.json({ error: "Subject and HTML content are required" }, { status: 400 });
    }

    const results = await sendToAllUsers({ subject, html, excludeTest: true });

    const sent = results.filter((r: { status: string }) => r.status === "sent").length;
    const failed = results.filter((r: { status: string }) => r.status === "failed").length;

    return NextResponse.json({ sent, failed, total: results.length });
  } catch (err) {
    return NextResponse.json(
      { error: err instanceof Error ? err.message : "Failed to broadcast" },
      { status: 500 },
    );
  }
}
