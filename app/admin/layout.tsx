"use client";

import React, { ReactNode } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { colors, spacing, typography } from "@/theme/tokens";
import { useAuth } from "@/lib/auth";

const NAV_ITEMS = [
  { href: "/admin", label: "Dashboard", icon: "📊" },
  { href: "/admin/users", label: "Users", icon: "👥" },
  { href: "/admin/bypasses", label: "Bypasses", icon: "🔓" },
  { href: "/admin/partnerships", label: "Partnerships", icon: "🤝" },
  { href: "/admin/questions", label: "Questions", icon: "❓" },
  { href: "/admin/audit", label: "Audit Log", icon: "📋" },
];

export default function AdminLayout({ children }: { children: ReactNode }) {
  const pathname = usePathname();
  const { user } = useAuth();

  return (
    <div style={{
      display: "flex",
      minHeight: "100vh",
      backgroundColor: colors.obsidian,
      color: colors.ivory,
    }}>
      {/* Sidebar */}
      <aside style={{
        width: 220,
        minHeight: "100vh",
        backgroundColor: colors.surface,
        borderRight: `1px solid ${colors.borderSubtle}`,
        display: "flex",
        flexDirection: "column",
        flexShrink: 0,
      }}>
        {/* Header */}
        <div style={{
          padding: `${spacing[4]}px ${spacing[3]}px`,
          borderBottom: `1px solid ${colors.borderSubtle}`,
        }}>
          <h1 style={{
            ...typography.h2,
            color: colors.phosphor,
            margin: 0,
          }}>
            Admin
          </h1>
          <p style={{
            ...typography.caption,
            color: colors.zinc,
            margin: 0,
          }}>
            {user?.email}
          </p>
        </div>

        {/* Nav */}
        <nav style={{ flex: 1, padding: `${spacing[2]}px 0` }}>
          {NAV_ITEMS.map((item) => {
            const isActive = item.href === "/admin"
              ? pathname === "/admin"
              : pathname.startsWith(item.href);
            return (
              <Link
                key={item.href}
                href={item.href}
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: spacing[2],
                  padding: `${spacing[2]}px ${spacing[3]}px`,
                  textDecoration: "none",
                  color: isActive ? colors.phosphor : colors.zinc,
                  backgroundColor: isActive ? `${colors.phosphor}10` : "transparent",
                  borderRight: isActive ? `2px solid ${colors.phosphor}` : "none",
                  fontFamily: typography.ui.fontFamily,
                  fontSize: 13,
                  transition: "all 0.15s",
                }}
              >
                <span>{item.icon}</span>
                <span>{item.label}</span>
              </Link>
            );
          })}
        </nav>

        {/* Back to app */}
        <div style={{
          padding: spacing[3],
          borderTop: `1px solid ${colors.borderSubtle}`,
        }}>
          <Link
            href="/"
            style={{
              ...typography.caption,
              color: colors.zinc,
              textDecoration: "none",
            }}
          >
            ← Back to app
          </Link>
        </div>
      </aside>

      {/* Main content */}
      <main style={{
        flex: 1,
        padding: `${spacing[6]}px ${spacing[4]}px`,
        overflowY: "auto",
      }}>
        {children}
      </main>
    </div>
  );
}
