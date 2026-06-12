-- Migration: Missing DB tables — learner_progression, cultural_atoms, session_events, family_challenges, nim_usage
-- Based on lexio-vault/03-architecture/data-model.md
-- Complements existing migrations (palace, meme_vault, telemetry, family_groups)

-- ─── LEARNER PROGRESSION ──────────────────────────────────
-- Central persistence for learner state — syncs with Zustand learnerStore
CREATE TABLE IF NOT EXISTS public.learner_progression (
  user_id               uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  language              text NOT NULL DEFAULT 'en',
  maturity_stage        text NOT NULL DEFAULT 'roots'
    CHECK (maturity_stage IN ('roots', 'sprouts', 'branches', 'canopy', 'underground')),
  pillar_weights        jsonb NOT NULL DEFAULT '{}'::jsonb,
  last_cartografa_date  timestamptz,
  palace_room_names     text[] NOT NULL DEFAULT '{"entrance"}'::text[],
  created_at            timestamptz NOT NULL DEFAULT now(),
  updated_at            timestamptz NOT NULL DEFAULT now(),
  PRIMARY KEY (user_id, language)
);

CREATE INDEX IF NOT EXISTS idx_learner_progression_user ON public.learner_progression(user_id);

ALTER TABLE public.learner_progression ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Service role full access learner_progression" ON public.learner_progression
  FOR ALL TO service_role USING (true) WITH CHECK (true);

CREATE POLICY "Users read own progression" ON public.learner_progression
  FOR SELECT TO authenticated USING (auth.uid() = user_id);

CREATE POLICY "Users update own progression" ON public.learner_progression
  FOR UPDATE TO authenticated USING (auth.uid() = user_id);

CREATE POLICY "Users insert own progression" ON public.learner_progression
  FOR INSERT TO authenticated WITH CHECK (auth.uid() = user_id);

CREATE TRIGGER set_learner_progression_updated_at
  BEFORE UPDATE ON public.learner_progression
  FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();

