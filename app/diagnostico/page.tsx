"use client";

import { useState } from "react";
import Link from "next/link";
import { colors, spacing, radius } from "@/theme/tokens";

// ─── Quiz Data ─────────────────────────────────────────────
const questions = [
  {
    id: "grammar_1",
    text: 'Quando encontrar uma construção linguística que soa estranha, você tenta entender POR QUE ela soa assim?',
    why: 'Esta pergunta avalia sua intuição gramatical — a capacidade de detectar construções que "soam erradas" mesmo sem saber a regra específica.',
  },
  {
    id: "logic_1",
    text: "Você costuma revisitar ideias que acreditava estar dominadas para verificar se realmente as compreende?",
    why: 'Esta pergunta identifica seu "Mapa da Ignorância" — lacunas disfarçadas de conhecimento.',
  },
  {
    id: "communication_1",
    text: "Ao se expressar em situações reais, você prioriza fazer-se entender sobre falar perfeitamente?",
    why: "Esta pergunta mede sua fluência comunicativa — valorizar ser compreendido sobre a perfeição formal.",
  },
];

// ─── Styles ────────────────────────────────────────────────
const s = {
  page: {
    minHeight: "100vh",
    backgroundColor: colors.obsidian,
    color: colors.ivory,
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    padding: `0 ${spacing[4]}px`,
    fontFamily: "system-ui, -apple-system, sans-serif",
  } as React.CSSProperties,
  card: {
    maxWidth: 520,
    width: "100%",
    textAlign: "center" as const,
  } as React.CSSProperties,
  title: {
    fontSize: 40,
    fontWeight: 700,
    color: colors.ivory,
    marginBottom: spacing[2],
  } as React.CSSProperties,
  subtitle: {
    fontSize: 18,
    color: colors.phosphor,
    fontStyle: "italic",
    marginBottom: spacing[4],
  } as React.CSSProperties,
  desc: {
    fontSize: 15,
    color: colors.zinc,
    lineHeight: 1.6,
    marginBottom: spacing[6],
  } as React.CSSProperties,
  btn: {
    display: "inline-block",
    padding: "12px 28px",
    backgroundColor: colors.phosphor,
    color: colors.obsidian,
    border: "none",
    borderRadius: radius.btn,
    fontSize: 15,
    fontWeight: 600,
    cursor: "pointer",
    textDecoration: "none",
  } as React.CSSProperties,
  btnDisabled: {
    opacity: 0.5,
    cursor: "not-allowed",
  } as React.CSSProperties,
  input: {
    width: "100%",
    padding: "10px 14px",
    backgroundColor: colors.surface,
    color: colors.ivory,
    border: `1px solid ${colors.borderSubtle}`,
    borderRadius: radius.btn,
    fontSize: 15,
    outline: "none",
    marginBottom: spacing[3],
    boxSizing: "border-box" as const,
  } as React.CSSProperties,
  label: {
    display: "block",
    fontSize: 14,
    color: colors.zinc,
    marginBottom: spacing[1],
    textAlign: "left" as const,
  } as React.CSSProperties,
  questionCard: {
    backgroundColor: colors.obsidian,
    border: `1px solid ${colors.zinc}`,
    borderRadius: radius.card,
    padding: spacing[4],
    marginBottom: spacing[4],
    textAlign: "left" as const,
  } as React.CSSProperties,
  questionText: {
    fontSize: 15,
    color: colors.ivory,
    marginBottom: spacing[3],
    lineHeight: 1.5,
  } as React.CSSProperties,
  radioRow: {
    display: "flex",
    alignItems: "center",
    gap: 8,
    marginBottom: 6,
    cursor: "pointer",
  } as React.CSSProperties,
  radioOuter: {
    width: 18,
    height: 18,
    borderRadius: 9,
    border: `2px solid ${colors.zinc}`,
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    flexShrink: 0,
  } as React.CSSProperties,
  radioOuterSelected: {
    borderColor: colors.phosphor,
  } as React.CSSProperties,
  radioInner: {
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: colors.phosphor,
  } as React.CSSProperties,
  radioLabel: {
    fontSize: 14,
    color: colors.ivory,
  } as React.CSSProperties,
  whyBtn: {
    background: "none",
    border: `1px solid ${colors.zinc}`,
    borderRadius: radius.btn,
    color: colors.ivory,
    fontSize: 13,
    padding: "4px 12px",
    cursor: "pointer",
    marginTop: spacing[2],
  } as React.CSSProperties,
  whyBox: {
    backgroundColor: colors.surface,
    borderRadius: radius.btn,
    padding: spacing[3],
    marginTop: spacing[2],
  } as React.CSSProperties,
  whyText: {
    fontSize: 13,
    color: colors.amber,
    fontStyle: "italic",
    lineHeight: 1.5,
  } as React.CSSProperties,
  stage: {
    fontSize: 13,
    color: colors.zinc,
    textAlign: "center" as const,
    marginBottom: spacing[4],
  } as React.CSSProperties,
  hookLabel: {
    fontSize: 14,
    color: colors.zinc,
    textAlign: "center" as const,
    marginBottom: spacing[1],
  } as React.CSSProperties,
  hookValue: {
    fontSize: 15,
    color: colors.ivory,
    textAlign: "center" as const,
    marginBottom: spacing[4],
  } as React.CSSProperties,
  actions: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    marginTop: spacing[4],
  } as React.CSSProperties,
  skipBtn: {
    background: "none",
    border: "none",
    color: colors.zinc,
    fontSize: 14,
    cursor: "pointer",
    padding: "8px 16px",
  } as React.CSSProperties,
  resultTitle: {
    fontSize: 28,
    fontWeight: 700,
    color: colors.ivory,
    marginBottom: spacing[2],
  } as React.CSSProperties,
  shareBox: {
    backgroundColor: colors.surface,
    border: `1px solid ${colors.borderSubtle}`,
    borderRadius: radius.btn,
    padding: "10px 14px",
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: spacing[3],
    gap: 8,
  } as React.CSSProperties,
  shareLink: {
    fontSize: 14,
    color: colors.ivory,
    overflow: "hidden",
    textOverflow: "ellipsis",
    whiteSpace: "nowrap" as const,
    flex: 1,
  } as React.CSSProperties,
  copyBtn: {
    padding: "8px 16px",
    backgroundColor: colors.phosphor,
    color: colors.obsidian,
    border: "none",
    borderRadius: radius.btn,
    fontSize: 13,
    fontWeight: 600,
    cursor: "pointer",
    flexShrink: 0,
  } as React.CSSProperties,
};

