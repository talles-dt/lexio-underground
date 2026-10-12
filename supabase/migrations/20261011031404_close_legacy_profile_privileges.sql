BEGIN;
-- Remote inspection found default TRUNCATE/REFERENCES/TRIGGER grants still present.
-- Keep profile changes limited to learner-editable columns; admin changes use trusted server routes.
REVOKE ALL ON public.users FROM authenticated;
GRANT SELECT ON public.users TO authenticated;
GRANT UPDATE (name, locale, priority_language, consent_given, consent_date) ON public.users TO authenticated;
REVOKE ALL ON public.diagnostic_sessions FROM authenticated;
GRANT SELECT ON public.diagnostic_sessions TO authenticated;
COMMIT;
