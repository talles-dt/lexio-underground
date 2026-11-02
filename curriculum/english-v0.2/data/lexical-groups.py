GROUPS = [
 dict(id='LEX-PRE-01',title='Receber e apresentar pessoas',after='FND-01',words=['hello','name','first name','last name','nice to meet you','friend'],
 situation='A organiza a recepção. B tem cartão: First name: Rui; Last name: Melo; friend: Eva. A cumprimenta B, pergunta o nome com What’s your name? e confirma os campos com First name? / Last name?. B responde e apresenta Eva com This is my friend Eva. A acolhe a apresentação. Troquem papéis com First name: Lia; Last name: Reis; friend: Kim.',
 result='A ficha final deve distinguir Rui de Melo e apresentar Eva como amiga, sem atribuir a ela o sobrenome de Rui. Em seguida, ficha Lia/Reis e amiga Kim. Uma apresentação possível: Hello. My name is Rui. My first name is Rui. My last name is Melo. This is my friend Eva. — Nice to meet you, Eva.',
 phon='Ouça e ensaie HELlo e NAME com apoio de pessoa ou voz do dispositivo. O parceiro deve recuperar o nome; não avalie imitação de sotaque.',
 pitfall='Não impor a todos nomes em dois campos: a organização aqui vem dos cartões fictícios. Explique que friend não determina gênero.'),
 dict(id='LEX-PRE-02',title='Distinguir origem e lugar atual',after='FND-03',words=['from','in','here'],
 situation='A representa Eva: from Canada, in Recife. B representa Jo: from Brazil, in Toronto. Cada pessoa informa origem e localização. Depois aponta no mapa esquemático (dois cartões com os nomes Recife e Toronto) o lugar correspondente ao seu here. B restitui em português os dois lugares de Eva; A faz o mesmo para Jo.',
 result='Eva: I’m from Canada. I’m in Recife. I’m here (apontando Recife). Jo: I’m from Brazil. I’m in Toronto. I’m here (apontando Toronto). O destinatário deve separar origem e localização; conhecimento geográfico não é requisito.',
 phon='Ensaie FROM + lugar e IN + lugar com pausas. O ouvinte restitui o campo entendido, não apenas o nome de lugar.',
 pitfall='Aqui here depende de quem fala. O mapa é uma representação da localização da personagem, não a localização física do estudante.'),
 dict(id='LEX-PRE-03',title='Pedir ajuda e corrigir informações',after='FND-02',words=['please','thank you','again','slowly','help','yes','no'],
 situation='A tem cartão Room 7. B deve obter a sala: pede Help, please; A informa a sala. B solicita repetição com Again, please e ritmo menor com Slowly, please. A repete sem mudar o dado. B confirma Room five?; A corrige No. Room seven. B confirma Room seven?; A responde Yes. B agradece. Na troca de papéis, usar Room 9 e confirmação incorreta Room 6.',
 result='Sala 7 na primeira rodada, sala 9 na segunda. O interlocutor mantém o dado ao repetir; quem ouve termina com o número correto. Cortesia, repetição e desaceleração têm funções diferentes. Não exigir pedidos de ajuda artificiais na avaliação: aqui são ensaios explícitos.',
 phon='Compare o efeito de desacelerar e gritar: usar ritmo mais lento e volume normal. Não há necessidade de gritar para realizar Slowly, please.',
 pitfall='Yes não é sinal automático de compreensão. Peça que a pessoa devolva o número para verificar o resultado.'),
 dict(id='LEX-PRE-04',title='Fazer uma instrução funcionar',after='FND-03',words=['listen','look','read','write','stop','spell'],
 situation='A prepara cartão com nome LEO. B segue a sequência: Look at the name; Read the name; Write the name; Stop. Depois A cobre o cartão, diz Listen e soletra L, E, O com apoio ao alfabeto. B seleciona entre LEO e LEE. B pergunta How do you spell it? para confirmar. Troquem papéis com EVA e alternativas EVA/AVA. Apoio: at the name = para o nome; the name = o nome.',
 result='Primeira ficha escrita LEO e seleção LEO; segunda EVA e seleção EVA. Soletrar significa dizer letras em sequência, não apenas ler o nome. Stop interrompe a escrita. Sem som, a parte listen fica sem evidência.',
 phon='Antes de soletrar, consultar o alfabeto de apoio da FND-03. Distinguir o nome da letra E do som em uma palavra; não exigir notação fonética.',
 pitfall='Uma dificuldade motora de copiar não implica falha na compreensão de write. Permitir letras móveis e registrar a adaptação.'),
 dict(id='LEX-PRE-05',title='Organizar a sala e devolver objetos',after='FND-04',words=['book','pen','bag','phone','chair','table'],
 situation='Desenhem uma sala com uma table e duas chairs. Cartão A: my bag, two books. Cartão B: my phone, three pens. Cada pessoa etiqueta seus objetos em inglês e os apresenta. A entrega intencionalmente o desenho de phone junto dos seus books; B recupera o telefone dizendo No. My phone. O parceiro escreve a lista final dos objetos de cada pessoa.',
 result='A: bolsa e dois livros; B: telefone e três canetas; sala: uma mesa e duas cadeiras. Não há dono declarado para mesa/cadeiras. As seis palavras precisam corresponder aos desenhos e à lista; corrigir a transferência do telefone.',
 phon='Ouvir book/books e pen/pens, apontando um ou vários objetos. Registrar se o plural é recuperável; não avaliar só a presença do número.',
 pitfall='My acompanha o falante. Ao trocar papéis, o referente muda. Não ensinar table como tabela neste cenário.'),
 dict(id='LEX-PRE-06',title='Fazer escolhas no café',after='FND-05',words=['water','tea','coffee','apple','bread','how much'],
 situation='Menu de porções: water 1, tea 2, coffee 3, apple 2, bread 1 crédito. Rodada 1: A pede water, an apple e some bread; B informa total. Rodada 2: B pede tea e depois muda para coffee com No. Coffee, please. A confirma preço novo. Perguntem How much? antes do preço. Cada pessoa registra os produtos finais, não o pedido abandonado.',
 result='Rodada 1: water + apple + bread = 4. Rodada 2: coffee = 3, não tea = 2; não somar o produto cancelado. Some bread, please pede pão como alimento; preço aqui é de uma porção do cardápio. Erro aritmético deve ser registrado separadamente da identificação lexical.',
 phon='Escute TEA e COFfee antes de iniciar. O ouvinte identifica produto e preço em campos separados.',
 pitfall='Não transformar some bread em quantidade universal de pão. O cardápio define a porção; coffee aqui é bebida.'),
 dict(id='LEX-PRE-07',title='Confirmar o encontro certo',after='FND-06',words=['today','Monday','Friday','at ten','room','code'],
 situation='Neste cenário fictício, hoje é Monday. Cartão A: English today, at ten in the morning, Room 2, Code 615. Cartão B: English on Friday, at ten in the morning, Room 8, Code 370. Cada pessoa passa sua informação ao parceiro. O parceiro registra se é hoje ou sexta-feira, hora, sala e código. Depois explica em português por que dois encontros at ten não são necessariamente o mesmo encontro.',
 result='A: hoje/segunda, 10h da manhã, sala 2, código 615. B: sexta, 10h da manhã, sala 8, código 370. Today depende do dia do cenário. Código não é sala. Usar o cenário fornecido, mesmo se o dia real da aplicação for diferente.',
 phon='Separar DAY / TIME / ROOM / CODE por pausas. Confirmar cada campo que o interlocutor não recuperou.',
 pitfall='Não ensinar at ten como sempre 10h da manhã: o complemento in the morning explicita o período aqui.')
]

