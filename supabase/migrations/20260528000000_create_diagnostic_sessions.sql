-- Migration: Create diagnostic_sessions table for Cartografa results
-- Based on lexio-vault/03-architecture/data-model.md
-- Run in Supabase SQL Editor or via `supabase db push`

-- Enable UUID extension if not already enabled
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- ─── DIAGNOSTIC SESSIONS ───────────────────────────────────
-- Stores complete Cartografa results per session
CREATE TABLE IF NOT EXISTS public.diagnostic_sessions (
  id              uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
  
  -- User info (nullable until auth is wired)
  email           text NOT NULL,
  user_id         uuid REFERENCES auth.users(id) ON DELETE SET NULL,
  
  -- Memory palace hook from onboarding
  interest        text,
  
  -- Pillar scores: { grammar: { score, confidence, gap_nodes }, ... }
  pillar_scores   jsonb NOT NULL DEFAULT '{}',
  
  -- Map of ignorance: [{ node_id, pillar, description, severity }]
  map_of_ignorance jsonb NOT NULL DEFAULT '[]',
  
  -- Overall readiness: roots/sprouts/branches/canopy/underground
  overall_readiness text NOT NULL DEFAULT 'roots',
  
  -- Two weakest pillars
  recommended_focus text[] NOT NULL DEFAULT '{}',
  
  -- Personalized identity text
  identity_callout text,
  
  -- Archetype from strongest pillar
  archetype_key   text NOT NULL,
  archetype_name  text NOT NULL,
  
  -- Full answer history for LexioMind retraining (consent-gated)
  raw_response_log jsonb,
  
  -- Stats
  total_questions  int NOT NULL DEFAULT 0,
  total_correct    int NOT NULL DEFAULT 0,
  duration_seconds int NOT NULL DEFAULT 0,
  
  -- Sharing
  share_token     text UNIQUE NOT NULL DEFAULT encode(gen_random_bytes(12), 'hex'),
  
  -- Timestamps
  created_at      timestamptz NOT NULL DEFAULT now(),
  updated_at      timestamptz NOT NULL DEFAULT now()
);

-- ─── INDEXES ────────────────────────────────────────────────
CREATE INDEX IF NOT EXISTS idx_diagnostic_sessions_email ON public.diagnostic_sessions(email);
CREATE INDEX IF NOT EXISTS idx_diagnostic_sessions_user_id ON public.diagnostic_sessions(user_id);
CREATE INDEX IF NOT EXISTS idx_diagnostic_sessions_share_token ON public.diagnostic_sessions(share_token);
CREATE INDEX IF NOT EXISTS idx_diagnostic_sessions_created_at ON public.diagnostic_sessions(created_at DESC);

-- ─── RLS POLICIES ──────────────────────────────────────────
-- Enable RLS
ALTER TABLE public.diagnostic_sessions ENABLE ROW LEVEL SECURITY;

-- Service role can do everything (for API routes)
CREATE POLICY "Service role full access" ON public.diagnostic_sessions
  FOR ALL
  TO service_role
  USING (true)
  WITH CHECK (true);

-- Anon can insert (for the quiz submission)
CREATE POLICY "Anon can insert" ON public.diagnostic_sessions
  FOR INSERT
  TO anon
  WITH CHECK (true);

-- Anon can read by share_token (for public result pages)
CREATE POLICY "Anon can read by share_token" ON public.diagnostic_sessions
  FOR SELECT
  TO anon
  USING (true);

-- Authenticated users can read their own sessions
CREATE POLICY "Users can read own sessions" ON public.diagnostic_sessions
  FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

-- ─── UPDATED_AT TRIGGER ────────────────────────────────────
CREATE OR REPLACE FUNCTION public.handle_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER set_updated_at
  BEFORE UPDATE ON public.diagnostic_sessions
  FOR EACH ROW
  EXECUTE FUNCTION public.handle_updated_at();

-- ─── COMMENTS ──────────────────────────────────────────────
COMMENT ON TABLE public.diagnostic_sessions IS 'Cartografa diagnostic results — one row per completed session';
COMMENT ON COLUMN public.diagnostic_sessions.pillar_scores IS 'Per-pillar scores: { grammar: { score: 0-1, confidence: 0-1, gap_nodes: [...] }, ... }';
COMMENT ON COLUMN public.diagnostic_sessions.map_of_ignorance IS 'Array of gap nodes: [{ node_id, pillar, description, severity }]';
COMMENT ON COLUMN public.diagnostic_sessions.raw_response_log IS 'Full answer history for LexioMind retraining — only used with explicit consent (LGPD)';
COMMENT ON COLUMN public.diagnostic_sessions.share_token IS 'Unique token for public result sharing — generated automatically';
