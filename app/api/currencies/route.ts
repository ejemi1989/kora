import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { serverError } from "@/lib/validation";

export async function GET() {
  try {
    const currencies = await prisma.currency.findMany({
      where: { status: "active" },
      orderBy: { code: "asc" },
      select: { code: true, name: true, symbol: true, rate: true },
    });
    return NextResponse.json(currencies);
  } catch {
    return serverError("Failed to fetch currencies");
  }
}
