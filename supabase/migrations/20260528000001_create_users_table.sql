-- Migration: Create users table and auth trigger
-- Based on lexio-vault/03-architecture/data-model.md
-- Run in Supabase SQL Editor

-- ─── USERS TABLE ───────────────────────────────────────────
CREATE TABLE IF NOT EXISTS public.users (
  id                uuid PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  email             text NOT NULL UNIQUE,
  name              text,
  priority_language text NOT NULL DEFAULT 'en',
  tier              text NOT NULL DEFAULT 'free' CHECK (tier IN ('free', 'pro_lifetime', 'family')),
  locale            text NOT NULL DEFAULT 'pt-BR',
  found_member      boolean NOT NULL DEFAULT false,
  family_group_id   uuid,
  consent_given     boolean NOT NULL DEFAULT false,
  consent_date      timestamptz,
  created_at        timestamptz NOT NULL DEFAULT now(),
  updated_at        timestamptz NOT NULL DEFAULT now()
);

-- ─── INDEXES ────────────────────────────────────────────────
CREATE INDEX IF NOT EXISTS idx_users_email ON public.users(email);
CREATE INDEX IF NOT EXISTS idx_users_tier ON public.users(tier);

-- ─── RLS POLICIES ──────────────────────────────────────────
ALTER TABLE public.users ENABLE ROW LEVEL SECURITY;

-- Service role full access
CREATE POLICY "Service role full access" ON public.users
  FOR ALL TO service_role USING (true) WITH CHECK (true);

-- Users can read their own profile
CREATE POLICY "Users can read own profile" ON public.users
  FOR SELECT TO authenticated USING (auth.uid() = id);

-- Users can update their own profile
CREATE POLICY "Users can update own profile" ON public.users
  FOR UPDATE TO authenticated USING (auth.uid() = id);

-- Anon can insert (for initial signup before auth completes)
CREATE POLICY "Anon can insert users" ON public.users
  FOR INSERT TO anon WITH CHECK (true);

-- ─── AUTO-CREATE USER PROFILE ON AUTH SIGNUP ───────────────
-- This trigger fires when a new user signs up via Supabase Auth
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.users (id, email, name)
  VALUES (
    NEW.id,
    NEW.email,
    COALESCE(NEW.raw_user_meta_data->>'name', split_part(NEW.email, '@', 1))
  )
  ON CONFLICT (id) DO NOTHING;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Trigger on auth.users insert
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW
  EXECUTE FUNCTION public.handle_new_user();

-- ─── UPDATED_AT TRIGGER ────────────────────────────────────
CREATE TRIGGER set_users_updated_at
  BEFORE UPDATE ON public.users
  FOR EACH ROW
  EXECUTE FUNCTION public.handle_updated_at();

-- ─── LINK DIAGNOSTIC SESSIONS TO USERS ─────────────────────
-- Allow updating user_id on diagnostic_sessions after signup
CREATE POLICY "Service role can update session user_id" ON public.diagnostic_sessions
  FOR UPDATE TO service_role USING (true);

-- ─── GRANTS ────────────────────────────────────────────────
GRANT SELECT ON public.users TO anon;
GRANT INSERT ON public.users TO anon;
GRANT SELECT, UPDATE ON public.users TO authenticated;

-- ─── COMMENTS ──────────────────────────────────────────────
COMMENT ON TABLE public.users IS 'User profiles — auto-created on auth signup via trigger';
COMMENT ON COLUMN public.users.tier IS 'Subscription tier: free, pro_lifetime, family';
COMMENT ON COLUMN public.users.consent_given IS 'LGPD consent for data processing and LexioMind retraining';
COMMENT ON COLUMN public.users.priority_language IS 'Target language for learning (default: en)';
