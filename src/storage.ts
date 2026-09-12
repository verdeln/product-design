import { seed, type State } from './model.js';
const KEY = 'verdeln.product-design.v1';
const obj = (x: unknown): x is Record<string, unknown> => !!x && typeof x === 'object' && !Array.isArray(x);
const str = (x: unknown): x is string => typeof x === 'string' && x.length <= 100000;
const num = (x: unknown) => typeof x === 'number' && Number.isFinite(x) && x >= 0;
const bool = (x: unknown) => typeof x === 'boolean';
const strings = (x: unknown) => Array.isArray(x) && x.length < 2000 && x.every(str);
const rows = (x: unknown, check: (v: Record<string, unknown>) => boolean) => Array.isArray(x) && x.length < 2000 && x.every(v => obj(v) && check(v));
const one = (x: unknown, values: string[]) => typeof x === 'string' && values.includes(x);
function valid(x: unknown): x is State {
  if (!obj(x)) return false;
  return x.schema === 1 && one(x.mode, ['ready', 'offline', 'viewer', 'signed-out']) && one(x.direction, ['studio', 'focus', 'console']) && bool(x.dark) && bool(x.ruleEnabled)
    && rows(x.projects, p => str(p.id) && str(p.title) && str(p.goal) && str(p.category) && bool(p.archived) && strings(p.sources) && obj(p.sourceHeads) && Object.values(p.sourceHeads).every(num) && strings(p.decisions))
    && rows(x.sources, r => str(r.id) && str(r.title) && str(r.body) && one(r.kind, ['Page', 'Web', 'Repository', 'File', 'Knowledge']) && num(r.revision) && num(r.observed) && bool(r.available) && bool(r.indexed) && one(r.coverage, ['complete', 'partial', 'unmaterialized']))
    && rows(x.tasks, t => str(t.id) && str(t.project) && str(t.title) && one(t.kind, ['ai', 'human']) && one(t.status, ['working', 'waiting', 'cancelling', 'completed', 'failed', 'cancelled']) && one(t.reason, ['approval', 'input', 'none', 'unknown']) && rows(t.criteria, c => str(c.text) && bool(c.satisfied)) && strings(t.evidence) && num(t.cost) && num(t.budget))
    && rows(x.artifacts, a => str(a.id) && str(a.project) && str(a.task) && str(a.title) && str(a.target) && one(a.status, ['draft', 'accepted']) && rows(a.revisions, v => num(v.number) && str(v.body)) && (a.publication === null || obj(a.publication) && num(a.publication.revision) && num(a.publication.targetVersion) && str(a.publication.receipt)))
    && rows(x.highlights, v => str(v.id) && str(v.project) && str(v.source) && str(v.quote) && str(v.note) && num(v.revision))
    && rows(x.effects, e => str(e.id) && str(e.project) && str(e.task) && str(e.body) && one(e.status, ['unknown', 'confirmed']))
    && rows(x.pages, p => str(p.id) && str(p.title) && str(p.body) && num(p.version))
    && rows(x.events, e => str(e.id) && str(e.project) && str(e.title) && str(e.detail) && str(e.time))
    && rows(x.messages, m => str(m.id) && str(m.project) && one(m.role, ['user', 'assistant']) && str(m.text) && strings(m.sources))
    && obj(x.receipts) && Object.values(x.receipts).every(str);
}
export function parseSaved(raw: string): State | null { try { const data: unknown = JSON.parse(raw); return valid(data) ? data : null; } catch { return null; } }
export function load(): { state: State; notice: string } {
  try { const raw = localStorage.getItem(KEY); if (!raw) return { state: seed(), notice: '' }; const state = parseSaved(raw); return state ? { state, notice: '' } : { state: seed(), notice: 'The saved prototype was invalid. Original sample data restored.' }; }
  catch { return { state: seed(), notice: 'Browser storage is unavailable. This session works in memory; export before closing.' }; }
}
export function save(s: State): boolean { try { localStorage.setItem(KEY, JSON.stringify(s)); return true; } catch { return false; } }
