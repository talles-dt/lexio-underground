-- Migration: Phase 5 — AI + Monetization tables
-- conversation_shadow, lessons table fix, founders table, meme_vault

-- ─── CONVERSATION SHADOW ───────────────────────────────────
CREATE TABLE IF NOT EXISTS public.conversation_shadow (
  id            uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id       uuid REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  session_id    text,
  role          text NOT NULL CHECK (role IN ('user', 'assistant')),
  content       text NOT NULL,
  corrected     text,
  grammar_notes text[],
  created_at    timestamptz NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_conversation_shadow_user_id ON public.conversation_shadow(user_id);
CREATE INDEX IF NOT EXISTS idx_conversation_shadow_created_at ON public.conversation_shadow(created_at DESC);

ALTER TABLE public.conversation_shadow ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Service role full access conversation_shadow" ON public.conversation_shadow
  FOR ALL TO service_role USING (true) WITH CHECK (true);

CREATE POLICY "Users read own conversations" ON public.conversation_shadow
  FOR SELECT TO authenticated USING (auth.uid() = user_id);

CREATE POLICY "Users insert own messages" ON public.conversation_shadow
  FOR INSERT TO authenticated WITH CHECK (auth.uid() = user_id);

-- ─── MEME VAULT ────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS public.meme_vault (
  id            uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
  title         text NOT NULL,
  image_url     text NOT NULL,
  alt_text      text,
  caption       text,           -- English caption explaining the meme
  translation   text,           -- Portuguese translation/explanation
  pillar        text CHECK (pillar IN ('grammar', 'logic', 'vocab', 'culture', 'comm')),
  difficulty    int DEFAULT 1 CHECK (difficulty BETWEEN 1 AND 5),
  tags          text[] DEFAULT '{}',
  is_active     boolean NOT NULL DEFAULT true,
  created_at    timestamptz NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_meme_vault_pillar ON public.meme_vault(pillar);
CREATE INDEX IF NOT EXISTS idx_meme_vault_active ON public.meme_vault(is_active);

ALTER TABLE public.meme_vault ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can read memes" ON public.meme_vault
  FOR SELECT TO anon, authenticated USING (is_active = true);

CREATE POLICY "Service role full access memes" ON public.meme_vault
  FOR ALL TO service_role USING (true) WITH CHECK (true);

-- ─── SEED 50 MEMES (curated English memes for learners) ────
-- These are the 50 launch memes per spec (Phase 5.8)
-- Image URLs should be updated with actual CDN paths before launch
INSERT INTO public.meme_vault (title, image_url, alt_text, caption, translation, pillar, difficulty, tags) VALUES
  ('Tense Confusion', '/memes/tense-confusion.jpg', 'Person confused by English tenses', 'When you realize English has 12 tenses and Portuguese has way fewer', 'Quando você descobre que o inglês tem 12 tempos verbais', 'grammar', 2, '{tense,beginner}'),
  ('Pronunciation Trap', '/memes/pronunciation-trap.jpg', 'Pronunciation vs spelling meme', 'English: I read a book vs I read a book — same spelling, different pronunciation', 'Inglês: mesma escrita, pronúncia diferente', 'comm', 1, '{pronunciation,reading}'),
  ('False Friend', '/memes/false-friend.jpg', 'Person realizing false cognate', 'Actually vs Atualmente — they are NOT the same thing', '"Actually" NÃO é "atualmente"', 'vocab', 1, '{false-cognate,actually}'),
  ('Phrasal Verb Hell', '/memes/phrasal-hell.jpg', 'Guy overwhelmed by phrasal verbs', 'Put up with, put off, put out, put away, put on — pick one, English!', 'Phrasal verbs: put + every preposition = different meaning', 'vocab', 2, '{phrasal-verb,confusion}'),
  ('Small Talk Culture', '/memes/small-talk.jpg', 'Two people awkwardly greeting', 'American: "How are you?" Brazilian: starts telling life story. American: "I said hi not tell me your biography."', 'Americano pergunta "How are you?" só por educação', 'culture', 1, '{small-talk,culture}'),
  ('Present Perfect Struggle', '/memes/present-perfect.jpg', 'Student confused by present perfect', 'Me: I understand Present Perfect. Also me: uses Simple Past for everything anyway', 'Eu: Entendi Present Perfect. Também eu: uso Simple Past pra tudo', 'grammar', 2, '{present-perfect,struggle}'),
  ('Make vs Do', '/memes/make-do.jpg', 'Make vs Do confusion', 'Portuguese: "fazer" for everything. English: Make (create) vs Do (perform). Choose wisely.', 'Em português "fazer" serve pra tudo. Em inglês não.', 'vocab', 1, '{make-do,collocation}'),
  ('Sarcasm Detection', '/memes/sarcasm.jpg', 'Person not understanding sarcasm', 'Brit: "Oh brilliant." (meaning: this is terrible). Brazilian: "Thanks!"', 'Sarcasmo britânico: dizer o oposto do que pensa', 'culture', 3, '{sarcasm,british}'),
  ('Silent Letters', '/memes/silent-letters.jpg', 'Silent letters everywhere', 'English: "knight" — let me just silently add 3 extra letters that do nothing', 'Inglês tem letras silenciosas só pra confundir', 'comm', 1, '{pronunciation,silent-letters}'),
  ('Preposition Maze', '/memes/prepositions.jpg', 'Person lost in prepositions maze', 'In, on, at, by, for, since, during, while — the preposition maze has no exit', 'Preposições em inglês: um labirinto sem saída', 'logic', 2, '{prepositions,confusion}'),
  ('Double Meaning Trap', '/memes/double-meaning.jpg', 'Word with multiple meanings', 'English word "set" has 430+ meanings. Yes, 430. Good luck.', 'A palavra "set" tem mais de 430 significados', 'vocab', 3, '{vocabulary,polysemy}'),
  ('Perfect vs Perfect Continuous', '/memes/perfect-vs-perfect.jpg', 'Two tenses fighting', 'Present Perfect: I have lived here. Present Perfect Continuous: I have been living here. Both correct. Different vibes.', 'Ambos corretos, mas com nuances diferentes', 'grammar', 3, '{present-perfect,continuous}'),
  ('British vs American', '/memes/british-american.jpg', 'Two people disagreeing', 'American: "Elevator." Brit: "Lift." Brazilian: "I give up."', 'Inglês americano vs britânico: duas línguas diferentes', 'culture', 1, '{culture,variation}'),
  ('Conditional Chain', '/memes/conditionals.jpg', 'Conditional chain reaction', 'If I had studied, I would have passed. But I didn''t. So I didn''t. Third conditional is a time machine.', 'Third conditional: viagem no tempo gramatical', 'logic', 3, '{conditional,advanced}'),
  ('Article Confusion', '/memes/articles.jpg', 'Person confused by articles', 'Portuguese: no articles before professions. English: "I am A teacher." Not "I am teacher."', 'Em português: "Sou professor." Em inglês: "I am A teacher."', 'grammar', 1, '{articles,beginner}'),
  ('S Vocabulary Overload', '/memes/vocab-overload.jpg', 'Brain overloaded with vocabulary', 'Me learning English: reads one article. Finds 27 new words. Cries.', 'Ler um artigo em inglês: 27 palavras novas', 'vocab', 1, '{vocabulary,struggle}'),
  ('Cultural Time Perception', '/memes/time-perception.jpg', 'Clock showing different time', 'Brazil: "Let''s meet at 8" (arrives at 8:30). Germany: "Let''s meet at 8" (arrives at 7:55). UK: "Let''s meet at 8" (arrives at 8:00 exactly).', 'Percepção de tempo: Brasil relaxado, Alemanha pontual', 'culture', 2, '{time,culture}'),
  ('Relative Clause Chaos', '/memes/relative-clauses.jpg', 'Spaghetti diagram of relative clauses', 'The man who met the woman that knows the guy whose dog bit me — English relative clauses are infinite', 'Relative clauses em inglês: infinitas', 'logic', 4, '{relative-clause,advanced}'),
  ('Business Buzzwords', '/memes/buzzwords.jpg', 'Corporate buzzword bingo', 'Circle back, touch base, deep dive, synergize — corporate English is a separate language', 'Inglês corporativo: uma língua à parte', 'culture', 3, '{business,culture}'),
  ('Idiom Literal Translation', '/memes/idiom-literal.jpg', 'Literal idiom translation', 'Break a leg! = ??? Brazilian translates literally, panics', '"Break a leg" não é sobre quebrar pernas', 'culture', 2, '{idiom,culture}'),
  ('Countable vs Uncountable', '/memes/countable.jpg', 'Countable vs uncountable confusion', 'Information, advice, knowledge — uncountable. You cannot have "an information."', 'Information, advice, knowledge: incontáveis', 'logic', 2, '{countable,grammar}'),
  ('Reflexive Pronouns', '/memes/reflexive.jpg', 'Person using reflexive incorrectly', 'Brazilian: "I cut my hair." English: "I cut my hair" (at the salon) vs "I cut MYSELF" (hospital time)', 'Reflexive pronouns: myself, yourself, etc.', 'grammar', 2, '{reflexive,pronoun}'),
  ('Emoji Miscommunication', '/memes/emoji.jpg', 'Emoji culture shock', 'Brazilian: sends 👍 (friendly). American: receives 👍 (passive-aggressive). Cultural emoji gap.', '👍 no Brasil é amigável. Nos EUA pode ser passivo-agressivo', 'culture', 2, '{emoji,culture}'),
  ('Passive Voice Academia', '/memes/passive.jpg', 'Academic passive voice', 'It was determined that the study was conducted using passive voice. Because academia loves passive voice.', 'Passive voice: amada na academia, evitada na conversa', 'comm', 3, '{passive,academic}'),
  ('Cognate Trap', '/memes/cognate.jpg', 'False cognate disaster', '"I''m constipated" (I''m stuck in traffic). No. No no no. That means something else.', '"Constipated" NÃO significa "constipado" (resfriado)', 'vocab', 2, '{false-cognate,danger}'),
  ('Present Perfect Politics', '/memes/present-perfect-politics.jpg', 'Political present perfect use', 'Politician: "Mistakes were made." (Passive voice + no Present Perfect = no responsibility)', '"Mistakes were made" = jogar a culpa pra longe', 'logic', 4, '{passive,politics}'),
  ('Word Order SOV vs SVO', '/memes/word-order.jpg', 'Sentence structure comparison', 'Portuguese: "I coffee like." English: "I like coffee." Same meaning, different word order. Brain.exe has stopped working.', 'Ordem das palavras: diferente do português', 'logic', 1, '{word-order,beginner}'),
  ('Subjunctive Mood', '/memes/subjunctive.jpg', 'Subjunctive mood confusion', '"I wish I WERE rich." Not "I wish I was." The subjunctive is dying and I''m here for the funeral.', 'Subjuntivo "I wish I were" está morrendo', 'grammar', 4, '{subjunctive,advanced}'),
  ('Politeness Levels', '/memes/politeness.jpg', 'Politeness scale', 'Direct: "Close the door." Polite: "Could you close the door?" Very polite: "I don''t suppose you''d mind terribly closing the door?" British: *says nothing, suffers in silence*', 'Edugação em inglês: níveis de polidez', 'culture', 2, '{politeness,culture}'),
  ('Future Forms Battle', '/memes/future.jpg', 'Multiple future forms fighting', 'Will, going to, present continuous, present simple — all for the future. English has 4 future forms. Pick your fighter.', 'Inglês tem 4 formas de futuro', 'grammar', 2, '{future,grammar}'),
  ('Reading vs Listening Gap', '/memes/reading-listening.jpg', 'Person understanding text but not speech', 'My reading: C2 level. My listening: "wait what did they say?"', 'Compreensão escrita vs auditiva: realidades diferentes', 'comm', 1, '{listening,reading}'),
  ('False Advanced', '/memes/false-advanced.jpg', 'Person using big words wrong', 'Me: "I shall endeavour to perambulate henceforth." Native: "You mean you''ll walk?"', 'Usar palavras difíceis não significa fluência', 'comm', 3, '{vocabulary,advanced}'),
  ('Interrogative Inversion', '/memes/interrogative.jpg', 'Question formation confusion', 'Portuguese: "What you said?" English: "What DID you SAY?" Verb, where are you going?', 'Perguntas em inglês exigem verbo auxiliar', 'logic', 1, '{questions,beginner}'),
  ('Meme Grammar Itself', '/memes/meme-grammar.jpg', 'Meme grammar rules', 'English memes: "Me explaining to my mom why I need another language app." (Object pronoun as subject = meme grammar)', 'Gramática de meme: "Me explaining" é normal em memes', 'culture', 2, '{meme,informal}'),
  ('Adjective Order', '/memes/adjective-order.jpg', 'Traffic light of adjective order', 'A beautiful big old round wooden table. Not: a wooden old round big beautiful table. English has opinions about adjective order.', 'Ordem dos adjetivos: inglês é exigente', 'logic', 3, '{adjective,order}'),
  ('Acronym Overload', '/memes/acronyms.jpg', 'Acronym soup', 'ASAP, FYI, BTW, TBD, EOD, EOW — English loves four-letter acronyms', 'Siglas em inglês: um alfabeto secreto', 'vocab', 2, '{acronym,business}'),
  ('Tag Question Confusion', '/memes/tag-questions.jpg', 'Tag question confusion', '"You''re Brazilian, aren''t you?" "You like coffee, don''t you?" "You went, didn''t you?" The tag question trap: it''s always opposite.', 'Tag questions: sempre o oposto do verbo principal', 'grammar', 2, '{tag-question,grammar}'),
  ('The Word "Get"', '/memes/get-word.jpg', 'The word get with many meanings', 'Get = receive, become, understand, arrive, buy, fetch, catch, have... Get is English''s Swiss Army knife.', '"Get" é o canivete suíço do inglês: tem 50 significados', 'vocab', 2, '{get,vocabulary}'),
  ('Negation Rules', '/memes/negation.jpg', 'Negation confusion', 'Portuguese: "I not like." English: "I DON''T like." Never forget the auxiliary verb of negation.', 'Negação em inglês sempre exige auxiliar', 'logic', 1, '{negation,beginner}'),
  ('Inversion After Negatives', '/memes/inversion.jpg', 'Inversion after negative adverbs', '"Never have I seen such grammar." Not: "Never I have seen." Inversion after negatives = fancy English.', 'Nunca + inversão = inglês formal', 'grammar', 4, '{inversion,advanced}'),
  ('The "Th" Sound', '/memes/th-sound.jpg', 'Person struggling with th sound', 'Brazilian trying to say "think": "sink? tink? fink?" English: "Thhhhhhh." Brazilian: *exits conversation*', 'Som do "TH": o pesadelo dos brasileiros', 'comm', 1, '{pronunciation,th-sound}'),
  ('Linking Words', '/memes/linking.jpg', 'Connected speech', 'English: "I''m gonna getcha." Brazilian: "I am going to get you." Same meaning. Very different sounds.', 'Connected speech: "going to" vira "gonna"', 'comm', 2, '{pronunciation,linking}'),
  ('Email Formality', '/memes/email.jpg', 'Email formality scale', 'Email to boss: "Dear Sir, I respectfully submit..." Email to friend: "yo check this"', 'Formalidade em emails: do "Dear Sir" ao "yo"', 'culture', 2, '{email,formality}'),
  ('Hedging Language', '/memes/hedging.jpg', 'Person hedging excessively', '"I kind of think that maybe perhaps we could possibly consider the option of..." Just say what you mean!', 'Hedging: linguagem evasiva inglesa', 'comm', 4, '{hedging,academic}'),
  ('Punctuation Culture', '/memes/punctuation.jpg', 'Punctuation meme', 'Excited: "Great!" Sarcastic: "Great." Angry: "Great." English punctuation carries all the emotional weight.', 'Pontuação em inglês carrega emoção', 'culture', 2, '{punctuation,culture}'),
  ('The Word "Actually"', '/memes/actually.jpg', 'Actually misuse', 'Brazilian: "Actually, I''m 25." (meaning currently). English: "Actually, I''m 25." (correcting someone). See the difference?', '"Actually" é pra corrigir, não pra dizer "atualmente"', 'vocab', 1, '{actually,false-cognate}'),
  ('Tips for Writing', '/memes/writing-tips.jpg', 'Writing tips that contradict', 'Writing tip 1: Use simple words. Writing tip 2: Expand your vocabulary. English writing advice is contradictory.', 'Dicas de escrita em inglês são contraditórias', 'comm', 3, '{writing,academic}'),
  ('Comedy in English', '/memes/comedy.jpg', 'Understanding English humor', 'English humor: deadpan, sarcastic, absurdist. Brazilians: "Is he joking? I can''t tell."', 'Humor inglês: seco, sarcástico, absurdo', 'culture', 3, '{humor,culture}'),
  ('Self-Taught Trap', '/memes/self-taught.jpg', 'Self-taught English problems', 'Self-taught English: perfect grammar, 0 listening comprehension. First conversation: 😶', 'Auto-didata: gramática perfeita, listening zero', 'comm', 1, '{self-taught,listening}'),
  ('Polyglot Dream', '/memes/polyglot.jpg', 'The dream of speaking English', 'Brazilian dreaming in English: *fala inglês perfeitamente*. Brazilian waking up: "I... am... uh... yes."', 'Sonhar em inglês = o auge da fluência', 'culture', 1, '{motivation,dream}')
ON CONFLICT DO NOTHING;

-- ─── LESSONS TABLE (if not exists) ─────────────────────────
CREATE TABLE IF NOT EXISTS public.lessons (
  id            uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id       uuid REFERENCES auth.users(id) ON DELETE SET NULL,
  pillar        text NOT NULL,
  difficulty    text NOT NULL,
  content       jsonb NOT NULL,
  created_at    timestamptz NOT NULL DEFAULT now()
);

ALTER TABLE public.lessons ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Service role full access lessons" ON public.lessons FOR ALL TO service_role USING (true) WITH CHECK (true);
CREATE POLICY "Users read own lessons" ON public.lessons FOR SELECT TO authenticated USING (auth.uid() = user_id);

-- ─── GRANTS ────────────────────────────────────────────────
GRANT SELECT ON public.conversation_shadow TO anon;
GRANT INSERT ON public.conversation_shadow TO anon;
GRANT SELECT, INSERT ON public.conversation_shadow TO authenticated;
GRANT SELECT ON public.meme_vault TO anon;
GRANT SELECT ON public.meme_vault TO authenticated;
GRANT SELECT ON public.lessons TO anon;
GRANT SELECT ON public.lessons TO authenticated;
GRANT INSERT ON public.lessons TO anon;
GRANT INSERT ON public.lessons TO authenticated;

COMMENT ON TABLE public.conversation_shadow IS 'Async conversation history — 3-turn context maintained per user for AI conversation partner';
COMMENT ON TABLE public.meme_vault IS '50 curated English memes at launch for cultural learning';
COMMENT ON TABLE public.lessons IS 'AI-generated lessons per pillar, per difficulty';