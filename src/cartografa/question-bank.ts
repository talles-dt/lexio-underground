// src/cartografa/question-bank.ts
// 50+ questions across 5 pillars for the Cartografa diagnostic
// Based on lexio-vault/01-product/cartografa.md

export type Pillar = "grammar" | "logic" | "vocab" | "culture" | "comm";

export type QuestionType =
  | "likert" // 1-5 agreement scale (Stage 1: Grammar Intuition)
  | "gap-select" // identify knowledge gaps (Stage 2: Logic)
  | "chunk" // which words belong together (Stage 3: Vocabulary)
  | "scenario" // cultural reasoning, no right/wrong (Stage 4: Culture)
  | "open-text"; // free production (Stage 5: Communication)

export interface Question {
  id: string;
  pillar: Pillar;
  stage: 1 | 2 | 3 | 4 | 5;
  difficulty: 1 | 2 | 3 | 4 | 5; // 1=easiest, 5=hardest
  type: QuestionType;
  prompt: string; // Portuguese prompt for the learner
  whyExplanation: string; // "Por quê?" expandable text
  options?: string[]; // for multiple-choice types
  correctIndex?: number; // for gap-select, chunk (0-indexed)
  keywords?: string[]; // for open-text matching
}

// ─── STAGE 1: GRAMMAR INTUITION ────────────────────────────
// Acceptability judgments + self-explanation
const grammarQuestions: Question[] = [
  {
    id: "g1",
    pillar: "grammar",
    stage: 1,
    difficulty: 1,
    type: "likert",
    prompt:
      'Quando você ouve "I have 25 years" em vez de "I am 25 years old", isso soa errado para você?',
    whyExplanation:
      '"Eu tenho 25 anos" é a tradução literal do português. Em inglês, usamos "to be" para idade, não "to have". Detectar essa diferença é intuição gramatical básica.',
  },
  {
    id: "g2",
    pillar: "grammar",
    stage: 1,
    difficulty: 1,
    type: "likert",
    prompt:
      'A frase "She don\'t like coffee" soa estranha para você, mesmo sem saber a regra exata?',
    whyExplanation:
      'Em inglês, a terceira pessoa do singular (he/she/it) exige "doesn\'t". A intuição de que "soa errado" é o primeiro nível de consciência gramatical.',
  },
  {
    id: "g3",
    pillar: "grammar",
    stage: 1,
    difficulty: 2,
    type: "likert",
    prompt:
      '"I am working here since 2020" — você consegue sentir que algo está errado, mesmo sem saber explicar por quê?',
    whyExplanation:
      'Em inglês, usamos o Present Perfect para ações que começaram no passado e continuam: "I have been working here since 2020". O Present Continuous não é correto com "since".',
  },
  {
    id: "g4",
    pillar: "grammar",
    stage: 1,
    difficulty: 2,
    type: "likert",
    prompt:
      'A frase "He suggested me to study more" soa natural ou estranha para você?',
    whyExplanation:
      'Em português, "ele sugeriu que eu estudasse mais" funciona com pronome. Em inglês, "suggest" não aceita objeto indireto + infinitivo. O correto: "He suggested that I study more".',
  },
  {
    id: "g5",
    pillar: "grammar",
    stage: 1,
    difficulty: 3,
    type: "likert",
    prompt:
      '"If I would have known, I would have helped" — você percebe que essa construção é problemática?',
    whyExplanation:
      'O Third Conditional correto é "If I had known, I would have helped". O uso de "would have" no if-clause é um erro comum mesmo entre falantes nativos, mas gramaticalmente incorreto.',
  },
  {
    id: "g6",
    pillar: "grammar",
    stage: 1,
    difficulty: 3,
    type: "likert",
    prompt:
      'Você nota diferença entre "I did it" e "I\'ve done it"? Sabe quando usar cada um?',
    whyExplanation:
      "Simple Past (did) = ação concluída no passado. Present Perfect (have done) = ação com relevância presente. Essa distinção é uma das maiores dificuldades para brasileiros.",
  },
  {
    id: "g7",
    pillar: "grammar",
    stage: 1,
    difficulty: 4,
    type: "likert",
    prompt:
      '"The data shows" vs "The data show" — você sabia que ambas podem estar corretas?',
    whyExplanation:
      '"Data" é plural em latim (singular: "datum"). Em contextos formais/científicos, "the data show" é preferido. Em uso informal, "the data shows" é aceito. A sensibilidade a esse nível é gramatical avançada.',
  },
  {
    id: "g8",
    pillar: "grammar",
    stage: 1,
    difficulty: 4,
    type: "likert",
    prompt:
      '"Between you and I" soa errado para você, ou parece formal e correto?',
    whyExplanation:
      'O correto é "between you and me". "Between" é preposição, que exige caso objetivo. "Between you and I" é um hiper correção — erro comum até entre nativos educados.',
  },
  {
    id: "g9",
    pillar: "grammar",
    stage: 1,
    difficulty: 5,
    type: "likert",
    prompt:
      '"I wish I was there" vs "I wish I were there" — você percebe a diferença e sabe qual é formalmente correto?',
    whyExplanation:
      'O subjuntivo em inglês ("were" para todas as pessoas) está desaparecendo na linguagem informal. "I wish I were" é formalmente correto. Perceber essa variação é intuição gramatical refinada.',
  },
  {
    id: "g10",
    pillar: "grammar",
    stage: 1,
    difficulty: 5,
    type: "likert",
    prompt:
      '"Each student should bring their book" — você reconhece esse como um caso de singular "they" aceitável?',
    whyExplanation:
      'O singular "they" tem séculos de uso (Shakespeare o usava). É aceitável como pronome de gênero neutro. A sensibilidade a variações de registro é marca de proficiência avançada.',
  },
];

