// src/cartografa/question-bank-ar.ts
// Arabic Cartografa Question Bank — 50 questions across 5 pillars
// For English/Portuguese speakers learning Arabic
// Questions test ARABIC language knowledge (with English/Portuguese prompts)
// Based on lexio-vault/01-product/cartografa.md

import type { Question } from "./question-bank";

// ─── STAGE 1: GRAMMAR INTUITION ────────────────────────────
// Acceptability judgments — detecting what sounds wrong in Arabic
const arabicGrammarQuestions: Question[] = [
  {
    id: "ar_g1", pillar: "grammar", stage: 1, difficulty: 1, type: "likert",
    prompt: "Which sounds more natural in Arabic? A) أنا طالب في الجامعة B) أنا طالب في الجامعةِ",
    whyExplanation: "Arabic uses case endings (إعراب). The كسرة (-i) on الجامعة indicates it's a مجرور (genitive) after في. Native-like intuition detects when case endings are wrong.",
  },
  {
    id: "ar_g2", pillar: "grammar", stage: 1, difficulty: 1, type: "likert",
    prompt: "Which is correct? A) ذهبت إلى السوق B) ذهبت إلى السوقَ",
    whyExplanation: "After إلى, the noun should be منصوب (accusative) with فتحة. السوقُ would be wrong here. Detecting this requires grammatical intuition.",
  },
  {
    id: "ar_g3", pillar: "grammar", stage: 1, difficulty: 2, type: "likert",
    prompt: "Which sounds wrong? A) الطلاب ذهبوا إلى المدرسة B) الطلاب ذهبوا إلى المدرسةِ",
    whyExplanation: "الطلاب is a جمع مذكر سالم (sound masculine plural). The verb should agree: ذهبوا is correct. But the case ending on المدرسة should be كسرة (genitive).",
  },
  {
    id: "ar_g4", pillar: "grammar", stage: 1, difficulty: 2, type: "likert",
    prompt: "Which is correct? A) قرأت الكتاب B) قرأت الكتابَ",
    whyExplanation: "الكتاب is the direct object (مفعول به) and should be منصوب with فتحة. This is a fundamental Arabic grammar rule that learners often miss.",
  },
  {
    id: "ar_g5", pillar: "grammar", stage: 1, difficulty: 3, type: "likert",
    prompt: "Which sounds wrong? A) جاء الطالبان إلى الفصل B) جاء الطالبين إلى الفصل",
    whyExplanation: "الطالبان is a مثنى (dual) and should be مرفوع (nominative) as the subject. الطالبين would be wrong here — it's the accusative/genitive form.",
  },
  {
    id: "ar_g6", pillar: "grammar", stage: 1, difficulty: 3, type: "likert",
    prompt: "Which is correct? A) هذا كتاب جديد B) هذا كتابٌ جديدٌ",
    whyExplanation: "In Arabic, both the noun and its adjective must agree in case, number, gender, and definiteness. كتابٌ جديدٌ shows proper إعراب agreement.",
  },
  {
    id: "ar_g7", pillar: "grammar", stage: 1, difficulty: 4, type: "likert",
    prompt: "Which sounds wrong? A) إن الطالبَ مجتهدٌ B) إن الطالبُ مجتهدٌ",
    whyExplanation: "After إنَّ, the subject becomes منصوب (accusative). So الطالبَ is correct, not الطالبُ. This is an advanced grammar rule.",
  },
  {
    id: "ar_g8", pillar: "grammar", stage: 1, difficulty: 4, type: "likert",
    prompt: "Which is correct? A) ما جاء الطلاب B) ما جاء الطلابُ",
    whyExplanation: "After ما النافية, the subject is مرفوع. الطلابُ is correct. This is a subtle rule that even intermediate learners get wrong.",
  },
  {
    id: "ar_g9", pillar: "grammar", stage: 1, difficulty: 5, type: "likert",
    prompt: "Which sounds wrong? A) لولا الماءُ لهلك الإنسان B) لولا الماءَ لهلك الإنسان",
    whyExplanation: "After لولا, the subject is منصوب (accusative). الماءَ is correct. This is a very advanced grammar point.",
  },
  {
    id: "ar_g10", pillar: "grammar", stage: 1, difficulty: 5, type: "likert",
    prompt: "Which is correct? A) ظننت أن الطالبَ مجتهدٌ B) ظننت أن الطالبُ مجتهدٌ",
    whyExplanation: "After أنَّ, the subject is منصوب. But after أنْ (subjunctive), the verb changes. This tests deep understanding of Arabic complement structures.",
  },
];

