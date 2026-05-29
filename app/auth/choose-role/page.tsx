"use client"

import { useRouter } from "next/navigation"
import { useAuth, useUser } from "@clerk/nextjs"
import { useEffect, useState } from "react"
import Link from "next/link"

const roles = [
  {
    id: "CUSTOMER",
    label: "Customer",
    desc: "Browse shops, order food, track deliveries",
    emoji: "🛒",
    dashboard: "/user/overview",
  },
  {
    id: "SELLER",
    label: "Seller",
    desc: "List products, manage orders, grow your business",
    emoji: "🏪",
    dashboard: "/seller/overview",
  },
  {
    id: "ADMIN",
    label: "Admin",
    desc: "Manage platform, users, and analytics",
    emoji: "⚙️",
    dashboard: "/admin/overview",
  },
]

export default function ChooseRolePage() {
  const router = useRouter()
  const { isSignedIn } = useAuth()
  const { user } = useUser()
  const [saving, setSaving] = useState(false)

  useEffect(() => {
    if (!isSignedIn) router.push("/sign-in")
  }, [isSignedIn, router])

  async function selectRole(roleId: string, dashboard: string) {
    if (!user) return
    setSaving(true)
    try {
      await user.update({ unsafeMetadata: { role: roleId } })
      router.push(dashboard)
    } catch {
      setSaving(false)
    }
  }

  if (!isSignedIn || !user) return null

  return (
    <div className="min-h-screen flex items-center justify-center" style={{ background: "var(--canvas)", padding: 24 }}>
      <div style={{ width: "100%", maxWidth: 480 }}>
        <div style={{ marginBottom: 32, textAlign: "center" }}>
          <Link href="/" style={{ display: "inline-flex", alignItems: "center", gap: 8, textDecoration: "none", marginBottom: 24 }}>
            <span style={{ width: 28, height: 28, borderRadius: 6, background: "var(--primary)", display: "flex", alignItems: "center", justifyContent: "center", color: "#fff", fontWeight: 700, fontSize: 14 }}>N</span>
            <span style={{ color: "var(--ink)", fontSize: 16, fontWeight: 600, letterSpacing: "-0.03em" }}>Kora</span>
          </Link>
          <h1 style={{ fontSize: 22, fontWeight: 700, letterSpacing: "-0.03em", color: "var(--ink)", margin: 0 }}>Welcome to Kora!</h1>
          <p style={{ fontSize: 14, color: "var(--muted-text)", marginTop: 4 }}>Tell us about yourself</p>
        </div>

        <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
          {roles.map((r) => (
            <button
              key={r.id}
              onClick={() => selectRole(r.id, r.dashboard)}
              disabled={saving}
              style={{
                display: "flex", alignItems: "center", gap: 14,
                padding: "14px 18px",
                borderRadius: "var(--radius-lg)",
                border: "1px solid var(--hairline)",
                background: "#fff",
                cursor: saving ? "not-allowed" : "pointer",
                textAlign: "left",
                transition: "var(--transition)",
                opacity: saving ? 0.6 : 1,
              }}
              onMouseEnter={(e) => { e.currentTarget.style.borderColor = "var(--primary)"; e.currentTarget.style.boxShadow = "0 0 0 3px var(--primary-bg)"; }}
              onMouseLeave={(e) => { e.currentTarget.style.borderColor = "var(--hairline)"; e.currentTarget.style.boxShadow = "none"; }}
            >
              <span style={{ fontSize: 28 }}>{r.emoji}</span>
              <div>
                <div style={{ fontSize: 15, fontWeight: 600, color: "var(--ink)" }}>{r.label}</div>
                <div style={{ fontSize: 13, color: "var(--muted-text)" }}>{r.desc}</div>
              </div>
            </button>
          ))}
        </div>

        <p style={{ textAlign: "center", marginTop: 20, fontSize: 12, color: "var(--muted-text)" }}>
          You can change this later in your settings
        </p>
      </div>
    </div>
  )
}
