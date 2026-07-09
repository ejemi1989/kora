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

function readingTime(content: string): number {
  const words = content.split(/\s+/).length;
  return Math.max(1, Math.round(words / 200));
}

function formatDate(date: Date): string {
  return date.toLocaleDateString("en-US", { month: "long", day: "numeric", year: "numeric" });
}

function getInitials(name: string): string {
  return name.split(" ").map((n) => n[0]).join("").toUpperCase().slice(0, 2);
}

export default async function BlogPostPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const post = await prisma.blogPost.findUnique({ where: { slug, published: true } });

  if (!post) notFound();

  const related = await prisma.blogPost.findMany({
    where: { published: true, id: { not: post.id } },
    orderBy: { createdAt: "desc" },
    take: 3,
    select: { id: true, title: true, slug: true, excerpt: true, coverImage: true, author: true, createdAt: true, content: true },
  });

  return (
    <>
      <style>{`
        .post-content h2 { font-size: 22px; font-weight: 700; color: var(--ink); margin: 40px 0 12px; line-height: 1.3; letter-spacing: -0.01em; }
        .post-content h3 { font-size: 18px; font-weight: 700; color: var(--ink); margin: 32px 0 10px; line-height: 1.35; }
        .post-content p { margin: 0 0 20px; }
        .post-content ul, .post-content ol { margin: 0 0 20px; padding-left: 24px; }
        .post-content li { margin-bottom: 8px; }
        .post-content blockquote { border-left: 3px solid var(--pr); padding: 4px 0 4px 20px; margin: 24px 0; color: var(--body); font-style: italic; }
        .post-content a { color: var(--pr); text-decoration: underline; text-underline-offset: 2px; }
        .post-content a:hover { text-decoration-thickness: 2px; }
        .post-content img { border-radius: 8px; max-width: 100%; height: auto; margin: 24px 0; }
        .post-content code { background: var(--surface-soft); padding: 2px 6px; border-radius: 4px; font-size: 0.9em; }
        .post-content pre { background: var(--surface-dark); color: #e4e4e7; padding: 20px; border-radius: 8px; overflow-x: auto; margin: 24px 0; }
        .post-content pre code { background: none; padding: 0; color: inherit; }
        .related-card:hover .related-img { transform: scale(1.04); }
        .related-card:hover .related-title { color: var(--pr); }
      `}</style>
      <Navbar />
      <main style={{ background: "#fff", minHeight: "100vh" }}>
        <article>
          {post.coverImage && (
            <div style={{ width: "100%", height: 480, overflow: "hidden", background: "var(--surface-soft)" }}>
              <img
                src={post.coverImage}
                alt={post.title}
                style={{ width: "100%", height: "100%", objectFit: "cover" }}
              />
            </div>
          )}

          <div style={{ maxWidth: 680, margin: "0 auto", padding: "40px var(--pad) 0" }}>
            <Link
              href="/blog"
              style={{
                display: "inline-flex",
                alignItems: "center",
                gap: 6,
                fontSize: 13,
                fontWeight: 500,
                color: "var(--pr)",
                textDecoration: "none",
                marginBottom: 24,
              }}
            >
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M19 12H5M12 19l-7-7 7-7" /></svg>
              All posts
            </Link>

            <h1 style={{
              fontSize: 36,
              fontWeight: 800,
              color: "var(--ink)",
              margin: "0 0 12px",
              lineHeight: 1.2,
              letterSpacing: "-0.03em",
            }}>
              {post.title}
            </h1>

            <p style={{
              fontSize: 17,
              color: "var(--body)",
              margin: "0 0 24px",
              lineHeight: 1.5,
            }}>
              {post.excerpt}
            </p>

            <div style={{
              display: "flex",
              alignItems: "center",
              gap: 12,
              paddingBottom: 28,
              borderBottom: "1px solid var(--hairline)",
              marginBottom: 36,
            }}>
              <div style={{
                width: 40,
                height: 40,
                borderRadius: "50%",
                background: "var(--pr)",
                color: "#fff",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                fontSize: 14,
                fontWeight: 700,
                letterSpacing: "0.02em",
                flexShrink: 0,
              }}>
                {getInitials(post.author)}
              </div>
              <div>
                <span style={{ fontSize: 14, fontWeight: 600, color: "var(--ink)" }}>{post.author}</span>
                <div style={{ display: "flex", alignItems: "center", gap: 6, fontSize: 13, color: "var(--muted-text)", marginTop: 2 }}>
                  <time>{formatDate(post.createdAt)}</time>
                  <span>·</span>
                  <span>{readingTime(post.content)} min read</span>
                </div>
              </div>
            </div>
          </div>

          <div
            className="post-content"
            style={{
              maxWidth: 680,
              margin: "0 auto",
              padding: "0 var(--pad) 48px",
              fontSize: 17,
              lineHeight: 1.75,
              color: "var(--ink)",
            }}
          >
            <PostContent content={post.content} />
          </div>

          <div style={{ borderTop: "1px solid var(--hairline)" }}>
            <div style={{ maxWidth: 680, margin: "0 auto", padding: "40px var(--pad) 60px" }}>
              <div style={{
                display: "flex",
                alignItems: "center",
                gap: 12,
                padding: 20,
                background: "var(--surface-soft)",
                borderRadius: 12,
                marginBottom: 48,
              }}>
                <div style={{
                  width: 44,
                  height: 44,
                  borderRadius: "50%",
                  background: "var(--pr)",
                  color: "#fff",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  fontSize: 15,
                  fontWeight: 700,
                  flexShrink: 0,
                }}>
                  {getInitials(post.author)}
                </div>
                <div>
                  <span style={{ fontSize: 14, fontWeight: 600, color: "var(--ink)" }}>Written by {post.author}</span>
                  <p style={{ fontSize: 13, color: "var(--muted-text)", margin: "2px 0 0" }}>Published on Deni Blog</p>
                </div>
              </div>
            </div>
          </div>

          {related.length > 0 && (
            <div style={{ background: "var(--surface-soft)", borderTop: "1px solid var(--hairline)" }}>
              <div style={{ maxWidth: 1080, margin: "0 auto", padding: "48px var(--pad) 56px" }}>
                <h3 style={{ fontSize: 14, fontWeight: 600, letterSpacing: "0.06em", textTransform: "uppercase", color: "var(--muted-text)", margin: "0 0 24px" }}>Continue reading</h3>
                <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 24 }}>
                  {related.map((r) => (
                    <Link key={r.id} href={`/blog/${r.slug}`} style={{ textDecoration: "none" }}>
                      <article className="related-card" style={{ background: "#fff", borderRadius: 10, overflow: "hidden", border: "1px solid var(--hairline)" }}>
                        {r.coverImage && (
                          <div style={{ aspectRatio: "16/10", overflow: "hidden", background: "var(--surface-soft)" }}>
                            <img
                              className="related-img"
                              src={r.coverImage}
                              alt={r.title}
                              style={{ width: "100%", height: "100%", objectFit: "cover", transition: "transform 400ms cubic-bezier(0.25, 0.46, 0.45, 0.94)" }}
                            />
                          </div>
                        )}
                        <div style={{ padding: 16 }}>
                          <h4 className="related-title" style={{ fontSize: 15, fontWeight: 700, color: "var(--ink)", margin: "0 0 6px", lineHeight: 1.35, transition: "color 150ms" }}>{r.title}</h4>
                          <p style={{ fontSize: 13, color: "var(--body)", margin: 0, lineHeight: 1.5, display: "-webkit-box", WebkitLineClamp: 2, WebkitBoxOrient: "vertical", overflow: "hidden" }}>{r.excerpt}</p>
                        </div>
                      </article>
                    </Link>
                  ))}
                </div>
              </div>
            </div>
          )}
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
    <div>
      {content.split("\n\n").map((block, i) => {
        if (block.startsWith("Step ")) {
          const colonIndex = block.indexOf(":");
          if (colonIndex > -1) {
            const stepTitle = block.slice(0, colonIndex);
            const stepBody = block.slice(colonIndex + 1).trim();
            return (
              <div key={i} style={{ marginBottom: 28 }}>
                <h2>{stepTitle}</h2>
                <p style={{ marginBottom: 0 }}>{stepBody}</p>
              </div>
            );
          }
        }
        if (block.startsWith("Frequently Asked Questions")) {
          return <h2 key={i}>{block}</h2>;
        }
        const isQuestion = block.endsWith("?");
        if (isQuestion) {
          return <h3 key={i}>{block}</h3>;
        }
        return <p key={i}>{block}</p>;
      })}
    </div>
  );
}
