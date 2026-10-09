'use client';
import { useCallback, useEffect, useRef, useState } from 'react';
import { supabase } from '@/lib/auth';
import { isEvent, mergeEvents, parseEvents, storageKey, type PracticeEvent } from './progress';
export function usePractice(identity: string, account: boolean) {
  const [events, setEvents] = useState<PracticeEvent[]>([]);
  const [ready, setReady] = useState(false);
  const [message, setMessage] = useState('');
  const [syncing, setSyncing] = useState(false);
  const active = useRef(true);
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
    if (!account || !ready || syncing) return;
    setSyncing(true); setMessage('Sincronizando…');
    try {
      const client = supabase();
      const { data: { user }, error: authError } = await client.auth.getUser();
      if (authError || user?.id !== identity) throw new Error('identity');
      const remote: PracticeEvent[] = [];
      for (let offset = 0; ; offset += 500) {
        const { data, error } = await client.from('lexio_practice_events').select('id,version,component,activity_id,kind,payload,occurred_at').eq('user_id', identity).order('id').range(offset, offset + 499);
        if (error || !data || !data.every(isEvent)) throw new Error('read');
        remote.push(...data);
        if (data.length < 500) break;
      }
      if (!active.current) return;
      const local = persist(remote);
      const remoteIds = new Set(remote.map(e => e.id));
      const pending = local.filter(e => !remoteIds.has(e.id));
      for (let offset = 0; offset < pending.length; offset += 100) {
        if (!active.current) return;
        const { error } = await client.from('lexio_practice_events').upsert(pending.slice(offset, offset + 100).map(e => ({ ...e, user_id: identity })), { onConflict: 'user_id,id', ignoreDuplicates: true });
        if (error) throw new Error('write');
      }
      if (active.current) setMessage('Sincronizado com sua conta. Gravações não são enviadas.');
    } catch { if (active.current) setMessage('Sincronização indisponível. Seu histórico continua neste navegador; tente novamente depois.'); }
    finally { if (active.current) setSyncing(false); }
  };
  const deleteRemote = async () => {
    if (!account || syncing) return;
    setSyncing(true);
    try {
      const client = supabase();
      const { data: { user }, error: authError } = await client.auth.getUser();
      if (authError || user?.id !== identity) throw new Error('identity');
      const { error } = await client.from('lexio_practice_events').delete().eq('user_id', identity);
      if (error) throw new Error('delete');
      if (active.current) setMessage('Cópia remota apagada. Seu histórico local permanece.');
    } catch { if (active.current) setMessage('Não foi possível apagar a cópia remota. Tente novamente.'); }
    finally { if (active.current) setSyncing(false); }
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
