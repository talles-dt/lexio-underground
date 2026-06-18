"use client";

import React, { useState, useEffect, useCallback, useRef } from "react";
import { colors, spacing, radius, typography, duration } from "@/theme/tokens";
import { useAuth } from "@/lib/auth";
import { supabase } from "@/lib/supabase";

/* ------------------------------------------------------------------ */
/*  Types                                                              */
/* ------------------------------------------------------------------ */

interface CulturalAtom {
  id: string;
  title: string;
  description: string;
  pillar: "grammar" | "logic" | "vocab" | "culture" | "comm";
  difficulty: number;
  content: string; // The actual learning content
  example?: string;
  translation?: string;
}

interface PulseSession {
  atom: CulturalAtom;
  pronunciation?: string; // TTS audio URL
  palaceRoom: string; // Which room to place this in
  completed: boolean;
}

/* ------------------------------------------------------------------ */
/*  Cultural Atoms Database (seed data)                                */
/* ------------------------------------------------------------------ */

const CULTURAL_ATOMS: CulturalAtom[] = [
  // Vocabulary atoms
  {
    id: "atom_v1",
    title: "Actually ≠ Atualmente",
    description: "One of the most common false friends",
    pillar: "vocab",
    difficulty: 1,
    content: "\"Actually\" means 'in fact' or 'really' — not 'currently'. For 'currently', use 'at the moment' or 'right now'.",
    example: "\"I'm actually working on it\" = I'm really working on it (not 'atualmente')",
    translation: "\"Actually\" = في الواقع / فعلاً (não 'atualmente')",
  },
  {
    id: "atom_v2",
    title: "Make vs Do",
    description: "The eternal confusion",
    pillar: "vocab",
    difficulty: 1,
    content: "\"Make\" = create/produce something. \"Do\" = perform an activity. \"Make a mistake\" (create it), \"Do homework\" (perform it).",
    example: "\"I made dinner\" (I created it) vs \"I did the dishes\" (I performed the task)",
    translation: "\"Make\" = يصنع/يعمل، \"Do\" = يفعل/يؤدي",
  },
  {
    id: "atom_v3",
    title: "Take a shower / Have a shower",
    description: "Collocation awareness",
    pillar: "vocab",
    difficulty: 1,
    content: "\"Take a shower\" is the standard American collocation. \"Have a shower\" is British. \"Do a shower\" doesn't exist.",
    example: "\"I need to take a shower before we leave\"",
    translation: "\"Take a shower\" = يستحم (أمريكية)، \"Have a shower\" = يستحم (بريطانية)",
  },
  {
    id: "atom_v4",
    title: "Get — The Swiss Army Knife",
    description: "One verb, dozens of meanings",
    pillar: "vocab",
    difficulty: 2,
    content: "\"Get\" can mean: receive (get a letter), become (get tired), arrive (get to work), understand (get it), fetch (get water).",
    example: "\"I got it\" can mean: I received it / I understand it / I fetched it",
    translation: "\"Get\" = يحصل/يصبح/يفهم/يحضر — حسب السياق",
  },
  {
    id: "atom_v5",
    title: "Phrasal Verb: Put Off",
    description: "Postponement with attitude",
    pillar: "vocab",
    difficulty: 2,
    content: "\"Put off\" = postpone/delay. \"Put away\" = store. \"Put down\" = place down/criticize. \"Put out\" = extinguish/inconvenience.",
    example: "\"Don't put off until tomorrow what you can do today\"",
    translation: "\"Put off\" = يؤجل، \"Put away\" = يخزن، \"Put down\" = يضع/ينتقد",
  },
  // Culture atoms
  {
    id: "atom_c1",
    title: "\"That's Interesting\" — The Polite No",
    description: "Reading between American lines",
    pillar: "culture",
    difficulty: 2,
    content: "In American culture, \"That's interesting\" said with a flat tone often means \"I disagree but don't want to argue.\" Context and tone are everything.",
    example: "If someone says \"That's interesting...\" with a pause and no follow-up, they likely disagree.",
    translation: "\"That's interesting\" يمكن أن تعني \"لا أتفق\" بلهجة مهذبة",
  },
  {
    id: "atom_c2",
    title: "The RSVP Obligation",
    description: "Cultural expectations around invitations",
    pillar: "culture",
    difficulty: 1,
    content: "RSVP = \"Répondez s'il vous plaît\" (please respond). In Anglo culture, you MUST respond — even if you can't attend. Ignoring is rude.",
    example: "If you can't go, reply: \"Thank you for the invitation, but I won't be able to attend.\"",
    translation: "RSVP = الرجاء الرد — عدم الرد يعتبر وقحاً",
  },
  {
    id: "atom_c3",
    title: "\"How Are You?\" — Not a Real Question",
    description: "Social formula vs genuine inquiry",
    pillar: "culture",
    difficulty: 1,
    content: "\"How are you?\" in American culture is a greeting, not a real question. The expected answer is \"Good, thanks\" — not your actual health status.",
    example: "Wrong: \"Well, I've been having back pain...\" Right: \"Good, thanks! How are you?\"",
    translation: "\"How are you?\" = تحية اجتماعية، ليس سؤالاً حقيقياً",
  },
  {
    id: "atom_c4",
    title: "Small Talk — The Social Glue",
    description: "Why Americans talk about weather",
    pillar: "culture",
    difficulty: 2,
    content: "Small talk (weather, sports, weekend plans) is not meaningless — it's social bonding. Skipping it and jumping to business feels cold.",
    example: "Before a meeting: \"How was your weekend?\" → 30 seconds of small talk → then business.",
    translation: "المحادثة الخفيفة = مفتاح العلاقات الاجتماعية في الثقافة الأمريكية",
  },
  {
    id: "atom_c5",
    title: "The \"Sorry\" Reflex",
    description: "When Americans apologize",
    pillar: "culture",
    difficulty: 3,
    content: "Americans say \"sorry\" for things that aren't their fault — bumping into furniture, asking a question, existing near someone. It's social lubricant, not admission of guilt.",
    example: "\"Sorry, could you repeat that?\" — You're not sorry, you're being polite.",
    translation: "\"Sorry\" في الثقافة الأمريكية = تهذيب، ليس اعتذاراً حقيقياً",
  },
  // Grammar atoms
  {
    id: "atom_g1",
    title: "Present Perfect vs Simple Past",
    description: "The Brazilian nightmare",
    pillar: "grammar",
    difficulty: 2,
    content: "Use Present Perfect for actions connected to now: \"I have lived here for 5 years\" (still living). Use Simple Past for completed actions: \"I lived there in 2010\" (not anymore).",
    example: "\"I have seen that movie\" (at some point, relevant now) vs \"I saw that movie last week\" (specific past time)",
    translation: "Present Perfect = المضارع التام (مرتبط بالحاضر)، Simple Past = الماضي البسيط (انتهى)",
  },
  {
    id: "atom_g2",
    title: "The Subjunctive Were",
    description: "Hypothetical thinking in English",
    pillar: "grammar",
    difficulty: 3,
    content: "\"If I were rich\" (not \"was\") — the subjunctive mood. It signals hypothetical/unreal situations. \"Were\" for all persons in formal English.",
    example: "\"If I were you, I would study more\" (I'm not you — hypothetical)",
    translation: "\"Were\" في الجمل الشرطية = صيغة افتراضية (لو كنت)",
  },
  // Logic atoms
  {
    id: "atom_l1",
    title: "False Friends: Pretender vs Pretend",
    description: "Words that lie to you",
    pillar: "logic",
    difficulty: 1,
    content: "\"Pretender\" in Portuguese = to intend. \"Pretend\" in English = to fake/false. \"I pretend to go\" (PT) ≠ \"I pretend to go\" (EN — means you're faking it).",
    example: "PT: \"Pretendo estudar\" → EN: \"I intend to study\" (NOT \"I pretend to study\")",
    translation: "\"Pretender\" (برتغالي) ≠ \"Pretend\" (إنجليزي) — أصدقاء كاذبون",
  },
  {
    id: "atom_l2",
    title: "The Article Trap",
    description: "When to use a/an/the/∅",
    pillar: "logic",
    difficulty: 3,
    content: "English articles don't map to Portuguese. \"I love music\" (no article) but \"I love the music in this film\" (specific). \"I'm a teacher\" (profession) but \"I'm the teacher\" (the only one).",
    example: "\"Life is beautiful\" (general, no article) vs \"The life of a teacher is hard\" (specific)",
    translation: "أدوات التعريف والتنكير في الإنجليزية لا تتطابق مع البرتغالية",
  },
  // Communication atoms
  {
    id: "atom_m1",
    title: "Hedging Language",
    description: "How to sound less direct",
    pillar: "comm",
    difficulty: 2,
    content: "Americans hedge: \"I think maybe we could possibly...\" instead of \"We should...\" Hedging sounds polite, not weak.",
    example: "\"I was wondering if you might be able to...\" (polite request) vs \"Can you...?\" (direct)",
    translation: "التلطيف في الإنجليزية = أدب، وليس ضعفاً",
  },
  {
    id: "atom_m2",
    title: "The \"Could You\" Formula",
    description: "Polite requests that actually work",
    pillar: "comm",
    difficulty: 1,
    content: "\"Could you\" is more polite than \"Can you.\" \"Would you mind\" is even more polite. \"I was wondering if\" is the most indirect.",
    example: "\"Could you pass the salt?\" (polite) → \"Would you mind passing the salt?\" (very polite)",
    translation: "\"Could you\" = هل يمكنك (مهذب)، \"Would you mind\" = هل تمانع (أكثر تهذيباً)",
  },
];

