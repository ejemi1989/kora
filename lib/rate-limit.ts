import type { NextRequest } from "next/server";

interface RateLimitEntry {
  count: number;
  resetAt: number;
}

const store = new Map<string, RateLimitEntry>();

const WINDOW_MS = 60_000;
const MAX_REQUESTS = 60;
const MAX_MUTATION_REQUESTS = 20;

function getKey(request: NextRequest): string {
  const forwarded = request.headers.get("x-forwarded-for");
  const ip = forwarded?.split(",")[0]?.trim() || "127.0.0.1";
  const userId = request.cookies.get("token")?.value?.slice(-12) || ip;
  return userId;
}

function isMutation(request: NextRequest): boolean {
  const method = request.method;
  return method === "POST" || method === "PATCH" || method === "PUT" || method === "DELETE";
}

export function rateLimit(request: NextRequest): { success: boolean; remaining: number; resetAt: number } {
  const key = getKey(request);
  const now = Date.now();
  const entry = store.get(key);
  const max = isMutation(request) ? MAX_MUTATION_REQUESTS : MAX_REQUESTS;

  if (!entry || now >= entry.resetAt) {
    store.set(key, { count: 1, resetAt: now + WINDOW_MS });
    return { success: true, remaining: max - 1, resetAt: now + WINDOW_MS };
  }

  entry.count += 1;

  if (entry.count > max) {
    return { success: false, remaining: 0, resetAt: entry.resetAt };
  }

  return { success: true, remaining: max - entry.count, resetAt: entry.resetAt };
}

export function getRateLimitHeaders(result: { remaining: number; resetAt: number }, isMut: boolean): Record<string, string> {
  return {
    "X-RateLimit-Limit": String(isMut ? MAX_MUTATION_REQUESTS : MAX_REQUESTS),
    "X-RateLimit-Remaining": String(result.remaining),
    "X-RateLimit-Reset": String(Math.ceil(result.resetAt / 1000)),
  };
}

export function clearRateLimitStore(): void {
  store.clear();
}