GROUPS += [
 dict(id='LEX-PRE-08',title='Ler quantidades e códigos de zero a cinco',after='FND-03',words=['zero','one','two','three','four','five'],situation='A recepção tem cartões impressos: 0 zero; 1 one; 2 two; 3 three; 4 four; 5 five. B recebe nome fictício Jo e código 3–0–2. B diz My name is Jo. Code: three, zero, two. A escreve algarismos e devolve o código para conferência. Troquem com Ana e 5–1–4. Depois A mostra uma caneta e dois livros com rótulos one pen / two books. B escolhe a quantidade solicitada. Aprenda primeiro 0–2 e depois 3–5 se necessário; manter cartão de apoio não é erro.',result='Jo → 302; Ana → 514. Código se lê por algarismos, sem formar números de centenas. One pen é uma caneta; two books dois livros. A só marca código confirmado após restituição de B. Modelo: Code? — Three, zero, two. — Three, zero, two? — Yes. Thank you.',phon='Com parceiro, ele lê três algarismos sem mostrar o código; ouvinte escreve e confirma. Sem leitura oral disponível, fazer correspondência escrita e registrar leitura, não escuta. Zero deve ser distinguido da letra O neste pacote.',pitfall='Sem aritmética exigida. Não pedir dados reais de telefone ou documento. Plurais de objetos vêm como blocos; o alvo é quantidade e ordem, não flexão produtiva generalizada.'),
 dict(id='LEX-PRE-09',title='Conferir sala e preço de seis a dez',after='FND-05',words=['six','seven','eight','nine','ten'],situation='Antes desta sequência, retome os cartões 0–5 de LEX-PRE-08; se ainda impedirem a tarefa, ofereça apoio e pratique novamente. Novos cartões: 6 six; 7 seven; 8 eight; 9 nine; 10 ten. A tem sala 6, preço 8 créditos; B tem sala 9, preço 10. Perguntem Room? e How much? com tradução Sala? / Quanto?. Respostas-modelo: Room six. Eight credits. Depois leiam código 7–1–0 por algarismos, com quadro 0–10 disponível.',result='A: Room six; eight credits. B: Room nine; ten credits. Código: seven, one, zero. Não transformar sala em preço. Ten como quantidade é 10; código 1–0 lido one, zero. Os créditos são fictícios, sem conversão monetária.',phon='O parceiro fala sala e preço; ouvinte preenche duas linhas rotuladas Sala/Preço e devolve para confirmação. Não avaliar sotaque nativo; priorizar número e categoria compreendidos.',pitfall='Rever LEX-PRE-08 antes de usar código. Dividir 6–8 e 9–10 se a carga for alta. O aluno pode apontar cartão antes de produzir oralmente; registrar apoio usado.'),
 dict(id='LEX-PRE-10',title='Pedir reparo e terminar uma conversa',after='FND-02',words=['goodbye','sorry','excuse me','I don’t understand'],situation='A recepção está livre. B chama atenção: Excuse me. A diz nome Ana; B registra Lia no cartão. A aponta Ana; B repara: Sorry. Ana. A dá uma instrução curta do repertório anterior, Read, please. Se B não entender, usa I don’t understand. Again, please. A repete ou aponta modelo em português. Ao terminar, ambos dizem Goodbye. Troquem nomes fictícios e usem Write, please. Oferecer os blocos completos por escrito.',result='Chamar atenção → Excuse me. Reparar → Sorry. Ana. Pedir apoio → I don’t understand. Again, please. Encerrar → Goodbye. O uso de I don’t understand para pedir ajuda é ação comunicativa válida, não fracasso a punir.',phon='Ensaie os quatro blocos em contexto e peça ao colega identificar função: chamar, reparar, pedir ajuda, despedir-se. Não exigir análise sonora de cada palavra nem auxiliar do isolado.',pitfall='Não ensinar sorry/excuse me como categorias absolutamente exclusivas; aqui cada uma tem função local. Não exigir revelação de dificuldade pessoal: a confusão faz parte do papel fictício.'),
 dict(id='LEX-PRE-11',title='Reconhecer objetos e uma placa de banheiro',after='FND-04',words=['key','cup','door','toilet'],situation='Monte quatro cartões textuais ou objetos/desenhos: chave/key; xícara/cup; porta/door; banheiro/toilet. A coloca a chave ao lado da xícara. B pede My key, please usando cartão fictício que identifica a chave como sua; A aponta ou entrega. B identifica a xícara com This is a cup. Depois B pede Excuse me. Toilet, please? usando bloco integral glossado; A aponta placa Toilet e diz Here. Troquem disposição dos cartões.',result='Entregar chave, não xícara. This is a cup identifica objeto. Toilet indica banheiro nesta placa; Here acompanha indicação do local. Não avaliar localização física do banheiro real nem usar chave real de segurança. Modelo: My key, please. — Here. — Thank you.',phon='Leia rótulo e peça que colega aponte o cartão sem olhar a palavra; alternar posição evita resposta pela memória espacial. Se usar só descrições escritas, registrar compreensão escrita.',pitfall='Toilet pode indicar vaso ou banheiro conforme contexto. Restroom/bathroom podem ser oferecidos receptivamente com tradução se surgirem; não adicionar automaticamente à avaliação. O pedido curto é adequado ao objetivo inicial; expansão de frase virá depois.'),
 dict(id='LEX-PRE-12',title='Ampliar um pedido simples de comida',after='FND-05',words=['milk','juice','rice','banana'],situation='Cardápio fictício: milk/leite 2 créditos; juice/suco 3; rice/arroz 4; a banana/uma banana 1. A cliente escolhe bebida e alimento com modelos Milk, please; Rice, please; A banana, please. B aponta cada escolha antes de entregar cartões. Na segunda rodada, B oferece Coffee? quando A quer juice; A corrige No. Juice, please. Não calcular total; pergunte preço de um item por vez, usando quadro 1–4 de LEX-PRE-08 como apoio.',result='Pedido conserva bebida e alimento escolhidos. Milk ou rice não levam a neste modelo; a banana indica uma unidade. Modelo: A banana, please. — One credit. — Thank you. Correção: No. Juice, please. Quantidade two bananas pode ser praticada como bloco já impresso, sem cobrar regra geral de plural.',phon='Ouvinte escolhe cartão pela fala do pedido e confirma antes de entregar. Alternar itens existentes water/tea com novos, mantendo apoio visual; registrar quais palavras foram efetivamente reconhecidas.',pitfall='Não presumir dieta ou hábitos do aluno. Usar cardápio e escolhas fictícias, sem recomendação de saúde. Retomar números se necessários; preço não deve impedir a aprendizagem dos alimentos.'),
 dict(id='LEX-PRE-13',title='Completar a semana e entender amanhã',after='FND-06',words=['Tuesday','Wednesday','Thursday','Saturday','Sunday','tomorrow'],situation='Quadro bilíngue completo: Monday segunda; Tuesday terça; Wednesday quarta; Thursday quinta; Friday sexta; Saturday sábado; Sunday domingo. Divida em dois encontros: terça/quarta/quinta; sábado/domingo/amanhã. Cartão A: Today is Monday (Hoje é segunda). Convite Tomorrow, at ten. B marca terça às dez e confirma Tuesday? A diz Yes. Nova rodada: Today is Saturday; Tomorrow, at ten → domingo. Terceira rodada: convite Thursday; B anotou Tuesday e precisa corrigir com No. Thursday. Usar on + dia como bloco opcional.',result='Monday + tomorrow → Tuesday; Saturday + tomorrow → Sunday; Thursday não Tuesday. Modelo: Tomorrow, at ten. — Tuesday? — Yes. Dia de referência é sempre o cartão, não a data real. Não adicionar horários novos além de at ten nesta sequência.',phon='Ouça Tuesday e Thursday em frases com confirmação e use quadro português para reparar confusão. Pronúncia de Wednesday precisa de modelo oral; leitura silenciosa não demonstra produção sonora.',pitfall='Não memorizar sete dias num único teste inicial. Retomar Monday/Friday já conhecidos e adicionar blocos. Repetição imediata não conta como retomada espaçada: abrir review.md só no encontro posterior.'),
 dict(id='LEX-PRE-14',title='Identificar objetos por cor',after='FND-04',words=['red','blue','black','white'],situation='Cartões acessíveis com descrição em português: bolsa vermelha/red bag; bolsa azul/blue bag; telefone preto/black phone; xícara branca/white cup. A escolhe um item sem mostrar ao colega e pede The red bag, please ou The white cup, please com bloco impresso. B devolve nome do item/cor antes de entregar cartão. Troquem as cores das bolsas na nova rodada. Ninguém precisa distinguir cores visualmente: descrições textuais fazem parte do material.',result='A cor identifica o objeto correto entre opções. Modelo: The blue bag, please. — Blue? — Yes. Thank you. Cor vem antes do nome no bloco. Não dar crédito de identificação só porque havia um único objeto disponível; oferecer duas bolsas de cores diferentes.',phon='Contraste RED bag / BLUE bag; o parceiro deve recuperar cor e objeto, não somente palavra bag. Manter rótulos em português permite verificar significado sem discriminação cromática.',pitfall='Evitar teste dependente de visão de cores. Não exigir adjetivos além dos quatro. Modelo completo permite participação inicial; produção sem modelo é uma tentativa separada.'),
 dict(id='LEX-PRE-15',title='Apresentar pessoas com cartões de relações',after='FND-01',words=['mother','father','sister','brother'],situation='Cartão fictício de Jo: mother Ana; father Rui; sister Eva; brother Ben. Imprima tradução dos quatro termos. A assume Jo e apresenta duas pessoas usando This is my mother, Ana e This is my brother, Ben. B escolhe cartões Nome/Relação e confirma Ana: mother? Troquem para personagem Lia com mother Kim, father Sam, sister Nara, brother Lee. Trabalhar primeiro duas relações e depois as outras; aluno não precisa falar de família real.',result='Nomes e relações não podem ser trocados entre cartões. Jo → Ana mãe, Rui pai, Eva irmã, Ben irmão. Lia → Kim mãe, Sam pai, Nara irmã, Lee irmão. Frase curta My sister, Eva também comunica objetivo com apoio. Uma família fictícia é exemplo, não modelo universal.',phon='O parceiro recupera pessoa e relação a partir de duas apresentações, com repetição permitida. Não exigir contraste fonético técnico; reformular e apontar cartão de apoio quando necessário.',pitfall='Não pressupor que todos tenham ou queiram mencionar essas relações. Oferecer sempre personagens. A compreensão do parentesco pode ser explicada em português antes da tarefa inglesa.'),
 dict(id='LEX-PRE-16',title='Dizer onde está em três situações adultas',after='FND-03',words=['home','work','school'],situation='Três cartões: at home/em casa; at work/no trabalho; at school/na escola. A personagem Lee está em casa; B personagem Ana está numa escola de idiomas. Pergunta pronta Where? = Onde? A responde At home ou I’m at home; B responde I’m at school. Nova rodada: Lee no trabalho, Ana em casa. Destinatário marca personagem e localização em duas linhas. Não perguntar profissão real nem inferir que quem está na escola é criança.',result='Primeira rodada Lee → home; Ana → school. Segunda Lee → work; Ana → home. Modelo: Where? — At work. — At work? — Yes. Os blocos at home/at work/at school são apresentados inteiros; não trocar por in home sem novo ensino.',phon='Ouça I’m at HOME / WORK / SCHOOL e peça ao parceiro nomear local em português; depois inverter para produção. Se só houver texto, manter tarefa de leitura e não registrar escuta.',pitfall='Work aqui é nome no bloco at work, não verbo conjugado. School pode ser escola de idiomas para adultos. A localização não informa nacionalidade, profissão ou idade; comparar com from/in já estudados sem misturar sentidos.')
]

