import Image from "next/image";

const galleryImages = [
  { file: "gfinal_1.png", alt: "Person" },
  { file: "gfinal_2.png", alt: "Palm fruit and tomatoes" },
  { file: "gfinal_3.png", alt: "Dried fish" },
  { file: "gfinal_4.png", alt: "Person" },
  { file: "gfinal_5.png", alt: "White grain in clay bowl" },
  { file: "gfinal_6.png", alt: "Groundnuts" },
  { file: "gfinal_7.png", alt: "Person" },
];

export function SocialProof() {
  return (
    <section>
      <div
        style={{
          padding: "72px var(--pad) 32px",
          maxWidth: "var(--max)",
          margin: "0 auto",
        }}
      >
        <h2
          style={{
            fontSize: "44px",
            fontWeight: 400,
            color: "var(--ink-landing)",
            lineHeight: 1.15,
            maxWidth: "480px",
          }}
        >
          Used by Africans in diaspora just like you to order products in
          Africa.
        </h2>
      </div>

      {/* Full-bleed gallery */}
      <div
        className="gallery-grid grid w-full"
        style={{
          gridTemplateColumns: "repeat(7,1fr)",
          gap: 0,
        }}
      >
        {galleryImages.map((img) => (
          <div
            key={img.file}
            className="overflow-hidden"
            style={{ aspectRatio: "1" }}
          >
            <Image
              src={`/images/${img.file}`}
              alt={img.alt}
              width={200}
              height={200}
              className="block h-full w-full object-cover transition-transform duration-300 hover:scale-[1.03]"
            />
          </div>
        ))}
      </div>
    </section>
  );
}
