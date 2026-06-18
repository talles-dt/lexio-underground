# Lexio Underground — Development Status & Critical Path

> Generated: June 18, 2026
> Current state: ~15% of vault spec implemented

## ✅ What's Done

| Area | Status | Notes |
|------|--------|-------|
| Landing page | ✅ Complete | Stitch-level motion design, CSS 3D Palace preview |
| Auth flow | ✅ Complete | Email/password, Google/Apple OAuth, password reset, session persistence |
| Admin system | ✅ Complete | Roles, bypasses, partnerships, audit log |
| Palace view | ✅ Complete | CSS 3D isometric floor plan with parallax |
| Design system | ✅ Complete | Dual tokens (CSS + JS), grain overlay, motion library |
| Error boundaries | ✅ Complete | Root, admin, auth error.tsx files |
| Database schema | ✅ Complete | 9 migrations, all tables created |

## 🔴 Critical Path (blocks everything else)

### 1. Cartografa — Real Question Bank (Phase 1.1)
**Status:** ❌ Not started — only 3 static questions exist

The entire product depends on this. Without a real diagnostic:
- Palace rooms can't be unlocked based on results
- Maturity stages can't be determined
- Reports can't be generated
- Payment eligibility can't be verified

**What needs to be built:**
- 50+ questions across 5 pillars (10 per pillar)
- Question types: acceptability judgments, chunk identification, cultural scenarios, open production
- Difficulty tiers per question (1-5)
- Portuguese prompts for all questions

**Effort:** 4-6 hours for question content + 2-3 hours for data model

### 2. Adaptive Engine (Phase 1.2)
**Status:** ❌ Not started — file exists but is a stub

**What needs to be built:**
- IRT-lite algorithm: difficulty adjusts per response
- Confidence gating: MSE < 0.05 after 6+ correct at difficulty D
- Variable-length test: 12-25 min depending on learner strength
- Per-pillar independent resolution

**Effort:** 6-8 hours

### 3. Scoring Engine (Phase 1.5-1.6)
**Status:** ❌ Not started

**What needs to be built:**
- `pillar_scores` with score 0.0-1.0, confidence, gap_nodes per pillar
- `map_of_ignorance` generation — nodes with pillar, description, severity
- `overall_readiness` mapping to maturity stages
- `recommended_focus` array

**Effort:** 3-4 hours

### 4. Cartografa Report (Phase 2)
**Status:** ⚠️ Partial — CartografaReport component exists but uses mock data

**What needs to be built:**
- Pillar radar chart (SVG pentagon, animated stroke-dashoffset)
- Progressive reveal — first pillar appears before others load
- Identity callout — personalized text based on strongest/weakest pillar
- Share card — PNG export + social links
- Roadmap preview — first 3 rooms labeled

**Effort:** 8-10 hours

### 5. Save-State / Drop-Out Rescue (Phase 1.4)
**Status:** ❌ Not started

**What needs to be built:**
- Persist answers to Supabase `cartografa_sessions` after every response
- Resume incomplete sessions on return
- Session recovery by email link

**Effort:** 3-4 hours

## 🟡 High Priority (needed for MVP)

### 6. Font Loading (Phase 6.1)
**Status:** ⚠️ Fonts referenced but Google Fonts import may not be working on web

**Effort:** 1 hour

### 7. Pulse Mode (Phase 4.3)
**Status:** ❌ Not started

3-min daily session: one cultural atom, one pronunciation, palace placement

**Effort:** 6-8 hours

### 8. Palace Data Model (Phase 4.1)
**Status:** ⚠️ Tables exist but no seed data or item placement logic

**Effort:** 4-6 hours

### 9. Spaced Repetition (Phase 4.5)
**Status:** ❌ Not started

`next_review` timestamps, daily review queue

**Effort:** 4-6 hours

## 🟢 Nice to Have (post-MVP)

### 10. AI Integration (Phase 5)
- NVIDIA NIM for real scoring
- LexioMind v1 fine-tuned model
- Lesson generation
- Conversation Shadow (async)

**Effort:** 20-30 hours

### 11. Payments (Phase 5.4)
- Stripe integration
- Founding member gate
- Pricing: R$49/mo, R$468/yr, R$1,490 lifetime

**Effort:** 8-10 hours

### 12. Meme Vault (Phase 5.8)
- 50 curated English memes
- Approval pipeline
- 17+ content gate

**Effort:** 6-8 hours

### 13. Deep Mode (Phase 5)
- Full 30-40 min session loop
- Pro tier only

**Effort:** 10-12 hours

### 14. Family Plan (Phase 6.6)
- Up to 3 profiles
- R$149/mo

**Effort:** 6-8 hours

## 📊 Effort Summary

| Priority | Feature | Hours |
|----------|---------|-------|
| 🔴 Critical | Question bank | 6-9 |
| 🔴 Critical | Adaptive engine | 6-8 |
| 🔴 Critical | Scoring engine | 3-4 |
| 🔴 Critical | Cartografa report | 8-10 |
| 🔴 Critical | Save-state | 3-4 |
| 🟡 High | Font loading | 1 |
| 🟡 High | Pulse mode | 6-8 |
| 🟡 High | Palace data + items | 4-6 |
| 🟡 High | Spaced repetition | 4-6 |
| 🟢 Post-MVP | AI integration | 20-30 |
| 🟢 Post-MVP | Payments | 8-10 |
| 🟢 Post-MVP | Meme vault | 6-8 |
| 🟢 Post-MVP | Deep mode | 10-12 |
| 🟢 Post-MVP | Family plan | 6-8 |
| **Total MVP** | | **45-55 hours** |
| **Total Full** | | **105-135 hours** |

## 🎯 Recommended Next Steps

1. **Question bank** — Start here. Nothing else works without it.
2. **Adaptive engine** — Build the algorithm that makes the diagnostic intelligent.
3. **Scoring engine** — Transform raw answers into pillar scores and map of ignorance.
4. **Save-state** — Prevent drop-outs from losing progress.
5. **Report** — The "aha moment" that makes users want to share.

These 5 items (24-31 hours) create a functional MVP that delivers on the core promise: take the Cartografa, get a report, see your Palace grow.
