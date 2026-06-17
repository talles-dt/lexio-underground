"use client";

import React, { useState, useEffect, useCallback } from "react";
import { colors, spacing, radius, typography, duration } from "@/theme/tokens";
import { supabase } from "@/lib/auth";

/* ------------------------------------------------------------------ */
/*  Types                                                              */
/* ------------------------------------------------------------------ */

interface FamilyChallenge {
  id: string;
  sender_id: string;
  receiver_id: string;
  language: string;
  content_type: "text" | "image" | "audio";
  content: string;
  caption: string;
  answer_revealed: boolean;
  created_at: string;
  expires_at: string;
  sender_email?: string;
  receiver_email?: string;
}

interface FamilyMember {
  id: string;
  group_id?: string;
  user_id: string;
  role: "owner" | "member";
  joined_at?: string;
  email?: string;
}

interface FamilyChallengesProps {
  currentUserId: string;
  members: FamilyMember[];
  onBack?: () => void;
}

/* ------------------------------------------------------------------ */
/*  Challenge card                                                      */
/* ------------------------------------------------------------------ */

function ChallengeCard({
  challenge,
  isSender,
  onReveal,
}: {
  challenge: FamilyChallenge;
  isSender: boolean;
  onReveal: (id: string) => void;
}) {
  const [expanded, setExpanded] = useState(false);
  const isExpired = new Date(challenge.expires_at) < new Date();
  const canReveal = !challenge.answer_revealed && (isExpired || isSender);

  const timeLeft = useCallback(() => {
    const diff = new Date(challenge.expires_at).getTime() - Date.now();
    if (diff <= 0) return "Expirado";
    const hours = Math.floor(diff / (1000 * 60 * 60));
    const mins = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
    if (hours > 24) return `${Math.floor(hours / 24)}d ${hours % 24}h`;
    return `${hours}h ${mins}m`;
  }, [challenge.expires_at]);

  return (
    <div
      onClick={() => setExpanded(!expanded)}
      style={{
        backgroundColor: colors.surface,
        border: `1px solid ${colors.borderSubtle}`,
        borderRadius: radius.card,
        padding: spacing[4],
        cursor: "pointer",
        transition: `border-color ${duration.fast}ms ease`,
      }}
    >
      {/* Header */}
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: spacing[2] }}>
        <div style={{ display: "flex", alignItems: "center", gap: spacing[2] }}>
          <span style={{ fontSize: 18 }}>
            {challenge.content_type === "text" ? "💬" : challenge.content_type === "image" ? "🖼" : "🎵"}
          </span>
          <span style={{
            fontFamily: typography.ui.fontFamily,
            fontSize: typography.ui.fontSize,
            fontWeight: 600,
            color: colors.ivory,
          }}>
            {isSender ? `Para: ${challenge.receiver_email || "..."}` : `De: ${challenge.sender_email || "..."}`}
          </span>
        </div>
        <span style={{
          fontFamily: typography.caption.fontFamily,
          fontSize: 11,
          color: isExpired ? colors.crimson : colors.zinc,
        }}>
          {isSender ? "Enviado" : timeLeft()}
        </span>
      </div>

      {/* Preview */}
      <p style={{
        fontFamily: typography.body.fontFamily,
        fontSize: typography.body.fontSize,
        color: colors.zinc,
        margin: 0,
        lineHeight: 1.5,
      }}>
        {challenge.caption.length > 100 && !expanded
          ? challenge.caption.slice(0, 100) + "..."
          : challenge.caption}
      </p>

      {/* Expanded content */}
      {expanded && (
        <div style={{ marginTop: spacing[3] }}>
          {/* Content */}
          <div style={{
            backgroundColor: colors.obsidian,
            borderRadius: radius.sm,
            padding: spacing[3],
            marginBottom: spacing[3],
          }}>
            <p style={{
              fontFamily: typography.body.fontFamily,
              fontSize: 15,
              color: colors.ivory,
              margin: 0,
              lineHeight: 1.6,
            }}>
              {challenge.content}
            </p>
          </div>

          {/* Answer / Reveal */}
          {challenge.answer_revealed ? (
            <div style={{
              backgroundColor: `${colors.phosphor}10`,
              border: `1px solid ${colors.phosphor}30`,
              borderRadius: radius.sm,
              padding: spacing[3],
            }}>
              <span style={{
                fontFamily: typography.caption.fontFamily,
                fontSize: 11,
                color: colors.phosphor,
                textTransform: "uppercase" as const,
                letterSpacing: 1,
              }}>
                Resposta revelada
              </span>
            </div>
          ) : canReveal ? (
            <button
              onClick={(e) => { e.stopPropagation(); onReveal(challenge.id); }}
              style={{
                backgroundColor: colors.phosphor,
                color: colors.obsidian,
                border: "none",
                borderRadius: radius.btn,
                padding: `${spacing[2]}px ${spacing[4]}px`,
                cursor: "pointer",
                fontFamily: typography.ui.fontFamily,
                fontSize: typography.ui.fontSize,
                fontWeight: 600,
              }}
            >
              Revelar resposta
            </button>
          ) : (
            <p style={{
              fontFamily: typography.caption.fontFamily,
              fontSize: 11,
              color: colors.zinc,
              margin: 0,
            }}>
              A resposta será revelada automaticamente em {timeLeft()}
            </p>
          )}
        </div>
      )}
    </div>
  );
}

