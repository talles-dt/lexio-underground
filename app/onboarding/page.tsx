"use client";

import React, { useState, useEffect, useCallback } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/lib/auth";
import { colors, spacing, radius, typography, duration } from "@/theme/tokens";

// ─── STEP DEFINITIONS ───────────────────────────────────────
// The 10-step onboarding flow per lexio-vault/05-onboarding/first-time-flow.md
// Steps 5 (Cartografa) and 8 (Pulse) redirect to existing pages —
// the wizard tracks progress in localStorage and resumes on return.

type Step =
  | "landing"        // 1
  | "language"       // 2
  | "preamble"       // 3
  | "email"          // 4
  | "cartografa"     // 5 → redirects to /diagnostico
  | "report"         // 6 → shown after /diagnostico completion
  | "roadmap"        // 7
  | "pulse"          // 8 → redirects to /pulse
  | "palace-tour"    // 9
  | "account";       // 10

const STEP_ORDER: Step[] = [
  "landing", "language", "preamble", "email", "cartografa",
  "report", "roadmap", "pulse", "palace-tour", "account",
];

const STEP_TITLES: Record<Step, string> = {
  landing: "",
  language: "Choose your language",
  preamble: "Your Cartografa",
  email: "Save your progress",
  cartografa: "Cartografa",
  report: "Your Map of Ignorance",
  roadmap: "Your first month",
  pulse: "First Pulse",
  "palace-tour": "Your Palace",
  account: "Create your account",
};

// ─── LOCAL STORAGE KEYS ─────────────────────────────────────
const LS_ONBOARDING_STEP = "lexio_ob_step";
const LS_ONBOARDING_EMAIL = "lexio_ob_email";
const LS_ONBOARDING_LANG = "lexio_ob_lang";
const LS_DIAG_EMAIL = "lexio_diag_email";
const LS_DIAG_COMPLETE = "lexio_diag_complete";
const LS_DIAG_RESULT = "lexio_diag_result";
const LS_PULSE_COMPLETE = "lexio_pulse_complete";

