"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { useUser, UserButton } from "@clerk/nextjs";
import { useLanguage } from "@/lib/i18n/language-context";

const navLinks = ["Home", "Shops", "How it works", "Seller"] as const;

export function Navbar() {
  const { t, lang, setLang, languages } = useLanguage();
  const { isLoaded, isSignedIn } = useUser();
  const [open, setOpen] = useState(false);

  const hrefFor = (label: string) =>
    label === "Home" ? "/" : label === "Shops" ? "/shops" : label === "Seller" ? "/sign-in?role=seller" : "/how-it-works";

  return (
    <nav
      className="sticky top-0 z-100 h-[52px]"
      style={{
        background: "rgba(255,255,255,0.8)",
        backdropFilter: "blur(10px)",
        WebkitBackdropFilter: "blur(10px)",
        borderBottom: "1px solid var(--line)",
      }}
    >
      <div
        className="mx-auto flex h-full items-center justify-between"
        style={{ maxWidth: "var(--max)", padding: "0 var(--pad)" }}
      >
        <div className="flex items-center" style={{ gap: "36px" }}>
          <Link href="/">
            <Image
              src="/images/Deni.png"
              alt="Deni"
              width={28}
              height={28}
              style={{ borderRadius: "6px" }}
            />
          </Link>
          {navLinks.map((label) => (
            <Link
              key={label}
              href={hrefFor(label)}
              className="hidden md:inline"
              style={{
                fontSize: "16px",
                fontWeight: 500,
                color: "var(--pr)",
              }}
            >
              {label === "Home"
                ? "Home"
                : label === "Shops"
                  ? t("nav.shops")
                  : label === "Seller"
                    ? t("nav.seller")
                    : t("nav.how-it-works")}
            </Link>
          ))}
        </div>
        <div className="flex items-center" style={{ gap: "24px" }}>
          {/* Language switcher */}
          <div className="relative">
            <button
              type="button"
              onClick={() => setOpen(!open)}
              className="flex items-center"
              style={{
                gap: "5px",
                fontSize: "15.5px",
                fontWeight: 500,
                color: "var(--pr)",
                border: "none",
                background: "none",
                cursor: "pointer",
              }}
            >
              <img
                src="/icons/vector-74.svg"
                alt=""
                style={{ width: "18px", height: "18px" }}
              />
              <span className="hidden sm:inline">
                {languages.find((l) => l.code === lang)?.native ?? "English"}
              </span>
            </button>

            {open && (
              <>
                <div
                  className="fixed inset-0 z-40"
                  onClick={() => setOpen(false)}
                />
                <div
                  className="absolute right-0 z-50"
                  style={{
                    top: "calc(100% + 8px)",
                    background: "#fff",
                    borderRadius: "10px",
                    boxShadow:
                      "0 0 0 1px rgba(0,0,0,0.04), 0 8px 16px rgba(0,0,0,0.06)",
                    minWidth: "150px",
                    overflow: "hidden",
                  }}
                >
                  {languages.map((l) => (
                    <button
                      key={l.code}
                      type="button"
                      onClick={() => {
                        setLang(l.code);
                        setOpen(false);
                      }}
                      style={{
                        width: "100%",
                        padding: "10px 16px",
                        border: "none",
                        background:
                          lang === l.code
                            ? "rgba(193,45,7,0.08)"
                            : "transparent",
                        cursor: "pointer",
                        fontSize: "14px",
                        fontWeight: lang === l.code ? 600 : 400,
                        color:
                          lang === l.code ? "var(--pr)" : "var(--ink-landing)",
                        textAlign: "left",
                        display: "flex",
                        alignItems: "center",
                        gap: "8px",
                      }}
                      onMouseEnter={(e) =>
                        (e.currentTarget.style.background =
                          "rgba(193,45,7,0.05)")
                      }
                      onMouseLeave={(e) =>
                        (e.currentTarget.style.background =
                          lang === l.code
                            ? "rgba(193,45,7,0.08)"
                            : "transparent")
                      }
                    >
                      <span
                        style={{
                          opacity: lang === l.code ? 1 : 0.4,
                          fontSize: "16px",
                        }}
                      >
                        {l.code === "en"
                          ? "🇬🇧"
                          : l.code === "pcm"
                            ? "🇳🇬"
                            : "🇰🇪"}
                      </span>
                      <div style={{ textAlign: "left" }}>
                        <div style={{ fontSize: "14px", lineHeight: 1.3 }}>
                          {l.label}
                        </div>
                        <div
                          style={{
                            fontSize: "11px",
                            color: "var(--muted-landing)",
                            lineHeight: 1.3,
                          }}
                        >
                          {l.native}
                        </div>
                      </div>
                    </button>
                  ))}
                </div>
              </>
            )}
          </div>

          {isLoaded && isSignedIn ? (
            <UserButton
              appearance={{
                elements: {
                  userButtonOuterIdentifier: {
                    fontSize: 13,
                    color: "var(--ink)",
                  },
                  userButtonTrigger: { borderRadius: 9999, height: 32 },
                },
              }}
              userProfileMode="navigation"
              userProfileUrl="/user/settings"
            />
          ) : (
            <>
              <Link
                href="/sign-in"
                style={{
                  fontSize: "15.9px",
                  fontWeight: 500,
                  color: "var(--pr)",
                  border: "none",
                  background: "none",
                  cursor: "pointer",
                  textDecoration: "none",
                }}
              >
                {t("nav.login")}
              </Link>
              <Link
                href="/sign-up"
                style={{
                  background: "var(--pr)",
                  color: "#fff",
                  padding: "10px 20px",
                  borderRadius: "24px",
                  fontSize: "15.9px",
                  fontWeight: 500,
                  border: "1px solid transparent",
                  cursor: "pointer",
                  textDecoration: "none",
                }}
              >
                {t("nav.start-free")}
              </Link>
            </>
          )}
        </div>
      </div>
    </nav>
  );
}
