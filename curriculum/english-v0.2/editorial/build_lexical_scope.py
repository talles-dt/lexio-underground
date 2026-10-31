"""Domain audit: inventory tags are candidate links, never evidence of sufficiency."""
from pathlib import Path
import csv,json
ROOT=Path(__file__).resolve().parents[1]
levels=['pre-a1','a1','a2','b1','b2','c1']
domains=list(csv.DictReader((ROOT/'data/lexical-scope/domains.tsv').open(),delimiter='\t'))
lex=json.loads((ROOT/'data/lexicon.json').read_text())
seq=json.loads((ROOT/'data/lexical-sequences.json').read_text())
covered={i for s in seq for i in s['lexical_ids']}
assert len({d['id'] for d in domains})==len(domains)
rows=[]
for d in domains:
    tags=set(d['tags'].split(','))
    for level in levels:
        candidates=[x for x in lex if x['level']==level and x['domain'] in tags]
        rows.append(dict(domain_id=d['id'],domain_title=d['title'],level=level,objective=d[level],candidate_item_ids=[x['id'] for x in candidates],items_with_authored_sequence=sum(x['id'] in covered for x in candidates),mapping_status='tag_candidates_require_item_review',inventory_sufficiency='not_established',independent_review=False,pilot=False))
result=dict(approved_levels=levels,excluded_levels=['c2'],scope_confirmation='User confirmed pre-A1 through C1 on 2026-10-30',domains=rows,note='As etiquetas podem sobrepor domínios e não provam ensino da capacidade. Não somar candidatos como palavras distintas ou percentual de cobertura.')
(ROOT/'data/lexical-scope/matrix.json').write_text(json.dumps(result,ensure_ascii=False,indent=2)+'\n')
lines=['# Matriz de cobertura lexical — escopo e lacunas','', 'Matriz autoral de 17 domínios e seis níveis atualmente aprovados: 102 células de planejamento. O usuário confirmou seis níveis, pré-A1–C1, em 30/10/2026; C2 permanece fora do escopo. Nenhuma célula está declarada suficiente, revisada independentemente ou pilotada.','', 'Os números são candidatos recuperados pelas etiquetas existentes: um item pode aparecer em mais de um domínio. Presença não comprova ensino de toda a capacidade; ausência significa lacuna de inventário explícito, não ausência de qualquer palavra incidental nos textos.','', '| Domínio | Pré-A1 | A1 | A2 | B1 | B2 | C1 |','|---|---:|---:|---:|---:|---:|---:|']
for d in domains:
    values=[str(len(next(r for r in rows if r['domain_id']==d['id'] and r['level']==l)['candidate_item_ids'])) for l in levels]
    lines.append('| '+d['title']+' | '+' | '.join(values)+' |')
lines+=['','## Progressão funcional por domínio','']
for d in domains:
    lines += ['### '+d['title'],'']+[f"- **{l.upper()}:** {d[l]}." for l in levels]+['']
lines+=['## Como fechar uma célula','','1. Revisar candidatos item a item e incluir sentidos, padrões, colocações, expressões sociais e contrastes ausentes. Etiqueta ampla não basta.','2. Definir repertório obrigatório e extensões receptivas, com justificativa de função e pré-requisito; nenhuma lista numérica equivale a um nível.','3. Produzir ensino e tarefas contextualizadas nas duas modalidades, com respostas e alternativas naturais.','4. Vincular cada alvo a retomadas em outros encontros e situações novas de avaliação; distinguir produção, reconhecimento e palavras apenas presentes no texto.','5. Conferir gêneros, canais e variedades pertinentes; produzir e revisar áudio antes de declarar escuta disponível.','6. Registrar revisão independente, pilotagem e correções por célula e por item. Somente então decidir suficiência para o escopo anunciado.','','## Unidade de contagem','','Usar um registro de forma/sentido/padrão e suas exposições por nível. Reliable A2/B1, por exemplo, não representa duas palavras distintas; cada ocorrência curricular pode exigir evidência contextual diferente. A revisão de contagem deve preservar IDs e atividades existentes, sem apagar retomadas.','','## Referência e fronteira','','O CEFR descreve capacidades gerais; especificações linguísticas requerem descrições por língua. Esta matriz é decisão curricular do Lexio, não uma lista oficial do CEFR. [Conselho da Europa: descrições por língua](https://www.coe.int/en/web/common-european-framework-reference-languages/reference-level-descriptions). Consulta: 30/10/2026.','','“Completo” deverá significar suficiente para o escopo comunicativo definido e validado, não todo o vocabulário inglês ou todas as especialidades. O [protocolo de aceitação](../ACCEPTANCE.md) continua aplicável. [Cobertura das atividades atuais](COVERAGE.md).']
(ROOT/'reports/LEXICAL-SCOPE-MATRIX.md').write_text('\n'.join(lines)+'\n')
print(json.dumps({'domain_level_cells':len(rows),'sufficiency_established':0,'approved_levels':levels}))
