/**
 * Lexio Underground — Cultural Atoms & Pulse Content
 *
 * Shared content data used by Pulse Mode and seed-content.
 * These are the cultural atoms that power daily learning.
 */

export interface CulturalAtom {
  id: string;
  title: string;
  description: string;
  pillar: "grammar" | "logic" | "vocab" | "culture" | "comm";
  difficulty: number;
  content: string;
  example?: string;
  translation?: string;
}

export const CULTURAL_ATOMS: CulturalAtom[] = [
  // Vocabulary atoms
  {
    id: "atom_v1",
    title: "Actually ≠ Atualmente",
    description: "One of the most common false friends",
    pillar: "vocab",
    difficulty: 1,
    content: "\"Actually\" means 'in fact' or 'really' — not 'currently'. For 'currently', use 'at the moment' or 'right now'.",
    example: "\"I'm actually working on it\" = I'm really working on it (not 'atualmente')",
  },
  {
    id: "atom_v2",
    title: "Make vs Do",
    description: "The eternal confusion",
    pillar: "vocab",
    difficulty: 1,
    content: "\"Make\" = create/produce something. \"Do\" = perform an activity. \"Make a mistake\" (create it), \"Do homework\" (perform it).",
    example: "\"I made dinner\" (I created it) vs \"I did the dishes\" (I performed the task)",
  },
  {
    id: "atom_v3",
    title: "Take a shower / Have a shower",
    description: "Collocation awareness",
    pillar: "vocab",
    difficulty: 1,
    content: "\"Take a shower\" is the standard American collocation. \"Have a shower\" is British. \"Do a shower\" doesn't exist.",
    example: "\"I need to take a shower before we leave\"",
  },
  {
    id: "atom_v4",
    title: "Get — The Swiss Army Knife",
    description: "One verb, dozens of meanings",
    pillar: "vocab",
    difficulty: 2,
    content: "\"Get\" can mean: receive (get a letter), become (get tired), arrive (get to work), understand (get it), fetch (get water).",
    example: "\"I got it\" can mean: I received it / I understand it / I fetched it",
  },
  {
    id: "atom_v5",
    title: "Phrasal Verb: Put Off",
    description: "Postponement with attitude",
    pillar: "vocab",
    difficulty: 2,
    content: "\"Put off\" = postpone/delay. \"Put away\" = store. \"Put down\" = place down/criticize. \"Put out\" = extinguish/inconvenience.",
    example: "\"Don't put off until tomorrow what you can do today\"",
  },
  // Culture atoms
  {
    id: "atom_c1",
    title: "\"That's Interesting\" — The Polite No",
    description: "Reading between American lines",
    pillar: "culture",
    difficulty: 2,
    content: "In American culture, \"That's interesting\" said with a flat tone often means \"I disagree but don't want to argue.\" Context and tone are everything.",
    example: "If someone says \"That's interesting...\" with a pause and no follow-up, they likely disagree.",
  },
  {
    id: "atom_c2",
    title: "The RSVP Obligation",
    description: "Cultural expectations around invitations",
    pillar: "culture",
    difficulty: 1,
    content: "RSVP = \"Répondez s'il vous plaît\" (please respond). In Anglo culture, you MUST respond — even if you can't attend. Ignoring is rude.",
    example: "If you can't go, reply: \"Thank you for the invitation, but I won't be able to attend.\"",
  },
  {
    id: "atom_c3",
    title: "\"How Are You?\" — Not a Real Question",
    description: "Social formula vs genuine inquiry",
    pillar: "culture",
    difficulty: 1,
    content: "\"How are you?\" in American culture is a greeting, not a real question. The expected answer is \"Good, thanks\" — not your actual health status.",
    example: "Wrong: \"Well, I've been having back pain...\" Right: \"Good, thanks! How are you?\"",
  },
  {
    id: "atom_c4",
    title: "Small Talk — The Social Glue",
    description: "Why Americans talk about weather",
    pillar: "culture",
    difficulty: 2,
    content: "Small talk (weather, sports, weekend plans) is not meaningless — it's social bonding. Skipping it and jumping to business feels cold.",
    example: "Before a meeting: \"How was your weekend?\" → 30 seconds of small talk → then business.",
  },
  {
    id: "atom_c5",
    title: "The \"Sorry\" Reflex",
    description: "When Americans apologize",
    pillar: "culture",
    difficulty: 3,
    content: "Americans say \"sorry\" for things that aren't their fault — bumping into furniture, asking a question, existing near someone. It's social lubricant, not admission of guilt.",
    example: "\"Sorry, could you repeat that?\" — You're not sorry, you're being polite.",
  },
  // Grammar atoms
  {
    id: "atom_g1",
    title: "Present Perfect vs Simple Past",
    description: "The Brazilian nightmare",
    pillar: "grammar",
    difficulty: 2,
    content: "Use Present Perfect for actions connected to now: \"I have lived here for 5 years\" (still living). Use Simple Past for completed actions: \"I lived there in 2010\" (not anymore).",
    example: "\"I have seen that movie\" (at some point, relevant now) vs \"I saw that movie last week\" (specific past time)",
  },
  {
    id: "atom_g2",
    title: "The Subjunctive Were",
    description: "Hypothetical thinking in English",
    pillar: "grammar",
    difficulty: 3,
    content: "\"If I were rich\" (not \"was\") — the subjunctive mood. It signals hypothetical/unreal situations. \"Were\" for all persons in formal English.",
    example: "\"If I were you, I would study more\" (I'm not you — hypothetical)",
  },
  // Logic atoms
  {
    id: "atom_l1",
    title: "False Friends: Pretender vs Pretend",
    description: "Words that lie to you",
    pillar: "logic",
    difficulty: 1,
    content: "\"Pretender\" in Portuguese = to intend. \"Pretend\" in English = to fake/false. \"I pretend to go\" (PT) ≠ \"I pretend to go\" (EN — means you're faking it).",
    example: "PT: \"Pretendo estudar\" → EN: \"I intend to study\" (NOT \"I pretend to study\")",
  },
  {
    id: "atom_l2",
    title: "The Article Trap",
    description: "When to use a/an/the/∅",
    pillar: "logic",
    difficulty: 3,
    content: "English articles don't map to Portuguese. \"I love music\" (no article) but \"I love the music in this film\" (specific). \"I'm a teacher\" (profession) but \"I'm the teacher\" (the only one).",
    example: "\"Life is beautiful\" (general, no article) vs \"The life of a teacher is hard\" (specific)",
  },
  // Communication atoms
  {
    id: "atom_m1",
    title: "Hedging Language",
    description: "How to sound less direct",
    pillar: "comm",
    difficulty: 2,
    content: "Americans hedge: \"I think maybe we could possibly...\" instead of \"We should...\" Hedging sounds polite, not weak.",
    example: "\"I was wondering if you might be able to...\" (polite request) vs \"Can you...?\" (direct)",
  },
  {
    id: "atom_m2",
    title: "The \"Could You\" Formula",
    description: "Polite requests that actually work",
    pillar: "comm",
    difficulty: 1,
    content: "\"Could you\" is more polite than \"Can you.\" \"Would you mind\" is even more polite. \"I was wondering if\" is the most indirect.",
    example: "\"Could you pass the salt?\" (polite) → \"Would you mind passing the salt?\" (very polite)",
  },
];
