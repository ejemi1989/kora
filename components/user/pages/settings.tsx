"use client";

import { useState } from "react";
import { useUser as useClerkUser } from "@clerk/nextjs";
import { useUser } from "@/components/user/user-context";

export function SettingsPage() {
  const { showToast } = useUser();
  const { user: clerkUser, isLoaded } = useClerkUser();
  const [pwErr, setPwErr] = useState("");
  const [pwOk, setPwOk] = useState(false);
  const [profileSaving, setProfileSaving] = useState(false);
  const [pwSaving, setPwSaving] = useState(false);

  function handleProfileSave() {
    setProfileSaving(true);
    setTimeout(() => {
      setProfileSaving(false);
      showToast("Profile updated");
    }, 800);
  }

  function handlePasswordSave(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const data = new FormData(e.currentTarget);
    const oldPw = data.get("old-pw") as string;
    const newPw = data.get("new-pw") as string;
    const confPw = data.get("conf-pw") as string;

    if (!oldPw || !newPw || !confPw) {
      setPwErr("Fill all fields");
      setPwOk(false);
      return;
    }
    if (newPw.length < 6) {
      setPwErr("Password must be 6+ characters");
      setPwOk(false);
      return;
    }
    if (newPw !== confPw) {
      setPwErr("Passwords do not match");
      setPwOk(false);
      return;
    }

    setPwErr("");
    setPwSaving(true);
    setTimeout(() => {
      setPwSaving(false);
      setPwOk(true);
      showToast("Password updated");
      const form = e.currentTarget;
      form.reset();
      setTimeout(() => setPwOk(false), 2000);
    }, 800);
  }

  return (
    <div>
      <h1 style={{ fontSize: 20, fontWeight: 600, letterSpacing: "-0.03em", color: "var(--ink)", marginBottom: 16 }}>Settings</h1>

      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12, marginBottom: 12 }}>
        <div style={{ background: "#fff", borderRadius: 8, boxShadow: "0 0 0 1px rgba(0,0,0,0.04), 0 1px 2px rgba(0,0,0,0.04)", padding: 16 }}>
          <h3 style={{ fontSize: 12, fontWeight: 600, textTransform: "uppercase", letterSpacing: "0.04em", color: "var(--ink)", margin: "0 0 12px" }}>Profile</h3>
          <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
            <div>
              <label style={{ display: "block", fontSize: 12, fontWeight: 450, color: "var(--body)", marginBottom: 4 }}>Full Name</label>
              <input type="text" defaultValue={clerkUser?.fullName || clerkUser?.username || ""} style={{ width: "100%", height: 38, padding: "0 12px", borderRadius: 6, border: "1px solid var(--hairline)", fontSize: 13, outline: "none", boxSizing: "border-box" }} />
            </div>
            <div>
              <label style={{ display: "block", fontSize: 12, fontWeight: 450, color: "var(--body)", marginBottom: 4 }}>Email</label>
              <input type="email" defaultValue={clerkUser?.primaryEmailAddress?.emailAddress || ""} style={{ width: "100%", height: 38, padding: "0 12px", borderRadius: 6, border: "1px solid var(--hairline)", fontSize: 13, outline: "none", boxSizing: "border-box" }} />
            </div>
            <div>
              <label style={{ display: "block", fontSize: 12, fontWeight: 450, color: "var(--body)", marginBottom: 4 }}>Phone</label>
              <input type="text" defaultValue={clerkUser?.primaryPhoneNumber?.phoneNumber || ""} placeholder="+234 800 000 0000" style={{ width: "100%", height: 38, padding: "0 12px", borderRadius: 6, border: "1px solid var(--hairline)", fontSize: 13, outline: "none", boxSizing: "border-box" }} />
            </div>
            <button onClick={handleProfileSave} disabled={profileSaving} style={{ padding: "8px 20px", fontSize: 13, fontWeight: 500, borderRadius: 6, border: "none", background: profileSaving ? "var(--surface-soft)" : "var(--primary)", color: "#fff", cursor: profileSaving ? "default" : "pointer", opacity: profileSaving ? 0.7 : 1, alignSelf: "flex-start" }}>
              {profileSaving ? "Saving..." : "Save Changes"}
            </button>
          </div>
        </div>

        <div style={{ background: "#fff", borderRadius: 8, boxShadow: "0 0 0 1px rgba(0,0,0,0.04), 0 1px 2px rgba(0,0,0,0.04)", padding: 16 }}>
          <h3 style={{ fontSize: 12, fontWeight: 600, textTransform: "uppercase", letterSpacing: "0.04em", color: "var(--ink)", margin: "0 0 12px" }}>Password</h3>
          <form onSubmit={handlePasswordSave} style={{ display: "flex", flexDirection: "column", gap: 12 }}>
            <div>
              <label style={{ display: "block", fontSize: 12, fontWeight: 450, color: "var(--body)", marginBottom: 4 }}>Current Password</label>
              <input type="password" name="old-pw" id="old-pw" style={{ width: "100%", height: 38, padding: "0 12px", borderRadius: 6, border: "1px solid var(--hairline)", fontSize: 13, outline: "none", boxSizing: "border-box" }} />
            </div>
            <div>
              <label style={{ display: "block", fontSize: 12, fontWeight: 450, color: "var(--body)", marginBottom: 4 }}>New Password</label>
              <input type="password" name="new-pw" id="new-pw" style={{ width: "100%", height: 38, padding: "0 12px", borderRadius: 6, border: "1px solid var(--hairline)", fontSize: 13, outline: "none", boxSizing: "border-box" }} />
            </div>
            <div>
              <label style={{ display: "block", fontSize: 12, fontWeight: 450, color: "var(--body)", marginBottom: 4 }}>Confirm New</label>
              <input type="password" name="conf-pw" id="conf-pw" style={{ width: "100%", height: 38, padding: "0 12px", borderRadius: 6, border: "1px solid var(--hairline)", fontSize: 13, outline: "none", boxSizing: "border-box" }} />
            </div>
            {pwErr && <div style={{ fontSize: 11, color: "var(--danger)" }}>{pwErr}</div>}
            {pwOk && <div style={{ fontSize: 11, color: "var(--success)" }}>\u2713 Password updated</div>}
            <button type="submit" disabled={pwSaving} style={{ padding: "8px 20px", fontSize: 13, fontWeight: 500, borderRadius: 6, border: "none", background: pwSaving ? "var(--surface-soft)" : "var(--primary)", color: "#fff", cursor: pwSaving ? "default" : "pointer", opacity: pwSaving ? 0.7 : 1, alignSelf: "flex-start" }}>
              {pwSaving ? "Updating..." : "Update Password"}
            </button>
          </form>
        </div>
      </div>

      <div style={{ background: "#fff", borderRadius: 8, boxShadow: "0 0 0 1px rgba(0,0,0,0.04), 0 1px 2px rgba(0,0,0,0.04)", padding: 16 }}>
        <h3 style={{ fontSize: 12, fontWeight: 600, textTransform: "uppercase", letterSpacing: "0.04em", color: "var(--ink)", margin: "0 0 12px" }}>Preferences</h3>
        {["Order updates via email", "SMS for delivery alerts", "Promotional offers"].map((label) => (
          <label key={label} style={{ display: "flex", alignItems: "center", gap: 8, fontSize: 13, color: "var(--body)", cursor: "pointer", marginBottom: 8 }}>
            <input type="checkbox" defaultChecked style={{ accentColor: "var(--primary)" }} />
            {label}
          </label>
        ))}
      </div>
    </div>
  );
}
