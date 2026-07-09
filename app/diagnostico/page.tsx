"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import {
  createInitialState,
  selectNextQuestion,
  processAnswer,
  generateResults,
  getStageName,
  getStageDescription,
  getReadinessLabel,
  CartografaState,
  CartografaResult,
  Pillar,
  PillarState,
} from "@/cartografa/adaptive-engine";
import type { Question } from "@/cartografa/question-bank";
import { PillarRadar } from "@/components/PillarRadar";
import { CartografaReport } from "@/components/CartografaReport";
import { MaturityStage } from "@/types/stubs";
import { colors, spacing, radius, typography, duration } from "@/theme/tokens";

// ─── SERIALISATION HELPERS ─────────────────────────────────
// CartografaState uses Set & boolean flags that don't round-trip through JSON.
// We convert to/from a plain-serialisable shape for save-state / resume.

interface SerializedPillarState {
  pillar: Pillar;
  currentDifficulty: number;
  correctAtDifficulty: number;
  totalCorrect: number;
  totalAnswered: number;
  answeredIds: string[];
  score: number;
  confidence: number;
  resolved: boolean;
  gapNodes: {
    questionId: string;
    difficulty: number;
    description: string;
    severity: "high" | "medium" | "low";
  }[];
}

interface SerializedState {
  pillars: Record<Pillar, SerializedPillarState>;
  currentPillar: Pillar;
  currentStage: 1 | 2 | 3 | 4 | 5;
  history: {
    questionId: string;
    pillar: Pillar;
    difficulty: number;
    answer: number | string;
    correct: boolean;
    timestamp: number;
  }[];
  startedAt: number;
  allResolved: boolean;
  lang: string;
}

function serializeState(state: CartografaState): SerializedState {
  const pillars = {} as Record<Pillar, SerializedPillarState>;
  for (const p of Object.keys(state.pillars) as Pillar[]) {
    const ps = state.pillars[p];
    pillars[p] = {
      ...ps,
      answeredIds: Array.from(ps.answeredIds),
    };
  }
  return { ...state, pillars };
}

function deserializeState(s: SerializedState): CartografaState {
  const pillars = {} as Record<Pillar, PillarState>;
  for (const p of Object.keys(s.pillars) as Pillar[]) {
    const sp = s.pillars[p];
    pillars[p] = {
      ...sp,
      answeredIds: new Set(sp.answeredIds),
    };
  }
  return { ...s, pillars, lang: s.lang || "en" };
}

// ─── SESSION ID ────────────────────────────────────────────
function generateSessionId(): string {
  return `diag_${Date.now()}_${Math.random().toString(36).slice(2, 10)}`;
}