/* ------------------------------------------------------------------ */
/*  Send challenge form                                                 */
/* ------------------------------------------------------------------ */

function SendChallengeForm({
  members,
  currentUserId,
  onSent,
  onCancel,
}: {
  members: FamilyMember[];
  currentUserId: string;
  onSent: () => void;
  onCancel: () => void;
}) {
  const [receiverId, setReceiverId] = useState("");
  const [content, setContent] = useState("");
  const [caption, setCaption] = useState("");
  const [language, setLanguage] = useState("pt-BR");
  const [sending, setSending] = useState(false);
  const [error, setError] = useState("");

  const recipients = members.filter((m) => m.user_id !== currentUserId);

  const handleSend = async () => {
    if (!receiverId) { setError("Selecione um destinatário."); return; }
    if (!content.trim()) { setError("Escreva o conteúdo do desafio."); return; }
    if (content.length > 280) { setError("Máximo 280 caracteres."); return; }

    setSending(true);
    setError("");

    try {
      const client = supabase();
      const { error: insertError } = await client.from("family_challenges").insert({
        sender_id: currentUserId,
        receiver_id: receiverId,
        language,
        content_type: "text",
        content: content.trim(),
        caption: caption.trim() || content.trim(),
        answer_revealed: false,
        expires_at: new Date(Date.now() + 48 * 60 * 60 * 1000).toISOString(),
      });

      if (insertError) {
        setError(insertError.message);
      } else {
        onSent();
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "Erro ao enviar.");
    } finally {
      setSending(false);
    }
  };

  return (
    <div style={{
      backgroundColor: colors.surface,
      border: `1px solid ${colors.borderSubtle}`,
      borderRadius: radius.card,
      padding: spacing[4],
    }}>
      <h3 style={{
        fontFamily: typography.h2.fontFamily,
        fontSize: 18,
        color: colors.ivory,
        margin: 0,
        marginBottom: spacing[4],
      }}>
        Enviar desafio cultural
      </h3>

      {/* Recipient */}
      <div style={{ marginBottom: spacing[3] }}>
        <label style={labelStyle}>Para</label>
        <select
          value={receiverId}
          onChange={(e) => setReceiverId(e.target.value)}
          style={selectStyle}
        >
          <option value="">Selecione um membro...</option>
          {recipients.map((m) => (
            <option key={m.id} value={m.user_id}>
              {m.email || m.user_id}
            </option>
          ))}
        </select>
      </div>

      {/* Content */}
      <div style={{ marginBottom: spacing[3] }}>
        <label style={labelStyle}>
          Conteúdo <span style={{ color: colors.zinc, fontWeight: 400 }}>({content.length}/280)</span>
        </label>
        <textarea
          value={content}
          onChange={(e) => setContent(e.target.value.slice(0, 280))}
          placeholder="Ex: 'Saudade' — O que você acha que significa?"
          style={{
            ...inputStyle,
            minHeight: 80,
            resize: "vertical" as const,
          }}
        />
      </div>

      {/* Caption */}
      <div style={{ marginBottom: spacing[4] }}>
        <label style={labelStyle}>Legenda (opcional)</label>
        <input
          type="text"
          value={caption}
          onChange={(e) => setCaption(e.target.value)}
          placeholder="Ex: Aprendi essa palavra hoje — consegue adivinhar?"
          style={inputStyle}
        />
      </div>

      {error && (
        <p style={{
          fontFamily: typography.caption.fontFamily,
          fontSize: 12,
          color: colors.crimson,
          margin: 0,
          marginBottom: spacing[3],
        }}>
          {error}
        </p>
      )}

      <div style={{ display: "flex", gap: spacing[2] }}>
        <button
          onClick={handleSend}
          disabled={sending}
          style={{
            backgroundColor: colors.phosphor,
            color: colors.obsidian,
            border: "none",
            borderRadius: radius.btn,
            padding: `${spacing[2]}px ${spacing[4]}px`,
            cursor: sending ? "not-allowed" : "pointer",
            fontFamily: typography.ui.fontFamily,
            fontSize: typography.ui.fontSize,
            fontWeight: 600,
            opacity: sending ? 0.5 : 1,
          }}
        >
          {sending ? "Enviando..." : "Enviar desafio"}
        </button>
        <button
          onClick={onCancel}
          style={{
            backgroundColor: "transparent",
            color: colors.zinc,
            border: `1px solid ${colors.borderSubtle}`,
            borderRadius: radius.btn,
            padding: `${spacing[2]}px ${spacing[4]}px`,
            cursor: "pointer",
            fontFamily: typography.ui.fontFamily,
            fontSize: typography.ui.fontSize,
          }}
        >
          Cancelar
        </button>
      </div>
    </div>
  );
}

