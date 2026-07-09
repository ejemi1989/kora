import { prisma } from "@/lib/prisma";
import Link from "next/link";

export async function BlogSection() {
  const posts = await prisma.blogPost.findMany({
    where: { published: true },
    orderBy: { createdAt: "desc" },
    take: 3,
    select: {
      slug: true,
      title: true,
      excerpt: true,
      coverImage: true,
      author: true,
      createdAt: true,
    },
  });

  if (posts.length === 0) return null;

  return (
    <section style={{ padding: "64px var(--pad)", background: "#fff", borderTop: "1px solid var(--line)" }}>
      <style>{`.blog-card:hover { box-shadow: 0 4px 12px rgba(0,0,0,0.08); }`}</style>
      <div className="mx-auto" style={{ maxWidth: "var(--max)" }}>
        <div style={{ display: "flex", alignItems: "flex-end", justifyContent: "space-between", marginBottom: 24 }}>
          <div>
            <h2 style={{ fontSize: 28, fontWeight: 500, color: "var(--ink-landing)", letterSpacing: "-0.5px", margin: "0 0 4px" }}>From the Blog</h2>
            <p style={{ fontSize: 14, color: "var(--body-landing)", margin: 0 }}>Tips and stories about African food and culture</p>
          </div>
          <Link href="/blog" style={{ fontSize: 13, color: "var(--pr)", fontWeight: 500, textDecoration: "none", whiteSpace: "nowrap" }}>
            View all →
          </Link>
        </div>

        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(280px, 1fr))", gap: 20 }}>
          {posts.map((post) => (
            <Link key={post.slug} href={`/blog/${post.slug}`} style={{ textDecoration: "none" }}>
              <article className="blog-card" style={{ border: "1px solid var(--line)", borderRadius: 10, overflow: "hidden", background: "#fff", transition: "box-shadow 150ms" }}
              >
                {post.coverImage ? (
                  <div style={{ aspectRatio: "16/9", overflow: "hidden", background: "var(--surface-soft)" }}>
                    <img src={post.coverImage} alt={post.title} style={{ width: "100%", height: "100%", objectFit: "cover" }} />
                  </div>
                ) : (
                  <div style={{ aspectRatio: "16/9", background: "var(--surface-soft)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 32 }}>📝</div>
                )}
                <div style={{ padding: 16 }}>
                  <h3 style={{ fontSize: 15, fontWeight: 600, color: "var(--ink-landing)", margin: "0 0 4px", lineHeight: 1.4 }}>{post.title}</h3>
                  <p style={{ fontSize: 12.5, color: "var(--body-landing)", margin: "0 0 8px", lineHeight: 1.5, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{post.excerpt}</p>
                  <div style={{ fontSize: 11, color: "var(--muted-landing)" }}>
                    {post.author} · {new Date(post.createdAt).toLocaleDateString("en-US", { month: "short", day: "numeric" })}
                  </div>
                </div>
              </article>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
