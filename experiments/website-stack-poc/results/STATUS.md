# PoC execution status

Recorded: 2026-09-16.

## Current result

The two candidate implementations are checked into PR #3, but package-backed build evidence is currently **BLOCKED by execution infrastructure**, not classified as a framework failure.

GitHub Actions run `35087817113` created both matrix jobs. `build-nuxt` and `build-tanstack-fumadocs` each completed with `failure` before any workflow step was recorded. The connector returned no step summaries, and job-log download returned `BlobNotFound`. The comparison job was consequently skipped. This failure pattern is consistent with repository-level runner/execution failure and provides no npm/install/compiler output from either candidate.

A second fallback from the authoring container also could not reach the npm registry: `npm view nuxt@4.5.2 version` failed with `EAI_AGAIN registry.npmjs.org`. Therefore no local install or build is represented as passing.

## Source-level evidence that is available

The Nuxt package tuple is grounded in the current official `nuxt-ui-templates/docs` repository at commit `9a1ffbb5ed36fdafdfc99f722b6ec09b18a7f661`, which uses Nuxt 4.5.2, Nuxt Content 3.16.0 and Nuxt UI 4.11.1.

The TanStack/Fumadocs candidate follows the official Fumadocs TanStack Start example at commit `fb6063ece7f2df1c79433a7d92f9fb6ab5958513`, including the Start/Vite/Nitro integration. Published-package versions in that source revision are used instead of workspace aliases.

Both candidates contain the same representative routes and synthetic content. The Git diff currently contains 18 Nuxt candidate files / 334 added lines and 27 TanStack/Fumadocs candidate files / 419 added lines when counting candidate-specific files from the PR diff. This is only a source-shape observation: formatting density and framework-generated code make raw LOC an imperfect maintenance metric.

## Decision state

**No stack is selected by this PoC yet.** The existing website architecture decision remains unchanged until at least install, build/prerender, route smoke and output metrics execute for both candidates, followed by a manual review of docs UX, content operations and accessibility.

Do not reinterpret a runner failure as a Nuxt failure, and do not select Fumadocs simply because its upstream example exists. Conversely, upstream Nuxt templates are not Verdlen build evidence.

## Next executable gate

When a runner or npm-capable environment is available, run the repository workflow without changing the comparison rubric. Required evidence is:

1. independent install for both candidates;
2. build/prerender and typecheck;
3. representative static route smoke;
4. generated metric JSON for both stacks;
5. combined comparison artifact;
6. manual page/search/i18n/SEO inspection against the fixed criteria.