GROUPS += [{'id': 'LEX-PRE-17',
  'title': 'Dizer como está e pedir algo simples',
  'after': 'FND-05',
  'words': ['happy', 'sad', 'hungry', 'thirsty', 'hot', 'cold'],
  'situation': 'Cartões bilíngues: happy/feliz, sad/triste, hungry/com fome, thirsty/com sede, hot/com '
               'calor, cold/com frio. Trabalhe primeiro hungry/thirsty; depois happy/sad; por último '
               'hot/cold, em encontros diferentes se necessário. Rodada 1: Ana declara sede e pede água; Rui '
               'declara fome e pede pão. A recebe um cartão e fala I’m thirsty. Water, please ou I’m hungry. '
               'Bread, please; B aponta pedido e confirma Water? / Bread? Rodada 2: cartões Jo triste e Lee '
               'feliz; só declarar I’m sad/happy, sem explicar causa. Rodada 3: personagem com calor ou '
               'frio; destinatário marca sensação em português. Texto substitui expressão facial como pista.',
  'result': 'Ana: I’m thirsty. Water, please. Rui: I’m hungry. Bread, please. Jo: I’m sad. Lee: I’m happy. '
            'Hot/cold descrevem sensação declarada, não febre nem temperatura medida. Confirmar pedido não '
            'obriga entrega real; usar cartões. Fala com apoio e seleção por gesto são evidências '
            'diferentes.',
  'phon': 'O colega ouve uma declaração e escolhe rótulo em português, depois restitui palavra inglesa com '
          'modelo. Não inferir sensação por rosto; alternar cartões. Sem voz de parceiro, registrar leitura '
          'e ensaio, não escuta.',
  'pitfall': 'Não exigir autodescrição emocional. Cold já existe em A1 em outro contexto; novo registro '
             'pré-A1 trabalha bloco pessoal, não palavra inédita absoluta. Dar números de tentativas e '
             'apoios reais, sem classificar personalidade.'}]

