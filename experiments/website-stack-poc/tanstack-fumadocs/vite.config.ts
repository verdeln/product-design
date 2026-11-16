import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'
import { tanstackStart } from '@tanstack/react-start/plugin/vite'
import { fumadocsMdx } from 'fumadocs-mdx/vite'
import { nitro } from 'nitro/vite'
import { defineConfig } from 'vite'

export default defineConfig({
  server: { port: 3000 },
  plugins: [
    fumadocsMdx(),
    tailwindcss(),
    tanstackStart({ prerender: { enabled: true } }),
    react(),
    nitro({ preset: 'node-server' })
  ],
  resolve: {
    tsconfigPaths: true,
    alias: { tslib: 'tslib/tslib.es6.js' }
  }
})
