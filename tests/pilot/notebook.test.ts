import { notebookKey, parseNotebook, updateNotebook, type Cursor } from '../../src/pilot/notebook';

const cursor:Cursor={component:'syntaxis',level:'a2',selected:'a2-unit',activityIndex:2,selectedRoom:'vocab',shadowStep:0};
function storage() {
  const data=new Map<string,string>();
  return {getItem:(key:string)=>data.get(key) ?? null,setItem:(key:string,value:string)=>{data.set(key,value);}};
}
test('restores position and distinct drafts without submitting learning evidence',()=>{
  const db=storage();
  updateNotebook(db,'guest',{cursor,drafts:{'syntaxis:a2-unit':'An unfinished answer'}});
  const restored=parseNotebook(db.getItem(notebookKey('guest')));
  expect(restored.cursor).toEqual(cursor);
  expect(restored.drafts['syntaxis:a2-unit']).toBe('An unfinished answer');
  expect(restored).not.toHaveProperty('events');
});
test('different activities and accounts never share drafts',()=>{
  const db=storage();
  updateNotebook(db,'A',{drafts:{'pulse:first':'first'}});
  updateNotebook(db,'A',{drafts:{'pulse:second':'second'}});
  updateNotebook(db,'B',{drafts:{'pulse:first':'other'}});
  expect(parseNotebook(db.getItem(notebookKey('A'))).drafts).toEqual({'pulse:first':'first','pulse:second':'second'});
  expect(parseNotebook(db.getItem(notebookKey('B'))).drafts['pulse:first']).toBe('other');
});
test('empty draft is intentional and survives reload',()=>{
  const db=storage();updateNotebook(db,'A',{drafts:{question:'answer'}});updateNotebook(db,'A',{drafts:{question:''}});
  expect(parseNotebook(db.getItem(notebookKey('A'))).drafts.question).toBe('');
});
test('corrupt storage remains untouched',()=>{
  const db=storage();db.setItem(notebookKey('guest'),'{damaged');
  expect(()=>updateNotebook(db,'guest',{cursor})).toThrow();
  expect(db.getItem(notebookKey('guest'))).toBe('{damaged');
});
test('write failures cannot return a successful save',()=>{
  const db={getItem:()=>null,setItem:()=>{throw new Error('quota');}};
  expect(()=>updateNotebook(db,'guest',{cursor})).toThrow('quota');
});
test('rejects unsupported levels and oversized imported drafts',()=>{
  expect(()=>parseNotebook(JSON.stringify({version:1,cursor:{...cursor,level:'c9'},drafts:{}}))).toThrow();
  expect(()=>parseNotebook(JSON.stringify({version:1,drafts:{question:'a'.repeat(4001)}}))).toThrow();
});
