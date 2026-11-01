"""Import an authored batch idempotently; never invent activities from headwords."""
from pathlib import Path
import csv, io, runpy, pprint, sys
ROOT=Path(__file__).resolve().parents[1]
batch=runpy.run_path(str(Path(sys.argv[1]).resolve()))
fields=['level','domain','entry','sense_pt','pattern','example','usage_note','practice','practice_answer','review','review_answer','assessment','assessment_answer']
rows=[]
for (level,domain),block in batch['BLOCKS'].items():
 for line in block.strip().splitlines():
  parts=line.split('|')
  assert len(parts)==11,parts
  assert all(p.strip() for p in parts)
  rows.append(dict(zip(fields,[level,domain]+parts)))
lexpath=ROOT/'data/lexicon.tsv'
with lexpath.open() as f:
 reader=csv.DictReader(f,delimiter='\t'); lexfields=reader.fieldnames; lex=list(reader)
keys={(r['level'],r['entry'],r['sense_pt']):r for r in lex}
assert len({(r['level'],r['entry'],r['sense_pt']) for r in rows})==len(rows)
for r in rows:
 key=(r['level'],r['entry'],r['sense_pt'])
 if key in keys: assert all(keys[key][k]==r[k] for k in lexfields),('conflicting entry',key)
 else: lex.append({k:r[k] for k in lexfields})
# Validate all tasks/groups before writing any files.
updates={}
for level in sorted({r['level'] for r in rows}):
 task=ROOT/f'data/{level}-lexical-tasks.txt'
 current=task.read_text(); mapping={line.split('|')[0]:line for line in current.splitlines() if line and not line.startswith('#')}
 additions=[]
 for r in [x for x in rows if x['level']==level]:
  key=r['entry']; assert sum(x['level']==level and x['entry']==key for x in lex)==1,('use explicit sense key',key)
  line='|'.join([key]+[r[k] for k in fields[7:]])
  if key in mapping: assert mapping[key]==line,('conflicting task',key)
  else: additions.append(line)
 if additions: updates[task]=current.rstrip()+'\n'+'\n'.join(additions)+'\n'
 groupfile=ROOT/('data/lexical-groups.py' if level=='pre-a1' else f'data/{level}-lexical-groups.py')
 groups=runpy.run_path(str(groupfile))['GROUPS']; byid={g['id']:g for g in groups}; additions=[]
 for source in [g for g in batch['GROUPS'] if g['level']==level]:
  g={k:v for k,v in source.items() if k!='level'}
  if g['id'] in byid: assert byid[g['id']]==g,('conflicting group',g['id'])
  else: additions.append(g)
 if additions: updates[groupfile]=groupfile.read_text().rstrip()+'\n\nGROUPS += '+pprint.pformat(additions,width=110,sort_dicts=False)+'\n'
def tsv(fieldnames,items):
 out=io.StringIO();w=csv.DictWriter(out,fieldnames=fieldnames,delimiter='\t',lineterminator='\n');w.writeheader();w.writerows(items);return out.getvalue()
updates[lexpath]=tsv(lexfields,lex)
batch_id=Path(sys.argv[1]).stem.replace('_','-')
updates[ROOT/f'data/lexical-scope/{batch_id}-expansion.tsv']=tsv(fields,rows)
for path,content in updates.items(): path.write_text(content)
print(f'Imported {len(rows)} authored entries and {len(batch["GROUPS"])} sequences; idempotent on rerun.')
