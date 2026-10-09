import type {
  PhrasalVerbEntry,
  SyntaxisBundle,
  SyntaxisLevel,
  SyntaxisPillar,
  SyntaxisSkill,
  SyntaxisTrack,
  SyntaxisUnit,
} from "./types";
import { SYNTAXIS_LEVELS, SYNTAXIS_TRACKS } from "./types";

export const LEVEL_LABELS: Record<SyntaxisLevel, string> = {
  pre_a1: "Pre-A1",
  a1: "A1",
  a2: "A2",
  b1: "B1",
  b2: "B2",
  c1: "C1",
};

export const TRACK_LABELS: Record<SyntaxisTrack, string> = {
  sentence_architecture: "Arquitetura da oração",
  verb_system: "Tempo, aspecto, modalidade e voz",
  noun_phrase: "Sintagma nominal e referência",
  clause_connection: "Conexão entre orações",
  information_structure: "Informação, coesão e registro",
  phrasal_verbs: "Phrasal e multiword verbs",
};

const CURRICULUM: Record<SyntaxisLevel, Record<SyntaxisTrack, string[]>> = {
  pre_a1: {
    sentence_architecture: ["Sujeito + verbo", "Sujeito + verbo + complemento", "Ordem básica", "Imperativos essenciais"],
    verb_system: ["Be: identidade", "Be: estado e localização", "Have: posse", "Can: capacidade básica"],
    noun_phrase: ["Pronomes pessoais", "A e an", "Plural regular", "This e that"],
    clause_connection: ["And", "But", "Or", "Because em respostas curtas"],
    information_structure: ["Yes e no", "Palavras interrogativas", "Informação nova no final", "Fórmulas de cortesia"],
    phrasal_verbs: ["Stand up", "Sit down", "Come in", "Go out"],
  },
  a1: {
    sentence_architecture: ["Negação com do", "Perguntas com do", "There is e there are", "Adjetivos na oração"],
    verb_system: ["Simple present", "Present continuous", "Simple past regular", "Going to"],
    noun_phrase: ["Artigos definidos", "Possessivos", "Countable e uncountable", "Some e any"],
    clause_connection: ["So", "Then", "When", "If para possibilidades reais"],
    information_structure: ["Frequência", "Sequência temporal", "Pedidos diretos e corteses", "Contraste básico"],
    phrasal_verbs: ["Wake up", "Get up", "Turn on", "Turn off"],
  },
  a2: {
    sentence_architecture: ["Comparativos", "Superlativos", "Relative clauses com who", "Relative clauses com that"],
    verb_system: ["Past continuous", "Present perfect introdutório", "Will para decisões", "Should e must"],
    noun_phrase: ["Quantificadores", "Pronomes indefinidos", "Too e enough", "Possessive pronouns"],
    clause_connection: ["First conditional", "While", "Although", "Before e after"],
    information_structure: ["Razão e resultado", "Opinião com atenuação", "Narrativa em sequência", "Registro cotidiano"],
    phrasal_verbs: ["Look for", "Find out", "Pick up", "Put on"],
  },
  b1: {
    sentence_architecture: ["Relative clauses definidoras", "Gerúndio como sujeito", "Infinitivo de propósito", "Question tags"],
    verb_system: ["Present perfect e past", "Past perfect", "Passive voice", "Second conditional"],
    noun_phrase: ["Determiners complexos", "Compound nouns", "Reflexive pronouns", "Articles em generalizações"],
    clause_connection: ["Reported speech", "Even though", "Unless", "Purpose clauses"],
    information_structure: ["Hedging inicial", "Organização de parágrafos", "Ênfase com do", "Registro narrativo"],
    phrasal_verbs: ["Carry on", "Work out", "Give up", "Deal with"],
  },
  b2: {
    sentence_architecture: ["Reduced relative clauses", "Participle clauses", "Inversão após negativos", "Cleft sentences"],
    verb_system: ["Future continuous e perfect", "Mixed conditionals", "Modal perfects", "Passive reporting"],
    noun_phrase: ["Nominalização", "Complex noun phrases", "Substituição pronominal", "Referência distributiva"],
    clause_connection: ["Concession complexa", "Conditionals implícitos", "Whereas e while", "Result clauses"],
    information_structure: ["Stance e modalidade", "Tema e rema", "Coesão lexical", "Mudança de registro"],
    phrasal_verbs: ["Bring about", "Come across", "Put forward", "Take over"],
  },
  c1: {
    sentence_architecture: ["Inversão estilística", "Clefts avançadas", "Elipse", "Substituição complexa"],
    verb_system: ["Aspecto para efeito discursivo", "Modalidade epistêmica", "Voz e responsabilidade", "Tempo em narrativa complexa"],
    noun_phrase: ["Nominalização densa", "Premodificação complexa", "Referência intertextual", "Abstração e precisão"],
    clause_connection: ["Conexão retórica", "Concessão graduada", "Causa inferida", "Encadeamento argumentativo"],
    information_structure: ["Fronting", "End-weight", "Hedging acadêmico", "Voz autoral e registro"],
    phrasal_verbs: ["Boil down to", "Brush up on", "Come down to", "Follow through on"],
  },
};

