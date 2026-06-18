// src/cartografa/question-bank-ar.ts
// Arabic Cartografa Question Bank — 50 questions across 5 pillars
// Based on lexio-vault/01-product/cartografa.md

import type { Question } from "./question-bank";

// ─── STAGE 1: GRAMMAR ───────────────────────────────────────
const arabicGrammarQuestions: Question[] = [
  { id: "ar_g1", pillar: "grammar", stage: 1, difficulty: 1, type: "likert", prompt: "عندما تسمع I have 25 years بدلاً من I am 25 years old، هل يبدو لك خطأً؟", whyExplanation: "لدي 25 سنة هي ترجمة حرفية من العربية. في الإنجليزية، نستخدم to be للعمر، ليس to have." },
  { id: "ar_g2", pillar: "grammar", stage: 1, difficulty: 1, type: "likert", prompt: "الجملة She don't like coffee — هل تبدو غريبة لك، حتى بدون معرفة القاعدة بالضبط؟", whyExplanation: "في الإنجليزية، الشخص الثالث (he/she/it) يتطلب doesn't. الحدس بأن تبدو خاطئة هو المستوى الأول من الوعي النحوي." },
  { id: "ar_g3", pillar: "grammar", stage: 1, difficulty: 2, type: "likert", prompt: "I am working here since 2020 — هل تشعر أن هناك خطأً، حتى بدون معرفة السبب؟", whyExplanation: "في الإنجليزية، نستخدم Present Perfect للأفعال التي بدأت في الماضي وتستمر: I have been working here since 2020." },
  { id: "ar_g4", pillar: "grammar", stage: 1, difficulty: 2, type: "likert", prompt: "He suggested me to study more — هل تبدو طبيعية أم غريبة لك؟", whyExplanation: "في الإنجليزية، suggest لا تقبل مفعول غير مباشر + فعل. الصحيح: He suggested that I study more." },
  { id: "ar_g5", pillar: "grammar", stage: 1, difficulty: 3, type: "likert", prompt: "If I would have known, I would have helped — هل تدرك أن هذه الصيغة إشكالية؟", whyExplanation: "Third Conditional الصحيح هو If I had known, I would have helped. استخدام would have في if-clause هو خطأ شائع." },
  { id: "ar_g6", pillar: "grammar", stage: 1, difficulty: 3, type: "likert", prompt: "هل تلاحظ فرقاً بين I did it و I've done it؟ هل تعرف متى تستخدم كل واحدة؟", whyExplanation: "Simple Past (did) = فعل مكتمل في الماضي. Present Perfect (have done) = فعل له صلة بالحاضر." },
  { id: "ar_g7", pillar: "grammar", stage: 1, difficulty: 4, type: "likert", prompt: "The data shows vs The data show — هل كنت تعلم أن كلاهما يمكن أن يكون صحيحاً؟", whyExplanation: "data جمع في اللاتينية. في السياقات الأكاديمية، the data show مفضل. في الاستخدام غير الرسمي، the data shows مقبول." },
  { id: "ar_g8", pillar: "grammar", stage: 1, difficulty: 4, type: "likert", prompt: "Between you and I — هل يبدو خطأً لك، أم يبدو رسمياً وصحيحاً؟", whyExplanation: "الصحيح هو between you and me. Between حرف جر، يتطلب حالة المفعول به." },
  { id: "ar_g9", pillar: "grammar", stage: 1, difficulty: 5, type: "likert", prompt: "I wish I was there vs I wish I were there — هل تدرك الفرق وأيهما صحيح رسمياً؟", whyExplanation: "صيغة الشرط في الإنجليزية (were لجميع الأشخاص) تختفي في اللغة غير الرسمية. I wish I were صحيح رسمياً." },
  { id: "ar_g10", pillar: "grammar", stage: 1, difficulty: 5, type: "likert", prompt: "Each student should bring their book — هل تتعرف على هذا كحالة مقبولة لـ they المفرد؟", whyExplanation: "They المفرد له قرون من الاستخدام. يُقبل كضمير محايد جنسياً." },
];

