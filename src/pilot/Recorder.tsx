'use client';
import { useEffect, useRef, useState } from 'react';
export function Recorder({ label, onRecorded }: { label: string; onRecorded: () => void }) {
  const [status, setStatus] = useState<'idle'|'requesting'|'recording'|'processing'|'ready'>('idle');
  const [url, setUrl] = useState(''); const [error, setError] = useState('');
  const recorder = useRef<MediaRecorder | null>(null); const stream = useRef<MediaStream | null>(null);
  const timer = useRef<ReturnType<typeof setTimeout>>(); const audioUrl = useRef(''); const alive = useRef(true);
  useEffect(() => { alive.current = true; return () => { alive.current = false; clearTimeout(timer.current); if (recorder.current?.state === 'recording') recorder.current.stop(); stream.current?.getTracks().forEach(t => t.stop()); URL.revokeObjectURL(audioUrl.current); }; }, []);
  const stop = () => { if (recorder.current?.state === 'recording') { setStatus('processing'); recorder.current.stop(); } };
  const start = async () => {
    if (status === 'requesting' || status === 'recording' || status === 'processing') return;
    setError(''); setStatus('requesting');
    try {
      if (!navigator.mediaDevices?.getUserMedia || !window.MediaRecorder) throw new Error('unsupported');
      const input = await navigator.mediaDevices.getUserMedia({ audio: true });
      if (!alive.current) { input.getTracks().forEach(t => t.stop()); return; }
      stream.current = input;
      const mime = ['audio/webm;codecs=opus','audio/mp4','audio/webm'].find(t => MediaRecorder.isTypeSupported(t));
      const rec = new MediaRecorder(input, mime ? { mimeType: mime } : undefined); recorder.current = rec;
      const chunks: Blob[] = [];
      rec.ondataavailable = e => { if (e.data.size) chunks.push(e.data); };
      rec.onstop = () => {
        clearTimeout(timer.current); input.getTracks().forEach(t => t.stop());
        if (!alive.current) return;
        const blob = new Blob(chunks, { type: rec.mimeType });
        if (!blob.size) { setError('Nenhum áudio foi capturado. Tente novamente.'); setStatus('idle'); return; }
        URL.revokeObjectURL(audioUrl.current); audioUrl.current = URL.createObjectURL(blob); setUrl(audioUrl.current); setStatus('ready'); onRecorded();
      };
      rec.onerror = () => { input.getTracks().forEach(t => t.stop()); clearTimeout(timer.current); if (alive.current) { setError('A gravação falhou. Tente novamente.'); setStatus('idle'); } };
      rec.start(); setStatus('recording'); timer.current = setTimeout(() => { if (rec.state === 'recording') { setStatus('processing'); rec.stop(); } }, 90000);
    } catch { stream.current?.getTracks().forEach(t => t.stop()); if (alive.current) { setError('Não foi possível usar o microfone. Verifique a permissão e use HTTPS ou localhost.'); setStatus('idle'); } }
  };
  return <div className="recording"><p>{label}</p><p className="muted">Até 90 segundos. O áudio fica nesta tela; você pode baixá-lo. Não há envio nem nota automática.</p>
    <button type="button" onClick={status === 'recording' ? stop : start} disabled={status === 'requesting' || status === 'processing'}>{status === 'recording' ? 'Parar gravação' : status === 'requesting' ? 'Aguardando microfone…' : status === 'processing' ? 'Preparando áudio…' : 'Gravar'}</button>
    <span role="status">{status === 'recording' ? ' Gravando…' : ''}</span>
    {error && <p role="alert">{error}</p>}{url && <><audio aria-label={`Ouvir gravação: ${label}`} controls src={url}/><a href={url} download="lexio-gravacao">Baixar gravação</a></>}
  </div>;
}
export function Listen({ text }: { text: string }) {
  const [message, setMessage] = useState('');
  useEffect(() => () => { window.speechSynthesis?.cancel(); }, []);
  return <><button type="button" onClick={() => {
    if (!window.speechSynthesis) { setMessage('Este navegador não oferece leitura de voz.'); return; }
    const voice = speechSynthesis.getVoices().find(v => v.localService && v.lang.replace('_','-') === 'en-US');
    if (!voice) { setMessage('Voz local en-US indisponível. Você pode continuar pela leitura.'); return; }
    speechSynthesis.cancel(); const speech = new SpeechSynthesisUtterance(text); speech.lang = 'en-US'; speech.voice = voice; speech.rate = 0.85; speech.onerror = () => setMessage('Não foi possível reproduzir a voz.'); speechSynthesis.speak(speech); setMessage('Modelo sintético local en-US.');
  }}>Ouvir referência</button><span className="muted" role="status"> {message}</span></>;
}
