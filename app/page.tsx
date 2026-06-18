"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { colors, spacing, radius, typography } from "@/theme/tokens";
import { useHasAccessWithLoading } from "@/lib/access";
import { KineticText, Magnetic, GrainOverlay } from "@/lib/stitch-motion";

export default function HomePage() {
  const { access: hasAccess, loading } = useHasAccessWithLoading();

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
      overflow: "hidden",
    }}>
      <GrainOverlay />

      {/* Hero */}
      <section style={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        minHeight: "100vh",
        padding: `${spacing[6]}px ${spacing[3]}px`,
        textAlign: "center",
        position: "relative",
      }}>
        {/* Ambient glow */}
        <div style={{
          position: "absolute",
          top: "30%",
          left: "50%",
          transform: "translate(-50%, -50%)",
          width: 400,
          height: 400,
          background: `radial-gradient(circle, ${colors.phosphor}08 0%, transparent 70%)`,
          pointerEvents: "none",
          zIndex: 0,
        }} />

        <div style={{ position: "relative", zIndex: 1, maxWidth: 600 }}>
          {/* Kinetic title */}
          <h1 style={{
            ...typography.display,
            color: colors.ivory,
            margin: 0,
            marginBottom: spacing[3],
            lineHeight: 1.1,
          }}>
            <KineticText text="Lexio Underground" stagger={0.04} delay={200} />
          </h1>

          {/* Tagline with reveal */}
          <p style={{
            ...typography.bodyItalic,
            color: colors.phosphor,
            margin: 0,
            marginBottom: spacing[3],
            opacity: 0,
            animation: `fadeSlideUp 0.8s ease-out 1s forwards`,
          }}>
            Map your ignorance. Master your language.
          </p>

          {/* Description */}
          <p style={{
            ...typography.bodyLg,
            color: colors.zinc,
            maxWidth: 480,
            margin: "0 auto",
            marginBottom: spacing[6],
            opacity: 0,
            animation: `fadeSlideUp 0.8s ease-out 1.3s forwards`,
          }}>
            A self-diagnostic tool for language learners. Discover what you
            don't know through the Cartografa assessment, then build your
            Memory Palace as you learn.
          </p>

          {/* CTA buttons */}
          <div style={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            gap: spacing[2],
            opacity: 0,
            animation: `fadeSlideUp 0.8s ease-out 1.6s forwards`,
          }}>
            <Magnetic strength={0.15}>
              <Link href="/onboarding" style={{
                display: "inline-block",
                backgroundColor: colors.phosphor,
                color: colors.obsidian,
                fontWeight: 700,
                padding: `${spacing[3]}px ${spacing[6]}px`,
                borderRadius: radius.btn,
                textDecoration: "none",
                fontFamily: typography.ui.fontFamily,
                fontSize: 15,
                letterSpacing: 0.5,
                boxShadow: `0 0 30px ${colors.phosphor}20`,
                transition: "box-shadow 0.3s ease",
              }}
              onMouseEnter={(e) => {
                (e.currentTarget as HTMLElement).style.boxShadow = `0 0 50px ${colors.phosphor}40`;
              }}
              onMouseLeave={(e) => {
                (e.currentTarget as HTMLElement).style.boxShadow = `0 0 30px ${colors.phosphor}20`;
              }}
              >
                Begin your Cartografa
              </Link>
            </Magnetic>

            {/* Sign in button */}
            <Magnetic strength={0.1}>
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
                marginTop: spacing[1],
                transition: "border-color 0.3s, color 0.3s, box-shadow 0.3s",
              }}
              onMouseEnter={(e) => {
                (e.currentTarget as HTMLElement).style.borderColor = colors.phosphor;
                (e.currentTarget as HTMLElement).style.color = colors.phosphor;
                (e.currentTarget as HTMLElement).style.boxShadow = `0 0 20px ${colors.phosphor}15`;
              }}
              onMouseLeave={(e) => {
                (e.currentTarget as HTMLElement).style.borderColor = colors.borderSubtle;
                (e.currentTarget as HTMLElement).style.color = colors.ivory;
                (e.currentTarget as HTMLElement).style.boxShadow = "none";
              }}
              >
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M15 3h4a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2h-4"/>
                  <polyline points="10 17 15 12 10 7"/>
                  <line x1="15" y1="12" x2="3" y2="12"/>
                </svg>
                Sign in to your account
              </Link>
            </Magnetic>
          </div>
        </div>

        {/* Scroll indicator */}
        <div style={{
          position: "absolute",
          bottom: spacing[4],
          left: "50%",
          transform: "translateX(-50%)",
          opacity: 0,
          animation: `fadeSlideUp 0.8s ease-out 2.2s forwards, float 3s ease-in-out 3s infinite`,
          pointerEvents: "none",
        }}>
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke={colors.zinc} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
            <path d="M12 5v14M5 12l7 7 7-7"/>
          </svg>
        </div>
      </section>

      {/* Quick links — only visible after diagnostic is complete */}
      {hasAccess && (
        <section style={{
          padding: `${spacing[4]}px ${spacing[3]}px ${spacing[8]}px`,
          maxWidth: 680,
          margin: "0 auto",
          width: "100%",
        }}>
          <div style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(140px, 1fr))",
            gap: spacing[3],
          }}>
            <QuickLink href="/diagnostico" icon="🗺" label="Diagnostico" delay={0} />
            <QuickLink href="/pulse" icon="⚡" label="Pulse" delay={0.1} />
            <QuickLink href="/palace" icon="🏛" label="Palace" delay={0.2} />
            <QuickLink href="/deep" icon="🧠" label="Deep Mode" delay={0.3} />
            <QuickLink href="/profile" icon="👤" label="Profile" delay={0.4} />
            <QuickLink href="/pricing" icon="💎" label="Pricing" delay={0.5} />
          </div>
        </section>
      )}

      {/* Footer */}
      <footer style={{
        textAlign: "center",
        padding: spacing[3],
        borderTop: `1px solid ${colors.borderSubtle}40`,
        marginTop: "auto",
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

      <style>{`
        @keyframes fadeSlideUp {
          from { opacity: 0; transform: translateY(16px); }
          to { opacity: 1; transform: translateY(0); }
        }
        @keyframes float {
          0%, 100% { transform: translateX(-50%) translateY(0); }
          50% { transform: translateX(-50%) translateY(6px); }
        }
      `}</style>
    </div>
  );
}

function QuickLink({ href, icon, label, delay }: { href: string; icon: string; label: string; delay: number }) {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => setVisible(true), 200 + delay * 1000);
    return () => clearTimeout(timer);
  }, [delay]);

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
        opacity: visible ? 1 : 0,
        transform: visible ? "translateY(0) scale(1)" : "translateY(20px) scale(0.95)",
        transition: `all 0.5s cubic-bezier(0.16, 1, 0.3, 1) ${delay}s`,
      }}
      onMouseEnter={(e) => {
        (e.currentTarget as HTMLElement).style.borderColor = colors.phosphor;
        (e.currentTarget as HTMLElement).style.transform = "translateY(-2px) scale(1.02)";
        (e.currentTarget as HTMLElement).style.boxShadow = `0 8px 24px ${colors.phosphor}15`;
      }}
      onMouseLeave={(e) => {
        (e.currentTarget as HTMLElement).style.borderColor = colors.borderSubtle;
        (e.currentTarget as HTMLElement).style.transform = "translateY(0) scale(1)";
        (e.currentTarget as HTMLElement).style.boxShadow = "none";
      }}
    >
      <span style={{ fontSize: 24, lineHeight: 1 }}>{icon}</span>
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
