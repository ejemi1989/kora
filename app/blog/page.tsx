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

  const featured = posts[0];
  const rest = posts.slice(1);

  return (
    <>
      <style>{`
        .blog-hero-card:hover .blog-hero-img { transform: scale(1.03); }
        .blog-grid-card:hover .blog-grid-img { transform: scale(1.04); }
        .blog-grid-card:hover .blog-grid-title { color: var(--pr); }
      `}</style>
      <Navbar />
      <main style={{ background: "#fff", minHeight: "100vh" }}>
        <div style={{ maxWidth: 1080, margin: "0 auto", padding: "0 var(--pad)" }}>
          <div style={{ padding: "48px 0 0", borderBottom: "1px solid var(--hairline)" }}>
            <h1 style={{ fontSize: 14, fontWeight: 600, letterSpacing: "0.08em", textTransform: "uppercase", color: "var(--pr)", margin: "0 0 4px" }}>Deni Blog</h1>
            <p style={{ fontSize: 15, color: "var(--muted-text)", margin: "0 0 32px" }}>Stories, guides, and insights about African food and culture</p>
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
            <>
              {featured && (
                <Link href={`/blog/${featured.slug}`} style={{ textDecoration: "none", display: "block", padding: "40px 0", borderBottom: "1px solid var(--hairline)" }}>
                  <article className="blog-hero-card" style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 40, alignItems: "center" }}>
                    {featured.coverImage && (
                      <div style={{ borderRadius: 12, overflow: "hidden", aspectRatio: "16/10", background: "var(--surface-soft)" }}>
                        <img
                          className="blog-hero-img"
                          src={featured.coverImage}
                          alt={featured.title}
                          style={{ width: "100%", height: "100%", objectFit: "cover", transition: "transform 400ms cubic-bezier(0.25, 0.46, 0.45, 0.94)" }}
                        />
                      </div>
                    )}
                    <div>
                      <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 14 }}>
                        <div style={{ width: 32, height: 32, borderRadius: "50%", background: "var(--pr)", color: "#fff", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 12, fontWeight: 700, letterSpacing: "0.02em" }}>
                          {getInitials(featured.author)}
                        </div>
                        <div>
                          <span style={{ fontSize: 13, fontWeight: 600, color: "var(--ink)" }}>{featured.author}</span>
                          <div style={{ display: "flex", alignItems: "center", gap: 6, fontSize: 12, color: "var(--muted-text)", marginTop: 1 }}>
                            <time>{formatDate(featured.createdAt)}</time>
                            <span>·</span>
                            <span>{readingTime(featured.content)} min read</span>
                          </div>
                        </div>
                      </div>
                      <h2 style={{ fontSize: 26, fontWeight: 700, color: "var(--ink)", margin: "0 0 10px", lineHeight: 1.25, letterSpacing: "-0.02em" }}>{featured.title}</h2>
                      <p style={{ fontSize: 15, color: "var(--body)", margin: 0, lineHeight: 1.6, display: "-webkit-box", WebkitLineClamp: 3, WebkitBoxOrient: "vertical", overflow: "hidden" }}>{featured.excerpt}</p>
                    </div>
                  </article>
                </Link>
              )}

              {rest.length > 0 && (
                <div style={{ padding: "40px 0 60px" }}>
                  <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 32 }}>
                    {rest.map((post) => (
                      <Link key={post.id} href={`/blog/${post.slug}`} style={{ textDecoration: "none" }}>
                        <article className="blog-grid-card" style={{ display: "flex", flexDirection: "column" }}>
                          {post.coverImage && (
                            <div style={{ borderRadius: 10, overflow: "hidden", aspectRatio: "16/10", marginBottom: 14, background: "var(--surface-soft)" }}>
                              <img
                                className="blog-grid-img"
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
                          <h3 className="blog-grid-title" style={{ fontSize: 17, fontWeight: 700, color: "var(--ink)", margin: "0 0 6px", lineHeight: 1.35, letterSpacing: "-0.01em", transition: "color 150ms" }}>{post.title}</h3>
                          <p style={{ fontSize: 13.5, color: "var(--body)", margin: 0, lineHeight: 1.55, display: "-webkit-box", WebkitLineClamp: 2, WebkitBoxOrient: "vertical", overflow: "hidden" }}>{post.excerpt}</p>
                          <span style={{ fontSize: 12, color: "var(--muted-text)", marginTop: 10 }}>{readingTime(post.content)} min read</span>
                        </article>
                      </Link>
                    ))}
                  </div>
                </div>
              )}
            </>
          )}
        </div>
      </main>
      <Footer />
    </>
  );
}
