export const COMPONENTS = ['pulse', 'palace', 'shadow', 'phonos', 'syntaxis'] as const;
export type Component = typeof COMPONENTS[number];
export const ROOMS = {grammar:'Estruturas',vocab:'Vocabulário',logic:'Lógica',culture:'Cultura',comm:'Comunicação'} as const;
export type RoomId = keyof typeof ROOMS;
export function roomId(value: unknown): RoomId {
  return (Object.keys(ROOMS) as RoomId[]).find(id=>id===value || ROOMS[id]===value) || 'grammar';
}
export type PracticeEvent = {
  id: string; version: 1; component: Component; activity_id: string;
  kind: 'attempt' | 'reflection' | 'save_item' | 'review' | 'move_item';
  payload: Record<string, string | number | boolean>; occurred_at: string;
};
export const storageKey = (identity: string) => `lexio-practice-v1:${identity}`;
export const normalizeAnswer = (value: string) => value.normalize('NFKC').trim().toLocaleLowerCase('en').replace(/[’‘]/g, "'").replace(/[.!?]+$/, '').replace(/\s+/g, ' ');
export function isEvent(value: unknown): value is PracticeEvent {
  if (!value || typeof value !== 'object') return false;
  const e = value as PracticeEvent;
  return /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(e.id) && e.version === 1
    && COMPONENTS.includes(e.component) && ['attempt','reflection','save_item','review','move_item'].includes(e.kind)
    && typeof e.activity_id === 'string' && e.activity_id.length > 0 && e.activity_id.length <= 200
    && typeof e.occurred_at === 'string' && Number.isFinite(Date.parse(e.occurred_at))
    && !!e.payload && !Array.isArray(e.payload) && typeof e.payload === 'object'
    && JSON.stringify(e.payload).length <= 12000
    && Object.values(e.payload).every(v => ['string','boolean','number'].includes(typeof v) && (typeof v !== 'number' || Number.isFinite(v)))
    && (e.kind !== 'move_item' || (e.component === 'palace' && Object.hasOwn(ROOMS, String(e.payload.room))));
}
export function parseEvents(raw: string | null): PracticeEvent[] {
  if (!raw) return [];
  const data: unknown = JSON.parse(raw);
  if (!Array.isArray(data) || !data.every(isEvent)) throw new Error('Histórico inválido. Exporte uma cópia antes de recuperar os dados.');
  return mergeEvents([], data);
}
export function mergeEvents(a: PracticeEvent[], b: PracticeEvent[]): PracticeEvent[] {
  const unique = new Map<string, PracticeEvent>();
  // Existing IDs are immutable. Repeated delivery must never overwrite evidence.
  for (const event of [...a, ...b]) if (isEvent(event) && !unique.has(event.id)) unique.set(event.id, event);
  return [...unique.values()].sort((x,y) => Date.parse(x.occurred_at) - Date.parse(y.occurred_at) || x.id.localeCompare(y.id));
}
export function palaceItems(events: PracticeEvent[], now = Date.now()) {
  events = mergeEvents([],events);
  const items = new Map<string, PracticeEvent>();
  for (const e of events) if (e.kind === 'save_item' && !items.has(e.activity_id)) items.set(e.activity_id, e);
  return [...items.values()].map(item => {
    const reviews = events.filter(e => e.kind === 'review' && e.activity_id === item.activity_id);
    const last = reviews[reviews.length - 1];
    let streak = 0;
    for (let i=reviews.length-1;i>=0 && reviews[i].payload.recall==='remembered';i--) streak++;
    const days = streak ? Math.min(30, 2 ** Math.min(streak - 1, 5)) : 0;
    const dueAt = last ? Date.parse(last.occurred_at) + (days ? days * 86400000 : 600000) : Date.parse(item.occurred_at);
    const moves = events.filter(e=>e.kind==='move_item' && e.activity_id===item.activity_id && Date.parse(e.occurred_at)>=Date.parse(item.occurred_at));
    const room = roomId(moves.at(-1)?.payload.room || item.payload.room);
    return { ...item, room, dueAt, due: dueAt <= now, reviews: reviews.length };
  });
}
