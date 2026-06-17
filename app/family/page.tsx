"use client";

import { FamilyChallenges } from "@/components/FamilyChallenges";
import React, { useState, useEffect, useCallback } from "react";
import { colors, spacing, radius, typography, duration } from "@/theme/tokens";
/*  Types                                                              */
/* ------------------------------------------------------------------ */

interface FamilyGroup {
  id: string;
  owner_id: string;
  max_members: number;
  plan_tier: string;
  stripe_subscription_id: string | null;
  is_active: boolean;
  created_at: string;
}

interface FamilyMember {
  id: string;
  group_id: string;
  user_id: string;
  role: "owner" | "member";
  joined_at: string;
  email?: string;
}

/* ------------------------------------------------------------------ */
/*  Family Plan Page                                                   */
/* ------------------------------------------------------------------ */

export default function FamilyPage() {
  const [group, setGroup] = useState<FamilyGroup | null>(null);
  const [members, setMembers] = useState<FamilyMember[]>([]);
  const [loading, setLoading] = useState(true);
  const [creating, setCreating] = useState(false);
  const [showInvite, setShowInvite] = useState(false);
  const [inviteEmail, setInviteEmail] = useState("");
  const [inviting, setInviting] = useState(false);
  const [copied, setCopied] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Load family group
  useEffect(() => {
    async function loadFamily() {
      try {
        // Use a placeholder user_id — in production this comes from auth context
        const userId = "current";
        const res = await fetch(`/api/family?user_id=${userId}`);
        if (res.ok) {
          const data = await res.json();
          if (data.group) {
            setGroup(data.group);
            setMembers(data.members || []);
          }
        }
      } catch {
        // No group yet
      } finally {
        setLoading(false);
      }
    }
    loadFamily();
  }, []);

  const handleCreateGroup = useCallback(async () => {
    setCreating(true);
    setError(null);
    try {
      const res = await fetch("/api/family", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ user_id: "current", max_members: 3 }),
      });

      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error || "Failed to create group");
      }

      const data = await res.json();
      setGroup(data.group);
      setMembers(data.members || [data.owner_member]);

      // Redirect to Stripe checkout
      const checkoutRes = await fetch("/api/checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ price_id: "family_monthly", user_id: "current" }),
      });

      if (checkoutRes.ok) {
        const checkoutData = await checkoutRes.json();
        if (checkoutData.url) {
          window.location.href = checkoutData.url;
        }
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to create group");
    } finally {
      setCreating(false);
    }
  }, []);

  const handleInvite = useCallback(async () => {
    if (!inviteEmail || !group) return;
    setInviting(true);
    setError(null);
    try {
      const res = await fetch("/api/family", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action: "invite", group_id: group.id, email: inviteEmail }),
      });

      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error || "Failed to invite member");
      }

      const data = await res.json();
      setMembers((prev) => [...prev, data.member]);
      setInviteEmail("");
      setShowInvite(false);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to invite");
    } finally {
      setInviting(false);
    }
  }, [inviteEmail, group]);

  const handleRemoveMember = useCallback(async (memberId: string) => {
    if (!group) return;
    try {
      await fetch(`/api/family?member_id=${memberId}&group_id=${group.id}`, {
        method: "DELETE",
      });
      setMembers((prev) => prev.filter((m) => m.id !== memberId));
    } catch (err) {
      console.error("Failed to remove member:", err);
    }
  }, [group]);

  const handleCopyCode = useCallback(() => {
    if (group) {
      navigator.clipboard.writeText(group.id).then(() => {
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
      });
    }
  }, [group]);

  const spotsUsed = members.length;
  const maxSpots = group?.max_members || 3;

  return (
    <div style={{ minHeight: "100vh", backgroundColor: colors.obsidian, color: colors.ivory }}>
      {/* Header */}
      <header style={{ textAlign: "center", paddingTop: spacing[12], paddingBottom: spacing[6], paddingLeft: spacing[4], paddingRight: spacing[4] }}>
        <h1 style={{ fontFamily: typography.display.fontFamily, fontSize: typography.display.fontSize, lineHeight: typography.display.lineHeight, color: colors.ivory, margin: 0, paddingBottom: spacing[3] }}>Family Plan</h1>
        <p style={{ fontFamily: typography.bodyItalic.fontFamily, fontStyle: typography.bodyItalic.fontStyle, fontSize: typography.body.fontSize, color: colors.zinc, margin: 0 }}>
          Up to {maxSpots} profiles. R$ 149/month.
        </p>
      </header>

      <main style={{ maxWidth: 720, margin: "0 auto", paddingLeft: spacing[4], paddingRight: spacing[4], paddingBottom: spacing[8] }}>
        {loading ? (
          <div style={{ textAlign: "center", paddingTop: spacing[12] }}>
            <span style={{ fontFamily: typography.ui.fontFamily, color: colors.zinc }}>Loading...</span>
          </div>
        ) : !group ? (
          /* No group — create CTA */
          <div style={{ backgroundColor: colors.surface, border: `1px solid ${colors.borderSubtle}`, borderRadius: radius.card, padding: spacing[8], textAlign: "center" }}>
            <p style={{ fontFamily: typography.body.fontFamily, fontSize: typography.body.fontSize, color: colors.onSurfaceVariant, margin: 0, marginBottom: spacing[6] }}>
              Create a family group to share your Lexio Underground subscription with up to {maxSpots} people.
            </p>
            <ul style={{ listStyle: "none", padding: 0, margin: 0, marginBottom: spacing[6], textAlign: "left" }}>
              {["Up to 3 profiles per group", "Full access to all features", "Shared Palace rooms", "Family activity dashboard"].map((item) => (
                <li key={item} style={{ fontFamily: typography.ui.fontFamily, fontSize: 13, color: colors.ivory, paddingTop: spacing[2], paddingBottom: spacing[2], display: "flex", alignItems: "center", gap: spacing[2] }}>
                  <span style={{ color: colors.phosphor }}>✓</span> {item}
                </li>
              ))}
            </ul>
            <button
              type="button"
              onClick={handleCreateGroup}
              disabled={creating}
              style={{
                backgroundColor: colors.phosphor,
                border: "none",
                borderRadius: radius.btn,
                color: colors.obsidian,
                padding: "14px 32px",
                fontFamily: typography.ui.fontFamily,
                fontSize: 16,
                fontWeight: 600,
                cursor: creating ? "wait" : "pointer",
                opacity: creating ? 0.6 : 1,
                width: "100%",
              }}
            >
              {creating ? "Creating..." : "Start Family Plan"}
            </button>
          </div>
        ) : (
          /* Group exists — show details */
          <div style={{ display: "flex", flexDirection: "column", gap: spacing[4] }}>
            {/* Group card */}
            <div style={{ backgroundColor: colors.surface, border: `1px solid ${colors.borderSubtle}`, borderRadius: radius.card, padding: spacing[4] }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: spacing[3] }}>
                <span style={{ fontFamily: typography.h2.fontFamily, fontSize: typography.h2.fontSize, color: colors.ivory }}>Your Family</span>
                <span style={{
                  backgroundColor: group.is_active ? `${colors.phosphor}20` : `${colors.crimson}20`,
                  color: group.is_active ? colors.phosphor : colors.crimson,
                  borderRadius: radius.full,
                  padding: "4px 12px",
                  fontFamily: typography.caption.fontFamily,
                  fontSize: 11,
                  textTransform: "uppercase",
                  letterSpacing: 1,
                }}>
                  {group.is_active ? "Active" : "Inactive"}
                </span>
              </div>

              {/* Invite code */}
              <div style={{ display: "flex", alignItems: "center", gap: spacing[2], marginBottom: spacing[4] }}>
                <span style={{ fontFamily: typography.caption.fontFamily, fontSize: typography.caption.fontSize, color: colors.zinc }}>Invite code:</span>
                <button
                  type="button"
                  onClick={handleCopyCode}
                  style={{
                    backgroundColor: colors.obsidian,
                    border: `1px solid ${colors.borderSubtle}`,
                    borderRadius: radius.btn,
                    padding: "4px 12px",
                    fontFamily: typography.ui.fontFamily,
                    fontSize: 12,
                    color: colors.phosphor,
                    cursor: "pointer",
                    letterSpacing: 1,
                  }}
                >
                  {copied ? "Copied!" : `${group.id.slice(0, 8)}...`}
                </button>
              </div>

              {/* Spots indicator */}
              <div style={{ marginBottom: spacing[4] }}>
                <div style={{ display: "flex", justifyContent: "space-between", marginBottom: spacing[1] }}>
                  <span style={{ fontFamily: typography.caption.fontFamily, fontSize: typography.caption.fontSize, color: colors.zinc }}>{spotsUsed} of {maxSpots} spots used</span>
                </div>
                <div style={{ width: "100%", height: 4, backgroundColor: colors.obsidian, borderRadius: radius.full, overflow: "hidden" }}>
                  <div style={{ width: `${(spotsUsed / maxSpots) * 100}%`, height: "100%", backgroundColor: colors.phosphor, borderRadius: radius.full, transition: `width ${duration.normal}ms ease` }} />
                </div>
              </div>

              {/* Member list */}
              <div style={{ display: "flex", flexDirection: "column", gap: spacing[2] }}>
                {members.map((member) => (
                  <div key={member.id} style={{ display: "flex", alignItems: "center", justifyContent: "space-between", paddingTop: spacing[2], paddingBottom: spacing[2], borderBottom: `1px solid ${colors.borderSubtle}` }}>
                    <div style={{ display: "flex", alignItems: "center", gap: spacing[2] }}>
                      {/* Avatar circle */}
                      <div style={{
                        width: 32,
                        height: 32,
                        borderRadius: "50%",
                        backgroundColor: member.role === "owner" ? colors.phosphor : colors.zinc,
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        fontFamily: typography.ui.fontFamily,
                        fontSize: 12,
                        fontWeight: 600,
                        color: colors.obsidian,
                      }}>
                        {member.role === "owner" ? "O" : "M"}
                      </div>
                      <div>
                        <span style={{ fontFamily: typography.ui.fontFamily, fontSize: 13, color: colors.ivory, display: "block" }}>
                          {member.email || member.user_id.slice(0, 12)}
                        </span>
                        <span style={{ fontFamily: typography.caption.fontFamily, fontSize: 10, color: colors.zinc, textTransform: "uppercase", letterSpacing: 1 }}>
                          {member.role}
                        </span>
                      </div>
                    </div>
                    {member.role !== "owner" && (
                      <button
                        type="button"
                        onClick={() => handleRemoveMember(member.id)}
                        style={{
                          backgroundColor: "transparent",
                          border: "none",
                          color: colors.zinc,
                          cursor: "pointer",
                          fontSize: 16,
                          padding: "4px 8px",
                        }}
                      >
                        ×
                      </button>
                    )}
                  </div>
                ))}
              </div>
            </div>

            {/* Action buttons */}
            <div style={{ display: "flex", gap: spacing[3] }}>
              {spotsUsed < maxSpots && (
                <button
                  type="button"
                  onClick={() => setShowInvite(true)}
                  style={{
                    flex: 1,
                    backgroundColor: colors.phosphor,
                    border: "none",
                    borderRadius: radius.btn,
                    color: colors.obsidian,
                    padding: "12px 0",
                    fontFamily: typography.ui.fontFamily,
                    fontWeight: 600,
                    cursor: "pointer",
                  }}
                >
                  Invite Member
                </button>
              )}
              <button
                type="button"
                onClick={async () => {
                  const res = await fetch("/api/checkout", {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({ action: "portal", user_id: "current" }),
                  });
                  if (res.ok) {
                    const data = await res.json();
                    if (data.url) window.location.href = data.url;
                  }
                }}
                style={{
                  flex: 1,
                  backgroundColor: "transparent",
                  border: `1px solid ${colors.borderSubtle}`,
                  borderRadius: radius.btn,
                  color: colors.ivory,
                  padding: "12px 0",
                  fontFamily: typography.ui.fontFamily,
                  cursor: "pointer",
                }}
              >
                Manage Subscription
              </button>
            </div>
          </div>
        )}

        {/* Family Challenges — only show when group exists */}
        {group && members.length > 0 && (
          <div style={{
            marginTop: spacing[8],
            backgroundColor: colors.surface,
            border: `1px solid ${colors.borderSubtle}`,
            borderRadius: radius.card,
            padding: spacing[6],
          }}>
            <h2 style={{
              fontFamily: typography.h2.fontFamily,
              fontSize: typography.h2.fontSize,
              color: colors.ivory,
              margin: 0,
              marginBottom: spacing[4],
            }}>
              🎭 Desafios Culturais
            </h2>
            <p style={{
              fontFamily: typography.bodyItalic.fontFamily,
              fontStyle: typography.bodyItalic.fontStyle,
              fontSize: typography.body.fontSize,
              color: colors.zinc,
              margin: 0,
              marginBottom: spacing[4],
            }}>
              Compartilhe palavras, memes e descobertas culturais com sua família. Sem pontuação — só descoberta mútua.
            </p>
            <FamilyChallenges
              currentUserId="current"
              members={members}
            />
          </div>
        )}

        {/* Error */}
        {error && (
          <p style={{ fontFamily: typography.ui.fontFamily, fontSize: 13, color: colors.crimson, textAlign: "center", marginTop: spacing[4] }}>{error}</p>
        )}
      </main>

      {/* Invite modal */}
      {showInvite && (
        <div style={{ position: "fixed", inset: 0, backgroundColor: "rgba(13,13,15,0.85)", display: "flex", alignItems: "center", justifyContent: "center", zIndex: 100 }} onClick={() => setShowInvite(false)}>
          <div style={{ backgroundColor: colors.surface, border: `1px solid ${colors.borderSubtle}`, borderRadius: radius.card, padding: spacing[6], maxWidth: 400, width: "90%" }} onClick={(e) => e.stopPropagation()}>
            <h2 style={{ fontFamily: typography.h2.fontFamily, fontSize: typography.h2.fontSize, color: colors.ivory, margin: 0, marginBottom: spacing[4] }}>Invite Member</h2>
            <input
              type="email"
              placeholder="member@email.com"
              value={inviteEmail}
              onChange={(e) => setInviteEmail(e.target.value)}
              style={{
                width: "100%",
                backgroundColor: colors.obsidian,
                border: `1px solid ${colors.borderSubtle}`,
                borderRadius: radius.btn,
                padding: "10px 14px",
                color: colors.ivory,
                fontFamily: typography.ui.fontFamily,
                fontSize: typography.ui.fontSize,
                outline: "none",
                marginBottom: spacing[4],
              }}
            />
            <div style={{ display: "flex", gap: spacing[3] }}>
              <button type="button" onClick={() => setShowInvite(false)} style={{ flex: 1, backgroundColor: "transparent", border: `1px solid ${colors.zinc}`, borderRadius: radius.btn, color: colors.ivory, padding: "10px 0", fontFamily: typography.ui.fontFamily, cursor: "pointer" }}>Cancel</button>
              <button type="button" onClick={handleInvite} disabled={inviting || !inviteEmail} style={{ flex: 1, backgroundColor: colors.phosphor, border: "none", borderRadius: radius.btn, color: colors.obsidian, padding: "10px 0", fontFamily: typography.ui.fontFamily, fontWeight: 600, cursor: inviting ? "wait" : "pointer", opacity: inviting || !inviteEmail ? 0.5 : 1 }}>{inviting ? "Inviting..." : "Send Invite"}</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
