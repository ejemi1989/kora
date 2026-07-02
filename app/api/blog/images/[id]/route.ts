import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET(
  _request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const image = await prisma.blogImage.findUnique({ where: { id } });
  if (!image) return NextResponse.json({ error: "Not found" }, { status: 404 });

  const buffer = Buffer.from(image.data, "base64");
  return new NextResponse(buffer, {
    headers: {
      "Content-Type": image.mimeType,
      "Cache-Control": "public, max-age=31536000, immutable",
    },
  });
}
