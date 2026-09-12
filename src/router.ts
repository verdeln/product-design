import type { Section } from './model.js';
export const sections: Section[] = ['overview', 'chat', 'sources', 'highlights', 'work', 'outputs', 'activity'];
export const detailKinds = ['source', 'task', 'artifact', 'highlight', 'effect', 'page'] as const;
export type DetailKind = typeof detailKinds[number];
export type Route = { area: 'home' | 'resources' | 'projects' | 'chat'; project: string | null; section: Section; kind: DetailKind | null; item: string | null; full: boolean; invalid: boolean };
export function parseRoute(hash: string): Route {
  let invalid = false, decoded = '';
  try { decoded = decodeURI(hash.replace(/^#/, '') || '/'); } catch { invalid = true; }
  const [path = '/', query = ''] = decoded.split('?'); const parts = path.split('/').filter(Boolean), params = new URLSearchParams(query);
  const first = parts[0] ?? 'home';
  const area: Route['area'] = first === 'projects' || first === 'resources' || first === 'chat' ? first : 'home';
  if (!['home', 'projects', 'resources', 'chat'].includes(first) || (area !== 'projects' && parts.length > 1) || parts.length > 3) invalid = true;
  const section = sections.find(v => v === parts[2]) ?? 'overview';
  if (parts[2] && !sections.includes(parts[2] as Section)) invalid = true;
  const rawKind = params.get('kind'), kind = detailKinds.find(v => v === rawKind) ?? null;
  if (rawKind && !kind) invalid = true;
  if ((kind && !params.get('item')) || (!kind && params.get('item'))) invalid = true;
  return { area, project: area === 'projects' ? parts[1] ?? null : null, section, kind, item: params.get('item'), full: params.get('full') === '1', invalid };
}
export function projectPath(id: string, section: Section = 'overview'): string { return `/projects/${encodeURIComponent(id)}/${section}`; }
export function basePath(r: Route): string { return r.project ? projectPath(r.project, r.section) : r.area === 'home' ? '/' : '/' + r.area; }
export function detailPath(r: Route, kind: DetailKind, id: string, full = false): string { const q = new URLSearchParams({ kind, item: id }); if (full) q.set('full', '1'); return `${basePath(r)}?${q}`; }
export function navigate(path: string, replace = false): void { if (replace) { history.replaceState(null, '', '#' + path); dispatchEvent(new HashChangeEvent('hashchange')); } else location.hash = path; }
