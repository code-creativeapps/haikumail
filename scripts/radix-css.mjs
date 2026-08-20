/**
 * Radix Themes ships one stylesheet covering every component and all 33 colour
 * scales, in light, dark and display-p3. Inlined into the content script it was
 * 754KB of the extension's 986KB — and a content script is parsed on every
 * Gmail load, so that is a cost the user pays, not just a number in a build log.
 *
 * The app renders `<Theme accentColor="gray" grayColor="sand">`, so of the 33
 * scales exactly two are reachable. The rest are only ever *defined*; Radix
 * copies a chosen scale into `--accent-*` via `[data-accent-color]` selectors,
 * and we never change that attribute. Dropping their declarations leaves those
 * selectors empty, and the minifier removes empty rules.
 */
import { readFileSync } from 'node:fs'
import { createRequire } from 'node:module'
import { transform } from 'lightningcss'

const require = createRequire(import.meta.url)

/** Scales the shipped CSS resolves through `var()`, plus the two we select. */
const KEEP = new Set(['gray', 'sand', 'accent', 'focus', 'black', 'white', 'space'])

const ALL = [
  'gray', 'mauve', 'slate', 'sage', 'olive', 'sand', 'tomato', 'red', 'ruby',
  'crimson', 'pink', 'plum', 'purple', 'violet', 'iris', 'indigo', 'blue',
  'cyan', 'teal', 'jade', 'green', 'grass', 'bronze', 'gold', 'brown',
  'orange', 'amber', 'yellow', 'lime', 'mint', 'sky', 'black', 'white',
  'accent', 'focus', 'space',
]

const DROP = ALL.filter((s) => !KEEP.has(s))

// Each custom property sits on its own line, so this stays a line filter rather
// than anything that needs to understand CSS nesting.
const isDeadDeclaration = new RegExp(`^\\s*--(?:${DROP.join('|')})-[\\w-]*\\s*:`)

export function radixThemesCss() {
  const path = require.resolve('@radix-ui/themes/styles.css')
  const full = readFileSync(path, 'utf8')

  const trimmed = full
    .split('\n')
    .filter((line) => !isDeadDeclaration.test(line))
    .join('\n')

  const { code } = transform({
    filename: 'radix-themes.css',
    code: Buffer.from(trimmed),
    minify: true,
    targets: { chrome: 120 << 16 },
  })

  return { css: code.toString(), before: full.length, after: code.length }
}
