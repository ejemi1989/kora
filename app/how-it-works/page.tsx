import { Navbar } from "@/components/landing/Navbar";
import { Footer } from "@/components/landing/Footer";
import Image from "next/image";
import Link from "next/link";

const detailedSteps = [
  {
    img: "step-1.png",
    step: "01",
    title: "Discover",
    body: "Browse thousands of authentic African products from verified sellers. Use categories, search, and filters to find exactly what you need — from fresh produce to traditional pantry staples.",
    items: [
      "Explore categories like fresh produce, grains, spices, and more",
      "Search by product name, seller, or region",
      "Read product descriptions and reviews",
    ],
  },
  {
    img: "step-2.png",
    step: "02",
    title: "Order & Pay",
    body: "Add items to your cart and checkout securely. We support multiple payment methods so you can pay in your preferred currency, whether you're local or in the diaspora.",
    items: [
      "Easy add-to-cart and checkout flow",
      "Secure payments with Stripe",
      "Pay in your local currency",
    ],
  },
  {
    img: "step-3.png",
    step: "03",
    title: "Track Live",
    body: "Never wonder where your order is. Get real-time tracking updates from the moment your seller confirms to final delivery at your doorstep.",
    items: [
      "Real-time order tracking dashboard",
      "Push notifications for status updates",
      "Direct contact with your seller",
    ],
  },
  {
    img: "step-4.png",
    step: "04",
    title: "Receive",
    body: "Enjoy your authentic African products delivered fresh to your door. Every package is handled with care to ensure quality from the source to your table.",
    items: [
      "Freshness guaranteed on all perishables",
      "Carefully packaged for safe delivery",
      "Easy returns if anything is wrong",
    ],
  },
];

export default function HowItWorksPage() {
  return (
    <>
      <Navbar />
      <main>
        {/* Hero Section */}
        <section
          className="relative overflow-hidden"
          style={{
            padding: "80px var(--pad) 60px",
            background: "#fff",
          }}
        >
          <div
            className="pointer-events-none absolute inset-0 z-0"
            style={{ opacity: 0.4 }}
          >
            <Image
              src="/images/node-79.png"
              alt=""
              fill
              className="object-cover"
              priority
            />
          </div>
          <div
            className="relative z-10 mx-auto text-center"
            style={{ maxWidth: "var(--max)" }}
          >
            <h1
              style={{
                fontSize: "46px",
                fontWeight: 400,
                letterSpacing: "-1.2px",
                lineHeight: "52px",
                color: "var(--pr)",
                marginBottom: "14px",
              }}
            >
              How Deni Works
            </h1>
            <p
              style={{
                fontSize: "17px",
                color: "var(--body-landing)",
                lineHeight: 1.5,
                maxWidth: "520px",
                margin: "0 auto",
              }}
            >
              From discovery to delivery — we make getting authentic African
              products simple and secure.
            </p>
          </div>
        </section>

        {/* Detailed Steps */}
        {detailedSteps.map((step, idx) => (
          <section
            key={step.title}
            className="relative overflow-hidden"
            style={{
              padding: "80px var(--pad)",
              background: idx % 2 === 1 ? "rgba(193,45,7,0.02)" : "#fff",
              borderTop: "1px solid var(--line)",
            }}
          >
            <div
              className="mx-auto flex items-center"
              style={{
                maxWidth: "var(--max)",
                gap: "60px",
                flexDirection: idx % 2 === 0 ? "row" : "row-reverse",
              }}
            >
              <div
                className="step-image"
                style={{
                  flex: "0 0 45%",
                  maxWidth: "45%",
                }}
              >
                <Image
                  src={`/images/${step.img}`}
                  alt={step.title}
                  width={600}
                  height={450}
                  className="w-full h-auto"
                  style={{
                    borderRadius: "16px",
                    boxShadow:
                      "0 0 0 1px rgba(0,0,0,0.04), 0 4px 12px rgba(0,0,0,0.06)",
                  }}
                />
              </div>
              <div style={{ flex: 1 }}>
                <span
                  style={{
                    fontSize: "12px",
                    fontWeight: 500,
                    color: "var(--pr)",
                    letterSpacing: "0.06em",
                    textTransform: "uppercase",
                    fontFamily: "var(--font-mono)",
                  }}
                >
                  Step {step.step}
                </span>
                <h2
                  style={{
                    fontSize: "32px",
                    fontWeight: 700,
                    color: "var(--pr)",
                    lineHeight: 1.2,
                    margin: "6px 0 10px",
                  }}
                >
                  {step.title}
                </h2>
                <p
                  style={{
                    fontSize: "15px",
                    color: "var(--body-landing)",
                    lineHeight: 1.6,
                    marginBottom: "20px",
                  }}
                >
                  {step.body}
                </p>
                <ul style={{ padding: 0, listStyle: "none" }}>
                  {step.items.map((item) => (
                    <li
                      key={item}
                      style={{
                        fontSize: "14px",
                        color: "var(--ink-landing)",
                        lineHeight: 1.5,
                        marginBottom: "8px",
                        display: "flex",
                        alignItems: "center",
                        gap: "10px",
                      }}
                    >
                      <span
                        style={{
                          width: "6px",
                          height: "6px",
                          borderRadius: "50%",
                          background: "var(--pr)",
                          flexShrink: 0,
                        }}
                      />
                      {item}
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </section>
        ))}

        {/* CTA */}
        <section
          className="relative overflow-hidden text-center"
          style={{
            padding: "64px var(--pad)",
            background: "rgba(193,45,7,0.03)",
            borderTop: "1px solid var(--line)",
          }}
        >
          <div className="mx-auto" style={{ maxWidth: "var(--max)" }}>
            <h2
              style={{
                fontSize: "34px",
                fontWeight: 400,
                color: "var(--ink-landing)",
                lineHeight: 1.2,
                marginBottom: "12px",
              }}
            >
              Ready to get started?
            </h2>
            <p
              style={{
                fontSize: "15px",
                color: "var(--body-landing)",
                marginBottom: "24px",
              }}
            >
              Join thousands of customers getting authentic African food
              delivered.
            </p>
            <Link
              href="/sign-up"
              style={{
                display: "inline-block",
                background: "var(--pr)",
                color: "#fff",
                padding: "12px 32px",
                borderRadius: "24px",
                fontSize: "16px",
                fontWeight: 500,
                textDecoration: "none",
              }}
            >
              Start for free
            </Link>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}
