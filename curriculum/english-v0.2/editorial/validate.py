"""Check editorial integrity; passing does not establish pedagogical sufficiency."""
from pathlib import Path
import json, hashlib, re, runpy
from collections import Counter
ROOT = Path(__file__).resolve().parents[1]
errors=[]
def check(ok, message):
    if not ok: errors.append(message)
def read(name): return json.loads((ROOT/'data'/name).read_text())
grammar, lexicon, coverage = read('grammar.json'), read('lexicon.json'), read('coverage.json')
all_ids=[x['id'] for x in grammar+lexicon]
check(len(all_ids)==len(set(all_ids)), 'Duplicate inventory IDs')
by_id={g['id']:g for g in grammar}
levels=['pre-a1','a1','a2','b1','b2','c1']
visited=set(); active=set()
def visit(ident):
    if ident in active: errors.append('Prerequisite cycle: '+ident); return
    if ident in visited: return
    active.add(ident)
    for pre in by_id[ident]['prerequisites']:
        check(pre in by_id, 'Unknown prerequisite '+pre)
        if pre in by_id:
            check(levels.index(by_id[pre]['level'])<=levels.index(by_id[ident]['level']), 'Higher-level prerequisite '+ident)
            visit(pre)
    active.remove(ident);visited.add(ident)
for g in grammar:
    visit(g['id'])
    for field in ['rule','example','contrast','question','answer','transfer']:
        check(bool(g[field].strip()),g['id']+' missing '+field)
    check((ROOT/g['lesson']).is_file(),'Missing lesson '+g['id'])
pairs=Counter((x['target_id'],x['stage']) for x in coverage)
for ident in all_ids:
    for stage in 'IPURA': check(pairs[ident,stage]==1,'Missing/duplicate stage '+ident+stage)
for row in coverage:
    check(row['target_id'] in all_ids, 'Unknown coverage target')
    if row['written']: check(bool(row['path']) and (ROOT/row['path']).is_file(),'Missing evidence '+row['target_id'])
    if row.get('anchor'):
        check(f'id="{row["anchor"]}"' in (ROOT/row['path']).read_text(),'Missing evidence anchor '+row['target_id']+row['stage'])
    if row['piloted'] or row['reviewed_independently']:
        check(bool(row.get('review_evidence')),'Review/pilot claim without evidence reference')
foundation=runpy.run_path(str(ROOT/'data/foundation.py'))['FOUNDATION']
titles={g['title'] for g in grammar if g['level']=='pre-a1'}
for f in foundation:
    check(set(f['targets'])<=titles,'Unknown foundation grammar '+f['id'])
    check(len(f['understanding'])==6 and len(f['practice'])==8,'Incomplete foundation tasks '+f['id'])
    for q,a in f['understanding']+f['practice']: check(bool(q.strip() and a.strip()),'Empty task/answer '+f['id'])
    for name in ['student','teacher','feedback']: check((ROOT/'lessons/foundation'/f['id']/(name+'.md')).is_file(),'Missing foundation file')
unit_indexes={}
known={f['id'] for f in foundation}
for level in ['a1','a2','b1','b2']:
    source=runpy.run_path(str(ROOT/'data'/f'{level}-units.py'))['UNITS']
    unit_indexes[level]=read(f'{level}-units.json')
    for u in source:
        check(set(u['prerequisites'])<=known,'Forward or missing prerequisite '+u['id'])
        check(set(u['targets'])<={g['title'] for g in grammar if g['level']==level},'Unknown grammar '+u['id'])
        check(len(u['readings'])>=2 and 0<u.get('reading_questions',4)<len(u['questions']) and bool(u['practice']),'Incomplete material '+u['id'])
        for field in ['goal','support','explanation','audio','guided','model','transfer','evidence','review','review_answer','phon','teacher']:
            check(bool(u.get(field)), 'Missing field '+u['id']+field)
        for q,a in u['questions']+u['practice']: check(bool(q.strip() and a.strip()),'Empty task/answer '+u['id'])
        check(u['review_answer'] not in (ROOT/'lessons'/level/u['id']/'student.md').read_text(), 'Review answer exposed in student task '+u['id'])
        known.add(u['id'])
    for u in unit_indexes[level]:
        for field in ['student_file','teacher_file','feedback_file']:
            check((ROOT/u[field]).is_file(),'Missing unit file '+u['id'])
# Guard the declared priority grammar mapping and navigation, without asserting sufficiency.
priority=read('priority-audit.json')
check(priority['levels']==['pre-a1','a1','a2','b1'],'Priority level scope changed')
expected_priority={g['id'] for g in grammar if g['level'] in priority['levels']}
check({g['target_id'] for g in priority['grammar_mapping']}==expected_priority,'Priority grammar mapping incomplete')
for itinerary in priority['itineraries']:
    ids=[step['id'] for step in itinerary['steps']]
    check(len(ids)==len(set(ids)),'Duplicate itinerary step '+itinerary['level'])
    for step in itinerary['steps']:
        check((ROOT/step['path']).is_file(),'Missing itinerary material '+step['id'])
pronunciation=read('pronunciation.json')
check({u['level'] for u in pronunciation}==set(priority['levels']),'Pronunciation priority levels missing')
for unit in pronunciation:
    for field in ['student','teacher','feedback']:
        check((ROOT/unit[field]).is_file(),'Missing pronunciation '+unit['id']+field)
