/** Synthetic interaction model only. Never use this as production authorization or Task authority. */
export type Mode = 'ready' | 'offline' | 'viewer' | 'signed-out';
export type Direction = 'studio' | 'focus' | 'console';
export type TaskStatus = 'working' | 'waiting' | 'cancelling' | 'completed' | 'failed' | 'cancelled';
export type Section = 'overview' | 'chat' | 'sources' | 'highlights' | 'work' | 'outputs' | 'activity';
export type Source = { id: string; title: string; kind: 'Page' | 'Web' | 'Repository' | 'File' | 'Knowledge'; revision: number; observed: number; available: boolean; coverage: 'complete' | 'partial' | 'unmaterialized'; indexed: boolean; body: string };
export type Criterion = { text: string; satisfied: boolean };
export type Project = { id: string; title: string; goal: string; category: string; archived: boolean; sources: string[]; sourceHeads: Record<string, number>; decisions: string[] };
export type Task = { id: string; project: string; title: string; kind: 'ai' | 'human'; status: TaskStatus; reason: 'approval' | 'input' | 'none' | 'unknown'; criteria: Criterion[]; evidence: string[]; cost: number; budget: number };
export type Artifact = { id: string; project: string; task: string; title: string; status: 'accepted' | 'draft'; revisions: { number: number; body: string }[]; target: string; publication: null | { revision: number; targetVersion: number; receipt: string } };
export type Highlight = { id: string; project: string; source: string; quote: string; note: string; revision: number };
export type Effect = { id: string; project: string; task: string; status: 'unknown' | 'confirmed'; body: string };
export type Event = { id: string; project: string; title: string; detail: string; time: string };
export type Message = { id: string; project: string; role: 'user' | 'assistant'; text: string; sources: string[] };
export type State = { schema: 1; mode: Mode; direction: Direction; dark: boolean; projects: Project[]; sources: Source[]; tasks: Task[]; artifacts: Artifact[]; highlights: Highlight[]; effects: Effect[]; pages: { id: string; title: string; version: number; body: string }[]; events: Event[]; messages: Message[]; receipts: Record<string, string>; ruleEnabled: boolean };
export type Attention = { id: string; project: string; title: string; detail: string; kind: 'artifact' | 'task' | 'source' | 'effect'; item: string; cta: string };
export type Command =
  | { type: 'create-project'; title: string; goal: string }
  | { type: 'archive'; project: string }
  | { type: 'link-source'; project: string; source: string }
  | { type: 'remove-sources'; project: string; sources: string[] }
  | { type: 'review-source'; project: string; source: string }
  | { type: 'index-source'; project: string; source: string }
  | { type: 'highlight'; project: string; source: string; quote: string; note: string }
  | { type: 'edit-note'; project: string; id: string; note: string }
  | { type: 'create-task'; project: string; title: string; criteria: string[]; kind: 'ai' | 'human' }
  | { type: 'respond'; project: string; task: string; text: string }
  | { type: 'cancel'; project: string; task: string }
  | { type: 'advance'; project: string; task: string }
  | { type: 'publish'; project: string; artifact: string; revision: number; expectedTarget: number; requestId: string }
  | { type: 'verify-effect'; project: string; effect: string }
  | { type: 'message'; project: string; text: string; sources: string[] }
  | { type: 'rule'; enabled: boolean };
