from pathlib import Path
import json, re

ROOT = Path(__file__).resolve().parents[1]
units = []

def add(level, title, goal, language, reading, audio, questions, practice, phon, culture, roles, final, model, mediation, transfer):
    number = 1 + sum(u['level'] == level for u in units)
    uid = f'EN-{level.upper()}-{number:02}'
    units.append(dict(id=uid, level=level, number=number, title=title, goal=goal,
        language=language, reading=reading, audio=audio, questions=questions,
        practice=practice, phon=phon, culture=culture, roles=roles, final=final,
        model=model, mediation=mediation, transfer=transfer))

# Materiais originais Lexio, edição editorial 0.1. Nenhum diálogo é transcrição real.
add('pre-a1', 'Meu nome, minha voz',
    'Reconhecer duas apresentações; dizer e perguntar nomes; preencher um crachá com apoio.',
    'Hello / Hi = olá; I am / I’m = eu sou; My name is = meu nome é; What’s your name? = como você se chama?; Nice to meet you = prazer; Please = por favor. I am Ana → I’m Ana: duas formas da mesma apresentação.',
    'WELCOME\nName: Ana\nName: Ben\nHello! I’m Ana.\nHi! My name is Ben.',
    'Ana: Hello. I’m Ana. What’s your name?\nBen: My name is Ben.\nAna: Nice to meet you, Ben.\nBen: Nice to meet you, Ana.',
    [('Leitura: quais dois nomes aparecem?', 'Ana e Ben; os campos Name identificam nomes.'), ('Áudio: quem pergunta o nome?', 'Ana; a pergunta vem depois de sua apresentação.'), ('Áudio: como Ben se apresenta?', 'My name is Ben. Não diz que seu nome é Ana.'), ('Leitura: qual palavra identifica o campo do crachá?', 'Name; não é preciso traduzir todas as outras palavras.')],
    [('Complete com am: I ___ Ana.', 'am — acompanha I nesta apresentação.'), ('Ordene: name / My / Ben / is.', 'My name is Ben. O nome vem depois de is.'), ('Escolha uma pergunta: What’s your name? / Nice to meet you.', 'What’s your name? A segunda expressão acolhe a pessoa, mas não pede informação.')],
    'Ouça e marque a palavra forte em my NAME is ANA. Diga I’m como um bloco; não é obrigatório contrair. Preserve seu nome como deseja pronunciá-lo.',
    'Pergunte como a pessoa prefere ser chamada. Não imponha versão inglesa do nome nem cumprimento com contato físico.',
    'A: você é Jo e recebe alguém num curso. B: você é Kim e precisa descobrir o nome de A. A começa com Hello. B responde e devolve a pergunta. Segunda rodada: A é Alex, B é Sam; escondam os crachás.',
    'Faça uma apresentação de duas falas, pergunte o nome e responda; escreva um crachá fictício. Apoio: Hello. I’m ___. What’s your name?',
    'Hello. I’m Jo. What’s your name? / My name is Kim. / Nice to meet you, Kim.\nName: Jo',
    'Mostre a alguém que lê português qual crachá pertence a Ben. Resposta esperada: apontar Name: Ben ou dizer “este é do Ben”; não exige tradução integral.',
    'Sem copiar Ana ou Ben, use Lee e Sol: apresente Lee, pergunte o nome de Sol e prepare os dois crachás.')

add('pre-a1', 'Entender e pedir ajuda',
    'Reconhecer três instruções; pedir repetição; indicar que não compreendeu.',
    'Listen = escute; Look = olhe; Write = escreva; Stop = pare; Again, please = de novo, por favor; Slowly, please = devagar, por favor; I don’t understand = não entendo. Aprenda as duas últimas como blocos, sem exigir análise de don’t.',
    'YOUR FIRST TASK\n1. Look: Ana.\n2. Write: Ana.\n3. Stop.\nHelp: Again, please.',
    'Tutor: Listen. My name is Sam.\nLearner: Again, please.\nTutor: My name is Sam.\nLearner: Sam?\nTutor: Yes. Write Sam.\nLearner: Thank you.',
    [('Leitura: o que fazer depois de Look?', 'Write: Ana; copiar o nome, não escrever uma história.'), ('Áudio: qual nome foi dito?', 'Sam.'), ('Áudio: qual expressão pede repetição?', 'Again, please.'), ('Leitura: qual instrução encerra a tarefa?', 'Stop.')],
    [('Relacione Write a olhar ou escrever.', 'Escrever; Look corresponde a olhar.'), ('Complete: Again, ___.', 'please — acompanha o pedido.'), ('Escolha para falta de compreensão: I don’t understand / My name is.', 'I don’t understand; a outra expressão apresenta o nome.')],
    'Compare LISTEN e WRITE com foco na sílaba forte. Em write, o w não é pronunciado; pratique a palavra inteira sem soletrá-la para falar.',
    'Pedir repetição é uma estratégia de participação. Não trate silêncio como concordância ou falta de capacidade.',
    'A: instrua B a escrever Kim. B: peça repetição antes de escrever. A: repita mais devagar, sem gritar. Troquem e usem Jo; B agora pede Slowly, please.',
    'Siga Look → Write → Stop e use um pedido de ajuda no meio. Guarde o nome escrito e a expressão escolhida.',
    'Again, please. / Write Kim. / Kim? / Yes. / Thank you.\nKim',
    'Explique em português a um colega o que ele deve fazer com Write Sam. Esperado: escrever Sam, preservando o nome.',
    'Nova sequência: Listen → Write Lee → Stop. Peça que a primeira informação seja repetida antes de escrever.')

add('pre-a1', 'Letras e números úteis',
    'Soletrar um nome curto com tabela; reconhecer dígitos de 0 a 9; confirmar um código.',
    'Zero, one, two, three, four, five, six, seven, eight, nine. How do you spell it? = como se soletra? Code = código. A /eɪ/, B /biː/, C /siː/, D /diː/, E /iː/, F /ef/, G /dʒiː/, H /eɪtʃ/, I /aɪ/, J /dʒeɪ/, K /keɪ/, L /el/, M /em/, N /en/, O /oʊ/, P /piː/, Q /kjuː/, R /ɑːr/, S /es/, T /tiː/, U /juː/, V /viː/, W /ˈdʌbəljuː/, X /eks/, Y /waɪ/, Z /ziː/ ou /zed/. A tabela é apoio, não prova de IPA.',
    'REGISTRATION\nName: Mia\nCode: 305\nCheck your name and code.',
    'Host: What’s your name?\nMia: Mia.\nHost: How do you spell it?\nMia: M, I, A.\nHost: Code?\nMia: Three, zero, five.\nHost: Three, zero, nine?\nMia: No. Three, zero, five.',
    [('Leitura: qual é o código?', '305.'), ('Áudio: que dígito o atendente erra?', 'O último: diz nine, mas é five.'), ('Áudio: quais letras compõem o nome?', 'M, I, A.'), ('Leitura: o código tem dois ou três dígitos?', 'Três; zero conta como dígito.')],
    [('Escreva em dígitos: two, zero, eight.', '208; preserve o zero central.'), ('Complete a pergunta: How do you ___ it?', 'spell — pedir a sequência de letras.'), ('Repare 409 quando a informação correta é 407.', 'No. Four, zero, seven. Aceite repetir apenas seven se a correção ficar clara.')],
    'Escute E /iː/ e I /aɪ/; a letra I não tem o nome português i. Contraste B e P com apoio de áudio futuro; não avalie percepção auditiva lendo IPA.',
    'Use nomes e códigos fictícios. Não é necessário fornecer telefone, documento ou dados reais.',
    'A: registro de Leo, código 604. B: pergunte nome, soletração e código; confirme intencionalmente 601. A corrige. Invertam com Eva, código 208.',
    'Soletrar um nome escolhido e transmitir três dígitos; preencher Name e Code depois da confirmação.',
    'Name: Leo. Code: 604. / L, E, O. / Six, zero, four. / No, four.',
    'Transmita a alguém o código de Mia em dígitos, sem mudar a ordem. Esperado: 305; dizer “trezentos e cinco” em português é aceitável para esse destinatário.',
    'Novo cartão: Name: Noa; Code: 817. Soletre o nome e corrija quem confirmar 871.')

add('pre-a1', 'De onde sou, onde estou',
    'Distinguir origem de localização; reconhecer duas cidades; responder com blocos curtos.',
    'I’m from = sou de; I’m in = estou em; Brazil = Brasil; here = aqui; Where are you from? = de onde você é?; Where are you? = onde você está? From indica origem neste contexto; in indica localização.',
    'MEET OUR GROUP\nAna: from Brazil; in Recife.\nBen: from Canada; in Recife.\nWe are here.',
    'Ana: Hi, Ben. Where are you from?\nBen: I’m from Canada.\nAna: Where are you now?\nBen: I’m in Recife. And you?\nAna: I’m from Brazil. I’m in Recife too.',
    [('Leitura: quem é do Brasil?', 'Ana.'), ('Áudio: em que cidade Ben está?', 'Recife; Canada é a origem.'), ('Áudio: quem está em Recife além de Ben?', 'Ana; too acrescenta a mesma informação.'), ('Leitura: ambos têm a mesma origem?', 'Não: Brasil e Canadá.')],
    [('Escolha: I’m from / in Brazil, para dizer origem.', 'from.'), ('Escolha: I’m from / in Recife now.', 'in; now situa o momento atual.'), ('Responda Where are you from? usando Brazil.', 'I’m from Brazil. Ou From Brazil, com apoio nesta etapa.')],
    'Marque BRA-ZIL com força na segunda sílaba em inglês e CA-na-da na primeira. Acentos pessoais são aceitos se a informação fica compreensível.',
    'Origem, nacionalidade e identidade não são equivalentes. O aluno pode usar personagem e recusar detalhes pessoais.',
    'A: de Brazil, agora em Natal. B: de Canada, agora em Natal. Descubram origem e localização. Na segunda rodada B está em Toronto; confiram a diferença.',
    'Complete uma ficha From/In e troque duas perguntas com apoio; mantenha origem e localização distintas.',
    'From: Brazil. In: Natal. / I’m from Brazil. I’m in Natal.',
    'Explique em português onde Ben está e de onde é. Esperado: está em Recife, é do Canadá; não inverter os campos.',
    'Ficha nova: Kim — from Canada, in Salvador. Apresente Kim apontando os campos e responda às duas perguntas como personagem.')

add('pre-a1', 'Pessoas e objetos próximos',
    'Identificar uma pessoa e dois objetos; expressar posse simples; distinguir singular de plural regular.',
    'This is = este/esta é; my = meu/minha; a book = um livro; a bag = uma bolsa; a pen = uma caneta; an apple = uma maçã; friend = amigo/amiga; two books = dois livros. A/an depende do som seguinte; an apple começa com som de vogal. My não muda com gênero.',
    'ON THE TABLE\nA bag. A pen. Two books.\nThis is my bag.\nThis is my friend, Jo.',
    'Jo: Is this your bag?\nAna: Yes. My bag.\nJo: A pen?\nAna: Yes. And two books.\nJo: This book?\nAna: Yes. Thank you.',
    [('Leitura: quantos livros há?', 'Dois: two books.'), ('Áudio: a bolsa é de Ana?', 'Sim; ela responde Yes. My bag.'), ('Áudio: a pessoa menciona uma maçã?', 'Não. Pen e books são mencionados.'), ('Leitura: Jo é objeto ou pessoa?', 'Pessoa; friend apresenta a relação.')],
    [('Complete: ___ apple (a/an).', 'an, por começar com som vocálico.'), ('Passe a dois: one book → two ___.', 'books; plural regular com s.'), ('Ordene: is / This / bag / my.', 'This is my bag.')],
    'Dê atenção ao final de book e books; mantenha a diferença de número audível sem acrescentar uma sílaba depois de book.',
    'Não suponha estrutura familiar. Friend permite apresentar relações escolhidas; a pessoa decide como nomeá-las.',
    'A: perdeu bag e pen. B: tem bag e two books; pergunte This bag? A confirma a bolsa e recusa os livros com No, thank you. Troquem os objetos.',
    'Monte um cartão com uma pessoa e dois objetos identificados. Apresente-os usando This is e my; responda a uma confirmação.',
    'This is my friend, Jo. This is my bag. This is my pen. / Yes, my bag.',
    'Ajude alguém a separar os objetos listados: uma bolsa, uma caneta, dois livros. Não acrescente a maçã usada na explicação.',
    'Novo conjunto: an apple, a bag, three pens. Escreva as etiquetas e mostre o que pertence ao personagem Sam.')

add('pre-a1', 'Um pedido simples',
    'Reconhecer um menu de três itens; pedir um item; entender um preço inteiro pequeno.',
    'Water = água; tea = chá; coffee = café; please; thank you; How much? = quanto custa?; One tea, please = um chá, por favor. Ten = dez. Neste menu didático os números são preços em créditos fictícios, sem conversão monetária.',
    'CAFÉ MENU — credits\nWater 2\nTea 3\nCoffee 4',
    'Server: Hello.\nCustomer: One tea, please.\nServer: Tea. Three credits.\nCustomer: Three?\nServer: Yes, three.\nCustomer: Thank you.',
    [('Leitura: quanto custa a água?', '2 créditos.'), ('Áudio: o cliente pede chá ou café?', 'Chá: tea.'), ('Áudio: qual preço é confirmado?', '3 créditos.'), ('Leitura: qual dos três itens custa mais?', 'Coffee, 4 créditos.')],
    [('Complete: One coffee, ___.', 'please.'), ('Qual expressão pede o preço: How much? / What’s your name?', 'How much?'), ('Associe tea ao preço do menu.', '3 créditos; 4 é coffee.')],
    'Em TEA e COFfee, destaque a parte forte; compare three e tea como palavras completas sem exigir articulação perfeita de /θ/. O interlocutor deve conseguir identificar o pedido.',
    'Please e thank you ajudam a sinalizar cortesia; formas de atendimento variam. O exercício não ensina que toda cultura exige a mesma fórmula.',
    'A: quer water e não sabe preço. B: usa o menu. A pergunta How much? Segunda rodada: B oferece coffee, A corrige Tea, please.',
    'Realize um pedido de um item e confirme o preço; escreva item e valor num bilhete.',
    'One water, please. / How much? / Two credits. / Thank you.\nWater: 2',
    'Uma pessoa pede café em português. Use o menu para informar o preço e a palavra inglesa. Esperado: coffee, 4 créditos.',
    'Menu novo: Water 3, Tea 4, Coffee 5. Peça coffee e confira o preço; não reutilize o valor antigo.')

add('pre-a1', 'Dias, horas e lugares',
    'Localizar dia, hora inteira e sala num aviso; pedir confirmação; copiar um compromisso.',
    'Monday, Tuesday, Wednesday, Thursday, Friday, Saturday, Sunday = dias de segunda a domingo; at = às; room = sala; today = hoje; eleven = onze; twelve = doze. At ten = às dez; on Monday = na segunda. Room 2 é rótulo, não uma frase completa.',
    'ENGLISH GROUP\nMonday\n10:00\nRoom 2\nBring a pen. (Traga uma caneta.)',
    'Jo: English today?\nTutor: Yes. At ten.\nJo: Room three?\nTutor: No. Room two.\nJo: Room two, at ten.\nTutor: Yes.',
    [('Leitura: qual dia está no aviso?', 'Monday, segunda-feira.'), ('Áudio: qual sala é corrigida?', 'Room three é corrigida para room two.'), ('Áudio: qual é a hora?', 'Ten, dez horas.'), ('Leitura: que objeto levar?', 'A pen, uma caneta.')],
    [('Complete: ___ Monday (on/at).', 'on, com o dia neste exemplo.'), ('Complete: ___ ten (on/at).', 'at, com a hora.'), ('Copie em português: Friday, Room 4, 9:00.', 'Sexta-feira, sala 4, às 9 horas.')],
    'Pratique TWO / THREE com confirmação por dígitos quando necessário. Em Wednesday, escute a forma inteira; não tente pronunciar cada letra escrita.',
    'Diga explicitamente manhã/tarde quando houver dúvida. Neste primeiro aviso, a atividade é de manhã; formatos de data numéricos serão trabalhados depois.',
    'A: evento Tuesday, 9:00 da manhã, Room 3. B: pensa que é Room 2. A corrige; B confirma os três dados. Troquem para Friday, 11:00, Room 4.',
    'Leia um aviso, confirme oralmente hora e sala e copie dia/hora/local para uma agenda.',
    'Monday, 10:00, Room 2. / At ten? Room two? / Yes.',
    'Envie os três dados do English Group a quem não entende inglês. Esperado: segunda, 10h da manhã, sala 2.',
    'Aviso novo: Saturday, 11:00 da manhã, Room 5. Confirme oralmente e escreva os dados sem consultar o modelo.')

add('pre-a1', 'Meu primeiro encontro em inglês',
    'Integrar apresentação, pedido de ajuda e informação prática num encontro breve com apoio.',
    'Revisão: I’m; My name is; from/in; Again, please; one… please; on/at; números 0–12. Nice to meet you encerra uma apresentação, não substitui a resposta a Where are you from?',
    'WELCOME, KIM\nFrom: Canada\nToday: Friday\nMeet: 9:00, Room 3\nCafé: tea 2 credits, water 1 credit',
    'Host: Hello. I’m Jo.\nKim: I’m Kim. Nice to meet you.\nHost: Room three, at nine.\nKim: Again, please.\nHost: Room three. At nine.\nKim: Thank you. One water, please.\nHost: One credit.',
    [('Leitura: de onde é Kim?', 'Canadá.'), ('Áudio: por que a informação é repetida?', 'Kim pede Again, please.'), ('Áudio: o que Kim pede no café?', 'Water.'), ('Leitura: o encontro é em qual sala e hora?', 'Sala 3, às 9 da manhã; o aviso e o diálogo coincidem.')],
    [('Complete: I’m ___ Canada.', 'from; origem.'), ('Ordene: please / Again.', 'Again, please.'), ('Escolha o valor de water no novo aviso: 1 ou 2.', '1 crédito; 2 é tea, não reutilize o menu da U06.')],
    'Separe em grupos: I’m KIM / from CANADA. Faça pausa entre sala e hora; não confunda rapidez com sucesso.',
    'O encontro pode ser em biblioteca ou associação comunitária. Participar não exige viagem internacional nem exposição de dados pessoais.',
    'A: recepção com aviso da leitura. B: visitante Kim, quer água e precisa confirmar sala. Depois usem Lee, from Brazil, Room 4 às 10; mantenham o preço do café.',
    'Projeto: ficha fictícia, troca de apresentação, pedido com preço e bilhete de compromisso. Faça uma segunda tentativa com informação diferente.',
    'Name: Kim. From: Canada. Friday, 9:00, Room 3. / I’m Kim. Again, please. One water, please.',
    'Informe a um colega em português como participar do encontro de Kim: dia, hora, sala e preço da água. Esperado: sexta, 9h, sala 3, 1 crédito.',
    'Encontro alternativo: Sam, from Brazil, Monday, 11:00, Room 6; tea 3. Realize o mesmo projeto sem copiar os dados de Kim.')
