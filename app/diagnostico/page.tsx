"use client";

import React from "react";
import { useState, useCallback, useRef, useEffect, ReactNode } from "react";
import { View, Text } from "react-native";
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
import RoadmapPreview from "@/components/RoadmapPreview";
import SignupForm from "@/components/SignupForm";
import { useAuth } from "@/lib/auth";

// ─── STEP TYPES ─────────────────────────────────────────────
type Step =
  | "preamble"
  | "email"
  | "cartografa"
  | "transition"
  | "result"
  | "signup";

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
  const { signUp, signInWithGoogle, user, linkSession } = useAuth();
  const [step, setStep] = useState<Step>("preamble");
  const [email, setEmail] = useState("");
  const [interest, setInterest] = useState("");
  const [cartografaState, setCartografaState] = useState<CartografaState | null>(
    null,
  );
  const [currentQuestion, setCurrentQuestion] = useState<Question | null>(
    null,
  );
  const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null);
  const [textAnswer, setTextAnswer] = useState("");
  const [showWhy, setShowWhy] = useState(false);
  const [showTransition, setShowTransition] = useState(false);
  const [result, setResult] = useState<CartografaResult | null>(null);
  const [shareLink, setShareLink] = useState("");
  const [shareToken, setShareToken] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");
  const [signupError, setSignupError] = useState("");
  const [signupLoading, setSignupLoading] = useState(false);
  const [questionCount, setQuestionCount] = useState(0);
  const [prevStage, setPrevStage] = useState(0);
  const [sessionId, setSessionId] = useState<string | null>(null);
  const [saveTimer, setSaveTimer] = useState<ReturnType<typeof setTimeout> | null>(
    null,
  );
  const [restoring, setRestoring] = useState(false);

  const generateSessionId = useCallback(() => {
    return "carto-" + crypto.randomUUID().slice(0, 8);
  }, []);

  // Save current state to Supabase for drop-out rescue
  const saveCurrentState = useCallback(
    async (state: CartografaState) => {
      if (!sessionId || !email) return;
      try {
        await fetch("/api/diagnostico/save-state", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            session_id: sessionId,
            email,
            current_pillar: state.currentPillar,
            current_stage: state.currentStage,
            answered_ids: Array.from(state.pillars[state.currentPillar]?.answeredIds || []),
            history: state.history,
            pillar_states: Object.fromEntries(
              Object.entries(state.pillars).map(([p, ps]) => [
                p,
                {
                  currentDifficulty: ps.currentDifficulty,
                  correctAtDifficulty: ps.correctAtDifficulty,
                  totalCorrect: ps.totalCorrect,
                  totalAnswered: ps.totalAnswered,
                  answeredIds: Array.from(ps.answeredIds),
                  score: ps.score,
                  confidence: ps.confidence,
                  resolved: ps.resolved,
                },
              ]),
            ),
            timestamp: Date.now(),
          }),
        });
      } catch {
        // Silent fail — save-state is non-critical
      }
    },
    [sessionId, email],
  );

  // Debounced save: fires 500ms after last answer to batch writes
  const debouncedSave = useCallback(
    (state: CartografaState) => {
      if (saveTimer) clearTimeout(saveTimer);
      const timer = setTimeout(() => saveCurrentState(state), 500);
      setSaveTimer(timer);
    },
    [saveCurrentState, saveTimer],
  );

  // Check for existing incomplete session to resume
  const checkForResume = useCallback(async (userEmail: string) => {
    setRestoring(true);
    try {
      const res = await fetch(`/api/diagnostico/resume?email=${encodeURIComponent(userEmail)}`);
      const data = await res.json();
      if (data.session?.state) {
        const s = data.session.state;
        // Reconstruct CartografaState from saved data
        const state = createInitialState();
        if (s.current_pillar) state.currentPillar = s.current_pillar;
        if (s.current_stage) state.currentStage = s.current_stage;
        if (s.pillar_states) {
          for (const [p, ps] of Object.entries(s.pillar_states) as any) {
            if (state.pillars[p as keyof typeof state.pillars]) {
              const sp = ps as any;
              state.pillars[p as keyof typeof state.pillars].currentDifficulty = sp.currentDifficulty ?? 2;
              state.pillars[p as keyof typeof state.pillars].correctAtDifficulty = sp.correctAtDifficulty ?? 0;
              state.pillars[p as keyof typeof state.pillars].totalCorrect = sp.totalCorrect ?? 0;
              state.pillars[p as keyof typeof state.pillars].totalAnswered = sp.totalAnswered ?? 0;
              state.pillars[p as keyof typeof state.pillars].score = sp.score ?? 0.5;
              state.pillars[p as keyof typeof state.pillars].confidence = sp.confidence ?? 0;
              state.pillars[p as keyof typeof state.pillars].resolved = sp.resolved ?? false;
              if (sp.answeredIds) {
                for (const id of sp.answeredIds) {
                  state.pillars[p as keyof typeof state.pillars].answeredIds.add(id);
                }
              }
            }
          }
        }
        if (data.session.history) {
          state.history = data.session.history;
        }
        setSessionId(data.session.session_id);
        return state;
      }
    } catch {
      // Silent fail — resume is non-critical
    } finally {
      setRestoring(false);
    }
    return null;
  }, []);

  const startNewSession = useCallback(async () => {
    const newSessionId = generateSessionId();
    setSessionId(newSessionId);
    setCartografaState(createInitialState());
    setCurrentQuestion(null);
    setStep("cartografa");
    await fetch("/api/diagnostico/start", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, interest, session_id: newSessionId }),
    });
  }, [email, interest, generateSessionId]);

  // Map user email to session for drop-out rescue
  const linkEmailToSession = useCallback(async () => {
    if (!sessionId || !email) return;
    await fetch("/api/diagnostico/link-email", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ session_id: sessionId, email }),
    });
  }, [sessionId, email]);

  useEffect(() => {
    if (step === "cartografa" && cartografaState && currentQuestion === null) {
      const nextQ = selectNextQuestion(cartografaState);
      setCurrentQuestion(nextQ);
      if (!questionCount) {
        setQuestionCount(Object.values(cartografaState.pillars).reduce(
          (acc, p) => acc + p.totalAnswered,
          0,
        ));
      }
    }
  }, [step, cartografaState, currentQuestion, questionCount]);

  const handleQuizAnswer = useCallback(
    async (answerIndex: number) => {
      if (!cartografaState || !currentQuestion || submitting) return;

      setSubmitting(true);
      setError("");

      const updatedState = processAnswer(
        cartografaState,
        currentQuestion.id,
        currentQuestion.options[answerIndex],
      );

      setCartografaState(updatedState);
      setSelectedAnswer(answerIndex);
      setQuestionCount(qc => qc + 1);
      await saveCurrentState(updatedState);
      debouncedSave(updatedState);

      // Show ‚Why?‘ explanation for wrong answers
      const tookCorrectAnswer = currentQuestion.options[answerIndex].correct;
      const showWhyOnMistake = !tookCorrectAnswer && currentQuestion.explanation;
      setShowWhy(showWhyOnMistake);
    },
    [cartografaState, currentQuestion, submitting, debouncedSave, saveCurrentState],
  );

  const handleTextAnswer = useCallback(async () => {
    if (!cartografaState || !currentQuestion || submitting || !textAnswer.trim()) return;

    setSubmitting(true);
    setError("");

    const updatedState = processAnswer(
      cartografaState,
      currentQuestion.id,
      { text: textAnswer, correct: false }, // Assume incorrect until backend validates
    );

    setCartografaState(updatedState);
    setSelectedAnswer(null);
    setTextAnswer("");
    setQuestionCount(qc => qc + 1);
    await saveCurrentState(updatedState);
    debouncedSave(updatedState);
    setShowWhy(false);
  }, [cartografaState, currentQuestion, submitting, textAnswer, debouncedSave, saveCurrentState]);

  const proceedToNextQuestion = useCallback(() => {
    setSelectedAnswer(null);
    setShowWhy(false);
    setCurrentQuestion(null); // Triggers new question selection
    setSubmitting(false);
  }, []);

  const generateAndShowResults = useCallback(async () => {
    if (!cartografaState) return;

    const res = generateResults(cartografaState);
    setResult(res);
    setShowTransition(true);

    // Generate share token
    try {
      const res = await fetch("/api/diagnostico/share", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          pillar_scores: res.pillar_scores,
          overall_readiness: res.overall_readiness,
          recommended_focus: res.recommended_focus,
          identity_callout: res.identity_callout,
        }),
      });
      const data = await res.json();
      if (data.share_token) {
        setShareToken(data.share_token);
        setShareLink(
          `${process.env.NEXT_PUBLIC_APP_URL}/diagnostico/resultado?token=${data.share_token}`,
        );
      }
    } catch {
      setError("Falha ao gerar link de compartilhamento");
    }

    // Link email to results for "returning user" features
    await linkEmailToSession();
  }, [cartografaState, linkEmailToSession]);

  const handleMsgSubmit = useCallback(async () => {
    await linkEmailToSession();
    setStep("cartografa");
  }, [linkEmailToSession]);

  const handleSignupSubmit = useCallback(
    async (email: string, password: string) => {
      setSignupLoading(true);
      try {
        await signUp(email, password);
        if (sessionId && linkSession) {
          await linkSession(sessionId);
        }
        await linkEmailToSession();
        setStep("cartografa");
        setSignupError("");
      } catch (err) {
        setSignupError(
          err instanceof Error ? err.message : "Falha no cadastro",
        );
      } finally {
        setSignupLoading(false);
      }
    },
    [sessionId, linkSession, linkEmailToSession, signUp],
  );

  // Auto-resume if email exists
  useEffect(() => {
    if (email && step === "email") {
      checkForResume(email).then(state => {
        if (state) {
          setCartografaState(state);
          setCurrentQuestion(null);
          setStep("cartografa");
        }
      });
    }
  }, [email, step, checkForResume]);

  // ─── RENDER FUNCTIONS ──────────────────────────────────────
  const PreambleContent = () => (
    <>
      <h1 style={s.title}>Diagnóstico de Português</h1>
      <p style={s.subtitle}>
        Um exame adaptativo para mapear suas habilidades na língua
      </p>
      <p style={s.desc}>
        Responda perguntas de múltipla escolha ou texto livre.
        <strong>Totalmente gratuito e sem cadastro.</strong>
      </p>
      <button
        onClick={() => setStep("email")}
        style={s.btn}
        disabled={false}
      >
        Iniciar diagnóstico
      </button>
    </>
  );

  const EmailContent = () => (
    <>
      <div style={s.stageHeader}>{getStageName(0)}</div>
      <h1 style={s.title}>Vamos começar!</h1>
      <div style={s.stageDesc}>
        {getStageDescription(0)}
        <br />
        <em>Opcional — recomendamos para salvar seu progresso.</em>
      </div>

      <label htmlFor="email" style={s.label}>
        E-mail
      </label>
      <input
        type="email"
        id="email"
        style={s.input}
        value={email}
        onChange={e => setEmail(e.target.value)}
        onKeyDown={e => e.key === "Enter" && handleMsgSubmit()}
        placeholder="e-mail@exemplo.com"
        disabled={restoring}
      />

      <button
        onClick={handleMsgSubmit}
        style={s.btn}
        disabled={restoring}
      >
        {restoring ? <Text>Carregando...</Text> : <Text>Continuar →</Text>}
      </button>

      <button
        style={s.skipBtn}
        onClick={() => {
          setEmail("guest@lexio.com");
          setStep("cartografa");
        }}
      >
        Pular →
      </button>
    </>
  );

  const QuestionContent = () => {
    if (!currentQuestion) return null;
    const currentStageIndex =
      cartografaState && cartografaState.currentStage >= 2
        ? cartografaState.currentStage * 8 + cartografaState.currentPillarIndex
        : 0;
    const progress =
      prevStage > 0 && questionCount
        ? Math.min(((questionCount - prevStage) / 24) * 100, 100)
        : 0;

    // Determine if current question is the last of the pillar
    const isLastQuestion =
      cartografaState &&
      cartografaState.pillars[cartografaState.currentPillar]
        .answeredIds.size >=
        Object.keys(cartografaState.pillars).length * 8;

    return (
      <>
        <div style={s.stageHeader}>{getStageName(cartografaState?.currentStage || 0)}</div>
        <h2 style={{ ...s.title, fontSize: 24 }}>
          {PILLAR_NAMES[currentQuestion.pillar]}
        </h2>
        <div style={s.stageDesc}>
          {currentQuestion.stageInfo.description}
          <br />
          <em>
            {currentQuestion.difficultyInfo.description}
          </em>
        </div>
        
        <div>
          Etapa {cartografaState.currentStage + 1} • Pergunta {currentQuestion.id.slice(-2)}
        </div>

        <div style={s.progressBar}>
          <div style={{ ...s.progressFill, width: `${progress}%` }} />
        </div>

        <div style={s.questionCard}>
          <p style={s.questionText}>{currentQuestion.prompt}</p>

          {currentQuestion.layout === "default" && (<>
          {currentQuestion.options.map((opt, idx) => (
          <div
          style={selectedAnswer === idx ? { ...s.optionRow, ...s.optionRowSelected } : s.optionRow}
          onClick={() => !submitting && handleQuizAnswer(idx)}
          key={idx}
          >
          <div
          style={selectedAnswer === idx ? { ...s.radioOuter, ...s.radioOuterSelected } : s.radioOuter}
          >
          {selectedAnswer === idx && <div style={s.radioInner} />}
          </div>
          <div style={s.optionText}>{opt.text}</div>
          </div>
          ))}
          </>)}

          {currentQuestion.layout === "text" && (
            <div>
              <textarea
                style={s.textarea}
                value={textAnswer}
                onChange={e => setTextAnswer(e.target.value)}
                disabled={submitting}
              />
              <button
                style={s.btn}
                onClick={handleTextAnswer}
                disabled={submitting || !textAnswer.trim()}
              >
                {submitting ? <Text>"Enviando..."</Text> : <Text>"Enviar resposta"</Text>}
              </button>
            </div>
          )}

          {showWhy && (
            <div style={s.whyBox}>
              <p style={s.whyText}>{currentQuestion.explanation}</p>
            </div>
          )}
        </div>

        <div style={s.actions}>
          <button
            style={s.skipBtn}
            onClick={proceedToNextQuestion}
            disabled={submitting}
          >
            Pular →
          </button>
          <button
            style={s.btn}
            onClick={proceedToNextQuestion}
            disabled={selectedAnswer === null && !textAnswer.trim()}
          >
            {isLastQuestion ? <Text>"Ver resultados →"</Text> : <Text>"Próxima pergunta →"</Text>}
          </button>
        </div>
      </>
    );
  };

  const TransitionContent = () => (
    <>
      <RoadmapPreview
        recommendedFocus={result?.recommended_focus || []}
        overallReadiness={result?.overall_readiness || 0}
        animate={showTransition}
      />
      <br />
      <button
        style={s.btn}
        onClick={() => {
          setStep("result");
          setShowTransition(false);
        }}
        disabled={false}
      >
        Ver relatório →
      </button>
    </>
  );

  // ── RESULT CONTENT (WRAPPED IN DIV) ───────────────────────────
  const ResultContent = () => {
    if (!result) return null;
    const minutes = Math.floor(result.duration_seconds / 60);
    const seconds = result?.duration_seconds % 60;
    return (
      <div>
        <div style={s?.page || {}}>
          <div style={s?.wideCard || {}}>
            <h1 style={s?.resultTitle || {}}>Obrigado!</h1>
            <p style={s?.identityCallout || {}}>{result.identity_callout}</p>

            {/* Pillar Radar */}
            <div
              style=
                {
                  {
                    display: "flex",
                    justifyContent: "center",
                    marginBottom: spacing[6],
                  }
                }
            >
              <PillarRadar
                scores=
                  {
                    {
                      grammar: result.pillar_scores.grammar.score,
                      logic: result.pillar_scores.logic.score,
                      vocab: result.pillar_scores.vocab.score,
                      culture: result.pillar_scores.culture.score,
                      comm: result.pillar_scores.comm.score,
                    }
                  }
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
                  {minutes}:{(seconds ?? 0).toString().padStart(2, "0")}
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
              {( [
                "grammar",
                "logic",
                "vocab",
                "culture",
                "comm",
              ] as Pillar[]).map((pillar) => {
                const ps = result.pillar_scores[pillar];
                return (
                  <div key={pillar} style={s.pillarRow}> 
                    <span style={s.pillarLabel}>{PILLAR_NAMES[pillar]}</span>
                    <div style={s.pillarBar}> 
                      <div
                        style={{ ...s.pillarFill, width: `${ps.score * 100}%`, backgroundColor: PILLAR_COLORS[pillar], }}
                      />
                    </div>
                    <span style={s.pillarScore}> 
                      {Math.round(ps.score * 100)}%
                    </span>
                  </div>
                );
              })}
            </div>

            {/* Recommended focus */}
            <div
              style=
                {
                  {
                    textAlign: "center",
                    marginBottom: spacing[4],
                    padding: spacing[3],
                    backgroundColor: colors.surfaceContainerHigh,
                    borderRadius: radius.card,
                  }
                }
            >
              <p
                style=
                  {
                    {
                      fontSize: 14,
                      color: colors.zinc,
                      marginBottom: spacing[1],
                    }
                  }
              >
                Recommended focus
              </p>
              <p style={{ fontSize: 16, color: colors.ivory }}> 
                {result.recommended_focus 
                  .map((p) => PILLAR_NAMES[p]) 
                  .join(" & ")}
              </p>
            </div>

            {/* Share Card */}
            {shareLink && (
              <ShareCard
                scores=
                  {
                    {
                      grammar: result.pillar_scores.grammar.score,
                      logic: result.pillar_scores.logic.score,
                      vocab: result.pillar_scores.vocab.score,
                      culture: result.pillar_scores.culture.score,
                      comm: result.pillar_scores.comm.score,
                    }
                  }
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
                style=
                  {
                    {
                      color: "#ef4444",
                      fontSize: 14,
                      textAlign: "center",
                      marginBottom: spacing[3],
                    }
                  }
              >
                {error}
              </p>
            )}

            {/* Roadmap Preview */}
            <RoadmapPreview
              recommendedFocus={result.recommended_focus}
              overallReadiness={result.overall_readiness}
              animate={true}
            />

            <div style={{ textAlign: "center", marginTop: spacing[4] }}> 
              <Link href="/" style={{ ...s.btn, marginRight: spacing[3] }}> 
                Voltar ao início
              </Link>
              <Link
                href="/lessons"
                style=
                  {
                    {
                      ...s.btn,
                      backgroundColor: "transparent",
                      border: `1px solid ${colors.phosphor}`,
                      color: colors.phosphor,
                    }
                  }
              >
                Ver lições
              </Link>
            </div>

            {/* Create Account CTA */}
            {!user && (
              <div style={{ textAlign: "center", marginTop: spacing[4] }}> 
                <button
                  onClick={() => setStep("signup")}
                  style=
                    {
                      {
                        padding: "12px 28px",
                        backgroundColor: colors.phosphor,
                        color: colors.obsidian,
                        border: "none",
                        borderRadius: radius.btn,
                        fontSize: 15,
                        fontWeight: 600,
                        cursor: "pointer",
                      }
                    }
                >
                  Criar conta para salvar resultados →
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    );
  };

  const SignupContent = () => (
    <SignupForm
      onSubmit={handleSignupSubmit}
      loading={signupLoading}
      error={signupError}
      disabled={false}
    />
  );

  // ─── RENDER LOGIC ────────────────────────────────────────
  if (user && step === "email") {
    setStep("cartografa");
  }

  return (
    <div>
      <div style={s.page}>
        {step === "preamble" && <PreambleContent />}
        {step === "email" && <EmailContent />}
        {step === "cartografa" && cartografaState && <QuestionContent />}
        {step === "transition" && <TransitionContent />}
        {step === "result" && result && <ResultContent />}
        {step === "signup" && <SignupContent />}
      </div>
    </div>
  );
}