const BETA_EXAMPLES: Record<string, [string, string]> = {
  "pre_a1-sentence_architecture-0": ["I work.", "Eu trabalho."],
  "pre_a1-sentence_architecture-1": ["I need help.", "Eu preciso de ajuda."],
  "pre_a1-sentence_architecture-2": ["We study English here.", "Nós estudamos inglês aqui."],
  "pre_a1-sentence_architecture-3": ["Open the door, please.", "Abra a porta, por favor."],
  "pre_a1-verb_system-0": ["I am Ana.", "Eu sou Ana."],
  "pre_a1-verb_system-1": ["She is tired.", "Ela está cansada."],
  "pre_a1-verb_system-2": ["They have a car.", "Eles têm um carro."],
  "pre_a1-verb_system-3": ["I can swim.", "Eu sei nadar."],
  "pre_a1-noun_phrase-0": ["She knows him.", "Ela o conhece."],
  "pre_a1-noun_phrase-1": ["It is an old house.", "É uma casa antiga."],
  "pre_a1-noun_phrase-2": ["Two books are here.", "Dois livros estão aqui."],
  "pre_a1-noun_phrase-3": ["This bag is mine.", "Esta bolsa é minha."],
  "pre_a1-clause_connection-0": ["I read and write.", "Eu leio e escrevo."],
  "pre_a1-clause_connection-1": ["It is small but comfortable.", "É pequeno, mas confortável."],
  "pre_a1-clause_connection-2": ["Tea or coffee?", "Chá ou café?"],
  "pre_a1-clause_connection-3": ["I am here because I need help.", "Estou aqui porque preciso de ajuda."],
  "pre_a1-information_structure-0": ["Yes, I am.", "Sim."],
  "pre_a1-information_structure-1": ["Where do you live?", "Onde você mora?"],
  "pre_a1-information_structure-2": ["I met a new colleague today.", "Conheci uma colega nova hoje."],
  "pre_a1-information_structure-3": ["Could you help me, please?", "Você poderia me ajudar, por favor?"],
  "pre_a1-phrasal_verbs-0": ["Please stand up.", "Por favor, levante-se."],
  "pre_a1-phrasal_verbs-1": ["Sit down here.", "Sente-se aqui."],
  "pre_a1-phrasal_verbs-2": ["Come in, please.", "Entre, por favor."],
  "pre_a1-phrasal_verbs-3": ["We go out on Friday.", "Nós saímos na sexta."],
  "a1-sentence_architecture-0": ["I do not drive.", "Eu não dirijo."],
  "a1-sentence_architecture-1": ["Do you work here?", "Você trabalha aqui?"],
  "a1-sentence_architecture-2": ["There are two messages.", "Há duas mensagens."],
  "a1-sentence_architecture-3": ["The meeting is important.", "A reunião é importante."],
  "a1-verb_system-0": ["She works from home.", "Ela trabalha de casa."],
  "a1-verb_system-1": ["We are waiting now.", "Estamos esperando agora."],
  "a1-verb_system-2": ["They called yesterday.", "Eles ligaram ontem."],
  "a1-verb_system-3": ["I am going to study tonight.", "Vou estudar hoje à noite."],
  "a1-noun_phrase-0": ["The office is closed.", "O escritório está fechado."],
  "a1-noun_phrase-1": ["This is our room.", "Esta é a nossa sala."],
  "a1-noun_phrase-2": ["We need information.", "Precisamos de informação."],
  "a1-noun_phrase-3": ["Do you have any questions?", "Você tem alguma pergunta?"],
  "a1-clause_connection-0": ["It was late, so I left.", "Era tarde, então fui embora."],
  "a1-clause_connection-1": ["First read it, then reply.", "Primeiro leia, depois responda."],
  "a1-clause_connection-2": ["Call me when you arrive.", "Ligue quando chegar."],
  "a1-clause_connection-3": ["If it rains, we stay home.", "Se chover, ficamos em casa."],
  "a1-information_structure-0": ["I usually arrive early.", "Eu geralmente chego cedo."],
  "a1-information_structure-1": ["After that, we had lunch.", "Depois disso, almoçamos."],
  "a1-information_structure-2": ["Could I have some water?", "Eu poderia tomar um pouco de água?"],
  "a1-information_structure-3": ["I like tea, but I prefer coffee.", "Gosto de chá, mas prefiro café."],
  "a1-phrasal_verbs-0": ["I wake up at seven.", "Eu acordo às sete."],
  "a1-phrasal_verbs-1": ["She gets up early.", "Ela se levanta cedo."],
  "a1-phrasal_verbs-2": ["Turn on the light.", "Acenda a luz."],
  "a1-phrasal_verbs-3": ["Please turn it off.", "Por favor, desligue-o."],
  "a2-sentence_architecture-0": ["This route is faster than the other one.", "Esta rota é mais rápida que a outra."],
  "a2-sentence_architecture-1": ["It was the best option.", "Foi a melhor opção."],
  "a2-sentence_architecture-2": ["The person who called left a message.", "A pessoa que ligou deixou uma mensagem."],
  "a2-sentence_architecture-3": ["The file that you sent is open.", "O arquivo que você enviou está aberto."],
  "a2-verb_system-0": ["I was cooking when you called.", "Eu estava cozinhando quando você ligou."],
  "a2-verb_system-1": ["We have already finished.", "Nós já terminamos."],
  "a2-verb_system-2": ["I will answer it now.", "Vou responder agora."],
  "a2-verb_system-3": ["You should rest, but you must call them.", "Você deveria descansar, mas precisa ligar para eles."],
  "a2-noun_phrase-0": ["We have enough time.", "Temos tempo suficiente."],
  "a2-noun_phrase-1": ["Someone left their phone here.", "Alguém deixou o telefone aqui."],
  "a2-noun_phrase-2": ["The box is too heavy to carry.", "A caixa é pesada demais para carregar."],
  "a2-noun_phrase-3": ["Their seats are near ours.", "Os lugares deles ficam perto dos nossos."],
  "a2-clause_connection-0": ["If you send it today, I will review it.", "Se você enviar hoje, eu revisarei."],
  "a2-clause_connection-1": ["She took notes while he was speaking.", "Ela fez anotações enquanto ele falava."],
  "a2-clause_connection-2": ["Although it was difficult, we finished.", "Embora tenha sido difícil, terminamos."],
  "a2-clause_connection-3": ["Check the address before you leave.", "Confira o endereço antes de sair."],
  "a2-information_structure-0": ["The train was delayed; as a result, we arrived late.", "O trem atrasou; por isso, chegamos tarde."],
  "a2-information_structure-1": ["I think this might be a better option.", "Acho que esta talvez seja uma opção melhor."],
  "a2-information_structure-2": ["At first we waited; eventually, someone answered.", "Primeiro esperamos; por fim, alguém respondeu."],
  "a2-information_structure-3": ["Can you give me a hand?", "Você pode me dar uma ajuda?"],
  "a2-phrasal_verbs-0": ["I am looking for my keys.", "Estou procurando minhas chaves."],
  "a2-phrasal_verbs-1": ["We found out what happened.", "Descobrimos o que aconteceu."],
  "a2-phrasal_verbs-2": ["I will pick you up at eight.", "Vou buscar você às oito."],
  "a2-phrasal_verbs-3": ["Put your coat on.", "Vista seu casaco."],
};