add('a1', 'Pessoas e redes de apoio',
    'Apresentar duas pessoas; perguntar ocupação e contato fictício; escrever um perfil curto.',
    'He/she/they + is/are; I’m not; Are you…? Yes, I am / No, I’m not; a/an + ocupação; teacher, nurse, driver, neighbour; her/his/their. She is a nurse → Is she a nurse? Troque a ordem de is e sujeito; não use do com be.',
    'My name is Rosa. I’m a bus driver in Recife. My friend Alex is a nurse. Alex is from Natal. We are neighbours. Our English group is small. The teacher is Jo. My contact for this activity is rosa@example.com. It is a fictional address.',
    'Jo: Are you a teacher, Rosa?\nRosa: No, I’m not. I’m a bus driver.\nJo: And Alex?\nRosa: Alex is a nurse. We are neighbours.\nJo: Is Alex from Recife?\nRosa: No, from Natal.',
    [('Leitura: que relação Rosa e Alex têm?', 'São amigos e vizinhos, não há informação de parentesco.'), ('Áudio: qual ocupação é negada?', 'Teacher; Rosa é bus driver.'), ('Áudio: Alex é de Recife?', 'Não; de Natal.'), ('Leitura: o endereço deve ser usado para contato real?', 'Não; é explicitamente fictício.')],
    [('Complete: She ___ a nurse. (is/are)', 'is; sujeito singular she.'), ('Transforme You are a teacher em pergunta.', 'Are you a teacher? Be vai antes do sujeito.'), ('Complete: Alex is ___ nurse. (a/an)', 'a; nurse começa com som consonantal.')],
    'Diferencie HE’S / SHE’S e reconheça a contração de is. Compare nurse e neighbour pela sílaba forte, sem exigir sotaque de uma região.',
    'Aceite they para uma pessoa que assim se identifica; não deduza pronome de nome ou profissão. Confirme a preferência.',
    'A: Rosa, driver, Recife. B: Alex, nurse, Natal. Entrevistem-se sobre nome, ocupação e cidade; B começa supondo que A é teacher, A corrige.',
    'Escreva 30–45 palavras apresentando você ou personagem e uma pessoa de sua rede. Responda a duas perguntas de confirmação.',
    'I’m Lia. I’m a teacher in Natal. My friend Sam is a driver. We are neighbours. Sam is from Recife. Our English group is small.',
    'Passe a um colega lusófono profissão e cidade de Rosa e Alex; mantenha a diferença entre morar/trabalhar em Recife e ser de Natal.',
    'Novo par: Leo, nurse, Belém; Mai, teacher, Manaus. Faça dois perfis e corrija a afirmação “Leo is a teacher”.')

add('a1', 'Rotinas que cabem na vida',
    'Descrever rotina; perguntar horários; comparar dois hábitos sem juízo de valor.',
    'Present simple: I work / she works; don’t/doesn’t; Do you…? / Does she…?; get up, start, finish, usually, sometimes, never; at seven, in the morning. Does she work? usa work sem s porque does já marca a pergunta.',
    'I work at a bakery. I get up at five and start work at six. I usually finish at two in the afternoon. My brother works at night. He gets up at three in the afternoon. We sometimes have dinner together, but we don’t have breakfast together.',
    'Ana: Do you work on Saturday?\nLeo: Yes, I do. I don’t work on Monday.\nAna: What time do you start?\nLeo: At six. My brother starts at ten at night.\nAna: Does he work on Monday?\nLeo: Yes, he does.',
    [('Leitura: por que os irmãos não tomam café juntos?', 'Têm horários diferentes; ele trabalha à noite.'), ('Áudio: em que dia Leo não trabalha?', 'Monday.'), ('Áudio: quando o irmão começa?', 'Às dez da noite.'), ('Leitura: sometimes é sempre ou às vezes?', 'Às vezes; não transforma o jantar em hábito diário.')],
    [('Complete: She ___ at six. (start/starts)', 'starts; terceira pessoa singular.'), ('Corrija: Does he works on Monday?', 'Does he work on Monday? Sem s depois de does.'), ('Negue: I work on Monday.', 'I don’t work on Monday.')],
    'Marque START / SIX e FINISH / TWO como informações fortes. Em starts, pratique o encontro de consoantes lentamente; preserve o horário compreensível.',
    'Rotina noturna, desemprego e cuidado doméstico são situações legítimas. Não use “rotina ideal” como padrão de avaliação.',
    'A: livre Monday, trabalha 6–14h nos outros dias. B: livre Tuesday, trabalha 14–22h. Perguntem horários e encontrem dez minutos para conversar.',
    'Escreva 40–60 palavras sobre uma rotina e grave 30–45 segundos. Inclua uma negação e uma pergunta ao interlocutor.',
    'I usually get up at seven. I work from nine to five. I don’t work on Sunday. My friend works at night. We sometimes have lunch together. What time do you start work?',
    'Explique a disponibilidade de Leo a alguém que quer marcar um encontro na segunda. É dia livre dele; não há horário pessoal completo disponível.',
    'Nova rotina: Bea trabalha 12–20h, folga Friday. Escreva três informações e duas perguntas, sem inventar hora de acordar.')

add('a1', 'Casa e bairro',
    'Descrever um lugar; localizar serviços; pedir e seguir um trajeto curto.',
    'There is/are; Is there…?; some/any em existência; next to, opposite, between, near; turn left/right, go straight; bedroom, kitchen, bus stop, library. There is a library afirma existência; the library is near… localiza uma já identificada.',
    'Our flat has two bedrooms and a small kitchen. There isn’t a garden. There is a library next to the building. The café is opposite the library. A bus stop is between the café and the supermarket. The street is quiet in the morning.',
    'Visitor: Is there a café near here?\nRosa: Yes. Go straight and turn left at the library. The café is opposite it.\nVisitor: Is it next to the supermarket?\nRosa: No. The bus stop is between them.',
    [('Leitura: o apartamento tem jardim?', 'Não; there isn’t.'), ('Áudio: onde virar?', 'À esquerda na biblioteca.'), ('Áudio: o que fica entre café e supermercado?', 'Bus stop.'), ('Leitura: quantos quartos há?', 'Dois.')],
    [('Complete: There ___ two bedrooms.', 'are; plural.'), ('Pergunte se há biblioteca.', 'Is there a library?'), ('Escolha: opposite significa em frente ou dentro?', 'Em frente; neste contexto de lados da rua.')],
    'Destaque LEFT e RIGHT; o contraste precisa ser claro. Não acrescente vogal obrigatória ao final de left; diminua a velocidade se necessário.',
    'Descreva acessibilidade quando houver dados, sem supor que todos caminham ou usam escadas. Um desenho pode apoiar a orientação.',
    'A: desenhe library ao lado do prédio e café em frente. B: não vê o mapa e pede direção. A dá o trajeto; B desenha e ambos conferem.',
    'Faça um mapa de quatro lugares e descrição de 40–60 palavras. Dê duas instruções e responda Is there…?',
    'There is a library near my flat. The café is opposite the library. There is a bus stop next to the café. Go straight and turn left. The library is on your right.',
    'Explique em português onde uma pessoa encontra o café, distinguindo ponto de virada e destino. Aceite mapa com rótulos.',
    'Novo mapa: escola em frente ao parque; café entre escola e mercado. Descreva sem reutilizar a posição da biblioteca.')

add('a1', 'Comida, compras e preferências',
    'Pedir alimentos; perguntar quantidade e preço; comunicar preferências sem explicar regras médicas.',
    'I like/don’t like; I’d like como bloco de pedido; countable/uncountable; some/any; how much/how many; bread, rice, eggs, milk; 13–100; this/these. How many eggs? conta unidades; how much rice? pergunta quantidade não contada aqui.',
    'SHOPPING NOTE\nWe need six eggs, some rice and two apples. We have milk, but we don’t have any bread. Café menu: sandwich 15 credits, soup 13, water 3. I like soup. My friend doesn’t like milk in coffee.',
    'Server: What would you like?\nCustomer: I’d like soup and water, please.\nServer: Thirteen plus three. Sixteen credits.\nCustomer: Sixteen or sixty?\nServer: Sixteen: one, six.\nCustomer: Thank you.',
    [('Leitura: que item já existe em casa?', 'Milk.'), ('Áudio: quanto custa o pedido?', '16 créditos.'), ('Áudio: qual dúvida precisa ser resolvida?', 'Sixteen versus sixty.'), ('Leitura: quantos ovos comprar?', 'Seis.')],
    [('Escolha: How much / many eggs?', 'How many eggs?'), ('Complete: We don’t have ___ bread. (some/any)', 'any na negativa deste exercício.'), ('Escreva 16 e 60 em inglês.', 'sixteen; sixty. Confirme por dígitos se necessário.')],
    'Compare sixTEEN e SIXty em fala isolada; a tonicidade pode mudar em contexto. Confirme também com one-six para evitar depender apenas do acento.',
    'I don’t like e I can’t eat não são equivalentes. O curso não substitui informação confiável sobre ingredientes ou alergênicos.',
    'A: quer soup e water; só tem 15 créditos. B: preços do menu. Descubram o total e escolham só soup ou só water, sem fingir dinheiro extra.',
    'Escreva uma lista de cinco itens e realize um pedido com preço confirmado; diga uma preferência.',
    'I’d like soup, please. How much is it? / Thirteen credits. / Thank you. I like soup. We also need some rice and six eggs.',
    'Informe em português a diferença entre preço da sopa e total do pedido. Esperado: sopa 13; sopa + água 16.',
    'Menu novo: salad 14, bread 5, water 2. Com 16 créditos, peça salad e water e confirme o total.')

add('a1', 'O que acontece agora',
    'Distinguir rotina e ação atual; descrever uma cena; combinar disponibilidade imediata.',
    'Present continuous: am/is/are + -ing; now, today; work/working, wait/waiting; wear, rain; can/can’t para possibilidade. I work at home é rotina; I’m working at home today é situação atual. Stative like fica I like, não I’m liking nesta introdução.',
    'Today is Saturday. I usually study at home, but today I’m sitting in the library. Jo is reading a book. Two people are using computers. It’s raining outside. My phone is off. I can talk after eleven, but I can’t talk now.',
    'Friend: Are you working now?\nLearner: No, I’m studying in the library.\nFriend: Can you talk at eleven?\nLearner: Yes. Are you waiting outside?\nFriend: No, I’m at home. It’s raining.',
    [('Leitura: onde a pessoa costuma estudar?', 'Em casa; hoje é exceção.'), ('Áudio: a pessoa está trabalhando?', 'Não, está estudando.'), ('Áudio: onde o amigo está?', 'Em casa, não esperando fora.'), ('Leitura: quantas pessoas usam computadores?', 'Duas.')],
    [('Complete: Jo ___ reading. (is/are)', 'is.'), ('Corrija: I studying now.', 'I’m studying now / I am studying now; falta be.'), ('Escolha para rotina: I study / I’m studying every Monday.', 'I study every Monday.')],
    'Em I’m STUDYING NOW, destaque ação e tempo. O final -ing não precisa soar como uma palavra extra; preserve a diferença entre I study e I’m studying.',
    'Estar online não significa estar disponível. Pratique dizer que não pode falar sem obrigação de justificar vida pessoal.',
    'A: estuda agora, livre às 11. B: trabalha às 11, livre às 12. Troquem informações e combinem 12, se A também puder; A confirma.',
    'Descreva uma cena imaginada em 45–65 palavras e escreva duas mensagens para combinar uma conversa.',
    'I usually study at home. Today I’m studying in a café. Two people are talking. It’s raining. I can’t talk now. Can you call at twelve?',
    'Explique ao colega lusófono por que não deve ligar agora e quando pode tentar. Distinguir depois de 11 no texto e às 11 no diálogo.',
    'Cena nova: terça, geralmente trabalho no escritório; hoje espero um ônibus; livre às 18. Produza uma atualização coerente.')

add('a1', 'Ontem em poucas palavras',
    'Contar três acontecimentos concluídos; distinguir presente de passado; perguntar sobre um dia.',
    'Was/were; past simple regular + -ed e frequentes went, had, saw, did; yesterday, last night; didn’t + base; Did you…? First/then. Went é passado de go; didn’t go usa base, não went.',
    'Yesterday I was tired. I worked in the morning and visited my friend in the afternoon. We had tea. Then we went to the park. It was cold, so we went home early. I didn’t study at night. I watched a short film.',
    'Jo: Did you work yesterday?\nAna: Yes, in the morning.\nJo: Did you study at night?\nAna: No, I didn’t. I watched a film.\nJo: Was it good?\nAna: Yes, it was.',
    [('Leitura: por que foram para casa cedo?', 'Estava frio.'), ('Áudio: Ana estudou à noite?', 'Não; assistiu a um filme.'), ('Áudio: o filme foi bom para Ana?', 'Sim; Yes, it was.'), ('Leitura: o que aconteceu antes do parque?', 'Tomaram chá; também houve trabalho e visita antes.')],
    [('Complete: Yesterday we ___ home. (go/went)', 'went.'), ('Corrija: I didn’t watched a film.', 'I didn’t watch a film.'), ('Escolha: We was/were tired.', 'were; sujeito we.')],
    'Ouça worked /t/, visited /ɪd/ e played /d/. Apenas visited acrescenta sílaba neste conjunto; não exija memorizar todas as regras de uma vez.',
    'Relatos podem ser inventados. Evite avaliar experiências caras, viagens ou lazer como sinal de melhor desempenho.',
    'A: ontem trabalhou, teve chá, viu filme. B: ontem estudou, foi ao parque, não viu filme. Façam três perguntas e localizem uma diferença.',
    'Escreva 50–70 palavras sobre ontem com três eventos e uma negação; responda duas perguntas com Did/Was.',
    'Yesterday I was at home. I studied in the morning. Then I visited Jo. We had coffee. I didn’t work at night. I watched a film, and it was good.',
    'Conte ao colega em português a sequência do texto, mantendo a causa da volta para casa e sem inventar o título do filme.',
    'Nova ficha: yesterday — library / studied / rain / went home / no film. Transforme em relato e duas respostas.')

add('a1', 'Convites e próximos passos',
    'Convidar, aceitar ou recusar; combinar data por extenso; expressar um plano próximo.',
    'Going to + base; would you like to como fórmula; let’s; on Friday / at six; January–December com calendário de apoio; first/second/third; can. I’m going to study é plano; I’m going to the library indica destino.',
    'Hi, Jo. I’m going to visit the book fair on Saturday, 14 March. It starts at ten in the morning. Would you like to come? We can meet at the library at nine thirty. The fair is free. Bring water. — Ana',
    'Jo: Thanks for the invitation. I can’t come on Saturday.\nAna: That’s OK. Are you free on Sunday?\nJo: Yes, after lunch.\nAna: Let’s meet at two.\nJo: At the library?\nAna: Yes.',
    [('Leitura: o evento custa quanto?', 'É gratuito; free neste contexto.'), ('Áudio: o plano final é sábado?', 'Não; domingo às duas.'), ('Áudio: onde se encontram?', 'Na biblioteca.'), ('Leitura: nine thirty é início da feira?', 'Não; é encontro proposto, antes de ten.')],
    [('Complete: I’m going to ___ Jo. (visit/visiting)', 'visit.'), ('Recuse com cortesia e proponha domingo.', 'Thanks, but I can’t on Saturday. Can we meet on Sunday? Variações claras são aceitas.'), ('Escreva 9:30 em inglês.', 'nine thirty; half past nine também é aceitável.')],
    'Destaque SATURDAY / SUNDAY quando corrige o dia. Faça uma pausa antes da alternativa para tornar a recusa e a proposta claras.',
    'Use mês escrito por extenso para evitar ambiguidade entre dia/mês e mês/dia. Recusar um convite não exige justificativa íntima.',
    'A: livre sábado de manhã. B: só domingo às 14h. A também pode domingo; negociem e escrevam a confirmação completa.',
    'Escreva convite de 40–60 palavras e uma resposta com alternativa. Registre dia, hora e local finais.',
    'Would you like to visit the library on Sunday? I’m going to study there. We can meet at two in the afternoon. / Thanks. Yes, see you at two at the library.',
    'Explique a alteração do plano a quem leu somente o convite: agora domingo às 14h na biblioteca; não afirmar que a feira ocorre no domingo.',
    'Convite novo: café sexta às 18h. Destinatário só pode sábado às 10h. Negocie e confirme sem manter os dois horários.')

add('a1', 'Uma semana compartilhada',
    'Integrar perfil, rotina, relato e plano; escrever mensagens úteis; confirmar informação prática.',
    'Revisão de be, present simple/continuous, past simple e going to; because, and, but, then; can para disponibilidade. Escolha o tempo pela referência: usually / now / yesterday / tomorrow.',
    'COMMUNITY WEEK\nMonday: reading group, 18:00, library.\nWednesday: café conversation, 17:30, café.\nSaturday: neighbourhood walk, 10:00, park.\nRosa works until five. Yesterday she visited the library. Today she is writing to Jo. She is going to join the reading group.',
    'Jo: Can you come on Wednesday?\nRosa: I finish at five, but I can meet at five thirty.\nJo: Great. At the library?\nRosa: No, Wednesday is at the café.\nJo: Thanks. What did you do yesterday?\nRosa: I visited the library.',
    [('Leitura: onde é o grupo de segunda?', 'Biblioteca.'), ('Áudio: que confusão é corrigida?', 'Local de quarta: café, não biblioteca.'), ('Áudio: Rosa consegue ir na quarta?', 'Sim, às 17h30, depois de terminar às 17h.'), ('Leitura: o que Rosa faz agora?', 'Escreve para Jo; o plano é participar do grupo.')],
    [('Associe usually a rotina ou ação de ontem.', 'Rotina; geralmente present simple.'), ('Complete: Yesterday she ___ the library. (visited/visits)', 'visited.'), ('Complete: Tomorrow I’m going to ___ Jo. (meet/met)', 'meet; base depois de going to.')],
    'Use marcadores temporais fortes para orientar quem escuta. Grave a mesma mensagem com pausas entre dia, hora e lugar.',
    'Participação comunitária inclui encontros gratuitos e online. O projeto pode usar bairro fictício e não precisa de fotos de casa.',
    'A: agenda de Rosa. B: trabalha quarta até 18h e só pode sábado. Descubram o desencontro e encontrem opção comum; ambos podem sábado.',
    'Projeto: perfil de 40 palavras, agenda de três eventos, relato de ontem e convite de 50 palavras; conversa de 1–2 minutos com confirmação.',
    'I usually finish at five. Yesterday I visited the library. Today I’m writing to Jo. We’re going to meet at the café on Wednesday at five thirty. Can you come?',
    'Explique a agenda a uma pessoa lusófona e destaque que a conversa de quarta é no café. Preserve todos os horários.',
    'Nova semana: Tuesday museum 16h; Thursday library 19h; Sunday park 9h. Você trabalha até 18h nos dias úteis. Selecione uma opção viável e convide alguém.')
add('a2', 'Histórias e experiências',
    'Contar um episódio com contexto; perguntar sobre experiências; distinguir data definida de experiência até agora.',
    'Past continuous + when; past simple; present perfect introdutório com ever/never; been/gone; travel, miss a bus, get back. I was waiting when Jo called combina contexto e evento. I’ve visited Salvador não informa quando; I went in May informa.',
    'Last month I visited Salvador for the first time. I was waiting for a bus when a neighbour called. She offered to show me a small bookshop near the station. We walked there together. I have visited several big bookshops, but this one was different: readers could exchange books. I bought nothing, but I left with a novel. I exchanged an old guide for it.',
    'Jo: Have you ever exchanged a book?\nAna: Yes, I have. I did it in Salvador last month.\nJo: What were you doing before you found the shop?\nAna: I was waiting for a bus. A neighbour called me.\nJo: Did you buy the novel?\nAna: No, I exchanged a guide for it.',
    [('Leitura: como conseguiu o romance?', 'Trocou um guia; não comprou.'), ('Áudio: a experiência tem data?', 'Sim: last month, depois da pergunta geral com ever.'), ('Áudio: qual era a ação em curso?', 'Waiting for a bus.'), ('Leitura: o que tornou a loja diferente?', 'A possibilidade de trocar livros.')],
    [('Complete: I was ___ when Jo called. (wait/waiting)', 'waiting, após was.'), ('Escolha para data definida: I went / have gone there last month.', 'I went there last month.'), ('Responda Have you ever exchanged a book? positivamente.', 'Yes, I have. Pode acrescentar experiência real ou fictícia.')],
    'Separe I was WAITING / when Jo CALLED. Compare a forma fraca de was com o verbo importante; preserve as terminações de passado.',
    'Experiências locais têm o mesmo valor comunicativo que viagens. Não pressupor oportunidade de turismo internacional.',
    'A: visitou feira de livros sábado e perdeu ônibus enquanto conversava. B: nunca foi à feira e pergunta experiência, data e resultado. Troquem os papéis.',
    'Relate um episódio em 80–100 palavras com contexto, evento e resultado; responda a duas perguntas sobre experiência e data.',
    'I’ve been to a book fair once. I went last Saturday. I was talking to a seller when my bus arrived. I missed it, but I found an interesting book. I took the next bus and got home late.',
    'Resuma a história para um amigo lusófono interessado em trocas: preserve local, modo de obtenção e ausência de compra.',
    'Nova experiência: curso de culinária, agosto, preparando arroz quando faltou energia; terminaram em outra cozinha. Conte sem trocar causa e resultado.')

