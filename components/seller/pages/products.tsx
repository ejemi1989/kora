"use client";

import { useState, useRef } from "react";
import { useSeller } from "@/components/seller/seller-context";
import { SELLER_PRODUCTS } from "@/lib/data/seller";
import type { SellerProduct } from "@/lib/types/seller";
import { SearchIcon, PlusIcon, XIcon } from "@/components/user/icons";

const statusBadges: Record<string, string> = {
  active: "badge-active",
  draft: "badge-draft",
  out_of_stock: "badge-oos",
};

const EMOJIS = ["🌶️", "🫒", "🐟", "🥬", "🥜", "🥣", "🫓", "🌰", "🍯", "🥥"];

function ProductForm({
  editing,
  onSave,
  onCancel,
}: {
  editing?: SellerProduct;
  onSave: (data: { name: string; price: number; stock: number; category: string; unit: string; image: string | null }) => void;
  onCancel: () => void;
}) {
  const [name, setName] = useState(editing?.name || "");
  const [price, setPrice] = useState(editing?.price.toString() || "");
  const [stock, setStock] = useState(editing?.stock.toString() || "");
  const [category, setCategory] = useState(editing?.category || "Spices & Seasonings");
  const [unit, setUnit] = useState("Piece");
  const [image, setImage] = useState<string | null>(editing?.image || null);
  const fileRef = useRef<HTMLInputElement>(null);

  function handleImageChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (file) {
      setImage(URL.createObjectURL(file));
    }
  }

  function handleSubmit() {
    if (!name.trim()) return;
    onSave({ name: name.trim(), price: Number(price) || 0, stock: Number(stock) || 0, category, unit, image });
  }

  return (
    <div>
      <div className="s-fg">
        <label>Product Image</label>
        <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
          <input ref={fileRef} type="file" accept="image/*" onChange={handleImageChange} style={{ fontSize: 12, flex: 1 }} />
          {image && (
            <button className="s-btn s-btn-g s-btn-sm" onClick={() => { setImage(null); if (fileRef.current) fileRef.current.value = ""; }} style={{ fontSize: 11, color: "var(--danger)" }}>
              <XIcon size={12} />
            </button>
          )}
        </div>
        {image && <img src={image} alt="" style={{ width: 72, height: 72, objectFit: "cover", borderRadius: 8, marginTop: 8, border: "1px solid var(--hairline)" }} />}
      </div>
      <div className="s-fg"><label>Product Name</label><input className="s-fi" value={name} onChange={(e) => setName(e.target.value)} placeholder="e.g. Fresh Palm Oil" /></div>
      <div className="s-fr">
        <div className="s-fg"><label>Price (₦)</label><input className="s-fi" type="number" value={price} onChange={(e) => setPrice(e.target.value)} placeholder="0" /></div>
        <div className="s-fg"><label>Stock Quantity</label><input className="s-fi" type="number" value={stock} onChange={(e) => setStock(e.target.value)} placeholder="0" /></div>
      </div>
      <div className="s-fr">
        <div className="s-fg"><label>Category</label>
          <select className="s-fi" value={category} onChange={(e) => setCategory(e.target.value)}>
            <option>Spices & Seasonings</option>
            <option>Oils & Fats</option>
            <option>Grains & Rice</option>
            <option>Fish & Meat</option>
            <option>Vegetables</option>
          </select>
        </div>
        <div className="s-fg"><label>Unit</label>
          <select className="s-fi" value={unit} onChange={(e) => setUnit(e.target.value)}>
            <option>Piece</option>
            <option>Kilogram</option>
            <option>Litre</option>
            <option>Pack</option>
          </select>
        </div>
      </div>
      <div className="s-modal-actions">
        <button className="s-btn s-btn-s" onClick={onCancel}>Cancel</button>
        <button className="s-btn s-btn-p" onClick={handleSubmit}>{editing ? "Save Changes" : "Add Product"}</button>
      </div>
    </div>
  );
}

