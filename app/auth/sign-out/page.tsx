"use client"

import { useClerk } from "@clerk/nextjs"
import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"

export default function SignOutPage() {
  const { signOut } = useClerk()
  const router = useRouter()
  const [done, setDone] = useState(false)

  useEffect(() => {
    signOut().then(() => {
      setDone(true)
      setTimeout(() => router.push("/"), 2000)
    })
  }, [signOut, router])

  if (done) {
    return (
      <div className="min-h-screen flex items-center justify-center" style={{ background: "var(--canvas)" }}>
        <div style={{ textAlign: "center" }}>
          <span style={{ fontSize: 48, display: "block", marginBottom: 16 }}>👋</span>
          <h1 style={{ fontSize: 22, fontWeight: 700, color: "var(--ink)", margin: "0 0 4px" }}>Signed out</h1>
          <p style={{ fontSize: 14, color: "var(--muted-text)", margin: 0 }}>Redirecting you home...</p>
          <Link href="/" style={{ display: "inline-block", marginTop: 16, fontSize: 13, color: "var(--primary)", textDecoration: "none" }}>Go home now</Link>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen flex items-center justify-center" style={{ background: "var(--canvas)" }}>
      <p style={{ fontSize: 14, color: "var(--muted-text)" }}>Signing out...</p>
    </div>
  )
}