// ─── STAGE 2: LOGIC ─────────────────────────────────────────
const arabicLogicQuestions: Question[] = [
  { id: "ar_l1", pillar: "logic", stage: 2, difficulty: 1, type: "gap-select", prompt: "ما الفرق بين make و do؟ أي جملة صحيحة؟", options: ["I do a mistake", "I made a mistake", "I did a mistake", "I made the mistake"], correctIndex: 1, whyExplanation: "Make و do فعلان سببيان. Make a mistake تركيب ثابت." },
  { id: "ar_l2", pillar: "logic", stage: 2, difficulty: 1, type: "gap-select", prompt: "ما هي الطريقة الصحيحة للسؤال عن العادات؟", options: ["Do you like coffee?", "Are you liking coffee?", "Are you like coffee?", "Do you liking coffee?"], correctIndex: 0, whyExplanation: "أفعال الحالة (like, love, know) لا تستخدم Present Continuous في الإنجليزية." },
  { id: "ar_l3", pillar: "logic", stage: 2, difficulty: 2, type: "gap-select", prompt: "أكمل: I have been living here ___ 2019.", options: ["since", "for", "from", "during"], correctIndex: 0, whyExplanation: "since = نقطة في الزمن (2019). for = مدة (3 سنوات)." },
  { id: "ar_l4", pillar: "logic", stage: 2, difficulty: 2, type: "gap-select", prompt: "أي جملة تستخدم أداة التعريف بشكل صحيح؟", options: ["I love the music", "I love music", "I love a music", "I love musics"], correctIndex: 1, whyExplanation: "نستخدم أداة التعريف الصفرية مع الأسماء غير المعدودة في المعنى العام." },
  { id: "ar_l5", pillar: "logic", stage: 2, difficulty: 3, type: "gap-select", prompt: "أي جملة تعبر عن رأي شخصي بشكل صحيح؟", options: ["In my opinion, I think that...", "I think that...", "According to me...", "For my side..."], correctIndex: 1, whyExplanation: "In my opinion, I think تكرار. According to me غير موجودة في الإنجليزية القياسية." },
  { id: "ar_l6", pillar: "logic", stage: 2, difficulty: 3, type: "gap-select", prompt: "أكمل: If I ___ rich, I would travel the world.", options: ["am", "was", "were", "be"], correctIndex: 2, whyExplanation: "Second Conditional يتطلب were (صيغة الشرط) لجميع الأشخاص." },
  { id: "ar_l7", pillar: "logic", stage: 2, difficulty: 4, type: "gap-select", prompt: "أي جملة تستخدم حرف الجر الصحيح؟", options: ["I'm interested in learn English", "I'm interested in learning English", "I'm interested to learn English", "I'm interested for learning English"], correctIndex: 1, whyExplanation: "Interested in + المصدر. تصريف الأفعال من أصعب الأجزاء للناطقين بالعربية." },
  { id: "ar_l8", pillar: "logic", stage: 2, difficulty: 4, type: "gap-select", prompt: "أي جملة تعبر عن المبني للمجهول بشكل صحيح؟", options: ["The book was wrote by her", "The book was written by her", "The book was write by her", "The book has wrote by her"], correctIndex: 1, whyExplanation: "المبني للمجهول: was + اسم المفعول. Written هو اسم المفعول لـ write." },
  { id: "ar_l9", pillar: "logic", stage: 2, difficulty: 5, type: "gap-select", prompt: "أي جملة تستخدم الكلام المنقول بشكل صحيح؟", options: ["He said that he will come tomorrow", "He said that he would come the next day", "He said that he would come tomorrow", "He said that he will come the next day"], correctIndex: 1, whyExplanation: "الكلام المنقول يتطلب backshift: will would, tomorrow the next day." },
  { id: "ar_l10", pillar: "logic", stage: 2, difficulty: 5, type: "gap-select", prompt: "أي جملة تستخدم whose بشكل صحيح؟", options: ["The man which car was stolen", "The man who car was stolen", "The man whose car was stolen", "The man that car was stolen"], correctIndex: 2, whyExplanation: "Whose = ضمير ملكية للأشخاص والأشياء. Which/that/who لا تعبر عن الملكية." },
];