export function ProductsPage() {
  const { showToast, openModal, closeModal } = useSeller();
  const [products, setProducts] = useState(SELLER_PRODUCTS);
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState<"all" | "active" | "draft" | "out_of_stock">("all");

  const filtered = products.filter((p) => {
    const matchSearch = p.name.toLowerCase().includes(search.toLowerCase()) || p.category.toLowerCase().includes(search.toLowerCase());
    const matchFilter = filter === "all" || p.status === filter;
    return matchSearch && matchFilter;
  });

  function handleDelete(id: number) {
    setProducts((prev) => prev.filter((p) => p.id !== id));
    showToast("Product deleted", "error");
  }

  function handleAdd() {
    openModal("Add Product", (
      <ProductForm
        onSave={(data) => {
          const newId = Math.max(0, ...products.map((p) => p.id)) + 1;
          const emoji = EMOJIS[Math.floor(Math.random() * EMOJIS.length)];
          const product: SellerProduct = {
            id: newId,
            name: data.name,
            emoji,
            category: data.category,
            price: data.price,
            stock: data.stock,
            available: data.stock,
            sales: 0,
            status: "draft",
            image: data.image || undefined,
          };
          setProducts((prev) => [product, ...prev]);
          showToast("Product added!", "success");
          closeModal();
        }}
        onCancel={closeModal}
      />
    ));
  }

  function handleEdit(p: SellerProduct) {
    openModal(`Edit ${p.name}`, (
      <ProductForm
        editing={p}
        onSave={(data) => {
          setProducts((prev) => prev.map((x) => x.id === p.id ? {
            ...x,
            name: data.name,
            price: data.price,
            stock: data.stock,
            available: data.stock,
            category: data.category,
            image: data.image || undefined,
          } : x));
          showToast(`${data.name} updated!`, "success");
          closeModal();
        }}
        onCancel={closeModal}
      />
    ));
  }

  return (
    <div>
      <style>{`
        .s-page-h { font-size:20px; font-weight:600; color:var(--ink); letter-spacing:-0.03em; margin:0 0 4px; }
        .s-page-sub { font-size:13px; color:var(--muted-text); margin:0 0 20px; }
        .s-action-bar { display:flex; align-items:center; gap:10px; margin-bottom:16px; flex-wrap:wrap; }
        .s-search-wrap { position:relative; width:220px; }
        .s-search-wrap input { width:100%; height:34px; padding:0 8px 0 30px; border:1px solid var(--hairline); border-radius:var(--radius-sm); font-size:12px; outline:none; background:#fff; }
        .s-search-wrap input:focus { border-color:var(--primary); box-shadow:0 0 0 3px var(--primary-bg); }
        .s-search-wrap svg { position:absolute; left:8px; top:50%; transform:translateY(-50%); color:var(--stone); pointer-events:none; }
        .s-filter-chips { display:flex; gap:6px; flex-wrap:wrap; }
        .s-chip { padding:4px 12px; border-radius:999px; font-size:11px; font-weight:500; border:1px solid var(--hairline); background:#fff; color:var(--body); cursor:pointer; transition:all 150ms; }
        .s-chip:hover { border-color:var(--primary); color:var(--primary); }
        .s-chip.active { background:var(--primary); border-color:var(--primary); color:#fff; }
        .s-btn { display:inline-flex; align-items:center; gap:6px; padding:7px 14px; border-radius:var(--radius-sm); font-size:12px; font-weight:500; cursor:pointer; border:none; transition:all 150ms; }
        .s-btn-p { background:var(--primary); color:#fff; }
        .s-btn-p:hover { background:var(--primary-deep); }
        .s-btn-s { background:#fff; color:var(--body); border:1px solid var(--hairline); }
        .s-btn-s:hover { background:var(--surface-soft); }
        .s-btn-g { background:none; color:var(--muted-text); border:1px solid transparent; }
        .s-btn-g:hover { color:var(--danger); }
        .s-btn-sm { padding:4px 10px; font-size:11px; }
        .s-table-wrap { overflow-x:auto; background:#fff; border-radius:8px; border:1px solid var(--hairline); box-shadow:0 1px 3px rgba(0,0,0,0.04); }
        .s-table { width:100%; border-collapse:collapse; font-size:13px; }
        .s-table th { text-align:left; padding:10px 14px; font-size:11px; font-weight:600; color:var(--ash); text-transform:uppercase; letter-spacing:0.04em; border-bottom:1px solid var(--hairline); background:var(--canvas); }
        .s-table td { padding:10px 14px; border-bottom:1px solid var(--hairline); color:var(--body); }
        .s-table tr:last-child td { border-bottom:none; }
        .s-badge { display:inline-block; padding:2px 8px; border-radius:999px; font-size:10px; font-weight:500; text-transform:uppercase; }
        .badge-active { background:rgba(0,112,243,0.1); color:var(--success); }
        .badge-draft { background:var(--surface-soft); color:var(--muted-text); }
        .badge-oos { background:rgba(238,0,0,0.08); color:var(--danger); }
        .s-fg { margin-bottom:12px; }
        .s-fg label { display:block; font-size:12px; font-weight:450; color:var(--body); margin-bottom:4px; }
        .s-fi { width:100%; height:38px; padding:0 10px; border:1px solid var(--hairline); border-radius:var(--radius-sm); font-size:12px; outline:none; box-sizing:border-box; }
        .s-fi:focus { border-color:var(--primary); box-shadow:0 0 0 3px var(--primary-bg); }
        textarea.s-fi { height:auto; padding:8px 10px; resize:vertical; min-height:60px; }
        .s-fr { display:grid; grid-template-columns:1fr 1fr; gap:10px; }
        .s-modal-actions { display:flex; justify-content:flex-end; gap:8px; margin-top:16px; }
        @media (max-width:768px) { .s-search-wrap { width:100%; } }
      `}</style>

      <div className="s-page-h">Products</div>
      <div className="s-page-sub">Manage your product catalogue</div>

      <div className="s-action-bar">
        <div className="s-search-wrap">
          <SearchIcon size={14} />
          <input placeholder="Search products..." value={search} onChange={(e) => setSearch(e.target.value)} />
        </div>
        <div className="s-filter-chips">
          {(["all", "active", "draft", "out_of_stock"] as const).map((f) => (
            <button key={f} className={`s-chip ${filter === f ? "active" : ""}`} onClick={() => setFilter(f)}>
              {f === "out_of_stock" ? "Out of Stock" : f.charAt(0).toUpperCase() + f.slice(1)}
            </button>
          ))}
        </div>
        <div style={{ marginLeft: "auto" }}>
          <button className="s-btn s-btn-p" onClick={handleAdd}>
            <PlusIcon size={14} />
            Add Product
          </button>
        </div>
      </div>

      <div className="s-table-wrap">
        <table className="s-table">
          <thead>
            <tr>
              <th>Product</th>
              <th>Category</th>
              <th>Price</th>
              <th>Stock</th>
              <th>Sales</th>
              <th>Status</th>
              <th></th>
            </tr>
          </thead>
          <tbody>
            {filtered.map((p) => (
              <tr key={p.id}>
                <td>
                  {p.image && <img src={p.image} alt="" style={{ width: 20, height: 20, borderRadius: 4, objectFit: "cover", marginRight: 6, verticalAlign: "middle" }} />}
                  <span style={{ marginRight: p.image ? 0 : 6 }}>{p.emoji}</span>
                  {p.name}
                </td>
                <td style={{ color: "var(--muted-text)" }}>{p.category}</td>
                <td style={{ fontWeight: 500 }}>₦{p.price.toLocaleString()}</td>
                <td>{p.stock}</td>
                <td>{p.sales}</td>
                <td><span className={`s-badge ${statusBadges[p.status]}`}>{p.status.replace(/_/g, " ")}</span></td>
                <td>
                  <div style={{ display: "flex", gap: 4 }}>
                    <button className="s-btn s-btn-s s-btn-sm" onClick={() => handleEdit(p)}>Edit</button>
                    <button className="s-btn s-btn-g s-btn-sm" onClick={() => handleDelete(p.id)}>Delete</button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
