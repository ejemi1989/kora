const MATON_GATEWAY = "https://gateway.maton.ai/resend";
const MATON_API_KEY = process.env.MATON_API_KEY;

interface SendEmailParams {
  from: string;
  to: string[];
  subject: string;
  html?: string;
  text?: string;
  cc?: string[];
  bcc?: string[];
  reply_to?: string[];
  attachments?: { filename: string; content: string; content_type?: string }[];
  tags?: { name: string; value: string }[];
  scheduled_at?: string;
}

interface EmailResponse {
  id: string;
}

interface EmailError {
  error: string;
}

function getApiKey(): string {
  if (!MATON_API_KEY) {
    throw new Error("MATON_API_KEY environment variable is not set");
  }
  return MATON_API_KEY;
}

export async function sendEmail(params: SendEmailParams): Promise<EmailResponse> {
  const apiKey = getApiKey();

  const res = await fetch(`${MATON_GATEWAY}/emails`, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${apiKey}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify(params),
  });

  if (!res.ok) {
    const body = await res.text();
    throw new Error(`Resend error ${res.status}: ${body}`);
  }

  return res.json();
}

export async function sendBatchEmails(
  emails: SendEmailParams[],
): Promise<EmailResponse[]> {
  const apiKey = getApiKey();

  const res = await fetch(`${MATON_GATEWAY}/emails/batch`, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${apiKey}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify(emails),
  });

  if (!res.ok) {
    const body = await res.text();
    throw new Error(`Resend batch error ${res.status}: ${body}`);
  }

  return res.json();
}

export async function getEmail(emailId: string) {
  const apiKey = getApiKey();
  const res = await fetch(`${MATON_GATEWAY}/emails/${emailId}`, {
    headers: { Authorization: `Bearer ${apiKey}` },
  });
  if (!res.ok) throw new Error(`Resend error ${res.status}`);
  return res.json();
}

export async function listEmails() {
  const apiKey = getApiKey();
  const res = await fetch(`${MATON_GATEWAY}/emails`, {
    headers: { Authorization: `Bearer ${apiKey}` },
  });
  if (!res.ok) throw new Error(`Resend error ${res.status}`);
  return res.json();
}

export function isEmailConfigured(): boolean {
  return Boolean(MATON_API_KEY);
}
