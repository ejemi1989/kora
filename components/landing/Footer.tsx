import Image from "next/image";

const shopLinks = [
  "Browse Products",
  "Categories",
  "New Arrivals",
  "Best Sellers",
  "Pricing / Commission",
  "Vendor Support",
  "Deals / Discounts",
];

const companyLinks = [
  "About Us",
  "Our Story",
  "Careers",
  "Contact Us",
  "Blog",
  "FAQs",
];

const vendorLinks = [
  "Become a Vendor",
  "Vendor Dashboard Login",
  "Seller Guidelines",
];

const supportLinks = [
  "Delivery Information",
  "Delivery Areas",
  "Track Your Order",
  "Help Center",
  "FAQs",
  "Contact Us",
  "Live Chat",
  "Returns & Refunds",
  "Terms & Conditions",
];

function LinkList({ links }: { links: string[] }) {
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "6px" }}>
      {links.map((label) => (
        <a
          key={label}
          href="#"
          style={{
            fontSize: "15px",
            fontWeight: 400,
            lineHeight: "22.4px",
            color: "var(--ink-landing)",
            textDecoration: "none",
          }}
        >
          {label}
        </a>
      ))}
    </div>
  );
}

export function Footer() {
  return (
    <footer style={{ borderTop: "1px solid var(--line)" }}>
      <div
        className="mx-auto"
        style={{
          maxWidth: "var(--max)",
          padding: "52px var(--pad) 48px",
        }}
      >
        <div
          className="footer-grid grid"
          style={{
            gridTemplateColumns: "220px 1fr 1fr 1fr 1fr",
            gap: "48px",
            alignItems: "start",
          }}
        >
          {/* Column 1 - Newsletter + Logo */}
          <div>
            <p
              style={{
                fontSize: "13.2px",
                lineHeight: "19.6px",
                color: "var(--body-landing)",
                marginBottom: "14px",
              }}
            >
              <strong>Not sure where to start?</strong> Sign up to receive our
              newsletter. a free guide to getting cheaper African products
              delivered to your doorstep.
            </p>
            <div className="flex" style={{ gap: "8px", width: "100%" }}>
              <input
                type="email"
                placeholder="Your email"
                style={{
                  flex: 1,
                  minWidth: 0,
                  height: "38px",
                  border: "1px solid rgba(204,204,204,1)",
                  borderRadius: "99px",
                  padding: "0 14px",
                  fontSize: "13.5px",
                  outline: "none",
                }}
              />
              <button
                type="button"
                style={{
                  flexShrink: 0,
                  height: "38px",
                  padding: "0 16px",
                  background: "var(--pr)",
                  color: "#fff",
                  borderRadius: "99px",
                  fontSize: "14px",
                  border: "none",
                  cursor: "pointer",
                }}
              >
                Sign up
              </button>
            </div>
            <div style={{ marginTop: "24px" }}>
              <Image
                src="/images/Deni.png"
                alt="Deni logo"
                width={68}
                height={68}
                style={{ borderRadius: "10px" }}
              />
            </div>
          </div>

          {/* Column 2 - Shop */}
          <div>
            <p
              style={{
                fontSize: "15.5px",
                fontWeight: 400,
                color: "var(--muted-landing)",
                marginBottom: "8px",
              }}
            >
              Shop / Marketplace
            </p>
            <LinkList links={shopLinks} />
          </div>

          {/* Column 3 - Company */}
          <div>
            <p
              style={{
                fontSize: "15.5px",
                fontWeight: 400,
                color: "var(--muted-landing)",
                marginBottom: "8px",
              }}
            >
              Company
            </p>
            <LinkList links={companyLinks} />
          </div>

          {/* Column 4 - Vendors + Connect */}
          <div>
            <p
              style={{
                fontSize: "15.5px",
                fontWeight: 400,
                color: "var(--muted-landing)",
                marginBottom: "8px",
              }}
            >
              Vendors
            </p>
            <LinkList links={vendorLinks} />
            <div style={{ marginTop: "18px" }}>
              <p
                style={{
                  fontSize: "15.5px",
                  fontWeight: 400,
                  color: "var(--muted-landing)",
                  marginBottom: "8px",
                }}
              >
                Connect
              </p>
              <div className="flex" style={{ gap: "12px" }}>
                <a href="#" style={{ display: "flex", alignItems: "center", gap: "7px", fontSize: "15px", fontWeight: 400, lineHeight: "22.4px", color: "var(--ink-landing)", textDecoration: "none" }}>
                  <img src="/icons/vector-33.svg" alt="Twitter/X" style={{ width: "16px", height: "16px" }} />
                </a>
                <a href="#" style={{ display: "flex", alignItems: "center", gap: "7px", fontSize: "15px", fontWeight: 400, lineHeight: "22.4px", color: "var(--ink-landing)", textDecoration: "none" }}>
                  <img src="/icons/vector-37.svg" alt="Instagram" style={{ width: "16px", height: "16px" }} />
                </a>
                <a href="#" style={{ display: "flex", alignItems: "center", gap: "7px", fontSize: "15px", fontWeight: 400, lineHeight: "22.4px", color: "var(--ink-landing)", textDecoration: "none" }}>
                  <img src="/icons/vector-41.svg" alt="LinkedIn" style={{ width: "16px", height: "16px" }} />
                </a>
              </div>
            </div>
          </div>

          {/* Column 5 - Support */}
          <div>
            <p
              style={{
                fontSize: "15.5px",
                fontWeight: 400,
                color: "var(--muted-landing)",
                marginBottom: "8px",
              }}
            >
              Support
            </p>
            <LinkList links={supportLinks} />
          </div>
        </div>
      </div>

      {/* Footer bottom */}
      <div style={{ borderTop: "1px solid var(--line)" }}>
        <div
          className="flex"
          style={{
            padding: "12px var(--pad)",
            gap: "20px",
            maxWidth: "var(--max)",
            margin: "0 auto",
          }}
        >
        <a
          href="#"
          style={{ fontSize: "13.2px", color: "var(--muted-landing)", textDecoration: "none" }}
        >
          Terms
        </a>
        <a
          href="#"
          style={{ fontSize: "13.2px", color: "var(--muted-landing)", textDecoration: "none" }}
        >
          Privacy policy
        </a>
      </div>
    </div>
    </footer>
  );
}
