/**
 * The hero video: the actual extension, driven in the harness and recorded.
 *
 * Two takes rather than one, because the honest version of this is thirty
 * seconds long and nobody watches a thirty second hero loop:
 *
 *   A — the mask going up and the real counter starting at 0:30.
 *   B — the same build after the wait: search, results, a message.
 *
 * Cutting between them is a jump cut, which is normal and does not pretend
 * the wait is shorter than it is. Speeding the wait up would.
 */
import { chromium } from 'playwright'
import { createServer } from 'node:http'
import { readFile, mkdir, rm, readdir } from 'node:fs/promises'
import { execFileSync } from 'node:child_process'
import { extname, join } from 'node:path'
import { fileURLToPath } from 'node:url'

const ROOT = fileURLToPath(new URL('..', import.meta.url))
const OUT = join(ROOT, 'site/public/video')
const TMP = join(ROOT, '.hero-tmp')
const SIZE = { width: 1200, height: 760 }

const TYPES = { '.html': 'text/html', '.js': 'text/javascript', '.css': 'text/css' }
const server = createServer(async (req, res) => {
  try {
    const p = join(ROOT, decodeURIComponent(req.url.split('?')[0]))
    res.writeHead(200, { 'content-type': TYPES[extname(p)] ?? 'application/octet-stream' })
    res.end(await readFile(p))
  } catch {
    if (!res.headersSent) res.writeHead(404)
    res.end()
  }
})
await new Promise((r) => server.listen(0, r))
const base = `http://127.0.0.1:${server.address().port}`

await rm(TMP, { recursive: true, force: true })
await mkdir(TMP, { recursive: true })
await mkdir(OUT, { recursive: true })

const browser = await chromium.launch()

async function take(name, query, run) {
  const dir = join(TMP, name)
  const ctx = await browser.newContext({
    viewport: SIZE,
    recordVideo: { dir, size: SIZE },
    colorScheme: 'light',
    deviceScaleFactor: 1,
  })
  const page = await ctx.newPage()
  await page.goto(`${base}/dev/test.html?${query}`)
  await run(page)
  await ctx.close()
  const [file] = await readdir(dir)
  return join(dir, file)
}

// A — the wait, at its real length, cut short.
const a = await take('a', 'rows=shots&haiku=12', async (page) => {
  await page.waitForTimeout(5600)
})

// B — after the wait. `?fast` only shortens the cool-down we have already
// shown honestly in take A; the first seconds are trimmed off below.
const b = await take('b', 'fast&rows=shots', async (page) => {
  await page.waitForTimeout(3200)
  await page.locator('input[aria-label="Search your mail"]').click()
  await page.type('input[aria-label="Search your mail"]', 'invoice', { delay: 110 })
  await page.waitForTimeout(500)
  await page.click('button[aria-label="Search"]')
  await page.waitForTimeout(1900)
  await page.locator('.hk-row').first().click()
  await page.waitForTimeout(2600)
})

await browser.close()
server.close()

const ff = (args) => execFileSync('ffmpeg', ['-y', '-loglevel', 'error', ...args])

// Trim B's leading cool-down, then join the two takes.
ff(['-i', b, '-ss', '3.0', '-an', join(TMP, 'b.mp4')])
ff(['-i', a, '-an', join(TMP, 'a.mp4')])
ff([
  '-i', join(TMP, 'a.mp4'),
  '-i', join(TMP, 'b.mp4'),
  '-filter_complex', '[0:v][1:v]concat=n=2:v=1[v]',
  '-map', '[v]',
  '-c:v', 'libx264', '-crf', '30', '-preset', 'slow',
  '-pix_fmt', 'yuv420p', '-movflags', '+faststart', '-r', '24',
  join(OUT, 'haikumail.mp4'),
])
ff([
  '-i', join(OUT, 'haikumail.mp4'),
  '-c:v', 'libvpx-vp9', '-crf', '40', '-b:v', '0', '-an',
  join(OUT, 'haikumail.webm'),
])
// First frame doubles as the poster, so nothing pops when the video starts.
ff(['-i', join(OUT, 'haikumail.mp4'), '-vframes', '1', '-q:v', '4', join(OUT, 'haikumail-poster.jpg')])

await rm(TMP, { recursive: true, force: true })

const dur = execFileSync('ffprobe', ['-v', 'error', '-show_entries', 'format=duration',
  '-of', 'default=nw=1:nk=1', join(OUT, 'haikumail.mp4')]).toString().trim()
console.log(`duration ${Number(dur).toFixed(1)}s`)
