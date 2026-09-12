# Verdeln Product Design

Private, non-production interface explorations for Verdeln.

The Project Workspace architecture and UI/UX specifications remain in `verdeln/docs`; this repository does not replace application/domain authorities or connect to production services.

[中文说明](README.zh-CN.md) · [Coverage and handoff](docs/HANDOFF.md) · [Test evidence](tests/evidence.json)

## Run the interactive study

Requires Node.js 22+ and npm. There are **no runtime dependencies**, remote fonts, CDN assets, model calls or connected accounts.

```sh
npm ci
npm run build
npm run preview
```

Open the address printed by the preview server. Alternatively, open the generated **`dist/standalone.html`** directly: it contains the entire application and its styles. Hash routes work without server rewrites. Browser storage is optional; denied/unavailable storage falls back to memory with a warning. Export sample work before closing in that mode. Never enter secrets or real confidential data into the study.

`npm run dev` rebuilds and starts the same server; it is not a hot-reload watcher. Rebuild after editing source. `npm test` builds, typechecks, and runs the 36 model/router/storage tests.

```sh
python -m pip install -r tests/requirements.txt
python -m playwright install chromium
npm run test:browser
```

The browser harness prefers `CHROMIUM_EXECUTABLE`, then system Chromium, then the Playwright-managed browser. It loads the standalone bytes with `set_content`, without navigating to a server or requesting network resources. `CASE_FILTER` accepts comma-separated case-name substrings for smaller batches.

## Three comparable layouts

The top bar switches between **A Studio** (balanced panels), **B Focus** (editorial, single-column hierarchy), and **C Console** (compact operational layout). Appearance is independently light/dark. These are unselected layout studies using the same information architecture, data and commands—not three different products or a new production token authority. Palette and type scale reference the existing Verdeln `DESIGN.md`.

## What is interactive

- Home, Library, Projects, global AI and Settings; all seven Project sections; context switching, search, mobile section navigation, route-backed detail/peek and focus return.
- Source filtering, selection/range selection, drag-to-Chat attachments, explicit linking/indexing simulations, Highlights with exact source revision, annotation editing and safe reference removal.
- Typed human work versus AI task, explicit task acceptance, fixed criteria, input requests, cancellation and follow-up. Scripted Chat never silently creates a task or runs a model.
- Immutable sample artifact revisions, review before publication, stale-target rejection, refresh/review, exact-operation receipt, and updates across Overview/Work/Outputs/Activity.
- Explicit unknown-delivery fixture with verification rather than resend; empty/archived Projects, revoked sources, viewer/offline/signed-out simulations.
- JSON project export, Markdown artifact export, light/dark, reduced motion, collapsed sidebar and responsive mobile details.

Use **Explore states / Prototype controls** to switch scenarios. State mutations are synchronous pure commands over synthetic fixtures. “Simulate” buttons are intentionally explicit. No external tasks, schedules, uploads, messages or billing are created.

## Implementation

Strict TypeScript, semantic HTML, CSS variables and native dialogs. `model.ts` owns synthetic transitions; `router.ts` parses bounded hash routes; `storage.ts` validates optional local persistence; `views.ts` composes escaped markup; `app.ts` wires input/navigation; `ui.ts` supplies small presentation helpers. A minimal local-module bundler emits an offline artifact.

This is **not a React/TanStack production integration**, a collaborative block editor, a security boundary or a replacement for the backend. Production adoption should port the approved layout/components to the existing React shell and consume its real typed ports, receipts and authorization. No workflow is made production-safe by passing the simulator tests.

## Verification performed

TypeScript build and **36/36 model tests** passed. **16/16 Chromium scenarios** passed in four disjoint batches against the same build. See `tests/evidence.json` for names and scope. Browser checks cover 1440px desktop, 720px reflow and 390px mobile, modal focus, stale publication, context drag/drop and shared-state behavior. They are not a WCAG audit, real-origin persistence test, native iOS/Android/Electron test or live-provider verification.

The authoring environment used its installed TypeScript 5.8.3; network package installation was unavailable. The lockfile pins that exact package, but `npm ci` itself was not exercised there. Screenshots and a prebuilt standalone file accompany the release ZIP; `dist/` and local artifacts are generated, not committed source.

## Design references and contribution

- [PW-UI-1.0 at the merged documentation baseline](https://github.com/verdeln/docs/tree/98ab75abcc63ac127f64a8e534e1f02499cbaaa4/shared/architecture/project-workspace/ui)
- [PW-1.0 architecture](https://github.com/verdeln/docs/tree/98ab75abcc63ac127f64a8e534e1f02499cbaaa4/shared/architecture/project-workspace)
- [Existing client design system](https://github.com/verdeln/verdeln/blob/4b8d00fa801611eca66ed0aa46986085fb123766/DESIGN.md)

Use `verde/*` branches and PRs to `main`. Do not add real credentials/customer data or silently replace the canonical architecture. No visual direction has been approved for production by this repository change.