b2_source=runpy.run_path(str(ROOT/'data/b2-units.py'))['UNITS']
b2_covered={t for u in b2_source for t in u['targets']}
b2_expected={g['title'] for g in grammar if g['level']=='b2'}
check(b2_covered==b2_expected,'B2 grammar families missing from authored communicative units')
for review_id in ['review-01','review-02']:
    for name in ['student','teacher','feedback']:
        check((ROOT/'lessons/b2'/review_id/(name+'.md')).is_file(),'Missing B2 review package '+review_id)
lex_sequences=read('lexical-sequences.json')
sequence_counts={}
for level in ['pre-a1','a1','a2','b1','b2','c1']:
    selected=[s for s in lex_sequences if s['level']==level]
    sequenced=[i for seq in selected for i in seq['lexical_ids']]
    expected={l['id'] for l in lexicon if l['level']==level}
    check(set(sequenced)==expected and len(sequenced)==len(expected),'Lexical sequence gap/duplication '+level)
    sequence_counts[level]={'sequences':len(selected),'targets':len(sequenced)}
for seq in lex_sequences:
    check(seq['after'] in known,'Unknown lexical prerequisite')
    for field in ['student','teacher','feedback','review','assessment']: check((ROOT/seq[field]).is_file(),'Missing lexical file')
for level in ['pre-a1','a1','a2','b1']:
    for name in ['student','teacher','feedback']:
        check((ROOT/'assessments'/level/(name+'.md')).is_file(),'Missing assessment '+level)
consolidation=read('consolidation.json')
check(len({u['id'] for u in consolidation})==len(consolidation),'Duplicate consolidation ID')
check({u['level'] for u in consolidation}=={'pre-a1','a1','a2','b1'},'Consolidation priority levels missing')
for unit in consolidation:
    for field in ['student','teacher','review','assessment','feedback']:
        check((ROOT/unit[field]).is_file(),'Missing consolidation '+unit['id']+' '+field)
audio_queue=read('audio-queue.json')
for asset in audio_queue:
    script=ROOT/asset['script_file']
    check(script.is_file() and hashlib.sha256(script.read_bytes()).hexdigest()==asset['script_sha256'],'Audio script drift '+asset['id'])
    check(bool(asset['dialogue']) and all(d['text'] and d['speaker'] for d in asset['dialogue']),'Empty audio dialogue '+asset['id'])
    check((ROOT/asset['source']).is_file(),'Missing audio source '+asset['id'])
    if asset['audio_file']: check((ROOT/asset['audio_file']).is_file(),'Claimed audio missing '+asset['id'])
manifest=read('prototype-manifest.json')
for path,digest in manifest['files'].items():
    file=ROOT/manifest['source']/path
    check(file.is_file() and hashlib.sha256(file.read_bytes()).hexdigest()==digest,'Prototype changed: '+path)
lex_scope=json.loads((ROOT/'data/lexical-scope/matrix.json').read_text())
check(lex_scope['approved_levels']==levels,'Lexical scope levels differ from approved six-level scope')
check(lex_scope['excluded_levels']==['c2'],'C2 scope drift')
lex_ids={x['id'] for x in lexicon}
cells=lex_scope['domains']
check(len(cells)==102 and len({(c['domain_id'],c['level']) for c in cells})==102,'Lexical domain matrix gap or duplicate')
for c in cells:
    check(set(c['candidate_item_ids'])<=lex_ids,'Unknown item in lexical scope '+c['domain_id'])
    check(bool(c['objective'].strip()),'Missing lexical domain objective')
links=0
for file in ROOT.rglob('*.md'):
    for target in re.findall(r'\[[^\]]*\]\(([^)]+)\)',file.read_text()):
        if '://' in target or target.startswith('#'): continue
        target=target.split('#')[0]
        if target:
            links+=1
            check((file.parent/target).exists() or (file.parent/target).resolve()==(ROOT/'reports/integrity.json').resolve(),f'Broken link {file.relative_to(ROOT)}: {target}')
report={'integrity_passed':not errors,'errors':errors,'local_links_checked':links,'prototype_files_unchanged':len(manifest['files']) if not any('Prototype changed' in e for e in errors) else False,'grammar_targets':len(grammar),'lexical_entries':len(lexicon),'foundation_packages':len(foundation),'communicative_units':{k:len(v) for k,v in unit_indexes.items()},'b2_grammar_families_in_units':len(b2_covered),'consolidation_packages':len(consolidation),'pronunciation_packages':len(pronunciation),'priority_grammar_targets_mapped':len(expected_priority),'audio_scripts_prepared':len(audio_queue),'audio_files_produced':sum(bool(a['audio_file']) for a in audio_queue),'lexical_sequences':sequence_counts,'lexical_stages_without_registered_evidence':sum(not r['written'] for r in coverage if r['target_id'].startswith('LX-')),'independent_review':False,'piloted':False,'course_complete':False,'scope':'Structural checks only; no CEFR certification or content sufficiency judgment.'}
(ROOT/'reports/integrity.json').write_text(json.dumps(report,ensure_ascii=False,indent=2)+'\n')
print(json.dumps(report,ensure_ascii=False,indent=2))
raise SystemExit(bool(errors))
