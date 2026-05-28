import Link from "next/link";

const navLinks = ["Shops", "Sellers", "How it works", "Pricing"];

export function Navbar() {
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
          {navLinks.map((label) => (
            <Link
              key={label}
              href="#"
              className="hidden md:inline"
              style={{
                fontSize: "16px",
                fontWeight: 500,
                color: "var(--pr)",
              }}
            >
              {label}
            </Link>
          ))}
        </div>
        <div className="flex items-center" style={{ gap: "24px" }}>
          <div
            className="flex items-center"
            style={{ gap: "5px", fontSize: "15.5px", fontWeight: 500, color: "var(--pr)" }}
          >
            <img
              src="/icons/vector-74.svg"
              alt=""
              style={{ fill: "rgba(193,45,7,1)", width: "18px", height: "18px" }}
            />
            <span className="hidden sm:inline">English</span>
          </div>
          <Link
            href="/login"
            style={{
              fontSize: "15.9px",
              fontWeight: 500,
              color: "var(--pr)",
              textDecoration: "none",
            }}
          >
            Login
          </Link>
          <Link
            href="/signup"
            style={{
              background: "var(--pr)",
              color: "#fff",
              padding: "10px 20px",
              borderRadius: "24px",
              fontSize: "15.9px",
              fontWeight: 500,
              border: "1px solid transparent",
              textDecoration: "none",
            }}
          >
            Start for free
          </Link>
        </div>
      </div>
    </nav>
  );
}