// ─── STYLES ─────────────────────────────────────────────────
const s: Record<string, React.CSSProperties> = {
  container: {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
    minHeight: "100vh",
    backgroundColor: colors.obsidian,
    padding: spacing[4],
  },
  card: {
    backgroundColor: colors.surface,
    borderRadius: radius.card,
    padding: spacing[8],
    maxWidth: 520,
    width: "100%",
    textAlign: "center" as const,
  },
  stepIndicator: {
    display: "flex",
    gap: spacing[2],
    justifyContent: "center",
    marginBottom: spacing[8],
  },
  dot: {
    width: 8,
    height: 8,
    borderRadius: "50%",
    backgroundColor: colors.zinc,
    transition: `all ${duration.normal}ms ease`,
  },
  dotActive: {
    backgroundColor: colors.phosphor,
    boxShadow: `0 0 8px ${colors.phosphor}40`,
    transform: "scale(1.3)",
  },
  dotDone: {
    backgroundColor: colors.phosphor,
  },
  title: {
    ...typography.h1,
    color: colors.phosphor,
    fontWeight: 700,
    marginBottom: spacing[2],
  },
  subtitle: {
    ...typography.body,
    color: colors.zinc,
    marginBottom: spacing[8],
  },
  input: {
    width: "100%",
    padding: spacing[3],
    borderRadius: radius.md,
    border: `1px solid ${colors.zinc}`,
    backgroundColor: colors.obsidian,
    color: colors.ivory,
    fontSize: 16,
    marginBottom: spacing[4],
    boxSizing: "border-box" as const,
  },
  primaryBtn: {
    backgroundColor: colors.phosphor,
    color: colors.obsidian,
    borderRadius: radius.btn,
    padding: `${spacing[3]}px ${spacing[8]}px`,
    border: "none",
    cursor: "pointer",
    fontSize: 16,
    fontWeight: 600,
    width: "100%",
  },
  secondaryBtn: {
    backgroundColor: "transparent",
    color: colors.zinc,
    borderRadius: radius.btn,
    padding: `${spacing[3]}px ${spacing[8]}px`,
    border: `1px solid ${colors.zinc}`,
    cursor: "pointer",
    fontSize: 14,
    width: "100%",
    marginTop: spacing[3],
  },
  langGrid: {
    display: "grid",
    gridTemplateColumns: "1fr 1fr",
    gap: spacing[3],
    marginBottom: spacing[6],
    width: "100%",
  },
  langCard: {
    padding: spacing[4],
    borderRadius: radius.card,
    border: `2px solid ${colors.zinc}`,
    backgroundColor: colors.obsidian,
    cursor: "pointer",
    transition: `border-color ${duration.normal}ms ease, box-shadow ${duration.normal}ms ease`,
  },
  langCardSelected: {
    borderColor: colors.phosphor,
    boxShadow: `0 0 12px ${colors.phosphor}30`,
  },
  langCardDisabled: {
    opacity: 0.35,
    cursor: "not-allowed",
  },
  langName: {
    ...typography.ui,
    color: colors.ivory,
    fontWeight: 600,
    display: "block",
  },
  langSub: {
    ...typography.caption,
    color: colors.zinc,
    marginTop: spacing[1],
    display: "block",
  },
  identityCallout: {
    ...typography.h2,
    color: colors.amber,
    fontStyle: "italic",
    marginBottom: spacing[6],
  },
  focusChips: {
    display: "flex",
    gap: spacing[2],
    flexWrap: "wrap",
    justifyContent: "center",
    marginBottom: spacing[6],
  },
  focusChip: {
    padding: `${spacing[2]}px ${spacing[4]}px`,
    borderRadius: radius.full,
    backgroundColor: `${colors.crimson}20`,
    color: colors.crimson,
    fontSize: 14,
    fontWeight: 500,
  },
  roomList: {
    display: "flex",
    flexDirection: "column",
    gap: spacing[3],
    marginBottom: spacing[6],
    textAlign: "left" as const,
    width: "100%",
  },
  roomItem: {
    display: "flex",
    alignItems: "center",
    gap: spacing[3],
    padding: spacing[3],
    borderRadius: radius.md,
    backgroundColor: colors.obsidian,
  },
  roomIcon: {
    fontSize: 24,
    flexShrink: 0,
  },
  roomInfo: {
    flex: 1,
  },
  roomName: {
    ...typography.ui,
    color: colors.ivory,
    fontWeight: 600,
    display: "block",
  },
  roomDesc: {
    ...typography.caption,
    color: colors.zinc,
    marginTop: 2,
    display: "block",
  },
  locked: {
    ...typography.caption,
    color: colors.zinc,
    fontSize: 12,
    opacity: 0.6,
  },
  signupForm: {
    textAlign: "left" as const,
    width: "100%",
  },
  label: {
    ...typography.caption,
    color: colors.zinc,
    marginBottom: spacing[1],
    display: "block",
  },
  checkboxRow: {
    display: "flex",
    alignItems: "center",
    gap: spacing[2],
    marginBottom: spacing[4],
    cursor: "pointer",
  },
  checkbox: {
    width: 20,
    height: 20,
    borderRadius: radius.sm,
    border: `1px solid ${colors.zinc}`,
    flexShrink: 0,
  },
  checkboxChecked: {
    backgroundColor: colors.phosphor,
    borderColor: colors.phosphor,
  },
  error: {
    color: colors.crimson,
    ...typography.caption,
    marginBottom: spacing[3],
    textAlign: "center" as const,
  },
  palaceAnimContainer: {
    position: "relative" as const,
    width: "100%",
    height: 300,
    marginBottom: spacing[6],
    overflow: "hidden",
    borderRadius: radius.card,
    backgroundColor: colors.obsidian,
  },
  palaceGrid: {
    position: "absolute" as const,
    inset: 0,
    opacity: 0,
    transition: `opacity 1.5s ease`,
  },
  palaceGridVisible: {
    opacity: 0.15,
  },
  palaceRooms: {
    position: "absolute" as const,
    inset: 0,
    opacity: 0,
    transition: `opacity 2s ease 1.5s`,
  },
  palaceRoomsVisible: {
    opacity: 1,
  },
  pulseTeaser: {
    ...typography.body,
    color: colors.onSurfaceVariant,
    marginBottom: spacing[6],
    maxWidth: 400,
    margin: "0 auto",
  },
};

