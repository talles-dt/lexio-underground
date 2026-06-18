"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { colors, spacing, typography } from "@/theme/tokens";
import { useAuth } from "@/lib/auth";
import { getAccessToken } from "@/lib/getAccessToken";

interface DashboardStats {
  totalUsers: number;
  activeBypasses: number;
  activePartnerships: number;
  totalRevenue: number;
}

export default function AdminDashboard() {
  const { user } = useAuth();
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchStats() {
      try {
        const token = await getAccessToken();
        if (!token) { setLoading(false); return; }
        // Fetch basic counts
        const [usersRes, bypassesRes, partnershipsRes] = await Promise.all([
          fetch("/api/admin/users?limit=1", {
            headers: { Authorization: `Bearer ${token}` },
          }).catch(() => null),
          fetch("/api/admin/bypasses?active=true", {
            headers: { Authorization: `Bearer ${token}` },
          }).catch(() => null),
          fetch("/api/admin/partnerships", {
            headers: { Authorization: `Bearer ${token}` },
          }).catch(() => null),
        ]);

        setStats({
          totalUsers: usersRes?.ok ? (await usersRes.json()).total || 0 : 0,
          activeBypasses: bypassesRes?.ok ? (await bypassesRes.json()).bypasses?.length || 0 : 0,
          activePartnerships: partnershipsRes?.ok ? (await partnershipsRes.json()).partnerships?.filter((p: { is_active: boolean }) => p.is_active).length || 0 : 0,
          totalRevenue: 0,
        });
      } catch {
        setStats({ totalUsers: 0, activeBypasses: 0, activePartnerships: 0, totalRevenue: 0 });
      } finally {
        setLoading(false);
      }
    }
    fetchStats();
  }, []);

  const statCards = [
    { label: "Total Users", value: stats?.totalUsers ?? "—", icon: "👥", href: "/admin/users" },
    { label: "Active Bypasses", value: stats?.activeBypasses ?? "—", icon: "🔓", href: "/admin/bypasses" },
    { label: "Partnerships", value: stats?.activePartnerships ?? "—", icon: "🤝", href: "/admin/partnerships" },
    { label: "Revenue", value: "R$ 0", icon: "💰", href: "#" },
  ];

  return (
    <div>
      <div style={{ marginBottom: spacing[6] }}>
        <h1 style={{ ...typography.display, color: colors.ivory, margin: 0, marginBottom: spacing[1] }}>
          Dashboard
        </h1>
        <p style={{ ...typography.body, color: colors.zinc, margin: 0 }}>
          Admin overview — Lexio Underground
        </p>
      </div>

      {/* Stat cards */}
      <div style={{
        display: "grid",
        gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))",
        gap: spacing[3],
        marginBottom: spacing[6],
      }}>
        {statCards.map((card) => (
          <Link
            key={card.label}
            href={card.href}
            style={{
              backgroundColor: colors.surface,
              border: `1px solid ${colors.borderSubtle}`,
              borderRadius: 12,
              padding: `${spacing[4]}px ${spacing[3]}px`,
              textDecoration: "none",
              display: "flex",
              flexDirection: "column",
              gap: spacing[1],
              transition: "border-color 0.2s",
            }}
          >
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
              <span style={{ ...typography.caption, color: colors.zinc }}>{card.label}</span>
              <span style={{ fontSize: 20 }}>{card.icon}</span>
            </div>
            <span style={{ ...typography.h1, color: colors.ivory, margin: 0 }}>
              {loading ? "…" : card.value}
            </span>
          </Link>
        ))}
      </div>

      {/* Quick actions */}
      <div style={{
        backgroundColor: colors.surface,
        border: `1px solid ${colors.borderSubtle}`,
        borderRadius: 12,
        padding: `${spacing[4]}px ${spacing[3]}px`,
      }}>
        <h2 style={{ ...typography.h2, color: colors.ivory, margin: 0, marginBottom: spacing[3] }}>
          Quick Actions
        </h2>
        <div style={{ display: "flex", flexWrap: "wrap", gap: spacing[2] }}>
          <QuickAction href="/admin/users" label="Search Users" icon="🔍" />
          <QuickAction href="/admin/bypasses" label="Grant Bypass" icon="➕" />
          <QuickAction href="/admin/partnerships" label="New Partnership" icon="🤝" />
          <QuickAction href="/admin/audit" label="View Audit Log" icon="📋" />
        </div>
      </div>
    </div>
  );
}

function QuickAction({ href, label, icon }: { href: string; label: string; icon: string }) {
  return (
    <Link
      href={href}
      style={{
        display: "inline-flex",
        alignItems: "center",
        gap: spacing[2],
        padding: `${spacing[2]}px ${spacing[3]}px`,
        backgroundColor: colors.obsidian,
        border: `1px solid ${colors.borderSubtle}`,
        borderRadius: 8,
        textDecoration: "none",
        color: colors.ivory,
        fontFamily: typography.ui.fontFamily,
        fontSize: 13,
      }}
    >
      <span>{icon}</span>
      <span>{label}</span>
    </Link>
  );
}
