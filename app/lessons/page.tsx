"use client";

import dynamic from "next/dynamic";
import { colors, spacing } from "@/theme/tokens";

const LessonCard = dynamic(
  () => import("@/components/LessonCard").then(m => ({ default: m.LessonCard })),
  { ssr: false, loading: () => <div style={{ color: "#F5F0E8", padding: 40, textAlign: "center" }}>Loading...</div> }
);

const mockLesson = {
  grammar:
    'PT-BR interference: "Eu tenho 25 anos" → English omits the article. Rule: *Zero article for age statements*.',
  logic: "English avoids implicit subjects in formal writing.",
  communication: "When writing an email, start with *Dear X* and close with *Best regards*.",
  mnemonic:
    "CONCEPT: grammar → LOCATION: minha casa → HOOK: golden retriever wearing a tie → ANCHOR: \"meu cachorro usa gravata\"",
};

export default function LessonsPage() {
  return (
    <div
      style={{
        minHeight: "100vh",
        backgroundColor: colors.obsidian,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        padding: `0 ${spacing[4]}px`,
      }}
    >
      <LessonCard lesson={mockLesson} difficulty="B2" />
    </div>
  );
}
