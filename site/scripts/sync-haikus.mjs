/**
 * Copies the haiku corpus out of the extension and into the site.
 *
 * The two cannot share a module. Importing across the /site boundary would
 * mean turning on Vercel's "include source files outside the Root Directory",
 * which drags the whole extension build into every deploy — and the site needs
 * a genuinely different module anyway: `pickHaiku()` reads `localStorage`, so
 * calling it while rendering on the server throws, and guarding it produces a
 * hydration mismatch instead. The site's picker lives in lib/haiku.ts.
 *
 * So: the data crosses, the behaviour does not.
 *
 *   npm run sync:haikus        rewrite lib/haikus.ts
 *   npm run sync:haikus -- -c  check it is current, exit 1 if not
 */
import { readFileSync, writeFileSync } from 'node:fs'
import { fileURLToPath } from 'node:url'
import { dirname, join } from 'node:path'

const here = dirname(fileURLToPath(import.meta.url))
const SOURCE = join(here, '..', '..', 'src', 'app', 'haikus.ts')
const TARGET = join(here, '..', 'lib', 'haikus.ts')

const source = readFileSync(SOURCE, 'utf8')

// Everything above `const LAST_KEY` is data and types; everything below is the
// picker, which is the part that touches the browser.
const cut = source.indexOf('const LAST_KEY')
if (cut === -1) {
  throw new Error(
    'sync-haikus: could not find the data/picker boundary in haikus.ts. ' +
      'If the file was restructured, this script needs updating.',
  )
}

const banner = `// GENERATED FILE — do not edit.
// Source: src/app/haikus.ts in the extension. Regenerate with:
//   npm run sync:haikus
// The picker is deliberately not copied; see lib/haiku.ts for the site's own.

`

const generated = banner + source.slice(0, cut).trimEnd() + '\n'

/**
 * Counts by evaluating the generated module rather than by pattern-matching it.
 * A regex over the source miscounted on the first attempt, and a count that can
 * be quietly wrong is worse than no count — this also proves the file parses.
 */
function count(code) {
  const js = code
    .replace(/^export /gm, '')
    .replace(/:\s*readonly [A-Za-z]+\[\]/g, '')
    .replace(/^(export )?type [\s\S]*?^}$/gm, '')
    .replace(/^type Lines.*$/gm, '')
  const value = new Function(`${js}; return HAIKUS.length`)()
  return value
}

const check = process.argv.includes('-c') || process.argv.includes('--check')
if (check) {
  let current = ''
  try {
    current = readFileSync(TARGET, 'utf8')
  } catch {
    /* missing counts as stale */
  }
  if (current !== generated) {
    console.error('lib/haikus.ts is out of date. Run: npm run sync:haikus')
    process.exit(1)
  }
  console.log('lib/haikus.ts is current.')
} else {
  writeFileSync(TARGET, generated)
  console.log(`lib/haikus.ts written — ${count(generated)} haiku.`)
}
