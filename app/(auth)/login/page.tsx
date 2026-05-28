"use client";

import { useState, type FormEvent } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";

const roles = [
  { id: "user", label: "Customer", icon: "🛒", desc: "Shop groceries, track orders, manage your profile" },
  { id: "seller", label: "Seller", icon: "🏪", desc: "List products, manage inventory, view sales" },
  { id: "admin", label: "Admin", icon: "⚙️", desc: "Manage platform, users, orders, and analytics" },
] as const;

const emailMap: Record<string, string> = {
  admin: "admin@kongo.com",
  seller: "seller@akara.com",
  user: "user@kora.com",
};

export default function LoginPage() {
  const router = useRouter();
  const [role, setRole] = useState<string | null>(null);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  function fillDemo(r: string) {
    setRole(r);
    setEmail(emailMap[r]);
    setPassword("password123");
    setError("");
  }

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    if (!role || !email || !password) return;
    setError("");
    setLoading(true);

    try {
      const res = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });

      const json = await res.json();

      if (!json.success) {
        setError(json.error || "Login failed");
        setLoading(false);
        return;
      }

      router.push(json.data.redirect);
    } catch {
      setError("Network error. Please try again.");
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen flex flex-col" style={{ background: "var(--canvas)" }}>
      <div className="flex items-center justify-center px-4 py-12 flex-1">
        <div style={{ width: "100%", maxWidth: 440 }}>
          <Link href="/" style={{ display: "inline-flex", alignItems: "center", gap: 6, fontSize: 13, color: "var(--body)", marginBottom: 24, textDecoration: "none" }}>
            ← Back to home
          </Link>
          <div style={{ background: "#fff", borderRadius: "var(--radius-xl)", boxShadow: "var(--shadow-elevated)", padding: 32 }}>
            <h1 style={{ fontSize: 22, fontWeight: 600, letterSpacing: "-0.03em", color: "var(--ink)", margin: "0 0 4px" }}>Welcome back</h1>
            <p style={{ fontSize: 13, color: "var(--muted-text)", margin: "0 0 24px" }}>Sign in to your NaijaPlate account</p>

            {error && (
              <div style={{ padding: "8px 12px", background: "var(--danger-bg)", color: "var(--danger)", borderRadius: "var(--radius-sm)", fontSize: 12, marginBottom: 16, lineHeight: 1.4 }}>
                {error}
              </div>
            )}

            {!role ? (
              <>
                <p style={{ fontSize: 12, fontWeight: 600, textTransform: "uppercase", letterSpacing: "0.04em", color: "var(--muted-text)", margin: "0 0 12px" }}>I am a...</p>
                <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
                  {roles.map((r) => (
                    <button
                      key={r.id}
                      onClick={() => fillDemo(r.id)}
                      style={{ display: "flex", alignItems: "center", gap: 12, padding: "12px 16px", borderRadius: "var(--radius-lg)", border: "1px solid var(--hairline)", background: "#fff", cursor: "pointer", textAlign: "left", transition: "var(--transition)" }}
                      onMouseEnter={(e) => { e.currentTarget.style.borderColor = "var(--primary)"; e.currentTarget.style.boxShadow = "0 0 0 3px var(--primary-bg)"; }}
                      onMouseLeave={(e) => { e.currentTarget.style.borderColor = "var(--hairline)"; e.currentTarget.style.boxShadow = "none"; }}
                    >
                      <span style={{ fontSize: 24 }}>{r.icon}</span>
                      <div>
                        <div style={{ fontSize: 14, fontWeight: 600, color: "var(--ink)" }}>{r.label}</div>
                        <div style={{ fontSize: 12, color: "var(--muted-text)" }}>{r.desc}</div>
                      </div>
                    </button>
                  ))}
                </div>
              </>
            ) : (
              <form onSubmit={handleSubmit}>
                <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 20 }}>
                  <button type="button" onClick={() => { setRole(null); setError(""); }} style={{ background: "none", border: "none", cursor: "pointer", padding: 0, fontSize: 16, color: "var(--muted-text)" }}>←</button>
                  <span style={{ fontSize: 13, color: "var(--muted-text)" }}>Signing in as <strong style={{ color: "var(--ink)" }}>{roles.find((r) => r.id === role)?.label}</strong></span>
                </div>
                <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
                  <div>
                    <label style={{ fontSize: 12, fontWeight: 600, color: "var(--ink)", marginBottom: 4, display: "block" }}>Email</label>
                    <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} required placeholder="you@example.com" style={{ width: "100%", padding: "8px 12px", fontSize: 13, borderRadius: "var(--radius-md)", border: "1px solid var(--input)", outline: "none", boxSizing: "border-box" }} onFocus={(e) => e.target.style.borderColor = "var(--primary)"} onBlur={(e) => e.target.style.borderColor = "var(--input)"} />
                  </div>
                  <div>
                    <label style={{ fontSize: 12, fontWeight: 600, color: "var(--ink)", marginBottom: 4, display: "block" }}>Password</label>
                    <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} required placeholder="Enter your password" style={{ width: "100%", padding: "8px 12px", fontSize: 13, borderRadius: "var(--radius-md)", border: "1px solid var(--input)", outline: "none", boxSizing: "border-box" }} onFocus={(e) => e.target.style.borderColor = "var(--primary)"} onBlur={(e) => e.target.style.borderColor = "var(--input)"} />
                  </div>
                  <button type="submit" disabled={loading || !email || !password} style={{ padding: "10px 20px", fontSize: 14, fontWeight: 600, borderRadius: "var(--radius-full)", border: "none", background: loading ? "var(--muted-text)" : "var(--primary)", color: "#fff", cursor: loading ? "not-allowed" : "pointer", marginTop: 4 }}>
                    {loading ? "Signing in..." : "Sign in"}
                  </button>
                </div>
              </form>
            )}

            <div style={{ textAlign: "center", marginTop: 20, fontSize: 13, color: "var(--muted-text)" }}>
              Don&apos;t have an account?{" "}
              <Link href="/signup" style={{ color: "var(--primary)", textDecoration: "none", fontWeight: 500 }}>Sign up</Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
