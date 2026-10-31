"""Render authored lexical sequences and overlay coverage with exact evidence anchors."""
from pathlib import Path
import json, runpy, inspect
ROOT=Path(__file__).resolve().parents[1]
def write(path,text):
    p=ROOT/path;p.parent.mkdir(parents=True,exist_ok=True);p.write_text(inspect.cleandoc(text).strip()+'\n')
def build_level(level, task_file, group_file):
    lexicon=json.loads((ROOT/'data/lexicon.json').read_text())
    selected=[l for l in lexicon if l['level']==level]
    by_word={(l['entry'] if sum(x['entry']==l['entry'] for x in selected)==1 else l['entry']+' ['+l['sense_pt']+']'):l for l in selected}
    rows={}
    for line in (ROOT/'data'/task_file).read_text().splitlines():
        if not line or line.startswith('#'):continue
        values=line.split('|');assert len(values)==7,values
        word,*fields=values;assert word not in rows,word
        rows[word]=dict(zip(['practice','practice_answer','review','review_answer','assessment','assessment_answer'],fields))
    assert set(rows)==set(by_word), 'Lexical task inventory differs from selected level nucleus'
    groups=runpy.run_path(str(ROOT/'data'/group_file))['GROUPS']
    assert sorted(w for g in groups for w in g['words'])==sorted(rows), 'Each target must occur in one sequence'
    coverage=json.loads((ROOT/'data/coverage.json').read_text())
    index=[]
    for group in groups:
        prerequisite_folder='foundation' if group['after'].startswith('FND') else group['after'].split('-')[0].lower()
        folder=f"lessons/lexical/{group['id']}"
        student=f'{folder}/student.md';feedback=f'{folder}/feedback.md';review=f'{folder}/review.md';assessment=f'{folder}/assessment.md';teacher=f'{folder}/teacher.md'
        intro=[f"# {group['id']} — {group['title']}",'',f"Após [{group['after']}](../../{prerequisite_folder}/{group['after']}/student.md). Material autoral; não revisado independentemente nem pilotado.",'','## Percurso','', 'Primeiro estude sentidos e exemplos; depois faça a prática antes de consultar respostas. Faça a situação em dupla ou registre ensaio individual. No início do encontro seguinte, antes de reler, abra [retomada](review.md). Depois da correção e em uma sessão separada, faça a [avaliação](assessment.md), sem consultar previamente suas respostas. Datas e duração são registradas, não presumidas.','', '## Sentidos, formas e prática','']
        answers=[f"# {group['id']} — retorno comentado",'', '[Voltar](student.md). Consultar após a primeira tentativa.','']
        reviews=[f"# {group['id']} — retomada no encontro seguinte",'', '[Ensino](student.md) · [Retorno](feedback.md). Faça antes de reler o ensino; anote o apoio. Se precisar, consulte e marque tentativa com consulta. Não confundir correção imediata com retomada posterior.','']
        tests=[f"# {group['id']} — avaliação lexical",'', '[Guia de aplicação](teacher.md). Material reservado para uma sessão posterior à retomada. Instruções em português e apoio de formato são permitidos; não usar o gabarito. Registre por item produção, reconhecimento ou escuta conforme a tarefa; reconhecer uma palavra não demonstra uso produtivo.','']
        for word in group['words']:
            l=by_word[word];r=rows[word];anchor=l['id'].lower()
            intro.extend([f'<a id="{anchor}-i"></a>',f"### {word}",'',f"**Sentido:** {l['sense_pt']}. **Padrão:** {l['pattern']}. **Exemplo:** {l['example']}",'',l['usage_note'], '',f'<a id="{anchor}-p"></a>',f"**Prática:** {r['practice']}",''])
            reviews.extend([f'<a id="{anchor}-r"></a>',f"- **Item {group['words'].index(word)+1}:** {r['review']}",''])
            tests.extend([f'<a id="{anchor}-a"></a>',f"- **Item {len(tests)//3}:** {r['assessment']}",''])
            answers.extend([f"## {word}",'',f"**Prática:** {r['practice_answer']}",'',f"**Retomada:** {r['review_answer']}",'',f"**Avaliação:** {r['assessment_answer']}",''])
            for record in coverage:
                if record['target_id']==l['id']:
                    stage=record['stage'];paths={'I':student,'P':student,'U':student,'R':review,'A':assessment}
                    record.update(path=paths[stage],anchor='uso' if stage=='U' else anchor+'-'+stage.lower(),kind={'I':'authored_meaning_pattern_example','P':'authored_lexical_item','U':'authored_contextual_task','R':'authored_scheduled_retrieval_item','A':'authored_separate_lexical_assessment_item'}[stage],written=True,sufficiency='not_established')
        intro.extend(['<a id="uso"></a>','## Usar para realizar uma tarefa','',group['situation'],'','**Critério:** o destinatário precisa recuperar os dados finais indicados no [retorno](feedback.md). Marque cada palavra como usada com apoio, usada sem modelo, reconhecida somente ou não observada. Sem parceiro, há ensaio, não interação observada.','','## Phonos, Pulse, Palácio, Shadow e Syntaxis','',group['phon'],'','No Pulse, use a retomada com dados diferentes. No Palácio, guarde uma expressão com situação própria; no Shadow, troque papéis e confirme o que o ouvinte entendeu. Consulte as microaulas Syntaxis da unidade de fundamentos se uma forma bloquear o sentido.','','[Respostas e modelo de resultado](feedback.md) · [Professor](teacher.md)'])
        answers.extend(['## Resultado da situação de uso','',group['result'],'','## Recuperação','', 'Se trocar palavras, confronte as duas alternativas da prática e refaça a tarefa com novo dado. Se apenas a forma oral falhar, ouça com apoio antes de repetir. Guarde primeira tentativa e correção separadas. Não converter estes itens em nota CEFR.'])
        tests.extend(['','Após terminar, confira [respostas](feedback.md) e preserve a primeira tentativa. Tarefas realizadas sem áudio/interlocutor ficam parciais quando esses recursos forem necessários.'])
        oral_instructions='Se o item exige fala do aplicador, leia somente o dado indicado: again → five, zero, seven; slowly → eight, zero, four em ritmo inicialmente rápido mas claro; listen → Listen. Five, zero, six; stop → peça copiar 1 2 3 e diga Stop após o primeiro; how much → Three credits. Para table, mostre uma mesa ou desenho. Para spell, disponibilize o alfabeto com referência sonora. Não invente resultado quando não houver som ou parceiro.' if level=='pre-a1' and group['id'] in {'LEX-PRE-01','LEX-PRE-02','LEX-PRE-03','LEX-PRE-04','LEX-PRE-05','LEX-PRE-06','LEX-PRE-07'} else 'Para as situações orais, distribua os dados do cenário em cartões separados. O destinatário deve registrar o que entendeu; pode pedir repetição. Não leia o gabarito como estímulo. Atividades escritas não são reclassificadas como escuta.'
        teacher_text=f'''# {group['id']} — condução

    [Aluno](student.md) · [Retomada](review.md) · [Avaliação](assessment.md) · [Respostas](feedback.md)

    Pré-requisito: {group['after']}. Trabalhe apenas este conjunto antes de abrir outro. Apresente cada sentido com os exemplos e objetos/cartões correspondentes. Peça a prática; corrija sem antecipar avaliação. Distribua os cartões da situação de uso em papéis separados; quem recebe a mensagem não deve ver o cartão do colega. Inverta os papéis. Registre dados efetivamente recuperados.

    {group['pitfall']}

    ## Retomada e avaliação

    A retomada ocorre no início do encontro seguinte, antes de consultar exemplos. A avaliação ocorre em sessão posterior à retomada, com os novos dados impressos. Anote datas reais; nenhuma ocorrência é inferida da presença do arquivo. Um acerto isolado não estabelece domínio durável.

    {oral_instructions}

    ## Modalidade autônoma

    O estudante segue instruções e respostas do pacote. Uma pessoa de apoio pode ler os trechos e atuar como destinatário sem ensinar; registre sua participação. Sem parceiro, as tarefas de interação são ensaiadas e ficam pendentes de observação. Não exigir que o estudante veja um roteiro reservado para fingir compreensão auditiva.

    ## Evidência

    Por palavra: tarefa; data; resposta inicial; ajuda; canal observado; correção; próxima retomada. Em tarefas abertas, verifique se o destinatário recebeu a informação pretendida. Aceite alternativas naturais e registre quando a expressão-alvo não foi observada. Autoria concluída para este núcleo; suficiência lexical do nível, revisão independente e pilotagem continuam abertas.
    '''
        for path,content in [(student,'\n'.join(intro)),(feedback,'\n'.join(answers)),(review,'\n'.join(reviews)),(assessment,'\n'.join(tests)),(teacher,teacher_text)]:write(path,content)
        index.append(dict(level=level,id=group['id'],title=group['title'],after=group['after'],lexical_ids=[by_word[w]['id'] for w in group['words']],student=student,teacher=teacher,review=review,assessment=assessment,feedback=feedback,status='written_not_reviewed_or_piloted'))
    for item in lexicon:
        if item['level']==level:
            item['status']='authored_sequence_not_reviewed_or_piloted'
    write('data/lexicon.json',json.dumps(lexicon,ensure_ascii=False,indent=2))
    write('data/coverage.json',json.dumps(coverage,ensure_ascii=False,indent=2))
    previous=json.loads((ROOT/'data/lexical-sequences.json').read_text()) if (ROOT/'data/lexical-sequences.json').exists() else []
    if level=='pre-a1': previous=[]
    write('data/lexical-sequences.json',json.dumps(previous+index,ensure_ascii=False,indent=2))
    print(json.dumps({'level':level,'lexical_targets_with_authored_sequence':len(rows),'lexical_sequences':len(groups),'course_complete':False}))

build_level('pre-a1','pre-a1-lexical-tasks.txt','lexical-groups.py')
build_level('a1','a1-lexical-tasks.txt','a1-lexical-groups.py')
build_level('a2','a2-lexical-tasks.txt','a2-lexical-groups.py')

build_level('b1','b1-lexical-tasks.txt','b1-lexical-groups.py')

build_level('b2','b2-lexical-tasks.txt','b2-lexical-groups.py')

build_level('c1','c1-lexical-tasks.txt','c1-lexical-groups.py')