add('a2', 'Escolher e comparar',
    'Comparar opções por critérios; justificar preferência; reconhecer limites de orçamento e quantidade.',
    'Comparative/superlative; cheaper/more useful/the best; too/enough; much/many/a few/a little; than; fit, cost, reliable. Cheaper than compara; the cheapest seleciona entre opções; too expensive indica além do aceitável.',
    'Three study spaces: Central costs 20 credits a day, closes at eight and has fast internet. Garden costs 12, closes at six and is quieter than Central. Home costs nothing, but the connection is slow and the table is small. I have 15 credits and need a quiet place until five. A few classmates prefer Central, but it is too expensive for me today.',
    'Friend: Is Garden big enough for our group?\nLearner: For two people, yes. For six, no.\nFriend: Is it cheaper than Central?\nLearner: Yes, eight credits cheaper.\nFriend: Then let’s go there before five.',
    [('Leitura: que opção paga cabe no orçamento?', 'Garden, 12 créditos, dentro de 15.'), ('Áudio: seis pessoas cabem?', 'Não; só confirma espaço para duas.'), ('Áudio: qual diferença de preço?', '8 créditos.'), ('Leitura: por que Home pode não servir?', 'Internet lenta e mesa pequena; gratuito não resolve todos os critérios.')],
    [('Complete: Garden is cheaper ___ Central.', 'than.'), ('Reescreva “o preço ultrapassa meu orçamento” com too.', 'It is too expensive for me.'), ('Escolha: a few / a little classmates.', 'a few; classmates é contável no plural.')],
    'Destaque a comparação: CHEAPER, but SMALLER. Em than, aceite forma fraca; priorize números e contraste audíveis.',
    'Melhor depende dos critérios de quem usa. Não transformar preferências de consumo em julgamento sobre pessoas.',
    'A: orçamento15, precisa silêncio até17h. B: precisa internet rápida e pode gastar20. Negociem explicitamente uma prioridade; não há solução única.',
    'Escreva recomendação de 80–100 palavras comparando as três opções e reconhecendo uma desvantagem da escolhida.',
    'Garden is cheaper and quieter than Central. It closes earlier, but we only need it until five. Home is free, but its connection is too slow. I recommend Garden for two people. It isn’t big enough for six.',
    'Explique as opções para colega lusófono com orçamento12. Não afirmar que Garden atende um grupo de seis.',
    'Novas opções: A custa18, abre até22h; B custa10, fecha17h. Orçamento12, uso até19h. Explique por que nenhuma atende ambos os requisitos.')

add('a2', 'Cuidar da rotina e pedir apoio',
    'Descrever um problema cotidiano; pedir ajuste; interpretar instruções simples sem emitir diagnóstico.',
    'Should/shouldn’t para conselho; must/mustn’t para regra; have to/don’t have to; feel, tired, appointment, rest, break. Don’t have to indica ausência de obrigação, não proibição; mustn’t indica proibição.',
    'WORKSHOP NOTICE\nPlease take a short break between sessions. You must wear closed shoes in the workshop. You mustn’t use the equipment alone. You don’t have to bring a notebook: we provide paper. If you feel uncomfortable, stop and speak to the tutor. Jo is tired today and wants to move an appointment to Friday.',
    'Jo: Could we move my appointment? I’m very tired today.\nReception: We have Friday at ten or Monday at two.\nJo: Friday, please. Do I have to bring a notebook?\nReception: No, we provide paper. Please arrive ten minutes early.',
    [('Leitura: qual ação é proibida?', 'Usar equipamento sozinho.'), ('Áudio: qual horário Jo escolhe?', 'Sexta às dez.'), ('Áudio: deve levar caderno?', 'Não; papel é fornecido.'), ('Leitura: que fazer se desconfortável?', 'Parar e falar com tutor; o aviso não diagnostica a causa.')],
    [('Distinga mustn’t de don’t have to.', 'Proibição versus não obrigação.'), ('Complete: You ___ wear closed shoes, segundo aviso.', 'must / have to; é regra.'), ('Faça pedido de mudança com Could we…?', 'Could we move my appointment to Friday?')],
    'Torne a negação audível em mustn’t; confirme a regra com uma paráfrase se necessário. Pratique I HAVE to / I DON’T have to.',
    'Privacidade: pedir ajuste não obriga revelar diagnóstico. As regras do aviso são ficcionais e específicas do workshop.',
    'A: deseja mover horário sem explicar detalhes pessoais. B: só oferece Friday10 ou Monday14. Confirme escolha e instrução de chegada.',
    'Redija pedido de ajuste de 70–90 palavras e explique duas regras e uma ausência de obrigação.',
    'Could we move my appointment to Friday at ten? I can’t attend today. Please confirm the new time. I understand that I should arrive ten minutes early. I don’t have to bring a notebook because paper is provided.',
    'Passe as regras do workshop em português, preservando especialmente a diferença entre proibição e item opcional.',
    'Novo aviso: bring ID; no photos; notebook optional. Escreva instruções sem transformar notebook em obrigação.')

add('a2', 'Viagens e imprevistos',
    'Planejar deslocamento; reagir a mudança; relacionar condição e consequência provável.',
    'Will para decisão no momento; going to para plano; present continuous para arranjo; first conditional if + present, will + base; arrive, leave, platform, delay, pick up. If it rains, we’ll take a bus; não usar will dentro da oração com if neste padrão.',
    'Our train leaves at 8:20 from platform 4. We’re meeting Jo at the station at eight. We’re going to visit a museum. The museum closes at five. If the train is late, we’ll call Jo. The return ticket is for 18:10. We need to keep the afternoon visit short.',
    'Announcement: The 8:20 train is delayed by twenty minutes. Please wait on platform 4.\nAna: I’ll call Jo now.\nJo: Thanks. I’m already at the station. If we miss the museum tour, we’ll visit the gallery first.',
    [('Leitura: qual horário de encontro?', '8h, antes da partida8h20.'), ('Áudio: muda a plataforma?', 'Não; continua4.'), ('Áudio: qual atraso anunciado?', '20 minutos; previsão de partida8h40, não garantia de chegada.'), ('Leitura: qual limite do museu?', 'Fecha às17h.')],
    [('Complete: If it rains, we ___ take a bus.', 'will / ’ll.'), ('Corrija: If the train will be late, I’ll call.', 'If the train is late, I’ll call.'), ('Use will para decidir telefonar agora.', 'I’ll call Jo now.')],
    'Contraste EIGHT twenty e EIGHT forty; confirme por escrito se o ambiente estiver ruidoso. Treine agrupamento de horários e plataformas.',
    'Não supor que um anúncio de atraso garante chegada. Mantenha previsão e fato separados na informação passada a outros.',
    'A: tem anúncio de atraso20 minutos. B: espera às8h e não viu anúncio. A atualiza; B propõe alternativa caso percam a visita.',
    'Escreva plano de 90–110 palavras com horário, mudança e alternativa; deixe mensagem oral de 45–60 segundos.',
    'We’re meeting at eight. Our train is delayed by twenty minutes, but the platform is the same. I’ll call Jo. If we miss the tour, we’ll visit the gallery first. We must leave before five to catch our return train.',
    'Avise colega lusófono do atraso e da plataforma, sem dizer que o trem já partiu.',
    'Novo anúncio: 9:10 mudou da plataforma2 para5, sem atraso informado. Atualize o grupo sem inventar nova hora.')

add('a2', 'Mensagens que resolvem',
    'Escrever solicitação e esclarecimento; descrever objeto perdido; conferir informações digitais.',
    'Could you…?; relative clauses who/that/which introdutórias; someone/anything; attachments, subject, reply, log in; this/it para referência. The bag that I left is blue identifica qual bolsa; não exige terminologia gramatical na resposta.',
    'Subject: Bag left in Room 4\nHello, I attended the class on Tuesday and left a blue bag under a chair. It has a notebook and a red pen inside. Could you check the room? The person who sat next to me was Jo. Please reply to this message. I don’t need you to send the bag; I can collect it. Thank you, Ana.',
    'Staff: We found a black bag. Is it yours?\nAna: Mine is blue. Does the black bag have a red pen?\nStaff: No, only a book.\nAna: Then it isn’t mine. Could you check under the chairs in Room 4?',
    [('Leitura: Ana pede envio por correio?', 'Não, pode buscar.'), ('Áudio: a bolsa encontrada é a dela?', 'Não; cor e conteúdo diferem.'), ('Áudio: o que há na bolsa preta?', 'Só um livro.'), ('Leitura: quem é Jo?', 'Pessoa que sentou ao lado; não sabemos se é funcionário.')],
    [('Una: I left a bag. The bag is blue. Use that.', 'The bag that I left is blue.'), ('Faça um pedido para verificar a sala.', 'Could you check Room 4, please?'), ('Escolha: I found someone/anything who can help.', 'someone; refere-se a pessoa.')],
    'Destaque BLUE e RED ao corrigir características. Em could you, reconheça ligação entre palavras sem obrigar imitação específica.',
    'Use assunto claro e dados mínimos. Não incluir senha, documento ou endereço residencial em exercício de achados e perdidos.',
    'A: perdeu blue bag com red pen. B: só achou black bag com book; faça perguntas antes de declarar que encontrou a correta.',
    'Escreva e-mail de 80–110 palavras com objeto, lugar, momento, pedido e forma de retorno; responda a uma descrição incompatível.',
    'Hello, I left a green notebook in Room 2 yesterday. It has my name on the first page. Could you check the room? I can collect it on Friday. Please reply here. Thank you for your help.',
    'Informe à recepção lusófona quais características distinguem a bolsa procurada; não atribua a bolsa preta a Ana.',
    'Objeto novo: umbrella, yellow, library, Monday; encontrado: blue umbrella, café. Escreva esclarecimento antes de aceitar devolução.')

add('a2', 'Aprender e trabalhar em conjunto',
    'Explicar como fazer uma tarefa; distribuir responsabilidades; confirmar conclusão e pendência.',
    'Present perfect com just/already/yet; adverbs of manner; first/next/finally; need to, know how to; set up, fill in, turn off; infinitivo de propósito. I’ve already sent it indica conclusão relevante agora; I haven’t sent it yet indica pendência.',
    'To prepare the reading room, first put six chairs around the table. Next, turn on the lamp and open the windows. Finally, place the sign by the door. Jo has already printed the sign. Ana hasn’t arranged the chairs yet. Nobody needs to use the projector today. Please turn off the lamp when you leave.',
    'Jo: Have you arranged the chairs yet?\nAna: Not yet. I’ve just opened the windows.\nJo: I’ll help with the chairs.\nAna: Thanks. Have you printed the sign?\nJo: Yes, I have. It’s by the door.',
    [('Leitura: quantas cadeiras?', 'Seis.'), ('Áudio: o que Ana acabou de fazer?', 'Abriu janelas.'), ('Áudio: o que Jo oferece?', 'Ajudar com cadeiras.'), ('Leitura: projetor é necessário?', 'Não.')],
    [('Complete: I haven’t finished ___. (yet/already)', 'yet.'), ('Reescreva com to: Open the window. We need fresh air.', 'Open the window to get fresh air.'), ('Ordene: already / has / Jo / printed / the sign.', 'Jo has already printed the sign.')],
    'Destaque ALREADY e NOT YET; a diferença muda a distribuição de trabalho. Treine a pausa antes de pedir confirmação.',
    'Confirme entendimento sem constranger: peça que a pessoa diga o próximo passo. Não equipare sotaque a competência profissional.',
    'A: janelas prontas, cadeiras pendentes. B: cartaz pronto e livre para ajudar. Distribuam as tarefas e façam atualização após executar.',
    'Produza instrução de 80–100 palavras e checklist feito/pendente; relate o estado sem marcar tarefa não realizada como concluída.',
    'First, put six chairs around the table. We’ve already printed the sign, but we haven’t arranged the chairs yet. Jo will help. We don’t need the projector. Finally, check the room and turn off the lamp when you leave.',
    'Passe à nova colega as pendências, distinguindo ações prontas das instruções ainda não cumpridas.',
    'Nova lista: invitations sent; chairs ready; water not bought. Distribua a compra e apresente estado correto com already/yet.')

add('a2', 'Cultura, narrativas e opiniões',
    'Descrever obra curta; expressar preferência com razões; reconhecer perspectivas distintas.',
    'Because/so/although; enjoy + -ing; would rather como bloco opcional; adjectives interesting/interested, boring/bored; used to introdutório para hábito antigo; story, character, ending. I’m interested descreve quem sente; the story is interesting descreve o estímulo.',
    'In the short story “The Last Seat”, a woman gets on a crowded bus. A teenager offers her a seat, but she asks him to give it to a tired worker instead. The narrator first thinks the teenager is rude because he is looking at his phone. Later, we learn he is reading directions for his grandmother. I enjoyed the ending because my first impression was wrong.',
    'Ana: Did you like the story?\nJo: Yes, although it was very short. I used to judge people using phones on buses.\nAna: I liked the worker’s surprise.\nJo: We don’t know what everyone is doing. That’s the point for me.',
    [('Leitura: quem recebe o assento por sugestão da mulher?', 'O trabalhador cansado.'), ('Áudio: qual hábito Jo diz ter tido?', 'Julgar pessoas usando celular no ônibus.'), ('Áudio: gostam da mesma coisa pelo mesmo motivo?', 'Não exatamente; Ana cita surpresa do trabalhador, Jo mudança de julgamento.'), ('Leitura: por que o adolescente usava o celular?', 'Lia direções para a avó; não há prova de desatenção.')],
    [('Complete: The story is ___. I’m ___. (interesting/interested)', 'interesting; interested.'), ('Una com although: It was short. I enjoyed it.', 'Although it was short, I enjoyed it.'), ('Complete: I enjoy ___ stories. (read/reading)', 'reading.')],
    'Use pausas antes de BUT e ALTHOUGH para sinalizar mudança de perspectiva. Leia o final sem acelerar o motivo da surpresa.',
    'Este conto é original e ficcional. Interpretar não significa atribuir um comportamento a toda geração ou nacionalidade.',
    'A: defende que o narrador julgou cedo demais. B: pede evidência do conto. A cita um detalhe; B oferece outra interpretação compatível.',
    'Escreva reação de 90–120 palavras com resumo breve, opinião e duas razões; aceite uma interpretação diferente do colega.',
    'I enjoyed “The Last Seat” because the ending changed my first impression. The teenager wasn’t ignoring everyone: he was helping his grandmother. Although the story is short, it shows that we need more information before judging people.',
    'Conte o enredo a quem não leu e separe o que aconteceu da sua opinião. Não invente fala da avó.',
    'Novo microconto: pessoa sai de reunião olhando relógio; depois sabemos que buscaria um filho. Escreva duas interpretações e indique qual informação muda a primeira.')

add('a2', 'Organizar um encontro acessível',
    'Planejar evento com restrições; distribuir tarefas; explicar mudanças e produzir convite completo.',
    'Revisão de comparações, planos, condições, pedidos e conclusão; budget, entrance, step-free, available, confirm. Pergunte por acessibilidade; não deduza a partir de “near”.',
    'The group has 40 credits for a reading afternoon. Room A costs 30 and has a step-free entrance, but closes at five. Room B costs 20, closes at seven and has stairs; no lift is listed. Six people want to come at three. Jo has already sent invitations, but the room is not booked. Water costs 6 credits for the group. Confirm access before booking.',
    'Ana: Room A is more expensive, but it has step-free access.\nJo: We can finish at five. With water, it costs thirty-six.\nAna: Have you booked it yet?\nJo: No. I’ll call now. If it isn’t available, we’ll change the date.',
    [('Leitura: total de A mais água?', '36 créditos, dentro de40.'), ('Áudio: reserva já está feita?', 'Não; Jo vai ligar.'), ('Áudio: plano se indisponível?', 'Mudar a data.'), ('Leitura: podemos afirmar que B tem elevador?', 'Não; não está listado, precisa confirmar.')],
    [('Complete: Room A is more expensive ___ B.', 'than.'), ('Complete: If it isn’t available, we ___ change the date.', 'will.'), ('Negue conclusão: We have booked the room.', 'We haven’t booked the room yet.')],
    'Leia números trinta e trinta e seis separadamente do horário. Use confirmação oral de custo e encerramento.',
    'Acessibilidade é requisito verificável. Pergunte necessidades sem exigir declaração de deficiência ou condição pessoal.',
    'A: orçamento40 e acesso sem degrau necessário. B: recepção confirma A livre, mas só16–17h. Negociem novo início e atualizem convite.',
    'Projeto: proposta de 120 palavras, orçamento, convite e atualização oral; inclua pendência e alternativa se reserva falhar.',
    'We recommend Room A because it has step-free access. The room and water cost 36 credits. We haven’t booked it yet. We plan to start at three and finish at five. If it isn’t available, we’ll change the date and tell everyone.',
    'Informe o grupo lusófono do plano e da reserva pendente. Não trate convite enviado como confirmação da sala.',
    'Novo caso: orçamento50, sala35 disponível16–18h, água8, convite antigo15h. Atualize custo43 e horário sem manter dado antigo.')
add('b1', 'Mudanças de vida e aprendizagem',
    'Relatar trajetória; conectar experiências e mudanças; sustentar uma entrevista com perguntas de seguimento.',
    'Present perfect versus past; for/since; present perfect continuous introdutório; used to; move on, keep up with; reasons and examples. I’ve lived here since May / for six months; since marca início, for duração. I’ve been studying enfatiza atividade em curso.',
    'When I moved to a new city, I expected finding work to be the hardest part. In fact, building a routine took longer. I used to travel everywhere by bus, but now I cycle when the weather allows it. I’ve lived here for two years and I’ve been attending an evening course since March. At first I missed several classes because my shifts changed. A classmate shared notes, and we started a study group. My English is still uneven: reading feels easier than speaking. The group hasn’t solved everything, but I now ask for help before I fall behind.',
    'Interviewer: What has changed most?\nLearner: I’m more willing to ask questions. I used to stay quiet.\nInterviewer: Can you give an example?\nLearner: Last week I asked the tutor to explain a phrase again.\nInterviewer: So you understand every lesson now?\nLearner: Not every lesson. I’m still working on listening.',
    [('Leitura: qual dificuldade superou a expectativa?', 'Criar rotina foi mais difícil que o esperado; não afirma que emprego foi fácil.'), ('Áudio: que generalização é recusada?', 'Que entende todas as aulas.'), ('Áudio: qual evidência concreta é dada?', 'Pediu explicação de uma expressão na semana anterior.'), ('Leitura: o grupo resolveu tudo?', 'Não; leitura e fala continuam desiguais.')],
    [('Complete: I’ve studied here ___ March.', 'since; início.'), ('Escolha para semana passada: I asked / have asked last week.', 'I asked last week.'), ('Reescreva hábito antigo: In the past I stayed quiet.', 'I used to stay quiet.')],
    'Organize o relato em blocos BEFORE / NOW / EXAMPLE. Use pausas para separar mudança e limite; não apagar still.',
    'Competências podem evoluir de forma desigual. Um adulto com forte leitura não precisa ser tratado como iniciante em tudo.',
    'A: entrevista alguém que mudou cidade e curso. B: use história do texto e acrescente só detalhes ficcionais identificados. A faz duas perguntas de seguimento e verifica uma generalização.',
    'Escreva relato de 140–180 palavras com mudança, obstáculo, estratégia e limite; dê entrevista de 2 minutos.',
    'I used to avoid asking questions. Since joining a study group, I’ve become more confident. Last week I asked for clarification twice. This doesn’t mean every conversation is easy. I still need more time when people speak quickly, but I now have a strategy instead of giving up.',
    'Resuma para um orientador lusófono quais apoios ajudaram e quais dificuldades persistem; não afirmar fluência.',
    'Trajetória nova: trabalho remoto há um ano, curso desde maio, boa fala e escrita difícil. Relate avanços e limites, mudando o perfil de competências.')

