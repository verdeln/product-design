# Verdlen website stack PoC

Status: non-production technical comparison. Synthetic public content only. Current execution evidence: [results/STATUS.md](results/STATUS.md).

This experiment compares two candidate implementations for the future standalone Verdlen website:

- `nuxt/`: Nuxt 4 + Nuxt Content + Nuxt UI.
- `tanstack-fumadocs/`: TanStack Start + Fumadocs.

Both implementations must expose the same representative surface:

- `/` — custom marketing homepage.
- `/help/getting-started` — user Help article.
- `/docs/editor-sdk` — developer documentation.
- `/templates` and `/templates/project-kit` — public catalog/listing projection.
- `/zh-cn/help/getting-started` — reviewed localized Help fixture.
- Search capability.
- `robots.txt` and `sitemap.xml` fixtures.
- Server/prerendered initial HTML for indexable pages.

The PoC does not connect to production APIs, accounts, analytics, billing, template payloads, AI providers, or Workspace data. It is not the future website repository and must not become a second product authority.

## Evidence

GitHub Actions is configured to install each implementation independently, build/prerender it, run a static-route smoke check, record output/source metrics, and publish the evidence as workflow artifacts. The first run failed before any job step was executed, and the authoring container could not resolve the npm registry, so no package-backed build result is currently claimed. The exact blocked state is recorded in [results/STATUS.md](results/STATUS.md).

See [criteria.md](criteria.md) for the decision rubric. A later architecture ADR in `verdeln/docs` should consume actual workflow evidence before replacing the currently recorded website stack decision.
