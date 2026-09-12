export const h = (value: unknown): string => String(value ?? '').replace(/[&<>"']/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' })[c] ?? c);
const paths: Record<string, string> = {
  home: '<path d="m3 10 9-7 9 7v10H3Z"/><path d="M9 20v-7h6v7"/>',
  projects: '<rect x="3" y="4" width="18" height="16" rx="3"/><path d="M8 8v6m4-6v9m4-9v4"/>',
  resources: '<path d="M4 4h4v16H4zM10 4h4v16h-4zM17 4l4 15-3 1-4-15z"/>',
  chat: '<path d="M21 11a8 8 0 0 1-8 8H7l-4 3V7a4 4 0 0 1 4-4h6a8 8 0 0 1 8 8Z"/><path d="M7 8h9M7 12h6"/>',
  spark: '<path d="m12 3 2.5 6.5L21 12l-6.5 2.5L12 21l-2.5-6.5L3 12l6.5-2.5ZM20 2v4m-2-2h4"/>',
  overview: '<rect x="3" y="3" width="7" height="7" rx="1"/><rect x="14" y="3" width="7" height="7" rx="1"/><rect x="3" y="14" width="7" height="7" rx="1"/><rect x="14" y="14" width="7" height="7" rx="1"/>',
  sources: '<path d="M7 4h8l4 4v12H7zM15 4v5h4M3 7v14"/>',
  highlights: '<path d="m5 13 8-9 6 6-9 8H5Zm-2 8h13M10 9l6 6"/>',
  work: '<rect x="3" y="4" width="18" height="16" rx="3"/><path d="m6 10 2 2 3-4m3 2h4M6 16h12"/>',
  outputs: '<path d="M5 3h10l4 4v14H5zM15 3v5h4M9 12h6M9 16h6"/>',
  activity: '<path d="M3 12h4l3-8 4 16 3-8h4"/>',
  search: '<circle cx="10" cy="10" r="7"/><path d="m15 15 6 6"/>',
  settings: '<path d="M4 6h16M4 12h16M4 18h16M8 3v6m8 0v6m-6 0v6"/>',
  plus: '<path d="M12 5v14M5 12h14"/>', close: '<path d="m6 6 12 12M6 18 18 6"/>',
  arrow: '<path d="M4 12h16m-6-6 6 6-6 6"/>', back: '<path d="M20 12H4m6-6-6 6 6 6"/>',
  chevron: '<path d="m9 5 7 7-7 7"/>', down: '<path d="m6 9 6 6 6-6"/>',
  check: '<path d="m5 12 4 4L19 6"/>', circle: '<circle cx="12" cy="12" r="8"/>',
  clock: '<circle cx="12" cy="12" r="9"/><path d="M12 6v6l4 2"/>',
  warning: '<path d="M12 3 2 21h20ZM12 9v5m0 3v1"/>',
  lock: '<rect x="5" y="10" width="14" height="11" rx="2"/><path d="M8 10V6a4 4 0 0 1 8 0v4"/>',
  moon: '<path d="M20 15a9 9 0 0 1-11-11 9 9 0 1 0 11 11Z"/>',
  sun: '<circle cx="12" cy="12" r="4"/><path d="M12 1v3m0 16v3M1 12h3m16 0h3M4 4l2 2m12 12 2 2M4 20l2-2M18 6l2-2"/>',
  menu: '<path d="M4 6h16M4 12h16M4 18h16"/>',
  expand: '<path d="M14 3h7v7m0-7-9 9M10 21H3v-7m0 7 9-9"/>',
  more: '<circle cx="5" cy="12" r="1"/><circle cx="12" cy="12" r="1"/><circle cx="19" cy="12" r="1"/>',
  download: '<path d="M12 3v12m-5-5 5 5 5-5M4 16v5h16v-5"/>',
  lab: '<path d="M8 3h8m-6 0v7l-6 10h16l-6-10V3M7 16h10"/>',
  link: '<path d="m10 14 4-4m-7 4-2 2a3 3 0 0 0 4 4l4-4m-2-8 4-4a3 3 0 0 1 4 4l-2 2"/>',
  cloud: '<path d="M6 18a5 5 0 0 1-1-10 7 7 0 0 1 13-1 5 5 0 0 1 0 11Z"/>',
  eye: '<path d="M2 12s4-7 10-7 10 7 10 7-4 7-10 7-10-7-10-7Z"/><circle cx="12" cy="12" r="3"/>',
  trash: '<path d="M3 6h18M9 3h6M6 6l1 15h10l1-15M10 10v7m4-7v7"/>',
};
export function icon(name: string, size = 18): string { return `<svg width="${size}" height="${size}" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">${paths[name] ?? paths.outputs}</svg>`; }
export function button(label: string, action: string, options: { icon?: string; primary?: boolean; id?: string; disabled?: boolean; reason?: string; extra?: string } = {}): string {
  return `<button type="button" class="btn ${options.primary ? 'primary' : ''}" data-action="${h(action)}" ${options.id ? `id="${h(options.id)}"` : ''} ${options.disabled ? `disabled title="${h(options.reason ?? 'Unavailable')}"` : ''} ${options.extra ?? ''}>${options.icon ? icon(options.icon) : ''}${h(label)}</button>`;
}
export const badge = (label: string, tone = 'neutral') => `<span class="badge ${h(tone)}"><span class="status-dot" aria-hidden="true"></span>${h(label)}</span>`;
export const empty = (title: string, body: string, action = '') => `<div class="empty">${icon('sources', 30)}<h2>${h(title)}</h2><p>${h(body)}</p>${action}</div>`;
export function markdown(text: string): string { return text.split('\n').map(line => line.startsWith('## ') ? `<h3>${h(line.slice(3))}</h3>` : line ? `<p>${h(line)}</p>` : '').join(''); }
export function download(name: string, text: string, mime: string): void {
  const url = URL.createObjectURL(new Blob([text], { type: mime })); const a = document.createElement('a');
  a.href = url; a.download = name; a.click(); setTimeout(() => URL.revokeObjectURL(url), 1000);
}