// ─── STAGE 3: VOCAB ─────────────────────────────────────────
const arabicVocabQuestions: Question[] = [
  { id: "ar_v1", pillar: "vocab", stage: 3, difficulty: 1, type: "chunk", prompt: "ما هو التركيب الطبيعي في الإنجليزية؟", options: ["do a shower", "take a shower", "make a shower", "have a shower"], correctIndex: 1, whyExplanation: "Take a shower هو التركيب الأمريكي القياسي. Have a shower مقبول (بريطاني)." },
  { id: "ar_v2", pillar: "vocab", stage: 3, difficulty: 1, type: "chunk", prompt: "ما هو التركيب الصحيح للتعبير عن الموافقة؟", options: ["I'm agree", "I agree", "I am agree", "I do agree"], correctIndex: 1, whyExplanation: "Agree فعل، ليس صفة. I agree = أوافق. I'm agree تداخل مباشر من أنا موافق." },
  { id: "ar_v3", pillar: "vocab", stage: 3, difficulty: 2, type: "chunk", prompt: "أكمل التركيب: pay ___ (دفع غرامة)", options: ["a fine", "a penalty", "a ticket", "a fee"], correctIndex: 0, whyExplanation: "Pay a fine = دفع غرامة. Pay a ticket = دفع تذكرة. Pay a fee = دفع رسوم." },
  { id: "ar_v4", pillar: "vocab", stage: 3, difficulty: 2, type: "chunk", prompt: "ما هو التركيب الذي يعبر عن البقاء في المنزل بشكل طبيعي؟", options: ["stay at home", "stay in home", "remain at home", "keep at home"], correctIndex: 0, whyExplanation: "Stay at home هو التركيب الأكثر طبيعية وشيوعاً." },
  { id: "ar_v5", pillar: "vocab", stage: 3, difficulty: 3, type: "chunk", prompt: "ما هو التركيب الأكاديمي الصحيح؟", options: ["make research", "do research", "conduct research", "run research"], correctIndex: 2, whyExplanation: "Conduct research هو التركيب الأكاديمي الرسمي. Do research مقبول غير رسمي." },
  { id: "ar_v6", pillar: "vocab", stage: 3, difficulty: 3, type: "chunk", prompt: "أكمل: It makes ___ to study daily.", options: ["sense", "meaning", "reason", "logic"], correctIndex: 0, whyExplanation: "Make sense تركيب ثابت. Make meaning موجود لكنه أدبي." },
  { id: "ar_v7", pillar: "vocab", stage: 3, difficulty: 4, type: "chunk", prompt: "ما هو التركيب الذي يعبر عن الاعتزاز بـ؟", options: ["be proud of", "have pride of", "feel pride of", "be pride of"], correctIndex: 0, whyExplanation: "Be proud of هو التركيب الطبيعي. Have pride in موجود لكنه أكثر تجريداً." },
  { id: "ar_v8", pillar: "vocab", stage: 3, difficulty: 4, type: "chunk", prompt: "ما هو الفعل الاصطلاحي الصحيح لـ التأجيل؟", options: ["put off", "put away", "put down", "put out"], correctIndex: 0, whyExplanation: "Put off = يؤجل. Put away = يخزن. Put down = يضع/ينتقد. Put out = يطفئ/ينشر." },
  { id: "ar_v9", pillar: "vocab", stage: 3, difficulty: 5, type: "chunk", prompt: "ما هو التركيب الأكاديمي الذي يعبر عن التوصل إلى استنتاج؟", options: ["reach a conclusion", "arrive at a conclusion", "come to a conclusion", "get to a conclusion"], correctIndex: 0, whyExplanation: "Reach/arrive at/come to a conclusion كلها مقبولة. لكن reach هو الأكثر رسمية." },
  { id: "ar_v10", pillar: "vocab", stage: 3, difficulty: 5, type: "chunk", prompt: "ما هو التركيب الصحيح لـ التعامل مع مشكلة؟", options: ["deal with a problem", "deal a problem", "handle of a problem", "cope a problem"], correctIndex: 0, whyExplanation: "Deal with فعل اصطلاحي يتطلب with. Cope with صحيح أيضاً لكنه أكثر رسمية." },
];

