-- Migration: Phase 6 — Polish + Launch
-- Family Plan, Telemetry, Sentry context

-- ─── TELEMETRY / EXPERIMENT TRACKING ─────────────────────
CREATE TABLE IF NOT EXISTS public.telemetry (
  id          uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
  event       text NOT NULL,
  user_id     uuid REFERENCES auth.users(id) ON DELETE SET NULL,
  properties  jsonb DEFAULT '{}'::jsonb,
  user_agent  text,
  ip          text,
  timestamp   timestamptz NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_telemetry_event ON public.telemetry(event);
CREATE INDEX IF NOT EXISTS idx_telemetry_user_id ON public.telemetry(user_id);
CREATE INDEX IF NOT EXISTS idx_telemetry_timestamp ON public.telemetry(timestamp DESC);

ALTER TABLE public.telemetry ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Service role full access telemetry" ON public.telemetry
  FOR ALL TO service_role USING (true) WITH CHECK (true);

-- ─── FAMILY PLAN ──────────────────────────────────────────
CREATE TABLE IF NOT EXISTS public.family_groups (
  id              uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
  owner_id        uuid REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  max_members     int NOT NULL DEFAULT 3 CHECK (max_members BETWEEN 1 AND 6),
  plan_tier       text NOT NULL DEFAULT 'family' CHECK (plan_tier IN ('family')),
  stripe_subscription_id text,
  is_active       boolean NOT NULL DEFAULT true,
  created_at      timestamptz NOT NULL DEFAULT now(),
  updated_at      timestamptz NOT NULL DEFAULT now()
);

CREATE TABLE IF NOT EXISTS public.family_members (
  id              uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
  group_id        uuid REFERENCES public.family_groups(id) ON DELETE CASCADE NOT NULL,
  user_id         uuid REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  role            text NOT NULL DEFAULT 'member' CHECK (role IN ('owner', 'member')),
  joined_at       timestamptz NOT NULL DEFAULT now(),
  UNIQUE(group_id, user_id)
);

CREATE INDEX IF NOT EXISTS idx_family_groups_owner ON public.family_groups(owner_id);
CREATE INDEX IF NOT EXISTS idx_family_members_group ON public.family_members(group_id);
CREATE INDEX IF NOT EXISTS idx_family_members_user ON public.family_members(user_id);

ALTER TABLE public.family_groups ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.family_members ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Service role full access family_groups" ON public.family_groups
  FOR ALL TO service_role USING (true) WITH CHECK (true);
CREATE POLICY "Service role full access family_members" ON public.family_members
  FOR ALL TO service_role USING (true) WITH CHECK (true);

CREATE POLICY "Members read own group" ON public.family_groups
  FOR SELECT TO authenticated USING (
    auth.uid() = owner_id OR
    auth.uid() IN (SELECT user_id FROM public.family_members WHERE group_id = id)
  );
CREATE POLICY "Members read own membership" ON public.family_members
  FOR SELECT TO authenticated USING (auth.uid() = user_id);

-- ─── ADD stripe_customer_id TO users ──────────────────────
ALTER TABLE public.users
  ADD COLUMN IF NOT EXISTS stripe_customer_id text;

-- ─── ADD SENTRY DSN TO ENV CONTEXT ────────────────────────
COMMENT ON TABLE public.telemetry IS 'W&B-style experiment tracking — events, user actions, performance';
COMMENT ON TABLE public.family_groups IS 'Family Plan: up to 3 profiles for R$ 149';
COMMENT ON TABLE public.family_members IS 'Members of a family group — owner + up to 2 additional profiles';

-- ─── GRANTS ────────────────────────────────────────────────
GRANT SELECT ON public.telemetry TO anon;
GRANT INSERT ON public.telemetry TO anon;
GRANT SELECT, INSERT ON public.telemetry TO authenticated;
GRANT SELECT ON public.family_groups TO authenticated;
GRANT SELECT ON public.family_members TO authenticated;