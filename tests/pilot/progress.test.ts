import { isEvent, mergeEvents, normalizeAnswer, palaceItems, parseEvents, storageKey, type PracticeEvent } from '../../src/pilot/progress';
import { legacyApiStatus } from '../../src/pilot/api-policy';
const base: PracticeEvent = { id: 'aaaaaaaa-aaaa-4aaa-aaaa-aaaaaaaaaaaa', version:1, component:'palace',activity_id:'item',kind:'save_item',payload:{content:'I am here.'},occurred_at:'2026-10-09T12:00:00Z' };
describe('learner evidence and recovery',()=>{
 test('rejects invalid history rather than silently replacing it',()=>{expect(()=>parseEvents('{')).toThrow();expect(()=>parseEvents('[{"id":"fake"}]')).toThrow();expect(isEvent({...base,component:'cartografa'})).toBe(false);});
 test('retries and imports cannot duplicate or rewrite an event',()=>{const result=mergeEvents([base],[{...base,payload:{content:'changed'}}]);expect(result).toEqual([base]);});
 test('separates accounts and guest',()=>{expect(storageKey('A')).not.toEqual(storageKey('B'));expect(storageKey('A')).not.toEqual(storageKey('guest'));});
 test('review scheduling is based on recorded recall, not level',()=>{const review:PracticeEvent={...base,id:'bbbbbbbb-bbbb-4bbb-bbbb-bbbbbbbbbbbb',kind:'review',payload:{recall:'remembered'}};expect(palaceItems([base,review],Date.parse(base.occurred_at))[0].due).toBe(false);expect(palaceItems([base,review],Date.parse(base.occurred_at)+86400000)[0].due).toBe(true);expect(palaceItems([base,review],Date.parse(base.occurred_at))[0].dueAt).toBe(Date.parse(base.occurred_at)+86400000);});
 test('forgiving typography does not turn different content into an answer',()=>{expect(normalizeAnswer(' I am here! ')).toBe('i am here');expect(normalizeAnswer('I am not here')).not.toBe(normalizeAnswer('I am here'));});
});
describe('pilot containment',()=>{
 test.each(['/api/checkout','/api/stripe/webhook','/api/diagnostico/resume','/api/learner-progression','/api/conversation-shadow','/api/ai/generate-content','/api/tts','/api/family','/api/admin/seed'])('%s fails closed',path=>expect(legacyApiStatus(path)).toBe(503));
 test('retired integration is gone, admin still requires identity middleware',()=>{expect(legacyApiStatus('/api/admin/zernio/posts')).toBe(410);expect(legacyApiStatus('/api/admin/users')).toBeNull();});
});
