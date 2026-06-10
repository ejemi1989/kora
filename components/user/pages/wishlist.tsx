"use client";

import { useUser } from "@/components/user/user-context";
import { XIcon } from "@/components/user/icons";
import { useRouter } from "next/navigation";

export function WishlistPage() {
  const { wishlist, setWishlist, addToCart, showToast, setPage } = useUser();
  const router = useRouter();

  function handleRemove(id: string) {
    setWishlist((prev) => prev.filter((i) => i.id !== id));
    showToast("Removed");
  }

  function handleAddToCart(id: string, name: string, price: number, emoji?: string) {
    addToCart({ id, name, price, emoji });
    showToast("Added to cart");
  }

  if (wishlist.length === 0) {
    return (
      <div>
        <h1 style={{ fontSize: 20, fontWeight: 600, letterSpacing: "-0.03em", color: "var(--ink)", marginBottom: 4 }}>Wishlist</h1>
        <div style={{ textAlign: "center", padding: "48px 20px" }}>
          <div style={{ fontSize: 36, color: "var(--stone)", marginBottom: 8 }}>\uD83D\uDC9C</div>
          <h3 style={{ fontSize: 14, fontWeight: 500, color: "var(--muted)", margin: "0 0 4px" }}>Your wishlist is empty</h3>
          <p style={{ fontSize: 12, color: "var(--ash)", margin: "0 0 12px" }}>Save items you love for later.</p>
          <button onClick={() => { setPage("shop"); router.push("/user/shop"); }} style={{ padding: "6px 14px", fontSize: 12, borderRadius: 6, border: "none", background: "var(--primary)", color: "#fff", cursor: "pointer" }}>
            Discover Products
          </button>
        </div>
      </div>
    );
  }

  return (
    <div>
      <h1 style={{ fontSize: 20, fontWeight: 600, letterSpacing: "-0.03em", color: "var(--ink)", marginBottom: 16 }}>
        Wishlist <span style={{ fontSize: 13, fontWeight: 400, color: "var(--muted)", letterSpacing: 0 }}>&middot; {wishlist.length} items</span>
      </h1>

      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(160px, 1fr))", gap: 10 }}>
        {wishlist.map((item) => (
          <div key={item.id} style={{ background: "#fff", borderRadius: 8, boxShadow: "0 0 0 1px rgba(0,0,0,0.04), 0 1px 2px rgba(0,0,0,0.04)", overflow: "hidden", transition: "all 150ms" }}
            onMouseEnter={(e) => { e.currentTarget.style.boxShadow = "0 0 0 1px var(--primary), 0 2px 4px rgba(0,0,0,0.04), 0 4px 12px rgba(0,0,0,0.04)"; }}
            onMouseLeave={(e) => { e.currentTarget.style.boxShadow = "0 0 0 1px rgba(0,0,0,0.04), 0 1px 2px rgba(0,0,0,0.04)"; }}
          >
            <div style={{ height: 100, background: "var(--surface-soft)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 28, position: "relative" }}>
              {item.emoji || "\uD83D\uDCE6"}
              <button onClick={() => handleRemove(item.id)} style={{ position: "absolute", top: 6, right: 6, width: 24, height: 24, borderRadius: "50%", border: "none", background: "#fff", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", boxShadow: "0 1px 3px rgba(0,0,0,0.1)", color: "var(--stone)" }}
                onMouseEnter={(e) => { e.currentTarget.style.color = "var(--danger)"; }}
                onMouseLeave={(e) => { e.currentTarget.style.color = "var(--stone)"; }}
              >
                <XIcon size={12} />
              </button>
            </div>
            <div style={{ padding: 10 }}>
              <div style={{ fontSize: 12, fontWeight: 500, color: "var(--ink)", marginBottom: 4 }}>{item.name}</div>
              <div style={{ fontSize: 13, fontWeight: 600, color: "var(--primary)", marginBottom: 8 }}>{'\u20A6'}{item.price.toFixed(2)}</div>
              <button onClick={() => handleAddToCart(item.id, item.name, item.price, item.emoji)} style={{ width: "100%", padding: "6px 0", fontSize: 11, fontWeight: 500, borderRadius: 6, border: "none", background: "var(--primary)", color: "#fff", cursor: "pointer" }}>
                Add to cart
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
