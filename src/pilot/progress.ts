export const COMPONENTS = ['pulse', 'palace', 'shadow', 'phonos', 'syntaxis'] as const;
export type Component = typeof COMPONENTS[number];
export type PracticeEvent = {
  id: string; version: 1; component: Component; activity_id: string;
  kind: 'attempt' | 'reflection' | 'save_item' | 'review';
  payload: Record<string, string | number | boolean>; occurred_at: string;
};
export const storageKey = (identity: string) => `lexio-practice-v1:${identity}`;
export const normalizeAnswer = (value: string) => value.normalize('NFKC').trim().toLocaleLowerCase('en').replace(/[’‘]/g, "'").replace(/[.!?]+$/, '').replace(/\s+/g, ' ');
export function isEvent(value: unknown): value is PracticeEvent {
  if (!value || typeof value !== 'object') return false;
  const e = value as PracticeEvent;
  return /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(e.id) && e.version === 1
    && COMPONENTS.includes(e.component) && ['attempt','reflection','save_item','review'].includes(e.kind)
    && typeof e.activity_id === 'string' && e.activity_id.length > 0 && e.activity_id.length <= 200
    && typeof e.occurred_at === 'string' && Number.isFinite(Date.parse(e.occurred_at))
    && !!e.payload && !Array.isArray(e.payload) && typeof e.payload === 'object'
    && JSON.stringify(e.payload).length <= 12000
    && Object.values(e.payload).every(v => ['string','boolean','number'].includes(typeof v));
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
  const items = new Map<string, PracticeEvent>();
  for (const e of events) if (e.kind === 'save_item' && !items.has(e.activity_id)) items.set(e.activity_id, e);
  return [...items.values()].map(item => {
    const reviews = events.filter(e => e.kind === 'review' && e.activity_id === item.activity_id);
    const last = reviews[reviews.length - 1];
    const days = !last || last.payload.recall !== 'remembered' ? 0 : Math.min(30, 2 ** Math.min(reviews.length - 1, 5));
    const dueAt = last ? Date.parse(last.occurred_at) + (days ? days * 86400000 : 600000) : Date.parse(item.occurred_at);
    return { ...item, dueAt, due: dueAt <= now, reviews: reviews.length };
  });
}