add('b1', 'Escolhas, conselhos e consequências',
    'Discutir alternativas; oferecer conselho contextualizado; explorar situação hipotética.',
    'First/second conditional; should, could, might; unless; would rather + base; give up, work out. If I had more time, I’d join expressa hipótese; If the class opens, I’ll join expressa possibilidade prática.',
    'A local course offers two routes. The evening route meets twice a week and costs 60 credits. The weekend route costs 40 but requires four hours on Saturday. Lina works some Saturdays and cares for a relative on Tuesday evenings. She wants regular practice but cannot attend every session of either route. A friend suggests giving up until next year. Lina wonders whether recorded input and occasional live meetings could work. The provider has not confirmed any flexible arrangement. A useful recommendation must therefore distinguish an available option from an option that still needs negotiation.',
    'Friend: If I were you, I’d ask about flexible attendance.\nLina: I will, but what if they say no?\nFriend: You could choose a shorter course.\nLina: I’d rather keep a regular group.\nFriend: Then don’t pay unless they confirm the arrangement.',
    [('Leitura: alguma rota atende integralmente a agenda?', 'Não.'), ('Áudio: o amigo recomenda pagar antes de confirmar?', 'Não; unless condiciona o pagamento à confirmação.'), ('Áudio: o que Lina prefere preservar?', 'Grupo regular.'), ('Leitura: gravações já estão garantidas?', 'Não; são proposta a negociar.')],
    [('Complete: If I ___ more time, I’d attend. (have/had)', 'had; hipótese.'), ('Reescreva: Don’t pay if they don’t confirm. Use unless.', 'Don’t pay unless they confirm.'), ('Complete: I’d rather ___ a regular group. (keep/keeping)', 'keep.')],
    'Destaque IF, UNLESS e os verbos da consequência. Compare I WILL e I WOULD quando precisa esclarecer compromisso versus hipótese.',
    'Conselhos precisam considerar tempo, cuidado e renda; não classificar desistência temporária como falha moral.',
    'A: Lina, quer grupo regular. B: provedor só pode permitir uma ausência por mês. Explorem alternativas e terminem com decisão ou pendência explícita.',
    'Escreva recomendação de 150–180 palavras com duas alternativas, limites e uma pergunta que precisa ser respondida.',
    'If I were Lina, I’d ask for a flexible arrangement before paying. The weekend route is cheaper, but it conflicts with some shifts. If the provider cannot offer flexibility, a shorter course might be safer. I wouldn’t assume recordings are included.',
    'Explique à família lusófona o que está confirmado e o que depende de negociação, preservando a preferência de Lina.',
    'Novo caso: curso gratuito de manhã versus pago à noite; pessoa trabalha manhã e tem orçamento limitado. Proponha alternativas sem inventar bolsa disponível.')

add('b1', 'Notícias, fontes e versões',
    'Resumir notícia simples; atribuir declarações; distinguir fato observado de alegação.',
    'Passive present/past; reported speech introdutório; said/told; according to; however; publish, report, check, find out. Said that… não exige objeto; told us that… exige destinatário. Is being não é requisito desta unidade.',
    'The neighbourhood newsletter reported that the library would extend its opening hours in June. The announcement was shared widely, but the council later clarified that the change was only a proposal. According to the library manager, staff and funding had not been confirmed. The newsletter added a correction at the top of the article. Some readers had already arranged evening visits. The manager said the current timetable would remain in place until a final decision was published. This example shows why a headline alone may not provide enough information for a practical decision.',
    'Reporter: Did the library announce new hours?\nManager: We announced a proposal, not a confirmed timetable.\nReporter: What should readers do?\nManager: Check the current schedule. We’ll publish a decision when staffing is agreed.\nReporter: So June is not guaranteed?\nManager: Correct.',
    [('Leitura: houve decisão definitiva?', 'Não; proposta foi confundida com decisão.'), ('Áudio: o que leitores devem verificar?', 'Horário atual.'), ('Áudio: junho é garantido?', 'Não.'), ('Leitura: como veículo respondeu?', 'Adicionou correção no topo.')],
    [('Passe para passiva: They published the correction.', 'The correction was published.'), ('Complete: The manager ___ us that it was a proposal. (said/told)', 'told.'), ('Atribua a ideia com According to.', 'According to the manager, the new hours are not confirmed.')],
    'Destaque PROPOSAL e CONFIRMED; leia a correção com pausa antes do contraste para reduzir ambiguidade.',
    'Fontes e data importam. Todos os órgãos e eventos deste exercício são fictícios; não apresentar a notícia como acontecimento real.',
    'A: leitor que planejou visita. B: bibliotecário com horário antigo válido. A pergunta; B corrige sem culpar o leitor e informa próximo passo.',
    'Escreva resumo de 150–180 palavras com atribuição e correção; deixe aviso oral de um minuto para visitantes.',
    'The newsletter reported longer opening hours, but the library manager clarified that this was a proposal. Staffing has not been confirmed. Readers should use the current timetable until a final decision is published. The article now includes a correction.',
    'Explique em português a mudança de entendimento e o que o público pode fazer agora; não converter proposta em promessa.',
    'Nova notícia: festival anunciado para agosto, local ainda sem contrato. Escreva atualização que preserve data proposta e pendência.')

add('b1', 'Problemas, serviços e acordos',
    'Explicar problema com sequência; formular reclamação objetiva; negociar solução viável.',
    'Past perfect como anterioridade; present perfect para problema atual; polite requests; either/or; refund, replacement, receipt, sort out. When I arrived, they had closed: fechamento ocorreu antes da chegada.',
    'I booked a study room for six people and paid in advance. When we arrived, another group had already occupied it. The receptionist offered a smaller room, but it had only three chairs. We waited for twenty minutes and missed part of our workshop. I am asking for either a replacement booking at no extra cost or a refund for the unused time. I have attached the receipt and the original confirmation. I understand that mistakes happen; I would like a clear response by Friday so that we can plan our next meeting.',
    'Staff: We can offer a smaller room tomorrow.\nCustomer: Thank you, but we still need space for six.\nStaff: A larger room is available on Friday.\nCustomer: Is there an extra charge?\nStaff: No.\nCustomer: Please confirm the time and capacity in writing.',
    [('Leitura: qual problema antecedeu a chegada?', 'Outro grupo já ocupava a sala.'), ('Áudio: por que a primeira solução falha?', 'Continua sem espaço para seis.'), ('Áudio: há custo extra na sexta?', 'Não.'), ('Leitura: quais provas foram anexadas?', 'Recibo e confirmação original.')],
    [('Complete: They ___ already occupied the room when we arrived.', 'had.'), ('Formule pedido escrito de confirmação.', 'Could you confirm the time and capacity in writing?'), ('Dê duas alternativas com either/or.', 'Either a replacement booking or a refund.')],
    'Faça a reclamação por blocos FACT / IMPACT / REQUEST. Voz firme não requer elevar volume; destaque SIX para esclarecer a restrição.',
    'Exercício de linguagem, não garantia de direito a reembolso. A solução deve decorrer do acordo simulado, não de legislação presumida.',
    'A: cliente precisa seis lugares e não pode amanhã. B: só Friday14–16h para seis sem custo. Negociem e produzam confirmação.',
    'Escreva reclamação de 160–190 palavras com fatos, impacto, pedido e prazo; negocie e registre resultado.',
    'When we arrived, another group had taken our room. The alternative was too small for six people. We lost twenty minutes. Could you offer a replacement booking at no extra cost? Friday would work for us. Please confirm the room capacity and time.',
    'Explique o acordo em português a um integrante ausente; se hora não foi confirmada, indique a pendência.',
    'Novo problema: entrega veio com dois livros em vez de três; comprovante lista três. Solicite item faltante ou devolução proporcional sem inventar resposta da loja.')

add('b1', 'Estudar ideias e tomar notas',
    'Identificar ideia central e exemplos; tomar notas; explicar conceito simples a outro público.',
    'Defining relatives; gerund as subject; infinitive of purpose; signposting first/for example/in other words; point out, look up. Taking notes helps… usa atividade como sujeito. In other words anuncia reformulação, não nova evidência.',
    'A useful study note is not always a shorter copy of a paragraph. It can show a relationship. For example, after reading an explanation of bus delays, a learner might write “roadworks → slower traffic → late buses”. Another learner may prefer a sentence. The format matters less than whether the note preserves the meaning and can be understood later. Copying every word may leave little time to think. However, short notes can also become misleading when they remove words such as “sometimes” or “may”. A good check is to explain the idea without looking at the original, then compare the explanation with it.',
    'Tutor: Three steps today: find the main point, select an example, then check the connection.\nStudent: Should we copy the example?\nTutor: You can shorten it. Keep any word that limits the claim.\nStudent: Such as sometimes?\nTutor: Exactly. “Sometimes” is not the same as “always”.',
    [('Leitura: formato único é obrigatório?', 'Não; setas ou frases podem funcionar.'), ('Áudio: quais três passos?', 'Ideia principal, exemplo, conferir ligação.'), ('Áudio: que palavra limita afirmação?', 'Sometimes.'), ('Leitura: que risco há em notas curtas?', 'Eliminar condições ou limites e mudar sentido.')],
    [('Transforme: It helps to take notes. Comece com Taking.', 'Taking notes helps.'), ('Una: A note preserves meaning. It is useful. Use that.', 'A note that preserves meaning is useful.'), ('Reformule may cause delays sem tornar certo.', 'It can sometimes lead to delays / delays are possible. Não “always causes”.')],
    'Pause depois de FIRST, FOR EXAMPLE e HOWEVER. Escute os limites may e sometimes, que podem receber menos destaque acústico.',
    'Notas podem usar português, inglês e desenhos. Avalie fidelidade e utilidade, não aparência acadêmica.',
    'A: explica método do texto em60s. B: toma notas sem texto; restitui explicação. A confere se sometimes ou may foi perdido.',
    'Produza notas e explicação de 150–180 palavras para um colega que começa a estudar; inclua um exemplo novo.',
    'Useful notes show relationships. For example, you can connect roadworks with slower traffic. But short notes must keep limits such as “may”. To check your notes, explain the idea and compare it with the original. A drawing can work as well as a sentence.',
    'Ensine em português o procedimento a alguém que prefere desenhos; preserve liberdade de formato e necessidade de verificar sentido.',
    'Texto novo: “Heavy rain may delay buses, but the train usually runs on time.” Faça nota e explique sem afirmar que todo transporte para.')

add('b1', 'Conversa, desacordo e convivência',
    'Expressar opinião com exemplos; discordar sem encerrar conversa; pedir esclarecimento e resumir acordo.',
    'Hedging I think/it seems; question tags para confirmar; so/neither introdutórios; although/unless; get along, bring up. You prefer mornings, don’t you? pede confirmação; use pergunta direta se a tag dificultar compreensão.',
    'The reading group is deciding whether phones should be put away during meetings. One member says notifications interrupt the discussion. Another uses a phone to enlarge text and take notes. A third needs to receive urgent messages from home. A complete ban might solve one problem but create others. The group could agree on silent mode, explain when a phone is needed, and take a short break for messages. This would not remove every interruption, but it might make expectations clearer. Before voting, members should check whether they have understood one another’s reasons.',
    'Ana: I think phones should stay in bags.\nJo: I see your point, but I use mine to read enlarged text.\nAna: I hadn’t thought of that. Would silent mode help?\nJo: Yes. And we could agree on a message break.\nAna: So we want fewer interruptions, not a complete ban?',
    [('Leitura: quais duas funções do telefone além de notificações?', 'Ampliar texto/tomar notas e receber urgências domésticas.'), ('Áudio: Ana reconsidera?', 'Sim, reconhece necessidade que não havia considerado.'), ('Áudio: qual objetivo comum?', 'Menos interrupções.'), ('Leitura: a solução garante zero interrupções?', 'Não; texto limita a promessa.')],
    [('Complete: You prefer mornings, ___ you?', 'don’t.'), ('Faça discordância com reconhecimento.', 'I see your point, but… seguido de razão pertinente.'), ('Reformule proibição total como proposta condicional.', 'We could use silent mode unless someone needs an urgent call. Variações negociáveis aceitas.')],
    'Experimente a diferença entre I SEE your point e I see YOUR point. Pergunte ao parceiro qual intenção percebeu; não atribua tom universal.',
    'Tecnologia pode ser recurso de acessibilidade. Não deduzir desinteresse de um comportamento sem perguntar.',
    'A: notificações atrapalham. B: usa ampliador no celular. C opcional: facilita acordo. Em dupla, façam terceiro papel por escrito. Registrem exceções.',
    'Escreva proposta de convivência de 160–190 palavras e faça conversa de3 minutos com uma discordância, esclarecimento e síntese.',
    'We agree that interruptions are a problem. However, some members need phones to read or receive urgent messages. We suggest silent mode and a short message break. Members can explain what they need without sharing private details.',
    'Resuma para pessoa ausente os dois interesses e a proposta; não diga que todos aprovaram se ainda estão discutindo.',
    'Novo conflito: câmera obrigatória em grupo online; pessoa tem conexão instável. Negocie participação e registre exceção sem atribuir má vontade.')

add('b1', 'Narrativa e interpretação',
    'Acompanhar narrativa conectada; inferir motivos com apoio; escrever comentário distinguindo texto e interpretação.',
    'Past narrative sequence; past perfect; reported thought; might have como extensão receptiva; descriptive adjectives; turn out, come across. Use perhaps para hipótese quando a estrutura modal ainda não estiver disponível.',
    'When Mara returned the borrowed suitcase, she left a note in its pocket: “Thank you for the journey.” Her neighbour had lent it to her for a job interview in another city. Weeks later, he found the note and assumed she had got the job. He knocked on her door to congratulate her. Mara laughed, then hesitated. She hadn’t got it. But during the trip she had visited an old friend and decided to study again. “It wasn’t that kind of journey,” she said. The neighbour folded the note and put it back. The suitcase remained by the door, ready for someone else.',
    'Reader A: I thought the note meant success at the interview.\nReader B: So did I. But the journey changed her plans in another way.\nReader A: Is the ending sad?\nReader B: Perhaps partly. Yet the suitcase is ready for someone else. That sounds hopeful to me.',
    [('Leitura: Mara conseguiu o emprego?', 'Não.'), ('Áudio: leitores tinham mesma primeira interpretação?', 'Sim.'), ('Áudio: esperança é fato explícito ou interpretação?', 'Interpretação apoiada na mala pronta para outra pessoa.'), ('Leitura: o que Mara decidiu?', 'Voltar a estudar após visitar uma amiga ou amigo antigo; texto não dá gênero de friend.')],
    [('Complete: She ___ not got the job when he congratulated her.', 'had.'), ('Marque hipótese: The suitcase represents hope.', 'Perhaps the suitcase represents hope / I think…; não apresentar como única leitura.'), ('Relate a fala “I thought it meant success”.', 'The reader said they thought it meant success.')],
    'Leia hesitação com pausa antes de She hadn’t got it. Compare tom final aberto e fechado sem impor interpretação emocional única.',
    'Texto original. Não reduzir uma trajetória adulta a emprego obtido; sustente leituras diferentes com palavras do texto.',
    'A: interpreta final como esperança. B: como incerteza. Cada um cita dois detalhes e pergunta sobre um detalhe do outro.',
    'Escreva comentário de 170–210 palavras com resumo, interpretação, duas evidências e reconhecimento de outra leitura.',
    'The note first suggests that Mara got the job, but the story changes that expectation. I read the ending as hopeful because she plans to study and the suitcase is ready for another journey. However, we do not know whether her new plan will succeed.',
    'Apresente a história em português a um clube de leitura, separando enredo e interpretação; mantenha a ambiguidade do fim.',
    'Mude o destinatário para um adolescente e explique o mal-entendido sem simplificar para “tudo deu certo”.')

add('b1', 'Propor uma melhoria local',
    'Integrar fontes simples; justificar proposta; responder perguntas e registrar limites do projeto.',
    'Revisão: modals, conditionals, passives, relative clauses; proposal, survey, volunteer, deadline, carry out. Some respondents não equivale a toda comunidade.',
    'A fictional survey of 30 library users found that 18 wanted a quiet study hour and 12 preferred a conversation group. The survey was completed on a weekday morning, so evening users may be missing. The library can provide one room on Fridays from four to six. Two volunteers are available. The manager asks for a four-week pilot that does not require new equipment. A group proposes quiet study from four to five, followed by conversation. This uses the available room but assumes users can attend both parts. The proposal should explain how feedback will be collected and what would lead to a change.',
    'Manager: Why split the time?\nPresenter: It responds to both interests in the survey.\nManager: Does the survey represent everyone?\nPresenter: No. We should also ask evening users.\nManager: What if nobody joins the conversation hour?\nPresenter: We’ll review attendance and ask why before changing it.',
    [('Leitura: qual limitação da amostra?', 'Só usuários presentes numa manhã de dia útil.'), ('Áudio: apresentador afirma representatividade total?', 'Não.'), ('Áudio: ausência leva a mudança automática?', 'Não; investigar motivo antes.'), ('Leitura: duração do piloto?', 'Quatro semanas.')],
    [('Reescreva passivamente: Volunteers will collect feedback.', 'Feedback will be collected by volunteers.'), ('Complete condição: If attendance is low, we ___ ask why.', 'will.'), ('Limite a afirmação “Everyone wants quiet study”.', 'Eighteen of the thirty respondents wanted quiet study; não todos.')],
    'Leia números e denominadores: EIGHTEEN out of THIRTY. Faça pausa entre resultado e limitação.',
    'Dados inteiramente fictícios para aprendizagem. Consulta limitada não autoriza falar por toda uma comunidade.',
    'A: apresenta piloto. B: gerente questiona acesso dos usuários noturnos e falta de equipamento. Responda com limites e ação concreta.',
    'Projeto: proposta de 200–240 palavras, fala de3 minutos, perguntas e resumo para público lusófono; inclua critério de revisão.',
    'We propose a four-week pilot on Fridays. Quiet study will run from four to five, followed by conversation. The survey suggests demand for both, but it excluded many evening users. We will record attendance and collect brief feedback before deciding whether to continue.',
    'Explique números, limitação e proposta ao grupo lusófono sem converter intenção em resultado comprovado.',
    'Nova consulta:20 respostas,12 querem conversa,8 escrita; sala só18–19h. Proponha alternância de semanas e reconheça quem não foi consultado.')
