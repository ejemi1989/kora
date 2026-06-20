import { Resend } from "resend";

const RESEND_API_KEY = process.env.RESEND_API_KEY;

function getClient(): Resend {
  if (!RESEND_API_KEY) {
    throw new Error("RESEND_API_KEY environment variable is not set");
  }
  return new Resend(RESEND_API_KEY);
}

export function isEmailConfigured(): boolean {
  return Boolean(RESEND_API_KEY);
}

// --- Emails ---

export async function sendEmail(params: {
  from: string;
  to: string | string[];
  subject: string;
  html: string;
  text?: string;
  cc?: string | string[];
  bcc?: string | string[];
  replyTo?: string | string[];
  attachments?: { filename: string; content: string | Buffer }[];
  tags?: { name: string; value: string }[];
  scheduledAt?: string;
  headers?: Record<string, string>;
}) {
  const client = getClient();
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const { data, error } = await client.emails.send(params as any);
  if (error) throw new Error(error.message);
  return data as { id: string };
}

export async function getEmail(emailId: string) {
  const client = getClient();
  const { data, error } = await client.emails.get(emailId);
  if (error) throw new Error(error.message);
  return data;
}

export async function listEmails() {
  const client = getClient();
  const { data, error } = await client.emails.list();
  if (error) throw new Error(error.message);
  return data;
}

// --- Contacts ---

export async function createContact(params: {
  email: string;
  firstName?: string;
  lastName?: string;
  segmentId?: string;
}) {
  const client = getClient();
  const payload: Record<string, unknown> = {
    email: params.email,
    firstName: params.firstName,
    lastName: params.lastName,
  };
  if (params.segmentId) {
    payload.segments = [{ id: params.segmentId }];
  }
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const { data, error } = await client.contacts.create(payload as any);
  if (error) throw new Error(error.message);
  return data as { id: string };
}

export async function listContacts() {
  const client = getClient();
  const { data, error } = await client.contacts.list();
  if (error) throw new Error(error.message);
  return data;
}

// --- Segments (formerly Audiences) ---

export async function listSegments() {
  const client = getClient();
  const { data, error } = await client.segments.list();
  if (error) throw new Error(error.message);
  return data;
}

export async function createSegment(name: string) {
  const client = getClient();
  const { data, error } = await client.segments.create({ name });
  if (error) throw new Error(error.message);
  return data as { id: string };
}