// ─── STAGE 2: LOGIC / MAP OF IGNORANCE ─────────────────────
// Gap identification — finding Arabic knowledge gaps
const arabicLogicQuestions: Question[] = [
  {
    id: "ar_l1", pillar: "logic", stage: 2, difficulty: 1, type: "gap-select",
    prompt: "What does كتاب mean?",
    options: ["Pen", "Book", "House", "Car"],
    correctIndex: 1,
    whyExplanation: "كتاب (kitab) = book. One of the first Arabic words learners encounter. If you got this wrong, you need to start with basic vocabulary.",
  },
  {
    id: "ar_l2", pillar: "logic", stage: 2, difficulty: 1, type: "gap-select",
    prompt: "How do you say 'Thank you' in Arabic?",
    options: ["مرحبا", "شكراً", "مع السلامه", "أهلاً وسهلاً"],
    correctIndex: 1,
    whyExplanation: "شكراً (shukran) = thank you. Essential for any Arabic learner.",
  },
  {
    id: "ar_l3", pillar: "logic", stage: 2, difficulty: 2, type: "gap-select",
    prompt: "What is the plural of كتاب (book)?",
    options: ["كتب", "كتابات", "كتائب", "مكاتب"],
    correctIndex: 0,
    whyExplanation: "كتب (kutub) is the broken plural of كتاب. Arabic plurals are often 'broken' (changing the internal structure) rather than just adding a suffix.",
  },
  {
    id: "ar_l4", pillar: "logic", stage: 2, difficulty: 2, type: "gap-select",
    prompt: "Which word means 'water' in Arabic?",
    options: ["نار", "ماء", "هواء", "تراب"],
    correctIndex: 1,
    whyExplanation: "ماء (ma') = water. A fundamental vocabulary word.",
  },
  {
    id: "ar_l5", pillar: "logic", stage: 2, difficulty: 3, type: "gap-select",
    prompt: "What does the root ك-ت-ب relate to?",
    options: ["Reading", "Writing", "Speaking", "Listening"],
    correctIndex: 1,
    whyExplanation: "The root ك-ت-ب (k-t-b) relates to writing: كتاب (book), كاتب (writer), مكتب (office), مكتبة (library). Understanding roots is key to Arabic.",
  },
  {
    id: "ar_l6", pillar: "logic", stage: 2, difficulty: 3, type: "gap-select",
    prompt: "How do you say 'I want' in Arabic?",
    options: ["أريد", "أحب", "أعرف", "أفهم"],
    correctIndex: 0,
    whyExplanation: "أريد (urid) = I want. One of the most useful phrases for beginners.",
  },
  {
    id: "ar_l7", pillar: "logic", stage: 2, difficulty: 4, type: "gap-select",
    prompt: "What is the meaning of إن شاء الله?",
    options: ["God is great", "If God wills", "Thank you", "Peace be upon you"],
    correctIndex: 1,
    whyExplanation: "إن شاء الله (in sha' Allah) = If God wills. Used constantly in Arabic speech. Literally 'if God wants'.",
  },
  {
    id: "ar_l8", pillar: "logic", stage: 2, difficulty: 4, type: "gap-select",
    prompt: "Which is the correct word order for 'The student read the book'?",
    options: ["قرأ الطالب الكتاب", "الطالب قرأ الكتاب", "الكتاب قرأه الطالب", "All are correct"],
    correctIndex: 3,
    whyExplanation: "Arabic has flexible word order. VSO, SVO, and OVS are all grammatically correct, with different emphasis.",
  },
  {
    id: "ar_l9", pillar: "logic", stage: 2, difficulty: 5, type: "gap-select",
    prompt: "What does the pattern فَعِيل indicate in Arabic morphology?",
    options: ["Place", "Time", "Adjective/Quality", "Instrument"],
    correctIndex: 2,
    whyExplanation: "The pattern فَعِيل (fa'il) often indicates an adjective or quality: كبير (big), صغير (small), جميل (beautiful). Understanding patterns unlocks thousands of words.",
  },
  {
    id: "ar_l10", pillar: "logic", stage: 2, difficulty: 5, type: "gap-select",
    prompt: "What is the difference between كان and أصبح?",
    options: ["Both mean 'to be'", "كان = was, أصبح = became", "كان = became, أصبح = was", "Both mean 'to become'"],
    correctIndex: 1,
    whyExplanation: "كان (kana) = was (past tense of 'to be'). أصبح (asbaha) = became. Both are essential verbs for describing states and changes.",
  },
];

