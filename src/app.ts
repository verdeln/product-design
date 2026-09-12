import { seed, apply, inject, makeId, writeBlock, type Command, type Mode, type Direction } from './model.js';
import { parseRoute, basePath, detailPath, projectPath, navigate } from './router.js';
import { mainView, modalView, detailView, nav, label, type UI } from './views.js';
import { h, icon, button, download } from './ui.js';
import { load, save } from './storage.js';
const root = document.getElementById('app');
if (!root) throw new Error('Missing application mount');
const app = root;
const loaded = load(); let state = loaded.state;
let route = parseRoute(location.hash), lastBase = basePath(route), returnFocus = '', lastSelected = '';
const ui: UI = { modal: null, search: '', query: '', filter: 'Active', grid: false, selected: new Set(), attachments: [], draft: '', collapsed: false, notice: loaded.notice, review: null, revision: null, settingsTab: 'Appearance' };
if (!location.hash) { history.replaceState(null, '', '#/projects/editor/overview'); route = parseRoute(location.hash); lastBase = basePath(route); }
function persist(): void { if (!save(state)) ui.notice = 'Storage is full or unavailable. Changes remain in memory. Export before closing.'; }
function currentProject() { return state.projects.find(p => p.id === route.project); }
function close(): void {
  if (ui.modal) { ui.modal = null; render(); }
  else { navigate(basePath(route)); }
}
function commit(command: Command): boolean {
  const result = apply(state, command); ui.notice = result.message;
  if (result.ok) { state = result.state; persist(); return true; }
  return false;
}
function render(): void {
  const active = document.activeElement; const focusId = active?.id ?? '';
  const selection: [number | null, number | null] | null = active instanceof HTMLInputElement || active instanceof HTMLTextAreaElement ? [active.selectionStart, active.selectionEnd] : null;
  const p = state.mode === 'signed-out' ? undefined : currentProject();
  document.documentElement.dataset.theme = state.dark ? 'dark' : 'light';
  document.documentElement.dataset.direction = state.direction;
  document.documentElement.style.colorScheme = state.dark ? 'dark' : 'light';
  const title = state.mode === 'signed-out' ? 'Your workspace stays private.' : route.invalid ? 'View unavailable' : p ? route.section === 'overview' ? p.title : label(route.section) : ({ home: 'Your work, in one place.', projects: 'Projects', resources: 'Your Library', chat: 'A little context goes a long way.' })[route.area];
  document.title = `${title} · Verdeln prototype`;
  const subtitle = p ? ({ overview: 'Shared context. Clear decisions. Useful outcomes.', chat: 'Explore ideas. Accept work deliberately.', sources: 'The material behind your decisions.', highlights: 'The passages worth keeping close.', work: 'Know what is moving, and what needs you.', outputs: 'Useful work, ready to inspect and build on.', activity: 'A traceable account of what changed.' })[route.section] : ({ home: 'A quieter way to keep meaningful work moving.', projects: 'From a first question to something worth sharing.', resources: 'Reusable material, without making extra copies.', chat: 'A scripted conversation preview. No model is connected.' })[route.area];
  const topAction = p ? route.section === 'sources' ? button('Add source', 'add-source', { icon: 'plus', primary: true }) : route.section === 'work' ? button('Add work', 'new-task', { icon: 'plus', primary: true }) : route.section === 'outputs' ? button('Export project', 'export-project', { icon: 'download' }) : `<a class="btn primary" href="#${projectPath(p.id, 'chat')}">${icon('spark', 16)}Ask coordinator</a>` : route.area === 'projects' || route.area === 'home' ? button('New project', 'new-project', { icon: 'plus', primary: true }) : '';
  const showDetail = route.kind && route.item && !route.full && !ui.modal && state.mode !== 'signed-out';
  let overlay = '';
  if (ui.modal) {
    const modal = ui.modal === 'project-actions' ? { title: 'Project actions', body: `<div class="action-stack">${button('Export project data', 'export-project', { icon: 'download' })}${button(p?.archived ? 'Restore project' : 'Archive project', 'archive', { icon: 'projects' })}${button('Workspace settings', 'settings', { icon: 'settings' })}</div><p class="note">Project references do not own or delete source content.</p>` } : modalView(state, route, ui);
    overlay = `<dialog id="overlay" class="modal ${ui.modal === 'publish' ? 'review-modal' : ''} ${ui.modal === 'nav' ? 'nav-modal' : ''}" aria-labelledby="modal-title"><header><h2 id="modal-title">${h(modal.title)}</h2>${button('', 'close', { icon: 'close', extra: 'aria-label="Close dialog"' })}</header><div class="modal-body">${ui.notice ? `<div class="modal-inline" role="status">${h(ui.notice)}</div>` : ''}${modal.body}</div></dialog>`;
  } else if (showDetail) overlay = `<dialog id="overlay" class="peek" aria-label="Object detail"><header><span class="eyebrow">INSPECT ${h(route.kind ?? '')}</span><div><a class="icon-btn" aria-label="Open full page" href="#${detailPath(route, route.kind!, route.item!, true)}">${icon('expand')}</a>${button('', 'close', { icon: 'close', extra: 'aria-label="Close detail"' })}</div></header><div class="detail-body">${detailView(state, route, ui)}</div></dialog>`;
  app.innerHTML = `<a href="#main-content" class="skip-link" id="skip-link">Skip to content</a><div class="app-shell ${ui.collapsed ? 'collapsed' : ''}"><aside class="sidebar">${nav(state, route, ui)}</aside><div class="workspace"><header class="topbar"><div class="breadcrumb">${button('', 'nav', { icon: 'menu', extra: 'aria-label="Open sections" data-mobile-nav' })}<span>Workspace</span>${icon('chevron', 13)}<strong>${p ? h(p.title) : label(route.area)}</strong></div><div class="top-actions"><span class="prototype-tag">PROTOTYPE</span><div class="direction-switch" role="group" aria-label="Layout direction">${(['studio', 'focus', 'console'] as const).map((direction, i) => `<button data-action="direction:${direction}" aria-label="${['A', 'B', 'C'][i]} ${label(direction)} layout" aria-pressed="${state.direction === direction}" class="${state.direction === direction ? 'selected' : ''}">${['A', 'B', 'C'][i]}<span> ${label(direction)}</span></button>`).join('')}</div>${button('', 'search', { icon: 'search', extra: 'aria-label="Search workspace" title="Search · ⌘K"' })}${button('', 'theme', { icon: state.dark ? 'sun' : 'moon', extra: 'aria-label="Toggle appearance"' })}</div></header><div class="prototype-note">Interactive design study <span>·</span> Synthetic data, no live agents or external actions <button data-action="scenarios">Explore states ${icon('arrow', 12)}</button></div><main id="main-content" tabindex="-1"><div class="page-heading"><div><div class="eyebrow">${p ? 'PROJECT WORKSPACE' : 'YOUR WORKSPACE'}${p?.archived ? ' · ARCHIVED' : ''}</div><h1>${h(title)}</h1><p>${h(subtitle)}</p></div><div class="heading-actions">${state.mode !== 'signed-out' ? topAction : ''}${p ? button('', 'project-actions', { icon: 'more', extra: 'aria-label="Project actions"' }) : ''}</div></div>${writeBlock(state, p) && state.mode !== 'signed-out' ? `<div class="environment-banner" role="status">${icon('lock', 17)}<span>${h(writeBlock(state, p))}</span>${button(state.mode !== 'ready' ? 'Return to ready demo' : 'Restore', state.mode !== 'ready' ? 'mode:ready' : 'confirm-archive')}</div>` : ''}<div class="page-content">${mainView(state, route, ui)}</div><footer class="page-footer"><span>Verdeln / Project Workspace</span><span>${label(state.direction)} study · Sample state only</span></footer></main></div></div><nav class="mobile-bottom" aria-label="Mobile primary">${[['home', '/', 'Home'], ['resources', '/resources', 'Library'], ['projects', '/projects', 'Projects'], ['chat', '/chat', 'AI']].filter(([key]) => state.mode !== 'signed-out' || key === 'home' || key === 'chat').map(([key, path, text]) => `<a href="#${path}" ${route.area === key ? 'aria-current="page"' : ''}>${icon(key === 'chat' ? 'spark' : key ?? '')}<span>${text}</span></a>`).join('')}</nav>${overlay}${ui.notice ? `<div class="toast" role="status"><span>${h(ui.notice)}</span>${button('', 'dismiss-notice', { icon: 'close', extra: 'aria-label="Dismiss message"' })}</div>` : ''}`;
  // Stable control IDs survive a view projection refresh and restore modal opener focus.
  const keyCounts = new Map<string, number>();
  app.querySelectorAll<HTMLElement>('a[href],button[data-action],input[name],textarea[name],select[name]').forEach(el => {
    if (el.id) return;
    const key = `${el.tagName}:${el.getAttribute('href') ?? el.dataset.action ?? el.getAttribute('name')}:${el.closest('form')?.dataset.form ?? ''}`;
    const n = keyCounts.get(key) ?? 0; keyCounts.set(key, n + 1);
    let hash = 2166136261; for (const char of key) hash = Math.imul(hash ^ char.charCodeAt(0), 16777619);
    el.id = `control-${(hash >>> 0).toString(36)}-${n}`;
  });
  const dialog = document.getElementById('overlay');
  if (dialog instanceof HTMLDialogElement) {
    dialog.showModal();
    dialog.addEventListener('keydown', event => {
      if (event.key !== 'Tab') return;
      const items = Array.from(dialog.querySelectorAll<HTMLElement>('a[href],button:not(:disabled),input:not(:disabled):not([type=hidden]),textarea:not(:disabled),select:not(:disabled),[tabindex="0"]')).filter(el => el.getClientRects().length > 0);
      const first = items[0], last = items.at(-1);
      if (!first || !last) { event.preventDefault(); dialog.focus(); return; }
      if (event.shiftKey && (document.activeElement === first || document.activeElement === dialog)) { event.preventDefault(); last.focus(); }
      else if (!event.shiftKey && document.activeElement === last) { event.preventDefault(); first.focus(); }
    });
    dialog.addEventListener('cancel', event => { event.preventDefault(); close(); });
    dialog.addEventListener('click', event => { if (event.target === dialog) { const rect = dialog.getBoundingClientRect(); if (event.clientX < rect.left || event.clientX > rect.right || event.clientY < rect.top || event.clientY > rect.bottom) close(); } });
  }
  const restore = focusId ? document.getElementById(focusId) : null;
  if (restore instanceof HTMLElement && (!dialog || dialog.contains(restore))) {
    restore.focus({ preventScroll: true });
    if (selection && (restore instanceof HTMLInputElement || restore instanceof HTMLTextAreaElement) && restore.type !== 'checkbox' && restore.type !== 'number') { try { restore.setSelectionRange(selection[0], selection[1]); } catch { /* Some input types do not expose a caret. */ } }
  } else if (ui.modal === 'search') document.getElementById('global-search')?.focus();
  else if (!dialog && returnFocus) { document.getElementById(returnFocus)?.focus({ preventScroll: true }); returnFocus = ''; }
}
function openModal(name: string): void { returnFocus = document.activeElement?.id ?? ''; ui.modal = name; render(); }
function setReview(id: string): void {
  const a = state.artifacts.find(a => a.id === id && a.project === route.project), target = state.pages.find(p => p.id === a?.target);
  const revision = a?.revisions.find(v => v.number === ui.revision) ?? a?.revisions.at(-1);
  if (a && target && revision) { ui.review = { artifact: id, revision: revision.number, expectedTarget: target.version, requestId: makeId('publication') }; ui.modal = 'publish'; }
}
app.addEventListener('click', event => {
  if (!(event.target instanceof Element)) return;
  if (event.target instanceof HTMLInputElement && event.target.dataset.select) {
    const checkbox = event.target; const id = checkbox.dataset.select!; const checked = checkbox.checked;
    event.preventDefault();
    const ids = Array.from(app.querySelectorAll<HTMLInputElement>('[data-select]')).map(el => el.dataset.select!);
    const a = ids.indexOf(lastSelected), b = ids.indexOf(id);
    const targets = event.shiftKey && a >= 0 ? ids.slice(Math.min(a, b), Math.max(a, b) + 1) : [id];
    for (const key of targets) { if (checked) ui.selected.add(key); else ui.selected.delete(key); }
    lastSelected = id; render(); return;
  }
  const anchor = event.target.closest('a');
  if (anchor?.id === 'skip-link') { event.preventDefault(); document.getElementById('main-content')?.focus(); return; }
  if (anchor?.getAttribute('href')?.startsWith('#') && !(event.metaKey || event.ctrlKey || event.shiftKey || event.altKey)) { event.preventDefault(); ui.modal = null; const path = anchor.getAttribute('href')!.slice(1); if ('#' + path === location.hash) render(); else { returnFocus = anchor.id; navigate(path); } return; }
  const target = event.target.closest<HTMLElement>('[data-action]'); if (!target || target instanceof HTMLButtonElement && target.disabled) return;
  const [action, id = ''] = (target.dataset.action ?? '').split(':'); const p = currentProject();
  if (['settings', 'search', 'new-project', 'new-task', 'add-source', 'remove-sources', 'archive', 'scenarios', 'nav', 'project-actions'].includes(action ?? '')) { openModal(action!); return; }
  if (action === 'close') { close(); return; }
  if (action === 'theme') { state.dark = !state.dark; persist(); }
  if (action === 'collapse') ui.collapsed = !ui.collapsed;
  if (action === 'direction' && ['studio', 'focus', 'console'].includes(id)) { state.direction = id as Direction; persist(); }
  if (action === 'mode' && ['ready', 'offline', 'viewer', 'signed-out'].includes(id)) { state.mode = id as Mode; ui.modal = null; ui.attachments = []; persist(); }
  if (action === 'settings-tab') ui.settingsTab = id;
  if (action === 'filter') ui.filter = id;
  if (action === 'grid') ui.grid = !ui.grid;
  if (action === 'dismiss-notice') ui.notice = '';
  if (action === 'reset-confirm') ui.modal = 'reset';
  if (action === 'reset') { const { direction, dark } = state; state = seed(); state.direction = direction; state.dark = dark; ui.modal = null; ui.selected.clear(); ui.attachments = []; ui.notice = 'Sample data reset. No real project data was changed.'; persist(); navigate(projectPath('editor')); }
  if (action === 'dry-run') ui.notice = 'Dry run: prepare one draft from selected sources; wait for human review before publication. No task was started.';
  if (action === 'inject' && p && ['revoke', 'destination', 'unknown'].includes(id)) { state = inject(state, id as 'revoke' | 'destination' | 'unknown', p.id); persist(); ui.notice = `Injected ${id} scenario · sample data only`; if (ui.modal === 'scenarios') ui.modal = null; }
  if (action === 'attach' && p) { const source = state.sources.find(s => s.id === id); if (!source?.available || !p.sources.includes(id)) ui.notice = 'That context is not available.'; else { if (!ui.attachments.includes(id)) ui.attachments.push(id); ui.modal = null; ui.notice = 'Context attached, not sent or indexed.'; navigate(projectPath(p.id, 'chat')); } }
  if (action === 'detach') ui.attachments = ui.attachments.filter(v => v !== id);
  if (action === 'link-source' && p) { if (commit({ type: 'link-source', project: p.id, source: id })) ui.modal = null; }
  if (action === 'confirm-remove' && p) { if (commit({ type: 'remove-sources', project: p.id, sources: [...ui.selected] })) { ui.selected.clear(); ui.modal = null; } }
  if (action === 'confirm-archive' && p) { if (commit({ type: 'archive', project: p.id })) ui.modal = null; }
  if ((action === 'review-source' || action === 'index-source') && p) commit({ type: action, project: p.id, source: id });
  if ((action === 'cancel' || action === 'advance') && p) commit({ type: action, project: p.id, task: id });
  if (action === 'verify-effect' && p) commit({ type: 'verify-effect', project: p.id, effect: id });
  if (action === 'publish') setReview(id);
  if (action === 'refresh-review' && ui.review) { setReview(ui.review.artifact); ui.notice = 'Review refreshed. Inspect the current destination before approving.'; }
  if (action === 'approve-publish' && ui.review && p) { if (commit({ type: 'publish', project: p.id, ...ui.review })) ui.modal = null; }
  if (action === 'export-project' && p && state.mode !== 'signed-out') {
    // Export only source references permitted by the current simulated access projection.
    const sources = state.sources.filter(r => p.sources.includes(r.id) && r.available);
    download(`${p.id}-prototype.json`, JSON.stringify({ prototype: true, project: { ...p, sources: sources.map(s => s.id) }, sources, tasks: state.tasks.filter(t => t.project === p.id), artifacts: state.artifacts.filter(a => a.project === p.id) }, null, 2), 'application/json'); ui.notice = 'Sample project exported. This is not an export of your real workspace.';
  }
  if (action === 'export-artifact' && state.mode !== 'signed-out') { const a = state.artifacts.find(a => a.id === id && a.project === route.project); const v = a?.revisions.find(v => v.number === ui.revision) ?? a?.revisions.at(-1); if (a && v) download(`artifact-r${v.number}.md`, `<!-- SYNTHETIC PROTOTYPE OUTPUT -->\n# ${a.title}\n\n${v.body}`, 'text/markdown'); }
  render();
});
app.addEventListener('input', event => {
  const target = event.target; if (!(target instanceof HTMLInputElement || target instanceof HTMLTextAreaElement)) return;
  if (target.id === 'view-search') { ui.query = target.value; render(); }
  if (target.id === 'global-search') { ui.search = target.value; render(); }
  if (target.id === 'chat-input') ui.draft = target.value;
});
app.addEventListener('change', event => {
  const target = event.target;
  if (target instanceof HTMLInputElement && target.dataset.select) { if (target.checked) ui.selected.add(target.dataset.select); else ui.selected.delete(target.dataset.select); render(); }
  if (target instanceof HTMLInputElement && target.id === 'rule-toggle') { commit({ type: 'rule', enabled: target.checked }); render(); }
  if (target instanceof HTMLSelectElement && target.id === 'artifact-revision') { ui.revision = Number(target.value); render(); }
  if (target instanceof HTMLSelectElement && target.id === 'mode-select' && ['ready', 'offline', 'viewer', 'signed-out'].includes(target.value)) { state.mode = target.value as Mode; ui.attachments = []; persist(); render(); }
});
app.addEventListener('submit', event => {
  const form = event.target; if (!(form instanceof HTMLFormElement)) return; event.preventDefault();
  const data = new FormData(form), value = (name: string) => String(data.get(name) ?? ''), p = currentProject();
  if (form.dataset.form === 'new-project') { const result = apply(state, { type: 'create-project', title: value('title'), goal: value('goal') }); ui.notice = result.message; if (result.ok) { state = result.state; persist(); ui.modal = null; navigate(projectPath(result.id)); } }
  if (form.dataset.form === 'new-task' && p) { if (commit({ type: 'create-task', project: p.id, title: value('title'), criteria: value('criteria').split('\n').filter(v => v.trim()), kind: value('kind') === 'human' ? 'human' : 'ai' })) { ui.modal = null; navigate(projectPath(p.id, 'work')); } }
  if (form.dataset.form === 'highlight' && p) commit({ type: 'highlight', project: p.id, source: value('source'), quote: value('quote'), note: value('note') });
  if (form.dataset.form === 'note' && p) commit({ type: 'edit-note', project: p.id, id: value('id'), note: value('note') });
  if (form.dataset.form === 'respond' && p) commit({ type: 'respond', project: p.id, task: value('task'), text: value('response') });
  if (form.dataset.form === 'link-library') commit({ type: 'link-source', project: value('project'), source: value('source') });
  if (form.dataset.form === 'chat') { if (commit({ type: 'message', project: p?.id ?? 'general', text: value('message'), sources: ui.attachments })) { ui.draft = ''; ui.attachments = []; } }
  render();
});
window.addEventListener('hashchange', () => {
  const next = parseRoute(location.hash), base = basePath(next);
  const closingDetail = !!route.kind && !next.kind; const changedBase = base !== lastBase;
  if (base !== lastBase) { ui.query = ''; ui.selected.clear(); lastSelected = ''; ui.filter = next.section === 'work' || next.area === 'projects' && !next.project ? 'Active' : 'All'; ui.grid = false; }
  if (next.project !== route.project) { ui.attachments = []; ui.draft = ''; }
  if (next.item !== route.item) ui.revision = null;
  route = next; lastBase = base; ui.modal = null; render();
  if (!next.kind && (!closingDetail && changedBase || !document.getElementById(returnFocus) && document.activeElement === document.body)) document.getElementById('main-content')?.focus({ preventScroll: true });
});
window.addEventListener('keydown', event => { if ((event.metaKey || event.ctrlKey) && event.key.toLowerCase() === 'k') { event.preventDefault(); openModal('search'); } });
render();

