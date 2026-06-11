import { NextResponse } from "next/server";
import { serverError } from "@/lib/validation";

type SettingsStore = Record<string, Record<string, unknown>>;
const store: SettingsStore = {};

export async function GET() {
  try {
    return NextResponse.json(store);
  } catch {
    return serverError("Failed to fetch settings");
  }
}

export async function PUT(req: Request) {
  try {
    const { section, values } = await req.json();
    if (!section || !values) {
      return NextResponse.json({ error: "Invalid request" }, { status: 400 });
    }
    store[section] = { ...store[section], ...values };
    return NextResponse.json({ success: true });
  } catch {
    return serverError("Failed to save settings");
  }
}