// ─── STAGE 3: CHUNKING & COLLOCATIONS ──────────────────────
// Which Arabic words belong together
const arabicVocabQuestions: Question[] = [
  {
    id: "ar_v1", pillar: "vocab", stage: 3, difficulty: 1, type: "chunk",
    prompt: "Which is the natural Arabic collocation for 'make a decision'?",
    options: ["أخذ قرار", "عمل قرار", "صنع قرار", "فعل قرار"],
    correctIndex: 0,
    whyExplanation: "أخذ قرار (akhadha qararan) = make a decision. The verb أخذ (take) collocates with قرار (decision), not عمل or صنع.",
  },
  {
    id: "ar_v2", pillar: "vocab", stage: 3, difficulty: 1, type: "chunk",
    prompt: "Which is correct for 'good morning'?",
    options: ["صباح الخير", "صباح جميل", "صباح سعيد", "صباح مشرق"],
    correctIndex: 0,
    whyExplanation: "صباح الخير (sabah al-khayr) = good morning. The fixed expression uses الخير (goodness), not جميل or سعيد.",
  },
  {
    id: "ar_v3", pillar: "vocab", stage: 3, difficulty: 2, type: "chunk",
    prompt: "Which verb collocates with صلاة (prayer)?",
    options: ["صلى", "عمل", "فعل", "قام"],
    correctIndex: 0,
    whyExplanation: "صلى الصلاة (salla al-salah) = to pray. The verb صلى specifically collocates with صلاة. This is a fixed religious/cultural collocation.",
  },
  {
    id: "ar_v4", pillar: "vocab", stage: 3, difficulty: 2, type: "chunk",
    prompt: "Which is the natural way to say 'I'm hungry' in Arabic?",
    options: ["أنا جائع", "أنا جوعان", "أنا أشعر بالجوع", "All are correct"],
    correctIndex: 3,
    whyExplanation: "All three are correct! جائع and جوعان are adjectives, أشعر بالجوع is a verbal phrase. Arabic has multiple ways to express the same state.",
  },
  {
    id: "ar_v5", pillar: "vocab", stage: 3, difficulty: 3, type: "chunk",
    prompt: "Which collocates with وقت (time)?",
    options: ["قضى الوقت", "أكل الوقت", "شرب الوقت", "لبس الوقت"],
    correctIndex: 0,
    whyExplanation: "قضى الوقت (qada al-waqt) = spent time. The verb قضى (to spend/use up) collocates with وقت. Other verbs don't make sense here.",
  },
  {
    id: "ar_v6", pillar: "vocab", stage: 3, difficulty: 3, type: "chunk",
    prompt: "Which is correct for 'thank you very much'?",
    options: ["شكراً جزيلاً", "شكراً كثيراً", "شكراً كبيراً", "شكراً وافراً"],
    correctIndex: 0,
    whyExplanation: "شكراً جزيلاً (shukran jazeelan) = thank you very much. جزيلاً is the specific adverb used with شكراً, not كثيراً or كبيراً.",
  },
  {
    id: "ar_v7", pillar: "vocab", stage: 3, difficulty: 4, type: "chunk",
    prompt: "Which verb goes with امتحان (exam)?",
    options: ["خضع للامتحان", "أكل الامتحان", "شرب الامتحان", "لبس الامتحان"],
    correctIndex: 0,
    whyExplanation: "خضع للامتحان (khada'a lil-imtihan) = to take an exam. خضع (to undergo) is the specific verb for exams. This is a fixed academic collocation.",
  },
  {
    id: "ar_v8", pillar: "vocab", stage: 3, difficulty: 4, type: "chunk",
    prompt: "Which is the natural way to say 'I miss you' in Arabic?",
    options: ["أشتاق إليك", "أفتقدك", "أحن إليك", "All are correct"],
    correctIndex: 3,
    whyExplanation: "Arabic has many ways to express missing someone: أشتاق (long for), أفتقد (miss), أحن (yearn). All are correct with slightly different nuances.",
  },
  {
    id: "ar_v9", pillar: "vocab", stage: 3, difficulty: 5, type: "chunk",
    prompt: "Which collocates with سلام (peace)?",
    options: ["نشر السلام", "أكل السلام", "شرب السلام", "لبس السلام"],
    correctIndex: 0,
    whyExplanation: "نشر السلام (nashr al-salam) = to spread peace. نشر (to spread) is the verb that collocates with سلام in political/religious contexts.",
  },
  {
    id: "ar_v10", pillar: "vocab", stage: 3, difficulty: 5, type: "chunk",
    prompt: "Which is correct for 'God willing' in a formal context?",
    options: ["إن شاء الله", "بإذن الله", "ما شاء الله", "All are used"],
    correctIndex: 3,
    whyExplanation: "إن شاء الله (if God wills) is most common. بإذن الله (with God's permission) is also used. ما شاء الله (what God has willed) is for past events. Context determines which is appropriate.",
  },
];

