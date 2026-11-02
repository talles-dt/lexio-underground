export type SpeechStatus = 'idle' | 'starting' | 'speaking' | 'complete' | 'error';
export function englishVoices(voices: SpeechSynthesisVoice[]) {
  return voices.filter(v => /^en(?:[-_]|$)/i.test(v.lang));
}
export function dialogueSpeechLines(dialogue: {speaker: string; text: string}[]) {
  const multiple = new Set(dialogue.map(line => line.speaker)).size > 1;
  return dialogue.map(line => multiple ? `${line.speaker}. ${line.text}` : line.text);
}
export function speechChunks(lines: string[]) {
  return lines.flatMap(line => {
    const words = line.trim().split(/\s+/).filter(Boolean);
    const chunks: string[] = [];
    let chunk = '';
    for (const word of words) {
      if (chunk && chunk.length + word.length + 1 > 180) { chunks.push(chunk); chunk = ''; }
      chunk += (chunk ? ' ' : '') + word;
    }
    if (chunk) chunks.push(chunk);
    return chunks;
  });
}
// Generation tokens prevent cancelled utterances from restarting an old lesson.
export function createSpeechSession(
  synthesis: Pick<SpeechSynthesis, 'speak' | 'cancel'>,
  utterance: (text: string) => SpeechSynthesisUtterance,
  status: (value: SpeechStatus) => void,
) {
  let generation = 0;
  let timer: ReturnType<typeof setTimeout> | undefined;
  const clear = () => { if (timer) clearTimeout(timer); timer = undefined; };
  const stop = () => { generation++; clear(); synthesis.cancel(); status('idle'); };
  const play = (lines: string[], voice: SpeechSynthesisVoice, rate: number) => {
    stop();
    const token = generation;
    const chunks = speechChunks(lines);
    if (!chunks.length || !englishVoices([voice]).length) { status('error'); return; }
    status('starting');
    let index = 0;
    const fail = () => {
      if (token !== generation) return;
      generation++; clear(); synthesis.cancel(); status('error');
    };
    const next = () => {
      if (token !== generation) return;
      if (index === chunks.length) { clear(); status('complete'); return; }
      const speech = utterance(chunks[index++]);
      speech.voice = voice;
      speech.lang = voice.lang;
      speech.rate = Math.max(0.8, Math.min(1, rate));
      speech.onstart = () => {
        if (token !== generation) return;
        clear(); status('speaking');
        // A stalled browser must not leave the player claiming it is playing forever.
        timer = setTimeout(fail, 90000);
      };
      speech.onend = () => { if (token === generation) { clear(); next(); } };
      speech.onerror = fail;
      timer = setTimeout(fail, 15000);
      try { synthesis.speak(speech); } catch { fail(); }
    };
    next();
  };
  return {play, stop};
}