const labelStyle: React.CSSProperties = {
  display: "block",
  color: colors.zinc,
  fontSize: typography.ui.fontSize,
  fontFamily: typography.ui.fontFamily,
  marginBottom: spacing[1],
};

const inputStyle: React.CSSProperties = {
  width: "100%",
  boxSizing: "border-box" as const,
  backgroundColor: colors.obsidian,
  border: `1px solid ${colors.borderSubtle}`,
  borderRadius: radius.sm,
  color: colors.ivory,
  fontSize: 15,
  padding: spacing[2],
  fontFamily: typography.body.fontFamily,
  outline: "none",
};

const selectStyle: React.CSSProperties = {
  ...inputStyle,
  cursor: "pointer",
};

/* ------------------------------------------------------------------ */
/*  Main FamilyChallenges component                                     */
/* ------------------------------------------------------------------ */

export function FamilyChallenges({
  currentUserId,
  members,
}: FamilyChallengesProps) {
  const [challenges, setChallenges] = useState<FamilyChallenge[]>([]);
  const [loading, setLoading] = useState(true);
  const [showSendForm, setShowSendForm] = useState(false);
  const [tab, setTab] = useState<"received" | "sent">("received");

  const fetchChallenges = useCallback(async () => {
    try {
      const client = supabase();
      const { data } = await client
        .from("family_challenges")
        .select("*")
        .or(`sender_id.eq.${currentUserId},receiver_id.eq.${currentUserId}`)
        .order("created_at", { ascending: false })
        .limit(50);

      setChallenges((data as FamilyChallenge[]) || []);
    } catch {
      // Silently fail
    } finally {
      setLoading(false);
    }
  }, [currentUserId]);

  useEffect(() => {
    fetchChallenges();
  }, [fetchChallenges]);

  const handleReveal = async (id: string) => {
    try {
      const client = supabase();
      await client
        .from("family_challenges")
        .update({ answer_revealed: true })
        .eq("id", id);
      setChallenges((prev) =>
        prev.map((c) => (c.id === id ? { ...c, answer_revealed: true } : c))
      );
    } catch {
      // Silently fail
    }
  };

  const received = challenges.filter((c) => c.receiver_id === currentUserId);
  const sent = challenges.filter((c) => c.sender_id === currentUserId);
  const displayList = tab === "received" ? received : sent;

  return (
    <div>
      {/* Header */}
      <div style={{
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        marginBottom: spacing[4],
      }}>
        <div style={{ display: "flex", gap: spacing[2] }}>
          <button
            onClick={() => setTab("received")}
            style={{
              background: "none",
              border: "none",
              borderBottom: tab === "received" ? `2px solid ${colors.phosphor}` : "2px solid transparent",
              color: tab === "received" ? colors.phosphor : colors.zinc,
              cursor: "pointer",
              fontFamily: typography.ui.fontFamily,
              fontSize: typography.ui.fontSize,
              fontWeight: tab === "received" ? 600 : 400,
              paddingBottom: spacing[1],
            }}
          >
            Recebidos ({received.length})
          </button>
          <button
            onClick={() => setTab("sent")}
            style={{
              background: "none",
              border: "none",
              borderBottom: tab === "sent" ? `2px solid ${colors.phosphor}` : "2px solid transparent",
              color: tab === "sent" ? colors.phosphor : colors.zinc,
              cursor: "pointer",
              fontFamily: typography.ui.fontFamily,
              fontSize: typography.ui.fontSize,
              fontWeight: tab === "sent" ? 600 : 400,
              paddingBottom: spacing[1],
            }}
          >
            Enviados ({sent.length})
          </button>
        </div>

        <button
          onClick={() => setShowSendForm(!showSendForm)}
          style={{
            backgroundColor: showSendForm ? "transparent" : colors.phosphor,
            color: showSendForm ? colors.zinc : colors.obsidian,
            border: showSendForm ? `1px solid ${colors.borderSubtle}` : "none",
            borderRadius: radius.btn,
            padding: `${spacing[2]}px ${spacing[3]}px`,
            cursor: "pointer",
            fontFamily: typography.ui.fontFamily,
            fontSize: typography.caption.fontSize,
            fontWeight: 600,
          }}
        >
          {showSendForm ? "Fechar" : "+ Novo desafio"}
        </button>
      </div>

      {/* Send form */}
      {showSendForm && (
        <div style={{ marginBottom: spacing[4] }}>
          <SendChallengeForm
            members={members}
            currentUserId={currentUserId}
            onSent={() => { setShowSendForm(false); fetchChallenges(); }}
            onCancel={() => setShowSendForm(false)}
          />
        </div>
      )}

      {/* Challenge list */}
      {loading ? (
        <p style={{
          fontFamily: typography.bodyItalic.fontFamily,
          fontStyle: typography.bodyItalic.fontStyle,
          color: colors.zinc,
          textAlign: "center",
          padding: spacing[6],
        }}>
          Carregando desafios...
        </p>
      ) : displayList.length === 0 ? (
        <div style={{
          textAlign: "center",
          padding: spacing[6],
          color: colors.zinc,
        }}>
          <div style={{ fontSize: 32, marginBottom: spacing[2] }}>🎭</div>
          <p style={{
            fontFamily: typography.bodyItalic.fontFamily,
            fontStyle: typography.bodyItalic.fontStyle,
            margin: 0,
          }}>
            {tab === "received"
              ? "Nenhum desafio recebido ainda."
              : "Você não enviou nenhum desafio ainda."}
          </p>
          <p style={{
            fontFamily: typography.caption.fontFamily,
            fontSize: typography.caption.fontSize,
            color: `${colors.zinc}80`,
            marginTop: spacing[2],
          }}>
            Compartilhe palavras, memes e descobertas culturais com sua família.
          </p>
        </div>
      ) : (
        <div style={{ display: "flex", flexDirection: "column", gap: spacing[3] }}>
          {displayList.map((challenge) => (
            <ChallengeCard
              key={challenge.id}
              challenge={challenge}
              isSender={challenge.sender_id === currentUserId}
              onReveal={handleReveal}
            />
          ))}
        </div>
      )}
    </div>
  );
}
