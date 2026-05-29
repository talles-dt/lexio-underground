-- Migration: Add completed_at and state columns for save-state / drop-out rescue
-- Phase 1.4: Save-state after every answer

ALTER TABLE public.diagnostic_sessions
  ADD COLUMN IF NOT EXISTS completed_at timestamptz,
  ADD COLUMN IF NOT EXISTS state jsonb DEFAULT '{}'::jsonb;

COMMENT ON COLUMN public.diagnostic_sessions.completed_at IS 'Set when user finishes the full diagnostic (null = in progress / dropped out)';
COMMENT ON COLUMN public.diagnostic_sessions.state IS 'Snapshot of CartografaState for drop-out resume';