add('b2', 'Argumentos e qualidade da evidência',
    'Avaliar argumento; distinguir associação de explicação causal; defender posição com ressalvas.',
    'Hedging may/tends to/is likely to; contrast whereas/while; nominalisation básica; evidence, claim, sample, outcome; back up. A rise coincided with… descreve simultaneidade, não prova que uma coisa causou outra.',
    'A fictional college introduced a quiet study room in September. Its report says that average test scores rose from 62 to 68 over the term. The report attributes the increase to the new room and recommends opening three more. However, the same term also included a new tutoring programme and a change in assessment format. Students who used the room volunteered to do so, and the report does not compare their previous scores with those of other students. The room may have been useful, but the available figures do not isolate its effect. A reasonable next step could combine user feedback with a clearer comparison over time. Rejecting the causal claim does not require rejecting the room itself: usefulness, accessibility and cost can be considered separately.',
    'Chair: Are you saying the room had no effect?\nAnalyst: No. I’m saying the report cannot tell us how much of the increase it explains.\nChair: What evidence would help?\nAnalyst: Comparable groups and information about the tutoring programme. We should also ask who could not use the room.\nChair: Can we keep it open meanwhile?\nAnalyst: That is a practical decision, provided we describe the uncertainty honestly.',
    [('Leitura: quais mudanças concorrentes ocorreram?', 'Novo programa de tutoria e mudança no formato de avaliação.'), ('Áudio: analista afirma efeito zero?', 'Não; diz que o efeito não foi isolado.'), ('Áudio: que grupo invisível deve ser ouvido?', 'Pessoas que não puderam usar a sala.'), ('Leitura: manter sala exige aceitar causalidade?', 'Não; decisão prática e conclusão causal são distintas.')],
    [('Atenue “The room caused the increase”.', 'The room may have contributed to the increase.'), ('Una com whereas: Scores improved. Causation remains uncertain.', 'Scores improved, whereas the cause of the improvement remains uncertain.'), ('Reescreva “students participated voluntarily” como grupo nominal.', 'Voluntary student participation; mantenha o agente no contexto para não ocultá-lo.')],
    'Destaque MAY HAVE CONTRIBUTED em vez de destacar só increase. Grave uma ressalva e verifique se continua audível em velocidade natural.',
    'Números aqui são inventados. Leitura crítica exige discutir a força da evidência sem atacar a inteligência de quem escreveu.',
    'A: diretor quer expansão. B: analista aceita manter piloto, mas pede comparação e acesso. Negociem uma recomendação com duas condições verificáveis.',
    'Escreva parecer de 220–260 palavras com tese, duas limitações e ação proporcional; responda a objeção em3 minutos.',
    'The score increase is encouraging, but it cannot be attributed solely to the room. Tutoring and assessment also changed. I recommend maintaining the pilot while collecting comparable evidence and feedback from students who could not attend. Expansion should depend on usefulness, access and cost, not on an unsupported causal claim.',
    'Explique a gestores lusófonos por que não provar causalidade não significa provar inutilidade; preserve os números62 e68.',
    'Novo caso: faltas caíram após aplicativo e mudança no transporte. Escreva conclusão cautelosa e proponha informação adicional, sem atribuir tudo ao aplicativo.')

add('b2', 'Projetos, prazos e negociação',
    'Negociar escopo e prazo; antecipar consequências; produzir acordo com responsabilidades explícitas.',
    'Future continuous/perfect; unless/provided that; modal obligation; trade-off, deliverable, scope, hand over. By Friday we’ll have reviewed… focaliza conclusão até prazo; on Friday we’ll be reviewing… atividade em curso.',
    'The team has promised a guide by Friday. The draft is complete, but only two of its five sections have been checked. A partner now asks for a translated version and an extra case study. Producing both would leave no time for review. The editor proposes delivering the checked core guide on Friday and the additional material the following Wednesday. The partner argues that the event is on Monday, so Wednesday is too late. A third option is a short bilingual summary for Monday, with the full translation later. This option still needs a reviewer and a clear statement that the summary does not replace the full guide. Any agreement should record who approves each item and which version the audience receives.',
    'Partner: Could you include the full translation by Monday?\nEditor: Only if we reduce the scope or add a qualified reviewer.\nPartner: We can provide a reviewer tomorrow.\nEditor: Then we can confirm the summary after checking their availability.\nPartner: So the full translation is guaranteed?\nEditor: No, the summary is the proposal. The full version needs a separate deadline.',
    [('Leitura: qual conflito central?', 'Novo escopo versus tempo de revisão e evento segunda.'), ('Áudio: tradução integral é garantida?', 'Não.'), ('Áudio: disponibilidade do revisor está verificada?', 'Ainda precisa ser conferida.'), ('Leitura: quantas seções foram checadas?', 'Duas de cinco.')],
    [('Complete: By Friday, we ___ have reviewed the core guide.', 'will.'), ('Distingua reviewing de have reviewed no prazo.', 'Atividade em curso versus conclusão até o momento.'), ('Condicione entrega à aprovação usando provided that.', 'We can deliver the summary provided that the reviewer approves it.')],
    'Enfatize SUMMARY versus FULL VERSION e preserve condicionais. Peça ao interlocutor que restitua o acordo para detectar promessa entendida errado.',
    'Recusar escopo adicional pode proteger qualidade. Cortesia não deve apagar restrições nem criar compromisso inexistente.',
    'A: editor só tem capacidade para resumo até segunda. B: parceiro pede versão integral. Negociem opção limitada com dono, prazo e aprovação.',
    'Escreva ata de acordo de 220–260 palavras com entregas, exclusões, responsáveis e condições; simule negociação de4 minutos.',
    'The team will deliver the reviewed core guide on Friday. A bilingual summary is proposed for Monday, subject to reviewer availability and approval. The full translation is outside this deadline. The partner will confirm the reviewer tomorrow; the editor will then confirm the summary schedule.',
    'Explique o acordo ao time lusófono e destaque o que continua condicionado. Não traduzir can como will automaticamente.',
    'Novo projeto: três vídeos pedidos, capacidade para um com legendas; evento quinta. Negocie uma entrega e diferencie proposta de compromisso confirmado.')

add('b2', 'Decisões passadas e alternativas',
    'Analisar resultado passado; especular com cautela; distinguir arrependimento de certeza retrospectiva.',
    'Third/mixed conditionals; should/could/might have; wish + past perfect; look back, rule out. If we had checked, we might have noticed mantém possibilidade; would have avoided é afirmação mais forte.',
    'A community event attracted fewer people than expected. The organisers had advertised only through social media, although several regular participants rarely used it. Rain also disrupted buses that evening. Looking back, the team believes printed notices could have helped, but it cannot know how many extra people would have attended. Some members blame the weather entirely; others blame the communication plan. Both explanations are too simple. The team can identify decisions under its control without claiming control over every outcome. For the next event, it plans to ask how people heard about it and offer an alternative date if travel is severely affected.',
    'Organiser: We should have used printed notices.\nColleague: Probably, but would that have solved everything?\nOrganiser: No. The buses were disrupted too.\nColleague: If we had collected contact preferences earlier, we’d know more now.\nOrganiser: Let’s add that to registration, with permission.',
    [('Leitura: quais dois fatores são discutidos?', 'Canal de divulgação e chuva/transporte.'), ('Áudio: avisos resolveriam tudo?', 'Não é afirmado; resposta reconhece transporte.'), ('Áudio: que informação passada ajudaria agora?', 'Preferências de contato coletadas antes.'), ('Leitura: podem saber quantos extras viriam?', 'Não.')],
    [('Complete: If we had checked, we might ___ noticed.', 'have.'), ('Expresse arrependimento sobre avisos.', 'We should have used printed notices / I wish we had used them.'), ('Torne “would have solved everything” cauteloso.', 'might have helped / could have improved attendance; não garantir solução total.')],
    'Diferencie SHOULD HAVE de WOULD HAVE e MIGHT HAVE com exemplos contextualizados; preserve força modal ao ouvir formas reduzidas.',
    'Analisar decisões não exige culpar uma pessoa. Dados de contato só devem ser usados conforme consentimento no cenário.',
    'A: atribui resultado à divulgação. B: traz transporte como fator. Construam retrospectiva com ação controlável e incerteza restante.',
    'Escreva retrospectiva de 220–270 palavras, incluindo hipótese alternativa, responsabilidade e plano de coleta de evidências.',
    'Printed notices might have reached people who do not use social media. However, they would not have prevented transport disruption. We should have collected contact preferences earlier. Next time, we will use more than one channel and ask participants how they heard about the event.',
    'Explique aos voluntários lusófonos a diferença entre o que poderia ajudar e o que teria garantido sucesso; não inventar efeito medido.',
    'Novo resultado: curso perdeu alunos após mudança de horário e aumento de preço. Redija retrospectiva que não escolha causa única sem dados.')

add('b2', 'Informação técnica para pessoas',
    'Explicar processo; adaptar registro; esclarecer responsabilidade e limites de um serviço.',
    'Passive reporting; relative/reduced relative clauses; complex noun phrases; plain-language reformulation; opt out, sign up. Applications submitted after Friday… reduz applications that are submitted…; reponha oração se clareza exigir.',
    'Service notice: “Applications submitted after Friday will be considered in the subsequent allocation cycle. Submission does not constitute confirmation of a place. Applicants requiring an accessible format may contact the support team.” A plain-language version could say: “If you apply after Friday, we will review your application in the next round. Applying does not guarantee a place. Contact support if you need the information in another format.” The second version makes the organisation visible through “we”, but it still needs to tell readers when the next round starts. Simplification should preserve the difference between receiving an application and accepting it. It should also avoid inventing a deadline absent from the original.',
    'Applicant: I submitted the form. Does that mean I have a place?\nSupport: Not yet. We have received it, but it still needs review.\nApplicant: When will I hear?\nSupport: The next review date has not been announced. We can notify you when it is.\nApplicant: Please send an accessible text version.',
    [('Leitura: inscrição garante vaga?', 'Não.'), ('Áudio: próxima data foi anunciada?', 'Não.'), ('Áudio: qual formato é solicitado?', 'Versão de texto acessível; não há formato técnico específico definido.'), ('Leitura: que risco há ao simplificar?', 'Inventar prazo ou converter recebimento em aprovação.')],
    [('Expanda Applications submitted after Friday.', 'Applications that are submitted after Friday.'), ('Reescreva Submission does not constitute confirmation.', 'Applying does not guarantee a place.'), ('Torne agente explícito em Your form will be reviewed.', 'Our support team will review your form, se esse agente foi confirmado; caso contrário perguntar quem revisa.')],
    'Divida sintagmas longos em unidades de sentido. Compare receIVED e apPROVED para tornar os dois estados distintos.',
    'Linguagem simples não é fala infantil. Acessibilidade inclui clareza de ação, prazo e limites, sem supor necessidades individuais.',
    'A: acha que já foi aceito. B: suporte confirma recebimento e data desconhecida. Resolva mal-entendido sem dar falsa garantia.',
    'Redija aviso público de 180–230 palavras e nota editorial explicando três mudanças de clareza sem perda de precisão.',
    'We have received your application. This does not mean that a place has been confirmed. Applications received after Friday will be reviewed in the next round. The date has not yet been announced. Contact support if you need another format.',
    'Explique em português os estados recebido/em análise/aprovado e indique que apenas o primeiro está confirmado.',
    'Novo aviso: “Registration is provisional pending payment verification.” Reescreva com clareza sem prometer aprovação imediata nem inventar prazo.')

add('b2', 'Mídia, dados e persuasão',
    'Interpretar comparação quantitativa; reconhecer enquadramento; sintetizar duas perspectivas.',
    'Proportions, approximations; fewer/less; whereas; claims attributed with reporting verbs; bring about, point to. Percentage points ≠ percent change. “Suggests” não tem força de “proves”.',
    'Two fictional headlines describe the same survey. Headline A says, “Support for evening classes rises by half.” Headline B says, “Only 30 percent support evening classes.” Last year, 20 of 100 respondents supported the idea; this year, 30 of 100 did. The rise is ten percentage points and a 50 percent increase relative to the previous share. Both headlines select a valid calculation, but each encourages a different impression. The surveys did not necessarily include the same people, and no information is provided about recruitment. A careful summary should report the underlying figures, identify the missing context and avoid assuming that the change represents the whole town.',
    'Editor: Which headline is false?\nAnalyst: Neither calculation is necessarily false. The framing is selective.\nEditor: What would you publish?\nAnalyst: “Support rose from 20 to 30 percent among respondents.” Then I’d explain how they were recruited—if we can find out.\nEditor: Can we say public opinion has shifted?\nAnalyst: Only with a clear limitation about the sample.',
    [('Leitura: diferença em pontos percentuais?', '10 pontos.'), ('Áudio: as manchetes são matematicamente falsas?', 'Não necessariamente; enquadramento seletivo.'), ('Áudio: que informação de método falta?', 'Como participantes foram recrutados.'), ('Leitura: aumento relativo?', '50%, porque10/20=0,5; não50 pontos.')],
    [('Complete: Support rose ___20 ___30 percent.', 'from; to.'), ('Substitua proves por verbo proporcional à evidência.', 'suggests / indicates, com ressalva sobre amostra.'), ('Distinga fewer respondents e less support.', 'fewer com pessoas contáveis; less com quantidade abstrata de apoio.')],
    'Leia porcentagem e pontos percentuais por extenso. Faça pausas entre base anterior, base atual e interpretação.',
    'Dados fictícios. Discordar do enquadramento não autoriza acusar intenção de enganar sem evidência.',
    'A: editor prefere manchete forte. B: analista exige números-base e limitação. Negociem título legível e subtítulo preciso.',
    'Escreva análise de 240–280 palavras comparando manchetes, cálculos e limites; apresente versão para público geral.',
    'Support increased from 20 to 30 percent among respondents: ten percentage points, or a 50 percent relative increase. The headlines emphasise different aspects of this change. Without recruitment details, we should not assume that either survey represents the entire town.',
    'Explique em português com exemplo numérico a diferença entre dez pontos e cinquenta por cento, sem traduzir os dois como dez por cento.',
    'Novo conjunto:40 de100 para50 de100. Calcule10 pontos e25% de aumento relativo, depois produza manchete e ressalva.')

add('b2', 'Registro, identidade e pragmática',
    'Adaptar pedido a relação e situação; interpretar intenção sem universalizar; reparar mal-entendido.',
    'Indirect questions; modal distancing; register; clefts introdutórias; could you tell me whether; What I need is…; get back to. Could you tell me when it starts? mantém ordem afirmativa na pergunta interna.',
    'A colleague writes, “Send me the file today.” In a close team with an agreed deadline, the message may be read as efficient. In a new partnership, it may sound abrupt, especially if no deadline has been discussed. Adding “Could you send me the file by four? We need it for the meeting” provides both a request and a reason. Yet politeness is not achieved simply by making every sentence longer. An urgent safety instruction may need to be direct. Interpreting tone therefore requires attention to relationship, previous agreements and purpose. If the meaning is uncertain, asking about the deadline may be more productive than guessing the writer’s attitude.',
    'Colleague: I read your message as an order.\nWriter: Thanks for telling me. I meant to check whether four was possible.\nColleague: I can send a draft by four, not the final version.\nWriter: That works. What I need for the meeting is a draft. I’ll make that clearer.',
    [('Leitura: mensagem direta é sempre rude?', 'Não; depende de relação, acordo e propósito.'), ('Áudio: qual entrega é possível?', 'Rascunho até quatro.'), ('Áudio: o que o autor realmente precisa?', 'Rascunho para reunião.'), ('Leitura: qual alternativa a adivinhar atitude?', 'Perguntar sobre prazo ou intenção.')],
    [('Corrija: Could you tell me when does it start?', 'Could you tell me when it starts?'), ('Destaque necessidade com What I need…', 'What I need is a draft.'), ('Reformule Send it today para parceiro novo com razão.', 'Could you send a draft today? We need it for the meeting. Variantes com prazo explícito aceitas.')],
    'Compare entonações de Could you… em contexto. Peça interpretação ao parceiro e evite regra fixa de que subida sempre significa gentileza.',
    'Não atribuir estilo de comunicação a todos os membros de uma nacionalidade. Relação e contexto importam.',
    'A: entendeu cobrança como ordem de entrega final. B: precisava rascunho. Façam reparo, confirmem limite e reescrevam mensagem.',
    'Produza duas versões de um pedido, para colega próximo e parceiro novo, mais comentário de120 palavras sobre escolhas; simule reparo.',
    'Could you send a draft by four? We need it for an internal discussion, so it does not need to be final. Please let me know if that timing is difficult. / Quick check: can you send the draft by four for our meeting?',
    'Explique o mal-entendido a um colega lusófono sem rotular o escritor como grosseiro; preserve diferença entre intenção e leitura.',
    'Novo caso: “We should talk” foi entendido como problema grave, mas era convite para planejar evento. Esclareça sem invalidar a reação do destinatário.')

add('b2', 'Leitura crítica e voz autoral',
    'Analisar escolhas narrativas; sustentar interpretação; escrever resenha para público definido.',
    'Participle clauses; cohesion lexical; emphatic do; evaluative vocabulary; narrator/reliability; leave out, draw on. Having read the note, Mara… exige que Mara seja quem leu; evitar sujeito pendurado.',
    'Every morning, the caretaker unlocked a room nobody seemed to use. At least, that was how the new manager described it. The attendance sheet was blank, the chairs were uneven, and the clock had stopped. On Friday, she arrived early and found three neighbours sitting quietly together. One was repairing a coat; another was reading a letter aloud. “There is no scheduled activity,” she said. The caretaker nodded. “That’s why they come.” In her report, she wrote that the room lacked measurable outcomes. Then she crossed out “lacked” and wrote “had not yet been assessed for”. The change made the sentence longer. She left it there.',
    'Reader A: The ending criticises all measurement.\nReader B: I’m not sure. The manager changes the wording, not the idea of assessment.\nReader A: But the blank sheet matters.\nReader B: Yes, it shows that the existing measure misses something. That is narrower than saying every measure is useless.',
    [('Leitura: quem chama sala de não utilizada?', 'Gerente, inicialmente; narrador sinaliza essa perspectiva.'), ('Áudio: qual interpretação B considera excessiva?', 'Crítica a toda medição.'), ('Áudio: qual leitura mais restrita?', 'Medida existente não captura certa atividade.'), ('Leitura: que mudança de frase importa?', 'Ausência de resultados vira ausência de avaliação adequada; altera certeza e foco.')],
    [('Una com particípio: She read the report. She revised it.', 'Having read the report, she revised it.'), ('Dê ênfase a “The room has a purpose” com do.', 'The room does have a purpose.'), ('Limite “The author hates measurement”.', 'The story questions this particular measure; intenção autoral não é demonstrada.')],
    'Leia “That’s why they come” com duas ênfases e discuta implicação. Apoie interpretação no contexto, não só no tom escolhido.',
    'Texto original; identifique a diferença entre narrador, personagem e autor. Não exigir experiência acadêmica para interpretação.',
    'A: vê crítica institucional. B: vê mudança pessoal da gerente. Citem dois detalhes, considerem contraexemplo e tentem síntese.',
    'Escreva resenha de250–300 palavras com interpretação, evidências e leitura alternativa; prepare recomendação oral de2 minutos.',
    'The story questions what becomes visible through a particular form of measurement. The room appears unused only until the manager visits it. Her revision suggests a more cautious claim, rather than a rejection of assessment itself. The quiet ending leaves open whether institutional practice will change.',
    'Apresente a discussão a um clube lusófono preservando as duas leituras e o detalhe da alteração no relatório.',
    'Reescreva o último parágrafo pela voz do caretaker e explique como a mudança de narrador afeta o que o leitor pode saber.')

