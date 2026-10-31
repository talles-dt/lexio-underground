"""Render authored A1 units, preserving source-specific teaching and feedback."""
from pathlib import Path
import runpy,json
ROOT=Path(__file__).resolve().parents[1]
level=globals().get('LEVEL','a1')
units=runpy.run_path(str(ROOT/'data'/f'{level}-units.py'))['UNITS']
grammar=json.loads((ROOT/'data/grammar.json').read_text())
by_title={g['title']:g for g in grammar if g['level']==level}
def write(path,text):
    p=ROOT/path;p.parent.mkdir(parents=True,exist_ok=True);p.write_text(text.strip()+'\n')
index=[]
for u in units:
    folder=f"lessons/{level}/{u['id']}"
    prerequisites=' · '.join(f"[{p}](../../foundation/{p}/student.md)" if p.startswith('FND') else f"[{p}](../../{p.split('-')[0].lower()}/{p}/student.md)" for p in u['prerequisites'])
    links='\n'.join(f"- [{title}](../../{by_title[title]['id']}.md)" for title in u['targets'])
    texts='\n\n'.join('### '+title+'\n\n'+text.replace('\n','  \n') for title,text in u['readings'])
    questions='\n'.join(f'{i+1}. {q}' for i,(q,a) in enumerate(u['questions']))
    practice='\n'.join(f'{i+1}. {q}' for i,(q,a) in enumerate(u['practice']))
    answers='\n'.join(f'{i+1}. {a}' for i,(q,a) in enumerate(u['questions']))
    practice_answers='\n'.join(f'{i+1}. {a}' for i,(q,a) in enumerate(u['practice']))
    audio=u['audio'].replace('\n','  \n');model=u['model'].replace('\n','  \n')
    write(f'{folder}/student.md',f'''# {u['id']} — {u['title']}

Estado: material autoral {level.upper()} em revisão; sem pilotagem ou aprovação CEFR. Pré-requisitos: {prerequisites}. Se um pré-requisito impedir a tarefa, volte ao apoio correspondente; não é necessário decorar todas as frases.

## O que fazer ao final

{u['goal']}

## Palavras e expressões para esta situação

{u['support']}

## Syntaxis — como construir o sentido

{u['explanation']}

## Leia para agir

{texts}

## Escute antes de olhar o roteiro

Peça a alguém que leia o roteiro do [guia do professor](teacher.md). Permita repetição. Uma voz sintética pode apoiar o estudo, desde que identificada; as gravações revisadas ainda estão pendentes. Se apenas ler a transcrição, registre leitura e deixe escuta não observada. Responda às primeiras {u.get('reading_questions',4)} perguntas pelas leituras e às {len(u['questions'])-u.get('reading_questions',4)} seguintes pela escuta.

{questions}

## Prática orientada

{practice}

Confira as respostas somente depois de tentar no [retorno comentado](feedback.md). Uma resposta alternativa pode ser válida se preservar o sentido e a forma-alvo.

## Shadow — trocar informação

{u['guided']}

O destinatário deve devolver os dados que entendeu. Troquem papéis. Sem parceiro, faça um ensaio gravado e deixe interação como não observada.

## Phonos — fazer-se entender

{u['phon']}

## Nova situação — produzir e mediar

{u['transfer']}

Faça a primeira tentativa sem copiar o modelo. Guarde sua produção e a resposta do destinatário. Use os [critérios](feedback.md) para localizar um acerto e uma necessidade de recuperação.

## Pulse — retorno em outro encontro

{u['review']}

Confira o retorno apenas depois da tentativa. No Palácio, registre duas expressões com o contexto em que foram úteis. Evite registrar só uma tradução sem situação.

## Percurso autônomo

1. Leia o objetivo e o apoio; procure os dados nas fontes e anote dúvidas.
2. Ouça, responda e faça a prática antes de consultar o retorno. Compare primeira tentativa e correção.
3. Faça a troca com parceiro ou ensaio identificado; produza a situação nova e explique os dados ao destinatário.
4. No encontro indicado, recupere o conteúdo antes de reler. Anote tempo real, apoios e próxima necessidade.

Não há prazo universal ou carga validada. Se a leitura das instruções for o obstáculo, esclareça-a em português sem fornecer a resposta em inglês.
''')
    write(f'{folder}/feedback.md',f'''# {u['id']} — retorno, modelo e critérios

[Aluno](student.md) · [Professor](teacher.md)

## Compreensão

{answers}

## Prática orientada

{practice_answers}

## Modelo da troca apoiada

{model}

## Situação nova: o que precisa ser preservado

{u['evidence']}

## Rubrica por objetivo

Registre em cada dimensão: não observado; ainda não realiza; realiza com ajuda adicional; realiza com os apoios previstos. Apoios previstos: glossário, cartões de dados, pausas e repetição; ajuda adicional: fornecer a resposta ou modelar toda a frase durante a tentativa.

| Dimensão | Evidência |
|---|---|
| Compreensão escrita | Recupera os campos solicitados nas leituras e distingue dados semelhantes |
| Compreensão oral | Recupera os dados do roteiro sem ler antes e distingue correções |
| Produção e interação | Destinatário recupera os dados finais da situação nova; o aluno confirma ou repara quando preciso |
| Escrita funcional | Registro permite ao destinatário agir conforme a situação nova |
| Mediação | Explicação em português conserva os dados e não inventa informação |
| Recursos linguísticos | Formas estudadas preservam a relação pretendida; reconhecer modelo não basta para afirmar uso produtivo |

Pausas e erros que não impedem a finalidade não apagam dados comunicados. Registre separadamente forma, informação e apoio. Não transformar a rubrica em nota CEFR.

## Recuperar

Se o problema foi dado trocado, contraste as duas fontes antes de tentar com o cenário da retomada. Se foi forma, consulte a microaula indicada no guia, refaça o item correspondente e volte ao uso. Se faltou vocabulário, selecione a expressão no apoio e pratique a frase completa. Preserve a primeira tentativa.

{u['review']}

**Retorno da retomada:** {u['review_answer']}
''')
    write(f'{folder}/teacher.md',f'''# {u['id']} — guia de condução

[Aluno](student.md) · [Retorno](feedback.md)

## Objetivo e apoios prévios

{u['goal']}

Pré-requisitos: {prerequisites}.

Microaulas suplementares:

{links}

Os nomes de famílias não significam cobertura exaustiva nesta unidade. Use exemplos pertinentes ao cenário; não exigir todas as extensões da microaula de uma vez.

## Roteiro de escuta

{audio}

Leia sem exibir o texto, com pausas naturais. Permita repetição e registre-a. Não imite variedades que não domina. Guarde as respostas da primeira tentativa antes de explicar o contraste.

## Plano de encontros

1. Verifique pré-requisitos com a retomada anterior, se disponível. Apresente cenário e glossário. Peça que localizem dados nas duas leituras e expliquem diferenças em português.
2. Leia o roteiro, recolha respostas e ofereça retorno. Trabalhe a explicação linguística e os {len(u['practice'])} itens, retomando somente contrastes necessários.
3. Separe cartões da troca apoiada: cada interlocutor vê apenas seus dados. Inverta papéis. Aplique a situação nova sem fornecer modelo, recolha o registro escrito e observe o dado recebido pelo parceiro.
4. No encontro posterior indicado, aplique a retomada com dados novos, antes da consulta. Registre duração observada; não impor estimativa como tempo necessário de aprendizagem.

## Dificuldades previsíveis e intervenção

{u['teacher']}

## Feedback e adaptação

Pergunte primeiro qual informação o parceiro recebeu. Corrija a mudança de sentido com contraste curto; depois trabalhe uma forma por vez. Permita ampliar fonte e apontar campos. Se alguém dita para outra pessoa escrever, registre produção oral com apoio, não escrita autônoma. Use personagens; não exigir exposição familiar ou financeira real.

## Modalidades e evidência

O percurso autônomo está no material do aluno e depende de apoio sonoro/parceiro quando a tarefa o exige. No percurso com professor, preserve o mesmo objetivo e os critérios do retorno. Registro por tarefa: versão, data, modalidade, resposta inicial, apoio, correção, decisão docente e nova tentativa.

Autoria não equivale a revisão independente. Avaliação de unidade e retomada não constituem exame completo de nível; fontes adicionais e pilotagem continuam necessárias.
''')
    index.append(dict(id=u['id'],title=u['title'],prerequisites=u['prerequisites'],grammar_ids=[by_title[t]['id'] for t in u['targets']],student_file=f'{folder}/student.md',teacher_file=f'{folder}/teacher.md',feedback_file=f'{folder}/feedback.md',status='written_not_reviewed_or_piloted'))
write(f'data/{level}-units.json',json.dumps(index,ensure_ascii=False,indent=2))
print(json.dumps({'level':level,'units_authored':len(index),'level_complete':False}))