// ─── STAGE 4: CULTURE ───────────────────────────────────────
const arabicCultureQuestions: Question[] = [
  { id: "ar_c1", pillar: "culture", stage: 4, difficulty: 1, type: "scenario", prompt: "زميل أمريكي يقول What's up? عندما يراك. ماذا يعني هذا فعلياً؟", options: ["يريد معرفة تفاصيل حياتي", "إنه مجرد تحية غير رسمية، مثل كيف حالك؟", "يسأل عن أنشطتي", "يسأل عن ما يحدث"], correctIndex: 1, whyExplanation: "What's up? تحية غير رسمية. الإجابة المتوقعة هي Not much أو Same old." },
  { id: "ar_c2", pillar: "culture", stage: 4, difficulty: 1, type: "scenario", prompt: "أنت في مطعم أمريكي والنادل يسأل How are you doing?. ماذا تجيب؟", options: ["I'm fine, thank you. And you?", "Good, thanks. Can I see the menu?", "I'm doing well, I've been busy with work...", "Fine."], correctIndex: 1, whyExplanation: "في سياق الخدمة، How are you doing? هي صيغة اجتماعية، وليست دعوة للمحادثة." },
  { id: "ar_c3", pillar: "culture", stage: 4, difficulty: 2, type: "scenario", prompt: "في اجتماع عمل، زميلك يقول Let's table this discussion. ماذا يعني؟", options: ["لنناقش هذا على الطاولة", "لنؤجل هذه المناقشة", "لنضع هذا في جدول الأعمال", "لننهي هذه المناقشة"], correctIndex: 1, whyExplanation: "Table كفعل في الإنجليزية الأمريكية يعني تأجيل/وضع جانباً." },
  { id: "ar_c4", pillar: "culture", stage: 4, difficulty: 2, type: "scenario", prompt: "تتلقى بريداً إلكترونياً يقول Per my last email.... ماذا يعني هذا فعلياً؟", options: ["وفقاً لبريدي الأخير (إشارة محايدة)", "لقد شرحت هذا من قبل (عدوانية سلبية)", "يرجى قراءة بريدي السابق", "متابعة لما قلته سابقاً"], correctIndex: 1, whyExplanation: "Per my last email مشهور كعدوانية سلبية في الشركات. عملياً = لقد قلت هذا بالفعل، انتبه." },
  { id: "ar_c5", pillar: "culture", stage: 4, difficulty: 3, type: "scenario", prompt: "أمريكي يقول That's interesting حول فكرتك. ماذا يعني عادةً؟", options: ["وجدها مثيرة للاهتمام حقاً", "ليس لديه رأي محدد", "بلباقة، لا يريد القول أنه لم يعجبه", "يريد معرفة المزيد"], correctIndex: 2, whyExplanation: "That's interesting يمكن أن تكون تلطيفاً لـ لا أتفق/لم يعجبني." },
  { id: "ar_c6", pillar: "culture", stage: 4, difficulty: 3, type: "scenario", prompt: "مدعو لتناول العشاء في منزل أمريكي. ما هو السلوك المتوقع؟", options: ["الوصول في الوقت المحدد بالضبط", "إحضار زجاجة نبيذ أو حلوى", "انتظار أن يقدم لك المضيف الطعام", "جميع البدائل"], correctIndex: 3, whyExplanation: "الثقافة الأمريكية: إحضار هدية، الوصول في الوقت المحدد، انتظار أن يقدم لك المضيف." },
  { id: "ar_c7", pillar: "culture", stage: 4, difficulty: 4, type: "scenario", prompt: "في بريد إلكتروني مهني، تكتب I hope this email finds you well. متى يكون هذا مناسباً؟", options: ["دائماً، في أي بريد إلكتروني", "فقط في التواصل الأول أو بعد فترة طويلة بدون تواصل", "فقط للرؤساء", "أبداً، إنه قديم"], correctIndex: 1, whyExplanation: "هذه الصيغة مناسبة في التواصل الأول أو بعد فترة طويلة. استخدامها في كل رد يبدو آلياً." },
  { id: "ar_c8", pillar: "culture", stage: 4, difficulty: 4, type: "scenario", prompt: "شخص يقول You're welcome بعد أن تشكره. هل هناك بديل أكثر طبيعية في سياق غير رسمي؟", options: ["No problem أو Sure thing", "You're welcome هو دائماً الخيار الأفضل", "Don't mention it", "It was nothing"], correctIndex: 0, whyExplanation: "في السياقات غير الرسمية، No problem، Sure thing، Of course أكثر طبيعية." },
  { id: "ar_c9", pillar: "culture", stage: 4, difficulty: 5, type: "scenario", prompt: "في مفاوضة، زميلك يقول I hear what you're saying, but.... ماذا يشير هذا؟", options: ["يستمع باهتمام", "يختلف لكنه يريد الحفاظ على الانسجام", "لم يفهم وجهة نظرك", "يريد المزيد من التفاصيل"], correctIndex: 1, whyExplanation: "I hear what you're saying, but... هي صيغة لباقة للتعارض. تعني أفهم لكنني أختلف." },
  { id: "ar_c10", pillar: "culture", stage: 4, difficulty: 5, type: "scenario", prompt: "ترى RSVP في دعوة. ماذا يعني وما هو المتوقع؟", options: ["رد سواء كنت ستحضر أم لا", "إنها مجرد رسمية، لا تحتاج للرد", "تأكيد الحضور عبر البريد الإلكتروني", "الرد فقط إذا لن تحضر"], correctIndex: 0, whyExplanation: "RSVP = الرجاء الرد. إلزامي الرد، سواء كنت ستحضر أم لا." },
];

