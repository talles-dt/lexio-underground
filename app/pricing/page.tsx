"use client";

import React, { useState } from "react";
import { colors, spacing, radius, typography, duration } from "@/theme/tokens";

/* ------------------------------------------------------------------ */
/*  Constants                                                          */
/* ------------------------------------------------------------------ */

type Tier = "free" | "pro-monthly" | "pro-annual" | "pro-lifetime" | "family";

interface TierData {
  id: Tier;
  name: string;
  price: string;
  period: string;
  tagline: string;
  features: string[];
  excluded: string[];
  cta: string;
  highlight: boolean;
}

const TIERS: TierData[] = [
  {
    id: "free",
    name: "Free",
    price: "R$ 0",
    period: "",
    tagline: "Start your journey",
    features: [
      "Cartografa diagnostic + full report",
      "Basic non-adaptive roadmap (tier 1)",
      "Pulse Mode unlimited (3-min bursts)",
      "5 palace rooms, 50 items",
    ],
    excluded: [
      "No Deep Mode",
      "No AI Conversation Shadow",
      "No Cultural Atom Vault",
      "No Stealth Mode",
    ],
    cta: "Start Free",
    highlight: false,
  },
  {
    id: "pro-monthly",
    name: "Pro Monthly",
    price: "R$ 99",
    period: "/month",
    tagline: "Cancel anytime",
    features: [
      "Full adaptive learning engine",
      "Unlimited palace rooms & items",
      "Deep Mode (30-40 min sessions)",
      "AI Conversation Shadow",
      "Cultural Atom Vault (meme library)",
      "Stealth Mode + speech prosody coach",
      "Cross-language detection",
    ],
    excluded: [],
    cta: "Subscribe Monthly",
    highlight: false,
  },
  {
    id: "pro-annual",
    name: "Pro Annual",
    price: "R$ 79",
    period: "/month",
    tagline: "Save R$ 240/year — the price of two meals",
    features: [
      "Everything in Pro Monthly",
      "R$ 948 billed annually",
      "Priority roadmap influence",
    ],
    excluded: [],
    cta: "Subscribe Annual",
    highlight: true,
  },
  {
    id: "pro-lifetime",
    name: "Founding Member",
    price: "R$ 1,499",
    period: "one-time",
    tagline: "Cartografa completers only",
    features: [
      "Permanent Pro access (no monthly fees, ever)",
      "All future languages at launch",
      "Early access to new features",
      "Stealth Mode + Live Conversation Shadow",
      "Founding Member badge (profile + shareable)",
      "Name in the Lexio Underground Archives (opt-in)",
    ],
    excluded: [
      "No physical goods or swag",
      "No dedicated support SLA",
    ],
    cta: "Become a Founder",
    highlight: false,
  },
  {
    id: "family",
    name: "Family Plan",
    price: "R$ 149",
    period: "/month",
    tagline: "Up to 3 profiles",
    features: [
      "Everything in Pro",
      "3 independent learner profiles",
      "Family challenges & leaderboard",
      "Shared palace entry hall",
    ],
    excluded: [],
    cta: "Subscribe Family",
    highlight: false,
  },
];

/* ------------------------------------------------------------------ */
/*  Components                                                         */
/* ------------------------------------------------------------------ */

