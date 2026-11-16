import { createFileRoute, Link } from '@tanstack/react-router'
import { Suspense, use } from 'react'
import { docs } from '@/lib/source'
import { loadContentPage } from '@/lib/page-loader'
import { useMDXComponents } from '@/components/mdx'
import { SiteShell } from '@/components/site-shell'

export const Route = createFileRoute('/zh-cn/help/$')({
  loader: async ({ params }) => {
    const data = await loadContentPage({ data: ['zh-cn', 'help', ...(params._splat?.split('/').filter(Boolean) ?? [])] })
    await docs.getPage(data.path)?.preload()
    return data
  },
  head: ({ loaderData }) => ({ meta: [{ title: `${loaderData?.title ?? '帮助'} · Verdlen` }, { name: 'description', content: loaderData?.description ?? '' }], links: [{ rel: 'canonical', href: 'https://verdeln.example/zh-cn/help/getting-started' }, { rel: 'alternate', hrefLang: 'en', href: 'https://verdeln.example/help/getting-started' }, { rel: 'alternate', hrefLang: 'zh-CN', href: 'https://verdeln.example/zh-cn/help/getting-started' }] }),
  component: Page
})

function Article({ path }: { path: string }) {
  const page = docs.getPage(path)
  if (!page) return null
  use(page.load())
  const MDX = page.body
  return <article className="article-body" lang="zh-CN"><MDX components={useMDXComponents()} /></article>
}
function Page() {
  const data = Route.useLoaderData()
  return <SiteShell><main className="container article"><Suspense fallback={<p>加载中…</p>}><Article path={data.path}/></Suspense><aside className="article-aside"><b>帮助</b><p>本地数据<br/>同步选择<br/>导出与恢复</p><Link to="/help/$" params={{ _splat: 'getting-started' }}>English →</Link></aside></main></SiteShell>
}
