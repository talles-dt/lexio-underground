"use client";



import { useState, useCallback, useRef, useEffect } from "react";
import Link from "next/link";
import { colors, spacing, radius } from "@/theme/tokens";
import {
  CartografaState,
  CartografaResult,
  createInitialState,
  selectNextQuestion,
  processAnswer,
  generateResults,
  getStageName,
  getStageDescription,
  getReadinessLabel,
} from "@/cartografa/adaptive-engine";
import { Question, Pillar } from "@/cartografa/question-bank";
import PillarRadar from "@/components/PillarRadar";
import ShareCard from "@/components/ShareCard";

// ─── STEP TYPES ─────────────────────────────────────────────
type Step = "preamble" | "email" | "cartografa" | "transition" | "result";

// ─── STYLES ─────────────────────────────────────────────────
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
    maxWidth: 580,
    width: "100%",
    textAlign: "center" as const,
  } as React.CSSProperties,
  wideCard: {
    maxWidth: 640,
    width: "100%",
    textAlign: "left" as const,
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
  textarea: {
    width: "100%",
    minHeight: 120,
    padding: "12px 14px",
    backgroundColor: colors.surface,
    color: colors.ivory,
    border: `1px solid ${colors.borderSubtle}`,
    borderRadius: radius.btn,
    fontSize: 15,
    outline: "none",
    marginBottom: spacing[3],
    boxSizing: "border-box" as const,
    resize: "vertical" as const,
    fontFamily: "inherit",
  } as React.CSSProperties,
  label: {
    display: "block",
    fontSize: 14,
    color: colors.zinc,
    marginBottom: spacing[1],
    textAlign: "left" as const,
  } as React.CSSProperties,
  stageHeader: {
    fontSize: 13,
    color: colors.zinc,
    textAlign: "center" as const,
    marginBottom: spacing[1],
  } as React.CSSProperties,
  stageTitle: {
    fontSize: 24,
    fontWeight: 700,
    color: colors.ivory,
    textAlign: "center" as const,
    marginBottom: spacing[1],
  } as React.CSSProperties,
  stageDesc: {
    fontSize: 14,
    color: colors.zinc,
    textAlign: "center" as const,
    fontStyle: "italic",
    marginBottom: spacing[4],
  } as React.CSSProperties,
  progressBar: {
    width: "100%",
    height: 4,
    backgroundColor: colors.surface,
    borderRadius: 2,
    marginBottom: spacing[4],
    overflow: "hidden",
  } as React.CSSProperties,
  progressFill: {
    height: "100%",
    backgroundColor: colors.phosphor,
    borderRadius: 2,
    transition: "width 0.3s ease",
  } as React.CSSProperties,
  questionCard: {
    backgroundColor: colors.surface,
    border: `1px solid ${colors.borderSubtle}`,
    borderRadius: radius.card,
    padding: spacing[4],
    marginBottom: spacing[4],
    textAlign: "left" as const,
  } as React.CSSProperties,
  questionText: {
    fontSize: 16,
    color: colors.ivory,
    lineHeight: 1.5,
    marginBottom: spacing[3],
  } as React.CSSProperties,
  optionRow: {
    display: "flex",
    alignItems: "center",
    gap: 12,
    padding: "10px 12px",
    borderRadius: radius.btn,
    cursor: "pointer",
    marginBottom: 6,
    border: `1px solid transparent`,
    transition: "all 0.15s ease",
  } as React.CSSProperties,
  optionRowHover: {
    backgroundColor: colors.surfaceContainerHigh,
    borderColor: colors.zinc,
  } as React.CSSProperties,
  optionRowSelected: {
    backgroundColor: colors.surfaceContainerHigh,
    borderColor: colors.phosphor,
  } as React.CSSProperties,
  radioOuter: {
    width: 20,
    height: 20,
    borderRadius: 10,
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
  optionText: {
    fontSize: 14,
    color: colors.ivory,
    flex: 1,
  } as React.CSSProperties,
  whyBtn: {
    background: "none",
    border: `1px solid ${colors.zinc}`,
    borderRadius: radius.btn,
    color: colors.ivory,
    fontSize: 13,
    padding: "6px 14px",
    cursor: "pointer",
    marginTop: spacing[3],
  } as React.CSSProperties,
  whyBox: {
    backgroundColor: colors.surfaceContainerHigh,
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
  // Result styles
  resultTitle: {
    fontSize: 32,
    fontWeight: 700,
    color: colors.ivory,
    marginBottom: spacing[2],
  } as React.CSSProperties,
  identityCallout: {
    fontSize: 18,
    color: colors.phosphor,
    fontStyle: "italic",
    marginBottom: spacing[6],
    lineHeight: 1.5,
  } as React.CSSProperties,
  pillarRow: {
    display: "flex",
    alignItems: "center",
    gap: 12,
    marginBottom: spacing[3],
  } as React.CSSProperties,
  pillarLabel: {
    width: 100,
    fontSize: 14,
    color: colors.zinc,
    textTransform: "capitalize" as const,
  } as React.CSSProperties,
  pillarBar: {
    flex: 1,
    height: 8,
    backgroundColor: colors.surface,
    borderRadius: 4,
    overflow: "hidden",
  } as React.CSSProperties,
  pillarFill: {
    height: "100%",
    borderRadius: 4,
    transition: "width 0.5s ease",
  } as React.CSSProperties,
  pillarScore: {
    width: 50,
    fontSize: 14,
    color: colors.ivory,
    textAlign: "right" as const,
    fontWeight: 600,
  } as React.CSSProperties,
  readinessBadge: {
    display: "inline-block",
    padding: "6px 16px",
    backgroundColor: colors.surfaceContainerHigh,
    border: `1px solid ${colors.phosphor}`,
    borderRadius: radius.btn,
    fontSize: 14,
    color: colors.phosphor,
    fontWeight: 600,
    marginBottom: spacing[4],
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
  statsRow: {
    display: "flex",
    justifyContent: "center",
    gap: spacing[6],
    marginBottom: spacing[4],
  } as React.CSSProperties,
  statItem: {
    textAlign: "center" as const,
  } as React.CSSProperties,
  statValue: {
    fontSize: 24,
    fontWeight: 700,
    color: colors.phosphor,
  } as React.CSSProperties,
  statLabel: {
    fontSize: 12,
    color: colors.zinc,
    textTransform: "uppercase" as const,
    letterSpacing: 1,
  } as React.CSSProperties,
};

// ─── PILLAR COLORS ──────────────────────────────────────────
const PILLAR_COLORS: Record<Pillar, string> = {
  grammar: colors.phosphor,
  logic: colors.amber,
  vocab: colors.violet,
  culture: "#DC2626",
  comm: "#22C55E",
};

const PILLAR_NAMES: Record<Pillar, string> = {
  grammar: "Gramática",
  logic: "Lógica",
  vocab: "Vocabulário",
  culture: "Cultura",
  comm: "Comunicação",
};

// ─── PAGE COMPONENT ─────────────────────────────────────────
export default function DiagnosticoPage() {
  const [step, setStep] = useState<Step>("preamble");
  const [email, setEmail] = useState("");
  const [interest, setInterest] = useState("");
  const [cartografaState, setCartografaState] =
    useState<CartografaState | null>(null);
  const [currentQuestion, setCurrentQuestion] = useState<Question | null>(null);
  const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null);
  const [textAnswer, setTextAnswer] = useState("");
  const [showWhy, setShowWhy] = useState(false);
  const [showTransition, setShowTransition] = useState(false);
  const [result, setResult] = useState<CartografaResult | null>(null);
  const [shareLink, setShareLink] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");
  const [questionCount, setQuestionCount] = useState(0);
  const [prevStage, setPrevStage] = useState(0);

  // Initialize Cartografa
  const startCartografa = useCallback(() => {
    const state = createInitialState();
    const question = selectNextQuestion(state);
    setCartografaState(state);
    setCurrentQuestion(question);
    setSelectedAnswer(null);
    setTextAnswer("");
    setShowWhy(false);
    setQuestionCount(0);
    setPrevStage(1);
    setStep("cartografa");
  }, []);

  // Handle answer submission
  const handleAnswer = useCallback(() => {
    if (!cartografaState || !currentQuestion) return;
    if (currentQuestion.type !== "open-text" && selectedAnswer === null) return;
    if (currentQuestion.type === "open-text" && !textAnswer.trim()) return;

    const answer =
      currentQuestion.type === "open-text" ? textAnswer : selectedAnswer!;
    const { correct } = processAnswer(
      cartografaState,
      currentQuestion.id,
      answer,
    );

    setQuestionCount((c) => c + 1);

    // Check if stage changed
    const newPillar = cartografaState.currentPillar;
    const newStage = cartografaState.currentStage;
    const stageChanged = newStage !== prevStage;

    // Get next question
    const nextQuestion = selectNextQuestion(cartografaState);

    if (!nextQuestion || cartografaState.allResolved) {
      // Cartografa complete — generate results
      const results = generateResults(cartografaState);
      setResult(results);
      setStep("result");

      // Submit to API
      submitResults(results);
      return;
    }

    if (stageChanged) {
      setPrevStage(newStage);
      setShowTransition(true);
      setStep("transition");

      setTimeout(() => {
        setShowTransition(false);
        setCurrentQuestion(nextQuestion);
        setSelectedAnswer(null);
        setTextAnswer("");
        setShowWhy(false);
        setStep("cartografa");
      }, 2000);
    } else {
      setCurrentQuestion(nextQuestion);
      setSelectedAnswer(null);
      setTextAnswer("");
      setShowWhy(false);
    }

    // Force re-render
    setCartografaState({ ...cartografaState });
  }, [cartografaState, currentQuestion, selectedAnswer, textAnswer, prevStage]);

  // Submit results to API
  const submitResults = useCallback(
    async (results: CartografaResult) => {
      setSubmitting(true);
      setError("");
      try {
        const res = await fetch("/api/diagnostico", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            email,
            interest,
            answers: cartografaState?.history || [],
            results,
          }),
        });
        const data = await res.json();
        if (res.ok && data.share_token) {
          setShareLink(
            `${window.location.origin}/diagnostico/${data.share_token}`,
          );
        } else {
          setError(data.error || "Failed to save results");
        }
      } catch {
        setError("Network error. Results saved locally.");
      } finally {
        setSubmitting(false);
      }
    },
    [email, interest, cartografaState],
  );

  // ── PREAMBLE ──
  if (step === "preamble") {
    return (
      <div style={s.page}>
        <div style={s.card}>
          <h1 style={s.title}>Lexio Underground</h1>
          <p style={s.subtitle}>
            Every language learner has a map of what they don&apos;t know. Today
            we draw yours.
          </p>
          <p style={s.desc}>
            A 15–20 minute adaptive diagnostic across 5 pillars: Grammar, Logic,
            Vocabulary, Culture, and Communication.
          </p>
          <button style={s.btn} onClick={() => setStep("email")}>
            Begin your Cartografa
          </button>
        </div>
      </div>
    );
  }

  // ── EMAIL CAPTURE ──
  if (step === "email") {
    const canContinue =
      email.trim().includes("@") && interest.trim().length >= 2;
    return (
      <div style={s.page}>
        <div style={s.card}>
          <h2 style={{ ...s.title, fontSize: 28 }}>Save your progress</h2>
          <p style={s.desc}>
            Your email is a safety net — we&apos;ll send your Cartografa report
            and learning path here.
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
              Memory Palace Hook (e.g., &quot;minha casa&quot;,
              &quot;cachorro&quot;)
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
            onClick={() => canContinue && startCartografa()}
          >
            Continue to Cartografa →
          </button>
        </div>
      </div>
    );
  }

  // ── STAGE TRANSITION ──
  if (step === "transition" && cartografaState) {
    return (
      <div style={s.page}>
        <div style={s.card}>
          <p style={s.stageHeader}>Stage {cartografaState.currentStage} of 5</p>
          <h2 style={s.stageTitle}>
            {getStageName(cartografaState.currentStage)}
          </h2>
          <p style={s.stageDesc}>
            {getStageDescription(cartografaState.currentStage)}
          </p>
        </div>
      </div>
    );
  }

  // ── CARTOGRAFA ──
  if (step === "cartografa" && currentQuestion && cartografaState) {
    const stage = cartografaState.currentStage;
    const totalAnswered = cartografaState.history.length;
    const estimatedTotal = 25; // rough estimate for progress bar
    const progress = Math.min(100, (totalAnswered / estimatedTotal) * 100);

    return (
      <div style={s.page}>
        <div style={s.wideCard}>
          {/* Header */}
          <p style={s.stageHeader}>
            Stage {stage} of 5 — {getStageName(stage)}
          </p>
          <p style={s.stageDesc}>{getStageDescription(stage)}</p>

          {/* Progress bar */}
          <div style={s.progressBar}>
            <div
              style={{
                ...s.progressFill,
                width: `${progress}%`,
              }}
            />
          </div>

          {/* Question */}
          <div style={s.questionCard}>
            <p style={s.questionText}>{currentQuestion.prompt}</p>

            {/* Likert scale (1-5) */}
            {currentQuestion.type === "likert" && (
              <div
                style={{ display: "flex", gap: 8, justifyContent: "center" }}
              >
                {[1, 2, 3, 4, 5].map((val) => (
                  <button
                    key={val}
                    onClick={() => setSelectedAnswer(val)}
                    style={{
                      width: 48,
                      height: 48,
                      borderRadius: 24,
                      border: `2px solid ${selectedAnswer === val ? colors.phosphor : colors.zinc}`,
                      backgroundColor:
                        selectedAnswer === val
                          ? colors.phosphor
                          : "transparent",
                      color:
                        selectedAnswer === val ? colors.obsidian : colors.ivory,
                      fontSize: 16,
                      fontWeight: 600,
                      cursor: "pointer",
                      transition: "all 0.15s ease",
                    }}
                  >
                    {val}
                  </button>
                ))}
              </div>
            )}

            {/* Multiple choice (gap-select, chunk, scenario) */}
            {(currentQuestion.type === "gap-select" ||
              currentQuestion.type === "chunk" ||
              currentQuestion.type === "scenario") &&
              currentQuestion.options?.map((opt, i) => (
                <div
                  key={i}
                  onClick={() => setSelectedAnswer(i)}
                  style={{
                    ...s.optionRow,
                    ...(selectedAnswer === i ? s.optionRowSelected : {}),
                  }}
                >
                  <div
                    style={{
                      ...s.radioOuter,
                      ...(selectedAnswer === i ? s.radioOuterSelected : {}),
                    }}
                  >
                    {selectedAnswer === i && <div style={s.radioInner} />}
                  </div>
                  <span style={s.optionText}>{opt}</span>
                </div>
              ))}

            {/* Open text */}
            {currentQuestion.type === "open-text" && (
              <textarea
                style={s.textarea}
                placeholder="Write your answer in English..."
                value={textAnswer}
                onChange={(e) => setTextAnswer(e.target.value)}
              />
            )}

            {/* Why explanation */}
            <button style={s.whyBtn} onClick={() => setShowWhy(!showWhy)}>
              {showWhy ? "Ocultar explicação" : "Por quê?"}
            </button>
            {showWhy && (
              <div style={s.whyBox}>
                <p style={s.whyText}>{currentQuestion.whyExplanation}</p>
              </div>
            )}
          </div>

          {/* Actions */}
          <div style={s.actions}>
            <span style={{ fontSize: 13, color: colors.zinc }}>
              {totalAnswered} answered
            </span>
            <button
              style={{
                ...s.btn,
                ...((currentQuestion.type !== "open-text" &&
                  selectedAnswer === null) ||
                (currentQuestion.type === "open-text" && !textAnswer.trim())
                  ? s.btnDisabled
                  : {}),
              }}
              disabled={
                (currentQuestion.type !== "open-text" &&
                  selectedAnswer === null) ||
                (currentQuestion.type === "open-text" && !textAnswer.trim())
              }
              onClick={handleAnswer}
            >
              {cartografaState.allResolved ? "Finish" : "Next →"}
            </button>
          </div>
        </div>
      </div>
    );
  }

  // ── RESULT ──
  if (step === "result" && result) {
    const minutes = Math.floor(result.duration_seconds / 60);
    const seconds = result.duration_seconds % 60;

    return (
      <div style={s.page}>
        <div style={s.wideCard}>
          <h1 style={s.resultTitle}>Obrigado!</h1>
          <p style={s.identityCallout}>{result.identity_callout}</p>

          {/* Pillar Radar */}
          <div
            style={{
              display: "flex",
              justifyContent: "center",
              marginBottom: spacing[6],
            }}
          >
            <PillarRadar
              scores={{
                grammar: result.pillar_scores.grammar.score,
                logic: result.pillar_scores.logic.score,
                vocab: result.pillar_scores.vocab.score,
                culture: result.pillar_scores.culture.score,
                comm: result.pillar_scores.comm.score,
              }}
              size={300}
              animate={true}
              delay={300}
            />
          </div>

          {/* Stats */}
          <div style={s.statsRow}>
            <div style={s.statItem}>
              <div style={s.statValue}>{result.total_questions}</div>
              <div style={s.statLabel}>Questions</div>
            </div>
            <div style={s.statItem}>
              <div style={s.statValue}>
                {Math.round(
                  (result.total_correct / result.total_questions) * 100,
                )}
                %
              </div>
              <div style={s.statLabel}>Correct</div>
            </div>
            <div style={s.statItem}>
              <div style={s.statValue}>
                {minutes}:{seconds.toString().padStart(2, "0")}
              </div>
              <div style={s.statLabel}>Duration</div>
            </div>
          </div>

          {/* Readiness badge */}
          <div style={{ textAlign: "center", marginBottom: spacing[4] }}>
            <span style={s.readinessBadge}>
              {getReadinessLabel(result.overall_readiness)}
            </span>
          </div>

          {/* Pillar scores */}
          <div style={{ marginBottom: spacing[6] }}>
            {(["grammar", "logic", "vocab", "culture", "comm"] as Pillar[]).map(
              (pillar) => {
                const ps = result.pillar_scores[pillar];
                return (
                  <div key={pillar} style={s.pillarRow}>
                    <span style={s.pillarLabel}>{PILLAR_NAMES[pillar]}</span>
                    <div style={s.pillarBar}>
                      <div
                        style={{
                          ...s.pillarFill,
                          width: `${ps.score * 100}%`,
                          backgroundColor: PILLAR_COLORS[pillar],
                        }}
                      />
                    </div>
                    <span style={s.pillarScore}>
                      {Math.round(ps.score * 100)}%
                    </span>
                  </div>
                );
              },
            )}
          </div>

          {/* Recommended focus */}
          <div
            style={{
              textAlign: "center",
              marginBottom: spacing[4],
              padding: spacing[3],
              backgroundColor: colors.surfaceContainerHigh,
              borderRadius: radius.card,
            }}
          >
            <p
              style={{
                fontSize: 14,
                color: colors.zinc,
                marginBottom: spacing[1],
              }}
            >
              Recommended focus
            </p>
            <p style={{ fontSize: 16, color: colors.ivory }}>
              {result.recommended_focus.map((p) => PILLAR_NAMES[p]).join(" & ")}
            </p>
          </div>

          {/* Share Card */}
          {shareLink && (
            <ShareCard
              scores={{
                grammar: result.pillar_scores.grammar.score,
                logic: result.pillar_scores.logic.score,
                vocab: result.pillar_scores.vocab.score,
                culture: result.pillar_scores.culture.score,
                comm: result.pillar_scores.comm.score,
              }}
              identityCallout={result.identity_callout}
              readinessLabel={getReadinessLabel(result.overall_readiness)}
              shareUrl={shareLink}
            />
          )}

          {/* Copy link fallback */}
          {shareLink && (
            <div style={{ ...s.shareBox, marginTop: spacing[3] }}>
              <span style={s.shareLink}>{shareLink}</span>
              <button
                style={s.copyBtn}
                onClick={() => navigator.clipboard.writeText(shareLink)}
              >
                Copiar link
              </button>
            </div>
          )}

          {error && (
            <p
              style={{
                color: "#ef4444",
                fontSize: 14,
                textAlign: "center",
                marginBottom: spacing[3],
              }}
            >
              {error}
            </p>
          )}

          <div style={{ textAlign: "center", marginTop: spacing[4] }}>
            <Link href="/" style={{ ...s.btn, marginRight: spacing[3] }}>
              Voltar ao início
            </Link>
            <Link
              href="/lessons"
              style={{
                ...s.btn,
                backgroundColor: "transparent",
                border: `1px solid ${colors.phosphor}`,
                color: colors.phosphor,
              }}
            >
              Ver lições
            </Link>
          </div>
        </div>
      </div>
    );
  }

  // Fallback
  return (
    <div style={s.page}>
      <div style={s.card}>
        <p style={s.desc}>Loading...</p>
      </div>
    </div>
  );
}