// ─── STAGE 5: COMMUNICATION ─────────────────────────────────
const arabicCommQuestions: Question[] = [
  { id: "ar_m1", pillar: "comm", stage: 5, difficulty: 1, type: "open-text", prompt: "اكتب جملة بالإنجليزية تستخدم فيها كلمة actually. (1-2 جمل)", whyExplanation: "Actually = في الواقع (وليس atualmente).", keywords: ["actually"] },
  { id: "ar_m2", pillar: "comm", stage: 5, difficulty: 1, type: "open-text", prompt: "كيف تطلب بأدب من شخص أن يكرر ما قاله؟ اكتب بالإنجليزية.", whyExplanation: "Could you repeat that?, Sorry, I didn't catch that, Pardon? هي أشكال طبيعية.", keywords: ["repeat", "sorry", "pardon", "catch"] },
  { id: "ar_m3", pillar: "comm", stage: 5, difficulty: 2, type: "open-text", prompt: "اشرح بالإنجليزية ماذا تفعل في العمل/الدراسة. (2-3 جمل)", whyExplanation: "القدرة على وصف الروتين المهني هي علامة الكفاءة.", keywords: ["work", "study", "job", "student"] },
  { id: "ar_m4", pillar: "comm", stage: 5, difficulty: 2, type: "open-text", prompt: "اكتب بريداً إلكترونياً قصيراً لإلغاء اجتماع بطريقة مهذبة. (3-4 جمل)", whyExplanation: "البريد المهني يتطلب: تحية، سبب مباشر لكن مهذب، بديل، اعتذار موجز.", keywords: ["cancel", "sorry", "reschedule", "apologize"] },
  { id: "ar_m5", pillar: "comm", stage: 5, difficulty: 3, type: "open-text", prompt: "أعطِ رأيك في تعلم اللغات بالذكاء الاصطناعي. (3-4 جمل)", whyExplanation: "التعبير عن الرأي يتطلب: I think/believe/feel that...، تبرير، أمثلة.", keywords: ["think", "believe", "learning", "language"] },
  { id: "ar_m6", pillar: "comm", stage: 5, difficulty: 3, type: "open-text", prompt: "احكِ قصة قصيرة عن سوء فهم تعرضت له بالإنجليزية. (4-5 جمل)", whyExplanation: "السرد في الماضي يتطلب إتقان الأزمنة.", keywords: ["was", "went", "said", "thought"] },
  { id: "ar_m7", pillar: "comm", stage: 5, difficulty: 4, type: "open-text", prompt: "ناقش لصالح أو ضد: التعلم الحضوري أفضل من التعلم عبر الإنترنت للغات. (4-5 جمل)", whyExplanation: "المناقشة تتطلب: أطروحة واضحة، روابط، أمثلة، خلاصة.", keywords: ["however", "because", "example", "conclusion"] },
  { id: "ar_m8", pillar: "comm", stage: 5, difficulty: 4, type: "open-text", prompt: "اشرح مفهوماً من مجال عملك لشخص لا يفهم شيئاً عن الموضوع. (4-5 جمل)", whyExplanation: "تبسيط المفاهيم المعقدة هو أعلى مهارة تواصلية.", keywords: [] },
  { id: "ar_m9", pillar: "comm", stage: 5, difficulty: 5, type: "open-text", prompt: "اكتب فقرة رسمية عن مشكلة اجتماعية في العالم العربي. (5-6 جمل)", whyExplanation: "الكتابة الرسمية تتطلب: المبني للمجهول، التحويل إلى أسماء، مفردات أكاديمية.", keywords: ["society", "problem", "issue", "solution"] },
  { id: "ar_m10", pillar: "comm", stage: 5, difficulty: 5, type: "open-text", prompt: "اكتب مراجعة نقدية (review) لفيلم أو كتاب بالإنجليزية. (5-6 جمل)", whyExplanation: "المراجعة النقدية تتطلب: ملخص موجز، تحليل، رأي مبرر، لغة متطورة.", keywords: ["review", "recommend", "story", "character"] },
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
