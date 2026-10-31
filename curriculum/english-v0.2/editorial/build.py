"""Build inspectable editorial inventories. Does not publish or certify a course."""
from pathlib import Path
from collections import defaultdict, Counter
import csv, json, hashlib, re

ROOT=Path(__file__).resolve().parents[1]
LEVELS=['pre-a1','a1','a2','b1','b2','c1']

def read_tsv(name):
    with (ROOT/'data'/name).open() as f:
        return [{k:v.strip() for k,v in row.items()} for row in csv.DictReader(f,delimiter='\t')]

def write(path,text):
    p=ROOT/path
    p.parent.mkdir(parents=True,exist_ok=True)
    p.write_text(text.strip()+'\n')

def dump(path,obj):
    write(path,json.dumps(obj,ensure_ascii=False,indent=2))

def ident(kind,level,title):
    return f"{kind}-{level.upper()}-{hashlib.sha256(title.encode()).hexdigest()[:6].upper()}"

grammar=read_tsv('grammar.tsv')
lexicon=read_tsv('lexicon.tsv')
for g in grammar:
    g['id']=ident('G',g['level'],g['title'])
    g['source']='LEXIO-AUTHOR-2026-10-24'
    g['level_status']='editorial_proposal_not_external_validation'
    g['mode']='productive'
    g['status']='authored_micro_lesson_not_piloted'
    g['lesson']=f"lessons/{g['id']}.md"
for l in lexicon:
    l['id']=ident('LX',l['level'],l['entry']+'|'+l['sense_pt'])
    l['source']='LEXIO-AUTHOR-2026-10-24'
    l['level_status']='editorial_proposal_not_external_validation'
    l['mode']='receptive' if l['level']=='c1' and l['domain'] in ['technology','money','learning'] else 'productive'
    l['status']='authored_entry_not_full_teaching_sequence'

# Preserve provenance for the authored lexical expansion without changing stable IDs.
for level,filename in [('b2','b2-lexical-expansion.json'),('pre-a1','pre-a1-lexical-expansion.json'),('a1','a1-lexical-expansion.json'),('a2','a2-lexical-expansion.json'),('b1','b1-lexical-expansion.json')]:
    expansion=json.loads((ROOT/'data'/filename).read_text())
    expanded={(x['entry'],x['sense_pt']) for x in expansion['entries']}
    for l in lexicon:
        if l['level']==level and (l['entry'],l['sense_pt']) in expanded:
            l['source']=expansion['source']

for row in read_tsv('lexical-scope/emotions-expansion.tsv') + read_tsv('lexical-scope/daily-domains-expansion.tsv'):
    for item in lexicon:
        if item['level']==row['level'] and item['entry']==row['entry'] and item['sense_pt']==row['sense_pt']:
            item['source']='LEXIO-AUTHOR-2026-10-30'

# Group by coherent grammatical family. These are laboratories, not complete communicative units.
FAMILY_GROUP={
 'clause':'sentence','questions':'sentence','negation':'sentence','wordorder':'sentence',
 'noun':'reference','reference':'reference','quantity':'reference','adjective':'reference',
 'present':'time','past':'time','future':'time','adverb':'time','preposition':'time',
 'modality':'decisions','condition':'decisions',
 'verbpattern':'patterns','voice':'patterns','reported':'patterns','wordformation':'patterns',
 'cohesion':'discourse','focus':'discourse','register':'discourse','pragmatics':'discourse',
}
GROUP_LABEL={'sentence':'Construir e perguntar','reference':'Identificar e quantificar','time':'Situar no tempo e no espaço','decisions':'Decidir e condicionar','patterns':'Relacionar formas e sentidos','discourse':'Organizar e adaptar o discurso'}

# Prerequisites use earlier treatment of the same family; editorial overrides handle cross-family needs.
previous_family={}
for g in grammar:
    g['prerequisites']=list(previous_family.get(g['family'],[]))
    previous_family[g['family']]=[g['id']]

groups=defaultdict(list)
for g in grammar:
    groups[(g['level'],FAMILY_GROUP[g['family']])].append(g)

