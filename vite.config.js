import fs from 'node:fs'
import path from 'node:path'
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// Vite's preview server falls back to dist/index.html for extensionless
// paths. A built page lives at dist/<path>/index.html, so serve that file.
function prerenderedPages() {
  return {
    name: 'prerendered-pages',
    configurePreviewServer(server) {
      server.middlewares.use((req, _res, next) => {
        const pathname = req.url?.split('?')[0] ?? ''
        if (pathname.length > 1 && !path.extname(pathname)) {
          const clean = pathname.endsWith('/') ? pathname.slice(0, -1) : pathname
          const index = path.join(server.config.build.outDir, clean, 'index.html')
          if (fs.existsSync(index)) req.url = `${clean}/index.html`
        }
        next()
      })
    },
  }
}

export default defineConfig({
  plugins: [react(), prerenderedPages()],
  build: {
    assetsInlineLimit: 0,
  },
})