// ─── STAGE 2: LOGIC / MAP OF IGNORANCE ─────────────────────
// Identifying gaps disguised as knowledge
const logicQuestions: Question[] = [
  {
    id: "l1",
    pillar: "logic",
    stage: 2,
    difficulty: 1,
    type: "gap-select",
    prompt:
      'Você sabe a diferença entre "make" e "do"? Qual frase está correta?',
    options: [
      '"I do a mistake"',
      '"I made a mistake"',
      '"I did a mistake"',
      '"I made the mistake"',
    ],
    correctIndex: 1,
    whyExplanation:
      '"Make" e "do" são verbos causativos. "Make a mistake" é colocação fixa. Brasileiros frequentemente confundem porque "fazer" serve para ambos em português.',
  },
  {
    id: "l2",
    pillar: "logic",
    stage: 2,
    difficulty: 1,
    type: "gap-select",
    prompt: "Qual é a forma correta de perguntar sobre hábitos?",
    options: [
      '"Do you like coffee?"',
      '"Are you liking coffee?"',
      '"Are you like coffee?"',
      '"Do you liking coffee?"',
    ],
    correctIndex: 0,
    whyExplanation:
      'Verbos de estado (like, love, know, believe) não usam Present Continuous em inglês. "Are you liking coffee?" é erro comum de brasileiros que generalizam a regra do -ing.',
  },
  {
    id: "l3",
    pillar: "logic",
    stage: 2,
    difficulty: 2,
    type: "gap-select",
    prompt: 'Complete: "I have been living here ___ 2019."',
    options: ["since", "for", "from", "during"],
    correctIndex: 0,
    whyExplanation:
      '"Since" = ponto no tempo (2019). "For" = duração (3 anos). A confusão entre since/for é uma das lacunas mais comuns de brasileiros no Present Perfect.',
  },
  {
    id: "l4",
    pillar: "logic",
    stage: 2,
    difficulty: 2,
    type: "gap-select",
    prompt: "Qual frase usa o artigo corretamente?",
    options: [
      '"I love the music"',
      '"I love music"',
      '"I love a music"',
      '"I love musics"',
    ],
    correctIndex: 1,
    whyExplanation:
      'Em inglês, usamos zero artigo com substantivos incontáveis em sentido geral. "I love music" = gosto de música em geral. "I love the music" = uma música específica.',
  },
  {
    id: "l5",
    pillar: "logic",
    stage: 2,
    difficulty: 3,
    type: "gap-select",
    prompt: "Qual frase expressa corretamente uma opinião pessoal?",
    options: [
      '"In my opinion, I think that..."',
      '"I think that..."',
      '"According to me..."',
      '"For my side..."',
    ],
    correctIndex: 1,
    whyExplanation:
      '"In my opinion, I think" é redundante. "According to me" não existe em inglês padrão. "For my side" é interferência do português "do meu lado". A concisão é marca de proficiência.',
  },
  {
    id: "l6",
    pillar: "logic",
    stage: 2,
    difficulty: 3,
    type: "gap-select",
    prompt: 'Complete: "If I ___ rich, I would travel the world."',
    options: ["am", "was", "were", "be"],
    correctIndex: 2,
    whyExplanation:
      'Second Conditional exige "were" (subjuntivo) para todas as pessoas. "If I were rich" é formalmente correto. "If I was" é aceito informalmente, mas "were" demonstra domínio.',
  },
  {
    id: "l7",
    pillar: "logic",
    stage: 2,
    difficulty: 4,
    type: "gap-select",
    prompt: "Qual frase usa a preposição correta?",
    options: [
      '"I\'m interested in learn English"',
      '"I\'m interested in learning English"',
      '"I\'m interested to learn English"',
      '"I\'m interested for learning English"',
    ],
    correctIndex: 1,
    whyExplanation:
      '"Interested in" + gerúndio. "Interested to" existe mas muda o significado (curiosidade vs. atração). A regência verbal é uma das partes mais difíceis para brasileiros.',
  },
  {
    id: "l8",
    pillar: "logic",
    stage: 2,
    difficulty: 4,
    type: "gap-select",
    prompt: "Qual frase expressa passivo corretamente?",
    options: [
      '"The book was wrote by her"',
      '"The book was written by her"',
      '"The book was write by her"',
      '"The book has wrote by her"',
    ],
    correctIndex: 1,
    whyExplanation:
      'Passive voice: "was" + past participle. "Written" é o particípio de "write". Confundir past tense e past participle é erro comum (wrote vs. written).',
  },
  {
    id: "l9",
    pillar: "logic",
    stage: 2,
    difficulty: 5,
    type: "gap-select",
    prompt: "Qual frase usa o reported speech corretamente?",
    options: [
      '"He said that he will come tomorrow"',
      '"He said that he would come the next day"',
      '"He said that he would come tomorrow"',
      '"He said that he will come the next day"',
    ],
    correctIndex: 1,
    whyExplanation:
      'Reported speech exige backshift: "will" → "would", "tomorrow" → "the next day". A dupla transformação (tempo + referência temporal) é avançada.',
  },
  {
    id: "l10",
    pillar: "logic",
    stage: 2,
    difficulty: 5,
    type: "gap-select",
    prompt: 'Qual frase usa "whose" corretamente?',
    options: [
      '"The man which car was stolen"',
      '"The man who car was stolen"',
      '"The man whose car was stolen"',
      '"The man that car was stolen"',
    ],
    correctIndex: 2,
    whyExplanation:
      '"Whose" = possessivo para pessoas e coisas. "Which/that/who" não expressam posse. Muitos brasileiros evitam "whose" por medo, usando estruturas mais longas.',
  },
];

