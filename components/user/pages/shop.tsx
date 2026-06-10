"use client";

import { useState } from "react";
import { useUser } from "@/components/user/user-context";
import { PRODUCTS, CATEGORIES } from "@/lib/data/user";
import { SearchIcon, StarIcon } from "@/components/user/icons";

export function ShopPage() {
  const { cartItems, addToCart, showToast } = useUser();
  const [cat, setCat] = useState("All");
  const [q, setQ] = useState("");
  const [loadingId, setLoadingId] = useState<string | null>(null);

  const filtered = PRODUCTS.filter((p) => {
    if (cat !== "All" && p.category !== cat) return false;
    if (q && !p.name.toLowerCase().includes(q.toLowerCase())) return false;
    return true;
  });

  function handleAdd(product: typeof PRODUCTS[number]) {
    setLoadingId(product.id);
    const existing = cartItems.find((i) => i.id === product.id);
    setTimeout(() => {
      addToCart({ id: product.id, name: product.name, price: product.price, description: product.description, emoji: product.emoji });
      setLoadingId(null);
      const newQty = (existing?.qty || 0) + 1;
      showToast(`\u2705 ${product.name} \u2014 Qty: ${newQty}`);
    }, 500);
  }

  const inCart = (name: string) => cartItems.some((i) => i.name === name);
  const cartQty = (name: string) => cartItems.find((i) => i.name === name)?.qty || 0;

  return (
    <div>
      <h1 style={{ fontSize: 20, fontWeight: 600, letterSpacing: "-0.03em", color: "var(--ink)", marginBottom: 4 }}>Shop</h1>
      <p style={{ fontSize: 13, color: "var(--muted)", marginBottom: 16 }}>Discover authentic African products</p>

      <div style={{ position: "relative", maxWidth: 320, marginBottom: 16 }}>
        <input
          type="text"
          placeholder="Search products..."
          value={q}
          onChange={(e) => setQ(e.target.value)}
          style={{ width: "100%", height: 38, padding: "0 12px 0 36px", borderRadius: 6, border: "1px solid var(--hairline)", fontSize: 13, outline: "none", boxSizing: "border-box" }}
        />
        <div style={{ position: "absolute", left: 10, top: "50%", transform: "translateY(-50%)", color: "var(--stone)", pointerEvents: "none" }}>
          <SearchIcon size={16} />
        </div>
      </div>

      <div style={{ display: "flex", flexWrap: "wrap", gap: 6, marginBottom: 20 }}>
        {CATEGORIES.map((c) => (
          <button
            key={c}
            onClick={() => setCat(c)}
            style={{
              padding: "5px 12px", fontSize: 12, borderRadius: 999, border: "none",
              background: cat === c ? "var(--primary)" : "var(--surface-soft)",
              color: cat === c ? "#fff" : "var(--body)", cursor: "pointer", fontWeight: 500,
            }}
          >
            {c}
          </button>
        ))}
      </div>

      {filtered.length === 0 ? (
        <div style={{ textAlign: "center", padding: "48px 20px" }}>
          <div style={{ fontSize: 36, color: "var(--stone)", marginBottom: 8 }}>\uD83D\uDD0D</div>
          <h3 style={{ fontSize: 14, fontWeight: 500, color: "var(--muted)", margin: "0 0 4px" }}>No products found</h3>
          <p style={{ fontSize: 12, color: "var(--ash)", margin: 0 }}>Try adjusting your search or category</p>
        </div>
      ) : (
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(160px, 1fr))", gap: 10 }}>
          {filtered.map((product) => {
            const loading = loadingId === product.id;
            const alreadyInCart = inCart(product.name);
            const qty = cartQty(product.name);
            return (
              <div key={product.id} style={{ background: "#fff", borderRadius: 8, boxShadow: "0 0 0 1px rgba(0,0,0,0.04), 0 1px 2px rgba(0,0,0,0.04)", overflow: "hidden", transition: "all 150ms", cursor: "pointer" }}
                onMouseEnter={(e) => { e.currentTarget.style.boxShadow = "0 0 0 1px var(--primary), 0 2px 4px rgba(0,0,0,0.04), 0 4px 12px rgba(0,0,0,0.04)"; e.currentTarget.style.transform = "translateY(-2px)"; }}
                onMouseLeave={(e) => { e.currentTarget.style.boxShadow = "0 0 0 1px rgba(0,0,0,0.04), 0 1px 2px rgba(0,0,0,0.04)"; e.currentTarget.style.transform = "none"; }}
              >
                <div style={{ height: 110, background: "var(--surface-soft)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 36, position: "relative" }}>
                  {product.tag && (
                    <span style={{ position: "absolute", top: 6, left: 6, padding: "2px 6px", borderRadius: 4, fontSize: 9, fontWeight: 600, textTransform: "uppercase",
                      background: product.tag === "popular" ? "var(--primary-bg)" : product.tag === "new" ? "var(--success-bg)" : "var(--warning-bg)",
                      color: product.tag === "popular" ? "var(--primary)" : product.tag === "new" ? "var(--success)" : "var(--warning)",
                    }}>{product.tag === "sale" ? "Sale" : product.tag}</span>
                  )}
                  {product.emoji}
                </div>
                <div style={{ padding: "10px" }}>
                  <div style={{ fontSize: 12, fontWeight: 500, color: "var(--ink)", marginBottom: 2, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{product.name}</div>
                  {product.description && <div style={{ fontSize: 10, color: "var(--ash)", marginBottom: 4, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{product.description}</div>}
                  <div style={{ display: "flex", alignItems: "center", gap: 2, fontSize: 10, color: "var(--muted)", marginBottom: 4 }}>
                    <StarIcon size={10} /> {product.rating}
                  </div>
                  <div style={{ display: "flex", alignItems: "center", gap: 4, marginBottom: 8 }}>
                    <span style={{ fontSize: 13, fontWeight: 600, color: "var(--primary)" }}>{'\u20A6'}{product.price.toFixed(2)}</span>
                    {product.origPrice && <span style={{ fontSize: 11, color: "var(--stone)", textDecoration: "line-through" }}>{'\u20A6'}{product.origPrice.toFixed(2)}</span>}
                  </div>
                  <button
                    onClick={() => handleAdd(product)}
                    disabled={loading}
                    style={{ width: "100%", padding: "6px 0", fontSize: 11, borderRadius: 6, border: "none", background: loading ? "var(--surface-soft)" : "var(--primary)", color: "#fff", cursor: loading ? "default" : "pointer", opacity: loading ? 0.7 : 1 }}
                  >
                    {loading ? "Adding..." : alreadyInCart ? `Add again (${qty})` : "Add to cart"}
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