// ─── LANGUAGES ──────────────────────────────────────────────
const LANGUAGES = [
  { code: "en", name: "English", sub: "Available now", available: true },
  { code: "ar", name: "العربية", sub: "Arabic — متاح", available: true },
  { code: "es", name: "Español", sub: "Coming soon", available: false },
  { code: "fr", name: "Français", sub: "Coming soon", available: false },
  { code: "de", name: "Deutsch", sub: "Coming soon", available: false },
];

// ─── ROOM DATA ──────────────────────────────────────────────
const FIRST_ROOMS = [
  { name: "Grammar Hall", pillar: "grammar", icon: "🏛️", desc: "Surface → deep structure drills", locked: false },
  { name: "Logic Chamber", pillar: "logic", icon: "🔬", desc: "Pattern recognition & argument flow", locked: false },
  { name: "Vocabulary Vault", pillar: "vocab", icon: "🗝️", desc: "High-frequency word chains", locked: false },
  { name: "Culture Commons", pillar: "culture", icon: "🌍", desc: "Cultural atoms & idioms", locked: true },
  { name: "Comm Arena", pillar: "comm", icon: "🎤", desc: "Real-time conversation skills", locked: true },
];

// ─── COMPONENT ──────────────────────────────────────────────
export default function OnboardingPage() {
  const router = useRouter();
  const { signUp, signInWithGoogle, user } = useAuth();
  const [step, setStep] = useState<Step>("landing");
  const [lang, setLang] = useState("en");
  const [email, setEmail] = useState("");
  const [name, setName] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPw, setConfirmPw] = useState("");
  const [consent, setConsent] = useState(false);
  const [authError, setAuthError] = useState("");
  const [authLoading, setAuthLoading] = useState(false);
  const [palacePhase, setPalacePhase] = useState(0);
  const [diagResult, setDiagResult] = useState<any>(null);

  // ── Resume onboarding state on mount ───────────────────
  useEffect(() => {
    const savedStep = localStorage.getItem(LS_ONBOARDING_STEP) as Step | null;
    const savedEmail = localStorage.getItem(LS_ONBOARDING_EMAIL) || "";
    const savedLang = localStorage.getItem(LS_ONBOARDING_LANG) || "en";
    const savedResult = localStorage.getItem(LS_DIAG_RESULT);

    if (savedEmail) setEmail(savedEmail);
    if (savedLang) setLang(savedLang);
    if (savedResult) {
      try { setDiagResult(JSON.parse(savedResult)); } catch {}
    }

    if (savedStep) {
      const idx = STEP_ORDER.indexOf(savedStep);
      // If user completed Cartografa while away, jump to report
      if (savedStep === "cartografa" && localStorage.getItem(LS_DIAG_COMPLETE) === "true") {
        setStep("report");
      }
      // If user completed Pulse while away, jump to palace-tour
      else if (savedStep === "pulse" && localStorage.getItem(LS_PULSE_COMPLETE) === "true") {
        setStep("palace-tour");
      }
      // If user already has account, skip to appropriate step
      else if (user && (savedStep === "account" || idx >= STEP_ORDER.indexOf("account"))) {
        setStep("account"); // show "you're in" even if already authed
      }
      else if (idx >= 0) {
        setStep(savedStep);
      }
    }
  }, [user]);

  // ── Persist step changes ───────────────────────────────
  const goToStep = useCallback((next: Step) => {
    setStep(next);
    localStorage.setItem(LS_ONBOARDING_STEP, next);
  }, []);

  // ── STEP 5: Redirect to Cartografa ─────────────────────
  const startCartografa = useCallback(() => {
    localStorage.setItem(LS_DIAG_EMAIL, email);
    goToStep("cartografa");
    router.push("/diagnostico");
  }, [email, goToStep, router]);

  // ── STEP 8: Redirect to Pulse ──────────────────────────
  const startPulse = useCallback(() => {
    goToStep("pulse");
    router.push("/pulse");
  }, [goToStep, router]);

  // ── STEP 10: Account creation ──────────────────────────
  const handleSignup = useCallback(async () => {
    setAuthError("");
    if (!name.trim()) { setAuthError("Informe seu nome."); return; }
    if (password.length < 6) { setAuthError("Senha: mínimo 6 caracteres."); return; }
    if (password !== confirmPw) { setAuthError("As senhas não coincidem."); return; }
    if (!consent) { setAuthError("Concorde com os Termos para continuar."); return; }

    setAuthLoading(true);
    try {
      const { error } = await signUp(email, password, name);
      if (error) {
        setAuthError(error);
      } else {
        goToStep("account"); // will show "you're in"
      }
    } catch {
      setAuthError("Erro ao criar conta. Tente novamente.");
    } finally {
      setAuthLoading(false);
    }
  }, [email, password, confirmPw, name, consent, signUp, goToStep]);

  const handleGoogleSignup = useCallback(async () => {
    setAuthError("");
    setAuthLoading(true);
    try {
      const { error } = await signInWithGoogle();
      if (error) setAuthError(error);
    } catch {
      setAuthError("Erro com Google sign-in.");
    } finally {
      setAuthLoading(false);
    }
  }, [signInWithGoogle]);

  // ── Palace tour animation ──────────────────────────────
  useEffect(() => {
    if (step !== "palace-tour") return;
    setPalacePhase(0);
    const t1 = setTimeout(() => setPalacePhase(1), 500);   // grid fades in
    const t2 = setTimeout(() => setPalacePhase(2), 2000);   // rooms outline
    const t3 = setTimeout(() => setPalacePhase(3), 4000);   // rooms fill
    const t4 = setTimeout(() => setPalacePhase(4), 6000);   // corridors
    const t5 = setTimeout(() => setPalacePhase(5), 9000);   // doors open
    const t6 = setTimeout(() => setPalacePhase(6), 12000);  // zoom out complete
    return () => { clearTimeout(t1); clearTimeout(t2); clearTimeout(t3); clearTimeout(t4); clearTimeout(t5); clearTimeout(t6); };
  }, [step]);

  // ── Check for returning from Cartografa ─────────────────
  useEffect(() => {
    if (step !== "cartografa") return;
    // If diagnostic is complete, move to report
    if (localStorage.getItem(LS_DIAG_COMPLETE) === "true") {
      const savedResult = localStorage.getItem(LS_DIAG_RESULT);
      if (savedResult) {
        try { setDiagResult(JSON.parse(savedResult)); } catch {}
      }
      goToStep("report");
    }
  }, [step, goToStep]);

  // ── Check for returning from Pulse ──────────────────────
  useEffect(() => {
    if (step !== "pulse") return;
    if (localStorage.getItem(LS_PULSE_COMPLETE) === "true") {
      goToStep("palace-tour");
    }
  }, [step, goToStep]);

  // ── Render step indicator ───────────────────────────────
  const currentIdx = STEP_ORDER.indexOf(step);
  const renderDots = () => (
    <div style={s.stepIndicator}>
      {STEP_ORDER.map((st, i) => (
        <div
          key={st}
          style={{
            ...s.dot,
            ...(i < currentIdx ? s.dotDone : {}),
            ...(i === currentIdx ? s.dotActive : {}),
          }}
        />
      ))}
    </div>
  );

  // ── STEP 1: Landing ────────────────────────────────────
  if (step === "landing") {
    return (
      <div style={s.container}>
        <div style={s.card}>
          <h1 style={{ ...s.title, fontSize: 56, marginBottom: spacing[4] }}>
            Lexio Underground
          </h1>
          <p style={{ ...s.subtitle, fontStyle: "italic", fontSize: 20 }}>
            Map your ignorance. Master your language.
          </p>
          <button style={s.primaryBtn} onClick={() => goToStep("language")}>
            Begin your Cartografa
          </button>
        </div>
      </div>
    );
  }

  // ── STEP 2: Language Select ─────────────────────────────
  if (step === "language") {
    return (
      <div style={s.container}>
        <div style={s.card}>
          {renderDots()}
          <h2 style={s.title}>{STEP_TITLES.language}</h2>
          <p style={s.subtitle}>Select your target language</p>
          <div style={s.langGrid}>
            {LANGUAGES.map((l) => (
              <div
                key={l.code}
                style={{
                  ...s.langCard,
                  ...(lang === l.code && l.available ? s.langCardSelected : {}),
                  ...(!l.available ? s.langCardDisabled : {}),
                }}
                onClick={() => l.available && setLang(l.code)}
              >
                <span style={s.langName}>{l.name}</span>
                <span style={s.langSub}>{l.sub}</span>
              </div>
            ))}
          </div>
          <button style={s.primaryBtn} onClick={() => {
            localStorage.setItem(LS_ONBOARDING_LANG, lang);
            goToStep("preamble");
          }}>
            Continue
          </button>
        </div>
      </div>
    );
  }

  // ── STEP 3: Preamble ───────────────────────────────────
  if (step === "preamble") {
    return (
      <div style={s.container}>
        <div style={s.card}>
          {renderDots()}
          <h2 style={{ ...s.title, fontSize: 32, marginBottom: spacing[6] }}>
            Every language learner has a map of what they don&apos;t know.
          </h2>
          <p style={{ ...s.subtitle, fontSize: 18, marginBottom: spacing[4] }}>
            Today we draw yours.
          </p>
          <p style={{ ...typography.caption, color: colors.zinc, marginBottom: spacing[8] }}>
            {LANGUAGES.find((l) => l.code === lang)?.name} · 5 pillars · ~20 minutes
          </p>
          <button style={s.primaryBtn} onClick={() => goToStep("email")}>
            Begin Cartografa
          </button>
        </div>
      </div>
    );
  }

  // ── STEP 4: Email Capture ───────────────────────────────
  if (step === "email") {
    return (
      <div style={s.container}>
        <div style={s.card}>
          {renderDots()}
          <h2 style={s.title}>{STEP_TITLES.email}</h2>
          <p style={s.subtitle}>
            Save your progress as you go. No account yet — your email is just a safety net.
          </p>
          <input
            style={s.input}
            type="email"
            placeholder="your@email.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            autoComplete="off"
          />
          <p style={{ ...typography.caption, color: colors.zinc, marginBottom: spacing[4], textAlign: "left" as const }}>
            Legitimate interest basis (LGPD). Full consent at account creation.
          </p>
          <button
            style={{ ...s.primaryBtn, opacity: email.trim() ? 1 : 0.4 }}
            onClick={() => {
              localStorage.setItem(LS_ONBOARDING_EMAIL, email.trim());
              goToStep("cartografa");
              startCartografa();
            }}
            disabled={!email.trim()}
          >
            Continue to Cartografa →
          </button>
        </div>
      </div>
    );
  }

  // ── STEP 5: Cartografa (redirect) ──────────────────────
  if (step === "cartografa") {
    return (
      <div style={s.container}>
        <div style={s.card}>
          {renderDots()}
          <h2 style={s.title}>{STEP_TITLES.cartografa}</h2>
          <p style={s.subtitle}>Redirecting to your diagnostic...</p>
        </div>
      </div>
    );
  }

  // ── STEP 6: Report Reveal ──────────────────────────────
  if (step === "report") {
    const result = diagResult;
    const pillarScores = result?.pillar_scores || {};
    const readiness = result?.overall_readiness || "roots";
    const identity = result?.identity_callout || "Your grammar is your anchor. Culture is your frontier.";
    const focus = result?.recommended_focus || ["grammar", "culture"];

    const readinessColors: Record<string, string> = {
      roots: colors.phosphor,
      sprouts: "#22C55E",
      branches: colors.amber,
      canopy: colors.violet,
      underground: colors.crimson,
    };

    const pillarNames: Record<string, string> = {
      grammar: "Grammar", logic: "Logic", vocab: "Vocabulary", culture: "Culture", comm: "Communication",
    };

    return (
      <div style={s.container}>
        <div style={s.card}>
          {renderDots()}
          <h2 style={s.title}>{STEP_TITLES.report}</h2>

          {/* Readiness badge */}
          <div style={{ marginBottom: spacing[6] }}>
            <span style={{
              padding: `${spacing[2]}px ${spacing[6]}px`,
              borderRadius: radius.full,
              backgroundColor: readinessColors[readiness] || colors.phosphor,
              color: colors.obsidian,
              fontWeight: 700,
              fontSize: 18,
            }}>
              {readiness.charAt(0).toUpperCase() + readiness.slice(1)}
            </span>
          </div>

          {/* Pillar scores */}
          {Object.entries(pillarScores).length > 0 && (
            <div style={{ display: "flex", flexWrap: "wrap", gap: spacing[3], justifyContent: "center", marginBottom: spacing[6] }}>
              {Object.entries(pillarScores).map(([p, sc]: [string, any]) => (
                <div key={p} style={{
                  padding: spacing[3],
                  borderRadius: radius.md,
                  backgroundColor: colors.obsidian,
                  minWidth: 80,
                }}>
                  <div style={{ ...typography.ui, color: colors.ivory, fontWeight: 600 }}>
                    {Math.round(sc.score || sc || 0)}%
                  </div>
                  <div style={{ ...typography.caption, color: colors.zinc }}>
                    {pillarNames[p] || p}
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* Identity callout */}
          <p style={s.identityCallout}>{identity}</p>

          {/* Recommended focus */}
          <div style={s.focusChips}>
            {focus.map((p: string) => (
              <span key={p} style={s.focusChip}>
                {pillarNames[p] || p}
              </span>
            ))}
          </div>

          <button style={s.primaryBtn} onClick={() => goToStep("roadmap")}>
            See your roadmap →
          </button>
        </div>
      </div>
    );
  }

  // ── STEP 7: Roadmap Reveal ─────────────────────────────
  if (step === "roadmap") {
    return (
      <div style={s.container}>
        <div style={s.card}>
          {renderDots()}
          <h2 style={s.title}>{STEP_TITLES.roadmap}</h2>
          <p style={s.subtitle}>Here&apos;s where your first month starts.</p>

          <div style={s.roomList}>
            {FIRST_ROOMS.map((room) => (
              <div key={room.name} style={s.roomItem}>
                <span style={s.roomIcon}>{room.icon}</span>
                <div style={s.roomInfo}>
                  <span style={s.roomName}>{room.name}</span>
                  <span style={s.roomDesc}>{room.desc}</span>
                </div>
                {room.locked && <span style={s.locked}>Pro</span>}
              </div>
            ))}
          </div>

          <p style={{ ...typography.caption, color: colors.zinc, marginBottom: spacing[6] }}>
            Your first cultural atom awaits in Pulse Mode.
          </p>

          <button style={s.primaryBtn} onClick={() => goToStep("pulse")}>
            Try your first Pulse →
          </button>
          <button style={s.secondaryBtn} onClick={() => goToStep("palace-tour")}>
            Skip to Palace Tour
          </button>
        </div>
      </div>
    );
  }

  // ── STEP 8: Pulse Mode (redirect) ──────────────────────
  if (step === "pulse") {
    return (
      <div style={s.container}>
        <div style={s.card}>
          {renderDots()}
          <h2 style={s.title}>{STEP_TITLES.pulse}</h2>
          <p style={s.pulseTeaser}>
            3 minutes. One cultural atom. One pronunciation. One palace placement.
            You&apos;ll place your first item in your Memory Palace.
          </p>
          <button style={s.primaryBtn} onClick={startPulse}>
            Start Pulse Mode →
          </button>
          <button style={s.secondaryBtn} onClick={() => goToStep("palace-tour")}>
            Skip for now
          </button>
        </div>
      </div>
    );
  }

  // ── STEP 9: Palace Tour Animation ──────────────────────
  if (step === "palace-tour") {
    return (
      <div style={s.container}>
        <div style={s.card}>
          {renderDots()}
          <h2 style={s.title}>{STEP_TITLES["palace-tour"]}</h2>

          {/* Animated blueprint construction */}
          <div style={s.palaceAnimContainer}>
            {/* Grid layer */}
            <svg style={{ ...s.palaceGrid, ...(palacePhase >= 1 ? s.palaceGridVisible : {}) }} width="100%" height="100%">
              {Array.from({ length: 20 }).map((_, i) => (
                <line key={`v${i}`} x1={`${i * 5 + 2.5}%`} y1="0" x2={`${i * 5 + 2.5}%`} y2="100%" stroke={colors.zinc} strokeWidth="0.5" />
              ))}
              {Array.from({ length: 12 }).map((_, i) => (
                <line key={`h${i}`} x1="0" y1={`${i * 8 + 4}%`} x2="100%" y2={`${i * 8 + 4}%`} stroke={colors.zinc} strokeWidth="0.5" />
              ))}
            </svg>

            {/* Rooms layer */}
            <svg style={{ ...s.palaceRooms, ...(palacePhase >= 2 ? s.palaceRoomsVisible : {}) }} width="100%" height="100%">
              {/* Entrance */}
              {palacePhase >= 2 && (
                <rect x="42%" y="5%" width="16%" height="10%" rx="4"
                  fill="none" stroke={colors.phosphor} strokeWidth={palacePhase >= 3 ? 2 : 1}
                  opacity={palacePhase >= 3 ? 1 : 0.6} />
              )}
              {/* Grammar Hall */}
              {palacePhase >= 2 && (
                <rect x="5%" y="25%" width="25%" height="25%" rx="4"
                  fill={palacePhase >= 3 ? `${colors.phosphor}15` : "none"}
                  stroke={colors.phosphor} strokeWidth={palacePhase >= 3 ? 2 : 1}
                  opacity={palacePhase >= 3 ? 1 : 0.6} />
              )}
              {/* Logic Chamber */}
              {palacePhase >= 2 && (
                <rect x="35%" y="25%" width="25%" height="25%" rx="4"
                  fill={palacePhase >= 3 ? `${colors.amber}15` : "none"}
                  stroke={colors.amber} strokeWidth={palacePhase >= 3 ? 2 : 1}
                  opacity={palacePhase >= 3 ? 1 : 0.6} />
              )}
              {/* Vocabulary Vault */}
              {palacePhase >= 2 && (
                <rect x="65%" y="25%" width="30%" height="25%" rx="4"
                  fill={palacePhase >= 3 ? `${colors.phosphor}15` : "none"}
                  stroke={colors.phosphor} strokeWidth={palacePhase >= 3 ? 2 : 1}
                  opacity={palacePhase >= 3 ? 1 : 0.6} />
              )}
              {/* Culture Commons */}
              {palacePhase >= 4 && (
                <rect x="10%" y="60%" width="30%" height="25%" rx="4"
                  fill={palacePhase >= 5 ? `${colors.violet}15` : "none"}
                  stroke={colors.violet} strokeWidth={palacePhase >= 5 ? 2 : 1} />
              )}
              {/* Comm Arena */}
              {palacePhase >= 4 && (
                <rect x="50%" y="60%" width="40%" height="25%" rx="4"
                  fill={palacePhase >= 5 ? `${colors.crimson}15` : "none"}
                  stroke={colors.crimson} strokeWidth={palacePhase >= 5 ? 2 : 1} />
              )}
              {/* Corridors */}
              {palacePhase >= 4 && (
                <>
                  <line x1="50%" y1="15%" x2="50%" y2="25%" stroke={colors.zinc} strokeWidth="1.5" />
                  <line x1="30%" y1="50%" x2="30%" y2="60%" stroke={colors.zinc} strokeWidth="1.5" />
                  <line x1="70%" y1="50%" x2="70%" y2="60%" stroke={colors.zinc} strokeWidth="1.5" />
                </>
              )}
              {/* Room labels */}
              {palacePhase >= 3 && (
                <>
                  <text x="17.5%" y="40%" textAnchor="middle" fill={colors.ivory} fontSize="11" fontFamily="sans-serif">Grammar Hall</text>
                  <text x="47.5%" y="40%" textAnchor="middle" fill={colors.ivory} fontSize="11" fontFamily="sans-serif">Logic Chamber</text>
                  <text x="80%" y="40%" textAnchor="middle" fill={colors.ivory} fontSize="11" fontFamily="sans-serif">Vocab Vault</text>
                  <text x="50%" y="10%" textAnchor="middle" fill={colors.ivory} fontSize="10" fontFamily="sans-serif">Entrance</text>
                </>
              )}
              {palacePhase >= 5 && (
                <>
                  <text x="25%" y="75%" textAnchor="middle" fill={colors.ivory} fontSize="11" fontFamily="sans-serif">Culture Commons</text>
                  <text x="70%" y="75%" textAnchor="middle" fill={colors.ivory} fontSize="11" fontFamily="sans-serif">Comm Arena</text>
                  {/* Door indicators */}
                  <circle cx="17.5%" cy="50%" r="3" fill={colors.phosphor} opacity={0.8} />
                  <circle cx="47.5%" cy="50%" r="3" fill={colors.phosphor} opacity={0.8} />
                  <circle cx="80%" cy="50%" r="3" fill={colors.phosphor} opacity={0.8} />
                </>
              )}
            </svg>

            {/* Final zoom pulse */}
            {palacePhase >= 6 && (
              <div style={{
                position: "absolute",
                inset: 0,
                border: `2px solid ${colors.phosphor}`,
                borderRadius: radius.card,
                opacity: 0.5,
                animation: "pulse 2s ease-in-out infinite",
              }} />
            )}
          </div>

          <button style={s.primaryBtn} onClick={() => goToStep("account")}>
            Create your account →
          </button>
          <button style={s.secondaryBtn} onClick={() => goToStep("account")}>
            Skip animation
          </button>

          {/* Inline keyframes */}
          <style>{`
            @keyframes pulse {
              0%, 100% { opacity: 0.3; transform: scale(1); }
              50% { opacity: 0.6; transform: scale(1.01); }
            }
          `}</style>
        </div>
      </div>
    );
  }

  // ── STEP 10: Account Creation ──────────────────────────
  if (step === "account") {
    // Already authenticated
    if (user) {
      return (
        <div style={s.container}>
          <div style={s.card}>
            {renderDots()}
            <h2 style={{ ...s.title, fontSize: 36, marginBottom: spacing[6] }}>
              You&apos;re in.
            </h2>
            <p style={s.subtitle}>Your palace is waiting.</p>
            <button style={s.primaryBtn} onClick={() => {
              localStorage.removeItem(LS_ONBOARDING_STEP);
              router.push("/palace");
            }}>
              Enter your Palace →
            </button>
          </div>
        </div>
      );
    }

    return (
      <div style={s.container}>
        <div style={s.card}>
          {renderDots()}
          <h2 style={s.title}>{STEP_TITLES.account}</h2>
          <p style={s.subtitle}>Email pre-filled. Just add a password.</p>

          {authError && <p style={s.error}>{authError}</p>}

          <div style={s.signupForm}>
            <label style={s.label}>Name</label>
            <input style={s.input} value={name} onChange={(e) => setName(e.target.value)} placeholder="Your name" />

            <label style={s.label}>Email</label>
            <input style={s.input} value={email} onChange={(e) => setEmail(e.target.value)} placeholder="email@example.com" autoComplete="off" />

            <label style={s.label}>Password</label>
            <input style={s.input} type="password" value={password} onChange={(e) => setPassword(e.target.value)} placeholder="••••••" />

            <label style={s.label}>Confirm password</label>
            <input style={{ ...s.input, marginBottom: spacing[3] }} type="password" value={confirmPw} onChange={(e) => setConfirmPw(e.target.value)} placeholder="••••••" />

            <div style={s.checkboxRow} onClick={() => setConsent(!consent)}>
              <div style={{ ...s.checkbox, ...(consent ? s.checkboxChecked : {}) }} />
              <span style={{ ...typography.caption, color: colors.zinc }}>
                Concordo com os Termos de Serviço
              </span>
            </div>

            <button
              style={{ ...s.primaryBtn, opacity: authLoading ? 0.5 : 1 }}
              onClick={handleSignup}
              disabled={authLoading}
            >
              {authLoading ? "Creating..." : "Create account"}
            </button>

            <div style={{ textAlign: "center", marginTop: spacing[4] }}>
              <p style={{ ...typography.caption, color: colors.zinc, marginBottom: spacing[2] }}>Ou continue com</p>
              <button style={s.secondaryBtn} onClick={handleGoogleSignup} disabled={authLoading}>
                Google
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Fallback
  return null;
}
