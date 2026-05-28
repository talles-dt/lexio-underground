# Lexio Underground — MVP Roadmap

> Vault audit: deployed site is ~5% of spec. This is the path to a real MVP.
> Dependencies flow top-down. Each phase unlocks the next.

---

## Phase 1 — Real Cartografa _(the core product)_

Everything else is meaningless without a real diagnostic.

- [ ] **1.1** Build a question bank (50+ questions across 5 pillars, Portuguese prompts)
- [ ] **1.2** Implement adaptive engine — IRT-lite: difficulty adjusts per response, confidence gating (MSE < 0.05 after 6+ correct at difficulty D)
- [ ] **1.3** 5 stages, not 3 — add Vocabulary (chunking) and Culture (scenario-based) stages
- [ ] **1.4** Save-state after every answer — persist to Supabase `cartografa_sessions` on each response (drop-out rescue)
- [ ] **1.5** Scoring engine — `pillar_scores` with score 0.0–1.0, confidence, gap_nodes per pillar
- [ ] **1.6** `map_of_ignorance` generation — nodes with pillar, description, severity

**Exit criteria:** User completes a 15–20 min adaptive test across 5 pillars and gets scored.

---

## Phase 2 — Report + Identity Moment _(the "aha")_

> _"Your grammar is your anchor. Culture is your frontier."_

- [ ] **2.1** Pillar radar — SVG pentagon chart, animated stroke-dashoffset reveal
- [ ] **2.2** Progressive report reveal — first pillar appears before others load
- [ ] **2.3** Identity callout — personalized text based on strongest/weakest pillar
- [ ] **2.4** `overall_readiness` — map score to roots/sprouts/branches/canopy/underground
- [ ] **2.5** Share card — PNG export + social links (LinkedIn, Twitter, WhatsApp)
- [ ] **2.6** Roadmap preview — "Here's where your first month starts" with first 3 rooms labeled

**Exit criteria:** User sees a rich report with radar, identity moment, and can share it.

---

## Phase 3 — Auth + Persistence _(make it real)_

- [ ] **3.1** Email/password signup — Supabase Auth, pre-filled from Cartografa email
- [ ] **3.2** Google OAuth — callback route exists, wire it up
- [ ] **3.3** User profile creation — `public.users` table sync on signup
- [ ] **3.4** Session persistence — link Cartografa results to user account
- [ ] **3.5** LGPD consent — explicit consent at account creation, right to erasure

**Exit criteria:** User can sign up, log in, and their Cartografa results persist.

---

## Phase 4 — Palace + Pulse Mode _(retention)_

The vault's 70% daily engagement target depends on this.

- [ ] **4.1** Palace data model — `palace` + `palace_items` tables, 5 rooms, 50 items
- [ ] **4.2** Palace blueprint view — 2.5D isometric floor plan, ivory ink strokes
- [ ] **4.3** Pulse Mode — 3-min daily session: one cultural atom, one pronunciation, palace placement
- [ ] **4.4** Item placement — words/chunks placed in rooms based on Cartografa results
- [ ] **4.5** Spaced repetition — `next_review` timestamps, daily review queue
- [ ] **4.6** Palace tour animation — blueprint self-construction, grid → rooms → doors open

**Exit criteria:** User has a Palace, items get placed, daily Pulse sessions work.

---

## Phase 5 — AI + Monetization _(money + magic)_

- [ ] **5.1** NVIDIA NIM integration — real AI scoring for Cartografa responses
- [ ] **5.2** LexioMind v1 — fine-tuned model for pillar scoring
- [ ] **5.3** Lesson generation — AI-powered lessons per pillar, per difficulty
- [ ] **5.4** Stripe pricing — monthly (R$ 49), annual (R$ 468), lifetime (R$ 1,490)
- [ ] **5.5** Founding member gate — only Cartografa completers can purchase
- [ ] **5.6** Async Conversation Shadow — record → AI response → review, 3-turn history
- [ ] **5.7** ElevenLabs TTS — pronunciation audio for palace items
- [ ] **5.8** Meme Vault — 50 curated English memes at launch

**Exit criteria:** Real AI scoring, Stripe payments, founding members can purchase.

---

## Phase 6 — Polish + Launch

- [ ] **6.1** Google Fonts on web — Syne, Source Serif 4, JetBrains Mono (currently system-ui fallback)
- [ ] **6.2** Motion philosophy — transitions, pulses, amber glows per vault spec
- [ ] **6.3** W&B experiment tracking
- [ ] **6.4** Sentry error monitoring
- [ ] **6.5** Expo PWA — iOS + Android + web, same codebase
- [ ] **6.6** Family Plan — up to 3 profiles, R$ 149

---

## Current State

| Area           | Status                                      |
| -------------- | ------------------------------------------- |
| Landing page   | ✅ Working                                  |
| Email capture  | ✅ Working                                  |
| Quiz flow      | ⚠️ 3 static questions (needs Phases 1–2)    |
| API + Supabase | ✅ Working (service role key, RLS bypassed) |
| Share link     | ✅ Working                                  |
| Auth           | ❌ Not wired on web                         |
| Palace         | ❌ Not implemented                          |
| AI pipeline    | ❌ Mock only                                |
| Payments       | ❌ Not implemented                          |
| Design tokens  | ✅ Colors match vault                       |
| Typography     | ⚠️ Fonts referenced but not loaded on web   |

---

_Source: `lexio-vault/` audit, 2026-05-28_
