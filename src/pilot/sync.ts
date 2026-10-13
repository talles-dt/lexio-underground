import { isEvent, type PracticeEvent } from './progress';
export type SyncPort = {
  identity:()=>Promise<string|null>;
  read:(offset:number)=>Promise<unknown[]>;
  append:(events:PracticeEvent[])=>Promise<void>;
  persist:(remote:PracticeEvent[])=>PracticeEvent[];
  local:()=>PracticeEvent[];
  active:()=>boolean;
};
export async function syncPractice(identity:string,port:SyncPort) {
  const guard=()=>{if(!port.active())throw new Error('cancelled');};
  guard();
  if(await port.identity()!==identity)throw new Error('identity');
  guard();
  const remote:PracticeEvent[]=[];
  for(let offset=0;;offset+=500) {
    guard();
    const batch=await port.read(offset);
    guard();
    if(!batch.every(isEvent))throw new Error('invalid remote history');
    remote.push(...batch);
    if(batch.length<500)break;
  }
  const local=port.persist(remote);
  const known=new Set(remote.map(e=>e.id));
  const pending=local.filter(e=>!known.has(e.id));
  for(let offset=0;offset<pending.length;offset+=100) {
    guard();
    if(await port.identity()!==identity)throw new Error('identity');
    guard();
    const batch=pending.slice(offset,offset+100);
    await port.append(batch);
    batch.forEach(e=>known.add(e.id));
  }
  guard();
  return {remaining:port.local().filter(e=>!known.has(e.id)).length};
}
