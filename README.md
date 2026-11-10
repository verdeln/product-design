# Verdeln Product Design — v0.3

Private, synthetic-data interface studies for Verdeln. The canonical production architecture remains in `verdeln/docs`. This repository is not a second domain authority, security implementation, agent service or production React client.

[中文说明](README.zh-CN.md) · [Scope and handoff](docs/HANDOFF.md) · [Recorded test evidence](tests/evidence.json)

## Run

Node.js 22+:

```sh
npm ci
npm run build
npm run preview
```

The server prints a localhost address. The build also emits `dist/standalone.html`, containing all runtime JavaScript, CSS and icons, with no CDN, remote fonts or runtime dependencies. Direct file opening depends on browser policy; the local preview server is recommended. `npm run dev` builds and serves but is not a hot-reload watcher.

Browser storage is optional. Denied/unavailable storage uses a clearly indicated in-memory fallback. Do not enter secrets or real confidential data. The prototype contacts no LLM, provider, MCP endpoint, external repository, scheduler or payment service.

## New in v0.3: a connected Workspace AI experience

The stable Workspace sidebar retains Favorites, Private, Shared and Teamspaces. The AI destination now contains grouped local navigation for Conversations, Assistants, Tasks, Automations, Coordination, Skills, Capability packages, Connections & MCP, and Workspace context. These are views of shared synthetic identities, not independent copies of work.

- **Workspace discovery:** inspect authorized sample Pages, native Collection schema/rows, sources, opt-in conversation/activity history, exact read references and omissions. Project sources are priorities, not the only readable universe. Shared audience and device/cloud scope are distinct.
- **Library handoff:** open a source and choose “Use this source in AI.” It appears as visible priority context while authorized Workspace discovery remains available. No message, index or Task starts from navigation.
- **Assistant/capability authoring:** create a bounded draft, validate, publish an immutable sample version, activate, then bind an assistant to a Project. Skills, Packages and MCP descriptors share version/dependency mechanics but have distinct purposes. The MCP preview does not connect or run code.
- **Coordinated work:** explicitly accept one goal and a cumulative sample budget. Three child Tasks share a brief: Page research and Collection inspection, then a reviewer waiting for both. Scoped worker messages and dependency state are inspectable. Explicit simulation cycles produce an artifact; the parent completes only after exact publication review.
- **Automation:** save a draft rule, preview without execution, enable, simulate one occurrence, replay the same occurrence without creating duplicate work, and pause future triggers. No real schedule is registered.
- **Page AI Sidebar:** ask beside a Page, optionally attach a current selection, expand the same conversation into the AI view, create an append proposal, and approve against the current Page revision. An unsaved Page draft blocks commit; Ask does not write.

The original A Studio / B Focus / C Console layouts, light/dark themes, mobile navigation, Page/Teamspace flows, Task/Artifact review, stale-destination and unknown-effect scenarios remain. No final production visual direction is approved by this commit.

## Suggested walkthrough

1. Library → a source → **Use this source in AI**. Inspect the visible handoff and optional broader context.
2. AI → Assistants → **Create assistant** → save/check/publish/activate → bind for future Project work. Explore the corresponding Skill, Package and MCP authoring forms.
3. AI → Workspace context. Compare authorized Workspace discovery, Project audience, Page-only scope, and device history on different simulated routes.
4. AI → Coordination → accept a goal → run three **explicit simulated cycles** → inspect assignments/messages → review the coordinated artifact → publish to the demo destination.
5. Private → My working notes → **Ask AI beside this Page** → ask → draft continuation → approve the exact append → open the same conversation in AI.
6. AI → Automations → draft/preview/enable → simulate occurrence → replay → pause. Open its actual shared Task reference.

## Verification

```sh
npm test
python -m pip install -r tests/requirements.txt
python -m playwright install chromium
npm run test:ai-browser
npm run test:browser
```

The Workspace browser suite includes a separate file-origin persistence case. In this environment that case had previously been blocked by administrator policy; it is not bypassed or counted as PASS. Run the other cases with the documented filter in the handoff.

Final local validation: strict TypeScript build; **90 model/router/storage tests**; **40 Chromium scenarios** (16 original, 11 safe Workspace, 13 AI). Each browser case uses `set_content` on the final standalone HTML and checks uncaught errors and network requests. This proves fixture interactions in memory mode, not production ACL, real-origin storage, actual file opening, native clients, full editor/IME/collaboration, a complete accessibility audit or live autonomous execution. Exact results and artifact digest are in `tests/evidence.json`.

The environment used installed Node 22.16.0 / TypeScript 5.8.3 and Chromium 144.0.7559.96. The dependency is locked; `npm ci` was not executed here. Generated previews, logs and screenshots accompany the conversation ZIP; `dist/`, artifacts and node_modules are not committed.

## Design and contribution boundaries

The implementation is strict TypeScript and native DOM, not a production React/TanStack integration. Port selected component behavior to the existing shell and actual authority ports; never reuse simulator guards as server authorization or sample completion as real evidence.

Production specification: `verdeln/docs/shared/architecture/project-workspace/ui/`, PW-UI-1.2 chapters 12–14. PW-UI-1.1 stable navigation remains. Application `CONTEXT.md` supplies existing Page/Collection/Task/Run/Package/route contracts. Use `verde/*` branches and PRs to `main`; do not add secrets or real customer data.

## Temporary protocol-version verification

`src/e2e-agent-value.ts` exports a monotonically increasing protocol version. When concurrent branches increment it, retain the greater version, and update the paired `tests/e2e-agent-value.test.mjs` assertion to the same version. This preserves the newer protocol contract without lowering it. Run `npm test` and `npm run typecheck` after merging.
