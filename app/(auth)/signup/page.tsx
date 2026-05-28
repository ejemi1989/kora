"use client";

import Link from "next/link";

const roles = [
  { id: "user", label: "Customer", icon: "🛒", desc: "Shop groceries, track orders, manage your profile", href: "/user/overview" },
  { id: "seller", label: "Seller", icon: "🏪", desc: "List products, manage inventory, view sales", href: "/seller/overview" },
  { id: "admin", label: "Admin", icon: "⚙️", desc: "Manage platform, users, orders, and analytics", href: "/admin/overview" },
] as const;

export default function SignupPage() {
  return (
    <div className="min-h-screen flex flex-col" style={{ background: "var(--canvas)" }}>
      <div className="flex items-center justify-center px-4 py-12 flex-1">
        <div style={{ width: "100%", maxWidth: 440 }}>
          <Link href="/" style={{ display: "inline-flex", alignItems: "center", gap: 6, fontSize: 13, color: "var(--body)", marginBottom: 24, textDecoration: "none" }}>
            ← Back to home
          </Link>
          <div style={{ background: "#fff", borderRadius: "var(--radius-xl)", boxShadow: "var(--shadow-elevated)", padding: 32 }}>
            <h1 style={{ fontSize: 22, fontWeight: 600, letterSpacing: "-0.03em", color: "var(--ink)", margin: "0 0 4px" }}>Create your account</h1>
            <p style={{ fontSize: 13, color: "var(--muted-text)", margin: "0 0 24px" }}>Choose your path to get started</p>

            <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
              {roles.map((r) => (
                <Link
                  key={r.id}
                  href={r.href}
                  style={{ display: "flex", alignItems: "center", gap: 12, padding: "14px 16px", borderRadius: "var(--radius-lg)", border: "1px solid var(--hairline)", background: "#fff", textDecoration: "none", textAlign: "left", transition: "var(--transition)", color: "inherit" }}
                  onMouseEnter={(e) => { e.currentTarget.style.borderColor = "var(--primary)"; e.currentTarget.style.boxShadow = "0 0 0 3px var(--primary-bg)"; }}
                  onMouseLeave={(e) => { e.currentTarget.style.borderColor = "var(--hairline)"; e.currentTarget.style.boxShadow = "none"; }}
                >
                  <span style={{ fontSize: 28 }}>{r.icon}</span>
                  <div style={{ flex: 1 }}>
                    <div style={{ fontSize: 15, fontWeight: 600, color: "var(--ink)" }}>{r.label}</div>
                    <div style={{ fontSize: 12, color: "var(--muted-text)" }}>{r.desc}</div>
                  </div>
                  <span style={{ fontSize: 11, color: "var(--muted-text)" }}>↗</span>
                </Link>
              ))}
            </div>

            <div style={{ textAlign: "center", marginTop: 20, fontSize: 13, color: "var(--muted-text)" }}>
              Already have an account?{" "}
              <Link href="/login" style={{ color: "var(--primary)", textDecoration: "none", fontWeight: 500 }}>Sign in</Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
