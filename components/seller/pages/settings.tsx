"use client";

import { useState } from "react";
import { useSeller } from "@/components/seller/seller-context";

export function SettingsPage() {
  const { showToast } = useSeller();
  const [storeName, setStoreName] = useState("Akara Market");
  const [description, setDescription] = useState("Premium African food ingredients — jollof spices, groundnut paste, smoked fish, and more delivered fresh.");
  const [email, setEmail] = useState("hello@akaramarket.com");
  const [phone, setPhone] = useState("+234 800 AKARA");

  function handleSaveStore(e: React.FormEvent) {
    e.preventDefault();
    showToast("Settings saved successfully!", "success");
  }

  function handleSaveBank(e: React.FormEvent) {
    e.preventDefault();
    showToast("Bank details saved!", "success");
  }

  return (
    <div>
      <style>{`
        .s-page-h { font-size:20px; font-weight:600; color:var(--ink); letter-spacing:-0.03em; margin:0 0 4px; }
        .s-page-sub { font-size:13px; color:var(--muted-text); margin:0 0 20px; }
        .s-col-2 { display:grid; grid-template-columns:1fr 1fr; gap:12px; }
        .s-card { background:#fff; border-radius:8px; border:1px solid var(--hairline); box-shadow:0 1px 3px rgba(0,0,0,0.04); padding:20px; }
        .s-settings-section { margin-bottom:20px; }
        .s-settings-section h3 { font-size:13px; font-weight:600; color:var(--ink); margin:0 0 12px; }
        .s-fg { margin-bottom:12px; }
        .s-fg label { display:block; font-size:12px; font-weight:450; color:var(--body); margin-bottom:4px; }
        .s-fi { width:100%; height:38px; padding:0 10px; border:1px solid var(--hairline); border-radius:var(--radius-sm); font-size:12px; outline:none; }
        .s-fi:focus { border-color:var(--primary); box-shadow:0 0 0 3px var(--primary-bg); }
        .s-fi textarea { height:auto; resize:vertical; }
        textarea.s-fi { padding:8px 10px; min-height:60px; }
        select.s-fi { appearance:auto; }
        .s-btn { display:inline-flex; align-items:center; gap:6px; padding:7px 14px; border-radius:var(--radius-sm); font-size:12px; font-weight:500; cursor:pointer; border:none; transition:all 150ms; }
        .s-btn-p { background:var(--primary); color:#fff; }
        .s-btn-p:hover { background:var(--primary-deep); }
        @media (max-width:768px) { .s-col-2 { grid-template-columns:1fr; } }
      `}</style>

      <div className="s-page-h">Settings</div>
      <div className="s-page-sub">Manage your store profile and payment details</div>

      <div className="s-col-2">
        <div className="s-card">
          <div className="s-settings-section">
            <h3>Store Profile</h3>
            <form onSubmit={handleSaveStore}>
              <div className="s-fg">
                <label>Store Name</label>
                <input className="s-fi" value={storeName} onChange={(e) => setStoreName(e.target.value)} />
              </div>
              <div className="s-fg">
                <label>Store Description</label>
                <textarea className="s-fi" rows={3} value={description} onChange={(e) => setDescription(e.target.value)} />
              </div>
              <div className="s-fg">
                <label>Contact Email</label>
                <input className="s-fi" value={email} onChange={(e) => setEmail(e.target.value)} />
              </div>
              <div className="s-fg">
                <label>Phone</label>
                <input className="s-fi" value={phone} onChange={(e) => setPhone(e.target.value)} />
              </div>
              <button type="submit" className="s-btn s-btn-p">Save Changes</button>
            </form>
          </div>
        </div>

        <div className="s-card">
          <div className="s-settings-section">
            <h3>Bank Information</h3>
            <form onSubmit={handleSaveBank}>
              <div className="s-fg">
                <label>Bank Name</label>
                <select className="s-fi">
                  <option>GTBank</option>
                  <option>Access Bank</option>
                  <option>First Bank</option>
                  <option>UBA</option>
                </select>
              </div>
              <div className="s-fg">
                <label>Account Number</label>
                <input className="s-fi" defaultValue="0123456789" />
              </div>
              <div className="s-fg">
                <label>Account Name</label>
                <input className="s-fi" defaultValue="Akara Market Ventures" />
              </div>
              <button type="submit" className="s-btn s-btn-p">Save Changes</button>
            </form>
          </div>

          <div className="s-settings-section" style={{ marginTop: 24 }}>
            <h3>Payout Preferences</h3>
            <div className="s-fg">
              <label>Auto Withdraw Threshold</label>
              <select className="s-fi">
                <option>₦50,000</option>
                <option selected>₦100,000</option>
                <option>₦200,000</option>
              </select>
            </div>
            <div className="s-fg">
              <label>Payout Schedule</label>
              <select className="s-fi">
                <option>Manual only</option>
                <option selected>Weekly (every Monday)</option>
                <option>Bi-weekly</option>
              </select>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
