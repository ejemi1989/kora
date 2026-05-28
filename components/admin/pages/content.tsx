"use client";

import { useState } from "react";
import { useAdmin } from "@/components/admin/admin-context";
import { ADMIN_BANNERS } from "@/lib/data/admin";
import type { AdminBanner } from "@/lib/types/admin";

export function ContentPage() {
  const { showToast, openModal, closeModal } = useAdmin();
  const [banners, setBanners] = useState(ADMIN_BANNERS);

  const pillClass: Record<string, string> = {
    active: "pill-active",
    scheduled: "pill-pending",
  };

  function handleAddBanner() {
    openModal("Add banner", (
      <div>
        <div className="fg">
          <label className="label">Title</label>
          <input className="fi" placeholder="Banner title" />
        </div>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
          <div className="fg">
            <label className="label">Position</label>
            <select className="fi">
              <option>Hero</option>
              <option>Secondary</option>
              <option>Sidebar</option>
            </select>
          </div>
          <div className="fg">
            <label className="label">Link URL</label>
            <input className="fi" placeholder="https://" />
          </div>
        </div>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
          <div className="fg">
            <label className="label">Start date</label>
            <input className="fi" type="date" />
          </div>
          <div className="fg">
            <label className="label">End date</label>
            <input className="fi" type="date" />
          </div>
        </div>
        <div className="admin-modal-actions">
          <button className="btn btn-s" onClick={closeModal}>Cancel</button>
          <button className="btn btn-p" onClick={() => { showToast("Banner created", "success"); closeModal(); }}>Create banner</button>
        </div>
      </div>
    ));
  }

  function handleSchedule() {
    openModal("Schedule promotion", (
      <div>
        <div className="fg">
          <label className="label">Promotion title</label>
          <input className="fi" placeholder="e.g. Summer Sale" />
        </div>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
          <div className="fg">
            <label className="label">Start date</label>
            <input className="fi" type="date" />
          </div>
          <div className="fg">
            <label className="label">End date</label>
            <input className="fi" type="date" />
          </div>
        </div>
        <div className="fg">
          <label className="label">Description</label>
          <textarea className="fi" rows={3} placeholder="Promotion details..." />
        </div>
        <div className="admin-modal-actions">
          <button className="btn btn-s" onClick={closeModal}>Cancel</button>
          <button className="btn btn-p" onClick={() => { showToast("Promotion scheduled", "success"); closeModal(); }}>Schedule</button>
        </div>
      </div>
    ));
  }

  function handleEdit(banner: AdminBanner) {
    openModal(`Edit ${banner.title}`, (
      <div>
        <div className="fg">
          <label className="label">Title</label>
          <input className="fi" defaultValue={banner.title} />
        </div>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
          <div className="fg">
            <label className="label">Start date</label>
            <input className="fi" type="date" defaultValue={banner.start} />
          </div>
          <div className="fg">
            <label className="label">End date</label>
            <input className="fi" type="date" defaultValue={banner.end} />
          </div>
        </div>
        <div className="admin-modal-actions">
          <button className="btn btn-s" onClick={closeModal}>Cancel</button>
          <button className="btn btn-p" onClick={() => { showToast(`${banner.title} updated`, "success"); closeModal(); }}>Save changes</button>
        </div>
      </div>
    ));
  }

  function handlePause(banner: AdminBanner) {
    showToast(`${banner.title} paused`, "warning");
  }

  function handleCancel(banner: AdminBanner) {
    openModal("Cancel promotion", (
      <div>
        <p style={{ fontSize: 13, color: "var(--body)", margin: "0 0 16px" }}>
          Are you sure you want to cancel <strong>{banner.title}</strong>?
        </p>
        <div className="admin-modal-actions">
          <button className="btn btn-s" onClick={closeModal}>Keep</button>
          <button className="btn btn-d" onClick={() => { showToast(`${banner.title} cancelled`, "danger"); closeModal(); }}>Cancel promotion</button>
        </div>
      </div>
    ));
  }

  return (
    <div>
      <style>{`
        .page-h { font-size:20px; font-weight:600; color:var(--ink); letter-spacing:-0.03em; margin:0 0 4px; }
        .page-sub { font-size:13px; color:var(--muted-text); margin:0 0 20px; }
        .action-bar { display:flex; align-items:center; gap:10px; margin-bottom:16px; flex-wrap:wrap; }
        .btn { display:inline-flex; align-items:center; gap:4px; height:34px; padding:0 14px; border-radius:var(--radius-sm); font-size:12px; font-weight:500; cursor:pointer; transition:all 150ms; border:none; }
        .btn-p { background:var(--primary); color:#fff; }
        .btn-p:hover { background:var(--primary-deep); }
        .btn-s { background:#fff; border:1px solid var(--hairline); color:var(--body); }
        .btn-s:hover { background:var(--surface-soft); }
        .btn-d { background:var(--danger); color:#fff; }
        .table-wrap { background:#fff; border-radius:8px; box-shadow:var(--shadow-card); overflow-x:auto; margin-bottom:16px; }
        .table-wrap table { width:100%; border-collapse:collapse; }
        .table-wrap th { font-size:12px; font-weight:500; color:var(--muted-text); padding:10px 14px; text-align:left; border-bottom:1px solid var(--hairline); white-space:nowrap; }
        .table-wrap td { font-size:13px; color:var(--body); padding:10px 14px; border-bottom:1px solid var(--hairline); vertical-align:middle; }
        .table-wrap tr:last-child td { border-bottom:none; }
        .table-wrap tr:hover td { background:var(--canvas); }
        .pill { display:inline-flex; align-items:center; gap:4px; font-size:11px; padding:2px 8px; border-radius:999px; font-weight:500; }
        .pill::before { content:""; width:5px; height:5px; border-radius:50%; }
        .pill-active { background:rgba(0,112,243,0.1); color:var(--success); }
        .pill-active::before { background:var(--success); }
        .pill-pending { background:rgba(245,166,35,0.1); color:var(--warning); }
        .pill-pending::before { background:var(--warning); }
        .action-link { font-size:12px; color:var(--primary); cursor:pointer; border:none; background:none; padding:0; }
        .action-link:hover { text-decoration:underline; }
        .action-link.danger { color:var(--danger); }
        .fi { width:100%; padding:8px 10px; border:1px solid var(--hairline); border-radius:var(--radius-sm); font-size:13px; outline:none; font-family:inherit; }
        .fi:focus { border-color:var(--primary); box-shadow:0 0 0 3px var(--primary-bg); }
        .fg { margin-bottom:12px; }
        .label { font-size:12px; font-weight:450; color:var(--body); display:block; margin-bottom:4px; }
        .admin-modal-actions { display:flex; justify-content:flex-end; gap:8px; margin-top:16px; }
        .alert { display:flex; align-items:flex-start; gap:8px; padding:10px 14px; border-radius:var(--radius-sm); font-size:13px; }
        .alert-info { background:#e8f3ff; border:1px solid #cce4ff; color:var(--body); }
        .alert-info::before { content:"ℹ️"; font-size:14px; }
      `}</style>

      <div className="page-h">Content</div>
      <div className="page-sub">Manage homepage banners, promotions, and featured content</div>

      <div className="action-bar">
        <button className="btn btn-p" onClick={handleAddBanner}>Add banner</button>
        <button className="btn btn-s" onClick={handleSchedule}>Schedule promotion</button>
      </div>

      <div className="table-wrap">
        <table>
          <thead>
            <tr>
              <th>Title</th>
              <th>Position</th>
              <th>Start</th>
              <th>End</th>
              <th>Status</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {banners.map((b) => (
              <tr key={b.title}>
                <td style={{ fontWeight: 500 }}>{b.title}</td>
                <td>{b.position}</td>
                <td>{b.start}</td>
                <td>{b.end}</td>
                <td><span className={`pill ${pillClass[b.status]}`}>{b.status === "active" ? "Active" : "Scheduled"}</span></td>
                <td>
                  <button className="action-link" onClick={() => handleEdit(b)} style={{ marginRight: 8 }}>Edit</button>
                  {b.status === "active" && <button className="action-link danger" onClick={() => handlePause(b)}>Pause</button>}
                  {b.status === "scheduled" && <button className="action-link danger" onClick={() => handleCancel(b)}>Cancel</button>}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="alert alert-info">Content changes take effect within 5 minutes. Schedule promotions up to 30 days in advance.</div>
    </div>
  );
}
