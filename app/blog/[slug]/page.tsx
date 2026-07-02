import { prisma } from "@/lib/prisma";
import { Navbar } from "@/components/landing/Navbar";
import { Footer } from "@/components/landing/Footer";
import Link from "next/link";
import { notFound } from "next/navigation";
import type { Metadata } from "next";

export async function generateStaticParams() {
  const posts = await prisma.blogPost.findMany({
    where: { published: true },
    select: { slug: true },
  });
  return posts.map((p) => ({ slug: p.slug }));
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const post = await prisma.blogPost.findUnique({ where: { slug, published: true } });
  if (!post) return { title: "Not Found — Deni" };
  return {
    title: `${post.title} — Deni Blog`,
    description: post.excerpt,
    openGraph: {
      title: post.title,
      description: post.excerpt,
      ...(post.coverImage ? { images: [post.coverImage] } : {}),
    },
  };
}

export default async function BlogPostPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const post = await prisma.blogPost.findUnique({ where: { slug, published: true } });

  if (!post) notFound();

  return (
    <>
      <Navbar />
      <main>
        <article>
          {post.coverImage && (
            <div style={{ width: "100%", height: 320, overflow: "hidden", background: "var(--surface-soft)" }}>
              <img src={post.coverImage} alt={post.title} style={{ width: "100%", height: "100%", objectFit: "cover" }} />
            </div>
          )}
          <div style={{ maxWidth: 680, margin: "0 auto", padding: "40px var(--pad) 80px" }}>
            <Link href="/blog" style={{ fontSize: 13, color: "var(--pr)", textDecoration: "none", fontWeight: 500, display: "inline-block", marginBottom: 16 }}>
              ← Back to Blog
            </Link>
            <h1 style={{ fontSize: 34, fontWeight: 400, letterSpacing: "-0.8px", lineHeight: 1.2, color: "var(--pr)", margin: "0 0 8px" }}>{post.title}</h1>
            <div style={{ display: "flex", alignItems: "center", gap: 8, fontSize: 13, color: "var(--muted-landing)", marginBottom: 32 }}>
              <span>{post.author}</span>
              <span>·</span>
              <time>{new Date(post.createdAt).toLocaleDateString("en-US", { year: "numeric", month: "long", day: "numeric" })}</time>
            </div>
            <div style={{ fontSize: 15.5, lineHeight: 1.8, color: "var(--ink-landing)" }}>
              <PostContent content={post.content} />
            </div>
          </div>
        </article>
      </main>
      <Footer />
    </>
  );
}

function PostContent({ content }: { content: string }) {
  const isHtml = /<\/?[a-z][\s\S]*>/i.test(content);
  if (isHtml) {
    return <div dangerouslySetInnerHTML={{ __html: content }} />;
  }
  return (
    <div style={{ whiteSpace: "pre-wrap" }}>
      {content.split("\n\n").map((p, i) => (
        <p key={i} style={{ marginBottom: 16 }}>{p}</p>
      ))}
    </div>
  );
}
