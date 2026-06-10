import Image from "next/image";
import Link from "next/link";
import { Navbar } from "@/components/landing/Navbar";
import { Footer } from "@/components/landing/Footer";

export default function ContactPage() {
  return (
    <>
      <Navbar />
      <section className="relative overflow-hidden" style={{ padding: "80px var(--pad) 60px", background: "#fff" }}>
        <div className="pointer-events-none absolute inset-0 z-0" style={{ opacity: 0.4 }}>
          <Image src="/images/node-79.png" alt="" fill className="object-cover" priority />
        </div>
        <div className="relative z-10 mx-auto" style={{ maxWidth: "var(--max)", textAlign: "center" }}>
          <h1 className="hero-headline" style={{ fontSize: "54.8px", fontWeight: 400, letterSpacing: "-1.2px", lineHeight: "60px", color: "var(--pr)", marginBottom: "12px" }}>
            Contact us
          </h1>
          <p style={{ fontSize: "17.3px", fontWeight: 500, lineHeight: "27px", color: "var(--sub)", maxWidth: "500px", margin: "0 auto 8px" }}>
            We would love to hear from you. Get in touch with our team.
          </p>
          <p style={{ fontSize: "13px", color: "var(--body-landing)", maxWidth: "400px", margin: "0 auto" }}>
            Reach out and we will get back to you as soon as possible.
          </p>
        </div>
      </section>

      <section style={{ padding: "0 var(--pad) 80px", background: "#fff" }}>
        <div className="mx-auto" style={{ maxWidth: "var(--max)" }}>
          <div className="mx-auto" style={{ maxWidth: "720px" }}>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))", gap: "24px", marginBottom: "48px" }}>
              <div style={{ textAlign: "center", padding: "32px 20px", border: "1px solid var(--line)", borderRadius: "12px" }}>
                <div style={{ fontSize: "24px", marginBottom: "8px" }}>&#9993;</div>
                <h3 style={{ fontSize: "15px", fontWeight: 600, color: "var(--ink-landing)", marginBottom: "4px" }}>Email</h3>
                <p style={{ fontSize: "13px", color: "var(--body-landing)" }}>hello@deni.com</p>
              </div>
              <div style={{ textAlign: "center", padding: "32px 20px", border: "1px solid var(--line)", borderRadius: "12px" }}>
                <div style={{ fontSize: "24px", marginBottom: "8px" }}>&#9742;</div>
                <h3 style={{ fontSize: "15px", fontWeight: 600, color: "var(--ink-landing)", marginBottom: "4px" }}>Phone</h3>
                <p style={{ fontSize: "13px", color: "var(--body-landing)" }}>+1 (555) 123-4567</p>
              </div>
              <div style={{ textAlign: "center", padding: "32px 20px", border: "1px solid var(--line)", borderRadius: "12px" }}>
                <div style={{ fontSize: "24px", marginBottom: "8px" }}>&#128205;</div>
                <h3 style={{ fontSize: "15px", fontWeight: 600, color: "var(--ink-landing)", marginBottom: "4px" }}>Address</h3>
                <p style={{ fontSize: "13px", color: "var(--body-landing)" }}>Lagos, Nigeria</p>
              </div>
            </div>
            <div style={{ border: "1px solid var(--line)", borderRadius: "12px", padding: "40px" }}>
              <h2 style={{ fontSize: "20px", fontWeight: 600, color: "var(--ink-landing)", marginBottom: "20px" }}>Send us a message</h2>
              <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "12px" }}>
                  <input type="text" placeholder="Your name" style={{ height: "40px", border: "1px solid var(--line)", borderRadius: "8px", padding: "0 12px", fontSize: "13px", outline: "none" }} />
                  <input type="email" placeholder="Your email" style={{ height: "40px", border: "1px solid var(--line)", borderRadius: "8px", padding: "0 12px", fontSize: "13px", outline: "none" }} />
                </div>
                <input type="text" placeholder="Subject" style={{ height: "40px", border: "1px solid var(--line)", borderRadius: "8px", padding: "0 12px", fontSize: "13px", outline: "none" }} />
                <textarea placeholder="Your message" rows={5} style={{ border: "1px solid var(--line)", borderRadius: "8px", padding: "12px", fontSize: "13px", outline: "none", resize: "vertical" }} />
                <button type="submit" style={{ alignSelf: "flex-start", background: "var(--pr)", color: "#fff", padding: "10px 24px", borderRadius: "var(--radius-xs)", fontSize: 13, fontWeight: 520, border: "none", cursor: "pointer" }}>
                  Send message
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </>
  );
}