const TRACK_COPY: Record<SyntaxisTrack, { explanation: string; interference: string; pillars: Record<SyntaxisPillar, number> }> = {
  sentence_architecture: { explanation: "Observe quem faz o quê e como a posição muda a leitura.", interference: "Evite transportar automaticamente a ordem flexível do português.", pillars: { grammar: 0.45, logic: 0.25, vocab: 0.1, culture: 0.05, comm: 0.15 } },
  verb_system: { explanation: "A forma verbal localiza o evento e mostra como o falante o enxerga.", interference: "Uma forma portuguesa nem sempre corresponde a um único tempo inglês.", pillars: { grammar: 0.45, logic: 0.2, vocab: 0.1, culture: 0.05, comm: 0.2 } },
  noun_phrase: { explanation: "O grupo nominal define referência, quantidade e precisão.", interference: "Artigos e contabilidade funcionam de modo diferente em inglês.", pillars: { grammar: 0.4, logic: 0.2, vocab: 0.15, culture: 0.05, comm: 0.2 } },
  clause_connection: { explanation: "Conectores mostram a relação lógica entre ideias, não apenas a sequência.", interference: "Não escolha conectores apenas pela tradução mais próxima.", pillars: { grammar: 0.3, logic: 0.35, vocab: 0.1, culture: 0.1, comm: 0.15 } },
  information_structure: { explanation: "A ordem distribui informação conhecida, nova, enfatizada e atenuada.", interference: "Entonação e ordem compensam recursos que o português expressa de outra forma.", pillars: { grammar: 0.25, logic: 0.2, vocab: 0.1, culture: 0.25, comm: 0.2 } },
  phrasal_verbs: { explanation: "Verbo, partícula, sentido e contexto formam uma unidade recuperável.", interference: "Aprenda o sentido completo e sua moldura, não traduza verbo e partícula isoladamente.", pillars: { grammar: 0.25, logic: 0.15, vocab: 0.3, culture: 0.1, comm: 0.2 } },
};