// Drag is an optional shortcut to the same visible attachment operation, never a send.
app.addEventListener('dragstart', event => {
  const el = event.target instanceof Element ? event.target.closest<HTMLElement>('[data-drag-source]') : null;
  const source = state.sources.find(s => s.id === el?.dataset.dragSource);
  if (!source?.available || !event.dataTransfer) return;
  event.dataTransfer.setData('application/x-verdeln-source', source.id);
  event.dataTransfer.effectAllowed = 'copy';
});
app.addEventListener('dragover', event => {
  const el = event.target instanceof Element ? event.target.closest('[data-drop-context]') : null;
  if (el && event.dataTransfer?.types.includes('application/x-verdeln-source')) { event.preventDefault(); el.classList.add('drop-context'); }
});
app.addEventListener('dragleave', event => { if (event.target instanceof Element) event.target.closest('[data-drop-context]')?.classList.remove('drop-context'); });
app.addEventListener('drop', event => {
  const el = event.target instanceof Element ? event.target.closest('[data-drop-context]') : null;
  if (!el) return;
  event.preventDefault(); el.classList.remove('drop-context');
  const id = event.dataTransfer?.getData('application/x-verdeln-source'), p = currentProject();
  if (!id || !p || state.mode === 'signed-out' || !p.sources.includes(id) || !state.sources.find(s => s.id === id)?.available) return;
  if (!ui.attachments.includes(id)) ui.attachments.push(id);
  ui.notice = 'Context attached, not sent or indexed.';
  navigate(projectPath(p.id, 'chat')); render();
});
