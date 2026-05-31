"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";

const bulletItems = [
  "Browse thousands of authentic products",
  "Shop with confidence",
  "Feel connected",
  "Every seller is identity-verified",
  "Secure checkout with full buyer protection",
  "Track your order from the artisan's hands to your front door.",
];

export function Community() {
  const [activeDot, setActiveDot] = useState(2);
  const totalDots = 5;

  return (
    <section
      className="relative overflow-hidden"
      style={{ padding: "80px var(--pad)", background: "#fff" }}
    >
      {/* Side swirls */}
      <div
        className="pointer-events-none absolute z-0 hidden lg:block"
        style={{
          left: "-60px",
          top: 0,
          width: "340px",
          height: "100%",
          opacity: 0.4,
        }}
      >
        <Image
          src="/images/node-91.png"
          alt=""
          fill
          className="object-cover"
          sizes="340px"
        />
      </div>
      <div
        className="pointer-events-none absolute z-0 hidden lg:block"
        style={{
          right: "-60px",
          top: 0,
          width: "340px",
          height: "100%",
          opacity: 0.4,
        }}
      >
        <Image
          src="/images/node-92.png"
          alt=""
          fill
          className="object-cover"
          sizes="340px"
        />
      </div>

      <div
        className="community-grid relative z-10 mx-auto grid items-center"
        style={{
          maxWidth: "var(--max)",
          gridTemplateColumns: "42% 1fr",
          gap: "72px",
        }}
      >
        {/* Left - Image + Dots */}
        <div>
          <div
            style={{
              background: "rgba(250,250,250,1)",
              borderRadius: "12px",
              overflow: "hidden",
            }}
          >
            <Image
              src="/images/node-120.png"
              alt="Community — Africa map with silhouettes"
              width={800}
              height={600}
              className="w-full h-auto"
              style={{ borderRadius: "19px" }}
            />
          </div>

          {/* Dots */}
          <div
            className="flex justify-center"
            style={{ gap: "6px", marginTop: "12px" }}
          >
            {Array.from({ length: totalDots }, (_, i) => (
              <button
                key={i}
                type="button"
                className="comm-dot"
                onClick={() => setActiveDot(i)}
                style={{
                  width: activeDot === i ? "20px" : "8px",
                  height: "8px",
                  borderRadius: "99px",
                  border: "none",
                  cursor: "pointer",
                  padding: 0,
                  transition: "width 150ms cubic-bezier(0.4,0,0.2,1)",
                  background:
                    activeDot === i
                      ? "var(--comm-dot-active)"
                      : "var(--comm-dot-inactive)",
                }}
              />
            ))}
          </div>
          <p
            style={{
              fontSize: "13.3px",
              lineHeight: "21px",
              color: "var(--ink-landing)",
              textAlign: "center",
              marginTop: "8px",
            }}
          >
            {activeDot + 1} / 4
          </p>
        </div>

        {/* Right - Text */}
        <div>
          <h2
            className="community-label"
            style={{
              fontSize: "46.1px",
              fontWeight: 400,
              letterSpacing: "-1.08px",
              lineHeight: "57.6px",
              color: "var(--pr)",
              marginBottom: "12px",
            }}
          >
            Our Community
          </h2>
          <p
            style={{
              fontSize: "17.4px",
              fontWeight: 400,
              letterSpacing: "-0.15px",
              lineHeight: "27px",
              color: "var(--ink-landing)",
              marginBottom: "18px",
            }}
          >
            We love to connect you to the source
          </p>

          <ul style={{ marginBottom: "32px", listStyle: "none", padding: 0 }}>
            {bulletItems.map((item) => (
              <li
                key={item}
                style={{
                  fontSize: "17.3px",
                  fontWeight: 400,
                  letterSpacing: "-0.15px",
                  lineHeight: "27px",
                  color: "var(--body-landing)",
                }}
              >
                &bull; {item}
              </li>
            ))}
          </ul>

          <Link
            href="/sign-up"
            style={{
              display: "inline-block",
              background: "rgba(17,17,17,1)",
              color: "#fff",
              padding: "12px 28px",
              borderRadius: "var(--radius-xs)",
              fontSize: 13,
              fontWeight: 550,
              letterSpacing: "-0.01em",
              cursor: "pointer",
              textDecoration: "none",
              transition: "opacity 200ms",
            }}
            onMouseEnter={(e) => (e.currentTarget.style.opacity = "0.85")}
            onMouseLeave={(e) => (e.currentTarget.style.opacity = "1")}
          >
            Get started
          </Link>
        </div>
      </div>
    </section>
  );
}