function slugify(value: string) {
  return value.normalize("NFD").replace(/[\u0300-\u036f]/g, "").toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "");
}

function makeSkills(): SyntaxisSkill[] {
  const skills: SyntaxisSkill[] = [];
  for (const level of SYNTAXIS_LEVELS) {
    for (const track of SYNTAXIS_TRACKS) {
      CURRICULUM[level][track].forEach((title, index) => {
        const key = `${level}-${track}-${index}`;
        const id = `syn.${level}.${track}.${String(index + 1).padStart(2, "0")}`;
        const previousLevel = SYNTAXIS_LEVELS[SYNTAXIS_LEVELS.indexOf(level) - 1];
        const prerequisites = index > 0
          ? [`syn.${level}.${track}.${String(index).padStart(2, "0")}`]
          : previousLevel
            ? [`syn.${previousLevel}.${track}.04`]
            : [];
        const [exampleEn, examplePt] = BETA_EXAMPLES[key] ?? [
          `This pattern highlights ${title.toLowerCase()} in context.`,
          `Este padrão destaca ${title.toLowerCase()} em contexto.`,
        ];
        skills.push({
          id,
          slug: slugify(`${level}-${title}`),
          level,
          track,
          order: index + 1,
          title,
          canDo: `Reconhecer e usar ${title.toLowerCase()} para construir sentido em contexto.`,
          explanationPt: TRACK_COPY[track].explanation,
          exampleEn,
          examplePt,
          commonInterferencePtBr: TRACK_COPY[track].interference,
          prerequisites,
          diagnosticKeys: [`grammar:${slugify(title)}`, `${level}:${track}`],
          pillarWeights: TRACK_COPY[track].pillars,
          published: ["pre_a1", "a1", "a2"].includes(level),
        });
      });
    }
  }
  return skills;
}

