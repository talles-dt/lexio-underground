"use client";

import React from "react";
import { usePathname } from "next/navigation";
import Link from "next/link";
import { colors, spacing, typography, duration } from "@/theme/tokens";

/* ------------------------------------------------------------------ */
/*  Bottom navigation — 5 core routes                                  */
/*  Pulse / Palace / Shadow / Vault / Profile                          */
/* ------------------------------------------------------------------ */

interface NavItem {
  href: string;
  label: string;
  icon: string; // SVG path data — filled/outline in same glyph
  activeIcon: string;
}

const NAV_ITEMS: NavItem[] = [
  {
    href: "/pulse",
    label: "Pulse",
    icon: "M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-1 14.5v-9l7 4.5-7 4.5z",
    activeIcon: "M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-1 14.5v-9l7 4.5-7 4.5z",
  },
  {
    href: "/palace",
    label: "Palace",
    icon: "M12 3L2 12h3v8h6v-6h2v6h6v-8h3L12 3z",
    activeIcon: "M12 3L2 12h3v8h6v-6h2v6h6v-8h3L12 3z",
  },
  {
    href: "/conversation-shadow",
    label: "Shadow",
    icon: "M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.42 0-8-3.58-8-8s3.58-8 8-8 8 3.58 8 8-3.58 8-8 8zm-1-13h2v6h-2zm0 8h2v2h-2z",
    activeIcon: "M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-1 13h2v2h-2zm0-8h2v6h-2z",
  },
  {
    href: "/meme-vault",
    label: "Vault",
    icon: "M18 8h-1V6c0-2.76-2.24-5-5-5S7 3.24 7 6v2H6c-1.1 0-2 .9-2 2v10c0 1.1.9 2 2 2h12c1.1 0 2-.9 2-2V10c0-1.1-.9-2-2-2zM12 17c-1.1 0-2-.9-2-2s.9-2 2-2 2 .9 2 2-.9 2-2 2zm3.1-9H8.9V6c0-1.71 1.39-3.1 3.1-3.1s3.1 1.39 3.1 3.1v2z",
    activeIcon: "M18 8h-1V6c0-2.76-2.24-5-5-5S7 3.24 7 6v2H6c-1.1 0-2 .9-2 2v10c0 1.1.9 2 2 2h12c1.1 0 2-.9 2-2V10c0-1.1-.9-2-2-2zM12 17c-1.1 0-2-.9-2-2s.9-2 2-2 2 .9 2 2-.9 2-2 2z",
  },
  {
    href: "/profile",
    label: "Profile",
    icon: "M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z",
    activeIcon: "M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z",
  },
];

export function BottomNav() {
  const pathname = usePathname();

  // Hide on certain routes
  const hiddenRoutes = ["/onboarding", "/signin", "/auth"];
  if (hiddenRoutes.some((r) => pathname.startsWith(r))) return null;

  return (
    <nav
      style={{
        position: "fixed",
        bottom: 0,
        left: 0,
        right: 0,
        height: 52,
        backgroundColor: colors.surface,
        borderTop: `1px solid ${colors.borderSubtle}`,
        display: "flex",
        alignItems: "center",
        justifyContent: "space-around",
        zIndex: 30,
        // Safe area for iOS notch bottom
        paddingBottom: "env(safe-area-inset-bottom, 0px)",
      }}
    >
      {NAV_ITEMS.map((item) => {
        const isActive = pathname === item.href || pathname.startsWith(item.href + "/");
        const color = isActive ? colors.phosphor : colors.zinc;

        return (
          <Link
            key={item.href}
            href={item.href}
            style={{
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              justifyContent: "center",
              gap: 2,
              textDecoration: "none",
              flex: 1,
              padding: `${spacing[1]}px 0`,
              position: "relative",
              transition: `color ${duration.fast}ms ease`,
            }}
          >
            {/* Active indicator bar */}
            {isActive && (
              <div style={{
                position: "absolute",
                top: 0,
                left: "50%",
                transform: "translateX(-50%)",
                width: 24,
                height: 2,
                backgroundColor: colors.phosphor,
                borderRadius: 1,
              }} />
            )}

            {/* Icon */}
            <svg
              width={isActive ? 26 : 22}
              height={isActive ? 26 : 22}
              viewBox="0 0 24 24"
              fill={isActive ? color : "none"}
              stroke={color}
              strokeWidth={isActive ? 0 : 1.5}
              style={{
                transition: `all ${duration.fast}ms ease`,
              }}
            >
              <path d={isActive ? item.activeIcon : item.icon} />
            </svg>

            {/* Label */}
            <span style={{
              fontFamily: typography.caption.fontFamily,
              fontSize: 10,
              fontWeight: isActive ? 600 : 400,
              color,
              letterSpacing: 0.5,
              transition: `color ${duration.fast}ms ease`,
            }}>
              {item.label}
            </span>
          </Link>
        );
      })}
    </nav>
  );
}
