# Verdeln Product Design — v0.2

Private, non-production interface studies. Synthetic data only; no live accounts, models, provider messages, billing or production permissions.

[中文](README.zh-CN.md) · [Coverage and production handoff](docs/HANDOFF.md) · [Test evidence](tests/evidence.json)

## Run

Node.js 22+:

```sh
npm ci
npm run build
npm run preview
```

Open the local address printed by the server. `dist/standalone.html` is a self-contained build with no runtime dependencies, CDN assets or remote fonts. Direct file opening is browser-policy dependent and was blocked by the authoring environment; the server path is the recommended starting point. `npm run dev` rebuilds and serves, without hot reload.

Do not enter real secrets or confidential data. Optional browser storage holds sample state only; denied storage falls back to memory with a warning. Unsaved Page drafts survive route changes in memory but do not promise persistence across reload/sign-out or account isolation.

## The v0.2 integration

The Workspace sidebar now retains **Pinned, Favorites, Private, Shared and Teamspaces**, independently of the active Project/global section. Project navigation moves into the content header, with a mobile section control and full Workspace drawer. Studio / Focus / Console and light/dark remain available.

Favorites supports typed Page and Project references, removal and personal ordering. It never moves or shares content. Canonical Page views show actual location, audience and authorized related Projects. Opening a source's original Page preserves the return path without implicitly assigning an AI context. The same source body is reused across its entry points.

Private-owned pages, individually shared Private pages, and read-only Shared-with-me pages are distinct. Teamspace overview shows its existing Projects and Pages; private nonmember spaces are hidden while closed spaces expose only a restricted shell.

Page creation exposes Save to and an independent optional Project link. Private sources cannot silently join shared Project context. Page moves preview the full sample subtree and audience change; stale content/destination versions invalidate the preview. Project affiliation changes do not move source pages. The sample Page editor is plain text, not the production collaborative editor.

The prior Source/Highlight/Chat/Work/Artifact flows remain interactive: explicit Task acceptance, fixed criteria, context attachments without sends, stale publication review and unknown-effect verification without resend. No schedule or provider is activated by a simulation control.

## Try the integrated flow

Open Private → My working notes. Star the Page; it appears in Favorites without leaving Private. Open Link to project: the team Project is blocked for audience mismatch, while the personal Project can accept a reference. Open Move to…, select a Teamspace and Preview move. The parent and child appear together. Simulate an intervening edit: confirmation is blocked until another preview. After an allowed move, object IDs and Favorites still resolve the same content.

From Project Sources, Open original page shows actual ownership and a return link. From a Teamspace, opening a Project resolves the same object as the global Projects index.

## Tests and boundaries

```sh
npm test
python -m pip install -r tests/requirements.txt
python -m playwright install chromium
npm run test:browser
npm run test:workspace-browser
```

Build/typecheck and **56 model tests passed**. Against the final standalone build, **16 baseline + 11 Workspace browser cases passed**. One separate actual-file/reload test was **BLOCKED** by `ERR_BLOCKED_BY_ADMINISTRATOR`, not passed; no attempt was made to bypass that policy. Browser interaction checks use Chromium `set_content` and memory fallback. Real-origin persistence, native platforms, full accessibility, 200% browser zoom, production editor/IME, multiuser sync and real ACL/provider effects remain unverified.

The environment used installed TypeScript 5.8.3 and Node 22.16.0. Dependencies are locked, but `npm ci` was not exercised there. See the exact artifact hash and cases in evidence.json. Generated screenshots, safe logs and prebuilt files accompany the downloadable ZIP; dist/artifacts/node_modules are not committed source.

## Source of truth

[PW-UI-1.1 specification PR #111](https://github.com/verdeln/docs/pull/111) defines the production intent. This repository's original [PR #1](https://github.com/verdeln/product-design/pull/1) continues on `verde/project-workspace-prototype`, targeting main. No production design direction has been selected or application repository modified.

Strict TypeScript and native DOM are used for this study. Port approved composition into the existing React/TanStack shell and real domain ports; do not copy the simulator as a backend, authorization layer or second document authority. Production PW/WNI gates remain NOT_RUN.
