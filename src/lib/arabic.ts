/**
 * Lexio Underground — Arabic Language Support
 *
 * Arabic is a closed language feature — only available to specific users (Timon).
 * It includes RTL layout support, Arabic-specific content, and cultural atoms.
 *
 * This module provides:
 * 1. Language detection and RTL layout switching
 * 2. Arabic question bank for Cartografa
 * 3. Arabic cultural atoms and content
 * 4. Font loading for Arabic (Amiri, Noto Sans Arabic)
 */

export type SupportedLanguage = "en" | "ar" | "pt";

export interface LanguageConfig {
  code: SupportedLanguage;
  name: string;
  nativeName: string;
  direction: "ltr" | "rtl";
  fontFamilies: string[];
  flagEmoji: string;
}

export const LANGUAGES: Record<SupportedLanguage, LanguageConfig> = {
  en: {
    code: "en",
    name: "English",
    nativeName: "English",
    direction: "ltr",
    fontFamilies: ["Syne", "Source Serif 4", "JetBrains Mono"],
    flagEmoji: "🇺🇸",
  },
  ar: {
    code: "ar",
    name: "Arabic",
    nativeName: "العربية",
    direction: "rtl",
    fontFamilies: ["Amiri", "Noto Sans Arabic", "JetBrains Mono"],
    flagEmoji: "🇸🇦",
  },
  pt: {
    code: "pt",
    name: "Portuguese",
    nativeName: "Português",
    direction: "ltr",
    fontFamilies: ["Syne", "Source Serif 4", "JetBrains Mono"],
    flagEmoji: "🇧🇷",
  },
};

// Arabic is only available to specific users
export const ARABIC_ALLOWED_EMAILS = [
  "talles.dg@proton.me", // Timon
];

export function isArabicAllowed(userEmail: string | null | undefined): boolean {
  if (!userEmail) return false;
  return ARABIC_ALLOWED_EMAILS.some(
    (allowed) => allowed.toLowerCase() === userEmail.toLowerCase()
  );
}

export function getLanguageFromBrowser(): SupportedLanguage {
  if (typeof navigator === "undefined") return "en";
  const lang = navigator.language.split("-")[0];
  if (lang === "ar") return "ar";
  if (lang === "pt") return "pt";
  return "en";
}

