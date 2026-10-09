BEGIN;
-- Close the audited public access and privilege escalation. Preserve all rows.
REVOKE ALL ON public.users FROM anon, PUBLIC;
REVOKE INSERT, UPDATE, DELETE ON public.users FROM authenticated;
GRANT SELECT ON public.users TO authenticated;
GRANT UPDATE (name, locale, priority_language, consent_given, consent_date) ON public.users TO authenticated;
DROP POLICY IF EXISTS "Anon can insert users" ON public.users;
REVOKE ALL ON public.diagnostic_sessions FROM anon, PUBLIC;
REVOKE SELECT ON auth.users FROM anon, PUBLIC;
DROP POLICY IF EXISTS "Anon can insert" ON public.diagnostic_sessions;
DROP POLICY IF EXISTS "Anon can read all" ON public.diagnostic_sessions;

-- Learner practice events are append-only and cannot confer role, tier or CEFR.
CREATE TABLE public.lexio_practice_events (
  user_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  id uuid NOT NULL,
  version integer NOT NULL DEFAULT 1 CHECK (version = 1),
  component text NOT NULL CHECK (component IN ('pulse','syntaxis','phonos','shadow','palace')),
  activity_id text NOT NULL CHECK (length(activity_id) BETWEEN 1 AND 200),
  kind text NOT NULL CHECK (kind IN ('attempt','reflection','save_item','review')),
  payload jsonb NOT NULL CHECK (jsonb_typeof(payload) = 'object' AND octet_length(payload::text) <= 16000),
  occurred_at timestamptz NOT NULL,
  received_at timestamptz NOT NULL DEFAULT now(),
  PRIMARY KEY (user_id, id)
);
ALTER TABLE public.lexio_practice_events ENABLE ROW LEVEL SECURITY;
REVOKE ALL ON public.lexio_practice_events FROM anon, PUBLIC;
GRANT SELECT, INSERT, DELETE ON public.lexio_practice_events TO authenticated;
GRANT ALL ON public.lexio_practice_events TO service_role;
CREATE POLICY practice_own_read ON public.lexio_practice_events FOR SELECT TO authenticated USING ((SELECT auth.uid()) = user_id);
CREATE POLICY practice_own_insert ON public.lexio_practice_events FOR INSERT TO authenticated WITH CHECK ((SELECT auth.uid()) = user_id);
CREATE POLICY practice_own_delete ON public.lexio_practice_events FOR DELETE TO authenticated USING ((SELECT auth.uid()) = user_id);
CREATE INDEX practice_events_user_time ON public.lexio_practice_events(user_id, occurred_at);
COMMENT ON TABLE public.lexio_practice_events IS 'Self-reported learning practice, not diagnostic or entitlement evidence. No audio blobs.';
COMMIT;
