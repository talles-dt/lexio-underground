"""Authored intelligibility practice; no automated accent or proficiency scoring."""
from pathlib import Path
import json,re
ROOT=Path(__file__).resolve().parents[1]
P=[
('PH-PRE-01','pre-a1','Números, objetos e pedido de repetição',
 'Treinar confirmação de13/30,15/50,18/80; quantidade e consoante final que distingue objeto. Apoio escrito e repetição são esperados. Ouça antes de olhar a transcrição.',
 'thirTEEN/THIRty; fifTEEN/FIFty; eighTEEN/EIGHty. A ênfase pode mudar na frase, então confirme o número inteiro. Pen termina com som nasal; não acrescentar vogal final obrigatória. Não use aparência do sotaque como critério.',
 'Escreva em caixas os três números ouvidos; depois registre objeto e quantidade. Pode dizer Again, please e Slowly, please. Na produção, escolha cartão 15 pens ou50pens; parceiro deve transcrever sem ver o cartão. Troquem usando18cups/80cups. Sem parceiro, grave e compare, registrando ensaio.',
 'Thirteen. Fifty. Eighteen. Two pens, please. Again, please.',
 '13,50,18; duas canetas. Pedido final pede repetição. Critério: destinatário recupera número/objeto; não exigir rótico ou sotaque específico.',
 'Próximo encontro: professor diz Thirty. Fifteen. Eighty. One pen, please. Aluno registra30,15,80,uma caneta. Em outra sessão, colega escolhe cartões16/60e19/90, com tabela de formas, para verificar transferência. Registrar item correto, com repetição ou não recuperado.'),
('PH-A1-01','a1','Vogais, plurais e terminações de passado',
 'Distinguir palavras que mudam a mensagem e perceber finais em frases curtas. Apoio: ship navio, sheep ovelha; os sentidos são fornecidos, não avaliação lexical extra.',
 'Ship/sheep diferem em qualidade vocálica e duração; não ensinar que basta prolongar qualquer i. Final plural: books /s/, bags /z/, buses /ɪz/; finais de passado: walked /t/, played /d/, wanted /ɪd/. São padrões de pronúncia, não exigência de saber alfabeto fonético. Professor modela e aluno escolhe cartão. Não acrescentar sílaba a walked/played como regra universal.',
 'Ouça seis trechos e registre palavra/quantidade ou ação, sem ler transcrição. Depois classifique endings com o professor: livros/bolsas/ônibus e walked/played/wanted. Produção: descreva ontem com I walked / I played / I wanted a ticket; colega identifica ações. Ritmo mais lento é permitido.',
 'One ship. Two sheep. Three books. Two bags. I walked to the park. I wanted a ticket.',
 'Um navio; duas ovelhas; três livros; duas bolsas; caminhou ao parque; queria um ingresso. Reconhecer frases não comprova produzir todos os finais. Modelo de classes: books/s/,bags/z/,buses/ɪz/;walked/t/,played/d/,wanted/ɪd/.',
 'Retomada: two ships, one sheep, three buses, I played a game. No encontro seguinte à retomada, professor usa four books, one bag, I wanted water e pede relato curto de ontem. Avaliar recuperação de número/ação e registrar quando final ausente gerou ambiguidade.'),
('PH-A2-01','a2','Acento de palavra, redução e sequência',
 'Perceber sílaba saliente e palavras menos fortes, sem apagar informações cruciais. Apoio: record como substantivo = registro; record como verbo = gravar. A diferença é perceptiva, não nova meta gramatical.',
 'REcord (registro) e reCORD (gravar) mostram mudança de acento. Em can + verbo, can pode soar fraco; em contraste CAN/CANNOT recebe destaque. Não ensinar can/can’t apenas por presença de t final: redução varia e contexto/contraste importam. Em put it on e switch it off, palavras se ligam, mas objeto e partícula precisam continuar reconhecíveis.',
 'Ouça e registre: pode ou não pode abrir; qual ação antes de fechar; qual controle desligar. Depois leia duas versões: I CAN come today e I can come TOMORROW. Parceiro identifica o contraste. Na tarefa procedural, diga Save it before closing it; receptor ordena salvar/fechar. Sem parceiro, grave e confira o próprio roteiro, sem alegar escuta independente.',
 'I can open the file. I cannot open the other file. Save it before closing it. Switch it off. This is a record. Please record your answer.',
 'Pode abrir primeiro arquivo, não o outro; salvar antes de fechar; desligar; a record substantivo, record your answer verbo. Não inferir erro só por ligação de palavras; erro relevante é receptor trocar possibilidade, objeto ou ordem.',
 'Retomada: I cannot come today, but I can come tomorrow. Write it down before restarting. Receptor registra amanhã e escrever antes de reiniciar. Em sessão posterior use novo procedimento com After saving, close the file. Registre se contraste/ordem foram recuperados.'),
('PH-B1-01','b1','Grupos de sentido, foco e entonação de reparo',
 'Organizar fala sustentada com pausas em fronteiras de sentido, destacar contraste e pedir confirmação. Não há meta de velocidade nem imitação de origem nacional.',
 'Compare I said TUESDAY, not Thursday e I SAID Tuesday: foco altera o contraste relevante. Pausa depois da fonte evita misturar quem afirma: According to Lee, / the plan is delayed. Pergunta de confirmação precisa permitir correção; entonação não determina sozinha intenção. Fala encadeada pode enfraquecer palavras gramaticais, mas not, fonte, data e condição não podem desaparecer do sentido.',
 'Ouça e separe data corrigida, fonte do atraso e condição da proposta. Depois apresente opinião por90segundos com uma razão e um contraponto; colega resume antes de consultar suas notas. Marque um ponto onde pausa/ênfase ajudou ou atrapalhou; refaça com outro exemplo, não repetindo tudo mecanicamente.',
 'I said Tuesday, not Thursday. According to Lee, the plan is delayed. If the room is available, we can meet there. It has not been confirmed. Do you mean next Tuesday?',
 'Data inicial afirmada terça, não quinta; atraso atribuído a Lee; encontro condicionado à disponibilidade; sem confirmação; pergunta verifica qual terça. Avaliar o que o ouvinte recuperou, não se copiou curva melódica.',
 'Retomada: relato de60–90segundos sobre texto novo com uma hipótese marcada perhaps e um dado atribuído. Avaliação posterior: fala de2minutos e pergunta espontânea do parceiro; usar esquema fonte/fato/hipótese/condição. Sem interlocutor, registrar produção individual e deixar interação não observada.')]