// Arabic-specific Cartografa questions (Stage 4: Culture — Arabic context)
export const arabicCultureQuestions = [
  {
    id: "ar_c1",
    pillar: "culture" as const,
    stage: 4 as const,
    difficulty: 1 as const,
    type: "scenario" as const,
    prompt: "في اجتماع عمل عربي، زميلك يقول 'إن شاء الله' عند الحديث عن خطط المستقبل. ماذا يعني هذا فعلياً؟",
    options: [
      "يعني أنه متأكد تماماً من حدوث الأمر",
      "تعبير عن الأمل والتفاؤل مع ترك الأمر لله",
      "يعني أنه يرفض الطلب بلطف",
      "تعبير عن عدم الاهتمام",
    ],
    correctIndex: 1,
    whyExplanation: "'إن شاء الله' تعبير ثقافي عميق في الثقافة العربية. يعني 'بإذن الله' — تفاؤل مع تواضع. ليس رفضاً ولا قبولاً، بل تفويض الأمر لله.",
  },
  {
    id: "ar_c2",
    pillar: "culture" as const,
    stage: 4 as const,
    difficulty: 2 as const,
    type: "scenario" as const,
    prompt: "صديق عربي يدعوك لتناول الطعام في بيته. ما هو السلوك المتوقع؟",
    options: [
      "الوصول في الوقت المحدد بالضبط",
      "الوصول متأخراً 15-30 دقيقة",
      "الوصول قبل الموعد لإظهار الاحترام",
      "الاتصال قبل الوصول بساعة",
    ],
    correctIndex: 1,
    whyExplanation: "في الثقافة العربية، الوصول في الوقت المحدد بالضبط قد يُفسَّر على أنه جشع. التأخير 15-30 دقيقة هو المعتاد ويُظهر التواضع.",
  },
  {
    id: "ar_c3",
    pillar: "culture" as const,
    stage: 4 as const,
    difficulty: 3 as const,
    type: "scenario" as const,
    prompt: "شخص يقول لك 'الله يعطيك العافية' بعد أن قدمت له شيئاً. ما المعنى الثقافي؟",
    options: [
      "دعاء بالصحة فقط",
      "تعبير عن الامتنان مع دعاء بالبركة",
      "يعني أنه يريد المزيد",
      "تعبير عن الأسف",
    ],
    correctIndex: 1,
    whyExplanation: "'الله يعطيك العافية' ليس مجرد شكر — بل دعاء بأن يمنحك الله الصحة والقوة. هو أعمق من 'شكراً' ويحمل بُعداً روحانياً.",
  },
  {
    id: "ar_c4",
    pillar: "culture" as const,
    stage: 4 as const,
    difficulty: 4 as const,
    type: "scenario" as const,
    prompt: "في محادثة عربية، شخص يقول 'يا هلا فيك'. ما هو السياق الثقافي؟",
    options: [
      "ترحيب رسمي فقط",
      "تعبير عن الفرح باللقاء مع إشارة إلى الكرم",
      "يعني أنه لم يتوقع وصولك",
      "تعبير عن الدهشة",
    ],
    correctIndex: 1,
    whyExplanation: "'يا هلا' مشتقة من 'أهل' — أي أنك من أهلي وأسرتي. هي تعبير عن الحميمية والكرم، وليست مجرد ترحيب.",
  },
  {
    id: "ar_c5",
    pillar: "culture" as const,
    stage: 4 as const,
    difficulty: 5 as const,
    type: "scenario" as const,
    prompt: "شخص عربي يقول 'بالعكس' عندما تقدم له شيئاً. ما المعنى الضمني؟",
    options: [
      "يعني أنه لا يريد ما قدمته",
      "تعبير عن التواضع — أنت أولى به",
      "يعني أنه يريد شيئاً مختلفاً",
      "رفض مهذب",
    ],
    correctIndex: 1,
    whyExplanation: "'بالعكس' في الثقافة العربية تعبير عن التواضع والكرم — أنت أولى بما قدمته. ليس رفضاً بل إظهار أنك كريم أكثر منه.",
  },
];

// Arabic-specific vocabulary chunks
export const arabicVocabQuestions = [
  {
    id: "ar_v1",
    pillar: "vocab" as const,
    stage: 3 as const,
    difficulty: 1 as const,
    type: "chunk" as const,
    prompt: "ما هو التعبير العربي المكافئ لـ 'break a leg' في الإنجليزية؟",
    options: [
      "بالتوفيق",
      "ربنا معاك",
      "شد حيلك",
      "الله يوفقك",
    ],
    correctIndex: 1,
    whyExplanation: "'ربنا معاك' (ربنا معاك) هو الأقرب لـ 'break a leg' — دعاء بالنجاح مع تفويض الأمر لله.",
  },
  {
    id: "ar_v2",
    pillar: "vocab" as const,
    stage: 3 as const,
    difficulty: 2 as const,
    type: "chunk" as const,
    prompt: "كيف تقول 'on cloud nine' بالعربية؟",
    options: [
      "على السحاب",
      "طاير من الفرح",
      "فوق القمر",
      "مبسوط أوي",
    ],
    correctIndex: 1,
    whyExplanation: "'طاير من الفرح' هو التعبير الأقرب — صورة الطيران تعبر عن الفرح الشديد، مثل 'on cloud nine'.",
  },
  {
    id: "ar_v3",
    pillar: "vocab" as const,
    stage: 3 as const,
    difficulty: 3 as const,
    type: "chunk" as const,
    prompt: "ما معنى 'يا عيب الشوم' في السياق الثقافي العربي؟",
    options: [
      "تعبير عن الغضب",
      "تعبير عن الخجل من فعل شيء غير لائق",
      "تعبير عن الدهشة",
      "تعبير عن الحزن",
    ],
    correctIndex: 1,
    whyExplanation: "'يا عيب الشوم' تعبير ثقافي عميق — يعني 'يا للعار'. يستخدم للتعبير عن أن شيئاً ما غير لائق أو مخجل.",
  },
];

