import { isEvent, mergeEvents, normalizeAnswer, palaceItems, parseEvents, storageKey, type PracticeEvent } from '../../src/pilot/progress';
import { legacyApiStatus } from '../../src/pilot/api-policy';
const base: PracticeEvent = { id: 'aaaaaaaa-aaaa-4aaa-aaaa-aaaaaaaaaaaa', version:1, component:'palace',activity_id:'item',kind:'save_item',payload:{content:'I am here.'},occurred_at:'2026-10-09T12:00:00Z' };
describe('learner evidence and recovery',()=>{
 test('rejects invalid history rather than silently replacing it',()=>{expect(()=>parseEvents('{')).toThrow();expect(()=>parseEvents('[{"id":"fake"}]')).toThrow();expect(isEvent({...base,component:'cartografa'})).toBe(false);});
 test('retries and imports cannot duplicate or rewrite an event',()=>{const result=mergeEvents([base],[{...base,payload:{content:'changed'}}]);expect(result).toEqual([base]);});
 test('separates accounts and guest',()=>{expect(storageKey('A')).not.toEqual(storageKey('B'));expect(storageKey('A')).not.toEqual(storageKey('guest'));});
 test('review scheduling is based on recorded recall, not level',()=>{const review:PracticeEvent={...base,id:'bbbbbbbb-bbbb-4bbb-bbbb-bbbbbbbbbbbb',kind:'review',payload:{recall:'remembered'}};expect(palaceItems([base,review],Date.parse(base.occurred_at))[0].due).toBe(false);expect(palaceItems([base,review],Date.parse(base.occurred_at)+86400000)[0].due).toBe(true);expect(palaceItems([base,review],Date.parse(base.occurred_at))[0].dueAt).toBe(Date.parse(base.occurred_at)+86400000);});
 test('forgiving typography does not turn different content into an answer',()=>{expect(normalizeAnswer(' I am here! ')).toBe('i am here');expect(normalizeAnswer('I am not here')).not.toBe(normalizeAnswer('I am here'));});
 test('moving legacy memories preserves content, review count and next date',()=>{
  const review:PracticeEvent={...base,id:'bbbbbbbb-bbbb-4bbb-bbbb-bbbbbbbbbbbb',kind:'review',payload:{recall:'remembered'},occurred_at:'2026-10-10T12:00:00Z'};
  const move:PracticeEvent={...base,id:'cccccccc-cccc-4ccc-cccc-cccccccccccc',kind:'move_item',payload:{room:'vocab'},occurred_at:'2026-10-10T13:00:00Z'};
  const before=palaceItems([base,review])[0],after=palaceItems([move,review,base,move])[0];
  expect(before.room).toBe('grammar');expect(after.room).toBe('vocab');
  expect(after.payload.content).toBe(before.payload.content);expect(after.dueAt).toBe(before.dueAt);expect(after.reviews).toBe(1);
 });
 test('invalid or non-palace room movements are rejected on import',()=>{
  expect(isEvent({...base,kind:'move_item',payload:{room:'bogus'}})).toBe(false);
  expect(isEvent({...base,component:'pulse',kind:'move_item',payload:{room:'vocab'}})).toBe(false);
 });
 test('a lapse resets spacing even after a long history',()=>{
  const reviews=Array.from({length:8},(_,i):PracticeEvent=>({...base,id:`00000000-0000-4000-8000-${String(i).padStart(12,'0')}`,kind:'review',payload:{recall:i===6?'again':'remembered'},occurred_at:new Date(Date.parse(base.occurred_at)+(i+1)*86400000).toISOString()}));
  expect(palaceItems([base,...reviews])[0].dueAt).toBe(Date.parse(reviews[7].occurred_at)+86400000);
 });
});
describe('pilot containment',()=>{
 test.each(['/api/checkout','/api/stripe/webhook','/api/diagnostico/resume','/api/learner-progression','/api/conversation-shadow','/api/ai/generate-content','/api/tts','/api/family','/api/admin/seed'])('%s fails closed',path=>expect(legacyApiStatus(path)).toBe(503));
 test('retired integration is gone, admin still requires identity middleware',()=>{expect(legacyApiStatus('/api/admin/zernio/posts')).toBe(410);expect(legacyApiStatus('/api/admin/users')).toBeNull();});
});
