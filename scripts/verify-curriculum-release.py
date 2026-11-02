"""Verify packaging and review scope; never certify lexical sufficiency."""
from pathlib import Path
import json,hashlib,zipfile
root=Path(__file__).resolve().parents[1];base=root/'curriculum/english-v0.2'
load=lambda p:json.loads(p.read_text())
release=load(root/'public/curriculum/release.json')
assert release==load(root/'src/curriculum/release.json')
lex=load(base/'data/lexicon.json');seq=load(base/'data/lexical-sequences.json')
materials=load(root/'src/curriculum/materials.json');status=load(root/'src/curriculum/review-status.json')
assert release['levels']==['pre-a1','a1','a2','b1','b2','c1']
assert release['lexical_entries']==len(lex) and release['lexical_sequences']==len(seq)
assert set(materials)=={p.relative_to(base).as_posix() for p in base.rglob('*.md')}
assert set(materials)==set(status)
reviews=[load(p) for p in (root/'curriculum/editorial-reviews').glob('*.json')]
for key,text in materials.items():
 assert (base/key).read_text()==text,key
 digest=hashlib.sha256(text.encode()).hexdigest()
 approved=any(r['documents'].get(key)==digest for r in reviews)
 assert (status[key]['status']=='reviewed_by_project_owner')==approved,key
for level in release['levels']:
 assert release['by_level'][level]=={'entries':sum(x['level']==level for x in lex),'sequences':sum(x['level']==level for x in seq)}
assert len({s['id'] for s in seq})==len(seq)
for s in seq:
 for field in ['student','teacher','review','assessment','feedback']:assert s[field] in materials,(s['id'],field)
reviewed=sum(all(status[s[f]]['status']=='reviewed_by_project_owner' for f in ['student','teacher','review','assessment','feedback']) for s in seq)
assert release['reviewed_sequences']==reviewed
assert release['new_or_changed_sequences']==len(seq)-reviewed
archive=root/'public/curriculum'/release['archive']
assert hashlib.sha256(archive.read_bytes()).hexdigest()==release['sha256']
with zipfile.ZipFile(archive) as z:
 assert z.testzip() is None
 for name in z.namelist():
  assert name.startswith('curriculum/') and '..' not in Path(name).parts
  assert (root/name).read_bytes()==z.read(name),name
assert release['course_complete'] is False and release['piloted'] is False
print(f'Release verified: {len(lex)} entries; {len(seq)} sequences; {reviewed} reviewed; archive matches source. No completeness claim.')

queue=load(base/'data/audio-queue.json')
for asset in queue:
 if asset['audio_file']:
  for path in [base/asset['audio_file'],root/'public/curriculum'/asset['audio_file']]:
   assert hashlib.sha256(path.read_bytes()).hexdigest()==asset['audio_sha256'],path
  assert asset['duration_seconds']>0
print(f"Audio integrity verified: {sum(bool(a['audio_file']) for a in queue)} files; listening review remains separate.")
