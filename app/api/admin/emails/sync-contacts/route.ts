import { NextResponse } from "next/server";
import { clerkClient } from "@clerk/nextjs/server";
import {
  createContact,
  listContacts,
  listSegments,
  createSegment,
  isEmailConfigured,
} from "@/lib/email";
import { serverError } from "@/lib/validation";

export async function POST() {
  try {
    if (!isEmailConfigured()) {
      return NextResponse.json(
        { error: "Email not configured. Set RESEND_API_KEY." },
        { status: 400 },
      );
    }

    const segmentData = await listSegments().catch(() => []);
    const segmentList = Array.isArray(segmentData) ? segmentData : ((segmentData as { data?: Array<{ id: string }> })?.data || []);
    let segmentId = segmentList[0]?.id || "";

    if (!segmentId) {
      const created = await createSegment("Deni Marketplace Users");
      segmentId = created.id;
    }

    const client = await clerkClient();
    const allUsers: { id: string; email: string; firstName: string; lastName: string }[] = [];
    let offset = 0;
    const limit = 500;

    while (true) {
      const res = await client.users.getUserList({ limit, offset });
      for (const u of res.data) {
        const email = u.emailAddresses[0]?.emailAddress;
        if (email) {
          allUsers.push({
            id: u.id,
            email,
            firstName: u.firstName || "",
            lastName: u.lastName || "",
          });
        }
      }
      if (res.data.length < limit) break;
      offset += limit;
    }

    const contactData = await listContacts().catch(() => []);
    const contactList = Array.isArray(contactData) ? contactData : ((contactData as { data?: Array<{ email: string }> })?.data || []);
    const existingEmails = new Set(
      contactList.map((c: { email: string }) => c.email),
    );

    const toSync = allUsers.filter((u) => !existingEmails.has(u.email));

    const results: { email: string; status: string; id?: string; error?: string }[] = [];

    for (const user of toSync) {
      try {
        const contact = await createContact({
          email: user.email,
          firstName: user.firstName,
          lastName: user.lastName,
          segmentId,
        });
        results.push({ email: user.email, status: "created", id: contact.id });
      } catch (err) {
        results.push({
          email: user.email,
          status: "failed",
          error: err instanceof Error ? err.message : "Unknown error",
        });
      }
    }

    return NextResponse.json({
      segmentId,
      segmentName: "Deni Marketplace Users",
      total: allUsers.length,
      synced: results.filter((r) => r.status === "created").length,
      skipped: allUsers.length - toSync.length,
      failed: results.filter((r) => r.status === "failed").length,
      results,
    });
  } catch {
    return serverError("Failed to sync contacts");
  }
}