// ─── Page Component ────────────────────────────────────────
export default function DiagnosticoPage() {
  const [step, setStep] = useState<"preamble" | "email" | "quiz" | "result">("preamble");
  const [email, setEmail] = useState("");
  const [interest, setInterest] = useState("");
  const [answers, setAnswers] = useState<Record<string, number>>({});
  const [expandedWhy, setExpandedWhy] = useState<string | null>(null);
  const [shareLink, setShareLink] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");

  // ── Preamble ──
  if (step === "preamble") {
    return (
      <div style={s.page}>
        <div style={s.card}>
          <h1 style={s.title}>Lexio Underground</h1>
          <p style={s.subtitle}>Map your ignorance. Master your language.</p>
          <p style={s.desc}>
            Discover what you don&apos;t know through the Cartografa assessment,
            then receive a personalized learning path based on your Memory Palace hook.
          </p>
          <button style={s.btn} onClick={() => setStep("email")}>
            Begin your Cartografa
          </button>
        </div>
      </div>
    );
  }

  // ── Email Capture ──
  if (step === "email") {
    const canContinue = email.trim().includes("@") && interest.trim().length >= 2;
    return (
      <div style={s.page}>
        <div style={s.card}>
          <h2 style={{ ...s.title, fontSize: 28 }}>Enter your email to begin</h2>
          <p style={s.desc}>
            We&apos;ll send your Cartografa report and learning path to this address.
          </p>
          <div style={{ textAlign: "left", marginBottom: spacing[3] }}>
            <label style={s.label}>Email</label>
            <input
              style={s.input}
              type="email"
              placeholder="your@email.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>
          <div style={{ textAlign: "left", marginBottom: spacing[4] }}>
            <label style={s.label}>
              Memory Palace Hook (e.g., &quot;minha casa&quot;, &quot;cachorro&quot;)
            </label>
            <input
              style={s.input}
              type="text"
              placeholder="Where do you want to anchor this lesson?"
              value={interest}
              onChange={(e) => setInterest(e.target.value)}
            />
          </div>
          <button
            style={{ ...s.btn, ...(canContinue ? {} : s.btnDisabled) }}
            disabled={!canContinue}
            onClick={() => canContinue && setStep("quiz")}
          >
            Continue to Cartografa →
          </button>
        </div>
      </div>
    );
  }

  // ── Quiz ──
  if (step === "quiz") {
    const allAnswered = questions.every((q) => answers[q.id] !== undefined);

    const handleSubmit = async () => {
      if (!allAnswered) return;
      setSubmitting(true);
      setError("");
      try {
        const res = await fetch("/api/diagnostico", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ email, answers, interest }),
        });
        const data = await res.json();
        if (res.ok && data.share_token) {
          const link = `${window.location.origin}/diagnostico/${data.share_token}`;
          setShareLink(link);
          setStep("result");
        } else {
          setError(data.error || "Failed to submit. Please try again.");
        }
      } catch {
        setError("Network error. Please try again.");
      } finally {
        setSubmitting(false);
      }
    };

    return (
      <div style={s.page}>
        <div style={{ ...s.card, maxWidth: 580 }}>
          <p style={s.stage}>Stage 1 of 5 — Grammar</p>
          <p style={s.hookLabel}>Memory Palace Hook</p>
          <p style={s.hookValue}>{interest}</p>

          {questions.map((q) => (
            <div key={q.id} style={s.questionCard}>
              <p style={s.questionText}>{q.text}</p>
              {[1, 2, 3, 4, 5].map((val) => (
                <div
                  key={val}
                  style={s.radioRow}
                  onClick={() => setAnswers((prev) => ({ ...prev, [q.id]: val }))}
                >
                  <div
                    style={{
                      ...s.radioOuter,
                      ...(answers[q.id] === val ? s.radioOuterSelected : {}),
                    }}
                  >
                    {answers[q.id] === val && <div style={s.radioInner} />}
                  </div>
                  <span style={s.radioLabel}>{val}</span>
                </div>
              ))}
              <button
                style={s.whyBtn}
                onClick={() =>
                  setExpandedWhy(expandedWhy === q.id ? null : q.id)
                }
              >
                {expandedWhy === q.id ? "Ocultar explicação" : "Por quê?"}
              </button>
              {expandedWhy === q.id && (
                <div style={s.whyBox}>
                  <p style={s.whyText}>{q.why}</p>
                </div>
              )}
            </div>
          ))}

          {error && (
            <p style={{ color: "#ef4444", fontSize: 14, marginBottom: spacing[3] }}>
              {error}
            </p>
          )}

          <div style={s.actions}>
            <button
              style={s.skipBtn}
              onClick={() => alert("Funcionalidade de pular ainda não implementada")}
            >
              Pular
            </button>
            <button
              style={{
                ...s.btn,
                ...(!allAnswered || submitting ? s.btnDisabled : {}),
              }}
              disabled={!allAnswered || submitting}
              onClick={handleSubmit}
            >
              {submitting ? "Enviando..." : "Enviar"}
            </button>
          </div>
        </div>
      </div>
    );
  }

  // ── Result ──
  return (
    <div style={s.page}>
      <div style={s.card}>
        <p style={s.resultTitle}>Obrigado!</p>
        <p style={{ ...s.desc, marginBottom: spacing[4] }}>
          Compartilhe seu resultado:
        </p>
        <div style={s.shareBox}>
          <span style={s.shareLink}>{shareLink}</span>
          <button
            style={s.copyBtn}
            onClick={() => navigator.clipboard.writeText(shareLink)}
          >
            Copiar link
          </button>
        </div>
        <Link href="/" style={{ ...s.btn, marginTop: spacing[4] }}>
          Voltar ao início
        </Link>
      </div>
    </div>
  );
}
