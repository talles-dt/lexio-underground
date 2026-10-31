"""Checks documentary integrity, not pedagogical validity or proficiency."""
from pathlib import Path
import json, re
from collections import Counter

root = Path(__file__).resolve().parents[1]
data = json.loads((root/'editorial/units.json').read_text())
units = data['units']
errors = []
ids = [u['id'] for u in units]
if len(ids) != len(set(ids)):
    errors.append('Duplicate unit IDs')
expected = {'pre-a1':8, 'a1':8, 'a2':8, 'b1':8, 'b2':8, 'c1':8}
if dict(Counter(u['level'] for u in units)) != expected:
    errors.append('Unexpected level coverage')
seen = set()
fields = ['goal','language','reading','audio','phon','culture','roles','final','model','mediation','transfer']
for u in units:
    for field in fields:
        if not u.get(field, '').strip():
            errors.append(f"{u['id']}: missing {field}")
    for prereq in u['prerequisites']:
        if prereq not in seen:
            errors.append(f"{u['id']}: invalid or forward prerequisite {prereq}")
    seen.add(u['id'])
    if len(u['questions']) != 4 or len(u['practice']) != 3:
        errors.append(f"{u['id']}: unexpected question/practice count")
    for question, answer in u['questions'] + u['practice']:
        if not question.strip() or not answer.strip():
            errors.append(f"{u['id']}: empty question or answer")
    f=root/u['file']
    if not f.exists():
        errors.append(f"{u['id']}: missing rendered file")
        continue
    content=f.read_text()
    for heading in ['## Percurso autônomo','## Percurso com professor','## Mediação','## Transferência','## Gabarito','## Phonos']:
        if heading not in content:
            errors.append(f"{u['id']}: missing {heading}")
    if content.count('<details>') != content.count('</details>'):
        errors.append(f"{u['id']}: unbalanced details")

markdown=list(root.rglob('*.md'))
checked_links=0
for f in markdown:
    content=f.read_text()
    for link in re.findall(r'(?<!!)\[[^\]]+\]\(([^)]+)\)', content):
        if link.startswith(('https://','http://','#','mailto:')):
            continue
        target=link.split('#')[0]
        resolved=(f.parent/target).resolve()
        # The report is written at the end of this run, including on a clean copy.
        generated_report=(root/'editorial/integrity-report.json').resolve()
        if not resolved.exists() and resolved != generated_report:
            errors.append(f'{f.relative_to(root)}: broken link {target}')
        checked_links+=1

assessments=json.loads((root/'editorial/assessments.json').read_text())
if set(assessments) != set(expected):
    errors.append('Missing exit assessment')
for lev,exam in assessments.items():
    if len(exam['questions']) != len(exam['answers']):
        errors.append(f'{lev}: answer count mismatch')

report={
 'edition':'0.1', 'check':'documentary_integrity_only',
 'units':len(units), 'levels':dict(Counter(u['level'] for u in units)),
 'base_sessions':len(units)*4, 'reading_texts':len(units), 'short_audio_scripts':len(units),
 'comprehension_questions':sum(len(u['questions']) for u in units),
 'guided_exercises':sum(len(u['practice']) for u in units),
 'transfer_tasks':len(units), 'exit_assessments':len(assessments),
 'local_links_checked':checked_links, 'markdown_files':len(markdown),
 'human_review':'pending', 'human_audio':'not_produced', 'learner_pilot':'not_started',
 'errors':errors,
}
(root/'editorial/integrity-report.json').write_text(json.dumps(report,ensure_ascii=False,indent=2)+'\n')
print(json.dumps(report,ensure_ascii=False,indent=2))
raise SystemExit(bool(errors))
