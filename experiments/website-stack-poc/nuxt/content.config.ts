import { defineCollection, defineContentConfig, z } from '@nuxt/content'

const pageSchema = z.object({
  title: z.string(),
  description: z.string()
})

export default defineContentConfig({
  collections: {
    help: defineCollection({ type: 'page', source: 'help/**/*.md', schema: pageSchema }),
    docs: defineCollection({ type: 'page', source: 'docs/**/*.md', schema: pageSchema }),
    helpZh: defineCollection({ type: 'page', source: 'zh-cn/help/**/*.md', schema: pageSchema }),
    templates: defineCollection({
      type: 'data',
      source: 'templates/*.yml',
      schema: z.object({
        slug: z.string(),
        title: z.string(),
        description: z.string(),
        category: z.string(),
        capabilities: z.array(z.string()),
        status: z.enum(['available', 'preview'])
      })
    })
  }
})
