export default defineNuxtConfig({
  modules: ['@nuxt/ui', '@nuxt/content'],
  css: ['~/assets/css/main.css'],
  devtools: { enabled: false },
  app: {
    head: {
      titleTemplate: '%s · Verdlen',
      meta: [
        { name: 'theme-color', content: '#0b0d10' },
        { property: 'og:site_name', content: 'Verdlen' }
      ]
    }
  },
  nitro: {
    prerender: {
      crawlLinks: true,
      routes: [
        '/',
        '/help/getting-started',
        '/docs/editor-sdk',
        '/templates',
        '/templates/project-kit',
        '/zh-cn/help/getting-started',
        '/search'
      ]
    }
  }
})
