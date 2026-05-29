-- Migration: Create palace + palace_items tables (Phase 4)
-- Based on lexio-vault/03-architecture/data-model.md
-- 5 rooms, 50 items, spaced repetition, Cartografa-linked placement

-- ─── PALACE TABLE ──────────────────────────────────────────
CREATE TABLE IF NOT EXISTS public.palace (
  id            uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id       uuid REFERENCES auth.users(id) ON DELETE CASCADE,
  session_id    uuid REFERENCES public.diagnostic_sessions(id) ON DELETE SET NULL,
  created_at    timestamptz NOT NULL DEFAULT now(),
  updated_at    timestamptz NOT NULL DEFAULT now(),

  -- 5 room definitions (each room is a JSON object)
  -- {
  --   slug: "transformation-hall" | "ignorance-map" | "chunking-workshop" | "context-reading-room" | "fluency-arena",
  --   name: string,
  --   description: string,
  --   unlocked: boolean,
  --   items_count: int,
  -- }
  rooms         jsonb NOT NULL DEFAULT '[]'::jsonb,

  -- Blueprint configuration (isometric grid params)
  blueprint     jsonb NOT NULL DEFAULT '{
    "gridSize": 6,
    "roomPositions": {
      "grammar": {"x": 0, "y": 0},
      "logic": {"x": 2, "y": 1},
      "vocab": {"x": 1, "y": 2},
      "culture": {"x": 3, "y": 2},
      "comm": {"x": 1, "y": 3}
    }
  }'::jsonb,

  -- Pulse mode state
  pulse_streak  int NOT NULL DEFAULT 0,
  last_pulse_at timestamptz,
  next_pulse_at timestamptz NOT NULL DEFAULT now(),

  -- Readiness level from Cartografa (for color theming)
  overall_readiness text NOT NULL DEFAULT 'roots'
    CHECK (overall_readiness IN ('roots', 'sprouts', 'branches', 'canopy', 'underground'))
);

-- ─── PALACE ITEMS TABLE ────────────────────────────────────
CREATE TABLE IF NOT EXISTS public.palace_items (
  id              uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
  palace_id       uuid REFERENCES public.palace(id) ON DELETE CASCADE NOT NULL,
  user_id         uuid REFERENCES auth.users(id) ON DELETE CASCADE,

  -- The linguistic content
  source          text NOT NULL, -- 'cartografa' | 'pulse' | 'lesson' | 'manual'
  pillar          text NOT NULL CHECK (pillar IN ('grammar', 'logic', 'vocab', 'culture', 'comm')),
  item_type       text NOT NULL CHECK (item_type IN ('word', 'chunk', 'phrase', 'cultural_atom', 'pronunciation', 'meme')),
  title           text NOT NULL,
  content         text NOT NULL, -- the actual word/phrase/chunk
  explanation     text,         -- "Por quê?" explanation
  difficulty      int NOT NULL DEFAULT 1 CHECK (difficulty BETWEEN 1 AND 5),

  -- Placement in the palace
  room            text NOT NULL DEFAULT 'chunking-workshop',
  grid_x          int NOT NULL DEFAULT 0,
  grid_y          int NOT NULL DEFAULT 0,

  -- Spaced repetition
  ease_factor     real NOT NULL DEFAULT 2.5,     -- SM-2 algorithm
  interval_days   int NOT NULL DEFAULT 0,
  repetitions     int NOT NULL DEFAULT 0,
  next_review     timestamptz NOT NULL DEFAULT now(),
  last_review     timestamptz,
  review_count    int NOT NULL DEFAULT 0,

  -- Metadata
  icon            text DEFAULT '💎',
  is_mastered     boolean NOT NULL DEFAULT false,
  is_active       boolean NOT NULL DEFAULT true,
  created_at      timestamptz NOT NULL DEFAULT now()
);

-- ─── INDEXES ────────────────────────────────────────────────
CREATE INDEX IF NOT EXISTS idx_palace_user_id ON public.palace(user_id);
CREATE INDEX IF NOT EXISTS idx_palace_items_palace_id ON public.palace_items(palace_id);
CREATE INDEX IF NOT EXISTS idx_palace_items_user_id ON public.palace_items(user_id);
CREATE INDEX IF NOT EXISTS idx_palace_items_next_review ON public.palace_items(next_review);
CREATE INDEX IF NOT EXISTS idx_palace_items_room ON public.palace_items(room);
CREATE INDEX IF NOT EXISTS idx_palace_items_pillar ON public.palace_items(pillar);

-- ─── RLS POLICIES ──────────────────────────────────────────
ALTER TABLE public.palace ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.palace_items ENABLE ROW LEVEL SECURITY;

-- Service role full access
CREATE POLICY "Service role full access palace" ON public.palace
  FOR ALL TO service_role USING (true) WITH CHECK (true);
CREATE POLICY "Service role full access palace_items" ON public.palace_items
  FOR ALL TO service_role USING (true) WITH CHECK (true);

-- Users can read their own palace
CREATE POLICY "Users read own palace" ON public.palace
  FOR SELECT TO authenticated USING (auth.uid() = user_id);

-- Users can update their own palace
CREATE POLICY "Users update own palace" ON public.palace
  FOR UPDATE TO authenticated USING (auth.uid() = user_id);

-- Users read own items
CREATE POLICY "Users read own items" ON public.palace_items
  FOR SELECT TO authenticated USING (auth.uid() = user_id);

-- Users update own items
CREATE POLICY "Users update own items" ON public.palace_items
  FOR UPDATE TO authenticated USING (auth.uid() = user_id);

-- Anon can insert on initial Cartografa completion (before user auth)
CREATE POLICY "Anon can insert palace" ON public.palace
  FOR INSERT TO anon WITH CHECK (true);
CREATE POLICY "Anon can insert palace_items" ON public.palace_items
  FOR INSERT TO anon WITH CHECK (true);

-- ─── TRIGGERS ──────────────────────────────────────────────
CREATE TRIGGER set_palace_updated_at
  BEFORE UPDATE ON public.palace
  FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();

-- ─── GRANTS ────────────────────────────────────────────────
GRANT SELECT, INSERT, UPDATE ON public.palace TO anon;
GRANT SELECT, INSERT, UPDATE ON public.palace TO authenticated;
GRANT SELECT, INSERT, UPDATE ON public.palace_items TO anon;
GRANT SELECT, INSERT, UPDATE ON public.palace_items TO authenticated;

-- ─── COMMENTS ──────────────────────────────────────────────
COMMENT ON TABLE public.palace IS 'Memory palace per user — 5 rooms, blueprint config, pulse mode state';
COMMENT ON TABLE public.palace_items IS 'Items placed in palace rooms — words, chunks, cultural atoms with spaced repetition';
COMMENT ON COLUMN public.palace_items.ease_factor IS 'SM-2 algorithm ease factor (default 2.5)';
COMMENT ON COLUMN public.palace_items.interval_days IS 'Current interval in days before next review';
COMMENT ON COLUMN public.palace_items.next_review IS 'Timestamp for next scheduled review (Pulse Mode queue)';