labs=[]
for (level,group),items in groups.items():
    # At most three related targets per laboratory; additional targets create another laboratory.
    # This limits planning load; no claim that three targets equal a proficiency increment.
    for offset in range(0,len(items),3):
        chunk=items[offset:offset+3]
        uid=f"LAB-{level.upper()}-{group.upper()}-{offset//3+1:02}"
        lab={'id':uid,'level':level,'title':GROUP_LABEL[group], 'grammar_ids':[g['id'] for g in chunk],
             'kind':'supplementary_language_laboratory','status':'authored_not_piloted','file':f'units/{uid}.md'}
        labs.append(lab)
        for g in chunk:
            g['laboratory_id']=uid

evidence=[]
for g in grammar:
    prereq='; '.join(f"[{p}]({p}.md)" for p in g['prerequisites']) or 'Nenhum item formal anterior obrigatório; explicar a situação em português e permitir apoio visual.'
    content=f'''# {g['id']} — {g['title']}

Faixa proposta: **{g['level'].upper()}** · família: {g['family']} · modalidade-alvo: produtiva.

Estado: microaula autoral, não pilotada. Esta microaula é um recurso de ensino e prática, **não uma unidade comunicativa completa nem evidência de suficiência**. [Critérios](../ACCEPTANCE.md).

Pré-requisitos propostos: {prereq}

## Introdução — I

**O que a forma permite:** {g['rule']}

**Exemplo:** {g['example']}

**Contraste a observar:** {g['contrast']}

Leia o exemplo, identifique a informação comunicada e compare com o contraste. Se uma palavra desconhecida impedir o entendimento, esclareça-a antes da prática; não atribuir erro gramatical a falta de vocabulário.

## Compreensão e prática — P

{g['question']}

Tente sem abrir a resposta. Depois explique qual informação a forma escolhida preserva. Faça uma segunda tentativa se a primeira foi cópia do exemplo.

<details><summary>Resposta comentada</summary>

{g['answer']}

</details>

## Produção orientada — U

{g['transfer']}

Antes de produzir, decida quem fala, para quem e com que finalidade. No pré-A1, use cartão e blocos. A partir de A1, produza a mensagem mínima que realiza a ação; nos níveis altos, acrescente contexto suficiente para tornar a escolha linguística necessária. Não adicionar estruturas complexas sem função.

**Modelo linguístico de apoio:** {g['example']}

O modelo mostra a estrutura, não é uma resposta completa a toda a situação de transferência. Verifique o contraste acima ao adaptar sua produção. Correção humana ainda é necessária para avaliar usos abertos não previstos.

## Retomada posterior — R

Em outro encontro, cubra a explicação e leia apenas a tarefa de produção. Mude o referente e o destinatário: por exemplo, de você para um personagem e de conversa para bilhete. Refaça a mensagem e explique o que precisou mudar. Preserve o contraste: {g['contrast']}

O intervalo e a presença real dessa revisão no curso precisam constar no registro de execução; ter este roteiro escrito não prova que houve revisão espaçada.

## Transferência e avaliação — A

Faça a mesma ação com um dado não usado no exemplo. O parceiro recebe somente a mensagem e restitui o que entendeu. Compare com sua intenção. Sem parceiro, registre autoavaliação de produção e mantenha interação não observada.

Critérios locais: (1) o sentido pretendido foi preservado; (2) a forma serve à função; (3) o contraste não foi invertido; (4) o destinatário consegue recuperar informação essencial. Registre apoio necessário. Não somar estes critérios para produzir nota CEFR.

**Checagem do contraste:** explique por que a forma do exercício resolve o problema: {g['answer']}

Esta avaliação aberta é uma especificação com critérios. Não é item independente calibrado: o aluno já conhece exercício e resposta. Uma avaliação de saída deve usar fonte e situação inéditas.

## Percursos

**Autônomo:** leia I, tente P, confira a resposta, faça U, guarde primeira versão e programe R. Em A, use os quatro critérios e registre ausência de interlocutor quando aplicável.

**Com professor:** modele I, peça a explicação do contraste antes da regra, observe P, distribua destinatários diferentes em U e guarde um exemplo anônimo para retomar em R. Em A, acrescente pergunta de seguimento e registre o efeito do apoio.

## Componentes e recuperação

Syntaxis trabalha forma e sentido; Pulse recupera o contraste; Palácio guarda exemplo com contexto; Shadow usa a mensagem em troca; Phonos verifica que a diferença importante é audível. Nem toda microaula requer sessão separada de cada componente.

Se P falhar, retome o exemplo e peça seleção entre as duas interpretações do contraste. Se U falhar, reduza a mensagem a uma informação e ofereça início de frase. Se R falhar, aumentar apoio e repetir depois com dado diferente. Uma tentativa correta isolada não encerra o item.
'''
    write(g['lesson'],content)
    for stage,anchor,kind in [('I','introdução--i','authored_explanation'),('P','compreensão-e-prática--p','authored_closed_item'),('U','produção-orientada--u','authored_open_task'),('R','retomada-posterior--r','authored_review_protocol'),('A','transferência-e-avaliação--a','authored_assessment_brief_not_independent_item')]:
        evidence.append({'target_id':g['id'],'stage':stage,'path':g['lesson'],'kind':kind,'written':True,'reviewed_independently':False,'piloted':False,'sufficiency':'not_established'})

