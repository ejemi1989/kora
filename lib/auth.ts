import { SignJWT, jwtVerify, type JWTPayload } from "jose";
import { cookies } from "next/headers";
import type { NextRequest } from "next/server";

const SECRET = new TextEncoder().encode(process.env.JWT_SECRET || "dev-secret-change-in-production-min-32-chars!!");
const ISSUER = "kora-marketplace";
const COOKIE_NAME = "token";

export interface AuthPayload extends JWTPayload {
  sub: string;
  email: string;
  role: "CUSTOMER" | "SELLER" | "ADMIN";
}

export async function signToken(payload: { id: string; email: string; role: "CUSTOMER" | "SELLER" | "ADMIN" }): Promise<string> {
  return new SignJWT({ sub: payload.id, email: payload.email, role: payload.role })
    .setProtectedHeader({ alg: "HS256" })
    .setIssuedAt()
    .setIssuer(ISSUER)
    .setExpirationTime("7d")
    .sign(SECRET);
}

export async function verifyToken(token: string): Promise<AuthPayload> {
  const { payload } = await jwtVerify(token, SECRET, { issuer: ISSUER });
  return payload as AuthPayload;
}

export function getTokenFromRequest(request: NextRequest): string | null {
  const auth = request.headers.get("authorization");
  if (auth?.startsWith("Bearer ")) return auth.slice(7);
  return request.cookies.get(COOKIE_NAME)?.value ?? null;
}

export async function getTokenFromCookies(): Promise<string | null> {
  const store = await cookies();
  return store.get(COOKIE_NAME)?.value ?? null;
}

export async function getCurrentUser(): Promise<AuthPayload | null> {
  try {
    const token = await getTokenFromCookies();
    if (!token) return null;
    return await verifyToken(token);
  } catch {
    return null;
  }
}

export function requireRole(role: "CUSTOMER" | "SELLER" | "ADMIN"): (payload: AuthPayload) => boolean {
  return (payload: AuthPayload) => payload.role === role;
}