GROUPS += [{'id': 'LEX-PRE-18',
  'title': 'Reconhecer partes do corpo com cartões',
  'after': 'FND-04',
  'words': ['head', 'hand', 'leg', 'foot'],
  'situation': 'Quatro cartões bilíngues: cabeça/head, mão/hand, perna/leg, pé/foot. Use desenho de boneco '
               'ou só descrições textuais; não pedir que o aluno exponha ou mova partes do corpo. A recebe '
               'sequência head–foot; fala Head, please e Foot, please. B seleciona cartões e confirma Head? '
               '/ Foot?. Troquem com hand–leg. Depois cada personagem fictício aponta uma etiqueta e diz My '
               'hand ou My leg com apoio. Mudar posição dos cartões entre rodadas evita acerto só por '
               'memória espacial.',
  'result': 'Rodada A seleciona cabeça e pé, nessa ordem. Rodada B mão e perna. My head/hand/leg/foot '
            'identifica parte do personagem. O ouvinte deve confirmar palavra e seleção; não avaliar '
            'conhecimento anatômico além dos quatro rótulos.',
  'phon': 'Ouça head/hand em frases curtas com apoio, depois contraste leg/foot. Se não há voz, fazer '
          'leitura e registrar modalidade. Não exigir pronúncia perfeita nem conhecimento de feet para '
          'avançar neste pacote.',
  'pitfall': 'Nenhuma tarefa diagnostica dor ou solicita experiência clínica. O plural feet pode ser '
             'reconhecido se surgir, mas não é alvo avaliado. Dividir dois pares em encontros se '
             'necessário.'}]

