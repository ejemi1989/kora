import Image from "next/image";
import Link from "next/link";
import { Navbar } from "@/components/landing/Navbar";
import { Footer } from "@/components/landing/Footer";

const categories = [
  { img: "gfinal_2.png", title: "Fresh Produce", desc: "Yams, plantains, vegetables & more" },
  { img: "gfinal_3.png", title: "Protein & Fish", desc: "Dried fish, stockfish, meats" },
  { img: "groundnut.png", title: "Grains & Legumes", desc: "Beans, rice, groundnuts, lentils" },
  { img: "gfinal_5.png", title: "Spices & Seasonings", desc: "Locust beans, uziza, ogiri" },
  { img: "gfinal_1.png", title: "Palm Oil & Red Oil", desc: "Pure natural palm oil" },
  { img: "gfinal_7.png", title: "Snacks & Treats", desc: "Chin chin, puff puff, plantain chips" },
  { img: "step-1.png", title: "Beverages", desc: "Zobo, kunu, soya milk mixes" },
  { img: "step-3.png", title: "Household", desc: "Cleaning, body care & more" },
];

export default function ShopsPage() {
  return (
    <>
      <Navbar />
      {/* Hero */}
      <section className="relative overflow-hidden" style={{ padding: "80px var(--pad) 80px", background: "#fff" }}>
        <div className="pointer-events-none absolute inset-0 z-0" style={{ opacity: 0.4 }}>
          <Image src="/images/node-79.png" alt="" fill className="object-cover" priority />
        </div>
        <div className="relative z-10 mx-auto" style={{ maxWidth: "var(--max)" }}>
          <div className="hero-row flex items-center" style={{ gap: "60px" }}>
            <div className="w-full md:basis-[42%] md:max-w-[42%]">
              <h1 className="hero-headline" style={{ fontSize: "54.8px", fontWeight: 400, letterSpacing: "-1.2px", lineHeight: "60px", color: "var(--pr)", marginBottom: "16px" }}>
                Browse African Shops
              </h1>
              <p style={{ fontSize: "17.3px", fontWeight: 500, lineHeight: "27px", color: "var(--sub)", maxWidth: "400px", marginBottom: "12px" }}>
                Discover authentic African groceries from trusted sellers. Fresh produce, spices, grains, and specialty items delivered to your doorstep.
              </p>
              <p style={{ fontSize: "13px", color: "var(--body-landing)", marginBottom: "28px" }}>
                Every seller is identity-verified for your peace of mind.
              </p>
              <Link href="/sign-up" style={{ display: "inline-block", background: "var(--pr)", color: "#fff", padding: "12px 28px", borderRadius: "var(--radius-xs)", fontSize: 14, fontWeight: 520, cursor: "pointer", textDecoration: "none" }}>
                Start shopping
              </Link>
            </div>
            <div className="w-full md:flex-1">
              <Image src="/images/node-80.png" alt="African marketplace" width={800} height={600} className="w-full h-auto" style={{ borderRadius: "19px" }} priority />
            </div>
          </div>
        </div>
      </section>

      {/* Categories */}
      <section className="relative overflow-hidden" style={{ padding: "60px var(--pad) 80px", background: "#fff" }}>
        <div className="pointer-events-none absolute z-0 hidden lg:block" style={{ left: "-60px", top: 0, width: "340px", height: "100%", opacity: 0.4 }}>
          <Image src="/images/node-91.png" alt="" fill className="object-cover" sizes="340px" />
        </div>
        <div className="pointer-events-none absolute z-0 hidden lg:block" style={{ right: "-60px", top: 0, width: "340px", height: "100%", opacity: 0.4 }}>
          <Image src="/images/node-92.png" alt="" fill className="object-cover" sizes="340px" />
        </div>
        <div className="relative z-10 mx-auto" style={{ maxWidth: "var(--max)" }}>
          <h2 style={{ fontSize: "32px", fontWeight: 700, color: "var(--pr)", textAlign: "center", marginBottom: "6px" }}>
            Shop by Category
          </h2>
          <p style={{ fontSize: "13px", color: "var(--body-landing)", textAlign: "center", marginBottom: "40px" }}>
            Find exactly what you&apos;re looking for
          </p>
          <div className="steps-grid grid" style={{ gridTemplateColumns: "repeat(4,1fr)", gap: "20px" }}>
            {categories.map((cat) => (
              <Link key={cat.title} href="#" style={{ textDecoration: "none" }}>
                <Image src={`/images/${cat.img}`} alt={cat.title} width={400} height={300} className="w-full" style={{ borderRadius: "10px", aspectRatio: "4/3", objectFit: "cover", marginBottom: "10px" }} />
                <p style={{ fontSize: "14px", fontWeight: 600, color: "var(--ink-landing)", marginBottom: "2px" }}>{cat.title}</p>
                <p style={{ fontSize: "12.5px", color: "var(--body-landing)", lineHeight: 1.5 }}>{cat.desc}</p>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Banner */}
      <section style={{ padding: "0 var(--pad) 60px", background: "#fff" }}>
        <div className="mx-auto" style={{ maxWidth: "var(--max)", background: "var(--pr)", borderRadius: "16px", padding: "48px 40px", textAlign: "center" }}>
          <h3 style={{ fontSize: "28px", fontWeight: 600, color: "#fff", marginBottom: "8px" }}>
            Ready to explore?
          </h3>
          <p style={{ fontSize: "15px", color: "rgba(255,255,255,0.85)", marginBottom: "24px", maxWidth: "500px", marginLeft: "auto", marginRight: "auto" }}>
            Join thousands of satisfied customers getting authentic African food delivered.
          </p>
          <Link href="/sign-up" style={{ display: "inline-block", background: "#fff", color: "var(--pr)", padding: "12px 32px", borderRadius: "99px", fontSize: "15px", fontWeight: 600, cursor: "pointer", textDecoration: "none" }}>
            Get started
          </Link>
        </div>
      </section>

      <Footer />
    </>
  );
}
