import { createFileRoute, Link } from '@tanstack/react-router'
import { SiteShell } from '@/components/site-shell'
import { templates } from '@/lib/templates'

export const Route = createFileRoute('/templates/')({
  head: () => ({ meta: [{ title: 'Templates · Verdlen' }, { name: 'description', content: 'Public Verdlen template listings for the website stack PoC.' }], links: [{ rel: 'canonical', href: 'https://verdeln.example/templates' }] }),
  component: Page
})
function Page() {
  return <SiteShell><main><header className="container catalog-head"><p className="eyebrow">Public catalog projection</p><h1>Templates for repeatable work.</h1><p className="lede">Listing metadata is public. Protected template graphs and acquisition rights remain product/Cloud concerns.</p></header><section className="container template-grid">{templates.map((item) => <Link key={item.slug} className="template-card" to="/templates/$slug" params={{ slug: item.slug }}><span className="eyebrow">{item.category}</span><h2>{item.title}</h2><p>{item.description}</p>{item.capabilities.map((cap) => <span className="tag" key={cap}>{cap}</span>)}</Link>)}</section></main></SiteShell>
}