// ─── STAGE 3: CHUNKING & COLLOCATIONS ──────────────────────
// Which words belong together as a unit
const vocabQuestions: Question[] = [
  {
    id: "v1",
    pillar: "vocab",
    stage: 3,
    difficulty: 1,
    type: "chunk",
    prompt: "Qual é a colocação natural em inglês?",
    options: [
      '"do a shower"',
      '"take a shower"',
      '"make a shower"',
      '"have a shower"',
    ],
    correctIndex: 1,
    whyExplanation:
      '"Take a shower" é a colocação padrão. "Have a shower" é aceito (British). "Do/make a shower" é interferência do português "tomar banho".',
  },
  {
    id: "v2",
    pillar: "vocab",
    stage: 3,
    difficulty: 1,
    type: "chunk",
    prompt: "Qual é o chunk correto para expressar concordância?",
    options: ['"I\'m agree"', '"I agree"', '"I am agree"', '"I do agree"'],
    correctIndex: 1,
    whyExplanation:
      '"Agree" é verbo, não adjetivo. "I agree" = concordo. "I\'m agree" é interferência direta de "eu concordo" (estou de acordo).',
  },
  {
    id: "v3",
    pillar: "vocab",
    stage: 3,
    difficulty: 2,
    type: "chunk",
    prompt: 'Complete o chunk: "pay ___" (pagar uma multa)',
    options: ["a fine", "a penalty", "a ticket", "a fee"],
    correctIndex: 0,
    whyExplanation:
      '"Pay a fine" = pagar multa. "Pay a ticket" = pagar uma passagem/conta. "Pay a fee" = pagar uma taxa. Cada combinação tem significado específico.',
  },
  {
    id: "v4",
    pillar: "vocab",
    stage: 3,
    difficulty: 2,
    type: "chunk",
    prompt: 'Qual chunk expressa "ficar em casa" naturalmente?',
    options: [
      '"stay at home"',
      '"stay in home"',
      '"remain at home"',
      '"keep at home"',
    ],
    correctIndex: 0,
    whyExplanation:
      '"Stay at home" é o chunk mais natural e frequente. "Remain at home" é formal. "Stay in home" é incorreto — a preposição correta é "at".',
  },
  {
    id: "v5",
    pillar: "vocab",
    stage: 3,
    difficulty: 3,
    type: "chunk",
    prompt: "Qual é a colocação acadêmica correta?",
    options: [
      '"make research"',
      '"do research"',
      '"conduct research"',
      '"run research"',
    ],
    correctIndex: 2,
    whyExplanation:
      '"Conduct research" é a colocação acadêmica formal. "Do research" é aceito informalmente. "Make research" é interferência do português "fazer pesquisa".',
  },
  {
    id: "v6",
    pillar: "vocab",
    stage: 3,
    difficulty: 3,
    type: "chunk",
    prompt: 'Complete: "It makes ___ to study daily."',
    options: ["sense", "meaning", "reason", "logic"],
    correctIndex: 0,
    whyExplanation:
      '"Make sense" é chunk fixo. "Make meaning" existe mas é literário. "Make reason/logic" não são chunks naturais em inglês.',
  },
  {
    id: "v7",
    pillar: "vocab",
    stage: 3,
    difficulty: 4,
    type: "chunk",
    prompt: 'Qual chunk expressa "ter orgulho de"?',
    options: [
      '"be proud of"',
      '"have pride of"',
      '"feel pride of"',
      '"be pride of"',
    ],
    correctIndex: 0,
    whyExplanation:
      '"Be proud of" é o chunk natural. "Have pride in" existe mas é mais abstrato. "Be pride of" é erro de estrutura (pride = substantivo, proud = adjetivo).',
  },
  {
    id: "v8",
    pillar: "vocab",
    stage: 3,
    difficulty: 4,
    type: "chunk",
    prompt: 'Qual é o phrasal verb correto para "adiar"?',
    options: ['"put off"', '"put away"', '"put down"', '"put out"'],
    correctIndex: 0,
    whyExplanation:
      '"Put off" = adiar/adiar. "Put away" = guardar. "Put down" = colocar no chão/diminuir. "Put out" = apagar/publicar. Phrasal verbs são chunks essenciais.',
  },
  {
    id: "v9",
    pillar: "vocab",
    stage: 3,
    difficulty: 5,
    type: "chunk",
    prompt: 'Qual chunk acadêmico expressa "chegar à conclusão"?',
    options: [
      '"reach a conclusion"',
      '"arrive at a conclusion"',
      '"come to a conclusion"',
      '"get to a conclusion"',
    ],
    correctIndex: 0,
    whyExplanation:
      '"Reach/arrive at/come to a conclusion" são todos aceitos. Mas "reach" é o mais formal e frequente em textos acadêmicos. "Get to" é informal.',
  },
  {
    id: "v10",
    pillar: "vocab",
    stage: 3,
    difficulty: 5,
    type: "chunk",
    prompt: 'Qual é o chunk correto para "lidar com um problema"?',
    options: [
      '"deal with a problem"',
      '"deal a problem"',
      '"handle of a problem"',
      '"cope a problem"',
    ],
    correctIndex: 0,
    whyExplanation:
      '"Deal with" é phrasal verb que exige "with". "Cope with" também é correto mas mais formal. "Handle" não precisa de preposição: "handle a problem".',
  },
];

