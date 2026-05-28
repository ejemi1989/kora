import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { signToken } from "@/lib/auth";
import { findUser } from "@/lib/data/auth";
import { loginSchema, validate } from "@/lib/validation";

export async function POST(request: Request) {
  const body = await request.json().catch(() => ({}));

  const parsed = validate(loginSchema, body);
  if (!parsed.success) {
    return NextResponse.json({ success: false, error: parsed.error }, { status: 400 });
  }

  const user = findUser(parsed.data.email, parsed.data.password);
  if (!user) {
    return NextResponse.json({ success: false, error: "Invalid email or password" }, { status: 401 });
  }

  const token = await signToken({ id: user.id, email: user.email, role: user.role });

  const store = await cookies();
  store.set("token", token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    maxAge: 60 * 60 * 24 * 7,
  });

  const redirectMap: Record<string, string> = {
    ADMIN: "/admin/overview",
    SELLER: "/seller/overview",
    CUSTOMER: "/user/shop",
  };

  return NextResponse.json({
    success: true,
    data: { redirect: redirectMap[user.role] },
  });
}
