import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { copyFileSync, mkdirSync, readFileSync, writeFileSync } from 'node:fs'
import { radixThemesCss } from './scripts/radix-css.mjs'

const { version } = JSON.parse(readFileSync('package.json', 'utf8'))

const VIRTUAL_RADIX_CSS = 'virtual:radix-themes-css'

/**
 * The whole extension is one IIFE content script. No code splitting, no CSS
 * assets: every stylesheet is imported `?inline` and injected into a shadow
 * root at runtime so Gmail's own CSS can't reach our UI (and vice versa).
 */
export default defineConfig({
  plugins: [
    react(),
    {
      // Radix Themes' stylesheet, with the colour scales the app can't reach
      // removed. See scripts/radix-css.mjs for why.
      name: 'radix-themes-css',
      resolveId: (id) => (id === VIRTUAL_RADIX_CSS ? '\0' + id : null),
      load(id) {
        if (id !== '\0' + VIRTUAL_RADIX_CSS) return null
        const { css, before, after } = radixThemesCss()
        this.info(`Radix CSS ${(before / 1024) | 0}KB -> ${(after / 1024) | 0}KB`)
        return `export default ${JSON.stringify(css)}`
      },
    },
    {
      name: 'copy-static',
      closeBundle() {
        mkdirSync('dist', { recursive: true })
        copyFileSync('static/mask.css', 'dist/mask.css')

        // The manifest's version is stamped from package.json rather than
        // copied, so the two can never drift — they already had, once.
        const manifest = JSON.parse(readFileSync('static/manifest.json', 'utf8'))
        manifest.version = version
        writeFileSync('dist/manifest.json', JSON.stringify(manifest, null, 2) + '\n')

        mkdirSync('dist/icons', { recursive: true })
        for (const size of [16, 32, 48, 128]) {
          copyFileSync(`static/icons/icon-${size}.png`, `dist/icons/icon-${size}.png`)
        }
      },
    },
  ],
  define: { 'process.env.NODE_ENV': '"production"' },
  build: {
    outDir: 'dist',
    emptyOutDir: true,
    target: 'chrome120',
    cssCodeSplit: false,
    rollupOptions: {
      input: 'src/content/index.tsx',
      output: {
        format: 'iife',
        entryFileNames: 'content.js',
        inlineDynamicImports: true,
      },
    },
  },
})
