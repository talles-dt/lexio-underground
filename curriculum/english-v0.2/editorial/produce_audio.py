"""Offline draft audio; requires piper-tts and an externally installed licensed model.
Usage: python editorial/produce_audio.py /path/en_US-ljspeech-high.onnx
Models and engine are not distributed in this curriculum.
"""
from pathlib import Path
import sys,json,hashlib,wave,subprocess,tempfile,importlib.metadata
from piper import PiperVoice, SynthesisConfig
ROOT=Path(__file__).resolve().parents[1]
def digest(p): return hashlib.sha256(p.read_bytes()).hexdigest()
model=Path(sys.argv[1]); assert model.name=='en_US-ljspeech-high.onnx'
voice=PiperVoice.load(str(model))
queue=json.loads((ROOT/'data/audio-queue.json').read_text())
manifest_path=ROOT/'data/audio-production.json'
previous={a['id']:a for a in json.loads(manifest_path.read_text())} if manifest_path.exists() else {}
records=[]
for item in queue:
 target=ROOT/f"audio/generated/{item['id']}.mp3";target.parent.mkdir(parents=True,exist_ok=True)
 old=previous.get(item['id'])
 if old and old['script_sha256']==item['script_sha256'] and target.exists() and old['audio_sha256']==digest(target):
  records.append(old);continue
 # Announce character names when a single voice performs a dialogue.
 multiple=len({d['speaker'] for d in item['dialogue']})>1
 text=' '.join((d['speaker']+'. ' if multiple else '')+d['text'] for d in item['dialogue'])
 with tempfile.TemporaryDirectory(prefix='lexio-audio-') as temp:
  wav=Path(temp)/'speech.wav'
  with wave.open(str(wav),'wb') as out: voice.synthesize_wav(text,out,syn_config=SynthesisConfig(length_scale=1.12))
  subprocess.run(['ffmpeg','-v','error','-y','-i',str(wav),'-codec:a','libmp3lame','-b:a','96k',str(target)],check=True)
 duration=float(subprocess.check_output(['ffprobe','-v','error','-show_entries','format=duration','-of','default=noprint_wrappers=1:nokey=1',str(target)]))
 assert duration>0 and target.stat().st_size>1000
 records.append(dict(id=item['id'],script_sha256=item['script_sha256'],audio_file=target.relative_to(ROOT).as_posix(),audio_sha256=digest(target),duration_seconds=round(duration,3),generation_status='synthetic_draft',listening_review='not_performed',variety='en-US',voices=['en_US-ljspeech-high'],engine='piper-tts '+importlib.metadata.version('piper-tts'),model_sha256=digest(model),length_scale=1.12,speaker_labels_spoken=multiple,model_card='https://huggingface.co/rhasspy/piper-voices/blob/main/en/en_US/ljspeech/high/MODEL_CARD',dataset_license='public domain per model card'))
 manifest_path.write_text(json.dumps(records,ensure_ascii=False,indent=2)+'\n')
 print(item['id'],round(duration,1),flush=True)
manifest_path.write_text(json.dumps(records,ensure_ascii=False,indent=2)+'\n')