def prose(text):
 return re.sub(r',(?=\S)', ', ', re.sub(r'(?<=[A-Za-zÀ-ÿ])(?=\d)|(?<=\d)(?=[A-Za-zÀ-ÿ])', ' ', text))
index=[]
for ident,level,title,goal,explanation,task,script,answers,review in P:
 goal,explanation,task,answers,review=map(prose,(goal,explanation,task,answers,review))
 student_review='Em outro encontro, ouça um novo roteiro sem consultar as respostas. Registre as informações que conseguiu recuperar e peça repetição quando necessário. Depois produza exemplos com novos dados; compare com o retorno do professor ou parceiro. Sem interlocutor, registre apenas o ensaio individual.'
 folder=f'lessons/pronunciation/{ident}';path=ROOT/folder;path.mkdir(parents=True,exist_ok=True)
 def write(n,s): (path/(n+'.md')).write_text(s+'\n')
 write('student',f'# {ident} — {title}\n\n{goal}\n\n## Perceber e construir\n\n{explanation}\n\n## Praticar\n\n{task}\n\nUse voz em inglês do navegador, quando disponível, ou professor/parceiro. Voz sintética pode realizar contrastes de modo diferente do pretendido: conferir antes de usar para avaliação. Sem som, texto é apoio de leitura.\n\n## Retomar e avaliar\n\n{student_review}\n\n[Professor](teacher.md) · [Respostas](feedback.md). Registrar apoio, tentativas e dados recuperados; não atribuir pontuação de sotaque.')
 write('teacher',f'# {ident} — Professor\n\n[Aluno](student.md) · [Respostas](feedback.md).\n\nLeia perguntas e apoios antes; mantenha transcrição reservada na primeira tentativa. Planejar 15–25 minutos, a medir. Modelar contraste de forma clara, sem caricaturar sotaque.\n\n## Roteiro\n\n**“{script}”**\n\n## Condução\n\n{explanation}\n\n{review}\n\nRegistre se o destinatário identificou sentido, se pediu repetição e se a segunda tentativa resolveu. Não marcar aquisição pela escuta passiva. Para surdez ou outra necessidade, adapte canal e registre leitura/produção escrita como tal. Não inferir origem nacional a partir da voz.')
 write('feedback',f'# {ident} — Retorno\n\n[Aluno](student.md).\n\n{answers}\n\nTranscrição: {script}\n\nRecuperação: identificar qual contraste causou troca de informação, ouvir modelo compreensível e tentar com novo dado em outra sessão. A mesma resposta decorada não prova transferência.\n\n{review}')
 index.append(dict(id=ident,level=level,title=title,student=f'{folder}/student.md',teacher=f'{folder}/teacher.md',feedback=f'{folder}/feedback.md'))
(ROOT/'data/pronunciation.json').write_text(json.dumps(index,ensure_ascii=False,indent=2)+'\n')