GROUPS += [{'id': 'LEX-PRE-19',
  'title': 'Pedir uma peça identificada por nome e cor',
  'after': 'FND-04',
  'words': ['coat', 'hat', 'socks', 'jacket'],
  'situation': 'Cartões com descrição em português e inglês: casaco longo vermelho/red coat; chapéu '
               'azul/blue hat; meias brancas/white socks; jaqueta curta preta/black jacket. Quadro das cores '
               'permanece visível. A escolhe cartão de pedido, B tem os quatro itens. Use The blue hat, '
               'please ou My red coat, please; B repete cor ou objeto e só então entrega cartão. Troquem '
               'pedidos, incluindo meias e jaqueta. Não usar tamanhos ou valores novos.',
  'result': 'Nome e cor precisam coincidir: blue hat não black jacket; white socks não white cup já '
            'estudada. Modelo: The black jacket, please. — Jacket? — Yes. Thank you. Socks é bloco plural; '
            'não cobrar flexão gramatical não apresentada.',
  'phon': 'Destinatário restitui objeto e cor antes da entrega. Apoio textual torna tarefa independente de '
          'percepção cromática. Ler silenciosamente não é evidência auditiva.',
  'pitfall': 'Coat/jacket delimitados pelos cartões; não alegar classificação universal de todos os '
             'agasalhos. Personagens não precisam vestir peças; escolha não pressupõe gênero ou hábito '
             'cultural.'}]

