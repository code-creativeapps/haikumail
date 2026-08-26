/**
 * Chrome Web Store screenshots, taken from dev/test.html rather than a real
 * inbox — the harness imitates the parts of Gmail's DOM the reader depends on,
 * so the overlay behaves identically while every name in it is invented.
 *
 * Two passes. The first drives the app and captures the overlay alone; the
 * second drops each capture into a captioned 1280x800 frame, because the store
 * has no caption field and an uncaptioned screenshot has to explain itself.
 *
 * Everything renders at 2x and is downsampled to the store's exact 1280x800.
 */
import { chromium } from 'playwright'
import { execFileSync } from 'node:child_process'
import { createServer } from 'node:http'
import { readFile } from 'node:fs/promises'
import { extname, join } from 'node:path'
import { fileURLToPath } from 'node:url'

const ROOT = fileURLToPath(new URL('..', import.meta.url))
const OUT = join(ROOT, 'store/screenshots')
const RAW = join(OUT, 'raw')

/**
 * The store accepts 1280x800 and 640x400 and nothing else, so the 2x renders
 * have to come back down before upload. Doing it here rather than by hand is
 * the difference between a reproducible script and a rejected listing.
 */
const exact = (file, w, h) =>
  execFileSync('sips', ['--resampleHeightWidth', String(h), String(w), file], { stdio: 'ignore' })

const TYPES = { '.html': 'text/html', '.js': 'text/javascript', '.css': 'text/css', '.png': 'image/png' }

// The overlay is driven at this size; each shot is then clipped to its own
// content, because the wait is a third of the height of a results list and a
// uniform crop would leave it two-thirds empty.
const APP = { width: 1120, height: 900 }
const PAD = 28

const server = createServer(async (req, res) => {
  const path = join(ROOT, decodeURIComponent(req.url.split('?')[0]))
  try {
    const body = await readFile(path)
    res.writeHead(200, { 'content-type': TYPES[extname(path)] ?? 'application/octet-stream' })
    res.end(body)
  } catch {
    res.writeHead(404).end('not found')
  }
})
await new Promise((r) => server.listen(0, r))
const base = `http://127.0.0.1:${server.address().port}`

const browser = await chromium.launch()
const ctx = await browser.newContext({
  viewport: APP,
  deviceScaleFactor: 2,
  colorScheme: 'light',
  reducedMotion: 'no-preference',
})

/** The overlay lives in a shadow root; Playwright's css engine pierces it. */
const open = async (query) => {
  const page = await ctx.newPage()
  await page.goto(`${base}/dev/test.html?${query}`)
  return page
}
const settle = (page, ms) => page.waitForTimeout(ms)

/**
 * The bounding box of the app's own column inside the shadow root, padded.
 * Screenshotting this rather than the viewport is what keeps the set tight.
 */
const contentBox = (page) =>
  page.evaluate(
    ([pad]) => {
      const shadow = document.getElementById('haikumail-root').shadowRoot
      // shadow > container > Theme > Flex(minHeight:100vh) > the column. The
      // Flex is always viewport-tall, so clipping to it clips to nothing.
      const column = shadow.querySelector('div > div > div').firstElementChild
      const r = column.getBoundingClientRect()
      return {
        x: Math.max(0, Math.round(r.x - pad)),
        y: Math.max(0, Math.round(r.y - pad)),
        width: Math.round(r.width + pad * 2),
        height: Math.round(r.height + pad * 2),
      }
    },
    [PAD],
  )

const shots = [
  {
    name: '1-the-wait',
    caption: 'A haiku holds the first thirty seconds.',
    sub: 'Reloading does not skip it — it starts it again.',
    async run() {
      // No ?fast here: the real thirty-second counter is the point of the shot.
      const page = await open('rows=shots&haiku=12')
      await settle(page, 2600) // all three lines animated in, counter near 0:27
      return page
    },
  },
  {
    name: '2-search-only',
    caption: 'Then nothing, until you ask.',
    sub: 'No list to scroll, no unread count to answer to.',
    async run() {
      const page = await open('fast&rows=shots')
      await settle(page, 2600)
      await page.fill('input[aria-label="Search your mail"]', 'invoice')
      await page.click('button[aria-label="Search"]')
      await settle(page, 1400)
      return page
    },
  },
  {
    name: '3-browse-by-kind',
    caption: 'Or browse by kind, not by date.',
    sub: 'The categories you would have made yourself.',
    async run() {
      const page = await open('fast&rows=shots')
      await settle(page, 2600)
      await page.locator('.hk-mode .rt-SegmentedControlItem').nth(1).click()
      await settle(page, 600)
      // Newsletters, not the second chip: "Favourite senders" is empty until
      // the user has tagged someone, and an empty state is a poor first look.
      await page.locator('.hk-filter').nth(2).click()
      await settle(page, 2000)
      return page
    },
  },
  {
    name: '4-reading',
    caption: 'Read it plain, or as it was sent.',
    // The default is Original; Plain is the one worth showing, and the pixel
    // claim is the true one — remote images are not blocked, trackers are.
    sub: 'Quoted history dropped, tracking pixels removed.',
    async run() {
      const page = await open('fast&rows=shots')
      await settle(page, 2600)
      await page.fill('input[aria-label="Search your mail"]', 'invoice')
      await page.click('button[aria-label="Search"]')
      await settle(page, 1400)
      await page.locator('.hk-row').first().click()
      await settle(page, 1200)
      // Two segmented controls are on screen while reading: the masthead's
      // mode toggle, then the reader's. Plain is the third item overall.
      await page.locator('.rt-SegmentedControlItem').nth(2).click()
      await settle(page, 1200)
      return page
    },
  },
  {
    name: '5-not-a-prison',
    caption: 'It isn\u2019t a prison.',
    sub: 'One link gives you the real Gmail — and coming back restarts the thirty seconds.',
    async run() {
      // The idle, unlocked state: the wait is over, nothing has been asked
      // for yet, and the way out is sitting there in plain sight.
      const page = await open('fast&rows=shots')
      await settle(page, 3000)
      return page
    },
  },
]

