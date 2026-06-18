"use client";

import React, { useEffect, useState, useCallback } from "react";
import { colors, spacing, typography } from "@/theme/tokens";
import { getAccessToken } from "@/lib/getAccessToken";

interface UserRow {
  id: string;
  email: string;
  name: string | null;
  role: string;
  tier: string;
  created_at: string;
  priority_language: string;
}

export default function AdminUsersPage() {
  const [users, setUsers] = useState<UserRow[]>([]);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(1);
  const [q, setQ] = useState("");
  const [loading, setLoading] = useState(true);
  const [selectedUser, setSelectedUser] = useState<UserRow | null>(null);
  const limit = 20;

  const fetchUsers = useCallback(async () => {
    setLoading(true);
    try {
      const token = await getAccessToken();
      const params = new URLSearchParams({ page: String(page), limit: String(limit) });
      if (q) params.set("q", q);
      const res = await fetch(`/api/admin/users?${params}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (res.ok) {
        const data = await res.json();
        setUsers(data.users || []);
        setTotal(data.total || 0);
      }
    } catch {
      setUsers([]);
    } finally {
      setLoading(false);
    }
  }, [page, q]);

  useEffect(() => { fetchUsers(); }, [fetchUsers]);

  const totalPages = Math.ceil(total / limit);

  return (
    <div>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: spacing[4] }}>
        <div>
          <h1 style={{ ...typography.display, color: colors.ivory, margin: 0 }}>Users</h1>
          <p style={{ ...typography.caption, color: colors.zinc, margin: 0 }}>{total} total</p>
        </div>
        <input
          type="text"
          placeholder="Search email or name…"
          value={q}
          onChange={(e) => { setQ(e.target.value); setPage(1); }}
          style={{
            backgroundColor: colors.surface,
            border: `1px solid ${colors.borderSubtle}`,
            borderRadius: 8,
            color: colors.ivory,
            fontFamily: typography.ui.fontFamily,
            fontSize: 13,
            padding: `${spacing[2]}px ${spacing[3]}px`,
            width: 240,
            outline: "none",
          }}
        />
      </div>

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
              {["Email", "Name", "Role", "Tier", "Joined", ""].map((h) => (
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
            ) : users.length === 0 ? (
              <tr><td colSpan={6} style={{ padding: spacing[4], textAlign: "center", color: colors.zinc }}>No users found</td></tr>
            ) : (
              users.map((u) => (
                <tr key={u.id} style={{ borderBottom: `1px solid ${colors.borderSubtle}` }}>
                  <td style={{ ...typography.ui, color: colors.ivory, padding: `${spacing[2]}px ${spacing[3]}px` }}>{u.email}</td>
                  <td style={{ ...typography.ui, color: colors.zinc, padding: `${spacing[2]}px ${spacing[3]}px` }}>{u.name || "—"}</td>
                  <td style={{ padding: `${spacing[2]}px ${spacing[3]}px` }}>
                    <RoleBadge role={u.role} />
                  </td>
                  <td style={{ ...typography.ui, color: colors.zinc, padding: `${spacing[2]}px ${spacing[3]}px` }}>{u.tier}</td>
                  <td style={{ ...typography.caption, color: colors.zinc, padding: `${spacing[2]}px ${spacing[3]}px` }}>
                    {new Date(u.created_at).toLocaleDateString()}
                  </td>
                  <td style={{ padding: `${spacing[2]}px ${spacing[3]}px` }}>
                    <button
                      onClick={() => setSelectedUser(u)}
                      style={{
                        background: "none",
                        border: `1px solid ${colors.borderSubtle}`,
                        borderRadius: 6,
                        color: colors.zinc,
                        cursor: "pointer",
                        fontFamily: typography.ui.fontFamily,
                        fontSize: 11,
                        padding: `${spacing[1]}px ${spacing[2]}px`,
                      }}
                    >
                      View
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
        <div style={{ display: "flex", justifyContent: "center", gap: spacing[2], marginTop: spacing[3] }}>
          {Array.from({ length: Math.min(totalPages, 10) }, (_, i) => i + 1).map((p) => (
            <button
              key={p}
              onClick={() => setPage(p)}
              style={{
                background: p === page ? colors.phosphor : colors.surface,
                border: `1px solid ${colors.borderSubtle}`,
                borderRadius: 6,
                color: p === page ? colors.obsidian : colors.ivory,
                cursor: "pointer",
                fontFamily: typography.ui.fontFamily,
                fontSize: 12,
                padding: `${spacing[1]}px ${spacing[2]}px`,
              }}
            >
              {p}
            </button>
          ))}
        </div>
      )}

      {/* User detail modal */}
      {selectedUser && (
        <UserDetailModal user={selectedUser} onClose={() => setSelectedUser(null)} />
      )}
    </div>
  );
}

function RoleBadge({ role }: { role: string }) {
  const color = role === "super_admin" ? colors.crimson : role === "admin" ? colors.amber : colors.zinc;
  return (
    <span style={{
      backgroundColor: `${color}20`,
      borderRadius: 4,
      color,
      fontFamily: typography.ui.fontFamily,
      fontSize: 11,
      fontWeight: 600,
      padding: `2px 6px`,
    }}>
      {role}
    </span>
  );
}

function UserDetailModal({ user, onClose }: { user: UserRow; onClose: () => void }) {
  return (
    <div
      style={{
        position: "fixed",
        inset: 0,
        backgroundColor: "rgba(13,13,15,0.85)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        zIndex: 200,
      }}
      onClick={onClose}
    >
      <div
        style={{
          backgroundColor: colors.surface,
          border: `1px solid ${colors.borderSubtle}`,
          borderRadius: 12,
          padding: spacing[6],
          maxWidth: 480,
          width: "90%",
        }}
        onClick={(e) => e.stopPropagation()}
      >
        <h2 style={{ ...typography.h1, color: colors.ivory, margin: 0, marginBottom: spacing[3] }}>
          {user.name || user.email}
        </h2>
        <div style={{ display: "flex", flexDirection: "column", gap: spacing[2], marginBottom: spacing[4] }}>
          <DetailRow label="Email" value={user.email} />
          <DetailRow label="Role" value={user.role} />
          <DetailRow label="Tier" value={user.tier} />
          <DetailRow label="Language" value={user.priority_language} />
          <DetailRow label="Joined" value={new Date(user.created_at).toLocaleString()} />
          <DetailRow label="ID" value={user.id} />
        </div>
        <button
          onClick={onClose}
          style={{
            backgroundColor: colors.obsidian,
            border: `1px solid ${colors.borderSubtle}`,
            borderRadius: 8,
            color: colors.ivory,
            cursor: "pointer",
            fontFamily: typography.ui.fontFamily,
            fontSize: 13,
            padding: `${spacing[2]}px ${spacing[4]}px`,
          }}
        >
          Close
        </button>
      </div>
    </div>
  );
}

function DetailRow({ label, value }: { label: string; value: string }) {
  return (
    <div style={{ display: "flex", justifyContent: "space-between" }}>
      <span style={{ ...typography.caption, color: colors.zinc }}>{label}</span>
      <span style={{ ...typography.ui, color: colors.ivory }}>{value}</span>
    </div>
  );
}