for lab in labs:
    gs=[g for g in grammar if g['id'] in lab['grammar_ids']]
    links='\n'.join(f"- [{g['title']}](../{g['lesson']}): {g['rule']}" for g in gs)
    write(lab['file'],f'''# {lab['id']} — {lab['title']}

Faixa proposta: {lab['level'].upper()}. Laboratório suplementar; não substitui aula de leitura, escuta, léxico e interação.

## Sequência de microaulas

{links}

## Condução

Trabalhar uma microaula por vez. Começar pelo exemplo, conferir compreensão, fazer exercício comentado e produção. Antes da próxima microaula, recuperar uma escolha da anterior. Se os contrastes se confundirem, separar encontros. O limite de três alvos é decisão de organização, não estimativa validada de carga.

As duas modalidades e as recuperações estão em cada microaula. Na modalidade com professor, o parceiro não recebe o modelo antes da primeira tentativa. Na autônoma, respostas ficam fechadas até depois da tentativa.

## Integração a construir

Escolher cenário e fonte comunicativa pertinentes no mapa de reaproveitamento. **O pacote comunicativo novo deste laboratório ainda não está escrito.** A existência dos links acima não muda esse estado. A avaliação independente de saída também permanece pendente.
''')

for level in LEVELS:
    gs=[g for g in grammar if g['level']==level]
    ls=[l for l in lexicon if l['level']==level]
    lines=[f'# Inventário gramatical — {level.upper()}','', 'Seleção autoral com nível proposto. Explicações e microaulas existem; suficiência e alinhamento externo ainda não foram estabelecidos.','', '| ID e tópico | Forma, sentido e uso | Contraste | Pré-requisitos |','|---|---|---|---|']
    for g in gs:
        lines.append(f"| [{g['id']} — {g['title']}](../{g['lesson']}) | {g['rule']} | {g['contrast']} | {', '.join(g['prerequisites']) or 'Apoio inicial'} |")
    write(f'inventory/grammar-{level}.md','\n'.join(lines))
    lines=[f'# Núcleo lexical — {level.upper()}','', '**Núcleo inicial, não inventário lexical completo do nível.** Entrada = expressão + sentido + padrão. Não há equivalência com uma lista oficial ou nota de proficiência. As entradas ainda precisam de sequências de prática e avaliações independentes.','', '| ID | Expressão e sentido | Padrão e exemplo original | Distinção de uso | Objetivo |','|---|---|---|---|---|']
    for l in ls:
        lines.append(f"| {l['id']} | **{l['entry']}** — {l['sense_pt']} | {l['pattern']}. {l['example']} | {l['usage_note']} | {l['mode']} |")
        evidence.append({'target_id':l['id'],'stage':'I','path':f'inventory/lexicon-{level}.md','kind':'authored_entry','written':True,'reviewed_independently':False,'piloted':False,'sufficiency':'not_established'})
        for stage in ['P','U','R','A']:
            evidence.append({'target_id':l['id'],'stage':stage,'path':None,'kind':'no_item_specific_evidence_registered','written':False,'reviewed_independently':False,'piloted':False,'sufficiency':'not_established'})
    write(f'inventory/lexicon-{level}.md','\n'.join(lines))

