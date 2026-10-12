'use client';
import { useCallback, useEffect, useRef, useState } from 'react';
import { emptyNotebook, notebookKey, parseNotebook, updateNotebook, type Notebook } from './notebook';

export function useNotebook(identity: string) {
  const [value,setValue] = useState<Notebook>(emptyNotebook);
  const [ready,setReady] = useState(false);
  const [error,setError] = useState('');
  const pendingDrafts = useRef<Record<string,string>>({});
  useEffect(() => {
    try {setValue(parseNotebook(localStorage.getItem(notebookKey(identity))));}
    catch {setError('Não foi possível recuperar os rascunhos. A cópia existente foi preservada; os novos textos podem ficar apenas nesta tela.');}
    setReady(true);
  },[identity]);
  const update = useCallback((change:Partial<Notebook>) => {
    pendingDrafts.current={...pendingDrafts.current,...change.drafts};
    try {setValue(updateNotebook(localStorage,identity,{...change,drafts:pendingDrafts.current}));pendingDrafts.current={};setError('');return true;}
    catch {setValue(previous=>({...previous,...change,drafts:{...previous.drafts,...change.drafts}}));setError('Não foi possível guardar o rascunho neste navegador. Copie o texto antes de sair. O histórico de respostas tem salvamento separado.');return false;}
  },[identity]);
  const exportDrafts = () => {
    try {
      const raw = JSON.stringify(value);
      const url = URL.createObjectURL(new Blob([raw],{type:'application/json'}));
      const link=document.createElement('a');link.href=url;link.download='lexio-rascunhos.json';link.click();
      setTimeout(()=>URL.revokeObjectURL(url),1000);
    } catch {setError('Não foi possível exportar os rascunhos. Copie os textos antes de sair.');}
  };
  return {value,ready,error,update,exportDrafts};
}
