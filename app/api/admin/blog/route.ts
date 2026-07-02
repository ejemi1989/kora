import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { auth } from "@clerk/nextjs/server";

export async function GET() {
  const { userId } = await auth();
  if (!userId) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const posts = await prisma.blogPost.findMany({ orderBy: { createdAt: "desc" } });
  return NextResponse.json(posts);
}

export async function POST(request: NextRequest) {
  const { userId } = await auth();
  if (!userId) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  try {
    const body = await request.json();
    const { title, slug, excerpt, content, coverImage, author, published } = body;

    if (!title || !slug || !excerpt || !content || !author) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
    }

    const existing = await prisma.blogPost.findUnique({ where: { slug } });
    if (existing) {
      return NextResponse.json({ error: "Slug already exists" }, { status: 409 });
    }

    const post = await prisma.blogPost.create({
      data: { title, slug, excerpt, content, coverImage, author, published: published ?? false },
    });

    return NextResponse.json(post, { status: 201 });
  } catch {
    return NextResponse.json({ error: "Failed to create post" }, { status: 500 });
  }
}

export async function PATCH(request: NextRequest) {
  const { userId } = await auth();
  if (!userId) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  try {
    const body = await request.json();
    const { id, title, slug, excerpt, content, coverImage, author, published } = body;

    if (!id) return NextResponse.json({ error: "Missing id" }, { status: 400 });

    const data: Record<string, unknown> = {};
    if (title !== undefined) data.title = title;
    if (slug !== undefined) {
      const existing = await prisma.blogPost.findFirst({ where: { slug, NOT: { id } } });
      if (existing) return NextResponse.json({ error: "Slug already exists" }, { status: 409 });
      data.slug = slug;
    }
    if (excerpt !== undefined) data.excerpt = excerpt;
    if (content !== undefined) data.content = content;
    if (coverImage !== undefined) data.coverImage = coverImage;
    if (author !== undefined) data.author = author;
    if (published !== undefined) data.published = published;

    const post = await prisma.blogPost.update({ where: { id }, data });
    return NextResponse.json(post);
  } catch {
    return NextResponse.json({ error: "Failed to update post" }, { status: 500 });
  }
}

export async function DELETE(request: NextRequest) {
  const { userId } = await auth();
  if (!userId) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get("id");
    if (!id) return NextResponse.json({ error: "Missing id" }, { status: 400 });

    await prisma.blogPost.delete({ where: { id } });
    return NextResponse.json({ success: true });
  } catch {
    return NextResponse.json({ error: "Failed to delete post" }, { status: 500 });
  }
}
