import { NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";
import { prisma } from "@/lib/prisma";

export async function POST(request: Request) {
  const { userId } = await auth();
  if (!userId) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  try {
    const formData = await request.formData();
    const file = formData.get("file") as File | null;
    if (!file) return NextResponse.json({ error: "No file provided" }, { status: 400 });

    const buffer = Buffer.from(await file.arrayBuffer());
    const base64 = buffer.toString("base64");
    const mimeType = file.type || "image/png";

    const image = await prisma.blogImage.create({
      data: { data: base64, mimeType },
    });

    return NextResponse.json({ url: `/api/blog/images/${image.id}`, id: image.id });
  } catch {
    return NextResponse.json({ error: "Upload failed" }, { status: 500 });
  }
}
