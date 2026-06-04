"use client";

import React, {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import Link from "next/link";
import type { Question } from "@/cartografa/question-bank";
import {
  type CartografaResult,
  type CartografaState,
  type Pillar,
  type PillarState,
  createInitialState,
  generateResults,
  getReadinessLabel,
  getStageDescription,
  getStageName,
  processAnswer,
  selectNextQuestion,
} from "@/cartografa/adaptive-engine";
import PillarRadar from "@/components/PillarRadar";
import ShareCard from "@/components/ShareCard";
import RoadmapPreview from "@/components/RoadmapPreview";
import { EmailCapture } from "@/components/onboarding/EmailCapture";
import { Preamble } from "@/components/onboarding/Preamble";
import { useAuth } from "@/lib/auth";
import { colors, spacing, radius } from "@/theme/tokens";

type Step = "preamble" | "email" | "quiz" | "results";

const PILLARS: Pillar[] = ["grammar", "logic", "vocab", "culture", "comm"];

const s = {
  page: {
    minHeight: "100dvh",
    backgroundColor: colors.obsidian,
    color: colors.ivory,
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    padding: `${spacing[6]}px ${spacing[4]}px`,
    fontFamily: "var(--font-body, 'Source Serif 4', Georgia, serif)",
  } satisfies React.CSSProperties,
  shell: {
    width: "100%",
    maxWidth: 640,
  } satisfies React.CSSProperties,
  backLink: {
    alignSelf: "flex-start",
    color: colors.zinc,
    fontSize: 14,
    marginBottom: spacing[4],
    textDecoration: "none",
  } satisfies React.CSSProperties,
  card: {
    backgroundColor: colors.surface,
    border: `1px solid ${colors.borderSubtle}`,
    borderRadius: radius.card,
    padding: spacing[6],
  } satisfies React.CSSProperties,
  stageLabel: {
    color: colors.phosphor,
    fontSize: 13,
    fontFamily: "var(--font-mono, 'JetBrains Mono', monospace)",
    letterSpacing: "0.08em",
    marginBottom: spacing[2],
    textTransform: "uppercase",
  } satisfies React.CSSProperties,
  title: {
    fontFamily: "var(--font-display, Syne, sans-serif)",
    fontSize: 28,
    fontWeight: 700,
    lineHeight: 1.2,
    marginBottom: spacing[3],
  } satisfies React.CSSProperties,
  prompt: {
    color: colors.ivory,
    fontSize: 18,
    lineHeight: 1.55,
    marginBottom: spacing[6],
  } satisfies React.CSSProperties,
  why: {
    backgroundColor: colors.surfaceContainer,
    borderLeft: `3px solid ${colors.phosphor}`,
    color: colors.onSurfaceVariant,
    fontSize: 14,
    lineHeight: 1.5,
    marginBottom: spacing[4],
    padding: spacing[3],
  } satisfies React.CSSProperties,
  progressTrack: {
    backgroundColor: colors.surfaceContainerHigh,
    borderRadius: 4,
    height: 4,
    marginBottom: spacing[6],
    overflow: "hidden",
    width: "100%",
  } satisfies React.CSSProperties,
  progressFill: {
    backgroundColor: colors.phosphor,
    height: "100%",
    transition: "width 0.3s ease",
  } satisfies React.CSSProperties,
  option: (selected: boolean) =>
    ({
      alignItems: "center",
      backgroundColor: selected ? colors.surfaceContainerHigh : "transparent",
      border: `1px solid ${selected ? colors.phosphor : colors.borderSubtle}`,
      borderRadius: radius.btn,
      cursor: "pointer",
      display: "flex",
      gap: 12,
      marginBottom: spacing[2],
      padding: `${spacing[3]}px ${spacing[4]}px`,
      textAlign: "left",
      width: "100%",
    }) satisfies React.CSSProperties,
  likertRow: {
    display: "flex",
    flexWrap: "wrap",
    gap: spacing[2],
    marginBottom: spacing[4],
  } satisfies React.CSSProperties,
  likertBtn: (selected: boolean) =>
    ({
      backgroundColor: selected ? colors.phosphor : colors.surfaceContainer,
      border: `1px solid ${selected ? colors.phosphor : colors.borderSubtle}`,
      borderRadius: radius.btn,
      color: selected ? colors.obsidian : colors.ivory,
      cursor: "pointer",
      flex: "1 1 56px",
      fontWeight: 600,
      minWidth: 56,
      padding: `${spacing[3]}px 0`,
    }) satisfies React.CSSProperties,
  primaryBtn: {
    backgroundColor: colors.phosphor,
    border: "none",
    borderRadius: radius.btn,
    color: colors.obsidian,
    cursor: "pointer",
    fontSize: 15,
    fontWeight: 600,
    marginTop: spacing[4],
    padding: `${spacing[3]}px ${spacing[6]}px`,
    width: "100%",
  } satisfies React.CSSProperties,
  textarea: {
    backgroundColor: colors.surfaceContainer,
    border: `1px solid ${colors.borderSubtle}`,
    borderRadius: radius.btn,
    color: colors.ivory,
    fontFamily: "inherit",
    fontSize: 15,
    lineHeight: 1.5,
    marginBottom: spacing[3],
    minHeight: 120,
    padding: spacing[3],
    resize: "vertical",
    width: "100%",
  } satisfies React.CSSProperties,
  error: {
    color: colors.crimson,
    fontSize: 14,
    marginTop: spacing[3],
  } satisfies React.CSSProperties,
  resultHeader: {
    marginBottom: spacing[6],
    textAlign: "center",
  } satisfies React.CSSProperties,
  identity: {
    color: colors.phosphor,
    fontSize: 20,
    fontStyle: "italic",
    marginTop: spacing[3],
  } satisfies React.CSSProperties,
};

function generateSessionId() {
  return `sess_${Date.now()}_${Math.random().toString(36).slice(2, 9)}`;
}

function cloneState(state: CartografaState): CartografaState {
  const pillars = {} as Record<Pillar, PillarState>;
  for (const pillar of PILLARS) {
    const ps = state.pillars[pillar];
    pillars[pillar] = {
      ...ps,
      answeredIds: new Set(ps.answeredIds),
      gapNodes: [...ps.gapNodes],
    };
  }
  return {
    ...state,
    pillars,
    history: [...state.history],
  };
}

function serializePillarStates(state: CartografaState) {
  return Object.fromEntries(
    PILLARS.map((p) => {
      const ps = state.pillars[p];
      return [
        p,
        {
          ...ps,
          answeredIds: Array.from(ps.answeredIds),
        },
      ];
    })
  );
}

function restoreState(raw: Record<string, unknown>): CartografaState | null {
  try {
    const base = createInitialState();
    const pillarStates = raw.pillar_states as Record<string, PillarState> | undefined;
    if (!pillarStates) return null;

    for (const pillar of PILLARS) {
      const saved = pillarStates[pillar];
      if (!saved) continue;
      base.pillars[pillar] = {
        ...base.pillars[pillar],
        ...saved,
        answeredIds: new Set(
          Array.isArray(saved.answeredIds)
            ? saved.answeredIds
            : saved.answeredIds instanceof Set
              ? Array.from(saved.answeredIds)
              : []
        ),
        gapNodes: saved.gapNodes ?? [],
      };
    }
    if (typeof raw.current_pillar === "string") {
      base.currentPillar = raw.current_pillar as Pillar;
    }
    if (typeof raw.current_stage === "number") {
      base.currentStage = raw.current_stage as CartografaState["currentStage"];
    }
    return base;
  } catch {
    return null;
  }
}

export default function DiagnosticoPage() {
  const { signUp, signInWithGoogle, linkSession, user } = useAuth();
  const [step, setStep] = useState<Step>("preamble");
  const [email, setEmail] = useState("");
  const [interest, setInterest] = useState("");
  const [sessionId, setSessionId] = useState("");
  const [cartografaState, setCartografaState] = useState<CartografaState | null>(
    null
  );
  const [currentQuestion, setCurrentQuestion] = useState<Question | null>(null);
  const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null);
  const [textAnswer, setTextAnswer] = useState("");
  const [showWhy, setShowWhy] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");
  const [result, setResult] = useState<CartografaResult | null>(null);
  const [shareToken, setShareToken] = useState("");
  const saveTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  const answeredCount = cartografaState?.history.length ?? 0;
  const progressPct = Math.min(100, Math.round((answeredCount / 25) * 100));

  const radarScores = useMemo(() => {
    if (!result) return null;
    return {
      grammar: result.pillar_scores.grammar.score,
      logic: result.pillar_scores.logic.score,
      vocab: result.pillar_scores.vocab.score,
      culture: result.pillar_scores.culture.score,
      comm: result.pillar_scores.comm.score,
    };
  }, [result]);

  const shareUrl =
    typeof window !== "undefined" && shareToken
      ? `${window.location.origin}/diagnostico?token=${shareToken}`
      : "";

  const persistState = useCallback(
    async (state: CartografaState) => {
      if (!sessionId || !email) return;
      const active = state.pillars[state.currentPillar];
      await fetch("/api/diagnostico/save-state", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          session_id: sessionId,
          email,
          current_pillar: state.currentPillar,
          current_stage: state.currentStage,
          current_difficulty: active?.currentDifficulty ?? 2,
          answered_ids: PILLARS.flatMap((p) =>
            Array.from(state.pillars[p].answeredIds)
          ),
          history: state.history,
          pillar_states: serializePillarStates(state),
          timestamp: new Date().toISOString(),
        }),
      });
    },
    [email, sessionId]
  );

  const debouncedSave = useCallback(
    (state: CartografaState) => {
      if (saveTimer.current) clearTimeout(saveTimer.current);
      saveTimer.current = setTimeout(() => {
        void persistState(state);
      }, 800);
    },
    [persistState]
  );

  const pickNextQuestion = useCallback((state: CartografaState) => {
    const next = selectNextQuestion(state);
    if (!next || state.allResolved) {
      setCurrentQuestion(null);
      return false;
    }
    setCurrentQuestion(next);
    setSelectedAnswer(null);
    setTextAnswer("");
    setShowWhy(false);
    return true;
  }, []);

  const finishQuiz = useCallback(
    async (state: CartografaState) => {
      const finalResult = generateResults(state);
      setResult(finalResult);
      setStep("results");
      setSubmitting(true);
      setError("");

      try {
        const shareRes = await fetch("/api/diagnostico/share", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            session_id: sessionId,
            email,
            pillar_scores: finalResult.pillar_scores,
            overall_readiness: finalResult.overall_readiness,
            recommended_focus: finalResult.recommended_focus,
            identity_callout: finalResult.identity_callout,
          }),
        });
        if (shareRes.ok) {
          const shareData = await shareRes.json();
          if (shareData.share_token) setShareToken(shareData.share_token);
        }

        const submitRes = await fetch("/api/diagnostico", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            email,
            interest,
            answers: state.history,
            results: finalResult,
            session_id: sessionId,
          }),
        });

        if (!submitRes.ok) {
          const errBody = await submitRes.json().catch(() => ({}));
          setError(
            (errBody as { error?: string }).error ||
              "Não foi possível salvar o diagnóstico."
          );
        } else {
          const data = await submitRes.json();
          if (data.share_token) setShareToken(data.share_token);
        }

        await fetch("/api/diagnostico/link-email", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ session_id: sessionId, email }),
        });
      } catch {
        setError("Erro de rede ao salvar resultados.");
      } finally {
        setSubmitting(false);
      }
    },
    [email, interest, sessionId]
  );

  const handleEmailSubmit = useCallback(
    async (userEmail: string, userInterest: string) => {
      setEmail(userEmail);
      setInterest(userInterest);
      setError("");

      let activeSessionId = generateSessionId();
      let restored: CartografaState | null = null;
      try {
        const resumeRes = await fetch(
          `/api/diagnostico/resume?email=${encodeURIComponent(userEmail)}`
        );
        if (resumeRes.ok) {
          const data = await resumeRes.json();
          if (data.session?.state) {
            restored = restoreState(data.session.state as Record<string, unknown>);
            if (data.session.session_id) {
              activeSessionId = data.session.session_id;
            }
          }
        }
      } catch {
        // resume is optional
      }

      setSessionId(activeSessionId);
      const initial = restored ?? createInitialState();
      setCartografaState(initial);

      await fetch("/api/diagnostico/start", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email: userEmail,
          interest: userInterest,
          session_id: activeSessionId,
        }),
      });

      if (!pickNextQuestion(initial)) {
        await finishQuiz(initial);
        return;
      }

      setStep("quiz");
    },
    [finishQuiz, pickNextQuestion]
  );

  const applyAnswer = useCallback(
    async (answer: number | string) => {
      if (!cartografaState || !currentQuestion || submitting) return;

      setSubmitting(true);
      setError("");

      const nextState = cloneState(cartografaState);
      const { correct } = processAnswer(
        nextState,
        currentQuestion.id,
        answer
      );

      setCartografaState(nextState);
      debouncedSave(nextState);

      if (!correct && currentQuestion.whyExplanation) {
        setShowWhy(true);
        setSubmitting(false);
        return;
      }

      if (!pickNextQuestion(nextState)) {
        await finishQuiz(nextState);
      } else {
        setSubmitting(false);
      }
    },
    [
      cartografaState,
      currentQuestion,
      submitting,
      debouncedSave,
      pickNextQuestion,
      finishQuiz,
    ]
  );

  useEffect(() => {
    if (user?.email && step === "preamble") {
      setEmail(user.email);
    }
  }, [user?.email, step]);

  if (step === "preamble") {
    return (
      <main style={s.page}>
        <div style={{ ...s.shell, flex: 1, display: "flex", minHeight: "70dvh" }}>
          <Link href="/" style={s.backLink}>
            ← Lexio Underground
          </Link>
          <Preamble onPress={() => setStep("email")} />
        </div>
      </main>
    );
  }

  if (step === "email") {
    return (
      <main style={s.page}>
        <div style={{ ...s.shell, flex: 1, display: "flex", minHeight: "70dvh" }}>
          <Link href="/" style={s.backLink}>
            ← Voltar
          </Link>
          <EmailCapture onSubmit={handleEmailSubmit} />
        </div>
      </main>
    );
  }

  if (step === "results" && result && radarScores) {
    return (
      <main style={s.page}>
        <div style={s.shell}>
          <Link href="/" style={s.backLink}>
            ← Início
          </Link>
          <header style={s.resultHeader}>
            <p style={s.stageLabel}>Cartógrafa completa</p>
            <h1 style={s.title}>Seu mapa da ignorância</h1>
            <p style={s.identity}>{result.identity_callout}</p>
            <p style={{ color: colors.zinc, marginTop: spacing[2] }}>
              {getReadinessLabel(result.overall_readiness)}
            </p>
          </header>

          <div style={{ display: "flex", justifyContent: "center", marginBottom: spacing[6] }}>
            <PillarRadar scores={radarScores} size={280} animate />
          </div>

          {shareUrl ? (
            <ShareCard
              scores={radarScores}
              identityCallout={result.identity_callout}
              readinessLabel={getReadinessLabel(result.overall_readiness)}
              shareUrl={shareUrl}
            />
          ) : null}

          <div style={{ marginTop: spacing[6] }}>
            <RoadmapPreview
              recommendedFocus={result.recommended_focus}
              overallReadiness={result.overall_readiness}
            />
          </div>

          <div style={{ display: "flex", gap: spacing[3], marginTop: spacing[6] }}>
            <Link
              href="/palace"
              style={{
                ...s.primaryBtn,
                display: "inline-block",
                textAlign: "center",
                textDecoration: "none",
                width: "auto",
                flex: 1,
              }}
            >
              Ir ao Palácio
            </Link>
            <Link
              href="/lessons"
              style={{
                ...s.primaryBtn,
                backgroundColor: colors.surfaceContainerHigh,
                color: colors.ivory,
                display: "inline-block",
                textAlign: "center",
                textDecoration: "none",
                width: "auto",
                flex: 1,
              }}
            >
              Ver lições
            </Link>
          </div>

          {error ? <p style={s.error}>{error}</p> : null}
          {submitting ? (
            <p style={{ color: colors.zinc, marginTop: spacing[3] }}>Salvando…</p>
          ) : null}
        </div>
      </main>
    );
  }

  if (step === "quiz" && cartografaState && currentQuestion) {
    const pillar = currentQuestion.pillar;
    const stage = currentQuestion.stage;

    return (
      <main style={s.page}>
        <div style={s.shell}>
          <Link href="/" style={s.backLink}>
            ← Sair
          </Link>

          <p style={s.stageLabel}>
            Estágio {stage} · {getStageName(stage)}
          </p>
          <h1 style={{ ...s.title, fontSize: 22 }}>{getStageDescription(stage)}</h1>

          <div style={s.progressTrack}>
            <div style={{ ...s.progressFill, width: `${progressPct}%` }} />
          </div>

          <article style={s.card}>
            <p style={s.prompt}>{currentQuestion.prompt}</p>

            {showWhy && currentQuestion.whyExplanation ? (
              <div style={s.why}>
                <strong style={{ color: colors.phosphor }}>Por quê?</strong>
                <p style={{ marginTop: spacing[2] }}>{currentQuestion.whyExplanation}</p>
                <button
                  type="button"
                  style={{ ...s.primaryBtn, marginTop: spacing[3] }}
                  onClick={() => {
                    setShowWhy(false);
                    if (!pickNextQuestion(cartografaState)) {
                      void finishQuiz(cartografaState);
                    }
                  }}
                >
                  Continuar
                </button>
              </div>
            ) : null}

            {!showWhy && currentQuestion.type === "likert" ? (
              <>
                <div style={s.likertRow}>
                  {[1, 2, 3, 4, 5].map((n) => (
                    <button
                      key={n}
                      type="button"
                      style={s.likertBtn(selectedAnswer === n)}
                      disabled={submitting}
                      onClick={() => {
                        setSelectedAnswer(n);
                        void applyAnswer(n);
                      }}
                    >
                      {n}
                    </button>
                  ))}
                </div>
                <p style={{ color: colors.zinc, fontSize: 13 }}>
                  1 = discordo totalmente · 5 = concordo totalmente
                </p>
              </>
            ) : null}

            {!showWhy &&
            currentQuestion.options &&
            currentQuestion.type !== "likert" &&
            currentQuestion.type !== "open-text" ? (
              <div>
                {currentQuestion.options.map((opt, idx) => (
                  <button
                    key={idx}
                    type="button"
                    style={s.option(selectedAnswer === idx)}
                    disabled={submitting}
                    onClick={() => {
                      setSelectedAnswer(idx);
                      void applyAnswer(idx);
                    }}
                  >
                    <span style={{ color: colors.phosphor, fontWeight: 700 }}>
                      {String.fromCharCode(65 + idx)}
                    </span>
                    <span>{opt}</span>
                  </button>
                ))}
              </div>
            ) : null}

            {!showWhy && currentQuestion.type === "open-text" ? (
              <>
                <textarea
                  style={s.textarea}
                  value={textAnswer}
                  onChange={(e) => setTextAnswer(e.target.value)}
                  placeholder="Escreva sua resposta em português ou inglês…"
                />
                <button
                  type="button"
                  style={s.primaryBtn}
                  disabled={submitting || !textAnswer.trim()}
                  onClick={() => void applyAnswer(textAnswer.trim())}
                >
                  Enviar resposta
                </button>
              </>
            ) : null}

            {error ? <p style={s.error}>{error}</p> : null}
          </article>

          <p style={{ color: colors.zinc, fontSize: 13, marginTop: spacing[4], textAlign: "center" }}>
            Pilar ativo: <strong style={{ color: colors.ivory }}>{pillar}</strong> ·{" "}
            {answeredCount} respostas
          </p>
        </div>
      </main>
    );
  }

  return (
    <main style={s.page}>
      <div style={s.shell}>
        <p style={s.error}>{error || "Carregando Cartógrafa…"}</p>
        <button type="button" style={s.primaryBtn} onClick={() => setStep("preamble")}>
          Reiniciar
        </button>
      </div>
    </main>
  );
}