const captured = []
for (const shot of shots) {
  const page = await shot.run()
  const file = join(RAW, `${shot.name}.png`)
  await page.screenshot({ path: file, clip: await contentBox(page) })
  await page.close()
  captured.push({ ...shot, file })
  console.log(`captured ${shot.name}`)
}

await browser.close()
server.close()
console.log(`\n${captured.length} raw captures in ${RAW}`)

/* ---------------------------------------------------------------------- *
 * Second pass: the captioned frames.
 *
 * The store shows these in a carousel with no caption field of its own, so
 * the sentence has to live in the pixels. Colours are the site's own tokens,
 * so the listing and haikumail.app look like one thing.
 * ---------------------------------------------------------------------- */

const FRAME = { width: 1280, height: 800 }
const CARD = { width: 1000, top: 208, maxHeight: 528 }

const frameHtml = (shot, dataUri) => `<!doctype html>
<meta charset="utf-8">
<style>
  * { margin: 0; box-sizing: border-box }
  html, body { width: ${FRAME.width}px; height: ${FRAME.height}px }
  body {
    background: #f2efe9;
    font-family: ui-serif, 'New York', 'Iowan Old Style', Georgia, serif;
    color: #1c1c19;
    display: flex; flex-direction: column; align-items: center;
    padding: 64px 0 0;
    overflow: hidden;
  }
  h1 { font-size: 42px; font-weight: 500; letter-spacing: -0.01em; line-height: 1.15 }
  p {
    margin-top: 16px; font-size: 20px; line-height: 1.4; color: #56564f;
    font-family: system-ui, -apple-system, sans-serif;
  }
  .card {
    margin-top: 40px;
    width: ${CARD.width}px; height: ${CARD.maxHeight}px;
    overflow: hidden;
    border-radius: 10px 10px 0 0;
    border: 1px solid #e0ddd5; border-bottom: none;
    background: #fff;
    box-shadow: 0 18px 44px rgba(28, 28, 25, 0.13);
  }
  .card img { display: block; width: 100%; }
</style>
<h1>${shot.caption}</h1>
<p>${shot.sub}</p>
<div class="card"><img src="${dataUri}"></div>
`

const shell = await chromium.launch()
const framer = await shell.newContext({ viewport: FRAME, deviceScaleFactor: 2, colorScheme: 'light' })

for (const shot of captured) {
  const uri = `data:image/png;base64,${(await readFile(shot.file)).toString('base64')}`
  const page = await framer.newPage()
  await page.setContent(frameHtml(shot, uri))
  await page.waitForLoadState('networkidle')
  const out = join(OUT, `${shot.name}.png`)
  await page.screenshot({ path: out })
  exact(out, FRAME.width, FRAME.height)
  await page.close()
  console.log(`framed  ${shot.name}  ${FRAME.width}x${FRAME.height}`)
}
await shell.close()
console.log(`\nframed set in ${OUT}`)

/* ---------------------------------------------------------------------- *
 * The 440x280 small promo tile. Rendered here rather than by hand so it
 * stays in step with the mark and the palette.
 * ---------------------------------------------------------------------- */

const TILE = { width: 440, height: 280 }

const tileHtml = `<!doctype html>
<meta charset="utf-8">
<style>
  * { margin: 0; box-sizing: border-box }
  html, body { width: ${TILE.width}px; height: ${TILE.height}px }
  body {
    background: #f2efe9; color: #1c1c19;
    display: flex; flex-direction: column;
    align-items: center; justify-content: center; gap: 18px;
    font-family: ui-serif, 'New York', 'Iowan Old Style', Georgia, serif;
  }
  .lockup { display: flex; align-items: center; gap: 12px }
  .name { font-size: 40px; letter-spacing: -0.01em }
  .name .sans { font-family: system-ui, -apple-system, sans-serif; color: #56564f; font-size: 37px }
  .line { font-size: 17px; color: #56564f; font-family: system-ui, -apple-system, sans-serif }
</style>
<div class="lockup">
  <svg width="44" height="44" viewBox="0 0 128 128">
    <rect width="128" height="128" rx="30" fill="#46596b"/>
    <g stroke="#f7f5f1" stroke-width="10" stroke-linecap="round">
      <path d="M44 42h40"/><path d="M36 64h56"/><path d="M44 86h40"/>
    </g>
  </svg>
  <span class="name">Haiku<span class="sans">Mail</span></span>
</div>
<div class="line">A haiku holds the first thirty seconds.</div>
`

const tiler = await chromium.launch()
const tileCtx = await tiler.newContext({ viewport: TILE, deviceScaleFactor: 2, colorScheme: 'light' })
const tilePage = await tileCtx.newPage()
await tilePage.setContent(tileHtml)
const tileOut = join(OUT, 'promo-tile-440x280.png')
await tilePage.screenshot({ path: tileOut })
exact(tileOut, TILE.width, TILE.height)
await tiler.close()
console.log(`framed  promo-tile  ${TILE.width}x${TILE.height}`)
