'use client';
import { useState } from 'react';
import Link from 'next/link';
import { useAuth } from '@/lib/auth';
import { syntaxisPulseAtoms, syntaxisUnits, syntaxisPhrasalVerbs, LEVEL_LABELS } from '@/syntaxis/catalog';
import type { SyntaxisLevel } from '@/syntaxis/types';
import phonos from './phonos-sessions.json';
import { COMPONENTS, normalizeAnswer, palaceItems, type Component } from './progress';
import { usePractice } from './usePractice';
import { Listen, Recorder } from './Recorder';
import PalaceBlueprint from '@/components/PalaceBlueprint';
import { GrainOverlay } from '@/lib/stitch-motion';
const glyphs: Record<Component,string> = {pulse:'ϟ',palace:'⌂',shadow:'◌',phonos:'∿',syntaxis:'⟨⟩'};
const descriptions: Record<Component,string> = {
  pulse:'Um pequeno encontro com a língua. Uma memória a mais.',
  palace:'Dê um lugar ao que aprendeu. Volte até se tornar familiar.',
  shadow:'Encontre sua voz, um turno de cada vez.',
  phonos:'Escute de perto. Perceba o gesto. Experimente outra vez.',
  syntaxis:'A arquitetura da língua, revelada por dentro.',
};
const accountsEnabled = process.env.NEXT_PUBLIC_PILOT_ACCOUNTS_ENABLED === 'true';
const labels: Record<Component,string> = {pulse:'Pulse',palace:'Palácio',shadow:'Shadow',phonos:'Phonos',syntaxis:'Syntaxis'};
export default function Pilot({ initialComponent = 'pulse' }: { initialComponent?: Component }) {
  const { user, loading, signOut } = useAuth();
  if (loading) return <main className="lexio-pilot"><p role="status">Preparando seu espaço…</p></main>;
  return <Workspace key={user?.id || 'guest'} identity={user?.id || 'guest'} account={!!user} onSignOut={signOut} initialComponent={initialComponent}/>;
}
function Workspace({ identity, account, onSignOut, initialComponent }: {identity:string;account:boolean;onSignOut:()=>Promise<void>;initialComponent:Component}) {
  const practice = usePractice(identity, account);
  const [component,setComponent] = useState<Component>(initialComponent);
  const [level,setLevel] = useState<SyntaxisLevel>('pre_a1');
  const [selected,setSelected] = useState(''); const [draft,setDraft] = useState('');
  const [feedback,setFeedback] = useState(''); const [revealed,setRevealed] = useState(false);
  const [recorded,setRecorded] = useState<Record<string,boolean>>({});
  const [reflection,setReflection] = useState('');
  const [cloudConsent,setCloudConsent] = useState(false);
  const [shadowStep,setShadowStep] = useState(0);
  const atoms=syntaxisPulseAtoms.filter(a=>a.level===level);
  const atom=atoms.find(a=>a.id===selected)||atoms[0];
  const units=syntaxisUnits.filter(u=>u.published&&u.level===level);
  const unit=units.find(u=>u.id===selected)||units[0];
  const session=phonos.sessions.find(s=>s.id===selected)||phonos.sessions[0];
  const items=palaceItems(practice.events);
  const [activityIndex,setActivityIndex]=useState(0);
  const [selectedRoom,setSelectedRoom]=useState('grammar');
  const activity=unit?.activities[activityIndex]||unit?.activities[0];
  const reset = () => { setDraft('');setFeedback('');setRevealed(false);setReflection('');setRecorded({});setActivityIndex(0);setShadowStep(0); };
  const move = (c:Component) => {setComponent(c);setSelected('');reset();};
  const saveItem = (id:string,title:string,content:string,explanation:string) => {
    if (items.some(i=>i.activity_id===id)) {setFeedback('Este item já está no Palácio.');return;}
    if (practice.record({component:'palace',activity_id:id,kind:'save_item',payload:{title,content,explanation,room:'Estruturas'}})) setFeedback('Item guardado no Palácio.');
  };
  const latest = (id:string) => [...practice.events].reverse().find(e=>e.activity_id===id);
  const shadowPrompts=['Tell me your name and something you enjoy.','What do you usually do in the morning?','Ask me a question about my routine.'];
  return <main className="lexio-pilot" data-component={component}>
    <GrainOverlay/>
    <div className="pilot-masthead"><Link href="/" className="lexio-wordmark">LEXIO <span>UNDERGROUND</span></Link><span className="pilot-edition">EN / ACERVO PILOTO</span>{account?<button className="quiet-button" onClick={()=>void onSignOut()}>Sair</button>:accountsEnabled?<Link href="/signin">Entrar</Link>:<span className="pilot-guest">Caderno local</span>}</div>
    <header className="pilot-header"><div><p className="eyebrow">ESTUDO · MEMÓRIA · DESCOBERTA</p><h1>{labels[component]}</h1><p className="pilot-lede">{descriptions[component]}</p></div><div className="component-sigil" aria-hidden="true"><span>{glyphs[component]}</span></div></header>
    <nav aria-label="Componentes do Lexio" className="pilot-nav">{COMPONENTS.map(c=><button key={c} aria-label={labels[c]} aria-current={component===c?'page':undefined} onClick={()=>move(c)}><span className="nav-glyph" aria-hidden="true">{glyphs[c]}</span><span>{labels[c]}</span></button>)}</nav>
    <div className="pilot-statline"><span><i/> Prática em inglês</span><span>{items.length} memórias guardadas</span><span>{items.filter(i=>i.due).length} para revisitar</span></div>
    <details className="pilot-notice"><summary>Sobre este acervo</summary><p>Estruturas e Pulse do pré-A1 ao A2; Phonos com foco A2–B1. Shadow oferece ensaio guiado nesta versão. A cobertura completa até C1 está em construção.</p></details>
    <details className="notebook-tools"><summary>Seu caderno · histórico e cópia de segurança</summary>
    <div className="pilot-tools"><p>{account?'Histórico desta conta neste navegador.':'Modo visitante: histórico apenas neste navegador. Em aparelho compartilhado, exporte e remova seus dados antes de sair.'}</p><button onClick={practice.exportHistory}>Exportar histórico</button><label className="import-label">Importar histórico<input aria-label="Importar histórico" type="file" accept="application/json" onChange={e=>{const f=e.target.files?.[0];if(f)void practice.importHistory(f);e.target.value='';}}/></label></div>
    {account && <details><summary>Sincronizar entre dispositivos</summary><p>Envia respostas escritas, reflexões e revisões para sua conta. Nenhum áudio é enviado. O histórico de visitante pode ser exportado e importado por você.</p><label><input type="checkbox" checked={cloudConsent} onChange={e=>setCloudConsent(e.target.checked)}/> Quero sincronizar este histórico com minha conta.</label><button disabled={!cloudConsent||practice.syncing||!practice.ready} onClick={()=>void practice.synchronize()}>Sincronizar agora</button><button disabled={practice.syncing} onClick={()=>{if(window.confirm("Apagar o histórico remoto desta conta? A cópia local permanece e só será reenviada se você sincronizar novamente."))void practice.deleteRemote();}}>Apagar cópia da conta</button></details>}
    </details>
    <p role="status" className="save-status">{practice.message || (practice.ready?'Histórico pronto.':'Abrindo histórico…')}</p>
    <section className="pilot-panel" aria-labelledby="component-title"><div className="panel-heading"><p className="eyebrow">{component === "palace" ? "PLANTA DA MEMÓRIA" : "CADERNO DE PRÁTICA"}</p><h2 id="component-title">{component === "pulse" ? "Seu próximo fragmento" : component === "syntaxis" ? "Perceber. Transformar. Construir." : component === "phonos" ? "O som e o gesto" : component === "shadow" ? "Entre na conversa" : "Seu Palácio"}</h2><span className="panel-index" aria-hidden="true">{String(COMPONENTS.indexOf(component)+1).padStart(2,"0")}</span></div>
      {(component==='pulse'||component==='syntaxis') && <label>Faixa do conteúdo — escolha livre, sem atribuir nível ao aluno<select value={level} onChange={e=>{setLevel(e.target.value as SyntaxisLevel);setSelected('');reset();}}>{(['pre_a1','a1','a2'] as SyntaxisLevel[]).map(l=><option key={l} value={l}>{LEVEL_LABELS[l]}</option>)}</select></label>}
      {component==='pulse'&&atom&&<>
        <label>Prática breve<select value={atom.id} onChange={e=>{setSelected(e.target.value);reset();}}>{atoms.map((a,i)=><option value={a.id} key={a.id}>{i+1}. {a.prompt}</option>)}</select></label>
        <h3>{atom.prompt}</h3><p>Tente recuperar a frase em inglês. Depois compare com o modelo.</p><label>Sua resposta<textarea maxLength={2000} value={draft} onChange={e=>setDraft(e.target.value)}/></label>
        <button disabled={!practice.ready||!draft.trim()} onClick={()=>{
          const match=normalizeAnswer(draft)===normalizeAnswer(atom.answer);
          if(practice.record({component:'pulse',activity_id:atom.id,kind:'attempt',payload:{answer:draft,matchedModel:match}})){setRevealed(true);setFeedback(match?'Sua resposta corresponde ao modelo.':'Compare com o modelo. Outra formulação pode ser válida; isto não é uma avaliação de nível.');}
        }}>Salvar e comparar</button><button onClick={()=>setRevealed(true)}>Ver modelo</button>
        {revealed&&<div className="model"><p lang="en">{atom.answer}</p><p>{atom.explanationPt}</p><Listen text={atom.answer}/><button disabled={!practice.ready} onClick={()=>saveItem(atom.skillId,atom.prompt,atom.answer,atom.explanationPt)}>Guardar no Palácio</button></div>}
        {latest(atom.id)&&<p className="muted">Última resposta salva: {String(latest(atom.id)?.payload.answer||'')}</p>}
      </>}
      {component==='syntaxis'&&unit&&activity&&<>
        <label>Unidade<select value={unit.id} onChange={e=>{setSelected(e.target.value);reset();}}>{units.map(u=><option key={u.id} value={u.id}>{u.title}</option>)}</select></label>
        <h3>{unit.title}</h3><nav aria-label="Atividades da unidade">{unit.activities.map((a,i)=><button key={a.id} aria-current={i===activityIndex?'step':undefined} onClick={()=>{setActivityIndex(i);setDraft(String(latest(a.id)?.payload.answer||''));setFeedback('');setRevealed(false);}}>{i+1}. {a.title}{latest(a.id)?' · registrada':''}</button>)}</nav>
        <h4>{activity.title}</h4><p>{activity.instruction}</p><blockquote>{activity.prompt}</blockquote><label>Sua resposta<textarea maxLength={4000} value={draft} onChange={e=>setDraft(e.target.value)}/></label>
        <button disabled={!practice.ready||!draft.trim()} onClick={()=>{
          const match=activity.acceptedAnswers.some(a=>normalizeAnswer(a)===normalizeAnswer(draft));
          if(practice.record({component:'syntaxis',activity_id:activity.id,kind:'attempt',payload:{answer:draft,openProduction:activity.openProduction,matchedModel:!activity.openProduction&&match}})){setRevealed(true);setFeedback(activity.openProduction?'Produção guardada para reflexão e revisão. Sem nota automática.':match?'Sua resposta corresponde ao modelo.':'Compare as escolhas com o modelo; uma diferença não prova erro.');}
        }}>Guardar resposta</button>
        {revealed&&<div className="model"><p>{activity.authoredFeedback}</p>{activity.acceptedAnswers.map(a=><p lang="en" key={a}>{a}</p>)}</div>}
        <details><summary>Phrasal Lab — exemplos em contexto</summary>{syntaxisPhrasalVerbs.filter(v=>v.level===level).slice(0,12).map(v=><article key={v.id}><h4 lang="en">{v.headword}</h4><p>{v.separability} · {v.register}</p>{v.senses.map(s=><div key={s.id}><p>{s.meaningPt}</p><p lang="en">{s.exampleEn}</p><p>{s.examplePt}</p><button disabled={!practice.ready} onClick={()=>saveItem(s.id,v.headword,s.exampleEn,s.meaningPt)}>Guardar exemplo</button></div>)}</article>)}</details>
      </>}
      {component==='phonos'&&<>
        <label>Sessão guiada<select value={session.id} onChange={e=>{setSelected(e.target.value);reset();}}>{phonos.sessions.map(s=><option key={s.id} value={s.id}>{s.title}</option>)}</select></label>
        <h3>{session.title}</h3><p>{session.objective}</p><p>{session.gesture}</p><div className="model">{session.words.map(w=><p key={w.text}><span lang="en">{w.text} /{w.ipa}/</span> — {w.meaning}</p>)}<Listen text={session.words.map(w=>w.text).join('. ')}/></div><p lang="en">{session.phrase.text}</p><p>{session.phrase.meaning}</p><Listen text={session.phrase.text}/><p className="muted">{session.note}</p><details><summary>Referências da sessão</summary>{session.sources.map(source=><p key={source}><a href={(phonos.sources as Record<string,string>)[source]} target="_blank" rel="noreferrer">Referência: {source}</a></p>)}</details>
        <Recorder key={`${session.id}-words`} label="1. Grave as palavras" onRecorded={()=>setRecorded(r=>({...r,words:true}))}/><Recorder key={`${session.id}-phrase`} label="2. Grave a frase" onRecorded={()=>setRecorded(r=>({...r,phrase:true}))}/>
        <label>{session.reflectionPrompt}<select value={reflection} onChange={e=>setReflection(e.target.value)}><option value="">Escolha sua reflexão</option><option>Quero repetir</option><option>Ainda não percebo a diferença</option><option>Ficou mais confortável</option></select></label><button disabled={!practice.ready||!recorded.words||!recorded.phrase||!reflection} onClick={()=>{if(practice.record({component:'phonos',activity_id:session.id,kind:'reflection',payload:{reflection,wordsRecorded:true,phraseRecorded:true}}))setFeedback('Prática e reflexão registradas. Isso não equivale a domínio de pronúncia.');}}>Guardar reflexão</button>
        {latest(session.id)&&<p>Última reflexão: {String(latest(session.id)?.payload.reflection)}</p>}
      </>}
      {component==='shadow'&&<>
        <h3>Uma conversa sobre sua rotina</h3><p>Ensaio guiado em três turnos, com perguntas fixas. Nesta versão não há interlocutor de IA nem transcrição automática. Ouça, responda e reveja sua gravação.</p><p className="eyebrow">TURNO {shadowStep+1} DE 3 · A1–A2</p><blockquote lang="en">{shadowPrompts[shadowStep]}</blockquote><Listen text={shadowPrompts[shadowStep]}/>
        <Recorder key={`shadow-${shadowStep}`} label="Sua resposta" onRecorded={()=>setRecorded(r=>({...r,[shadowStep]:true}))}/><label>O que você conseguiu dizer? O que quer tentar de novo?<textarea maxLength={2000} value={reflection} onChange={e=>setReflection(e.target.value)}/></label>
        <button disabled={!practice.ready||!recorded[shadowStep]||!reflection.trim()} onClick={()=>{if(practice.record({component:'shadow',activity_id:`routine-turn-${shadowStep+1}`,kind:'reflection',payload:{reflection,recorded:true,mode:'guided-rehearsal'}})){setFeedback('Reflexão salva. O áudio permanece apenas nesta tela.');}}}>Guardar reflexão do turno</button>
        <button disabled={shadowStep===2||!latest(`routine-turn-${shadowStep+1}`)} onClick={()=>{setShadowStep(s=>s+1);setReflection('');setFeedback('');}}>Próximo turno</button><button onClick={()=>{setShadowStep(0);setReflection('');setRecorded({});}}>Recomeçar ensaio</button>
      </>}
      {component==='palace'&&<><div className="palace-blueprint-restored"><PalaceBlueprint maturityStage="branches" stageLabel="Planta aberta · cinco salas" rooms={[
        {id:'entrance',name:'Entrada',pillar:'none',unlocked:true,items:0,connectedTo:['grammar','vocab']},
        {id:'grammar',name:'Estruturas',pillar:'grammar',unlocked:true,items:items.length,connectedTo:['entrance','logic']},
        {id:'vocab',name:'Vocabulário',pillar:'vocab',unlocked:true,items:0,connectedTo:['entrance','culture']},
        {id:'logic',name:'Lógica',pillar:'logic',unlocked:true,items:0,connectedTo:['grammar','comm']},
        {id:'culture',name:'Cultura',pillar:'culture',unlocked:true,items:0,connectedTo:['vocab','comm']},
        {id:'comm',name:'Comunicação',pillar:'comm',unlocked:true,items:0,connectedTo:['logic','culture']},
      ]} onRoomClick={setSelectedRoom}/></div><div className="room-tabs" aria-label="Salas do Palácio">{[['grammar','Estruturas'],['vocab','Vocabulário'],['logic','Lógica'],['culture','Cultura'],['comm','Comunicação']].map(([id,name])=><button key={id} aria-current={selectedRoom===id?'true':undefined} onClick={()=>setSelectedRoom(id)}>{name}</button>)}</div>{selectedRoom!=='grammar'&&<p className="room-empty">Esta sala ainda não tem memórias guardadas. Os exemplos desta primeira coleção ficam em Estruturas.</p>}<p>{items.length} itens guardados · {items.filter(i=>i.due).length} para revisar. As datas organizam sua prática; não medem proficiência.</p>{!items.length&&<><p>Guarde seu primeiro exemplo no Pulse ou no Phrasal Lab.</p><button onClick={()=>move('pulse')}>Praticar no Pulse</button></>}{(selectedRoom==='grammar'?items:[]).map(item=><article className="memory-item" key={item.id}><p className="eyebrow">{String(item.payload.room||'Estruturas')} · {item.due?'REVISAR':'PRÓXIMA REVISÃO: '+new Date(item.dueAt).toLocaleDateString('pt-BR')}</p><h3>{String(item.payload.title)}</h3><details><summary>Tente lembrar antes de revelar</summary><p lang="en">{String(item.payload.content)}</p><p>{String(item.payload.explanation)}</p><Listen text={String(item.payload.content)}/><div>{(['again','remembered'] as const).map(recall=><button key={recall} disabled={!practice.ready} onClick={()=>practice.record({component:'palace',activity_id:item.activity_id,kind:'review',payload:{recall}})}>{recall==='again'?'Quero rever em breve':'Consegui lembrar'}</button>)}</div></details></article>)}</>}
      <p role="status">{feedback}</p>
    </section>
    <aside className="cartografa"><div className="cartografa-symbol" aria-hidden="true">⌖</div><div><p className="eyebrow">UM MAPA ANTES DO CAMINHO</p><h2>Cartógrafa</h2><p>O teste de nivelamento é uma frente separada e está em revisão. Você pode praticar sem fazer o teste. A faixa de uma atividade não atribui um nível a você.</p><Link href="/diagnostico">Sobre o nivelamento →</Link></div></aside>
    <footer><p>{practice.events.length} registros de prática neste histórico. Gravações são temporárias e se perdem ao trocar de atividade; baixe as que quiser guardar.</p><p>Para apagar o histórico deste navegador, exporte primeiro se desejar uma cópia.</p><button onClick={()=>{if(window.confirm('Apagar apenas este histórico local? Uma cópia sincronizada, se existir, permanece na conta.')){localStorage.removeItem(`lexio-practice-v1:${identity}`);window.location.reload();}}}>Apagar histórico local</button><p><Link href="/privacy">Privacidade do piloto</Link></p></footer>
  </main>;
}
