import {createSpeechSession, dialogueSpeechLines, englishVoices, speechChunks} from '../../src/curriculum/speech-session';
const voice = {lang:'en-GB',voiceURI:'english'} as SpeechSynthesisVoice;
function harness() {
 const spoken: SpeechSynthesisUtterance[] = [];
 const synth = {speak:jest.fn((u:SpeechSynthesisUtterance)=>spoken.push(u)),cancel:jest.fn()};
 const status = jest.fn();
 const session = createSpeechSession(synth,text=>({text}) as SpeechSynthesisUtterance,status);
 return {spoken,synth,status,session};
}
afterEach(()=>jest.useRealTimers());
test('multi-speaker audio retains who said what without narrating a solo role label',()=>{
 expect(dialogueSpeechLines([{speaker:'Jo',text:'Yes.'},{speaker:'Lee',text:'No.'}])).toEqual(['Jo. Yes.','Lee. No.']);
 expect(dialogueSpeechLines([{speaker:'Narrator',text:'Hello.'}])).toEqual(['Hello.']);
});
test('stopping prevents stale callbacks from starting another line',()=>{
 jest.useFakeTimers();const h=harness();h.session.play(['One.','Two.'],voice,1);
 const old=h.spoken[0];h.session.stop();old.onend?.({} as SpeechSynthesisEvent);
 expect(h.spoken).toHaveLength(1);expect(h.status).toHaveBeenLastCalledWith('idle');
});
test('completes only after every chunk ends and leaves no timer',()=>{
 jest.useFakeTimers();const h=harness();h.session.play(['One.','Two.'],voice,1);
 h.spoken[0].onstart?.({} as SpeechSynthesisEvent);
 h.spoken[0].onend?.({} as SpeechSynthesisEvent);
 expect(h.status).not.toHaveBeenLastCalledWith('complete');
 h.spoken[1].onend?.({} as SpeechSynthesisEvent);
 expect(h.status).toHaveBeenLastCalledWith('complete');expect(jest.getTimerCount()).toBe(0);
});
test('unavailable speech events fail rather than falsely mark completion',()=>{
 jest.useFakeTimers();const h=harness();h.session.play(['Hello.'],voice,1);
 jest.advanceTimersByTime(15000);expect(h.status).toHaveBeenLastCalledWith('error');
 h.spoken[0].onend?.({} as SpeechSynthesisEvent);expect(h.status).toHaveBeenLastCalledWith('error');
});
test('only English voices are offered and chunking preserves words',()=>{
 expect(englishVoices([voice,{lang:'pt-BR'} as SpeechSynthesisVoice])).toEqual([voice]);
 const text=Array(80).fill('word').join(' ');const chunks=speechChunks([text]);
 expect(chunks.join(' ')).toBe(text);expect(chunks.every(c=>c.length<=180)).toBe(true);
});
test('restarting ignores an error from the cancelled generation',()=>{
 jest.useFakeTimers();const h=harness();h.session.play(['Old'],voice,1);const old=h.spoken[0];
 h.session.play(['New'],voice,.85);old.onerror?.({} as SpeechSynthesisErrorEvent);
 expect(h.status).toHaveBeenLastCalledWith('starting');h.session.stop();
});
