"use client";

import Image from "next/image";
import Link from "next/link";
import { useLanguage } from "@/lib/i18n/language-context";

export function Hero() {
  const { t } = useLanguage();

  return (
    <section
      className="relative overflow-hidden"
      style={{
        padding: "80px var(--pad) 100px",
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
          loading="eager"
        />
      </div>
      <div
        className="pointer-events-none absolute z-0 hidden lg:block"
        style={{
          left: "-60px",
          top: 0,
          width: "340px",
          height: "100%",
          opacity: 0.4,
        }}
      />
      <div
        className="pointer-events-none absolute z-0 hidden lg:block"
        style={{
          right: "-60px",
          top: 0,
          width: "340px",
          height: "100%",
          opacity: 0.4,
        }}
      />

      <div
        className="hero-row relative z-10 mx-auto flex items-center"
        style={{
          maxWidth: "var(--max)",
          gap: "60px",
        }}
      >
        <div className="w-full md:basis-[42%] md:max-w-[42%]">
          <h1
            className="hero-headline"
            style={{
              fontSize: "54.8px",
              fontWeight: 400,
              letterSpacing: "-1.2px",
              lineHeight: "60px",
              color: "var(--pr)",
              marginBottom: "20px",
            }}
          >
            {t("hero.title")}
          </h1>
          <p
            style={{
              fontSize: "17.3px",
              fontWeight: 500,
              lineHeight: "27px",
              color: "var(--sub)",
              maxWidth: "340px",
              marginBottom: "36px",
            }}
          >
            {t("hero.body")}
          </p>
          <div className="flex flex-wrap items-center" style={{ gap: "16px" }}>
            <Link
              href="/sign-up"
              style={{
                background: "var(--pr)",
                color: "#fff",
                padding: "12px 24px",
                fontSize: 15,
                fontWeight: 600,
                borderRadius: "24px",
                cursor: "pointer",
                textDecoration: "none",
                display: "inline-block",
              }}
            >
              {t("hero.start-free")}
            </Link>
            <a
              href="#"
              className="flex items-center justify-center"
              style={{
                background: "#fff",
                border: "1px solid rgba(208,230,254,1)",
                borderRadius: "24px",
                padding: "12px 24px",
                boxShadow: "0 2px 4px rgba(0,0,0,0.5)",
                fontSize: 15,
                fontWeight: 600,
                lineHeight: "21.6px",
                color: "var(--navy)",
                gap: "8px",
              }}
            >
              <img
                src="/icons/vector-88.svg"
                alt=""
                style={{ width: "12px", height: "14px" }}
              />
              {t("hero.watch-video")}
            </a>
          </div>
        </div>

        <div className="w-full md:flex-1">
          <Image
            src="/images/node-80.png"
            alt="African woman with marketplace laptop"
            width={800}
            height={600}
            className="w-full h-auto"
            style={{ borderRadius: "19px" }}
            priority
          />
        </div>
      </div>
    </section>
  );
}
