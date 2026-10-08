# v0.3 scope and production handoff

Production intent remains PW-1.0 and PW-UI-1.2 in `verdeln/docs`, including stable navigation chapter 11 and Workspace AI chapters 12–14. This synthetic repository is never an alternative content, Task or security authority.

## Ownership

The original model.ts and workspace-model.ts own the existing fixture bodies, Tasks, artifacts, navigation, page location and personal references. ai-model.ts adds component authoring/releases, one native Collection sample, session metadata, context receipts, assignment relationships, scoped messages, automation occurrences and Page proposal metadata. Session records refer to IDs in the existing messages array, not copied transcripts. Coordination refers to the actual root/child Task objects; its displayed status is derived.

ai-workbench.ts owns view composition and input translation through narrow host callbacks. app.ts connects it with the existing Workspace shell, dialogs, source views and Page editor. ai.css extends prototype aliases only. The production client should preserve its mounted React/editor sessions and consume actual typed authority ports; the prototype's synchronous full-markup rerender is not a production rendering design.

## Connected behavior

Workspace discovery can locate permitted Pages, Collection data and other sources beyond attached Project material. Missing Page/Project identities do not silently widen a requested narrow scope. Opt-in history preserves device/cloud boundaries. Receipts distinguish exact reads from partial/unmaterialized results. Source revocation suppresses derived answers in the AI history view and subsequent history retrieval. These checks run only against local synthetic data, which remains physically present: they do not establish backend security or complete derived-data disclosure enforcement.

A goal creates a root Task, two research Tasks, and a dependent review Task. They share a fixed brief, exact assistant versions and cumulative budget. Simulated cycles check current context, capabilities, dependencies and unknown-effect barriers. Questions do not rewrite goals or grant tools. Child completion produces an accepted sample artifact, not automatic publication. The parent requires the existing exact review/publication receipt. There is no actual model planner, scheduler, worker service or remote bot communication.

Page AI shares conversation/message identity with the full AI screen. Ask is read-only. A draft append is separate from content; acceptance checks the Page revision and refuses an uncommitted human draft. Existing Page text drafts survive view changes. This is not the real block editor, relative-anchor engine, CRDT, IME or production undo history.

## Coverage versus target

| Area | Implemented here | Still required for production |
| --- | --- | --- |
| Navigation | Stable Favorites/Private/Shared/Teamspaces; nine AI views and Project shortcuts. | Real React routing/query/overlay integration and localization. |
| Context | Native sample Page/Collection/source/history discovery, priority handoff, exact receipts and revoked-answer checks. | Actual providers, scalable queries, provenance enforcement, secrets and egress admission. |
| Assistants/Skills/Packages | Bounded draft, validation, fixed release, activation, dependency state and Project binding. | Complete five-step builder, nested return-safe authoring, import/signature checks, installation and sandbox trials. |
| MCP | HTTPS descriptor form and simulated lifecycle. | OAuth, protocol discovery, Tools/Resources/Prompts, real connections, local host isolation and credentials. |
| Coordination | Root/child Task references, dependencies, shared budget, scoped messages and artifact review. | Durable autonomous scheduling, actual LLMs, verifier/evaluator authority and external executors. |
| Automations | Draft/preview/enable, explicit occurrence, deduplication and pause. | Real clock/webhooks, conditions, DST/misfires, service principals and provider recovery. |
| Page AI | Same session, Page/selection context, append preview, stale/dirty checks. | Mounted editor selection/IME, streaming typed blocks, canonical commit/undo and collaboration. |

A simulated component check is not malicious-code verification. Activation is not an actual permission grant. An assistant is not a human Workspace member. Sample receipts are not cryptographic proofs. A descriptor is not a working MCP server. No real provider, file upload, external message, model or bill is created.

## Actual final local verification

90 model/router/storage tests (56 baseline + 34 AI), and 40 browser scenarios (16 baseline + 11 Workspace + 13 AI). Node22.16.0, TypeScript5.8.3, Chromium144.0.7559.96. Browser suites use final standalone HTML through set_content and check uncaught errors and network requests. Exact lists and build digest: tests/evidence.json. Screenshots were visually inspected for AI Assistants, Page Sidebar and Coordination; this is not automated visual-diff or accessibility certification.

The earlier actual-file/reload test was administrator-blocked and remains BLOCKED; no bypass or PASS claim. Real-origin/file-origin persistence, npm ci, Safari/Firefox, native Electron/iOS/Android, full a11y/actual 200% zoom, live providers, Figma and public hosting were not tested. The pinned installed compiler was used without dependency installation. All production PW/WNI/WAI gates remain NOT_RUN.

Safe Workspace browser subset:

```sh
CASE_FILTER=stable-sidebar,project-source,typed-favorites,subtree-visibility,private-to-shared,private-sharing,creation-destination,teamspace-project,private-hidden,mobile-stable,unsaved-page npm run test:workspace-browser
```

## Adoption

Port approved presentation to the existing React shell and @verdeln/ui. Preserve real Page/Collection/Task/Run/Package owners. Replace every simulation command, budget, receipt and read guard with actual authorization, current version checks and durable settlement. Keep autonomous work within accepted scope without asking again for every routine read; retain human review at the protected boundary. Do not mistake explicit simulator cycle buttons for the intended production scheduler UX.