add('b2', 'Uma proposta defendida em público',
    'Sintetizar restrições e evidências; defender proposta; responder objeções e registrar decisão.',
    'Concession, conditional commitments, reported decisions; executive summary; put forward, follow up; agenda, feasible, pilot. Even if permite considerar cenário adverso sem prometer eliminá-lo.',
    'A fictional centre can fund one six-week pilot with 300 credits. Option A is a reading group: estimated cost180, capacity12, accessible room available. Option B is a recording workshop: estimated cost280, capacity6, equipment borrowed but not yet confirmed. A survey of24 current members found14 interested in reading and10 in recording. Newcomers were not consulted. Two volunteers can support either activity, but neither has experience editing audio. The committee wants a recommendation that considers access, demand and delivery risk. A larger vote alone does not settle the question: the workshop may serve a group currently excluded from other activities. The proposal should say what information is missing and how the pilot will be evaluated.',
    'Committee: Why not fund the cheaper option immediately?\nPresenter: Cost matters, but so does who benefits. I recommend the reading pilot now while confirming equipment and training for a later workshop.\nCommittee: Is that a promise to run both?\nPresenter: No. A later workshop would need a separate decision and budget.',
    [('Leitura: que recurso de B está incerto?', 'Equipamento emprestado.'), ('Áudio: ambos estão aprovados?', 'Não.'), ('Áudio: recomendação atual?', 'Leitura agora, verificar condições futuras de workshop.'), ('Leitura: amostra inclui novatos?', 'Não.')],
    [('Conceda benefício de B antes de recomendar A.', 'Although B may reach a different group, A is currently easier to deliver.'), ('Condicione workshop a recurso confirmado.', 'We could run it provided that equipment and training are confirmed.'), ('Relate decisão de financiar apenas A.', 'The committee decided to fund A only; não acrescentar B.')],
    'Sinalize RECOMMENDATION / REASON / LIMIT / NEXT STEP. Em perguntas, pause antes de responder para não perder condição essencial.',
    'Mais votos não tornam necessidades minoritárias irrelevantes. Avaliação linguística não depende da opção escolhida, desde que argumentada.',
    'A: apresentador. B: comissão defende B por inclusão. Negociem opção ou adiamento com critério, responsáveis e orçamento.',
    'Projeto: proposta de300–350 palavras, apresentação4 minutos, perguntas2 minutos e ata. Compare duas opções e explicite o que não foi decidido.',
    'I recommend a six-week reading pilot within the available budget. It has lower delivery risk, but the survey excludes newcomers. We should collect their views and investigate equipment and training for a possible recording workshop. This is not a commitment to fund a second programme.',
    'Faça briefing em português para ausentes com custos, limites da consulta e decisão real; separar cenário futuro de aprovação.',
    'Novo caso: orçamento250, leitura180, oficina280. Defenda opção viável ou redução negociada de escopo sem declarar custo280 dentro do orçamento.')
add('c1', 'Síntese, atribuição e incerteza',
    'Integrar fontes com tensões; formular síntese qualificada; distinguir convergência de contradição aparente.',
    'Epistemic modality; reporting verbs argues/concedes/cautions; dense noun phrases; concessive framing; boil down to. Concedes sugere reconhecimento de ponto desfavorável; não o usar para simples declaração neutra.',
    'Source A, programme report: “Attendance doubled after we moved sessions online. This indicates that the new format widened access.” Source B, participant interview: “I could join because I no longer needed to travel. But my neighbour stopped coming because she could not use the platform.” Source C, administrator note: “The old register counted people present at the start; the online register counts any login, including repeated attempts. We have not reconciled the records.” These accounts need not cancel one another out. A participant’s improved access is compatible with another person’s exclusion, while the measurement change weakens a direct numerical comparison. A synthesis should therefore resist a single verdict that flattens the evidence. The report’s claim may be plausible for some participants, but its overall magnitude remains uncertain. Before recommending permanent replacement of the in-person format, the committee needs comparable attendance data and evidence from people who stopped participating. Keeping both formats is another possibility, although it brings staffing and scheduling costs that the three sources do not quantify.',
    'Chair: Can we boil this down to success or failure?\nAnalyst: That would conceal two different questions: who gained access, and whether total participation increased.\nChair: But the interview confirms improvement.\nAnalyst: It confirms one person’s experience. It also reports a neighbour’s difficulty, which we should investigate rather than treat as a complete account.\nChair: So what can we responsibly say today?\nAnalyst: There is evidence of benefit for at least one participant, but the aggregate comparison is not yet reliable.',
    [('Leitura: qual diferença de medição impede comparação direta?', 'Presença no início versus qualquer login, incluindo tentativas repetidas.'), ('Áudio: qual extrapolação é recusada?', 'Experiência individual provar sucesso agregado.'), ('Áudio: relato sobre vizinha é evidência direta dela?', 'Não; é relato de segunda mão a investigar.'), ('Leitura: as fontes são necessariamente contraditórias?', 'Não; tratam grupos e métricas diferentes.')],
    [('Substitua “The interview proves wider access for everyone”.', 'The interview illustrates improved access for one participant; it does not establish a general effect.'), ('Una benefício e exclusão com concessão.', 'While the format reduced travel barriers for some, it may have created digital barriers for others.'), ('Escolha reporting verb para nota técnica neutra: concedes/states.', 'states; concedes adicionaria postura não demonstrada.')],
    'Marque a extensão da ressalva: for ONE participant / not YET comparable. Verifique se a entonação deixa claro qual parte da conclusão é limitada.',
    'As três fontes são fictícias e autorais. Não tratar depoimento indireto como voz completa de quem não participou.',
    'A: comissão pede sim/não. B: analista separa benefício individual e medida agregada. A exige decisão provisória; B propõe uma com prazo e evidência necessária.',
    'Escreva síntese de350–450 palavras articulando as três fontes e o dossiê complementar; inclua recomendação provisória e limites.',
    'The sources support a qualified account of access rather than an unambiguous success claim. One participant benefited from avoiding travel, whereas another may have faced a digital barrier. Meanwhile, the altered counting method prevents a straightforward comparison. A provisional decision should preserve participation options while comparable data and accounts from former participants are collected.',
    'Prepare briefing de150 palavras em português para conselho comunitário; preserve níveis de evidência, atribuição e a diferença entre métrica e experiência.',
    'Nova combinação: relatório diz inscrições cresceram; entrevista diz participação caiu; registro conta cadastros inativos. Explique compatibilidade sem inventar números.')

add('c1', 'Discurso longo e notas estratégicas',
    'Reconstruir raciocínio de exposição; reconhecer digressão e autocorreção; tomar notas utilizáveis por terceiros.',
    'Discourse markers incidentally/admittedly/to return to; ellipsis; referential chains; what matters is; set aside. That pode retomar uma proposição inteira; registrar antecedente reduz ambiguidade.',
    'Seminar brief: The speaker will argue that a service can become easier to measure without becoming easier to use. Your task is to identify the main distinction, the example, the concession and the unanswered question. Do not attempt a transcript. A note that says “measurement bad” would erase the argument’s concession that some measures are useful. A note that says “users confused” would omit which users and under what conditions. Use the extended listening dossier after the short rehearsal below. The dossier contains digressions and a revision of an earlier statement; your final notes should preserve the revised claim. A colleague who missed the talk needs a concise account, including what remains unresolved. They do not need every anecdote. After writing, mark each statement as a claim by the speaker, an example, a qualification or your own inference.',
    'Speaker: Let me start with a distinction. A form may be easier to count without being easier to complete. I once worked with a team that counted completed applications—actually, submitted applications, which is not quite the same thing. Some were incomplete. Incidentally, the team was under considerable time pressure. That explains the choice; it does not make the measure adequate. To return to the main point, what matters is whether the indicator answers the question we are asking. I’m not suggesting that we abandon numbers. I’m suggesting that we specify what each number stands for.',
    [('Leitura: qual nota apaga a concessão?', 'measurement bad; transforma crítica específica em rejeição geral.'), ('Áudio: que autocorreção aparece?', 'completed applications → submitted applications.'), ('Áudio: pressão de tempo torna medida adequada?', 'Não; explica escolha sem justificá-la como adequada.'), ('Leitura: o que marcar nas notas finais?', 'Afirmação, exemplo, ressalva ou inferência própria.')],
    [('Resolva “That explains the choice”: a que That se refere?', 'À pressão de tempo da equipe.'), ('Reformule tese sem “numbers are useless”.', 'Indicators are useful only insofar as their meaning fits the question; outras formulações cautelosas aceitas.'), ('Elimine digressão mantendo ressalva.', 'The team counted submitted, not necessarily complete, applications; time pressure explained but did not validate the measure.')],
    'Reconheça mudança de ritmo em actually e to return to the main point. A autocorreção altera conteúdo e precisa entrar na nota final.',
    'Solicitar repetição ou roteiro é recurso legítimo. Versão lida do áudio gera evidência de leitura, não de escuta.',
    'A: apresenta roteiro sem mostrá-lo, incluindo autocorreção. B: faz notas e restitui tese; A identifica omissão. Depois invertam com dossiê.',
    'Após o dossiê oral, produza notas, síntese de250–300 palavras e duas perguntas que esclareçam pontos em aberto; apresentação oral de3 minutos.',
    'The speaker distinguishes the convenience of counting from the usefulness of an indicator. The example concerns submitted applications, not necessarily complete ones. Time pressure explains the team’s choice but does not validate it. The speaker supports specifying what numbers represent, rather than abandoning measurement.',
    'Explique a exposição a colega lusófono ausente, preservando a autocorreção e eliminando digressão sem mudar posição.',
    'Receba o roteiro complementar sem leitura prévia; registre a ressalva sobre acessibilidade e confira sua restituição com a versão escrita.')

add('c1', 'Argumentação com contraposição forte',
    'Construir argumento sustentado; representar objeção de forma justa; calibrar escopo da conclusão.',
    'Concessive clauses; inversion after negatives; fronting/end-weight; lest receptivo; put forward, bear out. Not only does… exige inversão; recurso opcional, não marcador obrigatório de nível.',
    'A proposal to make all public workshops free appears straightforward: remove the fee and participation should rise. A serious defence of the proposal, however, must address capacity, staffing and the possibility that time or transport is the greater barrier. Its strongest opponent need not be opposed to access. They may argue that a modest fee funds childcare or extended opening hours that enable participation. Conversely, defending a fee requires more than pointing to revenue; it requires evidence about who is excluded and how funds are used. An argument becomes more credible when it identifies the conditions under which it would need revision. If removing fees increases registration but not attendance, the proposal may need accompanying measures. If a fee demonstrably excludes the intended audience, preserving it merely because it is familiar is difficult to justify. The task is to argue for a policy while keeping its assumptions visible, not to produce a list of equally weighted opinions.',
    'Opponent: Your argument assumes cost is the main barrier.\nPresenter: It assumes cost is a significant barrier for the target group, which we still need to verify.\nOpponent: Then why recommend a trial?\nPresenter: Because a limited trial can test the assumption, provided we also track attendance and reasons for absence.\nOpponent: Would you reverse the recommendation?\nPresenter: Yes, if the evidence showed that another use of the funding improved access more.',
    [('Leitura: oposição forte precisa rejeitar acesso?', 'Não; pode priorizar cuidado infantil ou horário.'), ('Áudio: suposição já verificada?', 'Não.'), ('Áudio: que resultado poderia mudar recomendação?', 'Outro uso do recurso melhorar acesso mais.'), ('Leitura: inscrição basta para medir participação?', 'Não; diferenciar inscrição e presença.')],
    [('Transforme: We should not only track registration but also attendance.', 'Not only should we track registration, but we should also track attendance.'), ('Formule condição de revisão da sua tese.', 'I would revise this recommendation if… seguido de evidência específica, não “if I were wrong”.'), ('Reescreva opositor caricatural “They don’t care about access”.', 'They argue that fees may fund services that support access; não atribuir motivação sem prova.')],
    'Use pausa e ênfase para separar concessão de resposta. Evite que rapidez oculte a condição under which.',
    'Discordância não prova falta de boa-fé. Avaliação favorece tratamento justo da objeção, independentemente da política escolhida.',
    'A: defende gratuidade experimental. B: defende investir receita em cuidado infantil. Construam melhor versão do argumento oposto antes de responder.',
    'Ensaio de450–550 palavras com tese, evidência do dossiê, objeção forte, resposta e condição de revisão; defesa oral de5 minutos.',
    'A fee-free trial is defensible if it tests, rather than assumes, the role of price. Its evaluation should distinguish registration from attendance and investigate remaining barriers. The strongest objection is that the same funds might support childcare or longer hours. That comparison should inform whether the trial is extended.',
    'Explique ambas as posições a conselho lusófono antes de recomendar uma, sem reduzir a oposição a interesse financeiro.',
    'Tema novo: encontros obrigatoriamente online. Defenda política reversível e enfrente objeção de exclusão digital usando evidência disponível.')

add('c1', 'Mediação de conflitos e facilitação',
    'Reformular posições em necessidades; gerir turnos; produzir acordo parcial sem apagar divergência.',
    'Tentative language; conditional offers; summarising positions; distancing; insofar as; common ground, reservation, follow through on. “If I understand you correctly…” abre verificação; não é licença para atribuir intenção.',
    'At a planning meeting, one volunteer says, “We keep changing everything for people who never show up.” Another replies, “You only care about the people who are already comfortable here.” Both statements contain assumptions about motives. The facilitator has two immediate tasks: make the practical disagreement explicit and prevent the discussion from turning into a judgement of character. The first volunteer may be concerned about wasted preparation; the second may be concerned about barriers to attendance. These are plausible interpretations, not facts to impose. The facilitator should check them, invite examples and establish which decision must be made today. A partial agreement might be to preserve the current session while testing one alternative time. It would still leave questions about workload, communication and evaluation. Recording those unresolved points is part of successful mediation, not evidence that mediation failed.',
    'Facilitator: Can I check what each of you needs? Sam, is predictable preparation your main concern?\nSam: Yes, particularly when we change plans at the last minute.\nFacilitator: Lee, are you asking us to test whether timing excludes people?\nLee: Exactly. I’m not asking to cancel the current session.\nFacilitator: Then we may have room for a small trial, provided the extra workload is agreed. What would each of you be able to contribute?',
    [('Leitura: necessidades inferidas devem ser impostas?', 'Não; precisam ser verificadas.'), ('Áudio: Lee quer cancelar sessão atual?', 'Não.'), ('Áudio: qual condição para ensaio?', 'Acordo sobre trabalho extra.'), ('Leitura: registrar pendências é fracasso?', 'Não; preserva limites do acordo.')],
    [('Reformule “You don’t care” como questão verificável.', 'Are you concerned that the current arrangement excludes some people? Evitar atribuir motivo.'), ('Registre acordo parcial em uma frase.', 'We agreed to retain the current session while exploring one alternative, subject to workload approval.'), ('Convide participante sem expor intimidade.', 'Would you like to add anything about what would make participation possible?')],
    'Pratique pausas que cedem o turno; grave pergunta de verificação e confirme que há espaço real para resposta, não apenas entonação decorativa.',
    'Facilitador não decide sentimentos alheios. Um acordo deve permitir reserva e recusa; não forçar consenso.',
    'A: Sam, quer previsibilidade. B: Lee, quer testar horário. Em dupla, alternem facilitador a cada rodada; por escrito, registrem qual posição ainda não concordou.',
    'Conduza reunião de6 minutos ou ensaio por papéis; escreva ata de300–400 palavras com acordo, reservas, responsáveis e verificação futura.',
    'Sam emphasised the cost of late changes, while Lee asked for evidence about timing barriers. Both accepted retaining the current session. A second time may be tested if workload and communication are agreed. No decision was made about permanent expansion. The team will review responsibilities before announcing the trial.',
    'Produza síntese em português que preserve voz de ambos, condição e ausência de aprovação definitiva.',
    'Novo conflito: equipe quer rapidez e revisores pedem mais tempo. Facilite acordo sobre escopo, sem tratar revisão como obstáculo pessoal.')

add('c1', 'Precisão, responsabilidade e escrita pública',
    'Revisar texto institucional; identificar agentes apagados; adaptar densidade ao destinatário sem perder precisão.',
    'Nominalisation; passive/active responsibility; embedded clauses; modality; lexical precision; undertaken/committed/proposed. Was considered não equivale a was approved; preservar estado decisório.',
    'Draft statement: “Following consideration of implementation challenges, a revision of access arrangements was undertaken. It is anticipated that improved participation will result.” The statement is grammatically possible but leaves several questions unanswered: who changed what, which barriers were identified, and what evidence supports the expected improvement? A revision might read, “The coordination team moved the Friday session to an accessible room after participants reported difficulty using the stairs. We expect the change to help those participants attend, but we will review attendance and feedback after four weeks.” This version attributes an action, specifies a reported barrier and limits the prediction. It should only be used if those details are actually known. An editor must not fill informational gaps with plausible inventions. Where facts are missing, a question to the author may be the most responsible revision. Precision sometimes requires a visible gap rather than a polished sentence.',
    'Editor: Who authorised the change?\nAuthor: I know the coordinator proposed it, but I don’t know whether it was approved.\nEditor: Then we cannot write “the team moved the session”.\nAuthor: Could we say it is being considered?\nEditor: Only if that status is confirmed. Otherwise we should ask before publishing.',
    [('Leitura: por que versão clara pode ser indevida?', 'Detalhes podem não estar confirmados; clareza não justifica inventá-los.'), ('Áudio: proposta foi aprovada?', 'Desconhecido.'), ('Áudio: “being considered” pode ser assumido?', 'Não; precisa confirmar esse estado também.'), ('Leitura: quais lacunas do original?', 'Agente, ação concreta, barreiras e evidência da previsão.')],
    [('Descompacte “a revision of access arrangements”.', 'Someone revised how people access the activity; ainda falta quem e o quê.'), ('Distinga proposed/approved/implemented.', 'Proposto/aprovado/executado; nenhum implica automaticamente os demais.'), ('Reescreva previsão como limitada.', 'We expect the change to help, but its effect has not yet been evaluated; usar apenas com expectativa atribuída.')],
    'Dê relevo a PROPOSED, APPROVED, IMPLEMENTED. Em leitura pública, teste se ouvintes identificam o estado real sem consultar texto.',
    'Transparência inclui perguntar quando falta informação. Não melhorar aparência de um comunicado às custas da verdade.',
    'A: autor com informação incompleta. B: editor pede agente, status e evidência. Preparem versão publicável apenas com fatos confirmados e lista separada de perguntas.',
    'Produza comunicado de250–350 palavras e comentário editorial de150–200 palavras; marque cada alteração factual que exige confirmação.',
    'The coordinator has proposed changing the access arrangements. Approval and implementation have not been confirmed in the material available to the editor. Before publication, the team should verify the proposed change, the decision-maker and the evidence supporting any prediction about participation.',
    'Explique a gestores lusófonos por que edição não pode resolver ausência de fatos por inferência; preserve os três estados.',
    'Novo original: “Concerns were addressed and improvement is assured.” Faça perguntas e versão provisória sem afirmar resolução ou garantia não documentada.')

add('c1', 'Literatura, ambiguidade e leitura cultural',
    'Analisar voz e subtexto; comparar interpretações; sustentar ambiguidade sem tornar toda leitura igualmente apoiada.',
    'Stylistic inversion; ellipsis; intertextual reference; tonal stance; imagery; read into, hint at. “It suggests” distingue inferência de declaração explícita. Inversão é escolha discursiva, não ornamento obrigatório.',
    'The archive closed at six, but the woman at the desk never looked at the clock. She looked at the last reader. If he began packing, she stacked the forms. If he opened another box, she found something to straighten. One evening he asked whether she was waiting for him. “The room is,” she said. He apologised and reached for his coat. “That wasn’t a complaint.” Outside, a bus pulled away. Neither mentioned it. Years later, when the building became a restaurant, he wrote that the archive had always stayed open late. The former clerk read the article over breakfast. She placed a ruler beside the sentence, as if checking whether it would fit somewhere else, and then turned the page. No correction was sent. The restaurant advertised itself as a place where history was served daily.',
    'Reader A: Her silence confirms that his account is accurate.\nReader B: Or she chooses not to correct a simplification. The ruler makes me think of fitting a memory into a neat sentence.\nReader A: Are we reading too much into it?\nReader B: Possibly. We should test the interpretation against the missed bus and “That wasn’t a complaint”, rather than treating the symbol as proof.',
    [('Leitura: a ausência de correção prova concordância?', 'Não; silêncio admite outras leituras.'), ('Áudio: símbolo é tratado como prova definitiva?', 'Não; precisa ser testado contra detalhes.'), ('Áudio: quais detalhes são propostos?', 'Ônibus perdido e fala sobre não ser reclamação.'), ('Leitura: qual tensão no slogan final?', 'História como experiência complexa versus produto servido; interpretação apoiada, não única.')],
    [('Reformule “The ruler means she hates him” com limite.', 'The ruler may suggest discomfort with the neatness of his account; ódio não tem apoio suficiente.'), ('Use inversão de forma pertinente: She never sent a correction.', 'Never did she send a correction; compare efeito enfático e se cabe no registro.'), ('Separe fato e leitura sobre ônibus.', 'Fato: um ônibus partiu e ninguém o mencionou. Inferência: ela pode ter perdido transporte por ficar.')],
    'Leia “The room is” com duas intenções plausíveis; explique o efeito sem declarar uma gravação como interpretação oficial.',
    'Texto original. Uma leitura cultural deve indicar evidência e contexto; não transformar silêncio em característica nacional.',
    'A: lê gesto como generosidade. B: lê custo invisível. Ambos defendem, reconhecem detalhe resistente e formulam pergunta que texto não resolve.',
    'Ensaio de450–550 palavras com duas interpretações, análise de linguagem e limites; discussão de6 minutos usando também o texto B2-07.',
    'The story makes the clerk’s labour visible without giving us direct access to her motives. The missed bus suggests a cost, while “That wasn’t a complaint” resists a simple grievance narrative. Her silence after publication cannot settle the matter. The restaurant’s slogan further compresses a complicated past into a marketable phrase.',
    'Apresente duas leituras em português a grupo que não leu o original; traduza apenas trechos necessários e preserve o que não sabemos.',
    'Compare a gerente de B2-07 com a arquivista: quem controla o registro escrito, quem permanece sem voz e que inferências cada texto permite?')

