"use client";



import Link from "next/link";
import { colors, spacing, radius } from "@/theme/tokens";

const mockLesson = {
  grammar:
    'PT-BR interference: "Eu tenho 25 anos" → English omits the article. Rule: *Zero article for age statements*.',
  logic:
    "English avoids implicit subjects in formal writing. Prefer *It is* over *Is* for existential statements.",
  communication:
    "When writing an email, start with *Dear X* and close with *Best regards*.",
  mnemonic:
    'CONCEPT: grammar → LOCATION: minha casa → HOOK: golden retriever wearing a tie → ANCHOR: "meu cachorro usa gravata"',
};

const sections = [
  { key: "grammar", label: "Grammar", icon: "📝", content: mockLesson.grammar },
  { key: "logic", label: "Logic", icon: "🧩", content: mockLesson.logic },
  {
    key: "communication",
    label: "Communication",
    icon: "💬",
    content: mockLesson.communication,
  },
  {
    key: "mnemonic",
    label: "Memory Palace",
    icon: "🏛️",
    content: mockLesson.mnemonic,
  },
];

export default function LessonsPage() {
  return (
    <div
      style={{
        minHeight: "100vh",
        backgroundColor: colors.obsidian,
        color: colors.ivory,
        padding: `${spacing[8]}px ${spacing[4]}px`,
        fontFamily: "system-ui, -apple-system, sans-serif",
      }}
    >
      <div style={{ maxWidth: 600, margin: "0 auto" }}>
        <div style={{ textAlign: "center", marginBottom: spacing[6] }}>
          <h1
            style={{
              fontSize: 32,
              fontWeight: 700,
              color: colors.ivory,
              marginBottom: spacing[2],
            }}
          >
            Sample Lesson
          </h1>
          <p style={{ fontSize: 15, color: colors.zinc }}>
            Difficulty: B2 &middot; Pillar: Grammar
          </p>
        </div>

        {sections.map((sec) => (
          <div
            key={sec.key}
            style={{
              backgroundColor: colors.obsidian,
              border: `1px solid ${colors.zinc}`,
              borderRadius: radius.card,
              padding: spacing[4],
              marginBottom: spacing[3],
            }}
          >
            <h2
              style={{
                fontSize: 16,
                fontWeight: 600,
                color: colors.phosphor,
                marginBottom: spacing[2],
              }}
            >
              {sec.icon} {sec.label}
            </h2>
            <p
              style={{
                fontSize: 14,
                color: colors.ivory,
                lineHeight: 1.6,
                margin: 0,
              }}
            >
              {sec.content}
            </p>
          </div>
        ))}

        <div style={{ textAlign: "center", marginTop: spacing[6] }}>
          <Link
            href="/diagnostico"
            style={{
              display: "inline-block",
              padding: "12px 28px",
              backgroundColor: colors.phosphor,
              color: colors.obsidian,
              borderRadius: radius.btn,
              fontSize: 15,
              fontWeight: 600,
              textDecoration: "none",
              marginRight: spacing[3],
            }}
          >
            Take the Cartografa
          </Link>
          <Link
            href="/"
            style={{
              display: "inline-block",
              padding: "12px 28px",
              border: `1px solid ${colors.zinc}`,
              color: colors.ivory,
              borderRadius: radius.btn,
              fontSize: 15,
              textDecoration: "none",
            }}
          >
            Home
          </Link>
        </div>
      </div>
    </div>
  );
}