// ─── COMPONENT ─────────────────────────────────────────────
export default function DiagnosticoPage() {
  const [engineState, setEngineState] = useState<CartografaState | null>(null);
  const [currentQuestion, setCurrentQuestion] = useState<Question | null>(null);
  const [selected, setSelected] = useState<number | string | null>(null);
  const [showExplain, setShowExplain] = useState(false);
  const [lastCorrect, setLastCorrect] = useState<boolean | null>(null);
  const [result, setResult] = useState<CartografaResult | null>(null);
  const [sessionId, setSessionId] = useState<string>("");
  const [shareToken, setShareToken] = useState<string | null>(null);
  const [isResuming, setIsResuming] = useState(true);
  const [openTextValue, setOpenTextValue] = useState("");
  const [saving, setSaving] = useState(false);
  const mountedRef = useRef(false);

  // ── Initialise or resume on mount ──────────────────────
  useEffect(() => {
    mountedRef.current = true;
    (async () => {
      try {
        // Try to resume an existing session
        const storedSessionId =
          typeof window !== "undefined"
            ? localStorage.getItem("lexio_diag_session_id")
            : null;
        const storedEmail =
          typeof window !== "undefined"
            ? localStorage.getItem("lexio_diag_email")
            : null;

        if (storedSessionId || storedEmail) {
          const params = new URLSearchParams();
          if (storedSessionId) params.set("session_id", storedSessionId);
          else if (storedEmail) params.set("email", storedEmail);

          const res = await fetch(
            `/api/diagnostico/resume?${params.toString()}`
          );
          if (res.ok) {
            const data = await res.json();
            if (data.session && data.session.state) {
              const resumed = deserializeState(data.session.state as SerializedState);
              if (mountedRef.current) {
                setSessionId(data.session.session_id || storedSessionId || generateSessionId());
                setEngineState(resumed);
                const q = selectNextQuestion(resumed);
                if (!q) {
                  setResult(generateResults(resumed));
                } else {
                  setCurrentQuestion(q);
                }
                setIsResuming(false);
                return;
              }
            }
          }
        }
      } catch {
        // Resume failed — start fresh
        if (mountedRef.current) {
          setIsResuming(false);
        }
      }

      // No resumable session — create fresh
      if (mountedRef.current) {
        const savedLang = typeof window !== "undefined"
          ? (localStorage.getItem("lexio_ob_lang") || "en")
          : "en";
        const fresh = createInitialState(savedLang);
        const newId = generateSessionId();
        setSessionId(newId);
        setEngineState(fresh);
        setCurrentQuestion(selectNextQuestion(fresh));
        setIsResuming(false);
        if (typeof window !== "undefined") {
          localStorage.setItem("lexio_diag_session_id", newId);
        }
      }
    })();
    return () => {
      mountedRef.current = false;
    };
  }, []);

  // ── Save state to API on each answer ───────────────────
  const saveState = useCallback(
    async (state: CartografaState) => {
      if (!sessionId) return;
      setSaving(true);
      try {
        const email =
          typeof window !== "undefined"
            ? localStorage.getItem("lexio_diag_email") || "anonymous"
            : "anonymous";
        await fetch("/api/diagnostico/save-state", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            session_id: sessionId,
            email,
            current_pillar: state.currentPillar,
            current_stage: state.currentStage,
            current_difficulty: state.pillars[state.currentPillar].currentDifficulty,
            answered_ids: Array.from(state.pillars[state.currentPillar].answeredIds),
            history: state.history,
            pillar_states: Object.fromEntries(
              (Object.keys(state.pillars) as Pillar[]).map((p) => [
                p,
                {
                  ...state.pillars[p],
                  answeredIds: Array.from(state.pillars[p].answeredIds),
                },
              ])
            ),
            timestamp: Date.now(),
          }),
        });
      } catch {
        // Silent fail — save-state is best-effort
      } finally {
        setSaving(false);
      }
    },
    [sessionId]
  );

  // ── Handle answer submission ───────────────────────────
  const handleAnswer = useCallback(
    (answer: number | string) => {
      if (!engineState || !currentQuestion) return;

      const stateClone = structuredClone(engineState) as CartografaState;
      // Reconstruct Sets from arrays (structuredClone loses them)
      for (const p of Object.keys(stateClone.pillars) as Pillar[]) {
        const ps = stateClone.pillars[p];
        if (Array.isArray(ps.answeredIds)) {
          (ps as unknown as { answeredIds: Set<string> }).answeredIds = new Set(
            ps.answeredIds as unknown as string[]
          );
        }
      }

      const { correct, updated } = processAnswer(
        stateClone,
        currentQuestion.id,
        answer
      );

      if (!updated) return;

      setSelected(answer);
      setLastCorrect(correct);
      setShowExplain(true);
      setEngineState(stateClone);

      // Save state asynchronously
      saveState(stateClone);
    },
    [engineState, currentQuestion, saveState]
  );

  // ── Move to next question ──────────────────────────────
  const handleNext = useCallback(() => {
    if (!engineState) return;

    // Clone again for next selection (engine mutates in selectNextQuestion)
    const stateClone = structuredClone(engineState) as CartografaState;
    for (const p of Object.keys(stateClone.pillars) as Pillar[]) {
      const ps = stateClone.pillars[p];
      if (Array.isArray(ps.answeredIds)) {
        (ps as unknown as { answeredIds: Set<string> }).answeredIds = new Set(
          ps.answeredIds as unknown as string[]
        );
      }
    }

    const nextQ = selectNextQuestion(stateClone);

    if (!nextQ) {
    // Diagnostic complete
    const r = generateResults(stateClone);
    setResult(r);
    setEngineState(stateClone);
    setCurrentQuestion(null);
    // Signal onboarding flow that Cartografa is done
    if (typeof window !== "undefined") {
    localStorage.setItem("lexio_diag_complete", "true");
    try { localStorage.setItem("lexio_diag_result", JSON.stringify(r)); } catch {}
    }
    } else {
      setEngineState(stateClone);
      setCurrentQuestion(nextQ);
    }

    setSelected(null);
    setShowExplain(false);
    setLastCorrect(null);
    setOpenTextValue("");
  }, [engineState]);

  // ── Share results ──────────────────────────────────────
  const handleShare = useCallback(async () => {
    if (!result || !sessionId) return;
    try {
      const email =
        typeof window !== "undefined"
          ? localStorage.getItem("lexio_diag_email") || ""
          : "";
      const res = await fetch("/api/diagnostico/share", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          session_id: sessionId,
          email,
          ...result,
        }),
      });
      if (res.ok) {
        const data = await res.json();
        setShareToken(data.share_token || null);
      }
    } catch {
      // Best-effort
    }
  }, [result, sessionId]);

  // ── Loading state ──────────────────────────────────────
  if (isResuming || !engineState) {
    return (
      <div style={styles.container}>
        <div style={styles.card}>
          <p style={{ ...typography.ui, color: colors.zinc }}>
            Carregando diagnóstico...
          </p>
        </div>
      </div>
    );
  }

  // ── COMPLETE: Cartografa Report ────────────────────────
  if (result) {
    const radarScores: Record<Pillar, number> = {
      grammar: result.pillar_scores.grammar.score,
      logic: result.pillar_scores.logic.score,
      vocab: result.pillar_scores.vocab.score,
      culture: result.pillar_scores.culture.score,
      comm: result.pillar_scores.comm.score,
    };

    const showContinue = typeof window !== "undefined" && !!localStorage.getItem("lexio_ob_step");

    return (
      <div style={styles.container}>
        <div style={{ ...styles.card, maxWidth: 640 }}>
          <CartografaReport
            pillarScores={radarScores}
            overallReadiness={result.overall_readiness}
            identityCallout={result.identity_callout || ""}
            totalQuestions={result.total_questions}
            totalCorrect={result.total_correct}
            durationSeconds={result.duration_seconds}
            recommendedFocus={result.recommended_focus}
            mapData={result.map_of_ignorance}
            shareToken={shareToken}
            onShare={handleShare}
            onContinue={() => { window.location.href = "/onboarding"; }}
            showContinue={showContinue}
          />
        </div>
      </div>
    );
  }

  // ── QUESTION FLOW ──────────────────────────────────────
  if (!currentQuestion) return null;

  const stageName = getStageName(engineState.currentStage);
  const stageDesc = getStageDescription(engineState.currentStage);
  const isLikert = currentQuestion.type === "likert";
  const isOpenText = currentQuestion.type === "open-text";
  const isChoice =
    currentQuestion.type === "gap-select" ||
    currentQuestion.type === "chunk" ||
    currentQuestion.type === "scenario";

  const likertOptions = [
    "1 — Nunca percebo",
    "2 — Raramente percebo",
    "3 — Às vezes percebo",
    "4 — Geralmente percebo",
    "5 — Sempre percebo",
  ];

  return (
    <div style={styles.container}>
      <div style={styles.card}>
        {/* Stage indicator */}
        <p style={styles.stageIndicator}>
          Stage {engineState.currentStage} of 5 — {stageName}
        </p>
        <p style={styles.stageDescription}>{stageDesc}</p>

        {/* Progress dots */}
        <div style={styles.progressRow}>
          {[1, 2, 3, 4, 5].map((s) => (
            <div
              key={s}
              style={{
                ...styles.progressDot,
                backgroundColor:
                  s < engineState.currentStage
                    ? colors.phosphor
                    : s === engineState.currentStage
                    ? colors.phosphor
                    : colors.borderSubtle,
                opacity: s <= engineState.currentStage ? 1 : 0.4,
              }}
            />
          ))}
        </div>

        {/* Difficulty badge */}
        <div style={{ marginBottom: spacing[4] }}>
          <span style={styles.difficultyBadge}>
            Nível {currentQuestion.difficulty}
          </span>
        </div>

        {/* Question prompt */}
        <h2 style={styles.prompt}>{currentQuestion.prompt}</h2>

        {/* Response options */}
        {isLikert && (
          <div style={styles.optionsColumn}>
            {likertOptions.map((opt, i) => {
              const value = i + 1;
              const isSelected = selected === value;
              return (
                <button
                  key={i}
                  onClick={() => handleAnswer(value)}
                  style={{
                    ...styles.optionBtn,
                    ...(isSelected ? styles.optionSelected : {}),
                  }}
                  disabled={selected !== null}
                >
                  {opt}
                </button>
              );
            })}
          </div>
        )}

        {isChoice && currentQuestion.options && (
          <div style={styles.optionsColumn}>
            {currentQuestion.options.map((opt, i) => {
              const isSelected = selected === i;
              return (
                <button
                  key={i}
                  onClick={() => handleAnswer(i)}
                  style={{
                    ...styles.optionBtn,
                    ...(isSelected ? styles.optionSelected : {}),
                  }}
                  disabled={selected !== null}
                >
                  {opt}
                </button>
              );
            })}
          </div>
        )}

        {isOpenText && (
          <div style={{ marginBottom: spacing[4] }}>
            <textarea
              value={openTextValue}
              onChange={(e) => setOpenTextValue(e.target.value)}
              placeholder="Escreva sua resposta em inglês..."
              style={styles.textArea}
              disabled={selected !== null}
              rows={4}
            />
            {selected === null && (
              <button
                style={{
                  ...styles.primaryBtn,
                  marginTop: spacing[3],
                  opacity: openTextValue.trim().length > 0 ? 1 : 0.4,
                }}
                onClick={() => {
                  if (openTextValue.trim().length > 0) {
                    handleAnswer(openTextValue.trim());
                  }
                }}
                disabled={openTextValue.trim().length === 0}
              >
                Enviar
              </button>
            )}
          </div>
        )}

        {/* Explanation after answer */}
        {showExplain && (
          <div style={styles.explanationBox}>
            <p
              style={{
                ...typography.ui,
                color: lastCorrect ? colors.phosphor : colors.crimson,
                marginBottom: spacing[2],
              }}
            >
              {lastCorrect ? "✓ Correto" : "✗ Incorreto"}
            </p>
            <p style={styles.explanationText}>{currentQuestion.whyExplanation}</p>
          </div>
        )}

        {/* Next / Skip buttons */}
        {selected !== null && (
          <button style={styles.primaryBtn} onClick={handleNext}>
            Próxima
          </button>
        )}
        {selected === null && !isOpenText && (
          <button style={styles.skipBtn} onClick={handleNext}>
            Pular
          </button>
        )}

        {/* Saving indicator */}
        {saving && (
          <p style={{ ...typography.caption, color: colors.zinc, marginTop: spacing[2] }}>
            Salvando...
          </p>
        )}
      </div>
    </div>
  );
}

