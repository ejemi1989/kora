"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";

const faqItems = [
  {
    question: "Find products you love",
    answer:
      "Choose from a wide varieties of authentic African products. Browse categories like fresh produce, grains, spices, seafood, and traditional snacks — all sourced directly from verified sellers.",
    icon: (
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M6 2L3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z" />
        <line x1="3" y1="6" x2="21" y2="6" />
        <path d="M16 10a4 4 0 0 1-8 0" />
      </svg>
    ),
  },
  {
    question: "Book at your convenience",
    answer:
      "Shop anytime and from anywhere. Our platform is built for the diaspora — order when it works for you, with seamless checkout and multiple payment options including international cards.",
    icon: (
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
        <polyline points="14 2 14 8 20 8" />
        <line x1="16" y1="13" x2="8" y2="13" />
        <line x1="16" y1="17" x2="8" y2="17" />
        <polyline points="10 9 9 9 8 9" />
      </svg>
    ),
  },
  {
    question: "Get products delivered",
    answer:
      "Track your products anywhere in the world. From the artisan's hands to your front door — every order comes with real-time tracking and delivery updates so you're always in the loop.",
    icon: (
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <rect x="1" y="3" width="15" height="13" />
        <polygon points="16 8 20 8 23 11 23 16 16 16 16 8" />
        <circle cx="5.5" cy="18.5" r="2.5" />
        <circle cx="18.5" cy="18.5" r="2.5" />
      </svg>
    ),
  },
  {
    question: "How do payments work?",
    answer:
      "We use Stripe for secure payment processing. You can pay with major credit cards, debit cards, and international payment methods. Your payment information is encrypted and never shared with sellers.",
    icon: (
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <rect x="1" y="4" width="22" height="16" rx="2" ry="2" />
        <line x1="1" y1="10" x2="23" y2="10" />
      </svg>
    ),
  },
  {
    question: "Can I return products?",
    answer:
      "Yes. If your order arrives damaged or incorrect, contact our support team within 48 hours of delivery. We'll arrange a replacement or refund. Perishable items may have specific return windows.",
    icon: (
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <polyline points="23 4 23 10 17 10" />
        <polyline points="1 20 1 14 7 14" />
        <path d="M3.51 9a9 9 0 0 1 14.85-3.36L23 10M1 14l4.64 4.36A9 9 0 0 0 20.49 15" />
      </svg>
    ),
  },
];

export function DarkSection() {
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  const toggle = (i: number) => setOpenIndex(openIndex === i ? null : i);

  return (
    <section
      className="relative overflow-hidden"
      style={{ background: "rgba(0,0,0,1)" }}
    >
      <div className="mx-auto" style={{ maxWidth: "var(--max)" }}>
        <div
          className="flex"
          style={{
            padding: "72px var(--pad)",
            gap: "60px",
            alignItems: "center",
          }}
        >
          {/* Left - FAQ Accordion */}
          <div style={{ flex: "0 0 50%", maxWidth: "50%" }}>
            <h2
              style={{
                fontSize: "28px",
                fontWeight: 700,
                color: "#fff",
                lineHeight: 1.2,
                marginBottom: "6px",
              }}
            >
              Before you go!
            </h2>
            <p
              style={{
                fontSize: "13.5px",
                color: "rgba(255,255,255,0.6)",
                lineHeight: 1.5,
                marginBottom: "32px",
              }}
            >
              We don&apos;t want to leave you with questions hanging &mdash;
              here&apos;s a few that people often ask...
            </p>

            <div
              style={{
                display: "flex",
                flexDirection: "column",
                gap: "2px",
              }}
            >
              {faqItems.map((item, i) => {
                const isOpen = openIndex === i;
                return (
                  <div
                    key={item.question}
                    style={{
                      background: "rgba(255,255,255,0.06)",
                      borderRadius: "10px",
                      overflow: "hidden",
                      transition:
                        "background 150ms cubic-bezier(0.4,0,0.2,1)",
                    }}
                  >
                    <button
                      type="button"
                      onClick={() => toggle(i)}
                      style={{
                        width: "100%",
                        display: "flex",
                        alignItems: "center",
                        gap: "14px",
                        padding: "14px 18px",
                        border: "none",
                        background: "none",
                        cursor: "pointer",
                        color: "#fff",
                        fontSize: "15px",
                        fontWeight: 500,
                        textAlign: "left",
                      }}
                    >
                      <span
                        style={{
                          color: "var(--pr)",
                          flexShrink: 0,
                          display: "flex",
                          opacity: 0.9,
                        }}
                      >
                        {item.icon}
                      </span>
                      <span style={{ flex: 1 }}>{item.question}</span>
                      <span
                        style={{
                          flexShrink: 0,
                          transition:
                            "transform 150ms cubic-bezier(0.4,0,0.2,1)",
                          transform: isOpen ? "rotate(180deg)" : "rotate(0deg)",
                          opacity: 0.6,
                        }}
                      >
                        <svg
                          width="16"
                          height="16"
                          viewBox="0 0 24 24"
                          fill="none"
                          stroke="currentColor"
                          strokeWidth="2"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        >
                          <polyline points="6 9 12 15 18 9" />
                        </svg>
                      </span>
                    </button>
                    <div
                      style={{
                        maxHeight: isOpen ? "200px" : "0px",
                        overflow: "hidden",
                        transition:
                          "max-height 200ms cubic-bezier(0.4,0,0.2,1)",
                      }}
                    >
                      <p
                        style={{
                          padding: "0 18px 14px 54px",
                          margin: 0,
                          fontSize: "13.5px",
                          color: "rgba(255,255,255,0.65)",
                          lineHeight: 1.5,
                        }}
                      >
                        {item.answer}
                      </p>
                    </div>
                  </div>
                );
              })}
            </div>

            <div style={{ marginTop: "28px" }}>
              <Link
                href="/sign-up"
                style={{
                  display: "inline-block",
                  background: "var(--pr)",
                  color: "#fff",
                  padding: "11px 28px",
                  borderRadius: "24px",
                  fontSize: "14.5px",
                  fontWeight: 500,
                  textDecoration: "none",
                }}
              >
                Get started
              </Link>
            </div>
          </div>

          {/* Right - Image */}
          <div
            className="hidden md:block"
            style={{
              flex: "0 0 40%",
              maxWidth: "40%",
            }}
          >
            <Image
              src="/images/node-80.png"
              alt="Happy customer with delivery"
              width={600}
              height={500}
              className="w-full h-auto"
              style={{
                borderRadius: "16px",
                objectFit: "cover",
              }}
            />
          </div>
        </div>
      </div>
    </section>
  );
}
