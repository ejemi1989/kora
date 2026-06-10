import Image from "next/image";
import Link from "next/link";
import { Navbar } from "@/components/landing/Navbar";
import { Footer } from "@/components/landing/Footer";

const steps = [
  {
    img: "step-1.png",
    title: "Discover",
    desc: "Browse thousands of authentic African products from trusted sellers. Use categories, search, and filters to find exactly what you need — from fresh produce to specialty spices.",
    details: [
      "Search by product, category, or seller",
      "Browse curated collections",
      "Read product descriptions and reviews",
      "Compare prices from different sellers",
    ],
  },
  {
    img: "step-2.png",
    title: "Order & Pay",
    desc: "Add items to your cart and checkout securely. We accept multiple payment methods so you can pay the way that works best for you.",
    details: [
      "Secure checkout with Stripe",
      "Multiple payment methods supported",
      "Order summary before confirmation",
      "Instant order confirmation",
    ],
  },
  {
    img: "step-3.png",
    title: "Track Live",
    desc: "Follow your order in real time from the moment it&apos;s placed until it arrives at your doorstep. Get notified at every step.",
    details: [
      "Real-time order tracking",
      "Push notifications on status updates",
      "Estimated delivery time",
      "Direct contact with seller if needed",
    ],
  },
  {
    img: "step-4.png",
    title: "Receive",
    desc: "Your order arrives fresh and on time. Rate your experience and reorder your favorites with one click.",
    details: [
      "Fresh delivery guaranteed",
      "Rate your purchase",
      "Easy reordering",
      "Customer support if anything is wrong",
    ],
  },
];

const faqs = [
  { q: "How long does delivery take?", a: "Delivery times vary by location and seller. Estimated delivery times are shown at checkout before you confirm your order." },
  { q: "Can I track my order?", a: "Yes! Once your order is placed, you will receive real-time updates and can track your delivery from our website or app." },
  { q: "What payment methods do you accept?", a: "We accept credit/debit cards, bank transfers, and mobile money through our secure Stripe payment system." },
  { q: "Is my payment information secure?", a: "Absolutely. All payments are processed securely through Stripe. We never store your payment details on our servers." },
  { q: "Can I return items?", a: "Yes, we have a hassle-free return policy. If something is wrong with your order, contact our support team within 48 hours of delivery." },
];

export default function HowItWorksPage() {
  return (
    <>
      <Navbar />
      {/* Hero */}
      <section className="relative overflow-hidden" style={{ padding: "80px var(--pad) 60px", background: "#fff" }}>
        <div className="pointer-events-none absolute inset-0 z-0" style={{ opacity: 0.4 }}>
          <Image src="/images/node-79.png" alt="" fill className="object-cover" priority />
        </div>
        <div className="relative z-10 mx-auto" style={{ maxWidth: "var(--max)", textAlign: "center" }}>
          <h1 className="hero-headline" style={{ fontSize: "54.8px", fontWeight: 400, letterSpacing: "-1.2px", lineHeight: "60px", color: "var(--pr)", marginBottom: "12px" }}>
            How It Works
          </h1>
          <p style={{ fontSize: "17.3px", fontWeight: 500, lineHeight: "27px", color: "var(--sub)", maxWidth: "500px", margin: "0 auto 8px" }}>
            From discovery to delivery &mdash; we make getting authentic African food simple.
          </p>
          <p style={{ fontSize: "13px", color: "var(--body-landing)", maxWidth: "400px", margin: "0 auto" }}>
            Four easy steps to get your favorite African products delivered anywhere.
          </p>
        </div>
      </section>

      {/* Detailed steps */}
      {steps.map((step, i) => (
        <section
          key={step.title}
          className="relative overflow-hidden"
          style={{
            padding: "60px var(--pad)",
            background: i % 2 === 0 ? "#fff" : "rgba(250,250,250,1)",
          }}
        >
          <div
            className="mx-auto flex items-center"
            style={{
              maxWidth: "var(--max)",
              gap: "60px",
              flexDirection: i % 2 === 0 ? ("row" as const) : ("row-reverse" as const),
            }}
          >
            <div className="w-full md:basis-[42%] md:max-w-[42%]">
              <span style={{ fontSize: "11px", fontWeight: 500, textTransform: "uppercase", letterSpacing: "0.06em", color: "var(--muted-landing)", marginBottom: "8px", display: "block" }}>
                Step {i + 1}
              </span>
              <h2 style={{ fontSize: "32px", fontWeight: 700, color: "var(--pr)", lineHeight: 1.2, marginBottom: "12px" }}>
                {step.title}
              </h2>
              <p style={{ fontSize: "15px", color: "var(--body-landing)", lineHeight: 1.6, marginBottom: "16px" }}>
                {step.desc}
              </p>
              <ul style={{ listStyle: "none", padding: 0, margin: 0 }}>
                {step.details.map((d) => (
                  <li key={d} style={{ fontSize: "13px", color: "var(--ink-landing)", lineHeight: 1.8, paddingLeft: "16px", position: "relative" }}>
                    <span style={{ position: "absolute", left: 0, top: 0, color: "var(--pr)" }}>&bull;</span>
                    {d}
                  </li>
                ))}
              </ul>
            </div>
            <div className="w-full md:flex-1">
              <Image
                src={`/images/${step.img}`}
                alt={step.title}
                width={800}
                height={600}
                className="w-full h-auto"
                style={{ borderRadius: "19px" }}
              />
            </div>
          </div>
        </section>
      ))}

      {/* FAQ */}
      <section style={{ padding: "60px var(--pad) 80px", background: "#fff" }}>
        <div className="mx-auto" style={{ maxWidth: "720px" }}>
          <h2 style={{ fontSize: "32px", fontWeight: 700, color: "var(--pr)", textAlign: "center", marginBottom: "6px" }}>
            Frequently Asked Questions
          </h2>
          <p style={{ fontSize: "13px", color: "var(--body-landing)", textAlign: "center", marginBottom: "40px" }}>
            Everything you need to know
          </p>
          <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
            {faqs.map((faq, i) => (
              <details
                key={i}
                style={{ border: "1px solid var(--line)", borderRadius: "10px", overflow: "hidden" }}
              >
                <summary
                  style={{
                    width: "100%",
                    padding: "16px 20px",
                    background: "none",
                    cursor: "pointer",
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                    fontSize: "15px",
                    fontWeight: 600,
                    color: "var(--ink-landing)",
                    textAlign: "left",
                    listStyle: "none",
                  }}
                >
                  {faq.q}
                  <span style={{
                    fontSize: "18px",
                    color: "var(--pr)",
                    display: "inline-block",
                  }}>+</span>
                </summary>
                <div style={{ padding: "0 20px 16px", fontSize: "13px", color: "var(--body-landing)", lineHeight: 1.6 }}>
                  {faq.a}
                </div>
              </details>
            ))}
          </div>
          <div style={{ textAlign: "center", marginTop: "32px" }}>
            <p style={{ fontSize: "14px", color: "var(--body-landing)", marginBottom: "12px" }}>
              Still have questions?
            </p>
            <Link href="/contact" style={{ display: "inline-block", background: "var(--pr)", color: "#fff", padding: "10px 24px", borderRadius: "var(--radius-xs)", fontSize: 13, fontWeight: 520, cursor: "pointer", textDecoration: "none" }}>
              Contact us
            </Link>
          </div>
        </div>
      </section>

      <Footer />
    </>
  );
}
