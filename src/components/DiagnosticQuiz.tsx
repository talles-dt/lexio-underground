"use client";

import React, { useState } from "react";
import { colors, typography, spacing, radius } from "@/theme/tokens";

type Question = {
 id: string;
 text: string;
 whyExplanation: string;
};

type DiagnosticQuizProps = {
 email: string;
 interest: string;
 onShareToken: (token: string) => void;
};

export function DiagnosticQuiz({
 email,
 interest,
 onShareToken,
}: DiagnosticQuizProps) {
 const [answers, setAnswers] = useState<Record<string, number>>({});
 const [submitted, setSubmitted] = useState(false);
 const [shareLink, setShareLink] = useState<string>("");
 const [expandedWhy, setExpandedWhy] = useState<string | null>(null);
 const [activeQuestion, setActiveQuestion] = useState<string | null>(null);

 const questions: Question[] = [
 {
 id: "grammar_1",
 text: "Quando encontrar uma construção linguística que soa estranha, você tenta entender POR QUE ela soa assim?",
 whyExplanation:
 'Esta pergunta avalia sua intuição gramatical - a capacidade de detectar construções que "soam erradas" mesmo sem saber a regra específica. Linguistas nativos desenvolvem essa intuição através de exposição massiva à linguagem.',
 },
 {
 id: "logic_1",
 text: "Você costuma revisitar ideias que acreditava estar dominadas para verificar se realmente as compreende?",
 whyExplanation:
 'Esta pergunta identifica seu "Mapa da Ignorância" - lacunas disfarçadas de conhecimento. Pessoas com alta metacognição revisitam continuamente o que acreditam saber para descobrir falsas certezas.',
 },
 {
 id: "communication_1",
 text: "Ao se expressar em situações reais, você prioriza fazer-se entender sobre falar perfeitamente?",
 whyExplanation:
 "Esta pergunta mede sua fluência comunicativa - valorizar ser compreendido sobre a perfeição formal. Aprendizes eficazes priorizam a comunicação real sobre a correção artificial em contextos autênticos.",
 },
 ];

 const handleSubmit = async () => {
 if (!email || !interest) {
 alert("Please fill in all fields");
 return;
 }
 const allAnswered = questions.every((q) => answers[q.id] !== undefined);
 if (!allAnswered) {
 alert("Please answer all questions");
 return;
 }

 try {
 const response = await fetch("/api/diagnostico", {
 method: "POST",
 headers: { "Content-Type": "application/json" },
 body: JSON.stringify({ email, answers, interest }),
 });

 if (response.ok) {
 const data = await response.json();
 setShareLink(
 `https://liceu.underground/diagnostico/${data.share_token}`
 );
 setSubmitted(true);
 onShareToken(data.share_token);
 } else {
 const errorData = await response.json();
 alert(errorData.error || "Failed to submit");
 }
 } catch (err) {
 console.error(err);
 alert("Network error. Please try again.");
 }
 };

 const handleSkip = () => {
 alert("Funcionalidade de pular ainda não implementada na versão MVP");
 };

 if (submitted) {
 return (
 <div style={styles.resultContainer}>
 <div style={styles.resultContent}>
 <div style={styles.resultHeader}>
 <div style={styles.logoMark}>
 <div
 style={{
 width: 40,
 height: 40,
 backgroundColor: colors.lime,
 borderRadius: radius.full,
 }}
 />
 </div>
 </div>
 <span style={styles.resultTitle}>Obrigado!</span>
 <p style={styles.resultSubtitle}>
 Seu diagnóstico foi concluído e seu link exclusivo foi gerado.
 </p>
 <div style={styles.shareLinkContainer}>
 <input
 style={styles.shareLinkInput}
 value={shareLink}
 readOnly
 />
 <button
 type="button"
 style={styles.copyButton}
 onClick={() => navigator.clipboard.writeText(shareLink)}
 >
 <span style={styles.copyButtonText}>Copiar</span>
 </button>
 </div>
 <button
 type="button"
 style={styles.newQuizButton}
 onClick={() => setSubmitted(false)}
 >
 <span style={styles.newQuizButtonText}>Fazer novo diagnóstico</span>
 </button>
 </div>
 </div>
 );
 }

 return (
 <div style={styles.container}>
 <span style={styles.title}>Diagnóstico Lexio</span>
 <p style={styles.subtitle}>Descubra seus pilares de aprendizado</p>
 <span style={styles.email}>Para: {email}</span>

 {questions.map((question) => (
 <div key={question.id} style={styles.questionCard}>
 <span style={styles.questionText}>{question.text}</span>

 {/* Multiple choice answers */}
 <div style={styles.answerOptions}>
 {["Nunca", "Raramente", "Às vezes", "Frequentemente", "Sempre"].map(
 (option, index) => (
 <button
 key={index}
 type="button"
 style={{
 ...styles.answerOption,
 ...(answers[question.id] === index
 ? styles.answerOptionSelected
 : {}),
 }}
 onClick={() => {
 setAnswers({ ...answers, [question.id]: index });
 }}
 onMouseDown={() => setActiveQuestion(question.id)}
 onMouseUp={() => setActiveQuestion(null)}
 >
 <span
 style={{
 ...styles.answerText,
 ...(answers[question.id] === index
 ? styles.answerTextSelected
 : {}),
 }}
 >
 {option}
 </span>
 </button>
 )
 )}
 </div>

 {/* Why explanation */}
 <button
 type="button"
 style={styles.whyButton}
 onClick={() => {
 expandedWhy === question.id
 ? setExpandedWhy(null)
 : setExpandedWhy(question.id);
 }}
 >
 <span style={styles.whyButtonText}>Por quê?</span>
 </button>

 {expandedWhy === question.id && (
 <div style={styles.whyExplanation}>
 <span style={styles.whyExplanationText}>
 {question.whyExplanation}
 </span>
 </div>
 )}
 </div>
 ))}

 <button type="button" style={styles.submitButton} onClick={handleSubmit}>
 <span style={styles.submitButtonText}>Enviar</span>
 </button>

 <button type="button" style={styles.skipButton} onClick={handleSkip}>
 <span style={styles.skipButtonText}>Pular diagnóstico</span>
 </button>
 </div>
 );
}

