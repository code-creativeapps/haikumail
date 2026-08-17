import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { copyFileSync, mkdirSync } from 'node:fs'

/**
 * The whole extension is one IIFE content script. No code splitting, no CSS
 * assets: every stylesheet is imported `?inline` and injected into a shadow
 * root at runtime so Gmail's own CSS can't reach our UI (and vice versa).
 */
export default defineConfig({
  plugins: [
    react(),
    {
      name: 'copy-static',
      closeBundle() {
        mkdirSync('dist', { recursive: true })
        for (const f of ['manifest.json', 'mask.css']) {
          copyFileSync(`static/${f}`, `dist/${f}`)
        }
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
