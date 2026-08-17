# HaikuEmail

A Chrome extension that masks Gmail and gives you a search-only reader in its
place. Nothing is shown until you ask for something, and you can't ask for
anything for the first 30 seconds.

## How it works

The extension is a single content script on `https://mail.google.com/*`, running
at `document_start`.

1. **Mask.** `mask.css` sets `body { visibility: hidden }` before Gmail paints,
   so there is never a visible frame of inbox. The tab title and favicon — which
   leak unread counts — are replaced by a `MutationObserver` with "HaikuEmail"
   and this extension's own mark, so the tab stops being a notification.
2. **Still readable.** Gmail is only *invisible*, not blocked: it loads, signs in
   and renders normally underneath. The reader therefore needs no OAuth, no API
   key and no network call of its own — it reads the real Gmail DOM in the same
   tab, and searches by driving Gmail's own router (`location.hash =
   '#search/…'`) and scraping the resulting `tr.zA` rows and `.a3s` message
   bodies. See `src/lib/gmail.ts`.
3. **The UI** is React + [Radix Themes](https://www.radix-ui.com/themes), mounted
   into a shadow root on a node appended to `<html>` (outside `<body>`, which is
   why the mask doesn't hide it). Gmail's CSS and ours can't reach each other.
4. **The 30 second gate.** `useCoolDown` locks every control on load. It restarts
   on every page load, so reloading to skip the wait costs you the full wait
   again.

Because Gmail is only masked, an escape hatch is included: *Unmask the real Gmail
for this tab* (only after the timer) drops the overlay for that tab, for when you
genuinely need to compose or manage mail.

## Install

```bash
npm install
npm run build
```

Then in Chrome: `chrome://extensions` → enable **Developer mode** → **Load
unpacked** → select the `dist/` folder. Open Gmail.

## Develop

`npm run dev` rebuilds on change (reload the extension in Chrome to pick it up).

`dev/test.html` is a harness that imitates the parts of Gmail's DOM the reader
depends on, so the whole flow can be driven without a real inbox:

```bash
python3 -m http.server 8722
# open http://localhost:8722/dev/test.html?fast
```

Two dev-only query params, both deliberately unreachable on `mail.google.com`:
`?fast` shortens the timer to 2s, and `?haiku=<0-156>` pins the draw to one
haiku so a specific one can be looked at on purpose.

## Look and feel

Two typefaces, both already on the machine — a content script cannot fetch a
webfont (Gmail's CSP blocks it), and embedding one would cost ~100KB a weight
for no gain over what the OS ships:

- **sans** (`system-ui`) for the interface, so it matches the desktop.
- **serif** (`ui-serif` → New York on Apple platforms, Georgia elsewhere) for
  everything that is prose to be read rather than interface to be operated: the
  poems, the "Haiku" half of the wordmark, and message subjects and plain-text
  bodies, set to a ~70-character measure.

The palette keeps the warm sand greys and adds one cool note — a muted slate
blue, applied by hand rather than by switching Radix's accent, so it lands on
four things and nowhere else: the mark, the progress bar, the selected segment,
and focus rings. Tokens are defined for light and dark in `src/content/app.css`.

The mark is three lines in 5-7-5 proportion inside a rounded square that stands
in for the envelope — the two halves of the name in one shape. It lives twice:
as JSX in `src/app/Logo.tsx` (header and favicon) and as `static/icons/icon.svg`
(the extension icons). `npm run icons` re-renders the PNGs with headless Chrome.
An earlier version outlined the envelope too, and at 32px the outline and the
lines merged into one grey blob; 16px is the size that has to work, so the mark
is solid, with the gaps wider than the strokes.

## The wait

The 30 seconds are given to a haiku, drawn at random from the 157 in
`src/app/haikus.ts` — one per landing, its three lines arriving in turn. The
countdown itself is kept small and grey at the bottom of the screen, on the
theory that a large ticking number is just one more thing to stare at. The
picker never repeats the previous haiku.

Two sets, and the distinction is a licensing one:

- **100 originals**, written for this extension, all 5-7-5. Shown unsigned.
- **57 translations** of canonical haiku — Bashō, Buson, Issa, Shiki, and a few
  others — credited to the poet under the poem. The Japanese originals have been
  public domain for centuries, but the *translations* that circulate in English
  are not: Blyth (1949), Henderson (1958) and Hass (1994) are all still in
  copyright, which is exactly the trap in gathering "famous haiku" off the web.
  So these renderings were made here, from the originals. Each carries the
  romaji of its source in the `romaji` field — not displayed, but recorded so any
  translation can be checked instead of taken on trust (it rides along in the
  attribution's `title` attribute). Each is labelled **AI translation** beside
  the poet's name, because a reader deserves to know the English is machine-made
  rather than a scholar's. They follow the sense rather than forcing
  5-7-5: Japanese counts *on*, not syllables, and padding a translation out to
  fit the shape is how you end up with a poem the poet did not write.

## Reading a message

Two views, toggled in the reader header and remembered per browser:

- **Plain** — `bodyToText` rebuilds readable text from the DOM (line breaks from
  `<br>` and block elements, quoted history dropped).
- **Original** — the sender's real markup, images and all, hosted in a **shadow
  root of its own** nested inside ours. Their CSS is sealed in; ours stays out.
  Before it is re-hosted it goes through `sanitize`: scripting and form tags
  removed, `on*` handlers stripped, only `http(s)/mailto/tel/cid/data:image`
  URLs kept, links forced to `target="_blank" rel="noopener noreferrer"`, and
  tracking pixels dropped. Images need no rewriting — Gmail has already pointed
  them at its own proxy, and we are still in the same document.

## Five things that will bite anyone editing `src/lib/gmail.ts`

- **Never use `innerText`.** The mask hides `<body>`, and `innerText` is defined
  over *rendered* text, so it returns `""` for the entire Gmail document.
  `textContent` (and `bodyToText`, which rebuilds line breaks from the DOM) is
  the only way to read anything underneath the mask.
- **Only ever read the live view.** Gmail does not discard old views when you
  navigate — it leaves them in the document as `display:none` and builds a new
  one. An unscoped `querySelectorAll('tr.zA')` returns the current results
  *concatenated with every list you looked at earlier, oldest first*, which
  presents as "my search returned my inbox". Everything goes through
  `liveView()`, which picks the one `div[role="main"]` that still has client
  rects. `display:none` kills layout; our `visibility:hidden` mask does not — so
  that test tells "stale" apart from "merely masked".
- **A selector list is not a priority list.** `querySelector('a, b')` returns the
  earliest match in *document order*, not the first selector that matches. The
  sender cell has several spans and the labelled one is second, so
  `'.yW span[email], .yW span'` silently picked the wrong one. Candidates that
  have a preference order must be tried in separate calls — see `senderOf`.
- **Never build DOM from an HTML string.** `mail.google.com` enforces Trusted
  Types, so `innerHTML = str` *and* `DOMParser.parseFromString` both throw on
  this origin. Message markup is therefore carried around as detached, cleaned
  **nodes** and appended with DOM calls — never serialized and re-parsed.
- **The thread id is not on the row.** `tr.zA` carries a useless internal id like
  `:3x`; the real id is on a `span[data-legacy-thread-id]` *inside* the row, and
  it is what makes `#search/<q>/<id>` open a thread.

## Caveats

Reading Gmail out of its own DOM means the selectors here (`tr.zA`, `.y6`,
`span[data-legacy-thread-id]`, `.a3s`, `h2.hP`) are Gmail's private class names.
They have been stable for years, but Google can change them at any time — if
results or bodies stop appearing, those selectors are the place to look.
