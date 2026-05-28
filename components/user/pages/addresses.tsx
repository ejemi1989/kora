"use client";

import { useState } from "react";
import { useUser } from "@/components/user/user-context";
import { ChevronIcon, PlusIcon } from "@/components/user/icons";
import type { UserAddress } from "@/lib/types/user";

type ViewState = null | "add" | number;

interface AddressForm {
  tag: string;
  name: string;
  phone: string;
  address: string;
  isDefault: boolean;
}

const emptyForm: AddressForm = { tag: "Home", name: "", phone: "", address: "", isDefault: false };

export function AddressesPage() {
  const { addresses, setAddresses, showToast } = useUser();
  const [view, setView] = useState<ViewState>(null);
  const [form, setForm] = useState<AddressForm | null>(null);
  const [saving, setSaving] = useState(false);

  const address = typeof view === "number" ? addresses.find((a) => a.id === view) : null;

  if (form) {
    const f = form;
    function handleSave() {
      if (!f.tag || !f.address) {
        showToast("Please fill in required fields");
        return;
      }
      setSaving(true);
      setTimeout(() => {
        if (typeof view === "number") {
          setAddresses((prev) => prev.map((a) => (a.id === view ? { ...a, ...f, phone: f.phone } : a)));
          showToast("Address updated");
        } else {
          const newId = Math.max(...addresses.map((a) => a.id), 0) + 1;
          const newAddr: UserAddress = { id: newId, tag: f.tag, name: f.name, address: f.address, phone: f.phone, isDefault: f.isDefault || addresses.length === 0 };
          if (f.isDefault) setAddresses((prev) => prev.map((a) => ({ ...a, isDefault: false })));
          setAddresses((prev) => [...prev, newAddr]);
          showToast("Address added");
        }
        setForm(null);
        setView(null);
        setSaving(false);
      }, 800);
    }

    return (
      <div>
        <button onClick={() => { setForm(null); setView(null); }} style={{ background: "none", border: "none", cursor: "pointer", padding: 0, display: "flex", alignItems: "center", gap: 4, fontSize: 13, color: "var(--body)", marginBottom: 16 }}>
          <ChevronIcon /> Back
        </button>
        <h1 style={{ fontSize: 20, fontWeight: 600, letterSpacing: "-0.03em", color: "var(--ink)", marginBottom: 16 }}>{typeof view === "number" ? "Edit Address" : "Add Address"}</h1>

        <div style={{ background: "#fff", borderRadius: 8, boxShadow: "0 0 0 1px rgba(0,0,0,0.04), 0 1px 2px rgba(0,0,0,0.04)", padding: 16, maxWidth: 480 }}>
          <div style={{ display: "flex", gap: 6, marginBottom: 16 }}>
            {["Home", "Office", "Parents"].map((tag) => (
              <button key={tag} onClick={() => setForm((prev) => prev ? { ...prev, tag } : prev)} style={{ padding: "5px 14px", fontSize: 12, borderRadius: 999, border: "none", background: form?.tag === tag ? "var(--primary)" : "var(--surface-soft)", color: form?.tag === tag ? "#fff" : "var(--body)", cursor: "pointer", fontWeight: 500 }}>
                {tag}
              </button>
            ))}
          </div>

          <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
            <div>
              <label style={{ display: "block", fontSize: 12, fontWeight: 450, color: "var(--body)", marginBottom: 4 }}>Full Name</label>
              <input type="text" placeholder="Full name" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} style={{ width: "100%", height: 38, padding: "0 12px", borderRadius: 6, border: "1px solid var(--hairline)", fontSize: 13, outline: "none", boxSizing: "border-box" }} />
            </div>
            <div>
              <label style={{ display: "block", fontSize: 12, fontWeight: 450, color: "var(--body)", marginBottom: 4 }}>Phone Number</label>
              <input type="text" placeholder="Phone number" value={form.phone} onChange={(e) => setForm({ ...form, phone: e.target.value })} style={{ width: "100%", height: 38, padding: "0 12px", borderRadius: 6, border: "1px solid var(--hairline)", fontSize: 13, outline: "none", boxSizing: "border-box" }} />
            </div>
            <div>
              <label style={{ display: "block", fontSize: 12, fontWeight: 450, color: "var(--body)", marginBottom: 4 }}>Delivery Address <span style={{ color: "var(--danger)" }}>*</span></label>
              <textarea placeholder="Street, city, state, postal code" value={form.address} onChange={(e) => setForm({ ...form, address: e.target.value })} style={{ width: "100%", minHeight: 70, padding: 8, borderRadius: 6, border: "1px solid var(--hairline)", fontSize: 13, outline: "none", resize: "vertical", boxSizing: "border-box" }} />
            </div>
            <label style={{ display: "flex", alignItems: "center", gap: 8, fontSize: 13, color: "var(--body)", cursor: "pointer" }}>
              <input type="checkbox" checked={form.isDefault} onChange={(e) => setForm({ ...form, isDefault: e.target.checked })} style={{ accentColor: "var(--primary)" }} />
              Set as default
            </label>
          </div>

          <div style={{ display: "flex", gap: 8, marginTop: 16 }}>
            <button onClick={handleSave} disabled={saving} style={{ padding: "8px 20px", fontSize: 13, fontWeight: 500, borderRadius: 6, border: "none", background: saving ? "var(--surface-soft)" : "var(--primary)", color: "#fff", cursor: saving ? "default" : "pointer", opacity: saving ? 0.7 : 1 }}>
              {saving ? "Saving..." : "Save Address"}
            </button>
            <button onClick={() => { setForm(null); setView(null); }} disabled={saving} style={{ padding: "8px 20px", fontSize: 13, borderRadius: 6, border: "1px solid var(--hairline)", background: "#fff", color: "var(--body)", cursor: "pointer" }}>
              Cancel
            </button>
          </div>
        </div>
      </div>
    );
  }

  if (address) {
    return (
      <div>
        <button onClick={() => setView(null)} style={{ background: "none", border: "none", cursor: "pointer", padding: 0, display: "flex", alignItems: "center", gap: 4, fontSize: 13, color: "var(--body)", marginBottom: 16 }}>
          <ChevronIcon /> Back
        </button>

        <div style={{ background: "#fff", borderRadius: 8, boxShadow: "0 0 0 1px rgba(0,0,0,0.04), 0 1px 2px rgba(0,0,0,0.04)", padding: 16, maxWidth: 480 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 6, marginBottom: 4 }}>
            <h2 style={{ fontSize: 15, fontWeight: 500, color: "var(--ink)", margin: 0 }}>{address.name}</h2>
            <span style={{ padding: "1px 6px", borderRadius: 4, fontSize: 9, fontWeight: 500, background: "var(--surface-soft)", color: "var(--muted)" }}>{address.tag}</span>
            {address.isDefault && <span style={{ padding: "1px 6px", borderRadius: 4, fontSize: 9, fontWeight: 500, background: "var(--primary-bg)", color: "var(--primary)" }}>Default</span>}
          </div>
          <div style={{ fontSize: 13, color: "var(--body)", marginBottom: 4 }}>{address.address}</div>
          <div style={{ fontSize: 12, color: "var(--muted)", marginBottom: 16 }}>{address.phone || "\u2014"}</div>

          <div style={{ display: "flex", gap: 8 }}>
            <button onClick={() => setForm({ tag: address.tag, name: address.name, phone: address.phone || "", address: address.address, isDefault: address.isDefault })} style={{ padding: "6px 16px", fontSize: 12, borderRadius: 6, border: "1px solid var(--hairline)", background: "#fff", color: "var(--body)", cursor: "pointer" }}>
              Edit Address
            </button>
            {!address.isDefault && (
              <button onClick={() => {
                setAddresses((prev) => prev.filter((a) => a.id !== address.id));
                setView(null);
                showToast("Address deleted");
              }} style={{ padding: "6px 16px", fontSize: 12, borderRadius: 6, border: "1px solid var(--danger)", background: "#fff", color: "var(--danger)", cursor: "pointer" }}>
                Delete
              </button>
            )}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div>
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 16 }}>
        <h1 style={{ fontSize: 20, fontWeight: 600, letterSpacing: "-0.03em", color: "var(--ink)", margin: 0 }}>Addresses</h1>
        <button onClick={() => setForm({ ...emptyForm })} style={{ padding: "5px 12px", fontSize: 12, borderRadius: 6, border: "none", background: "var(--primary)", color: "#fff", cursor: "pointer", display: "flex", alignItems: "center", gap: 4 }}>
          <PlusIcon size={12} /> Add Address
        </button>
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10 }}>
        {addresses.map((addr) => (
          <div key={addr.id} onClick={() => setView(addr.id)} style={{ background: "#fff", borderRadius: 8, boxShadow: "0 0 0 1px rgba(0,0,0,0.04), 0 1px 2px rgba(0,0,0,0.04)", padding: 14, cursor: "pointer", transition: "all 150ms" }}
            onMouseEnter={(e) => { e.currentTarget.style.boxShadow = "0 0 0 1px var(--primary), 0 2px 4px rgba(0,0,0,0.04)"; }}
            onMouseLeave={(e) => { e.currentTarget.style.boxShadow = "0 0 0 1px rgba(0,0,0,0.04), 0 1px 2px rgba(0,0,0,0.04)"; }}
          >
            <div style={{ display: "flex", alignItems: "center", gap: 6, marginBottom: 4 }}>
              <span style={{ fontSize: 12, fontWeight: 500, color: "var(--ink)" }}>{addr.name}</span>
              <span style={{ padding: "1px 6px", borderRadius: 4, fontSize: 9, fontWeight: 500, background: "var(--surface-soft)", color: "var(--muted)" }}>{addr.tag}</span>
              {addr.isDefault && <span style={{ padding: "1px 6px", borderRadius: 4, fontSize: 9, fontWeight: 500, background: "var(--primary-bg)", color: "var(--primary)" }}>Default</span>}
            </div>
            <div style={{ fontSize: 12, color: "var(--muted)" }}>{addr.address}</div>
          </div>
        ))}
      </div>
    </div>
  );
}
