import { prisma } from "@/lib/prisma";
import { Navbar } from "@/components/landing/Navbar";
import { Footer } from "@/components/landing/Footer";
import Link from "next/link";

export const metadata = {
  title: "Blog — Deni",
  description: "Tips, guides, and stories about African food, culture, and buying from the diaspora.",
};

function readingTime(content: string): number {
  const words = content.split(/\s+/).length;
  return Math.max(1, Math.round(words / 200));
}

function formatDate(date: Date): string {
  return date.toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" });
}

function getInitials(name: string): string {
  return name.split(" ").map((n) => n[0]).join("").toUpperCase().slice(0, 2);
}

export default async function BlogListing() {
  const posts = await prisma.blogPost.findMany({
    where: { published: true },
    orderBy: { createdAt: "desc" },
  });

  return (
    <>
      <style>{`
        .blog-card:hover .blog-card-img { transform: scale(1.04); }
        .blog-card:hover .blog-card-title { color: var(--pr); }
      `}</style>
      <Navbar />
      <main style={{ background: "#fff", minHeight: "100vh" }}>
        <div style={{ maxWidth: "100%", paddingLeft: "var(--pad)", paddingRight: "var(--pad)" }}>
          <div style={{ padding: "48px 0 0" }}>
            <h1 style={{ fontSize: 14, fontWeight: 600, letterSpacing: "0.08em", textTransform: "uppercase", color: "var(--pr)", margin: "0 0 4px" }}>Deni Blog</h1>
            <p style={{ fontSize: 15, color: "var(--muted-text)", margin: "0 0 40px" }}>Stories, guides, and insights about African food and culture</p>
          </div>

          {posts.length === 0 ? (
            <div style={{ textAlign: "center", padding: "80px 20px" }}>
              <div style={{ width: 48, height: 48, borderRadius: "50%", background: "var(--primary-bg)", display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto 16px" }}>
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="var(--pr)" strokeWidth="1.5"><path d="M12 7v10M7 12h10" /></svg>
              </div>
              <h3 style={{ fontSize: 18, fontWeight: 600, color: "var(--ink)", margin: "0 0 6px" }}>No posts yet</h3>
              <p style={{ fontSize: 14, color: "var(--muted-text)", margin: 0 }}>Check back soon for new stories and guides.</p>
            </div>
          ) : (
            <div style={{ paddingBottom: 60 }}>
              <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 32 }}>
                {posts.map((post) => (
                  <Link key={post.id} href={`/blog/${post.slug}`} style={{ textDecoration: "none" }}>
                    <article className="blog-card" style={{ display: "flex", flexDirection: "column" }}>
                      {post.coverImage && (
                        <div style={{ borderRadius: 10, overflow: "hidden", aspectRatio: "16/10", marginBottom: 14, background: "var(--surface-soft)" }}>
                          <img
                            className="blog-card-img"
                            src={post.coverImage}
                            alt={post.title}
                            style={{ width: "100%", height: "100%", objectFit: "cover", transition: "transform 400ms cubic-bezier(0.25, 0.46, 0.45, 0.94)" }}
                          />
                        </div>
                      )}
                      <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 10 }}>
                        <div style={{ width: 24, height: 24, borderRadius: "50%", background: "var(--surface-soft)", color: "var(--ink)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 10, fontWeight: 700 }}>
                          {getInitials(post.author)}
                        </div>
                        <span style={{ fontSize: 12, fontWeight: 600, color: "var(--ink)" }}>{post.author}</span>
                        <span style={{ fontSize: 12, color: "var(--muted-text)" }}>·</span>
                        <span style={{ fontSize: 12, color: "var(--muted-text)" }}>{formatDate(post.createdAt)}</span>
                      </div>
                      <h2 className="blog-card-title" style={{ fontSize: 17, fontWeight: 700, color: "var(--ink)", margin: "0 0 6px", lineHeight: 1.35, letterSpacing: "-0.01em", transition: "color 150ms" }}>{post.title}</h2>
                      <p style={{ fontSize: 13.5, color: "var(--body)", margin: 0, lineHeight: 1.55, display: "-webkit-box", WebkitLineClamp: 2, WebkitBoxOrient: "vertical", overflow: "hidden" }}>{post.excerpt}</p>
                      <span style={{ fontSize: 12, color: "var(--muted-text)", marginTop: 10 }}>{readingTime(post.content)} min read</span>
                    </article>
                  </Link>
                ))}
              </div>
            </div>
          )}
        </div>
      </main>
      <Footer />
    </>
  );
}
