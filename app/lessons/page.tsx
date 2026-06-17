"use client";

import React from "react";
import Link from "next/link";
import { colors, spacing, radius, typography } from "@/theme/tokens";

export default function LessonsPage() {
  return (
    <div style={{
      minHeight: "100vh",
      backgroundColor: colors.obsidian,
      color: colors.ivory,
      paddingBottom: 80,
    }}>
      {/* Header */}
      <header style={{
        textAlign: "center",
        padding: `${spacing[8]}px ${spacing[4]}px ${spacing[4]}`,
      }}>
        <h1 style={{
          fontFamily: typography.display.fontFamily,
          fontSize: 32,
          fontWeight: 700,
          color: colors.ivory,
          margin: 0,
          marginBottom: spacing[2],
        }}>
          My Lessons
        </h1>
        <p style={{
          fontFamily: typography.bodyItalic.fontFamily,
          fontStyle: typography.bodyItalic.fontStyle,
          fontSize: 15,
          color: colors.zinc,
          margin: 0,
          maxWidth: 400,
          marginLeft: "auto",
          marginRight: "auto",
        }}>
          Your personalized lessons will appear here after completing the Cartografa diagnostic.
        </p>
      </header>

      {/* Empty state */}
      <main style={{
        maxWidth: 600,
        margin: "0 auto",
        padding: `0 ${spacing[4]}px`,
      }}>
        <div style={{
          backgroundColor: colors.surface,
          border: `1px solid ${colors.borderSubtle}`,
          borderRadius: radius.card,
          padding: `${spacing[8]}px ${spacing[6]}px`,
          textAlign: "center",
        }}>
          <div style={{ fontSize: 48, marginBottom: spacing[4] }}>📚</div>
          <h2 style={{
            fontFamily: typography.h2.fontFamily,
            fontSize: 20,
            color: colors.ivory,
            margin: 0,
            marginBottom: spacing[3],
          }}>
            No lessons yet
          </h2>
          <p style={{
            fontFamily: typography.body.fontFamily,
            fontSize: 14,
            color: colors.zinc,
            margin: 0,
            marginBottom: spacing[6],
            lineHeight: 1.6,
          }}>
            Complete your Cartografa diagnostic to unlock personalized lessons
            based on your Map of Ignorance. Each lesson targets a specific gap
            in your language knowledge.
          </p>
          <Link
            href="/diagnostico"
            style={{
              display: "inline-block",
              backgroundColor: colors.phosphor,
              color: colors.obsidian,
              fontWeight: 700,
              padding: `${spacing[2]}px ${spacing[6]}px`,
              borderRadius: radius.btn,
              textDecoration: "none",
              fontFamily: typography.ui.fontFamily,
              fontSize: 14,
            }}
          >
            Take the Cartografa
          </Link>
        </div>

        {/* Preview cards */}
        <div style={{
          marginTop: spacing[8],
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(180px, 1fr))",
          gap: spacing[3],
        }}>
          <PreviewCard icon="🎯" title="Adaptive" desc="Lessons target your specific weak points" />
          <PreviewCard icon="🏛" title="Spatial" desc="Each lesson places items in your palace" />
          <PreviewCard icon="🔄" title="Spaced" desc="Review schedule optimized by SM-2" />
          <PreviewCard icon="🎭" title="Cultural" desc="Learn through memes, not just rules" />
        </div>
      </main>
    </div>
  );
}

function PreviewCard({ icon, title, desc }: { icon: string; title: string; desc: string }) {
  return (
    <div style={{
      backgroundColor: colors.surface,
      border: `1px solid ${colors.borderSubtle}`,
      borderRadius: radius.card,
      padding: spacing[4],
      textAlign: "center",
      opacity: 0.6,
    }}>
      <div style={{ fontSize: 28, marginBottom: spacing[2] }}>{icon}</div>
      <h3 style={{
        fontFamily: typography.ui.fontFamily,
        fontSize: 14,
        fontWeight: 600,
        color: colors.ivory,
        margin: 0,
        marginBottom: spacing[1],
      }}>
        {title}
      </h3>
      <p style={{
        fontFamily: typography.caption.fontFamily,
        fontSize: 12,
        color: colors.zinc,
        margin: 0,
        lineHeight: 1.4,
      }}>
        {desc}
      </p>
    </div>
  );
}
