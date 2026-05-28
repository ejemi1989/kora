import Image from "next/image";

const steps = [
  {
    img: "step-1.png",
    title: "Discover",
    body: "Browse authentic African products",
  },
  {
    img: "step-2.png",
    title: "Order & Pay",
    body: "Fast checkout with secure payments",
  },
  {
    img: "step-3.png",
    title: "Track Live",
    body: "See your order in real-time.",
  },
  {
    img: "step-4.png",
    title: "Receive",
    body: "Delivered fresh to your doorstep",
  },
];

export function HowItWorks() {
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
        className="relative z-10 mx-auto"
        style={{ maxWidth: "var(--max)", textAlign: "center" }}
      >
        <h2
          style={{
            fontSize: "32px",
            fontWeight: 700,
            color: "var(--pr)",
            lineHeight: 1.2,
            marginBottom: "6px",
          }}
        >
          How it works
        </h2>
        <p
          style={{
            fontSize: "13px",
            color: "var(--body-landing)",
            lineHeight: 1.5,
            marginBottom: "40px",
          }}
        >
          We offer the best experience for authentic African products
        </p>

        <div
          className="steps-grid grid text-left"
          style={{
            gridTemplateColumns: "repeat(4,1fr)",
            gap: "20px",
          }}
        >
          {steps.map((s) => (
            <div key={s.title}>
              <Image
                src={`/images/${s.img}`}
                alt={s.title}
                width={400}
                height={300}
                className="w-full"
                style={{
                  borderRadius: "10px",
                  aspectRatio: "4/3",
                  objectFit: "cover",
                  marginBottom: "12px",
                }}
              />
              <p
                style={{
                  fontSize: "14px",
                  fontWeight: 600,
                  color: "var(--ink-landing)",
                  marginBottom: "3px",
                }}
              >
                {s.title}
              </p>
              <p
                style={{
                  fontSize: "12.5px",
                  color: "var(--body-landing)",
                  lineHeight: 1.5,
                }}
              >
                {s.body}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