function makeUnits(skills: SyntaxisSkill[]): SyntaxisUnit[] {
  const beta = skills.filter((skill) => skill.published);
  const units: SyntaxisUnit[] = [];
  for (let index = 0; index < beta.length; index += 2) {
    const first = beta[index];
    const second = beta[index + 1];
    const unitIndex = units.filter((unit) => unit.level === first.level).length + 1;
    const id = `unit.${first.level}.${String(unitIndex).padStart(2, "0")}`;
    units.push({
      id,
      slug: `${first.level}-${slugify(first.title)}-${slugify(second.title)}`,
      level: first.level,
      track: first.track,
      title: `${first.title} · ${second.title}`,
      skillIds: [first.id, second.id],
      estimatedMinutes: 34,
      published: true,
      activities: [
        {
          id: `${id}.notice`, kind: "notice", title: "Perceber", durationMinutes: 8,
          instruction: "Leia em voz alta e observe a arquitetura antes de procurar uma regra.",
          prompt: `${first.exampleEn} — ${first.examplePt}`,
          acceptedAnswers: [], authoredFeedback: first.explanationPt, openProduction: false,
          pillars: ["grammar", "culture", "vocab"],
        },
        {
          id: `${id}.transform`, kind: "transform", title: "Transformar", durationMinutes: 8,
          instruction: "Reconstrua a frase-alvo. Pontuação final é opcional.",
          prompt: first.examplePt,
          acceptedAnswers: [first.exampleEn], authoredFeedback: `${first.explanationPt} ${first.commonInterferencePtBr}`,
          openProduction: false, pillars: ["grammar", "logic"],
        },
        {
          id: `${id}.recombine`, kind: "recombine", title: "Recombinar", durationMinutes: 8,
          instruction: "Recupere o segundo padrão sem traduzir palavra por palavra.",
          prompt: second.examplePt,
          acceptedAnswers: [second.exampleEn], authoredFeedback: second.explanationPt,
          openProduction: false, pillars: ["vocab", "logic", "culture"],
        },
        {
          id: `${id}.produce`, kind: "produce", title: "Produzir e guardar", durationMinutes: 10,
          instruction: "Escreva duas frases verdadeiras sobre sua vida usando os dois padrões. A resposta é evidência, não recebe nota automática.",
          prompt: `${first.title} + ${second.title}`,
          acceptedAnswers: [], authoredFeedback: "Compare sua produção com os exemplos e marque o que deseja revisar.",
          openProduction: true, pillars: ["comm", "logic", "grammar"],
        },
      ],
    });
  }
  return units;
}

