"use client";

import React, { useState, useEffect, useCallback } from "react";
import { colors, spacing, radius, typography } from "@/theme/tokens";
import { useAuth } from "@/lib/auth";
import { supabase } from "@/lib/supabase";
import { CULTURAL_ATOMS, CulturalAtom } from "@/lib/pulse-content";

interface PulseSession {
  atom: CulturalAtom;
  palaceRoom: string;
  completed: boolean;
}

export default function PulseModePage() {
  const { user } = useAuth();
  const [session, setSession] = useState<PulseSession | null>(null);
  const [step, setStep] = useState<"atom" | "palace" | "done">("atom");
  const [loading, setLoading] = useState(true);
  const [showTranslation, setShowTranslation] = useState(false);
  const [timeOfDay, setTimeOfDay] = useState<"morning" | "afternoon" | "evening">("morning");

  useEffect(() => {
    const hour = new Date().getHours();
    if (hour < 12) setTimeOfDay("morning");
    else if (hour < 18) setTimeOfDay("afternoon");
    else setTimeOfDay("evening");
  }, []);

  useEffect(() => {
    async function loadPulse() {
      if (!user) { setLoading(false); return; }
      try {
        const today = new Date().toISOString().split("T")[0];
        const { data: existing } = await supabase
          .from("pulse_sessions").select("*").eq("user_id", user.id).eq("completed_at", today).single();
        if (existing) { setStep("done"); setLoading(false); return; }
      } catch { /* no session yet */ }

      try {
        const { data: seen } = await supabase.from("pulse_sessions").select("atom_id").eq("user_id", user.id);
        const seenIds = new Set((seen || []).map((s: { atom_id: string }) => s.atom_id));
        const unseen = CULTURAL_ATOMS.filter((a) => !seenIds.has(a.id));
        const atom = unseen.length > 0 ? unseen[Math.floor(Math.random() * unseen.length)] : CULTURAL_ATOMS[0];
        setSession({ atom, palaceRoom: atom.pillar, completed: false });
        setStep("atom");
      } catch {
        setSession({ atom: CULTURAL_ATOMS[0], palaceRoom: "vocab", completed: false });
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
        user_id: user.id, atom_id: session.atom.id, pillar: session.atom.pillar,
        palace_room: session.palaceRoom, completed_at: new Date().toISOString().split("T")[0],
      });
    } catch { /* silent */ }
    setStep("done");
  }, [user, session]);

  if (loading) {
    return (
      <div style={{ minHeight: "100vh", backgroundColor: colors.obsidian, display: "flex", alignItems: "center", justifyContent: "center" }}>
        <div style={{ width: 32, height: 32, border: `3px solid ${colors.borderSubtle}`, borderTopColor: colors.phosphor, borderRadius: "50%", animation: "spin 0.8s linear infinite" }} />
        <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
      </div>
    );
  }

  const pillarColor = (p: string) =>
    p === "grammar" ? colors.phosphor : p === "logic" ? colors.amber :
    p === "vocab" ? "#22C55E" : p === "culture" ? colors.violet : colors.phosphorFixedDim;

  return (
    <div style={{ minHeight: "100vh", backgroundColor: colors.obsidian, color: colors.ivory, display: "flex", flexDirection: "column" }}>
      <header style={{ textAlign: "center", padding: `${spacing[6]}px ${spacing[3]}px ${spacing[2]}` }}>
        <h1 style={{ fontFamily: typography.display.fontFamily, fontSize: 28, color: colors.ivory, margin: 0, marginBottom: spacing[1] }}>
          Pulse Mode
        </h1>
        <p style={{ fontFamily: typography.bodyItalic.fontFamily, fontStyle: "italic", fontSize: typography.body.fontSize, color: colors.zinc, margin: 0 }}>
          {timeOfDay === "morning" && "☀️ Morning pulse — 3 minutes to sharpen your mind"}
          {timeOfDay === "afternoon" && "🌤 Afternoon pulse — a quick cultural atom"}
          {timeOfDay === "evening" && "🌙 Evening pulse — wind down with language"}
        </p>
      </header>

      <main style={{ flex: 1, display: "flex", alignItems: "center", justifyContent: "center", padding: spacing[3] }}>
        {step === "atom" && session && (
          <div style={{ backgroundColor: colors.surface, border: `1px solid ${colors.borderSubtle}`, borderRadius: radius.card, padding: spacing[6], maxWidth: 520, width: "100%", textAlign: "center" }}>
            <div style={{ display: "inline-block", padding: "2px 10px", borderRadius: 12, fontFamily: typography.caption.fontFamily, fontSize: 10, fontWeight: 600, textTransform: "uppercase", letterSpacing: 1.5, marginBottom: spacing[3], backgroundColor: `${pillarColor(session.atom.pillar)}15`, color: pillarColor(session.atom.pillar), border: `1px solid ${pillarColor(session.atom.pillar)}30` }}>
              {session.atom.pillar}
            </div>
            <h2 style={{ fontFamily: typography.h1.fontFamily, fontSize: 22, color: colors.ivory, margin: 0, marginBottom: spacing[1] }}>{session.atom.title}</h2>
            <p style={{ fontFamily: typography.bodyItalic.fontFamily, fontStyle: "italic", fontSize: typography.body.fontSize, color: colors.phosphor, margin: 0, marginBottom: spacing[4] }}>{session.atom.description}</p>
            <div style={{ backgroundColor: colors.obsidian, borderRadius: radius.btn, padding: spacing[4], marginBottom: spacing[3], textAlign: "left" }}>
              <p style={{ fontFamily: typography.body.fontFamily, fontSize: typography.body.fontSize, lineHeight: "24px", color: colors.ivory, margin: 0 }}>{session.atom.content}</p>
            </div>
            {session.atom.example && (
              <div style={{ backgroundColor: `${colors.phosphor}08`, border: `1px solid ${colors.phosphor}20`, borderRadius: radius.btn, padding: spacing[3], marginBottom: spacing[3], textAlign: "left" }}>
                <span style={{ fontFamily: typography.caption.fontFamily, fontSize: 10, fontWeight: 600, textTransform: "uppercase", letterSpacing: 1, color: colors.phosphor, display: "block", marginBottom: spacing[1] }}>Example:</span>
                <p style={{ fontFamily: typography.bodyItalic.fontFamily, fontStyle: "italic", fontSize: typography.body.fontSize, color: colors.ivory, margin: 0 }}>{session.atom.example}</p>
              </div>
            )}
            {session.atom.translation && (
              <>
                <button onClick={() => setShowTranslation(!showTranslation)} style={{ background: "none", border: "none", color: colors.zinc, fontFamily: typography.caption.fontFamily, fontSize: 11, cursor: "pointer", padding: spacing[1], marginBottom: spacing[3] }}>
                  {showTranslation ? "Hide translation" : "Show translation"}
                </button>
                {showTranslation && (
                  <div style={{ backgroundColor: `${colors.violet}08`, border: `1px solid ${colors.violet}20`, borderRadius: radius.btn, padding: spacing[3], marginBottom: spacing[4], textAlign: "left" }}>
                    <p style={{ fontFamily: typography.body.fontFamily, fontSize: typography.body.fontSize, color: colors.ivory, margin: 0, lineHeight: "22px" }}>{session.atom.translation}</p>
                  </div>
                )}
              </>
            )}
            <div style={{ display: "flex", justifyContent: "center", gap: spacing[2], marginTop: spacing[4] }}>
              <button onClick={() => setStep("palace")} style={{ display: "inline-block", backgroundColor: colors.phosphor, color: colors.obsidian, fontWeight: 700, padding: `${spacing[2]}px ${spacing[4]}px`, borderRadius: radius.btn, textDecoration: "none", fontFamily: typography.ui.fontFamily, fontSize: 14, border: "none", cursor: "pointer" }}>
                Place in Palace →
              </button>
            </div>
          </div>
        )}

        {step === "palace" && session && (
          <div style={{ backgroundColor: colors.surface, border: `1px solid ${colors.borderSubtle}`, borderRadius: radius.card, padding: spacing[6], maxWidth: 520, width: "100%", textAlign: "center" }}>
            <div style={{ fontSize: 48, marginBottom: spacing[2] }}>🏛</div>
            <h2 style={{ fontFamily: typography.h1.fontFamily, fontSize: 22, color: colors.ivory, margin: 0, marginBottom: spacing[1] }}>Place in Palace</h2>
            <p style={{ fontFamily: typography.body.fontFamily, fontSize: typography.body.fontSize, color: colors.zinc, margin: 0, marginBottom: spacing[4] }}>
              This atom will be placed in your <strong>{session.palaceRoom}</strong> room.
            </p>
            <div style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: spacing[2], backgroundColor: colors.obsidian, borderRadius: radius.btn, padding: spacing[3], marginBottom: spacing[4] }}>
              <span style={{ fontSize: 24 }}>
                {session.palaceRoom === "grammar" && "📐"}
                {session.palaceRoom === "logic" && "🧩"}
                {session.palaceRoom === "vocab" && "📚"}
                {session.palaceRoom === "culture" && "🌍"}
                {session.palaceRoom === "comm" && "💬"}
              </span>
              <span style={{ fontFamily: typography.ui.fontFamily, fontSize: 14, fontWeight: 600, color: colors.ivory, textTransform: "capitalize" }}>{session.palaceRoom} room</span>
            </div>
            <div style={{ display: "flex", justifyContent: "center", gap: spacing[2] }}>
              <button onClick={() => setStep("atom")} style={{ display: "inline-block", backgroundColor: "transparent", color: colors.zinc, fontWeight: 600, padding: `${spacing[2]}px ${spacing[4]}px`, borderRadius: radius.btn, textDecoration: "none", fontFamily: typography.ui.fontFamily, fontSize: 14, border: `1px solid ${colors.borderSubtle}`, cursor: "pointer" }}>← Back</button>
              <button onClick={handleComplete} style={{ display: "inline-block", backgroundColor: colors.phosphor, color: colors.obsidian, fontWeight: 700, padding: `${spacing[2]}px ${spacing[4]}px`, borderRadius: radius.btn, textDecoration: "none", fontFamily: typography.ui.fontFamily, fontSize: 14, border: "none", cursor: "pointer" }}>Complete Pulse ✓</button>
            </div>
          </div>
        )}

        {step === "done" && (
          <div style={{ backgroundColor: colors.surface, border: `1px solid ${colors.borderSubtle}`, borderRadius: radius.card, padding: spacing[6], maxWidth: 520, width: "100%", textAlign: "center" }}>
            <div style={{ width: 56, height: 56, borderRadius: "50%", backgroundColor: `${colors.phosphor}15`, border: `2px solid ${colors.phosphor}`, display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto", marginBottom: spacing[3], fontFamily: typography.h1.fontFamily, fontSize: 24, color: colors.phosphor }}>✓</div>
            <h2 style={{ fontFamily: typography.h1.fontFamily, fontSize: 22, color: colors.ivory, margin: 0, marginBottom: spacing[1] }}>Pulse Complete</h2>
            <p style={{ fontFamily: typography.body.fontFamily, fontSize: typography.body.fontSize, color: colors.zinc, margin: 0, marginBottom: spacing[4] }}>You've completed today's pulse. Come back tomorrow for a new atom.</p>
            <div style={{ display: "flex", justifyContent: "center", gap: spacing[6], marginBottom: spacing[4] }}>
              <div style={{ display: "flex", flexDirection: "column", alignItems: "center" }}>
                <span style={{ fontFamily: typography.display.fontFamily, fontSize: 24, color: colors.phosphor }}>3</span>
                <span style={{ fontFamily: typography.caption.fontFamily, fontSize: 10, color: colors.zinc, textTransform: "uppercase", letterSpacing: 1 }}>min</span>
              </div>
              <div style={{ display: "flex", flexDirection: "column", alignItems: "center" }}>
                <span style={{ fontFamily: typography.display.fontFamily, fontSize: 24, color: colors.phosphor }}>1</span>
                <span style={{ fontFamily: typography.caption.fontFamily, fontSize: 10, color: colors.zinc, textTransform: "uppercase", letterSpacing: 1 }}>atom</span>
              </div>
              <div style={{ display: "flex", flexDirection: "column", alignItems: "center" }}>
                <span style={{ fontFamily: typography.display.fontFamily, fontSize: 24, color: colors.phosphor }}>∞</span>
                <span style={{ fontFamily: typography.caption.fontFamily, fontSize: 10, color: colors.zinc, textTransform: "uppercase", letterSpacing: 1 }}>streak</span>
              </div>
            </div>
            <a href="/" style={{ display: "inline-block", backgroundColor: colors.phosphor, color: colors.obsidian, fontWeight: 700, padding: `${spacing[2]}px ${spacing[4]}px`, borderRadius: radius.btn, textDecoration: "none", fontFamily: typography.ui.fontFamily, fontSize: 14 }}>Back to Home</a>
          </div>
        )}
      </main>
    </div>
  );
}