// ─── STAGE 4: CULTURAL ATOMS ───────────────────────────────
// Arabic cultural context for English/Portuguese speakers
const arabicCultureQuestions: Question[] = [
  {
    id: "ar_c1", pillar: "culture", stage: 4, difficulty: 1, type: "scenario",
    prompt: "An Arabic colleague says 'إن شاء الله' when discussing future plans. What does this really mean?",
    options: ["They are certain it will happen", "They are expressing hope while leaving it to God's will", "They are refusing politely", "They are expressing doubt"],
    correctIndex: 1,
    whyExplanation: "إن شاء الله (in sha' Allah) is a cultural formula expressing hope while acknowledging God's will. It's not refusal or doubt — it's a fundamental part of Arabic speech.",
  },
  {
    id: "ar_c2", pillar: "culture", stage: 4, difficulty: 1, type: "scenario",
    prompt: "You're invited to an Arabic home for dinner. What is expected?",
    options: ["Arrive exactly on time", "Bring a gift like sweets or flowers", "Wait to be served by the host", "All of the above"],
    correctIndex: 3,
    whyExplanation: "Arabic hospitality culture: bring a gift, be punctual, and wait to be served. Refusing food can be seen as rude — at least try a small portion.",
  },
  {
    id: "ar_c3", pillar: "culture", stage: 4, difficulty: 2, type: "scenario",
    prompt: "Someone says 'ما شاء الله' about your achievement. What is the cultural meaning?",
    options: ["They are jealous", "They are praising God for your blessing", "They are being sarcastic", "They are questioning your ability"],
    correctIndex: 1,
    whyExplanation: "ما شاء الله (ma sha' Allah) acknowledges that your achievement comes from God. It's a compliment and a protection against the evil eye, not jealousy.",
  },
  {
    id: "ar_c4", pillar: "culture", stage: 4, difficulty: 2, type: "scenario",
    prompt: "In Arabic culture, why might someone say 'لا حول ولا قوة إلا بالله'?",
    options: ["They are giving up", "They are expressing humility before God", "They are cursing", "They are celebrating"],
    correctIndex: 1,
    whyExplanation: "لا حول ولا قوة إلا بالله (la hawla wa la quwwata illa billah) expresses humility and acknowledgment that all power comes from God. It's used in many daily situations.",
  },
  {
    id: "ar_c5", pillar: "culture", stage: 4, difficulty: 3, type: "scenario",
    prompt: "Why do Arabic speakers often use 'والله' (by God) in conversation?",
    options: ["They are always swearing", "They are emphasizing truthfulness", "They are being religious", "They are angry"],
    correctIndex: 1,
    whyExplanation: "والله (wallah) = by God. Used to emphasize that you're telling the truth. It's a cultural speech habit, not necessarily a religious statement.",
  },
  {
    id: "ar_c6", pillar: "culture", stage: 4, difficulty: 3, type: "scenario",
    prompt: "What does 'على راسي' (on my head) mean when said in response to a request?",
    options: ["They are refusing", "They are agreeing enthusiastically", "They are confused", "They are asking for time"],
    correctIndex: 1,
    whyExplanation: "على راسي (ala rasi) = on my head. It means 'I'd be happy to' or 'with pleasure.' It's a warm, enthusiastic agreement common in Levantine Arabic.",
  },
  {
    id: "ar_c7", pillar: "culture", stage: 4, difficulty: 4, type: "scenario",
    prompt: "Why might an Arabic speaker say 'تفضل' (tafaddal) when you arrive?",
    options: ["They want you to leave", "They are inviting you in/asking you to go first", "They are asking for payment", "They are expressing surprise"],
    correctIndex: 1,
    whyExplanation: "تفضل (tafaddal) = please go ahead / please come in. It's a fundamental hospitality phrase. The masculine form is used; تفضلي is feminine.",
  },
  {
    id: "ar_c8", pillar: "culture", stage: 4, difficulty: 4, type: "scenario",
    prompt: "What is the significance of 'بسم الله' (in the name of God) in Arabic culture?",
    options: ["Only used in religious contexts", "Said before starting any significant action", "Only said during prayer", "A formal greeting"],
    correctIndex: 1,
    whyExplanation: "بسم الله (bismillah) is said before eating, drinking, starting a journey, beginning work — almost any action. It's a way of invoking God's blessing on daily activities.",
  },
  {
    id: "ar_c9", pillar: "culture", stage: 4, difficulty: 5, type: "scenario",
    prompt: "Why might an Arabic speaker use 'يا الله' (ya Allah) frequently in speech?",
    options: ["They are always praying", "It's an exclamation expressing various emotions", "They are calling for help", "They are being disrespectful"],
    correctIndex: 1,
    whyExplanation: "يا الله (ya Allah) is used as an exclamation for surprise, frustration, admiration, or even just as a filler word. It's deeply embedded in everyday Arabic speech.",
  },
  {
    id: "ar_c10", pillar: "culture", stage: 4, difficulty: 5, type: "scenario",
    prompt: "What does 'الله يعطيك العافية' (God give you health) mean when said to someone working?",
    options: ["They think you look sick", "They are wishing you well and acknowledging your effort", "They want you to stop working", "They are being sarcastic"],
    correctIndex: 1,
    whyExplanation: "الله يعطيك العافية (Allah ya'tik al-afiya) is a common expression of appreciation for someone's work. It literally means 'God give you health/strength.'",
  },
];