const PHRASAL_SOURCE: Array<[string, string, string, SyntaxisLevel]> = [
  ["ask for", "pedir", "Ask for help when you need it.", "a1"], ["back up", "fazer backup ou apoiar", "Back up the files before the update.", "a2"],
  ["break down", "parar de funcionar", "The elevator broke down this morning.", "a2"], ["bring back", "trazer de volta", "Please bring the book back tomorrow.", "a1"],
  ["bring up", "mencionar", "She brought up an important question.", "a2"], ["call back", "ligar de volta", "I will call you back after lunch.", "a1"],
  ["calm down", "acalmar-se", "Take a breath and calm down.", "a1"], ["carry on", "continuar", "Carry on with the exercise.", "b1"],
  ["check in", "fazer check-in", "We checked in online.", "a2"], ["check out", "dar uma olhada ou fazer checkout", "Check out this new café.", "a2"],
  ["clean up", "limpar e organizar", "We cleaned up the kitchen together.", "a1"], ["come across", "encontrar por acaso", "I came across an old photograph.", "b2"],
  ["come back", "voltar", "Come back before ten.", "pre_a1"], ["come in", "entrar", "Come in and take a seat.", "pre_a1"],
  ["come up with", "ter uma ideia", "The team came up with a simpler plan.", "b1"], ["cut down on", "reduzir", "I am cutting down on sugar.", "b1"],
  ["deal with", "lidar com", "We need to deal with this issue today.", "b1"], ["dress up", "vestir-se de modo especial", "They dressed up for the ceremony.", "a2"],
  ["drop off", "deixar alguém ou algo", "I will drop the package off at noon.", "a2"], ["eat out", "comer fora", "We eat out on Fridays.", "a1"],
  ["end up", "acabar por", "We ended up taking the train.", "b1"], ["figure out", "descobrir ou compreender", "Can you figure out how it works?", "b1"],
  ["fill in", "preencher", "Fill in the form in block letters.", "a2"], ["find out", "descobrir", "I found out why the shop was closed.", "a2"],
  ["get along", "dar-se bem", "Do you get along with your colleagues?", "a2"], ["get back", "voltar", "I got back home late.", "a2"],
  ["get in", "entrar ou chegar", "What time did the train get in?", "a2"], ["get off", "descer", "Get off at the next stop.", "a1"],
  ["get on", "subir em transporte", "We got on the wrong bus.", "a1"], ["get over", "superar", "It took her time to get over the disappointment.", "b1"],
  ["get up", "levantar-se", "I get up at half past six.", "a1"], ["give back", "devolver", "Could you give my pen back?", "a1"],
  ["give up", "desistir", "Do not give up after one mistake.", "a2"], ["go ahead", "prosseguir", "Go ahead and ask your question.", "a2"],
  ["go back", "voltar", "We need to go back now.", "pre_a1"], ["go on", "continuar ou acontecer", "What is going on outside?", "a2"],
  ["go out", "sair", "They went out after work.", "pre_a1"], ["grow up", "crescer", "She grew up near the coast.", "a2"],
  ["hang on", "esperar", "Hang on for a minute.", "a2"], ["hang out", "passar tempo informalmente", "We hang out at the park.", "a2"],
  ["hold on", "aguardar", "Hold on while I check.", "a2"], ["keep on", "continuar", "He kept on asking questions.", "b1"],
  ["leave out", "omitir", "Do not leave out the final paragraph.", "b1"], ["let down", "decepcionar", "I do not want to let the team down.", "b1"],
  ["log in", "entrar em uma conta", "Log in with your email address.", "a1"], ["log out", "sair de uma conta", "Remember to log out on shared computers.", "a1"],
  ["look after", "cuidar de", "She looks after her nephew on Tuesdays.", "a2"], ["look for", "procurar", "We are looking for a quiet place.", "a1"],
  ["look forward to", "aguardar com expectativa", "I look forward to meeting you.", "b1"], ["look into", "investigar", "The company is looking into the complaint.", "b2"],
  ["look up", "consultar", "Look the word up in a dictionary.", "a2"], ["make up", "inventar ou reconciliar-se", "He made up an excuse.", "b1"],
  ["move in", "mudar-se para", "Our new neighbors moved in yesterday.", "a2"], ["move out", "mudar-se de", "They moved out at the end of May.", "a2"],
  ["pass away", "falecer", "Her grandfather passed away peacefully.", "b1"], ["pay back", "devolver dinheiro", "I will pay you back tomorrow.", "a2"],
  ["pick up", "buscar ou pegar", "I will pick you up outside the station.", "a2"], ["point out", "apontar", "She pointed out a small error.", "b1"],
  ["put away", "guardar", "Put the tools away when you finish.", "a2"], ["put off", "adiar", "We had to put the meeting off.", "b1"],
  ["put on", "vestir ou ligar", "Put on a jacket before you leave.", "a1"], ["run into", "encontrar por acaso", "I ran into an old friend downtown.", "b1"],
  ["run out of", "ficar sem", "We ran out of coffee this morning.", "b1"], ["set up", "montar ou configurar", "They set up a small home office.", "a2"],
  ["show up", "aparecer", "Only six people showed up.", "a2"], ["shut down", "desligar ou encerrar", "The system shuts down automatically.", "b1"],
  ["sit down", "sentar-se", "Please sit down near the window.", "pre_a1"], ["sort out", "resolver ou organizar", "We sorted out the payment problem.", "b1"],
  ["stand up", "levantar-se", "Everyone stood up when she entered.", "pre_a1"], ["take off", "tirar ou decolar", "The plane took off on time.", "a2"],
  ["take over", "assumir controle", "A new manager took over the project.", "b2"], ["throw away", "jogar fora", "Do not throw the receipt away.", "a2"],
  ["try on", "experimentar roupa", "Can I try this jacket on?", "a1"], ["turn down", "recusar ou abaixar", "She turned down the job offer.", "b1"],
  ["turn off", "desligar", "Turn the lights off before leaving.", "a1"], ["turn on", "ligar", "Turn on the camera when you are ready.", "a1"],
  ["wake up", "acordar", "I woke up before the alarm.", "a1"], ["work out", "resolver ou exercitar-se", "We worked out a practical solution.", "b1"],
  ["write down", "anotar", "Write down the address.", "a1"], ["break up", "terminar uma relação", "They broke up last year.", "b1"],
];