-- ─── CULTURAL ATOMS ────────────────────────────────────────
-- Discrete cultural knowledge units linked to memes and palace items
CREATE TABLE IF NOT EXISTS public.cultural_atoms (
  id                uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
  language          text NOT NULL DEFAULT 'en',
  region            text NOT NULL DEFAULT 'US',
  atom_name         text NOT NULL,
  description        text NOT NULL,
  pillar_tags       text[] NOT NULL DEFAULT '{}'::text[],
  difficulty_tier   int NOT NULL DEFAULT 1 CHECK (difficulty_tier BETWEEN 1 AND 5),
  meme_vault_id     uuid REFERENCES public.meme_vault(id) ON DELETE SET NULL,
  is_active         boolean NOT NULL DEFAULT true,
  created_at        timestamptz NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_cultural_atoms_language ON public.cultural_atoms(language);
CREATE INDEX IF NOT EXISTS idx_cultural_atoms_pillar ON public.cultural_atoms USING GIN(pillar_tags);
CREATE INDEX IF NOT EXISTS idx_cultural_atoms_difficulty ON public.cultural_atoms(difficulty_tier);
CREATE INDEX IF NOT EXISTS idx_cultural_atoms_meme ON public.cultural_atoms(meme_vault_id);

ALTER TABLE public.cultural_atoms ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Service role full access cultural_atoms" ON public.cultural_atoms
  FOR ALL TO service_role USING (true) WITH CHECK (true);

CREATE POLICY "Anyone can read active atoms" ON public.cultural_atoms
  FOR SELECT TO anon, authenticated USING (is_active = true);

-- ─── SESSION EVENTS ────────────────────────────────────────
-- Track Pulse/Deep/Shadow completions for retention metric (70% daily engagement target)
CREATE TABLE IF NOT EXISTS public.session_events (
  id                uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id           uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  session_type      text NOT NULL CHECK (session_type IN ('pulse', 'deep', 'shadow')),
  duration_seconds  int NOT NULL DEFAULT 0,
  items_covered     int NOT NULL DEFAULT 0,
  completed_flag    boolean NOT NULL DEFAULT false,
  pillar             text CHECK (pillar IN ('grammar', 'logic', 'vocab', 'culture', 'comm')),
  metadata          jsonb DEFAULT '{}'::jsonb,
  created_at        timestamptz NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_session_events_user ON public.session_events(user_id);
CREATE INDEX IF NOT EXISTS idx_session_events_type ON public.session_events(session_type);
CREATE INDEX IF NOT EXISTS idx_session_events_created_at ON public.session_events(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_session_events_completed ON public.session_events(completed_flag) WHERE completed_flag = true;

ALTER TABLE public.session_events ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Service role full access session_events" ON public.session_events
  FOR ALL TO service_role USING (true) WITH CHECK (true);

CREATE POLICY "Users read own sessions" ON public.session_events
  FOR SELECT TO authenticated USING (auth.uid() = user_id);

CREATE POLICY "Users insert own sessions" ON public.session_events
  FOR INSERT TO authenticated WITH CHECK (auth.uid() = user_id);

-- ─── FAMILY CHALLENGES ────────────────────────────────────
-- Content sharing between family members for engagement
CREATE TABLE IF NOT EXISTS public.family_challenges (
  id                uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
  sender_id         uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  receiver_id       uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  language          text NOT NULL DEFAULT 'en',
  content_type      text NOT NULL CHECK (content_type IN ('text', 'image', 'audio')),
  content_url       text,
  text_caption      text,
  created_at        timestamptz NOT NULL DEFAULT now(),
  expires_at        timestamptz,
  receiver_response text CHECK (receiver_response IN ('accepted', 'declined', 'pending')),
  responded_at      timestamptz,
  CONSTRAINT sender_not_receiver CHECK (sender_id != receiver_id)
);

CREATE INDEX IF NOT EXISTS idx_family_challenges_sender ON public.family_challenges(sender_id);
CREATE INDEX IF NOT EXISTS idx_family_challenges_receiver ON public.family_challenges(receiver_id);
CREATE INDEX IF NOT EXISTS idx_family_challenges_expires ON public.family_challenges(expires_at) WHERE expires_at IS NOT NULL;

ALTER TABLE public.family_challenges ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Service role full access family_challenges" ON public.family_challenges
  FOR ALL TO service_role USING (true) WITH CHECK (true);

CREATE POLICY "Users see own sent/received challenges" ON public.family_challenges
  FOR SELECT TO authenticated USING (
    auth.uid() = sender_id OR auth.uid() = receiver_id
  );

CREATE POLICY "Users can create challenges" ON public.family_challenges
  FOR INSERT TO authenticated WITH CHECK (auth.uid() = sender_id);

CREATE POLICY "Receivers can respond" ON public.family_challenges
  FOR UPDATE TO authenticated USING (auth.uid() = receiver_id);

-- ─── NIM USAGE ─────────────────────────────────────────────
-- Per-user token/call tracking for NVIDIA NIM billing
CREATE TABLE IF NOT EXISTS public.nim_usage (
  id            uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id       uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  endpoint      text NOT NULL,          -- e.g. 'nvidia/llama-3.1-nemotron', 'nvidia/stt_en'
  tokens_used   int NOT NULL DEFAULT 0,
  calls_count   int NOT NULL DEFAULT 1,
  month_year    text NOT NULL,          -- e.g. '2026-06'
  created_at    timestamptz NOT NULL DEFAULT now(),
  UNIQUE(user_id, endpoint, month_year)
);

CREATE INDEX IF NOT EXISTS idx_nim_usage_user ON public.nim_usage(user_id);
CREATE INDEX IF NOT EXISTS idx_nim_usage_month ON public.nim_usage(month_year);
CREATE INDEX IF NOT EXISTS idx_nim_usage_endpoint ON public.nim_usage(endpoint);

ALTER TABLE public.nim_usage ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Service role full access nim_usage" ON public.nim_usage
  FOR ALL TO service_role USING (true) WITH CHECK (true);

CREATE POLICY "Users read own nim usage" ON public.nim_usage
  FOR SELECT TO authenticated USING (auth.uid() = user_id);

-- ─── GRANTS ────────────────────────────────────────────────
GRANT SELECT, INSERT, UPDATE ON public.learner_progression TO authenticated;
GRANT SELECT ON public.learner_progression TO anon;
GRANT INSERT ON public.learner_progression TO anon;
GRANT SELECT ON public.cultural_atoms TO anon;
GRANT SELECT ON public.cultural_atoms TO authenticated;
GRANT SELECT, INSERT ON public.session_events TO authenticated;
GRANT INSERT ON public.session_events TO anon;
GRANT SELECT, INSERT ON public.family_challenges TO authenticated;
GRANT SELECT ON public.nim_usage TO authenticated;

-- ─── COMMENTS ──────────────────────────────────────────────
COMMENT ON TABLE public.learner_progression IS 'Central learner state — maturity stage, pillar weights, palace room names. Synced with client-side Zustand store.';
COMMENT ON TABLE public.cultural_atoms IS 'Discrete cultural knowledge units — linked to memes and palace items. 5 difficulty tiers.';
COMMENT ON TABLE public.session_events IS 'Pulse/Deep/Shadow session completions — drives 70% daily engagement retention metric.';
COMMENT ON TABLE public.family_challenges IS 'Content sharing challenges between family members — sender initiates, receiver responds.';
COMMENT ON TABLE public.nim_usage IS 'Per-user NVIDIA NIM API usage tracking — tokens + calls aggregated by month.';
