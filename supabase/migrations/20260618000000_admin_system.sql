-- Migration: Admin system — roles, bypasses, partnerships, audit log
-- Run in Supabase SQL Editor

-- ─── 1. ADD ROLE COLUMN TO USERS ──────────────────────────────
ALTER TABLE public.users
  ADD COLUMN IF NOT EXISTS role text NOT NULL DEFAULT 'user'
  CHECK (role IN ('user', 'admin', 'super_admin'));

CREATE INDEX IF NOT EXISTS idx_users_role ON public.users(role);

COMMENT ON COLUMN public.users.role IS 'Access level: user (default), admin, or super_admin';

-- ─── 2. IS_ADMIN() HELPER ─────────────────────────────────────
CREATE OR REPLACE FUNCTION public.is_admin()
RETURNS boolean AS $$
BEGIN
  RETURN EXISTS (
    SELECT 1 FROM public.users
    WHERE id = auth.uid() AND role IN ('admin', 'super_admin')
  );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- ─── 3. ADMIN OVERRIDE POLICIES ON USERS ──────────────────────
-- Admins can read all users
DROP POLICY IF EXISTS "Admins can read all users" ON public.users;
CREATE POLICY "Admins can read all users" ON public.users
  FOR SELECT TO authenticated
  USING (public.is_admin() OR auth.uid() = id);

-- Admins can update all users
DROP POLICY IF EXISTS "Admins can update all users" ON public.users;
CREATE POLICY "Admins can update all users" ON public.users
  FOR UPDATE TO authenticated
  USING (public.is_admin() OR auth.uid() = id);

-- ─── 4. ADMIN BYPASSES TABLE ──────────────────────────────────
CREATE TABLE IF NOT EXISTS public.admin_bypasses (
  id              uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id         uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  granted_by      uuid NOT NULL REFERENCES auth.users(id),
  bypass_type     text NOT NULL CHECK (bypass_type IN ('payment', 'early_access', 'partnership', 'other')),
  reason          text NOT NULL,
  partnership_id  uuid,
  is_active       boolean NOT NULL DEFAULT true,
  expires_at      timestamptz,
  created_at      timestamptz NOT NULL DEFAULT now(),
  updated_at      timestamptz NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_bypasses_user_id ON public.admin_bypasses(user_id);
CREATE INDEX IF NOT EXISTS idx_bypasses_active ON public.admin_bypasses(is_active) WHERE is_active = true;
CREATE INDEX IF NOT EXISTS idx_bypasses_partnership ON public.admin_bypasses(partnership_id) WHERE partnership_id IS NOT NULL;

ALTER TABLE public.admin_bypasses ENABLE ROW LEVEL SECURITY;

-- Only service role can manage bypasses (admin UI goes through API routes)
CREATE POLICY "Service role full access on bypasses" ON public.admin_bypasses
  FOR ALL TO service_role USING (true) WITH CHECK (true);

COMMENT ON TABLE public.admin_bypasses IS 'Grants free access to users bypassing payment — managed by admins';
COMMENT ON COLUMN public.admin_bypasses.bypass_type IS 'payment = skip paywall, early_access = beta, partnership = commercial deal, other = manual';

-- ─── 5. ADMIN PARTNERSHIPS TABLE ──────────────────────────────
CREATE TABLE IF NOT EXISTS public.admin_partnerships (
  id                uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name              text NOT NULL,
  contact_email     text,
  contact_name      text,
  partnership_type  text NOT NULL CHECK (partnership_type IN ('school', 'company', 'influencer', 'other')),
  max_bypasses      int NOT NULL DEFAULT 50,
  bypasses_used     int NOT NULL DEFAULT 0,
  is_active         boolean NOT NULL DEFAULT true,
  starts_at         timestamptz NOT NULL DEFAULT now(),
  expires_at        timestamptz,
  notes             text,
  created_by        uuid NOT NULL REFERENCES auth.users(id),
  created_at        timestamptz NOT NULL DEFAULT now(),
  updated_at        timestamptz NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_partnerships_active ON public.admin_partnerships(is_active) WHERE is_active = true;
CREATE INDEX IF NOT EXISTS idx_partnerships_type ON public.admin_partnerships(partnership_type);

ALTER TABLE public.admin_partnerships ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Service role full access on partnerships" ON public.admin_partnerships
  FOR ALL TO service_role USING (true) WITH CHECK (true);

COMMENT ON TABLE public.admin_partnerships IS 'Commercial partnerships — schools, companies, influencers with bulk bypass allocation';

-- ─── 6. ADMIN AUDIT LOG ───────────────────────────────────────
CREATE TABLE IF NOT EXISTS public.admin_audit_log (
  id          uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  admin_id    uuid NOT NULL REFERENCES auth.users(id),
  action      text NOT NULL,
  target_type text,
  target_id   text,
  metadata    jsonb,
  ip_address  text,
  created_at  timestamptz NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_audit_admin ON public.admin_audit_log(admin_id);
CREATE INDEX IF NOT EXISTS idx_audit_action ON public.admin_audit_log(action);
CREATE INDEX IF NOT EXISTS idx_audit_created ON public.admin_audit_log(created_at DESC);

ALTER TABLE public.admin_audit_log ENABLE ROW LEVEL SECURITY;

-- Admins can insert audit records; service role can read all
CREATE POLICY "Admins can insert audit log" ON public.admin_audit_log
  FOR INSERT TO authenticated
  WITH CHECK (public.is_admin() AND admin_id = auth.uid());

CREATE POLICY "Service role can read audit log" ON public.admin_audit_log
  FOR SELECT TO service_role USING (true);

COMMENT ON TABLE public.admin_audit_log IS 'Tracks all admin actions — bypass grants, partnership changes, user access';

-- ─── 7. UPDATED_AT TRIGGERS ───────────────────────────────────
CREATE TRIGGER set_bypasses_updated_at
  BEFORE UPDATE ON public.admin_bypasses
  FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();

CREATE TRIGGER set_partnerships_updated_at
  BEFORE UPDATE ON public.admin_partnerships
  FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();

-- ─── 8. GRANTS ────────────────────────────────────────────────
GRANT SELECT, INSERT ON public.admin_audit_log TO authenticated;
GRANT ALL ON public.admin_bypasses TO service_role;
GRANT ALL ON public.admin_partnerships TO service_role;
