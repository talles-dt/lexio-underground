"use client";

import React from "react";
import Link from "next/link";
import { colors, spacing, radius } from "@/theme/tokens";

export default function LessonsPage() {
  return (
    <div style={styles.container}>
      <nav style={styles.navbar}>
        <Link href="/palace" style={styles.navLink}>
          <span style={styles.navLinkContent}>Home</span>
        </Link>
        <Link href="/diagnostico" style={styles.navLink}>
          <span style={styles.navLinkContent}>Take the Cartografa</span>
        </Link>
      </nav>
      <main style={styles.mainContent}>
        <h1 style={styles.title}>My Lessons</h1>
        <p style={styles.placeholder}>No lessons found.</p>
      </main>
    </div>
  );
}

const styles: Record<string, React.CSSProperties> = {
  container: {
    backgroundColor: colors.obsidian,
    minHeight: "100vh",
    padding: spacing[4],
  },
  mainContent: {
    marginTop: spacing[6],
    maxWidth: 600,
    width: "100%",
    margin: "0 auto",
  },
  navLink: {
    textDecoration: "none",
  },
  navLinkContent: {
    backgroundColor: colors.phosphor,
    borderRadius: radius.btn,
    marginRight: spacing[3],
    padding: "12px 28px",
    display: "inline-block",
    color: colors.obsidian,
    fontWeight: 600 as const,
  },
  navbar: {
    display: "flex",
    flexDirection: "row",
    justifyContent: "space-between",
    paddingTop: spacing[4],
    paddingBottom: spacing[4],
  },
  placeholder: {
    color: colors.zinc,
    fontStyle: "italic",
  },
  title: {
    color: colors.ivory,
    fontSize: 24,
    fontWeight: 700,
    marginBottom: spacing[4],
  },
};