GROUPS += [{'id': 'LEX-PRE-20',
  'title': 'Confirmar quantidades de onze a dezesseis',
  'after': 'FND-03',
  'words': ['eleven', 'twelve', 'thirteen', 'fourteen', 'fifteen', 'sixteen'],
  'situation': 'Recepção fictícia; quadro visível 11 eleven, 12 twelve, 13 thirteen, 14 fourteen, 15 '
               'fifteen, 16 sixteen. Cartão A: books 11, pens 14, cups 16. Cartão B tem caixas rotuladas '
               '11/12/13/14/15/16 e não vê a lista de A. A pede Eleven books, please; B repete Eleven? antes '
               'de separar cartão. Rodada invertida: books 13, pens 12, cups 15. Um pedido de confirmação '
               'deve ser introduzido em cada rodada; ninguém movimenta objetos reais pesados. Depois o '
               'destinatário escreve três quantidades sem copiar a lista do emissor.',
  'result': 'Primeira entrega books 11, pens 14, cups 16; segunda books 13, pens 12, cups 15. A repetição '
            'precisa manter a quantidade, não apenas nomear objeto. Se há apoio numérico, registrar produção '
            'apoiada. Números 1–6 não substituem 11–16.',
  'phon': 'Ouvir e restituir dois números por vez. O falante pode repetir ou mostrar algarismo depois da '
          'tentativa; registrar quando houve apoio visual. A compreensão pode ser verificada por escolha de '
          'etiqueta, sem exigir soletração.',
  'pitfall': 'Separar apresentação em dois conjuntos de três se necessário; não testar todas as formas antes '
             'de ensino. A pessoa pode usar cartão de quantidade: esta tarefa avalia comunicação, não '
             'cálculo mental.'},
 {'id': 'LEX-PRE-21',
  'title': 'Distinguir dezessete a vinte e primeiras dezenas',
  'after': 'FND-05',
  'words': ['seventeen', 'eighteen', 'nineteen', 'twenty', 'thirty', 'forty'],
  'situation': 'Quadro: 17 seventeen, 18 eighteen, 19 nineteen, 20 twenty, 30 thirty, 40 forty. Pedido A: '
               'cups 17, pens 20, books 30. B recebe inventário com todas as etiquetas e deve repetir cada '
               'quantidade antes de marcar. B diz Thirteen? ao receber thirty; A usa No, thirty: 30 com '
               'apoio já aprendido. Inversão: cups 18, pens 19, books 40. Confira no final o inventário '
               'pedido versus separado, sem converter palavras em preço.',
  'result': 'Primeira: 17, 20, 30. Segunda: 18, 19, 40. Reparo distingue 13 de 30; consultar a sequência '
            'anterior para thirteen. Modelo: Thirty books, please. — Thirteen? — No, thirty. O objetivo é '
            'destinatário recuperar 30, não uma pronúncia idêntica à de locutor.',
  'phon': 'Compare thirteen/thirty e fourteen/forty em frases; mantenha audível final teen quando aplicável. '
          'Acento pode variar por ênfase, portanto usar confirmação e contexto, não regra absoluta de '
          'posição tônica.',
  'pitfall': 'Thirty não ensina automaticamente thirty-one etc. Compostos de dezenas e unidades devem ter '
             'apoio próprio antes de serem cobrados. Não inferir domínio de números apenas por recitar a '
             'lista em ordem.'},
 {'id': 'LEX-PRE-22',
  'title': 'Confirmar dezenas de cinquenta a cem',
  'after': 'FND-06',
  'words': ['fifty', 'sixty', 'seventy', 'eighty', 'ninety', 'one hundred'],
  'situation': 'Quadro bilíngue: 50 fifty, 60 sixty, 70 seventy, 80 eighty, 90 ninety, 100 one hundred. A '
               'tem quantidade de cartões para três mesas: mesa 1 fifty; mesa 2 eighty; mesa 3 one hundred. '
               'B anota números sem ver a lista. Inverter: mesa 1 sixty, mesa 2 seventy, mesa 3 ninety. B '
               'precisa confirmar uma quantidade com Again, please. Ofereça etiquetas prontas de 15/50, '
               '18/80, 19/90 para etapa de discriminação com voz disponível. Sem áudio ou pessoa, usar '
               'leitura e anotar modalidade escrita.',
  'result': 'Rodada 1: 50, 80, 100; rodada 2: 60, 70, 90. A pessoa deve corrigir uma troca possível entre '
            'teen e ty; não exigir contar fisicamente cem objetos. Evidência auditiva só existe se a lista '
            'foi realmente ouvida sem leitura prévia.',
  'phon': 'Fifty/fifteen, eighty/eighteen e ninety/nineteen em contexto com unidade explícita. Mudar a ordem '
          'das etiquetas. Aceitar repetição mais lenta e confirmação por número escrito depois da primeira '
          'tentativa.',
  'pitfall': 'A expansão cobre dezenas exatas, não todo sistema de numeração. Não aplicar números a '
             'dosagens, transações reais ou dados pessoais. Avaliação usa as novas quantidades de cada '
             'entrada.'}]

