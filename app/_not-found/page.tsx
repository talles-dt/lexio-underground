"use client";

import React from "react";
import Link from "next/link";
import { colors, spacing, radius, typography } from "@/theme/tokens";

export default function NotFound() {
  return (
    <div style={{
      minHeight: "100vh",
      backgroundColor: colors.obsidian,
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      padding: spacing[4],
    }}>
      <div style={{
        textAlign: "center",
        maxWidth: 400,
      }}>
        <div style={{
          fontFamily: typography.display.fontFamily,
          fontSize: 64,
          color: colors.phosphor,
          marginBottom: spacing[4],
        }}>
          404
        </div>
        <h1 style={{
          fontFamily: typography.h2.fontFamily,
          fontSize: typography.h2.fontSize,
          color: colors.ivory,
          margin: 0,
          marginBottom: spacing[3],
        }}>
          Página não encontrada
        </h1>
        <p style={{
          fontFamily: typography.bodyItalic.fontFamily,
          fontStyle: typography.bodyItalic.fontStyle,
          fontSize: typography.body.fontSize,
          color: colors.zinc,
          margin: 0,
          marginBottom: spacing[6],
        }}>
          Este cômodo do palácio ainda não foi construído.
        </p>
        <Link
          href="/"
          style={{
            display: "inline-block",
            backgroundColor: colors.phosphor,
            color: colors.obsidian,
            fontWeight: 600,
            padding: `${spacing[2]}px ${spacing[6]}px`,
            borderRadius: radius.btn,
            textDecoration: "none",
            fontFamily: typography.ui.fontFamily,
            fontSize: typography.ui.fontSize,
          }}
        >
          Voltar ao início
        </Link>
      </div>
    </div>
  );
}
