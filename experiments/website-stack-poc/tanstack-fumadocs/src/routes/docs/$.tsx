import { createFileRoute } from '@tanstack/react-router'
import { Suspense, use } from 'react'
import { DocsLayout } from 'fumadocs-ui/layouts/docs'
import { DocsBody, DocsDescription, DocsPage, DocsTitle } from 'fumadocs-ui/layouts/docs/page'
import { useFumadocsLoader } from 'fumadocs-core/source/client'
import { docs } from '@/lib/source'
import { loadContentPage } from '@/lib/page-loader'
import { baseOptions } from '@/lib/layout'
import { useMDXComponents } from '@/components/mdx'

export const Route = createFileRoute('/docs/$')({
  loader: async ({ params }) => {
    const data = await loadContentPage({ data: ['docs', ...(params._splat?.split('/').filter(Boolean) ?? [])] })
    await docs.getPage(data.path)?.preload()
    return data
  },
  head: ({ loaderData }) => ({ meta: [{ title: `${loaderData?.title ?? 'Developer Docs'} · Verdlen` }, { name: 'description', content: loaderData?.description ?? '' }], links: [{ rel: 'canonical', href: 'https://verdeln.example/docs/editor-sdk' }] }),
  component: Page
})

function Content({ path }: { path: string }) {
  const page = docs.getPage(path)
  if (!page) return null
  const { toc } = use(page.load())
  const MDX = page.body
  return <DocsPage toc={toc}><DocsTitle>{page.title}</DocsTitle><DocsDescription>{page.description}</DocsDescription><DocsBody><MDX components={useMDXComponents()} /></DocsBody></DocsPage>
}
function Page() {
  const data = useFumadocsLoader(Route.useLoaderData())
  return <DocsLayout {...baseOptions()} tree={data.pageTree}><Suspense fallback={<p>Loading…</p>}><Content path={data.path}/></Suspense></DocsLayout>
}