GROUPS += [{'id': 'LEX-PRE-23',
  'title': 'Ações e períodos do dia',
  'after': 'FND-06',
  'words': ['eat', 'drink', 'sleep', 'wash', 'morning', 'night'],
  'situation': 'Use cartões com apoio: eat bread = comer pão; drink water = beber água; wash my hands = '
               'lavar minhas mãos; sleep = dormir; morning = manhã; night = noite. A tem Morning: eat bread, '
               'drink water, wash my hands; Night: sleep. B recebe uma tabela vazia Morning/Night e registra '
               'as ações que A aponta e diz. B confirma cada ação com o bloco fornecido. Troquem: Morning: '
               'wash my hands, drink tea; Night: eat rice, sleep. No percurso autônomo, cubra o cartão, '
               'grave ou escreva os blocos e depois confira a tabela; isso é ensaio.',
  'result': 'Primeiro cartão: manhã — comer pão, beber água, lavar as mãos; noite — dormir. Segundo: manhã — '
            'lavar mãos, beber chá; noite — comer arroz, dormir. Exemplo apoiado: In the morning: eat bread, '
            'drink water, wash my hands. At night: sleep. Aceitar apontar e dizer blocos; não exigir '
            'narrativa conjugada no pré-A1.',
  'phon': 'Contraste eat e it apenas como apoio de escuta; o critério é recuperar eat/drink e morning/night '
          'no cartão. Não pontuar sotaque.',
  'pitfall': 'Não traduzir beber por eat nem impor que todos durmam à noite. O calendário é fictício e pode '
             'representar trabalho em turnos.'},
 {'id': 'LEX-PRE-24',
  'title': 'Tempo e lugar de um encontro',
  'after': 'FND-06',
  'words': ['sunny', 'rainy', 'cloudy', 'warm', 'outside', 'inside'],
  'situation': 'Cartão A: Today: rainy outside; tea inside; warm inside. Cartão B: Tomorrow: cloudy in the '
               'morning; sunny later; meeting outside. Apoio: later = depois; meeting = encontro. A informa '
               'o próprio cartão com blocos; B registra tempo e lugar. B depois informa seu cartão a A. Diga '
               'I don’t understand se faltar compreensão; confirme apontando os termos. Autônomo: faça duas '
               'notas separadas hoje/amanhã, confira os cartões e marque quais blocos precisaram de '
               'tradução.',
  'result': 'Hoje: chuvoso fora, chá dentro, ambiente interno descrito como warm. Amanhã: nublado de manhã, '
            'ensolarado depois, encontro fora. Cloudy não autoriza acrescentar chuva amanhã. Modelo: Rainy '
            'outside. Tea inside. Warm inside. Tomorrow: cloudy, then sunny; meeting outside.',
  'phon': 'Trabalhe o contraste INside/OUTside com indicação de dois lugares em desenho; confirme se o '
          'ouvinte localiza o evento.',
  'pitfall': 'Cold/hot/warm são descrições relativas; não converter em graus não fornecidos. Não interpretar '
             'sunny como garantia para planejar viagem real.'}]

GROUPS += [{'id': 'LEX-PRE-25',
  'title': 'Escolher canal e identificar um contato',
  'after': 'FND-06',
  'words': ['call', 'text', 'number', 'email', 'photo', 'click'],
  'situation': 'Use cartões fictícios, sem enviar mensagens reais: Jo, phone number 0506, email '
               'jo@example.com, photo of Jo. A lê instruções Call Jo; Text Jo; Click Open. B aponta '
               'telefone, campo de mensagem escrita e botão Open em um desenho. A pergunta number? e email?; '
               'B aponta/copia os dados. Troque para Kim, number 0804, kim@example.com, photo of Kim. '
               'Autônomo: desenhe a ficha, marque o controle pedido e confira com o cartão. Apoio: phone = '
               'telefone; Open = abrir.',
  'result': 'Jo: número 0506, e-mail jo@example.com, foto de Jo; call usa telefone, text mensagem escrita, '
            'click Open o botão Open. Kim: 0804, kim@example.com, foto de Kim. Preservar zeros iniciais. Não '
            'há envio nem cadastro real.',
  'phon': 'Diga dígitos um a um e confira a transcrição; pedir repetição é permitido. Não avaliar domínio '
          'oral de e-mail apenas pela cópia escrita.',
  'pitfall': 'Text como verbo não é qualquer tipo de comunicação. Evitar pedir dados reais e não usar links '
             'ou botões externos na simulação.'},
 {'id': 'LEX-PRE-26',
  'title': 'Pessoas, tarefa e status de trabalho',
  'after': 'FND-06',
  'words': ['worker', 'manager', 'customer', 'task', 'ready', 'finished'],
  'situation': 'Cartão de uma recepção: Manager Lee; Worker Jo; Customer Ana. Task for Jo: write Ana. Apoio: '
               'for = para. A pergunta Manager? Worker? Customer? e B aponta/diz nomes. Antes de escrever, '
               'Jo diz I am ready; depois de escrever Ana, diz I am finished. Troquem papéis com Manager '
               'Kim, Worker Rui, Customer Eva; task read Eva. Autônomo: registre nomes e dois status em '
               'ordem, sem afirmar execução se apenas leu o roteiro.',
  'result': 'Primeiro: Lee coordena, Jo trabalha, Ana é cliente; tarefa escrever Ana. Ready antes de '
            'iniciar; finished após concluir a tarefa observada. Segundo: Kim coordena, Rui trabalha, Eva é '
            'cliente; tarefa ler Eva. Saber o cargo não informa outras qualificações.',
  'phon': 'Contraste READY e FINished em dois momentos com cartões visuais; o destinatário precisa '
          'identificar se a tarefa ainda vai começar ou terminou.',
  'pitfall': 'Não confundir ready com tarefa concluída. Personagens e papéis são fictícios, sem inferência '
             'sobre profissão do aluno.'}]