// ─── STAGE HELPER ──────────────────────────────────────────
// Duplicated from adaptive-engine internals to avoid exporting
function getStageForPillar(pillar: Pillar): 1 | 2 | 3 | 4 | 5 {
  const map: Record<Pillar, 1 | 2 | 3 | 4 | 5> = {
    grammar: 1,
    logic: 2,
    vocab: 3,
    culture: 4,
    comm: 5,
  };
  return map[pillar];
}

// ─── STYLES ────────────────────────────────────────────────
const styles: Record<string, React.CSSProperties> = {
  container: {
    minHeight: "100vh",
    backgroundColor: colors.obsidian,
    color: colors.ivory,
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    padding: `${spacing[6]}px ${spacing[4]}px`,
    fontFamily: typography.body.fontFamily,
  },
  card: {
    backgroundColor: colors.surface,
    borderRadius: radius.card,
    padding: spacing[8],
    maxWidth: 560,
    width: "100%",
  },
  stageIndicator: {
    ...typography.ui,
    color: colors.zinc,
    marginBottom: spacing[1],
  },
  stageDescription: {
    ...typography.caption,
    color: colors.zinc,
    marginBottom: spacing[4],
  },
  progressRow: {
    display: "flex",
    gap: spacing[2],
    marginBottom: spacing[4],
  },
  progressDot: {
    width: 32,
    height: 4,
    borderRadius: 2,
    transition: `all ${duration.normal}ms ease`,
  },
  difficultyBadge: {
    ...typography.caption,
    color: colors.amber,
    backgroundColor: "rgba(255,149,0,0.12)",
    padding: `${spacing[1]}px ${spacing[3]}px`,
    borderRadius: radius.sm,
  },
  prompt: {
    ...typography.h1,
    fontSize: 24,
    lineHeight: "32px",
    fontWeight: 700,
    color: colors.ivory,
    marginBottom: spacing[6],
  },
  optionsColumn: {
    display: "flex",
    flexDirection: "column" as const,
    gap: spacing[2],
    marginBottom: spacing[4],
  },
  optionBtn: {
    backgroundColor: "transparent",
    border: `1px solid ${colors.borderSubtle}`,
    borderRadius: radius.btn,
    color: colors.ivory,
    cursor: "pointer",
    ...typography.body,
    padding: `${spacing[3]}px ${spacing[4]}px`,
    textAlign: "left" as const,
    transition: `all ${duration.fast}ms ease`,
  },
  optionSelected: {
    borderColor: colors.phosphor,
    backgroundColor: "rgba(0,255,136,0.08)",
    color: colors.phosphor,
  },
  textArea: {
    width: "100%",
    backgroundColor: "transparent",
    border: `1px solid ${colors.borderSubtle}`,
    borderRadius: radius.btn,
    color: colors.ivory,
    ...typography.body,
    padding: spacing[3],
    resize: "vertical" as const,
    outline: "none",
  },
  explanationBox: {
    backgroundColor: "rgba(255,149,0,0.06)",
    border: `1px solid rgba(255,149,0,0.2)`,
    borderRadius: radius.btn,
    padding: spacing[4],
    marginBottom: spacing[4],
  },
  explanationText: {
    ...typography.bodyItalic,
    color: colors.amber,
    fontSize: 14,
  },
  primaryBtn: {
    backgroundColor: colors.phosphor,
    border: "none",
    borderRadius: radius.btn,
    color: colors.obsidian,
    cursor: "pointer",
    ...typography.ui,
    fontWeight: 700,
    padding: `${spacing[3]}px ${spacing[6]}px`,
    transition: `opacity ${duration.fast}ms ease`,
  },
  skipBtn: {
    backgroundColor: "transparent",
    border: `1px solid ${colors.zinc}`,
    borderRadius: radius.btn,
    color: colors.zinc,
    cursor: "pointer",
    ...typography.ui,
    padding: `${spacing[3]}px ${spacing[6]}px`,
  },
  // Report styles
  badgeContainer: {
    display: "flex",
    justifyContent: "center",
    marginBottom: spacing[4],
  },
  badge: {
    ...typography.ui,
    fontSize: 16,
    fontWeight: 700,
    padding: `${spacing[2]}px ${spacing[6]}px`,
    borderRadius: radius.full,
  },
  identityCallout: {
    ...typography.bodyItalic,
    fontSize: 18,
    lineHeight: "28px",
    textAlign: "center" as const,
    color: colors.ivory,
    marginBottom: spacing[6],
  },
  statsRow: {
    display: "flex",
    justifyContent: "center",
    gap: spacing[8],
    marginBottom: spacing[4],
  },
  stat: {
    display: "flex",
    flexDirection: "column" as const,
    alignItems: "center" as const,
  },
  statValue: {
    ...typography.h1,
    fontSize: 28,
    lineHeight: "36px",
    color: colors.ivory,
  },
  statLabel: {
    ...typography.caption,
    color: colors.zinc,
  },
  focusChip: {
    ...typography.caption,
    color: colors.phosphor,
    backgroundColor: "rgba(0,255,136,0.1)",
    padding: `${spacing[1]}px ${spacing[3]}px`,
    borderRadius: radius.sm,
  },
};
