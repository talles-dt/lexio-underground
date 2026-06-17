"use client";

import React, { useState, useEffect, useCallback, useRef } from "react";
import { colors, spacing, radius, typography, duration } from "@/theme/tokens";
import { useSessionTracker } from "@/lib/sessionTracker";

/* ------------------------------------------------------------------ */
/*  Types                                                              */
/* ------------------------------------------------------------------ */

type DeepPhase = "checkin" | "input" | "processing" | "production" | "palace" | "complete";

interface ChallengeNode {
  id: string;
  pillar: string;
  description: string;
  severity: "high" | "medium" | "low";
}

interface DeepSessionState {
  phase: DeepPhase;
  phaseStart: number;
  challengeNode: ChallengeNode | null;
  atomsCompleted: number;
  tasksCompleted: number;
  itemsPalaced: number;
  sessionStart: number;
}

/* ------------------------------------------------------------------ */
/*  Phase config                                                       */
/* ------------------------------------------------------------------ */

const PHASE_ORDER: DeepPhase[] = ["checkin", "input", "processing", "production", "palace", "complete"];

const PHASE_LABELS: Record<DeepPhase, string> = {
  checkin: "Map Check-In",
  input: "Comprehensible Input",
  processing: "Active Processing",
  production: "Production",
  palace: "Palace Integration",
  complete: "Session Complete",
};

const PHASE_DURATIONS: Record<DeepPhase, number> = {
  checkin: 5 * 60 * 1000,      // 5 min
  input: 12 * 60 * 1000,       // 10-15 min (12 average)
  processing: 10 * 60 * 1000,  // 10 min
  production: 10 * 60 * 1000,  // 10 min
  palace: 5 * 60 * 1000,       // 5 min
  complete: 0,
};

const PHASE_COLORS: Record<DeepPhase, string> = {
  checkin: colors.crimson,
  input: colors.phosphor,
  processing: colors.amber,
  production: colors.violet,
  palace: "#22C55E",
  complete: colors.phosphor,
};

/* ------------------------------------------------------------------ */
/*  Stub data for demo                                                 */
/* ------------------------------------------------------------------ */

const DEMO_NODES: ChallengeNode[] = [
  { id: "n1", pillar: "grammar", description: "Subjunctive mood in subordinate clauses", severity: "high" },
  { id: "n2", pillar: "vocab", description: "Falsos cognatos: atualmente ≠ actually", severity: "medium" },
  { id: "n3", pillar: "logic", description: "Verb aspect: perfective vs imperfective", severity: "low" },
];

const DEMO_ATOMS = [
  { id: "a1", text: "Se eu tivesse sabido, teria ido.", translation: "If I had known, I would have gone.", pillar: "grammar" },
  { id: "a2", text: "Ela atualmente mora em São Paulo.", translation: "She currently lives in São Paulo.", pillar: "vocab" },
  { id: "a3", text: "Ele leu o livro ontem.", translation: "He read (completed) the book yesterday.", pillar: "logic" },
];

const DEMO_TASKS = [
  { id: "t1", instruction: "Transform to subjunctive: 'Eu quero que ela ___ (ir)'", answer: "vá", type: "grammar" },
  { id: "t2", instruction: "Explain why 'atualmente' ≠ 'actually'. What does each mean?", answer: "", type: "logic" },
  { id: "t3", instruction: "Identify the chunk: 'Não vejo a hora de'", answer: "look forward to", type: "vocab" },
];

const DEMO_PRODUCTION = [
  { id: "p1", prompt: "Speak: Describe your morning routine using at least 3 verbs in the preterite.", type: "speak" },
  { id: "p2", prompt: "Write: A short email (4-5 sentences) declining an invitation politely.", type: "write" },
  { id: "p3", prompt: "Translate from memory: 'I wish I had more time to study.'", answer: "Eu queria ter mais tempo para estudar.", type: "translate" },
];

/* ------------------------------------------------------------------ */
/*  Timer hook                                                         */
/* ------------------------------------------------------------------ */

