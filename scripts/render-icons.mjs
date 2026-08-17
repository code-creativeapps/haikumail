/**
 * Renders static/icons/icon.svg to the PNG sizes the manifest asks for.
 *
 * Chrome is used as the renderer because it is the only thing guaranteed to be
 * on the machine that can rasterize an SVG, and because it is the same engine
 * that will display the result.
 */
import { execFileSync } from 'node:child_process'
import { mkdtempSync, readFileSync, writeFileSync, copyFileSync } from 'node:fs'
import { tmpdir } from 'node:os'
import { join } from 'node:path'

const CHROME = '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome'
const SIZES = [16, 32, 48, 128]
const svg = readFileSync('static/icons/icon.svg', 'utf8')
const work = mkdtempSync(join(tmpdir(), 'hk-icons-'))

for (const size of SIZES) {
  const html = join(work, `${size}.html`)
  writeFileSync(
    html,
    `<!doctype html><meta charset="utf-8">
     <style>html,body{margin:0;padding:0}svg{display:block;width:${size}px;height:${size}px}</style>
     ${svg}`,
  )
  execFileSync(CHROME, [
    '--headless',
    '--disable-gpu',
    '--hide-scrollbars',
    `--window-size=${size},${size}`,
    `--screenshot=${join(work, `${size}.png`)}`,
    `file://${html}`,
  ], { stdio: 'ignore' })
  copyFileSync(join(work, `${size}.png`), `static/icons/icon-${size}.png`)
  console.log(`icon-${size}.png`)
}
