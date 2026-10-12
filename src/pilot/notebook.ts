import { COMPONENTS, type Component } from './progress';

export const notebookKey = (identity: string) => `lexio-notebook-v1:${identity}`;
export type Cursor = { component: Component; level: 'pre_a1'|'a1'|'a2'; selected: string; activityIndex: number; selectedRoom: string; shadowStep: number };
export type Notebook = { version: 1; cursor?: Cursor; drafts: Record<string,string> };
export const emptyNotebook = (): Notebook => ({version:1,drafts:{}});
export function parseNotebook(raw: string|null): Notebook {
  if (!raw) return emptyNotebook();
  const n = JSON.parse(raw) as Notebook;
  if (!n || n.version !== 1 || !n.drafts || typeof n.drafts !== 'object' || Array.isArray(n.drafts)
    || Object.entries(n.drafts).some(([key,value]) => key.length > 250 || typeof value !== 'string' || value.length > 4000)) throw new Error('invalid notebook');
  const c = n.cursor;
  if (c && (!COMPONENTS.includes(c.component) || !['pre_a1','a1','a2'].includes(c.level)
    || typeof c.selected !== 'string' || c.selected.length > 200 || !Number.isInteger(c.activityIndex) || c.activityIndex < 0 || c.activityIndex > 20
    || !Number.isInteger(c.shadowStep) || c.shadowStep < 0 || c.shadowStep > 2
    || !['entrance','grammar','vocab','logic','culture','comm'].includes(c.selectedRoom))) throw new Error('invalid cursor');
  return n;
}
// Read at every update so editing one activity does not erase another tab's draft.
export function updateNotebook(storage: Pick<Storage,'getItem'|'setItem'>, identity:string, change: Partial<Notebook>): Notebook {
  const previous = parseNotebook(storage.getItem(notebookKey(identity)));
  const next = {...previous,...change,drafts:{...previous.drafts,...change.drafts},version:1 as const};
  parseNotebook(JSON.stringify(next));
  storage.setItem(notebookKey(identity), JSON.stringify(next));
  return next;
}
