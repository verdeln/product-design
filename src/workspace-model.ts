/** Workspace navigation fixtures. Content stays in the existing source/page owners. */
import * as core from './model.js';
export type Space = { id: string; title: string; access: 'open' | 'closed' | 'private'; member: boolean; revision: number };
export type Favorite = { kind: 'page' | 'project'; id: string };
export type Entry = { id: string; ref: { kind: 'source' | 'page'; id: string }; owner: 'you' | 'teammate'; space: string | null; parent: string | null; shared: boolean; revision: number };
export type Navigation = { version: 1; spaces: Space[]; entries: Entry[]; projectSpaces: Record<string, string | null>; favorites: Favorite[]; pinned: string[]; expanded: string[] };
export type State = core.State & { navigation: Navigation };
export type MovePreview = { page: string; target: string | null; basis: string; affected: string[]; before: string; after: string; projects: string[] };
export type NavCommand =
  | { type: 'favorite'; ref: Favorite }
  | { type: 'reorder-favorite'; ref: Favorite; offset: -1 | 1 }
  | { type: 'create-page'; title: string; space: string | null; parent: string | null; project: string | null }
  | { type: 'save-page'; page: string; body: string; expected: number }
  | { type: 'move-page'; preview: MovePreview }
  | { type: 'share-page'; page: string; shared: boolean; expected: number }
  | { type: 'assign-project'; project: string; target: string | null; expected: string };
