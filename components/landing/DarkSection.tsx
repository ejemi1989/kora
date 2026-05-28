import Image from "next/image";

export function DarkSection() {
  return (
    <section style={{ background: "#000", lineHeight: 0 }}>
      <Image
        src="/images/background-89.png"
        alt="Before you go — FAQ section"
        width={2035}
        height={752}
        className="mx-auto w-full h-auto"
        style={{ display: "block", maxWidth: "100%" }}
        priority
      />
    </section>
  );
}
