import { notFound } from '@tanstack/react-router'
import { createServerFn } from '@tanstack/react-start'
import { source } from './source'

export const loadContentPage = createServerFn({ method: 'GET' })
  .validator((slugs: string[]) => slugs)
  .handler(async ({ data: slugs }) => {
    const page = source.getPage(slugs)
    if (!page) throw notFound()
    return {
      path: page.path,
      title: page.data.title,
      description: page.data.description ?? '',
      pageTree: await source.serializePageTree(source.getPageTree())
    }
  })