const SEPARABLE = new Set(["back up", "bring back", "bring up", "call back", "clean up", "drop off", "fill in", "give back", "leave out", "let down", "look up", "make up", "pay back", "pick up", "point out", "put away", "put off", "put on", "set up", "shut down", "sort out", "throw away", "try on", "turn down", "turn off", "turn on", "write down"]);
const INTRANSITIVE = new Set(["calm down", "carry on", "check in", "come back", "come in", "eat out", "end up", "get along", "get back", "get in", "get up", "go ahead", "go back", "go on", "go out", "grow up", "hang out", "hold on", "keep on", "move in", "move out", "pass away", "show up", "sit down", "stand up", "wake up", "break up"]);

function makePhrasalVerbs(skills: SyntaxisSkill[]): PhrasalVerbEntry[] {
  return PHRASAL_SOURCE.map(([headword, meaning, example, level], index) => {
    const skill = skills.find((candidate) => candidate.level === level && candidate.track === "phrasal_verbs")
      ?? skills.find((candidate) => candidate.track === "phrasal_verbs")!;
    const particle = headword.split(" ").slice(1).join(" ");
    const separability = INTRANSITIVE.has(headword) ? "intransitive" : SEPARABLE.has(headword) ? "separable" : "inseparable";
    return {
      id: `pv.${String(index + 1).padStart(3, "0")}.${slugify(headword)}`,
      headword,
      particle,
      level,
      separability,
      transitivity: separability === "intransitive" ? "intransitive" : "transitive",
      register: ["hang on", "hang out", "check out"].includes(headword) ? "informal" : "neutral",
      literalness: ["sit down", "stand up", "come in", "go out", "put on", "take off"].includes(headword) ? "literal" : "idiomatic",
      skillId: skill.id,
      pronunciationTargets: [headword],
      senses: [{
        id: `pv.${String(index + 1).padStart(3, "0")}.sense.1`,
        meaningPt: meaning,
        definitionEn: `To ${meaning} in the situation shown by the example.`,
        exampleEn: example,
        examplePt: `Sentido principal: ${meaning}.`,
        contrastEn: `In a new context, notice whether “${headword}” keeps this same meaning.`,
      }],
    };
  });
}

export const syntaxisSkills = makeSkills();
export const syntaxisUnits = makeUnits(syntaxisSkills);
export const syntaxisPulseAtoms = syntaxisSkills
  .filter((skill) => skill.published)
  .flatMap((skill, index) => {
    const base = {
      id: `pulse.${skill.id}.1`, skillId: skill.id, level: skill.level,
      pattern: skill.exampleEn, prompt: skill.examplePt, answer: skill.exampleEn,
      explanationPt: skill.explanationPt, palaceRoom: "grammar" as const,
      pronunciationTargets: skill.track === "phrasal_verbs" ? [skill.title.toLowerCase()] : [],
    };
    return index < 36
      ? [base, { ...base, id: `pulse.${skill.id}.2`, prompt: `Recupere o padrão sem olhar: ${skill.title}`, explanationPt: skill.commonInterferencePtBr }]
      : [base];
  });
export const syntaxisPhrasalVerbs = makePhrasalVerbs(syntaxisSkills);

export const SYNTAXIS_RELEASE = "syntaxis-beta-2026.10";

export function getSyntaxisBundle(): SyntaxisBundle {
  return {
    schemaVersion: 1,
    release: SYNTAXIS_RELEASE,
    generatedAt: "2026-10-06T00:00:00.000Z",
    language: "en",
    interfaceLocale: "pt-BR",
    skills: syntaxisSkills,
    units: syntaxisUnits,
    pulseAtoms: syntaxisPulseAtoms,
    phrasalVerbs: syntaxisPhrasalVerbs,
  };
}
