"use client";

import React, { useEffect, useState } from "react";
import { colors, spacing, typography } from "@/theme/tokens";
import { getAccessToken } from "@/lib/getAccessToken";

interface PartnershipRow {
  id: string;
  name: string;
  contact_email: string | null;
  contact_name: string | null;
  partnership_type: string;
  max_bypasses: number;
  bypasses_used: number;
  is_active: boolean;
  starts_at: string;
  expires_at: string | null;
  notes: string | null;
  created_at: string;
}

export default function AdminPartnershipsPage() {
  const [partnerships, setPartnerships] = useState<PartnershipRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState({ name: "", contact_email: "", contact_name: "", partnership_type: "school", max_bypasses: 50, expires_at: "", notes: "" });
  const [submitting, setSubmitting] = useState(false);

  const fetchPartnerships = async () => {
    setLoading(true);
    try {
      const token = await getAccessToken();
      const res = await fetch("/api/admin/partnerships", {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (res.ok) {
        const data = await res.json();
        setPartnerships(data.partnerships || []);
      }
    } catch { setPartnerships([]); } finally { setLoading(false); }
  };

  useEffect(() => { fetchPartnerships(); }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.name) return;
    setSubmitting(true);
    try {
      const token = await getAccessToken();
      await fetch("/api/admin/partnerships", {
        method: "POST",
        headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
        body: JSON.stringify({ ...form, max_bypasses: Number(form.max_bypasses) || 50, expires_at: form.expires_at || undefined, notes: form.notes || undefined }),
      });
      setForm({ name: "", contact_email: "", contact_name: "", partnership_type: "school", max_bypasses: 50, expires_at: "", notes: "" });
      setShowForm(false);
      fetchPartnerships();
    } catch { /* silent */ } finally { setSubmitting(false); }
  };

  return (
    <div>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: spacing[4] }}>
        <div>
          <h1 style={{ ...typography.display, color: colors.ivory, margin: 0 }}>Partnerships</h1>
          <p style={{ ...typography.caption, color: colors.zinc, margin: 0 }}>
            {partnerships.filter((p) => p.is_active).length} active of {partnerships.length} total
          </p>
        </div>
        <button onClick={() => setShowForm(!showForm)} style={{
          backgroundColor: colors.phosphor, border: "none", borderRadius: 8, color: colors.obsidian,
          cursor: "pointer", fontFamily: typography.ui.fontFamily, fontSize: 13, fontWeight: 600,
          padding: `${spacing[2]}px ${spacing[4]}px`,
        }}>
          {showForm ? "Cancel" : "+ New Partnership"}
        </button>
      </div>

      {showForm && (
        <form onSubmit={handleSubmit} style={{
          backgroundColor: colors.surface, border: `1px solid ${colors.borderSubtle}`,
          borderRadius: 12, padding: spacing[4], marginBottom: spacing[4],
          display: "flex", flexDirection: "column", gap: spacing[3],
        }}>
          <div style={{ display: "flex", gap: spacing[3] }}>
            <input type="text" placeholder="Partner name *" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} required style={inputStyle(colors)} />
            <select value={form.partnership_type} onChange={(e) => setForm({ ...form, partnership_type: e.target.value })} style={inputStyle(colors)}>
              <option value="school">School</option>
              <option value="company">Company</option>
              <option value="influencer">Influencer</option>
              <option value="other">Other</option>
            </select>
          </div>
          <div style={{ display: "flex", gap: spacing[3] }}>
            <input type="email" placeholder="Contact email" value={form.contact_email} onChange={(e) => setForm({ ...form, contact_email: e.target.value })} style={inputStyle(colors)} />
            <input type="text" placeholder="Contact name" value={form.contact_name} onChange={(e) => setForm({ ...form, contact_name: e.target.value })} style={inputStyle(colors)} />
          </div>
          <div style={{ display: "flex", gap: spacing[3], alignItems: "center" }}>
            <label style={{ ...typography.caption, color: colors.zinc, whiteSpace: "nowrap" }}>Max bypasses:</label>
            <input type="number" value={form.max_bypasses} onChange={(e) => setForm({ ...form, max_bypasses: Number(e.target.value) })} style={{ ...inputStyle(colors), width: 80 }} />
            <input type="datetime-local" value={form.expires_at} onChange={(e) => setForm({ ...form, expires_at: e.target.value })} style={inputStyle(colors)} />
            <button type="submit" disabled={submitting} style={{
              backgroundColor: colors.phosphor, border: "none", borderRadius: 8, color: colors.obsidian,
              cursor: "pointer", fontFamily: typography.ui.fontFamily, fontSize: 13, fontWeight: 600,
              opacity: submitting ? 0.5 : 1, padding: `${spacing[2]}px ${spacing[4]}px`,
            }}>
              {submitting ? "Creating…" : "Create"}
            </button>
          </div>
          <textarea placeholder="Notes…" value={form.notes} onChange={(e) => setForm({ ...form, notes: e.target.value })} style={{ ...inputStyle(colors), minHeight: 60, resize: "vertical" }} />
        </form>
      )}

      <div style={{ display: "flex", flexDirection: "column", gap: spacing[3] }}>
        {loading ? (
          <div style={{ textAlign: "center", color: colors.zinc, padding: spacing[8] }}>Loading…</div>
        ) : partnerships.length === 0 ? (
          <div style={{ textAlign: "center", color: colors.zinc, padding: spacing[8] }}>No partnerships yet</div>
        ) : (
          partnerships.map((p) => (
            <div key={p.id} style={{
              backgroundColor: colors.surface, border: `1px solid ${colors.borderSubtle}`,
              borderRadius: 12, padding: `${spacing[4]}px ${spacing[3]}px`,
            }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: spacing[2] }}>
                <div>
                  <h3 style={{ ...typography.h2, color: colors.ivory, margin: 0 }}>{p.name}</h3>
                  <p style={{ ...typography.caption, color: colors.zinc, margin: 0 }}>
                    {p.partnership_type} · {p.contact_name || p.contact_email || "No contact"}
                  </p>
                </div>
                <span style={{
                  backgroundColor: p.is_active ? `${colors.phosphor}20` : `${colors.zinc}20`,
                  borderRadius: 4, color: p.is_active ? colors.phosphor : colors.zinc,
                  fontFamily: typography.ui.fontFamily, fontSize: 11, fontWeight: 600, padding: `2px 6px`,
                }}>
                  {p.is_active ? "Active" : "Inactive"}
                </span>
              </div>
              <div style={{ display: "flex", gap: spacing[4], ...typography.caption, color: colors.zinc }}>
                <span>Bypasses: {p.bypasses_used}/{p.max_bypasses}</span>
                <span>Started: {new Date(p.starts_at).toLocaleDateString()}</span>
                {p.expires_at && <span>Expires: {new Date(p.expires_at).toLocaleDateString()}</span>}
              </div>
              <div style={{ marginTop: spacing[2], width: "100%", height: 4, backgroundColor: colors.obsidian, borderRadius: 2, overflow: "hidden" }}>
                <div style={{
                  width: `${Math.min(100, (p.bypasses_used / Math.max(p.max_bypasses, 1)) * 100)}%`,
                  height: "100%", backgroundColor: colors.phosphor, borderRadius: 2,
                }} />
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}

function inputStyle(colors: Record<string, string>) {
  return {
    backgroundColor: colors.obsidian, border: `1px solid ${colors.borderSubtle}`,
    borderRadius: 8, color: colors.ivory, fontFamily: typography.ui.fontFamily,
    fontSize: 13, padding: `${spacing[2]}px ${spacing[3]}px`, outline: "none", flex: 1,
  } as React.CSSProperties;
}
