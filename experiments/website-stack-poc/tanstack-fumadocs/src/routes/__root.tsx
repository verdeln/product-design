import { createRootRoute, HeadContent, Outlet, Scripts } from '@tanstack/react-router'
import appCss from '@/styles/app.css?url'
import { RootProvider } from 'fumadocs-ui/provider/tanstack'

export const Route = createRootRoute({
  head: () => ({
    meta: [{ charSet: 'utf-8' }, { name: 'viewport', content: 'width=device-width, initial-scale=1' }, { name: 'theme-color', content: '#0b0d10' }],
    links: [{ rel: 'stylesheet', href: appCss }]
  }),
  component: Root
})

function Root() {
  return <html suppressHydrationWarning><head><HeadContent /></head><body><RootProvider><Outlet /></RootProvider><Scripts /></body></html>
}
