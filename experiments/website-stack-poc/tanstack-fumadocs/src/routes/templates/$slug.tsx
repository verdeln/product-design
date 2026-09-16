import { createFileRoute, Link, notFound } from '@tanstack/react-router'
import { SiteShell } from '@/components/site-shell'
import { templates } from '@/lib/templates'

export const Route = createFileRoute('/templates/$slug')({
  loader: ({ params }) => {
    const item = templates.find((entry) => entry.slug === params.slug)
    if (!item) throw notFound()
    return item
  },
  head: ({ loaderData }) => ({ meta: [{ title: `${loaderData?.title ?? 'Template'} · Verdlen` }, { name: 'description', content: loaderData?.description ?? '' }], links: [{ rel: 'canonical', href: `https://verdeln.example/templates/${loaderData?.slug ?? ''}` }] }),
  component: Page
})
function Page() {
  const item = Route.useLoaderData()
  return <SiteShell><main className="container article"><article className="article-body"><p className="eyebrow">{item.category} · {item.status}</p><h1>{item.title}</h1><p className="lede">{item.description}</p><h2>Required capabilities</h2><p>{item.capabilities.map((cap) => <span className="tag" key={cap}>{cap}</span>)}</p><h2>PoC boundary</h2><p>This page is generated from a public listing object. It does not expose an installable template graph, purchase grant or execution approval.</p></article><aside className="article-aside"><b>Listing</b><p>Public metadata only</p><Link to="/templates">← All templates</Link></aside></main></SiteShell>
}
