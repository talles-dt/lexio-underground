"use client";

import React, { useState, useEffect, useCallback } from "react";
import { colors, spacing, radius, typography, duration } from "@/theme/tokens";

/* ------------------------------------------------------------------ */
/*  Types                                                              */
/* ------------------------------------------------------------------ */

type Pillar = "grammar" | "logic" | "vocab" | "culture" | "comm";

interface Meme {
  id: string;
  title: string;
  image_url: string | null;
  alt_text: string | null;
  caption: string | null;
  translation: string | null;
  pillar: Pillar;
  difficulty: number;
  tags: string[] | null;
  is_active: boolean;
  created_at: string;
}

/* ------------------------------------------------------------------ */
/*  Pillar config                                                      */
/* ------------------------------------------------------------------ */

const PILLARS: { key: Pillar | "all"; label: string; color: string }[] = [
  { key: "all", label: "All", color: colors.ivory },
  { key: "grammar", label: "Grammar", color: colors.phosphor },
  { key: "logic", label: "Logic", color: colors.amber },
  { key: "vocab", label: "Vocab", color: "#22C55E" },
  { key: "culture", label: "Culture", color: colors.violet },
  { key: "comm", label: "Comm", color: colors.phosphorFixedDim },
];

const PILLAR_COLOR: Record<Pillar, string> = {
  grammar: colors.phosphor,
  logic: colors.amber,
  vocab: "#22C55E",
  culture: colors.violet,
  comm: colors.phosphorFixedDim,
};

/* ------------------------------------------------------------------ */
/*  Difficulty dots                                                    */
/* ------------------------------------------------------------------ */

function DifficultyDots({ level }: { level: number }) {
  return (
    <span style={{ display: "inline-flex", gap: 2 }}>
      {[1, 2, 3, 4, 5].map((n) => (
        <span
          key={n}
          style={{
            width: 6,
            height: 6,
            borderRadius: "50%",
            backgroundColor: n <= level ? colors.phosphor : colors.zinc,
            opacity: n <= level ? 1 : 0.3,
          }}
        />
      ))}
    </span>
  );
}

/* ------------------------------------------------------------------ */
/*  Meme Card                                                          */
/* ------------------------------------------------------------------ */