const styles: Record<string, React.CSSProperties> = {
 answerOption: {
 backgroundColor: colors.ivory,
 borderColor: colors.zinc,
 borderRadius: radius.sm,
 borderWidth: 1,
 marginBottom: spacing.sm,
 padding: spacing.sm,
 borderStyle: "solid",
 },
 answerOptionSelected: {
 backgroundColor: colors.amber,
 borderColor: colors.amber,
 },
 answerOptions: {
 marginBottom: spacing.sm,
 },
 answerText: {
 color: colors.obsidian,
 fontSize: typography.text.md,
 },
 answerTextSelected: {
 color: colors.ivory,
 },
 container: {
 backgroundColor: colors.obsidian,
 padding: spacing.md,
 },
 copyButton: {
 backgroundColor: colors.lime,
 borderRadius: radius.sm,
 marginLeft: spacing.sm,
 padding: spacing.sm,
 border: "none",
 cursor: "pointer",
 },
 copyButtonText: {
 color: colors.ivory,
 fontSize: typography.text.sm,
 },
 email: {
 color: colors.zinc,
 fontSize: typography.text.md,
 marginBottom: spacing.lg,
 textAlign: "center" as const,
 },
 logoMark: {
 marginBottom: spacing.sm,
 },
 newQuizButton: {
 display: "flex",
 alignItems: "center",
 justifyContent: "center",
 background: "none",
 border: "none",
 cursor: "pointer",
 padding: 0,
 },
 newQuizButtonText: {
 color: colors.violet,
 fontSize: typography.text.sm,
 textDecoration: "underline",
 },
 questionCard: {
 backgroundColor: colors.ivory,
 borderRadius: radius.md,
 marginBottom: spacing.md,
 padding: spacing.md,
 },
 questionText: {
 color: colors.obsidian,
 fontSize: typography.text.md,
 fontWeight: 600,
 marginBottom: spacing.md,
 display: "block",
 },
 resultContainer: {
 backgroundColor: colors.obsidian,
 padding: spacing.md,
 },
 resultContent: {
 backgroundColor: colors.ivory,
 borderRadius: radius.md,
 padding: spacing.md,
 },
 resultHeader: {
 display: "flex",
 alignItems: "center",
 marginBottom: spacing.md,
 },
 resultSubtitle: {
 color: colors.grayDark,
 fontSize: typography.text.md,
 marginBottom: spacing.lg,
 textAlign: "center" as const,
 margin: 0,
 },
 resultTitle: {
 color: colors.obsidian,
 fontSize: 28,
 fontWeight: "bold",
 marginBottom: spacing.sm,
 textAlign: "center" as const,
 display: "block",
 },
 shareLinkContainer: {
 display: "flex",
 alignItems: "center",
 marginBottom: spacing.lg,
 },
 shareLinkInput: {
 borderColor: colors.zinc,
 borderRadius: radius.sm,
 borderWidth: 1,
 borderStyle: "solid",
 color: colors.grayDark,
 flex: 1,
 fontSize: typography.text.sm,
 padding: spacing.sm,
 backgroundColor: "transparent",
 },
 skipButton: {
 display: "flex",
 alignItems: "center",
 justifyContent: "center",
 marginTop: spacing.sm,
 background: "none",
 border: "none",
 cursor: "pointer",
 padding: 0,
 },
 skipButtonText: {
 color: colors.zinc,
 fontSize: typography.text.sm,
 textDecoration: "underline",
 },
 submitButton: {
 display: "flex",
 alignItems: "center",
 justifyContent: "center",
 backgroundColor: colors.lime,
 borderRadius: radius.md,
 marginTop: spacing.md,
 padding: spacing.md,
 border: "none",
 cursor: "pointer",
 },
 submitButtonText: {
 color: colors.ivory,
 fontSize: typography.text.md,
 fontWeight: "bold",
 },
 subtitle: {
 color: colors.zinc,
 fontSize: typography.text.lg,
 marginBottom: spacing.md,
 textAlign: "center" as const,
 margin: 0,
 },
 title: {
 color: colors.ivory,
 fontSize: 28,
 fontWeight: "bold",
 marginBottom: spacing.sm,
 textAlign: "center" as const,
 display: "block",
 },
 whyButton: {
 alignSelf: "flex-end",
 background: "none",
 border: "none",
 cursor: "pointer",
 padding: 0,
 },
 whyButtonText: {
 color: colors.violet,
 fontSize: typography.text.sm,
 },
 whyExplanation: {
 backgroundColor: colors.grayLightest,
 borderRadius: radius.sm,
 marginTop: spacing.sm,
 padding: spacing.sm,
 },
 whyExplanationText: {
 color: colors.obsidian,
 fontSize: typography.text.sm,
 lineHeight: `${typography.text.lg}px`,
 },
};
