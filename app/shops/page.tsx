"use client";

import { Navbar } from "@/components/landing/Navbar";
import { Footer } from "@/components/landing/Footer";
import Image from "next/image";
import Link from "next/link";
import { useState } from "react";

const categories = [
  {
    title: "Fresh Produce",
    desc: "Farm-fresh fruits, vegetables, and herbs sourced directly from local growers",
    img: "gfinal_2.png",
    count: "48",
    color: "#ea2804",
  },
  {
    title: "Grains & Staples",
    desc: "Rice, yam, garri, beans, and other everyday essentials",
    img: "gfinal_5.png",
    count: "36",
  },
  {
    title: "Spices & Seasonings",
    desc: "Authentic blends, dried peppers, and traditional flavorings",
    img: "gfinal_6.png",
    count: "52",
  },
  {
    title: "Seafood & Proteins",
    desc: "Dried fish, stockfish, crayfish, and premium cuts",
    img: "gfinal_3.png",
    count: "24",
  },
  {
    title: "Snacks & Treats",
    desc: "Traditional snacks, chin chin, puff puff mixes, and more",
    img: "gfinal_1.png",
    count: "31",
  },
  {
    title: "Beverages",
    desc: "Zobo mixes, sobo ingredients, palm wine, and specialty drinks",
    img: "gfinal_4.png",
    count: "19",
  },
];

export default function ShopsPage() {
  const [hovered, setHovered] = useState<number | null>(null);
  return (
    <>
      <Navbar />
      <main>
        {/* Hero Banner */}
        <section
          className="relative overflow-hidden"
          style={{
            padding: "60px var(--pad) 40px",
            background: "#fff",
            borderBottom: "1px solid var(--line)",
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
              Browse African Markets
            </h1>
            <p
              style={{
                fontSize: "17px",
                color: "var(--body-landing)",
                lineHeight: 1.5,
                maxWidth: "520px",
                margin: "0 auto 32px",
              }}
            >
              Discover authentic products from verified sellers across the
              continent — from fresh produce to traditional pantry staples.
            </p>
          </div>
        </section>

        {/* Category Grid */}
        <section
          className="relative overflow-hidden"
          style={{ padding: "60px var(--pad)", background: "#fff" }}
        >
          <div
            className="mx-auto"
            style={{ maxWidth: "var(--max)" }}
          >
            <div
              className="grid"
              style={{
                gridTemplateColumns: "repeat(auto-fill, minmax(300px, 1fr))",
                gap: "24px",
              }}
            >
              {categories.map((cat, i) => {
                const isHovered = hovered === i;
                return (
                  <Link
                    key={cat.title}
                    href="#"
                    style={{ textDecoration: "none" }}
                  >
                    <div
                      className="shop-card group"
                      style={{
                        background: "#fff",
                        borderRadius: "12px",
                        overflow: "hidden",
                        border: "1px solid var(--line)",
                        boxShadow: isHovered
                          ? "0 4px 12px rgba(0,0,0,0.08)"
                          : "none",
                        transition:
                          "box-shadow 150ms cubic-bezier(0.4,0,0.2,1)",
                      }}
                      onMouseEnter={() => setHovered(i)}
                      onMouseLeave={() => setHovered(null)}
                    >
                      <div
                        style={{
                          aspectRatio: "16/10",
                          overflow: "hidden",
                        }}
                      >
                        <Image
                          src={`/images/${cat.img}`}
                          alt={cat.title}
                          width={400}
                          height={250}
                          className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
                        />
                      </div>
                      <div style={{ padding: "16px" }}>
                        <div
                          className="flex items-center"
                          style={{
                            justifyContent: "space-between",
                            marginBottom: "6px",
                          }}
                        >
                          <h3
                            style={{
                              fontSize: "17px",
                              fontWeight: 600,
                              color: "var(--ink-landing)",
                            }}
                          >
                            {cat.title}
                          </h3>
                          <span
                            style={{
                              fontSize: "12px",
                              fontWeight: 500,
                              color: "var(--pr)",
                              background: "rgba(193,45,7,0.08)",
                              padding: "2px 10px",
                              borderRadius: "99px",
                            }}
                          >
                            {cat.count}
                          </span>
                        </div>
                        <p
                          style={{
                            fontSize: "13.5px",
                            color: "var(--body-landing)",
                            lineHeight: 1.5,
                            margin: 0,
                          }}
                        >
                          {cat.desc}
                        </p>
                      </div>
                    </div>
                  </Link>
                );
              })}
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section
          className="relative overflow-hidden"
          style={{
            padding: "64px var(--pad)",
            background: "rgba(193,45,7,0.03)",
            borderTop: "1px solid var(--line)",
          }}
        >
          <div
            className="relative z-10 mx-auto text-center"
            style={{ maxWidth: "var(--max)" }}
          >
            <h2
              style={{
                fontSize: "34px",
                fontWeight: 400,
                color: "var(--ink-landing)",
                lineHeight: 1.2,
                marginBottom: "12px",
              }}
            >
              Want to sell on Kora?
            </h2>
            <p
              style={{
                fontSize: "15px",
                color: "var(--body-landing)",
                marginBottom: "24px",
              }}
            >
              Join hundreds of vendors reaching customers across the diaspora.
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
              Become a Vendor
            </Link>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}