add('c1', 'Voz, audiência e comunicação intercultural',
    'Adaptar discurso a audiências distintas; gerir implicaturas e registro; reparar interpretação sem apagar responsabilidade.',
    'Clefts, fronting, ellipsis, stance adverbs; idiomatic language selected by context; brush up on, come down to; strategic explicitness. What we can commit to is… destaca limite; não usar como desvio de pergunta legítima.',
    'A project lead tells a partner, “We’ll see what we can do.” The partner hears a tentative commitment; the lead intends only to acknowledge the request. Neither interpretation can be resolved by translating the words in isolation. Their previous exchanges, organisational roles and expectations matter. A useful repair might be: “I realise my reply sounded more definite than I intended. We have not committed to the extra session. I can confirm our capacity by Thursday.” This accepts responsibility for the ambiguity while clarifying the actual promise. In a public update, the same information may need a different form: “The additional session is under review. A decision is expected on Thursday.” That wording is appropriate only if a decision, rather than a capacity check, is actually expected. Adapting register therefore requires more than replacing informal words with formal ones. It requires preserving the action, its owner and the degree of commitment across audiences.',
    'Partner: We announced the extra session after your message.\nLead: I see why you understood it that way. I should have been clearer. We haven’t confirmed capacity yet.\nPartner: What can you promise now?\nLead: What I can commit to is an update by Thursday, even if the decision is still pending.\nPartner: Then please help us correct the announcement today.',
    [('Leitura: tradução literal resolve implicatura?', 'Não; contexto e histórico importam.'), ('Áudio: qual compromisso efetivo?', 'Atualização até quinta, mesmo sem decisão.'), ('Áudio: qual ação imediata pedida?', 'Ajudar a corrigir anúncio hoje.'), ('Leitura: verificar capacidade equivale a decidir?', 'Não; versão pública deve preservar diferença.')],
    [('Complete cleft para limite: What I can commit to ___ an update.', 'is.'), ('Reescreva “decision by Thursday” se só há atualização prometida.', 'An update will be provided by Thursday; the decision may still be pending.'), ('Repare sem culpar destinatário.', 'I should have made the limit clearer; I can see why my wording suggested a commitment.')],
    'Destaque UPDATE, não DECISION. Compare leitura formal e conversacional preservando o mesmo compromisso.',
    'Não atribuir mal-entendido à nacionalidade. Registre contexto e dê espaço para que o interlocutor explique a própria interpretação.',
    'A: parceiro já anunciou sessão. B: líder não confirmou capacidade. Façam reparo e redijam aviso conjunto sem prometer decisão quinta.',
    'Produza três versões coerentes: mensagem privada, aviso público e atualização oral; acrescente comentário de200 palavras sobre registro e responsabilidade.',
    'Our earlier message was unclear, and we are correcting the announcement. The additional session has not been confirmed. We will provide an update by Thursday, even if a final decision is still pending. We apologise for the confusion and will identify any confirmed arrangements explicitly.',
    'Explique à equipe lusófona o compromisso exato e a responsabilidade pelo reparo, sem dizer que a sessão está cancelada.',
    'Novo caso: “We aim to publish on Monday” foi divulgado como data garantida. Escreva reparo que preserve intenção, incerteza e próximo contato.')

add('c1', 'Dossiê final: decisão sob incerteza',
    'Integrar leitura extensa, escuta, debate, escrita e mediação; defender decisão revisável com evidência e voz própria.',
    'Integração de registro, coesão, modalidade, síntese, argumentação e prosódia; due regard, contingency, accountable, follow through on. Precisão vale mais que acumular estruturas raras.',
    'The final commission concerns the fictional Riverside Learning Centre. Read all three documents in the extended dossier and listen to the briefing without first reading its transcript. The centre must decide how to allocate a limited budget while preserving access and avoiding commitments it cannot meet. Your recommendation may support a mixed format, retain the current arrangement or propose a narrower trial. There is no predetermined policy answer. What matters is the quality of your synthesis, the fairness of your treatment of alternatives and the clarity of your conditions. Distinguish figures that can be compared from figures collected differently. Address the voices absent from the consultation, but do not invent their preferences. Identify which decision can be made now and which must wait for verification. Finally, produce a public explanation that a non-specialist can understand without losing the reservations that matter to the decision.',
    'Commission chair: We need a recommendation, not simply a catalogue of uncertainties.\nPresenter: Agreed. A limited decision is possible now, provided its assumptions are explicit.\nChair: What would make you change your mind?\nPresenter: Evidence that the proposed arrangement excludes the intended participants, or that its staffing requirements cannot be met.\nChair: And what will the public hear?\nPresenter: The approved action, its limits and the date of the next review—not a promise of permanent expansion.',
    [('Leitura: há política correta predeterminada?', 'Não; há requisitos de fidelidade, viabilidade e argumentação.'), ('Áudio: incerteza impede toda decisão?', 'Não; decisão limitada pode ser possível.'), ('Áudio: que condições podem mudar recomendação?', 'Exclusão do público ou equipe insuficiente.'), ('Leitura: preferências dos ausentes podem ser inventadas?', 'Não; identificar lacuna e plano de consulta.')],
    [('Transforme uma garantia em compromisso verificável.', 'We will review attendance and feedback after four weeks; não prometer impacto antes de medir.'), ('Formule objeção forte à sua escolha.', 'Resposta aberta: deve citar restrição real do dossiê e explicar consequência, não caricaturar alternativa.'), ('Separe decisão agora e pendência.', 'Resposta aberta: aprovar só escopo financiável e condicionar expansão a recursos/consulta; alternativas fundamentadas aceitas.')],
    'Prepare apresentação com agrupamento por argumento, destaque de reservas e mudança de ritmo em perguntas. Não avaliar “parecer nativo”; observar compreensão e controle de nuance.',
    'Dados e instituições são ficcionais. Defesa não é certificação C1: precisa de avaliação humana e amostras independentes em outros contextos.',
    'A: apresenta decisão. B: questiona comparação numérica, inclusão e custo. Alternem presidente e proponente; registrem uma objeção que mudou a proposta.',
    'Projeto final: memorando600–800 palavras, síntese pública180–220, fala6–8 minutos, perguntas4 minutos e mediação em português200 palavras; usar dossiê integral.',
    'I recommend a time-limited pilot rather than permanent expansion. The consultation indicates several needs but does not represent every group, and the attendance figures are not directly comparable. Approval should specify staffing, budget and review criteria. The public statement should distinguish the approved pilot from options still under investigation.',
    'Explique a decisão em português para participantes, preservando limites, responsáveis e revisão; adapte exemplos sem alterar números nem atribuição.',
    'Na defesa, receba a atualização: facilitador fica indisponível e orçamento cai100 créditos. Reavalie escopo com os números do dossiê e registre o que deixa de ser viável.')
LEVELS = {
 'pre-a1': dict(label='Pré-A1', minutes=30, support='Cartões, gesto, português e repetição livre; responder com palavras ou blocos é válido.', risk='Sobrecarga de leitura, nomes das letras em português e tentativa de analisar toda fórmula antes de usá-la.', scale='REC-O · REC-L · PRO-O · PRO-E · INT-O; mediação e fonologia preparatórias: extensão Lexio', project='Ficha, apresentação apoiada, pedido e compromisso confirmado'),
 'a1': dict(label='A1', minutes=45, support='Instruções em português, banco de expressões e interlocutor colaborativo; reduzir consulta na segunda tentativa.', risk='Omissão de sujeito ou be; mistura de do/is; perguntas com ordem inadequada; horário transmitido sem contexto.', scale='REC-O · REC-L · PRO-O · PRO-E · INT-O · INT-E · MED-I · PHO', project='Perfil, agenda, relato breve e convite com confirmação'),
 'a2': dict(label='A2', minutes=60, support='Primeiro tentar sem tradução; consultar glossário e pedir esclarecimento. Na transferência, usar só notas próprias.', risk='Confundir obrigação e proibição, trocar condição por certeza ou usar passado definido com perfect de modo a confundir tempo.', scale='REC-O · REC-L · PRO-O · PRO-E · INT-O · INT-E · MED · PHO', project='Evento com orçamento, convite, distribuição de tarefas e atualização'),
 'b1': dict(label='B1', minutes=75, support='Instruções podem ser esclarecidas em português; produzir em inglês com notas, sem redação pronta. Pedir exemplos é estratégia válida.', risk='Conectar frases sem relação clara; transmitir relato como fato próprio; usar tempos sem indicar sequência; evitar pergunta de seguimento.', scale='REC-O · REC-L · PRO-O · PRO-E · INT-O · INT-E · MED-T · COE · PHO', project='Proposta local, defesa e síntese para outro público'),
 'b2': dict(label='B2', minutes=90, support='Fontes e notas disponíveis; perguntas de seguimento inéditas. Português serve à mediação e a esclarecer conceito, sem substituir a tarefa em inglês.', risk='Causalidade exagerada, negação/condição perdida na síntese, registro artificial e compromisso mais forte que o autorizado.', scale='REC-O · REC-L · PRO-O · PRO-E · INT-O · INT-E · MED-T · REG · COE · PHO', project='Proposta comparativa defendida em público e acordo escrito'),
 'c1': dict(label='C1', minutes=120, support='Fontes consultáveis, produção e discussão em inglês; português na mediação. Preparação não elimina perguntas inéditas e mudança de cenário.', risk='Densidade sem clareza, atribuição incorreta, leitura excessiva de subtexto, ornamentação gramatical e apagamento da incerteza.', scale='REC-O · REC-L · PRO-O · PRO-E · INT-O · INT-E · MED · REG · COE · PHO', project='Dossiê, memorando, defesa, comunicação pública e mediação'),
}

SPECIAL = {
 'EN-A1-07':'INT-D', 'EN-A2-05':'INT-D', 'EN-A2-07':'LIT',
 'EN-B1-05':'MED-N', 'EN-B1-06':'MED-C', 'EN-B1-07':'LIT',
 'EN-B2-05':'MED-T', 'EN-B2-06':'REG', 'EN-B2-07':'LIT',
 'EN-C1-02':'MED-N', 'EN-C1-04':'MED-C', 'EN-C1-06':'LIT',
}

def write(path, text):
    dest = ROOT / path
    dest.parent.mkdir(parents=True, exist_ok=True)
    dest.write_text(text.strip()+'\n', encoding='utf-8')

def bullets(items):
    return '\n'.join(f'{i+1}. {x}' for i,x in enumerate(items))

for index,u in enumerate(units):
    level = LEVELS[u['level']]
    prev = units[index-1]['id'] if index else None
    u['prerequisites'] = [prev] if prev else []
    u['cefr_refs'] = level['scale'] + (' · '+SPECIAL[u['id']] if u['id'] in SPECIAL else '')
    u['status'] = 'authored_not_piloted'
    u['audio_status'] = 'script_only'
    u['file'] = f"units/{u['id']}.md"
    n = level['minutes']
    # Four complete sessions; minutes below sum to the session length.
    t1 = [round(n*.15), round(n*.40), round(n*.25)]
    t1.append(n-sum(t1))
    prerequisite = f"[{prev}]({prev}.md), ou demonstrar objetivos equivalentes com apoio compatível." if prev else 'Nenhum conhecimento de inglês exigido. Confirmar acesso ao texto e explicar a tarefa em português.'
    prior_review = f'Recupere uma expressão de {prev} sem olhar e use-a com um dado diferente.' if prev else 'Antes de começar, escolha um nome fictício e indique como prefere receber ajuda.'
    extended = ''
    if u['level']=='c1':
        extended = '\n**Extensão obrigatória do ciclo:** usar o [dossiê integral](../EXTENDED-DOSSIER.md). U01: fontes A–C; U02: roteiro D sem leitura prévia; U03: A–C para argumentação; U04: restrições de A/B para facilitação; U05: revisar comunicação de C; U06: comparar sua narrativa com B2-07, e tratar o dossiê apenas como contraste de gênero; U07: adaptar a decisão de A–C; U08: todos os documentos e atualização final.\n'
    elif u['level']=='b2' and u['number'] in [1,5,8]:
        extended = '\n**Ampliação:** usar A e B do [dossiê](../EXTENDED-DOSSIER.md) para comparar uma segunda situação; o professor pode segmentar os textos e explicar léxico novo antes da discussão.\n'
    reading=u['reading'].replace(chr(10), '  '+chr(10))
    audio=u['audio'].replace(chr(10), '  '+chr(10))
    model=u['model'].replace(chr(10), '  '+chr(10))
    questions=bullets(q for q,a in u['questions'])
    exercises=bullets(q for q,a in u['practice'])
    answers=bullets(a for q,a in u['questions'])
    practice_answers=bullets(a for q,a in u['practice'])
    text=f'''---
id: {u['id']}
level: {u['level']}
version: 0.1
status: authored_not_piloted
audio: script_only
---

# {u['id']} — {u['title']}

[Mapa do curso](../MATRIX.md) · [Caderno do nível](../levels/{u['level']}.md) · [Rubrica](../ASSESSMENT.md)

## Objetivo, entrada e evidências

**Situação e objetivo:** {u['goal']}

**Pré-requisito:** {prerequisite}

**Apoio previsto:** {level['support']}

**Referências propostas:** {level['label']} · {u['cefr_refs']}. [Chaves e limites](../CEFR-MAPPING.md). As atividades são autorais; nível ainda sujeito a revisão humana.

Evidências locais: R — localizar/interpretar duas informações da leitura; L — compreender duas informações do roteiro ouvido; W — produzir o texto/cartão da tarefa; O — produzir a fala prevista; I — responder ao interlocutor e à mudança de dados; M — transmitir informação relevante ao destinatário da mediação. Identificar cada evidência como `{u['id']}.R`, `.L`, `.W`, `.O`, `.I` ou `.M`. Mediação pré-A1 é preparação Lexio, sem reivindicar descritor oficial.

{prior_review}

## Linguagem para agir — Syntaxis e léxico

{u['language']}

Leia um exemplo e diga o que ele permite fazer. Cubra-o e tente com um dado novo. Consulte [apoio de linguagem](../LANGUAGE-SUPPORT.md) quando precisar; reconhecer uma forma é diferente de usá-la sozinho.

## Texto de leitura

{reading}

## Roteiro de escuta

Antes de abrir: peça a alguém que leia ou use o leitor de texto do dispositivo. Ouça uma vez para situação geral e outra para os dados. Não leia simultaneamente na tentativa de escuta. Se só ler, registre L como pendente.

<details>
<summary>Roteiro para quem lê ou para conferir depois da escuta</summary>

{audio}

</details>

## Compreensão

{questions}

Nas perguntas de leitura, sublinhe o trecho que sustenta a resposta. Nas de escuta, anote primeiro o que entendeu; só depois abra o roteiro. Uma interpretação diferente pode ser válida se apoiada na fonte.

## Prática orientada

{exercises}

Depois de corrigir, crie mais um exemplo com outro dado e diga qual efeito de sentido mudou. Na etapa inicial, substituição de nome, número ou objeto é suficiente.

## Phonos — ouvir, dizer, conferir

{u['phon']}

Faça duas tentativas, com uma única prioridade por vez. Peça ao ouvinte que diga a informação entendida, não que avalie seu sotaque. [Laboratórios complementares](../PHONOS-LAB.md).

## Shadow — troca com lacuna de informação

{u['roles']}

Com parceiro: cada pessoa lê só seu papel antes da primeira rodada. Depois, troquem. Sem parceiro: escreva as falas de um papel, pause e responda em voz alta como o outro; na segunda rodada mude os dados conforme a transferência. Isso é ensaio de produção, não evidência de interação espontânea. IA é opcional e não atribui nível; não é necessária para executar o roteiro.

## Cultura e estratégia

{u['culture']}

Compare uma situação conhecida sem generalizar para toda uma população. Você pode usar personagem fictício.

## Tarefa final

{u['final']}

Critérios: cumprir o propósito; manter corretos os dados e condições; organizar para o destinatário; usar recursos suficientes; produzir mensagem compreensível. Na conversa real, responder e reparar. Aplicar a [rubrica local](../ASSESSMENT.md); não converter conclusão em proficiência.

## Mediação

{u['mediation']}

Primeiro escolha o que o destinatário precisa. Depois confira nomes, números, negações, condições e atribuições. Não é necessário traduzir palavra por palavra.

## Percurso autônomo — quatro sessões de cerca de {n} minutos

1. **Receber e compreender:** {t1[0]} min para revisar pré-requisito; {t1[1]} min para leitura e busca de evidências; {t1[2]} min para escuta; {t1[3]} min para responder à compreensão. Abra o gabarito somente após tentar. Registre o apoio usado.
2. **Notar e experimentar:** {t1[0]} min para corrigir compreensão; {t1[1]} min para linguagem e exercícios; {t1[2]} min para Phonos; {t1[3]} min para produzir exemplos próprios. Se errar, explique a diferença com suas palavras e refaça com outro dado.
3. **Agir e produzir:** {t1[0]} min para planejar com notas; {t1[1]} min para Shadow e nova rodada; {t1[2]} min para rascunhar tarefa final; {t1[3]} min para conferir propósito e informação. Textos longos podem continuar fora da sessão; registrar tempo real.
4. **Rever e transferir:** {t1[0]} min para ler modelo após a primeira produção; {t1[1]} min para revisar texto/fala; {t1[2]} min para mediação; {t1[3]} min para iniciar a transferência. Termine a produção no ritmo necessário e registre uma prioridade de recuperação.

Se o tempo estimado não bastar, dividir em encontros menores. Não pular produção ou revisão para caber no relógio.

## Percurso com professor — quatro encontros de cerca de {n} minutos

1. **Entrada e recepção:** {t1[0]} min de diagnóstico pelo pré-requisito; {t1[1]} min de leitura individual e comparação de evidências; {t1[2]} min de leitura oral do roteiro pelo professor, sem texto para alunos; {t1[3]} min de compreensão e restituição. Repetir com os apoios previstos; registrar repetições.
2. **Laboratório:** {t1[0]} min de discussão dos erros; {t1[1]} min de contraste linguístico com exemplos da unidade; {t1[2]} min de Phonos em pares; {t1[3]} min de aplicação com dado novo. Modelar e pedir compreensão do parceiro antes de exigir mais velocidade.
3. **Interação e escrita:** {t1[0]} min para distribuir cartões; {t1[1]} min de trocas e inversão de papéis; {t1[2]} min de rascunho da tarefa final; {t1[3]} min de feedback entre pares. Intervir imediatamente apenas quando a comunicação trava; guardar correções não urgentes para a revisão.
4. **Avaliação e retorno:** {t1[0]} min para retomar uma dificuldade; {t1[1]} min para produção revisada; {t1[2]} min para mediação; {t1[3]} min para apresentar dados da transferência e pactuar recuperação. Concluir avaliação individual fora do encontro quando necessário.

**Dificuldades a observar:** {level['risk']} No caso desta unidade, use os contrastes do gabarito e a informação que muda na transferência como diagnóstico, em vez de corrigir tudo de uma vez.

**Adaptações:** menos itens por rodada, tempo extra, fonte ampliada, personagem fictício e resposta por apontar no pré-A1. Em grupo, distribuir observador para registrar somente o que foi entendido; em aula individual, professor assume parceiro. Transcrição pode ser oferecida como acessibilidade, registrando a mudança da evidência observada. Aluno que avança mais rápido recebe novo destinatário, não só mais lacunas gramaticais.
{extended}
## Pulse, Palácio e revisão espaçada

- **Pulse, até 3 minutos:** 30s para recuperar uma expressão desta unidade sem olhar; 60s para responder a uma pergunta de compreensão com dado trocado; 60s para dizer/escrever um exemplo próprio; 30s para conferir. Se uma etapa exigir mais tempo, continuar em sessão de estudo e não chamar o conjunto de Pulse de 3 minutos.
- **Palácio:** guardar uma expressão, um exemplo e a situação em que serve. Escolher lugar imaginado, cartão ou lista. Na próxima visita, recuperar antes de revelar. Adicionar correção ao mesmo registro em vez de colecionar itens sem uso.
- **D+1:** recuperar três expressões; **D+3:** refazer um contraste com outros dados; **D+7:** fazer a transferência; **D+21:** retomar uma pergunta da unidade junto com a unidade atual. O cronograma é ajustável, sem punição por atraso.

## Transferência — dados novos

{u['transfer']}

Guardar primeira e segunda tentativas. Verificar contra as restrições do enunciado, não contra a memória do modelo. Se não houver interlocutor, a interação fica pendente. Para recuperação, voltar somente ao trecho que causou a dificuldade e tentar novamente com mais um dado alterado.

## Gabarito e modelo — abrir depois da tentativa

<details>
<summary>Respostas comentadas da compreensão</summary>

{answers}

</details>

<details>
<summary>Respostas da prática orientada</summary>

{practice_answers}

</details>

<details>
<summary>Modelo ou trecho-modelo de produção</summary>

{model}

Modelo ilustrativo: outras respostas podem cumprir a tarefa. Nos níveis altos, este trecho mostra organização e escolhas de linguagem; desenvolver a extensão solicitada com argumentos e evidências próprias. Não copiar para registrar produção independente.

</details>

## Registro de saída

Data: ____ · Modalidade: ____ · Apoio usado: ____ · R: ____ · L: ____ · W: ____ · O: ____ · I: ____ · M: ____.

Uma informação que comuniquei bem: ____. Uma diferença que preciso praticar: ____. Minha próxima tentativa será: ____.
'''
    write(u['file'], text)

