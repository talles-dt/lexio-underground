"use client";

import Link from "next/link";
import { colors, spacing, radius } from "@/theme/tokens";

const styles = {
 body: {
 color: colors.zinc,
 fontFamily: "SourceSerif4-Regular, serif",
 fontSize: 16,
 fontWeight: "400",
 lineHeight: 26,
 marginBottom: spacing[8],
 } satisfies React.CSSProperties,
 container: {
 alignItems: "center",
 backgroundColor: colors.obsidian,
 display: "flex",
 justifyContent: "center",
 minHeight: "100vh",
 padding: `0 ${spacing[4]}px`,
 } satisfies React.CSSProperties,
 content: {
 maxWidth: 600,
 textAlign: "center",
 width: "100%",
 } satisfies React.CSSProperties,
 cta: {
 display: "inline-block",
 backgroundColor: colors.phosphor,
 borderRadius: radius.btn,
 color: colors.obsidian,
 fontSize: 14,
 marginTop: spacing[2],
 padding: `${spacing[3]}px ${spacing[6]}px`,
 textDecoration: "none",
 } satisfies React.CSSProperties,
 subtitle: {
 color: colors.phosphor,
 fontFamily: "SourceSerif4-Regular, serif",
 fontSize: 18,
 fontStyle: "italic",
 fontWeight: "400",
 lineHeight: 28,
 marginBottom: spacing[4],
 } satisfies React.CSSProperties,
 title: {
 color: colors.ivory,
 fontFamily: "Syne-Bold, sans-serif",
 fontSize: 48,
 fontWeight: "700",
 lineHeight: 56,
 marginBottom: spacing[6],
 } satisfies React.CSSProperties,
};

export default function HomePage() {
 return (
 <main style={styles.container}>
 <section style={styles.content}>
 <h1 style={styles.title}>Lexio Underground</h1>
 <p style={styles.subtitle}>
 Map your ignorance. Master your language.
 </p>
 <p style={styles.body}>
 Lexio Underground is a self-diagnostic tool for language learners.
 Begin by discovering what you don&apos;t know through the Cartografa
 assessment, then receive a personalized learning path based on your
 Memory Palace hook.
 </p>
 <Link href="/diagnostico" style={styles.cta}>
 Begin your Cartografa
 </Link>
 </section>
 </main>
 );
}