export type Result = { ok: true; state: State; message: string; id: string } | { ok: false; state: State; message: string; code: 'denied' | 'stale' | 'invalid' | 'unknown' };
export const makeId = (prefix: string): string => `${prefix}-${crypto.randomUUID?.() ?? Array.from(crypto.getRandomValues(new Uint8Array(16)), n => n.toString(16).padStart(2, '0')).join('')}`;
const uid = makeId;
const spec = '## A shared editing session\n\nKeep selection local to the focused surface. Persist only accepted document changes through the existing document authority.\n\n## Acceptance\n\n1. Preserve concurrent edits.\n2. Keep a verifiable source and revision.\n3. Review the exact change before publishing.\n\n## Next step\n\nRun the collaboration regression suite against the chosen writer. Record evidence before considering the work complete.';
export function seed(): State {
  return {
    schema: 1, mode: 'ready', direction: 'studio', dark: false,
    projects: [
      { id: 'editor', title: 'Editor collaboration', goal: 'Make working together feel as natural as working alone.', category: 'PRODUCT ENGINEERING', archived: false, sources: ['rfc', 'notes', 'repo', 'interviews'], sourceHeads: {rfc:12, notes:3, repo:8, interviews:2}, decisions: ['One document authority. No hidden content mirrors.', 'Review the exact revision before publishing.'] },
      { id: 'research', title: 'Agent field notes', goal: 'Turn useful research into decisions we can actually build on.', category: 'RESEARCH', archived: false, sources: ['notes', 'corpus'], sourceHeads: {notes:2, corpus:3}, decisions: ['Keep observations separate from confirmed decisions.'] },
      { id: 'launch', title: 'A quieter launch', goal: 'A thoughtful first release, with a clear story and useful feedback.', category: 'CREATIVE WORK', archived: false, sources: [], sourceHeads: {}, decisions: [] }
    ],
    sources: [
      { id: 'rfc', title: 'Shared editing · design RFC', kind: 'Page', revision: 12, observed: 12, available: true, coverage: 'complete', indexed: false, body: 'The workspace editing session owns one intent history. Selection is local to a surface; accepted changes flow through document authority. An AI proposal must be reviewed against the current target revision.' },
      { id: 'notes', title: 'Notes on collaborative interfaces', kind: 'Web', revision: 4, observed: 3, available: true, coverage: 'complete', indexed: false, body: 'Revision 4 adds a review requirement when a destination changes. Relative positions can preserve location, but do not prove that an earlier approval still describes the same change.' },
      { id: 'repo', title: 'verdeln / verdeln', kind: 'Repository', revision: 8, observed: 8, available: true, coverage: 'partial', indexed: false, body: 'Synthetic repository observation. Metadata is available; code and CI evidence have not been fetched. No real GitHub connection is made by this prototype.' },
      { id: 'interviews', title: 'Co-editing interview notes', kind: 'File', revision: 2, observed: 2, available: true, coverage: 'unmaterialized', indexed: false, body: 'Synthetic interview extract: participants wanted a clear way to inspect changes and resume their own work without losing selection.' },
      { id: 'corpus', title: 'Agent research collection', kind: 'Knowledge', revision: 3, observed: 3, available: true, coverage: 'complete', indexed: true, body: 'Synthetic retrieval corpus. Linking a source and indexing it are different operations. This prototype makes no embedding or model calls.' }
    ],
    tasks: [
      { id: 'brief', project: 'editor', title: 'Prepare the collaboration brief', kind: 'ai', status: 'waiting', reason: 'approval', criteria: [{ text: 'Reference the selected design RFC', satisfied: true }, { text: 'Produce a complete, accepted brief', satisfied: true }, { text: 'Publish the reviewed revision', satisfied: false }], evidence: ['Design RFC · revision 12', 'Brief · accepted revision 2'], cost: 0.18, budget: 2 },
      { id: 'verify', project: 'editor', title: 'Verify concurrent editing behavior', kind: 'ai', status: 'working', reason: 'none', criteria: [{ text: 'Inspect the selected sources', satisfied: true }, { text: 'Prepare a verification report', satisfied: false }, { text: 'Publish the reviewed report', satisfied: false }], evidence: ['Selected sources inspected · simulated'], cost: 0.07, budget: 1 },
      { id: 'qa', project: 'editor', title: 'Review keyboard and IME behavior', kind: 'human', status: 'working', reason: 'none', criteria: [{ text: 'Manual review recorded', satisfied: false }], evidence: [], cost: 0, budget: 0 },
      { id: 'scope', project: 'research', title: 'Choose the research scope', kind: 'ai', status: 'waiting', reason: 'input', criteria: [{ text: 'Receive an explicit research scope', satisfied: false }, { text: 'Produce an evidence-backed summary', satisfied: false }, { text: 'Publish the reviewed summary', satisfied: false }], evidence: [], cost: 0, budget: 1.5 }
    ],
    artifacts: [{ id: 'brief-output', project: 'editor', task: 'brief', title: 'Collaboration brief', status: 'accepted', revisions: [{ number: 1, body: '## Collaboration brief\n\nUse one document authority. Preserve human edits.\n\nInitial draft, before the explicit acceptance checklist.' }, { number: 2, body: spec }], target: 'brief-page', publication: null }],
    pages: [{ id: 'brief-page', title: 'Collaboration brief · workspace page', version: 3, body: '## Working notes\n\nThe existing page has an early outline. Review changes before replacing this content in the simulation.' }],
    highlights: [{ id: 'h1', project: 'editor', source: 'rfc', quote: 'Selection is local to a surface; accepted changes flow through document authority.', note: 'A useful boundary for the next implementation review.', revision: 12 }],
    effects: [], receipts: {}, ruleEnabled: false,
    messages: [{ id: 'welcome', project: 'editor', role: 'assistant', text: 'The collaboration brief is ready for your review. One source has a newer revision. I have not published anything or changed your existing page.', sources: ['rfc'] }],
    events: [
      { id: 'e3', project: 'editor', title: 'Brief revision accepted', detail: 'Revision 2 is ready for review. Nothing has been published.', time: '09:42' },
      { id: 'e2', project: 'editor', title: 'Source update observed', detail: 'An active project reference has a newer revision.', time: '09:26' },
      { id: 'e1', project: 'editor', title: 'Project created', detail: 'Sources linked. No automatic indexing or model execution.', time: '09:10' }
    ]
  };
}
export function writeBlock(s: State, project?: Project): string | null {
  if (s.mode === 'signed-out') return 'Sign in to the demo account before continuing. Nothing will run automatically.';
  if (s.mode === 'offline') return 'Offline observation. Reconnect before accepting or publishing work.';
  if (s.mode === 'viewer') return 'Read-only access. An editor must perform this action.';
  if (project?.archived) return 'This project is archived. Restore it before accepting new work.';
  return null;
}
export function sourceLabel(s: Source, project?: Project): string { return !s.available ? 'Access removed' : s.coverage === 'unmaterialized' ? 'Not on this device' : s.coverage === 'partial' ? 'Partial' : s.revision > (project?.sourceHeads[s.id] ?? s.observed) ? 'Changed' : 'Current'; }
export function sourceTitle(s: Source): string { return s.available ? s.title : 'Unavailable source'; }
export function taskLabel(t: Task): string { if (t.status === 'waiting') return ({ approval: 'Review output', input: 'Input needed', unknown: 'Outcome unknown', none: 'Waiting' })[t.reason]; return ({ working: 'In progress', cancelling: 'Stopping · resolving', completed: 'Completed', failed: 'Failed', cancelled: 'Cancelled' })[t.status]; }
export function attention(s: State, project?: string): Attention[] {
  if (s.mode === 'signed-out') return [];
  const result: Attention[] = [];
  for (const p of s.projects.filter(p => (!project || p.id === project))) {
    for (const a of s.artifacts.filter(a => a.project === p.id && a.status === 'accepted' && !a.publication)) {
      const task = s.tasks.find(t => t.id === a.task);
      if (task?.status !== 'waiting' || task.reason !== 'approval') continue;
      result.push({ id: `approve-${a.id}`, project: p.id, title: a.title, detail: 'An accepted revision is ready. Review before publishing.', kind: 'artifact', item: a.id, cta: 'Review output' });
    }
    for (const t of s.tasks.filter(t => t.project === p.id && t.status === 'waiting' && t.reason === 'input')) result.push({ id: `input-${t.id}`, project: p.id, title: t.title, detail: 'A specific response is needed to continue.', kind: 'task', item: t.id, cta: 'Respond' });
    for (const source of s.sources.filter(r => p.sources.includes(r.id) && r.available && r.revision > (p.sourceHeads[r.id] ?? r.observed))) result.push({ id: `changed-${p.id}-${source.id}`, project: p.id, title: source.title, detail: `A newer source revision is available: ${p.sourceHeads[source.id] ?? source.observed} → ${source.revision}.`, kind: 'source', item: source.id, cta: 'Inspect change' });
    for (const e of s.effects.filter(e => e.project === p.id && e.status === 'unknown')) result.push({ id: `effect-${e.id}`, project: p.id, title: 'Delivery needs verification', detail: 'A send may have happened. Do not resend.', kind: 'effect', item: e.id, cta: 'Verify outcome' });
  }
  return result;
}
export function apply(state: State, command: Command): Result {
  const s = structuredClone(state);
  const project = 'project' in command ? s.projects.find(p => p.id === command.project) : undefined;
  const deny = (message: string, code: 'denied' | 'stale' | 'invalid' | 'unknown' = 'invalid'): Result => ({ ok: false, state, message, code });
  if ('project' in command && command.project !== 'general' && !project) return deny('Project not found.');
  const blocked = writeBlock(s, command.type === 'archive' ? undefined : project);
  if (blocked) return deny(blocked, 'denied');
  const log = (title: string, detail: string, id = ''): Result => {
    s.events.unshift({ id: uid('event'), project: project?.id ?? '', title, detail, time: new Date().toLocaleTimeString('en-GB', { hour: '2-digit', minute: '2-digit' }) });
    return { ok: true, state: s, message: title, id };
  };
  switch (command.type) {
    case 'create-project': {
      if (!command.title.trim() || !command.goal.trim() || command.title.length > 100 || command.goal.length > 500) return deny('Enter a title (up to 100 characters) and a goal (up to 500).');
      const id = uid('project');
      s.projects.push({ id, title: command.title.trim(), goal: command.goal.trim(), category: 'NEW PROJECT', archived: false, sources: [], sourceHeads: {}, decisions: [] });
      return log('Project created', 'No AI execution or indexing started.', id);
    }
    case 'archive': {
      if (!project) return deny('Project not found.');
      if (!project.archived && (s.tasks.some(t => t.project === project.id && ['working', 'waiting', 'cancelling'].includes(t.status)) || s.effects.some(e => e.project === project.id && e.status === 'unknown'))) return deny('Stop active work and verify unknown effects before archiving this prototype project.');
      project.archived = !project.archived;
      return log(project.archived ? 'Project archived' : 'Project restored', 'Source bodies and published pages are preserved.');
    }
    case 'link-source': case 'remove-sources': case 'review-source': case 'index-source': case 'highlight': {
      if (!project) return deny('Project required.');
      if (command.type === 'remove-sources') { project.sources = project.sources.filter(id => !command.sources.includes(id)); for (const id of command.sources) delete project.sourceHeads[id]; return log('References removed', 'Underlying sources, other projects and retained evidence were not deleted.'); }
      const source = s.sources.find(r => r.id === command.source);
      if (!source?.available) return deny('This source is not accessible.', 'denied');
      if (command.type === 'link-source') { if (!project.sources.includes(source.id)) { project.sources.push(source.id); project.sourceHeads[source.id] = source.revision; } return log('Source linked', 'Link only. Indexing and analysis did not start.'); }
      if (!project.sources.includes(source.id)) return deny('The source is not linked to this project.');
      if (command.type === 'review-source') { project.sourceHeads[source.id] = source.revision; source.observed = source.revision; if (source.coverage === 'unmaterialized') source.coverage = 'complete'; return log('Source observation reviewed', 'Other task criteria and historical evidence remain unchanged.'); }
      if (command.type === 'index-source') { if (source.coverage !== 'complete') return deny('Complete content is required before indexing.'); source.indexed = !source.indexed; return log(source.indexed ? 'Sample index enabled' : 'Sample index removed', 'Simulation only. The source and project reference are unchanged.'); }
      if (source.coverage !== 'complete' || !command.quote.trim() || !source.body.includes(command.quote.trim())) return deny('Select a nonempty exact quote from the available source.');
      s.highlights.push({ id: uid('highlight'), project: project.id, source: source.id, quote: command.quote.trim(), note: command.note.trim(), revision: source.revision });
      return log('Highlight saved', 'A quote and note, not a confirmed decision.');
    }
    case 'edit-note': { const h = s.highlights.find(h => h.id === command.id && h.project === command.project); if (!h || !s.sources.find(r => r.id === h.source)?.available) return deny('Highlight unavailable.', 'denied'); h.note = command.note.trim(); return log('Annotation updated', 'The original source quote is unchanged.'); }
    case 'create-task': {
      if (!project || !command.title.trim() || command.title.length > 160 || !command.criteria.length || command.criteria.some(c => !c.trim() || c.length > 300)) return deny('Provide a goal and at least one bounded completion criterion.');
      const id = uid('task');
      s.tasks.push({ id, project: project.id, title: command.title.trim(), kind: command.kind, status: 'working', reason: 'none', criteria: command.criteria.map(text => ({ text: text.trim(), satisfied: false })), evidence: [], cost: 0, budget: command.kind === 'ai' ? 2 : 0 });
      return log('Work accepted · simulated', 'Criteria are now fixed. No model or background process was started.', id);
    }
    case 'respond': case 'cancel': case 'advance': {
      const t = s.tasks.find(t => t.id === command.task && t.project === command.project);
      if (!t) return deny('Task not found.');
      if (command.type === 'cancel') { if (['completed', 'cancelled', 'failed'].includes(t.status)) return deny('This work is already terminal.'); const unresolved = s.effects.some(e => e.task === t.id && e.status === 'unknown'); t.status = unresolved ? 'cancelling' : 'cancelled'; t.reason = unresolved ? 'unknown' : 'none'; return log(unresolved ? 'Future work stopped; outcome unresolved' : 'Work cancelled', 'Historical results and effects are preserved.'); }
      if (command.type === 'respond') { if (t.status !== 'waiting' || t.reason !== 'input' || !command.text.trim()) return deny('This exact task is not waiting for a valid input response.'); t.status = 'working'; t.reason = 'none'; const first = t.criteria[0]; if (first && t.id === 'scope') first.satisfied = true; t.evidence.push('Explicit input response · simulated; not proof of custom criteria.'); return log('Input accepted', 'Continues this task without changing its fixed criteria.'); }
      if (t.status !== 'working') return deny('Only active work can advance in the simulator.');
      if (t.kind === 'human') { t.criteria.forEach(c => c.satisfied = true); t.status = 'completed'; t.evidence.push('Manual acceptance · simulated'); return log('Human work completed', 'Linked AI tasks are not automatically completed.'); }
      if (t.cost + 0.1 > t.budget) return deny('The simulated continuation budget is exhausted.', 'denied');
      if (s.artifacts.some(a => a.task === t.id)) return deny('Inspect the existing output before creating another.');
      t.cost = Math.round((t.cost + 0.1) * 100) / 100;
      // The demo supplies a candidate, never fabricates proof for arbitrary custom criteria.
      const builtIn = t.id === 'verify' || t.id === 'scope';
      if (builtIn) t.criteria.forEach((c, i) => c.satisfied = i < t.criteria.length - 1);
      t.status = 'waiting'; t.reason = 'approval';
      const id = uid('artifact'), target = uid('page');
      s.pages.push({ id: target, title: t.title, version: 1, body: 'No published content yet.' });
      s.artifacts.push({ id, project: t.project, task: t.id, title: t.title, status: 'accepted', revisions: [{ number: 1, body: spec }], target, publication: null });
      t.evidence.push('Synthetic artifact accepted; custom criteria require separate proof.');
      return log('Sample output ready for review', 'An accepted artifact is not yet a published page.', id);
    }
    case 'publish': {
      const artifact = s.artifacts.find(a => a.id === command.artifact && a.project === command.project);
      const revision = artifact?.revisions.find(r => r.number === command.revision);
      const target = s.pages.find(p => p.id === artifact?.target);
      const task = s.tasks.find(t => t.id === artifact?.task);
      if (!artifact || artifact.status !== 'accepted' || !revision || !target || !task) return deny('An accepted, accessible artifact and target are required.');
      const signature = `${artifact.id}:${command.revision}:${target.id}:${command.expectedTarget}`;
      if (!command.requestId || ['__proto__', 'constructor', 'prototype'].includes(command.requestId)) return deny('Invalid request identity.');
      if (Object.hasOwn(s.receipts, command.requestId)) return s.receipts[command.requestId] === signature ? { ok: true, state, message: 'Existing publication receipt reused', id: command.requestId } : deny('Request identity was reused for a different operation.');
      if (artifact.publication?.revision === command.revision) return deny('This exact revision is already published. Inspect its receipt.');
      if (task.status === 'cancelled' || task.status === 'cancelling' || task.status === 'failed') return deny('This task cannot publish new content.');
      if (s.effects.some(e => e.task === task.id && e.status === 'unknown')) return deny('Verify the unknown external effect before continuing.', 'unknown');
      if (target.version !== command.expectedTarget) return deny('Destination changed since preview. Refresh and review the exact change again.', 'stale');
      target.body = revision.body; target.version++;
      s.receipts[command.requestId] = signature;
      artifact.publication = { revision: revision.number, targetVersion: target.version, receipt: command.requestId };
      if (['brief', 'verify', 'scope'].includes(task.id)) { const last = task.criteria.at(-1); if (last) last.satisfied = true; }
      task.evidence.push(`Publication receipt ${command.requestId}`);
      if (task.criteria.every(c => c.satisfied)) { task.status = 'completed'; task.reason = 'none'; }
      else { task.status = 'waiting'; task.reason = 'input'; }
      return log('Published to the demo workspace', 'Exact revision committed. No external service was contacted.', command.requestId);
    }
    case 'verify-effect': {
      const effect = s.effects.find(e => e.id === command.effect && e.project === command.project);
      if (!effect) return deny('Effect not found.');
      if (effect.status === 'confirmed') return { ok: true, state, message: 'Already verified. Nothing resent.', id: effect.id };
      effect.status = 'confirmed'; const t = s.tasks.find(t => t.id === effect.task);
      if (t?.status === 'cancelling') { t.status = 'cancelled'; t.reason = 'none'; }
      else if (t?.reason === 'unknown') { t.status = 'waiting'; t.reason = 'input'; }
      return log('Simulated provider receipt verified', 'Existing delivery observed as sent. No resend was performed.', effect.id);
    }
    case 'message': {
      if (!command.text.trim() || command.text.length > 4000) return deny('Enter a message of up to 4,000 characters.');
      if (command.project !== 'general' && (!project || command.sources.some(id => !project.sources.includes(id) || !s.sources.find(r => r.id === id)?.available))) return deny('Attached context is no longer accessible or linked.', 'denied');
      s.messages.push({ id: uid('msg'), project: command.project, role: 'user', text: command.text.trim(), sources: [...command.sources] });
      const tasks = s.tasks.filter(t => t.project === command.project);
      s.messages.push({ id: uid('msg'), project: command.project, role: 'assistant', text: `Scripted prototype response: ${tasks.filter(t => t.status === 'completed').length} of ${tasks.length} work items are completed. ${attention(s, command.project).length} items need attention. Your message has not changed any task goal, started a model, or sent an external message. Use “Create AI task” for explicit work acceptance.`, sources: [] });
      return log('Demo conversation updated', 'No model call; existing task definitions unchanged.');
    }
    case 'rule': s.ruleEnabled = command.enabled; return log(command.enabled ? 'Demo rule enabled' : 'Demo rule paused', 'Configuration only. No real schedule or webhook is registered.');
  }
}
export function inject(s: State, kind: 'revoke' | 'destination' | 'unknown', projectId: string): State {
  const next = structuredClone(s), p = next.projects.find(p => p.id === projectId);
  if (!p) return next;
  if (kind === 'revoke') { const r = next.sources.find(r => r.id === p.sources[0]); if (r) r.available = false; }
  if (kind === 'destination') { const a = next.artifacts.find(a => a.project === p.id); const page = next.pages.find(page => page.id === a?.target); if (page) { page.version++; page.body += '\n\nA teammate added a newer note. Preserve this change until it is reviewed.'; } }
  if (kind === 'unknown' && !next.effects.some(e => e.project === p.id && e.status === 'unknown')) {
    const task: Task = { id: uid('task'), project: p.id, title: 'Verify release-note delivery', kind: 'ai', status: 'waiting', reason: 'unknown', criteria: [{ text: 'Verify the existing provider delivery receipt', satisfied: false }], evidence: [], cost: 0, budget: 1 };
    next.tasks.push(task); next.effects.push({ id: uid('effect'), project: p.id, task: task.id, status: 'unknown', body: 'The collaboration brief is ready for review. (Synthetic message to a fictional team channel.)' });
  }
  return next;
}