// Arabic communication questions
export const arabicCommQuestions = [
  {
    id: "ar_m1",
    pillar: "comm" as const,
    stage: 5 as const,
    difficulty: 1 as const,
    type: "open-text" as const,
    prompt: "اكتب جملة عربية تستخدم فيها تعبير 'ما شاء الله' في سياق مناسب.",
    whyExplanation: "'ما شاء الله' تعبير يستخدم للتعبير عن الإعجاب مع الحسد الحميد. اكتب جملة تظهر فهمك للسياق.",
    keywords: ["ما", "شاء", "الله"],
  },
  {
    id: "ar_m2",
    pillar: "comm" as const,
    stage: 5 as const,
    difficulty: 2 as const,
    type: "open-text" as const,
    prompt: "اكتب رسالة قصيرة باللغة العربية تعتذر فيها عن التأخر إلى صديق.",
    whyExplanation: "الاعتذار في الثقافة العربية يتضمن تعبيرات عن التقدير والاحترام. اكتب رسالة مناسبة.",
    keywords: ["أعذر", "تأخرة", "عذر"],
  },
  {
    id: "ar_m3",
    pillar: "comm" as const,
    stage: 5 as const,
    difficulty: 3 as const,
    type: "open-text" as const,
    prompt: "اشرح باللغة العربية الفرق بين 'إن شاء الله' و 'بإذن الله'.",
    whyExplanation: "كلا التعبيرين يتعلقان بتفويض الأمر لله، لكن لهما دلالات مختلفة. اشرح الفرق.",
    keywords: ["إن", "شاء", "إذن", "الله"],
  },
];

// All Arabic questions combined
export const ARABIC_QUESTION_BANK = [
  ...arabicCultureQuestions,
  ...arabicVocabQuestions,
  ...arabicCommQuestions,
];

// Arabic UI translations
export const ARABIC_UI: Record<string, string> = {
  // Navigation
  "nav.home": "الرئيسية",
  "nav.diagnostico": "التشخيص",
  "nav.pulse": "النبض",
  "nav.palace": "القصر",
  "nav.deep": "الوضع العميق",
  "nav.profile": "الملف الشخصي",
  "nav.pricing": "الأسعار",

  // Home page
  "home.title": "ليكسو أندرغراوند",
  "home.tagline": "ارسم خريطة جهلك. أتقن لغتك.",
  "home.description": "أداة تشخيصية ذاتية لمتعلمي اللغات. اكتشف ما لا تعرفه من خلال تقييم كارتوغرافا، ثم ابنِ قصر الذاكرة الخاص بك.",
  "home.cta": "ابدأ كارتوغرافا",
  "home.signin": "تسجيل الدخول",

  // Diagnostic
  "diag.title": "كارتوغرافا — التشخيص التكيفي",
  "diag.stage": "المرحلة",
  "diag.question": "السؤال",
  "diag.next": "التالي",
  "diag.back": "السابق",
  "diag.why": "لماذا؟",
  "diag.correct": "صحيح!",
  "diag.incorrect": "ليس تماماً",
  "diag.complete": "اكتمل التشخيص",

  // Report
  "report.title": "تقرير كارتوغرافا",
  "report.pillar_scores": "درجات الركائز",
  "report.map_of_ignorance": "خريطة الجهل",
  "report.overall_readiness": "الجاهزية العامة",
  "report.recommended_focus": "التركيز المقترح",
  "report.identity": "هويتك اللغوية",
  "report.share": "مشاركة التقرير",

  // Palace
  "palace.title": "قصر الذاكرة",
  "palace.entrance": "المدخل",
  "palace.grammar": "غرفة القواعد",
  "palace.vocab": "غرفة المفردات",
  "palace.logic": "غرفة المنطق",
  "palace.culture": "غرفة الثقافة",
  "palace.comm": "قاعة التواصل",

  // Maturity stages
  "stage.roots": "الجذور",
  "stage.sprouts": "البراعم",
  "stage.branches": "الأغصان",
  "stage.canopy": "المظلة",
  "stage.underground": "تحت الأرض",

  // Common
  "common.loading": "جاري التحميل...",
  "common.error": "حدث خطأ",
  "common.retry": "إعادة المحاولة",
  "common.save": "حفظ",
  "common.cancel": "إلغاء",
  "common.close": "إغلاق",
  "common.back": "رجوع",
};
