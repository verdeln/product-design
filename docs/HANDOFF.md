# Prototype scope and production handoff

The design source remains PW-1.0/PW-UI-1.0 in `verdeln/docs`. This study exercises one coherent synthetic state graph, not a second application authority.

## Ownership

| File | Responsibility | Not responsible for |
| --- | --- | --- |
| `src/model.ts` | Pure fixture commands, guards, exact revision/receipt simulation, derived attention | Production policy, identity, persistence, scheduling or billing |
| `src/router.ts` | Closed hash-route parsing and detail navigation | Server routing or authorization |
| `src/storage.ts` | Bounded validation of optional local saved samples | Account security or cloud sync |
| `src/ui.ts` | Escaping, icons, buttons, state labels, safe tiny Markdown rendering | Domain transitions |
| `src/views.ts` | All screen/peek/dialog markup from typed state | Independent status stores or business authority |
| `src/app.ts` | Event delegation, keyboard/focus, uploads-free context DnD, URL state and local export | Real agent or provider I/O |
| `src/styles.css`, `surfaces.css`, `overlays.css`, `layouts.css` | Shared semantic variables, responsive layouts, light/dark and reduced motion | Replacing `@verdeln/ui` in production |

## Covered surfaces

Home, Library, Projects index/create/archive/restore, global AI, Settings, Project Overview, Chat, Sources, Highlights, Work, Outputs and Activity have navigable content. Core object details can open as a route-backed peek or full detail. Settings intentionally describes disconnected providers: no OAuth/token or live integration is implemented. Automation control changes a fixture Boolean and dry-run message, not a background schedule.

One source can belong to several Projects. Each Project has its own observed source revision; reviewing a newer source in one Project does not rewrite another Project's basis. Removing a link does not delete source content. Revoked content is redacted in prototype UI, but fixture data still exists locally: this is not a security guarantee.

AI task acceptance preserves its criteria. Sample evidence only satisfies the named sample scenarios; creating arbitrary criteria does not let a timer/model-text claim them proved. Human-work checkboxes are explicit user simulation. Publication binds the artifact revision, destination version and semantic request identity; identical retry reuses its receipt. A changed target requires review. The simulator replaces its sample Page body after review; production must instead call the real governed typed mutation path.

Unknown external delivery has its own fixture identity. Cancellation waits for resolution; verification changes fixture observation only. There is no send endpoint, network call or resend implementation. Closing a dialog is not task cancellation or effect resolution.

## Visual alternatives

A Studio is the baseline recommendation for a balanced project workspace. B Focus changes composition to single-column editorial hierarchy, keeping all actions accessible. C Console changes density, grid proportions and chrome rather than domain semantics. Light/dark is orthogonal to all three. A variant selection is a local UI preference, not approval to change production design tokens.

## Testing and limits

`tests/evidence.json` records 36 model tests and 16 browser cases from Chromium 144.0.7559.96, Node 22.16.0 and TypeScript 5.8.3. Browser cases ran in four disjoint batches using `set_content` on the same standalone build. Each case checked uncaught page errors and network requests; none occurred in the passing runs. Screenshots were inspected for the main desktop overview, dark Console, stale review and mobile detail. This is targeted visual inspection, not screenshot-diff or full accessibility certification.

Not verified: real-origin persistence; file:// navigation policy on user browsers; Safari/Firefox; native Electron/iOS/Android; true browser 200% zoom; full screen-reader use; huge-list virtualization; actual editor text selection/IME; live multidevice/multiuser conflicts; full localization; backend permission/receipt/recovery enforcement; provider delivery; hard monetary caps; deployed hosting; Figma variable/component generation. No existing production architecture/UI gate is marked PASS by these fixture tests.

## Production adoption

1. Select a layout based on the actual clickable workflow, not screenshots alone; reconcile its variables to `@verdeln/ui` rather than copying a second palette.
2. Port shell/section/detail composition into the existing React routes, shared overlay providers and TanStack observation queries.
3. Replace simulator commands with typed server/native authority ports. Keep unknown, stale, partial and unavailable outcomes explicit. UI permissions are supplied capabilities, not role-string guesses.
4. Bind artifact review to actual immutable content references, current target bases, approval and canonical publication receipts. Do not copy sample full-body replacement into a live editor.
5. Preserve real Task/Run/action/event identity and separate human work; map each simulated proof to authoritative evidence or explicit human acceptance.
6. Run the architecture's real backend, editor, a11y, persistence, mobile and provider gates before shipping. Use this repository's fixtures as interaction cases, not production evidence.

Long-term professional executors, local device tickets, actual schedules, evaluated capability packages and cross-project orchestration remain in the architecture plan. This prototype demonstrates their UI boundaries; it does not implement those systems.
