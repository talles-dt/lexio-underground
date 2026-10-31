from pathlib import Path
import json, zipfile, hashlib
root=Path(__file__).resolve().parents[1]
base=root/'curriculum/english-v0.2'
materials={p.relative_to(base).as_posix():p.read_text() for p in sorted(base.rglob('*.md'))}
(root/'src/curriculum/materials.json').write_text(json.dumps(materials,ensure_ascii=False))
public=root/'public/curriculum'
archive=public/'lexio-english-2026-10-31.zip'
with zipfile.ZipFile(archive,'w',zipfile.ZIP_DEFLATED) as z:
 for p in sorted((root/'curriculum').rglob('*')):
  if p.is_file() and '__pycache__' not in p.parts: z.write(p,p.relative_to(root))
manifest=json.loads((public/'release.json').read_text())
manifest.update(status='editorially_reviewed_by_project_owner',review_date='2026-10-31',piloted=False,sha256=hashlib.sha256(archive.read_bytes()).hexdigest())
(public/'release.json').write_text(json.dumps(manifest,indent=2)+'\n')