function MemeCard({ meme, onClick }: { meme: Meme; onClick: () => void }) {
  const pillarColor = PILLAR_COLOR[meme.pillar] || colors.zinc;

  return (
    <div
      onClick={onClick}
      style={{
        backgroundColor: colors.surface,
        border: `1px solid ${colors.borderSubtle}`,
        borderRadius: radius.card,
        overflow: "hidden",
        cursor: "pointer",
        transition: `border-color ${duration.fast}ms ease, transform ${duration.fast}ms ease`,
      }}
      onMouseEnter={(e) => {
        (e.currentTarget as HTMLDivElement).style.borderColor = pillarColor;
        (e.currentTarget as HTMLDivElement).style.transform = "translateY(-2px)";
      }}
      onMouseLeave={(e) => {
        (e.currentTarget as HTMLDivElement).style.borderColor = colors.borderSubtle;
        (e.currentTarget as HTMLDivElement).style.transform = "translateY(0)";
      }}
    >
      {/* Image placeholder */}
      <div
        style={{
          width: "100%",
          height: 160,
          backgroundColor: colors.obsidian,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          padding: spacing[3],
          borderBottom: `1px solid ${colors.borderSubtle}`,
        }}
      >
        <span
          style={{
            fontFamily: typography.caption.fontFamily,
            fontSize: typography.caption.fontSize,
            color: colors.zinc,
            textAlign: "center",
            lineHeight: 1.4,
          }}
        >
          {meme.alt_text || meme.title}
        </span>
      </div>

      {/* Content */}
      <div style={{ padding: spacing[3] }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: spacing[2] }}>
          <span style={{ fontFamily: typography.ui.fontFamily, fontSize: typography.ui.fontSize, color: colors.ivory }}>
            {meme.title}
          </span>
          <DifficultyDots level={meme.difficulty} />
        </div>

        {meme.caption && (
          <p style={{ fontFamily: typography.body.fontFamily, fontSize: 13, color: colors.onSurfaceVariant, margin: 0, marginBottom: spacing[2], lineHeight: 1.4 }}>
            {meme.caption}
          </p>
        )}

        {/* Pillar badge */}
        <span
          style={{
            display: "inline-block",
            backgroundColor: `${pillarColor}20`,
            color: pillarColor,
            borderRadius: radius.full,
            padding: "2px 10px",
            fontFamily: typography.caption.fontFamily,
            fontSize: 10,
            textTransform: "uppercase",
            letterSpacing: 1,
          }}
        >
          {meme.pillar}
        </span>
      </div>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/*  Submit Modal                                                       */
/* ------------------------------------------------------------------ */

function SubmitModal({ onClose, onSubmit }: { onClose: () => void; onSubmit: (meme: Partial<Meme>) => void }) {
  const [form, setForm] = useState({
    title: "",
    image_url: "",
    alt_text: "",
    caption: "",
    translation: "",
    pillar: "culture" as Pillar,
    difficulty: 1,
    tags: "",
  });
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = async () => {
    setSubmitting(true);
    await onSubmit({
      ...form,
      tags: form.tags.split(",").map((t) => t.trim()).filter(Boolean),
    });
    setSubmitting(false);
    onClose();
  };

  const inputStyle: React.CSSProperties = {
    width: "100%",
    backgroundColor: colors.obsidian,
    border: `1px solid ${colors.borderSubtle}`,
    borderRadius: radius.btn,
    padding: "8px 12px",
    color: colors.ivory,
    fontFamily: typography.ui.fontFamily,
    fontSize: typography.ui.fontSize,
    outline: "none",
  };

  return (
    <div style={{ position: "fixed", inset: 0, backgroundColor: "rgba(13,13,15,0.85)", display: "flex", alignItems: "center", justifyContent: "center", zIndex: 100 }} onClick={onClose}>
      <div style={{ backgroundColor: colors.surface, border: `1px solid ${colors.borderSubtle}`, borderRadius: radius.card, padding: spacing[6], maxWidth: 480, width: "90%", maxHeight: "85vh", overflowY: "auto" }} onClick={(e) => e.stopPropagation()}>
        <h2 style={{ fontFamily: typography.h1.fontFamily, fontSize: 20, color: colors.phosphor, margin: 0, marginBottom: spacing[4] }}>Submit a Meme</h2>

        <div style={{ display: "flex", flexDirection: "column", gap: spacing[3] }}>
          <input style={inputStyle} placeholder="Title *" value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} />
          <input style={inputStyle} placeholder="Image URL" value={form.image_url} onChange={(e) => setForm({ ...form, image_url: e.target.value })} />
          <input style={inputStyle} placeholder="Alt text" value={form.alt_text} onChange={(e) => setForm({ ...form, alt_text: e.target.value })} />
          <input style={inputStyle} placeholder="Caption (English)" value={form.caption} onChange={(e) => setForm({ ...form, caption: e.target.value })} />
          <input style={inputStyle} placeholder="Translation (PT-BR)" value={form.translation} onChange={(e) => setForm({ ...form, translation: e.target.value })} />
          <select style={inputStyle} value={form.pillar} onChange={(e) => setForm({ ...form, pillar: e.target.value as Pillar })}>
            {(["grammar", "logic", "vocab", "culture", "comm"] as Pillar[]).map((p) => (
              <option key={p} value={p}>{p}</option>
            ))}
          </select>
          <div style={{ display: "flex", alignItems: "center", gap: spacing[2] }}>
            <span style={{ fontFamily: typography.ui.fontFamily, fontSize: 12, color: colors.zinc }}>Difficulty:</span>
            <DifficultyDots level={form.difficulty} />
            <input type="range" min={1} max={5} value={form.difficulty} onChange={(e) => setForm({ ...form, difficulty: Number(e.target.value) })} style={{ flex: 1 }} />
          </div>
          <input style={inputStyle} placeholder="Tags (comma separated)" value={form.tags} onChange={(e) => setForm({ ...form, tags: e.target.value })} />
        </div>

        <div style={{ display: "flex", gap: spacing[3], marginTop: spacing[6] }}>
          <button type="button" onClick={onClose} style={{ flex: 1, backgroundColor: "transparent", border: `1px solid ${colors.zinc}`, borderRadius: radius.btn, color: colors.ivory, padding: "10px 0", fontFamily: typography.ui.fontFamily, cursor: "pointer" }}>Cancel</button>
          <button type="button" onClick={handleSubmit} disabled={submitting || !form.title} style={{ flex: 1, backgroundColor: colors.phosphor, border: "none", borderRadius: radius.btn, color: colors.obsidian, padding: "10px 0", fontFamily: typography.ui.fontFamily, fontWeight: 600, cursor: submitting ? "wait" : "pointer", opacity: submitting || !form.title ? 0.5 : 1 }}>{submitting ? "Submitting..." : "Submit"}</button>
        </div>
      </div>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/*  Meme Detail Modal                                                  */
/* ------------------------------------------------------------------ */

function MemeDetailModal({ meme, onClose }: { meme: Meme; onClose: () => void }) {
  const pillarColor = PILLAR_COLOR[meme.pillar] || colors.zinc;

  return (
    <div style={{ position: "fixed", inset: 0, backgroundColor: "rgba(13,13,15,0.85)", display: "flex", alignItems: "center", justifyContent: "center", zIndex: 100 }} onClick={onClose}>
      <div style={{ backgroundColor: colors.surface, border: `1px solid ${pillarColor}40`, borderRadius: radius.card, padding: spacing[6], maxWidth: 520, width: "90%" }} onClick={(e) => e.stopPropagation()}>
        <h2 style={{ fontFamily: typography.h1.fontFamily, fontSize: typography.h1.fontSize, color: pillarColor, margin: 0, marginBottom: spacing[2] }}>{meme.title}</h2>
        <div style={{ display: "flex", gap: spacing[3], alignItems: "center", marginBottom: spacing[4] }}>
          <span style={{ backgroundColor: `${pillarColor}20`, color: pillarColor, borderRadius: radius.full, padding: "2px 10px", fontFamily: typography.caption.fontFamily, fontSize: 10, textTransform: "uppercase", letterSpacing: 1 }}>{meme.pillar}</span>
          <DifficultyDots level={meme.difficulty} />
        </div>

        {meme.caption && (
          <p style={{ fontFamily: typography.body.fontFamily, fontSize: typography.body.fontSize, color: colors.ivory, margin: 0, marginBottom: spacing[3], lineHeight: typography.body.lineHeight }}>{meme.caption}</p>
        )}

        {meme.translation && (
          <p style={{ fontFamily: typography.bodyItalic.fontFamily, fontStyle: typography.bodyItalic.fontStyle, fontSize: typography.body.fontSize, color: colors.zinc, margin: 0, marginBottom: spacing[3], lineHeight: typography.body.lineHeight }}>{meme.translation}</p>
        )}

        {meme.tags && meme.tags.length > 0 && (
          <div style={{ display: "flex", flexWrap: "wrap", gap: spacing[1], marginBottom: spacing[4] }}>
            {meme.tags.map((tag) => (
              <span key={tag} style={{ backgroundColor: colors.obsidian, color: colors.zinc, borderRadius: radius.full, padding: "2px 8px", fontFamily: typography.caption.fontFamily, fontSize: 10 }}>#{tag}</span>
            ))}
          </div>
        )}

        <button type="button" onClick={onClose} style={{ width: "100%", backgroundColor: "transparent", border: `1px solid ${colors.zinc}`, borderRadius: radius.btn, color: colors.ivory, padding: "10px 0", fontFamily: typography.ui.fontFamily, cursor: "pointer" }}>Close</button>
      </div>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/*  Meme Vault Page                                                    */
/* ------------------------------------------------------------------ */

export default function MemeVaultPage() {
  const [memes, setMemes] = useState<Meme[]>([]);
  const [loading, setLoading] = useState(true);
  const [activePillar, setActivePillar] = useState<Pillar | "all">("all");
  const [selectedDifficulty, setSelectedDifficulty] = useState<number | null>(null);
  const [selectedMeme, setSelectedMeme] = useState<Meme | null>(null);
  const [showSubmit, setShowSubmit] = useState(false);
  const [offset, setOffset] = useState(0);
  const [hasMore, setHasMore] = useState(true);

  const fetchMemes = useCallback(async (pillar: Pillar | "all", difficulty: number | null, newOffset = 0) => {
    setLoading(true);
    try {
      const params = new URLSearchParams({ limit: "20", offset: String(newOffset) });
      if (pillar !== "all") params.set("pillar", pillar);
      if (difficulty) params.set("difficulty", String(difficulty));

      const res = await fetch(`/api/meme-vault?${params}`);
      const data = await res.json();
      const newMemes = (data.memes || []) as Meme[];

      if (newOffset === 0) {
        setMemes(newMemes);
      } else {
        setMemes((prev) => [...prev, ...newMemes]);
      }
      setHasMore(newMemes.length >= 20);
      setOffset(newOffset);
    } catch (err) {
      console.error("Failed to fetch memes:", err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchMemes(activePillar, selectedDifficulty);
  }, [activePillar, selectedDifficulty, fetchMemes]);

  const handleSubmitMeme = async (meme: Partial<Meme>) => {
    try {
      const serviceKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || "";
      await fetch("/api/meme-vault", {
        method: "POST",
        headers: { "Content-Type": "application/json", Authorization: `Bearer ${serviceKey}` },
        body: JSON.stringify(meme),
      });
      fetchMemes(activePillar, selectedDifficulty);
    } catch (err) {
      console.error("Failed to submit meme:", err);
    }
  };

  return (
    <div style={{ minHeight: "100vh", backgroundColor: colors.obsidian, color: colors.ivory }}>
      {/* Header */}
      <header style={{ textAlign: "center", paddingTop: spacing[12], paddingBottom: spacing[6], paddingLeft: spacing[4], paddingRight: spacing[4] }}>
        <h1 style={{ fontFamily: typography.display.fontFamily, fontSize: typography.display.fontSize, lineHeight: typography.display.lineHeight, color: colors.ivory, margin: 0, paddingBottom: spacing[3] }}>Meme Vault</h1>
        <p style={{ fontFamily: typography.bodyItalic.fontFamily, fontStyle: typography.bodyItalic.fontStyle, fontSize: typography.body.fontSize, color: colors.zinc, margin: 0 }}>Cultural atoms. Internet artifacts. Teaching tools.</p>
      </header>

      {/* Pillar filters */}
      <div style={{ display: "flex", justifyContent: "center", gap: spacing[2], flexWrap: "wrap", paddingLeft: spacing[4], paddingRight: spacing[4], marginBottom: spacing[4] }}>
        {PILLARS.map(({ key, label, color }) => (
          <button
            key={key}
            type="button"
            onClick={() => setActivePillar(key)}
            style={{
              backgroundColor: activePillar === key ? `${color}20` : "transparent",
              border: `1px solid ${activePillar === key ? color : colors.borderSubtle}`,
              borderRadius: radius.full,
              padding: "6px 16px",
              color: activePillar === key ? color : colors.zinc,
              fontFamily: typography.ui.fontFamily,
              fontSize: 12,
              cursor: "pointer",
              transition: `all ${duration.fast}ms ease`,
            }}
          >
            {label}
          </button>
        ))}
      </div>

      {/* Difficulty filter */}
      <div style={{ display: "flex", justifyContent: "center", gap: spacing[3], marginBottom: spacing[6] }}>
        {[1, 2, 3, 4, 5].map((d) => (
          <button
            key={d}
            type="button"
            onClick={() => setSelectedDifficulty(selectedDifficulty === d ? null : d)}
            style={{
              backgroundColor: "transparent",
              border: "none",
              cursor: "pointer",
              padding: 0,
              display: "flex",
              gap: 2,
            }}
          >
            <DifficultyDots level={d} />
          </button>
        ))}
        {selectedDifficulty && (
          <button type="button" onClick={() => setSelectedDifficulty(null)} style={{ backgroundColor: "transparent", border: "none", color: colors.zinc, fontFamily: typography.caption.fontFamily, fontSize: 10, cursor: "pointer" }}>clear</button>
        )}
      </div>

      {/* Meme grid */}
      <main style={{ maxWidth: 1000, margin: "0 auto", paddingLeft: spacing[4], paddingRight: spacing[4], paddingBottom: spacing[8] }}>
        {loading && memes.length === 0 ? (
          <div style={{ textAlign: "center", paddingTop: spacing[12] }}>
            <span style={{ fontFamily: typography.ui.fontFamily, color: colors.zinc }}>Loading vault...</span>
          </div>
        ) : (
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(240px, 1fr))", gap: spacing[4] }}>
            {memes.map((meme) => (
              <MemeCard key={meme.id} meme={meme} onClick={() => setSelectedMeme(meme)} />
            ))}
          </div>
        )}

        {/* Load More */}
        {hasMore && memes.length > 0 && (
          <div style={{ textAlign: "center", paddingTop: spacing[6] }}>
            <button
              type="button"
              onClick={() => fetchMemes(activePillar, selectedDifficulty, offset + 20)}
              disabled={loading}
              style={{
                backgroundColor: "transparent",
                border: `1px solid ${colors.borderSubtle}`,
                borderRadius: radius.btn,
                color: colors.ivory,
                padding: "10px 28px",
                fontFamily: typography.ui.fontFamily,
                cursor: loading ? "wait" : "pointer",
                opacity: loading ? 0.5 : 1,
              }}
            >
              {loading ? "Loading..." : "Load More"}
            </button>
          </div>
        )}
      </main>

      {/* Submit FAB */}
      <button
        type="button"
        onClick={() => setShowSubmit(true)}
        style={{
          position: "fixed",
          bottom: spacing[6],
          right: spacing[6],
          backgroundColor: colors.phosphor,
          border: "none",
          borderRadius: radius.full,
          color: colors.obsidian,
          width: 48,
          height: 48,
          fontSize: 24,
          cursor: "pointer",
          boxShadow: `0 4px 20px ${colors.phosphor}40`,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        +
      </button>

      {/* Modals */}
      {selectedMeme && <MemeDetailModal meme={selectedMeme} onClose={() => setSelectedMeme(null)} />}
      {showSubmit && <SubmitModal onClose={() => setShowSubmit(false)} onSubmit={handleSubmitMeme} />}
    </div>
  );
}
