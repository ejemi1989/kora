import { Resend } from "resend";
import * as templates from "./templates";
import type { EmailEvent, BroadcastOptions } from "./types";

const RESEND_API_KEY = process.env.RESEND_API_KEY;

function client(): Resend {
  if (!RESEND_API_KEY) throw new Error("RESEND_API_KEY not set");
  return new Resend(RESEND_API_KEY);
}

export function isConfigured(): boolean {
  return Boolean(RESEND_API_KEY);
}

// --- Core send ---

async function send(to: string[], subject: string, html: string) {
  const { data, error } = await client().emails.send({
    from: "Deni Marketplace <info@denimarketplace.com>",
    to,
    subject,
    html,
  } as Parameters<Resend["emails"]["send"]>[0]);
  if (error) throw new Error(error.message);
  return data;
}

// --- Transactional ---

export async function sendWelcome(email: string, name: string) {
  const t = templates.welcome(name);
  return send([email], t.subject, t.html);
}

export async function sendOrderConfirmed(email: string, name: string, orderId: string, items: string[], total: string) {
  const t = templates.orderConfirmed({ name, orderId, items, total });
  return send([email], t.subject, t.html);
}

export async function sendOrderShipped(email: string, name: string, orderId: string, trackingNumber: string) {
  const t = templates.orderShipped({ name, orderId, trackingNumber });
  return send([email], t.subject, t.html);
}

export async function sendOrderDelivered(email: string, name: string, orderId: string) {
  const t = templates.orderDelivered({ name, orderId });
  return send([email], t.subject, t.html);
}

// --- Broadcast ---

export async function sendBroadcast(opts: BroadcastOptions) {
  if (opts.userIds?.length) {
    const results = [];
    for (const emailAddress of opts.userIds) {
      const t = templates.broadcast({ subject: opts.subject, html: opts.html });
      const r = await send([emailAddress], t.subject, t.html);
      results.push(r);
    }
    return results;
  }
  // If no specific users, could broadcast to a segment — not implemented yet
  throw new Error("No recipients specified for broadcast");
}

export async function sendToAllUsers(opts: { subject: string; html: string; excludeTest?: boolean }) {
  const { clerkClient } = await import("@clerk/nextjs/server");
  const clerk = await clerkClient();

  const emails: string[] = [];
  let offset = 0;
  const limit = 500;

  while (true) {
    const res = await clerk.users.getUserList({ limit, offset });
    for (const u of res.data) {
      const e = u.emailAddresses[0]?.emailAddress;
      if (e) {
        if (opts.excludeTest && e.includes("@denimarketplace.com")) continue;
        emails.push(e);
      }
    }
    if (res.data.length < limit) break;
    offset += limit;
  }

  const t = templates.broadcast({ subject: opts.subject, html: opts.html });
  const results: { status: "sent" | "failed"; id?: string; error?: string }[] = [];

  for (const email of emails) {
    try {
      const data = await send([email], t.subject, t.html);
      results.push({ status: "sent", id: data?.id });
    } catch (err) {
      results.push({ status: "failed", error: err instanceof Error ? err.message : "Unknown error" });
    }
  }
  return results;
}

// --- Contacts ---

export async function createContact(email: string, firstName?: string, lastName?: string, segmentId?: string) {
  const payload: Record<string, unknown> = { email, firstName, lastName };
  if (segmentId) payload.segments = [{ id: segmentId }];
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const { data, error } = await client().contacts.create(payload as any);
  if (error) throw new Error(error.message);
  return data as { id: string };
}

export async function listContacts() {
  const { data, error } = await client().contacts.list();
  if (error) throw new Error(error.message);
  return data;
}

export async function listSegments() {
  const { data, error } = await client().segments.list();
  if (error) throw new Error(error.message);
  return data;
}

export async function createSegment(name: string) {
  const { data, error } = await client().segments.create({ name });
  if (error) throw new Error(error.message);
  return data as { id: string };
}
