'use client';
import {useEffect, useRef, useState} from 'react';
import {createSpeechSession, dialogueSpeechLines, englishVoices, type SpeechStatus} from './speech-session';

type Props = {id: string; dialogue: {speaker: string; text: string}[]};
const messages: Record<SpeechStatus, string> = {
  idle: 'Pronto para ouvir. Leia as perguntas da atividade antes de começar.',
  starting: 'Preparando a voz…', speaking: 'Reproduzindo o roteiro.',
  complete: 'Reprodução encerrada. Responda antes de consultar a transcrição.',
  error: 'Não foi possível reproduzir. Tente outra voz ou peça a um parceiro para ler o roteiro.',
};
export default function ListeningPractice({id, dialogue}: Props) {
  const [voices, setVoices] = useState<SpeechSynthesisVoice[]>([]);
  const [selected, setSelected] = useState('');
  const [rate, setRate] = useState(1);
  const [supported, setSupported] = useState<boolean | null>(null);
  const [status, setStatus] = useState<SpeechStatus>('idle');
  const session = useRef<ReturnType<typeof createSpeechSession> | null>(null);
  useEffect(() => {
    if (!('speechSynthesis' in window) || !('SpeechSynthesisUtterance' in window)) {
      setSupported(false); return;
    }
    setSupported(true);
    const synth = window.speechSynthesis;
    const update = () => setVoices(englishVoices(synth.getVoices()));
    update(); synth.addEventListener('voiceschanged', update);
    session.current = createSpeechSession(synth, text => new SpeechSynthesisUtterance(text), setStatus);
    return () => { synth.removeEventListener('voiceschanged', update); session.current?.stop(); session.current = null; };
  }, [id]);
  const voice = voices.find(v => v.voiceURI === selected) || voices[0];
  const playing = status === 'starting' || status === 'speaking';
  return <section className="curriculum-listening" aria-labelledby={'listen-'+id}>
    <h2 id={'listen-'+id}>Escuta com voz do navegador</h2>
    <p>Reprodução sintética do roteiro, sem gravação editorial revisada. A voz e sua disponibilidade dependem do dispositivo; não há avaliação automática de compreensão.</p>
    {supported === false ? <p role="status">Este navegador não oferece voz sintética. Use um parceiro para ler o roteiro; consultar a transcrição é prática de leitura.</p> : <>
      <label>Voz em inglês <select value={voice?.voiceURI || ''} disabled={playing || !voices.length} onChange={e => setSelected(e.target.value)}>
        {!voices.length && <option value="">Nenhuma voz em inglês disponível</option>}
        {voices.map(v => <option key={v.voiceURI} value={v.voiceURI}>{v.name} · {v.lang}{v.localService ? '' : ' · serviço online'}</option>)}
      </select></label>
      <label>Ritmo <select value={rate} disabled={playing} onChange={e => setRate(Number(e.target.value))}>
        <option value={1}>Normal</option><option value={0.85}>Mais lento</option>
      </select></label>
      <div className="listening-controls">
        <button type="button" disabled={!voice || playing} onClick={() => voice && session.current?.play(dialogueSpeechLines(dialogue), voice, rate)}>Ouvir roteiro</button>
        <button type="button" disabled={!playing} onClick={() => session.current?.stop()}>Parar</button>
      </div>
      <p role="status" aria-live="polite">{!voices.length ? 'Aguardando uma voz em inglês. Se nenhuma aparecer, use outro navegador ou a leitura de um parceiro.' : messages[status]}</p>
      {voice && !voice.localService && <p>A voz selecionada usa um serviço online do navegador para ler este roteiro.</p>}
    </>}
    {new Set(dialogue.map(line => line.speaker)).size > 1 && <p>Nos diálogos, a voz anuncia o nome ou papel antes de cada fala para distinguir os participantes.</p>}
    <details><summary>Consultar transcrição depois de responder</summary>
      {dialogue.map((line, i) => <p key={i}><strong>{line.speaker}:</strong> {line.text}</p>)}
    </details>
    <p>Registre no seu estudo a voz, o ritmo, as repetições e se consultou o texto. Ouvir o arquivo não comprova aprendizagem.</p>
  </section>;
}
