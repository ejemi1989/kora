import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { verifyToken, getTokenFromRequest, type AuthPayload } from "@/lib/auth";

const PUBLIC_ROUTES = ["/_next/", "/favicon.ico", "/images/", "/api/auth/", "/login", "/", "/signup"];

const ROLE_ROUTES: Record<string, string> = {
  "/admin": "ADMIN",
  "/seller": "SELLER",
  "/user": "CUSTOMER",
};

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  if (PUBLIC_ROUTES.some((p) => pathname.startsWith(p))) {
    return NextResponse.next();
  }

  const token = getTokenFromRequest(request);
  let payload: AuthPayload | null = null;
  if (token) {
    try {
      payload = await verifyToken(token);
    } catch {
      /* token invalid */
    }
  }

  for (const [prefix, requiredRole] of Object.entries(ROLE_ROUTES)) {
    if (pathname.startsWith(prefix)) {
      if (!payload) {
        const url = new URL("/login", request.url);
        url.searchParams.set("redirect", pathname);
        return NextResponse.redirect(url);
      }
      if (payload.role !== requiredRole) {
        return NextResponse.json({ error: "Forbidden" }, { status: 403 });
      }
      const res = NextResponse.next();
      res.headers.set("x-user-id", payload.sub);
      res.headers.set("x-user-role", payload.role);
      return res;
    }
  }

  if (pathname.startsWith("/api/")) {
    if (!payload) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
    const res = NextResponse.next();
    res.headers.set("x-user-id", payload.sub);
    res.headers.set("x-user-role", payload.role);
    return res;
  }

  if (payload) {
    const res = NextResponse.next();
    res.headers.set("x-user-id", payload.sub);
    res.headers.set("x-user-role", payload.role);
    return res;
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/((?!_next/static|_next/image|favicon.ico).*)"],
};
