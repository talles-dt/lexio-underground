"use client";

import React from "react";
import Link from "next/link";
import { colors, spacing, radius, typography } from "@/theme/tokens";
import { useHasAccessWithLoading } from "@/lib/access";

export default function HomePage() {
  const { access: hasAccess, loading } = useHasAccessWithLoading();

  // Show loading spinner while store fetches user data
  if (loading) {
    return (
      <div style={{
        minHeight: "100vh",
        backgroundColor: colors.obsidian,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
      }}>
        <div style={{
          width: 32,
          height: 32,
          border: `3px solid ${colors.borderSubtle}`,
          borderTopColor: colors.phosphor,
          borderRadius: "50%",
          animation: "spin 0.8s linear infinite",
        }} />
        <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
      </div>
    );
  }

  return (
    <div style={{
      minHeight: "100vh",
      backgroundColor: colors.obsidian,
      color: colors.ivory,
      display: "flex",
      flexDirection: "column",
    }}>
      {/* Hero */}
      <section style={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        padding: `${spacing[8]}px ${spacing[3]}px ${spacing[4]}px`,
        textAlign: "center",
      }}>
        <h1 style={{
          ...typography.display,
          color: colors.ivory,
          margin: 0,
          marginBottom: spacing[1],
        }}>
          Lexio Underground
        </h1>
        <p style={{
          ...typography.bodyItalic,
          color: colors.phosphor,
          margin: 0,
          marginBottom: spacing[2],
        }}>
          Map your ignorance. Master your language.
        </p>
        <p style={{
          ...typography.bodyLg,
          color: colors.zinc,
          maxWidth: 480,
          margin: 0,
          marginBottom: spacing[4],
        }}>
          A self-diagnostic tool for language learners. Discover what you
          don't know through the Cartografa assessment, then build your
          Memory Palace as you learn.
        </p>

        <Link href="/onboarding" style={{
          display: "inline-block",
          backgroundColor: colors.phosphor,
          color: colors.obsidian,
          fontWeight: 700,
          padding: `${spacing[2]}px ${spacing[6]}px`,
          borderRadius: radius.btn,
          textDecoration: "none",
          fontFamily: typography.ui.fontFamily,
          fontSize: typography.ui.fontSize,
          marginBottom: hasAccess ? spacing[6] : 0,
        }}>
          Begin your Cartografa
        </Link>

        {/* Sign in button for returning users */}
        <Link href="/signin" style={{
          display: "inline-flex",
          alignItems: "center",
          gap: spacing[2],
          padding: `${spacing[2]}px ${spacing[4]}px`,
          borderRadius: radius.btn,
          border: `1px solid ${colors.borderSubtle}`,
          backgroundColor: "transparent",
          color: colors.ivory,
          fontFamily: typography.ui.fontFamily,
          fontSize: typography.ui.fontSize,
          fontWeight: 600,
          textDecoration: "none",
          marginTop: spacing[3],
          transition: "border-color 0.2s, color 0.2s",
        }}
        onMouseEnter={(e) => {
          (e.currentTarget as HTMLElement).style.borderColor = colors.phosphor;
          (e.currentTarget as HTMLElement).style.color = colors.phosphor;
        }}
        onMouseLeave={(e) => {
          (e.currentTarget as HTMLElement).style.borderColor = colors.borderSubtle;
          (e.currentTarget as HTMLElement).style.color = colors.ivory;
        }}
        >
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M15 3h4a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2h-4"/>
            <polyline points="10 17 15 12 10 7"/>
            <line x1="15" y1="12" x2="3" y2="12"/>
          </svg>
          Sign in to your account
        </Link>

        {/* Quick links — only visible after diagnostic is complete */}
        {hasAccess && (
        <div style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(140px, 1fr))",
          gap: spacing[3],
          maxWidth: 600,
          width: "100%",
        }}>
          <QuickLink href="/diagnostico" icon="🗺" label="Diagnóstico" />
          <QuickLink href="/pulse" icon="⚡" label="Pulse" />
          <QuickLink href="/palace" icon="🏛" label="Palace" />
          <QuickLink href="/deep" icon="🧠" label="Deep Mode" />
          <QuickLink href="/profile" icon="👤" label="Profile" />
          <QuickLink href="/pricing" icon="💎" label="Pricing" />
        </div>
        )}
      </section>

      {/* Footer */}
      <footer style={{
        textAlign: "center",
        padding: spacing[2],
        borderTop: `1px solid ${colors.borderSubtle}`,
      }}>
        <p style={{
          fontFamily: typography.caption.fontFamily,
          fontSize: 11,
          color: `${colors.zinc}60`,
          margin: 0,
        }}>
          Lexio Underground — Cartografa your ignorance. Build your palace.
        </p>
      </footer>
    </div>
  );
}

function QuickLink({ href, icon, label }: { href: string; icon: string; label: string }) {
  return (
    <Link
      href={href}
      style={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        gap: spacing[2],
        padding: `${spacing[4]}px ${spacing[2]}px`,
        backgroundColor: colors.surface,
        border: `1px solid ${colors.borderSubtle}`,
        borderRadius: radius.card,
        textDecoration: "none",
        color: colors.ivory,
        transition: "border-color 0.2s, transform 0.2s",
      }}
      onMouseEnter={(e) => {
        (e.currentTarget as HTMLElement).style.borderColor = colors.phosphor;
        (e.currentTarget as HTMLElement).style.transform = "translateY(-2px)";
      }}
      onMouseLeave={(e) => {
        (e.currentTarget as HTMLElement).style.borderColor = colors.borderSubtle;
        (e.currentTarget as HTMLElement).style.transform = "translateY(0)";
      }}
    >
      <span style={{ fontSize: 24 }}>{icon}</span>
      <span style={{
        fontFamily: typography.ui.fontFamily,
        fontSize: 13,
        fontWeight: 600,
      }}>
        {label}
      </span>
    </Link>
  );
}