dump('data/grammar.json',grammar)
dump('data/lexicon.json',lexicon)
dump('data/laboratories.json',labs)
dump('data/coverage.json',evidence)
import runpy
foundation=runpy.run_path(str(ROOT/'data/foundation.py'))['FOUNDATION']
by_title={g['title']:g for g in grammar if g['level']=='pre-a1'}
foundation_index=[]
for f in foundation:
    f['grammar_ids']=[by_title[t]['id'] for t in f['targets']]
    base=f"lessons/foundation/{f['id']}"
    f['student_file']=base+'/student.md'
    f['teacher_file']=base+'/teacher.md'
    f['feedback_file']=base+'/feedback.md'
    f['status']='written_not_independently_reviewed_or_piloted'
    texts='\n\n'.join('### '+title+'\n\n'+text.replace('\n','  \n') for title,text in f['readings'])
    questions='\n'.join(f'{i+1}. {q}' for i,(q,a) in enumerate(f['understanding']))
    practice='\n'.join(f'{i+1}. {q}' for i,(q,a) in enumerate(f['practice']))
    wordrows=[]
    for entry in f['words']:
        candidates=[l for l in lexicon if l['entry']==entry and l['level']=='pre-a1']
        for l in candidates:
            wordrows.append(f"- **{l['entry']}**: {l['sense_pt']}. {l['example']} — {l['usage_note']}.")
    words='\n'.join(wordrows)
    model=f['model'].replace('\n','  \n')
    audio=f['audio'].replace('\n','  \n')
    write(f['student_file'],f'''# {f['id']} — {f['title']}

## Seu objetivo

Usar as informações desta unidade para agir com outra pessoa. Você pode escolher personagem fictício, apontar e pedir repetição. Não precisa falar depressa. Faça as etapas em encontros separados quando necessário.

## Antes de começar

{f['glossary']}

## Expressões de apoio

{words}

## Leia e encontre os dados

{texts}

## Escute

Peça a alguém para ler o roteiro do [guia](teacher.md), sem mostrá-lo. Pode repetir. Se estudar sozinho, use o leitor de texto do dispositivo; identifique o áudio como voz sintética. Se ler o roteiro sem ouvir, registre atividade de leitura e deixe escuta pendente.

## Confira sua compreensão

As quatro primeiras questões usam as leituras; as duas últimas usam a escuta.

{questions}

## Experimente as formas

{practice}

## Pratique com apoio

{f['guided']}

Faça uma primeira tentativa antes de consultar o modelo em [retorno](feedback.md). Depois compare um dado que acertou e um que precisa corrigir.

## Sua voz — Phonos

{f['phon']}

## Nova situação — sem copiar o modelo

{f['independent']}

Guarde o que escreveu ou gravou. Compare com os critérios em [retorno](feedback.md). Pergunte ao parceiro qual informação ele entendeu. Sem parceiro, marque ensaio, não interação observada.

## Ajude outra pessoa

{f['mediation']}

## Volte depois

{f['review']}

No Pulse, recupere uma expressão em 3 minutos e confira. No Palácio, guarde uma frase com situação e um erro que corrigiu; pode usar lista em vez de desenho. No Shadow, repita a troca com interlocutor e dado novo. No Syntaxis, consulte a microaula indicada pelo professor se uma forma bloquear o sentido.

## Percurso autônomo

Encontro 1: apoios, leituras, escuta e compreensão. Encontro 2: exercícios, correção e troca apoiada. Encontro 3: situação nova, mediação e comparação com critérios. Não há duração de eficácia validada; registre tempo real. Agende a retomada para outro dia.

Se não souber uma palavra, volte ao apoio e tente novamente. Se souber lendo, mas não ouvindo, peça trecho curto, confira roteiro e ouça de novo sem olhar. Não copie gabarito como primeira tentativa.

Registro: data____; apoio____; dado compreendido____; dificuldade____; revisão marcada____.
''')
    answers='\n'.join(f'{i+1}. {a}' for i,(q,a) in enumerate(f['understanding']))
    panswers='\n'.join(f'{i+1}. {a}' for i,(q,a) in enumerate(f['practice']))
    write(f['feedback_file'],f'''# {f['id']} — respostas e critérios

[Voltar ao material do aluno](student.md). Conferir depois da primeira tentativa.

## Compreensão

{answers}

## Prática

{panswers}

## Modelo completo da troca apoiada

{model}

## Situação nova: dados e critérios

{f['key']}

## Autoavaliação

Marque cada item: consegui com apoio / consegui sem modelo / ainda preciso praticar / não observado. (1) Mantive os dados; (2) usei expressão adequada ao pedido; (3) corrigi informação diferente; (4) meu interlocutor recuperou a mensagem. No pré-A1, pausas, repetição e cartões são apoios previstos. Este registro não é nota CEFR.

Se um dado foi trocado, isole aquele campo e refaça com novo valor. Se a frase travou, use apenas o bloco necessário e amplie depois. Registre primeira tentativa e revisão separadamente.
''')
    glinks='\n'.join(f"- [{t}](../../{by_title[t]['id']}.md)" for t in f['targets'])
    write(f['teacher_file'],f'''# {f['id']} — guia do professor

[Aluno](student.md) · [Gabaritos e modelo](feedback.md)

## Objetivos linguísticos e microaulas de apoio

{glinks}

## Roteiro de escuta original

{audio}

Leia com clareza e pausas naturais, sem acrescentar explicação durante a tentativa de escuta. Permita repetição e registre quantas foram pedidas. Não simule sotaque que não domina. Ainda não há gravação revisada.

## Condução por encontros

1. Apresente cenário, dê glossário e peça leitura com busca dos dados. Leia roteiro sem mostrar. Faça as perguntas, distinguindo leitura e escuta.
2. Retome erro que mudou informação, modele contraste e peça os oito exercícios. Distribua papéis da prática apoiada em cartões separados. Antes de inverter papéis, peça ao parceiro que restitua os dados entendidos.
3. Apresente a situação nova sem o modelo. Registre primeira tentativa, apoio e mudança de desempenho após feedback. Faça mediação para destinatário lusófono e combine revisão em outro encontro.

## O que observar nesta unidade

{f['teacher']}

## Restrições e adaptações

Usar personagens. Permitir ampliação de fonte, apontar e seleção de letras. Se transcrição substituir escuta, registrar a habilidade efetivamente observada. Não exigir relato pessoal íntimo. Compare aluno com a tarefa e apoios previstos, não com velocidade de colegas.

## Retomada concreta

{f['review']}

Anote data real de execução. A instrução estar escrita não prova que a revisão ocorreu.

## Evidência e estado

Pacote escrito com duas leituras, roteiro, seis questões, oito exercícios, troca, modelo, transferência e retorno. Não revisado independentemente, não pilotado e sem áudio final. Não declarar proficiência a partir desse pacote.
''')
    foundation_index.append({k:f[k] for k in ['id','title','grammar_ids','student_file','teacher_file','feedback_file','status']})
dump('data/foundation.json',foundation_index)
print(json.dumps({'grammar_targets':len(grammar),'lexical_entries':len(lexicon),'supplementary_laboratories':len(labs),'lexical_sequence_complete':False,'course_complete':False}))

# Render authored lexical activities after base coverage; preserve honest states.
runpy.run_path(str(ROOT / "editorial/build_lexical.py"), run_name="__main__")

runpy.run_path(str(ROOT / "editorial/build_a1.py"), run_name="__main__")

runpy.run_path(str(ROOT / "editorial/build_a1.py"), run_name="__main__", init_globals={"LEVEL":"a2"})

runpy.run_path(str(ROOT / "editorial/build_a1.py"), run_name="__main__", init_globals={"LEVEL":"b1"})

runpy.run_path(str(ROOT / "editorial/build_a1.py"), run_name="__main__", init_globals={"LEVEL":"b2"})

runpy.run_path(str(ROOT / "editorial/build_report.py"), run_name="__main__")

runpy.run_path(str(ROOT / "editorial/build_audio_queue.py"), run_name="__main__")

runpy.run_path(str(ROOT / 'editorial/build_lexical_scope.py'), run_name='__main__')
