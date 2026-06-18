"use client";

import React, { useEffect, useState } from "react";
import { colors, spacing, typography } from "@/theme/tokens";
import { getAccessToken } from "@/lib/getAccessToken";

interface AuditRow {
  id: string;
  admin_id: string;
  action: string;
  target_type: string | null;
  target_id: string | null;
  metadata: Record<string, unknown> | null;
  ip_address: string | null;
  created_at: string;
}

export default function AdminAuditPage() {
  const [logs, setLogs] = useState<AuditRow[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchLogs() {
      setLoading(true);
      try {
        const token = await getAccessToken();
        const res = await fetch("/api/admin/audit", {
          headers: { Authorization: `Bearer ${token}` },
        });
        if (res.ok) {
          const data = await res.json();
          setLogs(data.logs || []);
        }
      } catch {
        setLogs([]);
      } finally {
        setLoading(false);
      }
    }
    fetchLogs();
  }, []);

  return (
    <div>
      <h1 style={{ ...typography.display, color: colors.ivory, margin: 0, marginBottom: spacing[1] }}>Audit Log</h1>
      <p style={{ ...typography.caption, color: colors.zinc, margin: 0, marginBottom: spacing[4] }}>
        All admin actions are recorded here
      </p>

      <div style={{
        backgroundColor: colors.surface,
        border: `1px solid ${colors.borderSubtle}`,
        borderRadius: 12,
        overflow: "hidden",
      }}>
        <table style={{ width: "100%", borderCollapse: "collapse" }}>
          <thead>
            <tr style={{ borderBottom: `1px solid ${colors.borderSubtle}` }}>
              {["Time", "Admin", "Action", "Target", "IP"].map((h) => (
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
              <tr><td colSpan={5} style={{ padding: spacing[4], textAlign: "center", color: colors.zinc }}>Loading…</td></tr>
            ) : logs.length === 0 ? (
              <tr><td colSpan={5} style={{ padding: spacing[4], textAlign: "center", color: colors.zinc }}>No audit entries yet</td></tr>
            ) : (
              logs.map((log) => (
                <tr key={log.id} style={{ borderBottom: `1px solid ${colors.borderSubtle}` }}>
                  <td style={{ ...typography.caption, color: colors.zinc, padding: `${spacing[2]}px ${spacing[3]}px`, whiteSpace: "nowrap" }}>
                    {new Date(log.created_at).toLocaleString()}
                  </td>
                  <td style={{ ...typography.ui, color: colors.ivory, padding: `${spacing[2]}px ${spacing[3]}px` }}>
                    {log.admin_id.substring(0, 8)}…
                  </td>
                  <td style={{ padding: `${spacing[2]}px ${spacing[3]}px` }}>
                    <span style={{
                      backgroundColor: `${colors.phosphor}15`,
                      borderRadius: 4,
                      color: colors.phosphor,
                      fontFamily: typography.ui.fontFamily,
                      fontSize: 11,
                      fontWeight: 600,
                      padding: `2px 6px`,
                    }}>
                      {log.action}
                    </span>
                  </td>
                  <td style={{ ...typography.caption, color: colors.zinc, padding: `${spacing[2]}px ${spacing[3]}px` }}>
                    {log.target_type ? `${log.target_type}:${(log.target_id || "").substring(0, 8)}` : "—"}
                  </td>
                  <td style={{ ...typography.caption, color: colors.zinc, padding: `${spacing[2]}px ${spacing[3]}px` }}>
                    {log.ip_address || "—"}
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
