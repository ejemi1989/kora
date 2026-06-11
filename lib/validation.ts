import { z } from "zod";
import { NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";

export const productCreateSchema = z.object({
  name: z.string().min(1, "Name is required").max(200),
  description: z.string().min(1, "Description is required").max(2000),
  price: z.number().positive("Price must be positive"),
  stock: z.number().int().nonnegative("Stock must be 0 or greater"),
  images: z.array(z.string().url()).optional().default([]),
  category: z.string().min(1, "Category is required"),
  sellerId: z.string().min(1, "Seller ID is required"),
});

export const productUpdateSchema = z.object({
  name: z.string().min(1).max(200).optional(),
  description: z.string().min(1).max(2000).optional(),
  price: z.number().positive().optional(),
  stock: z.number().int().nonnegative().optional(),
  images: z.array(z.string().url()).optional(),
  category: z.string().min(1).optional(),
  status: z.string().optional(),
  rating: z.number().min(0).max(5).optional(),
});

export const cartAddSchema = z.object({
  userId: z.string().min(1),
  productId: z.string().min(1),
  quantity: z.number().int().positive("Quantity must be at least 1"),
});

export const cartUpdateSchema = z.object({
  itemId: z.string().min(1),
  quantity: z.number().int().nonnegative("Quantity must be 0 or greater"),
});

export const cartRemoveSchema = z.object({
  itemId: z.string().min(1),
});

export const addressSchema = z.object({
  tag: z.string().min(1, "Tag is required").max(20),
  name: z.string().min(1, "Name is required").max(100),
  address: z.string().min(1, "Address is required").max(500),
  phone: z.string().min(1, "Phone is required").max(20),
  isDefault: z.boolean().optional().default(false),
});

export function validate<T>(schema: z.ZodSchema<T>, data: unknown): { success: true; data: T } | { success: false; error: string } {
  const result = schema.safeParse(data);
  if (!result.success) {
    const first = result.error.issues[0];
    return { success: false, error: `${first.path.join(".")}: ${first.message}` };
  }
  return { success: true, data: result.data };
}

export function validationError(error: string): NextResponse {
  return NextResponse.json({ success: false, error }, { status: 400 });
}

export function serverError(msg?: string): NextResponse {
  return NextResponse.json({ success: false, error: msg || "Internal server error" }, { status: 500 });
}

export function notFound(msg?: string): NextResponse {
  return NextResponse.json({ success: false, error: msg || "Not found" }, { status: 404 });
}

export function success<T>(data: T, status = 200): NextResponse {
  return NextResponse.json({ success: true, data }, { status });
}

export async function requireAdmin(): Promise<{ userId: string } | NextResponse> {
  const { userId } = await auth();
  if (!userId) {
    return NextResponse.json({ success: false, error: "Unauthorized" }, { status: 401 });
  }
  return { userId };
}
