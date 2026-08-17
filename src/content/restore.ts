/**
 * The way back.
 *
 * Once the mask is off, HaikuMail has no surface at all — the tab is just
 * Gmail, and the only way back would be a page reload. So unmasking leaves one
 * thing behind: a small mark in the bottom-right corner that puts the mask back
 * on. Bottom-right because Gmail's own compose button and chat rail live bottom
 * -left, and covering those is how a widget makes itself hated.
 *
 * It lives in its own shadow root, like the app, so Gmail's stylesheet cannot
 * reach it. Everything is built with DOM calls rather than markup strings:
 * mail.google.com enforces Trusted Types, where `innerHTML` throws.
 */

const HOST_ID = 'haikumail-restore'
const SVG_NS = 'http://www.w3.org/2000/svg'

const CSS = `
  :host { all: initial; }

  .fab {
    position: fixed;
    right: 24px;
    bottom: 24px;
    z-index: 2147483646;
    display: flex;
    align-items: center;
    gap: 0;
    height: 52px;
    padding: 0;
    border: 0;
    border-radius: 26px;
    background: #46596b;
    color: #f7f5f1;
    cursor: pointer;
    box-shadow: 0 6px 20px rgba(17, 20, 24, 0.22), 0 1px 3px rgba(17, 20, 24, 0.14);
    font-family: system-ui, -apple-system, 'Segoe UI', Roboto, sans-serif;
    animation: fab-in 420ms cubic-bezier(0.16, 1, 0.3, 1) both;
    transition: background-color 160ms ease, box-shadow 160ms ease, transform 160ms ease;
  }

  .icon {
    display: grid;
    place-items: center;
    width: 52px;
    height: 52px;
    flex: 0 0 52px;
  }

  /*
   * The label is laid out at its real width and clipped to nothing, so the
   * button can grow into it on hover without measuring anything at runtime.
   */
  .label {
    max-width: 0;
    overflow: hidden;
    white-space: nowrap;
    font-size: 13px;
    letter-spacing: 0.01em;
    opacity: 0;
    transition: max-width 220ms cubic-bezier(0.16, 1, 0.3, 1), opacity 160ms ease,
      padding-right 220ms cubic-bezier(0.16, 1, 0.3, 1);
  }

  .fab:hover,
  .fab:focus-visible {
    background: #3b4b5a;
    transform: translateY(-2px);
    box-shadow: 0 10px 28px rgba(17, 20, 24, 0.26), 0 2px 6px rgba(17, 20, 24, 0.16);
  }

  .fab:hover .label,
  .fab:focus-visible .label {
    max-width: 12rem;
    opacity: 1;
    padding-right: 20px;
  }

  .fab:focus-visible {
    outline: 2px solid #8fa2b1;
    outline-offset: 3px;
  }

  .fab:active {
    transform: translateY(0);
  }

  @keyframes fab-in {
    from { opacity: 0; transform: scale(0.8) translateY(8px); }
    to   { opacity: 1; transform: none; }
  }

  @media (prefers-color-scheme: dark) {
    .fab { background: #8ba3b7; color: #12161a; }
    .fab:hover, .fab:focus-visible { background: #a3bacd; }
  }

  @media (prefers-reduced-motion: reduce) {
    .fab { animation: none; transition: background-color 160ms ease; }
    .fab:hover, .fab:focus-visible { transform: none; }
  }
`

/** The three 5-7-5 strokes of the mark, without its ground. */
function markSvg(size: number): SVGSVGElement {
  const svg = document.createElementNS(SVG_NS, 'svg')
  svg.setAttribute('viewBox', '0 0 128 128')
  svg.setAttribute('width', String(size))
  svg.setAttribute('height', String(size))
  svg.setAttribute('aria-hidden', 'true')

  const group = document.createElementNS(SVG_NS, 'g')
  group.setAttribute('stroke', 'currentColor')
  group.setAttribute('stroke-width', '11')
  group.setAttribute('stroke-linecap', 'round')

  for (const d of ['M44 42h40', 'M36 64h56', 'M44 86h40']) {
    const path = document.createElementNS(SVG_NS, 'path')
    path.setAttribute('d', d)
    group.append(path)
  }

  svg.append(group)
  return svg
}

export function showRestoreButton(onRestore: () => void) {
  if (document.getElementById(HOST_ID)) return

  const host = document.createElement('div')
  host.id = HOST_ID
  const shadow = host.attachShadow({ mode: 'open' })

  const style = document.createElement('style')
  style.textContent = CSS

  const button = document.createElement('button')
  button.type = 'button'
  button.className = 'fab'
  button.title = 'Put the mask back on'
  button.setAttribute('aria-label', 'Return to HaikuMail')

  const icon = document.createElement('span')
  icon.className = 'icon'
  icon.append(markSvg(22))

  const label = document.createElement('span')
  label.className = 'label'
  label.textContent = 'Back to HaikuMail'

  button.append(icon, label)
  button.addEventListener('click', onRestore)
  shadow.append(style, button)
  document.documentElement.append(host)
}

export function hideRestoreButton() {
  document.getElementById(HOST_ID)?.remove()
}