function CheckIcon({ color }: { color: string }) {
  return (
    <svg width="16" height="16" viewBox="0 0 16 16" fill="none" style={{ flexShrink: 0, marginTop: 2 }}>
      <path d="M3.5 8.5L6.5 11.5L12.5 4.5" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

function XIcon({ color }: { color: string }) {
  return (
    <svg width="16" height="16" viewBox="0 0 16 16" fill="none" style={{ flexShrink: 0, marginTop: 2 }}>
      <path d="M4 4L12 12M12 4L4 12" stroke={color} strokeWidth="1.5" strokeLinecap="round" />
    </svg>
  );
}

function TierCard({ tier, onSelect }: { tier: TierData; onSelect: (t: Tier) => void }) {
  const isLifetime = tier.id === "pro-lifetime";
  const isFamily = tier.id === "family";
  const accentColor = isLifetime ? colors.amber : isFamily ? colors.phosphor : colors.crimson;

  return (
    <div
      style={{
        position: "relative",
        display: "flex",
        flexDirection: "column",
        backgroundColor: colors.surface,
        border: tier.highlight ? `2px solid ${colors.phosphor}` : `1px solid ${colors.borderSubtle}`,
        borderRadius: radius.card,
        padding: spacing[6],
        transition: `all ${duration.normal}ms ease`,
        cursor: "pointer",
        boxShadow: tier.highlight ? `0 0 24px ${colors.phosphor}20` : "none",
      }}
      onMouseEnter={(e) => {
        (e.currentTarget as HTMLElement).style.borderColor = accentColor;
        (e.currentTarget as HTMLElement).style.transform = "translateY(-2px)";
      }}
      onMouseLeave={(e) => {
        (e.currentTarget as HTMLElement).style.borderColor = tier.highlight ? colors.phosphor : colors.borderSubtle;
        (e.currentTarget as HTMLElement).style.transform = "translateY(0)";
      }}
    >
      {/* Badge */}
      {tier.highlight && (
        <div style={{
          position: "absolute",
          top: -12,
          left: "50%",
          transform: "translateX(-50%)",
          backgroundColor: colors.phosphor,
          color: colors.obsidian,
          fontFamily: typography.caption.fontFamily,
          fontSize: 10,
          fontWeight: 700,
          textTransform: "uppercase",
          letterSpacing: 2,
          padding: "4px 14px",
          borderRadius: 20,
        }}>
          Best Value
        </div>
      )}

      {isLifetime && (
        <div style={{
          position: "absolute",
          top: -12,
          left: "50%",
          transform: "translateX(-50%)",
          backgroundColor: colors.amber,
          color: colors.obsidian,
          fontFamily: typography.caption.fontFamily,
          fontSize: 10,
          fontWeight: 700,
          textTransform: "uppercase",
          letterSpacing: 2,
          padding: "4px 14px",
          borderRadius: 20,
        }}>
          Founding
        </div>
      )}

      {/* Tier name */}
      <h3 style={{
        fontFamily: typography.h2.fontFamily,
        fontSize: typography.h2.fontSize,
        lineHeight: typography.h2.lineHeight,
        color: isLifetime ? colors.amber : colors.ivory,
        margin: 0,
        paddingBottom: spacing[1],
      }}>
        {tier.name}
      </h3>

      {/* Price */}
      <div style={{ display: "flex", alignItems: "baseline", gap: spacing[1], paddingBottom: spacing[1] }}>
        <span style={{
          fontFamily: typography.display.fontFamily,
          fontSize: 36,
          color: accentColor,
          lineHeight: 1,
        }}>
          {tier.price}
        </span>
        {tier.period && (
          <span style={{
            fontFamily: typography.body.fontFamily,
            fontSize: 14,
            color: colors.zinc,
          }}>
            {tier.period}
          </span>
        )}
      </div>

      {/* Tagline */}
      <p style={{
        fontFamily: typography.bodyItalic.fontFamily,
        fontStyle: typography.bodyItalic.fontStyle,
        fontSize: 13,
        color: colors.zinc,
        margin: 0,
        paddingBottom: spacing[4],
        borderBottom: `1px solid ${colors.borderSubtle}`,
      }}>
        {tier.tagline}
      </p>

      {/* Features */}
      <div style={{ flex: 1, paddingTop: spacing[4], display: "flex", flexDirection: "column", gap: spacing[2] }}>
        {tier.features.map((f, i) => (
          <div key={`f-${i}`} style={{ display: "flex", gap: spacing[2], alignItems: "flex-start" }}>
            <CheckIcon color={colors.phosphor} />
            <span style={{
              fontFamily: typography.body.fontFamily,
              fontSize: typography.body.fontSize,
              color: colors.ivory,
              lineHeight: 1.5,
            }}>
              {f}
            </span>
          </div>
        ))}

        {tier.excluded.map((f, i) => (
          <div key={`x-${i}`} style={{ display: "flex", gap: spacing[2], alignItems: "flex-start" }}>
            <XIcon color={`${colors.zinc}60`} />
            <span style={{
              fontFamily: typography.body.fontFamily,
              fontSize: typography.body.fontSize,
              color: `${colors.zinc}80`,
              lineHeight: 1.5,
            }}>
              {f}
            </span>
          </div>
        ))}
      </div>

      {/* CTA */}
      <button
        type="button"
        onClick={() => onSelect(tier.id)}
        style={{
          width: "100%",
          marginTop: spacing[6],
          border: "none",
          borderRadius: radius.btn,
          padding: "14px 28px",
          backgroundColor: tier.highlight ? colors.phosphor : accentColor,
          color: colors.obsidian,
          fontFamily: typography.ui.fontFamily,
          fontSize: typography.ui.fontSize,
          fontWeight: 600,
          cursor: "pointer",
          transition: `all ${duration.normal}ms ease`,
        }}
        onMouseEnter={(e) => {
          (e.target as HTMLElement).style.transform = "scale(1.02)";
        }}
        onMouseLeave={(e) => {
          (e.target as HTMLElement).style.transform = "scale(1)";
        }}
      >
        {tier.cta}
      </button>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/*  FAQ                                                                */
/* ------------------------------------------------------------------ */

const FAQS = [
  {
    q: "Can I switch from Monthly to Annual?",
    a: "Yes. Switch anytime and we'll prorate the remaining month toward your annual subscription.",
  },
  {
    q: "Who qualifies for Founding Member?",
    a: "Only users who have completed the Cartografa diagnostic. This ensures lifetime members have genuine engagement with the method.",
  },
  {
    q: "What happens to my palace if I downgrade?",
    a: "Your first 5 rooms and 50 items stay. Additional rooms are archived (not deleted) and re-activate when you resubscribe.",
  },
  {
    q: "Is the Family Plan separate accounts?",
    a: "Each profile is an independent learner with their own palace, roadmap, and progression. The shared entry hall is the only overlap.",
  },
  {
    q: "Do you offer refunds?",
    a: "Monthly: cancel anytime, no further charges. Annual: full refund within 14 days, pro-rated after. Lifetime: full refund within 30 days.",
  },
];

function FAQ() {
  const [open, setOpen] = useState<number | null>(null);

  return (
    <div style={{ maxWidth: 600, margin: "0 auto", paddingTop: spacing[8] }}>
      <h2 style={{
        fontFamily: typography.h1.fontFamily,
        fontSize: typography.h1.fontSize,
        textAlign: "center",
        color: colors.ivory,
        margin: 0,
        paddingBottom: spacing[6],
      }}>
        Questions
      </h2>
      {FAQS.map((faq, i) => (
        <div
          key={i}
          style={{
            borderBottom: `1px solid ${colors.borderSubtle}`,
          }}
        >
          <button
            type="button"
            onClick={() => setOpen(open === i ? null : i)}
            style={{
              width: "100%",
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              background: "transparent",
              border: "none",
              padding: `${spacing[4]}px 0`,
              cursor: "pointer",
              textAlign: "left" as const,
            }}
          >
            <span style={{
              fontFamily: typography.body.fontFamily,
              fontSize: typography.body.fontSize,
              color: colors.ivory,
            }}>
              {faq.q}
            </span>
            <span style={{
              color: colors.zinc,
              fontSize: 18,
              transition: `transform ${duration.normal}ms ease`,
              transform: open === i ? "rotate(45deg)" : "rotate(0)",
              flexShrink: 0,
              paddingLeft: spacing[3],
            }}>
              +
            </span>
          </button>
          <div style={{
            overflow: "hidden",
            maxHeight: open === i ? 200 : 0,
            transition: `max-height ${duration.slow}ms ease`,
            paddingBottom: open === i ? spacing[4] : 0,
          }}>
            <p style={{
              fontFamily: typography.body.fontFamily,
              fontSize: typography.body.fontSize,
              color: colors.zinc,
              lineHeight: 1.6,
              margin: 0,
            }}>
              {faq.a}
            </p>
          </div>
        </div>
      ))}
    </div>
  );
}

/* ------------------------------------------------------------------ */
/*  Page                                                               */
/* ------------------------------------------------------------------ */

export default function PricingPage() {
  const [selectedTier, setSelectedTier] = useState<Tier | null>(null);

  return (
    <div style={{
      minHeight: "100vh",
      backgroundColor: colors.obsidian,
      color: colors.ivory,
      padding: `${spacing[8]}px ${spacing[4]}px`,
    }}>
      {/* Header */}
      <div style={{ textAlign: "center", paddingBottom: spacing[8] }}>
        <h1 style={{
          fontFamily: typography.display.fontFamily,
          fontSize: typography.display.fontSize,
          lineHeight: typography.display.lineHeight,
          color: colors.ivory,
          margin: 0,
          paddingBottom: spacing[3],
        }}>
          Choose Your Path
        </h1>
        <p style={{
          fontFamily: typography.bodyItalic.fontFamily,
          fontStyle: typography.bodyItalic.fontStyle,
          fontSize: typography.body.fontSize,
          color: colors.zinc,
          margin: 0,
          maxWidth: 480,
          marginLeft: "auto",
          marginRight: "auto",
        }}>
          Two deliveries, one meal out, one streaming subscription. &mdash; That's R$ 99.
        </p>
      </div>

      {/* Tier grid */}
      <div style={{
        display: "grid",
        gridTemplateColumns: "repeat(auto-fit, minmax(240px, 1fr))",
        gap: spacing[4],
        maxWidth: 1240,
        margin: "0 auto",
        alignItems: "start",
      }}>
        {TIERS.map((tier) => (
          <TierCard key={tier.id} tier={tier} onSelect={setSelectedTier} />
        ))}
      </div>

      {/* Founding member quote */}
      <div style={{
        textAlign: "center",
        maxWidth: 560,
        margin: "0 auto",
        paddingTop: spacing[8],
      }}>
        <p style={{
          fontFamily: typography.bodyItalic.fontFamily,
          fontStyle: typography.bodyItalic.fontStyle,
          fontSize: 16,
          color: colors.amber,
          lineHeight: 1.6,
          margin: 0,
        }}>
          &ldquo;You're not buying a subscription. You're joining the underground before the world knows about it.&rdquo;
        </p>
      </div>

      {/* FAQ */}
      <FAQ />

      {/* Footer padding */}
      <div style={{ height: spacing[8] }} />

      {/* Hidden: tier selection state for Stripe integration */}
      {selectedTier && (
        <input type="hidden" name="selected_tier" value={selectedTier} />
      )}
    </div>
  );
}
