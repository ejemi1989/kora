import { prisma } from "@/lib/prisma";
import { Navbar } from "@/components/landing/Navbar";
import { Footer } from "@/components/landing/Footer";
import Link from "next/link";

export const metadata = {
  title: "Blog — Deni",
  description: "Tips, guides, and stories about African food, culture, and buying from the diaspora.",
};

export default async function BlogListing() {
  const posts = await prisma.blogPost.findMany({
    where: { published: true },
    orderBy: { createdAt: "desc" },
  });

  return (
    <>
      <Navbar />
      <main>
        <section style={{ padding: "60px var(--pad) 40px", background: "#fff", borderBottom: "1px solid var(--line)" }}>
          <div className="mx-auto text-center" style={{ maxWidth: "var(--max)" }}>
            <h1 style={{ fontSize: 42, fontWeight: 400, letterSpacing: "-1.2px", lineHeight: "48px", color: "var(--pr)", marginBottom: 12 }}>Deni Blog</h1>
            <p style={{ fontSize: 16, color: "var(--body-landing)", maxWidth: 520, margin: "0 auto" }}>
              Tips, guides, and stories about African food and culture
            </p>
          </div>
        </section>

        <section style={{ padding: "60px var(--pad)", background: "#fff" }}>
          <div className="mx-auto" style={{ maxWidth: "var(--max)" }}>
            {posts.length === 0 ? (
              <div style={{ textAlign: "center", padding: "60px 20px" }}>
                <div style={{ fontSize: 36, marginBottom: 8 }}>📝</div>
                <h3 style={{ fontSize: 16, fontWeight: 500, color: "var(--ink-landing)", margin: "0 0 4px" }}>No posts yet</h3>
                <p style={{ fontSize: 14, color: "var(--body-landing)", margin: 0 }}>Check back soon for new stories and guides.</p>
              </div>
            ) : (
              <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(320px, 1fr))", gap: 24 }}>
                {posts.map((post) => (
                  <Link key={post.id} href={`/blog/${post.slug}`} style={{ textDecoration: "none" }}>
                    <article style={{ border: "1px solid var(--line)", borderRadius: 12, overflow: "hidden", background: "#fff", transition: "box-shadow 150ms" }}
                      onMouseEnter={(e) => { e.currentTarget.style.boxShadow = "0 4px 12px rgba(0,0,0,0.08)"; }}
                      onMouseLeave={(e) => { e.currentTarget.style.boxShadow = "none"; }}
                    >
                      {post.coverImage && (
                        <div style={{ aspectRatio: "16/9", overflow: "hidden", background: "var(--surface-soft)" }}>
                          <img src={post.coverImage} alt={post.title} style={{ width: "100%", height: "100%", objectFit: "cover" }} />
                        </div>
                      )}
                      <div style={{ padding: 20 }}>
                        <h2 style={{ fontSize: 17, fontWeight: 600, color: "var(--ink-landing)", margin: "0 0 6px", lineHeight: 1.4 }}>{post.title}</h2>
                        <p style={{ fontSize: 13.5, color: "var(--body-landing)", margin: "0 0 12px", lineHeight: 1.5 }}>{post.excerpt}</p>
                        <div style={{ display: "flex", alignItems: "center", gap: 8, fontSize: 12, color: "var(--muted-landing)" }}>
                          <span>{post.author}</span>
                          <span>·</span>
                          <time>{new Date(post.createdAt).toLocaleDateString("en-US", { year: "numeric", month: "long", day: "numeric" })}</time>
                        </div>
                      </div>
                    </article>
                  </Link>
                ))}
              </div>
            )}
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}
