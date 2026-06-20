import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function POST(request: Request) {
  try {
    const body = await request.json();

    const email = {
      from: body.from || "",
      to: Array.isArray(body.to) ? body.to.join(", ") : (body.to || ""),
      subject: body.subject || "(No subject)",
      html: body.html || null,
      text: body.text || null,
    };

    if (!email.from) {
      return NextResponse.json({ error: "Missing from field" }, { status: 400 });
    }

    await prisma.receivedEmail.create({
      data: {
        from: email.from,
        to: email.to,
        subject: email.subject,
        html: email.html,
        text: email.text,
      },
    });

    return NextResponse.json({ received: true });
  } catch (err) {
    console.error("Failed to store received email:", err);
    return NextResponse.json({ error: "Failed to process email" }, { status: 500 });
  }
}

export async function GET() {
  try {
    const emails = await prisma.receivedEmail.findMany({
      orderBy: { createdAt: "desc" },
      take: 50,
    });

    return NextResponse.json(emails);
  } catch {
    return NextResponse.json({ error: "Failed to fetch emails" }, { status: 500 });
  }
}

export async function PATCH(req: Request) {
  try {
    const { id } = await req.json();
    await prisma.receivedEmail.update({
      where: { id },
      data: { read: true },
    });
    return NextResponse.json({ success: true });
  } catch {
    return NextResponse.json({ error: "Failed to mark as read" }, { status: 500 });
  }
}
