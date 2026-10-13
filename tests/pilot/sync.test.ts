import { syncPractice, type SyncPort } from '../../src/pilot/sync';
import { mergeEvents, type PracticeEvent } from '../../src/pilot/progress';
import { authDestination } from '../../src/pilot/auth-navigation';
const event=(n:number):PracticeEvent=>({id:`00000000-0000-4000-8000-${String(n).padStart(12,'0')}`,version:1,component:'pulse',activity_id:`q${n}`,kind:'attempt',payload:{answer:'test'},occurred_at:'2026-10-12T12:00:00Z'});
function fixture() {
 let local:PracticeEvent[]=[event(1)],remote:PracticeEvent[]=[event(2)];
 const port:SyncPort={identity:async()=> 'A',active:()=>true,read:async(offset)=>remote.slice(offset,offset+500),append:async(batch)=>{remote=mergeEvents(remote,batch);},persist:(incoming)=>{local=mergeEvents(local,incoming);return local;},local:()=>local};
 return {port,remote:()=>remote,add:()=>{local.push(event(3));}};
}
test('merges remote evidence and repeated delivery remains idempotent',async()=>{
 const f=fixture();await syncPractice('A',f.port);await syncPractice('A',f.port);
 expect(f.remote()).toHaveLength(2);expect(f.port.local()).toHaveLength(2);
});
test('account switch blocks transmission even after the read succeeds',async()=>{
 const f=fixture();let calls=0;f.port.identity=async()=> ++calls===1?'A':'B';f.port.append=jest.fn();
 await expect(syncPractice('A',f.port)).rejects.toThrow('identity');expect(f.port.append).not.toHaveBeenCalled();
});
test('logout during remote read never restores local data',async()=>{
 const f=fixture();let active=true;f.port.active=()=>active;f.port.read=async()=>{active=false;return [event(2)];};f.port.persist=jest.fn();
 await expect(syncPractice('A',f.port)).rejects.toThrow('cancelled');expect(f.port.persist).not.toHaveBeenCalled();
});
test('failed uploads preserve local evidence for retry',async()=>{
 const f=fixture();const append=f.port.append;f.port.append=async()=>{throw new Error('offline');};
 await expect(syncPractice('A',f.port)).rejects.toThrow('offline');expect(f.port.local()).toHaveLength(2);
 f.port.append=append;await syncPractice('A',f.port);expect(f.remote()).toHaveLength(2);
});
test('new edits during sync are reported as pending instead of synced',async()=>{
 const f=fixture();const append=f.port.append;f.port.append=async(batch)=>{await append(batch);f.add();};
 expect((await syncPractice('A',f.port)).remaining).toBe(1);
});
test('malformed remote evidence cannot overwrite local history',async()=>{
 const f=fixture();f.port.read=async()=>[{bad:true}];f.port.persist=jest.fn();
 await expect(syncPractice('A',f.port)).rejects.toThrow('invalid');expect(f.port.persist).not.toHaveBeenCalled();
});
test.each([null,'https://evil.test','//evil.test','/\\evil.test','/%2f%2fevil.test','/admin'])('callback destination %s stays in workspace',v=>expect(authDestination(v)).toBe('/learn'));
test('recovery destination is explicit',()=>expect(authDestination('/auth/reset')).toBe('/auth/reset'));
test('paginates remote reads and batches pending uploads without loss',async()=>{
 const f=fixture();const remote=Array.from({length:501},(_,i)=>event(i+1));let local=Array.from({length:205},(_,i)=>event(i+502));
 const offsets:number[]=[],sizes:number[]=[];
 f.port.read=async(offset)=>{offsets.push(offset);return remote.slice(offset,offset+500);};
 f.port.persist=incoming=>{local=mergeEvents(local,incoming);return local;};f.port.local=()=>local;
 f.port.append=async batch=>{sizes.push(batch.length);remote.push(...batch);};
 expect((await syncPractice('A',f.port)).remaining).toBe(0);
 expect(offsets).toEqual([0,500]);expect(sizes).toEqual([100,100,5]);expect(remote).toHaveLength(706);
});
