"use client";

import { useEffect, useState, useRef } from "react";
import { useUser } from "@clerk/nextjs";
import { useSeller } from "@/components/seller/seller-context";
import { SearchIcon, PlusIcon, XIcon } from "@/components/user/icons";
import { useCurrency } from "@/lib/hooks/use-currency";

interface Product {
  id: string;
  name: string;
  price: number;
  stock: number;
  unit: string;
  category: string;
  status: string;
  images: string[];
  image: string | null;
  sales: number;
  rating: number;
}

const statusBadges: Record<string, string> = {
  active: "badge-active",
  draft: "badge-draft",
  out_of_stock: "badge-oos",
};

const DEFAULT_UNITS = ["kg", "Tonne", "Piece", "Pack", "Litre"];

const PALM_OIL_UNITS = ["1L", "5L", "10L", "20L", "25L"];

function getUnitOptions(category: string) {
  if (category === "Oils & Fats") return PALM_OIL_UNITS;
  return DEFAULT_UNITS;
}

function ProductForm({
  editing,
  onSave,
  onCancel,
}: {
  editing?: Product;
  onSave: (data: { name: string; price: number; stock: number; category: string; unit: string; imageUrl: string | null }) => void;
  onCancel: () => void;
}) {
  const [name, setName] = useState(editing?.name || "");
  const [price, setPrice] = useState(editing?.price.toString() || "");
  const [stock, setStock] = useState(editing?.stock.toString() || "");
  const [category, setCategory] = useState(editing?.category || "Spices & Seasonings");
  const [unit, setUnit] = useState(editing?.unit || "1kg");
  const [imageUrl, setImageUrl] = useState(editing?.image || "");
  const fileRef = useRef<HTMLInputElement>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(editing?.image || null);

  const unitOptions = getUnitOptions(category);

  useEffect(() => {
    if (!unitOptions.includes(unit)) {
      setUnit(unitOptions[0]);
    }
  }, [category]);

  function handleFileChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (file) {
      const url = URL.createObjectURL(file);
      setPreviewUrl(url);
      setImageUrl(url);
    }
  }

  function handleSubmit() {
    if (!name.trim()) return;
    onSave({ name: name.trim(), price: Number(price) || 0, stock: Number(stock) || 0, category, unit, imageUrl: previewUrl });
  }

  function handleRemoveImage() {
    setPreviewUrl(null);
    setImageUrl("");
    if (fileRef.current) fileRef.current.value = "";
  }

  return (
    <div>
      <div className="s-fg">
        <label>Product Image</label>
        <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
          <input ref={fileRef} type="file" accept="image/*" onChange={handleFileChange} style={{ fontSize: 12 }} />
          <div style={{ fontSize: 11, color: "var(--muted-text)" }}>Or paste an image URL:</div>
          <div style={{ display: "flex", gap: 8 }}>
            <input className="s-fi" value={imageUrl} onChange={(e) => { setImageUrl(e.target.value); setPreviewUrl(e.target.value || null); }} placeholder="https://example.com/image.jpg" style={{ flex: 1 }} />
            {previewUrl && (
              <button className="s-btn s-btn-g s-btn-sm" onClick={handleRemoveImage} style={{ color: "var(--danger)" }}><XIcon size={12} /></button>
            )}
          </div>
        </div>
        {previewUrl && <img src={previewUrl} alt="" style={{ width: 72, height: 72, objectFit: "cover", borderRadius: 8, marginTop: 8, border: "1px solid var(--hairline)" }} />}
      </div>
      <div className="s-fg"><label>Product Name</label><input className="s-fi" value={name} onChange={(e) => setName(e.target.value)} placeholder="e.g. Fresh Palm Oil" /></div>
      <div className="s-fr">
        <div className="s-fg"><label>Price (£)</label><input className="s-fi" type="number" value={price} onChange={(e) => setPrice(e.target.value)} placeholder="0" /></div>
        <div className="s-fg"><label>Stock Quantity</label><input className="s-fi" type="number" value={stock} onChange={(e) => setStock(e.target.value)} placeholder="0" /></div>
      </div>
      <div className="s-fg"><label>Category</label>
        <select className="s-fi" value={category} onChange={(e) => setCategory(e.target.value)}>
          <option>Spices & Seasonings</option>
          <option>Oils & Fats</option>
          <option>Grains & Rice</option>
          <option>Fish & Meat</option>
          <option>Vegetables</option>
        </select>
      </div>
      <div className="s-fg">
        <label>Unit / Measurement</label>
        <select className="s-fi" value={unit} onChange={(e) => setUnit(e.target.value)}>
          {unitOptions.map((u) => <option key={u} value={u}>{u}</option>)}
        </select>
        {category === "Oils & Fats" && (
          <div style={{ fontSize: 11, color: "var(--muted-text)", marginTop: 4 }}>Palm oil available in 1L, 5L, 10L, 20L, 25L</div>
        )}
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
  const { isSignedIn } = useUser();
  const { format } = useCurrency();
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState<"all" | "active" | "draft" | "out_of_stock">("all");

  useEffect(() => {
    if (!isSignedIn) return;
    fetch("/api/seller/products")
      .then((r) => r.json())
      .then((d) => {
        if (d && d.success === false) {
          setError(d.error || "Failed to load products");
        } else if (Array.isArray(d)) {
          setProducts(d);
        } else {
          setError("Invalid response from server");
        }
        setLoading(false);
      })
      .catch((err) => {
        setError(err.message || "Failed to load products");
        setLoading(false);
      });
  }, [isSignedIn]);

  const filtered = products.filter((p) => {
    const matchSearch = p.name.toLowerCase().includes(search.toLowerCase()) || p.category.toLowerCase().includes(search.toLowerCase());
    const matchFilter = filter === "all" || p.status === filter;
    return matchSearch && matchFilter;
  });

  async function handleDelete(id: string) {
    if (!confirm("Delete this product?")) return;
    const res = await fetch("/api/seller/products", {
      method: "DELETE",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id }),
    });
    if (res.ok) {
      setProducts((prev) => prev.filter((p) => p.id !== id));
      showToast("Product deleted", "error");
    } else {
      showToast("Failed to delete product", "error");
    }
  }

  async function handleCreate(data: { name: string; price: number; stock: number; category: string; unit: string; imageUrl: string | null }) {
    if (!data.name.trim()) { showToast("Product name is required", "error"); return; }
    const res = await fetch("/api/seller/products", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    });
    if (res.ok) {
      const product = await res.json();
      setProducts((prev) => [product, ...prev]);
      showToast("Product added!", "success");
      closeModal();
    } else {
      const err = await res.json();
      showToast(err.error || "Failed to create product", "error");
    }
  }

  async function handleEdit(p: Product) {
    openModal(`Edit ${p.name}`, (
      <ProductForm
        editing={p}
        onSave={async (data) => {
          if (!data.name.trim()) { showToast("Product name is required", "error"); return; }
          const res = await fetch("/api/seller/products", {
            method: "PATCH",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ id: p.id, ...data }),
          });
          if (res.ok) {
            const updated = await res.json();
            setProducts((prev) => prev.map((x) => (x.id === p.id ? updated : x)));
            showToast(`${data.name} updated!`, "success");
            closeModal();
          } else {
            const err = await res.json();
            showToast(err.error || "Failed to update product", "error");
          }
        }}
        onCancel={closeModal}
      />
    ));
  }

  function handleAdd() {
    openModal("Add Product", (
      <ProductForm
        onSave={handleCreate}
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
        .s-fr { display:grid; grid-template-columns:1fr 1fr; gap:10px; }
        .s-modal-actions { display:flex; justify-content:flex-end; gap:8px; margin-top:16px; }
        .s-loading { text-align:center; padding:48px 0; color:var(--muted-text); font-size:14px; }
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

      {loading ? (
        <div className="s-loading">Loading products...</div>
      ) : error ? (
        <div className="s-loading" style={{ color: "var(--danger)" }}>
          {error}
          <br />
          <button
            onClick={() => window.location.reload()}
            style={{
              marginTop: 12,
              padding: "8px 16px",
              borderRadius: "var(--radius-sm)",
              border: "1px solid var(--hairline)",
              background: "var(--surface-card)",
              cursor: "pointer",
              fontSize: 13,
            }}
          >
            Reload
          </button>
        </div>
      ) : filtered.length === 0 ? (
        <div className="s-loading">No products found</div>
      ) : (
        <div className="s-table-wrap">
          <table className="s-table">
            <thead>
              <tr>
                <th>Product</th>
                <th>Unit</th>
                <th>Category</th>
                <th>Price</th>
                <th>Stock</th>
                <th>Status</th>
                <th></th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((p) => (
                <tr key={p.id}>
                  <td>
                    {p.image && <img src={p.image} alt="" style={{ width: 20, height: 20, borderRadius: 4, objectFit: "cover", marginRight: 6, verticalAlign: "middle" }} />}
                    {p.name}
                  </td>
                  <td style={{ color: "var(--muted-text)", fontSize: 12 }}>{p.unit}</td>
                  <td style={{ color: "var(--muted-text)" }}>{p.category}</td>
                  <td style={{ fontWeight: 500 }}>{format(p.price)}</td>
                  <td>{p.stock}</td>
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
      )}
    </div>
  );
}