// ─── STAGE 4: CULTURAL ATOMS ───────────────────────────────
// Scenario-based cultural intuition, no right/wrong
const cultureQuestions: Question[] = [
  {
    id: "c1",
    pillar: "culture",
    stage: 4,
    difficulty: 1,
    type: "scenario",
    prompt:
      'Um colega americano diz "What\'s up?" ao te ver. O que isso significa realmente?',
    options: [
      "Ele quer saber detalhes da minha vida",
      'É apenas uma saudação informal, como "e aí?"',
      "Ele está perguntando sobre minhas atividades",
      "É uma pergunta sobre o que está acontecendo",
    ],
    correctIndex: 1,
    whyExplanation:
      '"What\'s up?" é saudação informal equivalente a "e aí?" ou "como vai?". A resposta esperada é "Not much" ou "Same old", não um relato detalhado.',
  },
  {
    id: "c2",
    pillar: "culture",
    stage: 4,
    difficulty: 1,
    type: "scenario",
    prompt:
      'Você está em um restaurante nos EUA e o garçom pergunta "How are you doing?". O que responder?',
    options: [
      '"I\'m fine, thank you. And you?"',
      '"Good, thanks. Can I see the menu?"',
      "\"I'm doing well, I've been busy with work...\"",
      '"Fine."',
    ],
    correctIndex: 1,
    whyExplanation:
      'Nos EUA, "How are you doing?" em contexto de serviço é fórmula social, não convite para conversa. A resposta ideal é breve + direção para o objetivo (ver o menu).',
  },
  {
    id: "c3",
    pillar: "culture",
    stage: 4,
    difficulty: 2,
    type: "scenario",
    prompt:
      'Em uma reunião de trabalho, um colega diz "Let\'s table this discussion." O que ele quer dizer?',
    options: [
      "Vamos discutir isso na mesa",
      "Vamos adiar essa discussão",
      "Vamos colocar isso na pauta",
      "Vamos encerrar essa discussão",
    ],
    correctIndex: 1,
    whyExplanation:
      '"Table" como verbo significa opostos em inglês americano e britânico. Nos EUA: "adiar/colocar de lado". No UK: "colocar na pauta". Contexto americano assume adiar.',
  },
  {
    id: "c4",
    pillar: "culture",
    stage: 4,
    difficulty: 2,
    type: "scenario",
    prompt:
      'Você recebe um email que diz "Per my last email..." O que isso realmente significa?',
    options: [
      "Conforme meu último email (referência neutra)",
      "Eu já expliquei isso antes (passivo-agressivo)",
      "Por favor, leia meu email anterior",
      "Seguindo o que disse antes",
    ],
    correctIndex: 1,
    whyExplanation:
      '"Per my last email" é famoso como passivo-agressivo corporativo. Literalmente = "conforme meu último email". Na prática = "eu já disse isso, preste atenção". É um meme cultural do escritório.',
  },
  {
    id: "c5",
    pillar: "culture",
    stage: 4,
    difficulty: 3,
    type: "scenario",
    prompt:
      'Um americano diz "That\'s interesting" sobre sua ideia. O que isso geralmente significa?',
    options: [
      "Ele achou genuinamente interessante",
      "Ele não tem opinião formada",
      "Politicamente, ele não quer dizer que não gostou",
      "Ele quer saber mais",
    ],
    correctIndex: 2,
    whyExplanation:
      'Em cultura americana, "That\'s interesting" pode ser eufemismo para "não concordo/não gostei mas não quero ser rude". Contexto e tom revelam o significado real.',
  },
  {
    id: "c6",
    pillar: "culture",
    stage: 4,
    difficulty: 3,
    type: "scenario",
    prompt:
      "Você é convidado para jantar na casa de um americano. O que é esperado?",
    options: [
      "Levar uma garrafa de vinho ou um dessert",
      "Chegar exatamente na hora marcada",
      "Esperar que o anfitrião sirva a comida",
      "Todas as alternativas",
    ],
    correctIndex: 3,
    whyExplanation:
      "Cultura americana: levar presente (vinho/sobremesa), pontualidade (não chegar cedo), e esperar ser servido. Diferente do Brasil onde atraso é tolerado e a comida é self-service.",
  },
  {
    id: "c7",
    pillar: "culture",
    stage: 4,
    difficulty: 4,
    type: "scenario",
    prompt:
      'Em um email profissional, você escreve "I hope this email finds you well." Quando isso é apropriado?',
    options: [
      "Sempre, em qualquer email",
      "Apenas no primeiro contato ou após muito tempo sem falar",
      "Apenas para superiores",
      "Nunca, é antiquado",
    ],
    correctIndex: 1,
    whyExplanation:
      "Essa fórmula é apropriada no primeiro contato ou após pausa longa. Usar em toda resposta é redundante e parece automático. Cultura escrita americana valoriza concisão.",
  },
  {
    id: "c8",
    pillar: "culture",
    stage: 4,
    difficulty: 4,
    type: "scenario",
    prompt:
      'Alguém diz "You\'re welcome" depois de você agradecer. Existe alternativa mais natural em contexto informal?',
    options: [
      '"No problem" ou "Sure thing"',
      '"You\'re welcome" é sempre a melhor opção',
      '"Don\'t mention it"',
      '"It was nothing"',
    ],
    correctIndex: 0,
    whyExplanation:
      'Em contextos informais, "No problem", "Sure thing", "Of course" são mais naturais que "You\'re welcome" (que soa formal). A evolução linguística reflete mudança cultural.',
  },
  {
    id: "c9",
    pillar: "culture",
    stage: 4,
    difficulty: 5,
    type: "scenario",
    prompt:
      'Em uma negociação, seu colega diz "I hear what you\'re saying, but..." O que isso sinaliza?',
    options: [
      "Ele está ouvindo atentamente",
      "Ele discorda mas quer manter a harmonia",
      "Ele não entendeu seu ponto",
      "Ele quer mais detalhes",
    ],
    correctIndex: 1,
    whyExplanation:
      '"I hear what you\'re saying, but..." é fórmula de polidez conflituosa. Significa "entendo mas discordo". O "but" invalida o que veio antes. É habilidade cultural reconhecer isso.',
  },
  {
    id: "c10",
    pillar: "culture",
    stage: 4,
    difficulty: 5,
    type: "scenario",
    prompt:
      'Você vê "RSVP" em um convite. O que isso significa e o que é esperado?',
    options: [
      "Responda se vai ou não vai",
      "É apenas uma formalidade, não precisa responder",
      "Confirme presença por email",
      "Responda apenas se não for comparecer",
    ],
    correctIndex: 0,
    whyExplanation:
      'RSVP = "Répondez s\'il vous plaît" (responda por favor). É obrigatório responder, confirmando ou não. Ignorar RSVP é considerado rude na cultura anglo-saxônica.',
  },
];

