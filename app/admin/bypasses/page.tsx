"use client";

import React, { useEffect, useState } from "react";
import { colors, spacing, typography } from "@/theme/tokens";
import { getAccessToken } from "@/lib/getAccessToken";

interface BypassRow {
  id: string;
  user_id: string;
  bypass_type: string;
  reason: string;
  is_active: boolean;
  expires_at: string | null;
  created_at: string;
  users?: { email: string; name: string | null };
}

export default function AdminBypassesPage() {
  const [bypasses, setBypasses] = useState<BypassRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState({ user_email: "", bypass_type: "payment", reason: "", expires_at: "" });
  const [submitting, setSubmitting] = useState(false);

  const fetchBypasses = async () => {
    setLoading(true);
    try {
      const token = await getAccessToken();
      const res = await fetch("/api/admin/bypasses", {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (res.ok) {
        const data = await res.json();
        setBypasses(data.bypasses || []);
      }
    } catch {
      setBypasses([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchBypasses(); }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.user_email || !form.reason) return;
    setSubmitting(true);
    try {
      const token = await getAccessToken();
      await fetch("/api/admin/bypasses", {
        method: "POST",
        headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
        body: JSON.stringify({
          ...form,
          expires_at: form.expires_at || undefined,
        }),
      });
      setForm({ user_email: "", bypass_type: "payment", reason: "", expires_at: "" });
      setShowForm(false);
      fetchBypasses();
    } catch {
      // silent
    } finally {
      setSubmitting(false);
    }
  };

  const toggleBypass = async (id: string, is_active: boolean) => {
    try {
      const token = await getAccessToken();
      await fetch("/api/admin/bypasses", {
        method: "PATCH",
        headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
        body: JSON.stringify({ bypass_id: id, is_active: !is_active }),
      });
      fetchBypasses();
    } catch { /* silent */ }
  };

  return (
    <div>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: spacing[4] }}>
        <div>
          <h1 style={{ ...typography.display, color: colors.ivory, margin: 0 }}>Bypasses</h1>
          <p style={{ ...typography.caption, color: colors.zinc, margin: 0 }}>
            {bypasses.filter((b) => b.is_active).length} active of {bypasses.length} total
          </p>
        </div>
        <button
          onClick={() => setShowForm(!showForm)}
          style={{
            backgroundColor: colors.phosphor,
            border: "none",
            borderRadius: 8,
            color: colors.obsidian,
            cursor: "pointer",
            fontFamily: typography.ui.fontFamily,
            fontSize: 13,
            fontWeight: 600,
            padding: `${spacing[2]}px ${spacing[4]}px`,
          }}
        >
          {showForm ? "Cancel" : "+ Grant Bypass"}
        </button>
      </div>

      {/* Grant form */}
      {showForm && (
        <form onSubmit={handleSubmit} style={{
          backgroundColor: colors.surface,
          border: `1px solid ${colors.borderSubtle}`,
          borderRadius: 12,
          padding: spacing[4],
          marginBottom: spacing[4],
          display: "flex",
          flexDirection: "column",
          gap: spacing[3],
        }}>
          <div style={{ display: "flex", gap: spacing[3] }}>
            <input
              type="email"
              placeholder="User email *"
              value={form.user_email}
              onChange={(e) => setForm({ ...form, user_email: e.target.value })}
              required
              style={inputStyle(colors)}
            />
            <select
              value={form.bypass_type}
              onChange={(e) => setForm({ ...form, bypass_type: e.target.value })}
              style={inputStyle(colors)}
            >
              <option value="payment">Payment</option>
              <option value="early_access">Early Access</option>
              <option value="partnership">Partnership</option>
              <option value="other">Other</option>
            </select>
          </div>
          <input
            type="text"
            placeholder="Reason *"
            value={form.reason}
            onChange={(e) => setForm({ ...form, reason: e.target.value })}
            required
            style={inputStyle(colors)}
          />
          <div style={{ display: "flex", gap: spacing[3], alignItems: "center" }}>
            <input
              type="datetime-local"
              placeholder="Expires (optional)"
              value={form.expires_at}
              onChange={(e) => setForm({ ...form, expires_at: e.target.value })}
              style={inputStyle(colors)}
            />
            <button
              type="submit"
              disabled={submitting}
              style={{
                backgroundColor: colors.phosphor,
                border: "none",
                borderRadius: 8,
                color: colors.obsidian,
                cursor: "pointer",
                fontFamily: typography.ui.fontFamily,
                fontSize: 13,
                fontWeight: 600,
                opacity: submitting ? 0.5 : 1,
                padding: `${spacing[2]}px ${spacing[4]}px`,
              }}
            >
              {submitting ? "Granting…" : "Grant Bypass"}
            </button>
          </div>
        </form>
      )}

      {/* Table */}
      <div style={{
        backgroundColor: colors.surface,
        border: `1px solid ${colors.borderSubtle}`,
        borderRadius: 12,
        overflow: "hidden",
      }}>
        <table style={{ width: "100%", borderCollapse: "collapse" }}>
          <thead>
            <tr style={{ borderBottom: `1px solid ${colors.borderSubtle}` }}>
              {["User", "Type", "Reason", "Status", "Expires", ""].map((h) => (
                <th key={h} style={{
                  ...typography.caption,
                  color: colors.zinc,
                  textAlign: "left",
                  padding: `${spacing[2]}px ${spacing[3]}px`,
                  fontWeight: 600,
                }}>{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr><td colSpan={6} style={{ padding: spacing[4], textAlign: "center", color: colors.zinc }}>Loading…</td></tr>
            ) : bypasses.length === 0 ? (
              <tr><td colSpan={6} style={{ padding: spacing[4], textAlign: "center", color: colors.zinc }}>No bypasses yet</td></tr>
            ) : (
              bypasses.map((b) => (
                <tr key={b.id} style={{ borderBottom: `1px solid ${colors.borderSubtle}` }}>
                  <td style={{ ...typography.ui, color: colors.ivory, padding: `${spacing[2]}px ${spacing[3]}px` }}>
                    {b.users?.email || b.user_id.substring(0, 8)}
                  </td>
                  <td style={{ padding: `${spacing[2]}px ${spacing[3]}px` }}>
                    <TypeBadge type={b.bypass_type} colors={colors} />
                  </td>
                  <td style={{ ...typography.caption, color: colors.zinc, padding: `${spacing[2]}px ${spacing[3]}px` }}>
                    {b.reason}
                  </td>
                  <td style={{ padding: `${spacing[2]}px ${spacing[3]}px` }}>
                    <span style={{
                      backgroundColor: b.is_active ? `${colors.phosphor}20` : `${colors.zinc}20`,
                      borderRadius: 4,
                      color: b.is_active ? colors.phosphor : colors.zinc,
                      fontFamily: typography.ui.fontFamily,
                      fontSize: 11,
                      fontWeight: 600,
                      padding: `2px 6px`,
                    }}>
                      {b.is_active ? "Active" : "Revoked"}
                    </span>
                  </td>
                  <td style={{ ...typography.caption, color: colors.zinc, padding: `${spacing[2]}px ${spacing[3]}px` }}>
                    {b.expires_at ? new Date(b.expires_at).toLocaleDateString() : "Never"}
                  </td>
                  <td style={{ padding: `${spacing[2]}px ${spacing[3]}px` }}>
                    <button
                      onClick={() => toggleBypass(b.id, b.is_active)}
                      style={{
                        background: "none",
                        border: `1px solid ${colors.borderSubtle}`,
                        borderRadius: 6,
                        color: b.is_active ? colors.amber : colors.phosphor,
                        cursor: "pointer",
                        fontFamily: typography.ui.fontFamily,
                        fontSize: 11,
                        padding: `${spacing[1]}px ${spacing[2]}px`,
                      }}
                    >
                      {b.is_active ? "Revoke" : "Reactivate"}
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}

function TypeBadge({ type, colors }: { type: string; colors: Record<string, string> }) {
  const colorMap: Record<string, string> = {
    payment: colors.phosphor,
    early_access: colors.amber,
    partnership: colors.violet,
    other: colors.zinc,
  };
  const c = colorMap[type] || colors.zinc;
  return (
    <span style={{
      backgroundColor: `${c}20`,
      borderRadius: 4,
      color: c,
      fontFamily: typography.ui.fontFamily,
      fontSize: 11,
      fontWeight: 600,
      padding: `2px 6px`,
    }}>
      {type}
    </span>
  );
}

function inputStyle(colors: Record<string, string>) {
  return {
    backgroundColor: colors.obsidian,
    border: `1px solid ${colors.borderSubtle}`,
    borderRadius: 8,
    color: colors.ivory,
    fontFamily: typography.ui.fontFamily,
    fontSize: 13,
    padding: `${spacing[2]}px ${spacing[3]}px`,
    outline: "none",
    flex: 1,
  } as React.CSSProperties;
}
