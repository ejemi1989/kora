"use client";

import { useEffect, useState } from "react";
import { useAdmin } from "@/components/admin/admin-context";
import type { AdminUser } from "@/lib/types/admin";
import { SearchIcon } from "@/components/user/icons";

const filters = ["All", "Active", "Suspended", "Banned"];

const pillClass: Record<string, string> = {
  active: "pill-active",
  suspended: "pill-suspended",
  banned: "pill-danger",
  pending: "pill-pending",
};

export function UsersPage() {
  const { showToast, openModal, closeModal } = useAdmin();
  const [users, setUsers] = useState<AdminUser[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeFilter, setActiveFilter] = useState("All");
  const [search, setSearch] = useState("");

  useEffect(() => {
    fetch("/api/admin/users")
      .then((r) => r.json())
      .then((d) => { if (Array.isArray(d)) setUsers(d); setLoading(false); })
      .catch(() => setLoading(false));
  }, []);

  const filtered = users.filter((u) => {
    if (activeFilter !== "All" && u.status !== activeFilter.toLowerCase()) return false;
    if (search && !u.name.toLowerCase().includes(search.toLowerCase()) && !u.email.toLowerCase().includes(search.toLowerCase())) return false;
    return true;
  });

  async function handleAction(user: AdminUser, action: string, label: string) {
    const res = await fetch("/api/admin/users", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id: user.id, action }),
    });
    if (res.ok) {
      setUsers(users.map((u) => u.id === user.id ? { ...u, status: action === "ban" ? "banned" as const : action === "suspend" ? "suspended" as const : "active" as const } : u));
      showToast(`${user.name} ${label}`, label === "banned" ? "danger" : "success");
      closeModal();
    } else {
      showToast("Action failed", "danger");
    }
  }

  function handleBan(user: AdminUser) {
    openModal("Confirm ban", (
      <div>
        <p style={{ fontSize: 13, color: "var(--body)", margin: "0 0 12px" }}>
          Are you sure you want to ban <strong>{user.name}</strong>? This will revoke their access immediately.
        </p>
        <div className="admin-modal-actions">
          <button className="btn btn-s" onClick={closeModal}>Cancel</button>
          <button className="btn btn-d" onClick={() => handleAction(user, "ban", "banned")}>Ban user</button>
        </div>
      </div>
    ));
  }

  function handleReinstate(user: AdminUser) {
    openModal("Reinstate user", (
      <div>
        <p style={{ fontSize: 13, color: "var(--body)", margin: "0 0 16px" }}>
          Reinstate <strong>{user.name}</strong>? They will regain full platform access.
        </p>
        <div className="admin-modal-actions">
          <button className="btn btn-s" onClick={closeModal}>Cancel</button>
          <button className="btn btn-p" onClick={() => handleAction(user, "reinstate", "reinstated")}>Reinstate</button>
        </div>
      </div>
    ));
  }

  function handleApprove(user: AdminUser) {
    openModal("Approve user", (
      <div>
        <p style={{ fontSize: 13, color: "var(--body)", margin: "0 0 16px" }}>
          Approve <strong>{user.name}</strong>? They will be able to access the platform.
        </p>
        <div className="admin-modal-actions">
          <button className="btn btn-s" onClick={closeModal}>Cancel</button>
          <button className="btn btn-p" onClick={() => handleAction(user, "approve", "approved")}>Approve</button>
        </div>
      </div>
    ));
  }

  if (loading) return <div style={{ textAlign: "center", padding: 48, color: "var(--muted-text)" }}>Loading users...</div>;

  return (
    <div>
      <style>{`
        .page-h { font-size:20px; font-weight:600; color:var(--ink); letter-spacing:-0.03em; margin:0 0 4px; }
        .page-sub { font-size:13px; color:var(--muted-text); margin:0 0 20px; }
        .action-bar { display:flex; align-items:center; gap:10px; margin-bottom:16px; flex-wrap:wrap; }
        .search-wrap { position:relative; max-width:240px; flex:1; min-width:160px; }
        .search-wrap input { width:100%; height:34px; padding:0 8px 0 28px; border:1px solid var(--hairline); border-radius:var(--radius-sm); font-size:12px; outline:none; background:#fff; }
        .search-wrap input:focus { border-color:var(--primary); box-shadow:0 0 0 3px var(--primary-bg); }
        .search-wrap svg { position:absolute; left:8px; top:50%; transform:translateY(-50%); color:var(--stone); pointer-events:none; }
        .filter-chips { display:flex; gap:4px; flex-wrap:wrap; }
        .chip { padding:4px 12px; border-radius:999px; border:1px solid var(--hairline); background:#fff; font-size:12px; color:var(--body); cursor:pointer; }
        .chip.active { background:var(--primary-bg); border-color:var(--primary); color:var(--primary); font-weight:500; }
        .btn { display:inline-flex; align-items:center; gap:4px; height:34px; padding:0 14px; border-radius:var(--radius-sm); font-size:12px; font-weight:500; cursor:pointer; transition:all 150ms; border:none; }
        .btn-p { background:var(--primary); color:#fff; }
        .btn-p:hover { background:var(--primary-deep); }
        .btn-s { background:#fff; border:1px solid var(--hairline); color:var(--body); }
        .btn-s:hover { background:var(--surface-soft); }
        .btn-d { background:var(--danger); color:#fff; }
        .btn-d:hover { opacity:0.9; }
        .btn-sm { height:28px; padding:0 10px; font-size:11px; }
        .table-wrap { background:#fff; border-radius:8px; box-shadow:var(--shadow-card); overflow-x:auto; }
        .table-wrap table { width:100%; border-collapse:collapse; }
        .table-wrap th { font-size:12px; font-weight:500; color:var(--muted-text); padding:10px 14px; text-align:left; border-bottom:1px solid var(--hairline); white-space:nowrap; }
        .table-wrap td { font-size:13px; color:var(--body); padding:10px 14px; border-bottom:1px solid var(--hairline); vertical-align:middle; }
        .table-wrap tr:last-child td { border-bottom:none; }
        .table-wrap tr:hover td { background:var(--canvas); }
        .mono { font-family:var(--font-mono); font-size:12px; color:var(--ash); }
        .pill { display:inline-flex; align-items:center; gap:4px; font-size:11px; padding:2px 8px; border-radius:999px; font-weight:500; }
        .pill::before { content:""; width:5px; height:5px; border-radius:50%; }
        .pill-active { background:rgba(0,112,243,0.1); color:var(--success); }
        .pill-active::before { background:var(--success); }
        .pill-pending { background:rgba(245,166,35,0.1); color:var(--warning); }
        .pill-pending::before { background:var(--warning); }
        .pill-suspended { background:rgba(238,0,0,0.08); color:var(--danger); }
        .pill-suspended::before { background:var(--danger); }
        .pill-danger { background:rgba(238,0,0,0.08); color:var(--danger); }
        .pill-danger::before { background:var(--danger); }
        .action-link { font-size:12px; color:var(--primary); cursor:pointer; border:none; background:none; padding:0; }
        .action-link:hover { text-decoration:underline; }
        .action-link.danger { color:var(--danger); }
        .admin-modal-actions { display:flex; justify-content:flex-end; gap:8px; margin-top:16px; }
        .admin-spacer { flex:1; }
        @media (max-width:768px) { .search-wrap { max-width:100%; } }
      `}</style>

      <div className="page-h">Users</div>
      <div className="page-sub">Manage platform users — view, search, suspend, or ban accounts</div>

      <div className="action-bar">
        <div className="search-wrap">
          <SearchIcon size={14} />
          <input placeholder="Search users..." value={search} onChange={(e) => setSearch(e.target.value)} />
        </div>
        <div className="filter-chips">
          {filters.map((f) => (
            <button key={f} className={`chip ${activeFilter === f ? "active" : ""}`} onClick={() => setActiveFilter(f)}>{f}</button>
          ))}
        </div>
        <div className="admin-spacer" />
        <button className="btn btn-s" onClick={() => showToast("Export started — CSV will download shortly", "success")}>Export</button>
      </div>

      {filtered.length === 0 ? (
        <div style={{ textAlign: "center", padding: 48, color: "var(--muted-text)" }}>No users found</div>
      ) : (
        <div className="table-wrap">
          <table>
            <thead>
              <tr>
                <th style={{ width: 30 }}><input type="checkbox" /></th>
                <th>Name</th>
                <th>Email</th>
                <th>Location</th>
                <th>Joined</th>
                <th>Orders</th>
                <th>Status</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((u) => (
                <tr key={u.id}>
                  <td><input type="checkbox" /></td>
                  <td style={{ fontWeight: 500 }}>{u.name}</td>
                  <td><span className="mono">{u.email}</span></td>
                  <td>{u.location || "—"}</td>
                  <td>{u.joined}</td>
                  <td>{u.orders}</td>
                  <td><span className={`pill ${pillClass[u.status]}`}>{u.status}</span></td>
                  <td>
                    {u.status === "active" && <button className="action-link danger" onClick={() => handleBan(u)}>Ban</button>}
                    {u.status === "suspended" && <button className="action-link" onClick={() => handleReinstate(u)}>Reinstate</button>}
                    {u.status === "pending" && <button className="action-link" onClick={() => handleApprove(u)}>Approve</button>}
                    {u.status === "banned" && <span style={{ fontSize: 12, color: "var(--stone)" }}>—</span>}
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
