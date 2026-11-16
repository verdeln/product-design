# Website stack PoC criteria

The comparison is evidence-first. Do not select a stack from framework familiarity or a single documentation screenshot.

## Required functional parity

Both candidates must demonstrate:

1. a fully custom marketing page rather than a docs-theme homepage;
2. Markdown/MDX-backed Help and developer content;
3. a public Template listing and detail page from structured data;
4. one real localized route with independent canonical identity;
5. search over documentation content;
6. initial HTML with page title, description, body text, navigation, and canonical metadata;
7. prerender/static output for the representative public routes;
8. explicit 404-capable routing rather than a universal SPA shell;
9. no product runtime, credentials, account bootstrap, or private repository source dependency.

## Decision dimensions

| Dimension | Weight | Evidence |
| --- | ---: | --- |
| Unified content model | 20 | How naturally Help, Docs, Blog/Changelog and future catalog projections share schemas, queries and authoring workflows |
| Product-site flexibility | 15 | Custom layouts, marketing sections, catalog pages, interactive islands/components |
| Documentation UX | 15 | Navigation, TOC, code blocks, search, versioning path, developer-reference ergonomics |
| SEO/rendering correctness | 15 | Initial HTML, canonical/hreflang control, status handling, prerender enumeration, sitemap/robots integration |
| Search and localization | 10 | Corpus ownership, language isolation, result URLs and future multi-locale scaling |
| Build/deployment shape | 10 | Reproducibility, output structure, server/static options, Cloudflare suitability, release isolation |
| Maintenance surface | 10 | Source/config LOC, custom glue, framework-specific adapters, upgrade coupling |
| Content operations/CMS path | 5 | Git authoring, structured collections and optional visual editorial workflow |

Weights are fixed before seeing results. A numeric score may summarize evidence later, but a security, publication, origin-safety, or correctness blocker cannot be outweighed by visual convenience.

## Recorded metrics

CI records install seconds, build seconds, public output bytes, JS/CSS bytes, asset count, HTML count, and authored source files/lines. These measurements are environment-specific comparison evidence, not production performance claims. Runtime CWV, accessibility, author usability and deployed caching require later browser/deployment tests.
