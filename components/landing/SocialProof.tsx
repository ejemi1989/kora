"use client";

import Image from "next/image";
import { useLanguage } from "@/lib/i18n/language-context";

const galleryImages = [
  "yam.png",
  "pepper.png",
  "gfinal_3.png",
  "gfinal_4.png",
  "Gr.png",
  "groundnut.png",
  "gfinal_7.png",
];

export function SocialProof() {
  const { t } = useLanguage();

  return (
    <section className="relative overflow-hidden" style={{ background: "#fff" }}>
      <div
        className="mx-auto"
        style={{ maxWidth: "var(--max)", padding: "72px var(--pad) 32px" }}
      >
        <h2
          className="social-headline"
          style={{
            fontSize: "44px",
            fontWeight: 400,
            color: "var(--ink-landing)",
            lineHeight: 1.15,
            maxWidth: "480px",
          }}
        >
          {t("social.headline")}
        </h2>
      </div>
      <div
        className="gallery-grid grid"
        style={{
          gridTemplateColumns: "repeat(7,1fr)",
          gap: 0,
          width: "100%",
        }}
      >
        {galleryImages.map((img, i) => (
          <div
            key={i}
            className="gal-cell"
            style={{
              aspectRatio: "1",
              overflow: "hidden",
            }}
          >
            <Image
              src={`/images/${img}`}
              alt=""
              width={200}
              height={200}
              className="w-full h-full object-cover transition-transform duration-300 hover:scale-105"
            />
          </div>
        ))}
      </div>
    </section>
  );
}