GROUPS += [{'id': 'LEX-PRE-27',
  'title': 'Escolher lazer com apoio',
  'after': 'FND-06',
  'words': ['music', 'film', 'game', 'park', 'like', 'choose'],
  'situation': 'Cartão A: likes music; tomorrow park; choices music or film. Cartão B: likes games; today '
               'home; choices game or music. Apoio likes = gosta; choices = opções. Cada pessoa diz I like e '
               'aponta uma opção coerente com seu cartão; colega anota atividade, lugar e dia. Troquem '
               'cartões. Autônomo: escolha em cada ficha, diga os blocos e compare com os dados. Não enviar '
               'convites reais.',
  'result': 'A: I like music. Music, please. Park tomorrow. B: I like games. A game, please. Home today. Se '
            'a pessoa escolher outra opção, precisa informar que mudou de preferência; não inferir gosto do '
            'parceiro.',
  'phon': 'O ouvinte distingue music/film/game e today/tomorrow; pausas e apoio visual são permitidos.',
  'pitfall': 'Gosto não equivale a habilidade nem disponibilidade. Movie é alternativa a film.'},
 {'id': 'LEX-PRE-28',
  'title': 'Localizar serviço e entender uma placa',
  'after': 'FND-06',
  'words': ['hospital', 'pharmacy', 'shop', 'exit', 'wait', 'queue'],
  'situation': 'Mapa textual: A hospital; B pharmacy; C shop; D exit. Cartões: Wait here. Queue inside. A '
               'aponta uma letra; B diz lugar. Depois A lê placa e B aponta esperar aqui/fila dentro/saída. '
               'Inverta letras com novo mapa fornecido pelo professor ou desenhado pelo aluno, mantendo '
               'rótulos visíveis. Autônomo: cubra os rótulos e recupere com apoio antes de conferir.',
  'result': 'A hospital, B pharmacy, C shop, D exit. Wait here = esperar aqui; queue inside = fila dentro. '
            'Ao trocar letras, usar novo mapa, não memorizar A como hospital permanentemente.',
  'phon': 'O destinatário confirma hospital/pharmacy e inside/exit com apontar; não avaliar imitação de '
          'sotaque.',
  'pitfall': 'Não apresentar fila como senha; line aceito. São placas simuladas, sem indicação de serviço '
             'real.'},
 {'id': 'LEX-PRE-29',
  'title': 'Preparar a mesa com personagens',
  'after': 'FND-04',
  'words': ['plate', 'spoon', 'fork', 'knife', 'son', 'daughter'],
  'situation': 'Use desenhos de utensílios. Cartão de Ana: son Rui; daughter Eva. Rui: one plate, one spoon. '
               'Eva: one plate, one fork. Cartão de Lee: one plate, one knife. A apresenta filhos fictícios '
               'com This is my son/daughter; B monta a mesa de papel e confirma quantidades. Troquem Rui/Eva '
               'como destinatários, preservando utensílios conforme novo cartão. Autônomo: desenhe três '
               'lugares e escreva nomes/blocos.',
  'result': 'Três pratos no conjunto; Rui colher, Eva garfo, Lee faca. Son Rui; daughter Eva no cartão de '
            'Ana. Nenhuma relação de Lee com Ana foi fornecida.',
  'phon': 'K de knife não é pronunciado no modelo; avaliar identificação do cartão. Plural plates/spoons com '
          'números apoiados.',
  'pitfall': 'Não manipular utensílios cortantes; não presumir família real ou relação de todos os '
             'personagens.'},
 {'id': 'LEX-PRE-30',
  'title': 'Combinar dezenas e conferir preço total',
  'after': 'FND-06',
  'words': ['twenty-one', 'twenty-two', 'thirty-five', 'forty-eight', 'cent', 'total'],
  'situation': 'Tabela de apoio: twenty 20, thirty 30, forty 40, fifty 50, sixty 60, seventy 70, eighty 80, '
               'ninety 90; unidades one a nine já estudadas. Regra: dezena + unidade, sem and, com hífen: '
               'fifty-two = 52. Cartões de quantidade 21, 22, 35, 48, 57, 69, 83, 94. A lê com tabela; B '
               'registra. Preços fictícios: one book 2 credits 50 cents; one pen 1 credit 20 cents; total '
               'fornecido 3 credits 70 cents. A separa quantidade de preço; B confirma cada preço e total. '
               'Autônomo: faça duas colunas e confira.',
  'result': '21 twenty-one;22 twenty-two;35 thirty-five;48 forty-eight;57 fifty-seven;69 sixty-nine;83 '
            'eighty-three;94 ninety-four. Livro 2.50, caneta 1.20, total 3.70. Moeda fictícia tem 100 cents '
            'por credit. Não confundir 2.50 com 250 unidades.',
  'phon': 'Leia créditos e cents separadamente, em vez de exigir leitura abreviada. O receptor transcreve 35 '
          'versus 53.',
  'pitfall': 'A tabela é apoio permitido para generalizar, não lista de oito números decorados. Preço total '
             'não é preço unitário.'}]
