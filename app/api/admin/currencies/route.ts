import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { serverError } from "@/lib/validation";

export async function GET() {
  try {
    const currencies = await prisma.currency.findMany({ orderBy: { code: "asc" } });
    return NextResponse.json(currencies);
  } catch {
    return serverError("Failed to fetch currencies");
  }
}

export async function POST(req: Request) {
  try {
    const { code, name, symbol, rate } = await req.json();
    if (!code || !name || !symbol || rate == null) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
    }
    const existing = await prisma.currency.findUnique({ where: { code: code.toUpperCase() } });
    if (existing) {
      return NextResponse.json({ error: "Currency code already exists" }, { status: 409 });
    }
    const currency = await prisma.currency.create({
      data: { code: code.toUpperCase(), name, symbol, rate: parseFloat(rate) },
    });
    return NextResponse.json(currency, { status: 201 });
  } catch {
    return serverError("Failed to create currency");
  }
}

export async function PATCH(req: Request) {
  try {
    const { id, code, name, symbol, rate, status } = await req.json();
    if (!id) return NextResponse.json({ error: "Missing id" }, { status: 400 });
    const data: Record<string, unknown> = {};
    if (code) data.code = code.toUpperCase();
    if (name) data.name = name;
    if (symbol) data.symbol = symbol;
    if (rate != null) data.rate = parseFloat(rate);
    if (status) data.status = status;
    const currency = await prisma.currency.update({ where: { id }, data });
    return NextResponse.json(currency);
  } catch {
    return serverError("Failed to update currency");
  }
}

export async function DELETE(req: Request) {
  try {
    const { id } = await req.json();
    if (!id) return NextResponse.json({ error: "Missing id" }, { status: 400 });
    await prisma.currency.delete({ where: { id } });
    return NextResponse.json({ success: true });
  } catch {
    return serverError("Failed to delete currency");
  }
}
