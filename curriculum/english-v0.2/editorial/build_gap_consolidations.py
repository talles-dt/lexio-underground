"""Render four authored cross-genre packages; content is not inferred from labels."""
from pathlib import Path
import runpy,json,re
ROOT=Path(__file__).resolve().parents[1]
packages=runpy.run_path(str(ROOT/'data/gap-consolidations.py'))['PACKAGES']
index=json.loads((ROOT/'data/consolidation.json').read_text())
for u in packages:
 # Repair readable numeric boundaries in authored prose, preserving identifiers/paths.
 for k in ['intro','reading','explanation','use','model','phon','teacher','review','review_answer','assessment','assessment_answer']:
  u[k]=re.sub(r'(?<=[A-Za-zÀ-ÿ])(?=\d)|(?<=\d)(?=[A-Za-zÀ-ÿ])',' ',u[k])
  u[k]=re.sub(r',(?=[A-Za-zÀ-ÿ0-9])',', ',u[k])
 folder=f"lessons/consolidation/{u['id']}"
 def write(name,text):
  p=ROOT/folder/(name+'.md');p.parent.mkdir(parents=True,exist_ok=True);p.write_text(text.strip()+'\n')
 prereq=' · '.join(f'[{x}](../../lexical/{x}/student.md)' for x in u['after'])
 def qs(pairs):return '\n'.join(f'{i+1}. {q}' for i,(q,a) in enumerate(pairs))
 def ans(pairs):return '\n'.join(f'{i+1}. {a}' for i,(q,a) in enumerate(pairs))
 write('student',f'''# {u['id']} — {u['title']}

Após {prereq}. [Professor](teacher.md) · [Retorno](feedback.md).

{u['intro']}

## Ler gêneros diferentes

{u['reading']}

{qs(u['questions'])}

## Construir sentido

{u['explanation']}

{qs(u['practice'])}

## Escutar antes de consultar a transcrição

Use o áudio do player ou a leitura do professor/parceiro. Registre voz sintética, ritmo e repetições. Se não houver som, trabalhe a transcrição como leitura e deixe escuta não observada.

{qs(u['audio_questions'])}

## Produzir e transmitir

{u['use']}

## Phonos e integração

{u['phon']}

Pulse: faça a [retomada](review.md) no próximo encontro. Palácio: guarde dois blocos com exemplos pessoais ou fictícios e o contexto. Shadow: ensaie trechos e depois mude os dados sem copiar. Syntaxis: consulte as formas destacadas na seção Construir sentido se a dificuldade impedir a tarefa. Faça a [avaliação](assessment.md) em sessão posterior.
''')
 write('teacher',f'''# {u['id']} — Professor

[Aluno](student.md) · [Retorno](feedback.md).

{u['teacher']}

## Roteiro oral reservado

**“{u['audio']}”**

Leia as perguntas com a turma antes do áudio. Não ler respostas. Repetir quando pedido, registrando apoio. Para as versões sintéticas, não atribuir identidade, origem real ou representatividade cultural à voz.

## Feedback e adaptação

Avaliar realização, fidelidade, organização, linguagem e reparo separadamente. Aceitar paráfrases naturais; para pré-A1, palavras/apontar são esperados. Preservar a primeira tentativa. Se canal oral não for acessível, oferecer escrito e registrar o canal real; não preencher escuta/interação por inferência.

{u['phon']}

Não usar produção fictícia como evidência de experiência pessoal. Recuperação: localizar o dado alterado, conferir fonte, refazer com dado diferente em encontro posterior. Sem participantes, não declarar pilotagem.
''')
 write('review',f"# {u['id']} — Retomada posterior\n\n{u['review']}\n\nRegistre data e apoio antes de abrir o [retorno](feedback.md).")
 write('assessment',f'''# {u['id']} — Avaliação em situação nova

Aplicar em sessão posterior à retomada, sem consultar retorno. Apoios indicados nas tarefas são permitidos e registrados.

{u['assessment']}

## Critérios

Registre cada dimensão como adequado nesta tarefa, adequado com apoio, precisa de nova tentativa ou não observado: fidelidade de dados; realização para o destinatário; organização; linguagem compreensível; interação/mediação efetivamente realizada. Pré-A1 pode responder com palavras, blocos e apontar. Guarde evidência de cada julgamento. Não compensar habilidade não observada com média de acertos nem atribuir nível CEFR automaticamente.

[Retorno reservado](feedback.md).
''')
 write('feedback',f'''# {u['id']} — Respostas e recuperação

[Aluno](student.md). Consultar depois da primeira tentativa.

## Leitura

{ans(u['questions'])}

## Prática

{ans(u['practice'])}

## Escuta

{ans(u['audio_questions'])}

Transcrição para conferência: {u['audio']}

## Produção: modelo possível

{u['model']}

## Retomada

{u['review_answer']}

## Avaliação

{u['assessment_answer']}

## Recuperação

Sublinhe a passagem que sustenta a informação. Se alterou número, tempo, fonte ou certeza, faça uma nova versão e compare. Se faltou palavra, volte à sequência lexical indicada; se faltou forma, use a explicação do encontro antes de tentar outro dado. Guarde tentativa inicial e revisada separadas. Reaplicar em outra sessão com dado novo, não repetir o modelo como prova de domínio.
''')
 entry=dict(id=u['id'],level=u['level'],title=u['title'],**{k:f'{folder}/{k}.md' for k in ['student','teacher','review','assessment','feedback']})
 index=[i for i in index if i['id']!=u['id']]+[entry]
(ROOT/'data/consolidation.json').write_text(json.dumps(index,ensure_ascii=False,indent=2)+'\n')
print('Rendered four authored cross-genre consolidation packages.')
