import { createFileRoute, Link } from '@tanstack/react-router'
import { Suspense, use } from 'react'
import { docs } from '@/lib/source'
import { loadContentPage } from '@/lib/page-loader'
import { useMDXComponents } from '@/components/mdx'
import { SiteShell } from '@/components/site-shell'

export const Route = createFileRoute('/help/$')({
  loader: async ({ params }) => {
    const data = await loadContentPage({ data: ['help', ...(params._splat?.split('/').filter(Boolean) ?? [])] })
    await docs.getPage(data.path)?.preload()
    return data
  },
  head: ({ loaderData }) => ({ meta: [{ title: `${loaderData?.title ?? 'Help'} · Verdlen` }, { name: 'description', content: loaderData?.description ?? '' }], links: [{ rel: 'canonical', href: 'https://verdeln.example/help/getting-started' }, { rel: 'alternate', hrefLang: 'en', href: 'https://verdeln.example/help/getting-started' }, { rel: 'alternate', hrefLang: 'zh-CN', href: 'https://verdeln.example/zh-cn/help/getting-started' }] }),
  component: Page
})

function Article({ path }: { path: string }) {
  const page = docs.getPage(path)
  if (!page) return null
  use(page.load())
  const MDX = page.body
  return <article className="article-body"><MDX components={useMDXComponents()} /></article>
}
function Page() {
  const data = Route.useLoaderData()
  return <SiteShell><main className="container article"><Suspense fallback={<p>Loading…</p>}><Article path={data.path}/></Suspense><aside className="article-aside"><b>Help</b><p>Local storage<br/>Sync choices<br/>Export & recovery</p><Link to="/zh-cn/help/$" params={{ _splat: 'getting-started' }}>简体中文 →</Link></aside></main></SiteShell>
}
