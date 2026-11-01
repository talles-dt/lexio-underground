"""Package the authored edition without inventing review or proficiency evidence."""
from pathlib import Path
from collections import Counter
import json, zipfile, hashlib, argparse
root=Path(__file__).resolve().parents[1]
parser=argparse.ArgumentParser()
parser.add_argument('--edition',required=True,help='Explicit ISO date of this editorial release')
args=parser.parse_args()
from datetime import date
date.fromisoformat(args.edition)
base=root/'curriculum/english-v0.2'
materials={p.relative_to(base).as_posix():p.read_text() for p in sorted(base.rglob('*.md'))}
lex=json.loads((base/'data/lexicon.json').read_text())
sequences=json.loads((base/'data/lexical-sequences.json').read_text())
reviews=[json.loads(p.read_text()) for p in sorted((root/'curriculum/editorial-reviews').glob('*.json'))]
def review_for(path, content):
 digest=hashlib.sha256(content.encode()).hexdigest()
 matches=[r for r in reviews if r['documents'].get(path)==digest]
 return {'status':'reviewed_by_project_owner','date':matches[-1]['review_date']} if matches else {'status':'authored_after_review','date':None}
review_status={path:review_for(path,content) for path,content in materials.items()}
(root/'src/curriculum/materials.json').write_text(json.dumps(materials,ensure_ascii=False))
(root/'src/curriculum/review-status.json').write_text(json.dumps(review_status,ensure_ascii=False,indent=2)+'\n')
public=root/'public/curriculum';public.mkdir(parents=True,exist_ok=True)
archive=public/f'lexio-english-{args.edition}.zip'
# Fixed timestamps and order keep the release reproducible on an unchanged snapshot.
with zipfile.ZipFile(archive,'w',zipfile.ZIP_DEFLATED) as z:
 for p in sorted((root/'curriculum').rglob('*')):
  if p.is_file() and '__pycache__' not in p.parts and p.suffix!='.pyc':
   entry=zipfile.ZipInfo(p.relative_to(root).as_posix(),(2026,1,1,0,0,0));entry.compress_type=zipfile.ZIP_DEFLATED;entry.external_attr=0o644<<16
   z.writestr(entry,p.read_bytes())
levels=['pre-a1','a1','a2','b1','b2','c1']
reviewed=sum(all(review_status[s[field]]['status']=='reviewed_by_project_owner' for field in ['student','teacher','review','assessment','feedback']) for s in sequences)
manifest={'edition':args.edition,'levels':levels,'lexical_entries':len(lex),'lexical_sequences':len(sequences),'by_level':{level:{'entries':sum(x['level']==level for x in lex),'sequences':sum(x['level']==level for x in sequences)} for level in levels},'reviewed_sequences':reviewed,'new_or_changed_sequences':len(sequences)-reviewed,'status':'mixed_reviewed_and_new_authored_material' if reviewed<len(sequences) else 'editorially_reviewed_by_project_owner','course_complete':False,'piloted':False,'archive':archive.name,'sha256':hashlib.sha256(archive.read_bytes()).hexdigest()}
(public/'release.json').write_text(json.dumps(manifest,ensure_ascii=False,indent=2)+'\n')
(root/'src/curriculum/release.json').write_text(json.dumps(manifest,ensure_ascii=False,indent=2)+'\n')
print(json.dumps(manifest,ensure_ascii=False))
