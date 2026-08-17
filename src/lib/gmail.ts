/**
 * Reads Gmail out of the page it is running in.
 *
 * There is no API token and no network call here: the content script lives on
 * https://mail.google.com, so the real Gmail app — already signed in — is in
 * the DOM next to us. We drive it through its own URL router (`#search/...`)
 * and scrape the result rows and the open message. Masked, but readable.
 */

export type Row = {
  id: string
  sender: string
  /** Address, lowercased. The handle everything sender-based is keyed on. */
  email: string
  subject: string
  snippet: string
  date: string
  unread: boolean
}

export type Message = {
  subject: string
  sender: string
  date: string
  /** Plain-text rendering, used for the quiet view and as the fallback. */
  body: string
  /**
   * Sanitized original markup for the rich view, as a detached element rather
   * than an HTML string — see `sanitize`. Null when unavailable.
   */
  content: Element | null
}

const sleep = (ms: number) => new Promise((r) => setTimeout(r, ms))

/**
 * Always `textContent`, never `innerText`: the mask hides <body>, and
 * `innerText` is defined over *rendered* text, so it returns "" for everything
 * underneath us.
 */
const text = (el: Element | null | undefined) => (el?.textContent ?? '').trim()

/**
 * The one view Gmail is actually showing.
 *
 * This is the single most important thing in this file. Gmail does not throw
 * old views away when you navigate — it leaves them in the document as
 * `display:none` and builds a new one. A bare
 * `document.querySelectorAll('tr.zA')` therefore returns the current results
 * *concatenated with every list you looked at earlier*, oldest first, which
 * reads as "your search returned your inbox".
 *
 * Everything below is scoped through here. `display:none` removes an element
 * from layout, so it has no client rects; our mask only sets
 * `visibility:hidden`, which keeps layout intact — so this test distinguishes
 * "stale" from "merely masked".
 */
function liveView(): ParentNode {
  const mains = Array.from(document.querySelectorAll<HTMLElement>('div[role="main"]'))
  return mains.find((m) => m.getClientRects().length > 0) ?? document
}

const isShown = (el: Element) => el.getClientRects().length > 0

/** Gmail thread rows. `.zA` has been the row class for a decade. */
const rowNodes = () =>
  Array.from(liveView().querySelectorAll<HTMLTableRowElement>('tr.zA')).filter(isShown)

/** Signature of the currently rendered list, used to detect a real refresh. */
const listSignature = () => rowNodes().map((r) => r.id).join(',')

/** Gmail echoes the active query into its own search box; a second opinion. */
function queryApplied(query: string): boolean {
  const box = document.querySelector<HTMLInputElement>('input[name="q"]')
  if (!box) return true
  return box.value.trim().toLowerCase() === query.trim().toLowerCase()
}

const noResults = () =>
  Array.from(liveView().querySelectorAll('.TC, .UI, .TD')).some((n) =>
    /no (messages|conversations|results) matched/i.test(text(n)),
  )

/**
 * The thread id is not on the row — it sits on a span *inside* it. Getting this
 * wrong means navigating to `#search/q/:3x`, which Gmail simply ignores.
 */
