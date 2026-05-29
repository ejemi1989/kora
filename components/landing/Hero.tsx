import Image from "next/image";

export function Hero() {
  return (
    <section
      className="relative overflow-hidden"
      style={{
        padding: "80px var(--pad) 100px",
        background: "#fff",
      }}
    >
      {/* Swirl overlays */}
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
        className="hero-row relative z-10 mx-auto flex items-center"
        style={{
          maxWidth: "var(--max)",
          gap: "60px",
        }}
      >
        {/* Left column */}
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
            Authentic African Food, Delivered Anywhere
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
            Shop your favorite African groceries, pay securely, and track your
            delivery in real time. We deliver the best in real time
          </p>
          <div className="flex" style={{ gap: "16px" }}>
            <a
              href="/sign-up"
              style={{
                background: "var(--pr)",
                color: "#fff",
                padding: "12px 24px",
                borderRadius: "24px",
                fontSize: "18px",
                fontWeight: 700,
                lineHeight: "21.6px",
                border: "1px solid transparent",
                textDecoration: "none",
              }}
            >
              Start for free
            </a>
            <a
              href="#"
              className="flex items-center"
              style={{
                background: "#fff",
                border: "1px solid rgba(208,230,254,1)",
                borderRadius: "24px",
                padding: "10px 18px",
                boxShadow: "0 2px 4px rgba(0,0,0,0.5)",
                fontSize: "17.7px",
                fontWeight: 700,
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
              Watch video
            </a>
          </div>
        </div>

        {/* Right column */}
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
