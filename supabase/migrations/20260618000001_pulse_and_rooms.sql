-- Migration: Create pulse_sessions table and fix palace schema
-- Phase 4.3: Pulse Mode daily sessions
-- Also adds palace_rooms table for normalized room management

-- ─── PULSE SESSIONS TABLE ────────────────────────────────────
CREATE TABLE IF NOT EXISTS public.pulse_sessions (
  id              uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id         uuid REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  atom_id         text NOT NULL,
  pillar          text NOT NULL CHECK (pillar IN ('grammar', 'logic', 'vocab', 'culture', 'comm')),
  palace_room     text NOT NULL DEFAULT 'entrance',
  completed_at    text NOT NULL, -- ISO date string (YYYY-MM-DD)
  created_at      timestamptz NOT NULL DEFAULT now()
);

CREATE INDEX idx_pulse_sessions_user_id ON public.pulse_sessions(user_id);
CREATE INDEX idx_pulse_sessions_completed_at ON public.pulse_sessions(completed_at);

ALTER TABLE public.pulse_sessions ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can read own pulse sessions" ON public.pulse_sessions
  FOR SELECT TO authenticated USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own pulse sessions" ON public.pulse_sessions
  FOR INSERT TO authenticated WITH CHECK (auth.uid() = user_id);

-- ─── PALACE ROOMS TABLE (normalized) ─────────────────────────
CREATE TABLE IF NOT EXISTS public.palace_rooms (
  id              uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  palace_id       uuid REFERENCES public.palace(id) ON DELETE CASCADE NOT NULL,
  user_id         uuid REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  room_id         text NOT NULL, -- entrance, grammar, vocab, logic, culture, comm
  name            text NOT NULL,
  pillar          text NOT NULL DEFAULT 'none',
  description     text,
  icon            text DEFAULT '🚪',
  unlocked        boolean NOT NULL DEFAULT false,
  grid_x          int NOT NULL DEFAULT 0,
  grid_y          int NOT NULL DEFAULT 0,
  connected_to    text[] NOT NULL DEFAULT '{}',
  created_at      timestamptz NOT NULL DEFAULT now(),
  updated_at      timestamptz NOT NULL DEFAULT now(),
  UNIQUE(palace_id, room_id)
);

CREATE INDEX idx_palace_rooms_palace_id ON public.palace_rooms(palace_id);
CREATE INDEX idx_palace_rooms_user_id ON public.palace_rooms(user_id);

ALTER TABLE public.palace_rooms ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can read own palace rooms" ON public.palace_rooms
  FOR SELECT TO authenticated USING (auth.uid() = user_id);

CREATE POLICY "Users can manage own palace rooms" ON public.palace_rooms
  FOR ALL TO authenticated USING (auth.uid() = user_id);

-- ─── UPDATE PALACE TABLE ─────────────────────────────────────
-- Add columns that the code expects
ALTER TABLE public.palace
  ADD COLUMN IF NOT EXISTS total_rooms int NOT NULL DEFAULT 0,
  ADD COLUMN IF NOT EXISTS maturity_stage text NOT NULL DEFAULT 'roots';

COMMENT ON COLUMN public.palace.maturity_stage IS 'Current maturity stage: roots/sprouts/branches/canopy/underground';
