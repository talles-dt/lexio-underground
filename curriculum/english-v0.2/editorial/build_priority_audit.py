"""Trace the priority scope without converting structural coverage into sufficiency."""
from pathlib import Path
import json,runpy
ROOT=Path(__file__).resolve().parents[1]
def read(n):return json.loads((ROOT/'data'/n).read_text())
levels=['pre-a1','a1','a2','b1'];grammar=read('grammar.json');seqs=read('lexical-sequences.json');lex=read('lexicon.json');cons=read('consolidation.json');phon=read('pronunciation.json')
lines=['# Rastreabilidade e ordem — pré-A1 até B1','','Este relatório confere o inventário autoral previsto; não demonstra que ele seja exaustivo nem substitui revisão pedagógica e pilotagem. Os 84 alvos gramaticais têm vínculo nominal com unidades. A extensão dos subcasos precisa de julgamento por amostras de uso, não por contagem.','']
allunits=[];mapping=[];itineraries=[]
for level in levels:
 units=runpy.run_path(str(ROOT/'data'/('foundation.py' if level=='pre-a1' else level+'-units.py')))['FOUNDATION' if level=='pre-a1' else 'UNITS']
 folder='foundation' if level=='pre-a1' else level
 lines += ['## '+level.upper(),'','### Ordem de estudo','']
 steps=[]
 for u in units:
  path=f"lessons/{folder}/{u['id']}/student.md";allunits.append(u['id']);steps.append(dict(kind='unit',id=u['id'],path=path))
  lines.append(f"- [{u['id']}](../{path}), seguido dos pacotes lexicais abaixo; retomada de cada pacote no encontro seguinte e avaliação em outra sessão.")
  for s in [s for s in seqs if s['level']==level and s['after']==u['id']]:
   steps.append(dict(kind='lexical',id=s['id'],path=s['student']))
   lines.append(f"  - [{s['id']} — {s['title']}](../{s['student']})")
 for u in sorted([c for c in cons if c['level']==level],key=lambda x:x['id']):
  steps.append(dict(kind='consolidation',id=u['id'],path=u['student']))
  lines.append(f"- [{u['id']} — consolidação](../{u['student']}); fazer após os pré-requisitos indicados no material.")
 for u in [p for p in phon if p['level']==level]:
  steps.append(dict(kind='pronunciation',id=u['id'],path=u['student']))
  lines.append(f"- [{u['id']} — inteligibilidade](../{u['student']}); revisitar ao longo das tarefas orais, não só no final.")
 assessment=f'assessments/{level}/student.md';steps.append(dict(kind='assessment',id='ASSESS-'+level.upper(),path=assessment))
 lines.append(f'- [Amostra avaliativa integrada](../{assessment}), junto das avaliações novas de consolidação; habilidades sem execução ficam não observadas.')
 lines += ['','### Gramática prevista e unidade de uso','','| Alvo | Ensino | Unidade vinculada |','|---|---|---|']
 for g in [g for g in grammar if g['level']==level]:
  links=[u for u in units if g['title'] in u['targets']];assert links,g['title']
  mapping.append(dict(target_id=g['id'],level=level,title=g['title'],lesson=g['lesson'],units=[u['id'] for u in links],mapping='declared_target_in_authored_unit',sufficiency='not_established'))
  refs='; '.join(f"[{u['id']}](../lessons/{folder}/{u['id']}/student.md)" for u in links)
  lines.append(f"| {g['title']} | [Microaula](../{g['lesson']}) | {refs} |")
 itineraries.append(dict(level=level,steps=steps,lexical_entries=sum(x['level']==level for x in lex)))
# Detect omitted sequences or references rather than silently losing curriculum in navigation.
assert {s['id'] for s in seqs if s['level'] in levels}=={s['id'] for i in itineraries for s in i['steps'] if s['kind']=='lexical'}
assert len(mapping)==84
for it in itineraries:
 for step in it['steps']: assert (ROOT/step['path']).is_file(),step
(ROOT/'data/priority-audit.json').write_text(json.dumps(dict(levels=levels,grammar_mapping=mapping,itineraries=itineraries,all_written_scope_validated=False,piloted=False),ensure_ascii=False,indent=2)+'\n')
lines += ['','## Limites da conferência','','- Cada linha identifica ensino e unidade que declara o alvo; isso não prova domínio de todos os usos e exceções.', '- A sequência conserva os pré-requisitos existentes; a ordem editorial deve ser ajustada após observar tempo, apoio necessário e transferência real.', '- A prática de pronúncia registra dados recuperados pelo ouvinte, sem pontuar sotaque; vozes sintéticas são apoio, não amostra validada de variedade.', '- Há materiais de autoria e critérios de observação; gravações revisadas e pilotagem real continuam pendentes.','', 'Referências de escopo: [descritores do Conselho da Europa](https://www.coe.int/en/web/common-european-framework-reference-languages/cefr-descriptors) e [guia lexical B1 Preliminary, agosto de 2025](https://www.cambridgeenglish.org/Images/506887-b1-preliminary-vocabulary-list.pdf), consultados em 01/11/2026. Os descritores organizam capacidades; a lista Cambridge orienta preparação para um exame e não é exaustiva. Não copiamos o inventário nem declaramos equivalência automática do Lexio a ele.']
(ROOT/'reports/PRIORITY-TRACEABILITY.md').write_text('\n'.join(lines)+'\n')
print('Priority itinerary checked: 84 declared grammar targets; all priority lexical sequences included.')
