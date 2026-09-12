# v0.2 scope and production handoff

Canonical intent: PW-1.0 and PW-UI-1.1 in verdeln/docs, including PR #111 and chapter 11. This repository is synthetic and must never become an alternative domain or security authority.

## Ownership

`model.ts` retains the original Task/action/artifact/source/page fixture semantics. `workspace-model.ts` composes them with typed navigation references, page location/access metadata, Teamspaces, Favorites and separate navigation commands. It does not store a second body or Task lifecycle. `workspace-views.ts` renders the stable tree, Project-local sections, canonical Page/Teamspace screens and explicit move/share/link/create dialogs. `app.ts` selects the new composition and handles input. The old unused navigation helper in views.ts is not the active sidebar. router.ts adds fixture Page/Teamspace routes. workspace.css extends the existing prototype aliases; it is not a new production token system.

## Implemented interactions

Stable Workspace content groups across all existing routes; typed personal Page/Project Favorites and ordering; Page trees and explicit-share markers; restricted Shared-with-me; Teamspace Projects/Pages views with the same identities; canonical source/Page opening with actual location and safe return/backlinks; plain-text editing and per-Page in-memory draft preservation; explicit create destination/optional source link; private-source/shared-project compatibility checks; complete sample subtree move preview, stale rejection and ID preservation; separate Project affiliation changes. Original task, source, artifact review and unknown-effect workflows remain.

## Deliberate limitations

All guards operate on locally available synthetic data. Real ACL, multi-account isolation, server revocation, complete derived-data disclosure, attachment access, collaboration, resource governance and side effects are not implemented. Source compatibility for Project affiliation is not a complete production review: decisions, conversations, artifacts, automation principals and active runs also need real checks. Page sharing uses one fictional reader; no actual member invitations. Teamspace creation/settings and real Trash deletion remain unimplemented. The plain-text Page editor does not test block selection, IME or CRDT semantics.

The prototype uses synchronous mock state updates and rerenders markup. Production must keep the stable shell mounted, consume authorized lightweight observations, preserve native editor state, and reconcile typed commands through real domain owners. Large-tree virtualization, concurrent Favorites reorder, versioned preference synchronization and actual subtree/attachment policy enforcement remain production work. No Page/Task storage migration is justified merely by changing navigation.

## Verification

Final build: strict TypeScript 5.8.3, Node 22.16.0. Model tests: 56 passed. Chromium 144.0.7559.96: 16 existing plus 11 integration scenarios passed against the final standalone bytes. An independent actual-file/reload-persistence case was blocked by administrator policy before opening the file. Its status is BLOCKED, not PASS; no workaround bypass was attempted. set_content tests exercise in-memory fallback, not real-origin storage. The exact hash and case lists are recorded in tests/evidence.json.

Visual inspection covered current desktop stable navigation, canonical Page, move review and mobile navigation. Full-page browser screenshots can show a fixed dialog/backdrop over only the initial viewport; curated handoff images use viewport captures for mobile. These are not a full accessibility or visual-diff audit. npm ci, live provider actions, Figma, public deployment, native Electron/iOS/Android, Safari/Firefox and 200% actual browser zoom were not exercised.

## Production adoption

Map the stable Workspace tree and Project section components onto existing React routes and @verdeln/ui. Extend page-only Favorites to typed references without losing existing IDs/order. Keep Page bodies and Task state in their existing owners. Move/share/link/publish commands require current actor, exact operation basis, disclosure checks and durable receipts. Replace every simulator completion or permission guard with real authority evidence. Preserve the original PW-UI gates and add WNI-01–WNI-16; none becomes a production PASS because this prototype passes.