# Stable editorial source for future integration; it is not an API or a published app seed.
write('editorial/units.json', json.dumps({'version':'0.1','status':'authored_not_piloted','units':units},ensure_ascii=False,indent=2))

matrix=['# Matriz de unidades — Lexio English','', 'Edição 0.1. Oito macro-unidades em cada faixa; quatro sessões-base por unidade, com revisões e extensões. [Critérios de progressão](CURRICULUM-MASTER.md).','']
coverage=['# Cobertura rastreável','', 'Esta matriz verifica presença documental, não aprendizagem, calibração CEFR nem qualidade auditiva. Cada pacote ensina e pratica o objetivo; a tarefa final e a transferência geram evidência. Mediação pré-A1 é extensão Lexio. Nenhuma unidade foi pilotada.','', '| Unidade | Faixa e escalas propostas | Ensino | Prática | Avaliação | Estado |','|---|---|---|---|---|---|']
for lev,meta in LEVELS.items():
    matrix += [f"## {meta['label']}",'', '| Unidade | Objetivo observável | Linguagem em contexto |','|---|---|---|']
    for u in [x for x in units if x['level']==lev]:
        matrix.append(f"| [{u['id']} — {u['title']}]({u['file']}) | {u['goal']} | {u['language'].split('. ')[0]} |")
        coverage.append(f"| [{u['id']}]({u['file']}) | {meta['label']} · {u['cefr_refs']} | Linguagem, leitura, roteiro e Phonos | Compreensão R/L, exercícios, Shadow e mediação | Tarefa W/O/I/M + transferência; rubrica local | Manuscrito; áudio pendente; não pilotado |")
    matrix += ['']
write('MATRIX.md','\n'.join(matrix))
write('COVERAGE.md','\n'.join(coverage))
EXAMS = {
 'pre-a1': dict(
  read='Name: Eva\nFrom: Brazil\nTuesday, 10:00 in the morning\nRoom 7\nTea: 4 credits',
  audio='Host: Hello. I’m Lee.\nEva: I’m Eva. Room six?\nHost: No, room seven. At ten.\nEva: Again, please.\nHost: Room seven. At ten.\nEva: Thank you.',
  questions=['Qual é a origem de Eva no cartão?', 'Qual é o preço do chá?', 'Na escuta, que sala foi confirmada?', 'Qual expressão pediu repetição?'],
  answers=['Brazil/Brasil.', '4 créditos.', 'Room7/sala7; não6.', 'Again, please.'],
  writing='Preencha ficha fictícia com nome, origem e compromisso do cartão. Escreva um pedido de chá.',
  interaction='A é Eva e não sabe a sala; B é Lee e só vê cartão. A pergunta, pede repetição e confirma. Depois B muda hora para11 e A atualiza.',
  mediation='Explique a um colega lusófono onde e quando Eva deve ir. Preserve dia, hora e sala.',
  constraints='Origem Brasil; terça10h, sala7; depois da mudança11h; pedido de tea. Aceitar apontar e blocos com apoio. Não exigir texto corrido.'),
 'a1': dict(
  read='Hi, I’m Mai. I work from eight to four. Yesterday I visited the park. Today I’m studying at home. I’m going to meet Leo at the café on Friday at five thirty. Would you like to come?',
  audio='Leo: Can we meet at the library on Friday?\nMai: The café, not the library. At five thirty.\nLeo: I finish work at six.\nMai: Let’s meet at six thirty.\nLeo: Great. See you at the café.',
  questions=['Que atividade Mai fez ontem?', 'O que Mai faz hoje?', 'Qual é o local final?', 'Qual é o horário final e por que mudou?'],
  answers=['Visitou parque.', 'Estuda em casa.', 'Café.', '18h30; Leo trabalha até18h.'],
  writing='Escreva resposta de50–70 palavras confirmando plano final e contando uma atividade sua de ontem. Pode inventar personagem.',
  interaction='A tem plano inicial17h30; B só pode18h30. Troquem informações e confirmem local/dia/hora. B pergunta o que A fez ontem.',
  mediation='Transmita ao colega lusófono a mudança, distinguindo convite antigo e plano final.',
  constraints='Não manter17h30 após acordo. Uma ação passada e confirmação de sexta18h30 no café. Erros que não impeçam compreensão são toleráveis no nível.'),
 'a2': dict(
  read='We have 55 credits for a small meeting. Room Green costs40 and is available from two to four. Room Blue costs30 but is only available after six. We need to finish before five. Water costs8 for the group. We have invited five people, but we haven’t booked a room yet.',
  audio='Reception: Green is available, but only from three to five now.\nOrganiser: We need to finish before five. Can we leave at four thirty?\nReception: Yes, the price is still forty.\nOrganiser: Please book it.\nReception: I’ll send confirmation after you complete the form.',
  questions=['Que sala do texto atende a restrição de horário?', 'Quanto custam Green e água?', 'Qual é o novo período combinado?', 'A reserva está confirmada ou ainda condicionada?'],
  answers=['Green; Blue só depois18h.', '48 créditos, dentro de55.', '15h–16h30.', 'Condicionada ao formulário e confirmação; não afirmar que já recebeu.'],
  writing='Escreva atualização de100–130 palavras para convidados com custo, horário e estado da reserva.',
  interaction='A quer confirmar reserva; B informa que falta formulário. A pergunta próximo passo e comunica ao grupo uma alternativa se falhar.',
  mediation='Explique em português a comparação de salas e a pendência de confirmação.',
  constraints='Custo48; início15h; saída16h30; reserva não concluída. Avaliar coerência da atualização e resposta a imprevisto.'),
 'b1': dict(
  read='A neighbourhood newsletter said the museum would open late every Thursday from next month. The museum later explained that only one trial evening had been approved. Staff for regular late opening had not been confirmed. Visitors who bought travel tickets after reading the headline asked for clearer information. The newsletter published a correction. The approved trial is on the first Thursday, from six to eight, and entry is free.',
  audio='Visitor: Does the correction cancel the late opening?\nStaff: No. One evening is approved, not a weekly programme.\nVisitor: Can I bring a group?\nStaff: Yes, but groups of more than six need to contact us first.\nVisitor: There are eight of us.\nStaff: Then please send the group details before making plans.',
  questions=['Qual diferença entre manchete e correção?', 'Qual ação do veículo após esclarecimento?', 'O evento foi cancelado?', 'Que precisa fazer o grupo de oito?'],
  answers=['Semanal foi proposto na manchete; só uma noite aprovada.', 'Publicou correção.', 'Não; uma noite permanece aprovada.', 'Contatar museu com dados do grupo antes de planejar; mais de6 exige contato.'],
  writing='Escreva e-mail de180–220 palavras corrigindo plano de um grupo e pedindo a informação faltante sem atribuir culpa pessoal.',
  interaction='A é organizador de oito pessoas; B confirma só uma noite, mas ainda não sabe capacidade para grupo. Negociem próximos passos sem inventar vaga.',
  mediation='Resuma para grupo lusófono fato confirmado, erro anterior e ação necessária.',
  constraints='Uma noite18–20h, entrada gratuita; autorização de grupo de8 ainda não confirmada. Exigir sequência e atribuição, não gramática perfeita.'),
 'b2': dict(
  read='A fictional survey found that support for an evening workshop rose from30 of100 respondents to45 of100. A publicity draft says, “Our new programme caused a fifty percent rise in support.” The two surveys recruited participants differently, and the programme had not yet started when the second survey was conducted. The team has200 credits. A room costs120; facilitation costs60; optional printed packs cost30. A digital handout is included at no extra cost, but some participants may need print.',
  audio='Chair: Can we approve the workshop and printed packs?\nCoordinator: Not within200. The total would be210.\nChair: Then no one needs print.\nCoordinator: We can’t infer that from the budget. We should check needs and revise the scope.\nChair: Is the claim about support defensible?\nCoordinator: The relative increase is50 percent, but the causal claim is not.',
  questions=['Qual diferença em pontos percentuais?', 'Por que causalidade não é sustentada?', 'Total com todos os itens?', 'Por que ausência de orçamento não prova ausência de necessidade?'],
  answers=['15 pontos; aumento relativo50%.', 'Recrutamento mudou e programa ainda não começou; não isola causa.', '210; excede200 em10.', 'Recurso disponível e necessidade são fatos distintos; consultar participantes.'],
  writing='Parecer de280–330 palavras corrigindo publicidade e propondo opção financeiramente viável ou decisão condicionada a revisão de custos.',
  interaction='A defende anunciar tudo hoje. B exige ajuste de orçamento e declaração proporcional à evidência. Produzam acordo com pendências.',
  mediation='Explique em português cálculo, causalidade e necessidade de acessibilidade sem confundir os três.',
  constraints='30→45 equivale15pontos/50% relativo; 210>200. Não inventar desconto ou dispensar impressão sem consulta; pode propor obter10 adicionais como pendência.'),
 'c1': dict(
  read='Source1: A draft report claims that a mentoring scheme doubled retention from40 to80 percent. Source2: The administrator notes that the first figure counted everyone who registered, whereas the second excluded people who never attended. Source3: A mentor describes a participant whose confidence improved, but says that two others stopped responding. The funding panel has700 credits. A six-session continuation costs600; an optional evaluation workshop costs150. No additional funding is confirmed. The panel asks for a recommendation that distinguishes what can be approved now from what requires a change in scope or resources.',
  audio='Panel member: We seem to have both a strong result and a compelling story.\nReviewer: We have a numerical claim based on different denominators, and an account of one participant’s improvement. Neither should be discarded, but they do different work.\nPanel member: Would a150-credit evaluation settle the matter?\nReviewer: Not automatically. We need to know what it would measure and whether the original records can be reconstructed.\nPanel member: Can we approve continuation meanwhile?\nReviewer: Possibly, as a limited decision with explicit assumptions. We cannot promise that it will reproduce a result we have not established.',
  questions=['Que mudança de denominador existe?', 'Qual restrição orçamentária do pacote completo?', 'Por que150 em avaliação não garante conclusão?', 'Como o avaliador diferencia narrativa e agregado?'],
  answers=['Todos inscritos versus exclusão de quem não participou; porcentagens não comparáveis diretamente.', '600+150=750, excede700 em50.', 'Depende do desenho e recuperabilidade dos registros, não apenas do gasto.', 'Um caso ilustra experiência individual; não comprova efeito agregado.'],
  writing='Memorando de450–550 palavras com síntese de fontes, objeção forte, decisão revisável e comunicação pública curta adicional. Para evidência de extensão, combinar com o dossiê integral do projeto final.',
  interaction='A pede decisão imediata. B recomenda escopo limitado. Após3 minutos A informa que registros originais não podem ser recuperados: B deve rever a estratégia de avaliação sem inventar dados.',
  mediation='Escreva síntese de180–220 palavras em português para participantes, preservando a incerteza e distinguindo continuidade de prova de eficácia.',
  constraints='Distinguir denominadores; custo750 não cabe700; não prometer reconstrução impossível após atualização. Avaliar nuance, atribuição, resposta à objeção e clareza para público não especialista.'),
}

for lev,meta in LEVELS.items():
    us=[u for u in units if u['level']==lev]
    exam=EXAMS[lev]
    exam_read=exam['read'].replace(chr(10), '  '+chr(10))
    exam_audio=exam['audio'].replace(chr(10), '  '+chr(10))
    sequence='\n'.join(f"{u['number']}. [{u['title']}](../{u['file']}) — {u['goal']}" for u in us)
    prereq=us[0]['prerequisites']
    entrance='Sem inglês prévio; verificar acesso à leitura e aos apoios.' if not prereq else f"Retomar a tarefa de transferência de {prereq[0]}. Se houver lacuna, recuperar os objetivos específicos; evidência equivalente permite entrada sem repetir conteúdo já conhecido."
    write(f'levels/{lev}.md',f'''# {meta['label']} — caderno de nível

[Currículo mestre](../CURRICULUM-MASTER.md) · [Matriz](../MATRIX.md)

## Entrada, apoio e saída

Entrada: {entrance}

Apoio: {meta['support']}

Produto de saída: {meta['project']}. Evidência esperada é realização das tarefas, não mera conclusão de telas. Correspondência CEFR permanece proposta editorial.

Oito unidades × quatro sessões de {meta['minutes']} minutos: {8*4*meta['minutes']//60} horas-base de material. Revisões, extensões, preparação de textos e recuperação são adicionais. Não é estimativa do tempo necessário para alcançar a faixa.

## Sequência

{sequence}

## Revisões integradoras

- Após U02: use a transferência de U01 e acrescente uma informação de U02. Compare primeira tentativa e nova tentativa.
- Após U04: responda às duas perguntas de leitura de U03 sem consultar; depois resolva a transferência de U04 e explique o que mudou. Se a leitura foi decorada, use os dados novos da transferência como evidência principal.
- Após U06: escolha um produto de U05 e adapte ao destinatário de U06. Verifique se dados e propósito continuam coerentes.
- U08: realizar projeto integrado. Sete dias depois, aplicar a situação nova abaixo, preservando os apoios do nível.

## Avaliação de saída — situação nova

Não ler respostas nem roteiro antes da tentativa. O aluno autônomo pode usar leitor de texto ou parceiro. Quem não consegue ouvir faz leitura e mantém escuta pendente. As duas primeiras questões avaliam leitura; as últimas, escuta. Dois itens por habilidade são uma verificação local, insuficiente sozinha para certificar a faixa.

### Leitura

{exam_read}

### Escuta — para leitor ou conferência posterior

<details><summary>Abrir somente para ler em voz alta ou conferir depois</summary>

{exam_audio}

</details>

### Perguntas

{bullets(exam['questions'])}

### Escrita

{exam['writing']}

### Interação oral

{exam['interaction']}

Sem parceiro, ensaiar os papéis e registrar produção preparada. A evidência de interação continua pendente até haver resposta a outra pessoa.

### Mediação

{exam['mediation']}

### Gabarito e critérios específicos

<details><summary>Abrir depois de produzir</summary>

{bullets(exam['answers'])}

Para produção: {exam['constraints']}

</details>

## Decisão pedagógica

Aplicar [rubrica](../ASSESSMENT.md) a duas amostras: projeto U08 e situação nova. Não compensar falta de evidência oral com nota escrita. Registrar por habilidade: precisa de apoio / adequado à tarefa / amplia / não observado. Professor recomenda continuidade com recuperação dirigida quando necessário; autônomo registra autorrevisão, sem atribuir a si certificado CEFR.

O nível está escrito, não pilotado. Qualidade do áudio, adequação do tempo, dificuldade e consistência entre avaliadores permanecem por verificar com pessoas reais.
''')

write('editorial/assessments.json',json.dumps(EXAMS,ensure_ascii=False,indent=2))

readme='''# Lexio English — currículo pré-A1 a C1

**Edição editorial 0.1 · 13/10/2026.** Adultos brasileiros; inglês para vida, cultura, estudo e trabalho; duas modalidades completas de condução: autônoma e com professor.

Comece pelo [currículo mestre](CURRICULUM-MASTER.md), depois consulte a [matriz das 48 macro-unidades](MATRIX.md). A [unidade-modelo pré-A1](units/EN-PRE-A1-01.md) mostra o pacote de aula: fontes, exercícios, respostas, papéis, produção, mediação, guia de condução e transferência.

## Cadernos

'''
for lev,meta in LEVELS.items():
    readme+=f"- [{meta['label']}](levels/{lev}.md): oito unidades, revisão integradora e avaliação de saída com situação nova.\n"
readme+='''
## Materiais transversais

- [Rubricas, feedback e recuperação](ASSESSMENT.md).
- [Laboratório Phonos](PHONOS-LAB.md) e [apoio de linguagem](LANGUAGE-SUPPORT.md).
- [Dossiê extenso de leitura e roteiro de escuta](EXTENDED-DOSSIER.md).
- [Referências CEFR](CEFR-MAPPING.md) e [cobertura rastreável](COVERAGE.md).
- [Cartógrafa, separada do curso](CARTOGRAFA-ALIGNMENT.md).
- [Protocolo de pilotagem](PILOT.md) e [estado real de validação](VALIDATION.md).

**O que existe:** manuscrito de 48 unidades, 192 sessões-base descritas, 48 textos de leitura, 48 roteiros curtos de escuta, 192 questões de compreensão, 144 exercícios comentados, 48 tarefas de transferência, 6 avaliações de saída e materiais transversais. Os contadores são conferidos pelo verificador editorial.

**O que ainda não foi feito:** revisão independente por especialista, produção/revisão de áudio humano, pilotagem com alunos e integração na aplicação. Este pacote não comprova domínio de C1 nem funcionamento de recursos de áudio/IA no produto. Não houve alteração de conta, banco de dados, aplicação ou publicação.

Fontes textuais e dados dos cenários são autorais e fictícios. IDs e fontes estruturadas em `editorial/` servem à revisão e à futura integração, sem representar API pública ou conteúdo já publicado.
'''
write('README.md',readme)

print(f'Geradas {len(units)} unidades, {len(LEVELS)} cadernos, matriz, cobertura e fontes editoriais em {ROOT}')