function threadId(tr: HTMLTableRowElement): string {
  const holder = tr.querySelector('span[data-legacy-thread-id]')
  return (
    holder?.getAttribute('data-legacy-thread-id') ||
    tr.querySelector('span[data-thread-id]')?.getAttribute('data-thread-id')?.replace(/^#thread-\w:/, '') ||
    ''
  )
}

/**
 * The sender cell holds several spans and the useful one is not first. A
 * selector list like `.yW span[email], .yW span` does NOT try its parts in
 * order — the browser returns the earliest *document-order* match, which here
 * is an unlabelled span. So the candidates are tried explicitly instead.
 */
function senderOf(tr: HTMLTableRowElement): string {
  const labelled = tr.querySelector<HTMLElement>('.yW span[email], .yW span[name]')
  if (labelled) return labelled.getAttribute('name') || text(labelled)

  const anyWithText = Array.from(tr.querySelectorAll<HTMLElement>('.yW span')).find((s) => text(s))
  return anyWithText ? text(anyWithText) : 'Unknown'
}

function parseRow(tr: HTMLTableRowElement): Row {
  const dateEl = tr.querySelector<HTMLElement>('.xW span, .xY span[title]')
  return {
    id: threadId(tr),
    sender: senderOf(tr) || 'Unknown',
    email: (tr.querySelector('.yW span[email]')?.getAttribute('email') ?? '').toLowerCase(),
    subject: text(tr.querySelector('.y6 span')) || '(no subject)',
    snippet: text(tr.querySelector('.y2')).replace(/^[-–—\s]+/, ''),
    date: dateEl?.getAttribute('title') || text(dateEl),
    unread: tr.classList.contains('zE'),
  }
}

/** Gmail's own encoding for a query in the URL fragment. */
const encodeQuery = (q: string) => encodeURIComponent(q.trim()).replace(/%20/g, '+')

/**
 * Run a search through Gmail itself and read the rows back.
 *
 * We wait for the rendered list to actually change rather than for a fixed
 * delay, with a settle pause so late-arriving rows are included.
 */
export async function search(query: string, timeoutMs = 20_000): Promise<Row[]> {
  const before = listSignature()
  const target = `#search/${encodeQuery(query)}`
  const rerun = location.hash === target

  if (rerun) {
    // Same query twice: bounce through the router so Gmail refetches.
    location.hash = '#inbox'
    await sleep(150)
  }
  location.hash = target

  const started = Date.now()
  while (Date.now() - started < timeoutMs) {
    await sleep(250)
    // Gmail must agree that this query is the one it is showing before any row
    // is believed — otherwise we read whatever list happens to be up.
    if (!queryApplied(query)) continue
    if (noResults()) return []
    const sig = listSignature()
    if (sig && (sig !== before || (rerun && Date.now() - started > 1200))) {
      await sleep(400) // let the tail of the list render
      return rowNodes().map(parseRow)
    }
  }
  return rowNodes().map(parseRow)
}

const BLOCK = /^(DIV|P|TR|TABLE|UL|OL|LI|H[1-6]|BLOCKQUOTE|SECTION|ARTICLE|HEADER|FOOTER|PRE)$/

/**
 * Turn a Gmail message body into readable plain text.
 *
 * `innerText` would do this for free, but it is empty under the mask, so we
 * walk the tree ourselves: <br> and block elements become line breaks, quoted
 * history and images are dropped.
 */
function bodyToText(root: Element): string {
  const clone = root.cloneNode(true) as Element
  clone.querySelectorAll('style, script, .gmail_quote, .adL, .gmail_signature').forEach((n) => n.remove())

  let out = ''
  const walk = (node: Node) => {
    for (const child of Array.from(node.childNodes)) {
      if (child.nodeType === Node.TEXT_NODE) {
        out += (child.nodeValue ?? '').replace(/\s+/g, ' ')
        continue
      }
      if (child.nodeType !== Node.ELEMENT_NODE) continue
      const tag = (child as Element).tagName
      if (tag === 'BR') {
        out += '\n'
        continue
      }
      if (tag === 'IMG') continue
      const isBlock = BLOCK.test(tag)
      if (isBlock && !/\n\s*$/.test(out)) out += '\n'
      walk(child)
      if (isBlock && !/\n\s*$/.test(out)) out += '\n'
    }
  }
  walk(clone)

  return out
    .replace(/[ \t]+/g, ' ')
    .replace(/ *\n */g, '\n')
    .replace(/\n{3,}/g, '\n\n')
    .trim()
}

/**
 * Message bodies go stale exactly like lists do: every thread you have opened
 * this session leaves its `.a3s` behind in a hidden view. Reading them
 * unscoped shows you the wrong email entirely.
 */
const messageNodes = () => Array.from(liveView().querySelectorAll<HTMLElement>('.a3s')).filter(isShown)

/** The open thread's own header fields, from the live view only. */
const openThreadField = (selector: string) => {
  const el = Array.from(liveView().querySelectorAll(selector)).find(isShown)
  return el ?? null
}

/** Tags that can execute, navigate or phone home. Removed outright. */
const STRIP_TAGS = 'script, iframe, frame, object, embed, applet, form, input, textarea, select, button, link, meta, base'
const SAFE_URL = /^(https?:|mailto:|tel:|cid:|data:image\/)/i

const PIXEL_MARK = 'data-qm-pixel'

/**
 * Mark tracking pixels — invisible images whose only job is to report that you
 * looked. This has to run on the live nodes: a fresh clone has not loaded yet,
 * so its `naturalWidth` is still 0 and the 1x1 giveaway is invisible.
 */
function markTrackingPixels(node: Element): Element[] {
  const marked: Element[] = []
  node.querySelectorAll('img').forEach((img) => {
    const declaredPixel = img.getAttribute('width') === '1' && img.getAttribute('height') === '1'
    if (declaredPixel || (img.naturalWidth === 1 && img.naturalHeight === 1)) {
      img.setAttribute(PIXEL_MARK, '')
      marked.push(img)
    }
  })
  return marked
}

/**
 * Prepare a message body for re-hosting inside our own UI.
 *
 * Gmail has already neutered the dangerous parts server-side, but we are
 * putting this markup in a new place, so we re-check rather than trust: no
 * scripting or form tags, no `on*` handlers, no javascript:/unknown-scheme
 * URLs, tracking pixels dropped, and every link forced to open in a new tab.
 *
 * This returns a *node*, never an HTML string, and that is load-bearing:
 * mail.google.com enforces Trusted Types, so both `innerHTML = str` and
 * `DOMParser.parseFromString` throw there. Cloning and cleaning nodes in place
 * touches no Trusted Types sink at all.
 *
 * Images need no rewriting — Gmail has already pointed them at its own image
 * proxy, and we are still in the same document, so they load exactly as they
 * would in Gmail (the sender learns nothing extra about you).
 */
function sanitize(node: Element): Element {
  const marked = markTrackingPixels(node)
  const clone = node.cloneNode(true) as Element
  marked.forEach((img) => img.removeAttribute(PIXEL_MARK)) // leave Gmail's DOM as we found it

  clone.querySelectorAll(`${STRIP_TAGS}, [${PIXEL_MARK}]`).forEach((n) => n.remove())

  for (const el of Array.from(clone.querySelectorAll('*'))) {
    for (const attr of Array.from(el.attributes)) {
      const name = attr.name.toLowerCase()
      const isUrl = name === 'href' || name === 'src' || name === 'background' || name === 'srcset'
      if (name.startsWith('on') || (isUrl && !SAFE_URL.test(attr.value.trim()))) {
        el.removeAttribute(attr.name)
      }
    }
    if (el.tagName === 'A') {
      el.setAttribute('target', '_blank')
      el.setAttribute('rel', 'noopener noreferrer')
    }
    if (el.tagName === 'IMG' && !el.getAttribute('src')) {
      // Some senders defer the real URL onto a data attribute.
      const deferred = el.getAttribute('data-src') || el.getAttribute('data-surl') || ''
      if (SAFE_URL.test(deferred)) el.setAttribute('src', deferred)
    }
  }
  return clone
}

/** Open one thread and read its messages out of the DOM. */
export async function openThread(row: Row, query: string, timeoutMs = 15_000): Promise<Message> {
  const fallback = { subject: row.subject, sender: row.sender, date: row.date, content: null }
  if (!row.id) return { ...fallback, body: '(could not locate this thread)' }

  const before = text(openThreadField('h2.hP'))
  location.hash = `#search/${encodeQuery(query)}/${row.id}`

  const started = Date.now()
  while (Date.now() - started < timeoutMs) {
    await sleep(200)
    const subject = text(openThreadField('h2.hP'))
    const opened = subject && messageNodes().length && (subject !== before || Date.now() - started > 1500)
    if (!opened) continue

    await sleep(250) // let the rest of a multi-message thread render
    const nodes = messageNodes()
    const body = nodes.map(bodyToText).filter(Boolean).join('\n\n— — —\n\n')

    const content = document.createElement('div')
    nodes.forEach((node, i) => {
      if (i > 0) {
        const rule = document.createElement('hr')
        rule.setAttribute('style', 'border:0;border-top:1px solid #ddd;margin:24px 0')
        content.append(rule)
      }
      content.append(sanitize(node))
    })

    return {
      subject: text(openThreadField('h2.hP')) || row.subject,
      sender: text(openThreadField('.gD')) || row.sender,
      date: openThreadField('.g3')?.getAttribute('title') || row.date,
      body: body || '(this message has no readable text body)',
      content: content.childNodes.length ? content : null,
    }
  }
  return { ...fallback, body: '(could not read this message)' }
}

/** Go back to the result list without a page load. */
export function closeThread(query: string) {
  location.hash = `#search/${encodeQuery(query)}`
}

/**
 * Gmail leaks unread counts through the tab title and the favicon. Both are
 * compulsion triggers, so we hold them still for as long as the mask is up —
 * and rather than leaving the tab blank, we fly our own flag there.
 */
export function maskTabIdentity(title: string, faviconSvg: string) {
  const href = `data:image/svg+xml;utf8,${encodeURIComponent(faviconSvg)}`
  const OURS = 'data-haikumail-icon'

  const apply = () => {
    if (document.title !== title) document.title = title

    document
      .querySelectorAll<HTMLLinkElement>(`link[rel~="icon"]:not([${OURS}])`)
      .forEach((l) => l.parentNode?.removeChild(l))

    if (!document.head?.querySelector(`link[${OURS}]`)) {
      const link = document.createElement('link')
      link.rel = 'icon'
      link.type = 'image/svg+xml'
      link.href = href
      link.setAttribute(OURS, '')
      document.head?.append(link)
    }
  }
  apply()
  const observer = new MutationObserver(apply)
  const start = () => {
    observer.observe(document.head ?? document.documentElement, { childList: true, subtree: true })
    apply()
  }
  if (document.head) start()
  else document.addEventListener('DOMContentLoaded', start, { once: true })
  setInterval(apply, 1000)
}
