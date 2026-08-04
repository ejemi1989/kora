"use client";

import { useState, useEffect } from "react";
import { PlusIcon, XIcon, FileIcon } from "@/components/user/icons";

interface BlogPost {
  id: string;
  title: string;
  slug: string;
  excerpt: string;
  content: string;
  coverImage: string | null;
  author: string;
  published: boolean;
  createdAt: string;
}

type EditorState = { open: boolean; post?: BlogPost };

export function BlogPage() {
  const [posts, setPosts] = useState<BlogPost[]>([]);
  const [loading, setLoading] = useState(true);
  const [editor, setEditor] = useState<EditorState>({ open: false });
  const [saving, setSaving] = useState(false);

  async function load() {
    setLoading(true);
    try {
      const r = await fetch("/api/admin/blog");
      const d = await r.json();
      if (Array.isArray(d)) setPosts(d);
    } catch {}
    setLoading(false);
  }

  useEffect(() => { load(); }, []);

  async function save(form: Partial<BlogPost> & { title: string; slug: string; excerpt: string; content: string; author: string }) {
    setSaving(true);
    try {
      const url = "/api/admin/blog";
      const method = form.id ? "PATCH" : "POST";
      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      if (res.ok) {
        await load();
        setEditor({ open: false });
      } else {
        const err = await res.json();
        alert(err.error || "Failed to save");
      }
    } catch {
      alert("Failed to save");
    }
    setSaving(false);
  }

  async function remove(id: string) {
    if (!confirm("Delete this post?")) return;
    try {
      await fetch(`/api/admin/blog?id=${id}`, { method: "DELETE" });
      await load();
    } catch {}
  }

  function slugify(title: string) {
    return title.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "");
  }

  function openNew() {
    setEditor({ open: true });
  }

  function openEdit(post: BlogPost) {
    setEditor({ open: true, post });
  }

  function close() {
    setEditor({ open: false });
  }

  return (
    <div>
      <style>{`
        .page-h { font-size:20px; font-weight:600; color:var(--ink); letter-spacing:-0.03em; margin:0 0 4px; }
        .page-sub { font-size:13px; color:var(--muted-text); margin:0 0 20px; display:flex; align-items:center; justify-content:space-between; }
        .blog-table { width:100%; border-collapse:collapse; background:#fff; border-radius:8px; overflow:hidden; box-shadow:var(--shadow-card); }
        .blog-table th { text-align:left; padding:10px 14px; font-size:11px; font-weight:600; color:var(--ash); text-transform:uppercase; letter-spacing:0.05em; border-bottom:1px solid var(--hairline); background:var(--canvas); }
        .blog-table td { padding:10px 14px; font-size:13px; color:var(--body); border-bottom:1px solid var(--hairline); }
        .blog-table tr:hover td { background:var(--primary-bg); }
        .status-badge { display:inline-block; padding:2px 8px; border-radius:999px; font-size:10px; font-weight:600; }
        .status-published { background:#d4edda; color:#155724; }
        .status-draft { background:#fff3cd; color:#856404; }
        .btn-sm { padding:4px 10px; border-radius:4px; border:none; font-size:11px; cursor:pointer; }
        .btn-primary { background:var(--primary); color:#fff; }
        .btn-ghost { background:transparent; color:var(--muted-text); }
        .btn-ghost:hover { color:var(--danger); }
        .editor-overlay { position:fixed; inset:0; background:rgba(23,23,23,0.3); backdrop-filter:blur(2px); z-index:200; display:flex; align-items:flex-start; justify-content:center; padding:40px 16px; overflow-y:auto; }
        .editor-modal { background:#fff; border-radius:12px; max-width:700px; width:100%; box-shadow:var(--shadow-modal); }
        .editor-h { display:flex; align-items:center; justify-content:space-between; padding:16px 20px; border-bottom:1px solid var(--hairline); }
        .editor-h h2 { font-size:15px; font-weight:600; color:var(--ink); margin:0; }
        .editor-close { width:28px; height:28px; border-radius:6px; border:none; background:none; cursor:pointer; display:flex; align-items:center; justify-content:center; color:var(--muted-text); }
        .editor-close:hover { background:var(--surface-soft); }
        .editor-b { padding:20px; display:flex; flex-direction:column; gap:14px; }
        .field { display:flex; flex-direction:column; gap:4px; }
        .field label { font-size:12px; font-weight:600; color:var(--ink); }
        .field input,.field textarea,.field select { padding:8px 10px; border:1px solid var(--hairline); border-radius:6px; font-size:13px; outline:none; font-family:var(--font-sans); }
        .field input:focus,.field textarea:focus { border-color:var(--primary); box-shadow:0 0 0 3px var(--primary-bg); }
        .field textarea { min-height:200px; resize:vertical; line-height:1.6; font-family:var(--font-mono); font-size:12px; }
        .editor-actions { display:flex; justify-content:flex-end; gap:8px; margin-top:4px; }
        .empty-state { text-align:center; padding:64px 24px; background:#fff; border-radius:8px; box-shadow:var(--shadow-card); }
        .empty-state svg { color:var(--stone); margin-bottom:12px; }
        .empty-state h3 { font-size:15px; font-weight:500; color:var(--ink); margin:0 0 4px; }
        .empty-state p { font-size:13px; color:var(--muted-text); margin:0 0 16px; }
      `}</style>

      <div className="page-h">Blog Posts</div>
      <div className="page-sub">
        <span>Create and manage SEO blog content</span>
        <button className="btn-sm btn-primary" onClick={openNew}>
          <span style={{ display:"flex", alignItems:"center", gap:4 }}><PlusIcon size={12} /> New Post</span>
        </button>
      </div>

      {loading ? (
        <div style={{ textAlign:"center", padding:40, color:"var(--muted-text)", fontSize:13 }}>Loading...</div>
      ) : posts.length === 0 ? (
        <div className="empty-state">
          <FileIcon size={40} />
          <h3>No blog posts yet</h3>
          <p>Create your first post to improve SEO and engage customers</p>
          <button className="btn-sm btn-primary" onClick={openNew} style={{ padding:"8px 16px" }}>
            <span style={{ display:"flex", alignItems:"center", gap:4 }}><PlusIcon size={12} /> Create Post</span>
          </button>
        </div>
      ) : (
        <table className="blog-table">
          <thead>
            <tr>
              <th>Title</th>
              <th>Author</th>
              <th>Status</th>
              <th>Date</th>
              <th></th>
            </tr>
          </thead>
          <tbody>
            {posts.map((post) => (
              <tr key={post.id}>
                <td style={{ fontWeight:500, color:"var(--ink)" }}>
                  {post.title}
                  <div style={{ fontSize:11, color:"var(--ash)" }}>{post.slug}</div>
                </td>
                <td>{post.author}</td>
                <td>
                  <span className={`status-badge ${post.published ? "status-published" : "status-draft"}`}>
                    {post.published ? "Published" : "Draft"}
                  </span>
                </td>
                <td style={{ fontSize:12, color:"var(--ash)" }}>
                  {new Date(post.createdAt).toLocaleDateString()}
                </td>
                <td>
                  <div style={{ display:"flex", gap:4 }}>
                    <button className="btn-sm btn-primary" style={{ background:"var(--surface-soft)", color:"var(--body)" }} onClick={() => openEdit(post)}>Edit</button>
                    <button className="btn-sm btn-ghost" onClick={() => remove(post.id)}>Delete</button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}

      {editor.open && <BlogEditor post={editor.post} onSave={save} onClose={close} saving={saving} slugify={slugify} />}
    </div>
  );
}

function BlogEditor({
  post, onSave, onClose, saving, slugify,
}: {
  post?: BlogPost;
  onSave: (f: Partial<BlogPost> & { title: string; slug: string; excerpt: string; content: string; author: string }) => void;
  onClose: () => void;
  saving: boolean;
  slugify: (s: string) => string;
}) {
  const [f, setF] = useState({
    id: post?.id || "",
    title: post?.title || "",
    slug: post?.slug || "",
    excerpt: post?.excerpt || "",
    content: post?.content || "",
    coverImage: post?.coverImage || "",
    author: post?.author || "",
    published: post?.published ?? true,
  });
  const [uploading, setUploading] = useState(false);

  function set<K extends keyof typeof f>(k: K, v: (typeof f)[K]) {
    setF((prev) => ({ ...prev, [k]: v }));
  }

  function handleTitle(val: string) {
    setF((prev) => ({
      ...prev,
      title: val,
      slug: prev.id ? prev.slug : slugify(val),
    }));
  }

  async function handleUpload(file: File, target: "cover" | "content") {
    if (file.size > 5 * 1024 * 1024) {
      alert("File too large. Maximum size is 5MB.");
      return;
    }
    setUploading(true);
    const formData = new FormData();
    formData.append("file", file);
    try {
      const res = await fetch("/api/admin/upload", { method: "POST", body: formData });
      const data = await res.json();
      if (!res.ok) {
        alert(data.error || "Upload failed");
        return;
      }
      if (data.url) {
        if (target === "cover") {
          set("coverImage", data.url);
        } else {
          const imgTag = `<img src="${data.url}" alt="" style="max-width:100%;border-radius:8px;margin:16px 0" />`;
          setF((prev) => ({
            ...prev,
            content: prev.content + (prev.content ? "\n\n" : "") + imgTag,
          }));
        }
      }
    } catch {
      alert("Upload failed. Check your connection and try again.");
    } finally {
      setUploading(false);
    }
  }

  return (
    <div className="editor-overlay" onClick={onClose}>
      <div className="editor-modal" onClick={(e) => e.stopPropagation()}>
        <div className="editor-h">
          <h2>{post ? "Edit Post" : "New Post"}</h2>
          <button className="editor-close" onClick={onClose}><XIcon size={16} /></button>
        </div>
        <div className="editor-b">
          <div className="field">
            <label>Title</label>
            <input value={f.title} onChange={(e) => handleTitle(e.target.value)} placeholder="Post title" />
          </div>
          <div className="field">
            <label>Slug</label>
            <input value={f.slug} onChange={(e) => set("slug", e.target.value)} placeholder="post-url-slug" />
          </div>
          <div className="field">
            <label>Author</label>
            <input value={f.author} onChange={(e) => set("author", e.target.value)} placeholder="Author name" />
          </div>
          <div className="field">
            <label>Cover Image</label>
            <div style={{ display: "flex", gap: 6, alignItems: "center" }}>
              <input value={f.coverImage} onChange={(e) => set("coverImage", e.target.value)} placeholder="Paste URL or upload" style={{ flex: 1 }} />
              <label style={{ padding:"6px 10px", borderRadius:4, background:"var(--surface-soft)", color: uploading ? "var(--muted-text)" : "var(--body)", fontSize:11, cursor: uploading ? "not-allowed" : "pointer", whiteSpace:"nowrap", border:"1px solid var(--hairline)", opacity: uploading ? 0.6 : 1 }}>
                {uploading ? "Uploading..." : "Upload"}
                <input type="file" accept="image/*" style={{ display:"none" }} disabled={uploading} onChange={(e) => { const f2 = e.target.files?.[0]; if (f2) handleUpload(f2, "cover"); e.target.value = ""; }} />
              </label>
            </div>
            {f.coverImage && (
              <div style={{ marginTop:6, borderRadius:6, overflow:"hidden", maxHeight:120, background:"var(--surface-soft)" }}>
                <img src={f.coverImage} alt="" style={{ width:"100%", height:100, objectFit:"cover" }} />
              </div>
            )}
          </div>
          <div className="field">
            <label>Excerpt</label>
            <textarea
              value={f.excerpt}
              onChange={(e) => set("excerpt", e.target.value)}
              placeholder="Short description for previews and SEO"
              style={{ minHeight: 60 }}
            />
          </div>
          <div className="field">
            <label>Content (HTML or Markdown)</label>
            <div style={{ marginBottom:6 }}>
              <label style={{ padding:"5px 10px", borderRadius:4, background:"var(--surface-soft)", color: uploading ? "var(--muted-text)" : "var(--body)", fontSize:11, cursor: uploading ? "not-allowed" : "pointer", border:"1px solid var(--hairline)", display:"inline-flex", alignItems:"center", gap:4, opacity: uploading ? 0.6 : 1 }}>
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} width={12} height={12}><rect x="3" y="3" width="18" height="18" rx="2" /><circle cx="8.5" cy="8.5" r="1.5" /><path d="M21 15l-5-5L5 21" /></svg>
                {uploading ? "Uploading..." : "Insert Image"}
                <input type="file" accept="image/*" style={{ display:"none" }} disabled={uploading} onChange={(e) => { const f2 = e.target.files?.[0]; if (f2) handleUpload(f2, "content"); e.target.value = ""; }} />
              </label>
            </div>
            <textarea
              value={f.content}
              onChange={(e) => set("content", e.target.value)}
              placeholder="Full post content..."
            />
          </div>
          <div className="field" style={{ flexDirection: "row", alignItems: "center", gap: 8 }}>
            <input type="checkbox" id="pub" checked={f.published} onChange={(e) => set("published", e.target.checked)} style={{ width: 16, height: 16 }} />
            <label htmlFor="pub" style={{ margin: 0 }}>Published</label>
          </div>
          <div className="editor-actions">
            <button className="btn-sm" style={{ background:"var(--surface-soft)", color:"var(--body)", padding:"8px 16px" }} onClick={onClose}>Cancel</button>
            <button className="btn-sm btn-primary" style={{ padding:"8px 16px", opacity: saving ? 0.6 : 1 }} disabled={saving} onClick={() => onSave(f)}>
              {saving ? "Saving..." : post ? "Update" : "Create"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
