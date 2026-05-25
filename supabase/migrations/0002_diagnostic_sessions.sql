-- +schema: diagnostic_sessions
-- +author: Hermes
-- +description: Diagnostic quiz sessions with tokenized shares + RLS

CREATE TABLE IF NOT EXISTS diagnostic_sessions (
 id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
 email text NOT NULL,
 user_id uuid REFERENCES auth.users(id),
 answers jsonb NOT NULL,
 scores jsonb NOT NULL,
 archetype_key text NOT NULL,
 archetype_name text NOT NULL,
 ethos_level text,
 share_token text UNIQUE DEFAULT encode(gen_random_bytes(12), 'hex'),
 shared_at timestamp,
 converted_at timestamp,
 created_at timestamp DEFAULT now()
);

ALTER TABLE diagnostic_sessions ENABLE ROW LEVEL SECURITY;

-- Policies
CREATE POLICY "insert_diagnostic" ON diagnostic_sessions FOR INSERT WITH CHECK (true);
CREATE POLICY "read_own_diagnostic" ON diagnostic_sessions FOR SELECT USING (
 auth.uid() = user_id OR email = (SELECT email FROM auth.users WHERE id = auth.uid())
);
CREATE POLICY "read_by_share_token" ON diagnostic_sessions FOR SELECT USING (
 share_token IS NOT NULL
);

-- Indexes
CREATE INDEX IF NOT EXISTS idx_diag_email ON diagnostic_sessions(email);
CREATE INDEX IF NOT EXISTS idx_diag_token ON diagnostic_sessions(share_token);
CREATE INDEX IF NOT EXISTS idx_diag_archetype ON diagnostic_sessions(archetype_key);

-- Lessons table
CREATE TABLE IF NOT EXISTS lessons (
 id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
 user_id uuid REFERENCES auth.users(id),
 pillar text NOT NULL CHECK (pillar IN ('grammar', 'logic', 'communication', 'vocabulary', 'culture')),
 difficulty text NOT NULL CHECK (difficulty IN ('A2', 'B1', 'B2', 'C1')),
 content jsonb NOT NULL,
 created_at timestamp DEFAULT now()
);

ALTER TABLE lessons ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Allow users to manage their own lessons" ON lessons FOR ALL USING (auth.uid() = user_id);
