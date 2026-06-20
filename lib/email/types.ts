export interface EmailEvent {
  type: "welcome" | "order_confirmed" | "order_shipped" | "order_delivered" | "payment_received" | "broadcast";
  recipient: { email: string; name: string };
  data: Record<string, unknown>;
}

export interface EmailTemplate {
  subject: string;
  html: string;
  text?: string;
}

export interface BroadcastOptions {
  subject: string;
  html: string;
  segmentId?: string;
  userIds?: string[];
}
