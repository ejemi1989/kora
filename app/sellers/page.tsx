import Image from "next/image";
import Link from "next/link";
import { Navbar } from "@/components/landing/Navbar";
import { Footer } from "@/components/landing/Footer";

const benefits = [
  {
    img: "step-1.png",
    title: "Reach More Customers",
    desc: "Connect with Africans in the diaspora and local buyers looking for authentic African products.",
  },
  {
    img: "step-2.png",
    title: "Easy Management",
    desc: "Simple dashboard to manage your products, track orders, and handle payments in one place.",
  },
  {
    img: "step-3.png",
    title: "Secure Payments",
    desc: "We handle payment processing so you get paid on time, every time. Full buyer protection included.",
  },
  {
    img: "step-4.png",
    title: "Fast Delivery Network",
    desc: "Our logistics partners ensure your products reach customers fresh and on time, anywhere.",
  },
];

const steps = [
  { num: "01", title: "Create your account", desc: "Sign up as a seller and set up your store profile in minutes." },
  { num: "02", title: "List your products", desc: "Upload product photos, set prices, and manage inventory from your dashboard." },
  { num: "03", title: "Receive orders", desc: "Get notified when customers place orders and prepare them for dispatch." },
  { num: "04", title: "Get paid", desc: "Receive payments directly to your account. Track your earnings in real time." },
];

export default function SellersPage() {
  return (
    <>
      <Navbar />
      {/* Hero */}
      <section className="relative overflow-hidden" style={{ padding: "80px var(--pad) 80px", background: "#fff" }}>
        <div className="pointer-events-none absolute inset-0 z-0" style={{ opacity: 0.4 }}>
          <Image src="/images/node-79.png" alt="" fill className="object-cover" priority />
        </div>
        <div className="relative z-10 mx-auto" style={{ maxWidth: "var(--max)" }}>
          <div className="hero-row flex items-center" style={{ gap: "60px" }}>
            <div className="w-full md:basis-[42%] md:max-w-[42%]">
              <h1 className="hero-headline" style={{ fontSize: "54.8px", fontWeight: 400, letterSpacing: "-1.2px", lineHeight: "60px", color: "var(--pr)", marginBottom: "16px" }}>
                Sell on BIUK
              </h1>
              <p style={{ fontSize: "17.3px", fontWeight: 500, lineHeight: "27px", color: "var(--sub)", maxWidth: "400px", marginBottom: "12px" }}>
                Turn your African products into a thriving business. Join hundreds of sellers reaching customers worldwide.
              </p>
              <p style={{ fontSize: "13px", color: "var(--body-landing)", marginBottom: "28px" }}>
                No upfront fees. Start selling today.
              </p>
              <Link href="/sign-up" style={{ display: "inline-block", background: "var(--pr)", color: "#fff", padding: "12px 28px", borderRadius: "var(--radius-xs)", fontSize: 14, fontWeight: 520, cursor: "pointer", textDecoration: "none" }}>
                Become a seller
              </Link>
            </div>
            <div className="w-full md:flex-1">
              <Image src="/images/step-1.png" alt="African seller" width={800} height={600} className="w-full h-auto" style={{ borderRadius: "19px" }} priority />
            </div>
          </div>
        </div>
      </section>

      {/* Benefits */}
      <section className="relative overflow-hidden" style={{ padding: "60px var(--pad) 80px", background: "#fff" }}>
        <div className="pointer-events-none absolute z-0 hidden lg:block" style={{ left: "-60px", top: 0, width: "340px", height: "100%", opacity: 0.4 }}>
          <Image src="/images/node-91.png" alt="" fill className="object-cover" sizes="340px" />
        </div>
        <div className="pointer-events-none absolute z-0 hidden lg:block" style={{ right: "-60px", top: 0, width: "340px", height: "100%", opacity: 0.4 }}>
          <Image src="/images/node-92.png" alt="" fill className="object-cover" sizes="340px" />
        </div>
        <div className="relative z-10 mx-auto" style={{ maxWidth: "var(--max)" }}>
          <h2 style={{ fontSize: "32px", fontWeight: 700, color: "var(--pr)", textAlign: "center", marginBottom: "6px" }}>
            Why Sell With Us
          </h2>
          <p style={{ fontSize: "13px", color: "var(--body-landing)", textAlign: "center", marginBottom: "40px" }}>
            Everything you need to grow your business
          </p>
          <div className="steps-grid grid" style={{ gridTemplateColumns: "repeat(4,1fr)", gap: "20px" }}>
            {benefits.map((b) => (
              <div key={b.title}>
                <Image src={`/images/${b.img}`} alt={b.title} width={400} height={300} className="w-full" style={{ borderRadius: "10px", aspectRatio: "4/3", objectFit: "cover", marginBottom: "10px" }} />
                <p style={{ fontSize: "14px", fontWeight: 600, color: "var(--ink-landing)", marginBottom: "2px" }}>{b.title}</p>
                <p style={{ fontSize: "12.5px", color: "var(--body-landing)", lineHeight: 1.5 }}>{b.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* How to start */}
      <section style={{ padding: "0 var(--pad) 80px", background: "#fff" }}>
        <div className="mx-auto" style={{ maxWidth: "var(--max)" }}>
          <h2 style={{ fontSize: "32px", fontWeight: 700, color: "var(--pr)", textAlign: "center", marginBottom: "6px" }}>
            How to Get Started
          </h2>
          <p style={{ fontSize: "13px", color: "var(--body-landing)", textAlign: "center", marginBottom: "48px" }}>
            Four simple steps to start selling
          </p>
          <div className="steps-grid grid" style={{ gridTemplateColumns: "repeat(4,1fr)", gap: "24px" }}>
            {steps.map((s) => (
              <div key={s.num} style={{ textAlign: "center" }}>
                <div style={{ width: "56px", height: "56px", borderRadius: "50%", background: "var(--pr)", color: "#fff", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "18px", fontWeight: 700, margin: "0 auto 16px" }}>
                  {s.num}
                </div>
                <p style={{ fontSize: "15px", fontWeight: 600, color: "var(--ink-landing)", marginBottom: "6px" }}>{s.title}</p>
                <p style={{ fontSize: "13px", color: "var(--body-landing)", lineHeight: 1.5, maxWidth: "220px", margin: "0 auto" }}>{s.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section style={{ padding: "0 var(--pad) 60px", background: "#fff" }}>
        <div className="mx-auto" style={{ maxWidth: "var(--max)", background: "rgba(17,17,17,1)", borderRadius: "16px", padding: "48px 40px", textAlign: "center" }}>
          <h3 style={{ fontSize: "28px", fontWeight: 600, color: "#fff", marginBottom: "8px" }}>
            Ready to start selling?
          </h3>
          <p style={{ fontSize: "15px", color: "rgba(255,255,255,0.75)", marginBottom: "24px", maxWidth: "500px", marginLeft: "auto", marginRight: "auto" }}>
            Join our community of sellers and reach customers around the world.
          </p>
          <Link href="/sign-up" style={{ display: "inline-block", background: "#fff", color: "rgba(17,17,17,1)", padding: "12px 32px", borderRadius: "99px", fontSize: "15px", fontWeight: 600, cursor: "pointer", textDecoration: "none" }}>
            Get started
          </Link>
        </div>
      </section>

      <Footer />
    </>
  );
}
