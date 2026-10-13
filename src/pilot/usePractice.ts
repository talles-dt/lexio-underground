'use client';
import { useCallback, useEffect, useRef, useState } from 'react';
import { supabase } from '@/lib/auth';
import { mergeEvents, parseEvents, storageKey, type PracticeEvent } from './progress';
import { syncPractice } from './sync';
export function usePractice(identity: string, account: boolean) {
  const [events, setEvents] = useState<PracticeEvent[]>([]);
  const [ready, setReady] = useState(false);
  const [message, setMessage] = useState('');
  const [syncing, setSyncing] = useState(false);
  const active = useRef(true);
  const operation = useRef(false);
  const key = storageKey(identity);
  useEffect(() => {
    active.current = true;
    const read = () => { try { setEvents(parseEvents(localStorage.getItem(key))); setReady(true); } catch { setReady(false); setMessage('Não foi possível ler seu histórico. Os dados existentes foram preservados. Exporte uma cópia para recuperá-los.'); } };
    read();
    const changed = (e: StorageEvent) => { if (e.key === key) read(); };
    window.addEventListener('storage', changed);
    return () => { active.current = false; window.removeEventListener('storage', changed); };
  }, [key]);
  const persist = useCallback((incoming: PracticeEvent[]) => {
    if(!active.current)throw new Error('cancelled');
    const merged = mergeEvents(parseEvents(localStorage.getItem(key)), incoming);
    // Never announce completion before the durable write succeeds.
    localStorage.setItem(key, JSON.stringify(merged));
    if (active.current) setEvents(merged);
    return merged;
  }, [key]);
  const record = (event: Omit<PracticeEvent, 'id' | 'version' | 'occurred_at'>) => {
    if (!ready) return false;
    try {
      persist([{ ...event, id: crypto.randomUUID(), version: 1, occurred_at: new Date().toISOString() }]);
      setMessage('Salvo neste navegador.'); return true;
    } catch { setMessage('Não foi possível salvar. Libere espaço ou exporte seu histórico e tente novamente.'); return false; }
  };
  const synchronize = async () => {
    if (!account || !ready || operation.current) return;
    operation.current=true;
    setSyncing(true); setMessage('Sincronizando…');
    try {
      const client = supabase();
      const result=await syncPractice(identity,{
        identity:async()=>{const {data:{user},error}=await client.auth.getUser();return error?null:user?.id||null;},
        active:()=>active.current,
        read:async(offset)=>{
          const {data,error}=await client.from('lexio_practice_events').select('id,version,component,activity_id,kind,payload,occurred_at').eq('user_id',identity).order('id').range(offset,offset+499);
          if(error||!data)throw new Error('read');return data;
        },
        append:async(events)=>{
          const {error}=await client.from('lexio_practice_events').upsert(events.map(e=>({...e,user_id:identity})),{onConflict:'user_id,id',ignoreDuplicates:true});
          if(error)throw new Error('write');
        },
        persist,
        local:()=>parseEvents(localStorage.getItem(key)),
      });
      if(active.current)setMessage(result.remaining?'Há novas respostas locais. Sincronize novamente para enviá-las.':'Sincronizado com sua conta. Gravações e rascunhos não são enviados.');
    } catch { if (active.current) setMessage('Sincronização indisponível. Seu histórico continua neste navegador; tente novamente depois.'); }
    finally { operation.current=false; if (active.current) setSyncing(false); }
  };
  const deleteRemote = async () => {
    if (!account || operation.current) return;
    operation.current=true;
    setSyncing(true);
    try {
      const client = supabase();
      const { data: { user }, error: authError } = await client.auth.getUser();
      if (authError || user?.id !== identity || !active.current) throw new Error('identity');
      const { error } = await client.from('lexio_practice_events').delete().eq('user_id', identity);
      if (error) throw new Error('delete');
      if (active.current) setMessage('Cópia remota apagada. Seu histórico local permanece.');
    } catch { if (active.current) setMessage('Não foi possível apagar a cópia remota. Tente novamente.'); }
    finally { operation.current=false; if (active.current) setSyncing(false); }
  };
  const exportHistory = () => {
    const blob = new Blob([localStorage.getItem(key) || '[]'], { type: 'application/json' });
    const url = URL.createObjectURL(blob); const a = document.createElement('a'); a.href = url; a.download = 'lexio-historico.json'; a.click(); setTimeout(() => URL.revokeObjectURL(url), 1000);
  };
  const importHistory = async (file: File) => {
    try { if (file.size > 5_000_000) throw new Error('size'); persist(parseEvents(await file.text())); setReady(true); setMessage('Histórico importado, sem duplicar tentativas.'); }
    catch { setMessage('Arquivo inválido ou armazenamento indisponível. Seu histórico anterior foi preservado.'); }
  };
  return { events, ready, message, record, synchronize, syncing, exportHistory, importHistory, deleteRemote };
}