/* ------------------------------------------------------------------ */
/*  Pulse Mode Component                                               */
/* ------------------------------------------------------------------ */

export default function PulseModePage() {
  const { user } = useAuth();
  const [session, setSession] = useState<PulseSession | null>(null);
  const [step, setStep] = useState<"intro" | "atom" | "pronunciation" | "palace" | "done">("intro");
  const [loading, setLoading] = useState(true);
  const [showTranslation, setShowTranslation] = useState(false);
  const [timeOfDay, setTimeOfDay] = useState<"morning" | "afternoon" | "evening">("morning");

  // Determine time of day
  useEffect(() => {
    const hour = new Date().getHours();
    if (hour < 12) setTimeOfDay("morning");
    else if (hour < 18) setTimeOfDay("afternoon");
    else setTimeOfDay("evening");
  }, []);

  // Load today's pulse session
  useEffect(() => {
    async function loadPulse() {
      if (!user) { setLoading(false); return; }
      try {
        // Check if already completed today
        const today = new Date().toISOString().split("T")[0];
        const { data: existing } = await supabase
          .from("pulse_sessions")
          .select("*")
          .eq("user_id", user.id)
          .eq("completed_at", today)
          .single();

        if (existing) {
          setStep("done");
          setLoading(false);
          return;
        }

        // Get a random atom the user hasn't seen
        const { data: seen } = await supabase
          .from("pulse_sessions")
          .select("atom_id")
          .eq("user_id", user.id);

        const seenIds = new Set((seen || []).map((s: { atom_id: string }) => s.atom_id));
        const unseen = CULTURAL_ATOMS.filter((a) => !seenIds.has(a.id));
        const atom = unseen.length > 0
          ? unseen[Math.floor(Math.random() * unseen.length)]
          : CULTURAL_ATOMS[Math.floor(Math.random() * CULTURAL_ATOMS.length)];

        // Determine palace room based on pillar
        const pillarRooms: Record<string, string> = {
          grammar: "grammar",
          logic: "logic",
          vocab: "vocab",
          culture: "culture",
          comm: "comm",
        };

        setSession({
          atom,
          palaceRoom: pillarRooms[atom.pillar] || "entrance",
          completed: false,
        });
        setStep("atom");
      } catch {
        // No session yet, create one
        const atom = CULTURAL_ATOMS[Math.floor(Math.random() * CULTURAL_ATOMS.length)];
        setSession({
          atom,
          palaceRoom: atom.pillar,
          completed: false,
        });
        setStep("atom");
      } finally {
        setLoading(false);
      }
    }
    loadPulse();
  }, [user]);

  const handleComplete = useCallback(async () => {
    if (!user || !session) return;
    try {
      await supabase.from("pulse_sessions").insert({
        user_id: user.id,
        atom_id: session.atom.id,
        pillar: session.atom.pillar,
        palace_room: session.palaceRoom,
        completed_at: new Date().toISOString().split("T")[0],
      });
    } catch {
      // Silent fail — not critical
    }
    setStep("done");
  }, [user, session]);

  if (loading) {
    return (
      <div style={s.container}>
        <div style={s.loadingWrap}>
          <div style={s.spinner} />
          <span style={s.loadingText}>Preparing your pulse...</span>
        </div>
      </div>
    );
  }

  return (
    <div style={s.container}>
      {/* Header */}
      <header style={s.header}>
        <h1 style={s.title}>Pulse Mode</h1>
        <p style={s.subtitle}>
          {timeOfDay === "morning" && "☀️ Morning pulse — 3 minutes to sharpen your mind"}
          {timeOfDay === "afternoon" && "🌤 Afternoon pulse — a quick cultural atom"}
          {timeOfDay === "evening" && "🌙 Evening pulse — wind down with language"}
        </p>
      </header>

      <main style={s.main}>
        {step === "atom" && session && (
          <div style={s.card}>
            {/* Pillar badge */}
            <div style={pillarBadgeStyle(session.atom.pillar)}>
              {session.atom.pillar}
            </div>

            {/* Title */}
            <h2 style={s.atomTitle}>{session.atom.title}</h2>
            <p style={s.atomDescription}>{session.atom.description}</p>

            {/* Content */}
            <div style={s.contentBox}>
              <p style={s.contentText}>{session.atom.content}</p>
            </div>

            {/* Example */}
            {session.atom.example && (
              <div style={s.exampleBox}>
                <span style={s.exampleLabel}>Example:</span>
                <p style={s.exampleText}>{session.atom.example}</p>
              </div>
            )}

            {/* Translation toggle */}
            {session.atom.translation && (
              <button
                onClick={() => setShowTranslation(!showTranslation)}
                style={s.translationToggle}
              >
                {showTranslation ? "Hide translation" : "Show translation"}
              </button>
            )}
            {showTranslation && session.atom.translation && (
              <div style={s.translationBox}>
                <p style={s.translationText}>{session.atom.translation}</p>
              </div>
            )}

            {/* Actions */}
            <div style={s.actions}>
              <button onClick={() => setStep("palace")} style={s.primaryBtn}>
                Place in Palace →
              </button>
            </div>
          </div>
        )}

        {step === "palace" && session && (
          <div style={s.card}>
            <div style={s.palaceIcon}>🏛</div>
            <h2 style={s.palaceTitle}>Place in Palace</h2>
            <p style={s.palaceDescription}>
              This atom will be placed in your <strong>{session.palaceRoom}</strong> room.
            </p>
            <div style={s.palaceRoomCard}>
              <span style={s.palaceRoomIcon}>
                {session.palaceRoom === "grammar" && "📐"}
                {session.palaceRoom === "logic" && "🧩"}
                {session.palaceRoom === "vocab" && "📚"}
                {session.palaceRoom === "culture" && "🌍"}
                {session.palaceRoom === "comm" && "💬"}
              </span>
              <span style={s.palaceRoomName}>{session.palaceRoom} room</span>
            </div>
            <div style={s.actions}>
              <button onClick={() => setStep("atom")} style={s.secondaryBtn}>
                ← Back
              </button>
              <button onClick={handleComplete} style={s.primaryBtn}>
                Complete Pulse ✓
              </button>
            </div>
          </div>
        )}

        {step === "done" && (
          <div style={s.card}>
            <div style={s.doneIcon}>✓</div>
            <h2 style={s.doneTitle}>Pulse Complete</h2>
            <p style={s.doneDescription}>
              You've completed today's pulse. Come back tomorrow for a new atom.
            </p>
            <div style={s.doneStats}>
              <div style={s.statItem}>
                <span style={s.statValue}>3</span>
                <span style={s.statLabel}>min</span>
              </div>
              <div style={s.statItem}>
                <span style={s.statValue}>1</span>
                <span style={s.statLabel}>atom</span>
              </div>
              <div style={s.statItem}>
                <span style={s.statValue}>∞</span>
                <span style={s.statLabel}>streak</span>
              </div>
            </div>
            <div style={s.actions}>
              <a href="/" style={s.primaryBtn}>Back to Home</a>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/*  Styles                                                             */
/* ------------------------------------------------------------------ */

const s: Record<string, React.CSSProperties> = {
  container: {
    minHeight: "100vh",
    backgroundColor: colors.obsidian,
    color: colors.ivory,
    display: "flex",
    flexDirection: "column",
  },
  loadingWrap: {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
    minHeight: "60vh",
    gap: spacing[3],
  },
  spinner: {
    width: 32,
    height: 32,
    border: `3px solid ${colors.borderSubtle}`,
    borderTopColor: colors.phosphor,
    borderRadius: "50%",
    animation: "spin 0.8s linear infinite",
  },
  loadingText: {
    fontFamily: typography.ui.fontFamily,
    fontSize: typography.ui.fontSize,
    color: colors.zinc,
  },
  header: {
    textAlign: "center",
    padding: `${spacing[6]}px ${spacing[3]}px ${spacing[2]}`,
  },
  title: {
    fontFamily: typography.display.fontFamily,
    fontSize: 28,
    lineHeight: "36px",
    color: colors.ivory,
    margin: 0,
    marginBottom: spacing[1],
  },
  subtitle: {
    fontFamily: typography.bodyItalic.fontFamily,
    fontStyle: "italic",
    fontSize: typography.body.fontSize,
    color: colors.zinc,
    margin: 0,
  },
  main: {
    flex: 1,
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    padding: spacing[3],
  },
  card: {
    backgroundColor: colors.surface,
    border: `1px solid ${colors.borderSubtle}`,
    borderRadius: radius.card,
    padding: spacing[6],
    maxWidth: 520,
    width: "100%",
    textAlign: "center",
  },
  atomTitle: {
    fontFamily: typography.h1.fontFamily,
    fontSize: 22,
    lineHeight: "28px",
    color: colors.ivory,
    margin: 0,
    marginBottom: spacing[1],
  },
  atomDescription: {
    fontFamily: typography.bodyItalic.fontFamily,
    fontStyle: "italic",
    fontSize: typography.body.fontSize,
    color: colors.phosphor,
    margin: 0,
    marginBottom: spacing[4],
  },
  contentBox: {
    backgroundColor: colors.obsidian,
    borderRadius: radius.btn,
    padding: spacing[4],
    marginBottom: spacing[3],
    textAlign: "left",
  },
  contentText: {
    fontFamily: typography.body.fontFamily,
    fontSize: typography.body.fontSize,
    lineHeight: "24px",
    color: colors.ivory,
    margin: 0,
  },
  exampleBox: {
    backgroundColor: `${colors.phosphor}08`,
    border: `1px solid ${colors.phosphor}20`,
    borderRadius: radius.btn,
    padding: spacing[3],
    marginBottom: spacing[3],
    textAlign: "left",
  },
  exampleLabel: {
    fontFamily: typography.caption.fontFamily,
    fontSize: 10,
    fontWeight: 600,
    textTransform: "uppercase",
    letterSpacing: 1,
    color: colors.phosphor,
    display: "block",
    marginBottom: spacing[1],
  },
  exampleText: {
    fontFamily: typography.bodyItalic.fontFamily,
    fontStyle: "italic",
    fontSize: typography.body.fontSize,
    color: colors.ivory,
    margin: 0,
  },
  translationToggle: {
    background: "none",
    border: "none",
    color: colors.zinc,
    fontFamily: typography.caption.fontFamily,
    fontSize: 11,
    cursor: "pointer",
    padding: spacing[1],
    marginBottom: spacing[3],
  },
  translationBox: {
    backgroundColor: `${colors.violet}08`,
    border: `1px solid ${colors.violet}20`,
    borderRadius: radius.btn,
    padding: spacing[3],
    marginBottom: spacing[4],
    textAlign: "left",
  },
  translationText: {
    fontFamily: typography.body.fontFamily,
    fontSize: typography.body.fontSize,
    color: colors.ivory,
    margin: 0,
    lineHeight: "22px",
  },
  actions: {
    display: "flex",
    justifyContent: "center",
    gap: spacing[2],
    marginTop: spacing[4],
  },
  primaryBtn: {
    display: "inline-block",
    backgroundColor: colors.phosphor,
    color: colors.obsidian,
    fontWeight: 700,
    padding: `${spacing[2]}px ${spacing[4]}px`,
    borderRadius: radius.btn,
    textDecoration: "none",
    fontFamily: typography.ui.fontFamily,
    fontSize: 14,
    border: "none",
    cursor: "pointer",
  },
  secondaryBtn: {
    display: "inline-block",
    backgroundColor: "transparent",
    color: colors.zinc,
    fontWeight: 600,
    padding: `${spacing[2]}px ${spacing[4]}px`,
    borderRadius: radius.btn,
    textDecoration: "none",
    fontFamily: typography.ui.fontFamily,
    fontSize: 14,
    border: `1px solid ${colors.borderSubtle}`,
    cursor: "pointer",
  },
  palaceIcon: {
    fontSize: 48,
    marginBottom: spacing[2],
  },
  palaceTitle: {
    fontFamily: typography.h1.fontFamily,
    fontSize: 22,
    color: colors.ivory,
    margin: 0,
    marginBottom: spacing[1],
  },
  palaceDescription: {
    fontFamily: typography.body.fontFamily,
    fontSize: typography.body.fontSize,
    color: colors.zinc,
    margin: 0,
    marginBottom: spacing[4],
  },
  palaceRoomCard: {
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    gap: spacing[2],
    backgroundColor: colors.obsidian,
    borderRadius: radius.btn,
    padding: spacing[3],
    marginBottom: spacing[4],
  },
  palaceRoomIcon: {
    fontSize: 24,
  },
  palaceRoomName: {
    fontFamily: typography.ui.fontFamily,
    fontSize: 14,
    fontWeight: 600,
    color: colors.ivory,
    textTransform: "capitalize",
  },
  doneIcon: {
    width: 56,
    height: 56,
    borderRadius: "50%",
    backgroundColor: `${colors.phosphor}15`,
    border: `2px solid ${colors.phosphor}`,
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    margin: "0 auto",
    marginBottom: spacing[3],
    fontFamily: typography.h1.fontFamily,
    fontSize: 24,
    color: colors.phosphor,
  },
  doneTitle: {
    fontFamily: typography.h1.fontFamily,
    fontSize: 22,
    color: colors.ivory,
    margin: 0,
    marginBottom: spacing[1],
  },
  doneDescription: {
    fontFamily: typography.body.fontFamily,
    fontSize: typography.body.fontSize,
    color: colors.zinc,
    margin: 0,
    marginBottom: spacing[4],
  },
  doneStats: {
    display: "flex",
    justifyContent: "center",
    gap: spacing[6],
    marginBottom: spacing[4],
  },
  statItem: {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
  },
  statValue: {
    fontFamily: typography.display.fontFamily,
    fontSize: 24,
    color: colors.phosphor,
  },
  statLabel: {
    fontFamily: typography.caption.fontFamily,
    fontSize: 10,
    color: colors.zinc,
    textTransform: "uppercase",
    letterSpacing: 1,
  },
};

// Pillar badge colors helper
function pillarBadgeStyle(pillar: string): React.CSSProperties {
  const color = pillar === "grammar" ? colors.phosphor :
    pillar === "logic" ? colors.amber :
    pillar === "vocab" ? colors.violet :
    pillar === "culture" ? colors.phosphorFixedDim :
    colors.crimson;
  return {
    display: "inline-block",
    padding: "2px 10px",
    borderRadius: 12,
    fontFamily: typography.caption.fontFamily,
    fontSize: 10,
    fontWeight: 600,
    textTransform: "uppercase",
    letterSpacing: 1.5,
    marginBottom: spacing[3],
    backgroundColor: `${color}15`,
    color,
    border: `1px solid ${color}30`,
  };
}