// ─── STAGE 5: COMMUNICATION FLUENCY ────────────────────────
// Open production — English/Portuguese speaker producing Arabic
const arabicCommQuestions: Question[] = [
  {
    id: "ar_m1", pillar: "comm", stage: 5, difficulty: 1, type: "open-text",
    prompt: "Write 'Hello, how are you?' in Arabic. (Use Arabic script or transliteration)",
    whyExplanation: "مرحبا، كيف حالك؟ (marhaban, kayfa haluk?) is the most common greeting. Try writing it in Arabic script if you can.",
    keywords: ["مرحبا", "كيف", "حالك", "marhaban", "kayfa"],
  },
  {
    id: "ar_m2", pillar: "comm", stage: 5, difficulty: 1, type: "open-text",
    prompt: "Write 'Thank you very much' in Arabic.",
    whyExplanation: "شكراً جزيلاً (shukran jazeelan) is the standard expression. The word جزيلاً specifically means 'very much' in this context.",
    keywords: ["شكرا", "جزيلا", "shukran"],
  },
  {
    id: "ar_m3", pillar: "comm", stage: 5, difficulty: 2, type: "open-text",
    prompt: "Write 'I want to learn Arabic' in Arabic.",
    whyExplanation: "أريد أن أتعلم العربية (urid an ta'allam al-arabiyya). This uses the verb أراد (to want) + أن (to) + verb in subjunctive.",
    keywords: ["أريد", "أتعلم", "العربية", "urid"],
  },
  {
    id: "ar_m4", pillar: "comm", stage: 5, difficulty: 2, type: "open-text",
    prompt: "Write a short self-introduction in Arabic. (2-3 sentences)",
    whyExplanation: "A basic introduction: name, where you're from, what you do. Tests your ability to form simple Arabic sentences.",
    keywords: [],
  },
  {
    id: "ar_m5", pillar: "comm", stage: 5, difficulty: 3, type: "open-text",
    prompt: "Write 'Where is the bathroom?' in Arabic.",
    whyExplanation: "أين الحمام؟ (ayn al-hammam?) is essential travel vocabulary. أين = where, الحمام = the bathroom.",
    keywords: ["أين", "الحمام", "ayn"],
  },
  {
    id: "ar_m6", pillar: "comm", stage: 5, difficulty: 3, type: "open-text",
    prompt: "Write 'I don't understand' in Arabic.",
    whyExplanation: "لا أفهم (la afham) = I don't understand. One of the most useful phrases for learners.",
    keywords: ["لا", "أفهم", "la", "afham"],
  },
  {
    id: "ar_m7", pillar: "comm", stage: 5, difficulty: 4, type: "open-text",
    prompt: "Write a short paragraph about why you want to learn Arabic. (4-5 sentences)",
    whyExplanation: "Tests your ability to express reasons and motivations in Arabic. Use لأن (because) and أريد (I want).",
    keywords: [],
  },
  {
    id: "ar_m8", pillar: "comm", stage: 5, difficulty: 4, type: "open-text",
    prompt: "Write 'Could you please speak more slowly?' in Arabic.",
    whyExplanation: "هل يمكنك أن تتكلم ببطء أكثر؟ (hal yumkinuk an tatakallam bi-but' akthar?). A practical phrase for learners.",
    keywords: ["هل", "يمكنك", "تتكلم", "ببطء"],
  },
  {
    id: "ar_m9", pillar: "comm", stage: 5, difficulty: 5, type: "open-text",
    prompt: "Write a formal letter opening in Arabic. (2-3 sentences)",
    whyExplanation: "Formal Arabic letter writing uses specific formulas: السيد المحترم (Dear Sir), تحية طيبة وبعد (Greetings and then...).",
    keywords: [],
  },
  {
    id: "ar_m10", pillar: "comm", stage: 5, difficulty: 5, type: "open-text",
    prompt: "Write a short review of an Arabic book or film you've experienced. (5-6 sentences)",
    whyExplanation: "Tests advanced production: opinions, descriptions, recommendations. Use أعجبني (I liked) and أنصح بـ (I recommend).",
    keywords: [],
  },
];

// ─── FULL ARABIC QUESTION BANK ──────────────────────────────
export const ARABIC_QUESTION_BANK: Question[] = [
  ...arabicGrammarQuestions,
  ...arabicLogicQuestions,
  ...arabicVocabQuestions,
  ...arabicCultureQuestions,
  ...arabicCommQuestions,
];

export const ARABIC_QUESTIONS_BY_PILLAR: Record<string, Question[]> = {
  grammar: arabicGrammarQuestions,
  logic: arabicLogicQuestions,
  vocab: arabicVocabQuestions,
  culture: arabicCultureQuestions,
  comm: arabicCommQuestions,
};
