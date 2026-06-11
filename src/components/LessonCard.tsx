"use client";

import React, { useState } from "react";
import { colors } from "@/theme/tokens";

interface Lesson {
 id: string;
 title: string;
 mnemonic: string;
 archetype_key: string;
 difficulty: string;
}

function highlightRichText(text: string) {
 return text
 .replace(
 /\*\*(.*?)\*\*/gm,
 (match, group) => `<span style={styles.bold}>${group}</span>`
 )
 .replace(
 /\((.*?)\)/gm,
 (match, group) => `<span style={styles.italic}>(${group})</span>`
 );
}

export const LessonCard = ({
 lesson,
 hapticSchedule,
}: {
 lesson: Lesson;
 hapticSchedule: (lsnId: string) => void;
}) => {
 const [isExpanded, setIsExpanded] = useState(false);
 const [difficulty, displayMnemonic] = lesson.mnemonic.split("→");

 return (
 <div style={styles.card}>
 <button
 type="button"
 onClick={() => {
 setIsExpanded(!isExpanded);
 hapticSchedule(lesson.id);
 }}
 style={{ background: "none", border: "none", cursor: "pointer", padding: 0, textAlign: "left", width: "100%" }}
 >
 <div style={styles.header}>
 <span style={styles.title}>Lesson</span>
 <span style={styles.difficulty}>{difficulty.trim()}</span>
 </div>
 <span style={styles.mnemonic}>{displayMnemonic.trim()}</span>
 </button>

 {isExpanded && (
 <div style={styles.expandedContent}>
 <span style={styles.body}>{lesson.title}</span>
 </div>
 )}
 </div>
 );
};

const styles: Record<string, React.CSSProperties> = {
 body: {
 fontSize: 14,
 lineHeight: "20px",
 },
 bold: {
 fontWeight: "bold",
 },
 card: {
 backgroundColor: colors.card,
 borderRadius: 12,
 marginBottom: 12,
 padding: 16,
 boxShadow: `0 2px 4px rgba(13, 13, 15, 0.1)`,
 },
 difficulty: {
 color: colors.primary,
 fontSize: 16,
 },
 expandedContent: {
 marginTop: 8,
 },
 header: {
 display: "flex",
 alignItems: "center",
 justifyContent: "space-between",
 },
 italic: {
 fontStyle: "italic",
 },
 mnemonic: {
 color: colors.text,
 fontSize: 16,
 fontWeight: 600,
 marginTop: 8,
 marginBottom: 8,
 },
 title: {
 color: colors.text,
 fontSize: 18,
 fontWeight: "bold",
 },
};
