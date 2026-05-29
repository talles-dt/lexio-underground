"use client";

import Link from "next/link";
import { colors, spacing, radius } from "@/theme/tokens";

export default function HomePage() {
  return (
    <div
      style={{
        minHeight: "100vh",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        backgroundColor: colors.obsidian,
        padding: `0 ${spacing[4]}px`,
      }}
    >
      <div
        style={{
          maxWidth: "600px",
          textAlign: "center",
          color: colors.ivory,
          width: "100%",
        }}
      >
        <h1
          style={{
            fontFamily: "Syne-Bold, sans-serif",
            fontSize: 48,
            lineHeight: "56px",
            fontWeight: 700,
            color: colors.ivory,
            marginBottom: spacing[6],
          }}
        >
          Lexio Underground
        </h1>
        <p
          style={{
            fontFamily: "SourceSerif4-Regular, serif",
            fontSize: 18,
            lineHeight: "28px",
            fontWeight: 400,
            color: colors.phosphor,
            fontStyle: "italic",
            marginBottom: spacing[4],
          }}
        >
          Map your ignorance. Master your language.
        </p>
        <p
          style={{
            fontFamily: "SourceSerif4-Regular, serif",
            fontSize: 16,
            lineHeight: "26px",
            fontWeight: 400,
            color: colors.zinc,
            marginBottom: spacing[8],
          }}
        >
          Lexio Underground is a self-diagnostic tool for language learners.
          Begin by discovering what you don&apos;t know through the Cartografa
          assessment, then receive a personalized learning path based on your
          Memory Palace hook.
        </p>
        <Link
          href="/diagnostico"
          style={{
            display: "inline-block",
            marginTop: spacing[2],
            padding: `${spacing[3]}px ${spacing[6]}px`,
            color: colors.obsidian,
            backgroundColor: colors.phosphor,
            borderRadius: radius.btn,
            textDecoration: "none",
            fontSize: 14,
          }}
        >
          Begin your Cartografa
        </Link>
      </div>
    </div>
  );
}
