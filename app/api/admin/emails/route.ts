import { NextResponse } from "next/server";
import { sendEmail, listEmails, isEmailConfigured } from "@/lib/email";
import { serverError } from "@/lib/validation";

export async function GET() {
  try {
    if (!isEmailConfigured()) {
      return NextResponse.json({ configured: false, emails: [] });
    }
    const data = await listEmails();
    const emails = Array.isArray(data) ? data : (data as { data?: unknown[] })?.data || [];
    return NextResponse.json({ configured: true, emails });
  } catch {
    return serverError("Failed to fetch emails");
  }
}

export async function POST(req: Request) {
  try {
    const body = await req.json();

    if (!isEmailConfigured()) {
      return NextResponse.json(
        { error: "Email is not configured. Set RESEND_API_KEY in environment variables." },
        { status: 400 },
      );
    }

    const result = await sendEmail({
      from: body.from,
      to: body.to,
      subject: body.subject,
      html: body.html,
      text: body.text,
      cc: body.cc,
      bcc: body.bcc,
      replyTo: body.replyTo,
    });

    return NextResponse.json(result);
  } catch (err) {
    return NextResponse.json(
      { error: err instanceof Error ? err.message : "Failed to send email" },
      { status: 500 },
    );
  }
}