function useElapsedClock(running: boolean) {
  const [elapsed, setElapsed] = useState(0);
  const startRef = useRef(Date.now());

  useEffect(() => {
    if (!running) {
      setElapsed(0);
      return;
    }
    startRef.current = Date.now();
    const id = setInterval(() => {
      setElapsed(Date.now() - startRef.current);
    }, 1000);
    return () => clearInterval(id);
  }, [running]);

  return elapsed;
}

function formatMs(ms: number): string {
  const totalSec = Math.floor(ms / 1000);
  const min = Math.floor(totalSec / 60);
  const sec = totalSec % 60;
  return `${min}:${String(sec).padStart(2, "0")}`;
}

/* ------------------------------------------------------------------ */
/*  Phase progress bar                                                 */
/* ------------------------------------------------------------------ */

function PhaseProgress({ phase, elapsed }: { phase: DeepPhase; elapsed: number }) {
  if (phase === "complete") return null;
  const maxMs = PHASE_DURATIONS[phase];
  const pct = maxMs > 0 ? Math.min(100, (elapsed / maxMs) * 100) : 0;

  return (
    <div style={{ marginBottom: spacing[6] }}>
      <div style={{
        height: 3,
        backgroundColor: colors.borderSubtle,
        borderRadius: 2,
        overflow: "hidden",
      }}>
        <div style={{
          height: "100%",
          width: `${pct}%`,
          backgroundColor: PHASE_COLORS[phase],
          transition: "width 1s linear",
        }} />
      </div>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/*  Main Deep Mode page                                                */
/* ------------------------------------------------------------------ */

export default function DeepPage() {
  const [session, setSession] = useState<DeepSessionState>({
    phase: "checkin",
    phaseStart: Date.now(),
    challengeNode: null,
    atomsCompleted: 0,
    tasksCompleted: 0,
    itemsPalaced: 0,
    sessionStart: Date.now(),
  });

  const { startSession } = useSessionTracker();
  const trackerRef = useRef<ReturnType<typeof startSession> | null>(null);
  const [sessionLogged, setSessionLogged] = useState(false);

  // Start tracker on mount
  useEffect(() => {
    trackerRef.current = startSession();
  }, [startSession]);

  // Log session event on completion
  useEffect(() => {
    if (session.phase === "complete" && trackerRef.current && !sessionLogged) {
      setSessionLogged(true);
      const duration = trackerRef.current.elapsed();
      trackerRef.current.end({
        session_type: "deep",
        items_covered: session.atomsCompleted + session.tasksCompleted,
        completed_flag: true,
        pillar: session.challengeNode?.pillar || undefined,
        metadata: {
          atoms_completed: session.atomsCompleted,
          tasks_completed: session.tasksCompleted,
          items_palaced: session.itemsPalaced,
          duration_seconds: duration,
        },
      });
    }
  }, [session.phase, sessionLogged, session.atomsCompleted, session.tasksCompleted, session.itemsPalaced, session.challengeNode]);

  const [selectedNode, setSelectedNode] = useState<string | null>(null);
  const [taskInput, setTaskInput] = useState("");
  const [productionInput, setProductionInput] = useState("");
  const [showArrival, setShowArrival] = useState(true);

  const elapsed = useElapsedClock(session.phase !== "complete");

  // Arrival screen timeout
  useEffect(() => {
    const t = setTimeout(() => setShowArrival(false), 1500);
    return () => clearTimeout(t);
  }, []);

  const advancePhase = useCallback(() => {
    const idx = PHASE_ORDER.indexOf(session.phase);
    const next = PHASE_ORDER[idx + 1] as DeepPhase | undefined;
    if (next) {
      setSession((prev) => ({ ...prev, phase: next, phaseStart: Date.now() }));
    }
  }, [session.phase]);

  const phaseIdx = PHASE_ORDER.indexOf(session.phase);
  const totalPhases = PHASE_ORDER.length - 1; // exclude "complete"

  // ─── Arrival screen ──────────────────────────────────────
  if (showArrival) {
    return (
      <div style={styles.container}>
        <div style={{ textAlign: "center", paddingTop: "30vh" }}>
          <div style={{
            fontFamily: typography.display.fontFamily,
            fontSize: 48,
            color: colors.phosphor,
            opacity: 0.8,
            animation: "deep-pulse 800ms ease-out",
          }}>
            ◉
          </div>
          <h1 style={styles.title}>Deep Mode</h1>
          <p style={{ ...styles.subtitle, color: colors.zinc }}>
            Entering your full session…
          </p>
        </div>
        <style>{`
          @keyframes deep-pulse {
            0% { opacity: 0; transform: scale(0.8); }
            60% { opacity: 1; transform: scale(1.1); }
            100% { opacity: 0.8; transform: scale(1); }
          }
        `}</style>
      </div>
    );
  }

  // ─── Complete screen ────────────────────────────────────
  if (session.phase === "complete") {
    return (
      <div style={styles.container}>
        <div style={styles.card}>
          <div style={{ textAlign: "center", color: colors.phosphor, fontSize: 40, marginBottom: spacing[4] }}>◉</div>
          <h1 style={{ ...styles.title, fontSize: 28 }}>Session Complete</h1>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: spacing[4], marginTop: spacing[6], marginBottom: spacing[6] }}>
            <Stat label="Atoms" value={String(session.atomsCompleted)} color={colors.phosphor} />
            <Stat label="Tasks" value={String(session.tasksCompleted)} color={colors.amber} />
            <Stat label="Palaced" value={String(session.itemsPalaced)} color="#22C55E" />
            <Stat label="Duration" value={formatMs(Date.now() - session.sessionStart)} color={colors.zinc} />
          </div>
          <a href="/" style={{
            display: "inline-block",
            backgroundColor: colors.phosphor,
            color: colors.obsidian,
            fontWeight: 600,
            padding: "12px 28px",
            borderRadius: radius.btn,
            textDecoration: "none",
            fontFamily: typography.ui.fontFamily,
            fontSize: typography.ui.fontSize,
          }}>
            Return Home
          </a>
        </div>
      </div>
    );
  }

  // ─── Phase header (always visible) ───────────────────────
  return (
    <div style={styles.container}>
      {/* Top bar: nav + timer */}
      <nav style={styles.navbar}>
        <a href="/" style={styles.navLink}>Exit</a>
        <span style={{ ...styles.navTimer, color: PHASE_COLORS[session.phase] }}>
          {formatMs(elapsed)}
        </span>
      </nav>

      {/* Phase breadcrumb */}
      <div style={styles.breadcrumb}>
        {PHASE_ORDER.slice(0, -1).map((p, i) => (
          <span
            key={p}
            style={{
              fontSize: 11,
              fontFamily: typography.caption.fontFamily,
              textTransform: "uppercase" as const,
              letterSpacing: 1.5,
              color: i < phaseIdx ? colors.zinc : i === phaseIdx ? PHASE_COLORS[p] : colors.borderSubtle,
              fontWeight: i === phaseIdx ? 600 : 400,
              transition: `color ${duration.normal}ms ease`,
            }}
          >
            {i + 1}. {PHASE_LABELS[p]}
          </span>
        ))}
      </div>

      <PhaseProgress phase={session.phase} elapsed={elapsed} />

      <main style={styles.main}>
        {/* ── Phase 1: Map Check-In ── */}
        {session.phase === "checkin" && (
          <div style={styles.card}>
            <h2 style={{ ...styles.phaseTitle, color: PHASE_COLORS.checkin }}>
              Map Check-In
            </h2>
            <p style={styles.phaseDesc}>
              Your Map of Ignorance today. Choose a challenge node to focus this session.
            </p>
            <div style={{ display: "flex", flexDirection: "column", gap: spacing[3], marginTop: spacing[4] }}>
              {DEMO_NODES.map((node) => (
                <button
                  key={node.id}
                  type="button"
                  onClick={() => setSelectedNode(node.id)}
                  style={{
                    ...styles.nodeBtn,
                    borderColor: selectedNode === node.id ? (PHASE_COLORS as Record<string,string>)[node.pillar] || colors.zinc : colors.borderSubtle,
                    backgroundColor: selectedNode === node.id ? `${(PHASE_COLORS as Record<string,string>)[node.pillar] || colors.zinc}10` : "transparent",
                  }}
                >
                  <span style={{
                    display: "inline-block",
                    width: 8,
                    height: 8,
                    borderRadius: "50%",
                    backgroundColor: node.severity === "high" ? colors.crimson : node.severity === "medium" ? colors.amber : colors.phosphor,
                    marginRight: spacing[2],
                  }} />
                  <span style={{ flex: 1, textAlign: "left" as const }}>
                    <span style={{ color: colors.zinc, fontSize: typography.caption.fontSize, textTransform: "uppercase" as const }}>
                      {node.pillar}
                    </span>
                    <br />
                    <span style={{ color: colors.ivory }}>{node.description}</span>
                  </span>
                </button>
              ))}
            </div>
            <button
              type="button"
              disabled={!selectedNode}
              onClick={() => {
                setSession((prev) => ({
                  ...prev,
                  challengeNode: DEMO_NODES.find((n) => n.id === selectedNode) || null,
                }));
                advancePhase();
              }}
              style={{
                ...styles.advanceBtn,
                opacity: selectedNode ? 1 : 0.3,
                backgroundColor: PHASE_COLORS.checkin,
              }}
            >
              Begin Session →
            </button>
          </div>
        )}

        {/* ── Phase 2: Comprehensible Input ── */}
        {session.phase === "input" && (
          <div style={styles.card}>
            <h2 style={{ ...styles.phaseTitle, color: PHASE_COLORS.input }}>
              Comprehensible Input
            </h2>
            <p style={styles.phaseDesc}>
              Immersive content at i+1. Read, absorb, and place atoms in your palace.
            </p>
            <div style={{ display: "flex", flexDirection: "column", gap: spacing[6], marginTop: spacing[6] }}>
              {DEMO_ATOMS.map((atom) => (
                <div key={atom.id} style={{
                  padding: spacing[4],
                  backgroundColor: colors.surface,
                  borderRadius: radius.card,
                  border: `1px solid ${colors.borderSubtle}`,
                }}>
                  <p style={{
                    fontFamily: typography.body.fontFamily,
                    fontSize: 18,
                    color: colors.ivory,
                    margin: 0,
                    paddingBottom: spacing[2],
                    lineHeight: 1.5,
                  }}>
                    {atom.text}
                  </p>
                  <p style={{
                    fontFamily: typography.bodyItalic.fontFamily,
                    fontStyle: typography.bodyItalic.fontStyle,
                    fontSize: 14,
                    color: colors.zinc,
                    margin: 0,
                    paddingBottom: spacing[3],
                  }}>
                    {atom.translation}
                  </p>
                  <button
                    type="button"
                    onClick={() => setSession((prev) => ({ ...prev, atomsCompleted: prev.atomsCompleted + 1 }))}
                    style={{
                      ...styles.miniBtn,
                      borderColor: PHASE_COLORS.input,
                      color: PHASE_COLORS.input,
                    }}
                  >
                    ◇ Place in palace ({session.atomsCompleted} placed)
                  </button>
                </div>
              ))}
            </div>
            <button
              type="button"
              onClick={advancePhase}
              style={{ ...styles.advanceBtn, backgroundColor: PHASE_COLORS.input }}
            >
              Move to Processing →
            </button>
          </div>
        )}

        {/* ── Phase 3: Active Processing ── */}
        {session.phase === "processing" && (
          <div style={styles.card}>
            <h2 style={{ ...styles.phaseTitle, color: PHASE_COLORS.processing }}>
              Active Processing
            </h2>
            <p style={styles.phaseDesc}>
              Interleaved tasks. No two tasks are the same type in a row.
            </p>
            <div style={{ display: "flex", flexDirection: "column", gap: spacing[6], marginTop: spacing[6] }}>
              {DEMO_TASKS.map((task) => (
                <div key={task.id} style={{
                  padding: spacing[4],
                  backgroundColor: colors.surface,
                  borderRadius: radius.card,
                  border: `1px solid ${colors.borderSubtle}`,
                }}>
                  <span style={{
                    display: "inline-block",
                    fontSize: typography.caption.fontSize,
                    fontFamily: typography.caption.fontFamily,
                    textTransform: "uppercase" as const,
                    letterSpacing: 1.5,
                    color: (PHASE_COLORS as Record<string,string>)[task.type] || colors.zinc,
                    marginBottom: spacing[2],
                  }}>
                    {task.type}
                  </span>
                  <p style={{
                    fontFamily: typography.body.fontFamily,
                    fontSize: 16,
                    color: colors.ivory,
                    margin: 0,
                    paddingBottom: spacing[3],
                    lineHeight: 1.5,
                  }}>
                    {task.instruction}
                  </p>
                  <textarea
                    value={taskInput}
                    onChange={(e) => setTaskInput(e.target.value)}
                    placeholder="Your answer…"
                    style={{
                      width: "100%",
                      minHeight: 60,
                      backgroundColor: colors.obsidian,
                      border: `1px solid ${colors.borderSubtle}`,
                      borderRadius: radius.btn,
                      color: colors.ivory,
                      padding: spacing[3],
                      fontFamily: typography.body.fontFamily,
                      fontSize: typography.body.fontSize,
                      resize: "vertical" as const,
                    }}
                  />
                  <button
                    type="button"
                    onClick={() => {
                      setSession((prev) => ({ ...prev, tasksCompleted: prev.tasksCompleted + 1 }));
                      setTaskInput("");
                    }}
                    style={{
                      ...styles.miniBtn,
                      borderColor: PHASE_COLORS.processing,
                      color: PHASE_COLORS.processing,
                      marginTop: spacing[2],
                    }}
                  >
                    Submit task
                  </button>
                </div>
              ))}
            </div>
            <button
              type="button"
              onClick={advancePhase}
              style={{ ...styles.advanceBtn, backgroundColor: PHASE_COLORS.processing }}
            >
              Move to Production →
            </button>
          </div>
        )}

        {/* ── Phase 4: Production ── */}
        {session.phase === "production" && (
          <div style={styles.card}>
            <h2 style={{ ...styles.phaseTitle, color: PHASE_COLORS.production }}>
              Production
            </h2>
            <p style={styles.phaseDesc}>
              Forced output: speak, write, or translate from memory.
            </p>
            <div style={{ display: "flex", flexDirection: "column", gap: spacing[6], marginTop: spacing[6] }}>
              {DEMO_PRODUCTION.map((prod) => (
                <div key={prod.id} style={{
                  padding: spacing[4],
                  backgroundColor: colors.surface,
                  borderRadius: radius.card,
                  border: `1px solid ${colors.borderSubtle}`,
                }}>
                  <span style={{
                    display: "inline-block",
                    fontSize: typography.caption.fontSize,
                    fontFamily: typography.caption.fontFamily,
                    textTransform: "uppercase" as const,
                    letterSpacing: 1.5,
                    color: colors.violet,
                    marginBottom: spacing[2],
                  }}>
                    {prod.type}
                  </span>
                  <p style={{
                    fontFamily: typography.body.fontFamily,
                    fontSize: 16,
                    color: colors.ivory,
                    margin: 0,
                    paddingBottom: spacing[3],
                    lineHeight: 1.5,
                  }}>
                    {prod.prompt}
                  </p>
                  {prod.type !== "speak" ? (
                    <textarea
                      value={productionInput}
                      onChange={(e) => setProductionInput(e.target.value)}
                      placeholder="Your production…"
                      style={{
                        width: "100%",
                        minHeight: 80,
                        backgroundColor: colors.obsidian,
                        border: `1px solid ${colors.borderSubtle}`,
                        borderRadius: radius.btn,
                        color: colors.ivory,
                        padding: spacing[3],
                        fontFamily: typography.body.fontFamily,
                        fontSize: typography.body.fontSize,
                        resize: "vertical" as const,
                      }}
                    />
                  ) : (
                    <div style={{
                      padding: spacing[4],
                      textAlign: "center" as const,
                      border: `1px dashed ${colors.violet}`,
                      borderRadius: radius.card,
                      color: colors.violet,
                      fontFamily: typography.ui.fontFamily,
                      fontSize: 14,
                    }}>
                      🎤 Tap to start recording
                    </div>
                  )}
                  <button
                    type="button"
                    onClick={() => {
                      setSession((prev) => ({ ...prev, tasksCompleted: prev.tasksCompleted + 1 }));
                      setProductionInput("");
                    }}
                    style={{
                      ...styles.miniBtn,
                      borderColor: colors.violet,
                      color: colors.violet,
                      marginTop: spacing[2],
                    }}
                  >
                    Mark complete
                  </button>
                </div>
              ))}
            </div>
            <button
              type="button"
              onClick={advancePhase}
              style={{ ...styles.advanceBtn, backgroundColor: PHASE_COLORS.production }}
            >
              Move to Palace →
            </button>
          </div>
        )}

        {/* ── Phase 5: Palace Integration ── */}
        {session.phase === "palace" && (
          <div style={styles.card}>
            <h2 style={{ ...styles.phaseTitle, color: PHASE_COLORS.palace }}>
              Palace Integration
            </h2>
            <p style={styles.phaseDesc}>
              Review and place new items. Check in with yourself.
            </p>

            <div style={{ marginTop: spacing[6], marginBottom: spacing[6] }}>
              <p style={{
                fontFamily: typography.body.fontFamily,
                fontSize: 16,
                color: colors.ivory,
                marginBottom: spacing[4],
              }}>
                Items placed this session: <strong style={{ color: "#22C55E" }}>{session.atomsCompleted}</strong>
              </p>

              <button
                type="button"
                onClick={() => setSession((prev) => ({ ...prev, itemsPalaced: prev.itemsPalaced + 1 }))}
                style={{
                  ...styles.miniBtn,
                  borderColor: "#22C55E",
                  color: "#22C55E",
                }}
              >
                ◇ Place another item
              </button>
            </div>

            {/* Affective filter check */}
            <div style={{
              padding: spacing[4],
              backgroundColor: `${colors.amber}08`,
              border: `1px solid ${colors.borderSubtle}`,
              borderRadius: radius.card,
              marginBottom: spacing[6],
            }}>
              <p style={{
                fontFamily: typography.bodyItalic.fontFamily,
                fontStyle: typography.bodyItalic.fontStyle,
                fontSize: 14,
                color: colors.amber,
                margin: 0,
                paddingBottom: spacing[3],
              }}>
                Affective filter check — how do you feel right now?
              </p>
              <div style={{ display: "flex", gap: spacing[3] }}>
                {["😰", "😟", "😐", "🙂", "😌"].map((emoji, i) => (
                  <button
                    key={i}
                    type="button"
                    style={{
                      fontSize: 28,
                      background: "transparent",
                      border: "none",
                      cursor: "pointer",
                      opacity: 0.6,
                      filter: "grayscale(30%)",
                      transition: "all 200ms ease",
                    }}
                    onMouseEnter={(e) => {
                      (e.target as HTMLElement).style.opacity = "1";
                      (e.target as HTMLElement).style.filter = "none";
                      (e.target as HTMLElement).style.transform = "scale(1.2)";
                    }}
                    onMouseLeave={(e) => {
                      (e.target as HTMLElement).style.opacity = "0.6";
                      (e.target as HTMLElement).style.filter = "grayscale(30%)";
                      (e.target as HTMLElement).style.transform = "scale(1)";
                    }}
                  >
                    {emoji}
                  </button>
                ))}
              </div>
            </div>

            <button
              type="button"
              onClick={advancePhase}
              style={{ ...styles.advanceBtn, backgroundColor: "#22C55E" }}
            >
              Complete Session ✓
            </button>
          </div>
        )}
      </main>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/*  Stat widget                                                        */
/* ------------------------------------------------------------------ */

function Stat({ label, value, color }: { label: string; value: string; color: string }) {
  return (
    <div style={{ textAlign: "center" as const }}>
      <div style={{
        fontFamily: typography.display.fontFamily,
        fontSize: 32,
        color,
        lineHeight: "32px",
        marginBottom: spacing[1],
      }}>
        {value}
      </div>
      <div style={{
        fontFamily: typography.caption.fontFamily,
        fontSize: typography.caption.fontSize,
        color: colors.zinc,
        textTransform: "uppercase" as const,
        letterSpacing: 2,
      }}>
        {label}
      </div>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/*  Styles                                                             */
/* ------------------------------------------------------------------ */

const styles: Record<string, React.CSSProperties> = {
  container: {
    minHeight: "100vh",
    backgroundColor: colors.obsidian,
    color: colors.ivory,
    display: "flex",
    flexDirection: "column",
  },
  navbar: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    padding: spacing[4],
  },
  navLink: {
    textDecoration: "none",
    backgroundColor: "transparent",
    border: `1px solid ${colors.zinc}`,
    borderRadius: radius.btn,
    padding: "8px 16px",
    color: colors.zinc,
    fontFamily: typography.ui.fontFamily,
    fontSize: typography.ui.fontSize,
  },
  navTimer: {
    fontFamily: typography.display.fontFamily,
    fontSize: 20,
    letterSpacing: 2,
    transition: `color ${duration.normal}ms ease`,
  },
  breadcrumb: {
    display: "flex",
    justifyContent: "center",
    gap: spacing[4],
    paddingBottom: spacing[3],
    flexWrap: "wrap" as const,
  },
  main: {
    flex: 1,
    display: "flex",
    alignItems: "flex-start",
    justifyContent: "center",
    padding: spacing[4],
    paddingBottom: spacing[8],
  },
  card: {
    backgroundColor: colors.surface,
    border: `1px solid ${colors.borderSubtle}`,
    borderRadius: radius.card,
    padding: spacing[6],
    maxWidth: 560,
    width: "100%",
  },
  title: {
    fontFamily: typography.display.fontFamily,
    fontSize: typography.display.fontSize,
    lineHeight: typography.display.lineHeight,
    color: colors.ivory,
    margin: 0,
    textAlign: "center" as const,
  },
  subtitle: {
    fontFamily: typography.bodyItalic.fontFamily,
    fontStyle: typography.bodyItalic.fontStyle,
    fontSize: typography.body.fontSize,
    lineHeight: typography.body.lineHeight,
    margin: 0,
    textAlign: "center" as const,
  },
  phaseTitle: {
    fontFamily: typography.h1.fontFamily,
    fontSize: typography.h1.fontSize,
    lineHeight: typography.h1.lineHeight,
    margin: 0,
    paddingBottom: spacing[2],
  },
  phaseDesc: {
    fontFamily: typography.bodyItalic.fontFamily,
    fontStyle: typography.bodyItalic.fontStyle,
    fontSize: typography.body.fontSize,
    lineHeight: typography.body.lineHeight,
    color: colors.zinc,
    margin: 0,
  },
  nodeBtn: {
    display: "flex",
    alignItems: "center",
    background: "transparent",
    border: `1px solid ${colors.borderSubtle}`,
    borderRadius: radius.btn,
    padding: `${spacing[3]}px ${spacing[4]}px`,
    color: colors.ivory,
    fontFamily: typography.ui.fontFamily,
    fontSize: typography.ui.fontSize,
    cursor: "pointer",
    textAlign: "left" as const,
    transition: `all ${duration.normal}ms ease`,
  },
  advanceBtn: {
    display: "block",
    width: "100%",
    marginTop: spacing[6],
    border: "none",
    borderRadius: radius.btn,
    padding: "14px 28px",
    color: colors.obsidian,
    fontFamily: typography.ui.fontFamily,
    fontSize: typography.ui.fontSize,
    fontWeight: 600,
    cursor: "pointer",
    transition: `opacity ${duration.normal}ms ease`,
  },
  miniBtn: {
    background: "transparent",
    border: `1px solid`,
    borderRadius: radius.btn,
    padding: "6px 14px",
    fontFamily: typography.ui.fontFamily,
    fontSize: 12,
    cursor: "pointer",
    transition: `all ${duration.normal}ms ease`,
  },
};