export type Command = core.Command | NavCommand;
export type Result = { ok: true; state: State; message: string; id: string } | { ok: false; state: State; message: string; code: 'denied' | 'stale' | 'invalid' | 'unknown' };
export const makeId = core.makeId;
export const writeBlock = core.writeBlock;
export type { Direction, Mode } from './model.js';
const key = (ref: Favorite) => `${ref.kind}/${ref.id}`;
const entry = (id: string, space: string | null, parent: string | null = null, shared = false, owner: Entry['owner'] = 'you'): Entry => ({ id: `source-${id}`, ref: { kind: 'source', id }, owner, space, parent, shared, revision: 1 });
function initialNavigation(s: core.State): Navigation {
  return { version: 1, spaces: [
    { id: 'engineering', title: 'Product & Engineering', access: 'open', member: true, revision: 1 },
    { id: 'design', title: 'Design', access: 'closed', member: true, revision: 1 },
    { id: 'operations', title: 'Operations', access: 'closed', member: false, revision: 1 },
    { id: 'hidden', title: 'Restricted planning', access: 'private', member: false, revision: 1 }
  ], entries: [entry('rfc', 'engineering'), entry('personal-notes', null), entry('product-ideas', null, 'source-personal-notes'), entry('weekly-plan', null, null, true), entry('shared-research', null, null, true, 'teammate'),
    ...s.pages.map(p => ({ id: `page-${p.id}`, ref: { kind: 'page' as const, id: p.id }, owner: 'you' as const, space: 'engineering', parent: null, shared: false, revision: 1 }))],
    projectSpaces: Object.fromEntries(s.projects.map(p => [p.id, p.id === 'editor' ? 'engineering' : p.id === 'launch' ? 'design' : null])),
    favorites: [{ kind: 'page', id: 'source-rfc' }, { kind: 'project', id: 'editor' }], pinned: ['source-weekly-plan'], expanded: ['favorites', 'private', 'shared', 'teamspaces', 'space-engineering'] };
}
function validNavigation(x: unknown): x is Navigation {
  if (!x || typeof x !== 'object') return false;
  const n = x as Partial<Navigation>;
  const ids = (v: unknown): v is string[] => Array.isArray(v) && v.length < 2000 && v.every(x => typeof x === 'string');
  return n.version === 1 && Array.isArray(n.entries) && n.entries.length < 2000 && n.entries.every(e => e && typeof e.id === 'string' && e.ref && ['source', 'page'].includes(e.ref.kind) && typeof e.ref.id === 'string' && ['you', 'teammate'].includes(e.owner) && (e.space === null || typeof e.space === 'string') && (e.parent === null || typeof e.parent === 'string') && typeof e.shared === 'boolean' && Number.isInteger(e.revision) && e.revision > 0)
    && new Set(n.entries.map(e => e.id)).size === n.entries.length
    && Array.isArray(n.spaces) && n.spaces.every(t => t && typeof t.id === 'string' && typeof t.title === 'string' && ['open', 'closed', 'private'].includes(t.access) && typeof t.member === 'boolean' && Number.isInteger(t.revision))
    && !!n.projectSpaces && typeof n.projectSpaces === 'object' && !Array.isArray(n.projectSpaces) && Object.values(n.projectSpaces).every(v => v === null || typeof v === 'string')
    && Array.isArray(n.favorites) && n.favorites.length < 2000 && n.favorites.every(f => f && ['page', 'project'].includes(f.kind) && typeof f.id === 'string') && ids(n.pinned) && ids(n.expanded);
}
export function upgrade(base: core.State): State {
  const s = structuredClone(base), raw: unknown = Reflect.get(s, 'navigation');
  if (validNavigation(raw)) return { ...s, navigation: raw };
  const samples = [
    ['personal-notes', 'My working notes', '## Personal notes\n\nAn unshared page is a place to think before involving a team.'],
    ['product-ideas', 'Product ideas', '## Ideas to explore\n\nThis child page moves only with an explicitly reviewed subtree operation.'],
    ['weekly-plan', 'This week', '## This week\n\nPrepare the brief, review the evidence, and make one clear decision.'],
    ['shared-research', 'Shared research notes', '## Interview observations\n\nShared with you as a read-only page. The original owner retains control.']
  ];
  for (const [id = '', title = '', body = ''] of samples) if (!s.sources.some(r => r.id === id)) s.sources.push({ id, title, body, kind: 'Page', revision: 1, observed: 1, available: true, coverage: 'complete', indexed: false });
  return { ...s, navigation: initialNavigation(s) };
}
export function seed(): State { return upgrade(core.seed()); }
export function visibleSpaces(s: State): Space[] { return s.mode === 'signed-out' ? [] : s.navigation.spaces.filter(t => t.access !== 'private' || t.member); }
export function canEnterSpace(s: State, id: string): boolean { const t = s.navigation.spaces.find(t => t.id === id); return s.mode !== 'signed-out' && !!t && (t.access === 'open' || t.member); }
export function canReadEntry(s: State, e: Entry): boolean {
  if (s.mode === 'signed-out' || (e.space ? !canEnterSpace(s, e.space) : e.owner !== 'you' && !e.shared)) return false;
  return e.ref.kind === 'source' ? !!s.sources.find(r => r.id === e.ref.id && r.available) : s.pages.some(p => p.id === e.ref.id);
}
export function document(s: State, id: string): { entry: Entry; title: string; body: string; revision: number } | null {
  const e = s.navigation.entries.find(e => e.id === id); if (!e || !canReadEntry(s, e)) return null;
  const source = e.ref.kind === 'source' ? s.sources.find(r => r.id === e.ref.id) : null;
  const page = e.ref.kind === 'page' ? s.pages.find(p => p.id === e.ref.id) : null;
  return source ? { entry: e, title: source.title, body: source.body, revision: source.revision } : page ? { entry: e, title: page.title, body: page.body, revision: page.version } : null;
}
export function projectSpace(s: State, id: string): string | null { return s.navigation.projectSpaces[id] ?? null; }
export function canReadProject(s: State, id: string): boolean { const space = projectSpace(s, id); return s.mode !== 'signed-out' && s.projects.some(p => p.id === id) && (!space || canEnterSpace(s, space)); }
export function locationLabel(s: State, e: Entry): string { return e.space ? s.navigation.spaces.find(t => t.id === e.space)?.title ?? 'Unavailable location' : e.owner === 'you' ? 'Private' : 'Shared with you'; }
export function audience(s: State, e: Entry): string { return e.space ? `${locationLabel(s, e)} members${s.navigation.spaces.find(t => t.id === e.space)?.access === 'open' ? ' · workspace-visible' : ''}` : e.shared ? 'Owner + explicitly shared readers' : 'Only you'; }
export function favorites(s: State): Favorite[] { return s.navigation.favorites.filter(f => f.kind === 'page' ? !!document(s, f.id) : canReadProject(s, f.id)); }
export function isFavorite(s: State, ref: Favorite): boolean { return favorites(s).some(f => key(f) === key(ref)); }
export function relatedProjects(s: State, e: Entry): core.Project[] { return s.projects.filter(p => canReadProject(s, p.id) && (e.ref.kind === 'source' ? p.sources.includes(e.ref.id) : s.artifacts.some(a => a.target === e.ref.id && a.project === p.id))); }
export function compatible(s: State, source: string, project: string, targetSpace = projectSpace(s, project)): boolean {
  const e = s.navigation.entries.find(e => e.ref.kind === 'source' && e.ref.id === source);
  if (!e) return !!s.sources.find(r => r.id === source && r.available);
  if (!canReadEntry(s, e)) return false;
  if (!targetSpace) return true;
  if (e.space === targetSpace) return true;
  return !!e.space && s.navigation.spaces.find(t => t.id === e.space)?.access === 'open';
}
export function subtree(s: State, id: string): Entry[] {
  const ids = new Set<string>(), pending = [id];
  while (pending.length) { const next = pending.pop()!; if (ids.has(next)) continue; ids.add(next); pending.push(...s.navigation.entries.filter(e => e.parent === next).map(e => e.id)); }
  return s.navigation.entries.filter(e => ids.has(e.id));
}
export function previewMove(s: State, id: string, target: string | null): MovePreview | null {
  const d = document(s, id); if (!d || d.entry.owner !== 'you' || target && !canEnterSpace(s, target)) return null;
  const affected = subtree(s, id); if (!affected.length || affected.some(e => e.owner !== 'you' || !canReadEntry(s, e))) return null;
  const space = target ? s.navigation.spaces.find(t => t.id === target) : null;
  return { page: id, target, affected: affected.map(e => e.id), basis: JSON.stringify({ target, targetRevision: space?.revision ?? 0, entries: affected.map(e => [e.id, e.revision, e.space, e.parent, e.shared, document(s, e.id)?.revision]) }), before: audience(s, d.entry), after: target ? `${space?.title} members${space?.access === 'open' ? ' · workspace-visible' : ''}` : 'Only you · explicit shares removed', projects: [...new Set(affected.flatMap(e => relatedProjects(s, e).map(p => p.id)))] };
}
export function projectBasis(s: State, id: string): string { const p = s.projects.find(p => p.id === id); return JSON.stringify([projectSpace(s, id), p?.sources, s.navigation.spaces, s.navigation.entries.map(e => [e.id,e.space,e.revision])]); }
const navTypes = new Set(['favorite', 'reorder-favorite', 'create-page', 'save-page', 'move-page', 'share-page', 'assign-project']);
export function apply(state: State, command: Command): Result {
  const denied = (message: string, code: 'denied' | 'stale' | 'invalid' = 'denied'): Result => ({ ok: false, state, message, code });
  if (!navTypes.has(command.type)) {
    const c = command as core.Command;
    if ('project' in c && c.project !== 'general' && !canReadProject(state, c.project)) return denied('Project unavailable.');
    if (c.type === 'link-source' && !compatible(state, c.source, c.project)) return denied('This private or restricted page cannot enter shared project context. Sharing or moving requires a separate review.');
    const result = core.apply(state, c);
    if (!result.ok) return { ...result, state };
    const next = { ...result.state, navigation: structuredClone(state.navigation) };
    if (c.type === 'create-project') next.navigation.projectSpaces[result.id] = null;
    for (const p of next.pages) if (!next.navigation.entries.some(e => e.ref.kind === 'page' && e.ref.id === p.id)) { const a = next.artifacts.find(a => a.target === p.id); next.navigation.entries.push({ id: `page-${p.id}`, ref: { kind: 'page', id: p.id }, owner: 'you', space: a ? projectSpace(next, a.project) : null, parent: null, shared: false, revision: 1 }); }
    return { ...result, state: next };
  }
  const c = command as NavCommand;
  const localPreference = c.type === 'favorite' || c.type === 'reorder-favorite';
  if (state.mode === 'signed-out') return denied('Sign in to inspect or change account-scoped navigation.');
  if (!localPreference && core.writeBlock(state)) return denied(core.writeBlock(state)!);
  const s = structuredClone(state);
  const done = (message: string, id = ''): Result => {
    if (!localPreference) s.events.unshift({ id: core.makeId('event'), project: 'project' in c ? c.project ?? '' : '', title: message, detail: 'Workspace simulation only; content identity is preserved.', time: new Date().toLocaleTimeString('en-GB',{hour:'2-digit',minute:'2-digit'}) });
    return { ok: true, state: s, message, id };
  };
  if (c.type === 'favorite' || c.type === 'reorder-favorite') {
    if (c.ref.kind === 'page' ? !document(s, c.ref.id) : !canReadProject(s, c.ref.id)) return denied('This object is unavailable.');
    const index = s.navigation.favorites.findIndex(f => key(f) === key(c.ref));
    if (c.type === 'favorite') { if (index < 0) s.navigation.favorites.push(c.ref); else s.navigation.favorites.splice(index, 1); return done(index < 0 ? 'Added to your Favorites. Content and access unchanged.' : 'Shortcut removed. Original object preserved.'); }
    const to = index + c.offset; if (index < 0 || to < 0 || to >= s.navigation.favorites.length) return denied('Cannot move this shortcut further.', 'invalid');
    s.navigation.favorites.splice(to, 0, s.navigation.favorites.splice(index, 1)[0]!); return done('Personal shortcut order updated.');
  }
  if (c.type === 'create-page') {
    if (!c.title.trim() || c.title.length > 120 || c.space && !canEnterSpace(s,c.space)) return denied('Choose an accessible destination and a title of 1–120 characters.');
    const parent = c.parent ? document(s,c.parent) : null;
    if (c.parent && (!parent || parent.entry.space !== c.space || parent.entry.owner !== 'you')) return denied('Parent and destination are not compatible.');
    if (c.project && (!canReadProject(s,c.project) || projectSpace(s,c.project) && projectSpace(s,c.project) !== c.space)) return denied('Page audience must match the shared project before it can be linked.');
    const id = core.makeId('note'); s.sources.push({ id, title: c.title.trim(), body: '## Start writing\n\nYour page is saved in the selected location. No AI task has started.', kind: 'Page', revision: 1, observed: 1, available: true, coverage: 'complete', indexed: false });
    const e = entry(id,c.space,c.parent); s.navigation.entries.push(e);
    if (c.project) { const p = s.projects.find(p => p.id === c.project)!; p.sources.push(id); p.sourceHeads[id]=1; }
    return done('Page created. The destination and project link are explicit.',e.id);
  }
  if (c.type === 'assign-project') {
    if (!canReadProject(s,c.project) || c.target && !canEnterSpace(s,c.target)) return denied('Project or destination unavailable.');
    if (projectBasis(s,c.project)!==c.expected) return denied('Project membership or sources changed. Review again.','stale');
    const p = s.projects.find(p => p.id===c.project)!;
    if (p.sources.some(id => !compatible(s,id,p.id,c.target))) return denied('Some source audiences do not match the target teamspace. Nothing was moved.');
    s.navigation.projectSpaces[p.id]=c.target; return done('Project location updated. Referenced pages were not moved.');
  }
  const pageId = c.type === 'move-page' ? c.preview.page : c.page, d = document(s,pageId);
  if (!d || d.entry.owner !== 'you') return denied('This page is unavailable or shared with you read-only.');
  if (c.type === 'save-page') {
    if (d.revision!==c.expected) return denied('The page changed. Reload before saving.','stale');
    if (c.body.length>100000) return denied('The demo page exceeds its size limit.','invalid');
    if (d.entry.ref.kind==='source') { const source=s.sources.find(x=>x.id===d.entry.ref.id)!; source.body=c.body;source.revision++; }
    else { const page=s.pages.find(p=>p.id===d.entry.ref.id)!;page.body=c.body;page.version++; }
    return done('Page saved. Every reference resolves to the same content.');
  }
  if (c.type==='share-page') {
    if (d.entry.space || d.entry.revision!==c.expected) return denied('This private page changed or moved. Review sharing again.','stale');
    d.entry.shared=c.shared; d.entry.revision++; return done(c.shared ? 'Shared read-only with a sample member. Location stays Private.' : 'Explicit read share revoked.');
  }
  const fresh=previewMove(s,c.preview.page,c.preview.target);
  if (!fresh || fresh.basis!==c.preview.basis) return denied('Page subtree or destination changed. Refresh the move preview.','stale');
  if (d.entry.space===fresh.target && !d.entry.parent) return denied('This page is already at that location.','invalid');
  for (const id of fresh.affected) { const e=s.navigation.entries.find(e=>e.id===id)!;e.space=fresh.target;e.shared=false;e.revision++;if(id===fresh.page)e.parent=null; }
  for(const id of fresh.projects) { const p=s.projects.find(p=>p.id===id); if (p && p.sources.some(source=>!compatible(s,source,p.id))) return denied('Moving this page would break a shared project audience. Remove or replace that reference first.'); }
  return done(`Moved ${fresh.affected.length} page${fresh.affected.length===1?'':'s'} after visibility review. Favorites and content IDs preserved.`);
}
export function inject(s: State, kind: 'revoke'|'destination'|'unknown', project: string): State { return { ...core.inject(s,kind,project), navigation: structuredClone(s.navigation) }; }
