"""Readable coverage dashboard; artifact counts do not establish proficiency."""
from pathlib import Path
import json
from collections import Counter
ROOT=Path(__file__).resolve().parents[1]
def read(name):return json.loads((ROOT/'data'/name).read_text())
lex=read('lexicon.json');grammar=read('grammar.json');coverage=read('coverage.json');seqs=read('lexical-sequences.json')
by_id={g['id']:g for g in grammar}
lines=['# Cobertura editorial — registro atual','', 'Derivado de inventários e referências de atividades. **Não é índice de proficiência, validação CEFR ou declaração de suficiência.** Escrito não significa revisado ou aplicado. Uma etapa sem referência específica pode ter exemplos em unidades; continua pendente de rastreamento e apreciação de suficiência.','', '## Léxico por nível','', '| Nível | Entradas do núcleo | Etapas I/P/U/R/A com referência | Etapas sem referência específica |','|---|---:|---:|---:|']
for level in ['pre-a1','a1','a2','b1','b2','c1']:
    ids={x['id'] for x in lex if x['level']==level};rs=[r for r in coverage if r['target_id'] in ids]
    counts=Counter(r['stage'] for r in rs if r['written'])
    lines.append(f"| {level.upper()} | {len(ids)} | {' / '.join(str(counts[s]) for s in 'IPURA')} | {sum(not r['written'] for r in rs)} |")
lines+=['', 'I = introdução; P = prática; U = uso contextualizado; R = retomada em encontro posterior; A = avaliação. Os núcleos pré-A1, A1, A2, B1, B2 e C1 têm itens de prática e avaliação próprios; situações de uso são compartilhadas por cenário. Itens de reconhecimento não demonstram automaticamente produção. Os núcleos originais tinham 40 entradas por nível; as expansões atuais estão quantificadas na tabela acima. Essas contagens não constituem cotas de suficiência. Os dois sentidos de free no A1 têm IDs e tarefas separados.']
for level in ['pre-a1','a1','a2','b1','b2','c1']:
    lines+=['',f'## Sequências lexicais {level.upper()}','', '| Pacote | Depois de | Material e avaliação |','|---|---|---|']
    for s in seqs:
        if s['level']==level:
            lines.append(f"| {s['id']} — {s['title']} | {s['after']} | [Ensino](../{s['student']}) · [Retomada](../{s['review']}) · [Avaliação](../{s['assessment']}) |")
for level in ['a1','a2','b1','b2']:
    units=read(f'{level}-units.json')
    lines+=['',f'## Primeiro bloco {level.upper()}','',f'{len(units)} unidades constituem este bloco de autoria, não a extensão final do nível. A tabela identifica famílias abordadas; subcasos de uma microaula podem exigir ensino adicional. Referência não equivale a família integralmente coberta.','', '| Unidade | Famílias abordadas |','|---|---|']
    for u in units:
        lines.append(f"| [{u['id']} — {u['title']}](../{u['student_file']}) | {'; '.join(by_id[g]['title'] for g in u['grammar_ids'])} |")
lines+=['', '## Avaliações integradas','']
for level in ['pre-a1','a1','a2','b1']:
    lines.append(f"- [{level.upper()}](../assessments/{level}/student.md): material do aluno, guia reservado, gabarito, rubrica e recuperação. Amostra de integração, não exame padronizado de nível.")
lines+=['', '## Pendências materiais e externas','', '- Ampliar inventário lexical além dos núcleos iniciais; ampliar domínios de todos os níveis, incluindo C1. Ocorrência de palavras em leituras não fecha sua sequência.', '- Ampliar os blocos de A1/A2/B1/B2 pelos domínios e gêneros ainda ausentes; continuar B2 e escrever a expansão comunicativa C1. Número de unidades deve resultar de cobertura e pilotagem.', '- Revisar subfamílias gramaticais e dependências: a cadeia por família das microaulas é hipótese editorial, não progressão validada.', '- Produzir gravações e apoios de percepção e revisar a inteligibilidade. Roteiros não são áudio entregue.', '- Realizar revisão independente, pilotos nas duas modalidades, correções e reaplicação; nenhuma dessas etapas foi inferida da existência dos arquivos.','', '[Integridade](integrity.json) verifica referências, respostas, pré-requisitos e preservação do protótipo. [Fila de áudio](../audio/README.md). Qualidade e suficiência exigem apreciação pedagógica.']
(ROOT/'reports/COVERAGE.md').write_text('\n'.join(lines)+'\n')
