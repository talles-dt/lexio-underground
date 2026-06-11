"use client";

import { useState } from "react";
import { colors, spacing, radius } from "@/theme/tokens";

/* ------------------------------------------------------------------ */
/*  Question type (inline to avoid cross-file coupling for now)       */
/* ------------------------------------------------------------------ */
interface Question {
 id: string;
 pillar: string;
 text_pt: string;
 options: string[];
 correct_index: number;
 explanation_pt: string;
}

/* ------------------------------------------------------------------ */
/*  Placeholder question bank (replace with real data from vault)     */
/* ------------------------------------------------------------------ */
const QUESTIONS: Question[] = [
 {
 id: "g1",
 pillar: "grammar",
 text_pt: "Qual a forma correta?",
 options: ["She don't like", "She doesn't like", "She not like", "She no like"],
 correct_index: 1,
 explanation_pt: "Terceira pessoa singular usa 'doesn't'.",
 },
 {
 id: "v1",
 pillar: "vocabulary",
 text_pt: "O que significa 'reluctant'?",
 options: ["Entusiasmado", "Relutante", "Obrigado", "Apressado"],
 correct_index: 1,
 explanation_pt: "'Reluctant' significa relutante, hesitante.",
 },
 {
 id: "l1",
 pillar: "logic",
 text_pt: "If it rains, the ground gets wet. The ground is dry. So...",
 options: [
 "It rained",
 "It didn't rain",
 "We can't tell",
 "The ground is wet",
 ],
 correct_index: 1,
 explanation_pt: "Modus tollens: se chuva → molhado, e molhado é falso, chuva é falso.",
 },
];

/* ------------------------------------------------------------------ */
/*  Stage labels                                                       */
/* ------------------------------------------------------------------ */
const STAGES = ["Grammar", "Vocabulary", "Logic", "Culture", "Communication"] as const;

/* ------------------------------------------------------------------ */
/*  Component                                                          */
/* ------------------------------------------------------------------ */
export default function DiagnosticoPage() {
 const [qIdx, setQIdx] = useState(0);
 const [selected, setSelected] = useState<number | null>(null);
 const [showExplain, setShowExplain] = useState(false);
 const [answers, setAnswers] = useState<number[]>([]);
 const [done, setDone] = useState(false);

 const q = QUESTIONS[qIdx];
 const stageIdx = Math.min(
 Math.floor((qIdx / QUESTIONS.length) * 5),
 4
 );

 function handleSelect(i: number) {
 setSelected(i);
 setShowExplain(true);
 }

 function handleNext() {
 if (selected !== null) setAnswers((a) => [...a, selected]);
 setSelected(null);
 setShowExplain(false);
 if (qIdx + 1 < QUESTIONS.length) {
 setQIdx(qIdx + 1);
 } else {
 setDone(true);
 }
 }

 if (done) {
 const score = answers.reduce(
 (acc, a, i) => acc + (a === QUESTIONS[i].correct_index ? 1 : 0),
 0
 );
 return (
 <div style={styles.container}>
 <div style={styles.card}>
 <h2 style={styles.heading}>Cartografa Completa</h2>
 <p style={styles.body}>
 {score}/{QUESTIONS.length} correct
 </p>
 <p style={styles.body}>
 Sua cartografa está pronta. O palácio espera.
 </p>
 </div>
 </div>
 );
 }

 return (
 <div style={styles.container}>
 <div style={styles.card}>
 <p style={styles.stage}>
 Stage {stageIdx + 1} of 5 — {STAGES[stageIdx]}
 </p>
 <h2 style={styles.heading}>{q.text_pt}</h2>
 <div style={styles.options}>
 {q.options.map((opt, i) => (
 <button
 key={i}
 onClick={() => handleSelect(i)}
 style={{
 ...styles.option,
 ...(selected === i
 ? {
 borderColor: colors.phosphor,
 backgroundColor: "rgba(0,255,136,0.08)",
 }
 : {}),
 }}
 disabled={selected !== null}
 >
 {opt}
 </button>
 ))}
 </div>
 {showExplain && (
 <p style={styles.explain}>{q.explanation_pt}</p>
 )}
 {selected !== null && (
 <button style={styles.nextBtn} onClick={handleNext}>
 {qIdx + 1 < QUESTIONS.length ? "Próxima" : "Ver Resultado"}
 </button>
 )}
 {selected === null && (
 <button style={styles.skipBtn} onClick={handleNext}>
 Pular
 </button>
 )}
 </div>
 </div>
 );
}

/*  Styles (pure CSS-in-JS for web)                                   */
/* ------------------------------------------------------------------ */
const styles: Record<string, React.CSSProperties> = {
 container: {
 minHeight: "100vh",
 backgroundColor: colors.obsidian,
 color: colors.ivory,
 display: "flex",
 alignItems: "center",
 justifyContent: "center",
 padding: `0 ${spacing[4]}px`,
 fontFamily: "system-ui, -apple-system, sans-serif",
 },
 card: {
 backgroundColor: colors.surface,
 borderRadius: radius.card,
 padding: spacing[8],
 maxWidth: 560,
 width: "100%",
 },
 stage: {
 color: colors.zinc,
 fontFamily: "'JetBrains Mono', monospace",
 fontSize: 12,
 marginBottom: spacing[2],
 },
 heading: {
 color: colors.ivory,
 fontFamily: "Syne, sans-serif",
 fontSize: 24,
 fontWeight: 600,
 lineHeight: 32,
 marginBottom: spacing[6],
 },
 options: {
 display: "flex",
 flexDirection: "column" as const,
 gap: spacing[2],
 marginBottom: spacing[4],
 },
 option: {
 backgroundColor: "transparent",
 border: `1px solid ${colors.zinc}`,
 borderRadius: radius.btn,
 color: colors.ivory,
 cursor: "pointer",
 fontSize: 16,
 padding: `${spacing[3]}px ${spacing[4]}px`,
 textAlign: "left" as const,
 },
 explain: {
 color: colors.amber,
 fontFamily: "'Source Serif 4', serif",
 fontStyle: "italic",
 fontSize: 14,
 marginBottom: spacing[4],
 },
 nextBtn: {
 backgroundColor: colors.phosphor,
 border: "none",
 borderRadius: radius.btn,
 color: colors.obsidian,
 cursor: "pointer",
 fontSize: 14,
 fontWeight: 600,
 padding: `${spacing[3]}px ${spacing[6]}px`,
 },
 skipBtn: {
 backgroundColor: "transparent",
 border: `1px solid ${colors.zinc}`,
 borderRadius: radius.btn,
 color: colors.zinc,
 cursor: "pointer",
 fontSize: 14,
 padding: `${spacing[3]}px ${spacing[6]}px`,
 },
};
