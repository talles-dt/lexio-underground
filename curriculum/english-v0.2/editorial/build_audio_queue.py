"""Prepare exact dialogue scripts; this does not generate or validate audio."""
from pathlib import Path
import runpy,json,hashlib,re
ROOT=Path(__file__).resolve().parents[1]
items=[]
for kind,source,key in [('foundation','foundation.py','FOUNDATION'),('a1','a1-units.py','UNITS'),('a2','a2-units.py','UNITS'),('b1','b1-units.py','UNITS'),('b2','b2-units.py','UNITS')]:
    for u in runpy.run_path(str(ROOT/'data'/source))[key]:
        items.append((u['id'],f"lessons/{kind}/{u['id']}/teacher.md",u['audio'],False))
for level in ['pre-a1','a1','a2','b1']:
    path=f'assessments/{level}/teacher.md'
    script='\n'.join(line.removeprefix('> ').rstrip() for line in (ROOT/path).read_text().splitlines() if line.startswith('> '))
    items.append(('ASSESS-'+level.upper(),path,script,True))
# Consolidation scripts are extracted from the authored teacher page, not duplicated.
for unit in json.loads((ROOT/'data/consolidation.json').read_text()):
    source=unit['teacher']
    matches=re.findall(r'\*\*“([^”]+)”\*\*', (ROOT/source).read_text())
    assert len(matches)==1, ('Expected one exact consolidation script', unit['id'])
    items.append((unit['id'],source,'Narrator: '+matches[0],False))
queue=[]
for ident,source,script,reserved in items:
    dialogue=[]
    for line in script.splitlines():
        speaker,text=line.split(':',1)
        # Parenthetical Portuguese glosses guide the reader; they are not spoken English.
        text=re.sub(r'\s*\([^)]*\)','',text).strip()
        dialogue.append({'speaker':speaker.strip(),'text':text})
    text='\n'.join(f"{d['speaker']}: {d['text']}" for d in dialogue)+'\n'
    filename=f'audio/scripts/{ident}.txt';p=ROOT/filename;p.parent.mkdir(parents=True,exist_ok=True);p.write_text(text)
    queue.append(dict(id=ident,source=source,script_file=filename,script_sha256=hashlib.sha256(text.encode()).hexdigest(),dialogue=dialogue,reserved_assessment=reserved,audio_file=None,generation_status='not_produced',listening_review='not_performed',variety=None,voices=None))
(ROOT/'data/audio-queue.json').write_text(json.dumps(queue,ensure_ascii=False,indent=2)+'\n')