// ─── STAGE 5: COMMUNICATION FLUENCY ────────────────────────
// Open production — no right/wrong, reasoning surfaced
const commQuestions: Question[] = [
  {
    id: "m1",
    pillar: "comm",
    stage: 5,
    difficulty: 1,
    type: "open-text",
    prompt:
      'Escreva uma frase em inglês usando a palavra "actually". (1-2 frases)',
    whyExplanation:
      '"Actually" = na verdade (não "atualmente"). Muitos brasileiros confundem com "currently". Seu uso revela se você internalizou o significado real.',
    keywords: ["actually"],
  },
  {
    id: "m2",
    pillar: "comm",
    stage: 5,
    difficulty: 1,
    type: "open-text",
    prompt:
      "Como você pediria educadamente para alguém repetir o que disse? Escreva em inglês.",
    whyExplanation:
      '"Could you repeat that?", "Sorry, I didn\'t catch that", "Pardon?" são formas naturais. "Repeat please" soa rude. A polidez é parte da fluência.',
    keywords: ["repeat", "sorry", "pardon", "catch"],
  },
  {
    id: "m3",
    pillar: "comm",
    stage: 5,
    difficulty: 2,
    type: "open-text",
    prompt:
      "Explique em inglês o que você faz no trabalho/estudos. (2-3 frases)",
    whyExplanation:
      "A capacidade de descrever sua rotina profissional é um marco de proficiência. Preste atenção na estrutura: Present Simple para rotinas, detalhes específicos.",
    keywords: ["work", "study", "job", "student"],
  },
  {
    id: "m4",
    pillar: "comm",
    stage: 5,
    difficulty: 2,
    type: "open-text",
    prompt:
      "Escreva um email curto cancelando uma reunião de forma educada. (3-4 frases)",
    whyExplanation:
      'Email profissional exige: saudação, razão direta mas polida, alternativa, desculpa breve. "I\'m sorry but I need to cancel..." é mais natural que "I regret to inform..."',
    keywords: ["cancel", "sorry", "reschedule", "apologize"],
  },
  {
    id: "m5",
    pillar: "comm",
    stage: 5,
    difficulty: 3,
    type: "open-text",
    prompt:
      "Dê sua opinião sobre aprender idiomas com inteligência artificial. (3-4 frases)",
    whyExplanation:
      'Expressar opinião exige: "I think/believe/feel that...", justificativa, exemplos. A complexidade das ideias e a precisão vocabular revelam o nível real.',
    keywords: ["think", "believe", "learning", "language"],
  },
  {
    id: "m6",
    pillar: "comm",
    stage: 5,
    difficulty: 3,
    type: "open-text",
    prompt:
      "Conte uma história curta sobre um mal-entendido que você teve em inglês. (4-5 frases)",
    whyExplanation:
      "Narrativa no passado exige domínio de tempos verbais (Simple Past, Past Continuous, Past Perfect). A coesão temporal é o que separa intermediário de avançado.",
    keywords: ["was", "went", "said", "thought"],
  },
  {
    id: "m7",
    pillar: "comm",
    stage: 5,
    difficulty: 4,
    type: "open-text",
    prompt:
      'Argumente a favor ou contra: "Presencial é melhor que online para aprender idiomas." (4-5 frases)',
    whyExplanation:
      "Argumentação exige: tese clara, conectores (however, moreover, on the other hand), exemplos, conclusão. É o nível mais alto de produção escrita.",
    keywords: ["however", "because", "example", "conclusion"],
  },
  {
    id: "m8",
    pillar: "comm",
    stage: 5,
    difficulty: 4,
    type: "open-text",
    prompt:
      "Explique um conceito do seu campo de trabalho para alguém que não entende nada do assunto. (4-5 frases)",
    whyExplanation:
      "Simplificar conceitos complexos é a habilidade comunicativa mais alta. Requer vocabulário preciso, analogias, e consciência do público.",
    keywords: [],
  },
  {
    id: "m9",
    pillar: "comm",
    stage: 5,
    difficulty: 5,
    type: "open-text",
    prompt:
      "Escreva um parágrafo formal sobre um problema social do Brasil. (5-6 frases)",
    whyExplanation:
      "Escrita formal exige: voz passiva, nominalização, vocabulário acadêmico, ausência de contrações. É o teste definitivo de proficiência escrita.",
    keywords: ["society", "problem", "issue", "solution"],
  },
  {
    id: "m10",
    pillar: "comm",
    stage: 5,
    difficulty: 5,
    type: "open-text",
    prompt:
      "Escreva uma resenha crítica (review) de um filme ou livro em inglês. (5-6 frases)",
    whyExplanation:
      "Resenha crítica exige: resumo breve, análise, opinião fundamentada, linguagem sofisticada. É produção autêntica de nível avançado.",
    keywords: ["review", "recommend", "story", "character"],
  },
];

// ─── EXPORT: FULL QUESTION BANK ─────────────────────────────
const QUESTION_BANK: Question[] = [
  ...grammarQuestions,
  ...logicQuestions,
  ...vocabQuestions,
  ...cultureQuestions,
  ...commQuestions,
];

// Questions per pillar for quick lookup
const QUESTIONS_BY_PILLAR: Record<Pillar, Question[]> = {
  grammar: grammarQuestions,
  logic: logicQuestions,
  vocab: vocabQuestions,
  culture: cultureQuestions,
  comm: commQuestions,
};

// Questions per difficulty for adaptive selection
function getQuestionsByDifficulty(
  pillar: Pillar,
  difficulty: number
): Question[] {
  return QUESTIONS_BY_PILLAR[pillar].filter((q) => q.difficulty === difficulty);
}

// Export for external use
export { QUESTION_BANK, QUESTIONS_BY_PILLAR, getQuestionsByDifficulty };
